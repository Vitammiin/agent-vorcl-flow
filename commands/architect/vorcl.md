---
description: Точка входа в Task Master workflow для цели (architect)
argument-hint: "<цель / objective>"
allowed-tools: Read, Write, Bash, Grep, Glob
---

Возьми цель в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Преврати цель в задачи: крупная фича — оформи/дополни PRD в `.taskmaster/docs/prd.txt` и запусти `parse_prd`; точечная — `add_task`.
3. `next_task` → `get_task`; при высокой сложности — `expand_task` (после `analyze_project_complexity`).
4. Прорабатывай текущую задачу (архитектура/анализ/ревью), фиксируя ход через `update_subtask`.
5. Проверь `testStrategy`; при успехе — `set_task_status --status=done`; вернись к шагу 3, пока есть задачи.

Опирайся на навыки `workflow`, `task-master`, `system-design`. Делегируй проработку субагенту `architect`.
