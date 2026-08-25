# Modular Pino Logging Architecture

Канон для Node.js / TypeScript / Fastify / Next.js App Router / modular monolith / microservices / Docker / Render / AWS ECS / Kubernetes / workers / queues / cron / MongoDB / PostgreSQL / OpenTelemetry / SigNoz / Grafana Loki.

Цель: единый стандарт, чтобы любой запрос, ошибку, job, DB operation или внешний API можно было найти по полям, не парся текст.

## 1. Главное архитектурное правило

Pino НЕ должен становиться отдельным сервером.

Неправильно: `Backend → HTTP → Logging Server → Loki`.

Это добавляет сеть, dependency, точку отказа, latency, retry-проблемы и риск потерять логи.

Правильно:

```text
Application
    │
    ├── modules/
    ├── infrastructure/logging/Pino
    ↓
stdout JSON
    ↓
Collector / Agent
    ↓
Loki / SigNoz / CloudWatch
```

Pino = часть приложения. Collector = инфраструктурный процесс. Loki / SigNoz = observability backend.

## 2. Где должен находиться logger

Logger — cross-cutting infrastructure concern. Он не принадлежит `modules/debtors`, `modules/users`, `modules/auth`, `modules/payments`.

Принадлежит `src/infrastructure/logging` или `src/shared/logging`.

Предпочтительный вариант:

```text
src/
├── app/
├── modules/
├── infrastructure/
│   ├── database/
│   ├── queue/
│   ├── cache/
│   ├── http/
│   └── logging/
└── shared/
```

Не создавать `modules/logger/`. Logger не является бизнес-фичей.

## 3. Рекомендуемая структура

```text
src/infrastructure/logging/
  logger.ts
  logger.config.ts
  logger.types.ts
  logger.factory.ts
  logger.redaction.ts
  logger.serializers.ts
  request-context.ts
  index.ts
```

## 4. Dependencies

```bash
npm install pino
npm install -D pino-pretty
```

Для Fastify отдельный `pino-http` обычно не нужен. Для Express / raw Node HTTP: `npm install pino-http`.

## 5. Root Logger

В приложении один основной Pino logger: `infrastructure/logging/logger.ts`.

```ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: {
    service: process.env.SERVICE_NAME ?? 'api',
    environment: process.env.NODE_ENV ?? 'development',
  },
  redact: {
    paths: [
      'password',
      '*.password',
      'token',
      '*.token',
      'accessToken',
      '*.accessToken',
      'refreshToken',
      '*.refreshToken',
      'authorization',
      '*.authorization',
      'headers.authorization',
      'req.headers.authorization',
      'cookie',
      '*.cookie',
      'creditCard',
      '*.creditCard',
    ],
    censor: '[REDACTED]',
  },
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
});
```

Production выдаёт обычный JSON:

```json
{
  "level": 30,
  "time": 1787682834123,
  "service": "mdr-api",
  "environment": "production",
  "module": "debtors",
  "requestId": "req_83df9",
  "debtorId": "665d9...",
  "event": "debtor.updated",
  "msg": "Debtor updated"
}
```

## 6. Никогда не создавать новый `pino()` внутри каждого модуля

Неправильно: `const logger = pino()` в `debtor.service.ts` и снова в `payment.service.ts`.

Правильно: `import { logger } from '@/infrastructure/logging'` или child logger.

## 7. Child Logger для каждого модуля

```ts
const log = logger.child({ module: 'debtors' });
const serviceLog = logger.child({ module: 'debtors', component: 'DebtorService' });
const repoLog = logger.child({ module: 'debtors', component: 'DebtorRepository' });
```

## 8. Helper для module logger

`logger.factory.ts`:

```ts
import { logger } from './logger';
import type { Logger } from 'pino';

export function createModuleLogger(module: string, component?: string): Logger {
  return logger.child({
    module,
    ...(component && { component }),
  });
}
```

## 9. Логировать события, а не текст

Плохо: `` logger.info(`User ${userId} changed debtor ${debtorId}`) ``

Лучше:

```ts
logger.info({ event: 'debtor.updated', debtorId, actorId: userId }, 'Debtor updated');
```

Искать: `event = debtor.updated`, `debtorId = xxx`, без парсинга текста.

## 10. Стандарт полей

camelCase, один вариант на поле. Не смешивать `request_id` / `requestId` / `reqId`.

Основные: `service`, `environment`, `module`, `component`, `event`, `requestId`, `traceId`, `spanId`, `userId`, `actorId`, `debtorId`, `creditorId`, `paymentId`, `agreementId`, `automationId`, `jobId`, `queue`, `method`, `path`, `statusCode`, `durationMs`, `externalService`, `errorCode`.

## 11. Event naming

