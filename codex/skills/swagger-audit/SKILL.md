---
name: swagger-audit
description: Read-only аудит покрытия Fastify Swagger — найти роуты, не полностью покрытые OpenAPI (роль swagger). Use для ревью документации API без правок.
---

# Задача: аудит покрытия Fastify Swagger

Найди роуты, НЕ полностью покрытые Fastify Swagger (**read-only**).

Собери все объявления роутов (`fastify.get/post/put/patch/delete`, `app.route(`, `.route({`) в `src/modules/*/routes.ts` и плагинах. Для каждого проверь `schema` и под-ключи. Отметь дыры: роуты без `schema`; `schema` без `response`; нет ответов-ошибок (`400/401/403/404/409/422/500`) через общий `ErrorSchema`; пустые/шаблонные `summary`/`description`; нет `tags`/`operationId`; `hide: true` на публичном роуте; защищённые (за `requireAuth`/`verifyJwt`/`onRequest`) без `security`; рассинхрон zod-схемы (`schemas.ts`) с тем, что отдаёт controller. Сверь с фактической спекой (`GET /documentation/json` / `app.swagger()`) — «дыры» между кодом и спекой.

Ничего не правь. Формат находки: `file:line`, роут (метод+путь), чего не хватает, severity `critical>high>medium>low`. По значимым — `add_task`. В конце — сводка покрытия по модулям. Опирайся на `$swagger-coverage`.
