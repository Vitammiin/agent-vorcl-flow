---
description: Ответ на вопрос о Firecrawl по актуальной официальной документации с цитированием docs URL.
argument-hint: "<как Firecrawl делает X?>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Найди ответ в актуальной документации: **$ARGUMENTS**.

Проверь наличие CLI docs-search через `--help`; иначе используй MCP или POST `/v2/support/docs-search`. Опирайся только на официальные Firecrawl docs/repositories, приложи прямые URL и явно отметь различия версий. Не придумывай команду, если текущий CLI её не показывает.
