---
name: swagger-cover
description: Покрыть роут/модуль Fastify Swagger — zod-схемы, ответы, описания, security + проверка (роль swagger). Use когда нужно довести конкретный роут/модуль до полного покрытия.
---

# Задача: покрыть роут/модуль Fastify Swagger

Полноценно покрой указанный роут/модуль по `$swagger-coverage`:

1. В `schemas.ts` добавь/дополни zod-схемы — вход (`params`/`querystring`/`headers`/`body`) и **все** ответы (успех + ошибки), зарегистрируй общий `ErrorSchema` в `z.globalRegistry`.
2. В `routes.ts` подключи схемы в `schema`, проставь `summary`/`description`/`tags`/`operationId`; для защищённых роутов — `security: [{ bearerAuth: [] }]`.
3. Сверь controller: он возвращает РОВНО то, что в `response`-схеме, с верными статусами. При расхождении правь controller или схему, но НЕ ослабляй валидацию.
4. Запрещено: `hide: true` ради «покрытия», ослабление схем ответа до `z.any()`/`z.unknown()`.

Проверка: собери спеку (`app.swagger()` / `GET /documentation/json`), `npx @redocly/cli lint openapi.json`, `npx openapi-typescript` без ошибок, прогони тесты. Опирайся на `$swagger-coverage`, `$backend-architecture`, `$typescript`.