`entity.action`: `debtor.created`, `debtor.updated`, `payment.completed`, `email.sent`, `automation.started`, `automation.step.completed`, `agreement.accepted`, `auth.login.success`, `auth.login.failed`.

## 12. Fastify integration

Не создавать второй HTTP logger. Root logger передаётся Fastify:

```ts
import Fastify from 'fastify';
import { logger } from './infrastructure/logging';

const app = Fastify({ loggerInstance: logger });
```

После этого Fastify создаёт `request.log`.

## 13. Request-scoped Logger

HTTP request должен иметь `requestId`. Все логи одной операции — один request ID: Fastify → `request.log` → controller → service → repository.

## 14. Controller

```ts
async function updateDebtorHandler(request: FastifyRequest, reply: FastifyReply) {
  const log = request.log.child({ module: 'debtors', operation: 'updateDebtor' });
  log.info({ event: 'debtor.update.started', debtorId: request.params.id }, 'Updating debtor');
  const result = await debtorService.update(request.params.id, request.body, { logger: log });
  return result;
}
```

## 15. Request Context

Не передавать в service десятки технических параметров.

```ts
import type { Logger } from 'pino';

export interface RequestContext {
  logger: Logger;
  requestId?: string;
  userId?: string;
  traceId?: string;
}
```

## 16. Background jobs

Jobs не имеют HTTP request. Logger создаётся от root:

```ts
const log = logger.child({
  module: 'automations',
  component: 'AutomationWorker',
  jobId: job.id,
  queue: 'automation',
});
log.info({ event: 'automation.job.started', automationId }, 'Automation job started');
```

## 17. Queue processing

Минимум полей: `queue`, `jobId`, `event`, `attempt`, `durationMs`.

```ts
log.error({ event: 'automation.job.failed', queue: 'automation', jobId: job.id, attempt: job.attemptsMade, err }, 'Automation job failed');
```

## 18. Errors

Pino должен получать сам Error object: `{ err }`. Не `logger.error(err.message)` — теряются `stack`, `name`, `cause`.

## 19. Не логировать одну ошибку 5 раз

Если слой только пробрасывает — не логировать. Если добавляет бизнес-контекст — можно. Необработанная ошибка логируется один раз global error handler.

## 20. Global Error Handler

```ts
app.setErrorHandler((error, request, reply) => {
  request.log.error({ err: error, event: 'http.request.failed' }, 'Unhandled request error');
  reply.status(500).send({ message: 'Internal Server Error' });
});
```

Не возвращать stack trace клиенту в production.

## 21. Database logs

Не логировать каждую query на `info`. Обычные query — `debug` или молчание. Логировать: slow query, connection problem, retry, transaction failure, unexpected DB error, migration, important batch.

```ts
log.warn({ event: 'database.slow_query', collection: 'debtors', durationMs }, 'Slow database query detected');
```

## 22. Не логировать query со всеми данными

Нельзя `logger.info({ query: req.body })` если есть email/phone/password/token/финансы. Предпочитать identifiers: `debtorId`, `creditorId`, `action`.

## 23. External APIs

Postmark, Twilio, Plivo, OpenAI, Stripe, MongoDB, Redis, Microsoft Graph — child с `externalService`. Логировать started/completed/failed/retry/rate limit/timeout. Не логировать API keys.

## 24. Timing

Для важных операций писать `durationMs`:

```ts
const startedAt = performance.now();
await service.execute();
const durationMs = Math.round(performance.now() - startedAt);
logger.info({ event: 'automation.completed', durationMs }, 'Automation completed');
```

## 25. Log Levels

- `trace` — внутренние шаги, обычно выключена
- `debug` — query, cache hit, branch, internal state
- `info` — значимые события: `debtor.created`, `payment.completed`
- `warn` — система работает: slow query, retry, rate limit
- `error` — операция провалилась
- `fatal` — процесс не может продолжать: DB unavailable на старте, нет критичного config

## 26. Что НЕ логировать

password, passwordHash, JWT, accessToken, refreshToken, API keys, Authorization, cookies, session token, credit card, CVV, bank credentials, private keys, full OAuth responses. Избегать полного `req.body`, `req.headers`, user/debtor object без нужды.

## 27. Redaction

Обязательная часть root logger. Это последняя защита. Основное правило: не передавать секреты logger'у без необходимости.

## 28. Development

`Pino → pino-pretty → Terminal`.

## 29. Production

`Pino → JSON → stdout`. Не использовать `pino-pretty` как production output.

## 30. Production infrastructure

```text
Node.js / Fastify / Pino
        ↓ stdout
Container Runtime (Docker / ECS / K8s)
        ↓
OTel Collector / Fluent Bit / Agent
        ↓
SigNoz / Loki / CloudWatch
```

