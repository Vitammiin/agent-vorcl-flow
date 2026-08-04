---
description: Read-only SQL по Render Postgres (render)
argument-hint: "<db> <SQL>"
---

Выполни **read-only** SQL по базе Render Postgres: **$ARGUMENTS**.

Убедись в выбранном workspace (`get_selected_workspace`/`select_workspace`). Найди базу (`list_postgres_instances`/`get_postgres`), выполни запрос через `query_render_postgres` (**только чтение** — INSERT/UPDATE/DELETE/DDL недоступны). Верни результат кратко и по делу; при аналитике поясни выводы. Осторожно с чувствительными данными — не выводи лишнего. Опирайся на навыки `render`, `postgresql`. При необходимости делегируй субагенту `backend`.
