# Agent-Vorcl-Flow

Плагин **Claude Code**: специализированные субагенты со скиллами, слэш-командами и MCP. Бэкенд/хостинг не нужны — всё исполняет Claude Code. Есть адаптер под **GPT Codex** — см. `codex/`.

## Агенты
| Агент | Роль | Навыки | Команды |
|---|---|---|---|
| 🔵 **architect** | Архитектор систем | system-design, database, api-design, vercel, render, workflow, task-master | `/architect:goal` `/architect:analyze` `/architect:design` `/architect:review` |
| 🟢 **backend** | Backend-разработчик | backend-architecture, nodejs, typescript, postgresql, mongodb, redis, vercel, render, workflow, task-master | `/backend:goal` `/backend:create-api` `/backend:refactor` `/backend:optimize` `/backend:test` |
| 🟣 **frontend** | Frontend (React/Next.js) | frontend-architecture, react, nextjs, typescript, tailwind, state-management, data-fetching, react-testing, vercel, workflow, task-master | `/frontend:goal` `/frontend:create-component` `/frontend:refactor` `/frontend:optimize` `/frontend:test` |
| 🟠 **analyzer** | Аудит кода (read-only) | typescript, backend-architecture, frontend-architecture, database, postgresql, mongodb, swagger-coverage, react, nextjs, workflow, task-master | `/analyzer:goal` `/analyzer:audit` `/analyzer:bugs` `/analyzer:types` `/analyzer:db` `/analyzer:mocks` `/analyzer:backend` |
| 🟡 **swagger** | Покрытие OpenAPI/Swagger (любой стек) | swagger-coverage, backend-architecture, api-design, typescript, nodejs, workflow, task-master | `/swagger:goal` `/swagger:audit` `/swagger:cover` |
| 🔴 **firecrawl** | Веб-исследователь (Firecrawl) | web-scraping, workflow, task-master | `/firecrawl:goal` `/firecrawl:search` `/firecrawl:scrape` `/firecrawl:map` `/firecrawl:crawl` `/firecrawl:extract` |
| 🟤 **render** | Хостинг/деплой (Render) | render, postgresql, redis, backend-architecture, workflow, task-master | `/render:goal` `/render:deploy` `/render:logs` `/render:status` `/render:query` |
| 🟦 **database** | Инженер БД / DBA | database, postgresql, mongodb, redis, backend-architecture, workflow, task-master | `/database:goal` `/database:query` `/database:schema` `/database:migrate` `/database:optimize` `/database:cache` |
| ⚪ **resilience** | Надёжность: ошибки + логи | error-handling, backend-architecture, nodejs, typescript, react, workflow, task-master | `/resilience:goal` `/resilience:harden` `/resilience:logging` `/resilience:audit` |
| 🖼️ **screenshot** | Скриншот UI → код | screenshot-to-code, react, nextjs, typescript, tailwind, frontend-architecture, workflow, task-master | `/screenshot:goal` `/screenshot:analyze` `/screenshot:convert` `/screenshot:tokens` `/screenshot:responsive` |

Агент `render` понимает Docker- и native-рантайм, помнит про доступ к БД по **IP-allowlist** (outbound-IP сервиса → allowlist базы; для Render Postgres — internal URL) и ведёт диагностику по логам до первопричины. Скилл `render` (операции через MCP) подключён также у `architect` и `backend`.

Агент `database` — прямая работа с данными через MCP `postgres`/`mongodb`/`redis`: схема и целостность, запросы и планы (`EXPLAIN`/`explain`), индексы и устранение N+1, безопасные обратимые миграции (expand→backfill→contract), кэш (TTL/инвалидация, distributed lock, rate limiting). Аналитика — read-only; мутации (DDL/DML/миграции) — только с явным подтверждением.

Агент `resilience` (скилл `error-handling`) грамотно покрывает код обработкой ошибок (`try/catch/finally`) и структурным логированием без «тихих» падений: try/catch на границах, нормализация ошибок (`cause`/`stack`), ретраи/таймауты, логи с уровнями и контекстом без секретов/PII. Хук `PostToolUse` (`catch-guard.js`) после каждого Edit/Write мягко (не блокируя) подсвечивает пустые `catch {}` в изменённом JS/TS-файле.

Агент `screenshot` (скилл `screenshot-to-code`) превращает **скриншот UI в production-ready код**: читает изображение (инструмент Read показывает картинку), разбирает layout/компоненты/состояния, извлекает точные цвета в семантические OKLCH-токены `@theme` и выдаёт полный запускаемый код — семантический HTML, точные spacing/пропорции, адаптивность (`clamp()`, брейкпоинты, container queries) и a11y. По умолчанию React + Tailwind v4; по запросу Vue / Next.js / чистый HTML/CSS. Отдельно умеет вытащить дизайн-токены (`/screenshot:tokens`) и довести вёрстку до адаптивности (`/screenshot:responsive`).

Фронт всегда подключается к **реальному** API: источник истины — OpenAPI-спека бэка (Fastify/NestJS/Express и др.), типы генерируются из неё (`openapi-typescript` + `openapi-fetch`). Бэк держит спеку полной (агент `swagger`, скилл `swagger-coverage`), фронт из неё берёт контракт (скилл `data-fetching`); моков в прод-пути нет.

## Workflow (Task Master)
Все агенты работают через **Task Master** (`task-master-ai`, MCP-сервер `task-master`): любая нетривиальная задача идёт по циклу **цель → задачи (`parse_prd`/`add_task`) → `next_task` → `get_task` → `expand_task` → реализация → проверка `testStrategy` → `set_task_status done`**. Дисциплину задаёт скилл `workflow`, справочник команд — скилл `task-master`.

Единая точка входа — **`/goal <цель>`** (сам роутит к нужному субагенту); у каждого агента есть свой `/<agent>:goal`. Ключи Task Master задаются через userConfig (`anthropic_api_key`, опц. `perplexity_api_key`).

## Структура (формат плагина Claude Code)
```
.claude-plugin/plugin.json     # манифест плагина
.claude-plugin/marketplace.json# локальный маркетплейс (для установки)
agents/       architect.md backend.md frontend.md analyzer.md swagger.md firecrawl.md render.md database.md resilience.md screenshot.md
skills/       <навык>/SKILL.md        (24 скилла)
commands/     <namespace>/<команда>.md (50 команд, namespace /namespace:команда) + /goal
hooks/        hooks.json + scripts/session-start.js + scripts/catch-guard.js (PostToolUse: пустые catch)
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
