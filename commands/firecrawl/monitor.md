---
description: Просмотр или настройка периодического мониторинга страниц/сайтов/поиска через Firecrawl с diff и уведомлениями.
argument-hint: "<list|checks|create|update|delete> <цель>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Обработай monitor-запрос: **$ARGUMENTS**.

Проверь `firecrawl monitor --help` и подкоманду; иначе используй доступный MCP/REST `/v2/monitor`. `list` и `checks` read-only. Перед `create`, `update` или `delete` покажи target, schedule, goal и notification destination и дождись явного подтверждения. Не отправляй тестовые уведомления без согласия. Сохрани конфигурацию без секретов и последние checks в `.firecrawl/`.
