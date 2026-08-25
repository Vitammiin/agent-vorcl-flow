---
description: Покрыть модуль/пакет каноническим Pino logging — root logger, child logger, RequestContext, event-поля. Use when логгера нет или модуль нужно покрыть с нуля; легаси привести — /logging:update, только найти дыры — /logging:audit (logging)
argument-hint: "<модуль/пакет/worker/route>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Покрой область каноническим Pino logging: **$ARGUMENTS**.

Если root logger нет — создай `src/infrastructure/logging` (logger, factory, redaction, request-context, index). Fastify получи `loggerInstance`; Next — server-only child с `requestId`. В модуле используй `createModuleLogger(module, component)` или `request.log.child`. HTTP — через `RequestContext`; jobs — child от root с `jobId`/`queue`. Логируй `{ event, ...ids }`, ошибки как `{ err }`.

После правок запусти scanner и затронутые тесты. Покажи образец JSON без секретов. Опирайся на `pino-logging`. Делегируй субагенту `logging`.
