#!/usr/bin/env node
// archmap extract-modules.mjs — фаза 1: граф модулей (logic) + пакеты монорепо + client-слой Next.
// Использование: node extract-modules.mjs --root <target> --plan <plan.json> --out <modules.part.json>
// Извлекает: module-узлы (file-уровень — схлопывание в директории делает merge.mjs),
// import-рёбра module→module, uses-рёбра module→tech (какой файл какую библиотеку тянет),
// pkg-узлы workspace-пакетов + depends-рёбра pkg→pkg, page-узлы Next App Router (+ uses page→module).
// Сами tech-узлы создаёт extract-env — здесь только связи к уже объявленным зависимостям.

import fs from 'node:fs'
import path from 'node:path'
import {
  parseArgs, readText, readJson, lineOfIndex, makeNode, makeEdge, partFile, writeJson,
  loadPlan, findNearestPackageJson,
} from './lib/core.mjs'
import { loadTypeScript, parseSource, extractImportsAst, extractImportsRegex, resolveImport } from './lib/ts.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  plan: { flag: '--plan', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.plan || !args.out) {
  console.log('Usage: node extract-modules.mjs --root <target> --plan <plan.json> --out <modules.part.json>')
  process.exit(args.help ? 0 : 1)
}
const root = path.resolve(args.root)
const plan = loadPlan(args.plan)
const codeFiles = plan.files?.code ?? []
const tsAliases = plan.tsAliases ?? {}
const packages = plan.repo?.packages ?? []

const nodes = []
const edges = []

// ── Парсер: typescript целевого репо (per-file AST) или regex-fallback ───────
const packageDirs = ['', ...packages.map((pkg) => pkg.path)]
const tsInfo = plan.stacks?.parser === 'ts'
  ? await loadTypeScript(root, packageDirs)
  : { ts: null, mode: 'regex' }
const ts = tsInfo.ts

// ── Объявленный техстек: только он даёт uses-рёбра ───────────────────────────
// Набор строится по тем же правилам, что и tech-узлы в extract-env (deps + devDeps,
// без @types/* и workspace-пакетов) — иначе merge наплодил бы stub-узлов на
// транзитивные и неустановленные импорты.
const workspaceNames = new Set(packages.map((pkg) => pkg.name))
const techPackages = new Set()
for (const file of plan.files?.packageJson ?? []) {
  const manifest = readJson(path.join(root, file))
  if (!manifest) continue
  for (const section of ['dependencies', 'devDependencies']) {
    for (const dep of Object.keys(manifest[section] ?? {})) {
      if (dep.startsWith('@types/') || workspaceNames.has(dep)) continue
      techPackages.add(dep)
    }
  }
}

// node:*-встроенные — рантайм, а не технология проекта: на карте они только шумят
const NODE_BUILTINS = new Set([
  'fs', 'path', 'http', 'https', 'http2', 'crypto', 'url', 'os', 'child_process', 'events',
  'stream', 'util', 'zlib', 'buffer', 'worker_threads', 'perf_hooks', 'readline', 'net',
  'tls', 'dns', 'assert', 'timers', 'string_decoder', 'querystring', 'v8', 'vm', 'cluster',
  'module', 'process', 'console', 'diagnostics_channel', 'inspector', 'punycode', 'repl',
  'tty', 'dgram', 'async_hooks', 'constants', 'wasi', 'test', 'sqlite',
])

function packageOfSpec (spec) {
  // '@scope/name/sub/path' → '@scope/name'; 'lodash/fp' → 'lodash'; node:*/protocol → null
  if (!spec || spec.startsWith('.') || spec.startsWith('/')) return null
  if (/^[a-z][a-z0-9+.-]*:/i.test(spec)) return null // node:fs, bun:test, http(s)://, data:
  const segments = spec.split('/')
  const name = spec.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0]
  if (!name || (spec.startsWith('@') && segments.length < 2)) return null
  if (NODE_BUILTINS.has(name)) return null
  return name
}

