#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const SOURCE_EXT = /\.(?:[cm]?[jt]sx?|mts|cts)$/
const IGNORE_DIRS = new Set(['.expo', '.git', 'android', 'build', 'coverage', 'dist', 'ios', 'node_modules', 'web-build'])
const UI_PATH = /(?:^|\/)(?:app|ui|components?|screens?)\//
const THEME_PATH = /(?:^|\/)shared\/theme\//
const HAPTIC_BOUNDARY = /(?:^|\/)shared\/(?:haptics|interaction)\//

function usage() {
  return 'Usage: guard.mjs [--root <expo-project>] [--format text|json] [--hook]\n\nExit codes: 0 clean, 1 violations, 2 CLI/runtime error.\n'
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

function posix(value) { return value.split(path.sep).join('/') }

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

function lineColumn(source, offset) {
  const before = source.slice(0, offset)
  const line = before.split('\n').length
  return { line, column: offset - before.lastIndexOf('\n') }
}

function add(findings, rule, file, source, offset, message, target) {
  findings.push({ rule, file, ...lineColumn(source, offset), target, message })
}

function matches(source, pattern) {
  const found = []
  let match
  while ((match = pattern.exec(source)) !== null) found.push(match)
  return found
}

export function scanProject(rootInput) {
  const root = path.resolve(rootInput)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`root is not a directory: ${rootInput}`)
  const roots = ['app', 'src'].map((dir) => path.join(root, dir)).filter((dir) => fs.existsSync(dir))
  const files = [...new Set(roots.flatMap((dir) => walk(dir, root)))].sort()
  const findings = []
  let usesMotion = false
  let hasReducedMotionPolicy = false

  for (const file of files) {
    const source = fs.readFileSync(path.join(root, file), 'utf8')
    if (/ReducedMotionConfig|useReducedMotion|ReduceMotion\./.test(source)) hasReducedMotionPolicy = true
    if (/react-native-reanimated|withTiming\s*\(|withSpring\s*\(|\.duration\s*\(/.test(source)) usesMotion = true

    if (UI_PATH.test(file) && !THEME_PATH.test(file)) {
      for (const match of matches(source, /#[0-9a-fA-F]{3,8}\b/g)) {
        add(findings, 'EXPOUI001', file, source, match.index, 'UI colors must use semantic theme tokens', match[0])
      }
    }

    const durationPatterns = [
      /\bwithTiming\s*\([^,]+,\s*\{[^}]*\bduration\s*:\s*(\d+)/gs,
      /\.(?:duration|delay)\s*\(\s*(\d+)\s*\)/g,
    ]
    for (const pattern of durationPatterns) {
      for (const match of matches(source, pattern)) {
        const value = match[1]
        if (value === '0') continue
        const offset = match.index + match[0].lastIndexOf(value)
        add(findings, 'EXPOUI002', file, source, offset, 'animation duration/delay must use a named motion token', value)
      }
    }

    if (!HAPTIC_BOUNDARY.test(file)) {
      for (const match of matches(source, /(?:from\s*['"]expo-haptics['"]|require\s*\(\s*['"]expo-haptics['"]\s*\))/g)) {
        add(findings, 'EXPOUI003', file, source, match.index, 'expo-haptics must be wrapped by the shared semantic haptics/interaction boundary', 'expo-haptics')
      }
    }

    if (/(?:^|\/)app\/.*\.(?:[cm]?[jt]sx?|mts|cts)$/.test(file)) {
      for (const match of matches(source, /\b(?:translateX|cardStyleInterpolator)\b/g)) {
        add(findings, 'EXPOUI004', file, source, match.index, 'route files must use semantic native navigation instead of custom horizontal screen transitions', match[0])
      }
    }
  }

  if (usesMotion && !hasReducedMotionPolicy) {
    findings.push({ rule: 'EXPOUI005', file: 'src/shared', line: 1, column: 1, target: 'ReducedMotionConfig/useReducedMotion', message: 'project uses motion but has no detectable centralized Reduced Motion policy' })
  }

  return findings.sort((a, b) => a.rule.localeCompare(b.rule) || a.file.localeCompare(b.file) || a.line - b.line || a.column - b.column || a.target.localeCompare(b.target))
}

function formatText(findings) {
  if (!findings.length) return 'expo-ui-design-motion: clean\n'
  const lines = findings.map((f) => `${f.rule} ${f.file}:${f.line}:${f.column} ${f.message} (${f.target})`)
  lines.push(`expo-ui-design-motion: ${findings.length} violation${findings.length === 1 ? '' : 's'}`)
  return `${lines.join('\n')}\n`
}

function findExpoRoot(start) {
  let current = path.resolve(start)
  while (true) {
    const pkg = path.join(current, 'package.json')
    const config = ['app.json', 'app.config.js', 'app.config.ts'].some((name) => fs.existsSync(path.join(current, name)))
    if (fs.existsSync(pkg)) {
      try {
        const json = JSON.parse(fs.readFileSync(pkg, 'utf8'))
        if (json.dependencies?.expo || json.devDependencies?.expo || config) return current
      } catch { /* hook mode fails open */ }
    } else if (config) return current
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
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `⚠️ expo-ui-design-motion guard нашёл ${findings.length} нарушений:\n${preview}\nЗапусти /expo-mobile:ui-audit для полного отчёта.` } }))
}

async function main() {
  let args
  try { args = parseArgs(process.argv.slice(2)) } catch (error) { process.stderr.write(`expo-ui-design-motion: ${error.message}\n${usage()}`); process.exitCode = 2; return }
  if (args.help) { process.stdout.write(usage()); return }
  if (args.hook) { await hookMode(); return }
  try {
    const findings = scanProject(args.root)
    process.stdout.write(args.format === 'json' ? `${JSON.stringify({ violations: findings }, null, 2)}\n` : formatText(findings))
    process.exitCode = findings.length ? 1 : 0
  } catch (error) {
    process.stderr.write(`expo-ui-design-motion: ${error.message}\n`)
    process.exitCode = 2
  }
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntry) await main()