Приложение не знает, где физически хранятся логи.

## 31. Почему не слать каждый log в Loki из приложения

Если Loki недоступен: logging error → retry → memory pressure. Logging не должна ломать business application. Buffering/retry — у collector.

## 32. OpenTelemetry

Pino — structured application logs. OpenTelemetry — traces, spans, metrics, distributed context. Желательно писать `traceId` и `spanId` рядом с `requestId` и `event`.

## 33. Next.js

Pino только в server-side коде. `import 'server-only'`. Использовать в Route Handlers, Server Actions, server services. Не импортировать в Client Components.

## 34. Next.js Route Handler

Читать `x-request-id` или `crypto.randomUUID()`, child logger с `module` + `requestId`, события `user.create.started` / `user.created` / `user.create.failed`.

## 35. Next.js instrumentation.ts

Для observability initialization (OTel, exporters). Не превращать в бизнес logger service.

## 36. Edge Runtime

Node Pino не использовать в Edge. Если Route Handler использует Pino: `export const runtime = 'nodejs'`.

## 37. Monorepo

Общий `@project/observability` для redaction, event/field conventions, factory, types. Fastify и Next integration остаются внутри приложений.

## 38. Modular Architecture Rule

Бизнес-модуль знает только `logger.info/warn/error/debug`. Он НЕ знает Loki URL, SigNoz URL, CloudWatch credentials, Collector URL.

## 39. Хороший пример модуля

Service использует `createModuleLogger('debtors', 'DebtorService')` для process-level событий. Для HTTP-операции предпочтителен logger из request context, чтобы сохранить `requestId`.

## 40. Предпочтительная request architecture

`Fastify Request → request.log (requestId) → Controller (module, userId) → RequestContext → Service → Repository`.

## 41. AsyncLocalStorage

Не вводить сразу. Сначала `request.log` + `RequestContext`. ALS — если `ctx` приходится протаскивать через десятки уровней, внутри `infrastructure/logging/context`.

## 42. Logging interface

Собственный `AppLogger` допустим, если планируется смена Pino. Для обычного Node/Fastify проекта Pino `Logger` напрямую достаточно. Не строить огромную abstraction layer.

## 43. HTTP logs

На каждый request: `requestId`, `method`, `path`, `statusCode`, `durationMs`. Не писать полный body. Event: `http.request.completed`.

## 44. Domain events важнее низкоуровневых сообщений

Предпочитать `debtor.status.changed` вместо «Entered function». Последние — только `debug`.

## 45. Audit Log != Application Log

Application log: timeout, automation started. Audit log: Admin X changed debtor Y, status ACTIF → PRP — бизнес-данные в Mongo/Postgres. Pino не единственный источник критического audit trail.

## 46. Business metrics != Logs

Revenue, conversion, active users — metrics/analytics, не единственное место в логах.

## 47. Testing

`LOG_LEVEL=silent` или silent logger. Проверять логи только если это часть поведения (security/fatal). Не писать `expect(logger.info).toHaveBeenCalled()` для каждой функции.

## 48. Mandatory production rules

1. Один root Pino logger.
2. Размещение: `infrastructure/logging`.
3. Не создавать отдельный logging HTTP server.
4. Не создавать `pino()` внутри business module.
5. Child loggers.
6. У child минимум `module`.
7. HTTP request: `requestId`.
8. Business logs: `event`.
9. Error как `{ err }`.
10. Никогда не логировать secrets.
11. Настроить `redact`.
12. Development: `pino-pretty`.
13. Production: JSON → stdout.
14. Доставка — инфраструктурный collector/agent.
15. Не связывать business layer с Loki/SigNoz API.
16. Не логировать request body по умолчанию.
17. Не логировать одну ошибку на каждом уровне.
18. `durationMs` для важных операций.
19. Единый naming convention.
20. Structured fields вместо interpolated strings.

## 49. Target Architecture

```text
Routes → Controllers → Services → Repositories
                 ↘ Request Logger ↙
              infrastructure/logging
                      Pino
                       ↓ stdout
              OpenTelemetry Collector
                  ↙          ↘
               SigNoz        Loki
```

Workers используют тот же logging package: child logger → stdout → Collector.

## 50. Decision

Модель: ONE application logger → `infrastructure/logging` → root Pino, child loggers, redaction, serializers, request context, standard fields.

Каждый модуль не создаёт собственную систему логирования. Он только добавляет контекст: `logger.child({ module: 'debtors' })`. HTTP сверху: `requestId`, `userId`, `traceId`. Domain по мере выполнения: `debtorId`, `paymentId`, `automationId`.

Production: `Pino JSON → stdout → Collector → SigNoz / Loki / CloudWatch`.
