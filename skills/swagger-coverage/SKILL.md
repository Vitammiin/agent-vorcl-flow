---
name: swagger-coverage
description: Полное покрытие Fastify Swagger (OpenAPI) для всех роутов бэкенда — аудит непокрытых/частично покрытых эндпоинтов и их корректное покрытие через zod-схемы как единый источник и валидации, и OpenAPI. Use при добавлении/ревью роутов, аудите документации API и перед генерацией фронт-клиента из OpenAPI.
version: 1.0.0
---

# Навык: Swagger Coverage (Fastify OpenAPI)

Каждый роут бэкенда должен быть **полностью** описан в OpenAPI-спеке, которую отдаёт `@fastify/swagger`. Спека — единственный источник правды для фронтового клиента (скилл `data-fetching`). Источник самой спеки — zod-схемы из `schemas.ts` модуля.

Архитектура (дефолт): Fastify; `src/app/plugins/swagger.plugin.ts` регистрирует `@fastify/swagger` + `@fastify/swagger-ui`; модули в `src/modules/<module>/` со слоями `routes.ts` / `schemas.ts` (zod) / `controller.ts` / `service.ts` / `repository.ts`. Типы — `z.infer` из схем (скилл `backend-architecture`).

## Чек-лист: когда операция «полностью покрыта»
Роут покрыт полностью, если его объект `schema` содержит ВСЁ применимое:
- [ ] `summary` — осмысленный, одна строка, не заглушка.
- [ ] `description` — что делает операция, побочные эффекты, ограничения. Не «TODO», не копия `summary`.
- [ ] `tags` — тег модуля (`['users']`); группирует операции в UI и в сгенерированном клиенте.
- [ ] `operationId` — стабильный, уникальный, `camelCase` (`getUserById`). Влияет на имена методов клиента — не менять без причины.
- [ ] `params` — типизированы, если в пути есть `:param`.
- [ ] `querystring` — типизирован, если роут читает query.
- [ ] `headers` — типизированы, если роут читает нестандартные заголовки.
- [ ] `body` — типизирован для `POST/PUT/PATCH`.
- [ ] `response` — схема по **каждому** реально возвращаемому статусу: `200`/`201`/`204` + все ошибки роута (`400`/`401`/`403`/`404`/`409`/`422`/`500`) через общий `ErrorSchema`.
- [ ] `security` — на всех защищённых (за `requireAuth`/jwt) роутах.
- [ ] `examples` — где формат неочевиден.
- [ ] `deprecated: true` — на устаревших роутах (а не тихое удаление из спеки).

Правило: **покрытие ≠ ослабление.** НЕ упрощай валидацию, НЕ заменяй схемы ответа на `z.any()`/`z.unknown()` и НЕ ставь `hide: true`, чтобы «спрятать» непокрытый роут.

## Единый источник правды: zod → OpenAPI
Одни и те же схемы из `schemas.ts` дают И валидацию Fastify, И OpenAPI — через `fastify-type-provider-zod`: `validatorCompiler`/`serializerCompiler` (валидация/сериализация) + `jsonSchemaTransform` в `@fastify/swagger` (per-route схема). Переиспользуемые компоненты (`User`, `Error`) регистрируются в реестре zod и попадают в `components.schemas` через `$ref` (`jsonSchemaTransformObject`).

Альтернативы: `zod-to-json-schema` вручную; либо TypeBox + `@fastify/type-provider-typebox` (JSON Schema «из коробки», без transform).

`swagger.plugin.ts`:
```ts
import fp from 'fastify-plugin'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import {
  jsonSchemaTransform, jsonSchemaTransformObject,
  serializerCompiler, validatorCompiler,
} from 'fastify-type-provider-zod'

export const swaggerPlugin = fp(async (app) => {
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(fastifySwagger, {
    openapi: {
      openapi: '3.1.0',
      info: { title: 'API', version: env.APP_VERSION },
      components: {
        securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
      },
    },
    transform: jsonSchemaTransform,            // per-route schema
    transformObject: jsonSchemaTransformObject, // переиспользуемые $ref-компоненты
  })
  await app.register(fastifySwaggerUI, { routePrefix: '/documentation' })
})
```

