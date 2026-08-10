#!/usr/bin/env node
// archmap extract-journey.mjs — фаза 1: пользовательские сценарии → journey.part.json.
// Карта устройства системы не отвечает на вопрос владельца «как человек идёт от
// регистрации до возможностей». Этот экстрактор собирает ПУТЬ: регистрация →
// подтверждение → вход → профиль → основные возможности, а также оплату,
// рабочий CRUD-цикл главной сущности и цикл уведомлений.
// Использование: node extract-journey.mjs --root <target> --plan <plan.json> --out <journey.part.json>
// Нет api-стеков или подтверждающих роутов → пустой part, exit 0.
//
// Честность (железное правило SKILL.md — нет доказательства, нет факта):
//   - каждый шаг ссылается (`ref`) на РЕАЛЬНЫЙ узел графа: route:/cron:/feature:;
//     наборы роутов, cron и доменов фич вычисляются теми же правилами, что в
//     extract-api.mjs и extract-product.mjs (строгое подмножество), иначе merge
//     превратил бы висячую ссылку в stub;
//   - `source` сценария = file:line САМОГО РАННЕГО шага — реальное доказательство,
//     что сценарий вообще существует в коде;
//   - каждый шаг проверяется на существование файла и строки (fileExistsWithLine);
//   - меньше 2 подтверждённых роутами шагов → сценарий НЕ создаётся вовсе;
//   - ПОРЯДОК шагов — эвристика (meta.method: 'heuristic-order'); если хотя бы один
//     шаг не подтверждён роутом (агрегат feature) — весь сценарий inferred:true.

import path from 'node:path'
import {
  parseArgs, readText, readJson, lineOfIndex, makeNode, makeEdge, partFile, writeJson,
  loadPlan, fileExistsWithLine,
} from './lib/core.mjs'
import { loadTypeScript, parseSource, lineOf, RE, matchAll } from './lib/ts.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  plan: { flag: '--plan', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.plan || !args.out) {
  console.log('Usage: node extract-journey.mjs --root <target> --plan <plan.json> --out <journey.part.json>')
  process.exit(args.help ? 0 : 1)
}

const root = path.resolve(args.root)
const plan = loadPlan(args.plan)
const detected = new Set(plan.stacks?.detected ?? [])
const planFiles = plan.files ?? {}
const codeFiles = planFiles.code ?? []

const API_STACKS = ['fastify', 'express', 'nestjs', 'nextjs', 'websocket', 'cron', 'mcp']
const hasApiStack = API_STACKS.some((stack) => detected.has(stack))
const hasNextApp = (planFiles.nextApp ?? []).some((file) => /(^|\/)route\.(ts|tsx|js|jsx)$/.test(file))
const emptyPart = () => {
  writeJson(args.out, partFile({ part: 'journey', root, nodes: [], edges: [], stats: { journeys: 0, steps: 0 } }))
}
if (!hasApiStack && !hasNextApp) {
  emptyPart()
  console.log('archmap extract-journey: no api stacks detected → empty part')
  process.exit(0)
}

// ═══════════════ 1. Роуты: зеркало id-конвенции extract-api ══════════════════
// `route:<METHOD> <path>` + meta.middleware/meta.auth. Условия разбора скопированы
// из extract-api.mjs намеренно: расходиться им нельзя (иначе ссылки на несуществующие узлы).

const METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'all'])
const AUTH_HINT = /auth|guard|protect|jwt|session|token|acl/i // ровно как в extract-api (meta.auth)
// Слова, которые в имени middleware означают именно «требуется вход». Проверяются по
// camelCase/snake-словам, а не подстрокой: иначе `oauthRegisterRateLimitMiddleware`
// (это лимитер, а не guard) выдал бы себя за защиту входа из-за «o-auth».
const AUTH_WORDS = new Set([
  'auth', 'authn', 'authenticate', 'authenticated', 'authentication', 'authorize',
  'authorized', 'authorization', 'jwt', 'passport', 'bearer', 'protect', 'protected',
  'requireauth', 'requireuser', 'requirelogin', 'ensureauth', 'ensureloggedin',
  'isauthenticated', 'isloggedin', 'verifytoken', 'currentuser',
])

function camelWords(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase())
}

function isAuthGuardName(name) {
  return camelWords(name).some((word) => AUTH_WORDS.has(word))
}

const routes = [] // {id, method, path, file, line, middleware[], auth}
const routeIds = new Set()

function joinPath(...parts) {
  const joined = '/' + parts.filter(Boolean).join('/')
  const normalized = joined.replace(/\/+/g, '/').replace(/(.)\/$/, '$1')
  return normalized || '/'
}

