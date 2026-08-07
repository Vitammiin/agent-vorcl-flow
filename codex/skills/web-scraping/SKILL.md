---
name: web-scraping
description: Маршрутизирует search, scrape, map, crawl, extract, interact, parse, monitor, research и support через Firecrawl CLI, MCP или REST; также направляет app integration и workflow deliverables.
---

# Firecrawl router

Выбери режим: live web work, app integration (`$firecrawl-integrate`) или готовый deliverable (`$firecrawl-deliverable`).

Для live data приоритет: установленный и авторизованный CLI → MCP → REST/keyless fallback. Проверь `command -v firecrawl`, `firecrawl --status` и `firecrawl <command> --help`; не придумывай синтаксис. URL неизвестен — search; один URL — scrape; URL-карта — map; сайт — crawl с limit; действия — interact; локальный документ — parse; периодическая проверка — monitor; длительная задача — agent/research.

Сохраняй результаты в `.firecrawl/`, цитируй URL, не печатай секреты. Перед crawl > 50/всего сайта, monitor mutations, необратимым interact и дорогим agent/research получи подтверждение. Для structured output используй JSON Schema. При ошибке сохраняй реальный jobId и используй support/ask.

Установка/browser auth только после подтверждения: `npx -y firecrawl-cli@latest init --all --browser`; затем status и smoke scrape.
