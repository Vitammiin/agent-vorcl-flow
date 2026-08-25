---
description: Цель по Pino-логированию через Task Master — покрыть или обновить structured logging до канона infrastructure/logging. Use when логирование нужно по целому модулю/сервису циклом задач; только найти дыры — audit, внедрить пакет — cover, привести легаси — update (logging)
argument-hint: "<цель: модуль/сервис/область>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Возьми цель по Pino structured logging в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Разложи цель на задачи: где root logger, какие модули покрыть child logger, какие `console.log`/`pino()` убрать, где `requestId`/`event`/`redact`.
3. Перед правками запусти `node <pino-logging>/scripts/scan.mjs --root <project> --format json`.
4. `next_task` → `get_task`; правь только logging package и вызовы логов. Ход — `update_subtask`.
5. Проверь `testStrategy` (scanner по затронутому дереву, нет секретов в образце JSON, тесты зелёные) → `set_task_status --status=done`.

Опирайся на навыки `pino-logging`, `error-handling`, `backend-architecture`, `nodejs`, `workflow`, `task-master`. Делегируй субагенту `logging`. Не чини try/catch — это `resilience`.
