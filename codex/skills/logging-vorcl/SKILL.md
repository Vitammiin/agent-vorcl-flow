---
name: logging-vorcl
description: Точка входа в Task Master workflow для цели по Pino-логированию (роль logging). Use when логирование нужно по целому модулю/сервису циклом задач; только найти дыры — $logging-audit, внедрить пакет — $logging-cover, привести легаси — $logging-update.
---

# Задача: цель по Pino-логированию через workflow (logging)

Возьми цель по structured logging через Task Master (см. `$logging`, `$pino-logging`).

1. Инициализация при необходимости (`task-master init`).
2. Цель → задачи: root logger, child context, `requestId`/`event`/`redact`, какие `console.log`/`pino()` убрать.
3. Scanner → `next_task` → правки только логов → `update_subtask`.
4. `testStrategy` (scanner, образец JSON без секретов, тесты зелёные) → `done`.

Веди как роль `$logging`. Try/catch не чини.
