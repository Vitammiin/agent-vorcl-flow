#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const SOURCE_EXT = /\.(?:[cm]?[jt]sx?|mts|cts)$/
const IGNORE_DIRS = new Set(['.expo', '.git', 'android', 'build', 'coverage', 'dist', 'ios', 'node_modules', 'web-build'])
const NODE_BUILTINS = /^(?:node:|assert(?:\/|$)|buffer(?:\/|$)|child_process$|cluster$|crypto$|dgram$|dns(?:\/|$)|events$|fs(?:\/|$)|http(?:2|s)?$|module$|net$|os$|path(?:\/|$)|perf_hooks$|process$|readline(?:\/|$)|stream(?:\/|$)|string_decoder$|timers(?:\/|$)|tls$|tty$|url$|util(?:\/|$)|v8$|vm$|worker_threads$|zlib$)/
const DOMAIN_FORBIDDEN = /^(?:react(?:\/|$)|react-native(?:\/|$)|expo(?:-|\/|$)|@expo(?:\/|$)|zustand(?:\/|$)|@tanstack\/react-query(?:\/|$)|axios(?:\/|$)|@react-native-async-storage\/async-storage(?:\/|$))/

function usage() {
  return `Usage: guard.mjs [--root <expo-project>] [--format text|json] [--hook]\n\nExit codes: 0 clean, 1 violations, 2 CLI/runtime error.\n`
}

function parseArgs(argv) {
  const out = { root: process.cwd(), format: 'text', hook: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') return { help: true }
    if (arg === '--hook') { out.hook = true; continue }
    if (arg === '--root') { if (!argv[i + 1]) throw new Error('--root requires a path'); out.root = argv[++i]; continue }
    if (arg === '--format') { if (!argv[i + 1]) throw new Error('--format requires text or json'); out.format = argv[++i]; continue }
    throw new Error(`unknown argument: ${arg}`)
  }
  if (!['text', 'json'].includes(out.format)) throw new Error('--format must be text or json')
  return out
}

function posix(value) {
  return value.split(path.sep).join('/')
}

function walk(dir, root, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink() || (entry.isDirectory() && IGNORE_DIRS.has(entry.name))) continue
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(absolute, root, files)
    else if (entry.isFile() && SOURCE_EXT.test(entry.name)) files.push(posix(path.relative(root, absolute)))
  }
  return files
}

function maskNonCode(source) {
  const out = [...source]
  let state = 'code'
  for (let i = 0; i < source.length; i++) {
    const c = source[i]
    const n = source[i + 1]
    if (state === 'code') {
      if (c === '/' && n === '/') { out[i] = out[i + 1] = ' '; i++; state = 'line'; continue }
      if (c === '/' && n === '*') { out[i] = out[i + 1] = ' '; i++; state = 'block'; continue }
      if (c === "'") state = 'single'
      else if (c === '"') state = 'double'
      else if (c === '`') state = 'template'
      continue
    }
    if (state === 'line') {
      if (c === '\n') state = 'code'
      else out[i] = ' '
      continue
    }
    if (state === 'block') {
      if (c === '*' && n === '/') { out[i] = out[i + 1] = ' '; i++; state = 'code' }
      else if (c !== '\n') out[i] = ' '
      continue
    }
    if (c === '\\') { out[i] = ' '; if (i + 1 < source.length) out[++i] = source[i] === '\n' ? '\n' : ' '; continue }
    const end = (state === 'single' && c === "'") || (state === 'double' && c === '"') || (state === 'template' && c === '`')
    if (!end && c !== '\n') out[i] = ' '
    if (end) state = 'code'
  }
  return out.join('')
}

function lineColumn(source, offset) {
  const before = source.slice(0, offset)
  const line = before.split('\n').length
  const last = before.lastIndexOf('\n')
  return { line, column: offset - last }
}

