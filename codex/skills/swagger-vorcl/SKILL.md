---
name: swagger-vorcl
description: Точка входа в Task Master workflow для полного покрытия OpenAPI/Swagger на любом стеке (роль swagger). Use когда нужно довести документацию API до полноты: детект стека → аудит → задачи → покрытие → проверка.
---

# Задача: полное покрытие OpenAPI/Swagger через workflow

Доведи покрытие OpenAPI/Swagger до полного через Task Master.

1. Инициализация при необходимости (`task-master init`).
2. **Определи стек** (не предполагай Fastify) и источник спеки по `package.json`/импортам/файлам. Аудит (**read-only**) по `$swagger-coverage`: собери роуты способом под стек и найди не полностью покрытые (операции нет в спеке; нет `summary`/`description`/`tags`/`operationId`/`security`; `responses` без ошибок; роут скрыт из спеки; рассинхрон схемы с хендлером; «дыры» против фактической спеки — `/documentation/json` · `/api-json` · `/openapi.json` · генератор).
3. На каждую дыру — `add_task` (метод+путь, модуль/тег, чего не хватает, `file:line`).
4. `next_task` → `get_task`; покрой роут механизмом стека (Fastify `schema`+zod / Nest `@Api*` / tsoa / JSDoc / Hapi `options` / статическая спека): вход + все ответы + общий Error-компонент, `summary`/`description`/`tags`/`operationId`/`security`. Ход — `update_subtask`.
5. Проверь `testStrategy` (спека валидируется `@redocly/cli lint`, `openapi-typescript` без ошибок, тесты) → `set_task_status --status=done`; повторяй.

Опирайся на `$swagger-coverage`, `$backend-architecture`, `$workflow`, `$task-master`. Веди реализацию как роль `$swagger`.
