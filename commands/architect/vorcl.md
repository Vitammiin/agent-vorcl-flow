---
description: Точка входа в Task Master workflow для цели (architect). Use when нужно провести крупную архитектурную цель — анализ, проектирование, ревью — через цикл задач Task Master до готового результата.
argument-hint: "<цель / objective>"
allowed-tools: Read, Write, Bash, Grep, Glob
---

Возьми цель в работу через Task Master: **$ARGUMENTS**. Если `$ARGUMENTS` пуст — спроси цель одной фразой, не запускай init вслепую.

1. Примени `workspace-capability-routing`: зафиксируй requested outcome, workspace evidence, primary/supporting roles и domain skills.
2. Создай задачи через `add_task`/`parse_prd` и сохрани только возвращённые IDs; создай scoped run из `workflow`.
3. Для каждого allowlisted ID: atomic claim → `get_task` → `set_task_status in-progress`; bare `next_task` запрещён.
4. Прорабатывай только claimed architecture task; доменные pass делегируй по route evidence.
5. Отдельный Checker проверяет `testStrategy`; только Orchestrator ставит `done`, когда терминальны IDs текущего run.

Опирайся на навыки `workflow`, `task-master`, `workspace-capability-routing`, `system-design`. Делегируй проработку субагенту `architect`.
