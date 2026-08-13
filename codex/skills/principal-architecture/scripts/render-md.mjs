import path from 'node:path'
import { readJson, writeText } from './lib/core.mjs'

const code = (value) => `\`${value}\``

function sourceLink(item, sourcePrefix) {
  const source = item?.evidence?.[0]
  const prefix = sourcePrefix ? `${sourcePrefix.replace(/\/$/, '')}/` : ''
  return source ? `[${code(`${source.file}:${source.line}`)}](${prefix}${source.file}#L${source.line})` : 'unverified'
}

function table(headers, rows) {
  if (!rows.length) return '_None detected._\n'
  return `| ${headers.join(' | ')} |\n| ${headers.map(() => '---').join(' | ')} |\n${rows.map((row) => `| ${row.map((cell) => String(cell).replaceAll('|', '\\|')).join(' | ')} |`).join('\n')}\n`
}

export function renderMarkdown(model, { diff, annotations, target = false, sourcePrefix = '../../..' } = {}) {
  const modules = model.nodes.filter((node) => node.kind === 'module')
  const routes = model.nodes.filter((node) => node.kind === 'route')
  const data = model.nodes.filter((node) => node.layer === 'data' && node.kind !== 'module')
  const events = model.nodes.filter((node) => node.layer === 'event')
  const ai = model.nodes.filter((node) => node.layer === 'ai')
  const infra = model.nodes.filter((node) => node.layer === 'infra')
  const externals = model.nodes.filter((node) => node.kind === 'external-dependency' || node.layer === 'external')
  const lines = [
    `# Architecture: ${model.repository.name}`,
    '',
    '> Generated from executable source, configuration, schemas, manifests, CI/CD, and infrastructure-as-code. Markdown descriptions are not architecture evidence.',
    '',
    '## Executive architecture', '',
    `The scan found **${model.stats.files} source/config files**, **${model.stats.nodes} evidence-backed nodes**, and **${model.stats.edges} relationships**. The current system is represented exactly as detected; recommendations are separated from facts.`, '',
    '## Evidence and assumptions', '',
    `- Scope: ${code(model.repository.scope)}`,
    `- Model hash: ${code(model.modelHash)}`,
    `- Parse errors: ${model.stats.parseErrors}`,
    '- Secret values: never collected; only environment variable names are recorded.',
    '- Dynamic runtime wiring that cannot be proven statically remains an unknown.',
    '',
    '## Current architecture', '',
    '### Repository and domain modules', '',
    table(['Layer', 'Module', 'Evidence'], modules.slice(0, 250).map((node) => [node.layer, code(node.label), sourceLink(node, sourcePrefix)])),
    '### API and entry points', '',
    table(['Route', 'Method', 'Evidence'], routes.map((node) => [code(node.meta?.path || node.label), node.meta?.method || 'ANY', sourceLink(node, sourcePrefix)])),
    '### Data architecture and source-of-truth candidates', '',
    table(['Component', 'Kind', 'Evidence'], data.map((node) => [node.label, node.kind, sourceLink(node, sourcePrefix)])),
    '> A detected table/store is a source-of-truth candidate, not a proven ownership decision. Confirm ownership and transactional boundaries before changing the system.', '',
    '### Async and event architecture', '',
    table(['Event / broker', 'Kind', 'Evidence'], events.map((node) => [node.label, node.kind, sourceLink(node, sourcePrefix)])),
    '### AI, agents, RAG, and MCP', '',
    table(['Component', 'Kind', 'Evidence'], ai.filter((node) => node.kind !== 'module').map((node) => [node.label, node.kind, sourceLink(node, sourcePrefix)])),
    '### Infrastructure, delivery, and observability', '',
    table(['Component', 'Kind', 'Evidence'], infra.filter((node) => node.kind !== 'module').map((node) => [node.label, node.kind, sourceLink(node, sourcePrefix)])),
    '### External dependencies', '',
    table(['Dependency', 'Category', 'Evidence'], externals.map((node) => [node.label, node.meta?.category || node.kind, sourceLink(node, sourcePrefix)])),
    '## Data and command flows', '',
    table(['From', 'Interaction', 'To', 'Evidence'], model.edges.slice(0, 400).map((edge) => [code(edge.from), edge.kind, code(edge.to), sourceLink(edge, sourcePrefix)])),
    '## Architecture review', '',
  ]
  if (!model.findings.length) lines.push('No static architecture findings were emitted. This is not proof that runtime behavior is risk-free.', '')
  for (const finding of model.findings) {
    lines.push(`### ${finding.severity}: ${finding.title}`, '', `- Code: ${code(finding.code)}`, `- Evidence: ${(finding.evidence || []).map((e) => code(`${e.file}:${e.line}`)).join(', ') || 'not statically provable'}`, `- Recommendation: ${finding.recommendation}`, '')
  }
  lines.push('## Failure and scale considerations', '',
    '- Verify timeouts, bounded retries with jitter, circuit breakers, idempotency, backpressure, and graceful shutdown at every external boundary.',
    '- Treat asynchronous delivery as at-least-once unless the code proves a stronger contract.',
    '- Measure CPU, memory, I/O, connection pools, queue depth, database latency, and LLM latency before extracting services.',
    '- Prefer modular boundaries and selective extraction over premature microservices.', '',
    '## Security boundaries', '',
    '- Confirm authentication, authorization, tenant isolation, least privilege, secrets rotation, audit logs, and approval gates for destructive or production actions.',
    '- For AI tools, verify prompt-injection defenses, tool allowlists, sandboxing, data-exfiltration controls, and human approval boundaries.', '',
    '## Unknowns', '',
    '- Runtime-generated routes, dependency injection, reflection, plugins, and remote configuration may not be statically resolvable.',
    '- Traffic, SLOs, RPO/RTO, data residency, team ownership, and budget are not inferred from source code.', '')
  if (diff) lines.push('## Changes since previous scan', '', table(['Change', 'Count'], [['Added nodes', diff.addedNodes.length], ['Removed nodes', diff.removedNodes.length], ['Changed nodes', diff.changedNodes.length], ['Added edges', diff.addedEdges.length], ['Removed edges', diff.removedEdges.length], ['Changed edges', diff.changedEdges.length]]))
  if (annotations?.notes?.length) lines.push('## Human annotations', '', ...annotations.notes.map((note) => `- ${note}`), '')
  if (target) lines.push('## Target and migration mode', '', 'Target architecture was requested. Keep CURRENT facts above unchanged; add proposed components only through reviewed annotations with explicit assumptions, trade-offs, migration phases, and rollback.', '')
  lines.push('## Generated artifacts', '', '- `architecture.model.json` - deterministic evidence graph', '- `architecture.html` - self-contained interactive report', '- `architecture.drawio` - editable multi-page diagrams.net file', '- `mermaid/*.mmd` - copyable Mermaid views', '- `architecture.pdf` - printable report when a supported browser is available', '')
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const input = process.argv[2]; const output = process.argv[3]
  if (!input || !output) throw new Error('Usage: render-md.mjs <model.json> <ARCHITECTURE.md>')
  writeText(path.resolve(output), renderMarkdown(readJson(path.resolve(input))))
}
