---
name: firecrawl-search
description: Веб-поиск источников по вопросу через Firecrawl (роль firecrawl). Use когда URL неизвестен и нужно найти релевантные источники.
---

# Задача: веб-поиск (firecrawl)

Найди в вебе источники по запросу пользователя.

Через MCP `firecrawl` выполни `firecrawl_search` (источники web/news/images, `limit`). Если сниппетов мало — включи скрейп результатов (`scrapeOptions.formats: ["markdown"]`, `onlyMainContent`). Отбери релевантные источники, кратко резюмируй и **укажи URL** каждого; ключевые факты сверяй по ≥2 источникам. После поиска — `firecrawl_search_feedback` с ID запроса (рефанд кредита). Опирайся на `$web-scraping`.
