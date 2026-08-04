---
description: Генерация API-эндпоинта (backend)
argument-hint: "<спецификация эндпоинта>"
allowed-tools: Read, Write, Edit, Bash
---

Сгенерируй REST-эндпоинт: **$ARGUMENTS**.

Размести код по модульной архитектуре из скилла `backend-architecture`: определи модуль в `src/modules/<module>/` (auth, users, ai, billing, notifications или новый) и разложи по слоям — `schemas` (валидация), `dto`/`types`, `repository` (БД), `service` (логика), `controller` (HTTP), `routes` (маршрут + middleware), экспорт через `index.ts`. Дай типы (вывод из zod-схем), валидацию входа, обработку ошибок и пример теста. Опирайся на навыки `nodejs`, `typescript`. При необходимости делегируй субагенту `backend`.
