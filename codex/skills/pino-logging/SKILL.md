---
name: pino-logging
description: "Модульная Pino-архитектура для Node.js / Fastify / Next.js: один root logger в infrastructure/logging, child loggers, redaction, requestId, event-поля, JSON в stdout. Use когда внедряешь, аудируешь или обновляешь structured logging."
version: 1.0.0
---

# Навык: Modular Pino Logging

Канон — `skills/pino-logging/references/architecture.md` (инсталлятор кладёт `references/` и `scripts/` рядом с этим скиллом). Операционный контракт совпадает с каноническим `$pino-logging`: один root logger, child loggers, `{ event, err }`, JSON в stdout, scanner `scripts/scan.mjs`.

Try/catch-границы — `$error-handling` / `$resilience`. Collector/agent — `$devops`.
