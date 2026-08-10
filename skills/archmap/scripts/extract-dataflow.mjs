#!/usr/bin/env node
// archmap extract-dataflow.mjs — фаза 1: направленные потоки работы с данными.
// Отвечает на вопрос «что откуда идёт»: какой модуль ЧИТАЕТ таблицу, а какой ПИШЕТ в неё.
// Извлекает только рёбра reads/writes от module:<файл> к table:<имя> для Drizzle, Prisma,
// Mongoose, TypeORM и сырого SQL. Узлы НЕ создаются: таблицы даёт extract-data,
// модули — extract-modules, поэтому каталог таблиц здесь ЗЕРКАЛИТ распознавание
// extract-data.mjs один в один (иначе merge наплодил бы stub-узлов на несуществующие id).
// Использование: node extract-dataflow.mjs --root <target> --plan <plan.json> --out <dataflow.part.json>

import path from 'node:path'
import {
  parseArgs, readText, makeEdge, partFile, writeJson, loadPlan,
} from './lib/core.mjs'
import { loadTypeScript, parseSource, matchAll, resolveImport } from './lib/ts.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  plan: { flag: '--plan', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.plan || !args.out) {
  console.log('Usage: node extract-dataflow.mjs --root <target> --plan <plan.json> --out <dataflow.part.json>')
  process.exit(args.help ? 0 : 1)
}
const root = path.resolve(args.root)
const plan = loadPlan(args.plan)
const detected = new Set(plan.stacks?.detected ?? [])
const codeFiles = (plan.files?.code ?? []).filter((file) => !file.endsWith('.d.ts'))
const sqlFiles = plan.files?.sql ?? []
const tsAliases = plan.tsAliases ?? {}

// Таблицы рождаются только из этих стеков — без них поток данных не к чему привязывать.
const DATA_STACKS = ['prisma', 'sql-migrations', 'drizzle', 'typeorm', 'mongoose']
if (!DATA_STACKS.some((stack) => detected.has(stack)) && !sqlFiles.length) {
  writeJson(args.out, partFile({ part: 'dataflow', root, nodes: [], edges: [] }))
  console.log(`archmap extract-dataflow: no data stacks detected → ${args.out}`)
  process.exit(0)
}

// ── Лексика: маскируем комментарии, строки и regex-литералы ──────────────────
// Без этого слово «update» в комментарии или `.find(` внутри строки давало бы
// ложные рёбра. Длина текста сохраняется (заменяем пробелами, \n не трогаем),
// поэтому индексы совпадают с исходником и номера строк остаются честными.

const REGEX_PREV_PUNCT = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '+', '-', '*', '%', '~', '^', '<', '>'])
const REGEX_PREV_WORDS = new Set(['return', 'typeof', 'instanceof', 'in', 'of', 'case', 'do', 'else', 'yield', 'await', 'new', 'delete', 'void', 'throw'])

function isRegexStart (text, index) {
  let cursor = index - 1
  while (cursor >= 0 && /\s/.test(text[cursor])) cursor--
  if (cursor < 0) return true
  const char = text[cursor]
  if (/[\w$]/.test(char)) {
    const end = cursor
    while (cursor >= 0 && /[\w$]/.test(text[cursor])) cursor--
    return REGEX_PREV_WORDS.has(text.slice(cursor + 1, end + 1))
  }
  return REGEX_PREV_PUNCT.has(char)
}

function skipQuoted (text, start) {
  const quote = text[start]
  for (let index = start + 1; index < text.length; index++) {
    if (text[index] === '\\') { index++; continue }
    if (text[index] === quote) return index
    // незакрытая кавычка (чаще всего апостроф в тексте) не должна съедать пол-файла
    if (text[index] === '\n') return start
  }
  return start
}

function skipBraces (text, openIndex) {
  let depth = 0
  for (let index = openIndex; index < text.length; index++) {
    const char = text[index]
    if (char === '\'' || char === '"') { index = skipQuoted(text, index); continue }
    if (char === '`') { index = skipTemplate(text, index); continue }
    if (char === '{') depth++
    else if (char === '}') { depth--; if (!depth) return index }
  }
  return text.length - 1
}

function skipTemplate (text, start) {
  for (let index = start + 1; index < text.length; index++) {
    const char = text[index]
    if (char === '\\') { index++; continue }
    if (char === '`') return index
    if (char === '$' && text[index + 1] === '{') index = skipBraces(text, index + 1)
  }
  return text.length - 1
}

function skipParens (text, openIndex) {
  let depth = 0
  for (let index = openIndex; index < text.length; index++) {
    if (text[index] === '(') depth++
    else if (text[index] === ')') { depth--; if (!depth) return index }
  }
  return -1
}

function skipRegexLiteral (text, start) {
  let inClass = false
  for (let index = start + 1; index < text.length; index++) {
    const char = text[index]
    if (char === '\\') { index++; continue }
    if (char === '\n') return start
    if (char === '[') inClass = true
    else if (char === ']') inClass = false
    else if (char === '/' && !inClass) return index
  }
  return start
}

