---
name: logging-audit
description: Read-only аудит Pino-архитектуры — один root logger, child context, redaction, requestId, нет console.log/Loki sink (роль logging). Use когда нужно найти дыры без правок; покрыть — $logging-cover, привести легаси — $logging-update.
---

# Задача: аудит Pino-логирования (logging)

Проведи read-only аудит через `$pino-logging` scanner (`--format json`). Подтверди или сними каждый finding. Код не правь. Вывод: `rule`, `file:line`, evidence, починка. Значимые gaps — `add_task`.
