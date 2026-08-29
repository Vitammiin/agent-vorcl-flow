#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const IGNORE = new Set(['.git', '.next', '.nuxt', '.output', '.taskmaster', '.turbo', 'build', 'coverage', 'dist', 'node_modules', 'target', 'vendor'])

function parseArgs(argv) {
  const result = { root: process.cwd(), goal: '', format: 'json' }
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index]
    if (value === '--root') result.root = argv[++index]
    else if (value === '--goal') result.goal = argv[++index]
    else if (value === '--format') result.format = argv[++index]
    else if (value === '--help' || value === '-h') return { help: true }
    else throw new Error(`unknown argument: ${value}`)
  }
  if (!result.root) throw new Error('--root requires a path')
  if (!['json', 'text'].includes(result.format)) throw new Error('--format must be json or text')
  return result
}

function walk(root, directory = root, depth = 0, files = []) {
  if (depth > 5) return files
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink() || (entry.isDirectory() && IGNORE.has(entry.name))) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(root, absolute, depth + 1, files)
    else if (entry.isFile()) files.push(path.relative(root, absolute).split(path.sep).join('/'))
  }
  return files
}

function packageInventory(root, files) {
  const packages = []
  for (const relative of files.filter((file) => path.basename(file) === 'package.json')) {
    try {
      const value = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'))
      const dependencies = Object.keys({ ...value.dependencies, ...value.devDependencies, ...value.peerDependencies, ...value.optionalDependencies }).sort()
      packages.push({ path: relative, name: value.name ?? null, dependencies })
    } catch {
      packages.push({ path: relative, name: null, dependencies: [], malformed: true })
    }
  }
  return packages
}

function hasAny(values, candidates) {
  return candidates.some((candidate) => values.has(candidate))
}

function pushUnique(target, values) {
  for (const value of values) if (!target.includes(value)) target.push(value)
}

