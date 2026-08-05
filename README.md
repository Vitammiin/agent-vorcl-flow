# Agent-Vorcl-Flow

Плагин **Claude Code**: специализированные субагенты со скиллами, слэш-командами и MCP. Бэкенд/хостинг не нужны — всё исполняет Claude Code. Есть адаптер под **GPT Codex** — см. `codex/`.

## Агенты
| Агент | Роль | Навыки | Команды |
|---|---|---|---|
| 🔵 **architect** | Архитектор систем | system-design, database, api-design, vercel, render, workflow, task-master | `/architect:goal` `/architect:analyze` `/architect:design` `/architect:review` |
| 🟢 **backend** | Backend-разработчик | backend-architecture, nodejs, typescript, postgresql, mongodb, redis, vercel, render, workflow, task-master | `/backend:goal` `/backend:create-api` `/backend:refactor` `/backend:optimize` `/backend:test` |
| 🟣 **frontend** | Frontend (React/Next.js) | frontend-architecture, react, nextjs, typescript, tailwind, state-management, data-fetching, react-testing, vercel, workflow, task-master | `/frontend:goal` `/frontend:create-component` `/frontend:refactor` `/frontend:optimize` `/frontend:test` |
| 🟠 **analyzer** | Аудит кода (read-only) | typescript, backend-architecture, frontend-architecture, database, postgresql, mongodb, swagger-coverage, react, nextjs, workflow, task-master | `/analyzer:goal` `/analyzer:audit` `/analyzer:bugs` `/analyzer:types` `/analyzer:db` `/analyzer:mocks` `/analyzer:backend` |
| 🟡 **swagger** | Покрытие Fastify Swagger (OpenAPI) | swagger-coverage, backend-architecture, api-design, typescript, nodejs, workflow, task-master | `/swagger:goal` `/swagger:audit` `/swagger:cover` |
| 🔴 **firecrawl** | Веб-исследователь (Firecrawl) | web-scraping, workflow, task-master | `/firecrawl:goal` `/firecrawl:search` `/firecrawl:scrape` `/firecrawl:map` `/firecrawl:crawl` `/firecrawl:extract` |

Общие команды хостинга (Render через MCP, делегируют `backend`): `/render:deploy` `/render:logs` `/render:status` `/render:query`.

Фронт всегда подключается к **реальному** API: источник истины — OpenAPI-спека Fastify Swagger, типы генерируются из неё (`openapi-typescript` + `openapi-fetch`). Бэк держит спеку полной (агент `swagger`, скилл `swagger-coverage`), фронт из неё берёт контракт (скилл `data-fetching`); моков в прод-пути нет.

## Workflow (Task Master)
Все агенты работают через **Task Master** (`task-master-ai`, MCP-сервер `task-master`): любая нетривиальная задача идёт по циклу **цель → задачи (`parse_prd`/`add_task`) → `next_task` → `get_task` → `expand_task` → реализация → проверка `testStrategy` → `set_task_status done`**. Дисциплину задаёт скилл `workflow`, справочник команд — скилл `task-master`.

Единая точка входа — **`/goal <цель>`** (сам роутит к нужному субагенту); у каждого агента есть свой `/<agent>:goal`. Ключи Task Master задаются через userConfig (`anthropic_api_key`, опц. `perplexity_api_key`).

## Структура (формат плагина Claude Code)
```
.claude-plugin/plugin.json     # манифест плагина
.claude-plugin/marketplace.json# локальный маркетплейс (для установки)
agents/       architect.md backend.md frontend.md analyzer.md swagger.md firecrawl.md
skills/       <навык>/SKILL.md        (22 скилла)
commands/     <namespace>/<команда>.md (34 команды, namespace /namespace:команда) + /goal
hooks/        hooks.json + scripts/session-start.js
.mcp.json     # github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master
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
MCP-серверам нужны токены — задаются через userConfig плагина (`github_token`, `postgres_url`, `mongodb_uri`, `redis_url`, `firecrawl_api_key`, `anthropic_api_key`, `perplexity_api_key`). Серверы без креды просто не поднимутся, остальное работает. Для `task-master` ключи опциональны: без `anthropic_api_key` он пробует авторизацию среды, `perplexity_api_key` нужен только для research-режима.

Удалённые серверы **vercel** и **render** используют OAuth: подключены в `.mcp.json`, авторизация командой `/mcp` (браузер). Для Render в headless/CI можно вместо OAuth задать `render_api_key` (userConfig) и заменить запись `render` на header-форму: `"headers": { "Authorization": "Bearer ${user_config.render_api_key}" }`.
