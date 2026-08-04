# Agent-Vorcl-Flow

Плагин **Claude Code**: специализированные субагенты со скиллами, слэш-командами и MCP. Бэкенд/хостинг не нужны — всё исполняет Claude Code. Есть адаптер под **GPT Codex** — см. `codex/`.

## Агенты
| Агент | Роль | Навыки | Команды |
|---|---|---|---|
| 🔵 **architect** | Архитектор систем | system-design, database, api-design | `/architect:analyze` `/architect:design` `/architect:review` |
| 🟢 **backend** | Backend-разработчик | nodejs, typescript, postgresql, redis | `/backend:create-api` `/backend:refactor` `/backend:optimize` `/backend:test` |

## Структура (формат плагина Claude Code)
```
.claude-plugin/plugin.json     # манифест плагина
.claude-plugin/marketplace.json# локальный маркетплейс (для установки)
agents/       architect.md backend.md
skills/       <навык>/SKILL.md        (7 скиллов)
commands/     <агент>/<команда>.md    (7 команд, namespace /агент:команда)
hooks/        hooks.json + scripts/session-start.js
.mcp.json     # github, filesystem, postgres, redis, docker, vercel
codex/        # адаптер под GPT Codex (skills + config.toml + install.sh)
```

## Связка
`agents/*.md` объявляют роль и в frontmatter `skills:` подключают навыки → скиллы из `skills/*/SKILL.md` автоподхватываются по описанию → команды `commands/<агент>/*.md` дают быстрые `/агент:команда` и делегируют субагенту → `.mcp.json` даёт агентам инструменты. Хук `SessionStart` сообщает Claude о наличии агентов.

## Установка
```bash
# Быстрый способ — на текущую сессию:
claude --plugin-dir /путь/к/agent-vorcl-flow

# Через локальный маркетплейс (постоянно):
/plugin marketplace add /путь/к/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

## Проверка
```bash
claude plugin validate . --strict      # валидация манифеста и компонентов
/plugin details agent-vorcl-flow       # список подхваченных агентов/скиллов/команд
@agent-vorcl-flow:architect            # субагент в typeahead
/architect:analyze биллинг для SaaS    # слэш-команда
```

## MCP и секреты
MCP-серверам нужны токены — задаются через userConfig плагина (`github_token`, `postgres_url`, `redis_url`). Серверы без креды просто не поднимутся, остальное работает.