export function routeWorkspace(rootInput, goalInput = '') {
  const root = path.resolve(rootInput)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`root is not a directory: ${rootInput}`)
  const files = walk(root)
  const packages = packageInventory(root, files)
  const dependencies = new Set(packages.flatMap((item) => item.dependencies))
  const goal = String(goalInput).toLowerCase()
  const systems = []
  const workspaceEvidence = []
  const intentSignals = []

  const mobile = hasAny(dependencies, ['expo', 'expo-router', 'react-native'])
  const frontend = hasAny(dependencies, ['next', 'nuxt', 'react-dom', 'svelte', '@angular/core', 'vue'])
  const backend = hasAny(dependencies, ['@nestjs/core', 'express', 'fastify', 'hapi', 'koa', 'trpc', '@trpc/server'])
  if (mobile) systems.push('mobile')
  if (frontend) systems.push('frontend')
  if (backend) systems.push('backend')
  if (files.some((file) => /(^|\/)(?:Dockerfile|compose.*\.ya?ml|\.github\/workflows\/)/.test(file))) systems.push('infrastructure')

  for (const item of packages) {
    const matched = item.dependencies.filter((name) => ['expo', 'expo-router', 'react-native', 'next', 'react-dom', 'express', 'fastify', '@callstack/liquid-glass', 'expo-glass-effect', 'remotion'].includes(name))
    if (matched.length) workspaceEvidence.push(`${item.path}: ${matched.join(', ')}`)
    if (item.malformed) workspaceEvidence.push(`${item.path}: malformed manifest`)
  }
  for (const file of ['AGENTS.md', 'PROJECT_DESCRIPTION.md']) if (files.includes(file)) workspaceEvidence.push(file)

  const auditIntent = /\b(audit|review|inspect|analyse|analyze)\b|аудит|ревью|провер/.test(goal)
  const architectureIntent = /architect|system design|architecture|архитект|проектир/.test(goal)
  const videoIntent = /\b(video|mp4|movie|animation)\b|видео|ролик|анимац/.test(goal)
  const mobileUiIntent = /\b(mobile|responsive|screen|thumb|touch|tap|ios|android|expo|react native)\b|мобил|экран|палец|кнопк|жест/.test(goal)
  const explicitNativeIntent = /\b(expo|react native|ios app|android app)\b|expo|react native|нативн.*прилож/.test(goal)
  const compatibilityIntent = /\bcompatib|совместим|поддержк.*(?:ios|android)|(?:ios|android).*поддержк/.test(goal)
  const liquidIntent = /liquid[ -]?glass|glass effect|жидк.*стек|стеклян/.test(goal) || dependencies.has('@callstack/liquid-glass') || dependencies.has('expo-glass-effect')
  if (auditIntent) intentSignals.push('audit')
  if (architectureIntent) intentSignals.push('architecture')
  if (videoIntent) intentSignals.push('video-artifact')
  if (mobileUiIntent) intentSignals.push('mobile-ui')
  if (liquidIntent) intentSignals.push('liquid-glass')

  let primaryRole = 'architect'
  const supportingRoles = []
  const skillHints = []
  if (auditIntent) {
    primaryRole = systems.length > 1 ? 'architect' : 'analyzer'
    pushUnique(skillHints, systems.length > 1 ? ['project-audit'] : ['analyzer-audit'])
    if (primaryRole === 'architect') pushUnique(supportingRoles, ['analyzer'])
    if (mobile || explicitNativeIntent) {
      pushUnique(supportingRoles, ['expo-mobile'])
      pushUnique(skillHints, ['expo-mobile-audit'])
      if (mobileUiIntent) pushUnique(skillHints, ['expo-mobile-ui-audit', 'mobile-thumb-zones'])
      if (compatibilityIntent) pushUnique(skillHints, ['expo-mobile-compatibility'])
    }
  } else if (videoIntent) {
    primaryRole = 'design-studio'
    pushUnique(skillHints, ['design-studio', 'animate'])
  } else if (architectureIntent) {
    primaryRole = 'architect'
    pushUnique(skillHints, ['system-design'])
    if (mobile) supportingRoles.push('expo-mobile')
    else if (frontend) supportingRoles.push('frontend')
    else if (backend) supportingRoles.push('backend')
  } else if (mobile || explicitNativeIntent) {
    primaryRole = 'expo-mobile'
    pushUnique(skillHints, ['expo-mobile-architecture'])
    if (mobileUiIntent) pushUnique(skillHints, ['expo-ui-design-motion', 'mobile-thumb-zones'])
  } else if (frontend) {
    primaryRole = 'frontend'
    pushUnique(skillHints, ['frontend-architecture'])
    if (mobileUiIntent) pushUnique(skillHints, ['mobile-thumb-zones'])
  } else if (backend) {
    primaryRole = 'backend'
    pushUnique(skillHints, ['backend-architecture'])
  } else pushUnique(skillHints, ['system-design'])

  if (liquidIntent) {
    if (primaryRole === 'architect' && !supportingRoles.includes('expo-mobile')) supportingRoles.push('expo-mobile')
    pushUnique(skillHints, ['react-native-liquid-glass', 'expo-mobile-compatibility'])
  }

  const uncertainties = []
  if (!packages.length) uncertainties.push('No package.json found; verify non-JavaScript manifests and entrypoints manually.')
  if (!goal.trim()) uncertainties.push('Goal is empty; routing uses workspace evidence only.')
  if (!systems.length) uncertainties.push('No supported application surface was detected from package dependencies.')

  return { systems, workspaceEvidence, intentSignals, primaryRole, supportingRoles, skillHints, checkerRole: 'testing', uncertainties }
}

function formatText(result) {
  return [
    `Systems: ${result.systems.join(', ') || 'none'}`,
    `Evidence: ${result.workspaceEvidence.join('; ') || 'none'}`,
    `Intent: ${result.intentSignals.join(', ') || 'none'}`,
    `Primary role: ${result.primaryRole}`,
    `Supporting roles: ${result.supportingRoles.join(', ') || 'none'}`,
    `Skills: ${result.skillHints.join(', ') || 'none'}`,
    `Checker: ${result.checkerRole}`,
    `Uncertainties: ${result.uncertainties.join('; ') || 'none'}`,
  ].join('\n') + '\n'
}

async function main() {
  let args
  try { args = parseArgs(process.argv.slice(2)) } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 2; return }
  if (args.help) { process.stdout.write('Usage: route.mjs [--root <workspace>] [--goal <text>] [--format json|text]\n'); return }
  try {
    const result = routeWorkspace(args.root, args.goal)
    process.stdout.write(args.format === 'json' ? `${JSON.stringify(result, null, 2)}\n` : formatText(result))
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 2 }
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntry) await main()
