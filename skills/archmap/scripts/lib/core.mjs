// archmap lib/core.mjs — общие утилиты всех скриптов пайплайна.
// Zero-dependency: только node:*. Контракт architecture.json v1 — см. skills/archmap/SKILL.md.

import fs from 'node:fs'
import path from 'node:path'

export const SCHEMA_VERSION = 1

export const LAYERS = [
  { id: 'product', label: 'Product', color: '#f87171' },
  { id: 'client', label: 'Client', color: '#38bdf8' },
  { id: 'api', label: 'API', color: '#34d399' },
  { id: 'agents', label: 'Agents', color: '#a78bfa' },
  { id: 'logic', label: 'Logic', color: '#fbbf24' },
  { id: 'data', label: 'Data', color: '#f472b6' },
  { id: 'infra', label: 'Infra', color: '#94a3b8' },
]

export const LAYER_IDS = LAYERS.map((layer) => layer.id)

export const NODE_KINDS = {
  product: ['feature', 'capability'],
  data: ['table', 'enum', 'store'],
  api: ['route', 'ws', 'webhook', 'cron', 'mcp-server', 'mcp-tool', 'middleware'],
  agents: ['agent', 'llm-call', 'memory', 'skill', 'command'],
  logic: ['module', 'package', 'test-suite'],
  infra: ['env', 'external-service', 'tech', 'ci-pipeline', 'container', 'hook'],
  client: ['page', 'component'],
}

export const EDGE_KINDS = [
  'fk', 'import', 'depends', 'handles', 'uses', 'reads-env',
  'invokes', 'member', 'guards', 'dataflow', 'implements', 'covers', 'deploys',
]

export const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'out', '.next', '.nuxt', '.turbo',
  'coverage', '.cache', '.vercel', '.output', 'vendor', '__pycache__',
  '.archmap', '.taskmaster',
])

export const MAX_FILE_BYTES = 1_500_000

export function parseArgs(argv, spec) {
  // spec: { root: {default, flag: '--root'}, ... } — flag-имя выводится из ключа
  const result = {}
  for (const [key, def] of Object.entries(spec)) result[key] = def.default
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index]
    if (value === '--help') { result.help = true; continue }
    const entry = Object.entries(spec).find(([, def]) => def.flag === value)
    if (!entry) throw new Error(`Unknown argument: ${value}`)
    const [key, def] = entry
    if (def.boolean) result[key] = true
    else result[key] = argv[++index]
  }
  return result
}

export function toPosix(value) {
  return value.split(path.sep).join('/')
}

export function rel(root, absolute) {
  return toPosix(path.relative(root, absolute))
}

export function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

export function readJsonc(file, fallback = null) {
  // tsconfig и подобные: комментарии + трейлинг-запятые
  try {
    const raw = fs.readFileSync(file, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/,\s*([}\]])/g, '$1')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n')
}

export function readText(file) {
  try {
    const stat = fs.statSync(file)
    if (stat.size > MAX_FILE_BYTES) return null
    return fs.readFileSync(file, 'utf8')
  } catch {
    return null
  }
}

export function lineOfIndex(text, index) {
  let line = 1
  for (let cursor = 0; cursor < index && cursor < text.length; cursor++) {
    if (text[cursor] === '\n') line++
  }
  return line
}

export function walk(root, options = {}) {
  // Возвращает относительные POSIX-пути файлов; ignore — поверх IGNORED_DIRS.
  // options.nested — сюда складываются пропущенные вложенные репозитории/worktree.
  const extraIgnore = new Set(options.ignore ?? [])
  const nested = options.nested ?? []
  const files = []
  const visited = new Set()
  const queue = [root]
  while (queue.length) {
    const dir = queue.pop()
    let real
    try {
      real = fs.realpathSync(dir)
    } catch {
      continue
    }
    if (visited.has(real)) continue
    visited.add(real)
    let entries
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true })
    } catch {
      continue
    }
    // Вложенный git-репозиторий или worktree (напр. .claude/worktrees/*) — чужое дерево:
    // без этого граф удваивается копиями тех же роутов и таблиц.
    if (dir !== root && entries.some((entry) => entry.name === '.git')) {
      nested.push(rel(root, dir))
      continue
    }
    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.name !== '.claude' && entry.name !== '.mcp.json' && entry.name !== '.env.example') continue
      if (IGNORED_DIRS.has(entry.name) || extraIgnore.has(entry.name)) continue
      const absolute = path.join(dir, entry.name)
      if (entry.isDirectory()) queue.push(absolute)
      else if (entry.isFile() || entry.isSymbolicLink()) files.push(rel(root, absolute))
    }
  }
  return files.sort()
}

export function makeNode({ id, kind, layer, label, source, inferred = false, meta = {} }) {
  return { id, kind, layer, label, source, inferred, meta }
}

export function makeEdge({ kind, from, to, label, source, inferred = false, meta = {} }) {
  const edge = { id: `e:${kind}:${from}->${to}`, kind, from, to, source, inferred, meta }
  if (label) edge.label = label
  return edge
}

export function sortGraph(nodes, edges) {
  // Детерминизм: повторный прогон на неизменённом репо даёт байт-в-байт тот же JSON.
  nodes.sort((a, b) => a.id.localeCompare(b.id))
  edges.sort((a, b) => a.id.localeCompare(b.id))
  return { nodes, edges }
}

export function partFile({ part, root, nodes = [], edges = [], stats = {} }) {
  sortGraph(nodes, edges)
  return { version: SCHEMA_VERSION, part, root: toPosix(root), nodes, edges, stats }
}

export function loadPlan(file) {
  const plan = readJson(file)
  if (!plan || !plan.root) throw new Error(`Invalid plan file: ${file} (run scan.mjs first)`)
  return plan
}

export function findNearestPackageJson(root, relFile) {
  // Для монорепо: ближайший package.json вверх от файла (относительный путь или '').
  let dir = path.posix.dirname(relFile)
  while (true) {
    const candidate = dir === '.' ? 'package.json' : `${dir}/package.json`
    if (fs.existsSync(path.join(root, candidate))) return dir === '.' ? '' : dir
    if (dir === '.' || dir === '/') return ''
    dir = path.posix.dirname(dir)
  }
}

export function fileExistsWithLine(root, source) {
  // Проверка доказательства: file существует и line в диапазоне файла.
  if (!source || typeof source.file !== 'string' || !source.file) return false
  const absolute = path.join(root, source.file)
  let text
  try {
    if (!fs.statSync(absolute).isFile()) return false
    text = fs.readFileSync(absolute, 'utf8')
  } catch {
    return false
  }
  const line = source.line
  if (!Number.isInteger(line) || line < 1) return false
  const total = text.split('\n').length
  return line <= total
}
