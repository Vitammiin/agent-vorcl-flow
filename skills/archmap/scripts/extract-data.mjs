#!/usr/bin/env node
// archmap extract-data.mjs — фаза 1: слой данных.
// Prisma / SQL DDL / Drizzle / TypeORM / Mongoose → table/enum-узлы (колонки в meta) + fk-рёбра;
// redis / очереди (bullmq/bull) / vector-базы → store-узлы. Каждый узел и ребро несут source:{file,line}.
// Использование: node extract-data.mjs --root <target> --plan <plan.json> --out <data.part.json>

import path from 'node:path'
import {
  parseArgs, readText, lineOfIndex, makeNode, makeEdge, partFile, writeJson, loadPlan,
} from './lib/core.mjs'
import { loadTypeScript, parseSource, lineOf, matchAll } from './lib/ts.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  plan: { flag: '--plan', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.plan || !args.out) {
  console.log('Usage: node extract-data.mjs --root <target> --plan <plan.json> --out <data.part.json>')
  process.exit(args.help ? 0 : 1)
}
const root = path.resolve(args.root)
const plan = loadPlan(args.plan)
const detected = new Set(plan.stacks.detected ?? [])

const DATA_STACKS = ['prisma', 'sql-migrations', 'drizzle', 'typeorm', 'mongoose', 'redis', 'queue', 'vector']
if (!DATA_STACKS.some((stack) => detected.has(stack))) {
  writeJson(args.out, partFile({ part: 'data', root, nodes: [], edges: [] }))
  console.log(`archmap extract-data: no data stacks detected → ${args.out}`)
  process.exit(0)
}

// ── Аккумуляторы: Map по id — дедуп внутри part-файла, первый источник выигрывает ──
const nodes = new Map()
const edges = new Map()
const addNode = (node) => { if (!nodes.has(node.id)) nodes.set(node.id, node); return nodes.get(node.id) }
const addEdge = (edge) => { if (!edges.has(edge.id)) edges.set(edge.id, edge) }
const tableId = (name) => `table:${name}`

function column({ name, type, line, pk = false, unique = false, nullable = false, fk = null }) {
  const col = { name, type }
  if (pk) col.pk = true
  if (unique) col.unique = true
  if (nullable) col.nullable = true
  if (fk) col.fk = fk
  col.line = line
  return col
}

// ── Лексические помощники: строки, сбалансированные скобки, top-level запятые ──

function skipString(text, start) {
  const quote = text[start]
  for (let index = start + 1; index < text.length; index++) {
    if (text[index] === '\\') { index++; continue }
    if (text[index] === quote) return index
  }
  return text.length
}

function balancedSlice(text, openIndex) {
  // openIndex указывает на '(' или '{'; возвращает { body, end } без внешних скобок
  const open = text[openIndex]
  const close = open === '(' ? ')' : '}'
  let depth = 0
  for (let index = openIndex; index < text.length; index++) {
    const char = text[index]
    if (char === '\'' || char === '"' || char === '`') { index = skipString(text, index); continue }
    if (char === open) depth++
    else if (char === close) {
      depth--
      if (!depth) return { body: text.slice(openIndex + 1, index), end: index }
    }
  }
  return null
}

function splitTopLevel(body) {
  const parts = []
  let depth = 0
  let start = 0
  for (let index = 0; index < body.length; index++) {
    const char = body[index]
    if (char === '\'' || char === '"' || char === '`') { index = skipString(body, index); continue }
    if (char === '(' || char === '{' || char === '[') depth++
    else if (char === ')' || char === '}' || char === ']') depth--
    else if (char === ',' && depth === 0) {
      parts.push({ text: body.slice(start, index), offset: start })
      start = index + 1
    }
  }
  parts.push({ text: body.slice(start), offset: start })
  return parts.filter((part) => part.text.trim())
}

// ═══════════════════════════════ 1. PRISMA ═══════════════════════════════════

function parsePrismaSchema(text) {
  const lines = text.split('\n')
  const models = []
  const enums = []
  let current = null
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index].replace(/\/\/.*$/, '').trim()
    if (!current) {
      const open = line.match(/^(model|enum)\s+(\w+)\s*\{/)
      if (open) current = { kind: open[1], name: open[2], line: index + 1, fields: [], values: [], blockAttrs: [] }
      continue
    }
    if (line === '}') {
      ;(current.kind === 'model' ? models : enums).push(current)
      current = null
      continue
    }
    if (!line) continue
    if (current.kind === 'enum') {
      const value = line.match(/^(\w+)/)
      if (value) current.values.push(value[1])
      continue
    }
    if (line.startsWith('@@')) {
      const attr = line.match(/^@@(\w+)\s*\(([^)]*)\)/)
      if (attr) current.blockAttrs.push({ name: attr[1], args: attr[2], line: index + 1 })
      continue
    }
    const field = line.match(/^(\w+)\s+(\w+)(\[\])?(\?)?\s*(.*)$/)
    if (field) {
      current.fields.push({
        name: field[1], type: field[2], isList: Boolean(field[3]),
        optional: Boolean(field[4]), attrs: field[5] ?? '', line: index + 1,
      })
    }
  }
  return { models, enums }
}