function importsOf(source) {
  const code = maskNonCode(source)
  const patterns = [
    /^[ \t]*(?:import|export)\s+(?:[^;]*?\s+from\s*)?(["'])/gm,
    /\bimport\s*\(\s*(["'])/g,
    /\brequire\s*\(\s*(["'])/g,
  ]
  const found = []
  const seen = new Set()
  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(code)) !== null) {
      const quoteOffset = match.index + match[0].lastIndexOf(match[1])
      let end = quoteOffset + 1
      while (end < source.length && source[end] !== match[1]) {
        if (source[end] === '\\') end++
        end++
      }
      if (end >= source.length) continue
      const specifier = source.slice(quoteOffset + 1, end)
      const specOffset = quoteOffset + 1
      const key = `${specOffset}:${specifier}`
      if (seen.has(key)) continue
      seen.add(key)
      found.push({ specifier, offset: specOffset, ...lineColumn(source, specOffset) })
    }
  }
  return found.sort((a, b) => a.offset - b.offset)
}

function resolveImport(file, specifier) {
  if (specifier.startsWith('@/')) return `src/${specifier.slice(2)}`
  if (specifier.startsWith('~/')) return `src/${specifier.slice(2)}`
  if (specifier.startsWith('src/')) return specifier
  if (specifier.startsWith('modules/') || specifier.startsWith('shared/') || specifier.startsWith('providers/') || specifier.startsWith('app/')) return `src/${specifier}`
  if (specifier.startsWith('.')) return posix(path.normalize(path.join(path.dirname(file), specifier)))
  return null
}

function moduleName(file) {
  return file.match(/^src\/modules\/([^/]+)(?:\/|$)/)?.[1] ?? null
}

function isRoute(file) {
  return file.startsWith('src/app/') || file.startsWith('app/')
}

function addFinding(findings, rule, file, item, message) {
  findings.push({ rule, file, line: item.line, column: item.column, target: item.specifier, message })
}

export function scanProject(rootInput) {
  const root = path.resolve(rootInput)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`root is not a directory: ${rootInput}`)
  const roots = ['app', 'src'].map((dir) => path.join(root, dir)).filter((dir) => fs.existsSync(dir))
  const files = [...new Set(roots.flatMap((dir) => walk(dir, root)))].sort()
  const findings = []
  const graph = new Map()

  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8')
    const owner = moduleName(file)
    const inShared = file.startsWith('src/shared/')
    const inDomain = /^src\/modules\/[^/]+\/domain\//.test(file)

    for (const item of importsOf(source)) {
      const target = resolveImport(file, item.specifier)
      const targetOwner = target ? moduleName(target) : null

      if (inShared && target && /^(?:src\/modules\/|src\/app\/|app\/|src\/providers\/)/.test(target)) {
        addFinding(findings, 'EXPO001', file, item, 'shared infrastructure must not depend on modules, routes, or providers')
      }
      if (owner && target && /^(?:src\/app\/|app\/|src\/providers\/)/.test(target)) {
        addFinding(findings, 'EXPO002', file, item, 'business modules must not depend on routing or global providers')
      }
      if (owner && targetOwner && targetOwner !== owner) {
        graph.set(owner, new Set([...(graph.get(owner) ?? []), targetOwner]))
        const publicTarget = new RegExp(`^src/modules/${targetOwner}(?:/index)?$`).test(target.replace(/\.(?:[cm]?[jt]sx?|mts|cts)$/, ''))
        if (!publicTarget) addFinding(findings, 'EXPO003', file, item, `cross-module access to "${targetOwner}" must use its public index.ts`)
      }
      if (isRoute(file) && targetOwner) {
        const publicTarget = new RegExp(`^src/modules/${targetOwner}(?:/index)?$`).test(target.replace(/\.(?:[cm]?[jt]sx?|mts|cts)$/, ''))
        if (!publicTarget) addFinding(findings, 'EXPO004', file, item, 'Expo Router files may import a module only through its public API')
      }
      if (inDomain) {
        if (DOMAIN_FORBIDDEN.test(item.specifier) || NODE_BUILTINS.test(item.specifier) || (target && !target.startsWith(`src/modules/${owner}/domain/`))) {
          addFinding(findings, 'EXPO005', file, item, 'domain must remain framework- and infrastructure-independent')
        }
      }
      if (/\.(?:android|ios|native|web)(?:\.[^/]+)?$/.test(item.specifier)) {
        addFinding(findings, 'EXPO006', file, item, 'do not import a platform suffix explicitly; let Metro resolve it')
      }
      if (NODE_BUILTINS.test(item.specifier) && (file.startsWith('src/') || file.startsWith('app/'))) {
        addFinding(findings, 'EXPO007', file, item, 'mobile runtime code must not import Node.js built-ins')
      }
    }
  }

  const cycles = new Set()
  function visit(start, current, trail) {
    for (const next of [...(graph.get(current) ?? [])].sort()) {
      if (next === start) cycles.add([...trail, next].join(' -> '))
      else if (!trail.includes(next)) visit(start, next, [...trail, next])
    }
  }
  for (const start of [...graph.keys()].sort()) visit(start, start, [start])
  for (const cycle of [...cycles].sort()) findings.push({ rule: 'EXPO008', file: 'src/modules', line: 1, column: 1, target: cycle, message: 'circular dependency between business modules' })

  return findings.sort((a, b) => a.rule.localeCompare(b.rule) || a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column || a.target.localeCompare(b.target))
}

function formatText(findings) {
  if (findings.length === 0) return 'expo-mobile-architecture: clean\n'
  const lines = findings.map((f) => `${f.rule} ${f.file}:${f.line}:${f.column} ${f.message} (${f.target})`)
  lines.push(`expo-mobile-architecture: ${findings.length} violation${findings.length === 1 ? '' : 's'}`)
  return `${lines.join('\n')}\n`
}

function findExpoRoot(start) {
  let current = path.resolve(start)
  while (true) {
    const pkg = path.join(current, 'package.json')
    const appConfig = ['app.json', 'app.config.js', 'app.config.ts'].some((name) => fs.existsSync(path.join(current, name)))
    if (fs.existsSync(pkg)) {
      try {
        const json = JSON.parse(fs.readFileSync(pkg, 'utf8'))
        if (json.dependencies?.expo || json.devDependencies?.expo || appConfig) return current
      } catch { /* malformed package: continue upward, hook must fail open */ }
    } else if (appConfig) return current
    const parent = path.dirname(current)
    if (parent === current) return null
    current = parent
  }
}

async function hookMode() {
  let data = {}
  try { data = JSON.parse(fs.readFileSync(0, 'utf8') || '{}') } catch { return }
  const edited = data?.tool_input?.file_path || data?.tool_input?.path || ''
  if (!SOURCE_EXT.test(edited)) return
  const root = findExpoRoot(data.cwd || path.dirname(edited) || process.cwd())
  if (!root) return
  let findings
  try { findings = scanProject(root) } catch { return }
  if (!findings.length) return
  const preview = findings.slice(0, 12).map((f) => `• ${f.rule} ${f.file}:${f.line} — ${f.message}`).join('\n')
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `⚠️ expo-mobile-architecture guard нашёл ${findings.length} нарушений:\n${preview}\nЗапусти /expo-mobile:audit для полного отчёта.` } }))
}

async function main() {
  let args
  try { args = parseArgs(process.argv.slice(2)) } catch (error) { process.stderr.write(`expo-mobile-architecture: ${error.message}\n${usage()}`); process.exitCode = 2; return }
  if (args.help) { process.stdout.write(usage()); return }
  if (args.hook) { await hookMode(); return }
  try {
    const findings = scanProject(args.root)
    process.stdout.write(args.format === 'json' ? `${JSON.stringify({ violations: findings }, null, 2)}\n` : formatText(findings))
    process.exitCode = findings.length ? 1 : 0
  } catch (error) {
    process.stderr.write(`expo-mobile-architecture: ${error.message}\n`)
    process.exitCode = 2
  }
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntry) await main()
