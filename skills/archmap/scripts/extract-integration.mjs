#!/usr/bin/env node
// archmap extract-integration.mjs — фаза 1: МЕХАНИКА интеграций → integration.part.json.
// Внешние системы на карте уже есть (узлы svc:* от extract-env), но по ним не видно,
// КАК система работает: какой модуль её дёргает, какую операцию выполняет, куда
// прилетают вебхуки и проверяется ли их подпись, какие ключи нужны вызову.
// Экстрактор даёт ровно эти рёбра:
//   calls    module:<file> → svc:<slug>       meta{operations[], count, envs[], via, client, hosts}
//   receives svc:<slug>    → route:<M> <path> meta{verified, check, checkAt, evidence}
// Использование: node extract-integration.mjs --root <t> --plan <plan.json> --out <integration.part.json>
//
// Четыре источника вызовов:
//   1) SDK известной системы: import Stripe from 'stripe' → stripe.checkout.sessions.create(…)
//      → операция 'checkout.sessions.create' (цепочка свойств после клиента).
//   2) Фабрика клиента: модуль строит клиента (new Resend(key)) и экспортирует
//      getResendClient(); потребители зовут getResendClient().emails.send(…) — их вызовы
//      тоже попадают на карту, иначе интеграция видна только в одном файле-обёртке.
//   3) HTTP-литерал с известным API-доменом: fetch('https://api.openai.com/v1/…')
//      → операция 'v1/chat' (первые два сегмента пути), meta.via='http'.
//   4) Базовый URL в константе (частый реальный случай: config экспортирует
//      STRIPE_API_BASE_URL='https://api.stripe.com', сервис зовёт new URL('/v1/customers', BASE))
//      → импортирующий модуль получает операции из своих path-литералов.
//
// Узлы (svc/module/route) НЕ создаются: экстрактор ссылается только на уже существующие id
// (extract-env / extract-modules / extract-api). Если системы нет в графе (нет ни зависимости,
// ни env, ни DSN, ни MCP) — ребро не выпускается, иначе merge закрыл бы конец stub-узлом.

import path from 'node:path'
import {
  parseArgs, readText, readJson, lineOfIndex, makeEdge, partFile, writeJson, loadPlan,
} from './lib/core.mjs'
import { loadTypeScript, parseSource, lineOf, resolveImport, RE, matchAll } from './lib/ts.mjs'
import {
  DSN_RE, serviceBySlug, serviceForDep, serviceForEnv, serviceForDsn, serviceForMcp,
  mcpHaystack, mcpEnvNames,
} from './lib/services.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  plan: { flag: '--plan', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.plan || !args.out) {
  console.log('Usage: node extract-integration.mjs --root <target> --plan <plan.json> --out <integration.part.json>')
  process.exit(args.help ? 0 : 1)
}

const root = path.resolve(args.root)
const plan = loadPlan(args.plan)
const planFiles = plan.files ?? {}
const detected = new Set(plan.stacks?.detected ?? [])
const tsAliases = plan.tsAliases ?? {}

// ── typescript целевого репо: только per-file AST, код проекта не исполняется ──
let tsEnv = null
if (plan.stacks?.parser === 'ts') {
  const packageDirs = ['', ...(plan.repo?.packages ?? []).map((pkg) => pkg.path)]
  const loaded = await loadTypeScript(root, packageDirs)
  if (loaded.ts) tsEnv = loaded
}
const ts = tsEnv?.ts ?? null

/* ── Таблицы ────────────────────────────────────────────────────────────────── */

// Слой данных (mongo/postgres/redis/kafka/elastic) — не «интеграция»: его связи уже
// рисуют extract-data (reads/writes) и extract-env (uses). Пустить сюда mongoose
// значило бы залить карту ребром calls от каждой модели к svc:mongodb.
const SKIP_CATEGORIES = new Set(['database', 'cache', 'queue', 'search'])

// Хост API → система. Намеренно только конкретные API-хосты, а не бренд-домены:
// ссылка на stripe.com в тексте не должна становиться интеграцией.
const API_DOMAINS = [
  ['api.stripe.com', 'stripe'], ['files.stripe.com', 'stripe'], ['checkout.stripe.com', 'stripe'],
  ['api.twilio.com', 'twilio'], ['verify.twilio.com', 'twilio'], ['lookups.twilio.com', 'twilio'],
  ['api.openai.com', 'openai'], ['api.anthropic.com', 'anthropic'], ['api.perplexity.ai', 'perplexity'],
  ['api.telegram.org', 'telegram'], ['slack.com', 'slack'], ['hooks.slack.com', 'slack'],
  ['api.github.com', 'github'], ['uploads.github.com', 'github'],
  ['api.resend.com', 'resend'], ['api.sendgrid.com', 'sendgrid'],
  ['api.cloudinary.com', 'cloudinary'], ['res.cloudinary.com', 'cloudinary'],
  ['googleapis.com', 'google'], ['accounts.google.com', 'google'], ['oauth2.googleapis.com', 'google'],
  ['amazonaws.com', 'aws'], ['supabase.co', 'supabase'], ['firebaseio.com', 'firebase'],
  ['api.livekit.io', 'livekit'], ['livekit.cloud', 'livekit'],
  ['itunes.apple.com', 'apple'], ['appleid.apple.com', 'apple'], ['api.push.apple.com', 'apple'],
  ['api.render.com', 'render'], ['api.vercel.com', 'vercel'], ['api.cloudflare.com', 'cloudflare'],
  ['sentry.io', 'sentry'], ['posthog.com', 'posthog'], ['api.datadoghq.com', 'datadog'],
  ['api.firecrawl.dev', 'firecrawl'],
]

