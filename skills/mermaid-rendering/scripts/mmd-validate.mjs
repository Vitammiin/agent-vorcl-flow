#!/usr/bin/env node
// mmd-validate.mjs — рендер-валидатор Mermaid без зависимостей.
//
// Зачем: LLM не является валидатором Mermaid, а «глазами» ошибку не видно.
// Скрипт достаёт каждый ```mermaid блок из markdown (или берёт .mmd целиком),
// прогоняет через настоящий @mermaid-js/mermaid-cli и печатает PASS/FAIL
// с номером строки и сообщением парсера.
//
// Использование:
//   node mmd-validate.mjs docs/architecture.md src/*.mmd
//   node mmd-validate.mjs --list README.md          # только показать блоки, без рендера
//   node mmd-validate.mjs --json docs/             # машинный вывод
//   MMD_CONCURRENCY=4 node mmd-validate.mjs docs/  # параллельность (по умолчанию 2)
//
// Exit code: 0 — все блоки валидны, 1 — есть FAIL, 2 — ошибка вызова,
//            3 — сломано окружение рендера (нет headless-браузера), диаграммы не проверены.
//
// ВАЖНО про детекцию ошибок. Ненулевой exit-код mmdc — основной признак,
// но SVG дополнительно проверяется на error-графику mermaid. Не используй
// для этого CSS-класс `.error-icon`: он присутствует в ЛЮБОМ mermaid-SVG
// (это часть встроенной таблицы стилей) и даёт ложные срабатывания.
// Достоверные маркеры — текст «Syntax error in text» и
// `aria-roledescription="error"`.

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawn } from 'node:child_process'

const ERROR_SVG_MARKERS = /Syntax error in text|aria-roledescription="error"/

// Отказ окружения, а не диаграммы. mmdc рендерит через puppeteer и выходит с
// кодом 1 и при синтаксической ошибке, и при отсутствующем браузере — по коду
// их не различить. Не разделив их, легко начать «чинить» валидный .mmd.
// Осторожно с широкими шаблонами: стек-трейс ОБЫЧНОЙ синтаксической ошибки
// тоже проходит через puppeteer-core, поэтому по слову "puppeteer" отличить
// нельзя. Матчим только фразы запуска браузера и всегда уступаем парсеру.
const SETUP_ERROR_MARKERS =
  /Could not find Chrome|Tried to find the browser|Failed to launch the browser|no executable was found|Browser was not found|Cannot find module|spawn \w+ ENOENT/i
const DIAGRAM_ERROR_MARKERS = /Parse error|UnknownDiagramError|Syntax error/i

function isSetupFailure(log) {
  if (DIAGRAM_ERROR_MARKERS.test(log)) return false
  return SETUP_ERROR_MARKERS.test(log)
}

const argv = process.argv.slice(2)
const flags = new Set(argv.filter((a) => a.startsWith('--')))
const inputs = argv.filter((a) => !a.startsWith('--'))
const listOnly = flags.has('--list')
const asJson = flags.has('--json')
const concurrency = Math.max(1, Number(process.env.MMD_CONCURRENCY || 2))

if (!inputs.length) {
  process.stderr.write('usage: node mmd-validate.mjs [--list] [--json] <file.md|file.mmd|dir> ...\n')
  process.exit(2)
}

function collectFiles(target) {
  const stat = fs.statSync(target)
  if (stat.isFile()) return [target]
  const out = []
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = path.join(target, entry.name)
    if (entry.isDirectory()) out.push(...collectFiles(full))
    else if (/\.(md|mmd|mermaid)$/.test(entry.name)) out.push(full)
  }
  return out
}

// Блоки ```mermaid из markdown; .mmd/.mermaid берём целиком.
function extractBlocks(file) {
  const source = fs.readFileSync(file, 'utf8')
  if (!file.endsWith('.md')) return [{ code: source, line: 1 }]
  const blocks = []
  const lines = source.split('\n')
  let current = null
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (current === null) {
      if (/^\s*```+\s*mermaid\s*$/.test(line)) current = { code: [], line: i + 2 }
      continue
    }
    if (/^\s*```+\s*$/.test(line)) {
      blocks.push({ code: current.code.join('\n'), line: current.line })
      current = null
    } else {
      current.code.push(line)
    }
  }
  return blocks
}