function addRouteRef(file, method, routePath, line, middleware, globalUses) {
  const id = `route:${method.toUpperCase()} ${routePath}`
  if (routeIds.has(id)) return
  routeIds.add(id)
  const local = [...new Set(middleware ?? [])]
  // meta.auth extract-api ставит только по роут-локальному middleware; глобальный
  // app.use(authenticate) он отражает лишь рёбрами guards — учитываем и его.
  const guarded = globalUses.filter((use) => use.line <= line && isAuthGuardName(use.name))
  routes.push({
    id,
    method: method.toUpperCase(),
    path: routePath,
    file,
    line,
    middleware: local,
    auth: local.some((name) => AUTH_HINT.test(name)) || guarded.length > 0,
  })
}

function materialize(file, records, uses) {
  const globalUses = uses ?? []
  for (const record of records) {
    if (record.ws) continue // websocket:true → ws-узел, а не route (см. extract-api)
    addRouteRef(file, record.method, record.path, record.line, record.middleware, globalUses)
  }
}

function middlewareFromText(window) {
  const names = []
  for (const { match } of matchAll(/\b(?:preHandler|onRequest|middlewares?)\s*:\s*(\[[^\]]*\]|[A-Za-z_$][\w$.]*)/g, window)) {
    for (const { match: inner } of matchAll(/[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*/g, match[1])) {
      const name = inner[0].split('.').pop()
      if (!names.includes(name)) names.push(name)
    }
  }
  return names
}

function collectHttpRegex(file, text) {
  const records = []
  const uses = []
  const httpMatches = matchAll(RE.httpRoute, text)
  const routeMatches = matchAll(RE.fastifyRoute, text)
  const boundaries = [...httpMatches, ...routeMatches].map((entry) => entry.index).sort((a, b) => a - b)
  const windowFor = (index) => {
    const next = boundaries.find((boundary) => boundary > index) ?? Math.min(text.length, index + 600)
    return text.slice(index, Math.min(next, index + 600))
  }
  for (const { match, index } of httpMatches) {
    const window = windowFor(index)
    records.push({
      method: match[1], path: match[2], line: lineOfIndex(text, index),
      middleware: middlewareFromText(window),
      ws: detected.has('websocket') && /\bwebsocket\s*:\s*true\b/.test(window),
    })
  }
  for (const { match, index } of routeMatches) {
    const window = windowFor(index)
    records.push({
      method: match[1], path: match[2], line: lineOfIndex(text, index),
      middleware: middlewareFromText(window),
      ws: /\bwebsocket\s*:\s*true\b/.test(window),
    })
  }
  for (const { match, index } of matchAll(/\b(?:app|router|server|api)\.use\s*\(\s*([A-Za-z_$][\w$]*)\s*[,)]/g, text)) {
    uses.push({ name: match[1], line: lineOfIndex(text, index) })
  }
  materialize(file, records, uses)
}

function collectHttpAst(ts, file, text) {
  const sourceFile = parseSource(ts, file, text)
  const records = []
  const uses = []
  const isStringy = (node) => ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
  const identifiersIn = (node) => {
    if (ts.isIdentifier(node)) return [node.text]
    if (ts.isPropertyAccessExpression(node)) return [node.name.text]
    if (ts.isArrayLiteralExpression(node)) return node.elements.flatMap(identifiersIn)
    return []
  }
  const propKey = (prop) => (prop.name && (ts.isIdentifier(prop.name) || ts.isStringLiteral(prop.name)) ? prop.name.text : '')
  const optionsInfo = (objectNode) => {
    const middleware = []
    let websocket = false
    for (const prop of objectNode.properties) {
      if (!ts.isPropertyAssignment(prop)) continue
      const key = propKey(prop)
      if (['preHandler', 'onRequest', 'middleware', 'middlewares'].includes(key)) middleware.push(...identifiersIn(prop.initializer))
      if (key === 'websocket' && prop.initializer.kind === ts.SyntaxKind.TrueKeyword) websocket = true
    }
    return { middleware, websocket }
  }
  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const callName = node.expression.name.text
      const receiver = node.expression.expression
      const receiverOk = ts.isIdentifier(receiver) && /^(app|router|fastify|server|api)$/.test(receiver.text)
      const callArgs = node.arguments
      if (receiverOk && METHODS.has(callName) && callArgs.length && isStringy(callArgs[0]) && callArgs[0].text.startsWith('/')) {
        const record = {
          method: callName, path: callArgs[0].text, line: lineOf(sourceFile, node),
          middleware: [], ws: false,
        }
        for (const arg of callArgs.slice(1)) {
          if (!ts.isObjectLiteralExpression(arg)) continue
          const info = optionsInfo(arg)
          record.middleware.push(...info.middleware)
          if (info.websocket && detected.has('websocket')) record.ws = true
        }
        for (const arg of callArgs.slice(1, -1)) {
          if (ts.isIdentifier(arg)) record.middleware.push(arg.text) // express-стиль
        }
        records.push(record)
      } else if (receiverOk && callName === 'route' && callArgs.length === 1 && ts.isObjectLiteralExpression(callArgs[0])) {
        const info = optionsInfo(callArgs[0])
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
            middleware: info.middleware, ws: info.websocket && detected.has('websocket'),
          })
        }
      } else if (receiverOk && callName === 'use' && callArgs.length && ts.isIdentifier(callArgs[0])) {
        uses.push({ name: callArgs[0].text, line: lineOf(sourceFile, node) })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  materialize(file, records, uses)
}

