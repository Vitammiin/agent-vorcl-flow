---
description: Структурированное извлечение по JSON-схеме через Firecrawl (firecrawl). Use when нужен типизированный JSON строго по схеме с одного или многих URL/домена; сырой markdown одной страницы → /firecrawl:scrape
argument-hint: "<URL(ы)/домен> — какие поля извлечь"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Извлеки структурированные данные: **$ARGUMENTS**.

Через MCP `firecrawl` выполни `firecrawl_extract` по указанным URL/домену: задай `prompt` (что нужно) и **JSON Schema** под форму результата. При необходимости `enableWebSearch: true` (дообогащение из поиска) и `showSources: true` (вернуть URL-источники). Для **одной** известной страницы дешевле и синхроннее — `firecrawl_scrape` в JSON-режиме (`formats: [{ type: "json", prompt, schema }]`). Верни валидный JSON строго по схеме + источники (URL). Опирайся на навык `web-scraping`. Делегируй субагенту `firecrawl`.
