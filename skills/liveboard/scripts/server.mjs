#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SKILL_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DASHBOARD_FILE = path.join(SKILL_ROOT, 'assets', 'dashboard.html')
const ROLE_NAMES = [
  'architect', 'backend', 'frontend', 'analyzer', 'swagger', 'firecrawl',
  'render', 'database', 'resilience', 'screenshot', 'visual-research',
  'pinpoint', 'drawio', 'mermaid', 'archmap', 'testing', 'gitflow', 'security',
  'docs', 'devops', 'liveboard',
]

function parseArgs(argv) {
  const result = { root: process.cwd(), host: '127.0.0.1', port: 0, interval: 300_000 }
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index]
    if (value === '--root') result.root = argv[++index]
    else if (value === '--host') result.host = argv[++index]
    else if (value === '--port') result.port = Number(argv[++index])
    else if (value === '--interval') result.interval = Number(argv[++index])
    else if (value === '--help') result.help = true
    else throw new Error(`Unknown argument: ${value}`)
  }
  result.root = path.resolve(result.root)
  if (!Number.isInteger(result.port) || result.port < 0 || result.port > 65535) throw new Error('Invalid --port')
  if (!Number.isFinite(result.interval) || result.interval < 1_000) throw new Error('--interval must be at least 1000 ms')
  return result
}

function command(command, args, options = {}) {
  try {
    return execFileSync(command, args, {
      encoding: 'utf8',
      timeout: options.timeout ?? 2_000,
      stdio: ['ignore', 'pipe', 'ignore'],
      ...options,
    }).trim()
  } catch {
    return ''
  }
}

function gitWorktrees(root) {
  const raw = command('git', ['-C', root, 'worktree', 'list', '--porcelain'])
  if (!raw) return [{ path: root, branch: null, head: null, bare: false, locked: false }]
  return raw.split(/\n\n+/).map((block) => {
    const item = { path: '', branch: null, head: null, bare: false, locked: false }
    for (const line of block.split('\n')) {
      const [key, ...rest] = line.split(' ')
      const value = rest.join(' ')
      if (key === 'worktree') item.path = value
      else if (key === 'branch') item.branch = value.replace('refs/heads/', '')
      else if (key === 'HEAD') item.head = value.slice(0, 8)
      else if (key === 'bare') item.bare = true
      else if (key === 'locked') item.locked = true
      else if (key === 'detached') item.branch = '__detached__'
    }
    return item
  }).filter((item) => item.path)
}

function taskFileFor(worktree) {
  const candidates = [
    path.join(worktree, '.taskmaster', 'tasks', 'tasks.json'),
    path.join(worktree, 'tasks', 'tasks.json'),
  ]
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null
}

function readTasks(file) {
  if (!file) return { tasks: [], error: null, tag: null, meta: null }
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
    const tag = parsed.master ? 'master' : Object.keys(parsed)[0]
    const tasks = parsed[tag]?.tasks ?? parsed.tasks ?? []
    const meta = parsed[tag]?.metadata ?? parsed.metadata ?? null
    return { tasks: Array.isArray(tasks) ? tasks : [], error: null, tag, meta }
  } catch (error) {
    return { tasks: [], error: error.message, tag: null, meta: null }
  }
}

function resolveAssignedAgent(task) {
  const explicit = task.assignee ?? task.owner
  if (explicit) return { role: String(explicit), source: 'explicit' }
  const inferred = inferRole(`${task.title ?? ''} ${task.details ?? ''}`)
  return inferred ? { role: inferred, source: 'inferred' } : null
}

function flattenTasks(tasks) {
  const view = (task, id, parentId) => {
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : []
    return {
      id,
      parentId,
      title: task.title ?? null,
      status: task.status ?? 'unknown',
      priority: task.priority ?? null,
      assignee: task.assignee ?? null,
      owner: task.owner ?? null,
      assignedAgent: resolveAssignedAgent(task),
      description: task.description ?? null,
      details: task.details ?? null,
      testStrategy: task.testStrategy ?? null,
      dependencies: Array.isArray(task.dependencies) ? task.dependencies.map(String) : [],
      updatedAt: task.updatedAt ?? null,
      subtaskTotal: subtasks.length,
      subtaskDone: subtasks.filter((subtask) => subtask.status === 'done').length,
      agentLive: false,
    }
  }
  return tasks.flatMap((task) => [
    view(task, String(task.id), null),
    ...(Array.isArray(task.subtasks) ? task.subtasks.map((subtask) =>
      view(subtask, `${task.id}.${subtask.id}`, String(task.id))) : []),
  ])
}

