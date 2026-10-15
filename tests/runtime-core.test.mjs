import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { EventStore } from '../src/modules/runtime/event-store.mjs'
import { LocalWorkspaceBackend } from '../src/modules/runtime/execution-service.mjs'
import { JobService } from '../src/modules/runtime/job-service.mjs'
import { AutonomousRunner, normalizeAnthropicEvent, normalizeOpenAIEvent } from '../src/modules/runtime/provider-adapters.mjs'
import { RegistryService } from '../src/modules/runtime/registry-service.mjs'
import { RuntimeService } from '../src/modules/runtime/runtime-service.mjs'
import { SessionService } from '../src/modules/runtime/session-service.mjs'
import { SkillCatalogService } from '../src/modules/runtime/skill-catalog-service.mjs'
import { ToolReceiptSchema } from '../src/modules/runtime/schemas.mjs'
import { createId, isoNow } from '../src/shared/runtime-utils.mjs'
import { loadRuntimeEnvironment } from '../src/config/runtime-config.mjs'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const temporaryWorkspace = () => fs.mkdtempSync(path.join(os.tmpdir(), 'avf-runtime-'))

test('registry v2 preserves public roles and compiles runtime contracts', () => {
  const registry = new RegistryService(packageRoot).list()
  assert.equal(registry.schemaVersion, 2)
  assert.equal(registry.roles.length, 26)
  assert.ok(registry.skills.length >= 78)
  assert.ok(registry.commands.length >= 159)
  for (const role of registry.roles) {
    assert.ok(role.inputContract)
    assert.ok(role.outputContract)
    assert.deepEqual(role.executionMode, ['external', 'autonomous'])
    assert.ok(role.requiredSkills.every((skill) => !/[\[\]]/.test(skill)), `${role.id} has malformed skill IDs`)
  }
})

test('runtime environment parser strips inline comments and preserves quoted hashes', () => {
  const home = temporaryWorkspace(); fs.writeFileSync(path.join(home, '.env'), 'AVF_TEST_EMPTY= # comment\nAVF_TEST_QUOTED="value # kept"\n')
  delete process.env.AVF_TEST_EMPTY; delete process.env.AVF_TEST_QUOTED
  loadRuntimeEnvironment(path.join(home, '.env'))
  assert.equal(process.env.AVF_TEST_EMPTY, '')
  assert.equal(process.env.AVF_TEST_QUOTED, 'value # kept')
  delete process.env.AVF_TEST_EMPTY; delete process.env.AVF_TEST_QUOTED
})

test('session binding uses canonical roots, capacity and active-mutation guard', () => {
  const root = temporaryWorkspace()
  const sessions = new SessionService({ maxSessions: 1, allowedRoots: [root] })
  const bound = sessions.bind('one', root, 'test')
  assert.equal(bound.workspaceRoot, fs.realpathSync(root))
  sessions.markMutation('one', true)
  assert.throws(() => sessions.bind('one', root, 'test'), /mutation is active/i)
  assert.throws(() => sessions.bind('two', root, 'test'), /capacity/)
})

test('event replay restores durable run state without duplicate effects', async () => {
  const root = temporaryWorkspace()
  const first = new EventStore(root)
  await first.put('runs', 'run-1', { runId: 'run-1', status: 'running' }, 'run-1', 'run.started')
  first.flush()
  const second = new EventStore(root)
  assert.deepEqual(second.get('runs', 'run-1'), { runId: 'run-1', status: 'running' })
  assert.equal(second.events('run-1').length, 1)
  fs.appendFileSync(path.join(root, '.agent-vorcl', 'runtime', 'events.jsonl'), '{"partial":')
  const repaired = new EventStore(root)
  assert.equal(repaired.events('run-1').length, 1)
  await repaired.put('runs', 'run-1', { runId: 'run-1', status: 'completed' }, 'run-1', 'run.completed')
  assert.equal(repaired.events('run-1').length, 2)
})

test('runs and run-bound resources are isolated between MCP sessions', async () => {
  const root = temporaryWorkspace(); const sessions = new SessionService({ allowedRoots: [root] })
  sessions.bind('owner', root, 'test'); sessions.bind('neighbor', root, 'test')
  const runtime = new RuntimeService({ sessions, registry: new RegistryService(packageRoot) })
  const run = await runtime.createRun('owner', { goal: 'backend API', taskIds: ['7'], mode: 'external', constraints: {} })
  assert.throws(() => runtime.getRun('neighbor', run.runId), /this session/)
  await assert.rejects(() => runtime.cancelRun('neighbor', run.runId), /this session/)
  assert.equal(runtime.getRun('owner', run.runId).status, 'running')
})

