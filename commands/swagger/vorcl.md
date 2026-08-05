---
description: Полное покрытие OpenAPI/Swagger через Task Master — аудит непокрытых роутов → задачи → покрытие → проверка (swagger)
argument-hint: "[модуль/область/путь; по умолчанию весь код бэка]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Доведи покрытие OpenAPI/Swagger до полного через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. **Определи стек** (не предполагай Fastify) и источник спеки по `package.json`/импортам/файлам: Fastify/Express/NestJS/Koa/Hapi/tRPC, статическая `openapi.{yaml,json}` или не-JS (FastAPI/Spring/DRF). Аудит (**read-only**) по скиллу `swagger-coverage`: собери роуты способом под стек и найди не полностью покрытые спекой (операции нет в спеке; нет `summary`/`description`/`tags`/`operationId`; `responses` без ошибок через общий Error-компонент; защищённый роут без `security`; роут скрыт из спеки; рассинхрон схемы ответа с хендлером; «дыры» против фактической спеки — `/documentation/json` · `/api-json` · `/openapi.json` · генератор).
3. На каждую значимую дыру — `add_task` (метод+путь роута, модуль/тег, чего не хватает, `file:line`, severity).
4. `next_task` → `get_task`; покрой роут по скиллу `swagger-coverage` механизмом стека (Fastify `schema`+zod / Nest `@Api*` / tsoa / JSDoc / Hapi `options` / статическая спека): вход + все ответы + общий Error-компонент, `summary`/`description`/`tags`/`operationId`, `security` для защищённых. Ход фиксируй через `update_subtask`.
5. Проверь `testStrategy`: спека собирается/валидируется (`npx @redocly/cli lint`), `npx openapi-typescript` без ошибок, тесты проходят; при успехе — `set_task_status --status=done`; вернись к шагу 4, пока есть задачи.

Опирайся на навыки `swagger-coverage`, `backend-architecture`, `workflow`, `task-master`. Делегируй субагенту `swagger`.
