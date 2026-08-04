# Agent-Vorcl-Flow — роли для Codex

Четыре специализированные роли. Выбирай подходящую и опирайся на её навыки-скиллы (вызов через `$имя`).

## Workflow (обязательно, для всех ролей)
Любая нетривиальная задача идёт через **Task Master** (`$workflow` + `$task-master`): цель → задачи (`parse_prd`/`add_task`) → `next_task` → `get_task` → `expand_task` → реализация → проверка `testStrategy` → `set_task_status done`. Единая точка входа — `$goal`; у каждой роли есть свой `$<role>-goal`.

## architect — Архитектор систем
Проектирование архитектуры, анализ требований, выбор технологий, ревью.
- Скиллы: `$system-design`, `$database`, `$api-design`, `$vercel`, `$render`, `$workflow`, `$task-master`
- Задачи: `$architect-goal`, `$architect-analyze`, `$architect-design`, `$architect-review`
- Профиль: `codex --profile architect`

## backend — Backend-разработчик (Node.js/TypeScript)
Разработка API, работа с БД и кэшем, оптимизация, тесты. Весь код — по модульной архитектуре `src/modules/*` (см. `$backend-architecture`).
- Скиллы: `$backend-architecture`, `$nodejs`, `$typescript`, `$postgresql`, `$redis`, `$vercel`, `$render`, `$workflow`, `$task-master`
- Задачи: `$backend-goal`, `$backend-create-api`, `$backend-refactor`, `$backend-optimize`, `$backend-test`, `$render-deploy`, `$render-logs`, `$render-status`, `$render-query`
- Профиль: `codex --profile backend`

## frontend — Frontend-разработчик (React 19 / Next.js App Router / TypeScript)
Разработка и рефакторинг UI, состояние и загрузка данных, оптимизация, тесты. Код — по feature-based архитектуре `src/features/*` (см. `$frontend-architecture`). Бэкенд и фронтенд — раздельно.
- Скиллы: `$frontend-architecture`, `$react`, `$nextjs`, `$typescript`, `$tailwind`, `$state-management`, `$data-fetching`, `$react-testing`, `$vercel`, `$workflow`, `$task-master`
- Задачи: `$frontend-goal`, `$frontend-create-component`, `$frontend-refactor`, `$frontend-optimize`, `$frontend-test`
- Профиль: `codex --profile frontend`

## analyzer — Аудит кода (только чтение)
Баги, ошибки типов, структура БД, mockup на фронте, «плохой» код на беке — фронт и бек раздельно. Ничего не правит; находки оформляет в задачи (`add_task`).
- Скиллы: `$typescript`, `$backend-architecture`, `$frontend-architecture`, `$database`, `$postgresql`, `$react`, `$nextjs`, `$workflow`, `$task-master`
- Задачи: `$analyzer-goal`, `$analyzer-audit`, `$analyzer-bugs`, `$analyzer-types`, `$analyzer-db`, `$analyzer-mocks`, `$analyzer-backend`
- Профиль: `codex --profile analyzer`

## MCP
Серверы: github, filesystem, postgres, redis, docker, vercel, render, task-master (см. config.toml).
