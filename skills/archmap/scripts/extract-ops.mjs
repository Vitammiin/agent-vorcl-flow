#!/usr/bin/env node
// archmap extract-ops.mjs — фаза 1: инструментальный и операционный контур → ops.part.json.
// Чем проект собирается, тестируется, деплоится и какими инструментами расширяется:
// MCP-инструменты (tools), CI/CD-пайплайны, контейнеры (Dockerfile + compose), хуки,
// наборы тестов, скиллы и слэш-команды плагинов.
// Использование: node extract-ops.mjs --root <target> --plan <plan.json> --out <ops.part.json>
// Нечего извлекать → пустой part, exit 0. Каждый узел и ребро — с source:{file,line}.
// YAML разбирается примитивно построчно по отступам: zero-dependency, только node:*.

import fs from 'node:fs'
import path from 'node:path'
import {
  parseArgs, readText, readJson, lineOfIndex, makeNode, makeEdge, partFile, writeJson,
  loadPlan, walk, findNearestPackageJson,
} from './lib/core.mjs'
import { matchAll } from './lib/ts.mjs'
import { serviceMentions } from './lib/services.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  plan: { flag: '--plan', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.plan || !args.out) {
  console.log('Usage: node extract-ops.mjs --root <target> --plan <plan.json> --out <ops.part.json>')
  process.exit(args.help ? 0 : 1)
}

const root = path.resolve(args.root)
const plan = loadPlan(args.plan)
const detected = new Set(plan.stacks?.detected ?? [])
const planFiles = plan.files ?? {}
const codeFiles = planFiles.code ?? []
const codeSet = new Set(codeFiles)

const nodes = new Map()
const edges = new Map()
const addNode = (node) => {
  if (!nodes.has(node.id)) nodes.set(node.id, node)
  return nodes.get(node.id)
}
const addEdge = (edge) => {
  if (!edges.has(edge.id)) edges.set(edge.id, edge)
}

// scan.mjs не кладёт в plan ни .md-файлы, ни Dockerfile, поэтому дерево обходим сами
// (тем же walk с теми же исключениями: node_modules, dist, вложенные репозитории/worktree).
const allFiles = walk(root)

