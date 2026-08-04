---
description: Статус сервиса Render + деплой + метрики (render)
argument-hint: "<service>"
---

Дай сводку здоровья сервиса Render: **$ARGUMENTS**.

Убедись в выбранном workspace (`get_selected_workspace`/`select_workspace`). Покажи: детали сервиса (`get_service`), статус последнего деплоя (`list_deploys`/`get_deploy`) и ключевые метрики (`get_metrics` — CPU/RAM, инстансы, ответы по статус-кодам, latency при Pro+). Сведи в короткий отчёт: состояние, аномалии, рекомендации. Только чтение — без мутаций. Опирайся на навык `render`. При необходимости делегируй субагенту `backend`.
