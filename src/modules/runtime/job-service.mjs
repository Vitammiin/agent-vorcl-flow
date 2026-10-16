import { JobSchema } from './schemas.mjs'
import { createId, isoNow } from '../../shared/runtime-utils.mjs'

export class JobService {
  constructor(store) {
    this.store = store; this.controllers = new Map(); this.interrupted = new Map()
    const recoveries = this.store.list('jobs').filter((job) => ['queued', 'running', 'waiting_approval'].includes(job.status)).map((job) => {
      const failed = JobSchema.parse({ ...job, status: 'failed', error: 'Interrupted by runtime restart', updatedAt: isoNow() })
      this.interrupted.set(job.jobId, failed)
      return this.store.put('jobs', job.jobId, failed, job.runId, 'run.failed')
    })
    this.ready = Promise.all(recoveries).finally(() => this.interrupted.clear())
  }
  async start(runId, kind, work, sessionId) {
    await this.ready
    const now = isoNow()
    const job = JobSchema.parse({ jobId: createId('job'), runId, kind, status: 'queued', progress: 0, createdAt: now, updatedAt: now })
    await this.store.put('jobs', job.jobId, job, runId, 'job.progress', sessionId)
    const controller = new AbortController(); this.controllers.set(job.jobId, controller)
    queueMicrotask(async () => {
      try {
        if (controller.signal.aborted) throw new Error('Job cancelled before start')
        await this.#update(job.jobId, { status: 'running', progress: 0.01 })
        const result = await work({ signal: controller.signal, progress: (value) => this.#update(job.jobId, { progress: value }) })
        await this.#update(job.jobId, { status: 'succeeded', progress: 1, terminalReceiptId: result?.receiptId })
      } catch (error) {
        await this.#update(job.jobId, { status: controller.signal.aborted ? 'cancelled' : 'failed', error: String(error?.message ?? error) })
      } finally { this.controllers.delete(job.jobId) }
    })
    return job
  }
  get(jobId) { const job = this.interrupted.get(jobId) ?? this.store.get('jobs', jobId); if (!job) throw new Error('Unknown job'); return job }
  list(runId) {
    const jobs = new Map(this.store.list('jobs').map((job) => [job.jobId, job]))
    for (const [jobId, job] of this.interrupted) jobs.set(jobId, job)
    return [...jobs.values()].filter((job) => !runId || job.runId === runId)
  }
  async cancel(jobId) {
    await this.ready
    const job = this.get(jobId)
    if (!['queued', 'running', 'waiting_approval'].includes(job.status)) return job
    this.controllers.get(jobId)?.abort(); return this.#update(jobId, { status: 'cancelled' })
  }
  async #update(jobId, patch) {
    const current = this.get(jobId); const next = JobSchema.parse({ ...current, ...patch, updatedAt: isoNow() })
    await this.store.put('jobs', jobId, next, next.runId, 'job.progress'); return next
  }
}
