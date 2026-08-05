---
name: swagger-goal
description: Точка входа в Task Master workflow для полного покрытия Fastify Swagger (роль swagger). Use когда нужно довести документацию API до полноты: аудит → задачи → покрытие → проверка.
---

# Задача: полное покрытие Fastify Swagger через workflow

Доведи покрытие Fastify Swagger до полного через Task Master.

1. Инициализация при необходимости (`task-master init`).
2. Аудит (**read-only**) по `$swagger-coverage`: найди роуты в `src/modules/*/routes.ts` и плагинах, не полностью покрытые OpenAPI (нет `schema`/`response`/ответов-ошибок/`tags`/`operationId`/`security`; `hide: true`; рассинхрон zod↔controller; «дыры» против `GET /documentation/json`).
3. На каждую дыру — `add_task` (метод+путь, модуль, чего не хватает, `file:line`).
4. `next_task` → `get_task`; покрой роут: дополни zod-схемы в `schemas.ts` (вход + все ответы + `ErrorSchema`), подключи в `routes.ts`, проставь `summary`/`description`/`tags`/`operationId`/`security`. Ход — через `update_subtask`.
5. Проверь `testStrategy` (спека собирается, `@redocly/cli lint`, `openapi-typescript` без ошибок, тесты) → `set_task_status --status=done`; повторяй.

Опирайся на `$swagger-coverage`, `$backend-architecture`, `$workflow`, `$task-master`. Веди реализацию как роль `$swagger`.
