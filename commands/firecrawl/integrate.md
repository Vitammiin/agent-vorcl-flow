---
description: Интеграция Firecrawl API в приложение через официальные upstream firecrawl-build skills.
argument-hint: "<что Firecrawl должен делать в продукте>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Интегрируй Firecrawl в продукт: **$ARGUMENTS**.

Используй установленный upstream `firecrawl-build`, затем подходящий `firecrawl-build-*`. Если skills отсутствуют, предложи `$firecrawl-setup`; установку выполняй только после подтверждения. Сначала изучи стек и существующие conventions, выбери endpoint, SDK и безопасную env-конфигурацию. Не коммить `FIRECRAWL_API_KEY`. Реализуй один реальный smoke request, тест обработки ошибок и инструкцию запуска.
