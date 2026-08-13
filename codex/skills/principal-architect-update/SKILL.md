---
name: principal-architect-update
description: Обновить существующий code-grounded архитектурный пакет текущего репозитория полным rescan, evidence diff и атомарной перегенерацией MD/JSON/HTML/PDF/draw.io/Mermaid.
---

# Обновить архитектурный пакет

Используй `$principal-architecture` и bundled `scripts/principal-architecture.mjs update`. Требуй существующий manifest, сохрани config/annotations/unmanaged-файлы, проверь `architecture.diff.json` и все requested formats, включая bundled `validate-drawio.mjs` и `xmllint` для draw.io.

Отдай путь, added/removed/changed nodes/edges, findings, unknowns и статус форматов. Веди как `$principal-architect`.
