import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import { assertPathInside, canonicalDirectory, createId, sha256 } from '../../shared/runtime-utils.mjs'

const MAX_OUTPUT = 1024 * 1024
const DEFAULT_TIMEOUT = 10 * 60 * 1000
const allowedEnvironment = ['PATH', 'LANG', 'LC_ALL', 'TERM', 'TMPDIR', 'TEMP', 'TMP']

export function classifyOperation(operation, payload) {
  if (operation === 'read' || operation === 'search') return 'read'
  if (operation === 'apply_patch') return 'workspace_write'
  const argv = payload?.argv ?? []
  const executable = path.basename(String(argv[0] ?? '')).toLowerCase().replace(/\.exe$/, '')
  const args = argv.slice(1).map((value) => String(value).toLowerCase())
  if (['sh', 'bash', 'zsh', 'fish', 'cmd', 'powershell', 'pwsh', 'env', 'sudo', 'xargs'].includes(executable)) return 'destructive'
  if (['rm', 'rmdir', 'unlink', 'shred'].includes(executable)) return 'destructive'
  if (executable === 'git' && args.some((arg) => ['push'].includes(arg))) return 'publish'
  if (executable === 'git' && args.some((arg) => ['reset', 'clean'].includes(arg)) || executable === 'git' && args.includes('-d')) return 'destructive'
  if (executable === 'git' && args.some((arg) => ['fetch', 'pull', 'clone'].includes(arg))) return 'external'
  if (['npm', 'pnpm', 'yarn'].includes(executable) && args.some((arg) => ['publish'].includes(arg))) return 'publish'
  if (['npm', 'pnpm', 'yarn'].includes(executable) && args.some((arg) => ['install', 'add', 'update', 'upgrade'].includes(arg))) return 'external'
  if (executable === 'gh' && (args.includes('merge') || args.includes('release'))) return 'publish'
  if (['curl', 'wget'].includes(executable)) return 'external'
  return 'workspace_write'
}

export class LocalWorkspaceBackend {
  constructor(workspaceRoot) { this.workspaceRoot = canonicalDirectory(workspaceRoot) }

  async execute(operation, payload, signal) {
    switch (operation) {
      case 'search': return this.search(payload)
      case 'read': return this.read(payload)
      case 'apply_patch': return this.applyPatch(payload)
      case 'exec': return this.exec(payload, signal)
      default: throw new Error(`Unsupported operation: ${operation}`)
    }
  }

  async search({ query, directory = '.', maxResults = 200 }) {
    if (typeof query !== 'string' || !query) throw new Error('query is required')
    const cwd = assertPathInside(this.workspaceRoot, directory)
    return this.exec({ argv: ['rg', '--line-number', '--max-count', String(Math.min(maxResults, 1000)), '--', query, '.'], cwd }, undefined)
  }

  async read({ file, start = 1, end = 400 }) {
    const target = assertPathInside(this.workspaceRoot, file)
    const text = await fs.readFile(target, 'utf8')
    return { file: path.relative(this.workspaceRoot, target), text: text.split(/\r?\n/).slice(Math.max(0, start - 1), Math.min(end, start + 2000)).join('\n') }
  }

  async applyPatch({ file, expectedSha256, content }) {
    const target = assertPathInside(this.workspaceRoot, file)
    let previous = ''
    try { previous = await fs.readFile(target, 'utf8') } catch (error) { if (error?.code !== 'ENOENT') throw error }
    if (expectedSha256 && sha256(previous) !== expectedSha256) throw new Error('File changed since the action was approved')
    await fs.mkdir(path.dirname(target), { recursive: true })
    const temporary = path.join(path.dirname(target), `.${path.basename(target)}.${createId('tmp')}`)
    await fs.writeFile(temporary, String(content), { mode: 0o600 })
    await fs.rename(temporary, target)
    return { changedPaths: [path.relative(this.workspaceRoot, target)], bytes: Buffer.byteLength(String(content)) }
  }

  async exec({ argv, cwd = '.', timeoutMs = DEFAULT_TIMEOUT, env = {} }, signal) {
    if (!Array.isArray(argv) || !argv.length || argv.some((item) => typeof item !== 'string' || item.includes('\0'))) throw new Error('argv must be a non-empty string array')
    const resolvedCwd = path.isAbsolute(cwd) ? assertPathInside(this.workspaceRoot, path.relative(this.workspaceRoot, cwd)) : assertPathInside(this.workspaceRoot, cwd)
    const childEnv = Object.fromEntries(allowedEnvironment.filter((key) => process.env[key] != null).map((key) => [key, process.env[key]]))
    for (const [key, value] of Object.entries(env)) {
      if (!allowedEnvironment.includes(key)) throw new Error(`Environment variable is not allowlisted: ${key}`)
      childEnv[key] = String(value)
    }
    return new Promise((resolve, reject) => {
      const child = spawn(argv[0], argv.slice(1), { cwd: resolvedCwd, env: childEnv, shell: false, stdio: ['ignore', 'pipe', 'pipe'] })
      let stdout = '', stderr = '', truncated = false
      const append = (current, chunk) => { const next = current + chunk; if (Buffer.byteLength(next) <= MAX_OUTPUT) return next; truncated = true; return next.slice(0, MAX_OUTPUT) }
      child.stdout.on('data', (chunk) => { stdout = append(stdout, chunk.toString()) })
      child.stderr.on('data', (chunk) => { stderr = append(stderr, chunk.toString()) })
      let timedOut = false
      const timer = setTimeout(() => { timedOut = true; child.kill('SIGTERM') }, Math.min(timeoutMs, DEFAULT_TIMEOUT))
      const abort = () => child.kill('SIGTERM'); signal?.addEventListener('abort', abort, { once: true })
      child.on('error', reject)
      child.on('close', (code, killedBy) => {
        clearTimeout(timer); signal?.removeEventListener('abort', abort)
        resolve({ argv, cwd: path.relative(this.workspaceRoot, resolvedCwd) || '.', exitCode: code, signal: killedBy, timedOut, stdout, stderr, truncated })
      })
    })
  }
}
