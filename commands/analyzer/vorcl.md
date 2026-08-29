---
description: Аудит цели через Task Master workflow — находки → задачи → цикл. Use when аудит должен закончиться не отчётом, а задачами и циклом починки до готового; разовый отчёт без Task Master — /analyzer:audit (analyzer)
argument-hint: "<цель аудита / область>"
allowed-tools: Read, Grep, Glob, Bash
---

Проведи аудит и оформи его в Task Master workflow: **$ARGUMENTS**.

1. Этот маршрут означает явно выбранный `track-only`: аудит остаётся read-only, но Task Master writes разрешены. Для одного отчёта используй `/analyzer:audit` без Task Master.
2. Примени `workspace-capability-routing` и прогони только обнаруженные Frontend / Backend / Mobile / DB / Infrastructure boundaries; каждая находка — `file:line` + severity + root cause. Whole-project multi-role scope передай `/audit`.
3. Создай задачи через `add_task`, сохрани только возвращённые IDs и создай scoped run через `workflow`.
4. Для каждого ID: atomic claim → `get_task` → `in-progress`; remediation делегируй `backend`/`frontend`, сам analyzer код не меняет. Bare `next_task` запрещён.
5. Независимый `testing` проверяет `testStrategy`; только Orchestrator ставит `done`.

Опирайся на навыки `workflow`, `task-master`, `workspace-capability-routing` и профильные аудита. Сам аудит веди как субагент `analyzer` (только чтение).
