---
name: firecrawl-scrape
description: Скрейп одного URL в markdown/JSON через Firecrawl (роль firecrawl). Use when URL известен и нужна ОДНА страница; много страниц раздела → $firecrawl-crawl, только список URL → $firecrawl-map, типизированный JSON с многих URL → $firecrawl-extract.
---

# Задача: скрейп страницы (firecrawl)

Скрейпни указанный URL.

Через MCP `firecrawl` выполни `firecrawl_scrape`. По умолчанию `formats: ["markdown"]`, `onlyMainContent: true`. Нужна структура → JSON-режим (`formats: [{ type: "json", prompt, schema }]`) с JSON Schema. `maxAge` — кэш для повторных скрейпов (`0` для строго свежих). `enhanced` proxy — только при anti-bot. Верни чистый markdown/валидный JSON + URL-источник. Опирайся на `$web-scraping`.
