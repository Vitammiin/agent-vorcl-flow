#!/usr/bin/env node
// archmap extract-agents.mjs — фаза 1: определения агентов (frontmatter *.md),
// ЧЕМ агент пользуется (MCP-серверы, внешние системы, другие агенты), LLM-вызовы
// в коде и память — всё только с доказательством source:{file,line}.
// Использование: node extract-agents.mjs --root <target> --plan <plan.json> --out <agents.part.json>
// Нет claude-agents и ai-sdk в plan.stacks.detected → пустой part + exit 0.

import fs from 'node:fs'
import path from 'node:path'
import {
  parseArgs, readText, readJson, lineOfIndex, makeNode, makeEdge, partFile, writeJson, loadPlan,
} from './lib/core.mjs'
import { RE, matchAll } from './lib/ts.mjs'
import {
  serviceForDep, serviceForEnv, serviceForMcp, mcpHaystack, serviceMentions,
} from './lib/services.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  plan: { flag: '--plan', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.plan || !args.out) {
  console.log('Usage: node extract-agents.mjs --root <target> --plan <plan.json> --out <agents.part.json>')
  process.exit(args.help ? 0 : 1)
}
const root = path.resolve(args.root)
const plan = loadPlan(args.plan)
const detected = plan.stacks?.detected ?? []

if (!detected.includes('claude-agents') && !detected.includes('ai-sdk')) {
  writeJson(args.out, partFile({ part: 'agents', root, stats: { skipped: true } }))
  console.log(`archmap extract-agents: стек не задетектирован (нет claude-agents/ai-sdk) → пустой part → ${args.out}`)
  process.exit(0)
}

const nodes = new Map()
const edges = new Map()
const addNode = (node) => { if (!nodes.has(node.id)) nodes.set(node.id, node) }
const addEdge = (edge) => { if (!edges.has(edge.id)) edges.set(edge.id, edge) }

// ── YAML-frontmatter: примитивный построчный парсер (name, description, model, tools, skills)
function parseList(value) {
  const inner = value.startsWith('[') && value.endsWith(']') ? value.slice(1, -1) : value
  return inner.split(',').map((item) => item.trim()).filter(Boolean)
}

function parseFrontmatter(text) {
  const lines = text.split('\n')
  if (lines[0]?.trim() !== '---') return null
  let end = -1
  for (let index = 1; index < lines.length; index++) {
    if (lines[index].trim() === '---') { end = index; break }
  }
  if (end === -1) return null
  const data = { lines: {} }
  let listKey = null
  for (let index = 1; index < end; index++) {
    const line = lines[index]
    const listItem = line.match(/^\s+-\s+(.+)$/)
    if (listKey && listItem) { data[listKey].push(listItem[1].trim()); continue }
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!kv) { listKey = null; continue }
    const [, key, rawValue] = kv
    const value = rawValue.trim()
    data.lines[key] = index + 1
    if (key === 'tools' || key === 'skills') {
      if (value) { data[key] = parseList(value); listKey = null } else { data[key] = []; listKey = key }
      continue
    }
    listKey = null
    if (!value || /^[>|][+-]?$/.test(value)) {
      const next = lines[index + 1]
      data[key] = next && /^\s+\S/.test(next) && end > index + 1 ? next.trim() : ''
    } else {
      data[key] = value
    }
  }
  return data
}

// Команды агента (commands/<name>/*.md) — тот же голос агента, что и его карточка:
// именно там чаще всего названы MCP-серверы и системы, с которыми он работает.
function commandDocs (agentFile, name) {
  const base = path.posix.dirname(path.posix.dirname(agentFile))
  const dir = path.posix.join(base === '.' ? '' : base, 'commands', name)
  let entries
  try {
    entries = fs.readdirSync(path.join(root, dir))
  } catch {
    return []
  }
  const docs = []
  for (const entry of entries.filter((item) => item.endsWith('.md')).sort()) {
    const file = `${dir}/${entry}`
    const text = readText(path.join(root, file))
    if (text) docs.push({ file, text })
  }
  return docs
}

// ── 1. Определения агентов из plan.files.agentsMd (+ их команды) ─────────────
const agentTexts = []
for (const file of plan.files?.agentsMd ?? []) {
  const text = readText(path.join(root, file))
  if (!text) continue
  const fm = parseFrontmatter(text)
  if (!fm?.name) continue
  const id = `agent:${fm.name}`
  agentTexts.push({ id, name: fm.name, file, text, docs: [{ file, text }, ...commandDocs(file, fm.name)] })
  const meta = { tools: fm.tools ?? [], skills: fm.skills ?? [], file }
  if (fm.model) meta.model = fm.model
  if (fm.description) meta.description = fm.description.split('\n')[0].slice(0, 200)
  addNode(makeNode({
    id, kind: 'agent', layer: 'agents', label: fm.name,
    source: { file, line: fm.lines.name ?? 1 }, meta,
  }))
}

