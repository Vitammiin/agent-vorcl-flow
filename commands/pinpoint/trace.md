---
description: Шаг 4 конвейера pinpoint (read-only) — проследить логику за элементом до первопричины, обработчик → состояние → data-fetch → API/бэкенд (pinpoint). Use when вопрос «почему так себя ведёт / откуда данные?»; просто найти элемент и хендлер → /pinpoint:control, организовать правку → /pinpoint:handoff
argument-hint: "<путь к скриншоту или file:line контрола>"
allowed-tools: Read, Grep, Glob, Bash
---

Проследи логику за элементом до первопричины поведения: **$ARGUMENTS**.

Отталкиваясь от контрола (со скриншота или `file:line`), иди вглубь: **обработчик** → **состояние/стор** (`useState`/`useReducer`, Zustand/Redux-срез, контекст — см. `state-management`) → **данные** (загрузка/мутация: React Query/SWR/`fetch`/`openapi-fetch`, какой эндпоинт дёргается — см. `data-fetching`) → при необходимости **бэкенд-роут/контроллер**, обслуживающий вызов. Формулируй первопричину поведения, а не ближайший JSX.

Отдай цепочку с `file:line` на каждом звене + короткие фрагменты. Только чтение. Опирайся на навыки `ui-source-mapping`, `data-fetching`, `state-management`, `react`, `nextjs`, `typescript`. Делегируй субагенту `pinpoint`.
