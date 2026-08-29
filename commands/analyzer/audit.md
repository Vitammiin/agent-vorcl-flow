---
description: Широкий read-only аудит кода — баги, типы, БД и структура backend/frontend. Hardcode/mock-data принадлежат integrity (analyzer)
argument-hint: "[путь/область; по умолчанию весь репозиторий]"
allowed-tools: Read, Grep, Glob, Bash
---

Проведи полный **read-only** аудит: **$ARGUMENTS**.

Сначала примени `workspace-capability-routing`: определи фактические systems/boundaries и scope. Multi-surface whole-project запрос перенаправь в `/audit`; если обнаружен Expo/RN, добавь отдельную секцию **Mobile** и профильный read-only pass `expo-mobile:audit`/`expo-mobile:ui-audit`, не применяя web-only правила.

Прогони все проверки и собери единый отчёт с раздельными секциями **Frontend**, **Backend**, **DB**:
1. **Баги** — необработанные ошибки/тихие падения, race conditions, edge cases, неверная логика.
2. **Типы** — `tsc --noEmit` (read-only), `any`, небезопасные касты, рассинхрон zod↔типы.
3. **Структура БД** — схема, индексы, N+1, миграции; проверяй ту СУБД(ы), что реально в проекте. Реляционная (**Postgres**) — read-only SQL через MCP `postgres`/`query_render_postgres`: FK/констрейнты/NOT NULL/UNIQUE, нормализация, `information_schema`/`pg_indexes`. Документная (**MongoDB**) — через MCP `mongodb` (read-only): индексы (`listIndexes`, compound/TTL), COLLSCAN (`explain`), консистентность формы документов между записями, embedding vs referencing, отсутствие schema-валидаторов, N+1 без `$lookup`/populate.
4. **Плохой код на беке** — нарушения модульной архитектуры `src/modules/*`, логика в контроллерах, доступ к БД из service, отсутствие валидации/обработки ошибок.

Hardcode, i18n literals и mock/fake/demo leakage не дублируй: перенаправь этот scope в `/integrity:audit`.

Ничего не правь. Каждая находка — `file:line`, что нашли, первопричина, конкретная починка; severity `critical>high>medium>low`. В конце — сводка по областям и severity. По значимым находкам заведи задачи через `add_task` (Task Master). Опирайся на `workspace-capability-routing` и только профильные навыки обнаруженных boundaries. Делегируй субагенту `analyzer`.
