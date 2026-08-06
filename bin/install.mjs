#!/usr/bin/env node
// Установщик Agent-Vorcl-Flow.
//   Claude Code → настоящий плагин (CLI, фолбэк — запись в ~/.claude/settings.json).
//   Codex       → skills + config.toml + AGENTS.md, вмёрженные в ~/.codex / ~/.agents.
//
// Запуск:
//   npx github:Vitammiin/agent-vorcl-flow          # без публикации в npm
//   npx agent-vorcl-flow                            # после npm publish
//   … [--claude] [--codex]                          # без флагов — оба, что найдёт в PATH
//
// Ключи установщик НЕ трогает: их каждый задаёт сам через env (см. вывод в конце).
// Переопределения: AVF_REPO=<owner/repo>, CODEX_HOME=<path>.

import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

// Node >= 18: fs.cpSync и синтаксис ||= старее не работают.
const nodeMajor = Number(process.versions.node.split('.')[0])
if (nodeMajor < 18) {
  console.error(`✖ Требуется Node.js >= 18, найден ${process.versions.node}. Обнови Node и запусти установку снова.`)
  process.exit(1)
}

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REPO = process.env.AVF_REPO || 'Vitammiin/agent-vorcl-flow'
const MARKET = 'agent-vorcl-flow' // .claude-plugin/marketplace.json → name
const PLUGIN = 'agent-vorcl-flow' // .claude-plugin/plugin.json → name
const PLUGIN_ID = `${PLUGIN}@${MARKET}`
const MARK_S = '# >>> agent-vorcl-flow >>>'
const MARK_E = '# <<< agent-vorcl-flow <<<'

const argv = process.argv.slice(2)
const wantClaude = argv.includes('--claude')
const wantCodex = argv.includes('--codex')
const both = !wantClaude && !wantCodex // без флагов — оба

const log = (m) => console.log(m)
const ok = (m) => console.log(`  ✔ ${m}`)
const warn = (m) => console.error(`  ⚠ ${m}`) // предупреждения и ошибки — в stderr

function hasCmd(cmd) {
  const r = spawnSync(cmd, ['--version'], { stdio: 'ignore' })
  return !r.error // ENOENT → r.error задан
}

// ---------- Claude Code ----------
function installClaude() {
  log('\n▸ Claude Code')
  if (hasCmd('claude')) {
    const add = spawnSync('claude', ['plugin', 'marketplace', 'add', REPO], { stdio: 'inherit' })
    const inst =
      add.status === 0
        ? spawnSync('claude', ['plugin', 'install', PLUGIN_ID, '--scope', 'user'], { stdio: 'inherit' })
        : add
    if (inst.status === 0) {
      ok(`плагин установлен через CLI: ${PLUGIN_ID}`)
      log('    активация: перезапусти Claude или выполни /reload-plugins')
      return
    }
    warn('CLI-установка не удалась — пишу в settings.json напрямую')
  } else {
    warn('claude CLI не найден в PATH — пишу в settings.json напрямую')
  }
  writeClaudeSettings()
}

function writeClaudeSettings() {
  const dir = path.join(os.homedir(), '.claude')
  const file = path.join(dir, 'settings.json')
  fs.mkdirSync(dir, { recursive: true })
  let s = {}
  if (fs.existsSync(file)) {
    try {
      s = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch {
      warn(`битый JSON в ${file} — правка settings.json пропущена, остальная установка продолжается; поправь файл и запусти снова`)
      return
    }
  }
  s.extraKnownMarketplaces ||= {}
  s.extraKnownMarketplaces[MARKET] = { source: { source: 'github', repo: REPO }, autoUpdate: true }
  s.enabledPlugins ||= []
  if (!s.enabledPlugins.includes(PLUGIN_ID)) s.enabledPlugins.push(PLUGIN_ID)
  fs.writeFileSync(file, JSON.stringify(s, null, 2) + '\n')
  ok(`зарегистрировано в ${file}`)
  log(`    marketplace ${MARKET} (github:${REPO}) + enabledPlugins ${PLUGIN_ID}`)
  log('    активация: перезапусти Claude или выполни /reload-plugins')
}

// ---------- Codex ----------
function installCodex() {
  log('\n▸ Codex')
  const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), '.codex')
  const skillsDir = path.join(os.homedir(), '.agents', 'skills')
  const srcSkills = path.join(PKG_ROOT, 'codex', 'skills')
  const srcConfig = path.join(PKG_ROOT, 'codex', 'config.toml')
  const srcAgents = path.join(PKG_ROOT, 'codex', 'AGENTS.md')

  if (!fs.existsSync(srcSkills)) {
    warn(`нет ${srcSkills} — codex-адаптер в пакете отсутствует, пропуск`)
    return
  }
  fs.mkdirSync(skillsDir, { recursive: true })
  fs.cpSync(srcSkills, skillsDir, { recursive: true })
  ok(`скиллы → ${skillsDir}`)

  fs.mkdirSync(codexHome, { recursive: true })
  mergeBlock(path.join(codexHome, 'config.toml'), fs.readFileSync(srcConfig, 'utf8'), 'config.toml (mcp_servers + profiles)')
  mergeBlock(path.join(codexHome, 'AGENTS.md'), fs.readFileSync(srcAgents, 'utf8'), 'AGENTS.md')
}

