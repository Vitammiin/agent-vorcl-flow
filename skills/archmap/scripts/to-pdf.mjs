#!/usr/bin/env node
// archmap to-pdf.mjs — architecture.html → architecture.pdf через headless Chrome/Chromium/Edge.
// Использование:
//   node to-pdf.mjs --in <architecture.html> --out <architecture.pdf>
// Браузер не найден → мягкий skip с подсказкой (exit 0): print-CSS уже встроен в HTML.

import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from './lib/core.mjs'

const args = parseArgs(process.argv.slice(2), {
  in: { flag: '--in', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.in || !args.out) {
  console.log('Usage: node to-pdf.mjs --in <architecture.html> --out <architecture.pdf>')
  process.exit(args.help ? 0 : 1)
}
const input = path.resolve(args.in)
if (!fs.existsSync(input)) {
  console.error(`to-pdf: input not found: ${input}`)
  process.exit(1)
}

// ── Поиск браузера: $CHROME_PATH → канонические macOS-пути → which ───────────
const candidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].filter(Boolean)
let chrome = candidates.find((candidate) => fs.existsSync(candidate)) ?? null
if (!chrome) {
  for (const name of ['google-chrome', 'chromium', 'chromium-browser']) {
    try {
      const found = execFileSync('which', [name], { encoding: 'utf8' }).trim()
      if (found) { chrome = found; break }
    } catch {
      // нет такого бинаря — пробуем следующий
    }
  }
}
if (!chrome) {
  console.log('archmap to-pdf: Chrome/Chromium/Edge не найден — PDF пропущен.')
  console.log('Подсказка: открой architecture.html в любом браузере и Cmd+P → Save as PDF (print-CSS уже встроен).')
  process.exit(0)
}

// ── Рендер ───────────────────────────────────────────────────────────────────
const out = path.resolve(args.out)
fs.mkdirSync(path.dirname(out), { recursive: true })
const fileUrl = pathToFileURL(input).href
try {
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${out}`,
    fileUrl,
  ], { timeout: 60_000, stdio: 'pipe' })
} catch (error) {
  console.error(`to-pdf: браузер завершился с ошибкой: ${error.message}`)
  process.exit(1)
}

let size = 0
try {
  size = fs.statSync(out).size
} catch {
  size = 0
}
if (size <= 0) {
  console.error(`to-pdf: PDF не появился или пустой: ${out}`)
  process.exit(1)
}
console.log(`archmap to-pdf: ${path.basename(chrome)} → ${out} (${(size / 1024).toFixed(1)} KB)`)
