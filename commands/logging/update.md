---
description: Обновить существующие логи до канона Pino — убрать локальные pino()/console.log, добавить redact, event, requestId, не меняя бизнес-поведение. Use when легаси уже логирует криво; покрыть с нуля — /logging:cover, только отчёт — /logging:audit (logging)
argument-hint: "<файл/модуль/область>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Приведи существующее логирование к канону Pino: **$ARGUMENTS**.

Сначала audit + scanner. Сведи все `pino()` к одному root в `infrastructure/logging` или `shared/logging`. Замени production `console.*`. Вынеси `redact`. Убери прямые Loki/HTTP sinks. Interpolated strings → `{ event, id }`. `err.message` → `{ err }`. Сними дубли ошибок по слоям. Поведение бизнеса не меняй: прогони затронутые тесты и покажи образец JSON (секретов нет). Опирайся на `pino-logging`. Делегируй субагенту `logging`.
