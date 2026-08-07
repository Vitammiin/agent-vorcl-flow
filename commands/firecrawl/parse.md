---
description: Парсинг локального или непубличного документа через Firecrawl в markdown/JSON; публичный URL документа обрабатывается scrape.
argument-hint: "<локальный файл> [формат/вопрос]"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Разбери документ: **$ARGUMENTS**.

Убедись, что локальный файл существует и поддерживается. Проверь `firecrawl parse --help`, затем используй CLI; при отсутствии — поддерживаемый MCP или multipart REST `/v2/parse`. Публичный URL направь в scrape. Не загружай чувствительный документ без подтверждения. Сохрани markdown/JSON в `.firecrawl/`, укажи исходный файл и ограничения распознавания.
