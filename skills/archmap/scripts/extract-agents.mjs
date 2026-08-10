#!/usr/bin/env node
// archmap extract-agents.mjs — фаза 1: определения агентов (frontmatter *.md),
// LLM-вызовы в коде и память (только с доказательством source:{file,line}).
// Использование: node extract-agents.mjs --root <target> --plan <plan.json> --out <agents.part.json>
// Нет claude-agents и ai-sdk в plan.stacks.detected → пустой part + exit 0.

import path from 'node:path'
import {
  parseArgs, readText, lineOfIndex, makeNode, makeEdge, partFile, writeJson, loadPlan,
} from './lib/core.mjs'
import { RE, matchAll } from './lib/ts.mjs'

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

// ── 1. Определения агентов из plan.files.agentsMd ────────────────────────────
const agentTexts = []
for (const file of plan.files?.agentsMd ?? []) {
  const text = readText(path.join(root, file))
  if (!text) continue
  const fm = parseFrontmatter(text)
  if (!fm?.name) continue
  const id = `agent:${fm.name}`
  agentTexts.push({ id, file, text })
  const meta = { tools: fm.tools ?? [], skills: fm.skills ?? [], file }
  if (fm.model) meta.model = fm.model
  if (fm.description) meta.description = fm.description.split('\n')[0].slice(0, 200)
  addNode(makeNode({
    id, kind: 'agent', layer: 'agents', label: fm.name,
    source: { file, line: fm.lines.name ?? 1 }, meta,
  }))
}

// ── 2. LLM-вызовы в коде: узел на вызов + ребро invokes → svc провайдера ─────
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

// ── 3. Память: только пути с доказательством из plan.files ───────────────────
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
const stats = {
  agents: nodeList.filter((node) => node.kind === 'agent').length,
  llmCalls: nodeList.filter((node) => node.kind === 'llm-call').length,
  memories: nodeList.filter((node) => node.kind === 'memory').length,
}
writeJson(args.out, partFile({ part: 'agents', root, nodes: nodeList, edges: edgeList, stats }))
console.log(`archmap extract-agents: ${stats.agents} agents, ${stats.llmCalls} llm-calls, ` +
  `${stats.memories} memory, ${edgeList.length} edges → ${args.out}`)
