#!/usr/bin/env node
// Legacy, manually invoked helper. The installer never registers this launcher.
// No automatic project/global .env discovery, provider aliases, or package installs.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const usage = 'Usage: node mcp-env.mjs [--need=KEY,KEY] [--avf-env-file=/absolute/path] -- command [args...]'
const argv = process.argv.slice(2)
if (argv.length === 0 || argv[0] === '--help') { console.log(usage); process.exit(0) }

try {
  const separator = argv.indexOf('--')
  if (separator < 0 || !argv[separator + 1]) throw new Error(usage)
  const options = argv.slice(0, separator)
  let need = [], envFile
  for (const option of options) {
    if (option.startsWith('--need=')) need = option.slice(7).split(',').filter(Boolean)
    else if (option.startsWith('--avf-env-file=')) envFile = option.slice('--avf-env-file='.length)
    else throw new Error(`Unknown option: ${option}`)
  }
  if (need.some((name) => !/^[A-Za-z_][A-Za-z0-9_]*$/.test(name))) throw new Error('Invalid environment variable name')
  if (envFile && !path.isAbsolute(envFile)) throw new Error('--avf-env-file must be an absolute path')
  if (envFile && !need.length) throw new Error('--avf-env-file requires --need to select the variables to pass')
  const env = { ...process.env }
  if (envFile) {
    for (const source of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
      const line = source.trim().replace(/^export\s+/, '')
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
      if (!match || !need.includes(match[1]) || env[match[1]] != null) continue
      let value = match[2].trim()
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1)
      else value = value.replace(/(?:^|\s+)#.*$/, '').trim()
      env[match[1]] = value
    }
  }
  const missing = need.filter((key) => !env[key])
  if (missing.length) throw new Error(`Required environment variables missing: ${missing.join(', ')}`)
  const [command, ...args] = argv.slice(separator + 1)
  const expanded = args.map((arg) => arg.replace(/%%([A-Z0-9_]+)(?::-([^%]*))?%%/g, (_, key, fallback) => env[key] || fallback || ''))
  const child = spawn(command, expanded, { stdio: 'inherit', env, shell: false })
  for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => child.kill(signal))
  child.on('error', () => { console.error('[agent-vorcl-flow] Unable to start the selected command'); process.exitCode = 1 })
  child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) })
} catch (error) { console.error(`[agent-vorcl-flow] ${error.message}`); process.exitCode = 2 }
