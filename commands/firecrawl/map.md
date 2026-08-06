---
description: Карта URL сайта через Firecrawl (firecrawl). Use when нужен быстрый и дешёвый список URL сайта (разведка перед crawl) без содержимого страниц; контент страниц → /firecrawl:scrape или /firecrawl:crawl
argument-hint: "<URL сайта> [фильтр/подраздел]"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Построй карту URL сайта: **$ARGUMENTS**.

Через MCP `firecrawl` выполни `firecrawl_map` — быстро и дёшево собери список индексируемых URL сайта. Это разведка **перед** дорогим `crawl`: сгруппируй/отфильтруй URL по разделам, выдели страницы, которые реально нужны под задачу. Верни список URL (при большом объёме — сгруппированный) и рекомендацию, что скрейпить/краулить дальше. Опирайся на навык `web-scraping`. Делегируй субагенту `firecrawl`.
