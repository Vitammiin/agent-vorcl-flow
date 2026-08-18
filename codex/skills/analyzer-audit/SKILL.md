---
name: analyzer-audit
description: "Широкий read-only аудит багов, типов, БД и структуры backend/frontend; hardcode/mock-data принадлежат integrity."
---

# Задача: полный аудит кода

Проведи полный **read-only** аудит указанной пользователем области (по умолчанию весь репозиторий).

Прогони все проверки, собери отчёт с раздельными секциями **Frontend**, **Backend**, **DB**:
1. **Баги** — необработанные ошибки/тихие падения, race conditions, edge cases.
2. **Типы** — `tsc --noEmit`, `any`, небезопасные касты, рассинхрон zod↔типы.
3. **Структура БД** (Postgres и/или MongoDB) — схема, индексы, N+1, миграции: Postgres — read-only SQL (`information_schema`/`pg_indexes`, FK/констрейнты); MongoDB — MCP `mongodb` (`listIndexes`/`explain`, форма документов, embedding vs referencing, schema-валидаторы).
4. **Плохой код на беке** — нарушения `src/modules/*`, логика в контроллерах, доступ к БД из service, нет валидации/обработки ошибок.

Hardcode, i18n literals и mock/fake/demo leakage не дублируй: перенаправь scope в `$integrity-audit`.

Ничего не правь. Формат находки: `file:line`, что нашли, первопричина, конкретная починка; severity `critical>high>medium>low`. В конце — сводка по областям и severity. По значимым находкам — `add_task`. Опирайся на `$typescript`, `$backend-architecture`, `$frontend-architecture`, `$database`, `$postgresql`, `$mongodb`.
