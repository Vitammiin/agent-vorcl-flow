// archmap lib/ts.mjs — загрузка пакета `typescript` из node_modules ЦЕЛЕВОГО репо
// (никогда не исполняем код самого проекта: только createSourceFile per-file,
// без createProgram/type-checker) + regex-fallback, когда typescript недоступен.

import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

export async function loadTypeScript(targetRoot, packageDirs = ['']) {
  for (const dir of packageDirs) {
    try {
      const anchor = path.join(targetRoot, dir, 'package.json')
      const req = createRequire(pathToFileURL(anchor))
      const entry = req.resolve('typescript')
      const mod = await import(pathToFileURL(entry).href)
      const ts = mod.default ?? mod
      if (typeof ts.createSourceFile !== 'function') throw new Error('unexpected module shape')
      return { ts, version: ts.version, mode: 'ts', from: entry }
    } catch {
      continue
    }
  }
  return { ts: null, version: null, mode: 'regex', from: null }
}

export function parseSource(ts, fileName, text) {
  return ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true)
}

export function lineOf(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
}

// ── Regex-fallback (узлы получают meta.parser: 'regex') ──────────────────────

export const RE = {
  importFrom: /^\s*(?:import|export)\s[^;]*?from\s+['"]([^'"]+)['"]/gm,
  importBare: /^\s*import\s+['"]([^'"]+)['"]/gm,
  requireCall: /\brequire\(\s*['"]([^'"]+)['"]\s*\)/g,
  dynamicImport: /\bimport\(\s*['"]([^'"]+)['"]\s*\)/g,
  httpRoute: /\b(?:app|router|fastify|server|api)\.(get|post|put|patch|delete|head|options|all)\s*\(\s*[`'"]([^`'"]+)[`'"]/g,
  fastifyRoute: /\.route\s*\(\s*\{[^}]*?method:\s*['"](\w+)['"][^}]*?url:\s*[`'"]([^`'"]+)[`'"]/gs,
  nestController: /@Controller\(\s*(?:[`'"]([^`'"]*)[`'"])?\s*\)/g,
  nestMethod: /@(Get|Post|Put|Patch|Delete|Head|Options|All)\(\s*(?:[`'"]([^`'"]*)[`'"])?\s*\)/g,
  envAccess: /\bprocess\.env\.([A-Z][A-Z0-9_]*)|\bprocess\.env\[\s*['"]([A-Z][A-Z0-9_]*)['"]\s*\]/g,
  anthropicCall: /\bmessages\.create\s*\(/g,
  openaiCall: /\bchat\.completions\.create\s*\(|\bresponses\.create\s*\(/g,
  vercelAiCall: /\b(?:generateText|streamText|generateObject|streamObject)\s*\(/g,
  modelId: /['"`]((?:claude|gpt|o[134])[a-z0-9.\-]*[a-z0-9])['"`]/gi,
  cronExpr: /['"`]((?:[\d*/,-]+\s+){4}[\d*/,-]+)['"`]/g,
  wsServer: /new\s+(?:WebSocketServer|WebSocket\.Server|Server)\s*\(|\.register\(\s*(?:fastifyWebsocket|websocket)/g,
}

export function matchAll(regex, text) {
  const results = []
  regex.lastIndex = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    results.push({ match, index: match.index })
    if (match.index === regex.lastIndex) regex.lastIndex++
  }
  return results
}

export function extractImportsRegex(text) {
  const specs = []
  for (const regex of [RE.importFrom, RE.importBare, RE.requireCall, RE.dynamicImport]) {
    for (const { match, index } of matchAll(regex, text)) specs.push({ spec: match[1], index })
  }
  return specs
}

export function extractImportsAst(ts, sourceFile) {
  const specs = []
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      specs.push({ spec: node.moduleSpecifier.text, line: lineOf(sourceFile, node) })
    } else if (ts.isCallExpression(node)) {
      const isRequire = ts.isIdentifier(node.expression) && node.expression.text === 'require'
      const isDynamic = node.expression.kind === ts.SyntaxKind.ImportKeyword
      if ((isRequire || isDynamic) && node.arguments.length && ts.isStringLiteral(node.arguments[0])) {
        specs.push({ spec: node.arguments[0].text, line: lineOf(sourceFile, node) })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sourceFile)
  return specs
}

export function resolveImport(root, fromFile, spec, tsPathAliases = {}) {
  // Возвращает относительный POSIX-путь файла проекта или null (внешний пакет).
  if (!spec.startsWith('.') && !spec.startsWith('/')) {
    for (const [alias, targets] of Object.entries(tsPathAliases)) {
      const prefix = alias.replace(/\*$/, '')
      if (spec === prefix.replace(/\/$/, '') || spec.startsWith(prefix)) {
        const remainder = spec.slice(prefix.length)
        for (const target of targets) {
          const candidate = target.replace(/\*$/, '') + remainder
          const resolved = resolveAsFile(root, candidate)
          if (resolved) return resolved
        }
      }
    }
    return null
  }
  const base = spec.startsWith('/') ? spec.slice(1) : path.posix.join(path.posix.dirname(fromFile), spec)
  return resolveAsFile(root, base)
}

const RESOLVE_EXTS = ['', '.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs', '/index.ts', '/index.tsx', '/index.js', '/index.mjs']

function resolveAsFile(root, relBase) {
  const fs = fsSync()
  const clean = relBase.replace(/\.(js|mjs|cjs)$/, (ext) => ext) // as-is first
  for (const ext of RESOLVE_EXTS) {
    const candidate = clean + ext
    try {
      if (fs.statSync(path.join(root, candidate)).isFile()) return candidate
    } catch { /* keep trying */ }
  }
  // TS-компилируемый импорт './x.js' → './x.ts'
  if (/\.(js|mjs|cjs)$/.test(clean)) {
    const swapped = clean.replace(/\.js$/, '.ts').replace(/\.mjs$/, '.mts').replace(/\.cjs$/, '.cts')
    try {
      if (fs.statSync(path.join(root, swapped)).isFile()) return swapped
    } catch { /* not a file */ }
    const tsx = clean.replace(/\.js$/, '.tsx')
    try {
      if (fs.statSync(path.join(root, tsx)).isFile()) return tsx
    } catch { /* not a file */ }
  }
  return null
}

let fsModule = null
function fsSync() {
  if (!fsModule) fsModule = process.getBuiltinModule('node:fs')
  return fsModule
}

export function loadTsPathAliases(root, readJsonc) {
  // { '@app/*': ['src/*'] } из tsconfig.json (baseUrl учитывается)
  const config = readJsonc(path.join(root, 'tsconfig.json'))
  const options = config?.compilerOptions
  if (!options?.paths) return {}
  const baseUrl = options.baseUrl ?? '.'
  const aliases = {}
  for (const [alias, targets] of Object.entries(options.paths)) {
    if (!Array.isArray(targets)) continue
    aliases[alias] = targets.map((target) => path.posix.join(baseUrl, target).replace(/^\.\//, ''))
  }
  return aliases
}
