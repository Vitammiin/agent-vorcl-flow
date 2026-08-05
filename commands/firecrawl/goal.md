---
description: Ресёрч-цель через Task Master workflow — сбор данных из веба до готового результата (firecrawl)
argument-hint: "<цель ресёрча / вопрос>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Возьми ресёрч-цель в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Разложи цель на задачи (`add_task`; крупный ресёрч — PRD + `parse_prd`): что найти, какие источники/сайты, какая форма результата.
3. `next_task` → `get_task`; собери данные через MCP `firecrawl` дешёвым путём: `firecrawl_search`/`firecrawl_map` (разведка) → `firecrawl_scrape` точечно → `firecrawl_crawl` (с `limit`) / `firecrawl_extract` (structured). Ход фиксируй через `update_subtask`.
4. Проверь `testStrategy` (данные собраны, источники указаны, структура валидна) → `set_task_status --status=done`; вернись к шагу 3, пока есть задачи.

Каждое утверждение — с URL-источником; ключевое сверяй по ≥2 источникам. Опирайся на навыки `web-scraping`, `workflow`, `task-master`. Делегируй субагенту `firecrawl`.
