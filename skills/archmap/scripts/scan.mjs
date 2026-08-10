#!/usr/bin/env node
// archmap scan.mjs — фаза 0: детект стеков + план файлов для экстракторов.
// Использование: node scan.mjs --root <target> [--out-dir <dir>]
// Выход: <out-dir>/plan.json

import fs from 'node:fs'
import path from 'node:path'
import { parseArgs, readJson, readJsonc, writeJson, walk, toPosix } from './lib/core.mjs'
import { loadTypeScript } from './lib/ts.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  outDir: { flag: '--out-dir', default: null },
})
if (args.help) {
  console.log('Usage: node scan.mjs --root <target> [--out-dir <dir>]')
  process.exit(0)
}
const root = path.resolve(args.root)
const outDir = path.resolve(args.outDir ?? path.join(root, '.archmap'))

const started = Date.now()
const nested = []
const files = walk(root, { nested })

// ── Монорепо и package.json ──────────────────────────────────────────────────
const rootPkg = readJson(path.join(root, 'package.json')) ?? {}
const workspaceGlobs = []
if (Array.isArray(rootPkg.workspaces)) workspaceGlobs.push(...rootPkg.workspaces)
else if (Array.isArray(rootPkg.workspaces?.packages)) workspaceGlobs.push(...rootPkg.workspaces.packages)
const pnpmWorkspace = files.includes('pnpm-workspace.yaml')
if (pnpmWorkspace) {
  const text = fs.readFileSync(path.join(root, 'pnpm-workspace.yaml'), 'utf8')
  for (const match of text.matchAll(/^\s*-\s*['"]?([^'"#\n]+?)['"]?\s*$/gm)) workspaceGlobs.push(match[1].trim())
}
const packageJsonFiles = files.filter((file) => file.endsWith('package.json'))
const packages = []
for (const file of packageJsonFiles) {
  if (file === 'package.json') continue
  const dir = path.posix.dirname(file)
  const matchesGlob = workspaceGlobs.some((glob) => {
    const prefix = glob.replace(/\/?\*+.*$/, '')
    return prefix ? dir.startsWith(prefix) : false
  })
  if (workspaceGlobs.length && !matchesGlob) continue
  const pkg = readJson(path.join(root, file))
  if (pkg?.name) packages.push({ name: pkg.name, path: dir })
}
packages.sort((a, b) => a.path.localeCompare(b.path))
const monorepo = packages.length > 0
  || files.includes('lerna.json') || files.includes('turbo.json') || pnpmWorkspace

// ── Все deps по всем package.json ────────────────────────────────────────────
const allDeps = new Map() // name → {version, file}
for (const file of packageJsonFiles) {
  const pkg = readJson(path.join(root, file)) ?? {}
  for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
    for (const [name, version] of Object.entries(pkg[section] ?? {})) {
      if (!allDeps.has(name)) allDeps.set(name, { version, file })
    }
  }
}
const hasDep = (...names) => names.find((name) => allDeps.has(name)) ?? null
const filesBy = (regex) => files.filter((file) => regex.test(file))

// ── Матрица детекта: стек → {files-маркеры, deps-маркеры} ───────────────────
const detected = []
const evidence = {}
const detect = (stack, fileMatches, depName) => {
  if (fileMatches.length) {
    detected.push(stack)
    evidence[stack] = { file: fileMatches[0] }
    return true
  }
  if (depName) {
    detected.push(stack)
    evidence[stack] = { dep: `${depName}@${allDeps.get(depName).version}` }
    return true
  }
  return false
}