function mergeBlock(file, content, label) {
  const cur = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
  if (cur.includes(MARK_S)) {
    log(`  ${label}: уже установлено — пропуск`)
    return
  }
  const block = `\n${MARK_S}\n${content.replace(/\s*$/, '')}\n${MARK_E}\n`
  fs.writeFileSync(file, cur + block)
  ok(`${label} → ${file}`)
}

// ---------- banner ----------
// Цветное приветствие. Только для живого терминала: в CI/пайпах и при NO_COLOR — простой текст.
function banner() {
  const readCount = (fn) => { try { return fn() } catch { return null } }
  const version = readCount(() => JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf8')).version) || ''
  const agents = readCount(() => fs.readdirSync(path.join(PKG_ROOT, 'agents')).filter((f) => f.endsWith('.md')).length)
  const skills = readCount(() => fs.readdirSync(path.join(PKG_ROOT, 'skills'), { withFileTypes: true }).filter((d) => d.isDirectory()).length)
  const commands = readCount(() => {
    const root = path.join(PKG_ROOT, 'commands')
    return fs.readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory())
      .reduce((n, d) => n + fs.readdirSync(path.join(root, d.name)).filter((f) => f.endsWith('.md')).length, 0)
  })
  const stats = agents ? `${agents} агентов · ${skills} скиллов · ${commands} команд` : ''
  const useColor = !process.env.NO_COLOR && process.env.TERM !== 'dumb' && (process.stdout.isTTY || process.env.FORCE_COLOR)

  if (!useColor) {
    log(`Agent-Vorcl-Flow${version ? ` v${version}` : ''} — установщик${stats ? ` (${stats})` : ''}`)
    return
  }

  const art = [
    '██╗   ██╗ ██████╗ ██████╗  ██████╗██╗',
    '██║   ██║██╔═══██╗██╔══██╗██╔════╝██║',
    '██║   ██║██║   ██║██████╔╝██║     ██║',
    '╚██╗ ██╔╝██║   ██║██╔══██╗██║     ██║',
    ' ╚████╔╝ ╚██████╔╝██║  ██║╚██████╗███████╗',
    '  ╚═══╝   ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚══════╝',
  ]
  const gradient = [51, 45, 39, 99, 135, 141] // 256-color: cyan → purple
  const c = (code, s) => `\x1b[38;5;${code}m${s}\x1b[0m`
  const dim = (s) => `\x1b[2m${s}\x1b[0m`
  const bold = (s) => `\x1b[1m${s}\x1b[0m`

  log('')
  art.forEach((line, i) => log('  ' + c(gradient[i], line)))
  log('')
  log('  ' + bold(c(45, 'AGENT VORCL FLOW')) + (version ? ' ' + c(141, `v${version}`) : '') + (stats ? dim(`  —  ${stats}`) : ''))
  log('  ' + dim('Команда специализированных AI-субагентов для Claude Code + адаптер GPT Codex'))
  log('')
}

// ---------- run ----------
// Шаги независимы: сбой Claude-части не должен блокировать Codex-часть (и наоборот).
let hadError = false
function runStep(name, fn) {
  try {
    fn()
  } catch (e) {
    hadError = true
    console.error(`  ✖ ${name}: ${e.message}`)
  }
}

banner()
if (argv.includes('--banner-only')) process.exit(0) // предпросмотр приветствия без установки
if (both || wantClaude) runStep('Claude Code', installClaude)
if (both || wantCodex) runStep('Codex', installCodex)

log('\n▸ Ключи (каждый задаёт свои через окружение — плагин ничего не хостит):')
log('    export ANTHROPIC_API_KEY=…    # task-master')
log('    export FIRECRAWL_API_KEY=…    # firecrawl')
log('    export GITHUB_TOKEN=…         # github')
log('    # агент database: POSTGRES_URL / MONGODB_URI / REDIS_URL — подключение к БД твоего проекта')
if (hadError) {
  console.error('\nЗавершено с ошибками — см. ✖ выше. Установленные части рабочие, сбойные перезапусти после исправления.')
  process.exit(1)
}
log('\nГотово.')
