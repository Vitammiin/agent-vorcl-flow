#!/usr/bin/env node
// archmap to-drawio.mjs — рендер architecture.json → многостраничный draw.io XML.
// Использование:
//   node to-drawio.mjs --in <architecture.json> --out <architecture.drawio> [--pages overview,data,api,agents]
// Страницы (пустые не включаются):
//   overview — 6 слоёв-swimlane с узлами (координаты из layoutColumns) и межслойными рёбрами;
//   data     — ERD: shape=table с tableRow-колонками, FK-рёбра entityRelationEdgeStyle (ERone/ERmany), enum-карточки;
//   api      — route/ws/webhook/cron/mcp/middleware по контейнерам-префиксам пути + handles/guards/member;
//   agents   — agent/llm-call/memory + svc-цели invokes с рёбрами invokes/uses/member.
// Контракт: id ячеек — санированный node.id ('0'/'1' зарезервированы), XML-escape всех label,
// inferred → dashed=1 + серый штрих, gridSize=10 (координаты кратны 10), в конце — best-effort xmllint.

import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { LAYERS, parseArgs, readJson } from './lib/core.mjs'
import { layoutColumns } from './lib/graph.mjs'

const args = parseArgs(process.argv.slice(2), {
  in: { flag: '--in', default: null },
  out: { flag: '--out', default: null },
  pages: { flag: '--pages', default: 'overview,data,api,agents' },
})
if (args.help || !args.in || !args.out) {
  console.log('Usage: node to-drawio.mjs --in <architecture.json> --out <architecture.drawio> [--pages overview,data,api,agents]')
  process.exit(args.help ? 0 : 1)
}
const arch = readJson(args.in)
if (!arch || !Array.isArray(arch.nodes) || !Array.isArray(arch.edges)) {
  console.error(`to-drawio: невалидный architecture.json: ${args.in}`)
  process.exit(1)
}

