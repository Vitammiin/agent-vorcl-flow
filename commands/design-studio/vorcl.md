---
description: Комплексная дизайн-цель через Task Master — контекст, варианты, HTML, preview, проверка и экспорт. Use для многошагового визуального проекта.
argument-hint: "<цель, аудитория, форматы, источники и путь сохранения>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch, WebSearch
---

Возьми дизайн-цель **$ARGUMENTS** через обязательный Task Master workflow. Делегируй роли `design-studio`, используй `$design-studio`, создай/получи задачу, выполни её в `designs/<project>/`, проверь реальным HTTP-preview и `testStrategy`, затем закрой. Не загружай все built-in skills: выбери только релевантные по `project-types.json`.
