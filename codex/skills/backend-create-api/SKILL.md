---
name: backend-create-api
description: Генерация API-эндпоинта (роль backend). Use когда нужно создать REST-эндпоинт с типами, валидацией и тестом.
---

# Задача: создание API-эндпоинта

Сгенерируй REST-эндпоинт по спецификации, которую дал пользователь.

Размести код по модульной архитектуре из `$backend-architecture`: модуль `src/modules/<module>/` (auth, users, ai, billing, notifications или новый), слои `schemas → dto/types → repository → service → controller → routes`, экспорт через `index.ts`. Дай типы (вывод из zod-схем), валидацию входа, обработку ошибок и пример теста. Роут сразу **полностью** покрой Fastify Swagger по `$swagger-coverage`: полная `schema` (`summary`/`description`/`tags`/`operationId`, `response` по всем статусам, включая ошибки через общий `ErrorSchema`, `security` для защищённых) — те же zod-схемы дают и валидацию, и OpenAPI. Опирайся на `$nodejs`, `$typescript`.
