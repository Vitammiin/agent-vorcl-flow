---
description: Генерация API-эндпоинта (backend)
argument-hint: "<спецификация эндпоинта>"
allowed-tools: Read, Write, Edit, Bash
---

Сгенерируй REST-эндпоинт: **$ARGUMENTS**.

Размести код по модульной архитектуре из скилла `backend-architecture`: определи модуль в `src/modules/<module>/` (auth, users, ai, billing, notifications или новый) и разложи по слоям — `schemas` (валидация), `dto`/`types`, `repository` (БД), `service` (логика), `controller` (HTTP), `routes` (маршрут + middleware), экспорт через `index.ts`. Дай типы (вывод из zod-схем), валидацию входа, обработку ошибок и пример теста. Роут сразу **полностью** покрой OpenAPI/Swagger по скиллу `swagger-coverage` (для дефолт-стека плагина — Fastify + zod): объяви полную `schema` (`summary`/`description`/`tags`/`operationId`, `response` по всем статусам, включая ошибки через общий `ErrorSchema`, `security` для защищённых) — те же zod-схемы дают и валидацию, и OpenAPI. Опирайся на навыки `nodejs`, `typescript`. При необходимости делегируй субагенту `backend`.