function blankRanges (text, ranges) {
  if (!ranges.length) return text
  const chars = text.split('')
  for (const [start, end] of ranges) {
    for (let index = Math.max(0, start); index < end && index < chars.length; index++) {
      if (chars[index] !== '\n') chars[index] = ' '
    }
  }
  return chars.join('')
}

function viewsOf (text) {
  // bare — без комментариев (строки на месте: там живут импорты и SQL);
  // code — ещё и без строк (по нему ищем вызовы);
  // literals — содержимое строковых/шаблонных литералов (по ним ищем сырой SQL).
  const masked = []
  const literals = []
  let index = 0
  while (index < text.length) {
    const char = text[index]
    if (char === '/' && text[index + 1] === '/') {
      const end = text.indexOf('\n', index)
      masked.push([index, end === -1 ? text.length : end])
      index = end === -1 ? text.length : end
      continue
    }
    if (char === '/' && text[index + 1] === '*') {
      const end = text.indexOf('*/', index + 2)
      const stop = end === -1 ? text.length : end + 2
      masked.push([index, stop])
      index = stop
      continue
    }
    if (char === '\'' || char === '"' || char === '`') {
      const end = char === '`' ? skipTemplate(text, index) : skipQuoted(text, index)
      if (end <= index) { index++; continue }
      literals.push({ start: index, end, raw: text.slice(index + 1, end) })
      index = end + 1
      continue
    }
    if (char === '/' && isRegexStart(text, index)) {
      const end = skipRegexLiteral(text, index)
      if (end > index) { masked.push([index, end + 1]); index = end + 1; continue }
    }
    index++
  }
  const bare = blankRanges(text, masked)
  const code = blankRanges(bare, literals.map((literal) => [literal.start, literal.end + 1]))
  return { bare, code, literals }
}

function lineIndexer (text) {
  const offsets = []
  for (let index = 0; index < text.length; index++) if (text[index] === '\n') offsets.push(index)
  return (position) => {
    let low = 0
    let high = offsets.length
    while (low < high) {
      const mid = (low + high) >> 1
      if (offsets[mid] < position) low = mid + 1
      else high = mid
    }
    return low + 1
  }
}

// ── Каталог таблиц: точное зеркало extract-data.mjs ─────────────────────────
// tables — имена, для которых extract-data ГАРАНТИРОВАННО создаст узел table:<имя>.
// Ребро выпускается только к ним; всё остальное уходит в stats.skipped
// (диагностика «поток виден, но узла таблицы нет»), но не в граф.
//
// ВАЖНО: зеркало должно совпадать с extract-data вплоть до его ограничений —
// иначе merge получит ребро на несуществующий id и создаст stub. Поэтому ниже
// дословно повторены его lexer-помощники: apostrophe в комментарии («balance's»)
// рвёт balancedSlice, и таблица у extract-data не рождается — у нас тоже.
// Меняется распознавание в extract-data — правь этот блок тем же коммитом.

function dataSkipString (text, start) {
  const quote = text[start]
  for (let index = start + 1; index < text.length; index++) {
    if (text[index] === '\\') { index++; continue }
    if (text[index] === quote) return index
  }
  return text.length
}

function dataBalancedSlice (text, openIndex) {
  const open = text[openIndex]
  const close = open === '(' ? ')' : '}'
  let depth = 0
  for (let index = openIndex; index < text.length; index++) {
    const char = text[index]
    if (char === '\'' || char === '"' || char === '`') { index = dataSkipString(text, index); continue }
    if (char === open) depth++
    else if (char === close) {
      depth--
      if (!depth) return { body: text.slice(openIndex + 1, index), end: index }
    }
  }
  return null
}

const tables = new Set()
const tablesLower = new Map()
const prismaModels = new Map() // аксессор prisma-клиента (userProfile) → имя модели
const symbolsByFile = new Map() // файл → Map(имя символа → {table, orm})
const defaultExportByFile = new Map() // файл → {table, orm} | {alias}
const reExportsByFile = new Map() // файл → [спеки `export * from` / `export {x} from`]
const drizzleVarToTable = new Map() // имя переменной → имя таблицы (для db.query.<key>)
const drizzleVarAmbiguous = new Set()

function rememberTable (name) {
  if (!name) return
  tables.add(name)
  const lower = name.toLowerCase()
  if (tablesLower.has(lower) && tablesLower.get(lower) !== name) tablesLower.set(lower, null)
  else tablesLower.set(lower, name)
}

function rememberSymbol (file, name, table, orm) {
  if (!name || !table) return
  if (!symbolsByFile.has(file)) symbolsByFile.set(file, new Map())
  const scope = symbolsByFile.get(file)
  if (!scope.has(name)) scope.set(name, { table, orm })
}

