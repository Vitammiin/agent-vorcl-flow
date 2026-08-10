---
description: Полная карта архитектуры репозитория — extraction в architecture.json, LLM-аннотация и все форматы: интерактивный HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF (archmap). Use when нужен весь набор артефактов разом; только JSON → /archmap:extract, только HTML → /archmap:html, только диаграммы → /archmap:diagram, крупная цель с этапами → /archmap:vorcl
argument-hint: "[путь к репо (default: текущий)] [--full: не схлопывать модули]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Построй полную карту архитектуры репозитория: **$ARGUMENTS**.

Пайплайн скилла `archmap` (скрипты в `<skill-root>/scripts/`, рабочий каталог `.archmap/` в целевом репо):

1. `scan.mjs` → `plan.json`; сообщи задетектированные стеки и режим парсера (ts|regex).
2. Пять экстракторов (`extract-data`, `extract-api`, `extract-agents`, `extract-modules`, `extract-env`) — одной параллельной пачкой → part-файлы.
3. `merge.mjs --check` → `architecture.json`; при ошибках контракта — чини экстрактор-виновник, не JSON руками.
4. **LLM-аннотация:** прочитай `architecture.json` и код, напиши `.archmap/annotations.json` (память агентов, семантические `dataflow`-рёбра, назначение модулей) — каждому элементу лучшее доказательство `source:{file,line}`; повторный `merge --annotate --check` сам понизит бездоказательное в `inferred:true`.
5. Рендеры строго из JSON: `to-html.mjs`, `to-drawio.mjs`, `to-mermaid.mjs --view all`, `to-md.mjs`, `to-pdf.mjs` (мягкий skip без Chrome).
6. **Материализуй** итог в `docs/architecture/` целевого репо (architecture.json, .html, .drawio, .mmd, ARCHITECTURE.md, .pdf), предложи `.archmap/` в `.gitignore`. Провалидируй: повторный прогон merge даёт идентичный JSON; `xmllint --noout` для `.drawio` зелёный; HTML открывается с `file://`. **Только проверенные артефакты = готово.**

Отдай: пути ко всем файлам + сводку из `stats` (узлы/рёбра/inferred/циклы/truncated) + находки (циклы импортов, роуты без auth, бесхозные env) + что осталось inferred. Опирайся на навыки `archmap`, `system-design`. Делегируй субагенту `archmap`.
