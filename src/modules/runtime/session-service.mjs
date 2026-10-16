import path from 'node:path'
import { canonicalDirectory, createId, isoNow, sha256 } from '../../shared/runtime-utils.mjs'

export class SessionService {
  #sessions = new Map()
  constructor({ ttlMs = 60 * 60 * 1000, maxSessions = 32, allowedRoots = [] } = {}) {
    this.ttlMs = ttlMs
    this.maxSessions = maxSessions
    this.allowedRoots = allowedRoots.map(canonicalDirectory)
  }

  bind(sessionId, workspace, clientName) {
    this.prune()
    const root = canonicalDirectory(workspace)
    if (this.allowedRoots.length && !this.allowedRoots.some((allowed) => { const relative = path.relative(allowed, root); return !relative || (!relative.startsWith('..') && !path.isAbsolute(relative)) })) throw new Error('Workspace is outside AVF_ALLOWED_ROOTS')
    const current = this.#sessions.get(sessionId)
    if (current?.activeMutation) throw new Error('Cannot rebind while a mutation is active')
    if (!current && this.#sessions.size >= this.maxSessions) throw new Error('Session capacity reached')
    const now = Date.now()
    const session = { sessionId, workspaceRoot: root, workspaceId: sha256(root).slice(0, 24), clientName, boundAt: isoNow(), touchedAt: now, expiresAt: new Date(now + this.ttlMs).toISOString(), activeMutation: false }
    this.#sessions.set(sessionId, session)
    return structuredClone(session)
  }

  require(sessionId) {
    this.prune()
    const session = this.#sessions.get(sessionId)
    if (!session) throw new Error('Bind a workspace with avf_bind_workspace first')
    session.touchedAt = Date.now()
    session.expiresAt = new Date(session.touchedAt + this.ttlMs).toISOString()
    return session
  }

  markMutation(sessionId, active) { this.require(sessionId).activeMutation = active }
  remove(sessionId) { this.#sessions.delete(sessionId) }
  prune() {
    const expiredBefore = Date.now() - this.ttlMs
    for (const [id, session] of this.#sessions) if (session.touchedAt < expiredBefore && !session.activeMutation) this.#sessions.delete(id)
  }
  createTransportSessionId() { return createId('mcp') }
}
