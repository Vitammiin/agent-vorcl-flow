#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const SOURCE_EXTENSIONS = new Set(['.c', '.cc', '.cpp', '.cs', '.css', '.dart', '.go', '.html', '.java', '.js', '.jsx', '.kt', '.kts', '.mjs', '.cjs', '.php', '.py', '.rb', '.rs', '.scss', '.sql', '.svelte', '.swift', '.ts', '.tsx', '.vue'])
const MANIFESTS = /(^|\/)(?:package\.json|pyproject\.toml|requirements[^/]*\.txt|Pipfile|go\.mod|Cargo\.toml|composer\.json|Gemfile|pom\.xml|build\.gradle(?:\.kts)?|pubspec\.yaml|.*lock(?:\.json|\.yaml)?|pnpm-lock\.yaml|yarn\.lock)$/
const CONTEXT_CONFIG = /(^|\/)(?:\.env\.example|Dockerfile(?:\..*)?|(?:docker-)?compose(?:\.[^.]+)?\.ya?ml|render\.yaml|vercel\.json|Makefile|Taskfile\.ya?ml|tsconfig(?:\.[^/]+)?\.json|.*\.config\.[cm]?[jt]s|\.github\/workflows\/.*\.ya?ml|migrations?\/|prisma\/schema\.prisma)/
const TEST_PATH = /(^|\/)(?:tests?|__tests__)\/|\.(?:test|spec)\.[^.]+$/
const DOCUMENTATION = /(^|\/)(?:docs\/|README(?:\.[^/]+)?\.md$|CHANGELOG\.md$|CONTRIBUTING\.md$|LICENSE(?:\.[^/]+)?$)/i
const GENERATED_OR_VENDOR = /(^|\/)(?:node_modules|vendor|dist|build|coverage|\.next|\.nuxt|target)(\/|$)/

function usage() { return 'Usage: check-impact.mjs --root <repo> [--changed <path> ...] [--external <kind[:detail]> ...] [--format text|json]\n' }
function posix(value) { return value.split(path.sep).join('/') }

function parseArgs(argv) {
  const options = { root: process.cwd(), changed: [], external: [], format: 'text' }
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index]
    if (arg === '--help' || arg === '-h') return { help: true }
    if (arg === '--root') { if (!argv[index + 1]) throw new Error('--root requires a path'); options.root = argv[++index]; continue }
    if (arg === '--changed') { if (!argv[index + 1]) throw new Error('--changed requires a path'); options.changed.push(argv[++index]); continue }
    if (arg === '--external') { if (!argv[index + 1]) throw new Error('--external requires a kind'); options.external.push(argv[++index]); continue }
    if (arg === '--format') { if (!argv[index + 1]) throw new Error('--format requires text or json'); options.format = argv[++index]; continue }
    throw new Error(`unknown argument: ${arg}`)
  }
  if (!['text', 'json'].includes(options.format)) throw new Error('--format must be text or json')
  return options
}

function normalizeChanged(root, value) {
  const absolute = path.resolve(root, value)
  const relative = posix(path.relative(root, absolute))
  if (relative === '..' || relative.startsWith('../') || path.isAbsolute(relative)) throw new Error(`changed path is outside root: ${value}`)
  return relative || '.'
}

function classify(file) {
  if (file === 'PROJECT_DESCRIPTION.md') return { kind: 'description', reason: 'project description changed' }
  if (GENERATED_OR_VENDOR.test(file)) return { kind: 'ignored', reason: 'generated or vendored path' }
  if (MANIFESTS.test(file)) return { kind: 'context', reason: 'manifest, dependency, or runtime declaration' }
  if (CONTEXT_CONFIG.test(file)) return { kind: 'context', reason: 'configuration, schema, CI, or deployment context' }
  if (TEST_PATH.test(file)) return { kind: 'context', reason: 'testing context' }
  if (SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase())) return { kind: 'context', reason: 'source code may change capabilities, boundaries, or data flow' }
  if (DOCUMENTATION.test(file)) return { kind: 'documentation', reason: 'documentation-only path' }
  return { kind: 'context', reason: 'unclassified repository change requires semantic review' }
}

function normalizeExternal(value) {
  const normalized = String(value).trim()
  if (!normalized || normalized.length > 160 || /[\r\n=]/.test(normalized)) throw new Error(`invalid external impact: ${value}`)
  return normalized
}

export function checkImpact(rootInput, changedInput, externalInput = []) {
  const root = path.resolve(rootInput)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`root is not a directory: ${rootInput}`)
  const descriptionPath = path.join(root, 'PROJECT_DESCRIPTION.md')
  const changed = [...new Set(changedInput.map((file) => normalizeChanged(root, file)))].sort()
  const classified = changed.map((file) => ({ path: file, ...classify(file) }))
  const external = [...new Set(externalInput.map(normalizeExternal))].sort().map((value) => ({ external: value, kind: 'context', reason: 'external mutation may change deployment, environment, integration, runtime, or data context' }))
  const candidates = [...classified.filter((item) => item.kind === 'context'), ...external]
  const descriptionUpdated = classified.some((item) => item.kind === 'description')
  const descriptionExists = fs.existsSync(descriptionPath) && fs.statSync(descriptionPath).isFile()
  return {
    schemaVersion: 1,
    description: 'PROJECT_DESCRIPTION.md',
    descriptionExists,
    descriptionUpdated,
    reviewRequired: descriptionExists && candidates.length > 0,
    status: !descriptionExists ? 'not-initialized' : candidates.length ? 'review-required' : descriptionUpdated ? 'description-only' : 'no-context-candidates',
    candidates,
    excluded: classified.filter((item) => item.kind !== 'context'),
    instruction: !descriptionExists
      ? 'Do not create PROJECT_DESCRIPTION.md automatically.'
      : candidates.length
        ? 'Compare these changes with PROJECT_DESCRIPTION.md; update only materially affected sections, otherwise record description impact: none.'
        : 'No semantic description review is required for these paths.',
  }
}

function formatText(result) {
  return [
    `Status: ${result.status}`,
    `Description exists: ${result.descriptionExists}`,
    `Review required: ${result.reviewRequired}`,
    `Description updated: ${result.descriptionUpdated}`,
    `Candidates: ${result.candidates.map((item) => `${item.path ?? `external:${item.external}`} (${item.reason})`).join(', ') || 'none'}`,
    `Instruction: ${result.instruction}`,
  ].join('\n') + '\n'
}

async function main() {
  let options
  try { options = parseArgs(process.argv.slice(2)) } catch (error) { process.stderr.write(`${error.message}\n${usage()}`); process.exitCode = 2; return }
  if (options.help) { process.stdout.write(usage()); return }
  try {
    const result = checkImpact(options.root, options.changed, options.external)
    process.stdout.write(options.format === 'json' ? `${JSON.stringify(result, null, 2)}\n` : formatText(result))
  } catch (error) {
    process.stderr.write(`init-code impact: ${error.message}\n`)
    process.exitCode = 2
  }
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntry) await main()
