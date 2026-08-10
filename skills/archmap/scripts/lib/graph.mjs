// archmap lib/graph.mjs — операции над графом architecture.json:
// дедуп, ссылочная целостность, BFS-трассировка, схлопывание модулей в директории,
// barycenter-layout (общий для to-html.mjs и to-drawio.mjs).

import { LAYER_IDS, makeNode, makeEdge } from './core.mjs'

const PART_PRIORITY = ['data', 'api', 'agents', 'modules', 'env', 'annotations']

export function mergeParts(parts) {
  // parts: [{part, nodes, edges}] → {nodes, edges, conflicts}
  const nodeById = new Map()
  const edgeById = new Map()
  const conflicts = []
  const ordered = [...parts].sort(
    (a, b) => PART_PRIORITY.indexOf(a.part) - PART_PRIORITY.indexOf(b.part),
  )
  for (const part of ordered) {
    for (const node of part.nodes ?? []) {
      if (nodeById.has(node.id)) {
        const existing = nodeById.get(node.id)
        // приоритетный (ранний) part выигрывает; meta мягко дополняется
        existing.meta = { ...(node.meta ?? {}), ...(existing.meta ?? {}) }
        if (existing.inferred && !node.inferred) {
          existing.inferred = false
          existing.source = node.source
        }
        conflicts.push({ id: node.id, kept: existing.kind, droppedFrom: part.part })
      } else {
        nodeById.set(node.id, structuredClone(node))
      }
    }
    for (const edge of part.edges ?? []) {
      if (!edgeById.has(edge.id)) edgeById.set(edge.id, structuredClone(edge))
    }
  }
  return { nodes: [...nodeById.values()], edges: [...edgeById.values()], conflicts }
}

export function ensureReferentialIntegrity(nodes, edges) {
  // Каждое from/to обязано существовать; иначе создаём stub-узел inferred:true.
  const ids = new Set(nodes.map((node) => node.id))
  const stubs = []
  for (const edge of edges) {
    for (const endpoint of [edge.from, edge.to]) {
      if (ids.has(endpoint)) continue
      ids.add(endpoint)
      const stub = makeNode({
        id: endpoint,
        kind: kindFromId(endpoint),
        layer: layerFromId(endpoint),
        label: endpoint.split(':').slice(1).join(':') || endpoint,
        source: edge.source ?? { file: '', line: 0 },
        inferred: true,
        meta: { stub: true },
      })
      stubs.push(stub)
      nodes.push(stub)
    }
  }
  return stubs
}

const ID_PREFIX_KIND = {
  'table': ['table', 'data'], 'enum': ['enum', 'data'], 'store': ['store', 'data'],
  'route': ['route', 'api'], 'ws': ['ws', 'api'], 'webhook': ['webhook', 'api'],
  'cron': ['cron', 'api'], 'mcp': ['mcp-server', 'api'], 'middleware': ['middleware', 'api'],
  'agent': ['agent', 'agents'], 'llm': ['llm-call', 'agents'], 'memory': ['memory', 'agents'],
  'module': ['module', 'logic'], 'pkg': ['package', 'logic'],
  'env': ['env', 'infra'], 'svc': ['external-service', 'infra'], 'tech': ['tech', 'infra'],
  'page': ['page', 'client'], 'component': ['component', 'client'],
}

export function kindFromId(id) {
  const prefix = id.split(':')[0]
  if (prefix === 'mcp' && id.includes('/tool:')) return 'mcp-tool'
  return ID_PREFIX_KIND[prefix]?.[0] ?? 'module'
}

export function layerFromId(id) {
  const prefix = id.split(':')[0]
  return ID_PREFIX_KIND[prefix]?.[1] ?? 'logic'
}

