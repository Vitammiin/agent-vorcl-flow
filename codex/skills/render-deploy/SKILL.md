---
name: render-deploy
description: Деплой/редеплой сервиса на Render (роль backend). Use когда нужно задеплоить или пересобрать сервис на Render, опционально с очисткой build-кэша.
---

# Задача: деплой/редеплой на Render

Задеплой/редеплой сервис на Render (см. `$render`).

Сначала выбери workspace (`get_selected_workspace`/`select_workspace`). Найди сервис (`list_services`/`get_service`), триггерни деплой (`trigger_deploy`; при необходимости — с очисткой кэша), следи за статусом (`get_deploy`/`list_deploys`) до `live`. **Деплой — необратимая мутация: спрашивай явное подтверждение человека.**
