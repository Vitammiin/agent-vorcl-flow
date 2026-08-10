#!/usr/bin/env node
// archmap extract-product.mjs — фаза 1: продуктовый слой → product.part.json.
// Самый верхний уровень карты: ЧТО умеет система и из чего это собрано.
// Использование: node extract-product.mjs --root <target> --plan <plan.json> --out <product.part.json>
// Извлекает:
//   feature   (area:'api')     — домен API-путей (/api/<domain>/… или /<domain>/…),
//                                + implements-рёбра к роутам домена, таблицам и страницам;
//   feature   (area:'module')  — каталоги src/features/<x>, src/modules/<x>, app/(<group>),
//                                packages/<x> + implements-рёбра к модулям внутри;
//   capability (area:'readme') — пункты списка возможностей из README.md (язык владельца).
// Продукт ничего не выдумывает: нет домена — нет фичи. Узлы route/table/page/module
// создают другие экстракторы, здесь только ССЫЛКИ на них, поэтому наборы роутов и таблиц
// вычисляются теми же правилами, что в extract-api/extract-data (строгое подмножество) —
// иначе merge превратит висячую ссылку в stub-узел.

import fs from 'node:fs'
import path from 'node:path'
import {
  parseArgs, readText, lineOfIndex, makeNode, makeEdge, partFile, writeJson, loadPlan,
} from './lib/core.mjs'
import { loadTypeScript, parseSource, lineOf, RE, matchAll } from './lib/ts.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  plan: { flag: '--plan', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.plan || !args.out) {
  console.log('Usage: node extract-product.mjs --root <target> --plan <plan.json> --out <product.part.json>')
  process.exit(args.help ? 0 : 1)
}

const root = path.resolve(args.root)
const plan = loadPlan(args.plan)
const detected = new Set(plan.stacks?.detected ?? [])
const planFiles = plan.files ?? {}
const codeFiles = planFiles.code ?? []

const nodes = new Map()
const edges = new Map()
const addNode = (node) => {
  if (!nodes.has(node.id)) nodes.set(node.id, node)
  return nodes.get(node.id)
}
const addEdge = (edge) => {
  if (!edges.has(edge.id)) edges.set(edge.id, edge)
}

// ── Человекочитаемые подписи ────────────────────────────────────────────────
const ACRONYMS = new Map(Object.entries({
  api: 'API', ai: 'AI', ui: 'UI', ux: 'UX', ws: 'WS', id: 'ID', url: 'URL', sms: 'SMS',
  pdf: 'PDF', csv: 'CSV', ocr: 'OCR', mcp: 'MCP', llm: 'LLM', oauth: 'OAuth', otp: 'OTP',
  qr: 'QR', tts: 'TTS', stt: 'STT', kyc: 'KYC', crm: 'CRM', crud: 'CRUD', sso: 'SSO',
  tiktok: 'TikTok', livekit: 'LiveKit', gmail: 'Gmail', github: 'GitHub', openai: 'OpenAI',
}))

function humanize(slug) {
  return slug.split('-').filter(Boolean)
    .map((word) => ACRONYMS.get(word) ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function slugify(value) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '')
}

// ═══════════════ 1. Роуты: зеркало id-конвенции extract-api ══════════════════
// `route:<METHOD> <path>` — условия разбора скопированы из extract-api.mjs
// намеренно: расходиться им нельзя, иначе появятся ссылки на несуществующие узлы.

const API_STACKS = ['fastify', 'express', 'nestjs', 'nextjs', 'websocket', 'cron', 'mcp']
const hasApiStack = API_STACKS.some((stack) => detected.has(stack))
const hasNextApp = (planFiles.nextApp ?? []).some((file) => /(^|\/)route\.(ts|tsx|js|jsx)$/.test(file))
const hasMcpJson = (planFiles.mcpJson ?? []).length > 0
const apiActive = hasApiStack || hasMcpJson || hasNextApp

const METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'all'])
const routes = [] // {id, method, path, file, line}
const routeIds = new Set()

function addRouteRef(file, method, routePath, line) {
  const id = `route:${method.toUpperCase()} ${routePath}`
  if (routeIds.has(id)) return
  routeIds.add(id)
  routes.push({ id, method: method.toUpperCase(), path: routePath, file, line })
}

function joinPath(...parts) {
  const joined = '/' + parts.filter(Boolean).join('/')
  const normalized = joined.replace(/\/+/g, '/').replace(/(.)\/$/, '$1')
  return normalized || '/'
}

