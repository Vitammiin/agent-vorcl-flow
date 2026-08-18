#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { inventory } from '../../project-audit/scripts/inventory.mjs'

const IGNORE = new Set(['.git', '.next', '.nuxt', '.output', '.turbo', '.vercel', 'build', 'coverage', 'dist', 'node_modules', 'target', 'vendor', 'web-build'])
const LANGUAGE_BY_EXTENSION = new Map([
  ['.c', 'C'], ['.cc', 'C++'], ['.cpp', 'C++'], ['.cs', 'C#'], ['.css', 'CSS'], ['.dart', 'Dart'],
  ['.go', 'Go'], ['.html', 'HTML'], ['.java', 'Java'], ['.js', 'JavaScript'], ['.jsx', 'JavaScript'],
  ['.kt', 'Kotlin'], ['.kts', 'Kotlin'], ['.php', 'PHP'], ['.py', 'Python'], ['.rb', 'Ruby'],
  ['.rs', 'Rust'], ['.scss', 'SCSS'], ['.sql', 'SQL'], ['.swift', 'Swift'], ['.ts', 'TypeScript'],
  ['.tsx', 'TypeScript'], ['.vue', 'Vue'], ['.svelte', 'Svelte'], ['.yaml', 'YAML'], ['.yml', 'YAML'],
])
const CONFIG_NAMES = /(^|\/)(?:\.env\.example|\.nvmrc|\.node-version|\.python-version|Makefile|Taskfile\.ya?ml|tsconfig(?:\.[^/]+)?\.json|vite\.config\.[cm]?[jt]s|next\.config\.[cm]?[jt]s|nuxt\.config\.[cm]?[jt]s|vitest\.config\.[cm]?[jt]s|jest\.config\.[cm]?[jt]s|playwright\.config\.[cm]?[jt]s|pyproject\.toml|go\.mod|Cargo\.toml)$/
const ENTRY_NAMES = /(^|\/)(?:src\/)?(?:index|main|server|app|cli|worker)\.(?:[cm]?[jt]sx?|py|go|rs|java|kt|rb|php)$/
const ROUTE_NAMES = /(^|\/)(?:app|pages|routes?|controllers?|handlers?|api)\/.*\.(?:[cm]?[jt]sx?|py|go|rs|java|kt|rb|php)$/
const DATA_NAMES = /(^|\/)(?:prisma\/schema\.prisma|migrations?\/.*\.(?:sql|[cm]?[jt]s|py)|schema\.(?:sql|prisma)|drizzle\.config\.[cm]?[jt]s)$/
const TEST_NAMES = /(^|\/)(?:tests?|__tests__)\/|\.(?:test|spec)\.[^.]+$/

function usage() { return 'Usage: inspect.mjs [--root <repo>] [--format text|json]\n' }
function posix(value) { return value.split(path.sep).join('/') }

function parseArgs(argv) {
  const options = { root: process.cwd(), format: 'text' }
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--help' || arg === '-h') return { help: true }
    if (arg === '--root') { if (!argv[index + 1]) throw new Error('--root requires a path'); options.root = argv[++index]; continue }
    if (arg === '--format') { if (!argv[index + 1]) throw new Error('--format requires text or json'); options.format = argv[++index]; continue }
    throw new Error(`unknown argument: ${arg}`)
  }
  if (!['text', 'json'].includes(options.format)) throw new Error('--format must be text or json')
  return options
}

function walk(root, directory = root, files = [], depth = 0) {
  if (depth > 12 || files.length >= 50_000) return files
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink()) continue
    if (entry.isDirectory() && IGNORE.has(entry.name)) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(root, absolute, files, depth + 1)
    else if (entry.isFile()) files.push(posix(path.relative(root, absolute)))
  }
  return files
}

function readJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return null }
}

function packageManager(files) {
  if (files.includes('pnpm-lock.yaml')) return 'pnpm'
  if (files.includes('yarn.lock')) return 'yarn'
  if (files.includes('bun.lock') || files.includes('bun.lockb')) return 'bun'
  if (files.includes('package-lock.json') || files.includes('npm-shrinkwrap.json')) return 'npm'
  return null
}

function uniqueSorted(values) { return [...new Set(values)].sort() }

