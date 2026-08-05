---
description: Веб-поиск источников по вопросу через Firecrawl (firecrawl)
argument-hint: "<поисковый запрос / вопрос>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Найди в вебе источники по запросу: **$ARGUMENTS**.

Через MCP `firecrawl` выполни `firecrawl_search` (при необходимости укажи источники web/news/images и `limit`). Если по сниппетов мало — включи скрейп результатов (`scrapeOptions.formats: ["markdown"]`, `onlyMainContent`). Отбери релевантные источники, кратко их резюмируй и **укажи URL** каждого. Ключевые факты сверяй по ≥2 источникам. После поиска вызови `firecrawl_search_feedback` с ID запроса (рефанд кредита). Опирайся на навык `web-scraping`. Делегируй субагенту `firecrawl`.
