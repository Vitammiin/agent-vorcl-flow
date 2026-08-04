---
description: Полный аудит кода: баги, типы, БД, mockup на фронте, плохой код на беке (analyzer)
argument-hint: "[путь/область; по умолчанию весь репозиторий]"
allowed-tools: Read, Grep, Glob, Bash
---

Проведи полный **read-only** аудит: **$ARGUMENTS**.

Прогони все проверки и собери единый отчёт с раздельными секциями **Frontend**, **Backend**, **DB**:
1. **Баги** — необработанные ошибки/тихие падения, race conditions, edge cases, неверная логика.
2. **Типы** — `tsc --noEmit` (read-only), `any`, небезопасные касты, рассинхрон zod↔типы.
3. **Структура БД** — схема, индексы, FK/констрейнты, N+1, нормализация, миграции (read-only SQL через MCP `postgres`/`query_render_postgres`).
4. **Mockup на фронте** — хардкод-данные вместо API, `lorem`/placeholder, `TODO/FIXME`, mock-хендлеры в прод-пути.
5. **Плохой код на беке** — нарушения модульной архитектуры `src/modules/*`, логика в контроллерах, доступ к БД из service, отсутствие валидации/обработки ошибок.

Ничего не правь. Каждая находка — `file:line`, что нашли, первопричина, конкретная починка; severity `critical>high>medium>low`. В конце — сводка по областям и severity. По значимым находкам заведи задачи через `add_task` (Task Master). Опирайся на навыки `typescript`, `backend-architecture`, `frontend-architecture`, `database`. Делегируй субагенту `analyzer`.