function unquote(value) {
  const trimmed = String(value ?? '').trim().replace(/\s+#.*$/, '').trim()
  if (/^(['"]).*\1$/.test(trimmed)) return trimmed.slice(1, -1)
  return trimmed
}

// 'push' | '[push, pull_request]' | '"push"' → ['push', …]
function scalarList(value) {
  const raw = String(value ?? '').trim()
  const inner = raw.startsWith('[') ? raw.replace(/^\[/, '').replace(/\]$/, '') : raw
  return inner.split(',').map((item) => unquote(item)).filter(Boolean)
}

// Значащие строки YAML/скрипта: без пустых и комментариев, с посчитанным отступом.
function significantLines(text) {
  const result = []
  const lines = text.split('\n')
  for (let index = 0; index < lines.length; index++) {
    const raw = lines[index].replace(/\r$/, '')
    const trimmed = raw.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    result.push({ raw, trimmed, indent: raw.length - raw.trimStart().length, line: index + 1 })
  }
  return result
}

const KEY_RE = /^["']?([A-Za-z_][\w.-]*)["']?:\s*(.*)$/

function existsIn(relFile) {
  try {
    return fs.statSync(path.join(root, relFile)).isFile()
  } catch {
    return false
  }
}

function listDir(relDir) {
  try {
    return fs.readdirSync(path.join(root, relDir), { withFileTypes: true })
  } catch {
    return []
  }
}

// ── 1. MCP-инструменты: server.tool / registerTool / setRequestHandler / tools:[…] ──
// Узлы mcp:<server> создаёт и extract-api — id совпадают, merge дедуплицирует.
function serverNameFor(file, text) {
  const declared = /new\s+(?:Mcp)?Server\s*\(\s*\{[\s\S]{0,200}?\bname\s*:\s*['"`]([^'"`]+)['"`]/.exec(text)?.[1]
  if (declared) return declared
  const pkgDir = findNearestPackageJson(root, file)
  const pkgName = readJson(path.join(root, pkgDir ? `${pkgDir}/package.json` : 'package.json'))?.name
  if (pkgName) return pkgName.split('/').pop()
  const dir = path.posix.dirname(file)
  if (dir && dir !== '.') return path.posix.basename(dir)
  return path.posix.basename(file).replace(/\.\w+$/, '')
}

// Окно от открывающей скобки до парной закрывающей (наивно, но для литерала массива хватает).
function bracketWindow(text, start, open = '[', close = ']', limit = 40000) {
  let depth = 0
  const end = Math.min(text.length, start + limit)
  for (let index = start; index < end; index++) {
    if (text[index] === open) depth++
    else if (text[index] === close) {
      depth--
      if (depth === 0) return text.slice(start, index + 1)
    }
  }
  return text.slice(start, end)
}

// Комментарии гасим пробелами (длина и переводы строк сохраняются, поэтому
// line/index остаются точными): иначе пример `tools: [{ name: 'x' }]` в документации
// превращается в инструмент, которого в рантайме нет.
function maskComments(text) {
  const blank = (value) => value.replace(/[^\n]/g, ' ')
  return text
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, (whole, prefix) => prefix + blank(whole.slice(prefix.length)))
}

function collectMcpTools(file, rawText) {
  const text = maskComments(rawText)
  const found = []
  const push = (name, index) => {
    if (!name || found.some((tool) => tool.name === name)) return
    found.push({ name, index })
  }
  // server.tool('name', …) / server.registerTool('name', …)
  for (const { match, index } of matchAll(/\.(?:registerTool|tool)\s*\(\s*['"`]([^'"`]+)['"`]/g, text)) {
    push(match[1], index)
  }
  // низкоуровневый протокол: setRequestHandler(CallToolRequestSchema, …)
  for (const { match, index } of matchAll(/\.setRequestHandler\s*\(\s*([A-Za-z_$][\w$]*)/g, text)) {
    const name = match[1].replace(/RequestSchema$/, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
    push(name, index)
  }
  // декларативный список: tools: [{ name: 'x', … }, …]
  for (const { match, index } of matchAll(/\btools\s*:\s*\[/g, text)) {
    const start = index + match[0].length - 1
    const window = bracketWindow(text, start)
    for (const { match: entry, index: at } of matchAll(/\bname\s*:\s*['"`]([^'"`]+)['"`]/g, window)) {
      push(entry[1], start + at)
    }
  }
  if (!found.length) return
  const serverName = serverNameFor(file, text)
  const serverId = `mcp:${serverName}`
  found.sort((a, b) => a.index - b.index)
  addNode(makeNode({
    id: serverId, kind: 'mcp-server', layer: 'api', label: serverName,
    source: { file, line: lineOfIndex(text, found[0].index) },
    meta: { sdk: '@modelcontextprotocol/sdk', tools: found.length },
  }))
  for (const tool of found) {
    const line = lineOfIndex(text, tool.index)
    const toolId = `${serverId}/tool:${tool.name}`
    addNode(makeNode({
      id: toolId, kind: 'mcp-tool', layer: 'api', label: tool.name,
      source: { file, line }, meta: { server: serverName },
    }))
    addEdge(makeEdge({ kind: 'member', from: serverId, to: toolId, source: { file, line } }))
  }
}

// ── 2. CI/CD ────────────────────────────────────────────────────────────────
function parseWorkflow(text) {
  const meta = { name: null, on: [], jobs: [], runsOn: [] }
  let nameLine = 1
  let section = null
  let jobIndent = null
  for (const { trimmed, indent, line } of significantLines(text)) {
    const runsOn = /^runs-on:\s*(.+)$/.exec(trimmed)
    if (runsOn) {
      for (const value of scalarList(runsOn[1])) {
        if (!meta.runsOn.includes(value)) meta.runsOn.push(value)
      }
    }
    if (indent === 0) {
      section = null
      jobIndent = null
      const kv = KEY_RE.exec(trimmed)
      if (!kv) continue
      const [, key, value] = kv
      if (key === 'name' && meta.name === null) { meta.name = unquote(value); nameLine = line }
      else if (key === 'on' || key === 'true') { section = 'on'; meta.on.push(...scalarList(value)) }
      else if (key === 'jobs') section = 'jobs'
      continue
    }
    if (section === 'on') {
      const item = /^-\s*(.+)$/.exec(trimmed)
      const kv = KEY_RE.exec(trimmed)
      if (jobIndent === null) jobIndent = indent
      if (indent !== jobIndent) continue
      if (item) meta.on.push(unquote(item[1]))
      else if (kv) meta.on.push(kv[1])
      continue
    }
    if (section === 'jobs') {
      if (jobIndent === null) jobIndent = indent
      if (indent !== jobIndent) continue
      const kv = KEY_RE.exec(trimmed)
      if (kv && !kv[2]) meta.jobs.push(kv[1])
    }
  }
  meta.on = [...new Set(meta.on)]
  return { meta, nameLine }
}

// Ключи второго уровня под верхнеуровневым блоком (`jobs:`, `stages:`, `workflows:`).
function blockEntries(text, topKey) {
  const entries = []
  let inside = false
  let level = null
  for (const { trimmed, indent } of significantLines(text)) {
    if (indent === 0) {
      const kv = KEY_RE.exec(trimmed)
      inside = Boolean(kv) && kv[1] === topKey
      level = null
      continue
    }
    if (!inside) continue
    if (level === null) level = indent
    if (indent !== level) continue
    const item = /^-\s*(.+)$/.exec(trimmed)
    if (item) { entries.push(unquote(item[1])); continue }
    const kv = KEY_RE.exec(trimmed)
    if (kv) entries.push(kv[1])
  }
  return entries
}

function extractCi() {
  for (const entry of listDir('.github/workflows')) {
    if (!entry.isFile() || !/\.ya?ml$/.test(entry.name)) continue
    const file = `.github/workflows/${entry.name}`
    const text = readText(path.join(root, file))
    if (text === null) continue
    const { meta, nameLine } = parseWorkflow(text)
    const slug = entry.name.replace(/\.ya?ml$/, '')
    addNode(makeNode({
      id: `ci:${slug}`, kind: 'ci-pipeline', layer: 'infra', label: meta.name || slug,
      source: { file, line: nameLine },
      meta: { platform: 'github-actions', ...meta, jobCount: meta.jobs.length },
    }))
  }
  const minimal = [
    { file: '.gitlab-ci.yml', id: 'ci:gitlab-ci', label: 'GitLab CI', platform: 'gitlab-ci', key: 'stages' },
    { file: '.circleci/config.yml', id: 'ci:circleci', label: 'CircleCI', platform: 'circleci', key: 'jobs' },
    { file: 'Jenkinsfile', id: 'ci:jenkins', label: 'Jenkins', platform: 'jenkins', key: null },
  ]
  for (const item of minimal) {
    if (!existsIn(item.file)) continue
    const text = readText(path.join(root, item.file)) ?? ''
    const meta = { platform: item.platform }
    if (item.key) meta.jobs = blockEntries(text, item.key)
    else meta.jobs = matchAll(/\bstage\s*\(\s*['"]([^'"]+)['"]\s*\)/g, text).map(({ match }) => match[1])
    meta.jobCount = meta.jobs.length
    addNode(makeNode({
      id: item.id, kind: 'ci-pipeline', layer: 'infra', label: item.label,
      source: { file: item.file, line: 1 }, meta,
    }))
  }
}

// ── 3. Контейнеры: Dockerfile* + docker-compose ─────────────────────────────
// Образ узнаётся как известная система (postgres/redis/mongo/…) → ребро deploys к svc:*.
const DEPLOY_CATEGORIES = new Set(['database', 'cache', 'queue', 'search'])

function serviceForImage(image) {
  if (!image) return null
  const name = image.split('@')[0]
  for (const { service } of serviceMentions(name)) {
    if (DEPLOY_CATEGORIES.has(service.category)) return service
  }
  return null
}

function parseDockerfile(text) {
  const meta = { baseImage: null, stages: 0, exposes: [], user: null }
  for (const { trimmed } of significantLines(text)) {
    const from = /^FROM\s+(\S+)/i.exec(trimmed)
    if (from) { meta.stages++; meta.baseImage = from[1]; continue }
    const expose = /^EXPOSE\s+(.+)$/i.exec(trimmed)
    if (expose) {
      for (const port of expose[1].split(/\s+/).filter(Boolean)) {
        if (!meta.exposes.includes(port)) meta.exposes.push(port)
      }
      continue
    }
    const user = /^USER\s+(\S+)/i.exec(trimmed)
    if (user) meta.user = user[1]
  }
  return meta
}

function extractDockerfiles() {
  for (const file of allFiles.filter((item) => /(^|\/)Dockerfile[^/]*$/.test(item))) {
    if (/\.(md|txt)$/.test(file)) continue
    const text = readText(path.join(root, file))
    if (text === null) continue
    const meta = parseDockerfile(text)
    if (!meta.stages) continue
    addNode(makeNode({
      id: `container:${file}`, kind: 'container', layer: 'infra', label: file,
      source: { file, line: 1 }, meta: { ...meta, runtime: 'docker' },
    }))
    const service = serviceForImage(meta.baseImage)
    if (service) {
      addEdge(makeEdge({
        kind: 'deploys', from: `container:${file}`, to: `svc:${service.slug}`,
        source: { file, line: 1 }, meta: { image: meta.baseImage },
      }))
    }
  }
}

function parseCompose(text) {
  const services = []
  let inside = false
  let serviceIndent = null
  let propIndent = null
  let current = null
  let listKey = null
  for (const { trimmed, indent, line } of significantLines(text)) {
    if (indent === 0) {
      const kv = KEY_RE.exec(trimmed)
      inside = Boolean(kv) && kv[1] === 'services'
      current = null
      listKey = null
      serviceIndent = null
      propIndent = null
      continue
    }
    if (!inside) continue
    if (serviceIndent === null) serviceIndent = indent
    if (indent === serviceIndent) {
      const kv = KEY_RE.exec(trimmed)
      current = null
      listKey = null
      propIndent = null
      if (!kv) continue
      current = { name: kv[1], line, image: null, build: null, ports: [], dependsOn: [] }
      services.push(current)
      continue
    }
    if (!current) continue
    if (propIndent === null) propIndent = indent
    if (indent === propIndent) {
      listKey = null
      const kv = KEY_RE.exec(trimmed)
      if (!kv) continue
      const key = kv[1]
      // YAML-тег слияния (`ports: !override` + список ниже) значением не является
      const value = kv[2].replace(/^![\w-]+\s*/, '').trim()
      if (key === 'image') current.image = unquote(value)
      else if (key === 'build') current.build = value ? unquote(value) : 'context'
      else if (key === 'ports') { if (value) current.ports.push(...scalarList(value)); else listKey = 'ports' }
      else if (key === 'depends_on') { if (value) current.dependsOn.push(...scalarList(value)); else listKey = 'dependsOn' }
      continue
    }
    if (!listKey) continue
    const item = /^-\s*(.+)$/.exec(trimmed)
    if (item) { current[listKey].push(unquote(item[1])); continue }
    // depends_on в форме отображения: `postgres:` → `condition: service_healthy`
    const kv = KEY_RE.exec(trimmed)
    if (kv && listKey === 'dependsOn' && !current.dependsOn.includes(kv[1]) && !/^condition$/.test(kv[1])) {
      if (indent === propIndent + 2) current.dependsOn.push(kv[1])
    }
  }
  return services
}

function extractCompose() {
  // Базовый файл разбираем первым: он каноничнее override/dev-вариантов того же сервиса.
  const isBase = (file) => /(^|\/)(docker-)?compose\.ya?ml$/.test(file)
  const composeFiles = [...(planFiles.dockerCompose ?? [])]
    .sort((a, b) => (isBase(a) === isBase(b) ? a.localeCompare(b) : isBase(a) ? -1 : 1))
  for (const file of composeFiles) {
    const text = readText(path.join(root, file))
    if (text === null) continue
    for (const service of parseCompose(text)) {
      const id = `container:compose/${service.name}`
      const meta = { runtime: 'compose', service: service.name, ports: service.ports, dependsOn: service.dependsOn }
      if (service.image) meta.image = service.image
      if (service.build) meta.build = service.build
      addNode(makeNode({
        id, kind: 'container', layer: 'infra', label: `compose/${service.name}`,
        source: { file, line: service.line }, meta,
      }))
      const detectedService = serviceForImage(service.image)
      if (detectedService) {
        addEdge(makeEdge({
          kind: 'deploys', from: id, to: `svc:${detectedService.slug}`,
          source: { file, line: service.line }, meta: { image: service.image },
        }))
      }
      for (const dependency of service.dependsOn) {
        addEdge(makeEdge({
          kind: 'uses', from: id, to: `container:compose/${dependency}`,
          source: { file, line: service.line }, meta: { via: 'depends_on' },
        }))
      }
    }
  }
}

// ── 4. Хуки: hooks.json (Claude), .husky/*, .git/hooks/* ────────────────────
function collectHookEntries() {
  const entries = []
  const jsonFiles = allFiles.filter((file) => /(^|\/)hooks\/hooks\.json$/.test(file))
  for (const file of jsonFiles) {
    const json = readJson(path.join(root, file))
    const text = readText(path.join(root, file)) ?? ''
    for (const [event, groups] of Object.entries(json?.hooks ?? {})) {
      if (!Array.isArray(groups)) continue
      const eventAt = text.indexOf(`"${event}"`)
      for (const group of groups) {
        for (const hook of group?.hooks ?? []) {
          if (!hook?.command) continue
          // В JSON команда лежит экранированной — ищем именно её сериализованную форму.
          const at = text.indexOf(JSON.stringify(hook.command).slice(1, -1), Math.max(0, eventAt))
          const anchor = at === -1 ? eventAt : at
          const meta = { event, command: String(hook.command).slice(0, 200), type: hook.type ?? 'command' }
          if (group.matcher) meta.matcher = group.matcher
          entries.push({ event, meta, source: { file, line: anchor <= 0 ? 1 : lineOfIndex(text, anchor) } })
        }
      }
    }
  }
  for (const dir of ['.husky', '.git/hooks']) {
    for (const entry of listDir(dir)) {
      if (!entry.isFile() || entry.name.endsWith('.sample') || entry.name.startsWith('.')) continue
      const file = `${dir}/${entry.name}`
      const text = readText(path.join(root, file)) ?? ''
      const first = significantLines(text).find(({ trimmed }) => !/^#!/.test(trimmed) && !/^\./.test(trimmed))
      entries.push({
        event: entry.name,
        meta: {
          event: entry.name,
          command: (first?.trimmed ?? '').slice(0, 200),
          runner: dir === '.husky' ? 'husky' : 'git',
        },
        source: { file, line: first?.line ?? 1 },
      })
    }
  }
  return entries
}

function extractHooks() {
  const entries = collectHookEntries()
  const perEvent = new Map()
  for (const entry of entries) perEvent.set(entry.event, (perEvent.get(entry.event) ?? 0) + 1)
  for (const entry of entries) {
    // Несколько хуков на одно событие: к id добавляем имя скрипта — id остаётся детерминированным.
    const script = path.posix.basename((entry.meta.command.match(/[\w./\\${}-]+\.(?:js|mjs|cjs|ts|sh|py)/) ?? [''])[0])
      || entry.meta.matcher || entry.meta.command.split(/\s+/)[0] || 'hook'
    const id = perEvent.get(entry.event) > 1 ? `hook:${entry.event}:${script}` : `hook:${entry.event}`
    addNode(makeNode({
      id, kind: 'hook', layer: 'infra', label: entry.event,
      source: entry.source, meta: entry.meta,
    }))
  }
}

// ── 5. Тесты: наборы по каталогам + covers → module:<файл> ──────────────────
const TEST_DIRS = new Set(['__tests__', 'test', 'tests', 'spec', 'specs', 'e2e', 'cypress', '__test__'])
const TEST_FILE_RE = /(^|\/)(?:[^/]+)\.(?:test|spec)\.[cm]?[jt]sx?$/
const TEST_PATH_RE = /(^|\/)(?:__tests__|__test__|tests?|specs?|e2e|cypress)\//
const FRAMEWORKS = [
  ['playwright', /@playwright\/test/],
  ['vitest', /['"]vitest['"]/],
  ['jest', /@jest\/globals|['"]jest['"]|jest\.(?:mock|fn|spyOn)\s*\(/],
  ['mocha', /['"]mocha['"]/],
  ['node:test', /['"]node:test['"]/],
]
const CASE_RE = /(^|[^\w.$])(?:it|test)(?:\.(?:each|only|skip|todo|concurrent|failing|fails|sequential))*\s*[(`]/g

function suiteDir(file) {
  const parts = path.posix.dirname(file).split('/').filter((part) => part && part !== '.')
  const marker = parts.findIndex((part) => TEST_DIRS.has(part))
  if (marker !== -1) return parts.slice(0, marker + 1).join('/')
  const limit = parts[0] === 'src' ? 2 : 3
  return parts.slice(0, Math.min(parts.length, limit)).join('/') || '.'
}

function coveredModule(file) {
  const dir = path.posix.dirname(file)
  const base = path.posix.basename(file).replace(/\.(?:test|spec)\.[cm]?[jt]sx?$/, '')
  const dirs = [dir]
  if (TEST_DIRS.has(path.posix.basename(dir))) dirs.push(path.posix.dirname(dir))
  for (const candidateDir of dirs) {
    for (const ext of ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.mts', '.cjs']) {
      const candidate = path.posix.join(candidateDir === '.' ? '' : candidateDir, base + ext)
      if (codeSet.has(candidate)) return candidate
    }
  }
  return null
}

function devDependencyFramework() {
  const deps = new Set()
  for (const file of planFiles.packageJson ?? []) {
    const pkg = readJson(path.join(root, file)) ?? {}
    for (const section of ['dependencies', 'devDependencies']) {
      for (const name of Object.keys(pkg[section] ?? {})) deps.add(name)
    }
  }
  if (deps.has('@playwright/test')) return 'playwright'
  if (deps.has('vitest')) return 'vitest'
  if (deps.has('jest') || deps.has('ts-jest')) return 'jest'
  if (deps.has('mocha')) return 'mocha'
  return null
}

function extractTests(testFiles) {
  if (!testFiles.length) return
  const fallback = devDependencyFramework()
  const suites = new Map()
  for (const entry of testFiles) {
    const dir = suiteDir(entry.file)
    if (!suites.has(dir)) suites.set(dir, { dir, files: [], cases: 0, frameworks: new Map() })
    const suite = suites.get(dir)
    suite.files.push(entry.file)
    suite.cases += entry.cases
    if (entry.framework) suite.frameworks.set(entry.framework, (suite.frameworks.get(entry.framework) ?? 0) + 1)
  }
  for (const suite of [...suites.values()].sort((a, b) => a.dir.localeCompare(b.dir))) {
    suite.files.sort()
    const id = `test:${suite.dir}`
    const framework = [...suite.frameworks.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0]
      ?? fallback
    addNode(makeNode({
      id, kind: 'test-suite', layer: 'logic', label: suite.dir,
      source: { file: suite.files[0], line: 1 },
      meta: {
        files: suite.files.length,
        cases: suite.cases,
        framework,
        fileNames: suite.files.slice(0, 10),
      },
    }))
    for (const file of suite.files) {
      const covered = coveredModule(file)
      if (!covered) continue
      addEdge(makeEdge({
        kind: 'covers', from: id, to: `module:${covered}`,
        source: { file, line: 1 },
      }))
    }
  }
}

// ── 6. Скиллы и слэш-команды плагина ────────────────────────────────────────
function parseFrontmatter(text) {
  const lines = text.split('\n')
  if (lines[0]?.trim() !== '---') return null
  let end = -1
  for (let index = 1; index < lines.length; index++) {
    if (lines[index].trim() === '---') { end = index; break }
  }
  if (end === -1) return null
  const data = { lines: {} }
  let listKey = null
  for (let index = 1; index < end; index++) {
    const line = lines[index]
    const item = /^\s+-\s+(.+)$/.exec(line)
    if (listKey && item) { data[listKey].push(unquote(item[1])); continue }
    const kv = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line)
    if (!kv) { listKey = null; continue }
    const [, key, rawValue] = kv
    const value = rawValue.trim()
    data.lines[key] = index + 1
    if (key === 'skills' || key === 'tools') {
      listKey = value ? null : key
      data[key] = value ? scalarList(value) : []
      continue
    }
    listKey = null
    data[key] = unquote(value)
  }
  return data
}

const shortText = (value) => String(value ?? '').split('\n')[0].slice(0, 200)

// Скиллы и команды берём только из канонических корней: сам репозиторий, `.claude/`
// и каталоги плагинов. Иначе зеркала для других рантаймов (codex/skills/…, cursor/…)
// удваивают карту копиями тех же сущностей.
const PLUGIN_MARKERS = ['.claude-plugin/plugin.json', '.claude-plugin/marketplace.json', 'plugin.json']
const pluginRoots = new Map()

function isPluginRoot(prefix) {
  if (prefix === '' || prefix === '.claude') return true
  if (!pluginRoots.has(prefix)) {
    pluginRoots.set(prefix, PLUGIN_MARKERS.some((marker) => existsIn(`${prefix}/${marker}`)))
  }
  return pluginRoots.get(prefix)
}

function inCanonicalRoot(file, dirName) {
  const match = new RegExp(`^(?:(.*?)/)?${dirName}/`).exec(file)
  return match ? isPluginRoot(match[1] ?? '') : false
}

function extractSkills() {
  const skillFiles = allFiles.filter((file) => /(^|\/)skills\/[^/]+\/SKILL\.md$/.test(file)
    && inCanonicalRoot(file, 'skills'))
  const found = new Set()
  for (const file of skillFiles) {
    const dirName = path.posix.basename(path.posix.dirname(file))
    const text = readText(path.join(root, file))
    if (text === null) continue
    const fm = parseFrontmatter(text) ?? { lines: {} }
    const name = fm.name || dirName
    const meta = { dir: path.posix.dirname(file) }
    if (fm.description) meta.description = shortText(fm.description)
    if (fm.version) meta.version = fm.version
    addNode(makeNode({
      id: `skill:${name}`, kind: 'skill', layer: 'agents', label: name,
      source: { file, line: fm.lines.name ?? 1 }, meta,
    }))
    found.add(name)
    if (name !== dirName) found.add(dirName)
  }
  return found
}

function extractCommands() {
  const commandFiles = allFiles.filter((file) => /(^|\/)commands\/(?:[^/]+\/)?[^/]+\.md$/.test(file)
    && inCanonicalRoot(file, 'commands'))
  const commands = []
  for (const file of commandFiles) {
    const after = file.slice(file.lastIndexOf('commands/') + 'commands/'.length)
    const parts = after.split('/')
    if (parts.length > 2) continue
    const namespace = parts.length === 2 ? parts[0] : null
    const name = parts[parts.length - 1].replace(/\.md$/, '')
    const text = readText(path.join(root, file))
    if (text === null) continue
    const fm = parseFrontmatter(text) ?? { lines: {} }
    const label = namespace ? `/${namespace}:${name}` : `/${name}`
    const meta = { command: label, file }
    if (namespace) meta.namespace = namespace
    if (fm.description) meta.description = shortText(fm.description)
    if (fm['argument-hint']) meta.argumentHint = shortText(fm['argument-hint'])
    if (fm['allowed-tools']) meta.allowedTools = scalarList(fm['allowed-tools'])
    addNode(makeNode({
      id: `command:${label}`, kind: 'command', layer: 'agents', label,
      source: { file, line: fm.lines.description ?? 1 }, meta,
    }))
    commands.push({ id: `command:${label}`, namespace, file })
  }
  return commands
}

function extractAgentLinks(skillNames, commands) {
  const agents = []
  for (const file of planFiles.agentsMd ?? []) {
    const text = readText(path.join(root, file))
    if (text === null) continue
    const fm = parseFrontmatter(text)
    if (!fm?.name) continue
    agents.push({ name: fm.name, file, skills: fm.skills ?? [], line: fm.lines.skills ?? fm.lines.name ?? 1 })
  }
  const byName = new Map(agents.map((agent) => [agent.name, agent]))
  for (const command of commands) {
    const agent = command.namespace ? byName.get(command.namespace) : null
    if (!agent) continue
    addEdge(makeEdge({
      kind: 'member', from: `agent:${agent.name}`, to: command.id,
      source: { file: command.file, line: 1 },
    }))
  }
  for (const agent of agents) {
    for (const skill of agent.skills) {
      if (!skillNames.has(skill)) continue
      addEdge(makeEdge({
        kind: 'uses', from: `agent:${agent.name}`, to: `skill:${skill}`,
        source: { file: agent.file, line: agent.line },
      }))
    }
  }
  return agents.length
}

// ── Один проход по code-файлам: тесты + MCP-инструменты ─────────────────────
const scanMcp = detected.has('mcp')
const testFiles = []
for (const file of codeFiles) {
  const isTest = TEST_FILE_RE.test(file) || TEST_PATH_RE.test(file)
  if (!isTest && !scanMcp) continue
  const text = readText(path.join(root, file))
  if (text === null) continue
  if (isTest) {
    let framework = null
    for (const [name, regex] of FRAMEWORKS) {
      if (regex.test(text)) { framework = name; break }
    }
    testFiles.push({ file, framework, cases: matchAll(CASE_RE, text).length })
    continue
  }
  if (text.includes('@modelcontextprotocol/sdk')) collectMcpTools(file, text)
}

extractTests(testFiles)
extractCi()
extractDockerfiles()
extractCompose()
extractHooks()
const skillNames = extractSkills()
const commands = extractCommands()
const agentCount = extractAgentLinks(skillNames, commands)

// ── Запись part-файла ───────────────────────────────────────────────────────
const nodeList = [...nodes.values()]
const edgeList = [...edges.values()]
const countKind = (kind) => nodeList.filter((node) => node.kind === kind).length
const countEdge = (kind) => edgeList.filter((edge) => edge.kind === kind).length
const stats = {
  mcpTools: countKind('mcp-tool'),
  mcpServers: countKind('mcp-server'),
  ciPipelines: countKind('ci-pipeline'),
  containers: countKind('container'),
  hooks: countKind('hook'),
  testSuites: countKind('test-suite'),
  testFiles: testFiles.length,
  skills: countKind('skill'),
  commands: countKind('command'),
  agents: agentCount,
  memberEdges: countEdge('member'),
  usesEdges: countEdge('uses'),
  coversEdges: countEdge('covers'),
  deploysEdges: countEdge('deploys'),
}
writeJson(args.out, partFile({ part: 'ops', root, nodes: nodeList, edges: edgeList, stats }))
if (!nodeList.length) {
  console.log(`archmap extract-ops: инструментальный контур не найден → пустой part → ${args.out}`)
  process.exit(0)
}
console.log(`archmap extract-ops: ${stats.mcpTools} mcp-tools, ${stats.ciPipelines} ci, ` +
  `${stats.containers} containers, ${stats.hooks} hooks, ${stats.testSuites} test-suites ` +
  `(${stats.testFiles} файлов), ${stats.skills} skills, ${stats.commands} commands → ${args.out}`)
console.log(`  рёбра: ${stats.memberEdges} member, ${stats.usesEdges} uses, ` +
  `${stats.coversEdges} covers, ${stats.deploysEdges} deploys`)