test('approval is digest-bound, single-use and required for writes', async () => {
  const root = temporaryWorkspace()
  const sessions = new SessionService({ allowedRoots: [root] })
  sessions.bind('session', root, 'test')
  const registry = new RegistryService(packageRoot)
  const runtime = new RuntimeService({ sessions, registry })
  const run = await runtime.createRun('session', { goal: 'backend API', taskIds: ['7'], mode: 'external', constraints: {} })
  const context = runtime.context('session')
  const approvedPayload = { file: 'note.txt', content: 'x' }
  const action = await context.permissions.request({ runId: run.runId, sessionId: 'session', actionClass: 'workspace_write', operation: 'apply_patch', description: 'write file', targets: ['note.txt'], reversible: true, payload: approvedPayload })
  assert.equal(action.status, 'pending')
  await assert.rejects(() => context.permissions.decide(action.actionId, action.digest, true, 'other-session'), /another session/)
  await assert.rejects(() => runtime.executeAction('session', { actionId: action.actionId, digest: action.digest, operation: 'apply_patch', payload: approvedPayload }), /not approved/)
  await context.permissions.decide(action.actionId, action.digest, true)
  await assert.rejects(() => runtime.executeAction('session', { actionId: action.actionId, digest: action.digest, operation: 'apply_patch', payload: { file: 'note.txt', content: 'changed' } }), /payload does not match/)
  const result = await runtime.executeAction('session', { actionId: action.actionId, digest: action.digest, operation: 'apply_patch', payload: approvedPayload })
  assert.equal(result.receipt.status, 'success')
  await assert.rejects(() => runtime.executeAction('session', { actionId: action.actionId, digest: action.digest, operation: 'apply_patch', payload: approvedPayload }), /not approved/)

  await assert.rejects(() => runtime.executeAction('session', { operation: 'exec', payload: { argv: ['git', 'push'] } }), /host execution tools/)

  const concurrentPayload = { file: 'once.txt', content: 'once' }
  const concurrent = await context.permissions.request({ runId: run.runId, sessionId: 'session', actionClass: 'workspace_write', operation: 'apply_patch', description: 'write once', targets: ['once.txt'], reversible: true, payload: concurrentPayload })
  await context.permissions.decide(concurrent.actionId, concurrent.digest, true, 'session')
  const attempts = await Promise.allSettled([1, 2].map(() => runtime.executeAction('session', { actionId: concurrent.actionId, digest: concurrent.digest, operation: 'apply_patch', payload: concurrentPayload })))
  assert.equal(attempts.filter((attempt) => attempt.status === 'fulfilled').length, 1)
  assert.equal(attempts.filter((attempt) => attempt.status === 'rejected').length, 1)
})

test('task completion requires a READY checker receipt', async () => {
  const root = temporaryWorkspace()
  const sessions = new SessionService({ allowedRoots: [root] }); sessions.bind('session', root, 'test')
  const runtime = new RuntimeService({ sessions, registry: new RegistryService(packageRoot) })
  const run = await runtime.createRun('session', { goal: 'test task', taskIds: ['9', '10'], mode: 'external', constraints: {} })
  await runtime.claim('session', { runId: run.runId, taskId: '9', leaseSeconds: 60 })
  await runtime.claim('session', { runId: run.runId, taskId: '10', leaseSeconds: 60 })
  await assert.rejects(() => runtime.completeTask('session', { runId: run.runId, taskId: '9', checkerReceiptId: 'missing' }), /READY/)
  const receipt = { schemaVersion: 1, receiptId: createId('rcpt'), runId: run.runId, taskId: '9', tool: 'testing.verify', status: 'success', checkerVerdict: 'READY', changedPaths: [], externalMutations: [], warnings: [], startedAt: isoNow(), finishedAt: isoNow() }
  assert.equal(ToolReceiptSchema.parse(receipt).checkerVerdict, 'READY')
  await runtime.recordReceipt('session', receipt)
  await assert.rejects(() => runtime.completeTask('session', { runId: run.runId, taskId: '10', checkerReceiptId: receipt.receiptId }), /another task/)
  const claim = runtime.context('session').store.get('claims', '9')
  await runtime.context('session').store.put('claims', '9', { ...claim, expiresAt: new Date(Date.now() - 1000).toISOString() }, run.runId)
  await assert.rejects(() => runtime.completeTask('session', { runId: run.runId, taskId: '9', checkerReceiptId: receipt.receiptId }), /lease expired/)
  await runtime.claim('session', { runId: run.runId, taskId: '9', leaseSeconds: 60 })
  const completed = await runtime.completeTask('session', { runId: run.runId, taskId: '9', checkerReceiptId: receipt.receiptId })
  assert.equal(completed.status, 'running')
})

