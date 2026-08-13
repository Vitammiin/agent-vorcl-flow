import { sha256, stableJson } from './core.mjs'
import { extractArchitecture, parserMatrix } from './extract.mjs'

const LAYERS = ['client', 'api', 'application', 'event', 'ai', 'data', 'infra', 'external']

function stronglyConnected(nodes, edges) {
  const modules = new Set(nodes.filter((node) => node.kind === 'module').map((node) => node.id))
  const adjacency = new Map([...modules].map((id) => [id, []]))
  for (const edge of edges) if (edge.kind === 'imports' && modules.has(edge.from) && modules.has(edge.to)) adjacency.get(edge.from).push(edge.to)
  let index = 0; const indices = new Map(); const low = new Map(); const stack = []; const active = new Set(); const cycles = []
  const visit = (node) => {
    indices.set(node, index); low.set(node, index); index++; stack.push(node); active.add(node)
    for (const next of adjacency.get(node) || []) {
      if (!indices.has(next)) { visit(next); low.set(node, Math.min(low.get(node), low.get(next))) }
      else if (active.has(next)) low.set(node, Math.min(low.get(node), indices.get(next)))
    }
    if (low.get(node) === indices.get(node)) {
      const component = []; let current
      do { current = stack.pop(); active.delete(current); component.push(current) } while (current !== node)
      if (component.length > 1) cycles.push(component.sort())
    }
  }
  for (const node of [...modules].sort()) if (!indices.has(node)) visit(node)
  return cycles.sort((a, b) => a[0].localeCompare(b[0]))
}

function findings(nodes, edges, cycles) {
  const result = []
  for (const cycle of cycles) result.push({ severity: 'HIGH', code: 'IMPORT_CYCLE', title: `Import cycle across ${cycle.length} modules`, evidence: cycle.flatMap((id) => nodes.find((node) => node.id === id)?.evidence || []).slice(0, 8), recommendation: 'Break the cycle at a domain boundary or introduce an explicit public contract.' })
  const routes = nodes.filter((node) => node.kind === 'route')
  if (routes.length && !nodes.some((node) => /auth|oauth|jwt|session/i.test(`${node.label} ${node.id}`))) {
    result.push({ severity: 'MEDIUM', code: 'AUTH_NOT_DETECTED', title: 'Routes exist but no authentication boundary was detected', evidence: routes.slice(0, 5).flatMap((node) => node.evidence), recommendation: 'Verify authentication and authorization at the application boundary; dynamic middleware may not be statically visible.' })
  }
  const events = nodes.filter((node) => node.kind === 'event')
  if (events.length && !nodes.some((node) => /dead.?letter|dlq|retry/i.test(`${node.label} ${node.id}`))) {
    result.push({ severity: 'MEDIUM', code: 'ASYNC_FAILURE_POLICY_NOT_DETECTED', title: 'Async events exist but retry/DLQ policy was not detected', evidence: events.slice(0, 5).flatMap((node) => node.evidence), recommendation: 'Document and implement idempotency, retry with backoff, and dead-letter handling.' })
  }
  const envNodes = nodes.filter((node) => node.kind === 'environment')
  if (envNodes.length > 25) result.push({ severity: 'IMPROVEMENT', code: 'CONFIG_SURFACE_LARGE', title: `${envNodes.length} environment variables form a large configuration surface`, evidence: envNodes.slice(0, 5).flatMap((node) => node.evidence), recommendation: 'Group and validate typed configuration at startup without exposing secret values.' })
  if (!nodes.some((node) => /opentelemetry|prometheus|sentry|datadog|logging|logger/i.test(`${node.label} ${node.id}`))) {
    result.push({ severity: 'IMPROVEMENT', code: 'OBSERVABILITY_NOT_DETECTED', title: 'A central observability integration was not detected', evidence: nodes.filter((node) => node.kind === 'module').slice(0, 3).flatMap((node) => node.evidence), recommendation: 'Confirm structured logs, metrics, traces, correlation IDs, dashboards, and alerts.' })
  }
  return result
}

function stats(nodes, edges, files, cycles) {
  const byLayer = Object.fromEntries(LAYERS.map((layer) => [layer, nodes.filter((node) => node.layer === layer).length]))
  const byKind = {}
  for (const node of nodes) byKind[node.kind] = (byKind[node.kind] || 0) + 1
  return { files: files.length, nodes: nodes.length, edges: edges.length, byLayer, byKind, parseErrors: files.filter((file) => file.parseErrors).length, cycles: cycles.length }
}

export async function buildModel({ root, scope, slug, files, target = false }) {
  const extracted = await extractArchitecture({ root, files })
  const cycles = stronglyConnected(extracted.nodes, extracted.edges)
  const model = {
    schemaVersion: '1.0.0',
    repository: { name: root.split(/[\\/]/).at(-1), scope: scope === root ? '.' : scope.slice(root.length + 1).split('\\').join('/'), slug },
    evidencePolicy: { markdownAsEvidence: false, commentsAsTopologyEvidence: false, sourceRequired: true, secretValuesStored: false },
    parsers: parserMatrix,
    files: extracted.files,
    nodes: extracted.nodes,
    edges: extracted.edges,
    cycles,
    findings: findings(extracted.nodes, extracted.edges, cycles),
    stats: stats(extracted.nodes, extracted.edges, extracted.files, cycles),
    targetRequested: target,
  }
  model.modelHash = sha256(stableJson(model))
  return model
}

export function diffModels(previous, current) {
  if (!previous) return { addedNodes: current.nodes.map((node) => node.id), removedNodes: [], changedNodes: [], addedEdges: current.edges.map((edge) => edge.id), removedEdges: [], changedEdges: [] }
  const compare = (left, right) => {
    const leftMap = new Map(left.map((item) => [item.id, item])); const rightMap = new Map(right.map((item) => [item.id, item]))
    return {
      added: [...rightMap.keys()].filter((id) => !leftMap.has(id)).sort(),
      removed: [...leftMap.keys()].filter((id) => !rightMap.has(id)).sort(),
      changed: [...rightMap.keys()].filter((id) => leftMap.has(id) && stableJson(leftMap.get(id)) !== stableJson(rightMap.get(id))).sort(),
    }
  }
  const nodes = compare(previous.nodes || [], current.nodes); const edges = compare(previous.edges || [], current.edges)
  return { addedNodes: nodes.added, removedNodes: nodes.removed, changedNodes: nodes.changed, addedEdges: edges.added, removedEdges: edges.removed, changedEdges: edges.changed }
}