// Проверка подписи входящего вебхука: маркер → система (slug:null — маркер общий).
// Это главная находка для безопасности: роут с verified:false принимает всё, что прислали.
const VERIFY_PATTERNS = [
  { name: 'stripe.webhooks.constructEvent', re: /\bwebhooks\.constructEvent(?:Async)?\s*\(/, slug: 'stripe' },
  { name: 'svix', re: /['"]svix['"]|\bsvix-signature\b|\bnew\s+Webhook\s*\(/i, slug: null },
  { name: 'verifyWebhook', re: /\bverify\w*(?:Webhook|Signature|Notification|Transaction)\w*\s*\(/i, slug: null },
  { name: 'x-twilio-signature', re: /x-twilio-signature|\bvalidateRequest\s*\(/i, slug: 'twilio' },
  { name: 'x-hub-signature', re: /x-hub-signature/i, slug: 'github' },
  { name: 'apple SignedDataVerifier', re: /\bSignedDataVerifier\b|\bverifyAndDecodeNotification\b/, slug: 'apple' },
  { name: 'x-goog-signature', re: /x-goog-(?:signature|channel-token)/i, slug: 'google' },
  { name: 'google verifyIdToken', re: /\bverifyIdToken\s*\(/, slug: 'google' },
  { name: 'x-slack-signature', re: /x-slack-signature/i, slug: 'slack' },
  { name: 'x-telegram-bot-api-secret-token', re: /x-telegram-bot-api-secret-token/i, slug: 'telegram' },
  { name: 'hmac', re: /\bcreateHmac\s*\(|\btimingSafeEqual\s*\(/, slug: null },
]
const GENERIC_CHECKS = new Set(['svix', 'verifyWebhook', 'hmac'])

const WEBHOOK_PATH_RE = /webhook|callback|(?:^|[^a-z])hooks?(?:$|[^a-z])/i
const ROUTE_RECEIVER = /^(?:app|router|fastify|server|api)$/
const METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'all'])
const TEST_FILE_RE = /\.(?:test|spec)\.(?:ts|tsx|js|jsx|mjs|cjs)$|__tests__|__mocks__/
// Промис-обвязка вокруг вызова SDK — не операция внешней системы
const IGNORED_OPERATIONS = new Set(['then', 'catch', 'finally', 'toString', 'valueOf'])
const VERIFY_DEPTH = 3 // сколько import-хопов от хендлера искать проверку подписи

/* ── Мелкие утилиты ─────────────────────────────────────────────────────────── */

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const PROTOCOL_RE = /^[a-z][a-z0-9+.-]*:/i

function packageOfSpec (spec) {
  // '@scope/name/sub' → '@scope/name'; 'lodash/fp' → 'lodash'; 'node:fs' / './x' → null
  if (!spec || spec.startsWith('.') || spec.startsWith('/')) return null
  if (PROTOCOL_RE.test(spec)) return null
  const segments = spec.split('/')
  const name = spec.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0]
  if (!name || (spec.startsWith('@') && segments.length < 2)) return null
  return name
}

// Комментарии — не код. Гасим их пробелами (длина и переводы строк сохраняются,
// поэтому индексы и номера строк остаются валидными): слово «stripe» в комментарии
// или в CSS-классе не должно превращаться в интеграцию.
function blankComments (text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:"'`\\])\/\/[^\n]*/g, (whole, prefix) => prefix + ' '.repeat(whole.length - prefix.length))
}

function serviceOfSpec (spec) {
  const pkg = packageOfSpec(spec)
  if (!pkg) return null
  const service = serviceForDep(pkg)
  if (!service || SKIP_CATEGORIES.has(service.category)) return null
  return service
}

function hostOfUrl (url) {
  return url.replace(PROTOCOL_RE, '').replace(/^\/\//, '').split(/[/?#]/)[0].toLowerCase().replace(/:\d+$/, '')
}

function serviceForHost (host) {
  for (const [domain, slug] of API_DOMAINS) {
    if (host === domain || host.endsWith(`.${domain}`)) return slug
  }
  return null
}

function operationOfPath (rawPath, segments = 2) {
  // '/v1/subscriptions/${id}?x=1' → 'v1/subscriptions'
  const parts = String(rawPath)
    .replace(/\$\{[^}]*\}/g, ':param')
    .split(/[?#]/)[0]
    .split('/')
    .filter(Boolean)
  return parts.length ? parts.slice(0, segments).join('/') : null
}

function joinRoutePath (...parts) {
  const joined = '/' + parts.filter(Boolean).join('/')
  return joined.replace(/\/+/g, '/').replace(/(.)\/$/, '$1') || '/'
}

/* ── Аккумуляторы ───────────────────────────────────────────────────────────── */

const callHits = new Map() // `${file} ${slug}` → {operations, sites, line, via, hosts, client}
const webhookRoutes = [] // {file, method, path, line, haystack, handlers[]}
const skippedRoutes = [] // вебхук-роуты, которых не увидит extract-api (чужой receiver)
const knownServices = new Set() // системы, для которых extract-env точно создаст svc-узел
const envNamesByFile = new Map() // file → Set(env-имён) — для meta.envs ребра calls
const importMaps = new Map() // file → Map(локальное имя → {spec, resolved, imported})
const pathLiterals = new Map() // file → [{path, line}] — операции для base-URL констант
const baseUrlConsts = new Map() // `${file} ${NAME}` → slug — экспортированный базовый URL
const factoryExports = new Map() // `${file} ${NAME}` → slug — экспортированная фабрика клиента

// Идемпотентно: место вызова (строка + операция) учитывается один раз, поэтому файл
// безопасно разобрать повторно — вторым проходом по фабрикам клиентов.
function noteCall (file, slug, { operation, line, via, host, client }) {
  if (operation && IGNORED_OPERATIONS.has(operation)) return
  const key = `${file} ${slug}`
  let hit = callHits.get(key)
  if (!hit) {
    hit = { file, slug, operations: new Set(), sites: new Set(), line, via: new Set(), hosts: new Set(), client: false }
    callHits.set(key, hit)
  }
  if (operation) hit.operations.add(operation)
  hit.sites.add(`${line}|${operation ?? ''}`)
  if (line < hit.line) hit.line = line
  if (via) hit.via.add(via)
  if (host) hit.hosts.add(host)
  if (client) hit.client = true
}

/* ── Известные системы: тот же набор доказательств, что и у extract-env ──────
   Экстрактор обязан ссылаться только на существующие svc-узлы, поэтому повторяет
   сбор доказательств (dep / env / dsn / mcp) по той же таблице lib/services.mjs —
   не создавая узлов и не деля состояние с extract-env. */

const noteKnown = (service) => { if (service) knownServices.add(service.slug) }

for (const file of planFiles.packageJson ?? []) {
  const pkg = readJson(path.join(root, file))
  if (!pkg) continue
  for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
    for (const dep of Object.keys(pkg[section] ?? {})) noteKnown(serviceForDep(dep))
  }
}
for (const file of planFiles.envFiles ?? []) {
  const text = readText(path.join(root, file))
  if (!text) continue
  for (const line of text.split('\n')) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)\s*=/)
    if (match) noteKnown(serviceForEnv(match[1]))
  }
}
for (const file of planFiles.mcpJson ?? []) {
  const json = readJson(path.join(root, file))
  for (const [name, config] of Object.entries(json?.mcpServers ?? {})) {
    noteKnown(serviceForMcp(name, mcpHaystack(config)))
    for (const variable of mcpEnvNames(config)) noteKnown(serviceForEnv(variable))
  }
}

/* ── Импорты: локальное имя → откуда пришло ─────────────────────────────────── */

function clauseNames (clause) {
  // 'Stripe' | '* as twilio' | '{ Resend, type Foo, a as b }' → [{local, imported}]
  const names = []
  const namespace = /\*\s*as\s+([A-Za-z_$][\w$]*)/.exec(clause)
  if (namespace) names.push({ local: namespace[1], imported: '*' })
  const defaultName = /^\s*([A-Za-z_$][\w$]*)\s*(?:,|$)/.exec(clause.replace(/\{[\s\S]*?\}/g, ''))
  if (defaultName) names.push({ local: defaultName[1], imported: 'default' })
  const named = /\{([\s\S]*?)\}/.exec(clause)
  if (named) {
    for (const piece of named[1].split(',')) {
      if (/^\s*type\s/.test(piece)) continue
      const entry = /^\s*([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?\s*$/.exec(piece)
      if (entry) names.push({ local: entry[2] ?? entry[1], imported: entry[1] })
    }
  }
  return names
}

const IMPORT_STATEMENT_RE = /\bimport\s+(?!type\s)([\s\S]*?)\s+from\s+['"]([^'"]+)['"]/g
const REQUIRE_STATEMENT_RE = /\b(?:const|let|var)\s+([\s\S]{0,120}?)\s*=\s*require\s*\(\s*['"]([^'"]+)['"]\s*\)/g

function collectImportMap (file, text) {
  // Нужно трижды: для SDK-биндингов, для модуля хендлера вебхука и для констант базового URL.
  const map = new Map()
  for (const regex of [IMPORT_STATEMENT_RE, REQUIRE_STATEMENT_RE]) {
    for (const { match } of matchAll(regex, text)) {
      const spec = match[2]
      const resolved = resolveImport(root, file, spec, tsAliases)
      for (const { local, imported } of clauseNames(match[1])) map.set(local, { spec, resolved, imported })
    }
  }
  importMaps.set(file, map)
  return map
}

/* ── 1+2. SDK известной системы и фабрики клиентов ──────────────────────────── */

function chainInfo (node) {
  // CallExpression → {root, operation}: 'a.b.c()' → root 'a', operation 'b.c'.
  if (!ts.isPropertyAccessExpression(node.expression)) return null
  const parts = []
  let cursor = node.expression
  while (ts.isPropertyAccessExpression(cursor)) {
    parts.unshift(cursor.name.text)
    cursor = cursor.expression
  }
  if (!parts.length) return null
  if (ts.isIdentifier(cursor)) return { root: cursor.text, operation: parts.join('.') }
  if (cursor.kind === ts.SyntaxKind.ThisKeyword) {
    // this.stripe.checkout.sessions.create() — клиент живёт в поле класса
    return parts.length < 2 ? null : { root: `this.${parts[0]}`, operation: parts.slice(1).join('.') }
  }
  // new AccessToken(…).toJwt(), twilio(sid, token).messages.create(…), getResendClient().emails.send(…)
  if ((ts.isNewExpression(cursor) || ts.isCallExpression(cursor)) && ts.isIdentifier(cursor.expression)) {
    return { root: cursor.expression.text, operation: parts.join('.') }
  }
  return null
}

function collectSdkCallsAst (file, text, seeds = null) {
  const sourceFile = parseSource(ts, file, text)
  const bindings = new Map(seeds ?? []) // имя (в т.ч. 'this.x') → slug
  const classes = new Map() // импортированный идентификатор → slug (для new X())

  const bindImport = (spec, names) => {
    const service = serviceOfSpec(spec)
    if (!service) return
    for (const name of names) {
      bindings.set(name, service.slug)
      classes.set(name, service.slug)
    }
  }
  const visitImports = (node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const clause = node.importClause
      if (clause && !clause.isTypeOnly) {
        const names = []
        if (clause.name) names.push(clause.name.text)
        const bound = clause.namedBindings
        if (bound && ts.isNamespaceImport(bound)) names.push(bound.name.text)
        else if (bound) for (const element of bound.elements) if (!element.isTypeOnly) names.push(element.name.text)
        bindImport(node.moduleSpecifier.text, names)
      }
    } else if (ts.isVariableDeclaration(node) && node.initializer && ts.isCallExpression(node.initializer)
      && ts.isIdentifier(node.initializer.expression) && node.initializer.expression.text === 'require'
      && node.initializer.arguments.length && ts.isStringLiteral(node.initializer.arguments[0])) {
      const names = ts.isIdentifier(node.name)
        ? [node.name.text]
        : (node.name.elements ?? []).filter((element) => element.name && ts.isIdentifier(element.name))
          .map((element) => element.name.text)
      bindImport(node.initializer.arguments[0].text, names)
    }
    ts.forEachChild(node, visitImports)
  }
  visitImports(sourceFile)
  if (!bindings.size) return

  // Производные клиенты: const stripe = new Stripe(key) / client = twilio(sid) /
  // this.client = getResendClient() — фабрика тоже даёт клиента нужной системы.
  const factorySlug = (expression) => {
    if (!expression) return null
    const callee = ts.isNewExpression(expression) || ts.isCallExpression(expression) ? expression.expression : null
    if (!callee) return null
    if (ts.isIdentifier(callee)) return classes.get(callee.text) ?? bindings.get(callee.text) ?? null
    if (ts.isPropertyAccessExpression(callee) && ts.isIdentifier(callee.expression)) {
      return classes.get(callee.expression.text) ?? null
    }
    return null
  }
  const visitBindings = (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)) {
      const slug = factorySlug(node.initializer)
      if (slug) bindings.set(node.name.text, slug)
    } else if (ts.isPropertyDeclaration(node) && ts.isIdentifier(node.name)) {
      const slug = factorySlug(node.initializer)
      if (slug) bindings.set(`this.${node.name.text}`, slug)
    } else if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
      const slug = factorySlug(node.right)
      if (slug && ts.isIdentifier(node.left)) bindings.set(node.left.text, slug)
      if (slug && ts.isPropertyAccessExpression(node.left) && node.left.expression.kind === ts.SyntaxKind.ThisKeyword) {
        bindings.set(`this.${node.left.name.text}`, slug)
      }
    }
    ts.forEachChild(node, visitBindings)
  }
  visitBindings(sourceFile)

  // Функция, внутри которой строится клиент, — фабрика: её экспорт делает интеграцию
  // доступной всему репо, и вызовы потребителей нужно приписать им, а не обёртке.
  const localFactories = new Map()
  const localClients = new Map() // export const stripe = new Stripe(…) — клиент как значение
  const buildsClient = (node) => {
    let slug = null
    const scan = (child) => {
      if (slug) return
      if (ts.isNewExpression(child) && ts.isIdentifier(child.expression) && classes.has(child.expression.text)) {
        slug = classes.get(child.expression.text)
        return
      }
      if (ts.isReturnStatement(child) && child.expression && ts.isIdentifier(child.expression)) {
        slug = bindings.get(child.expression.text) ?? slug
      }
      ts.forEachChild(child, scan)
    }
    scan(node)
    return slug
  }
  const hasExport = (node) => node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
  const exportedClients = new Set()
  const exportedNames = new Set()
  const aliasOf = new Map() // экспортируемое имя → локальное
  const visitDeclarations = (node) => {
    if (ts.isFunctionDeclaration(node) && node.name) {
      const slug = buildsClient(node)
      if (slug) localFactories.set(node.name.text, slug)
      if (hasExport(node)) exportedNames.add(node.name.text)
    } else if (ts.isVariableStatement(node)) {
      for (const declaration of node.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name)) continue
        const direct = factorySlug(declaration.initializer)
        if (direct) localClients.set(declaration.name.text, direct)
        if (direct && hasExport(node)) exportedClients.add(direct)
        const initializer = declaration.initializer
        if (initializer && (ts.isArrowFunction(initializer) || ts.isFunctionExpression(initializer))) {
          const slug = buildsClient(initializer)
          if (slug) localFactories.set(declaration.name.text, slug)
        }
        if (hasExport(node)) exportedNames.add(declaration.name.text)
      }
    } else if (ts.isExportAssignment(node)) {
      const slug = factorySlug(node.expression)
      if (slug) exportedClients.add(slug)
    } else if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
      for (const element of node.exportClause.elements) {
        exportedNames.add(element.name.text)
        aliasOf.set(element.name.text, (element.propertyName ?? element.name).text)
      }
    }
    ts.forEachChild(node, visitDeclarations)
  }
  visitDeclarations(sourceFile)
  for (const name of exportedNames) {
    const local = aliasOf.get(name) ?? name
    const slug = localFactories.get(local) ?? localClients.get(local)
    if (slug) factoryExports.set(`${file} ${name}`, slug)
  }

  const visitCalls = (node) => {
    if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && classes.has(node.expression.text)) {
      // Сама конструкция клиента — точка интеграции: здесь живут ключи и настройки.
      noteCall(file, classes.get(node.expression.text), {
        operation: `new ${node.expression.text}`, line: lineOf(sourceFile, node), via: 'sdk', client: true,
      })
    } else if (ts.isCallExpression(node)) {
      const chain = chainInfo(node)
      const slug = chain && bindings.get(chain.root)
      if (slug) {
        let operation = chain.operation
        // AWS SDK v3: s3.send(new PutObjectCommand(…)) — операция живёт в команде
        if (operation === 'send' && node.arguments.length && ts.isNewExpression(node.arguments[0])
          && ts.isIdentifier(node.arguments[0].expression) && classes.has(node.arguments[0].expression.text)) {
          operation = node.arguments[0].expression.text
        }
        noteCall(file, slug, {
          operation, line: lineOf(sourceFile, node), via: 'sdk', client: exportedClients.has(slug),
        })
      }
    }
    ts.forEachChild(node, visitCalls)
  }
  visitCalls(sourceFile)
}

