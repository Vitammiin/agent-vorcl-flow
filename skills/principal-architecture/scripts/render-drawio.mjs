import path from 'node:path'
import { escapeXml, sanitize, writeText } from './lib/core.mjs'

// Editorial hierarchy and adaptive page budgets are adapted from the
// diagram-design project. Multi-page IDs and structural rules are informed by
// next-ai-draw-io. See assets/THIRD_PARTY_NOTICES.md.
const LAYERS = ['client', 'api', 'application', 'ai', 'event', 'data', 'infra', 'external']
const STYLE = {
  client: ['#e8f3eb', '#5f8f70'], api: ['#e7eef8', '#4f6f9f'], application: ['#edf2f8', '#315d8a'],
  event: ['#fbf1df', '#b67a22'], ai: ['#f1eaf6', '#79558f'], data: ['#f8efe1', '#a96f2a'],
  infra: ['#f8e9e7', '#a4554d'], external: ['#f2f3f5', '#737984'],
}

function hash(value) {
  let result = 2166136261
  for (const char of String(value)) { result ^= char.charCodeAt(0); result = Math.imul(result, 16777619) }
  return (result >>> 0).toString(36)
}

function cellId(prefix, value) { return `${prefix}-${sanitize(value).slice(0, 34)}-${hash(value)}` }

function aggregate(model) {
  const groups = new Map(); const membership = new Map()
  for (const node of model.nodes.filter((item) => !['function', 'type'].includes(item.kind))) {
    const key = `${node.layer}:${node.kind}`; membership.set(node.id, key)
    const current = groups.get(key) || { id: `aggregate:${key}`, layer: node.layer, kind: node.kind, label: `${node.kind}`, count: 0, evidence: node.evidence }
    current.count++; groups.set(key, current)
  }
  const edgeGroups = new Map()
  for (const edge of model.edges) {
    const from = membership.get(edge.from); const to = membership.get(edge.to)
    if (!from || !to || from === to) continue
    const key = `${from}->${to}:${edge.kind}`
    const current = edgeGroups.get(key) || { id: `aggregate-edge:${key}`, from: `aggregate:${from}`, to: `aggregate:${to}`, kind: edge.kind, count: 0, evidence: edge.evidence }
    current.count++; edgeGroups.set(key, current)
  }
  return { nodes: [...groups.values()].map((node) => ({ ...node, label: `${node.label} ×${node.count}` })), edges: [...edgeGroups.values()].map((edge) => ({ ...edge, label: `${edge.kind} ×${edge.count}` })) }
}

function pageSpecs(model, maxNodes) {
  const overview = aggregate(model); const specs = [{ name: 'L0 Overview', ...overview }]
  const concrete = model.nodes.filter((node) => !['function', 'type'].includes(node.kind))
  const degree = new Map()
  for (const edge of model.edges) { degree.set(edge.from, (degree.get(edge.from) || 0) + 1); degree.set(edge.to, (degree.get(edge.to) || 0) + 1) }
  const systemNodes = [...concrete].sort((a, b) => (degree.get(b.id) || 0) - (degree.get(a.id) || 0) || a.id.localeCompare(b.id)).slice(0, maxNodes)
  if (systemNodes.length) { const available = new Set(systemNodes.map((node) => node.id)); specs.push({ name: 'L1 System', nodes: systemNodes, edges: model.edges.filter((edge) => available.has(edge.from) && available.has(edge.to)) }) }
  for (const layer of LAYERS) {
    const nodes = concrete.filter((node) => node.layer === layer)
    for (let offset = 0; offset < nodes.length; offset += maxNodes) {
      const chunk = nodes.slice(offset, offset + maxNodes); const available = new Set(chunk.map((node) => node.id))
      const suffix = nodes.length > maxNodes ? ` ${Math.floor(offset / maxNodes) + 1}` : ''
      specs.push({ name: `L2 ${layer[0].toUpperCase()}${layer.slice(1)}${suffix}`, nodes: chunk, edges: model.edges.filter((edge) => available.has(edge.from) && available.has(edge.to)) })
    }
  }
  const flowIds = new Set(model.edges.filter((edge) => ['publishes', 'receives', 'enqueue', 'uses', 'defines'].includes(edge.kind)).flatMap((edge) => [edge.from, edge.to]))
  const flowNodes = concrete.filter((node) => flowIds.has(node.id)).slice(0, maxNodes)
  if (flowNodes.length > 1) { const available = new Set(flowNodes.map((node) => node.id)); specs.push({ name: 'L3 Critical Flow', nodes: flowNodes, edges: model.edges.filter((edge) => available.has(edge.from) && available.has(edge.to)) }) }
  return specs
}

function nodeShape(node) {
  if (node.kind === 'data-store') return 'shape=cylinder3;boundedLbl=1;backgroundOutline=1;size=12;'
  if (node.kind === 'environment') return 'shape=hexagon;perimeter=hexagonPerimeter2;fixedSize=1;'
  if (node.kind === 'external-dependency') return 'dashed=1;dashPattern=4 3;'
  if (node.kind === 'event') return 'shape=process;'
  return 'rounded=1;arcSize=8;'
}

function layout(nodes) {
  const byLayer = new Map()
  for (const node of nodes) { if (!byLayer.has(node.layer)) byLayer.set(node.layer, []); byLayer.get(node.layer).push(node) }
  const activeLayers = LAYERS.filter((layer) => byLayer.has(layer)); const positions = new Map(); const zones = []
  activeLayers.forEach((layer, column) => {
    const items = byLayer.get(layer).sort((a, b) => a.id.localeCompare(b.id)); const x = 70 + column * 260
    items.forEach((node, row) => positions.set(node.id, { x: x + 20, y: 100 + row * 100, width: 210, height: 68, column, row }))
    zones.push({ layer, x, y: 50, width: 250, height: Math.max(150, items.length * 100 + 70) })
  })
  return { positions, zones, width: Math.max(1100, activeLayers.length * 260 + 100), height: Math.max(700, ...zones.map((zone) => zone.height + 90)) }
}

