#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

/**
 * @typedef {'error' | 'warn' | 'info'} Severity
 * @typedef {{
 *   rule: string,
 *   severity: Severity,
 *   file: string,
 *   line: number,
 *   message: string,
 *   evidence: string
 * }} Finding
 */

const SOURCE_EXT = /\.(?:[cm]?[jt]sx?|mts|cts)$/
const IGNORE_DIRS = new Set([
  '.git', '.hg', '.svn', 'node_modules', 'vendor', 'dist', 'build', 'coverage',
  '.next', '.nuxt', '.output', '.turbo', 'out',
])
const TEST_SEGMENTS = new Set(['test', 'tests', '__tests__', 'spec', 'specs', 'fixtures', '__fixtures__'])
const LOGGER_CALL = /(?:logger|log|request\.log|ctx\.logger|context\.logger)\.(?:trace|debug|info|warn|error|fatal)\s*\(/g
const SECRET_KEY = /\b(?:password|passwordHash|token|accessToken|refreshToken|authorization|apiKey|api_key|privateKey|cookie|cookies|creditCard|cardNumber|cvv|sessionToken)\s*:/
const REQUEST_BODY = /\b(?:req|request)\.(?:body|headers|cookies)\b/
const LOKI_SINK = /pino-loki|winston-loki|grafana-loki|\/loki\/api\/v1\/push|signoz\.(?:io|cloud).*ingest|new\s+Loki(?:Transport|Client)/i
const CONSOLE_CALL = /\bconsole\.(?:log|debug|info|warn|error)\s*\(/g
const LOCAL_PINO = /(?:^|[^\w$.])pino\s*\(/
const ERROR_AS_MESSAGE = /(?:logger|log|request\.log|ctx\.logger)\.error\s*\(\s*(?:err|error|e|exception)\s*(?:\?\.|\.)\s*message/g
const INTERPOLATED = /(?:logger|log|request\.log|ctx\.logger)\.(?:trace|debug|info|warn|error|fatal)\s*\(\s*`[^`]*\$\{/g
const PRETTY_TARGET = /target\s*:\s*['"]pino-pretty['"]|require\(\s*['"]pino-pretty['"]\s*\)|from\s+['"]pino-pretty['"]/
const NODE_ENV_DEV = /NODE_ENV\s*===?\s*['"]development['"]|NODE_ENV\s*!==?\s*['"]production['"]/

/**
 * @param {string} relativePath
 * @returns {string}
 */
function normalize(relativePath) {
  return relativePath.split(path.sep).join('/')
}

/**
 * @param {string} relativePath
 * @returns {boolean}
 */
function isLoggingPackage(relativePath) {
  const file = normalize(relativePath).toLowerCase()
  return /(?:^|\/)(?:src\/)?(?:infrastructure|shared)\/logging(?:\/|$)/.test(file)
}

/**
 * @param {string} relativePath
 * @returns {boolean}
 */
function isTestLike(relativePath) {
  const file = normalize(relativePath).toLowerCase()
  const segments = file.split('/')
  const base = segments.at(-1) ?? ''
  return segments.some((segment) => TEST_SEGMENTS.has(segment)) ||
    /(?:^|\.)(?:test|spec|stories)\.[^.]+$/.test(base)
}

/**
 * @param {string} dir
 * @param {string} root
 * @param {string[]} files
 * @returns {string[]}
 */
function walk(dir, root, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink() || (entry.isDirectory() && IGNORE_DIRS.has(entry.name))) continue
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(absolute, root, files)
    else if (entry.isFile() && SOURCE_EXT.test(entry.name)) files.push(normalize(path.relative(root, absolute)))
  }
  return files
}

/**
 * @param {string} source
 * @param {number} offset
 * @returns {number}
 */
function lineAt(source, offset) {
  return source.slice(0, offset).split('\n').length
}

/**
 * @param {string} source
 * @param {number} line
 * @returns {string}
 */
function lineText(source, line) {
  return source.split('\n')[line - 1]?.trim() ?? ''
}

/**
 * @param {string} relativePath
 * @param {string} source
 * @param {boolean} includeTest
 * @returns {Finding[]}
 */
export function scanSource(relativePath, source, includeTest = false) {
  /** @type {Finding[]} */
  const findings = []
  const file = normalize(relativePath)
  if (!includeTest && isTestLike(file)) return findings
  const isClient = /^['"]use client['"]/.test(source.trim())
  const isRootLogger = isLoggingPackage(file) && /(?:logger|index)\.[cm]?[jt]sx?$/.test(file)
  /**
   * @param {string} rule
   * @param {Severity} severity
   * @param {number} index
   * @param {string} message
   */
  const add = (rule, severity, index, message) => {
    const line = lineAt(source, index)
    findings.push({
      rule,
      severity,
      file,
      line,
      message,
      evidence: lineText(source, line).slice(0, 200),
    })
  }
  if (isClient && /(?:from|require\()\s*['"]pino['"]/.test(source)) {
    add('pino.client-import', 'error', source.search(/(?:from|require\()\s*['"]pino['"]/), 'Node Pino logger imported into a Client Component')
  }
  if (LOCAL_PINO.test(source) && !isLoggingPackage(file)) {
    const match = source.match(LOCAL_PINO)
    if (match && match.index != null) add('pino.local-instance', 'error', match.index, 'pino() must live in infrastructure/logging or shared/logging')
  }
  if (isRootLogger && LOCAL_PINO.test(source) && !/\bredact\s*:/.test(source)) {
    add('pino.missing-redact', 'error', source.search(LOCAL_PINO), 'Root Pino logger is missing redact paths')
  }
  if (PRETTY_TARGET.test(source) && !NODE_ENV_DEV.test(source)) {
    const match = source.match(PRETTY_TARGET)
    if (match && match.index != null) add('pino.pretty-unconditional', 'warn', match.index, 'pino-pretty must be development-only')
  }
  const loki = source.match(LOKI_SINK)
  if (loki && loki.index != null) add('pino.direct-collector', 'error', loki.index, 'Application must not push logs directly to Loki/SigNoz')
  const patterns = [
    [CONSOLE_CALL, 'pino.console-log', 'warn', 'Replace production console.* with the shared Pino logger'],
    [INTERPOLATED, 'pino.interpolated-message', 'warn', 'Use structured fields instead of interpolated log messages'],
    [ERROR_AS_MESSAGE, 'pino.error-as-message', 'error', 'Pass the Error as { err }, not err.message'],
  ]
  for (const [pattern, rule, severity, message] of patterns) {
    pattern.lastIndex = 0
    let match = pattern.exec(source)
    while (match) {
      add(rule, severity, match.index, message)
      match = pattern.exec(source)
    }
  }
  LOGGER_CALL.lastIndex = 0
  let loggerMatch = LOGGER_CALL.exec(source)
  while (loggerMatch) {
    const start = loggerMatch.index
    const window = source.slice(start, start + 400)
    if (SECRET_KEY.test(window)) add('pino.secret-field', 'error', start, 'Secret/PII field passed to logger')
    if (REQUEST_BODY.test(window)) add('pino.request-body', 'warn', start, 'Do not log req.body/headers by default')
    loggerMatch = LOGGER_CALL.exec(source)
  }
  return findings
}

/**
 * @param {string} root
 * @param {{ includeTest?: boolean, file?: string }} [options]
 * @returns {Finding[]}
 */
export function scanProject(root, options = {}) {
  const resolved = path.resolve(root)
  const files = options.file
    ? [normalize(options.file)]
    : walk(resolved, resolved)
  /** @type {Finding[]} */
  const findings = []
  for (const file of files) {
    const absolute = path.join(resolved, file)
    if (!fs.existsSync(absolute) || !SOURCE_EXT.test(file)) continue
    let source = ''
    try {
      const stat = fs.statSync(absolute)
      if (!stat.isFile() || stat.size > 1_000_000) continue
      source = fs.readFileSync(absolute, 'utf8')
    } catch {
      continue
    }
    findings.push(...scanSource(file, source, options.includeTest === true))
  }
  return findings.sort((left, right) => left.file.localeCompare(right.file) || left.line - right.line || left.rule.localeCompare(right.rule))
}

/**
 * @param {Finding[]} findings
 * @returns {string}
 */
export function formatText(findings) {
  if (!findings.length) return 'pino-logging: clean\n'
  const lines = [`pino-logging: ${findings.length} finding(s)`, '']
  for (const finding of findings) {
    lines.push(`${finding.severity.toUpperCase()} ${finding.rule} ${finding.file}:${finding.line}`)
    lines.push(`  ${finding.message}`)
    if (finding.evidence) lines.push(`  ${finding.evidence}`)
  }
  return `${lines.join('\n')}\n`
}

/**
 * @returns {{ root: string, format: 'text' | 'json', hook: boolean, includeTest: boolean, file?: string, help?: boolean }}
 */
function parseArgs(argv) {
  const out = { root: process.cwd(), format: /** @type {'text' | 'json'} */ ('text'), hook: false, includeTest: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') return { ...out, help: true }
    if (arg === '--hook') { out.hook = true; continue }
    if (arg === '--include-test') { out.includeTest = true; continue }
    if (arg === '--root') {
      if (!argv[i + 1]) throw new Error('--root requires a path')
      out.root = argv[++i]
      continue
    }
    if (arg === '--file') {
      if (!argv[i + 1]) throw new Error('--file requires a path')
      out.file = argv[++i]
      continue
    }
    if (arg === '--format') {
      if (!argv[i + 1]) throw new Error('--format requires text or json')
      out.format = /** @type {'text' | 'json'} */ (argv[++i])
      continue
    }
    throw new Error(`unknown argument: ${arg}`)
  }
  if (out.format !== 'text' && out.format !== 'json') throw new Error('--format must be text or json')
  return out
}

/**
 * @returns {Promise<void>}
 */
async function hookMode() {
  let data = {}
  try { data = JSON.parse(fs.readFileSync(0, 'utf8') || '{}') } catch { return }
  const edited = data?.tool_input?.file_path || data?.tool_input?.path || ''
  if (!edited || !SOURCE_EXT.test(edited)) return
  const root = data.cwd || path.dirname(edited) || process.cwd()
  const relative = path.relative(root, edited)
  if (relative.startsWith('..')) return
  let findings = []
  try { findings = scanProject(root, { file: relative }) } catch { return }
  if (!findings.length) return
  const preview = findings.slice(0, 12).map((item) => `• ${item.rule} ${item.file}:${item.line} — ${item.message}`).join('\n')
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: `⚠️ pino-logging guard: ${findings.length} антипаттерн(а) логирования:\n${preview}\nКанон: один root Pino в infrastructure/logging, child logger, { event, err }, JSON в stdout. Помощь: /logging:update ${edited}`,
    },
  }))
}

/**
 * @returns {Promise<void>}
 */
async function main() {
  let args
  try {
    args = parseArgs(process.argv.slice(2))
  } catch (error) {
    process.stderr.write(`pino-logging: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 2
    return
  }
  if (args.help) {
    process.stdout.write('Usage: scan.mjs [--root <project>] [--file <rel>] [--format text|json] [--include-test] [--hook]\n')
    return
  }
  if (args.hook) {
    await hookMode()
    return
  }
  try {
    const findings = scanProject(args.root, { includeTest: args.includeTest, file: args.file })
    process.stdout.write(args.format === 'json' ? `${JSON.stringify({ findings }, null, 2)}\n` : formatText(findings))
    process.exitCode = findings.length ? 1 : 0
  } catch (error) {
    process.stderr.write(`pino-logging: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 2
  }
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntry) await main()
