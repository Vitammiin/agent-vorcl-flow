---
name: archmap-diagram
description: Диаграммы draw.io и/или Mermaid из architecture.json — многостраничный mxfile (Overview/ERD/API/Agents) и .mmd (flowchart/erDiagram) строго из извлечённых фактов (роль archmap). Use when диаграмма нужна в редактируемом или git-friendly формате; интерактивная карта → $archmap-html, диаграмма по словесному описанию без кода → $drawio-create или $mermaid-create.
---

# Задача: диаграммы draw.io/Mermaid из architecture.json (archmap)

Построй диаграммы архитектуры из `architecture.json` (см. `$archmap`, `$drawio-diagrams`, `$mermaid-diagrams`).

Если JSON ещё нет — сначала extraction по скиллу `$archmap`. Затем рендеры строго из JSON (руками узлы не добавляй — только через `$archmap-annotate`):
- **draw.io**: `to-drawio.mjs` — многостраничный mxfile (Overview со слоями-контейнерами, Data как ERD с `shape=table` и ER-стрелками по cardinality, API, Agents; `--pages` выбирает подмножество).
- **Mermaid**: `to-mermaid.mjs --view …` — flowchart LR с subgraph-слоями, erDiagram для данных; большие графы капятся с честным `%% truncated`.

**Материализуй** файлы в `docs/architecture/` и провалидируй: `.drawio` — `xmllint --noout` зелёный, уникальные id, inferred → `dashed=1`; `.mmd` — реальный рендер (mcp-mermaid или mermaid-cli, канон скилла `$mermaid-diagrams`). **Только валидные артефакты = готово.**

Отдай: пути + как открыть в app.diagrams.net + счётчики по страницам/вью + что усечено при капе. Опирайся на `$archmap`, `$drawio-diagrams`, `$mermaid-diagrams`. Веди как роль `$archmap`.
