---
description: Рекурсивный обход раздела/сайта через Firecrawl (firecrawl)
argument-hint: "<URL раздела/сайта> [limit; что собрать]"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Обойди сайт/раздел и собери контент: **$ARGUMENTS**.

Сначала (если объём неизвестен) прикинь охват через `firecrawl_map`, затем через MCP `firecrawl` запусти `firecrawl_crawl` — **всегда** с разумным `limit` и, при необходимости, с ограничением по путям. Краул асинхронный: опрашивай `firecrawl_check_crawl_status` до готовности. `formats: ["markdown"]`, `onlyMainContent`. Помни: большой краул — дорого и медленно, не запускай без лимита. Верни собранные страницы (markdown) с их URL и краткую сводку. Опирайся на навык `web-scraping`. Делегируй субагенту `firecrawl`.
