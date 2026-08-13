import path from 'node:path'
import { sanitize, writeText } from './lib/core.mjs'

const COLORS = { client: '#22c55e', api: '#38bdf8', application: '#2563eb', event: '#f59e0b', ai: '#a855f7', data: '#fb923c', infra: '#ef4444', external: '#94a3b8' }

function safe(value) { return String(value).replace(/["<>]/g, '').replace(/[\[\]{}()]/g, ' ').slice(0, 72) }
function id(value) { return `n_${sanitize(value).replaceAll('-', '_')}_${Math.abs(hash(value))}` }
function hash(value) { let result = 0; for (const char of value) result = ((result << 5) - result + char.charCodeAt(0)) | 0; return result }

function overview(model) {
  const groups = new Map()
  for (const node of model.nodes) {
    const key = `${node.layer}:${node.kind}`
    if (!groups.has(key)) groups.set(key, { id: key, layer: node.layer, kind: node.kind, count: 0 })
    groups.get(key).count++
  }
  const nodeGroup = new Map(model.nodes.map((node) => [node.id, `${node.layer}:${node.kind}`]))
  const edgeGroups = new Map()
  for (const edge of model.edges) {
    const from = nodeGroup.get(edge.from); const to = nodeGroup.get(edge.to)
    if (!from || !to || from === to) continue
    const key = `${from}->${to}:${edge.kind}`
    edgeGroups.set(key, { from, to, kind: edge.kind, count: (edgeGroups.get(key)?.count || 0) + 1 })
  }
  const lines = ['flowchart LR']
  for (const group of [...groups.values()].sort((a, b) => a.id.localeCompare(b.id))) lines.push(`  ${id(group.id)}["${safe(group.layer.toUpperCase())}<br/>${safe(group.kind)} ×${group.count}"]`)
  for (const edge of [...edgeGroups.values()].sort((a, b) => `${a.from}${a.to}`.localeCompare(`${b.from}${b.to}`))) lines.push(`  ${id(edge.from)} -->|"${safe(edge.kind)} ×${edge.count}"| ${id(edge.to)}`)
  for (const group of groups.values()) lines.push(`  style ${id(group.id)} fill:${COLORS[group.layer] || COLORS.external},stroke:#e5e7eb,color:#07111f`)
  return `${lines.join('\n')}\n`
}

function detailed(model, filter, direction = 'LR') {
  let nodes = model.nodes.filter(filter)
  if (nodes.length > 80) nodes = nodes.filter((node) => node.kind !== 'function' && node.kind !== 'type').slice(0, 80)
  const available = new Set(nodes.map((node) => node.id)); const lines = [`flowchart ${direction}`]
  for (const node of nodes) lines.push(`  ${id(node.id)}["${safe(node.label)}"]`)
  for (const edge of model.edges) if (available.has(edge.from) && available.has(edge.to)) lines.push(`  ${id(edge.from)} ${['publishes', 'receives', 'enqueue'].includes(edge.kind) ? '-.->' : '-->'}|"${safe(edge.kind)}"| ${id(edge.to)}`)
  for (const node of nodes) lines.push(`  style ${id(node.id)} fill:${COLORS[node.layer] || COLORS.external},stroke:#e5e7eb,color:#07111f`)
  return `${lines.join('\n')}\n`
}

export function mermaidViews(model) {
  const views = new Map([['L0-context.mmd', overview(model)]])
  if (model.nodes.length <= 40) views.set('L1-system.mmd', detailed(model, () => true))
  else {
    views.set('L1-system.mmd', overview(model))
    for (const layer of ['client', 'api', 'application', 'event', 'ai', 'data']) if (model.nodes.some((node) => node.layer === layer)) views.set(`L2-${layer}.mmd`, detailed(model, (node) => node.layer === layer))
    const flowNodes = new Set(model.edges.filter((edge) => ['defines', 'publishes', 'uses', 'reads-env'].includes(edge.kind)).flatMap((edge) => [edge.from, edge.to]))
    if (flowNodes.size) views.set('L3-critical-flow.mmd', detailed(model, (node) => flowNodes.has(node.id), 'TD'))
  }
  if (model.nodes.some((node) => node.layer === 'infra')) views.set('L4-deployment.mmd', detailed(model, (node) => ['infra', 'api', 'application', 'data', 'external'].includes(node.layer)))
  return views
}

export function renderMermaid(model, directory) {
  const files = []
  for (const [name, contents] of mermaidViews(model)) { const file = path.join(directory, name); writeText(file, contents); files.push(file) }
  return files
}
