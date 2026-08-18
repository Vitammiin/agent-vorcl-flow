import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

const cli = path.resolve('scripts/vorcl-run.mjs')

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'avf-vorcl-run-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  return root
}

function run(root, ...args) {
  return JSON.parse(execFileSync(process.execPath, [cli, ...args, '--root', root], { encoding: 'utf8' }))
}

test('creates a run scoped to captured task IDs', (t) => {
  const root = fixture(t)
  const result = run(root, 'create', '--run', 'feature-a', '--tasks', '28,29', '--owner', 'agent-a')

  assert.equal(result.runId, 'feature-a')
  assert.deepEqual(result.taskIds, ['28', '29'])
  const saved = JSON.parse(fs.readFileSync(path.join(root, '.taskmaster/runs/feature-a.json'), 'utf8'))
  assert.equal(saved.owner, 'agent-a')
  assert.deepEqual(saved.taskIds, ['28', '29'])
})

test('claim is idempotent for its run and rejects tasks outside the run', (t) => {
  const root = fixture(t)
  run(root, 'create', '--run', 'feature-a', '--tasks', '28', '--owner', 'agent-a')

  assert.equal(run(root, 'claim', '--run', 'feature-a', '--task', '28').claimed, true)
  assert.equal(run(root, 'claim', '--run', 'feature-a', '--task', '28').idempotent, true)

  const outside = spawnSync(process.execPath, [cli, 'claim', '--run', 'feature-a', '--task', '99', '--root', root], { encoding: 'utf8' })
  assert.equal(outside.status, 2)
  assert.match(outside.stderr, /outside run scope/)
})

test('an atomic claim prevents a second run from taking the same task', (t) => {
  const root = fixture(t)
  run(root, 'create', '--run', 'feature-a', '--tasks', '28', '--owner', 'agent-a')
  run(root, 'create', '--run', 'feature-b', '--tasks', '28', '--owner', 'agent-b')

  assert.equal(run(root, 'claim', '--run', 'feature-a', '--task', '28').claimed, true)
  const competing = spawnSync(process.execPath, [cli, 'claim', '--run', 'feature-b', '--task', '28', '--root', root], { encoding: 'utf8' })

  assert.equal(competing.status, 3)
  assert.match(competing.stderr, /already claimed by run feature-a/)
})

test('expired leases require an explicit compare-by-run reclaim', (t) => {
  const root = fixture(t)
  run(root, 'create', '--run', 'feature-a', '--tasks', '28', '--owner', 'agent-a')
  run(root, 'create', '--run', 'feature-b', '--tasks', '28', '--owner', 'agent-b')
  run(root, 'claim', '--run', 'feature-a', '--task', '28')
  const claimFile = path.join(root, '.taskmaster/claims/task-28.json')
  const expired = JSON.parse(fs.readFileSync(claimFile, 'utf8'))
  expired.expiresAt = '2000-01-01T00:00:00.000Z'
  fs.writeFileSync(claimFile, `${JSON.stringify(expired, null, 2)}\n`)

  const implicit = spawnSync(process.execPath, [cli, 'claim', '--run', 'feature-b', '--task', '28', '--root', root], { encoding: 'utf8' })
  assert.equal(implicit.status, 4)
  assert.match(implicit.stderr, /lease expired.*reclaim/)

  const reclaimed = run(root, 'reclaim', '--run', 'feature-b', '--task', '28', '--from-run', 'feature-a')
  assert.equal(reclaimed.reclaimed, true)
  assert.equal(reclaimed.runId, 'feature-b')
  assert.equal(run(root, 'renew', '--run', 'feature-b', '--task', '28').renewed, true)
})

test('an orphaned operation mutex has explicit expiry-checked recovery', (t) => {
  const root = fixture(t)
  run(root, 'create', '--run', 'feature-a', '--tasks', '28', '--owner', 'agent-a')
  const lock = path.join(root, '.taskmaster/claim-locks/task-28.lock')
  fs.mkdirSync(lock, { recursive: true })
  fs.writeFileSync(path.join(lock, 'owner.json'), JSON.stringify({ lockId: 'deadbeef', expiresAt: '2000-01-01T00:00:00.000Z' }))

  const unlocked = run(root, 'unlock', '--task', '28', '--expected-lock', 'deadbeef')
  assert.equal(unlocked.unlocked, true)
  assert.equal(run(root, 'claim', '--run', 'feature-a', '--task', '28').claimed, true)
})
