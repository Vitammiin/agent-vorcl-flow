#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const RUN_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/
const TASK_RE = /^\d+(?:\.\d+)?$/
const DEFAULT_LEASE_SECONDS = 3600
const MUTEX_LEASE_MS = 30_000

function fail(message, code = 2) {
  process.stderr.write(`vorcl-run: ${message}\n`)
  process.exit(code)
}

function argsOf(argv) {
  const [command, ...rest] = argv
  const options = {}
  for (let index = 0; index < rest.length; index++) {
    const token = rest[index]
    if (!token.startsWith('--')) fail(`unexpected argument ${token}`)
    const value = rest[index + 1]
    if (!value || value.startsWith('--')) fail(`missing value for ${token}`)
    options[token.slice(2)] = value
    index++
  }
  return { command, options }
}

function required(options, key) {
  if (!options[key]) fail(`--${key} is required`)
  return options[key]
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function json(file) {
  try {
    return readJson(file)
  } catch (error) {
    fail(`cannot read ${file}: ${error.message}`)
  }
}

function writeExclusive(file, value) {
  const descriptor = fs.openSync(file, 'wx', 0o600)
  try { fs.writeFileSync(descriptor, `${JSON.stringify(value, null, 2)}\n`) } finally { fs.closeSync(descriptor) }
}

function writeAtomic(file, value) {
  const temporary = `${file}.${process.pid}.${Math.random().toString(16).slice(2)}.tmp`
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 })
    fs.renameSync(temporary, file)
  } finally {
    try { fs.unlinkSync(temporary) } catch { /* renamed or never created */ }
  }
}