test('legacy mode disables the optional daemon entrypoint', () => {
  const home = temporaryWorkspace()
  const result = spawnSync(process.execPath, [path.join(packageRoot, 'bin', 'runtime.mjs'), 'status'], { encoding: 'utf8', env: { ...process.env, AGENT_VORCL_HOME: home, AVF_RUNTIME_MODE: 'legacy' } })
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout), { status: 'legacy', runtime: 'disabled' })
})

test('workspace backend blocks traversal and unsafe environment injection', async () => {
  const root = temporaryWorkspace(); const backend = new LocalWorkspaceBackend(root)
  await assert.rejects(() => backend.read({ file: '../secret' }), /escapes/)
  await assert.rejects(() => backend.exec({ argv: ['node', '-e', ''], env: { OPENAI_API_KEY: 'secret' } }), /allowlisted/)
  const nested = await backend.applyPatch({ file: 'new/nested/file.txt', content: 'safe' })
  assert.deepEqual(nested.changedPaths, ['new/nested/file.txt'])
})

test('provider events normalize to the shared runtime vocabulary', () => {
  assert.deepEqual(normalizeOpenAIEvent({ type: 'response.output_text.delta', delta: 'hi' }), { type: 'text.delta', data: { delta: 'hi' } })
  assert.deepEqual(normalizeAnthropicEvent({ type: 'content_block_delta', delta: { type: 'thinking_delta', thinking: 'x' } }), { type: 'reasoning.delta', data: { delta: 'x' } })
})

test('autonomous provider loop executes tools and enforces its step budget', async () => {
  let calls = 0
  const adapter = {
    complete: async () => calls++ === 0 ? { id: 'response-1', output: [{ type: 'function_call', call_id: 'call-1', name: 'read', arguments: '{}' }] } : { id: 'response-2', output: [{ type: 'message' }] },
    toolCalls: (response) => response.output.filter((item) => item.type === 'function_call').map((item) => ({ callId: item.call_id, name: item.name, arguments: {} })),
  }
  const result = await new AutonomousRunner({ maxToolSteps: 2 }).runOpenAI(adapter, { goal: 'inspect', tools: [], executeTool: async (call) => ({ tool: call.name, ok: true }) })
  assert.equal(result.id, 'response-2')
  const endless = { complete: async () => ({ id: 'loop', output: [{ type: 'function_call', call_id: 'c', name: 'read', arguments: '{}' }] }), toolCalls: adapter.toolCalls }
  await assert.rejects(() => new AutonomousRunner({ maxToolSteps: 1 }).runOpenAI(endless, { goal: 'loop', tools: [], executeTool: async () => ({}) }), /exceeded/)
})

test('job cancellation is durable and aborts in-flight work', async () => {
  const root = temporaryWorkspace(); const store = new EventStore(root); const jobs = new JobService(store)
  const job = await jobs.start('run-1', 'test', ({ signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true })))
  await jobs.cancel(job.jobId)
  await new Promise((resolve) => setTimeout(resolve, 20))
  assert.equal(jobs.get(job.jobId).status, 'cancelled')
  assert.ok(store.events('run-1').some((event) => event.type === 'job.progress'))
})

test('runtime restart marks interrupted durable jobs failed', async () => {
  const root = temporaryWorkspace(); const store = new EventStore(root)
  const createdAt = isoNow()
  await store.put('jobs', 'job-interrupted', { jobId: 'job-interrupted', runId: 'run-1', kind: 'provider:openai', status: 'running', progress: 0.4, createdAt, updatedAt: createdAt }, 'run-1', 'job.progress')
  store.flush()
  const replayed = new EventStore(root); const jobs = new JobService(replayed)
  assert.equal(jobs.get('job-interrupted').status, 'failed')
  await jobs.ready
  assert.equal(replayed.get('jobs', 'job-interrupted').error, 'Interrupted by runtime restart')
})

test('runtime skill catalog reads packaged skills without creating or changing installed skills', () => {
  const root = temporaryWorkspace(); const home = path.join(root, 'absent')
  const catalog = new SkillCatalogService(packageRoot, home)
  assert.match(catalog.read('workflow').content, /Workflow/)
  assert.ok(catalog.list().some((entry) => entry.id === 'workflow'))
  assert.equal(fs.existsSync(home), false)
  assert.throws(() => catalog.read('../private'), /Unsafe skill ID/)
})