detect('prisma', filesBy(/(^|\/)schema\.prisma$/), hasDep('prisma', '@prisma/client'))
detect('drizzle', filesBy(/(^|\/)drizzle\.config\.(ts|js|mjs)$/), hasDep('drizzle-orm'))
detect('typeorm', filesBy(/(^|\/)(ormconfig\.\w+|data-source\.ts)$/), hasDep('typeorm'))
detect('sql-migrations', filesBy(/(^|\/)(migrations|db\/migrations)\/.*\.sql$/), hasDep('knex', 'node-pg-migrate', 'kysely'))
detect('mongoose', [], hasDep('mongoose'))
detect('fastify', [], hasDep('fastify'))
detect('express', [], hasDep('express'))
detect('nestjs', filesBy(/(^|\/)nest-cli\.json$/), hasDep('@nestjs/core'))
detect('nextjs', filesBy(/(^|\/)next\.config\.(js|mjs|ts)$/), hasDep('next'))
detect('redis', [], hasDep('ioredis', 'redis'))
detect('queue', [], hasDep('bullmq', 'bull', 'bee-queue', 'agenda'))
detect('vector', [], hasDep('@pinecone-database/pinecone', 'weaviate-ts-client', 'chromadb', '@qdrant/js-client-rest'))
detect('websocket', [], hasDep('ws', 'socket.io', '@fastify/websocket'))
detect('cron', filesBy(/(^|\/)vercel\.json$/).filter((file) => JSON.stringify(readJson(path.join(root, file)) ?? {}).includes('"crons"')), hasDep('node-cron', 'croner', '@nestjs/schedule'))
detect('mcp', filesBy(/(^|\/)\.mcp\.json$/), hasDep('@modelcontextprotocol/sdk'))
detect('ai-sdk', [], hasDep('@anthropic-ai/sdk', 'openai', 'ai', '@anthropic-ai/claude-agent-sdk'))
const agentMdFiles = filesBy(/(^|\/)(\.claude\/)?agents\/[^/]+\.md$/)
if (agentMdFiles.length) detect('claude-agents', agentMdFiles, null)
if (monorepo) { detected.push('monorepo'); evidence.monorepo = { packages: packages.length } }

// ── typescript целевого репо ─────────────────────────────────────────────────
const packageDirs = ['', ...packages.map((pkg) => pkg.path)]
const tsInfo = await loadTypeScript(root, packageDirs)

// ── Списки файлов на разбор (чтобы экстракторы не сканировали ФС повторно) ──
const codeFiles = filesBy(/\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/)
const tsAliases = loadTsPathAliasesSafe(root)

const plan = {
  version: 1,
  root: toPosix(root),
  outDir: toPosix(outDir),
  scannedAt: new Date().toISOString(),
  repo: { name: rootPkg.name ?? path.basename(root), monorepo, packages },
  stacks: { detected: [...new Set(detected)].sort(), parser: tsInfo.mode, tsVersion: tsInfo.version, evidence },
  tsAliases,
  files: {
    total: files.length,
    code: codeFiles,
    prisma: filesBy(/(^|\/)schema\.prisma$/),
    drizzle: codeFiles.filter((file) => /(schema|db)\/.*\.(ts|mts)$/.test(file) || /drizzle/.test(file)),
    sql: filesBy(/\.sql$/),
    packageJson: packageJsonFiles,
    envFiles: filesBy(/(^|\/)\.env\.example$/),
    mcpJson: filesBy(/(^|\/)\.mcp\.json$/),
    agentsMd: agentMdFiles,
    nextApp: filesBy(/(^|\/)app\/.*\/(route|page|layout)\.(ts|tsx|js|jsx)$/),
    vercelJson: filesBy(/(^|\/)vercel\.json$/),
    dockerCompose: filesBy(/(^|\/)(docker-)?compose(\.\w+)?\.ya?ml$/),
  },
  stats: { elapsedMs: Date.now() - started, nestedRepos: nested.sort() },
}

function loadTsPathAliasesSafe(targetRoot) {
  const config = readJsonc(path.join(targetRoot, 'tsconfig.json'))
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

writeJson(path.join(outDir, 'plan.json'), plan)
console.log(`archmap scan: ${plan.stacks.detected.length} stacks [${plan.stacks.detected.join(', ')}], ` +
  `${files.length} files, parser=${tsInfo.mode}${tsInfo.version ? '@' + tsInfo.version : ''}, ` +
  `${packages.length} packages → ${path.join(outDir, 'plan.json')}`)
if (nested.length) {
  console.log(`  пропущены вложенные репозитории/worktree (${nested.length}): ${nested.slice(0, 3).join(', ')}` +
    (nested.length > 3 ? ` и ещё ${nested.length - 3}` : ''))
}
