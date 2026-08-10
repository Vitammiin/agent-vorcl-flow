---
description: Только фаза Extraction — детерминированные скрипты обходят репо и пишут architecture.json с source:{file,line} у каждого узла, без рендеров (archmap). Use when нужен машиночитаемый граф для своих инструментов или перед точечным рендером; полный набор форматов → /archmap:map, обогатить готовый JSON → /archmap:annotate
argument-hint: "[путь к репо (default: текущий)] [--full: не схлопывать модули]"
allowed-tools: Read, Write, Bash, Grep, Glob
---

Извлеки граф архитектуры репозитория в `architecture.json`: **$ARGUMENTS**.

Пайплайн скилла `archmap`: `scan.mjs` → пять экстракторов параллельной пачкой (`extract-data`, `extract-api`, `extract-agents`, `extract-modules`, `extract-env`) → `merge.mjs --check`. Рендеры НЕ запускай. Сообщи задетектированные стеки и режим парсера; если `typescript` в целевом репо не найден — честно скажи про regex-fallback и сниженную точность.

**Материализуй** `architecture.json` в `.archmap/` целевого репо (или в указанный `--out-dir`) и провалидируй: `merge --check` без ошибок контракта, повторный прогон даёт байт-в-байт идентичный JSON. **Только валидный артефакт = готово.**

Отдай: путь к `architecture.json` + сводку `stats` (узлы/рёбра по слоям, inferred, stubs, циклы, truncated) + какие стеки задетектированы с evidence. Опирайся на навык `archmap`. Делегируй субагенту `archmap`.
