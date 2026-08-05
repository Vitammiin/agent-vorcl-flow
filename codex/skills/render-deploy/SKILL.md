---
name: render-deploy
description: Деплой/редеплой сервиса на Render (роль render). Use когда нужно задеплоить или пересобрать сервис на Render, опционально с очисткой build-кэша.
---

# Задача: деплой/редеплой на Render

Задеплой/редеплой сервис на Render (см. `$render`).

Сначала выбери workspace (`get_selected_workspace`/`select_workspace`). Определи режим — native или Docker (`get_service` + `Dockerfile`/`render.yaml`): MCP не создаёт image-backed сервисы, env делится на build-time `ARG` и runtime `env`. Найди сервис (`list_services`/`get_service`), триггерни деплой (`trigger_deploy`; при необходимости — с очисткой кэша), следи за статусом (`get_deploy`/`list_deploys`) до `live`. Если менял env (`update_environment_variables`) — значения подхватятся только после редеплоя. **Деплой и правка env — необратимые мутации: спрашивай явное подтверждение человека.**
