#!/usr/bin/env node
// archmap to-html.mjs — рендер architecture.json → self-contained интерактивный HTML.
// Использование:
//   node to-html.mjs --in <architecture.json> --out <architecture.html> [--title <str>]
// Вся интерактивность живёт в assets/template.html; здесь только подстановка данных.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs, readJson } from './lib/core.mjs'

const args = parseArgs(process.argv.slice(2), {
  in: { flag: '--in', default: null },
  out: { flag: '--out', default: null },
  title: { flag: '--title', default: null },
})
if (args.help || !args.in || !args.out) {
  console.log('Usage: node to-html.mjs --in <architecture.json> --out <architecture.html> [--title <str>]')
  process.exit(args.help ? 0 : 1)
}

const data = readJson(args.in)
if (!data || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
  console.error(`to-html: cannot read architecture json ${args.in}`)
  process.exit(1)
}

const templateFile = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/template.html')
const template = fs.readFileSync(templateFile, 'utf8')

// < закрывает </script>-инъекцию: JSON не может преждевременно завершить блок данных
const json = JSON.stringify(data).replace(/</g, '\\u003c')
const title = String(args.title ?? data.repo?.name ?? 'architecture')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const html = template
  .replaceAll('__ARCHMAP_TITLE__', () => title)
  .replace('__ARCHMAP_JSON__', () => json)

fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true })
fs.writeFileSync(args.out, html)

const size = fs.statSync(args.out).size
const kb = (size / 1024).toFixed(1)
console.log(`archmap to-html: ${data.nodes.length} nodes, ${data.edges.length} edges ` +
  `(${data.stats?.inferredNodes ?? '?'}+${data.stats?.inferredEdges ?? '?'} inferred) → ${args.out} (${kb} KB)`)