test('runtime task completion leaves existing Task Master files byte-for-byte unchanged', async () => {
  const root = temporaryWorkspace()
  const tasksDir = path.join(root, '.taskmaster', 'tasks'); fs.mkdirSync(tasksDir, { recursive: true })
  const tasksFile = path.join(tasksDir, 'tasks.json')
  const original = JSON.stringify({ master: { tasks: [{ id: 12, title: 'User task', status: 'in-progress' }] } })
  fs.writeFileSync(tasksFile, original)
  const sessions = new SessionService({ allowedRoots: [root] }); sessions.bind('session', root, 'test')
  const runtime = new RuntimeService({ sessions, registry: new RegistryService(packageRoot) })
  const run = await runtime.createRun('session', { goal: 'local work', taskIds: ['12'], mode: 'external' })
  await runtime.claim('session', { runId: run.runId, taskId: '12', leaseSeconds: 60 })
  const receipt = { schemaVersion: 1, receiptId: createId('rcpt'), runId: run.runId, taskId: '12', tool: 'testing.verify', status: 'success', checkerVerdict: 'READY', startedAt: isoNow(), finishedAt: isoNow() }
  await runtime.recordReceipt('session', receipt)
  assert.equal((await runtime.completeTask('session', { runId: run.runId, taskId: '12', checkerReceiptId: receipt.receiptId })).status, 'completed')
  assert.equal(fs.readFileSync(tasksFile, 'utf8'), original)
  assert.deepEqual(fs.readdirSync(path.join(root, '.taskmaster')), ['tasks'])
  assert.equal(runtime.dataRoot('session'), path.join('.agent-vorcl', 'runtime'))
})

test('concurrent runs cannot both claim the same task', async () => {
  const root = temporaryWorkspace(); const sessions = new SessionService({ allowedRoots: [root] })
  sessions.bind('one', root, 'test'); sessions.bind('two', root, 'test')
  const runtime = new RuntimeService({ sessions, registry: new RegistryService(packageRoot) })
  const [one, two] = await Promise.all(['one', 'two'].map((id) => runtime.createRun(id, { goal: 'work', taskIds: ['1'], mode: 'external' })))
  const results = await Promise.allSettled([runtime.claim('one', { runId: one.runId, taskId: '1', leaseSeconds: 60 }), runtime.claim('two', { runId: two.runId, taskId: '1', leaseSeconds: 60 })])
  assert.equal(results.filter((result) => result.status === 'fulfilled').length, 1)
  assert.equal(results.filter((result) => result.status === 'rejected').length, 1)
  assert.equal(fs.existsSync(path.join(root, '.taskmaster')), false)
})

test('runtime inspection, help, and rejected service commands never create configuration', () => {
  for (const command of ['--help', 'status', 'doctor', 'install-service', 'typo']) {
    const root = temporaryWorkspace(); const home = path.join(root, 'absent')
    const result = spawnSync(process.execPath, [path.join(packageRoot, 'bin', 'runtime.mjs'), command], { encoding: 'utf8', env: { ...process.env, AGENT_VORCL_HOME: home } })
    assert.equal(result.status, ['install-service', 'typo'].includes(command) ? 1 : 0, result.stderr)
    assert.equal(fs.existsSync(home), false, command)
  }
})

test('concurrent completions retain every completed task', async () => {
  const root = temporaryWorkspace(); const sessions = new SessionService({ allowedRoots: [root] }); sessions.bind('session', root, 'test')
  const runtime = new RuntimeService({ sessions, registry: new RegistryService(packageRoot) })
  const run = await runtime.createRun('session', { goal: 'work', taskIds: ['1', '2'], mode: 'external' })
  const inputs = []
  for (const taskId of run.taskIds) {
    await runtime.claim('session', { runId: run.runId, taskId, leaseSeconds: 60 })
    const receipt = { schemaVersion: 1, receiptId: createId('rcpt'), runId: run.runId, taskId, tool: 'testing.verify', status: 'success', checkerVerdict: 'READY', startedAt: isoNow(), finishedAt: isoNow() }
    await runtime.recordReceipt('session', receipt)
    inputs.push({ runId: run.runId, taskId, checkerReceiptId: receipt.receiptId })
  }
  await Promise.all(inputs.map((input) => runtime.completeTask('session', input)))
  const result = runtime.getRun('session', run.runId)
  assert.deepEqual(result.completedTaskIds.sort(), ['1', '2'])
  assert.equal(result.status, 'completed')
})
