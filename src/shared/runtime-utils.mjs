import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export const isoNow = () => new Date().toISOString()
export const createId = (prefix) => `${prefix}_${crypto.randomBytes(16).toString('hex')}`
export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')

const canonicalize = (value) => {
  if (Array.isArray(value)) return value.map((item) => item === undefined ? null : canonicalize(item))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().filter((key) => value[key] !== undefined).map((key) => [key, canonicalize(value[key])]))
  }
  return value
}

export const stableStringify = (value) => JSON.stringify(canonicalize(value))

export function writeJsonAtomic(file, value, mode = 0o600) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`)
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { mode })
  const handle = fs.openSync(temporary, 'r')
  try { fs.fsyncSync(handle) } finally { fs.closeSync(handle) }
  fs.renameSync(temporary, file)
}

export function readJson(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch (error) {
    if (error?.code === 'ENOENT') return fallback
    throw error
  }
}

export function canonicalDirectory(candidate) {
  const resolved = fs.realpathSync(path.resolve(candidate))
  if (!fs.statSync(resolved).isDirectory()) throw new Error(`Workspace is not a directory: ${candidate}`)
  return resolved
}

export function assertPathInside(root, candidate) {
  const canonicalRoot = fs.realpathSync(root)
  const resolved = path.resolve(canonicalRoot, candidate)
  const relative = path.relative(canonicalRoot, resolved)
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Path escapes the bound workspace')
  let existingParent = fs.existsSync(resolved) ? resolved : path.dirname(resolved)
  while (!fs.existsSync(existingParent) && existingParent !== path.dirname(existingParent)) existingParent = path.dirname(existingParent)
  const realParent = fs.realpathSync(existingParent)
  const realRelative = path.relative(canonicalRoot, realParent)
  if (realRelative.startsWith('..') || path.isAbsolute(realRelative)) throw new Error('Symlink escapes the bound workspace')
  return resolved
}

export function redact(value) {
  if (typeof value === 'string') {
    return value
      .replace(/Bearer\s+[A-Za-z0-9._~-]+/gi, 'Bearer [REDACTED]')
      .replace(/\b(sk|api|token|key)-[A-Za-z0-9_-]{12,}\b/gi, '[REDACTED]')
  }
  if (Array.isArray(value)) return value.map(redact)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, /(secret|token|password|api.?key|authorization)/i.test(key) ? '[REDACTED]' : redact(item)]))
  }
  return value
}

export function jsonText(value) {
  return { content: [{ type: 'text', text: JSON.stringify(redact(value), null, 2) }], structuredContent: redact(value) }
}
