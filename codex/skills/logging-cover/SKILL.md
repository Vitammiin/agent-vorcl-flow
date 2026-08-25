---
name: logging-cover
description: Покрыть модуль/пакет каноническим Pino logging — root logger, child logger, RequestContext, event-поля (роль logging). Use when логгера нет или модуль нужно покрыть с нуля; легаси — $logging-update.
---

# Задача: покрыть Pino-логированием (logging)

Создай `infrastructure/logging` при отсутствии root logger. Fastify — `loggerInstance`; Next — server-only child. Модуль — `createModuleLogger` или `request.log.child`. После правок — scanner и тесты. См. `$pino-logging`.
