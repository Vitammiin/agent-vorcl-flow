#!/usr/bin/env node
// Установщик Agent-Vorcl-Flow.
//   Claude Code → настоящий плагин (CLI, фолбэк — запись в ~/.claude/settings.json).
//   Codex       → skills + config.toml + AGENTS.md, вмёрженные в ~/.codex / ~/.agents.
//   Cursor      → skills + custom subagents + MCP, установленные в ~/.cursor.
//
// Запуск:
//   npx github:Vitammiin/agent-vorcl-flow          # без публикации в npm
//   npx agent-vorcl-flow                            # после npm publish
//   … [--claude] [--codex] [--cursor]               # без флагов — все три адаптера
//
// Ключи установщик НЕ трогает: их каждый задаёт сам через env (см. вывод в конце).
// Переопределения: AVF_REPO=<owner/repo>, CODEX_HOME=<path>, CURSOR_HOME=<path>, AVF_SKILLS_DIR=<path>.

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
const wantCursor = argv.includes('--cursor')
const all = !wantClaude && !wantCodex && !wantCursor // без флагов — все поддерживаемые среды

const log = (m) => console.log(m)
const ok = (m) => console.log(`  ✔ ${m}`)
const warn = (m) => console.error(`  ⚠ ${m}`) // предупреждения и ошибки — в stderr

function hasCmd(cmd) {
  const r = spawnSync(cmd, ['--version'], { stdio: 'ignore' })
  return !r.error // ENOENT → r.error задан
}

