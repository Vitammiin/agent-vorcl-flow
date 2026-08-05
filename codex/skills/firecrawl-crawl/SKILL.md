---
name: firecrawl-crawl
description: Рекурсивный обход раздела/сайта через Firecrawl (роль firecrawl). Use когда нужен контент множества страниц сайта.
---

# Задача: краул сайта (firecrawl)

Обойди сайт/раздел и собери контент.

Если объём неизвестен — сначала прикинь охват через `firecrawl_map`. Затем через MCP `firecrawl` запусти `firecrawl_crawl` **всегда** с разумным `limit` и ограничением по путям. Краул асинхронный: опрашивай `firecrawl_check_crawl_status` до готовности. `formats: ["markdown"]`, `onlyMainContent`. Большой краул дорог и медлен — не запускай без лимита. Верни собранные страницы (markdown) с URL и краткую сводку. Опирайся на `$web-scraping`.