function listArgs(args) {
  const bracket = args.match(/\[([^\]]*)\]/)
  return (bracket ? bracket[1] : args).split(',').map((item) => item.trim().replace(/['"]/g, '')).filter(Boolean)
}

function parseRelation(attrs) {
  const rel = attrs.match(/@relation\s*\(([^)]*)\)/)
  if (!rel) return null
  const args = rel[1]
  const fields = args.match(/fields:\s*\[([^\]]*)\]/)
  const references = args.match(/references:\s*\[([^\]]*)\]/)
  return {
    name: args.match(/^\s*['"]([^'"]+)['"]/)?.[1] ?? args.match(/name:\s*['"]([^'"]+)['"]/)?.[1] ?? null,
    fields: fields ? fields[1].split(',').map((item) => item.trim()).filter(Boolean) : [],
    references: references ? references[1].split(',').map((item) => item.trim()).filter(Boolean) : [],
  }
}

function extractPrisma(file, text) {
  const { models, enums } = parsePrismaSchema(text)
  const modelNames = new Set(models.map((model) => model.name))
  const byName = new Map(models.map((model) => [model.name, model]))

  for (const item of enums) {
    addNode(makeNode({
      id: `enum:${item.name}`, kind: 'enum', layer: 'data', label: item.name,
      source: { file, line: item.line }, meta: { orm: 'prisma', values: item.values },
    }))
  }

  const uniqueColsOf = (model) => {
    const singles = new Set(model.fields.filter((field) => /@unique\b/.test(field.attrs)).map((field) => field.name))
    for (const attr of model.blockAttrs) {
      if (attr.name !== 'unique') continue
      const cols = listArgs(attr.args)
      if (cols.length === 1) singles.add(cols[0])
    }
    return singles
  }

  for (const model of models) {
    const idCols = listArgs(model.blockAttrs.find((attr) => attr.name === 'id')?.args ?? '')
    const uniques = uniqueColsOf(model)
    const fkByColumn = new Map()
    for (const field of model.fields) {
      const rel = modelNames.has(field.type) ? parseRelation(field.attrs) : null
      if (!rel?.fields.length) continue
      rel.fields.forEach((fkCol, pairIndex) => {
        fkByColumn.set(fkCol, { table: field.type, column: rel.references[pairIndex] ?? rel.references[0] ?? 'id' })
      })
    }
    const columns = []
    for (const field of model.fields) {
      if (modelNames.has(field.type)) continue
      columns.push(column({
        name: field.name,
        type: field.isList ? `${field.type}[]` : field.type,
        line: field.line,
        pk: /@id\b/.test(field.attrs) || idCols.includes(field.name),
        unique: /@unique\b/.test(field.attrs) || uniques.has(field.name),
        nullable: field.optional,
        fk: fkByColumn.get(field.name) ?? null,
      }))
    }
    const indexes = []
    for (const attr of model.blockAttrs) {
      if (attr.name === 'index') indexes.push({ columns: listArgs(attr.args), unique: false, line: attr.line })
      else if (attr.name === 'unique') indexes.push({ columns: listArgs(attr.args), unique: true, line: attr.line })
    }
    addNode(makeNode({
      id: tableId(model.name), kind: 'table', layer: 'data', label: model.name,
      source: { file, line: model.line }, meta: { orm: 'prisma', columns, indexes },
    }))
  }

  // Рёбра: владеющая сторона @relation(fields/references) + implicit N:M
  const m2mEmitted = new Set()
  for (const model of models) {
    for (const field of model.fields) {
      if (!modelNames.has(field.type)) continue
      const rel = parseRelation(field.attrs)
      const other = byName.get(field.type)
      const opposite = other?.fields.find((candidate) => candidate.type === model.name && candidate !== field)
      if (rel?.fields.length) {
        const uniques = uniqueColsOf(model)
        const oneToOne = !opposite?.isList
          && (rel.fields.every((fkCol) => uniques.has(fkCol)) || /@unique\b/.test(field.attrs))
        addEdge(makeEdge({
          kind: 'fk', from: tableId(model.name), to: tableId(field.type),
          source: { file, line: field.line }, meta: { cardinality: opposite?.isList || !oneToOne ? 'N:1' : '1:1' },
        }))
      } else if (field.isList && opposite?.isList && !parseRelation(opposite.attrs)?.fields.length) {
        const key = [model.name, field.type].sort().join('|') + ':' + (rel?.name ?? '')
        if (!m2mEmitted.has(key)) {
          m2mEmitted.add(key)
          addEdge(makeEdge({
            kind: 'fk', from: tableId(model.name), to: tableId(field.type),
            source: { file, line: field.line }, meta: { cardinality: 'N:M' },
          }))
        }
      }
    }
  }

  // Явная join-модель: ровно 2 владеющих relation-поля + составной @@id/@@unique по обоим fk
  for (const model of models) {
    const owning = model.fields
      .map((field) => ({ field, rel: modelNames.has(field.type) ? parseRelation(field.attrs) : null }))
      .filter((entry) => entry.rel?.fields.length)
    if (owning.length !== 2) continue
    if (owning.some((entry) => entry.field.type === model.name)) continue
    const fkCols = owning.flatMap((entry) => entry.rel.fields)
    const covered = model.blockAttrs.some((attr) =>
      (attr.name === 'id' || attr.name === 'unique') && fkCols.every((col) => listArgs(attr.args).includes(col)))
    if (!covered) continue
    const [from, to] = [owning[0].field.type, owning[1].field.type].sort()
    addEdge(makeEdge({
      kind: 'fk', from: tableId(from), to: tableId(to),
      source: { file, line: model.line }, meta: { cardinality: 'N:M', through: model.name },
    }))
  }
}

