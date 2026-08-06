---
name: analyzer-vorcl
description: Аудит цели через Task Master workflow — находки → задачи → цикл (роль analyzer). Use when аудит должен закончиться не отчётом, а задачами и циклом починки до готового; разовый отчёт без Task Master — $analyzer-audit.
---

# Задача: аудит через workflow (analyzer)

Проведи аудит и оформи его в Task Master workflow для указанной цели/области.

1. Инициализация при необходимости (`task-master init`).
2. Прогони аудит (**read-only** — ничего не правь): баги, типы, структура БД, mockup на фронте, плохой код на беке — раздельно Frontend / Backend / DB; каждая находка — со ссылкой `file:line`.
3. Оформи каждую значимую находку в задачу через `add_task` (заголовок, область, severity, `file:line`, починка).
4. Приоритизируй: `next_task` → `get_task`; исправления веди профильной ролью (`$backend`/`$frontend`), сам аудит правок не вносит.
5. После починки — проверка `testStrategy` и `set_task_status --status=done`.

Опирайся на `$workflow`, `$task-master`. Сам аудит веди как роль `$analyzer` (только чтение).
