---
description: Рекурсивный обход раздела/сайта через Firecrawl (firecrawl). Use when нужен контент МНОГИХ страниц раздела/сайта (дорого, всегда с limit); одна страница → /firecrawl:scrape, только список URL → /firecrawl:map
argument-hint: "<URL раздела/сайта> [limit; что собрать]"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Обойди сайт/раздел и собери контент: **$ARGUMENTS**.

Сначала оцени охват через map. Затем используй CLI `firecrawl crawl` после проверки `--help`, иначе MCP crawl/status, иначе REST `/v2/crawl`. Всегда задай `limit` и фильтры пути. Перед `limit > 50` или всем сайтом назови объём/стоимость и дождись явного подтверждения. Дождись завершения job, сохрани страницы и manifest с URL/job ID в `.firecrawl/`.
