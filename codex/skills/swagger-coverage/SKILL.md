---
name: swagger-coverage
description: Полное покрытие OpenAPI/Swagger для всех роутов бэкенда — детект стека (Fastify/Express/NestJS/Koa/Hapi/tRPC, статические спеки, не-JS), аудит непокрытых/частичных эндпоинтов и их корректное покрытие. Универсальный чек-лист операции; дефолт-пример — Fastify + zod как единый источник. Use при добавлении/ревью роутов, аудите документации API и перед генерацией фронт-клиента.
---

# Навык: OpenAPI/Swagger Coverage

Каждый роут бэкенда должен быть **полностью** описан в OpenAPI-спеке. Спека — источник истины для фронт-клиента (`$data-fetching`).

Подход **фреймворк-агностичен**: сперва определи стек и источник спеки, затем применяй **универсальный чек-лист операции**. Не предполагай Fastify по умолчанию — сначала посмотри, чем реально объявлены роуты. Ниже подробный дефолт-пример (Fastify + zod), плюс детект и эвристики под другие стеки.

## Шаг 0. Детект стека и источника спеки
По `package.json`, импортам и файлам определи, чем объявлены роуты и откуда спека:

| Стек | Роуты | Спека |
|---|---|---|
| Fastify + `@fastify/swagger` | `app.get/post(url, { schema })` | `GET /documentation/json`, `app.swagger()` |
| Express + `swagger-jsdoc` | `router.get/post`, JSDoc `@openapi` | генерируемый объект, `swagger-ui-express` |
| `tsoa` | декораторы `@Route/@Get/@Response/@Security` | `tsoa spec` → `swagger.json` |
| NestJS + `@nestjs/swagger` | `@Controller`,`@Get`,`@ApiOperation`,`@ApiResponse` | `GET /api-json` |
| Koa + `@koa/router` | `router.get/post` | статич. спека / эндпоинт |
| Hapi + `hapi-swagger` | `server.route({ method, path, options })` | `GET /swagger.json` |
| tRPC + `trpc-openapi` | процедуры + `.meta({ openapi })` | `generateOpenApiDocument(...)` |
| Статическая спека | — | `openapi.{yaml,json}` / `swagger.{yaml,json}` |
| Не-JS | FastAPI, Spring/springdoc, DRF `drf-spectacular`, Go `swaggo` | `/openapi.json`, `/v3/api-docs`, `/api/schema/` |

Спека нигде не отдаётся/не генерируется → это уже первая «дыра»: API не документирован; зафиксируй и предложи генератор/спеку под стек.

## Универсальный чек-лист «полностью покрыта» (любой стек)
Применяй к **каждой** операции (path+method) в спеке:
- операция есть в спеке; `summary`; осмысленный `description`; `tags`; `operationId` (стабильный camelCase);
- параметры `path`/`query`/`header`; `requestBody` для write;
- `responses` по каждому статусу: успех + ошибки (`400/401/403/404/409/422/500`) через общий Error-компонент;
- `security` на защищённых; `examples`/`deprecated` по месту.

Правило: покрытие ≠ ослабление — не прячь роут и не ставь «any»/пустые схемы ради покрытия.

## Эвристики поиска роутов (ripgrep, по стекам)
```bash
# Fastify/Express/Koa
rg -n "\.(get|post|put|patch|delete)\(|\.route\(" src
# NestJS
rg -n "@(Get|Post|Put|Patch|Delete)\(|@Controller\(|@ApiOperation|@ApiResponse" src
# tsoa
rg -n "@(Route|Get|Post|Put|Patch|Delete|Response|Security)\(" src
# Hapi
rg -n "server\.route\(|method:\s*['\"](GET|POST|PUT|PATCH|DELETE)" src
# tRPC
rg -n "\.meta\(\s*\{\s*openapi|publicProcedure|protectedProcedure" src
# защищённые роуты (любой стек)
rg -n "requireAuth|verifyJwt|onRequest|@Security|UseGuards|preHandler" src
```
Для каждого роута проверь метаданные документации механизмом стека (`schema` Fastify; `@Api*` Nest; JSDoc swagger-jsdoc; декораторы tsoa; `options` Hapi; `.meta.openapi` tRPC). Сверь пути роутов с `paths` фактической спеки — расхождение/неполнота = дыра.

Сигналы «дыр»: роут есть в коде, но нет в спеке; нет `summary`/`description`/`tags`/`operationId`; `responses` без ошибок; защищённый без `security`; публичный роут скрыт из спеки; рассинхрон схемы ответа с хендлером.

## Дефолт-стек: Fastify + zod (единый источник)
`fastify-type-provider-zod` даёт из одних zod-схем И валидацию, И OpenAPI (`validatorCompiler`/`serializerCompiler` + `jsonSchemaTransform`; `jsonSchemaTransformObject` + `z.globalRegistry.add(Schema,{id})` для `$ref`). Альтернатива — TypeBox.
```ts
// swagger.plugin.ts
app.setValidatorCompiler(validatorCompiler); app.setSerializerCompiler(serializerCompiler)
await app.register(fastifySwagger, {
  openapi: { openapi: '3.1.0', info: { title: 'API', version: env.APP_VERSION },
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } } },
  transform: jsonSchemaTransform, transformObject: jsonSchemaTransformObject,
})
await app.register(fastifySwaggerUI, { routePrefix: '/documentation' })
```
```ts
// schemas.ts
export const ErrorSchema = z.object({ error: z.string(), message: z.string(), code: z.string().optional() })
z.globalRegistry.add(ErrorSchema, { id: 'Error' })
// routes.ts
app.withTypeProvider<ZodTypeProvider>().get('/users/:id', {
  onRequest: [requireAuth],
  schema: { summary: '...', description: '...', tags: ['users'], operationId: 'getUserById',
    security: [{ bearerAuth: [] }], params: UserParams,
    response: { 200: UserResponse, 401: ErrorSchema, 404: ErrorSchema, 500: ErrorSchema } },
}, usersController.getById)
```
Другие стеки — тот же результат иным механизмом: Nest — `@ApiOperation/@ApiResponse/@ApiTags` + DTO `@ApiProperty`; Express — JSDoc `@openapi` или tsoa; Hapi — `options.validate/response/tags`; статика — правки в `openapi.yaml`.

## Как полноценно покрыть (write)
1. Опиши вход и **все** ответы (успех + ошибки), общий Error-компонент.
2. Проставь `summary`/`description`/`tags`/`operationId`; защищённым — `security`.
3. Сверь хендлер: возвращает ровно то, что в схеме ответа, с верными статусами.
4. Не прячь роут и не ставь `any`/пустые схемы ради покрытия.

## Проверка
- Спека: рантайм-эндпоинт стека / статический файл / генератор (`tsoa spec`, `generateOpenApiDocument`, сборка Nest/FastAPI).
- `npx @redocly/cli lint <spec>` (или `swagger-cli validate`).
- `npx openapi-typescript <spec>` без ошибок; тесты.

## Связь с фронтом
Спека — источник истины для клиента (`$data-fetching`): реальные эндпоинты, типы из OpenAPI, без моков в прод-пути.
