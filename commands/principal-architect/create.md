---
description: Создать полный code-grounded архитектурный пакет текущего репозитория: сначала ARCHITECTURE.md, затем JSON, HTML, draw.io, Mermaid и PDF. Use для первого анализа; существующий пакет обновляет /principal-architect:update.
argument-hint: "[--scope <relative-path>] [--formats all|md,html,pdf,drawio,mermaid] [--target]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Создай архитектурный пакет текущего репозитория: **$ARGUMENTS**.

Используй `$principal-architecture`. Определи repository root из `cwd`; не проси абсолютный путь. Запусти bundled `scripts/principal-architecture.mjs create` с аргументами пользователя. Не используй README/Markdown как evidence, не исполняй код проекта. После генерации проверь model evidence, HTML, draw.io через bundled `validate-drawio.mjs` и `xmllint`, Mermaid реальным рендером при доступности и PDF визуально при доступности browser/Poppler.

Отдай путь, stats, findings, unknowns, parser coverage и статус каждого формата. Веди как роль `$principal-architect`.
