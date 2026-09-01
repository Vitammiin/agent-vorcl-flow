#!/usr/bin/env node
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ensureRuntimeConfig, loadRuntimeEnvironment } from '../src/config/runtime-config.mjs'
import { startRuntimeServer } from '../src/app/runtime-server.mjs'
import { readJson, writeJsonAtomic } from '../src/shared/runtime-utils.mjs'

const command = process.argv[2] || 'status'
const script = fileURLToPath(import.meta.url)
const config = ensureRuntimeConfig()
loadRuntimeEnvironment(config.home)
const legacyMode = String(process.env.AVF_RUNTIME_MODE || '').toLowerCase() === 'legacy'

async function health() {
  try {
    const response = await fetch(`http://${config.host}:${config.port}/health`, { signal: AbortSignal.timeout(1500) })
    return response.ok ? { reachable: true, data: await response.json() } : { reachable: false, error: `HTTP ${response.status}` }
  } catch (error) { return { reachable: false, error: String(error?.cause?.code ?? error?.message ?? error) } }
}

async function serve() {
  if (legacyMode) {
    console.log('Agent-Vorcl-Flow Runtime v3 disabled; legacy roles, skills and commands remain active')
    await new Promise((resolve) => { process.once('SIGINT', resolve); process.once('SIGTERM', resolve) })
    return
  }
  const server = await startRuntimeServer()
  console.log(`Agent-Vorcl-Flow Runtime v3 listening on http://${server.config.host}:${server.config.port}/mcp`)
  const keepAlive = setInterval(() => {}, 60_000)
  const shutdown = async () => { clearInterval(keepAlive); await server.close(); process.exit(0) }
  process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown)
}

async function start() {
  if (legacyMode) { console.log('runtime v3 disabled by AVF_RUNTIME_MODE=legacy'); return }
  const current = await health(); if (current.reachable) { console.log(`runtime already running pid=${readJson(config.daemonFile, {}).pid ?? 'unknown'}`); return }
  const output = fs.openSync(config.logFile, 'a')
  const child = spawn(process.execPath, [script, 'serve'], { detached: true, stdio: ['ignore', output, output], env: process.env })
  fs.closeSync(output)
  child.unref()
  for (let attempt = 0; attempt < 30; attempt++) { await new Promise((resolve) => setTimeout(resolve, 100)); const result = await health(); if (result.reachable) { console.log(`runtime started pid=${child.pid}`); return } }
  throw new Error(`Runtime did not become healthy; inspect ${config.logFile}`)
}

async function stop() {
  const daemon = readJson(config.daemonFile, null); if (!daemon?.pid) { console.log('runtime is not running'); return }
  try { process.kill(daemon.pid, 'SIGTERM') } catch (error) { if (error?.code !== 'ESRCH') throw error }
  console.log(`runtime stop requested pid=${daemon.pid}`)
}

function installService() {
  const node = process.execPath
  const xml = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
  if (process.platform === 'darwin') {
    const directory = path.join(os.homedir(), 'Library', 'LaunchAgents'); const file = path.join(directory, 'io.vorcl.agent-flow-runtime.plist'); fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0"><dict><key>Label</key><string>io.vorcl.agent-flow-runtime</string><key>ProgramArguments</key><array><string>${xml(node)}</string><string>${xml(script)}</string><string>serve</string></array><key>RunAtLoad</key><true/><key>KeepAlive</key><true/><key>StandardOutPath</key><string>${xml(config.logFile)}</string><key>StandardErrorPath</key><string>${xml(config.logFile)}</string></dict></plist>\n`)
    console.log(file); return
  }
  if (process.platform === 'linux') {
    const directory = path.join(os.homedir(), '.config', 'systemd', 'user'); const file = path.join(directory, 'agent-vorcl-flow-runtime.service'); fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(file, `[Unit]\nDescription=Agent-Vorcl-Flow Runtime v3\n[Service]\nExecStart="${node}" "${script}" serve\nRestart=on-failure\n[Install]\nWantedBy=default.target\n`); console.log(file); return
  }
  const file = path.join(config.home, 'start-runtime.cmd'); fs.writeFileSync(file, `@echo off\r\n"${node}" "${script}" serve\r\n`); console.log(`${file} (register as a per-user startup task)`)
}

try {
  if (command === 'serve') await serve()
  else if (command === 'start') await start()
  else if (command === 'stop') await stop()
  else if (command === 'status' && legacyMode) console.log(JSON.stringify({ status: 'legacy', runtime: 'disabled' }))
  else if (command === 'status') { const result = await health(); console.log(result.reachable ? JSON.stringify({ status: 'running', ...result.data }) : JSON.stringify({ status: 'stopped', error: result.error })); process.exitCode = result.reachable ? 0 : 1 }
  else if (command === 'doctor') console.log(JSON.stringify({ node: process.version, mode: legacyMode ? 'legacy' : 'runtime', config: config.file, tokenMode: fs.statSync(config.file).mode & 0o777, health: legacyMode ? { reachable: false, reason: 'AVF_RUNTIME_MODE=legacy' } : await health(), allowedRoots: process.env.AVF_ALLOWED_ROOTS || null }, null, 2))
  else if (command === 'install-service') installService()
  else throw new Error('Usage: agent-vorcl-flow runtime start|stop|status|doctor|install-service|serve')
} catch (error) { console.error(`runtime ${command}: ${error.message}`); process.exitCode = 1 }
