---
name: logging-update
description: Обновить существующие логи до канона Pino — убрать локальные pino()/console.log, добавить redact, event, requestId (роль logging). Use when легаси уже логирует криво; покрыть с нуля — $logging-cover.
---

# Задача: обновить Pino-логирование (logging)

Сведи `pino()` к одному root, замени production `console.*`, вынеси `redact`, убери Loki sinks, interpolated strings → `{ event, id }`, `err.message` → `{ err }`. Бизнес-поведение не меняй. См. `$pino-logging`.
