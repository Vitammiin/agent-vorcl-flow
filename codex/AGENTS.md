# Agent-Vorcl-Flow — роли для Codex

Две специализированные роли. Выбирай подходящую и опирайся на её навыки-скиллы (вызов через `$имя`).

## architect — Архитектор систем
Проектирование архитектуры, анализ требований, выбор технологий, ревью.
- Скиллы: `$system-design`, `$database`, `$api-design`, `$vercel`
- Задачи: `$architect-analyze`, `$architect-design`, `$architect-review`
- Профиль: `codex --profile architect`

## backend — Backend-разработчик (Node.js/TypeScript)
Разработка API, работа с БД и кэшем, оптимизация, тесты. Весь код — по модульной архитектуре `src/modules/*` (см. `$backend-architecture`).
- Скиллы: `$backend-architecture`, `$nodejs`, `$typescript`, `$postgresql`, `$redis`, `$vercel`
- Задачи: `$backend-create-api`, `$backend-refactor`, `$backend-optimize`, `$backend-test`
- Профиль: `codex --profile backend`

## MCP
Серверы: github, filesystem, postgres, redis, docker, vercel (см. config.toml).
