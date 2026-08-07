---
description: Готовый артефакт из веб-данных через официальные Firecrawl workflow skills: brief, SEO audit, leads, QA, knowledge base и другие.
argument-hint: "<желаемый артефакт и тема>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Подготовь deliverable: **$ARGUMENTS**.

Используй upstream `firecrawl-workflows` и выбранный workflow skill. Если они отсутствуют, предложи `$firecrawl-setup`; установку выполняй только после подтверждения. Зафиксируй формат артефакта и входы, собери web evidence по маршруту CLI → MCP → REST, сохрани источники и итог в `.firecrawl/`. Добавь короткий rerun-inputs block и перечисли ограничения.
