---
name: analyzer-vorcl
description: Аудит цели через Task Master workflow — находки → задачи → цикл (роль analyzer). Use when аудит должен закончиться не отчётом, а задачами и циклом починки до готового; разовый отчёт без Task Master — $analyzer-audit.
---

# Задача: аудит через workflow (analyzer)

Проведи аудит и оформи его в Task Master workflow для указанной цели/области.

1. Маршрут означает явно выбранный `track-only`; для одного отчёта используй `$analyzer-audit` без Task Master.
2. Примени `$workspace-capability-routing` и прогони только обнаруженные Frontend / Backend / Mobile / DB / Infrastructure boundaries; whole-project multi-role scope передай `$audit`.
3. `add_task`; сохрани возвращённые IDs и создай scoped run по `$workflow`.
4. Atomic claim каждого ID → `get_task` → `in-progress`; remediation выполняют `$backend`/`$frontend`. Bare `next_task` запрещён.
5. Независимый `$testing` проверяет `testStrategy`; `done` ставит только Orchestrator.

Опирайся на `$workflow`, `$task-master`, `$workspace-capability-routing`. Сам аудит веди как роль `$analyzer` (только чтение).
