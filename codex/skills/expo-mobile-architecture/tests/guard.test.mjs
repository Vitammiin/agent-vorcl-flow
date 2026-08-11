import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const guard = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../scripts/guard.mjs')

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'expo-guard-'))
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ dependencies: { expo: '^55.0.0' } }))
  for (const [name, body] of Object.entries(files)) {
    const target = path.join(root, name)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, body)
  }
  return root
}

function run(root, ...args) {
  return spawnSync(process.execPath, [guard, '--root', root, ...args], { encoding: 'utf8' })
}

test('accepts a clean modular Expo project', () => {
  const root = fixture({
    'src/app/index.tsx': "import { PaymentsScreen } from '@/modules/payments'\nexport default PaymentsScreen\n",
    'src/modules/payments/index.ts': "export { PaymentsScreen } from './ui/payments-screen'\n",
    'src/modules/payments/ui/payments-screen.tsx': "import { canPay } from '../domain/payment-rules'\nexport const PaymentsScreen = () => canPay()\n",
    'src/modules/payments/domain/payment-rules.ts': 'export const canPay = () => true\n',
  })
  const result = run(root)
  assert.equal(result.status, 0)
  assert.equal(result.stdout, 'expo-mobile-architecture: clean\n')
})

test('reports stable boundary, domain, platform and Node diagnostics', () => {
  const root = fixture({
    'src/app/payments.tsx': "import Screen from '@/modules/payments/ui/screen'\nexport default Screen\n",
    'src/shared/api/client.ts': "import {\n  secret,\n} from '@/modules/auth/model/session'\nexport { secret }\n",
    'src/modules/payments/domain/rules.ts': "import React from 'react'\nimport fs from 'node:fs'\nexport { React, fs }\n",
    'src/modules/payments/ui/screen.tsx': "import { session } from '@/modules/auth/model/session'\nimport Icon from './icon.ios'\nexport default session || Icon\n",
    'src/modules/auth/model/session.ts': 'export const session = true\n',
  })
  const first = run(root, '--format', 'json')
  const second = run(root, '--format', 'json')
  assert.equal(first.status, 1)
  assert.equal(first.stdout, second.stdout)
  const rules = JSON.parse(first.stdout).violations.map((item) => item.rule)
  for (const rule of ['EXPO001', 'EXPO003', 'EXPO004', 'EXPO005', 'EXPO006', 'EXPO007']) assert.ok(rules.includes(rule), `missing ${rule}`)
})

test('detects module cycles through public APIs', () => {
  const root = fixture({
    'src/modules/auth/index.ts': "import { pay } from '@/modules/payments'\nexport const auth = pay\n",
    'src/modules/payments/index.ts': "import { auth } from '@/modules/auth'\nexport const pay = auth\n",
  })
  const result = run(root, '--format', 'json')
  assert.equal(result.status, 1)
  assert.ok(JSON.parse(result.stdout).violations.some((item) => item.rule === 'EXPO008'))
})

test('ignores imports inside comments and validates CLI errors', () => {
  const root = fixture({ 'src/shared/ok.ts': "// import x from '@/modules/private'\nexport const text = \"import y from '@/modules/also-private'\"\n" })
  assert.equal(run(root).status, 0)
  const bad = spawnSync(process.execPath, [guard, '--wat'], { encoding: 'utf8' })
  assert.equal(bad.status, 2)
  assert.match(bad.stderr, /unknown argument/)
  assert.equal(spawnSync(process.execPath, [guard, '--help']).status, 0)
})

test('hook mode is silent outside Expo and returns non-blocking context for violations', () => {
  const root = fixture({ 'src/shared/bad.ts': "import { auth } from '@/modules/auth'\nexport { auth }\n" })
  const edited = path.join(root, 'src/shared/bad.ts')
  const result = spawnSync(process.execPath, [guard, '--hook'], {
    encoding: 'utf8',
    input: JSON.stringify({ cwd: root, tool_input: { file_path: edited } }),
  })
  assert.equal(result.status, 0)
  const output = JSON.parse(result.stdout)
  assert.equal(output.hookSpecificOutput.hookEventName, 'PostToolUse')
  assert.match(output.hookSpecificOutput.additionalContext, /EXPO001/)

  const nonExpo = fs.mkdtempSync(path.join(os.tmpdir(), 'not-expo-hook-'))
  const plainFile = path.join(nonExpo, 'index.ts')
  fs.writeFileSync(plainFile, 'export {}\n')
  const silent = spawnSync(process.execPath, [guard, '--hook'], {
    encoding: 'utf8',
    input: JSON.stringify({ cwd: nonExpo, tool_input: { file_path: plainFile } }),
  })
  assert.equal(silent.status, 0)
  assert.equal(silent.stdout, '')
})
