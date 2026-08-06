---
description: Покрыть роут/модуль OpenAPI/Swagger — параметры, ответы, описания, security + проверка. Use when роут/модуль надо задокументировать (править код/спеку); найти дыры без правок — /swagger:audit (swagger)
argument-hint: "<роут/модуль для покрытия>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Полноценно покрой OpenAPI/Swagger: **$ARGUMENTS**.

Сначала определи стек и механизм документации (не предполагай Fastify): `schema` у Fastify, `@ApiOperation/@ApiResponse/@ApiTags` у NestJS, JSDoc `@openapi` (swagger-jsdoc) или декораторы у tsoa, `options.validate/response/tags` у Hapi, `.meta.openapi` у tRPC, либо правки прямо в статической `openapi.{yaml,json}`. По скиллу `swagger-coverage`:
1. Опиши вход (`params`/`query`/`headers`/`body`) и **все** ответы (успех + ошибки), заведи/переиспользуй общий Error-компонент. Для Fastify+zod — схемы в `schemas.ts` + `z.globalRegistry` для `$ref`.
2. Проставь `summary`/`description`/`tags`/`operationId`; для защищённых роутов — `security`.
3. Сверь хендлер/controller: он возвращает РОВНО то, что в схеме ответа, с верными статусами. При расхождении правь хендлер или схему, но НЕ ослабляй валидацию.
4. Запрещено: прятать роут из спеки (`hide`/exclude) и ставить `any`/пустые схемы ради «покрытия».
5. **Валидация спеки — обязательный шаг готовности.** Получи итоговую спеку (рантайм-эндпоинт стека / статический файл / генератор; для рантайм-спеки запусти приложение и убедись, что она отдаётся) и прогони `npx swagger-cli validate <spec>` или `npx @redocly/cli lint <spec>` + `npx openapi-typescript <spec>` без ошибок; прогони тесты. **Только валидная спека = готово** — при ошибках валидации чини и перегоняй, невалидную спеку не сдавай.

Опирайся на навыки `swagger-coverage`, `backend-architecture`, `typescript`. Делегируй субагенту `swagger`.
