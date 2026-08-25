---
description: Read-only аудит Pino-архитектуры — один root logger, child context, redaction, requestId, нет console.log/Loki sink. Use when нужно найти дыры в логировании без правок; покрыть — /logging:cover, привести легаси — /logging:update (logging)
argument-hint: "[путь; по умолчанию текущий репозиторий]"
allowed-tools: Read, Grep, Glob, Bash
---

Проведи read-only аудит Pino structured logging: **$ARGUMENTS**.

1. Запусти `node <pino-logging>/scripts/scan.mjs --root <scope> --format json`.
2. Найди текущий logger (`pino(`, `infrastructure/logging`, `shared/logging`) и прочитай root config, Fastify/Next bootstrap, 2–3 модуля и один worker/job.
3. Каждый scanner finding подтверди или сними по контексту. Ищи также отсутствие `requestId`, дубли ошибок по слоям и query на `info`.
4. Код не правь и target application не запускай.

Вывод: confirmed findings по severity с `rule`, `file:line`, evidence, root cause и конкретной починкой. В конце — где должен жить logger и какие модули покрывать первыми. Значимые gaps оформи через `add_task`. Делегируй роли `logging`. Опирайся на `pino-logging`.
