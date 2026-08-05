---
name: backend-vorcl
description: Точка входа в Task Master workflow для цели (роль backend). Use когда дана серверная цель и нужно довести её через задачи.
---

# Задача: цель через workflow (backend)

Возьми цель в работу через Task Master.

1. Инициализация при необходимости (`task-master init`).
2. Цель → задачи: PRD + `parse_prd` (крупное) или `add_task` (точечное).
3. `next_task` → `get_task`; при сложности — `expand_task`.
4. Реализуй задачу по модульной архитектуре (`src/modules/*`), фиксируя ход через `update_subtask`.
5. Проверь `testStrategy` (прогони тесты) → `set_task_status --status=done`; повторяй.

Опирайся на `$workflow`, `$task-master`, `$backend-architecture`. Веди реализацию как роль `$backend`.
