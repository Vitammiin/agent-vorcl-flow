import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const guard = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../scripts/guard.mjs')

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'expo-ui-guard-'))
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify({ dependencies: { expo: '^57.0.0' } }))
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

test('accepts tokenized UI with a centralized reduced-motion policy', () => {
  const root = fixture({
    'src/shared/theme/colors.ts': "export const colors = { accent: '#6633ff' }\n",
    'src/shared/theme/motion.ts': 'export const motion = { duration: { fast: 160 } }\n',
    'src/shared/motion/reduced-motion.tsx': "import { ReducedMotionConfig } from 'react-native-reanimated'\nexport { ReducedMotionConfig }\n",
    'src/modules/home/ui/card.tsx': "import { withTiming } from 'react-native-reanimated'\nimport { colors, motion } from '@/shared/theme'\nexport const animate = () => withTiming(1, { duration: motion.duration.fast })\nexport { colors }\n",
    'src/shared/haptics/index.ts': "import * as Haptics from 'expo-haptics'\nexport const selection = Haptics.selectionAsync\n",
  })
  const result = run(root)
  assert.equal(result.status, 0)
  assert.equal(result.stdout, 'expo-ui-design-motion: clean\n')
})

test('reports raw colors, timings, direct haptics and route transitions', () => {
  const root = fixture({
    'src/app/details.tsx': 'export const transition = { translateX: 20 }\n',
    'src/modules/home/ui/card.tsx': "import * as Haptics from 'expo-haptics'\nimport { withTiming } from 'react-native-reanimated'\nexport const color = '#A21EFF'\nexport const animate = () => withTiming(1, { duration: 237 })\nexport { Haptics }\n",
  })
  const first = run(root, '--format', 'json')
  const second = run(root, '--format', 'json')
  assert.equal(first.status, 1)
  assert.equal(first.stdout, second.stdout)
  const rules = JSON.parse(first.stdout).violations.map((item) => item.rule)
  for (const rule of ['EXPOUI001', 'EXPOUI002', 'EXPOUI003', 'EXPOUI004', 'EXPOUI005']) assert.ok(rules.includes(rule), `missing ${rule}`)
})

test('accepts zero-duration reduced variants and rejects arbitrary layout delays', () => {
  const root = fixture({
    'src/shared/motion/policy.ts': "import { useReducedMotion } from 'react-native-reanimated'\nexport { useReducedMotion }\n",
    'src/modules/home/ui/list.tsx': "import { FadeIn } from 'react-native-reanimated'\nexport const reduced = FadeIn.duration(0)\nexport const arbitrary = FadeIn.delay(175)\n",
  })
  const result = run(root, '--format', 'json')
  const violations = JSON.parse(result.stdout).violations
  assert.equal(violations.filter((item) => item.rule === 'EXPOUI002').length, 1)
  assert.equal(violations.find((item) => item.rule === 'EXPOUI002').target, '175')
})

test('validates CLI errors and hook mode stays non-blocking', () => {
  const root = fixture({ 'src/modules/home/ui/card.tsx': "export const color = '#fff'\n" })
  const edited = path.join(root, 'src/modules/home/ui/card.tsx')
  const hook = spawnSync(process.execPath, [guard, '--hook'], {
    encoding: 'utf8',
    input: JSON.stringify({ cwd: root, tool_input: { file_path: edited } }),
  })
  assert.equal(hook.status, 0)
  assert.match(JSON.parse(hook.stdout).hookSpecificOutput.additionalContext, /EXPOUI001/)

  const bad = spawnSync(process.execPath, [guard, '--wat'], { encoding: 'utf8' })
  assert.equal(bad.status, 2)
  assert.match(bad.stderr, /unknown argument/)
  assert.equal(spawnSync(process.execPath, [guard, '--help']).status, 0)
})
