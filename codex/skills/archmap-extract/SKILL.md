---
name: archmap-extract
description: Только фаза Extraction — детерминированные скрипты обходят репо и пишут architecture.json с source:{file,line} у каждого узла, без рендеров (роль archmap). Use when нужен машиночитаемый граф для своих инструментов или перед точечным рендером; полный набор форматов → $archmap-map, обогатить готовый JSON → $archmap-annotate.
---

# Задача: извлечь граф архитектуры в architecture.json (archmap)

Извлеки граф архитектуры репозитория в `architecture.json` (см. `$archmap`).

Пайплайн скилла `$archmap`: `scan.mjs` → пять экстракторов параллельной пачкой (`extract-data`, `extract-api`, `extract-agents`, `extract-modules`, `extract-env`) → `merge.mjs --check`. Рендеры НЕ запускай. Сообщи задетектированные стеки и режим парсера; если `typescript` в целевом репо не найден — честно скажи про regex-fallback и сниженную точность.

**Материализуй** `architecture.json` в `.archmap/` целевого репо (или в указанный `--out-dir`) и провалидируй: `merge --check` без ошибок контракта, повторный прогон даёт байт-в-байт идентичный JSON. **Только валидный артефакт = готово.**

Отдай: путь к `architecture.json` + сводку `stats` (узлы/рёбра по слоям, inferred, stubs, циклы, truncated) + какие стеки задетектированы с evidence. Опирайся на `$archmap`. Веди как роль `$archmap`.
