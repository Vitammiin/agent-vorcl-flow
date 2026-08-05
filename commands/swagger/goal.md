---
description: Полное покрытие Fastify Swagger через Task Master — аудит непокрытых роутов → задачи → покрытие → проверка (swagger)
argument-hint: "[модуль/область; по умолчанию весь src/modules]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Доведи покрытие Fastify Swagger до полного через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Аудит (**read-only**) по скиллу `swagger-coverage`: собери все роуты в `src/modules/*/routes.ts` и плагинах и найди не полностью покрытые OpenAPI (нет `schema`/`response`; нет ответов-ошибок через общий `ErrorSchema`; пустые/шаблонные `summary`/`description`; нет `tags`/`operationId`; `hide: true` на публичном роуте; защищённый роут без `security`; рассинхрон zod↔controller; «дыры» против `GET /documentation/json` / `app.swagger()`).
3. На каждую значимую дыру — `add_task` (метод+путь роута, модуль, чего не хватает, `file:line`, severity).
4. `next_task` → `get_task`; покрой роут по скиллу `swagger-coverage`: дополни zod-схемы в `schemas.ts` (вход + все ответы + общий `ErrorSchema`), подключи их в `routes.ts`, проставь `summary`/`description`/`tags`/`operationId`, а для защищённых — `security`. Ход фиксируй через `update_subtask`.
5. Проверь `testStrategy`: спека собирается, `npx @redocly/cli lint` зелёный, `npx openapi-typescript` без ошибок, тесты проходят; при успехе — `set_task_status --status=done`; вернись к шагу 4, пока есть задачи.

Опирайся на навыки `swagger-coverage`, `backend-architecture`, `workflow`, `task-master`. Делегируй субагенту `swagger`.
