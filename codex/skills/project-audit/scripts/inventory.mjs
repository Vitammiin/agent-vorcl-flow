#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const IGNORE = new Set(['.git', '.next', '.nuxt', '.output', '.turbo', '.vercel', 'build', 'coverage', 'dist', 'node_modules', 'target', 'vendor', 'web-build'])
const MANIFEST_NAMES = new Set(['package.json', 'pyproject.toml', 'requirements.txt', 'Pipfile', 'poetry.lock', 'go.mod', 'Cargo.toml', 'composer.json', 'Gemfile', 'pom.xml', 'build.gradle', 'build.gradle.kts', 'pubspec.yaml'])
const LOCKFILES = new Set(['package-lock.json', 'npm-shrinkwrap.json', 'pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb', 'uv.lock', 'poetry.lock', 'Pipfile.lock', 'Cargo.lock', 'Gemfile.lock', 'composer.lock'])

function usage() { return 'Usage: inventory.mjs [--root <repo>] [--format text|json]\n' }

function parseArgs(argv) {
  const out = { root: process.cwd(), format: 'text' }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') return { help: true }
    if (arg === '--root') { if (!argv[i + 1]) throw new Error('--root requires a path'); out.root = argv[++i]; continue }
    if (arg === '--format') { if (!argv[i + 1]) throw new Error('--format requires text or json'); out.format = argv[++i]; continue }
    throw new Error(`unknown argument: ${arg}`)
  }
  if (!['text', 'json'].includes(out.format)) throw new Error('--format must be text or json')
  return out
}

function posix(value) { return value.split(path.sep).join('/') }

function walk(root, dir = root, depth = 0, state = { files: [], coverageGaps: [] }) {
  if (depth > 12) { state.coverageGaps.push(`depth limit: ${posix(path.relative(root, dir))}`); return state }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink()) { state.coverageGaps.push(`symlink not followed: ${posix(path.relative(root, path.join(dir, entry.name)))}`); continue }
    if (entry.isDirectory() && IGNORE.has(entry.name)) continue
    const absolute = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(root, absolute, depth + 1, state)
    else if (entry.isFile()) state.files.push(posix(path.relative(root, absolute)))
  }
  return state
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return null }
}

function dependencyNames(pkg) {
  return new Set(Object.keys({ ...pkg?.dependencies, ...pkg?.devDependencies, ...pkg?.peerDependencies, ...pkg?.optionalDependencies }))
}

function hasAny(set, names) { return names.some((name) => set.has(name)) }