export function validateGraph(nodes, edges, layerIds = LAYER_IDS) {
  const errors = []
  const seen = new Set()
  for (const node of nodes) {
    if (!node.id) errors.push('node without id')
    if (seen.has(node.id)) errors.push(`duplicate node id: ${node.id}`)
    seen.add(node.id)
    if (!layerIds.includes(node.layer)) errors.push(`bad layer "${node.layer}" on ${node.id}`)
    if (!node.source || typeof node.source.file !== 'string' || !Number.isInteger(node.source.line)) {
      errors.push(`missing source on ${node.id}`)
    }
    if (typeof node.inferred !== 'boolean') errors.push(`missing inferred flag on ${node.id}`)
  }
  const edgeIds = new Set()
  for (const edge of edges) {
    if (edgeIds.has(edge.id)) errors.push(`duplicate edge id: ${edge.id}`)
    edgeIds.add(edge.id)
    if (!seen.has(edge.from)) errors.push(`edge ${edge.id}: unknown from ${edge.from}`)
    if (!seen.has(edge.to)) errors.push(`edge ${edge.id}: unknown to ${edge.to}`)
  }
  return errors
}

export function trace(nodes, edges, startId, direction) {
  // direction: 'up' (кто зависит от узла) | 'down' (от чего зависит узел); BFS с visited — циклы безопасны.
  const forward = new Map()
  const backward = new Map()
  for (const edge of edges) {
    if (!forward.has(edge.from)) forward.set(edge.from, [])
    forward.get(edge.from).push(edge)
    if (!backward.has(edge.to)) backward.set(edge.to, [])
    backward.get(edge.to).push(edge)
  }
  const adjacency = direction === 'down' ? forward : backward
  const visited = new Set([startId])
  const pathEdges = []
  const queue = [startId]
  while (queue.length) {
    const current = queue.shift()
    for (const edge of adjacency.get(current) ?? []) {
      pathEdges.push(edge.id)
      const next = direction === 'down' ? edge.to : edge.from
      if (!visited.has(next)) {
        visited.add(next)
        queue.push(next)
      }
    }
  }
  return { nodeIds: [...visited], edgeIds: pathEdges }
}

export function collapseModulesToDirs(nodes, edges, { threshold = 150 } = {}) {
  // При взрыве module-узлов схлопываем файлы в директории (meta.files сохраняет детали).
  const moduleNodes = nodes.filter((node) => node.kind === 'module')
  if (moduleNodes.length <= threshold) return { nodes, edges, collapsed: false }

  const dirOf = (id) => {
    const file = id.slice('module:'.length)
    const dir = file.includes('/') ? file.slice(0, file.lastIndexOf('/')) : '.'
    return `module:${dir}/`
  }
  const remap = new Map()
  const dirNodes = new Map()
  for (const node of moduleNodes) {
    const dirId = dirOf(node.id)
    remap.set(node.id, dirId)
    if (!dirNodes.has(dirId)) {
      dirNodes.set(dirId, makeNode({
        id: dirId,
        kind: 'module',
        layer: 'logic',
        label: dirId.slice('module:'.length),
        source: node.source,
        meta: { dir: true, files: [] },
      }))
    }
    dirNodes.get(dirId).meta.files.push({ file: node.label, line: node.source.line })
  }
  const keptNodes = nodes.filter((node) => node.kind !== 'module').concat([...dirNodes.values()])
  const edgeMap = new Map()
  for (const edge of edges) {
    const from = remap.get(edge.from) ?? edge.from
    const to = remap.get(edge.to) ?? edge.to
    if (from === to && edge.kind === 'import') continue
    const id = `e:${edge.kind}:${from}->${to}`
    if (edgeMap.has(id)) {
      const existing = edgeMap.get(id)
      existing.meta.count = (existing.meta.count ?? 1) + 1
    } else {
      edgeMap.set(id, { ...structuredClone(edge), id, from, to })
    }
  }
  return { nodes: keptNodes, edges: [...edgeMap.values()], collapsed: true }
}

