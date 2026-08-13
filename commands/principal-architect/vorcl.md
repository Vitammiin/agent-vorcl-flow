---
description: Полная цель Principal Architect через Task Master — code extraction, архитектурный review, проверенные MD/JSON/HTML/PDF/draw.io/Mermaid артефакты и при запросе TARGET/MIGRATION.
argument-hint: "<архитектурная цель>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Возьми цель в работу через `$workflow` и `$task-master`: **$ARGUMENTS**.

Создай точечную задачу или PRD, затем `next_task` → `get_task` → при сложности `expand_task`. Реализуй через `$principal-architecture`: extraction из кода → model validation → ARCHITECTURE.md → рендеры → testStrategy. Не ставь `done`, пока артефакты реально не проверены. TARGET/MIGRATION добавляй только если это часть цели.

Отдай пути, stats, findings, unknowns, trade-offs и статус Task Master. Веди как роль `$principal-architect`.
