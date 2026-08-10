#!/usr/bin/env node
// archmap extract-api.mjs — фаза 1: API-слой → api.part.json.
// Роуты (Fastify/Express/NestJS/Next.js App Router), WebSocket, cron, вебхуки,
// MCP-серверы (.mcp.json) и MCP-инструменты (@modelcontextprotocol/sdk).
// Использование: node extract-api.mjs --root <target> --plan <plan.json> --out <api.part.json>
// Нет api-стеков и MCP → пустой part, exit 0. Каждый узел с source:{file,line}.
// При plan.stacks.parser === 'ts' роуты извлекаются точнее через per-file AST
// (handler file:line:name, options), иначе regex-fallback с meta.parser:'regex'.

import path from 'node:path'
import {
  parseArgs, readText, readJson, lineOfIndex, makeNode, makeEdge, partFile, writeJson, loadPlan,
} from './lib/core.mjs'
import { loadTypeScript, parseSource, lineOf, RE, matchAll } from './lib/ts.mjs'
import { serviceForMcp, mcpHaystack, mcpEnvNames } from './lib/services.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  plan: { flag: '--plan', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.plan || !args.out) {
  console.log('Usage: node extract-api.mjs --root <target> --plan <plan.json> --out <api.part.json>')
  process.exit(args.help ? 0 : 1)
}

const root = path.resolve(args.root)
const plan = loadPlan(args.plan)
const detected = new Set(plan.stacks?.detected ?? [])
const planFiles = plan.files ?? {}

const API_STACKS = ['fastify', 'express', 'nestjs', 'nextjs', 'websocket', 'cron', 'mcp']
const hasApiStack = API_STACKS.some((stack) => detected.has(stack))
const hasNextApp = (planFiles.nextApp ?? []).some((file) => /(^|\/)route\.(ts|tsx|js|jsx)$/.test(file))
const hasMcpJson = (planFiles.mcpJson ?? []).length > 0
if (!hasApiStack && !hasMcpJson && !hasNextApp) {
  writeJson(args.out, partFile({ part: 'api', root, nodes: [], edges: [] }))
  console.log('archmap extract-api: no api stacks detected → empty part')
  process.exit(0)
}

// ── typescript целевого репо (только per-file AST, код проекта не исполняется) ──
let tsEnv = null
if (plan.stacks?.parser === 'ts') {
  const packageDirs = ['', ...(plan.repo?.packages ?? []).map((pkg) => pkg.path)]
  const loaded = await loadTypeScript(root, packageDirs)
  if (loaded.ts) tsEnv = loaded
}
const parserTag = tsEnv ? null : 'regex'

// ── Аккумуляторы (Map по id: первый выигрывает; файлы идут отсортированно) ──
const nodes = new Map()
const edges = new Map()
const addNode = (node) => {
  if (!nodes.has(node.id)) nodes.set(node.id, node)
  return nodes.get(node.id)
}
const addEdge = (edge) => {
  if (!edges.has(edge.id)) edges.set(edge.id, edge)
}

const METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'all'])
const AUTH_HINT = /auth|guard|protect|jwt|session|token|acl/i

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function joinPath(...parts) {
  const joined = '/' + parts.filter(Boolean).join('/')
  const normalized = joined.replace(/\/+/g, '/').replace(/(.)\/$/, '$1')
  return normalized || '/'
}

function pathParams(routePath) {
  const params = []
  for (const { match } of matchAll(/:([A-Za-z0-9_]+)\*?/g, routePath)) {
    params.push({ name: match[1], in: 'path', type: 'string', required: true })
  }
  return params
}

function addMiddleware(name, file, line) {
  addNode(makeNode({
    id: `middleware:${name}`, kind: 'middleware', layer: 'api', label: name,
    source: { file, line }, meta: parserTag ? { parser: parserTag } : {},
  }))
}

