---
name: firecrawl-extract
description: Структурированное извлечение по JSON-схеме через Firecrawl (роль firecrawl). Use when нужен типизированный JSON строго по схеме с одного или многих URL/домена; сырой markdown одной страницы → $firecrawl-scrape.
---

# Задача: структурированный extract (firecrawl)

Извлеки структурированные данные с указанных URL/домена.

Через MCP `firecrawl` выполни `firecrawl_extract`: задай `prompt` (что нужно) и **JSON Schema** под форму результата; при необходимости `enableWebSearch: true` и `showSources: true`. Для **одной** известной страницы дешевле и синхроннее — `firecrawl_scrape` в JSON-режиме (`formats: [{ type: "json", prompt, schema }]`). Верни валидный JSON строго по схеме + источники (URL). Опирайся на `$web-scraping`.
