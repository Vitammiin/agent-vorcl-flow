---
description: Веб-поиск источников по вопросу через Firecrawl (firecrawl). Use when URL неизвестен и нужно найти источники по вопросу; известная страница → /firecrawl:scrape, обход сайта → /firecrawl:crawl
argument-hint: "<поисковый запрос / вопрос>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Найди в вебе источники по запросу: **$ARGUMENTS**.

Следуй маршруту из `web-scraping`: авторизованный CLI `firecrawl search` (сначала проверь `firecrawl search --help`) → MCP search → REST `/v2/search`. Используй подходящую категорию только если она поддерживается текущей версией. При слабых сниппетах точечно скрейпни результаты. Сохрани отчёт в `.firecrawl/`, укажи URL каждого источника и сверь ключевые факты по ≥2 источникам. Не выдумывай параметры и результаты.