function classifyPackage(pkg, rel, files) {
  const deps = dependencyNames(pkg)
  const kinds = new Set()
  const frameworks = new Set()
  const add = (kind, names) => { if (hasAny(deps, names)) { kinds.add(kind); for (const name of names) if (deps.has(name)) frameworks.add(name) } }
  add('mobile', ['expo', 'expo-router', 'react-native'])
  add('frontend', ['next', 'nuxt', 'react', 'react-dom', 'svelte', '@angular/core', 'vue'])
  add('backend', ['@nestjs/core', 'express', 'fastify', 'hapi', 'koa', 'trpc', '@trpc/server'])
  add('database', ['@prisma/client', 'drizzle-orm', 'mongoose', 'mongodb', 'pg', 'redis', 'typeorm', 'sequelize'])
  add('testing', ['jest', 'vitest', '@playwright/test', 'cypress', 'detox', 'maestro'])
  const prefix = rel === '.' ? '' : `${rel}/`
  if ([...files].some((file) => file.startsWith(`${prefix}app/`) || file.startsWith(`${prefix}pages/`))) kinds.add('frontend')
  if ([...files].some((file) => new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:src/)?(?:server|api|worker|functions)/`).test(file))) kinds.add('backend')
  if (kinds.has('mobile') && !hasAny(deps, ['next', 'nuxt', 'react-dom'])) kinds.delete('frontend')
  if (!kinds.size) kinds.add('shared-or-tooling')
  return { kinds: [...kinds].sort(), frameworks: [...frameworks].sort() }
}

function architectureSignals(files) {
  const signals = []
  const rules = [
    ['modular-vertical-slices', /(^|\/)src\/modules\//],
    ['feature-based', /(^|\/)src\/(?:features|entities|widgets)\//],
    ['layered-controller-service', /(^|\/)(?:controllers?|services?|repositories?|routes?)\//],
    ['expo-router', /(^|\/)(?:src\/)?app\/(?:_layout|\([^/]+\)|\+not-found)/],
    ['next-app-router', /(^|\/)app\/(?:layout|page)\.[jt]sx?$/],
    ['database-migrations', /(^|\/)(?:migrations?|prisma)\//],
    ['openapi', /(^|\/)(?:openapi|swagger)(?:\.(?:json|ya?ml)|\/(?:openapi|swagger)\.(?:json|ya?ml))$/i],
  ]
  for (const [name, pattern] of rules) if (files.some((file) => pattern.test(file))) signals.push(name)
  return signals
}

export function inventory(rootInput) {
  const root = path.resolve(rootInput)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`root is not a directory: ${rootInput}`)
  const walkState = walk(root)
  const files = walkState.files
  const manifests = files.filter((file) => MANIFEST_NAMES.has(path.basename(file)))
  const lockfiles = files.filter((file) => LOCKFILES.has(path.basename(file)))
  const packages = []
  for (const manifest of manifests.filter((file) => path.basename(file) === 'package.json')) {
    const pkg = readJson(path.join(root, manifest))
    if (!pkg) { walkState.coverageGaps.push(`malformed manifest: ${manifest}`); continue }
    const rel = posix(path.dirname(manifest))
    packages.push({ path: manifest, root: rel, name: pkg.name ?? null, private: Boolean(pkg.private), workspaces: pkg.workspaces ?? null, ...classifyPackage(pkg, rel, files) })
  }
  const ecosystems = new Set()
  for (const file of [...manifests, ...lockfiles]) {
    const base = path.basename(file)
    if (base.includes('package') || ['pnpm-lock.yaml', 'yarn.lock', 'bun.lock', 'bun.lockb'].includes(base)) ecosystems.add('javascript')
    if (['pyproject.toml', 'requirements.txt', 'Pipfile', 'poetry.lock', 'uv.lock'].includes(base)) ecosystems.add('python')
    if (base === 'go.mod') ecosystems.add('go')
    if (['Cargo.toml', 'Cargo.lock'].includes(base)) ecosystems.add('rust')
    if (['Gemfile', 'Gemfile.lock'].includes(base)) ecosystems.add('ruby')
    if (['composer.json', 'composer.lock'].includes(base)) ecosystems.add('php')
    if (['pom.xml', 'build.gradle', 'build.gradle.kts'].includes(base)) ecosystems.add('jvm')
    if (base === 'pubspec.yaml') ecosystems.add('dart')
  }
  const infra = {
    docker: files.filter((file) => /(^|\/)(?:Dockerfile(?:\..*)?|(?:docker-)?compose(?:\.[^.]+)?\.ya?ml)$/.test(file)),
    ci: files.filter((file) => /^\.github\/workflows\/.*\.ya?ml$/.test(file)),
    iac: files.filter((file) => /\.(?:tf|tfvars)$/.test(file) || /(^|\/)(?:pulumi|k8s|kubernetes|helm)\//i.test(file)),
  }
  const nonJavaScriptUnits = []
  const polyglotRules = [
    ['python', ['pyproject.toml', 'requirements.txt', 'Pipfile'], /\b(?:fastapi|django|flask|starlette|litestar|sanic)\b/i, 'backend'],
    ['go', ['go.mod'], /(?:gin-gonic\/gin|labstack\/echo|gofiber\/fiber|gorilla\/mux|chi\/v\d)/i, 'backend'],
    ['rust', ['Cargo.toml'], /\b(?:axum|actix-web|rocket|warp)\b/i, 'backend'],
    ['jvm', ['pom.xml', 'build.gradle', 'build.gradle.kts'], /(?:spring-boot|quarkus|micronaut|ktor)/i, 'backend'],
    ['ruby', ['Gemfile'], /\b(?:rails|sinatra|hanami)\b/i, 'backend'],
    ['php', ['composer.json'], /(?:laravel|symfony|slim\/slim)/i, 'backend'],
    ['dart', ['pubspec.yaml'], /\bflutter\b/i, 'mobile'],
  ]
  for (const [ecosystem, names, pattern, kind] of polyglotRules) {
    for (const manifest of manifests.filter((file) => names.includes(path.basename(file)))) {
      const source = fs.readFileSync(path.join(root, manifest), 'utf8')
      if (pattern.test(source)) nonJavaScriptUnits.push({ path: manifest, ecosystem, kind, evidence: source.match(pattern)?.[0] ?? null })
    }
  }
  const databases = new Set()
  const composeSource = infra.docker.filter((file) => /compose.*\.ya?ml$/.test(file)).map((file) => fs.readFileSync(path.join(root, file), 'utf8')).join('\n')
  const databaseEvidence = {
    postgres: files.some((file) => /(^|\/)(?:schema\.prisma|drizzle\.config\.[cm]?[jt]s|migrations?\/.*\.sql)$/i.test(file)) || packages.some((pkg) => pkg.frameworks.some((item) => /pg|prisma|drizzle|typeorm|sequelize/.test(item))) || /\bpostgres(?:ql)?(?:\s*[:/]|\b.*image\s*:)/i.test(composeSource),
    mongodb: files.some((file) => /(^|\/)(?:mongod\.conf|mongo-init\.[cm]?[jt]s)$/i.test(file)) || packages.some((pkg) => pkg.frameworks.some((item) => /mongo|mongoose/.test(item))) || /\bmongo(?:db)?(?:\s*[:/]|\b.*image\s*:)/i.test(composeSource),
    redis: files.some((file) => /(^|\/)redis\.conf$/i.test(file)) || packages.some((pkg) => pkg.frameworks.some((item) => /redis/.test(item))) || /\bredis(?:\s*[:/]|\b.*image\s*:)/i.test(composeSource),
    sqlite: files.some((file) => /\.(?:db|sqlite|sqlite3)$/i.test(file)) || packages.some((pkg) => pkg.frameworks.some((item) => /sqlite/.test(item))),
  }
  for (const [name, present] of Object.entries(databaseEvidence)) if (present) databases.add(name)
  const signals = architectureSignals(files)
  const nativeConfig = files.filter((file) => /(^|\/)(?:android\/(?:app\/src\/main\/AndroidManifest\.xml|build\.gradle|settings\.gradle)|ios\/(?:Podfile|.*\.entitlements|.*Info\.plist))$/.test(file))
  const kinds = new Set([...packages.flatMap((pkg) => pkg.kinds), ...nonJavaScriptUnits.map((unit) => unit.kind)])
  if (signals.includes('openapi')) kinds.add('api-contract')
  if (infra.docker.length || infra.ci.length || infra.iac.length) kinds.add('infrastructure')
  if (databases.size) kinds.add('database')
  return {
    root,
    repository: packages.some((pkg) => pkg.workspaces) || packages.length > 1 ? 'monorepo-or-multi-package' : 'single-package-or-polyglot',
    systems: [...kinds].sort(),
    ecosystems: [...ecosystems].sort(),
    manifests,
    lockfiles,
    packages,
    databases: [...databases].sort(),
    infrastructure: infra,
    nonJavaScriptUnits,
    nativeConfig,
    architectureSignals: signals,
    coverageGaps: [...new Set(walkState.coverageGaps)].sort(),
    roleHints: [...new Set(['architect', 'analyzer', 'security', 'resilience', 'testing', ...(kinds.has('frontend') ? ['frontend'] : []), ...(kinds.has('backend') ? ['backend'] : []), ...(kinds.has('mobile') ? ['expo-mobile'] : []), ...(kinds.has('database') ? ['database'] : []), ...((signals.includes('openapi') || packages.some((pkg) => pkg.frameworks.some((item) => ['@nestjs/core', 'express', 'fastify', 'hapi', 'koa', 'trpc', '@trpc/server'].includes(item))) || nonJavaScriptUnits.some((unit) => unit.kind === 'backend')) ? ['swagger'] : []), ...(kinds.has('infrastructure') ? ['devops'] : []), ...(files.some((file) => /(^|\/)(?:README(?:\.[^/]+)?\.md|docs\/)/i.test(file)) ? ['docs'] : [])])],
  }
}

function formatText(result) {
  return [
    `Repository: ${result.repository}`,
    `Systems: ${result.systems.join(', ') || 'not detected'}`,
    `Ecosystems: ${result.ecosystems.join(', ') || 'not detected'}`,
    `Roles: ${result.roleHints.join(', ')}`,
    `Manifests: ${result.manifests.join(', ') || 'none'}`,
    `Lockfiles: ${result.lockfiles.join(', ') || 'none'}`,
    `Architecture signals: ${result.architectureSignals.join(', ') || 'none'}`,
    `Coverage gaps: ${result.coverageGaps.join(', ') || 'none'}`,
  ].join('\n') + '\n'
}

async function main() {
  let args
  try { args = parseArgs(process.argv.slice(2)) } catch (error) { process.stderr.write(`${error.message}\n${usage()}`); process.exitCode = 2; return }
  if (args.help) { process.stdout.write(usage()); return }
  try {
    const result = inventory(args.root)
    process.stdout.write(args.format === 'json' ? `${JSON.stringify(result, null, 2)}\n` : formatText(result))
  } catch (error) { process.stderr.write(`project-audit inventory: ${error.message}\n`); process.exitCode = 2 }
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntry) await main()