function edgePorts(edge, positions, index, count) {
  const from = positions.get(edge.from); const to = positions.get(edge.to); const spread = count > 1 ? (index + 1) / (count + 1) : 0.5
  if (from.column < to.column) return `exitX=1;exitY=${spread.toFixed(2)};entryX=0;entryY=${spread.toFixed(2)};`
  if (from.column > to.column) return `exitX=0;exitY=${spread.toFixed(2)};entryX=1;entryY=${spread.toFixed(2)};`
  return from.row <= to.row ? `exitX=${spread.toFixed(2)};exitY=1;entryX=${spread.toFixed(2)};entryY=0;` : `exitX=${spread.toFixed(2)};exitY=0;entryX=${spread.toFixed(2)};entryY=1;`
}

function renderPage(spec) {
  const nodes = [...spec.nodes].sort((a, b) => `${a.layer}:${a.id}`.localeCompare(`${b.layer}:${b.id}`)); const { positions, zones, width, height } = layout(nodes)
  const ids = new Map(nodes.map((node) => [node.id, cellId('node', node.id)])); const available = new Set(ids.keys())
  const edges = spec.edges.filter((edge) => available.has(edge.from) && available.has(edge.to)).sort((a, b) => a.id.localeCompare(b.id))
  const cells = ['<mxCell id="0"/>', '<mxCell id="1" parent="0"/>']
  for (const zone of zones) {
    const [fill, stroke] = STYLE[zone.layer] || STYLE.external
    cells.push(`<mxCell id="${cellId('zone', `${spec.name}:${zone.layer}`)}" value="${escapeXml(zone.layer.toUpperCase())}" style="rounded=1;arcSize=6;whiteSpace=wrap;html=1;container=0;connectable=0;pointerEvents=0;verticalAlign=top;align=left;spacingTop=10;spacingLeft=12;fontSize=11;fontStyle=1;fontColor=${stroke};fillColor=${fill};fillOpacity=28;strokeColor=${stroke};strokeOpacity=55;dashed=1;dashPattern=4 4;" vertex="1" parent="1"><mxGeometry x="${zone.x}" y="${zone.y}" width="${zone.width}" height="${zone.height}" as="geometry"/></mxCell>`)
  }
  const fanCounts = new Map()
  for (const edge of edges) { const key = `${edge.from}->${edge.to}`; fanCounts.set(key, (fanCounts.get(key) || 0) + 1) }
  const fanIndex = new Map()
  for (const edge of edges) {
    const key = `${edge.from}->${edge.to}`; const index = fanIndex.get(key) || 0; fanIndex.set(key, index + 1)
    const async = /publish|receive|enqueue|event|async|queue/i.test(edge.kind); const critical = /publish|enqueue|writes|defines/i.test(edge.kind)
    cells.push(`<mxCell id="${cellId('edge', `${spec.name}:${edge.id}`)}" value="${escapeXml(edge.label || edge.kind)}" style="edgeStyle=orthogonalEdgeStyle;orthogonalLoop=1;rounded=1;jettySize=auto;jumpStyle=arc;jumpSize=8;html=1;endArrow=block;endFill=1;strokeColor=${critical ? '#a4554d' : '#667085'};strokeWidth=${critical ? '2' : '1.2'};fontColor=#344054;fontSize=9;labelBackgroundColor=#f8fafc;${async ? 'dashed=1;dashPattern=5 4;' : ''}${edgePorts(edge, positions, index, fanCounts.get(key))}" edge="1" parent="1" source="${ids.get(edge.from)}" target="${ids.get(edge.to)}"><mxGeometry relative="1" as="geometry"/></mxCell>`)
  }
  for (const node of nodes) {
    const position = positions.get(node.id); const [fill, stroke] = STYLE[node.layer] || STYLE.external; const evidence = node.evidence?.[0]
    const label = `${node.label}\n${node.kind}${evidence ? ` · ${evidence.file}:${evidence.line}` : ''}`
    cells.push(`<mxCell id="${ids.get(node.id)}" value="${escapeXml(label)}" style="${nodeShape(node)}whiteSpace=wrap;html=1;fillColor=${fill};strokeColor=${stroke};strokeWidth=1.4;fontColor=#202632;fontSize=11;fontStyle=1;spacing=8;" vertex="1" parent="1"><mxGeometry x="${position.x}" y="${position.y}" width="${position.width}" height="${position.height}" as="geometry"/></mxCell>`)
  }
  const pageId = cellId('page', spec.name)
  return `<diagram id="${pageId}" name="${escapeXml(spec.name)}"><mxGraphModel grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="${width}" pageHeight="${height}" math="0" shadow="0"><root>${cells.join('')}</root></mxGraphModel></diagram>`
}

export function renderDrawio(model, file, options = {}) {
  const maxNodes = Math.max(8, Math.min(40, Number(options.maxNodesPerPage) || 24))
  const pages = pageSpecs(model, maxNodes).map(renderPage)
  writeText(path.resolve(file), `<?xml version="1.0" encoding="UTF-8"?>\n<mxfile host="app.diagrams.net" modified="1970-01-01T00:00:00.000Z" agent="principal-architecture" version="24.7.17" type="device" pages="1">${pages.join('')}</mxfile>\n`)
  return file
}
