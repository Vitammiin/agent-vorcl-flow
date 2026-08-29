import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

import { routeWorkspace } from '../skills/workspace-capability-routing/scripts/route.mjs'

const root = path.resolve('.')

function fixture(t, packageJson) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'avf-route-'))
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }))
  if (packageJson) fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify(packageJson))
  return directory
}

test('capability catalog is complete and reproducible', () => {
  const result = spawnSync(process.execPath, ['scripts/generate-capability-catalog.mjs'], { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'skills/workspace-capability-routing/references/capability-catalog.json'), 'utf8'))
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'scripts/roles.json'), 'utf8'))
  const skillNames = fs.readdirSync(path.join(root, 'skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, 'skills', entry.name, 'SKILL.md')))
    .map((entry) => entry.name).sort()
  assert.deepEqual(catalog.roles.map((role) => role.id), registry.roles.map((role) => role.id))
  assert.deepEqual(catalog.skills.map((skill) => skill.name).sort(), skillNames)
})

test('routes Expo Liquid Glass screen to mobile skills and compatibility', (t) => {
  const directory = fixture(t, { dependencies: { expo: '57.0.0', 'react-native': '0.86.0', '@callstack/liquid-glass': '0.8.1' } })
  const route = routeWorkspace(directory, 'Create an Expo mobile screen with Liquid Glass')
  assert.equal(route.primaryRole, 'expo-mobile')
  for (const skill of ['expo-mobile-architecture', 'expo-ui-design-motion', 'mobile-thumb-zones', 'react-native-liquid-glass', 'expo-mobile-compatibility']) assert.ok(route.skillHints.includes(skill), `missing ${skill}`)
})

test('routes responsive web UI to frontend thumb ergonomics', (t) => {
  const directory = fixture(t, { dependencies: { next: '16.0.0', react: '19.0.0', 'react-dom': '19.0.0' } })
  const route = routeWorkspace(directory, 'Build a responsive mobile checkout screen')
  assert.equal(route.primaryRole, 'frontend')
  assert.ok(route.skillHints.includes('mobile-thumb-zones'))
  assert.ok(!route.skillHints.includes('react-native-liquid-glass'))
})

test('requested video artifact wins over incidental Node backend signals', (t) => {
  const directory = fixture(t, { dependencies: { express: '5.0.0', remotion: '4.0.0' } })
  const route = routeWorkspace(directory, 'Create and render an MP4 product video')
  assert.equal(route.primaryRole, 'design-studio')
  assert.ok(route.skillHints.includes('animate'))
  assert.ok(!route.skillHints.includes('backend-architecture'))
})

test('backend-only API remains free of mobile skill noise', (t) => {
  const directory = fixture(t, { dependencies: { fastify: '5.0.0' } })
  const route = routeWorkspace(directory, 'Add an HTTP API endpoint')
  assert.equal(route.primaryRole, 'backend')
  assert.ok(route.skillHints.includes('backend-architecture'))
  assert.ok(!route.skillHints.includes('mobile-thumb-zones'))
  assert.ok(!route.skillHints.includes('react-native-liquid-glass'))
})

test('explicit greenfield Expo intent works without existing mobile dependencies', (t) => {
  const directory = fixture(t, null)
  const route = routeWorkspace(directory, 'Design an Expo screen for one-handed use')
  assert.equal(route.primaryRole, 'expo-mobile')
  assert.ok(route.skillHints.includes('mobile-thumb-zones'))
})

test('Expo audit hands off mobile reachability and compatibility checks', (t) => {
  const directory = fixture(t, { dependencies: { expo: '57.0.0', 'react-native': '0.86.0' } })
  const route = routeWorkspace(directory, 'Audit the Expo mobile screen reachability and native compatibility')
  assert.ok(['analyzer', 'architect'].includes(route.primaryRole))
  assert.ok(route.supportingRoles.includes('expo-mobile'))
  for (const skill of ['expo-mobile-audit', 'expo-mobile-ui-audit', 'mobile-thumb-zones', 'expo-mobile-compatibility']) {
    assert.ok(route.skillHints.includes(skill), `missing ${skill}`)
  }
})

test('skills are attached only to relevant agents', () => {
  const read = (name) => fs.readFileSync(path.join(root, `agents/${name}.md`), 'utf8')
  for (const role of ['frontend', 'expo-mobile', 'design-studio', 'screenshot']) assert.match(read(role), /mobile-thumb-zones/)
  assert.match(read('expo-mobile'), /react-native-liquid-glass/)
  for (const role of ['architect', 'analyzer']) assert.match(read(role), /workspace-capability-routing/)
  for (const role of ['backend', 'database', 'devops']) {
    assert.doesNotMatch(read(role), /mobile-thumb-zones/)
    assert.doesNotMatch(read(role), /react-native-liquid-glass/)
  }
})
