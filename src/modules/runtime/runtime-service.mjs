import path from 'node:path'
import { EventStore } from './event-store.mjs'
import { ExecutionEnvelopeSchema, ToolReceiptSchema } from './schemas.mjs'
import { JobService } from './job-service.mjs'
import { classifyOperation, LocalWorkspaceBackend } from './execution-service.mjs'
import { PermissionService } from './permission-service.mjs'
import { TaskMasterBridge } from './task-master-bridge.mjs'
import { AnthropicMessagesAdapter, AutonomousRunner, OpenAIResponsesAdapter } from './provider-adapters.mjs'
import { createId, isoNow } from '../../shared/runtime-utils.mjs'

export class RuntimeService {
  #contexts = new Map()
  constructor({ sessions, registry }) { this.sessions = sessions; this.registry = registry }
  context(sessionId) {
    const session = this.sessions.require(sessionId)
    if (!this.#contexts.has(session.workspaceRoot)) {
      const store = new EventStore(session.workspaceRoot)
      this.#contexts.set(session.workspaceRoot, { store, permissions: new PermissionService(store), jobs: new JobService(store), backend: new LocalWorkspaceBackend(session.workspaceRoot), taskMaster: new TaskMasterBridge(session.workspaceRoot) })
    }
    return { session, ...this.#contexts.get(session.workspaceRoot) }
  }
  async createRun(sessionId, input) {
    const { session, store } = this.context(sessionId); const route = this.registry.route(input.goal)
    const envelope = ExecutionEnvelopeSchema.parse({ schemaVersion: 1, runId: createId('run'), sessionId, workspaceId: session.workspaceId, goal: input.goal, ownerRole: route.ownerRole, supportingSkills: route.supportingSkills, checkerRole: route.checkerRole, taskIds: input.taskIds, mode: input.mode, constraints: input.constraints })
    const run = { ...envelope, status: 'running', createdAt: isoNow(), updatedAt: isoNow() }
    await store.put('runs', run.runId, run, run.runId, 'run.started', sessionId); return run
  }
  getRun(sessionId, runId) {
    const { session, store } = this.context(sessionId); const run = store.get('runs', runId)
    if (!run || run.workspaceId !== session.workspaceId || run.sessionId !== sessionId) throw new Error('Unknown run for this session')
    return run
  }
  async cancelRun(sessionId, runId) {
    const { store, jobs } = this.context(sessionId); const run = this.getRun(sessionId, runId)
    if (run.status !== 'running') throw new Error(`Run cannot be cancelled while ${run.status}`)
    await Promise.all(jobs.list(runId).filter((job) => ['queued', 'running', 'waiting_approval'].includes(job.status)).map((job) => jobs.cancel(job.jobId)))
    const next = { ...run, status: 'cancelled', updatedAt: isoNow() }
    await store.put('runs', runId, next, runId, 'run.cancelled', sessionId); return next
  }
  async requestAction(sessionId, input) {
    const context = this.context(sessionId); const run = this.getRun(sessionId, input.runId)
    if (run.status !== 'running') throw new Error(`Run cannot request actions while ${run.status}`)
    return context.permissions.request({ ...input, sessionId })
  }
  async claim(sessionId, { runId, taskId, leaseSeconds }) {
    const { store } = this.context(sessionId); const run = this.getRun(sessionId, runId)
    if (run.status !== 'running') throw new Error(`Run cannot claim tasks while ${run.status}`)
    if (!run.taskIds.includes(taskId)) throw new Error('Task is outside the run allowlist')
    const current = store.get('claims', taskId); const now = Date.now()
    if (current && current.runId !== runId && Date.parse(current.expiresAt) > now) throw new Error(`Task is claimed by ${current.runId}`)
    const claim = { taskId, runId, claimedAt: current?.claimedAt ?? isoNow(), renewedAt: isoNow(), expiresAt: new Date(now + leaseSeconds * 1000).toISOString() }
    await store.put('claims', taskId, claim, runId, 'tool.completed', sessionId); return claim
  }
  async completeTask(sessionId, { runId, taskId, checkerReceiptId }) {
    const { store, taskMaster } = this.context(sessionId); const run = this.getRun(sessionId, runId); const claim = store.get('claims', taskId); const receipt = store.get('receipts', checkerReceiptId)
    if (run.status !== 'running') throw new Error(`Run cannot complete tasks while ${run.status}`)
    if (!claim || claim.runId !== runId) throw new Error('Task is not claimed by this run')
    if (Date.parse(claim.expiresAt) <= Date.now()) throw new Error('Task claim lease expired')
    if (!receipt) throw new Error('A READY checker receipt is required')
    if (receipt.taskId !== taskId) throw new Error('Checker receipt belongs to another task')
    if (receipt.runId !== runId || receipt.status !== 'success' || receipt.checkerVerdict !== 'READY') throw new Error('A READY checker receipt is required')
    const taskMasterResult = await taskMaster.setDone(taskId)
    const completed = [...new Set([...(run.completedTaskIds ?? []), taskId])]
    const done = completed.length === run.taskIds.length; const next = { ...run, completedTaskIds: completed, status: done ? 'completed' : run.status, updatedAt: isoNow() }
    await store.put('runs', runId, next, runId, done ? 'run.completed' : 'tool.completed', sessionId); return { ...next, taskMaster: taskMasterResult }
  }
  async recordReceipt(sessionId, receipt) {
    const { store } = this.context(sessionId); const parsed = ToolReceiptSchema.parse(receipt)
    this.getRun(sessionId, parsed.runId)
    const existing = store.get('receipts', parsed.receiptId)
    if (existing && JSON.stringify(existing) !== JSON.stringify(parsed)) throw new Error('Receipt ID already belongs to another immutable receipt')
    if (existing) return existing
    await store.put('receipts', parsed.receiptId, parsed, parsed.runId, 'tool.completed', sessionId); return parsed
  }
  listJobs(sessionId, runId) {
    const context = this.context(sessionId)
    if (runId) { this.getRun(sessionId, runId); return context.jobs.list(runId) }
    return context.jobs.list().filter((job) => { try { this.getRun(sessionId, job.runId); return true } catch { return false } })
  }
  getJob(sessionId, jobId) { const job = this.context(sessionId).jobs.get(jobId); this.getRun(sessionId, job.runId); return job }
  async cancelJob(sessionId, jobId) { const job = this.getJob(sessionId, jobId); return this.context(sessionId).jobs.cancel(job.jobId) }
  events(sessionId, runId, afterSequence) { this.getRun(sessionId, runId); return this.context(sessionId).store.events(runId, afterSequence) }
  async startAutonomous(sessionId, { runId, provider, instructions }) {
    const context = this.context(sessionId); const run = this.getRun(sessionId, runId)
    if (run.mode !== 'autonomous') throw new Error('Run mode is not autonomous')
    if (run.status !== 'running') throw new Error(`Run cannot start provider work while ${run.status}`)
    const adapter = provider === 'openai' ? new OpenAIResponsesAdapter() : new AnthropicMessagesAdapter()
    const runner = new AutonomousRunner()
    return context.jobs.start(runId, `provider:${provider}`, async ({ signal, progress }) => {
      const startedAt = isoNow()
      const toolDefinitions = provider === 'openai' ? [
        { type: 'function', name: 'workspace_read', description: 'Read a UTF-8 workspace file.', parameters: { type: 'object', properties: { file: { type: 'string' }, start: { type: 'number' }, end: { type: 'number' } }, required: ['file'], additionalProperties: false } },
        { type: 'function', name: 'workspace_search', description: 'Search text in the bound workspace.', parameters: { type: 'object', properties: { query: { type: 'string' }, directory: { type: 'string' } }, required: ['query'], additionalProperties: false } },
        { type: 'function', name: 'propose_action', description: 'Propose one exact write/external action for explicit approval; does not execute it.', parameters: { type: 'object', properties: { actionClass: { type: 'string', enum: ['workspace_write', 'destructive', 'external', 'publish', 'costly'] }, operation: { type: 'string', enum: ['apply_patch', 'exec'] }, description: { type: 'string' }, targets: { type: 'array', items: { type: 'string' } }, reversible: { type: 'boolean' }, payload: { type: 'object' } }, required: ['actionClass', 'operation', 'description', 'targets', 'reversible', 'payload'], additionalProperties: false } },
      ] : [
        { name: 'workspace_read', description: 'Read a UTF-8 workspace file.', input_schema: { type: 'object', properties: { file: { type: 'string' }, start: { type: 'number' }, end: { type: 'number' } }, required: ['file'] } },
        { name: 'workspace_search', description: 'Search text in the bound workspace.', input_schema: { type: 'object', properties: { query: { type: 'string' }, directory: { type: 'string' } }, required: ['query'] } },
        { name: 'propose_action', description: 'Propose one exact write/external action for explicit approval; does not execute it.', input_schema: { type: 'object', properties: { actionClass: { type: 'string', enum: ['workspace_write', 'destructive', 'external', 'publish', 'costly'] }, operation: { type: 'string', enum: ['apply_patch', 'exec'] }, description: { type: 'string' }, targets: { type: 'array', items: { type: 'string' } }, reversible: { type: 'boolean' }, payload: { type: 'object' } }, required: ['actionClass', 'operation', 'description', 'targets', 'reversible', 'payload'] } },
      ]
      const executeTool = async ({ name, arguments: args }) => {
        if (name === 'workspace_read') return context.backend.execute('read', args, signal)
        if (name === 'workspace_search') return context.backend.execute('search', args, signal)
        if (name === 'propose_action') return context.permissions.request({ ...args, runId, sessionId })
        throw new Error(`Provider requested unknown tool: ${name}`)
      }
      progress(0.1)
      const response = provider === 'openai'
        ? await runner.runOpenAI(adapter, { goal: instructions, tools: toolDefinitions, executeTool, signal })
        : await runner.runAnthropic(adapter, { goal: instructions, tools: toolDefinitions, executeTool, signal })
      progress(0.9)
      const receipt = ToolReceiptSchema.parse({ schemaVersion: 1, receiptId: createId('rcpt'), runId, tool: `provider.${provider}`, status: 'success', changedPaths: [], externalMutations: [], warnings: [], startedAt, finishedAt: isoNow() })
      await context.store.put('receipts', receipt.receiptId, { ...receipt, providerResponseId: response.id }, runId, 'tool.completed', sessionId)
      return receipt
    }, sessionId)
  }
  async executeAction(sessionId, { actionId, digest, operation, payload }) {
    const context = this.context(sessionId); const pending = context.permissions.requireExecution(actionId, digest, sessionId, operation, payload)
    const run = this.getRun(sessionId, pending.runId)
    if (run.status !== 'running') throw new Error(`Run cannot execute actions while ${run.status}`)
    const requiredClass = classifyOperation(operation, payload)
    if (pending.actionClass !== requiredClass) throw new Error(`Action class ${pending.actionClass} cannot execute ${requiredClass} operation`)
    const action = await context.permissions.consume(actionId, digest, sessionId, operation, payload)
    this.sessions.markMutation(sessionId, action.actionClass !== 'read')
    const startedAt = isoNow()
    try {
      const result = await context.backend.execute(operation, payload)
      const commandFailed = operation === 'exec' && result?.exitCode !== 0
      const receipt = ToolReceiptSchema.parse({ schemaVersion: 1, receiptId: createId('rcpt'), runId: action.runId, tool: `workspace.${operation}`, actionId, status: commandFailed ? 'failed' : 'success', changedPaths: result?.changedPaths ?? [], externalMutations: action.actionClass === 'external' || action.actionClass === 'publish' ? action.targets : [], warnings: result?.truncated ? ['Output truncated to 1 MiB'] : [], error: commandFailed ? (result.timedOut ? 'Command timed out' : result.stderr?.slice(0, 2000) || `Command exited with ${result.exitCode}`) : undefined, startedAt, finishedAt: isoNow() })
      await context.store.put('receipts', receipt.receiptId, { ...receipt, result }, receipt.runId, 'tool.completed', sessionId); return { receipt, result }
    } finally { this.sessions.markMutation(sessionId, false) }
  }
  dataRoot(sessionId) { return path.relative(this.context(sessionId).session.workspaceRoot, this.context(sessionId).store.root) }
}
