import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { readJson, writeJsonAtomic } from '../shared/runtime-utils.mjs'

export function runtimeHome() {
  if (process.env.AGENT_VORCL_HOME) return path.resolve(process.env.AGENT_VORCL_HOME)
  if (process.platform === 'win32' && process.env.APPDATA) return path.join(process.env.APPDATA, 'agent-vorcl-flow')
  return path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'), 'agent-vorcl-flow')
}

// Inspection never creates a home, token, or config. Only explicit startup persists state.
export function loadRuntimeConfig({ create = false } = {}) {
  const home = runtimeHome()
  const file = path.join(home, 'runtime.json')
  const current = readJson(file, {})
  const config = {
    version: 1,
    host: '127.0.0.1',
    port: Number(process.env.AVF_RUNTIME_PORT || current.port || 19790),
    token: process.env.AVF_RUNTIME_TOKEN || current.token || (create ? crypto.randomBytes(32).toString('base64url') : ''),
    sessionTtlMs: 60 * 60 * 1000,
    maxSessions: 32,
    eventRetentionDays: 30,
  }
  if (!Number.isInteger(config.port) || config.port < 1 || config.port > 65535) throw new Error('AVF_RUNTIME_PORT must be an integer from 1 to 65535')
  if ((create || config.token) && config.token.length < 32) throw new Error('AVF_RUNTIME_TOKEN must contain at least 32 characters')
  if (create) {
    writeJsonAtomic(file, config)
    try { fs.chmodSync(file, 0o600) } catch (error) {
      if (process.platform !== 'win32') throw new Error(`Cannot protect runtime config: ${file}`, { cause: error })
    }
  }
  return { ...config, home, file, daemonFile: path.join(home, 'daemon.json'), logFile: path.join(home, 'runtime.log') }
}

export const ensureRuntimeConfig = () => loadRuntimeConfig({ create: true })

// Never discover project/global .env files. The caller must select one explicitly.
export function loadRuntimeEnvironment(file = process.env.AGENT_VORCL_ENV_FILE) {
  if (!file) return { loaded: false }
  const source = fs.readFileSync(file, 'utf8')
  for (let line of source.split(/\r?\n/)) {
    line = line.trim()
    if (!line || line.startsWith('#')) continue
    if (line.startsWith('export ')) line = line.slice(7).trim()
    const separator = line.indexOf('='); if (separator < 1) continue
    const key = line.slice(0, separator).trim(); let value = line.slice(separator + 1).trim()
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) continue
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
    else value = value.replace(/(?:^|\s+)#.*$/, '').trim()
    if (process.env[key] == null) process.env[key] = value
  }
  return { loaded: true, file }
}
