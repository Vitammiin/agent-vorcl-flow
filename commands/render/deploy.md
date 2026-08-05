---
description: Деплой/редеплой сервиса на Render (render)
argument-hint: "<service> [--clear-cache]"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch
---

Задеплой/редеплой сервис на Render: **$ARGUMENTS**.

Сначала убедись, что выбран нужный workspace (`get_selected_workspace`, при необходимости `select_workspace`). Определи режим сервиса — native или Docker (`get_service` + `Dockerfile`/`render.yaml`): для Docker MCP не создаёт image-backed сервисы, а env делится на build-time `ARG` и runtime `env`. Найди сервис (`list_services`/`get_service`), затем триггерни деплой (`trigger_deploy`); если в аргументах есть `--clear-cache` — с очисткой build-кэша. Покажи статус запущенного деплоя (`get_deploy`/`list_deploys`) и дождись `live` (или сообщи об ошибке сборки). Если менял env (`update_environment_variables`) — помни, что значения подхватятся только после редеплоя. **Деплой и правка env — необратимые мутации: перед запуском спрашивай явное подтверждение человека** (правила безопасности проекта; неоднозначные «ок/давай» prod не авторизуют). Строки подключения и секреты из env/логов сборки наружу не выводи. Опирайся на навык `render`. Делегируй субагенту `render` (при необходимости — `backend` для правок кода сервиса).
