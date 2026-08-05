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
const warn = (m) => console.log(`  ⚠ ${m}`)

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
      warn(`не удалось разобрать ${file} — Claude пропущен, поправь JSON и запусти снова`)
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

// ---------- run ----------
log('Agent-Vorcl-Flow — установщик')
if (both || wantClaude) installClaude()
if (both || wantCodex) installCodex()

log('\n▸ Ключи (каждый задаёт свои через окружение — плагин ничего не хостит):')
log('    export ANTHROPIC_API_KEY=…    # task-master')
log('    export FIRECRAWL_API_KEY=…    # firecrawl')
log('    export GITHUB_TOKEN=…         # github')
log('    # агент database: POSTGRES_URL / MONGODB_URI / REDIS_URL — подключение к БД твоего проекта')
log('\nГотово.')
