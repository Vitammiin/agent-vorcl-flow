---
description: Аудит цели через Task Master workflow — находки → задачи → цикл. Use when аудит должен закончиться не отчётом, а задачами и циклом починки до готового; разовый отчёт без Task Master — /analyzer:audit (analyzer)
argument-hint: "<цель аудита / область>"
allowed-tools: Read, Grep, Glob, Bash
---

Проведи аудит и оформи его в Task Master workflow: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Прогони аудит (**read-only** — ничего не правь): баги, типы, структура БД, mockup на фронте, плохой код на беке — раздельно Frontend / Backend / DB; каждая находка — со ссылкой `file:line`.
3. Оформи каждую значимую находку в задачу через `add_task` (заголовок, область, severity, `file:line`, починка).
4. Отдай приоритет: `next_task` → `get_task`; исправления делегируй доменному субагенту (`backend`/`frontend`), сам аудит правок не вносит.
5. После починки автор изменения проверяет `testStrategy` и ставит `set_task_status --status=done`.

Опирайся на навыки `workflow`, `task-master` и профильные аудита. Сам аудит веди как субагент `analyzer` (только чтение).
