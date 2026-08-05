---
description: Read-only аудит покрытия Fastify Swagger — найти роуты, не полностью покрытые OpenAPI (swagger)
argument-hint: "[модуль/область; по умолчанию весь src/modules]"
allowed-tools: Read, Grep, Glob, Bash
---

Найди роуты, НЕ полностью покрытые Fastify Swagger (**read-only**): **$ARGUMENTS**.

Собери все объявления роутов (`fastify.get/post/put/patch/delete`, `app.route(`, `.route({`) в `src/modules/*/routes.ts` и плагинах. Для каждого проверь `schema` и под-ключи. Отметь дыры: роуты без `schema`; `schema` без `response`; отсутствие ответов-ошибок (`400/401/403/404/409/422/500`) через общий `ErrorSchema`; пустые/шаблонные `summary`/`description`; нет `tags`/`operationId`; `hide: true` на публичном роуте; защищённые (за `requireAuth`/`verifyJwt`/`onRequest`) без `security`; рассинхрон zod-схемы (`schemas.ts`) с тем, что реально отдаёт controller. Сверь с фактической спекой: `GET /documentation/json` (или собери `app` → `app.swagger()`), сравни пути и статусы — «дыры» между кодом и спекой.

Ничего не правь. Формат находки: `file:line`, роут (метод+путь), чего не хватает, severity (`critical > high > medium > low`). По значимым находкам — `add_task` (Task Master). В конце — сводка покрытия по модулям (полностью/частично/не покрыто). Опирайся на навык `swagger-coverage`. Делегируй субагенту `swagger` (только чтение).
