import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const script = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../scripts/compatibility-preflight.mjs')

function fixture(pkg, files = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'expo-compat-'))
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(pkg))
  for (const [name, body] of Object.entries(files)) {
    const target = path.join(root, name)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, body)
  }
  return root
}

function run(root, nodeVersion = null) {
  const bootstrap = nodeVersion
    ? `process.versions.node=${JSON.stringify(nodeVersion)}; import(${JSON.stringify(script)})`
    : null
  return bootstrap
    ? spawnSync(process.execPath, ['--input-type=module', '--eval', bootstrap, '--', '--root', root, '--offline', '--format', 'json'], { encoding: 'utf8' })
    : spawnSync(process.execPath, [script, '--root', root, '--offline', '--format', 'json'], { encoding: 'utf8' })
}

test('accepts an aligned SDK 57 dependency set offline', () => {
  const root = fixture({ dependencies: { expo: '^57.0.0', react: '19.2.3', 'react-native': '0.86.0', 'expo-router': '~57.0.7', 'react-native-reanimated': '~4.5.1', 'react-native-worklets': '0.10.1', 'react-native-gesture-handler': '~2.32.0' } })
  const result = run(root)
  assert.equal(result.status, 0, result.stdout || result.stderr)
  const report = JSON.parse(result.stdout)
  assert.equal(report.sdk, 57)
  assert.equal(report.online, false)
  assert.deepEqual(report.findings, [])
})

test('detects exact SDK, Reanimated, Router, test and lockfile mismatches', () => {
  const root = fixture({
    dependencies: { expo: '^57.0.0', react: '19.2.3', 'react-native': '0.85.0', 'expo-router': '^56.0.0', 'react-native-reanimated': '4.3.0', 'react-native-worklets': '0.10.0', 'react-native-gesture-handler': '3.1.0', '@react-navigation/native': '^7.0.0', 'react-test-renderer': '19.2.3' },
    devDependencies: { '@testing-library/react-native': '^14.0.0' },
    expo: { install: { exclude: ['react-native-reanimated'] } },
  }, {
    'app.json': JSON.stringify({ expo: { newArchEnabled: false } }),
    'babel.config.js': "module.exports={presets:['babel-preset-expo'],plugins:['react-native-reanimated/plugin','react-native-worklets/plugin']}\n",
    'package-lock.json': '{}',
    'yarn.lock': '',
    'src/app/index.tsx': "import { x } from '@react-navigation/native'\nexport default x\n",
  })
  const result = run(root)
  assert.equal(result.status, 1)
  const rules = JSON.parse(result.stdout).findings.map((item) => item.rule)
  for (const rule of ['COMPAT003', 'COMPAT005', 'COMPAT008', 'COMPAT009', 'COMPAT010', 'COMPAT011', 'COMPAT012', 'COMPAT014', 'COMPAT015', 'COMPAT016', 'COMPAT017', 'COMPAT018']) assert.ok(rules.includes(rule), `missing ${rule}`)
})

test('documents that offline mode is not release evidence and validates CLI errors', () => {
  const root = fixture({ dependencies: { expo: '^56.0.0', react: '19.2.3', 'react-native': '0.85.0' } })
  const textResult = spawnSync(process.execPath, [script, '--root', root, '--offline'], { encoding: 'utf8' })
  assert.equal(textResult.status, 0)
  assert.match(textResult.stdout, /OFFLINE ONLY/)
  const invalid = spawnSync(process.execPath, [script, '--wat'], { encoding: 'utf8' })
  assert.equal(invalid.status, 2)
  assert.match(invalid.stderr, /unknown argument/)
})

test('hook reminds only after Expo dependency or native configuration edits', () => {
  const root = fixture({ dependencies: { expo: '^57.0.0', react: '19.2.3', 'react-native': '0.86.0' } })
  const changed = spawnSync(process.execPath, [script, '--hook'], { encoding: 'utf8', input: JSON.stringify({ cwd: root, tool_input: { file_path: path.join(root, 'package.json') } }) })
  assert.equal(changed.status, 0)
  assert.match(JSON.parse(changed.stdout).hookSpecificOutput.additionalContext, /live read-only compatibility preflight/)

  const ignored = spawnSync(process.execPath, [script, '--hook'], { encoding: 'utf8', input: JSON.stringify({ cwd: root, tool_input: { file_path: path.join(root, 'src', 'screen.tsx') } }) })
  assert.equal(ignored.status, 0)
  assert.equal(ignored.stdout, '')
})