const lowerFirst = (name) => name.charAt(0).toLowerCase() + name.slice(1)

// 1. Prisma: модели из schema.prisma именуются как в файле (table:User).
if (detected.has('prisma')) {
  for (const file of plan.files?.prisma ?? []) {
    const text = readText(path.join(root, file))
    if (!text) continue
    for (const { match } of matchAll(/^\s*model\s+(\w+)\s*\{/gm, text)) {
      rememberTable(match[1])
      prismaModels.set(lowerFirst(match[1]), match[1])
      prismaModels.set(match[1], match[1])
    }
  }
}

// 2. SQL DDL: имена из CREATE TABLE (extract-data строит узлы по тем же правилам).
const SQL_DDL_NAME = '("[^"]+"|`[^`]+`|\\[[^\\]]+\\]|[A-Za-z_][\\w.$]*)'
function normalizeSqlName (raw) {
  const last = String(raw).trim().split('.').pop()
  return last.replace(/^["'`[]+|["'`\]]+$/g, '')
}
if (detected.has('sql-migrations') || sqlFiles.length) {
  for (const file of sqlFiles) {
    const text = readText(path.join(root, file))
    if (!text) continue
    const clean = text
      .replace(/--[^\n]*/g, (comment) => ' '.repeat(comment.length))
      .replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '))
    for (const { match, index } of matchAll(new RegExp(`CREATE\\s+TABLE\\s+(?:IF\\s+NOT\\s+EXISTS\\s+)?${SQL_DDL_NAME}\\s*\\(`, 'gi'), clean)) {
      if (!dataBalancedSlice(clean, index + match[0].length - 1)) continue
      rememberTable(normalizeSqlName(match[1]))
    }
  }
}

// 3+4+5. Drizzle / TypeORM / Mongoose — разбираем сами code-файлы.
const DRIZZLE_TABLE_FNS = ['pgTable', 'mysqlTable', 'sqliteTable']
const needDrizzle = detected.has('drizzle')
const needTypeorm = detected.has('typeorm')
const needMongoose = detected.has('mongoose')
const drizzleFiles = new Set(needDrizzle ? plan.files?.drizzle ?? [] : [])

let tsRuntime = null
if (plan.stacks?.parser === 'ts') {
  const loaded = await loadTypeScript(root, ['', ...(plan.repo?.packages ?? []).map((pkg) => pkg.path)])
  if (loaded.mode === 'ts') tsRuntime = loaded.ts
}

function parseDrizzleTablesAst (file, text) {
  const sourceFile = parseSource(tsRuntime, file, text)
  const found = []
  const visit = (node) => {
    if (tsRuntime.isVariableDeclaration(node) && node.initializer && tsRuntime.isCallExpression(node.initializer)) {
      const call = node.initializer
      const callee = call.expression
      const fnName = tsRuntime.isIdentifier(callee) ? callee.text
        : tsRuntime.isPropertyAccessExpression(callee) ? callee.name.text : null
      if (DRIZZLE_TABLE_FNS.includes(fnName) && call.arguments.length >= 2
        && tsRuntime.isStringLiteralLike(call.arguments[0]) && tsRuntime.isObjectLiteralExpression(call.arguments[1])) {
        found.push({ varName: node.name.getText(sourceFile), tableName: call.arguments[0].text })
      }
    }
    tsRuntime.forEachChild(node, visit)
  }
  visit(sourceFile)
  return found
}

function parseDrizzleTablesRegex (text) {
  const found = []
  for (const { match, index } of matchAll(/(?:export\s+)?const\s+(\w+)\s*=\s*(?:pgTable|mysqlTable|sqliteTable)\s*\(\s*['"]([^'"]+)['"]\s*,\s*\{/g, text)) {
    if (!dataBalancedSlice(text, index + match[0].length - 1)) continue
    found.push({ varName: match[1], tableName: match[2] })
  }
  return found
}

// Regex-путь работает по сырому тексту — ровно как extract-data в fallback-режиме.
function parseDrizzleTables (file, text) {
  const found = tsRuntime ? parseDrizzleTablesAst(file, text) : parseDrizzleTablesRegex(text)
  for (const { varName, tableName } of found) {
    rememberTable(tableName)
    rememberSymbol(file, varName, tableName, 'drizzle')
    if (drizzleVarToTable.has(varName) && drizzleVarToTable.get(varName) !== tableName) drizzleVarAmbiguous.add(varName)
    else drizzleVarToTable.set(varName, tableName)
  }
  return found.length
}

const TYPEORM_ENTITY_RE = /@Entity\s*\(\s*(?:['"]([^'"]+)['"])?[^)]*\)\s*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+(\w+)/g
function parseTypeormEntities (file, text) {
  for (const { match, index } of matchAll(TYPEORM_ENTITY_RE, text)) {
    const openBrace = text.indexOf('{', index + match[0].length)
    if (openBrace === -1 || !dataBalancedSlice(text, openBrace)) continue
    const tableName = match[1] ?? match[2]
    rememberTable(tableName)
    rememberSymbol(file, match[2], tableName, 'typeorm')
  }
}

// extract-data видит схему только как `const X = new Schema({` (без дженериков и
// без аннотации типа) и только в одном файле с вызовом model(). Зеркалим ровно это:
// шире распознаём (widePattern) лишь ради диагностики stats.skipped.
const MONGOOSE_SCHEMA_NARROW = /(?:const|let|var)\s+(\w+)\s*=\s*new\s+(?:mongoose\.)?Schema\s*\(\s*\{/g
const MONGOOSE_SCHEMA_WIDE = /(?:const|let|var)\s+(\w+)\s*(?::[^=\n]*)?=\s*new\s+(?:mongoose\.)?Schema\s*(?:<[^>]*>)?\s*\(/g
const MONGOOSE_MODEL_DECL = /(?:export\s+)?(?:const|let|var)\s+(\w+)\s*(?::[^=]*?)?=\s*(?:[\w.]+\s*\|\|\s*)?(?:mongoose\.)?model\s*(?:<[^>]*>)?\s*\(\s*['"](\w+)['"]\s*,\s*(\w+)/g
const MONGOOSE_MODEL_ANY = /(?:mongoose\.)?model\s*(?:<[^>]*>)?\s*\(\s*['"](\w+)['"]\s*,\s*(\w+)/g
const MONGOOSE_DEFAULT_MODEL = /export\s+default\s+(?:[\w.]+\s*\|\|\s*)?(?:mongoose\.)?model\s*(?:<[^>]*>)?\s*\(\s*['"](\w+)['"]\s*,\s*(\w+)/g

function parseMongooseModels (file, text, bare) {
  // существование узла — по сырому тексту и правилам extract-data
  const narrow = new Set()
  for (const { match, index } of matchAll(MONGOOSE_SCHEMA_NARROW, text)) {
    if (dataBalancedSlice(text, index + match[0].length - 1)) narrow.add(match[1])
  }
  for (const { match } of matchAll(MONGOOSE_MODEL_ANY, text)) {
    if (narrow.has(match[2])) rememberTable(match[1])
  }
  // связь «переменная → модель» — по тексту без комментариев (закомментированный
  // код не должен давать символов), схема при этом может быть объявлена как угодно
  const wide = new Set([...matchAll(MONGOOSE_SCHEMA_WIDE, bare)].map(({ match }) => match[1]))
  for (const { match } of matchAll(MONGOOSE_MODEL_DECL, bare)) {
    if (wide.has(match[3])) rememberSymbol(file, match[1], match[2], 'mongoose')
  }
  for (const { match } of matchAll(MONGOOSE_DEFAULT_MODEL, bare)) {
    if (wide.has(match[2])) defaultExportByFile.set(file, { table: match[1], orm: 'mongoose' })
  }
}

const RE_EXPORT_ALL = /export\s*\*\s*(?:as\s+\w+\s*)?from\s*['"]([^'"]+)['"]/g
const RE_EXPORT_NAMED = /export\s*\{[^}]*\}\s*from\s*['"]([^'"]+)['"]/g
const DEFAULT_EXPORT_ALIAS = /export\s+default\s+(\w+)\s*;?\s*$/m

// Пробегаем по коду один раз, собирая каталог. Полную лексику включаем только для
// файлов-кандидатов — иначе платим маскировкой за весь репозиторий дважды.
for (const file of codeFiles) {
  const text = readText(path.join(root, file))
  if (!text) continue
  if (text.includes('export')) {
    const reExports = []
    for (const regex of [RE_EXPORT_ALL, RE_EXPORT_NAMED]) {
      for (const { match } of matchAll(regex, text)) reExports.push(match[1])
    }
    if (reExports.length) reExportsByFile.set(file, reExports)
  }
  // Условия входа зеркалят extract-data: тот разбирает только plan.files.drizzle
  // плюс файлы с упоминанием drizzle-orm, только @Entity-классы с импортом typeorm.
  const maybeDrizzle = needDrizzle && (drizzleFiles.has(file) || text.includes('drizzle-orm'))
    && DRIZZLE_TABLE_FNS.some((fn) => text.includes(fn))
  const maybeTypeorm = needTypeorm && text.includes('@Entity') && text.includes('typeorm')
  const maybeMongoose = needMongoose && /\bSchema\s*(?:<[^>]*>)?\s*\(/.test(text) && text.includes('model')
  if (!maybeDrizzle && !maybeTypeorm && !maybeMongoose) continue
  const { bare } = viewsOf(text)
  if (maybeDrizzle) parseDrizzleTables(file, text)
  if (maybeTypeorm) parseTypeormEntities(file, text)
  if (maybeMongoose) parseMongooseModels(file, text, bare)
  const alias = bare.match(DEFAULT_EXPORT_ALIAS)
  if (alias && !defaultExportByFile.has(file)) {
    const symbol = symbolsByFile.get(file)?.get(alias[1])
    if (symbol) defaultExportByFile.set(file, symbol)
  }
}

// ── Разрешение имён между файлами (импорты и ре-экспорты) ───────────────────

function lookupSymbol (file, name, depth = 0) {
  const direct = symbolsByFile.get(file)?.get(name)
  if (direct) return direct
  if (depth >= 3) return null
  for (const spec of reExportsByFile.get(file) ?? []) {
    const target = resolveImport(root, file, spec, tsAliases)
    if (!target) continue
    const found = lookupSymbol(target, name, depth + 1)
    if (found) return found
  }
  return null
}

function lookupDefault (file, depth = 0) {
  const direct = defaultExportByFile.get(file)
  if (direct) return direct
  if (depth >= 3) return null
  for (const spec of reExportsByFile.get(file) ?? []) {
    const target = resolveImport(root, file, spec, tsAliases)
    if (!target) continue
    const found = lookupDefault(target, depth + 1)
    if (found) return found
  }
  return null
}

const IMPORT_STATEMENT = /import\s+([\s\S]*?)\s*from\s*['"]([^'"]+)['"]/g
const REQUIRE_STATEMENT = /(?:const|let|var)\s+(\{[^}]*\}|\w+)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g

function bindingsOf (clause) {
  // → {defaultName, namespace, named: [[imported, local]]}
  const result = { defaultName: null, namespace: null, named: [] }
  let rest = clause.trim()
  if (/^type\b/.test(rest)) return result // `import type {...}` — типы не носят данные
  const namespace = rest.match(/\*\s+as\s+(\w+)/)
  if (namespace) result.namespace = namespace[1]
  const braces = rest.match(/\{([\s\S]*)\}/)
  if (braces) {
    for (const entry of braces[1].split(',')) {
      const parts = entry.trim().replace(/^type\s+/, '').split(/\s+as\s+/)
      if (!parts[0]) continue
      result.named.push([parts[0].trim(), (parts[1] ?? parts[0]).trim()])
    }
    rest = rest.slice(0, braces.index)
  }
  const defaultName = rest.match(/^(\w+)\s*(?:,|$)/)
  if (defaultName) result.defaultName = defaultName[1]
  return result
}

function buildScope (file, bare) {
  const symbols = new Map(symbolsByFile.get(file) ?? [])
  const namespaces = new Map()
  const bind = (local, symbol) => { if (symbol && !symbols.has(local)) symbols.set(local, symbol) }
  const consume = (clause, spec) => {
    const target = resolveImport(root, file, spec, tsAliases)
    if (!target) return
    const bindings = bindingsOf(clause)
    if (bindings.defaultName) bind(bindings.defaultName, lookupDefault(target))
    if (bindings.namespace) namespaces.set(bindings.namespace, target)
    for (const [imported, local] of bindings.named) {
      bind(local, imported === 'default' ? lookupDefault(target) : lookupSymbol(target, imported))
    }
  }
  for (const { match } of matchAll(IMPORT_STATEMENT, bare)) consume(match[1], match[2])
  for (const { match } of matchAll(REQUIRE_STATEMENT, bare)) {
    consume(match[1].startsWith('{') ? match[1] : `${match[1]},`, match[2])
  }
  return { symbols, namespaces }
}

// ── Операции по ORM ──────────────────────────────────────────────────────────

const PRISMA_READS = new Set(['findMany', 'findFirst', 'findFirstOrThrow', 'findUnique', 'findUniqueOrThrow', 'count', 'aggregate', 'groupBy'])
const PRISMA_WRITES = new Set(['create', 'createMany', 'createManyAndReturn', 'update', 'updateMany', 'upsert', 'delete', 'deleteMany'])
const PRISMA_CLIENTS = /^(prisma|prismaClient|db|dbClient|database|client|tx|trx|transaction)$/i

const MONGOOSE_READS = new Set(['find', 'findOne', 'findById', 'countDocuments', 'estimatedDocumentCount', 'count', 'aggregate', 'distinct', 'exists'])
const MONGOOSE_WRITES = new Set([
  'create', 'save', 'insertMany', 'updateOne', 'updateMany', 'replaceOne', 'deleteOne', 'deleteMany',
  'findOneAndUpdate', 'findOneAndReplace', 'findOneAndDelete', 'findByIdAndUpdate', 'findByIdAndDelete',
  'findOneAndRemove', 'findByIdAndRemove', 'bulkWrite',
])

const TYPEORM_READS = new Set(['find', 'findBy', 'findOne', 'findOneBy', 'findOneOrFail', 'findOneByOrFail', 'findAndCount', 'findAndCountBy', 'count', 'countBy', 'exist', 'existsBy', 'sum', 'average', 'maximum', 'minimum'])
const TYPEORM_WRITES = new Set(['save', 'insert', 'update', 'upsert', 'delete', 'remove', 'softDelete', 'softRemove', 'recover', 'restore', 'increment', 'decrement'])
const TYPEORM_MANAGER_OPS = new Map([
  ...[...TYPEORM_READS].map((op) => [op, 'reads']),
  ...[...TYPEORM_WRITES].map((op) => [op, 'writes']),
])

const DRIZZLE_OPS = { from: ['reads', 'select'], insert: ['writes', 'insert'], update: ['writes', 'update'], delete: ['writes', 'delete'] }

// ── Поиск обращений в одном файле ────────────────────────────────────────────

function analyzeFile (file, text) {
  const { bare, code, literals } = viewsOf(text)
  const scope = buildScope(file, bare)
  const hits = [] // {table, kind, op, orm, index}
  const push = (symbol, kind, op, index) => {
    if (!symbol?.table) return
    hits.push({ table: symbol.table, kind, op, orm: symbol.orm, index })
  }
  const resolveName = (name, property) => {
    if (property) {
      const target = scope.namespaces.get(name)
      return target ? lookupSymbol(target, property) : null
    }
    return scope.symbols.get(name) ?? null
  }

  // 1. Drizzle: аргумент-таблица — единственный надёжный признак, поэтому ребро
  // появляется, только если идентификатор реально разрешился в таблицу схемы.
  for (const { match, index } of matchAll(/\.\s*(from|insert|update|delete)\s*\(\s*([A-Za-z_$][\w$]*)\s*(?:\.\s*([A-Za-z_$][\w$]*)\s*)?[),]/g, code)) {
    const symbol = resolveName(match[2], match[3])
    if (symbol?.orm !== 'drizzle') continue
    const [kind, op] = DRIZZLE_OPS[match[1]]
    push(symbol, kind, op, index)
  }
  // Реляционный API: db.query.<ключ схемы>.findMany()
  for (const { match, index } of matchAll(/\.\s*query\s*\.\s*([A-Za-z_$][\w$]*)\s*\.\s*(findMany|findFirst)\s*\(/g, code)) {
    const name = match[1]
    const table = scope.symbols.get(name)?.orm === 'drizzle'
      ? scope.symbols.get(name).table
      : (drizzleVarAmbiguous.has(name) ? null : drizzleVarToTable.get(name))
    if (table) push({ table, orm: 'drizzle' }, 'reads', 'query', index)
  }

  // 2. Prisma: клиент.модель.метод() — модель обязана быть в schema.prisma.
  if (prismaModels.size) {
    for (const { match, index } of matchAll(/([A-Za-z_$][\w$]*)\s*\.\s*([A-Za-z_$][\w$]*)\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/g, code)) {
      if (!PRISMA_CLIENTS.test(match[1]) && !/(prisma|Client)$/.test(match[1])) continue
      const model = prismaModels.get(match[2])
      if (!model) continue
      const kind = PRISMA_READS.has(match[3]) ? 'reads' : PRISMA_WRITES.has(match[3]) ? 'writes' : null
      if (kind) push({ table: model, orm: 'prisma' }, kind, match[3], index)
    }
  }

  // Дальше работаем только с теми ORM, чьи символы реально попали в файл —
  // это и точность, и скорость: по большинству файлов проходов вообще не будет.
  const ormsInScope = new Set([...scope.symbols.values()].map((symbol) => symbol.orm))

  // 3. TypeORM: репозиторий получаем из getRepository/@InjectRepository/Repository<T>.
  const repositories = new Map()
  if (ormsInScope.has('typeorm')) {
    const bindRepository = (varName, entityName) => {
      const symbol = scope.symbols.get(entityName)
      if (symbol?.orm === 'typeorm' && varName) repositories.set(varName, symbol)
    }
    for (const { match } of matchAll(/(?:const|let|var)\s+(\w+)\s*(?::[^=]*?)?=\s*(?:await\s+)?[\w.]*getRepository\s*(?:<[^>]*>)?\s*\(\s*([A-Za-z_$][\w$]*)/g, code)) {
      bindRepository(match[1], match[2])
    }
    for (const { match } of matchAll(/@InjectRepository\s*\(\s*([A-Za-z_$][\w$]*)\s*\)[^)]*?\b(\w+)\s*[!?]?\s*:/g, code)) {
      bindRepository(match[2], match[1])
    }
    for (const { match } of matchAll(/(\w+)\s*[!?]?\s*:\s*Repository\s*<\s*([A-Za-z_$][\w$]*)\s*>/g, code)) {
      bindRepository(match[1], match[2])
    }
    for (const { match, index } of matchAll(/([A-Za-z_$][\w$]*)\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/g, code)) {
      const repository = repositories.get(match[1])
      if (!repository) continue
      const kind = TYPEORM_READS.has(match[2]) ? 'reads' : TYPEORM_WRITES.has(match[2]) ? 'writes' : null
      if (kind) push(repository, kind, match[2], index)
    }
    // getRepository(User).find(...) и manager.find(User, ...) — сущность прямо в вызове
    for (const { match, index } of matchAll(/getRepository\s*(?:<[^>]*>)?\s*\(\s*([A-Za-z_$][\w$]*)\s*\)\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/g, code)) {
      const symbol = scope.symbols.get(match[1])
      if (symbol?.orm !== 'typeorm') continue
      const kind = TYPEORM_READS.has(match[2]) ? 'reads' : TYPEORM_WRITES.has(match[2]) ? 'writes' : null
      if (kind) push(symbol, kind, match[2], index)
    }
    for (const { match, index } of matchAll(/\.\s*([A-Za-z_$][\w$]*)\s*\(\s*([A-Za-z_$][\w$]*)\s*,/g, code)) {
      const kind = TYPEORM_MANAGER_OPS.get(match[1])
      if (!kind) continue
      const symbol = scope.symbols.get(match[2])
      if (symbol?.orm === 'typeorm') push(symbol, kind, match[1], index)
    }
  }

  // 4. Mongoose: методы на переменной-модели + `new Model(...).save()`.
  if (ormsInScope.has('mongoose')) {
    for (const { match, index } of matchAll(/([A-Za-z_$][\w$]*)\s*\.\s*([A-Za-z_$][\w$]*)\s*\(/g, code)) {
      const symbol = scope.symbols.get(match[1])
      if (symbol?.orm !== 'mongoose') continue
      const kind = MONGOOSE_READS.has(match[2]) ? 'reads' : MONGOOSE_WRITES.has(match[2]) ? 'writes' : null
      if (kind) push(symbol, kind, match[2], index)
    }
    // `doc.save()` — запись, но только если doc доказуемо документ модели:
    // получен из `new Model(...)` или из чтения модели. Иначе .save() игнорируем.
    const documents = new Map()
    const bindDocument = (name, symbol) => {
      if (name && symbol?.orm === 'mongoose' && !documents.has(name)) documents.set(name, symbol)
    }
    for (const { match, index } of matchAll(/new\s+([A-Za-z_$][\w$]*)\s*\(/g, code)) {
      const symbol = scope.symbols.get(match[1])
      if (symbol?.orm !== 'mongoose') continue
      const close = skipParens(code, index + match[0].length - 1)
      if (close !== -1 && /^\s*\.\s*save\s*\(/.test(code.slice(close + 1, close + 12))) push(symbol, 'writes', 'save', index)
    }
    for (const { match } of matchAll(/(\w+)\s*(?::[^=;\n]*?)?=\s*(?:await\s+)?new\s+([A-Za-z_$][\w$]*)\s*\(/g, code)) {
      bindDocument(match[1], scope.symbols.get(match[2]))
    }
    for (const { match } of matchAll(/(\w+)\s*(?::[^=;\n]*?)?=\s*(?:await\s+)?([A-Za-z_$][\w$]*)\s*\.\s*(?:findOne|findById|create)\s*\(/g, code)) {
      bindDocument(match[1], scope.symbols.get(match[2]))
    }
    for (const { match, index } of matchAll(/([A-Za-z_$][\w$]*)\s*\.\s*(save)\s*\(/g, code)) {
      const symbol = documents.get(match[1])
      if (symbol) push(symbol, 'writes', 'save', index)
    }
  }

  // 5. Сырой SQL внутри строковых и шаблонных литералов.
  for (const literal of literals) {
    for (const hit of sqlHits(literal.raw)) {
      const table = resolveSqlTable(hit.name)
      if (table) push({ table, orm: 'sql' }, hit.kind, hit.op, literal.start + 1 + hit.offset)
    }
  }
  return hits
}

const SQL_TABLE = '([A-Za-z_"`\\[][\\w."`\\]$]*)'
// «select … from …» встречается и в обычном тексте («select an item from accounts list»),
// поэтому литерал обязан выглядеть как оператор: начинаться с SQL-глагола либо нести
// служебные конструкции (WHERE / JOIN / VALUES / SET x =).
const SQL_STATEMENT_START = /^[\s(]*(with|select|insert\s+into|update|delete\s+from|create|alter|truncate|merge)\b/i
const SQL_CLAUSES = /\b(where|group\s+by|order\s+by|having|limit|returning|inner\s+join|left\s+join|right\s+join|values\s*\(|set\s+[\w."`]+\s*=)/i
const SQL_VERBS = /\b(select|insert|update|delete)\b/i

function looksLikeSql (sql) {
  if (SQL_STATEMENT_START.test(sql)) return true
  return SQL_VERBS.test(sql) && SQL_CLAUSES.test(sql)
}

function sqlHits (raw) {
  const sql = raw.replace(/\$\{[^{}]*\}/g, (chunk) => ' '.repeat(chunk.length))
  const hits = []
  if (!looksLikeSql(sql)) return hits
  const selectAt = sql.search(/\bselect\b/i)
  if (selectAt !== -1) {
    for (const { match, index } of matchAll(new RegExp(`\\b(?:from|join)\\s+${SQL_TABLE}`, 'gi'), sql)) {
      if (index < selectAt) continue // `DELETE FROM x` перед вложенным SELECT — это запись
      hits.push({ name: match[1], kind: 'reads', op: 'select', offset: index })
    }
  }
  const write = (regex, op) => {
    for (const { match, index } of matchAll(regex, sql)) {
      hits.push({ name: match[1], kind: 'writes', op, offset: index })
    }
  }
  write(new RegExp(`\\binsert\\s+into\\s+${SQL_TABLE}`, 'gi'), 'insert')
  write(new RegExp(`\\bupdate\\s+${SQL_TABLE}\\s+set\\b`, 'gi'), 'update')
  write(new RegExp(`\\bdelete\\s+from\\s+${SQL_TABLE}`, 'gi'), 'delete')
  return hits
}

function resolveSqlTable (raw) {
  const name = normalizeSqlName(raw)
  if (tables.has(name)) return name
  return tablesLower.get(name.toLowerCase()) ?? null
}

// ── Сборка рёбер: одно ребро на (модуль, таблица, направление) ───────────────

const flows = new Map()
const skipped = new Map()
let scannedFiles = 0

for (const file of codeFiles) {
  const text = readText(path.join(root, file))
  if (!text) continue
  scannedFiles++
  const hits = analyzeFile(file, text)
  if (!hits.length) continue
  const lineAt = lineIndexer(text)
  for (const hit of hits) {
    if (!tables.has(hit.table)) {
      // Поток виден, но узла table:<имя> в графе нет — ребро создало бы stub.
      const entry = skipped.get(hit.table) ?? { table: hit.table, orm: hit.orm, count: 0, files: new Set() }
      entry.count++
      entry.files.add(file)
      skipped.set(hit.table, entry)
      continue
    }
    const key = `${file}|${hit.table}|${hit.kind}`
    const line = lineAt(hit.index)
    const flow = flows.get(key)
    if (!flow) {
      flows.set(key, { file, table: hit.table, kind: hit.kind, line, count: 1, ops: new Set([hit.op]), orms: new Set([hit.orm]) })
      continue
    }
    flow.count++
    flow.ops.add(hit.op)
    flow.orms.add(hit.orm)
    if (line < flow.line) flow.line = line
  }
}

const edges = []
for (const flow of [...flows.values()].sort((a, b) => a.file.localeCompare(b.file) || a.table.localeCompare(b.table) || a.kind.localeCompare(b.kind))) {
  const orms = [...flow.orms].sort()
  edges.push(makeEdge({
    kind: flow.kind,
    from: `module:${flow.file}`,
    to: `table:${flow.table}`,
    source: { file: flow.file, line: flow.line },
    meta: { ops: [...flow.ops].sort(), count: flow.count, orm: orms.length === 1 ? orms[0] : orms },
  }))
}

const reads = edges.filter((edge) => edge.kind === 'reads')
const writes = edges.filter((edge) => edge.kind === 'writes')
const skippedList = [...skipped.values()].sort((a, b) => b.count - a.count || a.table.localeCompare(b.table))
const stats = {
  reads: reads.length,
  writes: writes.length,
  tablesTouched: new Set(edges.map((edge) => edge.to)).size,
  modulesTouched: new Set(edges.map((edge) => edge.from)).size,
  tablesKnown: tables.size,
  scannedFiles,
  parser: tsRuntime ? 'ts' : 'regex',
  // Обращения к таблицам, для которых extract-data не создал узла: ребро было бы
  // stub-ом, поэтому оно не выпускается — но факт стоит показать владельцу.
  skipped: {
    hits: skippedList.reduce((sum, entry) => sum + entry.count, 0),
    tables: skippedList.length,
    examples: skippedList.slice(0, 10).map((entry) => ({ table: entry.table, orm: entry.orm, hits: entry.count, files: entry.files.size })),
  },
}

writeJson(args.out, partFile({ part: 'dataflow', root, nodes: [], edges, stats }))
console.log(`archmap extract-dataflow: ${stats.reads} reads, ${stats.writes} writes ` +
  `(${stats.modulesTouched} modules ↔ ${stats.tablesTouched}/${stats.tablesKnown} tables, parser=${stats.parser}) → ${args.out}`)
if (stats.skipped.tables) {
  console.log(`  пропущено ${stats.skipped.hits} обращений к ${stats.skipped.tables} таблицам без узла в графе: ` +
    stats.skipped.examples.slice(0, 5).map((entry) => `${entry.table}×${entry.hits}`).join(', '))
}
