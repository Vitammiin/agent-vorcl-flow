---
description: Длительная автономная веб-задача через Firecrawl Agent с явным лимитом стоимости и критерием остановки.
argument-hint: "<цель> [лимит кредитов/стоимости]"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Запусти Firecrawl Agent для: **$ARGUMENTS**.

Используй agent только когда search/scrape недостаточно. Проверь `firecrawl agent --help`, иначе MCP/актуальный REST. До запуска зафиксируй scope, ожидаемый результат, max credits/cost и критерий остановки; если лимит не задан или задача потенциально дорогая — получи подтверждение. Отслеживай реальный job ID, сохрани output и sources в `.firecrawl/`.