function collectSdkCallsRegex (file, text, seeds = null) {
  const bindings = new Map(seeds ?? [])
  const classes = new Map()
  for (const [name, entry] of importMaps.get(file) ?? []) {
    const service = serviceOfSpec(entry.spec)
    if (!service) continue
    bindings.set(name, service.slug)
    classes.set(name, service.slug)
  }
  if (!bindings.size) return
  for (const [name, slug] of [...bindings]) {
    const factory = new RegExp(
      `(?:(?:const|let|var)\\s+([A-Za-z_$][\\w$]*)|this\\.([A-Za-z_$][\\w$]*)|\\b([A-Za-z_$][\\w$]*))\\s*(?::[^=\\n]+)?=\\s*(?:await\\s+)?(?:new\\s+)?${escapeRegExp(name)}\\s*\\(`,
      'g',
    )
    for (const { match } of matchAll(factory, text)) {
      bindings.set(match[1] ?? (match[2] ? `this.${match[2]}` : match[3]), slug)
    }
  }
  const exportedClient = new Set()
  for (const [name, slug] of bindings) {
    const exported = new RegExp(`export\\s+(?:const|let|var|default)\\s+[^=\\n]*=\\s*(?:await\\s+)?(?:new\\s+)?${escapeRegExp(name)}\\s*\\(`)
    if (exported.test(text)) exportedClient.add(slug)
  }
  for (const [name, slug] of classes) {
    for (const { index } of matchAll(new RegExp(`\\bnew\\s+${escapeRegExp(name)}\\s*\\(`, 'g'), text)) {
      noteCall(file, slug, { operation: `new ${name}`, line: lineOfIndex(text, index), via: 'sdk', client: true })
    }
    // Экспортированная фабрика в regex-режиме: имя функции, в теле которой строится клиент
    const factoryRe = new RegExp(
      `export\\s+(?:async\\s+)?(?:function\\s+([A-Za-z_$][\\w$]*)|(?:const|let|var)\\s+([A-Za-z_$][\\w$]*)\\s*(?::[^=\\n]+)?=)[\\s\\S]{0,600}?\\bnew\\s+${escapeRegExp(name)}\\s*\\(`,
      'g',
    )
    for (const { match } of matchAll(factoryRe, text)) {
      factoryExports.set(`${file} ${match[1] ?? match[2]}`, slug)
    }
  }
  for (const [name, slug] of bindings) {
    const call = new RegExp(`\\b${escapeRegExp(name)}\\s*(?:\\([^()\\n]{0,200}\\))?((?:\\.[A-Za-z_$][\\w$]*)+)\\s*\\(`, 'g')
    for (const { match, index } of matchAll(call, text)) {
      noteCall(file, slug, {
        operation: match[1].slice(1), line: lineOfIndex(text, index), via: 'sdk', client: exportedClient.has(slug),
      })
    }
  }
}