// Официальный Firecrawl installer ставит собственные firecrawl-* skills.
// Они имеют приоритет: AVF добавляет только отсутствующие fallback-скиллы.
function copySkillsPreservingUpstream(srcSkills, skillsDir) {
  fs.mkdirSync(skillsDir, { recursive: true })
  let copied = 0
  let preserved = 0
  for (const entry of fs.readdirSync(srcSkills, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const target = path.join(skillsDir, entry.name)
    const upstreamOwned = entry.name === 'firecrawl' || entry.name.startsWith('firecrawl-')
    if (upstreamOwned && fs.existsSync(target)) {
      preserved++
      continue
    }
    fs.cpSync(path.join(srcSkills, entry.name), target, { recursive: true })
    copied++
  }
  return { copied, preserved }
}

// Liveboard carries its dependency-free runtime beside the canonical skill.
// Codex/Cursor mirrors keep prompts; installation overlays the executable assets.
function installLiveboardRuntime(skillsDir) {
  const source = path.join(PKG_ROOT, 'skills', 'liveboard')
  if (!fs.existsSync(source)) return
  fs.cpSync(source, path.join(skillsDir, 'liveboard'), { recursive: true })
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
  const skillsDir = process.env.AVF_SKILLS_DIR || path.join(os.homedir(), '.agents', 'skills')
  const srcSkills = path.join(PKG_ROOT, 'codex', 'skills')
  const srcConfig = path.join(PKG_ROOT, 'codex', 'config.toml')
  const srcAgents = path.join(PKG_ROOT, 'codex', 'AGENTS.md')

  if (!fs.existsSync(srcSkills)) {
    warn(`нет ${srcSkills} — codex-адаптер в пакете отсутствует, пропуск`)
    return
  }
  const copied = copySkillsPreservingUpstream(srcSkills, skillsDir)
  installLiveboardRuntime(skillsDir)
  ok(`скиллы → ${skillsDir} (${copied.copied} скопировано${copied.preserved ? `, ${copied.preserved} upstream Firecrawl сохранено` : ''})`)

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

// ---------- Cursor ----------
function installCursor() {
  log('\n▸ Cursor')
  const cursorHome = process.env.CURSOR_HOME || path.join(os.homedir(), '.cursor')
  const srcSkills = path.join(PKG_ROOT, 'codex', 'skills')
  const srcAgents = path.join(PKG_ROOT, 'agents')
  const srcMcp = path.join(PKG_ROOT, 'cursor', 'mcp.json')

  if (!fs.existsSync(srcSkills) || !fs.existsSync(srcAgents) || !fs.existsSync(srcMcp)) {
    warn('cursor-адаптер в пакете неполный — пропуск')
    return
  }

  const skillsDir = path.join(cursorHome, 'skills')
  const copied = copySkillsPreservingUpstream(srcSkills, skillsDir)
  installLiveboardRuntime(skillsDir)
  ok(`скиллы → ${skillsDir} (${copied.copied} скопировано${copied.preserved ? `, ${copied.preserved} upstream Firecrawl сохранено` : ''})`)

  const agentsDir = path.join(cursorHome, 'agents')
  fs.mkdirSync(agentsDir, { recursive: true })
  const agentFiles = fs.readdirSync(srcAgents).filter((file) => file.endsWith('.md'))
  for (const file of agentFiles) {
    const source = fs.readFileSync(path.join(srcAgents, file), 'utf8')
    fs.writeFileSync(path.join(agentsDir, `avf-${file}`), toCursorAgent(source, file))
  }
  ok(`${agentFiles.length} субагентов → ${agentsDir}`)

  mergeCursorMcp(path.join(cursorHome, 'mcp.json'), srcMcp)
  log('    активация: перезапусти Cursor или открой новое окно Agent')
}

function toCursorAgent(source, file) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error(`неверный frontmatter агента ${file}`)
  const frontmatter = match[1]
  const field = (name) => frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim()
  const name = field('name')
  const description = field('description')
  const tools = field('tools') || ''
  if (!name || !description) throw new Error(`у агента ${file} нет name/description`)

  const readonly = !/(^|,\s*)(Edit|Write)(,|$)/.test(tools)
  const body = match[2].replace(/\/([a-z]+):([a-z0-9-]+)/g, '/$1-$2')
  return `---\nname: avf-${name}\ndescription: ${JSON.stringify(description)}\nmodel: inherit\nreadonly: ${readonly}\n---\n${body}`
}

function mergeCursorMcp(file, sourceFile) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  let current = { mcpServers: {} }
  if (fs.existsSync(file)) {
    try {
      current = JSON.parse(fs.readFileSync(file, 'utf8'))
    } catch {
      warn(`битый JSON в ${file} — MCP-конфиг Cursor пропущен; скиллы и агенты установлены`)
      return
    }
  }
  if (!current || typeof current !== 'object' || Array.isArray(current)) {
    warn(`неверная структура ${file} — MCP-конфиг Cursor пропущен; скиллы и агенты установлены`)
    return
  }
  const incoming = JSON.parse(fs.readFileSync(sourceFile, 'utf8'))
  if (current.mcpServers != null && (typeof current.mcpServers !== 'object' || Array.isArray(current.mcpServers))) {
    warn(`поле mcpServers в ${file} не является объектом — MCP-конфиг Cursor пропущен`)
    return
  }
  current.mcpServers ||= {}
  let added = 0
  let kept = 0
  for (const [name, config] of Object.entries(incoming.mcpServers || {})) {
    if (Object.hasOwn(current.mcpServers, name)) {
      kept++
      continue
    }
    current.mcpServers[name] = config
    added++
  }
  fs.writeFileSync(file, JSON.stringify(current, null, 2) + '\n')
  ok(`MCP → ${file} (${added} добавлено${kept ? `, ${kept} существующих сохранено` : ''})`)
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
    const entries = fs.readdirSync(root, { withFileTypes: true })
    const topLevel = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md')).length
    return topLevel + entries.filter((entry) => entry.isDirectory())
      .reduce((n, entry) => n + fs.readdirSync(path.join(root, entry.name)).filter((f) => f.endsWith('.md')).length, 0)
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
  log('  ' + dim('Специализированные AI-субагенты для Claude Code, GPT Codex и Cursor'))
  log('')
}

// ---------- run ----------
// Шаги независимы: сбой одного адаптера не должен блокировать остальные.
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
if (all || wantClaude) runStep('Claude Code', installClaude)
if (all || wantCodex) runStep('Codex', installCodex)
if (all || wantCursor) runStep('Cursor', installCursor)

log('\n▸ Ключи (каждый задаёт свои через окружение — удалённых сервисов AVF нет):')
log('    export ANTHROPIC_API_KEY=…    # Task Master: Claude (выбери один main provider)')
log('    export OPENAI_API_KEY=…       # Task Master: GPT (альтернатива Claude)')
log('    export PERPLEXITY_API_KEY=…   # Task Master: только optional research')
log('    task-master models --setup    # выбрать main / research / fallback')
log('    export FIRECRAWL_API_KEY=…    # firecrawl')
log('    export GITHUB_TOKEN=…         # github')
log('    # агент database: POSTGRES_URL / MONGODB_URI / REDIS_URL — подключение к БД твоего проекта')
if (hadError) {
  console.error('\nЗавершено с ошибками — см. ✖ выше. Установленные части рабочие, сбойные перезапусти после исправления.')
  process.exit(1)
}
log('\nГотово.')
