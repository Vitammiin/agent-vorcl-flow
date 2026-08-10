#!/usr/bin/env node
// Agent-Vorcl-Flow — универсальный launcher MCP-серверов.
//
// Зачем: каждый рантайм (Claude Code, Codex, Cursor, Kimi CLI) подставляет
// переменные окружения в свой MCP-конфиг ПО-РАЗНОМУ (${VAR:-} у Claude,
// ${env:VAR} у Cursor, литералы у Codex) и берёт значения из окружения СВОЕГО
// процесса. При запуске из Dock/Spotlight/IDE это окружение НЕ содержит того,
// что пользователь экспортировал в ~/.zshrc → секреты пусты → серверы не
// подключаются. Это и есть массовая проблема «MCP env не задан».
//
// Решение: рантайм запускает не сам сервер, а этот launcher. Launcher читает
// секреты из ОДНОГО файла ~/.config/agent-vorcl-flow/.env (не зависит от того,
// login-shell или GUI), сам подставляет их и exec'ает настоящий сервер.
// Синтаксис подстановки хоста больше не важен — работает одинаково везде.
//
// Использование:
//   node mcp-env.mjs [--need=VAR[,VAR...]] -- <command> [args...]
//
//   --need=VAR,VAR   — если любая из переменных пуста, сервер помечается
//                      «не настроен»: печатается понятная подсказка и launcher
//                      завершается, НЕ поднимая сервер с пустыми креденшелами.
//   %%VAR%% / %%VAR:-default%% в args — подставляется значением из .env/окружения
//                      (для серверов, берущих URL позиционным аргументом: redis,
//                      postgres). Токен %% не трогается ни одним рантаймом.
//
// Приоритет источников (позднее переопределяет раннее, но реальный process.env
// всегда сильнее файлов): global .env → project .env → process.env.

import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const TAG = '[agent-vorcl-flow]'

// Server-facing имя ← дружелюбный алиас. Пользователь пишет в .env привычное
// GITHUB_TOKEN / MONGODB_URI, а серверы ждут своих имён — заполняем автоматически.
const ALIASES = {
  GITHUB_PERSONAL_ACCESS_TOKEN: 'GITHUB_TOKEN',
  MDB_MCP_CONNECTION_STRING: 'MONGODB_URI',
}

// ---------- .env ----------

// Домашний каталог AVF: XDG на *nix, %APPDATA% на Windows, иначе ~/.config.
function avfHome() {
  if (process.env.AGENT_VORCL_HOME) return process.env.AGENT_VORCL_HOME
  if (process.platform === 'win32' && process.env.APPDATA) {
    return path.join(process.env.APPDATA, 'agent-vorcl-flow')
  }
  const xdg = process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config')
  return path.join(xdg, 'agent-vorcl-flow')
}

// Минимальный dotenv-парсер (без зависимостей: npm install при спавне недоступен).
// Поддерживает: KEY=VAL, `export KEY=VAL`, кавычки, комментарии, пустые строки.
function parseDotenv(text) {
  const out = {}
  for (let line of text.split(/\r?\n/)) {
    line = line.trim()
    if (!line || line.startsWith('#')) continue
    if (line.startsWith('export ')) line = line.slice(7).trim()
    const eq = line.indexOf('=')
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    if (!key) continue
    let val = line.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

function loadFile(file) {
  try {
    return parseDotenv(fs.readFileSync(file, 'utf8'))
  } catch {
    return {} // нет файла или нет прав — не наша забота, просто пропускаем
  }
}

// Собираем окружение: global .env → project .env → process.env (реальный env сильнее).
function buildEnv() {
  const files = []
  if (process.env.AGENT_VORCL_ENV_FILE) files.push(process.env.AGENT_VORCL_ENV_FILE)
  else files.push(path.join(avfHome(), '.env'))
  const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd()
  files.push(path.join(projectDir, '.env'))

  const merged = {}
  for (const file of files) Object.assign(merged, loadFile(file))
  // Реальный process.env имеет приоритет над файлами (CLI-запуск с exports).
  for (const [k, v] of Object.entries(process.env)) if (v != null && v !== '') merged[k] = v
  // Алиасы: заполняем server-facing имя из дружелюбного, если оно ещё пусто.
  for (const [dest, src] of Object.entries(ALIASES)) {
    if ((!merged[dest] || merged[dest] === '') && merged[src]) merged[dest] = merged[src]
  }
  return merged
}

// ---------- подстановка %%VAR%% в аргументах ----------

function expandArg(arg, env) {
  return arg.replace(/%%([A-Z0-9_]+)(?::-([^%]*))?%%/g, (_m, name, def) => {
    const v = env[name]
    return v != null && v !== '' ? v : def != null ? def : ''
  })
}

// ---------- разбор argv ----------

const argv = process.argv.slice(2)
const sep = argv.indexOf('--')
const opts = sep === -1 ? [] : argv.slice(0, sep)
const rest = sep === -1 ? argv : argv.slice(sep + 1)

let need = []
for (const opt of opts) {
  if (opt.startsWith('--need=')) need = opt.slice('--need='.length).split(',').map((s) => s.trim()).filter(Boolean)
}

if (rest.length === 0) {
  console.error(`${TAG} mcp-env: не указана команда MCP-сервера (после --).`)
  process.exit(2)
}

const env = buildEnv()

// Проверка обязательных ключей: не поднимаем сервер с пустыми креденшелами.
const missing = need.filter((v) => !env[v] || env[v] === '')
if (missing.length) {
  const serverName = rest.find((a) => a.includes('server-') || a.includes('-mcp') || a.includes('mcp-')) || rest.join(' ')
  console.error(
    `${TAG} MCP «${serverName}» не настроен: не задан ${missing.join(', ')}.\n` +
      `${TAG} Добавь его в ${path.join(avfHome(), '.env')} (см. .env.example) и перезапусти рантайм. Остальные серверы работают.`,
  )
  process.exit(0) // не крэш: сервер просто недоступен, а не «упал»
}

const command = rest[0]
const args = rest.slice(1).map((a) => expandArg(a, env))

const child = spawn(command, args, { stdio: 'inherit', env })
child.on('error', (e) => {
  console.error(`${TAG} не удалось запустить ${command}: ${e.message}`)
  process.exit(1)
})
child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  else process.exit(code ?? 0)
})
