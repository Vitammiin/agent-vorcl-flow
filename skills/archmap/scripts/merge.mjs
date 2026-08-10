#!/usr/bin/env node
// archmap merge.mjs — фаза 2: part-файлы (+ LLM-аннотации) → architecture.json.
// Использование:
//   node merge.mjs --root <target> --parts "<dir>/*.part.json" [--annotate <annotations.json>] --out <architecture.json> [--check]
// Гарантии контракта:
//   - каждое from/to существует (иначе stub-узел inferred:true);
//   - аннотация без подтверждённого source.file:line принудительно inferred:true;
//   - стабильная сортировка → повторный прогон даёт байт-в-байт тот же JSON.

import fs from 'node:fs'
import path from 'node:path'
import {
  SCHEMA_VERSION, LAYERS, parseArgs, readJson, writeJson, sortGraph,
  fileExistsWithLine, toPosix,
} from './lib/core.mjs'
import { mergeParts, ensureReferentialIntegrity, validateGraph, findCycles, collapseModulesToDirs, buildGroups } from './lib/graph.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  parts: { flag: '--parts', default: null },
  annotate: { flag: '--annotate', default: null },
  out: { flag: '--out', default: null },
  check: { flag: '--check', default: false, boolean: true },
  detail: { flag: '--detail', default: 'auto' }, // auto | full: full не схлопывает модули в директории
})
if (args.help || !args.parts || !args.out) {
  console.log('Usage: node merge.mjs --root <target> --parts "<dir>/*.part.json" [--annotate <file>] --out <file> [--check]')
  process.exit(args.help ? 0 : 1)
}
const root = path.resolve(args.root)

// glob-лайт: поддерживаем только "<dir>/*.part.json" и явные пути через запятую
function resolveParts(pattern) {
  if (pattern.includes(',')) return pattern.split(',').map((item) => item.trim())
  if (pattern.includes('*')) {
    const dir = path.dirname(pattern)
    const suffix = path.basename(pattern).replace('*', '')
    return fs.readdirSync(dir)
      .filter((name) => name.endsWith(suffix))
      .map((name) => path.join(dir, name))
      .sort()
  }
  return [pattern]
}

const partFiles = resolveParts(args.parts)
const parts = []
for (const file of partFiles) {
  const data = readJson(file)
  if (!data) {
    console.error(`merge: cannot read part ${file}`)
    process.exit(1)
  }
  if (!data.part) data.part = path.basename(file).replace(/\..*$/, '')
  parts.push(data)
}

// ── LLM-аннотации: та же форма {nodes, edges}; доказательства проверяются ────
const annotationStats = { nodes: 0, edges: 0, demotedToInferred: 0 }
if (args.annotate) {
  const annotations = readJson(args.annotate)
  if (!annotations) {
    console.error(`merge: cannot read annotations ${args.annotate}`)
    process.exit(1)
  }
  const demote = (item) => {
    if (!item.inferred && !fileExistsWithLine(root, item.source)) {
      item.inferred = true
      annotationStats.demotedToInferred++
    }
    if (!item.source) item.source = { file: '', line: 0 }
    if (typeof item.inferred !== 'boolean') item.inferred = true
    return item
  }
  const nodes = (annotations.nodes ?? []).map(demote)
  const edges = (annotations.edges ?? []).map((edge) => {
    demote(edge)
    if (!edge.id) edge.id = `e:${edge.kind}:${edge.from}->${edge.to}`
    return edge
  })
  annotationStats.nodes = nodes.length
  annotationStats.edges = edges.length
  parts.push({ part: 'annotations', nodes, edges })
}

const merged = mergeParts(parts)
const conflicts = merged.conflicts
const stubs = ensureReferentialIntegrity(merged.nodes, merged.edges)
// Схлопывание больших графов делает merge (после интеграции всех part-файлов):
// так рёбра uses/reads-env/handles из других экстракторов ремапятся вместе с модулями.
const collapsed = args.detail === 'full'
  ? { nodes: merged.nodes, edges: merged.edges, collapsed: false }
  : collapseModulesToDirs(merged.nodes, merged.edges)
const { nodes, edges } = collapsed
sortGraph(nodes, edges)

const cycles = findCycles(nodes, edges)
const cycleIds = new Set(cycles.flat())
for (const node of nodes) if (cycleIds.has(node.id)) node.meta.cycle = true

const errors = validateGraph(nodes, edges)
if (errors.length) {
  console.error(`merge: контракт нарушен (${errors.length}):`)
  for (const error of errors.slice(0, 20)) console.error(`  - ${error}`)
  if (args.check) process.exit(2)
}

// Собираем метаданные из part-файлов scan-плана, если рядом лежит plan.json
const planFile = path.join(path.dirname(path.resolve(args.out)), 'plan.json')
const plan = readJson(planFile)

const truncated = parts.some((part) => part.stats?.truncated === true)
const architecture = {
  version: SCHEMA_VERSION,
  // берём время скана: повторный merge тех же part-файлов даёт байт-в-байт тот же JSON
  generatedAt: plan?.scannedAt ?? new Date().toISOString(),
  root: toPosix(root),
  repo: plan?.repo ?? { name: path.basename(root), monorepo: false, packages: [] },
  stacks: plan?.stacks ?? { detected: [], parser: 'regex', tsVersion: null, evidence: {} },
  layers: LAYERS,
  nodes,
  edges,
  ...buildGroups(nodes, edges),
  stats: {
    files: plan?.files?.total ?? null,
    nodes: nodes.length,
    edges: edges.length,
    inferredNodes: nodes.filter((node) => node.inferred).length,
    inferredEdges: edges.filter((edge) => edge.inferred).length,
    stubs: stubs.length,
    conflicts: conflicts.length,
    cycles: cycles.length,
    truncated: truncated || collapsed.collapsed,
    collapsedModules: collapsed.collapsed,
    annotations: args.annotate ? annotationStats : null,
    validationErrors: errors.length,
  },
}

architecture.stats.groups = architecture.groups.length
architecture.stats.groupEdges = architecture.groupEdges.length

writeJson(args.out, architecture)
console.log(`archmap merge: ${nodes.length} nodes, ${edges.length} edges, ` +
  `${architecture.groups.length} groups/${architecture.groupEdges.length} flows ` +
  `(${architecture.stats.inferredNodes}+${architecture.stats.inferredEdges} inferred, ` +
  `${stubs.length} stubs, ${cycles.length} cycles` +
  (args.annotate ? `, annotations: ${annotationStats.nodes}n/${annotationStats.edges}e, demoted ${annotationStats.demotedToInferred}` : '') +
  `) → ${args.out}`)
if (errors.length && !args.check) console.log(`merge: WARNING — ${errors.length} validation errors (run with --check to fail)`)
