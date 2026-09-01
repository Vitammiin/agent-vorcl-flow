import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { startRuntimeServer } from '../src/app/runtime-server.mjs'

const enabled = process.env.AVF_E2E_NETWORK === '1'

test('runtime startup rejects an invalid listen configuration', async () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'avf-http-invalid-home-'))
  process.env.AGENT_VORCL_HOME = home
  await assert.rejects(() => startRuntimeServer({ port: -1 }))
})

test('real Streamable HTTP MCP boundary authenticates, initializes, lists and binds', { skip: !enabled }, async () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'avf-http-home-'))
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'avf-http-workspace-'))
  process.env.AGENT_VORCL_HOME = home
  process.env.AVF_ALLOWED_ROOTS = workspace
  const server = await startRuntimeServer({ port: 0 })
  const port = server.httpServer.address().port
  const endpoint = `http://127.0.0.1:${port}/mcp`
  const headers = { authorization: `Bearer ${server.config.token}`, 'content-type': 'application/json', accept: 'application/json, text/event-stream' }
  try {
    const unauthorized = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' })
    assert.equal(unauthorized.status, 401)
    const initialize = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'test', version: '1' } } }) })
    assert.equal(initialize.status, 200)
    const session = initialize.headers.get('mcp-session-id'); assert.ok(session)
    const sessionHeaders = { ...headers, 'mcp-session-id': session }
    const initialized = await fetch(endpoint, { method: 'POST', headers: sessionHeaders, body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) })
    assert.ok([200, 202].includes(initialized.status))
    const list = await fetch(endpoint, { method: 'POST', headers: sessionHeaders, body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }) })
    const listBody = await list.text(); assert.match(listBody, /avf_bind_workspace/); assert.match(listBody, /avf_action_execute/)
    const bind = await fetch(endpoint, { method: 'POST', headers: sessionHeaders, body: JSON.stringify({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'avf_bind_workspace', arguments: { workspace, clientName: 'test' } } }) })
    assert.equal(bind.status, 200); assert.match(await bind.text(), /workspaceId/)
  } finally { await server.close() }
})
