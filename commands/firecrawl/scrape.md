---
description: Скрейп одного URL в markdown/JSON через Firecrawl (firecrawl)
argument-hint: "<URL> [что извлечь / формат]"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Скрейпни страницу: **$ARGUMENTS**.

Через MCP `firecrawl` выполни `firecrawl_scrape` для указанного URL. По умолчанию `formats: ["markdown"]`, `onlyMainContent: true` (без шапок/меню/футеров). Если нужна структура — используй JSON-режим (`formats: [{ type: "json", prompt, schema }]`) с JSON Schema под запрошенные поля. Для ускорения повторных скрейпов держи `maxAge` (кэш); ставь `0`, если данные должны быть строго свежими. `enhanced` proxy — только если сайт с anti-bot. Верни чистый markdown или валидный JSON + URL-источник. Опирайся на навык `web-scraping`. Делегируй субагенту `firecrawl`.
