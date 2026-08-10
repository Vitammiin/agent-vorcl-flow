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

const assetsDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets')
const templateFile = path.join(assetsDir, 'template.html')
const template = fs.readFileSync(templateFile, 'utf8')

// < закрывает </script>-инъекцию: JSON не может преждевременно завершить блок данных
const json = JSON.stringify(data).replace(/</g, '\\u003c')
const title = String(args.title ?? data.repo?.name ?? 'architecture')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// ── Библиотека значков технологий ───────────────────────────────────────────
// assets/brand-icons.js встраивается инлайном ПЕРЕД основным скриптом: он объявляет
// window.ARCHMAP_BRANDS/ARCHMAP_GLYPHS, которыми пользуется раскладка. Файл может
// отсутствовать (старая копия скилла) — тогда просто пропускаем инъекцию.
const brandsFile = path.join(assetsDir, 'brand-icons.js')
let brandsScript = ''
let brandCount = 0
if (fs.existsSync(brandsFile)) {
  const source = fs.readFileSync(brandsFile, 'utf8')
  // Внутри JS ждать </script> неоткуда, но подстраховка обязательна: любое `</`
  // разрывается escape-последовательностью, невидимой для парсера JS.
  brandsScript = `<script>\n${source.replace(/<\//g, '<\\/')}\n</script>`
  // Считаем бренды так же, как их увидит браузер: исполняем ассет в пустом «window».
  // Сломанный ассет не должен ронять сборку — сводка просто останется без числа.
  try {
    const sandbox = {}
    new Function('window', 'globalThis', source)(sandbox, sandbox)
    brandCount = Object.keys(sandbox.ARCHMAP_BRANDS ?? {}).length
  } catch (error) {
    console.warn(`to-html: brand-icons.js не исполняется (${error.message}) — встраиваю как есть`)
  }
}

let html = template
  .replaceAll('__ARCHMAP_TITLE__', () => title)
  .replace('__ARCHMAP_JSON__', () => json)

if (brandsScript) {
  if (html.includes('__ARCHMAP_BRANDS__')) {
    html = html.replace('__ARCHMAP_BRANDS__', () => brandsScript)
  } else {
    // Плейсхолдера ещё нет — встраиваем перед блоком данных, иначе перед </body>
    const anchor = ['<script id="archmap-data"', '</body>'].find((token) => html.includes(token))
    if (anchor) html = html.replace(anchor, () => `${brandsScript}\n${anchor}`)
    else html += `\n${brandsScript}\n`
  }
} else {
  // Плейсхолдер без файла лучше вычистить, чем оставить мусор в разметке
  html = html.replace('__ARCHMAP_BRANDS__', '')
}

fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true })
fs.writeFileSync(args.out, html)

const size = fs.statSync(args.out).size
const kb = (size / 1024).toFixed(1)
const brands = brandsScript ? `, ${brandCount || '?'} brand icons` : ', brand icons: skipped'
console.log(`archmap to-html: ${data.nodes.length} nodes, ${data.edges.length} edges ` +
  `(${data.stats?.inferredNodes ?? '?'}+${data.stats?.inferredEdges ?? '?'} inferred)${brands} → ${args.out} (${kb} KB)`)
