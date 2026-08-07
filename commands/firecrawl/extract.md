---
description: Структурированное извлечение по JSON-схеме через Firecrawl (firecrawl). Use when нужен типизированный JSON строго по схеме с одного или многих URL/домена; сырой markdown одной страницы → /firecrawl:scrape
argument-hint: "<URL(ы)/домен> — какие поля извлечь"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Извлеки структурированные данные: **$ARGUMENTS**.

Для одной страницы предпочти structured scrape. Для нескольких URL/домена используй поддерживаемый CLI после проверки `--help`, иначе MCP extract, иначе актуальный REST endpoint. Сначала составь JSON Schema, затем проверь результат по ней. Сохрани JSON и source URLs в `.firecrawl/`; не добавляй отсутствующие поля догадками.
