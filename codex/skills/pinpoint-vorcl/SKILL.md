---
name: pinpoint-vorcl
description: Цель «найти и понять существующий UI по скриншоту» через Task Master — карта скриншот→исходники → задачи на правку → делегирование (роль pinpoint). Use для цели по существующему UI из скриншота.
---

# Задача: цель по существующему UI из скриншота через Task Master (pinpoint)

Веди цель через Task Master (`$workflow` + `$task-master`), см. `$ui-source-mapping`.

Определи режим: **существующий проект** (кодовая база есть, якоря со скриншота грепаются) — твой; **новый/с нуля** — перенаправь на `$screenshot-convert`. Открой скриншот, собери якоря и построй карту «скриншот → исходники»: экран (компонент `file:line`), маршрут, контрол + обработчик, логика (состояние/стор → data-fetch → API). Оформи в задачи `add_task` (область front/back, `file:line`, что менять в **существующем** коде без новых файлов), `next_task` → реализацию делегируй `$frontend`/`$backend`/`$database`, ход — `update_subtask`, проверка `testStrategy` → `set_task_status done`. Сам только читаешь и картируешь. Опирайся на `$ui-source-mapping`, `$screenshot-to-code`, `$frontend-architecture`, `$react`, `$nextjs`, `$i18n`, `$data-fetching`, `$state-management`.
