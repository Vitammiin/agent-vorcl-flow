---
name: swagger-cover
description: Покрыть роут/модуль OpenAPI/Swagger — параметры, ответы, описания, security + проверка, на любом стеке (роль swagger). Use когда нужно довести конкретный роут/модуль до полного покрытия.
---

# Задача: покрыть роут/модуль OpenAPI/Swagger

Определи стек и механизм документации (не предполагай Fastify): `schema` у Fastify, `@ApiOperation/@ApiResponse/@ApiTags` у NestJS, JSDoc `@openapi` (swagger-jsdoc) или декораторы у tsoa, `options.validate/response/tags` у Hapi, `.meta.openapi` у tRPC, либо правки в статической `openapi.{yaml,json}`. По `$swagger-coverage`:

1. Опиши вход (`params`/`query`/`headers`/`body`) и **все** ответы (успех + ошибки), заведи/переиспользуй общий Error-компонент. Для Fastify+zod — схемы + `z.globalRegistry` для `$ref`.
2. Проставь `summary`/`description`/`tags`/`operationId`; для защищённых — `security`.
3. Сверь хендлер/controller: возвращает РОВНО то, что в схеме ответа, с верными статусами. При расхождении правь хендлер или схему, не ослабляя валидацию.
4. Запрещено: прятать роут из спеки (`hide`/exclude), ставить `any`/пустые схемы ради покрытия.

Проверка: получи спеку (эндпоинт стека / статический файл / генератор), `npx @redocly/cli lint <spec>`, `npx openapi-typescript <spec>` без ошибок, тесты. Опирайся на `$swagger-coverage`, `$backend-architecture`, `$typescript`.
