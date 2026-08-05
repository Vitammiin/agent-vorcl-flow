---
name: analyzer-db
description: Аудит структуры БД — схема, индексы, FK, N+1, миграции (роль analyzer, read-only). Use для ревью структуры базы данных.
---

# Задача: аудит структуры БД

Проверь структуру БД (**read-only**) для указанной области.

Проверяй ту СУБД(ы), что реально в проекте; ничего не изменяй.
- **Postgres** — через MCP `postgres` / `query_render_postgres` только read-only SQL (SELECT/EXPLAIN, `information_schema`, `pg_indexes`): отсутствующие индексы, нет FK/констрейнтов/NOT NULL/UNIQUE, N+1 (в коде репозиториев), нормализация, рассинхрон схемы и моделей/миграций, небезопасные миграции.
- **MongoDB** — через MCP `mongodb` (read-only, `--readOnly`): индексы (`listIndexes`, compound/TTL), COLLSCAN (`explain`), несогласованность формы документов, embedding vs referencing, N+1 без `$lookup`/populate, отсутствие schema-валидаторов, рост массивов/документа.

Формат: объект (`таблица`/`колонка` или `коллекция`/`поле`) или `file:line`, что нашли, первопричина, конкретная починка; severity по влиянию. По значимым находкам — `add_task`. Опирайся на `$database`, `$postgresql`, `$mongodb`.
