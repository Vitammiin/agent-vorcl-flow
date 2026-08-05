---
name: vorcl
description: Универсальная точка входа в Task Master workflow — превращает цель в задачи и ведёт цикл до готового, роутя к нужной роли. Use когда дана цель/фича и нужно довести её через задачи.
---

# Задача: цель через Task Master workflow

Возьми цель, которую дал пользователь, в работу через Task Master.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Цель → задачи: крупная фича — PRD в `.taskmaster/docs/prd.txt` + `parse_prd`; точечная — `add_task`.
3. `next_task` → `get_task`; при сложности — `expand_task` (после `analyze_project_complexity`).
4. Реализуй текущую задачу, фиксируя ход через `update_subtask`.
5. Проверь `testStrategy`; при успехе — `set_task_status --status=done`; повторяй, пока есть задачи.

Опирайся на `$workflow`, `$task-master`. Определи домен каждой задачи и веди её профильной ролью (`$architect` / `$backend` / `$frontend` / `$analyzer`); оркестрацию цикла веди сам.