function materialize(file, records) {
  for (const record of records) {
    if (record.ws) continue // websocket:true → ws-узел, а не route (см. extract-api)
    addRouteRef(file, record.method, record.path, record.line)
  }
}

function collectHttpRegex(file, text) {
  const records = []
  const httpMatches = matchAll(RE.httpRoute, text)
  const routeMatches = matchAll(RE.fastifyRoute, text)
  const boundaries = [...httpMatches, ...routeMatches].map((entry) => entry.index).sort((a, b) => a - b)
  const windowFor = (index) => {
    const next = boundaries.find((boundary) => boundary > index) ?? Math.min(text.length, index + 600)
    return text.slice(index, Math.min(next, index + 600))
  }
  for (const { match, index } of httpMatches) {
    records.push({
      method: match[1], path: match[2], line: lineOfIndex(text, index),
      ws: detected.has('websocket') && /\bwebsocket\s*:\s*true\b/.test(windowFor(index)),
    })
  }
  for (const { match, index } of routeMatches) {
    records.push({
      method: match[1], path: match[2], line: lineOfIndex(text, index),
      ws: /\bwebsocket\s*:\s*true\b/.test(windowFor(index)),
    })
  }
  materialize(file, records)
}

function collectHttpAst(ts, file, text) {
  const sourceFile = parseSource(ts, file, text)
  const records = []
  const isStringy = (node) => ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
  const propKey = (prop) => (prop.name && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) ? prop.name.text : '')
  const isWebsocket = (objectNode) => objectNode.properties.some((prop) => ts.isPropertyAssignment(prop)
    && propKey(prop) === 'websocket' && prop.initializer.kind === ts.SyntaxKind.TrueKeyword)
  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const callName = node.expression.name.text
      const receiver = node.expression.expression
      const receiverOk = ts.isIdentifier(receiver) && /^(app|router|fastify|server|api)$/.test(receiver.text)
      const callArgs = node.arguments
      if (receiverOk && METHODS.has(callName) && callArgs.length && isStringy(callArgs[0]) && callArgs[0].text.startsWith('/')) {
        let ws = false
        for (const arg of callArgs.slice(1)) {
          if (ts.isObjectLiteralExpression(arg) && isWebsocket(arg) && detected.has('websocket')) ws = true
        }
        records.push({ method: callName, path: callArgs[0].text, line: lineOf(sourceFile, node), ws })
      } else if (receiverOk && callName === 'route' && callArgs.length === 1 && ts.isObjectLiteralExpression(callArgs[0])) {
        let method = null
        let url = null
        for (const prop of callArgs[0].properties) {
          if (!ts.isPropertyAssignment(prop)) continue
          const key = propKey(prop)
          if (key === 'method' && isStringy(prop.initializer)) method = prop.initializer.text
          if (key === 'url' && isStringy(prop.initializer)) url = prop.initializer.text
        }
        if (method && url) {
          records.push({
            method: method.toLowerCase(), path: url, line: lineOf(sourceFile, node),
            ws: isWebsocket(callArgs[0]) && detected.has('websocket'),
          })
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  materialize(file, records)
}

const NEST_DECORATORS = new Set(['Get', 'Post', 'Put', 'Patch', 'Delete', 'Head', 'Options', 'All'])

function collectNestRegex(file, text) {
  const controllers = matchAll(RE.nestController, text)
  controllers.forEach((ctrl, position) => {
    const prefix = ctrl.match[1] ?? ''
    const end = controllers[position + 1]?.index ?? text.length
    const segment = text.slice(ctrl.index, end)
    for (const { match, index } of matchAll(RE.nestMethod, segment)) {
      addRouteRef(file, match[1], joinPath(prefix, match[2] ?? ''), lineOfIndex(text, ctrl.index + index))
    }
  })
}

function collectNestAst(ts, file, text) {
  const sourceFile = parseSource(ts, file, text)
  const decorators = (node) => {
    if (typeof ts.getDecorators === 'function' && typeof ts.canHaveDecorators === 'function') {
      return ts.canHaveDecorators(node) ? ts.getDecorators(node) ?? [] : []
    }
    return node.decorators ?? []
  }
  const decoratorCall = (decorator) => {
    const expr = decorator.expression
    return ts.isCallExpression(expr) && ts.isIdentifier(expr.expression) ? expr : null
  }
  const stringArg = (call) => (call.arguments.length && ts.isStringLiteral(call.arguments[0]) ? call.arguments[0].text : '')
  const visit = (node) => {
    if (ts.isClassDeclaration(node)) {
      let prefix = null
      for (const decorator of decorators(node)) {
        const call = decoratorCall(decorator)
        if (call && call.expression.text === 'Controller') prefix = stringArg(call)
      }
      if (prefix !== null) {
        for (const member of node.members) {
          if (!ts.isMethodDeclaration(member)) continue
          for (const decorator of decorators(member)) {
            const call = decoratorCall(decorator)
            if (!call || !NEST_DECORATORS.has(call.expression.text)) continue
            addRouteRef(file, call.expression.text.toLowerCase(), joinPath(prefix, stringArg(call)), lineOf(sourceFile, member))
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
}

const NEXT_METHOD = 'GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS'
const NEXT_EXPORT = new RegExp(`export\\s+(?:async\\s+)?(?:function\\s+(${NEXT_METHOD})\\b|const\\s+(${NEXT_METHOD})\\s*=)`, 'g')

function nextPathFromSegments(segments) {
  const parts = []
  for (const segment of segments.split('/')) {
    if (/^\(.*\)$/.test(segment)) continue
    if (/^\[\[\.\.\..+\]\]$/.test(segment)) parts.push(':' + segment.slice(5, -2) + '*')
    else if (/^\[\.\.\..+\]$/.test(segment)) parts.push(':' + segment.slice(4, -1) + '*')
    else if (/^\[.+\]$/.test(segment)) parts.push(':' + segment.slice(1, -1))
    else parts.push(segment)
  }
  return '/' + parts.join('/')
}

function collectNextRoutes() {
  for (const file of planFiles.nextApp ?? []) {
    const match = /(?:^|\/)app\/(.+)\/route\.(?:ts|tsx|js|jsx)$/.exec(file)
    if (!match) continue
    const routePath = nextPathFromSegments(match[1])
    const text = readText(path.join(root, file))
    if (!text) continue
    for (const { match: exported, index } of matchAll(NEXT_EXPORT, text)) {
      addRouteRef(file, exported[1] ?? exported[2], routePath, lineOfIndex(text, index))
    }
  }
}

async function collectRoutes() {
  if (!apiActive) return
  let tsRuntime = null
  if (plan.stacks?.parser === 'ts') {
    const loaded = await loadTypeScript(root, ['', ...(plan.repo?.packages ?? []).map((pkg) => pkg.path)])
    if (loaded.ts) tsRuntime = loaded.ts
  }
  const httpDetected = detected.has('fastify') || detected.has('express')
  if (httpDetected || detected.has('nestjs')) {
    for (const file of codeFiles) {
      if (/\.(test|spec)\.(ts|tsx|js|jsx|mjs|cjs)$|__tests__/.test(file)) continue
      const text = readText(path.join(root, file))
      if (!text) continue
      if (httpDetected) {
        if (tsRuntime) collectHttpAst(tsRuntime, file, text)
        else collectHttpRegex(file, text)
      }
      if (detected.has('nestjs') && text.includes('@Controller')) {
        if (tsRuntime) collectNestAst(tsRuntime, file, text)
        else collectNestRegex(file, text)
      }
    }
  }
  if (detected.has('nextjs') || hasNextApp) collectNextRoutes()
}

// ═══════════════ 2. Таблицы: зеркало id-конвенции extract-data ═══════════════
// Нужны только имена и file:line доказательства — колонки живут в data.part.json.

const tables = new Map() // name → {file, line}

function addTable(name, file, line) {
  if (name && !tables.has(name)) tables.set(name, { file, line })
}

function normalizeSqlName(raw) {
  const last = raw.trim().split('.').pop()
  return last.replace(/^["'`[]+|["'`\]]+$/g, '')
}

function collectTables() {
  const dataStacks = ['prisma', 'sql-migrations', 'drizzle', 'typeorm', 'mongoose']
  if (!dataStacks.some((stack) => detected.has(stack)) && !(planFiles.sql ?? []).length) return

  if (detected.has('prisma')) {
    for (const file of planFiles.prisma ?? []) {
      const text = readText(path.join(root, file))
      if (!text) continue
      text.split('\n').forEach((raw, index) => {
        const match = /^model\s+(\w+)\s*\{/.exec(raw.replace(/\/\/.*$/, '').trim())
        if (match) addTable(match[1], file, index + 1)
      })
    }
  }

  for (const file of planFiles.sql ?? []) {
    const text = readText(path.join(root, file))
    if (!text) continue
    const regex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?("[^"]+"|`[^`]+`|[A-Za-z_][\w.$]*)\s*\(/gi
    for (const { match, index } of matchAll(regex, text)) {
      addTable(normalizeSqlName(match[1]), file, lineOfIndex(text, index))
    }
  }

  const needDrizzle = detected.has('drizzle')
  const needTypeorm = detected.has('typeorm')
  const needMongoose = detected.has('mongoose')
  if (!needDrizzle && !needTypeorm && !needMongoose) return
  const drizzlePlanned = new Set(needDrizzle ? planFiles.drizzle ?? [] : [])

  for (const file of codeFiles) {
    if (file.endsWith('.d.ts')) continue
    const text = readText(path.join(root, file))
    if (!text) continue
    if (needDrizzle && (drizzlePlanned.has(file) || text.includes('drizzle-orm'))) {
      const regex = /(?:export\s+)?const\s+\w+\s*=\s*(?:pgTable|mysqlTable|sqliteTable)\s*\(\s*['"]([^'"]+)['"]\s*,\s*\{/g
      for (const { match, index } of matchAll(regex, text)) addTable(match[1], file, lineOfIndex(text, index))
    }
    if (needTypeorm && /@Entity\s*\(/.test(text) && text.includes('typeorm')) {
      const regex = /@Entity\s*\(\s*(?:['"]([^'"]+)['"])?[^)]*\)\s*(?:export\s+)?(?:default\s+)?(?:abstract\s+)?class\s+(\w+)/g
      for (const { match, index } of matchAll(regex, text)) {
        if (text.indexOf('{', index + match[0].length) === -1) continue
        addTable(match[1] ?? match[2], file, lineOfIndex(text, index))
      }
    }
    if (needMongoose && /new\s+(?:mongoose\.)?Schema\s*\(/.test(text)) {
      const schemas = new Map()
      for (const { match, index } of matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*new\s+(?:mongoose\.)?Schema\s*\(\s*\{/g, text)) {
        if (!schemas.has(match[1])) schemas.set(match[1], lineOfIndex(text, index))
      }
      for (const { match } of matchAll(/(?:mongoose\.)?model\s*(?:<[^>]*>)?\s*\(\s*['"](\w+)['"]\s*,\s*(\w+)/g, text)) {
        if (schemas.has(match[2])) addTable(match[1], file, schemas.get(match[2]))
      }
    }
  }
}

// ── Совпадение таблицы с доменом: консервативно, по префиксу слов ────────────
// accounts → accounts, account_balances, но НЕ ledger_accounts;
// tags → tags, но НЕ transaction_tags; game → GamePlayer (camelCase — тот же префикс).
function singular(word) {
  if (/ies$/.test(word) && word.length > 4) return word.slice(0, -3) + 'y'
  if (/(ses|xes|zes|ches|shes)$/.test(word)) return word.slice(0, -2)
  if (/ss$/.test(word)) return word
  if (/s$/.test(word) && word.length > 2) return word.slice(0, -1)
  return word
}

function wordsOf(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) => singular(word.toLowerCase()))
}

function matchesDomain(tableName, domainWords) {
  const words = wordsOf(tableName)
  if (words.length < domainWords.length) return false
  return domainWords.every((word, index) => words[index] === word)
}

// ═══════════════ 3. Страницы клиента: зеркало id-конвенции extract-modules ═══
const pages = [] // {id, route, file}

function collectPages() {
  const pageFiles = (planFiles.nextApp ?? []).filter((file) => /(^|\/)(page|layout)\.(ts|tsx|js|jsx)$/.test(file))
  const seen = new Set()
  for (const file of pageFiles) {
    const segments = file.split('/')
    const appIndex = segments.indexOf('app')
    if (appIndex === -1) continue
    if (!fs.existsSync(path.join(root, file))) continue // extract-modules пропускает исчезнувшие файлы
    const isLayout = /^layout\./.test(segments[segments.length - 1])
    const routeSegments = segments.slice(appIndex + 1, -1)
      .filter((segment) => !/^\(.*\)$/.test(segment))
      .map((segment) => segment.replace(/^\[\.{3}(.+)\]$/, ':$1*').replace(/^\[(.+)\]$/, ':$1'))
    const routePath = '/' + routeSegments.join('/')
    const label = isLayout ? `${routePath} (layout)` : routePath
    const id = `page:${label}`
    if (seen.has(id)) continue
    seen.add(id)
    pages.push({ id, route: routePath, file })
  }
}

// ═══════════════ 4. Фичи из доменов API ══════════════════════════════════════
// Домен — второй сегмент /api/<domain>/… (учитывая /api/v1/<domain>), либо первый
// сегмент, если приложение отдаёт роуты без общего префикса (/crypto/…).
const INFRA_SEGMENTS = new Set([
  'health', 'healthz', 'healthcheck', 'livez', 'readyz', 'ping', 'status', 'metrics',
  'docs', 'openapi', 'swagger', 'favicon.ico', 'robots.txt', 'sitemap.xml', '_next', 'static',
])
const METHOD_ORDER = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'ALL']

function domainOf(routePath) {
  const segments = routePath.split('/').filter(Boolean)
  if (!segments.length) return null
  let index = 0
  if (segments[index] === 'api') index++
  if (/^v\d+$/.test(segments[index] ?? '')) index++
  const segment = segments[index]
  if (!segment || segment.startsWith(':') || segment.startsWith('*')) return null
  if (segment.startsWith('.') || INFRA_SEGMENTS.has(segment.toLowerCase())) return null
  const slug = slugify(segment)
  return slug || null
}

function buildApiFeatures() {
  const domains = new Map() // slug → {routes[], byFile: Map}
  for (const route of routes) {
    const slug = domainOf(route.path)
    if (!slug) continue
    if (!domains.has(slug)) domains.set(slug, { routes: [], byFile: new Map() })
    const domain = domains.get(slug)
    domain.routes.push(route)
    const stat = domain.byFile.get(route.file) ?? { count: 0, line: route.line }
    stat.count++
    stat.line = Math.min(stat.line, route.line)
    domain.byFile.set(route.file, stat)
  }

  for (const [slug, domain] of [...domains].sort((a, b) => a[0].localeCompare(b[0]))) {
    // источник = файл-роутер с наибольшим числом роутов домена + строка первого роута в нём
    const [file, stat] = [...domain.byFile].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))[0]
    const methods = {}
    for (const method of METHOD_ORDER) {
      const count = domain.routes.filter((route) => route.method === method).length
      if (count) methods[method] = count
    }
    for (const method of domain.routes.map((route) => route.method).sort()) {
      if (!METHOD_ORDER.includes(method)) methods[method] = (methods[method] ?? 0) + 1
    }
    const domainWords = wordsOf(slug)
    const domainTables = [...tables].filter(([name]) => matchesDomain(name, domainWords)).sort((a, b) => a[0].localeCompare(b[0]))
    const domainPages = pages.filter((page) => slugify(page.route.split('/').filter(Boolean)[0] ?? '') === slug)

    const id = `feature:${slug}`
    addNode(makeNode({
      id, kind: 'feature', layer: 'product', label: humanize(slug),
      source: { file, line: stat.line },
      meta: {
        area: 'api',
        routes: domain.routes.length,
        methods,
        tables: domainTables.length,
        pages: domainPages.length,
        routers: [...domain.byFile.keys()].sort(),
      },
    }))
    for (const route of domain.routes) {
      addEdge(makeEdge({
        kind: 'implements', from: id, to: route.id,
        source: { file: route.file, line: route.line },
      }))
    }
    for (const [name, source] of domainTables) {
      addEdge(makeEdge({
        kind: 'implements', from: id, to: `table:${name}`,
        source: { file: source.file, line: source.line },
      }))
    }
    for (const page of domainPages) {
      addEdge(makeEdge({
        kind: 'implements', from: id, to: page.id,
        source: { file: page.file, line: 1 },
      }))
    }
  }
}

// ═══════════════ 5. Фичи из структуры каталогов ══════════════════════════════
// src/features/<name>, src/modules/<name>, app/(<group>), packages/<name>.
const MODULE_DIR_RE = [
  /^(?:(.*)\/)?(?:features|modules)\/([^/]+)\//,
  /^(?:(.*)\/)?packages\/([^/]+)\//,
  /^(?:(.*)\/)?app\/\(([^)]+)\)\//,
]
const MAX_MODULE_EDGES = 200

function buildModuleFeatures() {
  const dirs = new Map() // dir → {slug, files[]}
  for (const file of codeFiles) {
    // module-узла у исчезнувшего файла не будет (см. extract-modules) — ссылаться не на что
    if (!fs.existsSync(path.join(root, file))) continue
    for (const regex of MODULE_DIR_RE) {
      const match = regex.exec(file)
      if (!match) continue
      const dir = file.slice(0, match[0].length - 1)
      const slug = slugify(match[2])
      if (!slug) break
      if (!dirs.has(dir)) dirs.set(dir, { slug, files: [] })
      dirs.get(dir).files.push(file)
      break
    }
  }

  for (const [dir, entry] of [...dirs].sort((a, b) => a[0].localeCompare(b[0]))) {
    const files = entry.files.slice().sort()
    const id = `feature:${entry.slug}`
    const existing = nodes.get(id)
    if (existing) {
      existing.meta.dirs = [...new Set([...(existing.meta.dirs ?? []), dir])].sort()
      existing.meta.modules = (existing.meta.modules ?? 0) + files.length
    } else {
      addNode(makeNode({
        id, kind: 'feature', layer: 'product', label: humanize(entry.slug),
        source: { file: files[0], line: 1 },
        meta: { area: 'module', dirs: [dir], modules: files.length },
      }))
    }
    for (const file of files.slice(0, MAX_MODULE_EDGES)) {
      addEdge(makeEdge({
        kind: 'implements', from: id, to: `module:${file}`,
        source: { file, line: 1 },
      }))
    }
  }
}

// ═══════════════ 6. Возможности из README ════════════════════════════════════
// Продуктовый язык владельца: маркированный список под разделом «Features» /
// «Возможности» / «Что умеет». Только короткие пункты и не более 30 штук.
const README_HEADING_RE = /(features?|capabilit|highlights?|what (?:is this|it does|you get)|возможност|что умеет|что это|что внутри|функциональност)/i
const CAPABILITY_LIMIT = 30
const CAPABILITY_MAX_LENGTH = 120

function cleanMarkdown(value) {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\*\*|__|~~/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .trim()
}

function buildCapabilities() {
  const file = ['README.md', 'readme.md', 'Readme.md'].find((name) => readText(path.join(root, name)) !== null)
  if (!file) return
  const lines = readText(path.join(root, file)).split('\n')
  let active = false
  let inFence = false
  let count = 0
  const seen = new Set()
  for (let index = 0; index < lines.length && count < CAPABILITY_LIMIT; index++) {
    const line = lines[index]
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; continue }
    if (inFence) continue
    const heading = /^(#{1,4})\s+(.*)$/.exec(line)
    if (heading) {
      active = README_HEADING_RE.test(cleanMarkdown(heading[2]))
      continue
    }
    if (!active) continue
    const bullet = /^ {0,3}(?:[-*+]|\d+\.)\s+(.+)$/.exec(line)
    if (!bullet) continue
    const text = cleanMarkdown(bullet[1])
    if (!text || text.length >= CAPABILITY_MAX_LENGTH) continue
    const slug = slugify(text).split('-').slice(0, 8).join('-')
    if (!slug || seen.has(slug)) continue
    seen.add(slug)
    count++
    addNode(makeNode({
      id: `capability:${slug}`, kind: 'capability', layer: 'product', label: text,
      source: { file, line: index + 1 },
      meta: { area: 'readme', text },
    }))
  }
}

// ═══════════════ Сборка ══════════════════════════════════════════════════════

await collectRoutes()
collectTables()
collectPages()
buildApiFeatures()
buildModuleFeatures()
buildCapabilities()

// meta.weight — «размер фичи»: число связанных узлов (рендеры берут его для размера блока)
const weights = new Map()
for (const edge of edges.values()) {
  weights.set(edge.from, (weights.get(edge.from) ?? 0) + 1)
}
for (const node of nodes.values()) node.meta.weight = weights.get(node.id) ?? 0

const nodeList = [...nodes.values()]
const edgeList = [...edges.values()]
const features = nodeList.filter((node) => node.kind === 'feature')
const stats = {
  features: features.length,
  apiFeatures: features.filter((node) => node.meta.area === 'api').length,
  moduleFeatures: features.filter((node) => node.meta.area === 'module').length,
  capabilities: nodeList.filter((node) => node.kind === 'capability').length,
  implements: edgeList.length,
  routesSeen: routes.length,
  tablesSeen: tables.size,
}
writeJson(args.out, partFile({ part: 'product', root, nodes: nodeList, edges: edgeList, stats }))
console.log(`archmap extract-product: ${stats.features} features ` +
  `(api ${stats.apiFeatures}, module ${stats.moduleFeatures}), ${stats.capabilities} capabilities, ` +
  `${stats.implements} implements → ${args.out}`)
