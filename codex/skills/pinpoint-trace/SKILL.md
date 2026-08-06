---
name: pinpoint-trace
description: Проследить логику за элементом — обработчик → состояние → data-fetch → API/бэкенд (роль pinpoint). Use для разбора, что стоит за контролом.
---

# Задача: проследить логику за элементом (pinpoint)

Проследи логику за элементом до первопричины поведения (см. `$ui-source-mapping`). От контрола (со скриншота или `file:line`) иди вглубь: **обработчик** → **состояние/стор** (`useState`/`useReducer`, Zustand/Redux, контекст — `$state-management`) → **данные** (React Query/SWR/`fetch`/`openapi-fetch`, какой эндпоинт — `$data-fetching`) → при необходимости **бэкенд-роут/контроллер**. Формулируй первопричину, не ближайший JSX. Отдай цепочку с `file:line` на каждом звене + фрагменты. Только чтение. Опирайся на `$ui-source-mapping`, `$data-fetching`, `$state-management`, `$react`, `$nextjs`, `$typescript`.
