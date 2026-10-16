import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod/v4'
import { ensureRuntimeConfig, loadRuntimeEnvironment } from '../config/runtime-config.mjs'
import { jsonText, redact, writeJsonAtomic } from '../shared/runtime-utils.mjs'
import { RegistryService, RuntimeService, SessionService, SkillCatalogService, runtimeSchemas as schemas } from '../modules/runtime/index.mjs'

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const PACKAGE_VERSION = JSON.parse(fs.readFileSync(path.join(PACKAGE_ROOT, 'package.json'), 'utf8')).version

const safeEqual = (left, right) => {
  const a = Buffer.from(String(left)); const b = Buffer.from(String(right))
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}
const sessionId = (extra) => { if (!extra.sessionId) throw new Error('MCP session ID is required'); return extra.sessionId }

function registerTools(server, runtime, registry, skills) {
  server.registerTool('avf_bind_workspace', { description: 'Bind this MCP session to one canonical workspace.', inputSchema: schemas.bindWorkspaceInput }, async (input, extra) => jsonText(runtime.sessions.bind(sessionId(extra), input.workspace, input.clientName)))
  server.registerTool('avf_capabilities_list', { description: 'List the compiled v2 role, skill and command registry.' }, async () => jsonText(registry.list()))
  server.registerTool('avf_route_goal', { description: 'Route a goal to a stable owner role, skills and checker.', inputSchema: schemas.routeGoalInput }, async ({ goal }) => jsonText(registry.route(goal)))
  server.registerTool('avf_run_create', { description: 'Create a workspace-bound execution envelope.', inputSchema: schemas.createRunInput }, async (input, extra) => jsonText(await runtime.createRun(sessionId(extra), input)))
  server.registerTool('avf_run_get', { description: 'Read durable run state.', inputSchema: schemas.runIdInput }, async ({ runId }, extra) => jsonText(runtime.getRun(sessionId(extra), runId)))
  server.registerTool('avf_run_cancel', { description: 'Cancel a run and emit a terminal event.', inputSchema: schemas.runIdInput }, async ({ runId }, extra) => jsonText(await runtime.cancelRun(sessionId(extra), runId)))
  server.registerTool('avf_task_claim', { description: 'Atomically claim an allowlisted task.', inputSchema: schemas.taskClaimInput }, async (input, extra) => jsonText(await runtime.claim(sessionId(extra), input)))
  server.registerTool('avf_task_renew', { description: 'Renew the caller run task lease.', inputSchema: schemas.taskClaimInput }, async (input, extra) => jsonText(await runtime.claim(sessionId(extra), input)))
  server.registerTool('avf_task_complete', { description: 'Complete a task only with a READY checker receipt.', inputSchema: schemas.completeTaskInput }, async (input, extra) => jsonText(await runtime.completeTask(sessionId(extra), input)))
  server.registerTool('avf_action_request', { description: 'Create a digest-bound action and request approval when required.', inputSchema: schemas.requestActionInput }, async (input, extra) => jsonText(await runtime.requestAction(sessionId(extra), input)))
  server.registerTool('avf_action_approve', { description: 'Approve or reject one exact action digest.', inputSchema: schemas.approveActionInput }, async (input, extra) => jsonText(await runtime.context(sessionId(extra)).permissions.decide(input.actionId, input.digest, input.approve, sessionId(extra))))
  server.registerTool('avf_action_execute', { description: 'Execute an approved bounded workspace operation once.', inputSchema: schemas.executeActionInput }, async (input, extra) => jsonText(await runtime.executeAction(sessionId(extra), input)))
  server.registerTool('avf_receipt_record', { description: 'Record a ToolReceipt@1 from an external executor.', inputSchema: schemas.receiptInput }, async ({ receipt }, extra) => jsonText(await runtime.recordReceipt(sessionId(extra), receipt)))
  server.registerTool('avf_job_list', { description: 'List durable jobs, optionally for one run.', inputSchema: { runId: z.string().optional() } }, async ({ runId }, extra) => jsonText(runtime.listJobs(sessionId(extra), runId)))
  server.registerTool('avf_job_get', { description: 'Get one durable job.', inputSchema: { jobId: z.string().min(1) } }, async ({ jobId }, extra) => jsonText(runtime.getJob(sessionId(extra), jobId)))
  server.registerTool('avf_job_cancel', { description: 'Cancel a running job.', inputSchema: { jobId: z.string().min(1) } }, async ({ jobId }, extra) => jsonText(await runtime.cancelJob(sessionId(extra), jobId)))
  server.registerTool('avf_autonomous_start', { description: 'Start an optional provider-driven read/propose loop as a durable job.', inputSchema: schemas.autonomousStartInput }, async (input, extra) => jsonText(await runtime.startAutonomous(sessionId(extra), input)))
  server.registerTool('avf_events_read', { description: 'Read normalized durable events after a sequence.', inputSchema: schemas.eventsInput }, async ({ runId, afterSequence }, extra) => jsonText(runtime.events(sessionId(extra), runId, afterSequence)))
  server.registerTool('avf_skill_list', { description: 'List installed skill provenance and hashes.' }, async () => jsonText(skills.list()))
  server.registerTool('avf_skill_read', { description: 'Load one installed skill body on demand.', inputSchema: schemas.skillIdInput }, async ({ skillId }) => jsonText(skills.read(skillId)))
}

