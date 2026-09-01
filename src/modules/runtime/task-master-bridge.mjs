import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export class TaskMasterBridge {
  constructor(workspaceRoot, { command = process.env.AVF_TASK_MASTER_COMMAND || 'npx' } = {}) {
    this.workspaceRoot = workspaceRoot
    this.command = command
    this.file = path.join(workspaceRoot, '.taskmaster', 'tasks', 'tasks.json')
  }
  available() { return fs.existsSync(this.file) }
  getTask(taskId) {
    if (!this.available()) return null
    const data = JSON.parse(fs.readFileSync(this.file, 'utf8'))
    for (const tag of Object.values(data)) {
      const task = tag?.tasks?.find((candidate) => String(candidate.id) === String(taskId))
      if (task) return structuredClone(task)
    }
    return null
  }
  async setDone(taskId) {
    if (!this.available()) return { skipped: true, reason: 'Task Master is not initialized in this workspace' }
    const args = this.command === 'npx'
      ? ['-y', 'task-master-ai', 'set-status', `--id=${taskId}`, '--status=done', `--project-root=${this.workspaceRoot}`]
      : ['set-status', `--id=${taskId}`, '--status=done', `--project-root=${this.workspaceRoot}`]
    return new Promise((resolve, reject) => {
      const child = spawn(this.command, args, { cwd: this.workspaceRoot, shell: false, stdio: ['ignore', 'pipe', 'pipe'], env: { PATH: process.env.PATH ?? '' } })
      let stdout = '', stderr = ''
      child.stdout.on('data', (chunk) => { stdout += chunk })
      child.stderr.on('data', (chunk) => { stderr += chunk })
      child.on('error', reject)
      child.on('close', (code) => code === 0 ? resolve({ skipped: false, stdout }) : reject(new Error(`Task Master set-status failed (${code}): ${stderr.slice(0, 1000)}`)))
    })
  }
}
