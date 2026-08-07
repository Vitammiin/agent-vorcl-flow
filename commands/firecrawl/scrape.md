---
description: Скрейп одного URL в markdown/JSON через Firecrawl (firecrawl). Use when URL известен и нужна ОДНА страница; много страниц раздела → /firecrawl:crawl, только список URL → /firecrawl:map, типизированный JSON с многих URL → /firecrawl:extract
argument-hint: "<URL> [что извлечь / формат]"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Скрейпни страницу: **$ARGUMENTS**.

Следуй маршруту из `web-scraping`: CLI `firecrawl scrape` после проверки `--help` → MCP scrape → REST `/v2/scrape`/официальный keyless client. По умолчанию получи основной markdown; для структуры задай JSON Schema. Кэш отключай только при требовании свежести, enhanced proxy — лишь после обычной попытки. Сохрани результат в `.firecrawl/` и верни путь и URL.