export async function startRuntimeServer(overrides = {}) {
  if (overrides.host && overrides.host !== '127.0.0.1') throw new Error('Runtime must listen on loopback')
  if (overrides.port != null && (!Number.isInteger(overrides.port) || overrides.port < 0 || overrides.port > 65535)) throw new Error('Invalid runtime listen port')
  loadRuntimeEnvironment()
  const config = { ...ensureRuntimeConfig(), ...overrides }
  const allowedRoots = String(process.env.AVF_ALLOWED_ROOTS || '').split(path.delimiter).filter(Boolean)
  const sessions = new SessionService({ ttlMs: config.sessionTtlMs, maxSessions: config.maxSessions, allowedRoots })
  const registry = new RegistryService(PACKAGE_ROOT)
  const runtime = new RuntimeService({ sessions, registry })
  const skills = new SkillCatalogService(PACKAGE_ROOT, config.home)
  const transports = new Map()
  const servers = new Map()
  const transportLastSeen = new Map()
  const app = createMcpExpressApp({ host: config.host })

  app.use((req, res, next) => {
    if (req.path === '/health') return next()
    const host = String(req.headers.host || '').split(':')[0]
    const origin = req.headers.origin
    const authorization = String(req.headers.authorization || '')
    if (!['127.0.0.1', 'localhost', '::1'].includes(host)) return res.status(403).json({ error: 'Invalid Host' })
    if (origin && !/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(String(origin))) return res.status(403).json({ error: 'Invalid Origin' })
    if (!authorization.startsWith('Bearer ') || !safeEqual(authorization.slice(7), config.token)) return res.status(401).json({ error: 'Unauthorized' })
    next()
  })
  app.get('/health', (_req, res) => res.json({ ok: true, name: 'agent-vorcl-flow-runtime', version: PACKAGE_VERSION, sessions: transports.size }))

  const handler = async (req, res) => {
    try {
      const requested = req.headers['mcp-session-id']
      let transport = requested ? transports.get(requested) : undefined
      if (!transport && !requested && isInitializeRequest(req.body)) {
        if (transports.size >= config.maxSessions) return res.status(503).json({ jsonrpc: '2.0', error: { code: -32001, message: 'Session capacity reached' }, id: req.body?.id ?? null })
        let created
        transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => sessions.createTransportSessionId(), onsessioninitialized: (id) => { transports.set(id, created); transportLastSeen.set(id, Date.now()) } })
        created = transport
        const server = new McpServer({ name: 'agent-vorcl-flow-runtime', version: PACKAGE_VERSION }, { capabilities: { logging: {} } })
        registerTools(server, runtime, registry, skills)
        transport.onclose = () => { const id = transport.sessionId; if (id) { transports.delete(id); servers.delete(id); transportLastSeen.delete(id); sessions.remove(id) } }
        await server.connect(transport)
        await transport.handleRequest(req, res, req.body)
        if (transport.sessionId) servers.set(transport.sessionId, server)
        return
      }
      if (!transport) return res.status(400).json({ jsonrpc: '2.0', error: { code: -32000, message: 'Invalid or missing MCP session' }, id: null })
      if (requested) transportLastSeen.set(requested, Date.now())
      await transport.handleRequest(req, res, req.body)
    } catch (error) {
      console.error(JSON.stringify(redact({ level: 'error', message: error?.message, stack: error?.stack })))
      if (!res.headersSent) res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: 'Internal server error' }, id: null })
    }
  }
  app.post('/mcp', handler); app.get('/mcp', handler); app.delete('/mcp', handler)
  const httpServer = await new Promise((resolve, reject) => {
    const instance = app.listen(config.port, config.host, (error) => error ? reject(error) : resolve(instance))
    instance.once('error', reject)
  })
  const cleanup = setInterval(() => {
    const cutoff = Date.now() - config.sessionTtlMs
    for (const [id, touchedAt] of transportLastSeen) if (touchedAt < cutoff) transports.get(id)?.close()
  }, 60_000)
  cleanup.unref()
  writeJsonAtomic(config.daemonFile, { pid: process.pid, host: config.host, port: config.port, startedAt: new Date().toISOString(), version: PACKAGE_VERSION })
  const close = async () => {
    clearInterval(cleanup)
    const results = await Promise.allSettled([...transports.values()].map((transport) => transport.close()).concat([...servers.values()].map((server) => server.close())))
    const rejected = results.find((result) => result.status === 'rejected')
    await new Promise((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve()))
    try { fs.unlinkSync(config.daemonFile) } catch (error) { if (error?.code !== 'ENOENT') throw new Error('Cannot remove daemon state', { cause: error }) }
    if (rejected) throw new Error('Runtime connection shutdown failed', { cause: rejected.reason })
  }
  return { config, httpServer, close, runtime, registry, sessions }
}
