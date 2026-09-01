import fs from 'node:fs'
import path from 'node:path'
import { RuntimeEventSchema } from './schemas.mjs'
import { createId, isoNow, readJson, redact, writeJsonAtomic } from '../../shared/runtime-utils.mjs'

export class EventStore {
  #root
  #eventsFile
  #snapshotFile
  #state
  #writeChain = Promise.resolve()

  constructor(workspaceRoot) {
    this.#root = path.join(workspaceRoot, '.taskmaster', 'avf-runtime')
    this.#eventsFile = path.join(this.#root, 'events.jsonl')
    this.#snapshotFile = path.join(this.#root, 'snapshot.json')
    fs.mkdirSync(this.#root, { recursive: true })
    this.#state = readJson(this.#snapshotFile, { version: 1, sequence: 0, runs: {}, claims: {}, actions: {}, jobs: {}, receipts: {} })
    this.#replay()
  }

  get root() { return this.#root }
  snapshot() { return structuredClone(this.#state) }
  get(kind, id) { return structuredClone(this.#state[kind]?.[id] ?? null) }
  list(kind) { return Object.values(this.#state[kind] ?? {}).map((value) => structuredClone(value)) }

  async record(type, runId, data = {}, sessionId) {
    const operation = async () => {
      const event = RuntimeEventSchema.parse({
        eventId: createId('evt'), sequence: this.#state.sequence + 1, type, runId, sessionId, timestamp: isoNow(), data: redact(data),
      })
      fs.appendFileSync(this.#eventsFile, `${JSON.stringify(event)}\n`, { mode: 0o600 })
      this.#apply(event)
      if (event.sequence % 25 === 0 || /completed|failed|cancelled/.test(type)) writeJsonAtomic(this.#snapshotFile, this.#state)
      return structuredClone(event)
    }
    this.#writeChain = this.#writeChain.then(operation, operation)
    return this.#writeChain
  }

  async put(kind, id, value, runId, eventType = 'tool.completed', sessionId) {
    return this.record(eventType, runId, { mutation: { kind, id, value: redact(value) } }, sessionId)
  }

  events(runId, afterSequence = 0) {
    if (!fs.existsSync(this.#eventsFile)) return []
    return this.#readEvents(false).filter((event) => event.runId === runId && event.sequence > afterSequence)
  }

  flush() { writeJsonAtomic(this.#snapshotFile, this.#state) }

  #replay() {
    if (!fs.existsSync(this.#eventsFile)) return
    for (const event of this.#readEvents(true)) {
      if (event.sequence > this.#state.sequence) this.#apply(event)
    }
  }

  #readEvents(repairTrailingFragment) {
    const source = fs.readFileSync(this.#eventsFile, 'utf8')
    const lines = source.split('\n'); const events = []
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index]
      if (!line) continue
      try { events.push(RuntimeEventSchema.parse(JSON.parse(line))) }
      catch (error) {
        const trailingFragment = index === lines.length - 1 && !source.endsWith('\n')
        if (!trailingFragment) throw new Error(`Corrupt runtime event log at line ${index + 1}`, { cause: error })
        if (repairTrailingFragment) {
          const lastNewline = source.lastIndexOf('\n')
          fs.truncateSync(this.#eventsFile, lastNewline < 0 ? 0 : Buffer.byteLength(source.slice(0, lastNewline + 1)))
        }
      }
    }
    return events
  }

  #apply(event) {
    const mutation = event.data?.mutation
    if (mutation && this.#state[mutation.kind]) this.#state[mutation.kind][mutation.id] = mutation.value
    this.#state.sequence = Math.max(this.#state.sequence, event.sequence)
  }
}
