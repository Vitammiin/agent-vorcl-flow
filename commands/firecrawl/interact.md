---
description: Взаимодействие с живой страницей через Firecrawl: клики, формы и навигация, когда scrape недостаточно.
argument-hint: "<URL> — <действия/цель>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Выполни browser interaction: **$ARGUMENTS**.

Сначала попробуй scrape. Если нужны действия, проверь `firecrawl interact --help`, затем используй CLI; иначе MCP/REST `/v2/interact`. Перед отправкой формы, публикацией, покупкой, авторизацией или иным необратимым действием покажи точное действие и дождись подтверждения. Не извлекай и не логируй cookies/секреты. Останови browser session и сохрани результат/скрин действий в `.firecrawl/`.
