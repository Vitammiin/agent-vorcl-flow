---
name: firecrawl-extract
description: Структурированное извлечение по JSON-схеме через Firecrawl (роль firecrawl). Use когда нужны структурированные данные с одной/нескольких страниц или домена.
---

# Задача: структурированный extract (firecrawl)

Извлеки структурированные данные с указанных URL/домена.

Через MCP `firecrawl` выполни `firecrawl_extract`: задай `prompt` (что нужно) и **JSON Schema** под форму результата; при необходимости `enableWebSearch: true` и `showSources: true`. Для **одной** известной страницы дешевле и синхроннее — `firecrawl_scrape` в JSON-режиме (`formats: [{ type: "json", prompt, schema }]`). Верни валидный JSON строго по схеме + источники (URL). Опирайся на `$web-scraping`.
