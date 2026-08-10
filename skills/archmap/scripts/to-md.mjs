#!/usr/bin/env node
// archmap to-md.mjs — рендер architecture.json → ARCHITECTURE.md.
// Использование:
//   node to-md.mjs --in <architecture.json> --out <ARCHITECTURE.md>
// Mermaid-блоки генерируются функциями из to-mermaid.mjs (единый источник, без копипасты).
// Все счётчики — из data.stats; каждый факт несёт ссылку [file:line](file#Lline).

import fs from 'node:fs'
import path from 'node:path'
import { parseArgs, readJson } from './lib/core.mjs'
import { buildErd, buildOverview } from './to-mermaid.mjs'

const args = parseArgs(process.argv.slice(2), {
  in: { flag: '--in', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.in || !args.out) {
  console.log('Usage: node to-md.mjs --in <architecture.json> --out <ARCHITECTURE.md>')
  process.exit(args.help ? 0 : 1)
}
const data = readJson(args.in)
if (!data || !Array.isArray(data.nodes)) {
  console.error(`to-md: cannot read architecture ${args.in}`)
  process.exit(1)
}

function cell(value) {
  return String(value ?? '—').replace(/\|/g, '\\|').replace(/\n/g, ' ') || '—'
}

function sourceLink(source) {
  if (!source?.file) return '—'
  const label = `${source.file}:${source.line}`
  return `[${cell(label)}](${source.file}#L${source.line})`
}

function table(headers, rows) {
  if (!rows.length) return '_нет данных_\n'
  const lines = [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`),
  ]
  return lines.join('\n') + '\n'
}

const byId = (a, b) => a.id.localeCompare(b.id)
const nodesOf = (predicate) => data.nodes.filter(predicate).sort(byId)
const nodeById = new Map(data.nodes.map((node) => [node.id, node]))
const stats = data.stats ?? {}
const sections = []

// ── Шапка ────────────────────────────────────────────────────────────────────
sections.push(`# Архитектура: ${data.repo?.name ?? path.basename(data.root ?? '')}

Сгенерировано: ${data.generatedAt ?? '—'}

> ⚠️ Сгенерировано archmap из architecture.json — не редактируй руками:
> при следующем прогоне пайплайна файл будет перезаписан.
`)

// ── Сводка (счётчики строго из stats) ────────────────────────────────────────
sections.push(`## Сводка

${table(['Метрика', 'Значение'], [
  ['Файлов в репо', stats.files],
  ['Узлов', stats.nodes],
  ['Рёбер', stats.edges],
  ['Inferred узлов', stats.inferredNodes],
  ['Inferred рёбер', stats.inferredEdges],
  ['Циклов импортов', stats.cycles],
  ['Граф усечён (truncated)', stats.truncated ? 'да' : 'нет'],
])}`)

// ── Стеки ────────────────────────────────────────────────────────────────────
const evidenceText = (stack) => {
  const evidence = data.stacks?.evidence?.[stack]
  if (!evidence) return '—'
  if (evidence.file) return `file: ${evidence.file}`
  if (evidence.dep) return `dep: ${evidence.dep}`
  return Object.entries(evidence).map(([key, value]) => `${key}: ${value}`).join(', ')
}
sections.push(`## Стеки

${table(['Стек', 'Evidence', 'Parser'],
  (data.stacks?.detected ?? []).map((stack) => [stack, evidenceText(stack), data.stacks?.parser]))}`)

// ── Диаграммы (те же builder-функции, что и в to-mermaid.mjs) ────────────────
sections.push(`## Обзор

\`\`\`mermaid
${buildOverview(data).trimEnd()}
\`\`\`
`)
const tables = nodesOf((node) => node.kind === 'table')
if (tables.length) {
  sections.push(`## Модель данных

\`\`\`mermaid
${buildErd(data).trimEnd()}
\`\`\`
`)
}

// ── API-роуты ────────────────────────────────────────────────────────────────
const routes = nodesOf((node) => ['route', 'ws', 'webhook', 'cron'].includes(node.kind))
sections.push(`## API-роуты

${table(['Method', 'Path', 'Handler', 'Middleware', 'Source'], routes.map((node) => [
  node.meta?.method ?? node.kind.toUpperCase(),
  node.meta?.path ?? node.label,
  node.meta?.handler ? `${node.meta.handler.name ?? ''} ${node.meta.handler.file}:${node.meta.handler.line}`.trim() : '—',
  (node.meta?.middleware ?? []).join(', ') || '—',
  sourceLink(node.source),
]))}`)

// ── Таблицы данных ───────────────────────────────────────────────────────────
sections.push(`## Таблицы данных

${table(['Table', 'Columns count', 'PK', 'Source'], tables.map((node) => [
  node.label,
  (node.meta?.columns ?? []).length,
  (node.meta?.columns ?? []).filter((column) => column.pk).map((column) => column.name).join(', ') || '—',
  sourceLink(node.source),
]))}`)

// ── AI-агенты ────────────────────────────────────────────────────────────────
const agents = nodesOf((node) => node.kind === 'agent')
sections.push(`## AI-агенты

${table(['Agent', 'Model', 'Tools', 'Source'], agents.map((node) => [
  node.label,
  node.meta?.model,
  (node.meta?.tools ?? []).join(', ') || '—',
  sourceLink(node.source),
]))}`)

// ── ENV-переменные ───────────────────────────────────────────────────────────
const envNodes = nodesOf((node) => node.kind === 'env')
const readersOf = (envId) => data.edges
  .filter((edge) => edge.kind === 'reads-env' && edge.to === envId)
  .map((edge) => nodeById.get(edge.from)?.label ?? edge.from)
  .sort()
sections.push(`## ENV-переменные

${table(['Name', 'Читают', 'Source'], envNodes.map((node) => [
  node.label,
  readersOf(node.id).join(', ') || '—',
  sourceLink(node.source),
]))}`)

// ── Внешние сервисы и технологии ─────────────────────────────────────────────
const external = nodesOf((node) => ['external-service', 'tech'].includes(node.kind))
sections.push(`## Внешние сервисы и технологии

${table(['Name', 'Kind', 'Source'], external.map((node) => [
  node.label, node.kind, sourceLink(node.source),
]))}`)

// ── Inferred ─────────────────────────────────────────────────────────────────
const inferredNodes = nodesOf((node) => node.inferred)
const inferredEdges = data.edges.filter((edge) => edge.inferred).sort(byId)
const inferredLines = [
  ...inferredNodes.map((node) => `- узел \`${node.id}\` (${node.kind}) — ${node.label}`),
  ...inferredEdges.map((edge) => `- ребро \`${edge.kind}\`: \`${edge.from}\` → \`${edge.to}\``),
]
sections.push(`## ⚠️ Inferred (не подтверждено кодом)

${inferredLines.length ? inferredLines.join('\n') + '\n' : '_нет — все элементы подтверждены source:file:line_\n'}`)

// ── Циклы импортов ───────────────────────────────────────────────────────────
if ((stats.cycles ?? 0) > 0) {
  const cycleNodes = nodesOf((node) => node.meta?.cycle)
  sections.push(`## Циклы импортов

Обнаружено циклов (SCC): ${stats.cycles}. Участники:

${cycleNodes.map((node) => `- \`${node.id}\` — ${sourceLink(node.source)}`).join('\n')}
`)
}

const markdown = sections.join('\n')
fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true })
fs.writeFileSync(path.resolve(args.out), markdown)
console.log(`archmap to-md: ${routes.length} routes, ${tables.length} tables, ${agents.length} agents, ` +
  `${envNodes.length} env, ${inferredLines.length} inferred items → ${args.out}`)