// record: {method, path, line, framework, middleware[], handler{file,line,name}|null, parser?}
function addRoute(file, record) {
  const method = record.method.toUpperCase()
  const id = `route:${method} ${record.path}`
  const middleware = [...new Set(record.middleware ?? [])]
  const handler = record.handler ?? { file, line: record.line }
  const meta = {
    framework: record.framework,
    method,
    path: record.path,
    params: pathParams(record.path),
    middleware,
    handler,
  }
  if (middleware.some((name) => AUTH_HINT.test(name))) meta.auth = true
  if (record.parser ?? parserTag) meta.parser = record.parser ?? parserTag
  const kind = record.path.toLowerCase().includes('webhook') ? 'webhook' : 'route'
  addNode(makeNode({
    id, kind, layer: 'api', label: `${method} ${record.path}`,
    source: { file, line: record.line }, meta,
  }))
  // handles: route → module хендлера; module-узел даст modules-экстрактор или stub от merge
  addEdge(makeEdge({
    kind: 'handles', from: id, to: `module:${handler.file ?? file}`,
    source: { file, line: record.line },
  }))
  for (const name of middleware) {
    addMiddleware(name, file, record.line)
    addEdge(makeEdge({
      kind: 'guards', from: `middleware:${name}`, to: id,
      source: { file, line: record.line },
    }))
  }
  return id
}

function addWs(wsPath, file, line, framework) {
  const meta = { path: wsPath, framework }
  if (parserTag) meta.parser = parserTag
  addNode(makeNode({
    id: `ws:${wsPath}`, kind: 'ws', layer: 'api', label: `WS ${wsPath}`,
    source: { file, line }, meta,
  }))
}

function addCron(name, schedule, file, line, extraMeta = {}) {
  const meta = { schedule, ...extraMeta }
  if (parserTag && !extraMeta.platform) meta.parser = parserTag
  addNode(makeNode({
    id: `cron:${name}`, kind: 'cron', layer: 'api', label: name,
    source: { file, line }, meta,
  }))
}