function processCwds(pids) {
  const result = new Map()
  if (process.platform === 'linux') {
    for (const pid of pids) {
      try { result.set(String(pid), fs.readlinkSync(`/proc/${pid}/cwd`)) } catch { /* процесс умер или нет прав — пропускаем pid */ }
    }
  } else if (process.platform === 'darwin' && pids.length) {
    const output = command('lsof', ['-a', '-d', 'cwd', '-p', pids.join(','), '-Fpn'], { timeout: 2_000 })
    let pid = null
    for (const line of output.split('\n')) {
      if (line.startsWith('p')) pid = line.slice(1)
      else if (pid && line.startsWith('n')) result.set(pid, line.slice(1))
    }
  }
  return result
}

function inferRole(text) {
  const normalized = text.toLowerCase()
  const profile = normalized.match(/--profile(?:=|\s+)([a-z0-9-]+)/)?.[1]
  if (profile && ROLE_NAMES.includes(profile)) return profile
  return ROLE_NAMES.find((role) => normalized.includes(role)) ?? null
}

function liveProcesses(worktrees) {
  if (process.platform === 'win32') return []
  const raw = command('ps', ['-axo', 'pid=,etime=,command='], { timeout: 3_000 })
  if (!raw) return []
  const candidates = raw.split('\n').map((line) => line.trim()).filter(Boolean).map((line) => {
    const match = line.match(/^(\d+)\s+(\S+)\s+(.+)$/)
    if (!match) return null
    const [, pid, elapsed, processCommand] = match
    if (Number(pid) === process.pid
      || /(?:--type=|helper|crashpad)/i.test(processCommand)
      || !/(?:^|[\s/])(claude|codex|cursor)(?:\.app)?(?:[\s/]|$)/i.test(processCommand)) return null
    return { pid, elapsed, processCommand }
  }).filter(Boolean)
  const cwds = processCwds(candidates.map((candidate) => candidate.pid))
  const agents = candidates.map(({ pid, elapsed, processCommand }) => {
    const cwd = cwds.get(pid) ?? null
    const worktree = cwd
      ? worktrees.find((item) => cwd === item.path || cwd.startsWith(`${item.path}${path.sep}`))
      : null
    return {
      id: `process-${pid}`,
      pid: Number(pid),
      product: processCommand.match(/(?:^|[\s/])(claude|codex|cursor)(?:\.app)?(?:[\s/]|$)/i)?.[1]?.toLowerCase() ?? 'agent',
      role: inferRole(processCommand),
      elapsed,
      cwd,
      worktree: worktree?.path ?? null,
      source: 'process',
    }
  }).filter((agent) => agent.worktree)
  const unique = new Map()
  for (const agent of agents) {
    const key = [agent.product, agent.role, agent.worktree, agent.cwd].join(':')
    const previous = unique.get(key)
    if (previous) previous.processCount += 1
    else unique.set(key, { ...agent, processCount: 1 })
  }
  return [...unique.values()]
}

function inferredTaskAgents(worktrees) {
  return worktrees.flatMap((worktree) => worktree.tasks
    .filter((task) => task.status === 'in-progress')
    .map((task) => ({
      id: `task-${worktree.path}-${task.id}`,
      pid: null,
      product: 'task-master',
      role: task.assignee ?? task.owner ?? inferRole(task.title ?? ''),
      elapsed: null,
      cwd: worktree.path,
      worktree: worktree.path,
      taskId: task.id,
      taskTitle: task.title,
      source: 'task',
    })))
}

function statusCounts(tasks) {
  return tasks.reduce((counts, task) => {
    const status = task.status ?? 'unknown'
    counts[status] = (counts[status] ?? 0) + 1
    return counts
  }, {})
}

