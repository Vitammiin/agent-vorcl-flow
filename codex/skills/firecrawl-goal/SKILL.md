---
name: firecrawl-goal
description: Точка входа в Task Master workflow для ресёрч-цели (роль firecrawl). Use когда дан веб-ресёрч и нужно довести его через задачи до готового результата.
---

# Задача: ресёрч-цель через workflow (firecrawl)

Возьми ресёрч-цель в работу через Task Master.

1. Инициализация при необходимости (`task-master init`).
2. Цель → задачи (`add_task`; крупное — PRD + `parse_prd`): что найти, какие источники/сайты, какая форма результата.
3. `next_task` → `get_task`; собери данные дешёвым путём: `firecrawl_search`/`firecrawl_map` (разведка) → `firecrawl_scrape` точечно → `firecrawl_crawl` (с `limit`) / `firecrawl_extract` (structured). Ход — `update_subtask`.
4. Проверь `testStrategy` (данные собраны, источники указаны, структура валидна) → `set_task_status --status=done`; повторяй.

Каждый факт — с URL, ключевое сверяй по ≥2 источникам. Опирайся на `$web-scraping`, `$workflow`, `$task-master`. Веди как роль `$firecrawl`.
