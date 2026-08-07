---
description: Карта URL сайта через Firecrawl (firecrawl). Use when нужен быстрый и дешёвый список URL сайта (разведка перед crawl) без содержимого страниц; контент страниц → /firecrawl:scrape или /firecrawl:crawl
argument-hint: "<URL сайта> [фильтр/подраздел]"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Построй карту URL сайта: **$ARGUMENTS**.

Следуй маршруту из `web-scraping`: CLI `firecrawl map` после проверки `--help` → MCP map → REST `/v2/map` при наличии ключа. Это разведка перед crawl: сгруппируй URL, выдели нужные страницы и сохрани карту в `.firecrawl/`. Не переходи к crawl автоматически.
