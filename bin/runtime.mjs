#!/usr/bin/env node
// Optional foreground runtime. Installation never starts or registers this service.
import fs from 'node:fs'
import { loadRuntimeConfig, loadRuntimeEnvironment } from '../src/config/runtime-config.mjs'

const usage = 'Usage: node bin/runtime.mjs serve|status|doctor|--help\nThe experimental runtime is opt-in. It does not configure clients or Task Master.'
const command = process.argv[2] || '--help'

async function health(config) {
  try {
    const response = await fetch(`http://${config.host}:${config.port}/health`, { signal: AbortSignal.timeout(1500) })
    const data = response.ok ? await response.json() : null
    return data?.name === 'agent-vorcl-flow-runtime' ? { reachable: true, data } : { reachable: false }
  } catch { return { reachable: false } }
}

try {
  if (['--help', '-h', 'help'].includes(command)) console.log(usage)
  else if (!['serve', 'status', 'doctor'].includes(command) || process.argv.length > 3) {
    throw new Error(`${usage}\nBackground start/stop and install-service were removed. Run serve explicitly and stop it with Ctrl+C.`)
  } else if (String(process.env.AVF_RUNTIME_MODE || '').toLowerCase() === 'legacy') {
    console.log(JSON.stringify({ status: 'legacy', runtime: 'disabled' }))
  } else if (command === 'serve') {
    loadRuntimeEnvironment()
    const { startRuntimeServer } = await import('../src/app/runtime-server.mjs')
    const server = await startRuntimeServer()
    console.log(`Experimental AVF runtime: http://${server.config.host}:${server.config.port}/mcp`)
    let closing = false
    const shutdown = async () => { if (closing) return; closing = true; await server.close(); process.exit(0) }
    process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown)
  } else {
    const config = loadRuntimeConfig()
    const result = await health(config)
    console.log(JSON.stringify(command === 'status'
      ? { status: result.reachable ? 'running' : 'stopped' }
      : { node: process.version, config: config.file, configured: fs.existsSync(config.file), health: result, allowedRoots: process.env.AVF_ALLOWED_ROOTS || null }, null, 2))
  }
} catch (error) { console.error(`runtime ${command}: ${error.message}`); process.exitCode = 1 }
