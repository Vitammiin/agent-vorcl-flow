# Agent-Vorcl-Flow — роли для Codex

Четыре специализированные роли. Выбирай подходящую и опирайся на её навыки-скиллы (вызов через `$имя`).

## Workflow (обязательно, для всех ролей)
Любая нетривиальная задача идёт через **Task Master** (`$workflow` + `$task-master`): цель → задачи (`parse_prd`/`add_task`) → `next_task` → `get_task` → `expand_task` → реализация → проверка `testStrategy` → `set_task_status done`. Единая точка входа — `$goal`; у каждой роли есть свой `$<role>-goal`.

## architect — Архитектор систем
Проектирование архитектуры, анализ требований, выбор технологий, ревью.
- Скиллы: `$system-design`, `$database`, `$api-design`, `$web-scraping`, `$vercel`, `$render`, `$workflow`, `$task-master`
- Задачи: `$architect-goal`, `$architect-analyze`, `$architect-design`, `$architect-review`
- Профиль: `codex --profile architect`

## backend — Backend-разработчик (Node.js/TypeScript)
Разработка API, работа с БД и кэшем, оптимизация, тесты. Весь код — по модульной архитектуре `src/modules/*` (см. `$backend-architecture`).
- Скиллы: `$backend-architecture`, `$nodejs`, `$typescript`, `$postgresql`, `$mongodb`, `$redis`, `$swagger-coverage`, `$vercel`, `$render`, `$workflow`, `$task-master`
- Задачи: `$backend-goal`, `$backend-create-api`, `$backend-refactor`, `$backend-optimize`, `$backend-test`, `$render-deploy`, `$render-logs`, `$render-status`, `$render-query`
- Профиль: `codex --profile backend`

## frontend — Frontend-разработчик (React 19 / Next.js App Router / TypeScript)
Разработка и рефакторинг UI, состояние и загрузка данных, оптимизация, тесты. Код — по feature-based архитектуре `src/features/*` (см. `$frontend-architecture`). Бэкенд и фронтенд — раздельно.
- Скиллы: `$frontend-architecture`, `$react`, `$nextjs`, `$typescript`, `$tailwind`, `$state-management`, `$data-fetching`, `$react-testing`, `$vercel`, `$workflow`, `$task-master`
- Задачи: `$frontend-goal`, `$frontend-create-component`, `$frontend-refactor`, `$frontend-optimize`, `$frontend-test`
- Профиль: `codex --profile frontend`

## analyzer — Аудит кода (только чтение)
Баги, ошибки типов, структура БД, mockup на фронте, «плохой» код на беке — фронт и бек раздельно. Ничего не правит; находки оформляет в задачи (`add_task`).
- Скиллы: `$typescript`, `$backend-architecture`, `$frontend-architecture`, `$database`, `$postgresql`, `$mongodb`, `$swagger-coverage`, `$react`, `$nextjs`, `$workflow`, `$task-master`
- Задачи: `$analyzer-goal`, `$analyzer-audit`, `$analyzer-bugs`, `$analyzer-types`, `$analyzer-db`, `$analyzer-mocks`, `$analyzer-backend`
- Профиль: `codex --profile analyzer`

## swagger — Инженер покрытия Fastify Swagger (OpenAPI)
Изучает backend-код, находит роуты, не полностью покрытые Fastify Swagger, и корректно, с описаниями, покрывает их через zod-схемы как единый источник и валидации, и OpenAPI. Спека — источник истины для фронт-клиента (`$data-fetching`). Аудит — только чтение; покрытие — правки.
- Скиллы: `$swagger-coverage`, `$backend-architecture`, `$api-design`, `$typescript`, `$nodejs`, `$workflow`, `$task-master`
- Задачи: `$swagger-goal`, `$swagger-audit`, `$swagger-cover`
- Профиль: `codex --profile swagger`

## firecrawl — Веб-исследователь (Firecrawl)
Ищет, скрейпит, краулит и извлекает структурированные данные из веба (scrape/map/crawl/search/extract) в LLM-ready markdown/JSON, доказательно с цитированием URL. Дешёвый путь первым (`search`/`map` → `scrape` → `crawl` с limit); структура — по JSON-схеме.
- Скиллы: `$web-scraping`, `$workflow`, `$task-master`
- Задачи: `$firecrawl-goal`, `$firecrawl-search`, `$firecrawl-scrape`, `$firecrawl-map`, `$firecrawl-crawl`, `$firecrawl-extract`
- Профиль: `codex --profile firecrawl`

## MCP
Серверы: github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master (см. config.toml).