// ── 1+2. Module-узлы (каждый файл plan.files.code) + import/uses-рёбра ───────
const codeFileSet = new Set(codeFiles)
const importByPair = new Map() // 'from->to' → {from, to, line, file}
const usesByPair = new Map() // 'file->pkg' → {file, pkg, line} — дедуп повторных импортов в файле
let importCount = 0
for (const relFile of codeFiles) {
  const absolute = path.join(root, relFile)
  const text = readText(absolute)
  if (text === null && !fs.existsSync(absolute)) continue // файл из плана исчез
  const meta = { package: findNearestPackageJson(root, relFile) }
  if (!ts) meta.parser = 'regex'
  nodes.push(makeNode({
    id: `module:${relFile}`,
    kind: 'module',
    layer: 'logic',
    label: relFile,
    source: { file: relFile, line: 1 },
    meta,
  }))
  if (text === null) continue // существует, но огромный — узел есть, импорты пропускаем

  let specs // [{spec, line}]
  if (ts) {
    specs = extractImportsAst(ts, parseSource(ts, relFile, text))
  } else {
    specs = extractImportsRegex(text).map(({ spec, index }) => ({ spec, line: lineOfIndex(text, index) }))
  }
  for (const { spec, line } of specs) {
    const resolved = resolveImport(root, relFile, spec, tsAliases)
    if (resolved === relFile) continue // self-импорт
    if (!resolved) {
      // внешний пакет → связь «модуль использует библиотеку» (главное, чего не хватало карте)
      const pkgName = packageOfSpec(spec)
      if (!pkgName || !techPackages.has(pkgName)) continue
      const key = `${relFile}->${pkgName}`
      const seen = usesByPair.get(key)
      if (!seen || line < seen.line) usesByPair.set(key, { file: relFile, pkg: pkgName, line })
      continue
    }
    if (!codeFileSet.has(resolved)) continue // цель вне плана (не code-файл) — без болтающихся рёбер
    importCount++
    const pair = `${relFile}->${resolved}`
    const existing = importByPair.get(pair)
    if (!existing || line < existing.line) importByPair.set(pair, { from: relFile, to: resolved, line })
  }
}
for (const { from, to, line } of importByPair.values()) {
  edges.push(makeEdge({
    kind: 'import',
    from: `module:${from}`,
    to: `module:${to}`,
    source: { file: from, line },
  }))
}
for (const { file, pkg, line } of usesByPair.values()) {
  edges.push(makeEdge({
    kind: 'uses',
    from: `module:${file}`,
    to: `tech:${pkg}`,
    source: { file, line },
  }))
}

// ── 3. Package-узлы монорепо + depends-рёбра между workspace-пакетами ────────
const packageByName = new Map(packages.map((pkg) => [pkg.name, pkg]))
for (const pkg of packages) {
  const pkgJsonFile = `${pkg.path}/package.json`
  nodes.push(makeNode({
    id: `pkg:${pkg.name}`,
    kind: 'package',
    layer: 'logic',
    label: pkg.name,
    source: { file: pkgJsonFile, line: 1 },
    meta: { path: pkg.path },
  }))
  const text = readText(path.join(root, pkgJsonFile))
  if (text === null) continue
  let manifest
  try {
    manifest = JSON.parse(text)
  } catch {
    continue
  }
  const lines = text.split('\n')
  for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
    for (const depName of Object.keys(manifest[section] ?? {})) {
      const target = packageByName.get(depName)
      if (!target || target === pkg) continue
      const lineIndex = lines.findIndex((line) => line.includes(`"${depName}"`))
      edges.push(makeEdge({
        kind: 'depends',
        from: `pkg:${pkg.name}`,
        to: `pkg:${depName}`,
        source: { file: pkgJsonFile, line: lineIndex === -1 ? 1 : lineIndex + 1 },
        meta: { section },
      }))
    }
  }
}

// ── 4. Client-слой: page/layout Next App Router → page-узлы + uses→module ────
const pageFiles = (plan.files?.nextApp ?? []).filter((file) => /(^|\/)(page|layout)\.(ts|tsx|js|jsx)$/.test(file))
const pageIds = new Set()
let pageCount = 0
for (const relFile of pageFiles) {
  if (!fs.existsSync(path.join(root, relFile))) continue
  const segments = relFile.split('/')
  const appIndex = segments.indexOf('app')
  if (appIndex === -1) continue
  const isLayout = /^layout\./.test(segments[segments.length - 1])
  const routeSegments = segments.slice(appIndex + 1, -1)
    .filter((segment) => !/^\(.*\)$/.test(segment)) // route-группы (x) не влияют на путь
    .map((segment) => segment
      .replace(/^\[\.{3}(.+)\]$/, ':$1*') // catch-all [...slug] → :slug*
      .replace(/^\[(.+)\]$/, ':$1')) // динамика [id] → :id
  const routePath = '/' + routeSegments.join('/')
  const label = isLayout ? `${routePath} (layout)` : routePath
  const id = `page:${label}`
  if (pageIds.has(id)) continue // коллизия маршрутов (несколько app-корней) — первый выигрывает
  pageIds.add(id)
  pageCount++
  nodes.push(makeNode({
    id,
    kind: 'page',
    layer: 'client',
    label,
    source: { file: relFile, line: 1 },
    meta: { file: relFile, route: routePath, layout: isLayout },
  }))
  if (codeFileSet.has(relFile)) {
    edges.push(makeEdge({
      kind: 'uses',
      from: id,
      to: `module:${relFile}`,
      source: { file: relFile, line: 1 },
    }))
  }
}

// ── Запись part-файла (детерминизм: без таймстампов, partFile сортирует) ─────
const moduleCount = nodes.filter((node) => node.kind === 'module').length
const stats = {
  modules: moduleCount,
  imports: importByPair.size,
  usesTech: usesByPair.size,
  packages: packages.length,
  pages: pageCount,
  parser: ts ? 'ts' : 'regex',
}
writeJson(args.out, partFile({ part: 'modules', root, nodes, edges, stats }))
console.log(`archmap modules: ${moduleCount} modules, ${importByPair.size} imports` +
  (importCount > importByPair.size ? ` (${importCount} raw)` : '') +
  `, ${usesByPair.size} uses-tech, ${packages.length} packages, ${pageCount} pages → ${args.out}`)