`schemas.ts` (общий error-компонент + схемы модуля):
```ts
import { z } from 'zod'

export const ErrorSchema = z.object({
  error: z.string(), message: z.string(), code: z.string().optional(),
})
z.globalRegistry.add(ErrorSchema, { id: 'Error' }) // → components.schemas.Error

export const UserParams = z.object({ id: z.string().uuid() })
export const UserResponse = z.object({
  id: z.string().uuid(),
  email: z.string().email().describe('Email пользователя'),
  createdAt: z.string().datetime(),
})
export type UserResponse = z.infer<typeof UserResponse>
```

`routes.ts` с полной `schema`:
```ts
app.withTypeProvider<ZodTypeProvider>().get('/users/:id', {
  onRequest: [requireAuth],
  schema: {
    summary: 'Получить пользователя по id',
    description: 'Возвращает публичный профиль. 404 если не найден.',
    tags: ['users'],
    operationId: 'getUserById',
    security: [{ bearerAuth: [] }],
    params: UserParams,
    response: { 200: UserResponse, 401: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema },
  },
}, usersController.getById)
```

## Аудит: поиск НЕ полностью покрытых роутов (read-only)
Шаг 1 — собрать все объявления роутов:
```bash
rg -n "\.(get|post|put|patch|delete)\(|\.route\(|app\.route\(" src/modules/*/routes.ts src/app/plugins
```
Шаг 2 — по каждому роуту проверить `schema` и под-ключи. Сигналы «дыр»:
```bash
# роуты без schema
rg -n -A3 "\.(get|post|put|patch|delete)\(" src/modules/*/routes.ts | rg -v "schema"
# schema без response
rg -Un "schema:\s*\{(?:[^}]|\n)*?\}" src/modules/*/routes.ts | rg -L "response"
# шаблонные/пустые summary|description
rg -n "summary:\s*['\"]?(TODO|test|тест|''|\"\")" src/modules/*/routes.ts
rg -n "description:\s*['\"]\s*['\"]" src/modules/*/routes.ts
# нет operationId
rg -Ln "operationId" src/modules/*/routes.ts
# hide:true на публичных роутах (подозрительно)
rg -n "hide:\s*true" src/modules/*/routes.ts src/app/plugins
# защищённые (requireAuth/jwt) без security
rg -n -B2 -A8 "requireAuth|verifyJwt|onRequest" src/modules/*/routes.ts | rg -L "security"
```
Шаг 3 — рассинхрон zod ↔ controller: сверить поля/статусы, которые controller кладёт в `reply.send(...)`, с `response`-схемой из `schemas.ts`.

Шаг 4 — сверка с фактической спекой. Получить реальный OpenAPI и сравнить множества путей:
```bash
curl -s localhost:3000/documentation/json > /tmp/openapi.json   # рантайм-эндпоинт
# либо без сервера: собрать app → await app.ready() → app.swagger()
```
Путь из `routes.ts` (grep из шага 1), которого нет в `openapi.paths` или он неполон (нет нужных статусов/`operationId`) — это «дыра».

## Как полноценно ПОКРЫТЬ (write)
По одному роуту:
1. В `schemas.ts`: добавить/дополнить zod-схемы — вход (`params`/`query`/`headers`/`body`) и **все** ответы (успех + ошибки). Один раз зарегистрировать `ErrorSchema` в `z.globalRegistry`.
2. В `routes.ts`: подключить схемы в `schema`, проставить `summary`/`description`/`tags`/`operationId`.
3. Для защищённых роутов — добавить `security: [{ bearerAuth: [] }]` (securityScheme объявлен в плагине).
4. Сверить controller: он возвращает РОВНО то, что в `response`-схеме, с правильными статусами. При расхождении — править controller/схему, но не ослаблять валидацию.
5. Типы — из `z.infer`, чтобы controller и клиент не разъехались.

Запрещено: `hide: true` ради «покрытия», ослабление схем ответа до `z.any()`/`z.unknown()`.

## Проверка (verification)
- Собрать спеку: `app.swagger()` → `openapi.json` (или `GET /documentation/json`).
- Провалидировать: `npx @redocly/cli lint openapi.json` (или `swagger-cli validate openapi.json`).
- Убедиться, что каждый роут присутствует с полным operation-объектом (`operationId`, `responses` по статусам, `security` где нужно).
- Сгенерировать типы фронта без ошибок: `npx openapi-typescript openapi.json -o src/shared/api/schema.d.ts`.
- Прогнать тесты бэка (ответы совпадают со схемами).

## Связь с фронтендом
Эта спека — источник истины для фронтового клиента (скилл `data-fetching`): фронт всегда бьёт в реальные эндпоинты, типы генерируются из OpenAPI, моков в прод-пути нет.
