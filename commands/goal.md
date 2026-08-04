---
description: Универсальная точка входа в Task Master workflow — превращает цель в задачи и ведёт цикл до готового
argument-hint: "<цель / objective>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Возьми цель в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Преврати цель в задачи: крупная фича — оформи/дополни PRD в `.taskmaster/docs/prd.txt` и запусти `parse_prd`; точечная — `add_task`.
3. `next_task` → `get_task`; при высокой сложности — `expand_task` (после `analyze_project_complexity`).
4. Реализуй текущую задачу, фиксируя ход через `update_subtask`.
5. Проверь `testStrategy`; при успехе — `set_task_status --status=done`; вернись к шагу 3, пока есть задачи.

Опирайся на навыки `workflow`, `task-master`. Определи домен каждой задачи и делегируй реализацию нужному субагенту (`architect` / `backend` / `frontend` / `analyzer`); оркестрацию цикла веди сам.