function collect(root) {
  const worktrees = gitWorktrees(root).map((worktree) => {
    const file = taskFileFor(worktree.path)
    const data = readTasks(file)
    const tasks = flattenTasks(data.tasks)
    return {
      ...worktree,
      taskFile: file,
      taskTag: data.tag,
      taskError: data.error,
      taskMeta: data.meta,
      tasks,
      counts: statusCounts(tasks),
    }
  })
  const processAgents = liveProcesses(worktrees)
  const taskAgents = inferredTaskAgents(worktrees)
  const processTaskKeys = new Set(processAgents.map((agent) => `${agent.worktree}:${agent.role}`))
  const agents = [...processAgents, ...taskAgents.filter((agent) => !processTaskKeys.has(`${agent.worktree}:${agent.role}`))]

  // Связать живой процесс-агент с задачей и подсветить задачи, над которыми идёт реальная работа.
  const liveRoles = new Set(processAgents.map((agent) => `${agent.worktree}::${agent.role}`))
  for (const worktree of worktrees) {
    for (const task of worktree.tasks) {
      task.agentLive = task.assignedAgent ? liveRoles.has(`${worktree.path}::${task.assignedAgent.role}`) : false
    }
  }
  for (const agent of processAgents) {
    if (agent.taskId) continue
    const worktree = worktrees.find((item) => item.path === agent.worktree)
    const match = worktree?.tasks.find((task) => task.status === 'in-progress' && task.assignedAgent?.role === agent.role)
      ?? worktree?.tasks.find((task) => task.status === 'in-progress')
    if (match) { agent.taskId = match.id; agent.taskTitle = match.title }
  }

  const tasks = worktrees.flatMap((worktree) => worktree.tasks)
  return {
    generatedAt: new Date().toISOString(),
    root,
    refreshIntervalMs: config.interval,
    summary: {
      worktrees: worktrees.length,
      agents: agents.length,
      tasks: tasks.length,
      inProgress: tasks.filter((task) => task.status === 'in-progress').length,
      pending: tasks.filter((task) => task.status === 'pending').length,
      done: tasks.filter((task) => task.status === 'done').length,
    },
    worktrees,
    agents,
  }
}

function json(response, status, value) {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  })
  response.end(JSON.stringify(value))
}

const config = parseArgs(process.argv.slice(2))
if (config.help) {
  console.log('Usage: node server.mjs [--root PATH] [--host 127.0.0.1] [--port 0] [--interval 300000]')
  process.exit(0)
}
if (!fs.existsSync(config.root)) throw new Error(`Root does not exist: ${config.root}`)

const html = fs.readFileSync(DASHBOARD_FILE)
let snapshot = collect(config.root)
const clients = new Set()
let watchers = []

function broadcast() {
  const payload = `event: snapshot\ndata: ${JSON.stringify(snapshot)}\n\n`
  for (const client of clients) client.write(payload)
}

function refresh() {
  snapshot = collect(config.root)
  broadcast()
  installWatchers()
}

function installWatchers() {
  for (const watcher of watchers) watcher.close()
  watchers = []
  const files = snapshot.worktrees.map((worktree) => worktree.taskFile).filter(Boolean)
  for (const file of new Set(files)) {
    try {
      let timer
      const watcher = fs.watch(file, () => {
        clearTimeout(timer)
        timer = setTimeout(refresh, 150)
      })
      watchers.push(watcher)
    } catch { /* каталог не наблюдаем (нет прав/удалён) — табло живёт на polling */ }
  }
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost')
  if (request.method === 'GET' && url.pathname === '/') {
    response.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'content-security-policy': "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'",
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'no-referrer',
    })
    response.end(html)
  } else if (request.method === 'GET' && url.pathname === '/api/snapshot') {
    json(response, 200, snapshot)
  } else if (request.method === 'POST' && url.pathname === '/api/refresh') {
    refresh()
    json(response, 200, { ok: true, generatedAt: snapshot.generatedAt })
  } else if (request.method === 'GET' && url.pathname === '/api/events') {
    response.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-store',
      connection: 'keep-alive',
    })
    response.write(`event: snapshot\ndata: ${JSON.stringify(snapshot)}\n\n`)
    clients.add(response)
    request.on('close', () => clients.delete(response))
  } else if (request.method === 'GET' && url.pathname === '/health') {
    json(response, 200, { ok: true, generatedAt: snapshot.generatedAt })
  } else {
    json(response, 404, { error: 'Not found' })
  }
})

installWatchers()
const reconcileTimer = setInterval(refresh, config.interval)
const heartbeatTimer = setInterval(() => {
  for (const client of clients) client.write(': heartbeat\n\n')
}, 15_000)

function shutdown() {
  clearInterval(reconcileTimer)
  clearInterval(heartbeatTimer)
  for (const watcher of watchers) watcher.close()
  for (const client of clients) client.end()
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(0), 1_000).unref()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

server.listen(config.port, config.host, () => {
  const address = server.address()
  const port = typeof address === 'object' && address ? address.port : config.port
  console.log(JSON.stringify({
    event: 'liveboard-ready',
    url: `http://${config.host}:${port}`,
    root: config.root,
    refreshIntervalMs: config.interval,
    storage: 'memory-only',
  }))
})
