#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const SNAPSHOT_DATE = '2026-08-11'
const SDK_MATRIX = {
  54: { reactNative: '0.81', react: '19.1', node: '20.19.0' },
  55: { reactNative: '0.83', react: '19.2', node: '20.19.0' },
  56: { reactNative: '0.85', react: '19.2', node: '20.19.0' },
  57: { reactNative: '0.86', react: '19.2', node: '22.13.0' },
}
const LOCKFILES = ['bun.lock', 'bun.lockb', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']
const SOURCE_EXT = /\.(?:[cm]?[jt]sx?|mts|cts)$/
const IGNORE_DIRS = new Set(['.expo', '.git', 'android', 'build', 'coverage', 'dist', 'ios', 'node_modules', 'web-build'])

function usage() {
  return `Usage: compatibility-preflight.mjs [--root <expo-project>] [--offline] [--format text|json] [--hook]\n\nDefault mode performs static checks and the live, read-only Expo checks:\n  npx expo install --check\n  npx expo-doctor@latest\n\nUse --offline only for fixtures or when network access is explicitly unavailable. --hook is a non-network PostToolUse reminder.\nExit codes: 0 compatible, 1 incompatibility/check failure, 2 CLI/runtime error.\n`
}

function parseArgs(argv) {
  const out = { root: process.cwd(), online: true, format: 'text', hook: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--help' || arg === '-h') return { help: true }
    if (arg === '--offline') { out.online = false; continue }
    if (arg === '--online') { out.online = true; continue }
    if (arg === '--hook') { out.hook = true; continue }
    if (arg === '--root') { if (!argv[i + 1]) throw new Error('--root requires a path'); out.root = argv[++i]; continue }
    if (arg === '--format') { if (!argv[i + 1]) throw new Error('--format requires text or json'); out.format = argv[++i]; continue }
    throw new Error(`unknown argument: ${arg}`)
  }
  if (!['text', 'json'].includes(out.format)) throw new Error('--format must be text or json')
  return out
}

function declared(pkg, name) {
  return pkg.dependencies?.[name] ?? pkg.devDependencies?.[name] ?? pkg.peerDependencies?.[name] ?? null
}

function versionTuple(value) {
  const match = String(value ?? '').match(/(\d+)\.(\d+)(?:\.(\d+))?/)
  return match ? [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)] : null
}

function atLeast(actual, minimum) {
  const a = versionTuple(actual)
  const b = versionTuple(minimum)
  if (!a || !b) return true
  for (let i = 0; i < 3; i++) {
    if (a[i] !== b[i]) return a[i] > b[i]
  }
  return true
}

function sameMajorMinor(value, expected) {
  const actual = versionTuple(value)
  const wanted = versionTuple(expected)
  return Boolean(actual && wanted && actual[0] === wanted[0] && actual[1] === wanted[1])
}

function add(findings, rule, severity, message, evidence, remediation) {
  findings.push({ rule, severity, message, evidence, remediation })
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function walkSources(dir, files = []) {
  if (!fs.existsSync(dir)) return files
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isSymbolicLink() || (entry.isDirectory() && IGNORE_DIRS.has(entry.name))) continue
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) walkSources(target, files)
    else if (entry.isFile() && SOURCE_EXT.test(entry.name)) files.push(target)
  }
  return files
}

function readAppConfig(root) {
  const file = path.join(root, 'app.json')
  if (!fs.existsSync(file)) return null
  try { return readJson(file).expo ?? readJson(file) } catch { return null }
}

