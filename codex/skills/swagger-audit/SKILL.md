---
name: swagger-audit
description: Read-only аудит покрытия OpenAPI/Swagger — найти роуты, не полностью покрытые спекой, на любом стеке (роль swagger). Use when нужно только НАЙТИ дыры покрытия без правок; покрывать найденное — $swagger-cover.
---

# Задача: аудит покрытия OpenAPI/Swagger

Найди роуты/эндпоинты, НЕ полностью покрытые OpenAPI/Swagger (**read-only**).

Сначала **определи стек и источник спеки** (не предполагай Fastify) по `package.json`/импортам/файлам: Fastify (`@fastify/swagger`), Express (`swagger-jsdoc`/`tsoa`), NestJS (`@nestjs/swagger`), Koa, Hapi (`hapi-swagger`), tRPC (`trpc-openapi`), статическая `openapi.{yaml,json}` или не-JS (FastAPI/Spring/DRF). Спека нигде не отдаётся/не генерируется — это уже дыра.

Собери роуты способом под стек (эвристики — в `$swagger-coverage`) и получи фактическую спеку (эндпоинт `/documentation/json` · `/api-json` · `/openapi.json` · `/v3/api-docs`; статический файл; генератор). Сопоставь и применяй универсальный чек-лист: операции нет в спеке; нет `summary`/`description`/`tags`/`operationId`; `responses` без ошибок через общий Error-компонент; защищённый роут без `security`; роут скрыт из спеки; рассинхрон схемы ответа с хендлером.

Ничего не правь. Формат: `file:line`, роут (метод+путь), чего не хватает, severity `critical>high>medium>low`. По значимым — `add_task`. В конце — обнаруженный стек + сводка покрытия по модулям/тегам. Опирайся на `$swagger-coverage`.