// ── 2. Чем пользуется агент: MCP-серверы, внешние системы, другие агенты ─────
// Узлы mcp:* и svc:* создают extract-api и extract-env — здесь только рёбра, и
// только на реально существующие в репозитории имена (список MCP из .mcp.json,
// список систем — то, что подтверждено .mcp.json / package.json / .env.example).
const mcpNames = new Set()
const knownServices = new Set()
const noteKnown = (service) => { if (service) knownServices.add(service.slug) }
for (const file of plan.files?.mcpJson ?? []) {
  const json = readJson(path.join(root, file))
  for (const [name, config] of Object.entries(json?.mcpServers ?? {})) {
    mcpNames.add(name)
    noteKnown(serviceForMcp(name, mcpHaystack(config)))
  }
}
for (const file of plan.files?.packageJson ?? []) {
  const pkg = readJson(path.join(root, file))
  for (const section of ['dependencies', 'devDependencies']) {
    for (const dep of Object.keys(pkg?.[section] ?? {})) noteKnown(serviceForDep(dep))
  }
}
for (const file of plan.files?.envFiles ?? []) {
  for (const line of (readText(path.join(root, file)) ?? '').split('\n')) {
    const match = line.match(/^([A-Z][A-Z0-9_]*)\s*=/)
    if (match) noteKnown(serviceForEnv(match[1]))
  }
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
// Кириллица для \b — не словесный символ, поэтому границы слов здесь не ставим.
// Строгая форма: слово ПРЯМО перед именем («— агент `render`», «делегируй субагенту
// `render`») значит, что речь о суб-агенте, а не об одноимённом MCP-сервере/системе.
const DELEGATION_BEFORE = /(?:делегир|су[бп]-?агент|агент)\S*[\s—–:>*«"'|]*$/i
const isDelegation = (text, index) => DELEGATION_BEFORE.test(text.slice(Math.max(0, index - 60), index))
// Мягкая форма: делегирование где-то рядом — этого достаточно, чтобы засчитать
// ребро invokes между агентами («делегирует фиксы backend/frontend/gitflow»).
const DELEGATION_NEAR = /делегир|су[бп]-?агент|агенту|агентам|передай|handoff|delegat/i
const nearDelegation = (text, index) => DELEGATION_NEAR.test(text.slice(Math.max(0, index - 140), index))
// «Опирайся на навыки `ci-cd`, `nodejs`, `render`» — перечисление скиллов в том же
// предложении: имя в бэктиках здесь про скилл, а не про одноимённый MCP-сервер.
const SKILL_LIST_BEFORE = /(?:навык|скилл|skill)[^.\n]{0,160}$/i
const inSkillList = (text, index) => SKILL_LIST_BEFORE.test(text.slice(Math.max(0, index - 200), index))

// Имена MCP-серверов короткие (`redis`, `docker`, `render`) и легко ловят случайные
// совпадения в прозе, поэтому засчитываем только явные формы: идентификатор инструмента
// mcp__<имя>__, «MCP <имя>» / «<имя> MCP», имя в бэктиках. Порядок паттернов = сила
// доказательства: source ребра берётся от самой сильной сработавшей формы, а не от
// первой попавшейся строки файла.
function mcpMentions (text, name) {
  const escaped = escapeRegExp(name)
  const patterns = [
    new RegExp('\\bmcp__[a-z0-9_-]*' + escaped.replace(/-/g, '[-_]') + '[a-z0-9_-]*__', 'gi'),
    new RegExp('\\bMCP[\\s-]*(?:сервер\\S*\\s*)?[«"\'`*]*' + escaped + '(?![\\w-])', 'gi'),
    new RegExp('(?<![\\w-])' + escaped + '[«"\'`*]*\\s+MCP\\b', 'gi'),
    new RegExp('`' + escaped + '`', 'g'),
  ]
  // Составное имя (`task-master`) само по себе достаточно специфично, чтобы засчитать
  // его и без бэктиков — «Task Master», «task-master init». Односложные имена так
  // ловить нельзя: «render»/«docker» в прозе дадут связь у каждого агента подряд.
  if (name.includes('-')) {
    patterns.push(new RegExp('(?<![\\w-])' + escaped.replace(/-/g, '[-\\s]') + '(?![\\w-])', 'gi'))
  }
  const hits = []
  for (const pattern of patterns) {
    for (const { index } of matchAll(pattern, text)) {
      if (!hits.includes(index)) hits.push(index)
    }
  }
  return hits
}

const agentNames = new Set(agentTexts.map((agent) => agent.name))
const addAgentEdge = (kind, agent, to, doc, index) => {
  addEdge(makeEdge({
    kind, from: agent.id, to, source: { file: doc.file, line: lineOfIndex(doc.text, index) },
  }))
}

for (const agent of agentTexts) {
  for (const doc of agent.docs) {
    // agent → mcp-server
    for (const name of mcpNames) {
      for (const index of mcpMentions(doc.text, name)) {
        // «делегируй агенту `render`» — это про суб-агента, а не про MCP-сервер
        if (agentNames.has(name) && isDelegation(doc.text, index)) continue
        if (inSkillList(doc.text, index)) continue
        addAgentEdge('uses', agent, `mcp:${name}`, doc, index)
        break
      }
    }
    // agent → внешняя система по упоминанию её имени
    for (const { service, index } of serviceMentions(doc.text)) {
      if (!knownServices.has(service.slug)) continue
      if ((agentNames.has(service.slug) || mcpNames.has(service.slug)) && isDelegation(doc.text, index)) continue
      addAgentEdge('uses', agent, `svc:${service.slug}`, doc, index)
    }
    // agent → agent: слэш-команда чужого namespace либо имя в контексте делегирования
    for (const other of agentTexts) {
      if (other.id === agent.id) continue
      const escaped = escapeRegExp(other.name)
      const slash = matchAll(new RegExp('/' + escaped + ':[a-z][\\w-]*', 'g'), doc.text)
      if (slash.length) {
        addAgentEdge('invokes', agent, other.id, doc, slash[0].index)
        continue
      }
      const word = matchAll(new RegExp('(?<![\\w-])' + escaped + '(?![\\w-])', 'gi'), doc.text)
      const delegated = word.find(({ index }) => nearDelegation(doc.text, index))
      if (delegated) addAgentEdge('invokes', agent, other.id, doc, delegated.index)
    }
  }
}

// ── 3. LLM-вызовы в коде: узел на вызов + ребро invokes → svc провайдера ─────
const PROVIDERS = [
  ['anthropic', RE.anthropicCall],
  ['openai', RE.openaiCall],
  ['vercel-ai', RE.vercelAiCall],
]
for (const file of plan.files?.code ?? []) {
  const text = readText(path.join(root, file))
  if (!text) continue
  const lines = text.split('\n')
  for (const [provider, regex] of PROVIDERS) {
    for (const { index } of matchAll(regex, text)) {
      const line = lineOfIndex(text, index)
      const id = `llm:${file}#L${line}`
      const meta = { provider }
      const around = lines.slice(Math.max(0, line - 16), line + 15).join('\n')
      const model = matchAll(RE.modelId, around)[0]?.match[1]
      if (model) meta.model = model
      addNode(makeNode({
        id, kind: 'llm-call', layer: 'agents',
        label: `${provider} ${file}#L${line}`,
        source: { file, line }, meta,
      }))
      // svc-узлы создаёт extract-env; недостающие endpoint'ы merge закроет stub'ом
      const svc = provider === 'anthropic' ? 'svc:anthropic'
        : provider === 'openai' ? 'svc:openai'
        : model && /^claude/i.test(model) ? 'svc:anthropic'
        : model && /^(gpt|o[134])/i.test(model) ? 'svc:openai'
        : null
      if (svc) addEdge(makeEdge({ kind: 'invokes', from: id, to: svc, source: { file, line }, meta: { ...meta } }))
    }
  }
}

// ── 4. Память: только пути с доказательством из plan.files ───────────────────
const allPlanned = new Set()
for (const value of Object.values(plan.files ?? {})) {
  if (!Array.isArray(value)) continue
  for (const file of value) if (typeof file === 'string') allPlanned.add(file)
}
const memoryFiles = [...allPlanned]
  .filter((file) => /(^|\/)memory\//.test(file) || /(^|\/)MEMORY\.md$/.test(file) || file.endsWith('.memory.json'))
  .sort()
for (const file of memoryFiles) {
  addNode(makeNode({
    id: `memory:${file}`, kind: 'memory', layer: 'agents', label: file,
    source: { file, line: 1 }, meta: { kind: 'file' },
  }))
  for (const agent of agentTexts) {
    const at = agent.text.indexOf(file)
    if (at === -1) continue
    addEdge(makeEdge({
      kind: 'uses', from: agent.id, to: `memory:${file}`,
      source: { file: agent.file, line: lineOfIndex(agent.text, at) },
    }))
  }
}

// ── Запись part-файла ────────────────────────────────────────────────────────
const nodeList = [...nodes.values()]
const edgeList = [...edges.values()]
const fromAgent = (edge) => edge.from.startsWith('agent:')
const stats = {
  agents: nodeList.filter((node) => node.kind === 'agent').length,
  llmCalls: nodeList.filter((node) => node.kind === 'llm-call').length,
  memories: nodeList.filter((node) => node.kind === 'memory').length,
  agentToMcp: edgeList.filter((edge) => fromAgent(edge) && edge.to.startsWith('mcp:')).length,
  agentToService: edgeList.filter((edge) => fromAgent(edge) && edge.to.startsWith('svc:')).length,
  agentToAgent: edgeList.filter((edge) => fromAgent(edge) && edge.to.startsWith('agent:')).length,
  agentToMemory: edgeList.filter((edge) => fromAgent(edge) && edge.to.startsWith('memory:')).length,
}
writeJson(args.out, partFile({ part: 'agents', root, nodes: nodeList, edges: edgeList, stats }))
console.log(`archmap extract-agents: ${stats.agents} agents, ${stats.llmCalls} llm-calls, ` +
  `${stats.memories} memory, ${edgeList.length} edges → ${args.out}`)
console.log(`  связи агентов: ${stats.agentToMcp} → MCP, ${stats.agentToService} → внешние системы, ` +
  `${stats.agentToAgent} делегирований, ${stats.agentToMemory} → память`)
