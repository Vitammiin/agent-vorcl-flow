---
name: pinpoint-vorcl
description: Цель «найти и понять существующий UI по скриншоту» через Task Master — карта скриншот→исходники → задачи на правку → делегирование (роль pinpoint). Конвейер locate → route → control → trace → handoff, всё read-only. Use when цель комплексная («найди, пойми и организуй правку»); один шаг → отдельная pinpoint-задача, новый UI → $screenshot-convert.
---

# Задача: цель по существующему UI из скриншота через Task Master (pinpoint)

Веди цель через Task Master (`$workflow` + `$task-master`), см. `$ui-source-mapping`.

Определи режим: **существующий проект** (кодовая база есть, якоря со скриншота грепаются) — твой; **новый/с нуля** — перенаправь на `$screenshot-convert`. Открой скриншот, собери якоря и построй карту «скриншот → исходники» **типовым конвейером pinpoint**: `$pinpoint-locate` (экран/компонент `file:line`) → `$pinpoint-route` (маршрут/страница) → `$pinpoint-control` (конкретный контрол и обработчик) → `$pinpoint-trace` (логика: состояние/стор → data-fetch → API) → `$pinpoint-handoff` (заявка на правку и делегирование). Каждый шаг read-only; ненужные шаги пропускай. Оформи в задачи `add_task` (область front/back, `file:line`, что менять в **существующем** коде без новых файлов), `next_task` → реализацию делегируй `$frontend`/`$backend`/`$database`, ход — `update_subtask`, проверка `testStrategy` → `set_task_status done`. Сам только читаешь и картируешь. Опирайся на `$ui-source-mapping`, `$screenshot-to-code`, `$frontend-architecture`, `$react`, `$nextjs`, `$i18n`, `$data-fetching`, `$state-management`.
