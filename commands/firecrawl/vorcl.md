---
description: Ресёрч-цель через Task Master workflow — сбор данных из веба до готового результата (firecrawl). Use when цель многошаговая — несколько источников/этапов/форм результата; разовый поиск → /firecrawl:search, одна страница → /firecrawl:scrape
argument-hint: "<цель ресёрча / вопрос>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Возьми ресёрч-цель в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Разложи цель на задачи (`add_task`; крупный ресёрч — PRD + `parse_prd`): что найти, какие источники/сайты, какая форма результата.
3. `next_task` → `get_task`; собери данные по маршруту CLI → MCP → REST/keyless и дешёвым путём: search/map → scrape → ограниченный crawl/structured extract. Ход фиксируй через `update_subtask`, артефакты — в `.firecrawl/`.
4. Проверь `testStrategy` (данные собраны, источники указаны, структура валидна) → `set_task_status --status=done`; вернись к шагу 3, пока есть задачи.

Каждое утверждение — с URL-источником; ключевое сверяй по ≥2 источникам. Опирайся на навыки `web-scraping`, `workflow`, `task-master`. Делегируй субагенту `firecrawl`.
