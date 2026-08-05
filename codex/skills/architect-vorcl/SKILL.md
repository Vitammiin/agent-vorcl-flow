---
name: architect-vorcl
description: Точка входа в Task Master workflow для цели (роль architect). Use когда дана архитектурная цель и нужно довести её через задачи.
---

# Задача: цель через workflow (architect)

Возьми цель в работу через Task Master.

1. Инициализация при необходимости (`task-master init`).
2. Цель → задачи: PRD + `parse_prd` (крупное) или `add_task` (точечное).
3. `next_task` → `get_task`; при сложности — `expand_task`.
4. Прорабатывай задачу (архитектура/анализ/ревью), фиксируя ход через `update_subtask`.
5. Проверь `testStrategy` → `set_task_status --status=done`; повторяй.

Опирайся на `$workflow`, `$task-master`, `$system-design`. Веди проработку как роль `$architect`.