function output(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`)
}

const { command, options } = argsOf(process.argv.slice(2))
const root = path.resolve(options.root || process.cwd())
const stateRoot = path.join(root, '.taskmaster')
const runsDir = path.join(stateRoot, 'runs')
const claimsDir = path.join(stateRoot, 'claims')
const locksDir = path.join(stateRoot, 'claim-locks')

function loadScope() {
  const runId = required(options, 'run')
  const taskId = required(options, 'task')
  if (!RUN_RE.test(runId) || !TASK_RE.test(taskId)) fail('invalid run or task ID')
  const manifest = json(path.join(runsDir, `${runId}.json`))
  if (!manifest.taskIds.includes(taskId)) fail(`task ${taskId} is outside run scope ${runId}`)
  return { runId, taskId, manifest }
}

function claimFile(taskId) {
  return path.join(claimsDir, `task-${taskId.replace('.', '-')}.json`)
}

function mutexPath(taskId) {
  return path.join(locksDir, `task-${taskId.replace('.', '-')}.lock`)
}

function withTaskMutex(taskId, operation) {
  fs.mkdirSync(locksDir, { recursive: true })
  const lock = mutexPath(taskId)
  const ownerFile = path.join(lock, 'owner.json')
  const lockId = `${process.pid}-${Date.now().toString(36)}-${Math.random().toString(16).slice(2)}`
  try {
    fs.mkdirSync(lock)
    fs.writeFileSync(ownerFile, `${JSON.stringify({ lockId, pid: process.pid, expiresAt: new Date(Date.now() + MUTEX_LEASE_MS).toISOString() })}\n`, { mode: 0o600 })
  } catch (error) {
    if (error.code === 'EEXIST') {
      let owner = { lockId: 'unknown', expiresAt: new Date(fs.statSync(lock).mtimeMs + MUTEX_LEASE_MS).toISOString() }
      try { owner = readJson(ownerFile) } catch { /* partial lock creation: recover as unknown after mtime lease */ }
      fail(`task ${taskId} claim is locked by ${owner.lockId} until ${owner.expiresAt}; after expiry use unlock --expected-lock ${owner.lockId}`, 5)
    }
    throw error
  }
  try {
    return operation()
  } finally {
    try { fs.unlinkSync(ownerFile) } catch { /* operation may have lost the lock externally */ }
    try { fs.rmdirSync(lock) } catch { /* recovery command can inspect a surviving lock */ }
  }
}

function newClaim(runId, taskId, manifest, previous) {
  const now = Date.now()
  const seconds = Number(manifest.leaseSeconds || DEFAULT_LEASE_SECONDS)
  return {
    version: 2,
    taskId,
    runId,
    owner: manifest.owner,
    claimedAt: previous?.claimedAt || new Date(now).toISOString(),
    renewedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + seconds * 1000).toISOString(),
  }
}

if (command === 'create') {
  const runId = required(options, 'run')
  const owner = required(options, 'owner')
  if (!RUN_RE.test(runId)) fail('invalid --run; use letters, digits, dot, underscore, or hyphen')
  const taskIds = [...new Set(required(options, 'tasks').split(',').map((id) => id.trim()).filter(Boolean))]
  const leaseSeconds = Number(options['lease-seconds'] || DEFAULT_LEASE_SECONDS)
  if (!taskIds.length || taskIds.some((id) => !TASK_RE.test(id))) fail('invalid --tasks; expected comma-separated Task Master IDs')
  if (!Number.isInteger(leaseSeconds) || leaseSeconds < 30 || leaseSeconds > 86400) fail('--lease-seconds must be an integer from 30 to 86400')
  fs.mkdirSync(runsDir, { recursive: true })
  const file = path.join(runsDir, `${runId}.json`)
  const manifest = { version: 2, runId, owner, taskIds, leaseSeconds, createdAt: new Date().toISOString() }
  try {
    writeExclusive(file, manifest)
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
    const existing = json(file)
    if (existing.owner !== owner || JSON.stringify(existing.taskIds) !== JSON.stringify(taskIds)) fail(`run ${runId} already exists with a different scope`, 3)
    output({ ...existing, idempotent: true })
    process.exit(0)
  }
  output(manifest)
} else if (command === 'claim') {
  const { runId, taskId, manifest } = loadScope()
  fs.mkdirSync(claimsDir, { recursive: true })
  const file = claimFile(taskId)
  const result = withTaskMutex(taskId, () => {
    if (!fs.existsSync(file)) {
      const claim = newClaim(runId, taskId, manifest)
      writeExclusive(file, claim)
      return { value: { ...claim, claimed: true } }
    }
    const existing = readJson(file)
    if (existing.runId === runId && existing.owner === manifest.owner) return { value: { ...existing, claimed: true, idempotent: true } }
    if (Date.parse(existing.expiresAt || '') <= Date.now()) return { error: `task ${taskId} lease expired for run ${existing.runId}; use reclaim --from-run ${existing.runId}`, code: 4 }
    return { error: `task ${taskId} is already claimed by run ${existing.runId}`, code: 3 }
  })
  if (result.error) fail(result.error, result.code)
  output(result.value)
} else if (command === 'renew') {
  const { runId, taskId, manifest } = loadScope()
  const file = claimFile(taskId)
  const result = withTaskMutex(taskId, () => {
    if (!fs.existsSync(file)) return { error: `task ${taskId} has no claim`, code: 3 }
    const existing = readJson(file)
    if (existing.runId !== runId || existing.owner !== manifest.owner) return { error: `task ${taskId} is claimed by run ${existing.runId}`, code: 3 }
    const renewed = newClaim(runId, taskId, manifest, existing)
    writeAtomic(file, renewed)
    return { value: { ...renewed, renewed: true } }
  })
  if (result.error) fail(result.error, result.code)
  output(result.value)
} else if (command === 'reclaim') {
  const { runId, taskId, manifest } = loadScope()
  const fromRun = required(options, 'from-run')
  if (!RUN_RE.test(fromRun)) fail('invalid --from-run')
  const file = claimFile(taskId)
  const result = withTaskMutex(taskId, () => {
    if (!fs.existsSync(file)) return { error: `task ${taskId} has no stale claim; use claim`, code: 3 }
    const existing = readJson(file)
    if (existing.runId !== fromRun) return { error: `task ${taskId} expected run ${fromRun}, found ${existing.runId}`, code: 3 }
    if (Date.parse(existing.expiresAt || '') > Date.now()) return { error: `task ${taskId} lease for run ${fromRun} is still active`, code: 3 }
    const reclaimed = newClaim(runId, taskId, manifest)
    writeAtomic(file, reclaimed)
    return { value: { ...reclaimed, reclaimed: true, previousRunId: fromRun } }
  })
  if (result.error) fail(result.error, result.code)
  output(result.value)
} else if (command === 'unlock') {
  const taskId = required(options, 'task')
  const expectedLock = required(options, 'expected-lock')
  if (!TASK_RE.test(taskId) || !RUN_RE.test(expectedLock)) fail('invalid task or expected lock ID')
  const lock = mutexPath(taskId)
  if (!fs.existsSync(lock)) fail(`task ${taskId} has no operation lock`, 3)
  const ownerFile = path.join(lock, 'owner.json')
  let owner = { lockId: 'unknown', expiresAt: new Date(fs.statSync(lock).mtimeMs + MUTEX_LEASE_MS).toISOString() }
  try { owner = readJson(ownerFile) } catch { /* incomplete crashed lock */ }
  if (owner.lockId !== expectedLock) fail(`task ${taskId} expected lock ${expectedLock}, found ${owner.lockId}`, 3)
  if (Date.parse(owner.expiresAt) > Date.now()) fail(`task ${taskId} operation lock ${expectedLock} is still active`, 3)
  const tombstone = `${lock}.stale-${expectedLock}-${process.pid}`
  try {
    fs.renameSync(lock, tombstone)
  } catch (error) {
    fail(`task ${taskId} lock changed during recovery: ${error.message}`, 5)
  }
  fs.rmSync(tombstone, { recursive: true, force: true })
  output({ taskId, lockId: expectedLock, unlocked: true })
} else if (command === 'status') {
  const runId = required(options, 'run')
  if (!RUN_RE.test(runId)) fail('invalid --run')
  const manifest = json(path.join(runsDir, `${runId}.json`))
  const claims = manifest.taskIds.flatMap((taskId) => fs.existsSync(claimFile(taskId)) ? [json(claimFile(taskId))] : [])
  output({ ...manifest, claims })
} else {
  fail('usage: vorcl-run.mjs create|claim|renew|reclaim|unlock|status (see $workflow for required arguments)')
}