export function layoutColumns(nodes, edges, layers, options = {}) {
  // Колонки по слоям + barycenter-сортировка внутри колонки (3 прохода).
  // Возвращает Map<nodeId, {x, y, w, h, column}> — координаты в абстрактных единицах.
  const nodeWidth = options.nodeWidth ?? 240
  const gapX = options.gapX ?? 120
  const gapY = options.gapY ?? 28
  const heightOf = options.heightOf ?? (() => 56)

  const columns = layers.map((layer) => nodes.filter((node) => node.layer === layer.id))
  const indexOf = new Map()
  columns.forEach((column, columnIndex) => {
    column.sort((a, b) => a.id.localeCompare(b.id))
    column.forEach((node, rowIndex) => indexOf.set(node.id, { columnIndex, rowIndex }))
  })

  const neighbors = new Map()
  for (const edge of edges) {
    if (!neighbors.has(edge.from)) neighbors.set(edge.from, [])
    if (!neighbors.has(edge.to)) neighbors.set(edge.to, [])
    neighbors.get(edge.from).push(edge.to)
    neighbors.get(edge.to).push(edge.from)
  }

  for (let pass = 0; pass < 3; pass++) {
    for (const column of columns) {
      const scored = column.map((node) => {
        const linked = (neighbors.get(node.id) ?? [])
          .map((id) => indexOf.get(id)?.rowIndex)
          .filter((row) => row !== undefined)
        const barycenter = linked.length
          ? linked.reduce((sum, row) => sum + row, 0) / linked.length
          : indexOf.get(node.id).rowIndex
        return { node, barycenter }
      })
      scored.sort((a, b) => a.barycenter - b.barycenter || a.node.id.localeCompare(b.node.id))
      scored.forEach((entry, rowIndex) => {
        indexOf.get(entry.node.id).rowIndex = rowIndex
      })
      column.length = 0
      column.push(...scored.map((entry) => entry.node))
    }
  }

  const positions = new Map()
  columns.forEach((column, columnIndex) => {
    let y = 0
    for (const node of column) {
      const height = heightOf(node)
      positions.set(node.id, {
        x: columnIndex * (nodeWidth + gapX),
        y,
        w: nodeWidth,
        h: height,
        column: columnIndex,
      })
      y += height + gapY
    }
  })
  return positions
}

export function findCycles(nodes, edges) {
  // SCC (итеративный Tarjan) по import/depends — циклы модулей как находка.
  const relevant = edges.filter((edge) => edge.kind === 'import' || edge.kind === 'depends')
  const adjacency = new Map()
  for (const edge of relevant) {
    if (!adjacency.has(edge.from)) adjacency.set(edge.from, [])
    adjacency.get(edge.from).push(edge.to)
  }
  const index = new Map()
  const low = new Map()
  const onStack = new Set()
  const stack = []
  const cycles = []
  let counter = 0

  for (const start of adjacency.keys()) {
    if (index.has(start)) continue
    const work = [[start, 0]]
    while (work.length) {
      const frame = work[work.length - 1]
      const [node] = frame
      if (frame[1] === 0) {
        index.set(node, counter)
        low.set(node, counter)
        counter++
        stack.push(node)
        onStack.add(node)
      }
      let advanced = false
      const targets = adjacency.get(node) ?? []
      while (frame[1] < targets.length) {
        const next = targets[frame[1]++]
        if (!index.has(next)) {
          work.push([next, 0])
          advanced = true
          break
        } else if (onStack.has(next)) {
          low.set(node, Math.min(low.get(node), index.get(next)))
        }
      }
      if (advanced) continue
      if (low.get(node) === index.get(node)) {
        const component = []
        while (true) {
          const popped = stack.pop()
          onStack.delete(popped)
          component.push(popped)
          if (popped === node) break
        }
        if (component.length > 1) cycles.push(component.sort())
      }
      work.pop()
      if (work.length) {
        const parent = work[work.length - 1][0]
        low.set(parent, Math.min(low.get(parent), low.get(node)))
      }
    }
  }
  return cycles
}

export { makeNode, makeEdge }
