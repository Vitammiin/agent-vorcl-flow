---
name: render-query
description: Read-only SQL по Render Postgres (роль backend). Use когда нужно выполнить безопасный аналитический запрос к базе Render Postgres.
---

# Задача: read-only SQL по Render Postgres

Выполни **read-only** SQL по базе Render Postgres (см. `$render`, `$postgresql`).

Выбери workspace (`get_selected_workspace`/`select_workspace`), найди базу (`list_postgres_instances`/`get_postgres`), выполни запрос через `query_render_postgres` (**только чтение** — INSERT/UPDATE/DELETE/DDL недоступны). Верни результат кратко; при аналитике поясни выводы. Осторожно с чувствительными данными.