// ═══════════════════════════════ 2. SQL DDL ══════════════════════════════════

function stripSqlComments(text) {
  return text
    .replace(/--[^\n]*/g, (comment) => ' '.repeat(comment.length))
    .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
}

function normalizeSqlName(raw) {
  const last = raw.trim().split('.').pop()
  return last.replace(/^["'`[]+|["'`\]]+$/g, '')
}

const splitNames = (raw) => raw.split(',').map((item) => normalizeSqlName(item)).filter(Boolean)
const SQL_CONSTRAINT_RE = /^(PRIMARY\s+KEY|FOREIGN\s+KEY|UNIQUE\s*\(|CONSTRAINT\b|CHECK\s*[(\b]|EXCLUDE\b|LIKE\b|KEY\b|INDEX\b)/i
const SQL_NAME = '("[^"]+"|`[^`]+`|[A-Za-z_][\\w.$]*)'

function parseSqlColumnDef(text, line) {
  const def = text.trim().match(/^("[^"]+"|`[^`]+`|\[[^\]]+\]|[A-Za-z_][\w$]*)\s+([\s\S]+)$/)
  if (!def) return null
  const rest = def[2]
  const typeMatch = rest.match(/^([A-Za-z_]+(?:\s+(?:varying|precision|with(?:out)?\s+time\s+zone))?(?:\s*\([^)]*\))?(?:\[\])?)/i)
  const pk = /PRIMARY\s+KEY/i.test(rest)
  const ref = rest.match(new RegExp(`REFERENCES\\s+${SQL_NAME}\\s*(?:\\(\\s*${SQL_NAME}\\s*\\))?`, 'i'))
  return column({
    name: normalizeSqlName(def[1]),
    type: (typeMatch?.[1] ?? rest.split(/\s+/)[0]).replace(/\s+/g, ' ').toLowerCase(),
    line,
    pk,
    unique: /\bUNIQUE\b/i.test(rest),
    nullable: !pk && !/NOT\s+NULL/i.test(rest),
    fk: ref ? { table: normalizeSqlName(ref[1]), column: ref[2] ? normalizeSqlName(ref[2]) : 'id' } : null,
  })
}

function applySqlTableConstraint(text, columns, indexes, line) {
  let constraint = text.trim()
  const named = constraint.match(/^CONSTRAINT\s+(?:"[^"]+"|`[^`]+`|\S+)\s+([\s\S]+)/i)
  if (named) constraint = named[1]
  let matched
  if ((matched = constraint.match(/^PRIMARY\s+KEY\s*\(([^)]*)\)/i))) {
    for (const name of splitNames(matched[1])) {
      const col = columns.find((candidate) => candidate.name === name)
      if (col) { col.pk = true; delete col.nullable }
    }
  } else if ((matched = constraint.match(new RegExp(`^FOREIGN\\s+KEY\\s*\\(([^)]*)\\)\\s*REFERENCES\\s+${SQL_NAME}\\s*(?:\\(([^)]*)\\))?`, 'i')))) {
    const local = splitNames(matched[1])
    const remote = matched[3] ? splitNames(matched[3]) : []
    const table = normalizeSqlName(matched[2])
    local.forEach((name, pairIndex) => {
      const col = columns.find((candidate) => candidate.name === name)
      if (col) col.fk = { table, column: remote[pairIndex] ?? 'id' }
    })
    return { table, columns: local }
  } else if ((matched = constraint.match(/^UNIQUE\s*\(([^)]*)\)/i))) {
    const names = splitNames(matched[1])
    if (names.length === 1) {
      const col = columns.find((candidate) => candidate.name === names[0])
      if (col) col.unique = true
    }
    indexes.push({ columns: names, unique: true, line })
  }
  return null
}

function emitSqlFkEdges(file, name, columns) {
  for (const col of columns) {
    if (!col.fk) continue
    addEdge(makeEdge({
      kind: 'fk', from: tableId(name), to: tableId(col.fk.table),
      source: { file, line: col.line }, meta: { cardinality: col.unique || col.pk ? '1:1' : 'N:1' },
    }))
  }
}

function extractSql(file, text) {
  const clean = stripSqlComments(text)

  for (const { match, index } of matchAll(new RegExp(`CREATE\\s+TYPE\\s+${SQL_NAME}\\s+AS\\s+ENUM\\s*\\(`, 'gi'), clean)) {
    const sliced = balancedSlice(clean, index + match[0].length - 1)
    if (!sliced) continue
    const values = [...sliced.body.matchAll(/'([^']*)'/g)].map((value) => value[1])
    addNode(makeNode({
      id: `enum:${normalizeSqlName(match[1])}`, kind: 'enum', layer: 'data', label: normalizeSqlName(match[1]),
      source: { file, line: lineOfIndex(clean, index) }, meta: { orm: 'sql', values },
    }))
  }

  for (const { match, index } of matchAll(new RegExp(`CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${SQL_NAME}\\s*\\(`, 'gi'), clean)) {
    const name = normalizeSqlName(match[1])
    if (nodes.has(tableId(name))) continue // первый CREATE (или Prisma) задаёт source
    const openIndex = index + match[0].length - 1
    const sliced = balancedSlice(clean, openIndex)
    if (!sliced) continue
    const columns = []
    const indexes = []
    for (const part of splitTopLevel(sliced.body)) {
      const leading = part.text.match(/^\s*/)[0].length
      const line = lineOfIndex(clean, openIndex + 1 + part.offset + leading)
      if (SQL_CONSTRAINT_RE.test(part.text.trim())) applySqlTableConstraint(part.text, columns, indexes, line)
      else {
        const col = parseSqlColumnDef(part.text, line)
        if (col) columns.push(col)
      }
    }
    addNode(makeNode({
      id: tableId(name), kind: 'table', layer: 'data', label: name,
      source: { file, line: lineOfIndex(clean, index) }, meta: { orm: 'sql', columns, indexes },
    }))
    emitSqlFkEdges(file, name, columns)
  }

  for (const { match, index } of matchAll(new RegExp(`ALTER\\s+TABLE\\s+(?:IF\\s+EXISTS\\s+)?(?:ONLY\\s+)?${SQL_NAME}\\s+ADD\\s+([\\s\\S]+?)(?=;|$)`, 'gi'), clean)) {
    const node = nodes.get(tableId(normalizeSqlName(match[1])))
    if (!node || node.meta.orm !== 'sql') continue
    const line = lineOfIndex(clean, index)
    let rest = match[2].trim()
    if (SQL_CONSTRAINT_RE.test(rest)) {
      const fk = applySqlTableConstraint(rest, node.meta.columns, node.meta.indexes, line)
      if (fk) emitSqlFkEdges(file, node.label, node.meta.columns.filter((col) => fk.columns.includes(col.name)))
      continue
    }
    rest = rest.replace(/^COLUMN\s+/i, '').replace(/^IF\s+NOT\s+EXISTS\s+/i, '')
    const col = parseSqlColumnDef(rest, line)
    if (col && !node.meta.columns.some((existing) => existing.name === col.name)) {
      node.meta.columns.push(col)
      if (col.fk) emitSqlFkEdges(file, node.label, [col])
    }
  }

  for (const { match, index } of matchAll(new RegExp(`CREATE\\s+(UNIQUE\\s+)?INDEX\\s+(?:CONCURRENTLY\\s+)?(?:IF\\s+NOT\\s+EXISTS\\s+)?${SQL_NAME}\\s+ON\\s+(?:ONLY\\s+)?${SQL_NAME}(?:\\s+USING\\s+\\S+)?\\s*\\(([^)]*)\\)`, 'gi'), clean)) {
    const node = nodes.get(tableId(normalizeSqlName(match[3])))
    if (!node) continue
    const name = normalizeSqlName(match[2])
    node.meta.indexes ??= []
    if (!node.meta.indexes.some((existing) => existing.name === name)) {
      node.meta.indexes.push({
        name, columns: splitNames(match[4]), unique: Boolean(match[1]), line: lineOfIndex(clean, index),
      })
    }
  }
}

// ═══════════════════════════════ 3. DRIZZLE ══════════════════════════════════

const DRIZZLE_TABLE_FNS = ['pgTable', 'mysqlTable', 'sqliteTable']

function parseDrizzleRegex(file, text) {
  const tables = []
  for (const { match, index } of matchAll(/(?:export\s+)?const\s+(\w+)\s*=\s*(pgTable|mysqlTable|sqliteTable)\s*\(\s*['"]([^'"]+)['"]\s*,\s*\{/g, text)) {
    const openIndex = index + match[0].length - 1
    const sliced = balancedSlice(text, openIndex)
    if (!sliced) continue
    const columns = []
    for (const part of splitTopLevel(sliced.body)) {
      const entry = part.text.match(/^\s*(\w+)\s*:\s*([\s\S]+)$/)
      if (!entry) continue
      const chain = entry[2]
      const base = chain.match(/^(\w+)\s*(?:\.\w+)?\s*\(\s*(?:['"]([^'"]+)['"])?/)
      if (!base) continue
      const leading = part.text.match(/^\s*/)[0].length
      const ref = chain.match(/\.references\s*\(\s*\(\s*\)\s*=>\s*(\w+)\.(\w+)/)
      columns.push({
        key: entry[1], name: base[2] ?? entry[1], type: base[1],
        pk: /\.primaryKey\s*\(/.test(chain),
        notNull: /\.notNull\s*\(/.test(chain),
        unique: /\.unique\s*\(/.test(chain),
        ref: ref ? { table: ref[1], column: ref[2] } : null,
        line: lineOfIndex(text, openIndex + 1 + part.offset + leading),
      })
    }
    tables.push({ varName: match[1], tableName: match[3], file, line: lineOfIndex(text, index), columns })
  }
  return tables
}

function parseDrizzleChain(ts, expr) {
  const methods = new Set()
  let ref = null
  let current = expr
  while (current && ts.isCallExpression(current)) {
    const callee = current.expression
    if (ts.isPropertyAccessExpression(callee)) {
      methods.add(callee.name.text)
      if (callee.name.text === 'references' && current.arguments.length && ts.isArrowFunction(current.arguments[0])) {
        const body = current.arguments[0].body
        if (ts.isPropertyAccessExpression(body) && ts.isIdentifier(body.expression)) {
          ref = { table: body.expression.text, column: body.name.text }
        }
      }
      current = callee.expression
    } else if (ts.isIdentifier(callee)) {
      const nameArg = current.arguments.length && ts.isStringLiteralLike(current.arguments[0]) ? current.arguments[0].text : null
      return { type: callee.text, name: nameArg, methods, ref }
    } else return null
  }
  return null
}

function parseDrizzleAst(ts, file, text) {
  const sourceFile = parseSource(ts, file, text)
  const tables = []
  const visit = (node) => {
    if (ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer)) {
      const call = node.initializer
      const callee = call.expression
      const fnName = ts.isIdentifier(callee) ? callee.text
        : ts.isPropertyAccessExpression(callee) ? callee.name.text : null
      if (DRIZZLE_TABLE_FNS.includes(fnName) && call.arguments.length >= 2
        && ts.isStringLiteralLike(call.arguments[0]) && ts.isObjectLiteralExpression(call.arguments[1])) {
        const columns = []
        for (const prop of call.arguments[1].properties) {
          if (!ts.isPropertyAssignment(prop)) continue
          const key = ts.isIdentifier(prop.name) || ts.isStringLiteralLike(prop.name) ? prop.name.text : null
          const parsed = key ? parseDrizzleChain(ts, prop.initializer) : null
          if (!parsed) continue
          columns.push({
            key, name: parsed.name ?? key, type: parsed.type,
            pk: parsed.methods.has('primaryKey'), notNull: parsed.methods.has('notNull'),
            unique: parsed.methods.has('unique'), ref: parsed.ref, line: lineOf(sourceFile, prop),
          })
        }
        tables.push({ varName: node.name.getText(sourceFile), tableName: call.arguments[0].text, file, line: lineOf(sourceFile, node), columns })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return tables
}

function emitDrizzleTables(tables, parserMode) {
  const varToTable = new Map(tables.map((table) => [table.varName, table.tableName]))
  for (const table of tables) {
    const columns = table.columns.map((col) => column({
      name: col.name, type: col.type, line: col.line,
      pk: col.pk, unique: col.unique, nullable: !col.notNull && !col.pk,
      fk: col.ref ? { table: varToTable.get(col.ref.table) ?? col.ref.table, column: col.ref.column } : null,
    }))
    const meta = { orm: 'drizzle', columns, indexes: [] }
    if (parserMode === 'regex') meta.parser = 'regex'
    addNode(makeNode({
      id: tableId(table.tableName), kind: 'table', layer: 'data', label: table.tableName,
      source: { file: table.file, line: table.line }, meta,
    }))
    for (const col of columns) {
      if (!col.fk) continue
      addEdge(makeEdge({
        kind: 'fk', from: tableId(table.tableName), to: tableId(col.fk.table),
        source: { file: table.file, line: col.line }, meta: { cardinality: col.unique || col.pk ? '1:1' : 'N:1' },
      }))
    }
  }
}

// ═══════════════════════════════ 4. TYPEORM ══════════════════════════════════

const TYPEORM_DECORATOR_RE = /@(\w+)\s*(?:\(((?:[^()]|\([^()]*\))*)\))?/g
const TYPEORM_MEMBER_RE = /((?:@\w+\s*(?:\((?:[^()]|\([^()]*\))*\))?\s*)+)([A-Za-z_]\w*)\s*[!?]?\s*:\s*([^;=\n]+)/g
const TYPEORM_CARDINALITY = { ManyToOne: 'N:1', OneToMany: '1:N', OneToOne: '1:1', ManyToMany: 'N:M' }

function parseTypeormEntities(file, text) {
  const entities = []
  for (const { match, index } of matchAll(/@Entity\s*\(\s*(?:['"]([^'"]+)['"])?[^)]*\)\s*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+(\w+)/g, text)) {
    const openBrace = text.indexOf('{', index + match[0].length)
    if (openBrace === -1) continue
    const sliced = balancedSlice(text, openBrace)
    if (!sliced) continue
    const entity = {
      className: match[2], tableName: match[1] ?? match[2], file,
      line: lineOfIndex(text, index), columns: [], relations: [],
    }
    for (const { match: member, index: memberIndex } of matchAll(TYPEORM_MEMBER_RE, sliced.body)) {
      const decorators = {}
      for (const { match: decorator } of matchAll(TYPEORM_DECORATOR_RE, member[1])) decorators[decorator[1]] = decorator[2] ?? ''
      const line = lineOfIndex(text, openBrace + 1 + memberIndex)
      const tsType = member[3].trim()
      if ('PrimaryGeneratedColumn' in decorators || 'PrimaryColumn' in decorators) {
        const decoratorArgs = decorators.PrimaryGeneratedColumn ?? decorators.PrimaryColumn
        entity.columns.push(column({
          name: member[2], type: decoratorArgs.match(/^\s*['"](\w+)['"]/)?.[1] ?? tsType, line, pk: true,
        }))
      } else if ('Column' in decorators) {
        const decoratorArgs = decorators.Column
        entity.columns.push(column({
          name: member[2],
          type: decoratorArgs.match(/^\s*['"](\w+)['"]/)?.[1] ?? decoratorArgs.match(/type\s*:\s*['"](\w+)['"]/)?.[1] ?? tsType,
          line,
          nullable: /nullable\s*:\s*true/.test(decoratorArgs),
          unique: /unique\s*:\s*true/.test(decoratorArgs),
        }))
      }
      for (const relKind of Object.keys(TYPEORM_CARDINALITY)) {
        if (!(relKind in decorators)) continue
        const target = decorators[relKind].match(/=>\s*(\w+)/)?.[1]
        if (!target) continue
        entity.relations.push({
          kind: relKind, target, line,
          hasJoinTable: 'JoinTable' in decorators,
          through: decorators.JoinTable?.match(/name\s*:\s*['"]([^'"]+)['"]/)?.[1] ?? null,
        })
      }
    }
    entities.push(entity)
  }
  return entities
}

function emitTypeormEntities(entities) {
  const classToTable = new Map(entities.map((entity) => [entity.className, entity.tableName]))
  for (const entity of entities) {
    addNode(makeNode({
      id: tableId(entity.tableName), kind: 'table', layer: 'data', label: entity.tableName,
      source: { file: entity.file, line: entity.line },
      meta: { orm: 'typeorm', columns: entity.columns, indexes: [] },
    }))
  }
  const m2mEmitted = new Set()
  for (const owningPass of [true, false]) {
    for (const entity of entities) {
      for (const rel of entity.relations) {
        const to = classToTable.get(rel.target) ?? rel.target
        if (rel.kind === 'ManyToMany') {
          if (rel.hasJoinTable !== owningPass) continue
          const key = [entity.tableName, to].sort().join('|')
          if (m2mEmitted.has(key)) continue
          m2mEmitted.add(key)
          const meta = { cardinality: 'N:M' }
          if (rel.through) meta.through = rel.through
          addEdge(makeEdge({
            kind: 'fk', from: tableId(entity.tableName), to: tableId(to),
            source: { file: entity.file, line: rel.line }, meta,
          }))
        } else if (owningPass) {
          addEdge(makeEdge({
            kind: 'fk', from: tableId(entity.tableName), to: tableId(to),
            source: { file: entity.file, line: rel.line }, meta: { cardinality: TYPEORM_CARDINALITY[rel.kind] },
          }))
        }
      }
    }
  }
}

// ═══════════════════════════════ 5. MONGOOSE ═════════════════════════════════

const mongooseType = (raw) => raw.split('.').pop().replace(/[^\w[\]]/g, '') || 'Mixed'

function parseMongooseValue(value) {
  let text = value.trim()
  let isArray = false
  if (text.startsWith('[')) {
    isArray = true
    text = text.slice(1, text.lastIndexOf(']') === -1 ? undefined : text.lastIndexOf(']')).trim()
  }
  const result = { type: 'Mixed', required: false, unique: false, ref: null }
  if (text.startsWith('{')) {
    result.type = mongooseType(text.match(/(?:^|[{,\s])type\s*:\s*([\w.$]+)/)?.[1] ?? 'Object')
    result.required = /required\s*:\s*true/.test(text)
    result.unique = /unique\s*:\s*true/.test(text)
    result.ref = text.match(/ref\s*:\s*['"](\w+)['"]/)?.[1] ?? null
  } else {
    result.type = mongooseType(text.match(/^[\w.$]+/)?.[0] ?? 'Mixed')
  }
  if (isArray) result.type = `${result.type}[]`
  return result
}

function extractMongoose(file, text) {
  const schemas = new Map() // varName → { line, columns, refs }
  for (const { match, index } of matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*new\s+(?:mongoose\.)?Schema\s*\(\s*\{/g, text)) {
    const openIndex = index + match[0].length - 1
    const sliced = balancedSlice(text, openIndex)
    if (!sliced) continue
    const columns = []
    const refs = []
    for (const part of splitTopLevel(sliced.body)) {
      const entry = part.text.match(/^\s*['"]?([\w$]+)['"]?\s*:\s*([\s\S]+)$/)
      if (!entry) continue
      const leading = part.text.match(/^\s*/)[0].length
      const line = lineOfIndex(text, openIndex + 1 + part.offset + leading)
      const parsed = parseMongooseValue(entry[2])
      columns.push(column({
        name: entry[1], type: parsed.type, line,
        unique: parsed.unique, nullable: !parsed.required,
        fk: parsed.ref ? { table: parsed.ref, column: '_id' } : null,
      }))
      if (parsed.ref) refs.push({ table: parsed.ref, line })
    }
    schemas.set(match[1], { line: lineOfIndex(text, index), columns, refs })
  }
  for (const { match } of matchAll(/(?:mongoose\.)?model\s*(?:<[^>]*>)?\s*\(\s*['"](\w+)['"]\s*,\s*(\w+)/g, text)) {
    const schema = schemas.get(match[2])
    if (!schema) continue
    addNode(makeNode({
      id: tableId(match[1]), kind: 'table', layer: 'data', label: match[1],
      source: { file, line: schema.line },
      meta: { orm: 'mongoose', columns: schema.columns, indexes: [] },
    }))
    for (const ref of schema.refs) {
      addEdge(makeEdge({
        kind: 'fk', from: tableId(match[1]), to: tableId(ref.table),
        source: { file, line: ref.line }, meta: { cardinality: 'N:1' },
      }))
    }
  }
}

// ═══════════════════════ Единый проход по code-файлам ════════════════════════

const needDrizzle = detected.has('drizzle')
const needTypeorm = detected.has('typeorm')
const needMongoose = detected.has('mongoose')
const needRedis = detected.has('redis')
const needQueue = detected.has('queue')

const texts = new Map()
const drizzleFiles = new Set(needDrizzle ? plan.files.drizzle ?? [] : [])
const typeormFiles = []
const mongooseFiles = []
let redisSource = null
const queueHits = []

if (needDrizzle || needTypeorm || needMongoose || needRedis || needQueue) {
  for (const file of plan.files.code ?? []) {
    if (file.endsWith('.d.ts')) continue
    const text = readText(path.join(root, file))
    if (!text) continue
    let keep = false
    if (needDrizzle && text.includes('drizzle-orm')) { drizzleFiles.add(file); keep = true }
    if (needTypeorm && /@Entity\s*\(/.test(text) && text.includes('typeorm')) { typeormFiles.push(file); keep = true }
    if (needMongoose && /new\s+(?:mongoose\.)?Schema\s*\(/.test(text)) { mongooseFiles.push(file); keep = true }
    if (needRedis && !redisSource) {
      const client = text.match(/new\s+Redis(?:\.Cluster)?\s*\(|createClient\s*\(/)
      if (client) redisSource = { file, line: lineOfIndex(text, client.index) }
    }
    if (needQueue) {
      for (const { match, index } of matchAll(/new\s+Queue(?:<[^>]*>)?\s*\(\s*['"`]([^'"`]+)['"`]/g, text)) {
        queueHits.push({ name: match[1], file, line: lineOfIndex(text, index) })
      }
    }
    if (keep) texts.set(file, text)
  }
}

function depSource(name) {
  for (const file of plan.files.packageJson ?? []) {
    const text = readText(path.join(root, file))
    if (!text) continue
    const index = text.indexOf(`"${name}"`)
    if (index !== -1) return { file, line: lineOfIndex(text, index) }
  }
  return null
}

// ── Запуск экстракторов в детерминированном порядке приоритета ──

if (detected.has('prisma')) {
  for (const file of plan.files.prisma ?? []) {
    const text = readText(path.join(root, file))
    if (text) extractPrisma(file, text)
  }
}

if (detected.has('sql-migrations') || (plan.files.sql ?? []).length) {
  for (const file of plan.files.sql ?? []) {
    const text = readText(path.join(root, file))
    if (text) extractSql(file, text)
  }
}

if (needDrizzle && drizzleFiles.size) {
  let tsRuntime = null
  if (plan.stacks.parser === 'ts') {
    const loaded = await loadTypeScript(root, ['', ...(plan.repo?.packages ?? []).map((pkg) => pkg.path)])
    if (loaded.mode === 'ts') tsRuntime = loaded.ts
  }
  const allTables = []
  for (const file of [...drizzleFiles].sort()) {
    const text = texts.get(file) ?? readText(path.join(root, file))
    if (!text) continue
    allTables.push(...(tsRuntime ? parseDrizzleAst(tsRuntime, file, text) : parseDrizzleRegex(file, text)))
  }
  emitDrizzleTables(allTables, tsRuntime ? 'ts' : 'regex')
}

if (needTypeorm && typeormFiles.length) {
  const entities = []
  for (const file of typeormFiles) entities.push(...parseTypeormEntities(file, texts.get(file)))
  emitTypeormEntities(entities)
}

if (needMongoose) {
  for (const file of mongooseFiles) extractMongoose(file, texts.get(file))
}

if (needRedis) {
  addNode(makeNode({
    id: 'store:redis:main', kind: 'store', layer: 'data', label: 'redis',
    source: redisSource ?? depSource('ioredis') ?? depSource('redis') ?? { file: 'package.json', line: 1 },
    meta: { storeKind: 'redis' },
  }))
}

if (needQueue) {
  if (queueHits.length) {
    for (const hit of queueHits) {
      addNode(makeNode({
        id: `store:queue:${hit.name}`, kind: 'store', layer: 'data', label: hit.name,
        source: { file: hit.file, line: hit.line }, meta: { storeKind: 'queue' },
      }))
    }
  } else {
    const source = depSource('bullmq') ?? depSource('bull') ?? depSource('bee-queue') ?? depSource('agenda')
    if (source) {
      addNode(makeNode({
        id: 'store:queue:main', kind: 'store', layer: 'data', label: 'queue',
        source, meta: { storeKind: 'queue' },
      }))
    }
  }
}

if (detected.has('vector')) {
  const dep = plan.stacks.evidence?.vector?.dep
  if (dep) {
    const name = dep.slice(0, dep.lastIndexOf('@'))
    const source = depSource(name)
    if (source) {
      addNode(makeNode({
        id: `store:vector:${name}`, kind: 'store', layer: 'data', label: name,
        source, meta: { storeKind: 'vector' },
      }))
    }
  }
}

// ── Выход ──

const nodeList = [...nodes.values()]
const edgeList = [...edges.values()]
const stats = {
  tables: nodeList.filter((node) => node.kind === 'table').length,
  enums: nodeList.filter((node) => node.kind === 'enum').length,
  stores: nodeList.filter((node) => node.kind === 'store').length,
  fk: edgeList.filter((edge) => edge.kind === 'fk').length,
}
writeJson(args.out, partFile({ part: 'data', root, nodes: nodeList, edges: edgeList, stats }))
console.log(`archmap extract-data: ${stats.tables} tables, ${stats.enums} enums, ${stats.stores} stores, ${stats.fk} fk → ${args.out}`)
