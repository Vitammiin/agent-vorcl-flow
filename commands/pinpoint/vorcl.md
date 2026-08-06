---
description: Цель «найти и понять существующий UI по скриншоту» через Task Master — карта скриншот→исходники → задачи на правку → делегирование (pinpoint). Конвейер locate → route → control → trace → handoff, всё read-only. Use when цель комплексная («найди, пойми и организуй правку»); один шаг → отдельная pinpoint-команда, новый UI → /screenshot:convert
argument-hint: "<цель: что найти/понять/изменить + путь к скриншоту>"
allowed-tools: Read, Grep, Glob, Bash
---

Возьми в работу через Task Master цель по существующему UI: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Определи режим: **существующий проект** (есть кодовая база и якоря со скриншота грепаются по ней) — твой случай; **новый/с нуля** (генерация нового UI) — перенаправь на `/screenshot:convert`.
3. Открой скриншот через Read, собери якоря (видимый текст, ключи i18n, иконки, структура, контекст маршрута) и построй карту «скриншот → исходники» **типовым конвейером pinpoint**: `/pinpoint:locate` (экран/компонент `file:line`) → `/pinpoint:route` (маршрут/страница) → `/pinpoint:control` (конкретный контрол и обработчик) → `/pinpoint:trace` (логика: состояние/стор → data-fetch → API) → `/pinpoint:handoff` (заявка на правку и делегирование). Каждый шаг read-only; ненужные шаги пропускай.
4. Оформи находки в задачи на правку `add_task` (область front/back, `file:line`, что менять в **существующем** коде — без новых файлов/компонентов). `next_task` → `get_task`; реализацию делегируй доменному субагенту (`frontend`/`backend`/`database`), ход — `update_subtask`.
5. Проверь `testStrategy` → `set_task_status --status=done`; вернись к шагу 4.

Только чтение и картирование — сам ничего не правишь и не создаёшь. Опирайся на навыки `ui-source-mapping`, `screenshot-to-code`, `frontend-architecture`, `react`, `nextjs`, `typescript`, `i18n`, `data-fetching`, `state-management`, `workflow`, `task-master`. Делегируй субагенту `pinpoint`.
