---
description: Статус сервиса Render + деплой + метрики (render). Use when нужна read-only сводка здоровья сервиса без действий; глубокая диагностика по логам → /render:logs, деплой → /render:deploy
argument-hint: "<service>"
allowed-tools: Read, Bash, Grep, Glob, WebFetch
---

Дай сводку здоровья сервиса Render: **$ARGUMENTS**.

Убедись в выбранном workspace (`get_selected_workspace`/`select_workspace`). Покажи: детали сервиса (`get_service` — в т.ч. native или Docker-рантайм), статус последнего деплоя (`list_deploys`/`get_deploy`) и ключевые метрики (`get_metrics` — CPU/RAM, инстансы, ответы по статус-кодам, latency при Pro+). Сведи в короткий отчёт: состояние, аномалии (рестарт-луп, всплеск 5xx, OOM по RAM, деплой не `live`), рекомендации. Только чтение — без мутаций. Опирайся на навык `render`. Делегируй субагенту `render` (при необходимости — `backend`).