function packageFacts(root, files) {
  const manager = packageManager(files)
  const facts = []
  for (const manifest of files.filter((file) => path.basename(file) === 'package.json')) {
    const pkg = readJson(path.join(root, manifest))
    if (!pkg) continue
    const directory = posix(path.dirname(manifest))
    const prefix = directory === '.' ? '' : `${directory}/`
    const binEntries = typeof pkg.bin === 'string' ? [pkg.bin] : Object.values(typeof pkg.bin === 'object' && pkg.bin ? pkg.bin : {})
    const declaredEntries = [pkg.main, pkg.module, pkg.types, ...binEntries]
      .filter((value) => typeof value === 'string')
      .map((value) => posix(path.normalize(`${prefix}${value}`)))
      .filter((value) => files.includes(value))
    const runnableScripts = Object.keys(pkg.scripts || {}).filter((name) => /^(?:dev|start|serve|build|test|lint|typecheck|check|e2e)(?::|$)/.test(name)).sort()
    facts.push({
      path: manifest,
      name: typeof pkg.name === 'string' ? pkg.name : null,
      description: typeof pkg.description === 'string' ? pkg.description : null,
      packageManager: manager,
      engines: pkg.engines && typeof pkg.engines === 'object' ? pkg.engines : null,
      workspaces: pkg.workspaces ?? null,
      entries: declaredEntries,
      commands: runnableScripts.map((name) => ({ name, command: manager ? `${manager} ${manager === 'npm' ? 'run ' : ''}${name}` : `npm run ${name}`, evidence: manifest })),
    })
  }
  return facts
}

function envNames(root, files) {
  const result = []
  for (const file of files.filter((name) => /(^|\/)\.env\.example$/.test(name))) {
    const source = fs.readFileSync(path.join(root, file), 'utf8').slice(0, 256 * 1024)
    const names = uniqueSorted(source.split(/\r?\n/).map((line) => line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/)?.[1]).filter(Boolean))
    result.push({ path: file, names })
  }
  return result
}

export function inspect(rootInput) {
  const root = path.resolve(rootInput)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`root is not a directory: ${rootInput}`)
  const base = inventory(root)
  const files = walk(root)
  const languages = {}
  for (const file of files) {
    const language = LANGUAGE_BY_EXTENSION.get(path.extname(file).toLowerCase())
    if (language) languages[language] = (languages[language] || 0) + 1
  }
  const topLevel = fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => !IGNORE.has(entry.name) && !entry.isSymbolicLink())
    .map((entry) => ({ path: entry.name, kind: entry.isDirectory() ? 'directory' : 'file' }))
    .sort((a, b) => a.path.localeCompare(b.path))
  const packageData = packageFacts(root, files)
  return {
    schemaVersion: 1,
    root,
    suggestedOutput: 'PROJECT_DESCRIPTION.md',
    existingDescription: files.includes('PROJECT_DESCRIPTION.md'),
    repository: base.repository,
    systems: base.systems,
    ecosystems: base.ecosystems,
    projectNames: uniqueSorted(packageData.map((pkg) => pkg.name).filter(Boolean)),
    declaredDescriptions: packageData.filter((pkg) => pkg.description).map((pkg) => ({ path: pkg.path, value: pkg.description })),
    packages: packageData,
    languages: Object.entries(languages).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, files]) => ({ name, files })),
    topLevel,
    entrypoints: uniqueSorted([...packageData.flatMap((pkg) => pkg.entries), ...files.filter((file) => ENTRY_NAMES.test(file))]),
    routeCandidates: files.filter((file) => ROUTE_NAMES.test(file)).slice(0, 200),
    dataBoundaries: files.filter((file) => DATA_NAMES.test(file)).slice(0, 200),
    testFiles: files.filter((file) => TEST_NAMES.test(file)).slice(0, 200),
    configuration: files.filter((file) => CONFIG_NAMES.test(file)).slice(0, 200),
    environmentVariables: envNames(root, files),
    documentation: files.filter((file) => /(^|\/)(?:README(?:\.[^/]+)?\.md|docs\/.*\.md)$/i.test(file)).slice(0, 100),
    instructions: files.filter((file) => /(^|\/)(?:AGENTS|CLAUDE|GEMINI)\.md$/i.test(file)).slice(0, 100),
    infrastructure: base.infrastructure,
    databases: base.databases,
    architectureSignals: base.architectureSignals,
    coverageGaps: base.coverageGaps,
  }
}

function formatText(data) {
  return [
    `Projects: ${data.projectNames.join(', ') || 'not declared'}`,
    `Systems: ${data.systems.join(', ') || 'not detected'}`,
    `Languages: ${data.languages.map((item) => `${item.name} (${item.files})`).join(', ') || 'not detected'}`,
    `Entrypoints: ${data.entrypoints.join(', ') || 'not detected'}`,
    `Tests: ${data.testFiles.length}`,
    `Coverage gaps: ${data.coverageGaps.join(', ') || 'none'}`,
  ].join('\n') + '\n'
}

async function main() {
  let options
  try { options = parseArgs(process.argv.slice(2)) } catch (error) { process.stderr.write(`${error.message}\n${usage()}`); process.exitCode = 2; return }
  if (options.help) { process.stdout.write(usage()); return }
  try {
    const data = inspect(options.root)
    process.stdout.write(options.format === 'json' ? `${JSON.stringify(data, null, 2)}\n` : formatText(data))
  } catch (error) {
    process.stderr.write(`init-code inspect: ${error.message}\n`)
    process.exitCode = 2
  }
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntry) await main()
