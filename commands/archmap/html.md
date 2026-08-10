---
description: Интерактивная HTML-карта архитектуры из architecture.json — self-contained файл с тумблерами слоёв, trace-подсветкой путей, панелью file:line, поиском и print-CSS (archmap). Use when нужен главный визуальный артефакт для изучения связей; нет ещё architecture.json → /archmap:map или /archmap:extract, draw.io/Mermaid → /archmap:diagram
argument-hint: "[путь к architecture.json или репо] [--pdf: сразу напечатать PDF]"
allowed-tools: Read, Write, Bash, Grep, Glob
---

Собери интерактивную HTML-карту архитектуры: **$ARGUMENTS**.

Если `architecture.json` ещё нет — сначала прогон extraction по скиллу `archmap` (`scan` → экстракторы → `merge --check`). Затем `to-html.mjs --in … --out …` — рендер строго из JSON, руками узлы не дорисовывай. При `--pdf` — следом `to-pdf.mjs` (мягкий skip без Chrome: подскажи Cmd+P, print-CSS уже встроен).

**Материализуй** `architecture.html` в `docs/architecture/` целевого репо и провалидируй: файл self-contained (ноль внешних запросов), открывается с `file://`, слои-тумблеры и клик по узлу работают, inferred рисуется пунктиром. **Только проверенный артефакт = готово.**

Отдай: путь + команду открыть (`open docs/architecture/architecture.html`) + сводку `stats` + подсказку по интерактиву (тумблеры слоёв, клик → панель file:line, Trace ↑/↓, поиск, Cmd+P → PDF). Опирайся на навык `archmap`. Делегируй субагенту `archmap`.