// ── HTTP-роуты: общий materialize для AST- и regex-пути ─────────────────────
function materializeHttp(file, { routes, uses }) {
  const routeIds = []
  for (const record of routes) {
    if (record.ws) {
      addWs(record.path, file, record.line, record.framework + '-websocket')
      continue
    }
    routeIds.push({ id: addRoute(file, record), line: record.line })
  }
  // app.use(namedFn) — глобальный middleware: guards на роуты этого файла ниже вызова
  for (const use of uses) {
    addMiddleware(use.name, file, use.line)
    for (const route of routeIds) {
      if (route.line < use.line) continue
      addEdge(makeEdge({
        kind: 'guards', from: `middleware:${use.name}`, to: route.id,
        source: { file, line: use.line },
      }))
    }
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

function extractHttpRegex(file, text, framework) {
  const routes = []
  const uses = []
  const httpMatches = matchAll(RE.httpRoute, text)
  const routeMatches = matchAll(RE.fastifyRoute, text)
  // Окно опций каждого роута ограничено началом СЛЕДУЮЩЕГО роута любого вида,
  // иначе preHandler соседнего .route({...}) утечёт в чужой meta.middleware
  const boundaries = [...httpMatches, ...routeMatches].map((entry) => entry.index).sort((a, b) => a - b)
  const windowFor = (index) => {
    const next = boundaries.find((boundary) => boundary > index) ?? Math.min(text.length, index + 600)
    return text.slice(index, Math.min(next, index + 600))
  }
  for (const { match, index } of httpMatches) {
    const [, method, routePath] = match
    const window = windowFor(index)
    routes.push({
      method, path: routePath, line: lineOfIndex(text, index), framework,
      middleware: middlewareFromText(window),
      ws: detected.has('websocket') && /\bwebsocket\s*:\s*true\b/.test(window),
      handler: null,
    })
  }
  for (const { match, index } of routeMatches) {
    const window = windowFor(index)
    routes.push({
      method: match[1], path: match[2], line: lineOfIndex(text, index), framework,
      middleware: middlewareFromText(window),
      ws: /\bwebsocket\s*:\s*true\b/.test(window),
      handler: null,
    })
  }
  for (const { match, index } of matchAll(/\b(?:app|router|server|api)\.use\s*\(\s*([A-Za-z_$][\w$]*)\s*[,)]/g, text)) {
    uses.push({ name: match[1], line: lineOfIndex(text, index) })
  }
  materializeHttp(file, { routes, uses })
}

function extractHttpAst(ts, file, text, framework) {
  const sourceFile = parseSource(ts, file, text)
  const routes = []
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
  const handlerInfo = (argNode) => {
    if (ts.isArrowFunction(argNode) || ts.isFunctionExpression(argNode)) {
      const info = { file, line: lineOf(sourceFile, argNode) }
      if (argNode.name?.text) info.name = argNode.name.text
      return info
    }
    if (ts.isIdentifier(argNode)) return { file, line: lineOf(sourceFile, argNode), name: argNode.text }
    return null
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
          framework, middleware: [], ws: false, handler: null,
        }
        for (const arg of callArgs.slice(1)) {
          if (!ts.isObjectLiteralExpression(arg)) continue
          const info = optionsInfo(arg)
          record.middleware.push(...info.middleware)
          if (info.websocket && detected.has('websocket')) record.ws = true
        }
        // express-стиль: срединные identifier-аргументы — middleware, последний — handler
        for (const arg of callArgs.slice(1, -1)) {
          if (ts.isIdentifier(arg)) record.middleware.push(arg.text)
        }
        if (callArgs.length > 1) record.handler = handlerInfo(callArgs[callArgs.length - 1])
        routes.push(record)
      } else if (receiverOk && callName === 'route' && callArgs.length === 1 && ts.isObjectLiteralExpression(callArgs[0])) {
        const info = optionsInfo(callArgs[0])
        let method = null
        let url = null
        let handler = null
        for (const prop of callArgs[0].properties) {
          if (!ts.isPropertyAssignment(prop)) continue
          const key = propKey(prop)
          if (key === 'method' && isStringy(prop.initializer)) method = prop.initializer.text
          if (key === 'url' && isStringy(prop.initializer)) url = prop.initializer.text
          if (key === 'handler') handler = handlerInfo(prop.initializer)
        }
        if (method && url) {
          routes.push({
            method: method.toLowerCase(), path: url, line: lineOf(sourceFile, node),
            framework, middleware: info.middleware, ws: info.websocket && detected.has('websocket'), handler,
          })
        }
      } else if (receiverOk && callName === 'use' && callArgs.length && ts.isIdentifier(callArgs[0])) {
        uses.push({ name: callArgs[0].text, line: lineOf(sourceFile, node) })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  materializeHttp(file, { routes, uses })
}

// ── NestJS: @Controller('prefix') + @Get('sub') ─────────────────────────────
const NEST_DECORATORS = new Set(['Get', 'Post', 'Put', 'Patch', 'Delete', 'Head', 'Options', 'All'])

function extractNestRegex(file, text) {
  const controllers = matchAll(RE.nestController, text)
  controllers.forEach((ctrl, position) => {
    const prefix = ctrl.match[1] ?? ''
    const end = controllers[position + 1]?.index ?? text.length
    const segment = text.slice(ctrl.index, end)
    for (const { match, index } of matchAll(RE.nestMethod, segment)) {
      const absolute = ctrl.index + index
      const line = lineOfIndex(text, absolute)
      const after = segment.slice(index + match[0].length)
      const nameMatch = /^\s*(?:@[\w.]+\([^)]*\)\s*)*(?:public\s+|private\s+|protected\s+)?(?:async\s+)?([A-Za-z_$][\w$]*)\s*[<(]/.exec(after)
      const handler = { file, line }
      if (nameMatch) handler.name = nameMatch[1]
      addRoute(file, {
        method: match[1], path: joinPath(prefix, match[2] ?? ''), line,
        framework: 'nestjs', middleware: [], handler,
      })
    }
  })
}

function extractNestAst(ts, file, text) {
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
            const line = lineOf(sourceFile, member)
            const handler = { file, line }
            if (ts.isIdentifier(member.name)) handler.name = member.name.text
            addRoute(file, {
              method: call.expression.text.toLowerCase(), path: joinPath(prefix, stringArg(call)),
              line, framework: 'nestjs', middleware: [], handler,
            })
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
}

// ── Next.js App Router: app/**/route.ts → route-узлы (page.tsx — client-слой) ──
const NEXT_METHOD = 'GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS'
const NEXT_EXPORT = new RegExp(`export\\s+(?:async\\s+)?(?:function\\s+(${NEXT_METHOD})\\b|const\\s+(${NEXT_METHOD})\\s*=)`, 'g')

function nextPathFromSegments(segments) {
  const parts = []
  for (const segment of segments.split('/')) {
    if (/^\(.*\)$/.test(segment)) continue // route group (name) выкидывается
    if (/^\[\[\.\.\..+\]\]$/.test(segment)) parts.push(':' + segment.slice(5, -2) + '*')
    else if (/^\[\.\.\..+\]$/.test(segment)) parts.push(':' + segment.slice(4, -1) + '*')
    else if (/^\[.+\]$/.test(segment)) parts.push(':' + segment.slice(1, -1))
    else parts.push(segment)
  }
  return '/' + parts.join('/')
}

function extractNextRoutes() {
  for (const file of planFiles.nextApp ?? []) {
    const match = /(?:^|\/)app\/(.+)\/route\.(?:ts|tsx|js|jsx)$/.exec(file)
    if (!match) continue
    const routePath = nextPathFromSegments(match[1])
    const text = readText(path.join(root, file))
    if (!text) continue
    for (const { match: exported, index } of matchAll(NEXT_EXPORT, text)) {
      const method = exported[1] ?? exported[2]
      const line = lineOfIndex(text, index)
      addRoute(file, {
        method, path: routePath, line, framework: 'nextjs',
        middleware: [], handler: { file, line, name: method }, parser: null,
      })
    }
  }
}

// ── WebSocket: ws / socket.io / @fastify/websocket ──────────────────────────
function extractWs(file, text) {
  const isSocketIo = /['"]socket\.io['"]/.test(text)
  for (const { match, index } of matchAll(RE.wsServer, text)) {
    const token = match[0]
    const bareServer = /new\s+Server\s*\(/.test(token) && !token.includes('WebSocket')
    if (bareServer && !isSocketIo) continue
    const line = lineOfIndex(text, index)
    const window = text.slice(index, Math.min(text.length, index + 400))
    const wsPath = /\bpath\s*:\s*['"`]([^'"`]+)['"`]/.exec(window)?.[1] ?? 'main'
    const framework = token.includes('register') ? 'fastify-websocket' : bareServer ? 'socket.io' : 'ws'
    addWs(wsPath, file, line, framework)
  }
}

// ── Cron: node-cron/croner + @nestjs/schedule + vercel.json ─────────────────
function looksLikeCron(expr) {
  if (/^@(yearly|annually|monthly|weekly|daily|hourly)$/.test(expr)) return true
  return /^(?:[\d*/,\-A-Za-z?#]+\s+){4,5}[\d*/,\-A-Za-z?#]+$/.test(expr)
}

function extractCron(file, text) {
  const patterns = [
    /\b[\w$]+\.schedule\s*\(\s*['"`]([^'"`]+)['"`]/g, // node-cron: cron.schedule('expr', fn)
    /\bnew\s+Cron\s*\(\s*['"`]([^'"`]+)['"`]/g, // croner: new Cron('expr', fn)
  ]
  for (const regex of patterns) {
    for (const { match, index } of matchAll(regex, text)) {
      if (!looksLikeCron(match[1])) continue
      const line = lineOfIndex(text, index)
      const window = text.slice(index, Math.min(text.length, index + 300))
      const named = /,\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/.exec(window)
        ?? /,\s*([A-Za-z_$][\w$]*)\s*[,)]/.exec(window)
      addCron(named?.[1] ?? `${file}#${line}`, match[1], file, line)
    }
  }
  if (text.includes('@nestjs/schedule')) {
    for (const { match, index } of matchAll(/@Cron\(\s*['"`]([^'"`]+)['"`]/g, text)) {
      const line = lineOfIndex(text, index)
      const after = text.slice(index + match[0].length)
      const nameMatch = /\)\s*\n?\s*(?:@[\w.]+\([^)]*\)\s*)*(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(/.exec(after)
      addCron(nameMatch?.[1] ?? `${file}#${line}`, match[1], file, line)
    }
  }
}

function extractVercelCrons() {
  for (const file of planFiles.vercelJson ?? []) {
    const json = readJson(path.join(root, file))
    if (!Array.isArray(json?.crons)) continue
    const text = readText(path.join(root, file)) ?? ''
    for (const cron of json.crons) {
      if (!cron?.path) continue
      const index = text.indexOf(`"${cron.path}"`)
      const line = index >= 0 ? lineOfIndex(text, index) : 1
      addCron(cron.path, cron.schedule ?? '', file, line, { platform: 'vercel' })
    }
  }
}

// ── MCP: .mcp.json серверы + инструменты через @modelcontextprotocol/sdk ────
function compressCommand(config) {
  if (config?.url) return config.url
  const joined = [config?.command, ...(config?.args ?? [])].filter(Boolean).join(' ')
  return joined.length > 100 ? joined.slice(0, 99) + '…' : joined
}

// MCP-сервер сам по себе — чёрный ящик; ценно то, ЧТО за ним стоит.
// Систему узнаём по имени сервера И по строке запуска (mongodb-mcp-server → MongoDB,
// @modelcontextprotocol/server-postgres → PostgreSQL, https://mcp.render.com → Render).
// Узлы svc:* создаёт extract-env по той же таблице lib/services.mjs — здесь только рёбра.
function extractMcpJson() {
  for (const file of planFiles.mcpJson ?? []) {
    const json = readJson(path.join(root, file))
    const text = readText(path.join(root, file)) ?? ''
    for (const [name, config] of Object.entries(json?.mcpServers ?? {})) {
      const keyMatch = new RegExp(`"${escapeRegExp(name)}"\\s*:`).exec(text)
      const line = keyMatch ? lineOfIndex(text, keyMatch.index) : 1
      const id = `mcp:${name}`
      const haystack = mcpHaystack(config)
      const service = serviceForMcp(name, haystack)
      const meta = { command: compressCommand(config) }
      if (service) meta.service = service.slug
      addNode(makeNode({
        id, kind: 'mcp-server', layer: 'api', label: name,
        source: { file, line }, meta,
      }))
      if (service) {
        addEdge(makeEdge({
          kind: 'uses', from: id, to: `svc:${service.slug}`,
          source: { file, line }, meta: { via: 'mcp-command' },
        }))
      }
      for (const variable of mcpEnvNames(config)) {
        const at = text.indexOf(variable, keyMatch?.index ?? 0)
        addEdge(makeEdge({
          kind: 'reads-env', from: id, to: `env:${variable}`,
          source: { file, line: at === -1 ? line : lineOfIndex(text, at) },
        }))
      }
    }
  }
}

function extractMcpTools(file, text) {
  const tools = []
  for (const { match, index } of matchAll(/\.(?:tool|registerTool)\s*\(\s*['"`]([^'"`]+)['"`]/g, text)) {
    tools.push({ name: match[1], index })
  }
  for (const { match, index } of matchAll(/\.setRequestHandler\s*\(\s*([A-Za-z_$][\w$]*)/g, text)) {
    const name = match[1].replace(/RequestSchema$/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    tools.push({ name, index })
  }
  if (!tools.length) return
  const serverName = /new\s+(?:Mcp)?Server\s*\(\s*\{[\s\S]{0,200}?\bname\s*:\s*['"`]([^'"`]+)['"`]/.exec(text)?.[1]
    ?? path.posix.basename(file).replace(/\.\w+$/, '')
  const serverId = `mcp:${serverName}`
  addNode(makeNode({
    id: serverId, kind: 'mcp-server', layer: 'api', label: serverName,
    source: { file, line: lineOfIndex(text, tools[0].index) },
    meta: { sdk: '@modelcontextprotocol/sdk' },
  }))
  for (const tool of tools) {
    const line = lineOfIndex(text, tool.index)
    const toolId = `${serverId}/tool:${tool.name}`
    addNode(makeNode({
      id: toolId, kind: 'mcp-tool', layer: 'api', label: tool.name,
      source: { file, line }, meta: {},
    }))
    addEdge(makeEdge({ kind: 'member', from: serverId, to: toolId, source: { file, line } }))
  }
}

// ── Обход code-файлов из плана (ФС повторно не сканируем) ───────────────────
const httpDetected = detected.has('fastify') || detected.has('express')
const frameworkFor = (text) => {
  if (detected.has('fastify') && detected.has('express')) {
    return /['"]fastify['"]/.test(text) ? 'fastify' : 'express'
  }
  return detected.has('fastify') ? 'fastify' : 'express'
}

for (const file of planFiles.code ?? []) {
  if (/\.(test|spec)\.(ts|tsx|js|jsx|mjs|cjs)$|__tests__/.test(file)) continue
  const needs = httpDetected || detected.has('nestjs') || detected.has('websocket')
    || detected.has('cron') || detected.has('mcp')
  if (!needs) break
  const text = readText(path.join(root, file))
  if (!text) continue
  if (httpDetected) {
    const framework = frameworkFor(text)
    if (tsEnv) extractHttpAst(tsEnv.ts, file, text, framework)
    else extractHttpRegex(file, text, framework)
  }
  if (detected.has('nestjs') && text.includes('@Controller')) {
    if (tsEnv) extractNestAst(tsEnv.ts, file, text)
    else extractNestRegex(file, text)
  }
  if (detected.has('websocket')) extractWs(file, text)
  if (detected.has('cron')) extractCron(file, text)
  if (detected.has('mcp') && text.includes('@modelcontextprotocol/sdk')) extractMcpTools(file, text)
}

if (detected.has('nextjs') || hasNextApp) extractNextRoutes()
extractVercelCrons()
extractMcpJson()

// ── Запись part-файла ───────────────────────────────────────────────────────
const nodeList = [...nodes.values()]
const edgeList = [...edges.values()]
const count = (kind) => nodeList.filter((node) => node.kind === kind).length
const stats = {
  routes: count('route'),
  webhooks: count('webhook'),
  ws: count('ws'),
  cron: count('cron'),
  mcpServers: count('mcp-server'),
  mcpTools: count('mcp-tool'),
  middleware: count('middleware'),
  mcpServiceEdges: edgeList.filter((edge) => edge.from.startsWith('mcp:') && edge.to.startsWith('svc:')).length,
  mcpEnvEdges: edgeList.filter((edge) => edge.from.startsWith('mcp:') && edge.to.startsWith('env:')).length,
}
writeJson(args.out, partFile({ part: 'api', root, nodes: nodeList, edges: edgeList, stats }))
console.log(`archmap extract-api: ${stats.routes} routes, ${stats.webhooks} webhooks, ` +
  `${stats.ws} ws, ${stats.cron} cron, ${stats.mcpServers} mcp-servers, ${stats.mcpTools} mcp-tools, ` +
  `${stats.middleware} middleware → ${args.out}`)
if (stats.mcpServiceEdges || stats.mcpEnvEdges) {
  console.log(`  MCP-связи: ${stats.mcpServiceEdges} → внешние системы, ${stats.mcpEnvEdges} → env`)
}