export function scanCompatibility(rootInput, nodeVersion = process.versions.node) {
  const root = path.resolve(rootInput)
  const packageFile = path.join(root, 'package.json')
  if (!fs.existsSync(packageFile)) throw new Error(`package.json not found: ${root}`)
  const pkg = readJson(packageFile)
  const expoVersion = declared(pkg, 'expo')
  if (!expoVersion) throw new Error(`Expo dependency not found in ${packageFile}`)
  const sdk = versionTuple(expoVersion)?.[0]
  const matrix = SDK_MATRIX[sdk]
  const findings = []
  const appConfig = readAppConfig(root)
  const reactNative = declared(pkg, 'react-native')
  const react = declared(pkg, 'react')
  const reanimated = declared(pkg, 'react-native-reanimated')
  const worklets = declared(pkg, 'react-native-worklets')
  const gestureHandler = declared(pkg, 'react-native-gesture-handler')
  const router = declared(pkg, 'expo-router')
  const rntl = declared(pkg, '@testing-library/react-native')
  const renderer = declared(pkg, 'react-test-renderer')

  if (!matrix) {
    add(findings, 'COMPAT001', 'warning', `Expo SDK ${sdk ?? 'unknown'} отсутствует в локальном snapshot`, expoVersion, 'Не угадывай версии: открой versioned Expo docs и release notes, затем обязательно выполни online checks.')
  } else {
    if (!atLeast(nodeVersion, matrix.node)) add(findings, 'COMPAT002', 'error', `Node ${nodeVersion} ниже минимума Expo SDK ${sdk}`, `required >=${matrix.node}`, `Переключи CI/local/EAS environment на Node >=${matrix.node}.`)
    if (!sameMajorMinor(reactNative, matrix.reactNative)) add(findings, 'COMPAT003', 'error', `React Native не соответствует Expo SDK ${sdk}`, `declared ${reactNative ?? 'missing'}; expected ${matrix.reactNative}.x`, 'Не подбирай RN вручную; выполни npx expo install --fix после review diff.')
    if (!sameMajorMinor(react, matrix.react)) add(findings, 'COMPAT004', 'error', `React не соответствует Expo SDK ${sdk}`, `declared ${react ?? 'missing'}; expected ${matrix.react}.x`, 'Выровняй React через npx expo install --fix, не через npm install react@latest.')
  }

  if (sdk >= 55 && appConfig?.newArchEnabled === false) add(findings, 'COMPAT005', 'error', 'SDK 55+ всегда использует New Architecture; newArchEnabled:false игнорируется', 'app.json: expo.newArchEnabled=false', 'Удали ложную настройку и исправь несовместимые библиотеки.')
  if (reanimated && versionTuple(reanimated)?.[0] >= 4 && !worklets) add(findings, 'COMPAT006', 'error', 'Reanimated 4 требует react-native-worklets', `react-native-reanimated=${reanimated}`, 'Установи обе совместимые версии командой npx expo install react-native-reanimated react-native-worklets.')
  if (reanimated && versionTuple(reanimated)?.[0] === 3 && worklets) add(findings, 'COMPAT007', 'error', 'Reanimated 3 несовместим с установленным react-native-worklets', `reanimated=${reanimated}; worklets=${worklets}`, 'Удаляй Worklets для Reanimated 3 или мигрируй согласованной парой на Reanimated 4.')
  if (sdk === 57 && versionTuple(reanimated)?.[0] === 4 && versionTuple(reanimated)?.[1] < 4) add(findings, 'COMPAT008', 'error', 'Reanimated <4.4 не поддерживает React Native 0.86 из Expo SDK 57', reanimated, 'Используй Expo-рекомендованную линию Reanimated 4.5 + Worklets 0.10 через npx expo install.')
  if (versionTuple(reanimated)?.[0] === 4 && versionTuple(worklets)?.[0] === 0) {
    const rMinor = versionTuple(reanimated)?.[1]
    const wMinor = versionTuple(worklets)?.[1]
    const valid = (rMinor === 3 && wMinor === 8) || (rMinor === 4 && [9, 10].includes(wMinor)) || (rMinor === 5 && [10, 11].includes(wMinor)) || (rMinor >= 6 && wMinor >= 11)
    if (!valid) add(findings, 'COMPAT009', 'error', 'Reanimated и Worklets не входят в одну официальную compatibility line', `reanimated=${reanimated}; worklets=${worklets}`, 'Проверь актуальную Reanimated compatibility table; для Expo SDK 57 начни с Expo-рекомендованных 4.5/0.10.')
  }
  if (sdk === 57 && gestureHandler && versionTuple(gestureHandler)?.[0] !== 2) add(findings, 'COMPAT010', 'error', 'Expo SDK 57 рекомендует Gesture Handler 2.32, а latest docs/npm уже могут показывать 3.x', gestureHandler, 'Не копируй latest 3.x setup; установи через npx expo install react-native-gesture-handler.')
  if (router && sdk && versionTuple(router)?.[0] !== sdk) add(findings, 'COMPAT011', 'error', 'Major Expo Router должен соответствовать Expo SDK', `expo=${expoVersion}; expo-router=${router}`, 'Установи Router через npx expo install expo-router и используй versioned SDK docs.')
  if (sdk >= 56) {
    const navigationDeps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).filter((name) => name.startsWith('@react-navigation/'))
    const sourceHits = [...walkSources(path.join(root, 'app')), ...walkSources(path.join(root, 'src'))].filter((file) => /from\s+['"]@react-navigation\//.test(fs.readFileSync(file, 'utf8')))
    if (navigationDeps.length || sourceHits.length) add(findings, 'COMPAT012', 'error', 'SDK 56+ Expo Router app code не должно импортировать внешние @react-navigation entry points', [...navigationDeps, ...sourceHits.map((f) => path.relative(root, f))].join(', '), 'Используй соответствующие expo-router entry points и официальный codemod/migration guide.')
  }
  if (versionTuple(rntl)?.[0] >= 14 && !atLeast(nodeVersion, '22.13.0')) add(findings, 'COMPAT013', 'error', 'React Native Testing Library 14 требует Node 22.13+, даже если старый Expo SDK допускает Node 20', `RNTL=${rntl}; Node=${nodeVersion}`, 'Подними Node до 22.13+ либо выбери совместимую RNTL через versioned Expo testing docs.')
  if (versionTuple(react)?.[0] >= 19 && renderer) add(findings, 'COMPAT014', 'error', 'react-test-renderer deprecated и не поддерживает React 19 testing workflow', `react=${react}; react-test-renderer=${renderer}`, 'Удали react-test-renderer; используй React Native Testing Library и jest-expo.')
  const lockfiles = LOCKFILES.filter((name) => fs.existsSync(path.join(root, name)))
  if (lockfiles.length > 1) add(findings, 'COMPAT015', 'error', 'Несколько lockfile делают dependency graph недетерминированным', lockfiles.join(', '), 'Оставь lockfile единственного package manager и выровняй CI/EAS с ним.')
  if (pkg.expo?.install?.exclude?.length) add(findings, 'COMPAT016', 'warning', 'expo.install.exclude отключает Expo version checks для пакетов', JSON.stringify(pkg.expo.install.exclude), 'Для каждого исключения зафиксируй owner, причину, проверенную matrix и срок пересмотра.')

  const babelFiles = ['babel.config.js', 'babel.config.cjs', 'babel.config.mjs'].filter((name) => fs.existsSync(path.join(root, name)))
  for (const file of babelFiles) {
    const source = fs.readFileSync(path.join(root, file), 'utf8')
    const oldPlugin = source.includes('react-native-reanimated/plugin')
    const workletsPlugin = source.includes('react-native-worklets/plugin')
    if (versionTuple(reanimated)?.[0] >= 4 && oldPlugin) add(findings, 'COMPAT017', 'error', 'Reanimated 4 не использует старый react-native-reanimated/plugin', file, 'В Expo оставь babel-preset-expo: он настраивает plugin автоматически; не добавляй оба plugin вручную.')
    if (oldPlugin && workletsPlugin) add(findings, 'COMPAT018', 'error', 'Одновременно подключены старый Reanimated plugin и Worklets plugin', file, 'Оставь только конфигурацию, требуемую текущей официальной matrix; в Expo полагайся на babel-preset-expo.')
  }

  return { snapshotDate: SNAPSHOT_DATE, sdk, matrix: matrix ?? null, findings }
}

function runOnlineChecks(root) {
  const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx'
  return [
    ['expo-install-check', ['expo', 'install', '--check']],
    ['expo-doctor', ['expo-doctor@latest']],
  ].map(([name, args]) => {
    const result = spawnSync(executable, args, { cwd: root, encoding: 'utf8', env: { ...process.env, CI: '1', NO_COLOR: '1' } })
    return { name, command: `npx ${args.join(' ')}`, status: result.status ?? 2, stdout: result.stdout?.trim() ?? '', stderr: result.stderr?.trim() ?? '', error: result.error?.message ?? null }
  })
}

function formatText(report) {
  const lines = [`Expo compatibility preflight (snapshot ${report.snapshotDate}, SDK ${report.sdk ?? 'unknown'})`]
  for (const item of report.findings) lines.push(`${item.severity.toUpperCase()} ${item.rule}: ${item.message}\n  evidence: ${item.evidence}\n  fix: ${item.remediation}`)
  for (const check of report.onlineChecks ?? []) lines.push(`${check.status === 0 ? 'PASS' : 'FAIL'} ${check.name}: ${check.command}${check.stderr ? `\n  ${check.stderr.split('\n').slice(-3).join('\n  ')}` : ''}`)
  if (!report.findings.length && !(report.onlineChecks ?? []).some((item) => item.status !== 0)) lines.push('Compatible: static and requested live checks passed.')
  if (!report.online) lines.push('OFFLINE ONLY: live Expo/npm compatibility was not verified; do not approve dependency work from this result alone.')
  return `${lines.join('\n')}\n`
}

function findExpoRoot(start) {
  let current = path.resolve(start)
  while (true) {
    const packageFile = path.join(current, 'package.json')
    if (fs.existsSync(packageFile)) {
      try { if (declared(readJson(packageFile), 'expo')) return current } catch { /* fail open in hook */ }
    }
    const parent = path.dirname(current)
    if (parent === current) return null
    current = parent
  }
}

function hookMode() {
  let data = {}
  try { data = JSON.parse(fs.readFileSync(0, 'utf8') || '{}') } catch { return }
  const edited = data?.tool_input?.file_path || data?.tool_input?.path || ''
  const basename = path.basename(edited)
  const relevant = /^(?:package\.json|app\.json|app\.config\.[cm]?[jt]s|babel\.config\.[cm]?js|metro\.config\.[cm]?js|eas\.json|package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb?)$/.test(basename)
  if (!relevant) return
  const root = findExpoRoot(data.cwd || path.dirname(edited) || process.cwd())
  if (!root) return
  let preview = ''
  try {
    preview = scanCompatibility(root).findings.slice(0, 8).map((item) => `• ${item.rule}: ${item.message}`).join('\n')
  } catch { /* live preflight will provide the actionable error */ }
  const detail = preview ? `\nStatic findings:\n${preview}` : ''
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'PostToolUse', additionalContext: `Expo dependency/native configuration changed. Before continuing, run the live read-only compatibility preflight: node <expo-mobile-architecture>/scripts/compatibility-preflight.mjs --root ${root}. Offline-only evidence is insufficient.${detail}` } }))
}

async function main() {
  let args
  try { args = parseArgs(process.argv.slice(2)) } catch (error) { process.stderr.write(`${error.message}\n${usage()}`); process.exitCode = 2; return }
  if (args.help) { process.stdout.write(usage()); return }
  if (args.hook) { hookMode(); return }
  try {
    const root = path.resolve(args.root)
    const report = { ...scanCompatibility(root), online: args.online }
    if (args.online) report.onlineChecks = runOnlineChecks(root)
    const failed = report.findings.some((item) => item.severity === 'error') || (report.onlineChecks ?? []).some((item) => item.status !== 0)
    process.stdout.write(args.format === 'json' ? `${JSON.stringify(report, null, 2)}\n` : formatText(report))
    process.exitCode = failed ? 1 : 0
  } catch (error) {
    process.stderr.write(`expo-compatibility: ${error.message}\n`)
    process.exitCode = 2
  }
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntry) await main()
