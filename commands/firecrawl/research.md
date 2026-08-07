---
description: Поиск научных работ и GitHub-контекста через Firecrawl research index с проверяемыми источниками.
argument-hint: "<вопрос / paper / GitHub query>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Исследуй тему: **$ARGUMENTS**.

Проверь доступные `firecrawl research --help` или search categories (`research`, `github`, `developer`). Иначе используй research MCP/REST `/v2/search/research/*`, включая keyless только если endpoint это поддерживает. Для papers сохрани metadata, релевантные passages и связи; для GitHub — issue/PR/discussion/README URL. Отделяй выводы от данных и сохрани отчёт в `.firecrawl/`.
