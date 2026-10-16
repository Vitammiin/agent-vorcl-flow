import { ActionRequestSchema } from './schemas.mjs'
import { createId, isoNow, sha256, stableStringify } from '../../shared/runtime-utils.mjs'

const approvalRequired = new Set(['workspace_write', 'destructive', 'external', 'publish', 'costly'])

export class PermissionService {
  #mutationChain = Promise.resolve()
  constructor(store) { this.store = store }
  async request({ runId, sessionId, actionClass, operation, description, targets, reversible, payload }) {
    const digest = sha256(stableStringify({ runId, sessionId, actionClass, operation, description, targets, reversible, payload }))
    const status = approvalRequired.has(actionClass) ? 'pending' : 'approved'
    const action = ActionRequestSchema.parse({ actionId: createId('act'), runId, sessionId, actionClass, operation, description, targets, digest, reversible, status, expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() })
    await this.store.put('actions', action.actionId, action, runId, status === 'pending' ? 'approval.required' : 'tool.requested', sessionId)
    return action
  }
  async decide(actionId, digest, approve, sessionId) {
    return this.#mutate(async () => {
      const action = this.require(actionId, digest, sessionId)
      if (action.status !== 'pending') throw new Error(`Action is ${action.status}`)
      const updated = { ...action, status: approve ? 'approved' : 'rejected', decidedAt: isoNow() }
      await this.store.put('actions', actionId, updated, action.runId, 'tool.completed', action.sessionId)
      return updated
    })
  }
  require(actionId, digest, sessionId) {
    const action = this.store.get('actions', actionId)
    if (!action || action.digest !== digest) throw new Error('Action approval does not match the request digest')
    if (sessionId && action.sessionId !== sessionId) throw new Error('Action approval belongs to another session')
    if (Date.parse(action.expiresAt) <= Date.now()) throw new Error('Action approval expired')
    return action
  }
  requireExecution(actionId, digest, sessionId, operation, payload) {
    const action = this.require(actionId, digest, sessionId)
    if (action.operation !== operation) throw new Error('Approved operation does not match execution')
    const expected = sha256(stableStringify({ runId: action.runId, sessionId: action.sessionId, actionClass: action.actionClass, operation, description: action.description, targets: action.targets, reversible: action.reversible, payload }))
    if (expected !== digest) throw new Error('Execution payload does not match the approved request digest')
    return action
  }
  async consume(actionId, digest, sessionId, operation, payload) {
    return this.#mutate(async () => {
      const action = this.requireExecution(actionId, digest, sessionId, operation, payload)
      if (action.status !== 'approved') throw new Error(`Action is not approved: ${action.status}`)
      const consumed = { ...action, status: 'consumed', consumedAt: isoNow() }
      await this.store.put('actions', actionId, consumed, action.runId, 'tool.requested', action.sessionId)
      return consumed
    })
  }
  #mutate(operation) {
    const result = this.#mutationChain.then(operation, operation)
    this.#mutationChain = result.then(() => undefined, () => undefined)
    return result
  }
}
