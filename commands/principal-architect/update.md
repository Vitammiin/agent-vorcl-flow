---
description: Обновить существующий code-grounded архитектурный пакет после изменений кода: полный rescan, evidence diff и атомарная перегенерация всех форматов.
argument-hint: "[--scope <relative-path>] [--formats all|md,html,pdf,drawio,mermaid] [--target]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Обнови архитектурный пакет текущего репозитория: **$ARGUMENTS**.

Используй `$principal-architecture` и bundled `scripts/principal-architecture.mjs update`. Требуй существующий manifest; иначе направь на `/principal-architect:create`. Выполни полный scan, сохрани config/annotations/unmanaged-файлы, проверь `architecture.diff.json`, затем провалидируй все requested formats, включая bundled `validate-drawio.mjs` и `xmllint` для draw.io.

Отдай путь, added/removed/changed nodes/edges, новые/закрытые findings, unknowns и статус форматов. Веди как роль `$principal-architect`.