/* ── 3. HTTP-вызовы к известным API-доменам ─────────────────────────────────── */

const URL_LITERAL_RE = /['"`]((?:https?):\/\/[^'"`\s]{4,200})['"`]?/g
// URL под таким ключом — иллюстрация в схеме/доке, а не вызов: "example: https://…".
const DOC_KEY_RE = /\b(?:examples?|description|summary|title|docs?|documentation|link|href|placeholder|sample|note|label)\s*:\s*$/i

function collectHttpCalls (file, text) {
  for (const { match, index } of matchAll(URL_LITERAL_RE, text)) {
    const host = hostOfUrl(match[1])
    const slug = serviceForHost(host)
    if (!slug) continue
    if (DOC_KEY_RE.test(text.slice(Math.max(0, index - 60), index))) continue
    const line = lineOfIndex(text, index)
    const urlPath = match[1].replace(/^[a-z][a-z0-9+.-]*:\/\/[^/]*/i, '')
    noteCall(file, slug, { operation: operationOfPath(urlPath), line, via: 'http', host })
    // const STRIPE_API_BASE_URL = 'https://api.stripe.com' — базовый URL, который
    // импортируют вызывающие модули: запоминаем имя, чтобы найти их операции.
    const before = text.slice(Math.max(0, index - 220), index)
    const declaration = /(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)[^=;\n]*=\s*[^;]*$/.exec(before)
    if (declaration) baseUrlConsts.set(`${file} ${declaration[1]}`, slug)
  }
}

const PATH_LITERAL_RE = /[(,]\s*(['"`])(\/[A-Za-z0-9][^'"`\n]{0,120}?)\1/g

function collectPathLiterals (file, text) {
  const found = []
  for (const { match, index } of matchAll(PATH_LITERAL_RE, text)) {
    found.push({ path: match[2], line: lineOfIndex(text, index) })
    if (found.length >= 60) break
  }
  if (found.length) pathLiterals.set(file, found)
}

/* ── 4. Входящие вебхуки: роуты + проверка подписи ──────────────────────────── */

function collectWebhookRoutesAst (file, text) {
  const sourceFile = parseSource(ts, file, text)
  const isStringy = (node) => ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
  const push = (record, receiver) => {
    if (!WEBHOOK_PATH_RE.test(record.path)) return
    if (!ROUTE_RECEIVER.test(receiver)) {
      // extract-api видит роуты только у app/router/fastify/server/api — route-узла
      // для остальных в графе нет, и ребро к нему стало бы stub-ом. Отдаём в лог.
      skippedRoutes.push({ file, receiver, ...record })
      return
    }
    webhookRoutes.push({ file, ...record })
  }
  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
      && ts.isIdentifier(node.expression.expression)) {
      const receiver = node.expression.expression.text
      const callName = node.expression.name.text
      const callArgs = node.arguments
      if (METHODS.has(callName) && callArgs.length && isStringy(callArgs[0]) && callArgs[0].text.startsWith('/')) {
        push({
          method: callName.toUpperCase(), path: callArgs[0].text, line: lineOf(sourceFile, node),
          haystack: node.getText(sourceFile),
          handlers: callArgs.slice(1).filter((argument) => ts.isIdentifier(argument)).map((argument) => argument.text),
        }, receiver)
      } else if (callName === 'route' && callArgs.length === 1 && ts.isObjectLiteralExpression(callArgs[0])) {
        let method = null
        let url = null
        const handlers = []
        for (const property of callArgs[0].properties) {
          if (!ts.isPropertyAssignment(property)) continue
          const key = ts.isIdentifier(property.name) || ts.isStringLiteral(property.name) ? property.name.text : ''
          if (key === 'method' && isStringy(property.initializer)) method = property.initializer.text
          if (key === 'url' && isStringy(property.initializer)) url = property.initializer.text
          if (key === 'handler' && ts.isIdentifier(property.initializer)) handlers.push(property.initializer.text)
        }
        if (method && url) {
          push({
            method: method.toUpperCase(), path: url, line: lineOf(sourceFile, node),
            haystack: node.getText(sourceFile), handlers,
          }, receiver)
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
}

const ANY_ROUTE_RE = /\b([A-Za-z_$][\w$]*)\.(get|post|put|patch|delete|head|options|all)\s*\(\s*[`'"](\/[^`'"]*)[`'"]/g

function collectWebhookRoutesRegex (file, text) {
  const record = (receiver, method, routePath, index) => {
    if (!WEBHOOK_PATH_RE.test(routePath)) return
    const haystack = text.slice(index, Math.min(text.length, index + 800))
    const handlers = []
    for (const { match } of matchAll(/[,(]\s*([A-Za-z_$][\w$]*)\s*[,)]/g, haystack)) handlers.push(match[1])
    const entry = {
      file, method: method.toUpperCase(), path: routePath, line: lineOfIndex(text, index), haystack, handlers,
    }
    if (ROUTE_RECEIVER.test(receiver)) webhookRoutes.push(entry)
    else skippedRoutes.push({ ...entry, receiver })
  }
  for (const { match, index } of matchAll(ANY_ROUTE_RE, text)) record(match[1], match[2], match[3], index)
  for (const { match, index } of matchAll(RE.fastifyRoute, text)) record('fastify', match[1], match[2], index)
}

function collectNestWebhookRoutes (file, text) {
  const controllers = matchAll(RE.nestController, text)
  controllers.forEach((controller, position) => {
    const prefix = controller.match[1] ?? ''
    const end = controllers[position + 1]?.index ?? text.length
    const segment = text.slice(controller.index, end)
    for (const { match, index } of matchAll(RE.nestMethod, segment)) {
      const routePath = joinRoutePath(prefix, match[2] ?? '')
      if (!WEBHOOK_PATH_RE.test(routePath)) continue
      webhookRoutes.push({
        file, method: match[1].toUpperCase(), path: routePath,
        line: lineOfIndex(text, controller.index + index),
        haystack: segment.slice(index, index + 1200), handlers: [],
      })
    }
  })
}

const NEXT_METHOD = 'GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS'
const NEXT_EXPORT = new RegExp(`export\\s+(?:async\\s+)?(?:function\\s+(${NEXT_METHOD})\\b|const\\s+(${NEXT_METHOD})\\s*=)`, 'g')

function nextPathFromSegments (segments) {
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

function collectNextWebhookRoutes () {
  for (const file of planFiles.nextApp ?? []) {
    const match = /(?:^|\/)app\/(.+)\/route\.(?:ts|tsx|js|jsx)$/.exec(file)
    if (!match) continue
    const routePath = nextPathFromSegments(match[1])
    if (!WEBHOOK_PATH_RE.test(routePath)) continue
    const raw = readText(path.join(root, file))
    if (!raw) continue
    const text = blankComments(raw)
    for (const { match: exported, index } of matchAll(NEXT_EXPORT, text)) {
      webhookRoutes.push({
        file, method: (exported[1] ?? exported[2]).toUpperCase(), path: routePath,
        line: lineOfIndex(text, index), haystack: text, handlers: [],
      })
    }
  }
}

/* ── Главный проход по code-файлам ──────────────────────────────────────────── */

const httpFrameworks = detected.has('fastify') || detected.has('express')
for (const file of planFiles.code ?? []) {
  const raw = readText(path.join(root, file))
  if (raw === null) continue
  const text = blankComments(raw)

  // Доказательства для knownServices собираем по ВСЕМ файлам (как extract-env),
  // а сами интеграции — только по продуктовому коду: тесты мокают SDK.
  const names = new Set()
  for (const { match } of matchAll(RE.envAccess, text)) names.add(match[1] ?? match[2])
  if (names.size) envNamesByFile.set(file, names)
  for (const name of names) noteKnown(serviceForEnv(name))
  for (const { match } of matchAll(DSN_RE, text)) noteKnown(serviceForDsn(match[1]))
  if (TEST_FILE_RE.test(file)) continue

  collectImportMap(file, text)
  if (ts) collectSdkCallsAst(file, text)
  else collectSdkCallsRegex(file, text)
  collectHttpCalls(file, text)
  collectPathLiterals(file, text)

  if (httpFrameworks) {
    if (ts) collectWebhookRoutesAst(file, text)
    else collectWebhookRoutesRegex(file, text)
  }
  if (detected.has('nestjs') && text.includes('@Controller')) collectNestWebhookRoutes(file, text)
}
collectNextWebhookRoutes()

/* ── Второй проход: потребители фабрик клиентов ─────────────────────────────── */
// getResendClient() из utils/resend-client.ts → в email-provider-service.ts
// `const resend = getResendClient(); resend.emails.send(…)` — вызов должен висеть
// на сервисе, а не на файле-обёртке. noteCall идемпотентен, повтор безопасен.

for (const [file, imports] of importMaps) {
  const seeds = new Map()
  for (const [local, entry] of imports) {
    if (!entry.resolved) continue
    const slug = factoryExports.get(`${entry.resolved} ${entry.imported === 'default' ? local : entry.imported}`)
    if (slug) seeds.set(local, slug)
  }
  if (!seeds.size) continue
  const raw = readText(path.join(root, file))
  if (raw === null) continue
  const text = blankComments(raw)
  if (ts) collectSdkCallsAst(file, text, seeds)
  else collectSdkCallsRegex(file, text, seeds)
}

/* ── Базовый URL в константе → операции вызывающего модуля ──────────────────── */

for (const [file, imports] of importMaps) {
  const slugs = new Set()
  for (const [local, entry] of imports) {
    if (!entry.resolved) continue
    const slug = baseUrlConsts.get(`${entry.resolved} ${entry.imported === 'default' ? local : entry.imported}`)
    if (slug) slugs.add(slug)
  }
  // Однозначность обязательна: файл, тянущий базовые URL двух систем, не даёт
  // сказать, к какой из них относится путь '/v1/…' — такие пропускаем.
  if (slugs.size !== 1) continue
  const [slug] = slugs
  for (const literal of pathLiterals.get(file) ?? []) {
    const operation = operationOfPath(literal.path)
    if (operation) noteCall(file, slug, { operation, line: literal.line, via: 'http' })
  }
}

/* ── Материализация рёбер calls ─────────────────────────────────────────────── */

const edges = []
const droppedServices = new Set()

for (const hit of [...callHits.values()].sort((a, b) => a.file.localeCompare(b.file) || a.slug.localeCompare(b.slug))) {
  if (!knownServices.has(hit.slug)) {
    droppedServices.add(hit.slug)
    continue
  }
  const operations = [...hit.operations].sort()
  const envs = [...(envNamesByFile.get(hit.file) ?? [])]
    .filter((name) => serviceForEnv(name)?.slug === hit.slug)
    .sort()
  const meta = { operations, count: hit.sites.size, via: [...hit.via].sort().join('+') || 'sdk' }
  if (envs.length) meta.envs = envs
  if (hit.hosts.size) meta.hosts = [...hit.hosts].sort()
  if (hit.client) meta.client = true
  const label = operations.length
    ? (operations.length > 1 ? `${operations[0]} +${operations.length - 1}` : operations[0])
    : 'call'
  edges.push(makeEdge({
    kind: 'calls', from: `module:${hit.file}`, to: `svc:${hit.slug}`, label,
    source: { file: hit.file, line: hit.line }, meta,
  }))
}

/* ── Материализация рёбер receives ──────────────────────────────────────────── */

const textCache = new Map()
function textOf (file) {
  if (!textCache.has(file)) {
    const raw = readText(path.join(root, file))
    textCache.set(file, raw ? blankComments(raw) : '')
  }
  return textCache.get(file)
}

function checksIn (text, file, line) {
  const found = []
  for (const pattern of VERIFY_PATTERNS) {
    const regex = new RegExp(pattern.re.source, pattern.re.flags.replace('g', ''))
    const match = regex.exec(text)
    if (match) found.push({ ...pattern, at: `${file}:${line ?? lineOfIndex(text, match.index)}` })
  }
  return found
}

function deepCheck (startFiles, slug) {
  // Проверка подписи часто лежит на 2-3 импорта глубже хендлера (контроллер →
  // сервис → verifier). Вглубь принимаем ТОЛЬКО маркеры самой системы: общие
  // (hmac, verifyWebhook) там дали бы ложные «проверено».
  const seen = new Set(startFiles)
  let frontier = [...startFiles]
  for (let depth = 2; depth <= VERIFY_DEPTH; depth++) {
    const next = []
    for (const file of frontier) {
      for (const entry of (importMaps.get(file) ?? new Map()).values()) {
        if (!entry.resolved || seen.has(entry.resolved)) continue
        seen.add(entry.resolved)
        next.push(entry.resolved)
        const text = textOf(entry.resolved)
        if (!text) continue
        const hit = checksIn(text, entry.resolved).find((check) => check.slug === slug)
        if (hit) return { ...hit, depth }
      }
    }
    frontier = next
    if (!frontier.length) break
  }
  return null
}

function serviceFromPath (routePath) {
  const tokens = new Set(routePath.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean))
  for (const slug of knownServices) if (tokens.has(slug)) return slug
  return null
}

const receives = []
for (const route of webhookRoutes) {
  // Глубина 0-1: сам роут + модуль хендлера. Здесь принимаются все маркеры.
  const handlerFiles = []
  const imports = importMaps.get(route.file)
  for (const name of route.handlers) {
    const entry = imports?.get(name)
    if (entry?.resolved) handlerFiles.push(entry.resolved)
  }
  const checks = checksIn(route.haystack, route.file, route.line)
  for (const file of handlerFiles) checks.push(...checksIn(textOf(file), file))

  const fromPath = serviceFromPath(route.path)
  const fromCheck = checks.map((check) => check.slug).find((slug) => slug && knownServices.has(slug)) ?? null
  const slug = fromPath ?? fromCheck
  if (!slug || !knownServices.has(slug)) continue

  let deep = null
  if (!checks.length || !checks.some((check) => check.slug === slug || GENERIC_CHECKS.has(check.name))) {
    deep = deepCheck([route.file, ...handlerFiles], slug)
  }
  const all = deep ? [...checks, deep] : checks
  const meta = {
    verified: all.length > 0,
    evidence: fromPath && fromCheck ? 'path+signature' : (fromPath ? 'path' : 'signature'),
    method: route.method,
    path: route.path,
  }
  if (all.length) {
    meta.check = [...new Set(all.map((check) => check.name))].join(', ')
    meta.checkAt = all[0].at
    if (deep) meta.checkDepth = deep.depth
  }
  receives.push({ slug, route, meta })
  edges.push(makeEdge({
    kind: 'receives', from: `svc:${slug}`, to: `route:${route.method} ${route.path}`,
    label: 'webhook', source: { file: route.file, line: route.line }, meta,
  }))
}

/* ── Запись part-файла ──────────────────────────────────────────────────────── */

const callEdges = edges.filter((edge) => edge.kind === 'calls')
const receiveEdges = edges.filter((edge) => edge.kind === 'receives')
const bySystem = {}
for (const edge of callEdges) {
  const slug = edge.to.slice('svc:'.length)
  const entry = bySystem[slug] ?? (bySystem[slug] = { modules: 0, calls: 0, operations: new Set() })
  entry.modules++
  entry.calls += edge.meta.count
  for (const operation of edge.meta.operations) entry.operations.add(operation)
}
const stats = {
  callEdges: callEdges.length,
  receivesEdges: receiveEdges.length,
  verifiedWebhooks: receiveEdges.filter((edge) => edge.meta.verified).length,
  systems: Object.keys(bySystem).length,
  clients: callEdges.filter((edge) => edge.meta.client).length,
  parser: ts ? 'ts' : 'regex',
  byService: Object.fromEntries(Object.keys(bySystem).sort().map((slug) => [slug, {
    modules: bySystem[slug].modules,
    calls: bySystem[slug].calls,
    operations: [...bySystem[slug].operations].sort(),
  }])),
  skippedRoutes: skippedRoutes.length,
  droppedServices: [...droppedServices].sort(),
}
writeJson(args.out, partFile({ part: 'integration', root, nodes: [], edges, stats }))

console.log(`archmap extract-integration: ${stats.callEdges} calls (${stats.systems} систем), ` +
  `${stats.receivesEdges} receives (${stats.verifiedWebhooks} с проверкой подписи), ` +
  `${stats.clients} клиентов, parser=${stats.parser} → ${args.out}`)
for (const [slug, entry] of Object.entries(stats.byService)) {
  const label = serviceBySlug(slug)?.label ?? slug
  const shown = entry.operations.slice(0, 6).join(', ')
  console.log(`  ${label}: ${entry.modules} модулей, ${entry.calls} вызовов` +
    (entry.operations.length ? ` — ${shown}${entry.operations.length > 6 ? ` и ещё ${entry.operations.length - 6}` : ''}` : ''))
}
for (const { slug, route, meta } of receives) {
  console.log(`  вебхук ${meta.method} ${meta.path} ← ${serviceBySlug(slug)?.label ?? slug}` +
    ` [${meta.verified ? `подпись: ${meta.check} @ ${meta.checkAt}` : 'БЕЗ проверки подписи'}] ${route.file}:${route.line}`)
}
if (stats.droppedServices.length) {
  console.log(`  пропущены системы без узла svc (нет зависимости/env/DSN/MCP): ${stats.droppedServices.join(', ')}`)
}
if (skippedRoutes.length) {
  console.log('  вебхук-роуты вне видимости extract-api (receiver не app/router/fastify/server/api): ' +
    skippedRoutes.map((route) => `${route.method} ${route.path} (${route.receiver}, ${route.file}:${route.line})`).join('; '))
}
