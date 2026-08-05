---
description: Полный аудит кода: баги, типы, БД, mockup на фронте, плохой код на беке (analyzer)
argument-hint: "[путь/область; по умолчанию весь репозиторий]"
allowed-tools: Read, Grep, Glob, Bash
---

Проведи полный **read-only** аудит: **$ARGUMENTS**.

Прогони все проверки и собери единый отчёт с раздельными секциями **Frontend**, **Backend**, **DB**:
1. **Баги** — необработанные ошибки/тихие падения, race conditions, edge cases, неверная логика.
2. **Типы** — `tsc --noEmit` (read-only), `any`, небезопасные касты, рассинхрон zod↔типы.
3. **Структура БД** — схема, индексы, N+1, миграции; проверяй ту СУБД(ы), что реально в проекте. Реляционная (**Postgres**) — read-only SQL через MCP `postgres`/`query_render_postgres`: FK/констрейнты/NOT NULL/UNIQUE, нормализация, `information_schema`/`pg_indexes`. Документная (**MongoDB**) — через MCP `mongodb` (read-only): индексы (`listIndexes`, compound/TTL), COLLSCAN (`explain`), консистентность формы документов между записями, embedding vs referencing, отсутствие schema-валидаторов, N+1 без `$lookup`/populate.
4. **Mockup на фронте** — хардкод-данные вместо API, `lorem`/placeholder, `TODO/FIXME`, mock-хендлеры в прод-пути.
5. **Плохой код на беке** — нарушения модульной архитектуры `src/modules/*`, логика в контроллерах, доступ к БД из service, отсутствие валидации/обработки ошибок.
6. **Языковой хардкод (i18n)** — в мультиязычном проекте (есть i18n-инфраструктура/несколько локалей): пользовательские строки литералами в JSX/шаблонах/ответах вместо слоя перевода, конкатенация переводов, ручная плюрализация, хардкод формата дат/валют, перевод логов/машинных кодов ошибок.

Ничего не правь. Каждая находка — `file:line`, что нашли, первопричина, конкретная починка; severity `critical>high>medium>low`. В конце — сводка по областям и severity. По значимым находкам заведи задачи через `add_task` (Task Master). Опирайся на навыки `typescript`, `backend-architecture`, `frontend-architecture`, `database`, `postgresql`, `mongodb`, `i18n`. Делегируй субагенту `analyzer`.