const NEST_DECORATORS = new Set(['Get', 'Post', 'Put', 'Patch', 'Delete', 'Head', 'Options', 'All'])

function collectNestRegex(file, text) {
  const controllers = matchAll(RE.nestController, text)
  controllers.forEach((ctrl, position) => {
    const prefix = ctrl.match[1] ?? ''
    const end = controllers[position + 1]?.index ?? text.length
    const segment = text.slice(ctrl.index, end)
    for (const { match, index } of matchAll(RE.nestMethod, segment)) {
      addRouteRef(file, match[1], joinPath(prefix, match[2] ?? ''), lineOfIndex(text, ctrl.index + index), [], [])
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
      const classGuards = []
      for (const decorator of decorators(node)) {
        const call = decoratorCall(decorator)
        if (!call) continue
        if (call.expression.text === 'Controller') prefix = stringArg(call)
        // @UseGuards(JwtAuthGuard) на классе — тот же смысл, что preHandler: auth
        if (call.expression.text === 'UseGuards') {
          for (const arg of call.arguments) if (ts.isIdentifier(arg)) classGuards.push(arg.text)
        }
      }
      if (prefix !== null) {
        for (const member of node.members) {
          if (!ts.isMethodDeclaration(member)) continue
          const guards = [...classGuards]
          for (const decorator of decorators(member)) {
            const call = decoratorCall(decorator)
            if (call && call.expression.text === 'UseGuards') {
              for (const arg of call.arguments) if (ts.isIdentifier(arg)) guards.push(arg.text)
            }
          }
          for (const decorator of decorators(member)) {
            const call = decoratorCall(decorator)
            if (!call || !NEST_DECORATORS.has(call.expression.text)) continue
            addRouteRef(file, call.expression.text.toLowerCase(), joinPath(prefix, stringArg(call)),
              lineOf(sourceFile, member), guards, [])
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
      addRouteRef(file, exported[1] ?? exported[2], routePath, lineOfIndex(text, index), [], [])
    }
  }
}

// ═══════════════ 2. Cron: зеркало id-конвенции extract-api ═══════════════════
const crons = [] // {id, name, schedule, file, line}
const cronIds = new Set()

function addCronRef(name, schedule, file, line) {
  const id = `cron:${name}`
  if (cronIds.has(id)) return
  cronIds.add(id)
  crons.push({ id, name, schedule, file, line })
}

function looksLikeCron(expr) {
  if (/^@(yearly|annually|monthly|weekly|daily|hourly)$/.test(expr)) return true
  return /^(?:[\d*/,\-A-Za-z?#]+\s+){4,5}[\d*/,\-A-Za-z?#]+$/.test(expr)
}

function collectCron(file, text) {
  const patterns = [
    /\b[\w$]+\.schedule\s*\(\s*['"`]([^'"`]+)['"`]/g,
    /\bnew\s+Cron\s*\(\s*['"`]([^'"`]+)['"`]/g,
  ]
  for (const regex of patterns) {
    for (const { match, index } of matchAll(regex, text)) {
      if (!looksLikeCron(match[1])) continue
      const line = lineOfIndex(text, index)
      const window = text.slice(index, Math.min(text.length, index + 300))
      const named = /,\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/.exec(window)
        ?? /,\s*([A-Za-z_$][\w$]*)\s*[,)]/.exec(window)
      addCronRef(named?.[1] ?? `${file}#${line}`, match[1], file, line)
    }
  }
  if (text.includes('@nestjs/schedule')) {
    for (const { match, index } of matchAll(/@Cron\(\s*['"`]([^'"`]+)['"`]/g, text)) {
      const line = lineOfIndex(text, index)
      const after = text.slice(index + match[0].length)
      const nameMatch = /\)\s*\n?\s*(?:@[\w.]+\([^)]*\)\s*)*(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(/.exec(after)
      addCronRef(nameMatch?.[1] ?? `${file}#${line}`, match[1], file, line)
    }
  }
}

function collectVercelCrons() {
  for (const file of planFiles.vercelJson ?? []) {
    const json = readJson(path.join(root, file))
    if (!Array.isArray(json?.crons)) continue
    const text = readText(path.join(root, file)) ?? ''
    for (const cron of json.crons) {
      if (!cron?.path) continue
      const index = text.indexOf(`"${cron.path}"`)
      addCronRef(cron.path, cron.schedule ?? '', file, index >= 0 ? lineOfIndex(text, index) : 1)
    }
  }
}

// ═══════════════ 3. Обход файлов ═════════════════════════════════════════════
async function collectAll() {
  let tsRuntime = null
  if (plan.stacks?.parser === 'ts') {
    const loaded = await loadTypeScript(root, ['', ...(plan.repo?.packages ?? []).map((pkg) => pkg.path)])
    if (loaded.ts) tsRuntime = loaded.ts
  }
  const httpDetected = detected.has('fastify') || detected.has('express')
  const needsWalk = httpDetected || detected.has('nestjs') || detected.has('cron')
  if (needsWalk) {
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
      if (detected.has('cron')) collectCron(file, text)
    }
  }
  if (detected.has('nextjs') || hasNextApp) collectNextRoutes()
  collectVercelCrons()
  routes.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method))
  crons.sort((a, b) => a.id.localeCompare(b.id))
}

// ═══════════════ 4. Домены и фичи: зеркало extract-product ═══════════════════
const INFRA_SEGMENTS = new Set([
  'health', 'healthz', 'healthcheck', 'livez', 'readyz', 'ping', 'status', 'metrics',
  'docs', 'openapi', 'swagger', 'favicon.ico', 'robots.txt', 'sitemap.xml', '_next', 'static',
])

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

// Сегменты пути ПОСЛЕ префикса /api/v1 — по ним и опознаётся семантика шага.
function tailSegments(routePath) {
  const segments = routePath.split('/').filter(Boolean)
  let index = 0
  if (segments[index] === 'api') index++
  if (/^v\d+$/.test(segments[index] ?? '')) index++
  return segments.slice(index)
}

// ═══════════════ 5. Семантика шагов ══════════════════════════════════════════
// Ключевые слова с весом: чем выше вес, тем «правильнее» роут для этого шага.
// Совпадение считается только по ЦЕЛОМУ сегменту пути или его дефисным частям —
// иначе `/api/tokens-report` попал бы во «вход», а `/api/reconfirm` в «подтверждение».

const ADMIN_SEGMENTS = new Set(['admin', 'internal', 'debug', 'dev', 'test', '_internal'])
// Домены, которые считаем «про идентичность» без дополнительных доказательств.
const AUTH_DOMAINS = new Set([
  'auth', 'authentication', 'oauth', 'oauth2', 'session', 'sessions', 'identity',
  'user', 'users', 'account', 'accounts', 'me', 'profile',
])
// Сильные признаки того, что домен обслуживает вход/регистрацию (по первому под-сегменту).
const STRONG_AUTH_SEGMENTS = new Set([
  'login', 'signin', 'sign-in', 'register', 'signup', 'sign-up', 'logout', 'signout',
  'refresh', '2fa', 'mfa', 'otp', 'verify-email',
])

function segmentWords(segment) {
  return [segment, ...segment.split('-')]
}

// Возвращает {weight, keyword} лучшего совпадения ключевых слов по хвосту пути.
function keywordHit(routePath, keywords) {
  let best = null
  const segments = tailSegments(routePath).filter((segment) => !segment.startsWith(':'))
  for (const segment of segments) {
    const words = new Set(segmentWords(segment.toLowerCase()))
    for (const [keyword, weight] of keywords) {
      const matched = words.has(keyword) || segment.toLowerCase() === keyword
      if (!matched) continue
      if (!best || weight > best.weight) best = { weight, keyword, segment }
    }
  }
  return best
}

function isAdminPath(routePath) {
  return tailSegments(routePath).some((segment) => ADMIN_SEGMENTS.has(segment.toLowerCase()))
}

function depthOf(routePath) {
  return tailSegments(routePath).length
}

// Детерминированный выбор лучшего кандидата: сначала score, затем короткий путь,
// затем алфавит — повторный прогон обязан дать тот же результат.
function pickBest(candidates) {
  if (!candidates.length) return null
  return candidates.slice().sort((a, b) => b.score - a.score
    || depthOf(a.route.path) - depthOf(b.route.path)
    || a.route.path.localeCompare(b.route.path)
    || a.route.method.localeCompare(b.route.method))[0]
}

// ═══════════════ 6. Сборка сценариев ═════════════════════════════════════════
const nodes = new Map()
const edges = new Map()
const addNode = (node) => { if (!nodes.has(node.id)) nodes.set(node.id, node) }
const addEdge = (edge) => { if (!edges.has(edge.id)) edges.set(edge.id, edge) }

const authMiddlewareNames = new Set() // строго «требуется вход»
const guardMiddlewareNames = new Set() // всё, что extract-api считает meta.auth
let publicRoutes = 0
let protectedRoutes = 0

function accessStats() {
  for (const route of routes) {
    if (route.auth) protectedRoutes++
    else publicRoutes++
    for (const name of route.middleware) {
      if (isAuthGuardName(name)) authMiddlewareNames.add(name)
      if (AUTH_HINT.test(name)) guardMiddlewareNames.add(name)
    }
  }
}

// Шаг: {order, title, ref, kind, auth, note, source, confirmed}
function routeStep(route, title, note) {
  return {
    title,
    ref: route.id,
    kind: route.path.toLowerCase().includes('webhook') ? 'webhook' : 'route',
    auth: route.auth,
    note: `${route.method} ${route.path} — ${route.auth ? 'требует входа' : 'публичный'}${note ? '; ' + note : ''}`,
    source: { file: route.file, line: route.line },
    confirmed: true,
  }
}

function cronStep(cron, title) {
  return {
    title,
    ref: cron.id,
    kind: 'cron',
    auth: false,
    note: `по расписанию «${cron.schedule}» — без участия пользователя`,
    source: { file: cron.file, line: cron.line },
    confirmed: true,
  }
}

function featureStep(feature, title) {
  return {
    title,
    ref: `feature:${feature.slug}`,
    kind: 'feature',
    auth: feature.protectedRoutes > feature.publicRoutes,
    note: `${feature.routes.length} роутов (${feature.publicRoutes} публичных / ${feature.protectedRoutes} после входа)`,
    source: { file: feature.file, line: feature.line },
    // агрегат домена, а не единичное доказательство шага — честно помечаем как неподтверждённый
    confirmed: false,
  }
}

// Создание узла journey + рёбра step. Возвращает узел или null (мало доказательств).
function buildJourney({ id, label, steps, note }) {
  const unique = []
  const seen = new Set()
  for (const step of steps) {
    if (!step || seen.has(step.ref)) continue
    if (!fileExistsWithLine(root, step.source)) continue // доказательство обязано существовать
    seen.add(step.ref)
    unique.push(step)
  }
  const confirmed = unique.filter((step) => step.confirmed)
  if (confirmed.length < 2) return null // меньше 2 подтверждённых шагов — сценария нет

  unique.forEach((step, index) => { step.order = index + 1 })
  const first = unique[0]
  const inferred = unique.some((step) => !step.confirmed)
  const publicSteps = unique.filter((step) => !step.auth).length

  addNode(makeNode({
    id,
    kind: 'journey',
    layer: 'product',
    label,
    source: { file: first.source.file, line: first.source.line },
    inferred,
    meta: {
      steps: unique.map((step) => ({
        order: step.order,
        title: step.title,
        ref: step.ref,
        kind: step.kind,
        auth: step.auth,
        note: step.note,
        source: step.source,
        confirmed: step.confirmed,
      })),
      stepCount: unique.length,
      confirmedSteps: confirmed.length,
      publicSteps,
      protectedSteps: unique.length - publicSteps,
      publicRoutes,
      protectedRoutes,
      authMiddleware: [...authMiddlewareNames].sort(),
      guardMiddleware: [...guardMiddlewareNames].sort(),
      // порядок шагов — эвристика по семантике пути и метода, а не факт из кода
      method: 'heuristic-order',
      note,
    },
  }))
  for (const step of unique) {
    addEdge(makeEdge({
      kind: 'step',
      from: id,
      to: step.ref,
      label: `${step.order}. ${step.title}`,
      source: step.source,
      inferred: !step.confirmed,
      meta: { order: step.order, auth: step.auth, stepKind: step.kind },
    }))
  }
  return nodes.get(id)
}

// ── 6.1 Онбординг: регистрация → подтверждение → вход → профиль → возможности ──
const ONBOARDING_CATEGORIES = [
  {
    key: 'register',
    title: 'Регистрация',
    methods: ['POST'],
    publicOnly: true,
    keywords: [['register', 10], ['registration', 10], ['signup', 10], ['sign-up', 10], ['users', 4], ['user', 3], ['create', 2]],
  },
  {
    key: 'verify',
    title: 'Подтверждение аккаунта',
    methods: ['POST', 'GET', 'PUT', 'PATCH'],
    keywords: [['verify', 10], ['verification', 10], ['confirm', 9], ['activate', 8], ['otp', 8], ['2fa', 8], ['mfa', 7], ['code', 5]],
    excludeKeywords: [['forgot', 1], ['recover', 1], ['password', 1], ['reset', 1]],
  },
  {
    key: 'login',
    title: 'Вход',
    methods: ['POST'],
    publicOnly: true,
    keywords: [['login', 10], ['signin', 10], ['sign-in', 10], ['authenticate', 8], ['token', 4], ['session', 4], ['sessions', 4]],
  },
  {
    key: 'recover',
    title: 'Восстановление доступа',
    methods: ['POST'],
    publicOnly: true,
    keywords: [['forgot', 10], ['recover', 9], ['recovery', 9], ['reset', 7], ['password', 6]],
    bonus: (route) => (/forgot|request/.test(route.path.toLowerCase()) ? 3 : 0),
  },
  {
    key: 'profile',
    title: 'Профиль после входа',
    methods: ['GET'],
    keywords: [['me', 10], ['profile', 10], ['onboarding', 9], ['setup', 7], ['account', 5], ['settings', 4]],
    preferAuth: true,
  },
]

const MAX_FEATURE_STEPS = 5

function authDomains() {
  const found = new Set()
  for (const route of routes) {
    const domain = domainOf(route.path)
    if (!domain) continue
    if (AUTH_DOMAINS.has(domain)) { found.add(domain); continue }
    const tail = tailSegments(route.path)
    const sub = (tail[1] ?? '').toLowerCase()
    if (STRONG_AUTH_SEGMENTS.has(sub)) found.add(domain)
  }
  return found
}

function buildOnboarding(domains, features) {
  const used = new Set()
  const steps = []
  const usedDomains = new Set()
  for (const category of ONBOARDING_CATEGORIES) {
    const candidates = []
    for (const route of routes) {
      if (used.has(route.id)) continue
      if (!category.methods.includes(route.method)) continue
      if (isAdminPath(route.path)) continue
      if (category.publicOnly && route.auth) continue
      const domain = domainOf(route.path)
      if (!domain) continue
      const hit = keywordHit(route.path, category.keywords)
      if (!hit) continue
      if (category.excludeKeywords && keywordHit(route.path, category.excludeKeywords)) continue
      // Шаг идентичности имеет смысл только внутри auth-домена — иначе
      // `/api/billing/apple/confirm` притворился бы подтверждением аккаунта.
      const domainOk = domains.has(domain) || hit.keyword === domain
      if (!domainOk) continue
      let score = hit.weight * 10
      if (AUTH_DOMAINS.has(domain)) score += 6
      if (category.preferAuth && route.auth) score += 5
      if (!category.preferAuth && !route.auth) score += 2
      score += category.bonus ? category.bonus(route) : 0
      score -= depthOf(route.path)
      candidates.push({ route, score })
    }
    const best = pickBest(candidates)
    if (!best) continue
    used.add(best.route.id)
    usedDomains.add(domainOf(best.route.path))
    const extra = candidates.length > 1 ? `выбран из ${candidates.length} кандидатов` : null
    steps.push(routeStep(best.route, category.title, extra))
  }
  if (!steps.length) return null

  // Хвост пути — «возможности»: топ-фичи по числу роутов (узлы feature:* от extract-product).
  const ranked = features
    .filter((feature) => !usedDomains.has(feature.slug))
    .sort((a, b) => b.routes.length - a.routes.length || a.slug.localeCompare(b.slug))
    .slice(0, MAX_FEATURE_STEPS)
  for (const feature of ranked) steps.push(featureStep(feature, `Возможность: ${feature.label}`))

  return buildJourney({
    id: 'journey:onboarding',
    label: 'Путь пользователя: регистрация → работа',
    steps,
    note: 'Шаги идентичности найдены по семантике пути и метода; хвост — топ-'
      + `${MAX_FEATURE_STEPS} доменов API по числу роутов`,
  })
}

// ── 6.2 Оплата ───────────────────────────────────────────────────────────────
const PAYMENT_DOMAIN = /^(billing|payments?|subscriptions?|checkout|invoices?|plans?|pricing|orders?|webhooks?|purchases?)$/
const PAYMENT_PROVIDER = /stripe|paddle|adapty|revenuecat|lemonsqueezy|paypal|braintree|apple|google|payment|billing|subscription|invoice|checkout/i

const PAYMENT_CATEGORIES = [
  {
    key: 'plans', title: 'Тарифы и доступ', methods: ['GET'],
    keywords: [['plans', 10], ['pricing', 10], ['products', 8], ['options', 7], ['entitlement', 7], ['entitlements', 7], ['subscriptions', 5], ['subscription', 5]],
  },
  {
    key: 'checkout', title: 'Оформление оплаты', methods: ['POST'],
    keywords: [['checkout', 10], ['checkout-session', 10], ['subscribe', 9], ['pay', 8], ['payment', 7], ['purchase', 7], ['charge', 7], ['order', 5]],
  },
  {
    key: 'confirm', title: 'Подтверждение покупки', methods: ['POST', 'GET'],
    keywords: [['confirm', 10], ['capture', 9], ['complete', 8], ['verify', 8], ['success', 7], ['callback', 6], ['sync', 4]],
  },
  {
    key: 'webhook', title: 'Вебхук платёжной системы', methods: ['POST'],
    keywords: [['webhook', 10], ['webhooks', 10], ['hooks', 6]],
    require: (route) => PAYMENT_PROVIDER.test(route.path),
  },
  {
    key: 'manage', title: 'Управление подпиской', methods: ['POST', 'GET', 'DELETE', 'PATCH'],
    keywords: [['portal', 10], ['customer-portal', 10], ['cancel', 9], ['invoices', 8], ['invoice', 8], ['manage', 7], ['receipts', 6]],
  },
]

function buildPayment() {
  const used = new Set()
  const steps = []
  for (const category of PAYMENT_CATEGORIES) {
    const candidates = []
    for (const route of routes) {
      if (used.has(route.id)) continue
      if (!category.methods.includes(route.method)) continue
      if (isAdminPath(route.path)) continue
      const domain = domainOf(route.path)
      if (!domain || !PAYMENT_DOMAIN.test(domain)) continue
      // домен `webhooks` общий — оставляем только платёжные вебхуки
      if (domain.startsWith('webhook') && !PAYMENT_PROVIDER.test(route.path)) continue
      if (category.require && !category.require(route)) continue
      const hit = keywordHit(route.path, category.keywords)
      if (!hit) continue
      let score = hit.weight * 10
      if (PAYMENT_PROVIDER.test(route.path)) score += 3
      score -= depthOf(route.path)
      candidates.push({ route, score })
    }
    const best = pickBest(candidates)
    if (!best) continue
    used.add(best.route.id)
    steps.push(routeStep(best.route, category.title,
      candidates.length > 1 ? `выбран из ${candidates.length} кандидатов` : null))
  }
  return buildJourney({
    id: 'journey:payment',
    label: 'Путь пользователя: оплата и подписка',
    steps,
    note: 'Шаги найдены в платёжных доменах API (billing/payments/subscriptions/checkout/webhooks)',
  })
}

// ── 6.3 Рабочий цикл главной сущности (полный CRUD) ──────────────────────────
const CRUD_SHAPE = [
  { key: 'create', title: 'Создание', methods: ['POST'], collection: true },
  { key: 'list', title: 'Список', methods: ['GET'], collection: true },
  { key: 'read', title: 'Чтение', methods: ['GET'], collection: false },
  { key: 'update', title: 'Изменение', methods: ['PUT', 'PATCH'], collection: false },
  { key: 'delete', title: 'Удаление', methods: ['DELETE'], collection: false },
]

function crudRole(route) {
  const tail = tailSegments(route.path)
  if (tail.length === 1 && !tail[0].startsWith(':')) return 'collection'
  if (tail.length === 2 && tail[1].startsWith(':')) return 'item'
  return null
}

function buildContent(features) {
  const byDomain = new Map()
  for (const route of routes) {
    if (isAdminPath(route.path)) continue
    const domain = domainOf(route.path)
    if (!domain || AUTH_DOMAINS.has(domain) || domain.startsWith('webhook')) continue
    const role = crudRole(route)
    if (!role) continue
    if (!byDomain.has(domain)) byDomain.set(domain, [])
    byDomain.get(domain).push({ route, role })
  }

  let winner = null
  for (const [domain, entries] of [...byDomain].sort((a, b) => a[0].localeCompare(b[0]))) {
    const picks = []
    for (const shape of CRUD_SHAPE) {
      const want = shape.collection ? 'collection' : 'item'
      const found = entries
        .filter((entry) => entry.role === want && shape.methods.includes(entry.route.method))
        .sort((a, b) => a.route.path.localeCompare(b.route.path))[0]
      if (!found) { picks.length = 0; break }
      picks.push({ shape, route: found.route })
    }
    if (!picks.length) continue
    const size = features.find((feature) => feature.slug === domain)?.routes.length ?? entries.length
    if (!winner || size > winner.size || (size === winner.size && domain.localeCompare(winner.domain) < 0)) {
      winner = { domain, picks, size }
    }
  }
  if (!winner) return null

  const label = humanize(winner.domain)
  const steps = winner.picks.map((pick) => routeStep(pick.route, `${pick.shape.title}: ${label}`, null))
  return buildJourney({
    id: 'journey:content',
    label: `Рабочий цикл: ${label}`,
    steps,
    note: `Домен «${winner.domain}» — единственный/крупнейший с полным набором CRUD-роутов (${winner.size} роутов домена)`,
  })
}

// ── 6.4 Уведомления ──────────────────────────────────────────────────────────
const NOTIFY_DOMAIN = /notif|remind|alert|push|digest|message|inbox|subscription-alerts/i
const NOTIFY_CATEGORIES = [
  {
    key: 'subscribe', title: 'Подписка на уведомления', methods: ['POST', 'PUT'],
    keywords: [['register-push-token', 10], ['push-token', 10], ['token', 8], ['subscribe', 9], ['register', 7], ['devices', 6], ['device', 6], ['settings', 4], ['preferences', 5]],
  },
  {
    key: 'trigger', title: 'Отправка уведомления', methods: ['POST'],
    keywords: [['trigger', 10], ['send', 10], ['dispatch', 9], ['notify', 9], ['broadcast', 7], ['test', 4]],
  },
  {
    key: 'read', title: 'Чтение уведомлений', methods: ['GET'],
    keywords: [['notifications', 10], ['notification', 9], ['reminders', 8], ['reminder', 8], ['inbox', 8], ['alerts', 8], ['messages', 6]],
  },
  {
    key: 'ack', title: 'Отметка о прочтении', methods: ['POST', 'PATCH', 'PUT'],
    keywords: [['read', 10], ['seen', 9], ['ack', 9], ['dismiss', 7], ['click', 5], ['mark', 8]],
  },
  {
    key: 'unsubscribe', title: 'Отписка', methods: ['DELETE', 'POST'],
    keywords: [['unregister-push-token', 10], ['unsubscribe', 10], ['unregister', 9], ['mute', 6]],
  },
]

function buildNotification() {
  const used = new Set()
  const steps = []
  for (const category of NOTIFY_CATEGORIES) {
    const candidates = []
    for (const route of routes) {
      if (used.has(route.id)) continue
      if (!category.methods.includes(route.method)) continue
      if (isAdminPath(route.path)) continue
      const domain = domainOf(route.path)
      if (!domain || !NOTIFY_DOMAIN.test(domain)) continue
      const hit = keywordHit(route.path, category.keywords)
      if (!hit) continue
      let score = hit.weight * 10
      score -= depthOf(route.path)
      candidates.push({ route, score })
    }
    const best = pickBest(candidates)
    if (!best) continue
    used.add(best.route.id)
    steps.push(routeStep(best.route, category.title,
      candidates.length > 1 ? `выбран из ${candidates.length} кандидатов` : null))
  }
  // Крон-джобы рассылки — часть цикла уведомлений, но без участия пользователя.
  const notifyCron = crons.filter((cron) => NOTIFY_DOMAIN.test(cron.name) || NOTIFY_DOMAIN.test(cron.file))
  for (const cron of notifyCron.slice(0, 2)) steps.push(cronStep(cron, `Регулярная рассылка: ${cron.name}`))

  return buildJourney({
    id: 'journey:notification',
    label: 'Путь пользователя: уведомления',
    steps,
    note: 'Шаги найдены в доменах уведомлений/напоминаний; очереди и messaging-сервисы'
      + ' в шаги не включаются — их узлы принадлежат другим экстракторам',
  })
}

// ═══════════════ Сборка ══════════════════════════════════════════════════════
await collectAll()
accessStats()

const featureDomains = new Map()
for (const route of routes) {
  const slug = domainOf(route.path)
  if (!slug) continue
  if (!featureDomains.has(slug)) {
    featureDomains.set(slug, { slug, label: humanize(slug), routes: [], publicRoutes: 0, protectedRoutes: 0, file: route.file, line: route.line })
  }
  const feature = featureDomains.get(slug)
  feature.routes.push(route)
  if (route.auth) feature.protectedRoutes++
  else feature.publicRoutes++
}
// source фичи: файл-роутер с наибольшим числом роутов домена + строка первого роута в нём
// (то же правило, что в extract-product — иначе доказательство разошлось бы с узлом).
for (const feature of featureDomains.values()) {
  const byFile = new Map()
  for (const route of feature.routes) {
    const stat = byFile.get(route.file) ?? { count: 0, line: route.line }
    stat.count++
    stat.line = Math.min(stat.line, route.line)
    byFile.set(route.file, stat)
  }
  const [file, stat] = [...byFile].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))[0]
  feature.file = file
  feature.line = stat.line
}
const features = [...featureDomains.values()]
  .filter((feature) => !ADMIN_SEGMENTS.has(feature.slug) && !feature.slug.startsWith('webhook'))

buildOnboarding(authDomains(), features)
buildPayment()
buildContent(features)
buildNotification()

const nodeList = [...nodes.values()]
const edgeList = [...edges.values()]
const stats = {
  journeys: nodeList.length,
  steps: edgeList.length,
  routesSeen: routes.length,
  cronSeen: crons.length,
  publicRoutes,
  protectedRoutes,
  authMiddleware: [...authMiddlewareNames].sort(),
  guardMiddleware: [...guardMiddlewareNames].sort(),
}
writeJson(args.out, partFile({ part: 'journey', root, nodes: nodeList, edges: edgeList, stats }))

if (!nodeList.length) {
  console.log(`archmap extract-journey: сценариев не найдено (${routes.length} роутов, ` +
    'нет ≥2 подтверждённых шагов ни в одном сценарии) → пустой part')
  process.exit(0)
}
console.log(`archmap extract-journey: ${stats.journeys} journeys, ${stats.steps} steps ` +
  `(${publicRoutes} публичных / ${protectedRoutes} защищённых роутов) → ${args.out}`)
for (const node of nodeList) {
  console.log(`  ${node.id}: ${node.meta.stepCount} шагов ` +
    `(${node.meta.confirmedSteps} подтверждено роутами), inferred=${node.inferred}`)
}
