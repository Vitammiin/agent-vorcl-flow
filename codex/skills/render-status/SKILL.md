---
name: render-status
description: Статус сервиса Render + деплой + метрики (роль render). Use когда нужна короткая сводка здоровья сервиса на Render.
---

# Задача: статус сервиса Render

Дай сводку здоровья сервиса Render (см. `$render`).

Выбери workspace (`get_selected_workspace`/`select_workspace`). Покажи детали сервиса (`get_service`), статус последнего деплоя (`list_deploys`/`get_deploy`) и ключевые метрики (`get_metrics` — CPU/RAM, инстансы, ответы по статус-кодам, latency при Pro+). Сведи в короткий отчёт: состояние, аномалии, рекомендации. Только чтение.