function renderOnce(code, id, tmp) {
  return new Promise((resolve) => {
    const input = path.join(tmp, `${id}.mmd`)
    const output = path.join(tmp, `${id}.svg`)
    fs.writeFileSync(input, code)
    const child = spawn('npx', ['-p', '@mermaid-js/mermaid-cli', 'mmdc', '-i', input, '-o', output, '-q'], {
      env: process.env,
    })
    let log = ''
    child.stderr.on('data', (chunk) => { log += chunk })
    child.stdout.on('data', (chunk) => { log += chunk })
    child.on('error', (error) => resolve({ ok: false, setup: true, error: `не удалось запустить mmdc: ${error.message}` }))
    child.on('close', (code2) => {
      if (code2 !== 0) {
        const message = firstLines(log)
        return resolve({ ok: false, setup: isSetupFailure(log), error: message })
      }
      let svg = ''
      try {
        svg = fs.readFileSync(output, 'utf8')
      } catch {
        return resolve({ ok: false, setup: false, error: 'mmdc завершился успешно, но SVG не создан' })
      }
      if (ERROR_SVG_MARKERS.test(svg)) {
        return resolve({ ok: false, setup: false, error: 'mmdc вернул 0, но отрисована error-графика mermaid' })
      }
      resolve({ ok: true, setup: false, error: '' })
    })
  })
}

function firstLines(log) {
  return log
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^Generating|^at |^\s*$/.test(line))
    .slice(0, 4)
    .join(' | ')
    .slice(0, 500)
}

const jobs = []
for (const target of inputs) {
  for (const file of collectFiles(target)) {
    for (const block of extractBlocks(file)) jobs.push({ file, ...block })
  }
}

if (listOnly) {
  for (const job of jobs) {
    const header = job.code.split('\n').find((line) => line.trim() && !line.trim().startsWith('---')) || ''
    process.stdout.write(`${job.file}:${job.line}\t${header.trim().slice(0, 60)}\n`)
  }
  process.stdout.write(`\nНайдено блоков: ${jobs.length}\n`)
  process.exit(0)
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mmd-validate-'))
const results = new Array(jobs.length)
let cursor = 0

async function worker() {
  while (cursor < jobs.length) {
    const index = cursor++
    const job = jobs[index]
    const result = await renderOnce(job.code, `block-${index}`, tmp)
    results[index] = { ...job, ...result }
  }
}

try {
  await Promise.all(Array.from({ length: Math.min(concurrency, jobs.length) }, worker))
  const setup = results.filter((r) => !r.ok && r.setup)
  const failed = results.filter((r) => !r.ok && !r.setup)
  if (asJson) {
    process.stdout.write(`${JSON.stringify(
      {
        total: results.length,
        passed: results.length - failed.length - setup.length,
        failed: failed.length,
        setupErrors: setup.length,
        failures: failed.map(({ file, line, error, code }) => ({ file, line, error, code })),
        setup: setup.map(({ file, line, error }) => ({ file, line, error })),
      },
      null,
      2,
    )}\n`)
  } else {
    for (const r of results) {
      if (r.ok) {
        process.stdout.write(`PASS ${r.file}:${r.line}\n`)
      } else if (r.setup) {
        process.stdout.write(`SETUP ${r.file}:${r.line}\n      ${r.error}\n`)
      } else {
        process.stdout.write(`FAIL ${r.file}:${r.line}\n      ${r.error}\n`)
        process.stdout.write(`${r.code.split('\n').map((l) => `      ${l}`).join('\n')}\n`)
      }
    }
    process.stdout.write(`\nИТОГ: ${results.length - failed.length - setup.length} PASS, ${failed.length} FAIL из ${results.length}\n`)
    if (setup.length) {
      process.stdout.write(
        `\n⚠️  ${setup.length} блок(ов) не проверены: сломано окружение рендера, а НЕ диаграмма.\n` +
          `   mmdc рендерит через headless-браузер. Поставь его:\n` +
          `     npx puppeteer browsers install chrome-headless-shell\n` +
          `   или укажи системный Chrome через PUPPETEER_EXECUTABLE_PATH.\n` +
          `   НЕ правь .mmd по этой ошибке — синтаксис может быть верным.\n`,
      )
    }
  }
  process.exit(setup.length ? 3 : failed.length ? 1 : 0)
} finally {
  fs.rmSync(tmp, { recursive: true, force: true })
}
