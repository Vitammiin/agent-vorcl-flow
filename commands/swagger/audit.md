---
description: Read-only аудит покрытия OpenAPI/Swagger — найти роуты, не полностью покрытые спекой (swagger)
argument-hint: "[модуль/область/путь; по умолчанию весь код бэка]"
allowed-tools: Read, Grep, Glob, Bash
---

Найди роуты/эндпоинты, НЕ полностью покрытые OpenAPI/Swagger (**read-only**): **$ARGUMENTS**.

Сначала **определи стек и источник спеки** (не предполагай Fastify) по `package.json`, импортам и файлам: Fastify (`@fastify/swagger`), Express (`swagger-jsdoc`/`tsoa`/`swagger-ui-express`), NestJS (`@nestjs/swagger`), Koa, Hapi (`hapi-swagger`), tRPC (`trpc-openapi`), статическая `openapi.{yaml,json}`, либо не-JS (FastAPI/Spring/DRF/swaggo). Если спека нигде не отдаётся/не генерируется — это уже дыра (API не документирован).

Собери все объявления роутов способом под стек (эвристики — в навыке `swagger-coverage`: роутеры `.get/.post/.route`, декораторы Nest/tsoa, `server.route` Hapi, tRPC `.meta.openapi`) и получи фактическую спеку (рантайм-эндпоинт `/documentation/json` · `/api-json` · `/openapi.json` · `/v3/api-docs`; статический файл; или генератор). Сопоставь роуты со спекой и применяй **универсальный чек-лист операции**: операции нет в спеке; нет `summary`/`description`/`tags`/`operationId`; `responses` только для успеха, без ошибок (`4xx/5xx`) через общий Error-компонент; защищённый роут (`requireAuth`/`verifyJwt`/`@Security`/`UseGuards`) без `security`; публичный роут скрыт/исключён из спеки; рассинхрон схемы ответа с тем, что реально отдаёт хендлер. (Fastify+zod — частый дефолт, но лишь один из стеков.)

Ничего не правь. Формат находки: `file:line`, роут (метод+путь), чего не хватает, severity (`critical > high > medium > low`). По значимым находкам — `add_task` (Task Master). В конце — сводка покрытия по модулям/тегам (полностью/частично/не покрыто) с указанием обнаруженного стека. Опирайся на навык `swagger-coverage`. Делегируй субагенту `swagger` (только чтение).