// ── XML/HTML-экранирование ───────────────────────────────────────────────────
// Атрибуты — одинарный XML-escape; label при html=1 draw.io трактует как HTML,
// поэтому текст узла экранируется дважды (как делает сам drawio: & → &amp;amp;).
function escapeXml (value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
const escapeLabel = (value) => escapeXml(escapeXml(value))

// ── id ячеек: санированный node.id, уникальный в пределах страницы ───────────
function idFactory (pagePrefix) {
  const used = new Set(['0', '1']) // зарезервированы под root-ячейки
  return (raw) => {
    const base = `${pagePrefix}-${String(raw).replace(/[^A-Za-z0-9_.-]/g, '_')}`
    let id = base
    let counter = 2
    while (used.has(id)) id = `${base}_${counter++}`
    used.add(id)
    return id
  }
}

// ── стили: приглушённые семантические цвета по kind (one look) ───────────────
const KIND_STYLE = {
  'table': ['#fff2cc', '#d6b656'],
  'enum': ['#fff2cc', '#d6b656'],
  'store': ['#f8cecc', '#b85450'],
  'route': ['#d5e8d4', '#82b366'],
  'ws': ['#d5e8d4', '#82b366'],
  'webhook': ['#d5e8d4', '#82b366'],
  'cron': ['#d5e8d4', '#82b366'],
  'mcp-server': ['#dae8fc', '#6c8ebf'],
  'mcp-tool': ['#dae8fc', '#6c8ebf'],
  'middleware': ['#f5f5f5', '#666666'],
  'agent': ['#e1d5e7', '#9673a6'],
  'llm-call': ['#e1d5e7', '#9673a6'],
  'memory': ['#e1d5e7', '#9673a6'],
  'module': ['#ffe6cc', '#d79b00'],
  'package': ['#ffe6cc', '#d79b00'],
  'env': ['#f5f5f5', '#666666'],
  'external-service': ['#f8cecc', '#b85450'],
  'tech': ['#f5f5f5', '#666666'],
  'page': ['#dae8fc', '#6c8ebf'],
  'component': ['#dae8fc', '#6c8ebf'],
}
const INFERRED_SUFFIX = 'dashed=1;dashPattern=4 4;strokeColor=#9ca3af;'

function kindStyle (node, extra = '') {
  const [fill, stroke] = KIND_STYLE[node.kind] ?? ['#f5f5f5', '#666666']
  let style = `rounded=1;whiteSpace=wrap;html=1;arcSize=8;fillColor=${fill};strokeColor=${stroke};${extra}`
  if (node.inferred) style += INFERRED_SUFFIX
  return style
}

function edgeStyleFor (edge, base) {
  return edge.inferred ? base + INFERRED_SUFFIX : base
}

function tint (hex, ratio) {
  const value = hex.replace('#', '')
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return '#f5f5f5'
  const mixed = [0, 2, 4].map((offset) => {
    const channel = parseInt(value.slice(offset, offset + 2), 16)
    return Math.round(channel + (255 - channel) * ratio).toString(16).padStart(2, '0')
  })
  return `#${mixed.join('')}`
}

function laneStyle (layer) {
  return `swimlane;html=1;startSize=30;horizontal=1;fontStyle=1;rounded=0;collapsible=0;` +
    `fillColor=${tint(layer.color, 0.78)};swimlaneFillColor=${tint(layer.color, 0.93)};strokeColor=${layer.color};opacity=90;`
}

// ── низкоуровневые ячейки ────────────────────────────────────────────────────
function vertexCell ({ id, value = '', style, x, y, w, h, parent = '1' }) {
  return `        <mxCell id="${id}" value="${value}" style="${style}" vertex="1" parent="${parent}">\n` +
    `          <mxGeometry x="${x}" y="${y}" width="${w}" height="${h}" as="geometry"/>\n` +
    '        </mxCell>'
}

function edgeCell ({ id, value = '', style, source, target, parent = '1' }) {
  return `        <mxCell id="${id}" value="${value}" style="${style}" edge="1" parent="${parent}" source="${source}" target="${target}">\n` +
    '          <mxGeometry relative="1" as="geometry"/>\n' +
    '        </mxCell>'
}

function page (name, title, cells, nodeCount, edgeCount) {
  const xml = [
    `  <diagram id="page-${name}" name="${escapeXml(title)}">`,
    '    <mxGraphModel dx="1400" dy="900" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1169" pageHeight="826" math="0" shadow="0">',
    '      <root>',
    '        <mxCell id="0"/>',
    '        <mxCell id="1" parent="0"/>',
    ...cells,
    '      </root>',
    '    </mxGraphModel>',
    '  </diagram>',
  ].join('\n')
  return { name, title, xml, nodes: nodeCount, edges: edgeCount }
}

// ── Overview ─────────────────────────────────────────────────────────────────
function aggregateModules (nodes, edges) {
  // >120 узлов: module-файлы схлопываются в директории (label до первого '/').
  const remap = new Map()
  const dirNodes = new Map()
  const kept = []
  for (const node of nodes) {
    if (node.kind !== 'module') {
      kept.push(node)
      continue
    }
    const slash = node.label.indexOf('/')
    const dir = slash === -1 ? node.label : node.label.slice(0, slash + 1)
    const dirId = `module-dir:${dir}`
    remap.set(node.id, dirId)
    if (!dirNodes.has(dirId)) {
      dirNodes.set(dirId, {
        id: dirId, kind: 'module', layer: 'logic', label: dir,
        source: node.source, inferred: false, meta: { aggregated: true, count: 0 },
      })
    }
    dirNodes.get(dirId).meta.count++
  }
  for (const dirNode of dirNodes.values()) dirNode.label = `${dirNode.label} (${dirNode.meta.count})`
  const edgeMap = new Map()
  for (const edge of edges) {
    const from = remap.get(edge.from) ?? edge.from
    const to = remap.get(edge.to) ?? edge.to
    if (from === to) continue
    const id = `e:${edge.kind}:${from}->${to}`
    if (!edgeMap.has(id)) edgeMap.set(id, { ...edge, id, from, to })
  }
  return { nodes: kept.concat([...dirNodes.values()]), edges: [...edgeMap.values()] }
}

function buildOverview (arch) {
  let nodes = arch.nodes
  let edges = arch.edges
  if (nodes.length > 120) {
    console.log(`to-drawio: overview — узлов ${nodes.length} > 120, module-узлы схлопнуты в директории`)
    ;({ nodes, edges } = aggregateModules(nodes, edges))
  }
  const layers = (arch.layers ?? LAYERS).filter((layer) => nodes.some((node) => node.layer === layer.id))
  const shown = nodes.filter((node) => layers.some((layer) => layer.id === node.layer))
  if (!shown.length) return null
  const positions = layoutColumns(shown, edges, layers, { nodeWidth: 200, gapX: 100, gapY: 20, heightOf: () => 40 })
  const makeId = idFactory('ov')
  const cellId = new Map()
  const laneOf = new Map()
  const cells = []
  layers.forEach((layer, index) => {
    const laneNodes = shown.filter((node) => node.layer === layer.id)
    const bottom = Math.max(...laneNodes.map((node) => {
      const position = positions.get(node.id)
      return position.y + position.h
    }))
    const laneId = makeId(`layer-${layer.id}`)
    laneOf.set(layer.id, laneId)
    cells.push(vertexCell({
      id: laneId, value: escapeLabel(layer.label), style: laneStyle(layer),
      x: 40 + index * 300, y: 40, w: 240, h: bottom + 60,
    }))
  })
  for (const node of shown) {
    const position = positions.get(node.id)
    const id = makeId(node.id)
    cellId.set(node.id, id)
    cells.push(vertexCell({
      id, value: escapeLabel(node.label), style: kindStyle(node, 'fontSize=11;'),
      x: 20, y: 40 + position.y, w: 200, h: 40, parent: laneOf.get(node.layer),
    }))
  }
  let edgeCount = 0
  for (const edge of edges) {
    if (!cellId.has(edge.from) || !cellId.has(edge.to)) continue
    edgeCount++
    cells.push(edgeCell({
      id: makeId(edge.id),
      value: edge.label ? escapeLabel(edge.label) : '',
      style: edgeStyleFor(edge, 'edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;jettySize=auto;endArrow=block;endFill=1;strokeColor=#64748b;fontSize=10;'),
      source: cellId.get(edge.from),
      target: cellId.get(edge.to),
    }))
  }
  return page('overview', 'Overview', cells, shown.length, edgeCount)
}

// ── Data (ERD) ───────────────────────────────────────────────────────────────
const ROW_STYLE = 'shape=tableRow;horizontal=0;startSize=0;swimlaneHead=0;swimlaneBody=0;fillColor=none;' +
  'collapsible=0;dropTarget=0;points=[[0,0.5],[1,0.5]];portConstraint=eastwest;top=0;left=0;right=0;bottom=0;html=1;'
const NAME_CELL_STYLE = 'shape=partialRectangle;html=1;whiteSpace=wrap;connectable=0;fillColor=none;' +
  'top=0;left=0;bottom=0;right=0;overflow=hidden;align=left;spacingLeft=6;fontSize=11;'
const TYPE_CELL_STYLE = NAME_CELL_STYLE + 'fontColor=#6b7280;'

function erArrows (cardinality) {
  // meta.cardinality — "<from>:<to>": 1:N → ERone/ERmany, N:1 → ERmany/ERone, N:M → ERmany/ERmany.
  const [fromCard = 'N', toCard = '1'] = String(cardinality).split(':')
  const arrow = (card) => (card.trim() === '1' ? 'ERone' : 'ERmany')
  return { start: arrow(fromCard), end: arrow(toCard) }
}

function buildData (arch) {
  const tables = arch.nodes.filter((node) => node.kind === 'table')
  if (!tables.length) return null
  const enums = arch.nodes.filter((node) => node.kind === 'enum')
  const makeId = idFactory('erd')
  const cells = []
  const tableCellId = new Map()
  const rowCellId = new Map() // `${nodeId}#${columnName}` → row cell id
  const pkRowId = new Map()
  const width = 240
  const slotX = [40, 360, 680]
  const slotY = [40, 40, 40]

  for (const node of tables.concat(enums)) {
    const isTable = node.kind === 'table'
    const columns = isTable ? node.meta?.columns ?? [] : []
    const values = isTable ? [] : node.meta?.values ?? node.meta?.members ?? []
    const height = isTable
      ? 30 + Math.max(columns.length, 1) * 20
      : Math.max(50, Math.ceil((36 + values.length * 16) / 10) * 10)
    const slot = slotY.indexOf(Math.min(...slotY))
    const x = slotX[slot]
    const y = slotY[slot]
    slotY[slot] += height + 40
    const id = makeId(node.id)
    if (isTable) {
      tableCellId.set(node.id, id)
      let tableStyle = 'shape=table;startSize=30;container=1;collapsible=0;childLayout=tableLayout;fixedRows=1;' +
        'rowLines=0;fontStyle=1;align=center;resizeLast=1;html=1;whiteSpace=wrap;fillColor=#fff2cc;strokeColor=#d6b656;'
      if (node.inferred) tableStyle += INFERRED_SUFFIX
      cells.push(vertexCell({ id, value: escapeLabel(node.label), style: tableStyle, x, y, w: width, h: height }))
      columns.forEach((column, index) => {
        const rowId = makeId(`${node.id}#${column.name}`)
        rowCellId.set(`${node.id}#${column.name}`, rowId)
        if (column.pk && !pkRowId.has(node.id)) pkRowId.set(node.id, rowId)
        cells.push(vertexCell({ id: rowId, value: '', style: ROW_STYLE, x: 0, y: 30 + index * 20, w: width, h: 20, parent: id }))
        const marker = column.pk ? ' [PK]' : column.fk ? ' [FK]' : ''
        cells.push(vertexCell({
          id: makeId(`${node.id}#${column.name}#name`), value: escapeLabel(`${column.name}${marker}`),
          style: NAME_CELL_STYLE + (column.pk ? 'fontStyle=1;' : ''), x: 0, y: 0, w: 140, h: 20, parent: rowId,
        }))
        cells.push(vertexCell({
          id: makeId(`${node.id}#${column.name}#type`), value: escapeLabel(column.type ?? ''),
          style: TYPE_CELL_STYLE, x: 140, y: 0, w: 100, h: 20, parent: rowId,
        }))
      })
    } else {
      // enum — карточка со значениями
      const label = `&lt;b&gt;${escapeLabel(node.label)}&lt;/b&gt;` +
        values.map((value) => `&lt;br&gt;${escapeLabel(String(value))}`).join('')
      cells.push(vertexCell({
        id, value: label,
        style: kindStyle(node, 'verticalAlign=top;align=left;spacing=8;fontSize=11;'),
        x, y, w: width, h: height,
      }))
    }
  }

  let edgeCount = 0
  const nodeById = new Map(arch.nodes.map((node) => [node.id, node]))
  for (const edge of arch.edges) {
    if (edge.kind !== 'fk') continue
    const fromCell = tableCellId.get(edge.from)
    const toCell = tableCellId.get(edge.to)
    if (!fromCell || !toCell) continue
    const toLabel = nodeById.get(edge.to)?.label ?? edge.to.replace(/^table:/, '')
    const fkColumn = (nodeById.get(edge.from)?.meta?.columns ?? [])
      .find((column) => column.fk && column.fk.table === toLabel)
    const source = fkColumn ? rowCellId.get(`${edge.from}#${fkColumn.name}`) ?? fromCell : fromCell
    const target = pkRowId.get(edge.to) ?? toCell
    const cardinality = edge.meta?.cardinality ?? 'N:1'
    const { start, end } = erArrows(cardinality)
    const label = edge.meta?.through ? `${cardinality} via ${edge.meta.through}` : cardinality
    edgeCount++
    cells.push(edgeCell({
      id: makeId(edge.id),
      value: escapeLabel(label),
      style: edgeStyleFor(edge, 'edgeStyle=entityRelationEdgeStyle;html=1;fontSize=10;' +
        'exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;' +
        `startArrow=${start};startFill=0;endArrow=${end};endFill=0;strokeColor=#6b7280;`),
      source, target,
    }))
  }
  return page('data', 'Data (ERD)', cells, tables.length + enums.length, edgeCount)
}

// ── API ──────────────────────────────────────────────────────────────────────
const API_KINDS = ['route', 'ws', 'webhook', 'cron', 'mcp-server', 'mcp-tool', 'middleware']

function pathPrefix (node) {
  // Первые два сегмента пути: /api/users/:id → /api/users
  const raw = node.meta?.path ?? (node.label.match(/\/[^\s]*/)?.[0] ?? '')
  const segments = raw.split('/').filter(Boolean).slice(0, 2)
  return segments.length ? `/${segments.join('/')}` : '(routes)'
}

function apiNodeLabel (node) {
  if (node.kind === 'route' || node.kind === 'ws' || node.kind === 'webhook') {
    const method = node.meta?.method ?? (node.kind === 'route' ? '' : node.kind.toUpperCase())
    const routePath = node.meta?.path ?? ''
    const label = `${method} ${routePath}`.trim()
    if (label) return label
  }
  return node.label
}

function buildApi (arch) {
  const apiNodes = arch.nodes.filter((node) => API_KINDS.includes(node.kind))
  if (!apiNodes.length) return null
  const apiIds = new Set(apiNodes.map((node) => node.id))
  const nodeById = new Map(arch.nodes.map((node) => [node.id, node]))
  const makeId = idFactory('api')
  const cellId = new Map()
  const cells = []

  const groups = new Map()
  const addToGroup = (key, title, node) => {
    if (!groups.has(key)) groups.set(key, { title, nodes: [] })
    groups.get(key).nodes.push(node)
  }
  for (const node of apiNodes) {
    if (node.kind === 'route' || node.kind === 'ws' || node.kind === 'webhook') {
      const prefix = pathPrefix(node)
      addToGroup(`prefix:${prefix}`, `${prefix}/*`, node)
    } else if (node.kind === 'cron') addToGroup('cron', 'Cron', node)
    else if (node.kind === 'middleware') addToGroup('middleware', 'Middleware', node)
    else addToGroup('mcp', 'MCP', node)
  }

  const placeGroup = (key, x, y, fill, stroke) => {
    const group = groups.get(key)
    const groupId = makeId(`group-${key}`)
    const height = 50 + group.nodes.length * 50
    cells.push(vertexCell({
      id: groupId, value: escapeLabel(group.title),
      style: `swimlane;html=1;startSize=30;horizontal=1;fontStyle=1;rounded=0;collapsible=0;fillColor=${fill};strokeColor=${stroke};`,
      x, y, w: 300, h: height,
    }))
    group.nodes.forEach((node, index) => {
      const id = makeId(node.id)
      cellId.set(node.id, id)
      cells.push(vertexCell({
        id, value: escapeLabel(apiNodeLabel(node)), style: kindStyle(node, 'fontSize=11;'),
        x: 20, y: 40 + index * 50, w: 260, h: 40, parent: groupId,
      }))
    })
    return height
  }

  const prefixKeys = [...groups.keys()].filter((key) => key.startsWith('prefix:')).sort()
  const leftKeys = prefixKeys.concat(['middleware', 'cron'].filter((key) => groups.has(key)))
  let y = 40
  for (const key of leftKeys) {
    const isMiddleware = key === 'middleware'
    y += placeGroup(key, 40, y, isMiddleware ? '#fafafa' : tint('#34d399', 0.85), isMiddleware ? '#666666' : '#82b366') + 40
  }
  if (groups.has('mcp')) placeGroup('mcp', 400, 40, tint('#6c8ebf', 0.88), '#6c8ebf')

  // Хендлеры: module-узлы, на которые указывают handles из API-узлов
  const handles = arch.edges.filter((edge) => edge.kind === 'handles' && apiIds.has(edge.from))
  const moduleIds = [...new Set(handles.map((edge) => edge.to))].sort()
  const modules = moduleIds.map((id) => nodeById.get(id)).filter(Boolean)
  if (modules.length) {
    const handlersId = makeId('group-handlers')
    cells.push(vertexCell({
      id: handlersId, value: 'Handlers',
      style: 'swimlane;html=1;startSize=30;horizontal=1;fontStyle=1;rounded=0;collapsible=0;fillColor=#fafafa;strokeColor=#999999;',
      x: 760, y: 40, w: 300, h: 50 + modules.length * 50,
    }))
    modules.forEach((node, index) => {
      const id = makeId(node.id)
      cellId.set(node.id, id)
      cells.push(vertexCell({
        id, value: escapeLabel(node.label), style: kindStyle(node, 'fontSize=11;'),
        x: 20, y: 40 + index * 50, w: 260, h: 40, parent: handlersId,
      }))
    })
  }

  let edgeCount = 0
  const drawEdge = (edge, style, value = '') => {
    if (!cellId.has(edge.from) || !cellId.has(edge.to)) return
    edgeCount++
    cells.push(edgeCell({
      id: makeId(edge.id), value, style: edgeStyleFor(edge, style),
      source: cellId.get(edge.from), target: cellId.get(edge.to),
    }))
  }
  for (const edge of arch.edges) {
    if (edge.kind === 'handles' && apiIds.has(edge.from)) {
      drawEdge(edge, 'edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;jettySize=auto;endArrow=block;endFill=1;strokeColor=#94a3b8;fontSize=10;')
    } else if (edge.kind === 'guards') {
      drawEdge(edge, 'edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;jettySize=auto;endArrow=block;endFill=0;strokeColor=#d79b00;fontSize=10;', escapeLabel('guards'))
    } else if (edge.kind === 'member' && apiIds.has(edge.from) && apiIds.has(edge.to)) {
      drawEdge(edge, 'edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;jettySize=auto;endArrow=open;endFill=0;strokeColor=#6c8ebf;fontSize=10;')
    }
  }
  const pageNodeCount = apiNodes.filter((node) => cellId.has(node.id)).length + modules.length
  return page('api', 'API', cells, pageNodeCount, edgeCount)
}

// ── Agents & AI ──────────────────────────────────────────────────────────────
const AGENT_KINDS = ['agent', 'llm-call', 'memory']

function buildAgents (arch) {
  const base = arch.nodes.filter((node) => AGENT_KINDS.includes(node.kind))
  if (!base.length) return null
  const baseIds = new Set(base.map((node) => node.id))
  const nodeById = new Map(arch.nodes.map((node) => [node.id, node]))
  const svcIds = [...new Set(
    arch.edges
      .filter((edge) => edge.kind === 'invokes' && baseIds.has(edge.from))
      .map((edge) => edge.to),
  )]
  const svcNodes = svcIds.map((id) => nodeById.get(id)).filter((node) => node && !baseIds.has(node.id))
  const pageNodes = base.concat(svcNodes)
  const pageIds = new Set(pageNodes.map((node) => node.id))
  const pageEdges = arch.edges.filter((edge) =>
    ['invokes', 'uses', 'member'].includes(edge.kind) && pageIds.has(edge.from) && pageIds.has(edge.to))

  const pseudoLayers = [{ id: 'agent' }, { id: 'llm-call' }, { id: 'memory' }, { id: 'svc' }]
  const clones = pageNodes.map((node) => ({
    ...node,
    layer: AGENT_KINDS.includes(node.kind) ? node.kind : 'svc',
  }))
  const positions = layoutColumns(clones, pageEdges, pseudoLayers, { nodeWidth: 220, gapX: 120, gapY: 30, heightOf: () => 50 })

  const makeId = idFactory('ag')
  const cellId = new Map()
  const cells = []
  for (const node of pageNodes) {
    const position = positions.get(node.id)
    if (!position) continue
    const id = makeId(node.id)
    cellId.set(node.id, id)
    cells.push(vertexCell({
      id, value: escapeLabel(node.label), style: kindStyle(node, 'fontSize=11;'),
      x: 40 + position.x, y: 40 + position.y, w: 220, h: 50,
    }))
  }
  let edgeCount = 0
  for (const edge of pageEdges) {
    if (!cellId.has(edge.from) || !cellId.has(edge.to)) continue
    const label = edge.kind === 'invokes'
      ? edge.meta?.model ?? edge.label ?? 'invokes'
      : edge.label ?? edge.kind
    edgeCount++
    cells.push(edgeCell({
      id: makeId(edge.id), value: escapeLabel(label),
      style: edgeStyleFor(edge, 'edgeStyle=orthogonalEdgeStyle;rounded=1;html=1;jettySize=auto;endArrow=block;endFill=1;strokeColor=#9673a6;fontSize=10;'),
      source: cellId.get(edge.from), target: cellId.get(edge.to),
    }))
  }
  return page('agents', 'Agents & AI', cells, pageNodes.length, edgeCount)
}

// ── сборка mxfile ────────────────────────────────────────────────────────────
const BUILDERS = { overview: buildOverview, data: buildData, api: buildApi, agents: buildAgents }
const requested = args.pages.split(',').map((name) => name.trim()).filter(Boolean)
const unknown = requested.filter((name) => !BUILDERS[name])
if (unknown.length) {
  console.error(`to-drawio: неизвестные страницы: ${unknown.join(', ')} (доступны: ${Object.keys(BUILDERS).join(', ')})`)
  process.exit(1)
}

const pages = []
for (const name of requested) {
  const built = BUILDERS[name](arch)
  if (built) pages.push(built)
  else console.log(`to-drawio: страница "${name}" пуста — пропущена`)
}
if (!pages.length) {
  console.error('to-drawio: все запрошенные страницы пусты — файл не создан')
  process.exit(1)
}

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<mxfile host="app.diagrams.net" agent="archmap" version="1" type="device">\n' +
  pages.map((built) => built.xml).join('\n') +
  '\n</mxfile>\n'
fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true })
fs.writeFileSync(args.out, xml)

// ── best-effort валидация xmllint ────────────────────────────────────────────
let lintResult = 'skipped (xmllint не найден)'
try {
  execFileSync('xmllint', ['--noout', args.out], { stdio: ['ignore', 'pipe', 'pipe'] })
  lintResult = 'OK'
} catch (error) {
  if (error.code !== 'ENOENT') lintResult = `FAILED: ${(error.stderr ?? '').toString().trim().slice(0, 300)}`
}

console.log(`archmap to-drawio: ${pages.length} page(s) → ${args.out}`)
for (const built of pages) console.log(`  - ${built.title}: ${built.nodes} nodes, ${built.edges} edges`)
console.log(`  xmllint: ${lintResult}`)
