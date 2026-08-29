---
name: architect-vorcl
description: Точка входа в Task Master workflow для цели (роль architect). Use when нужно провести крупную архитектурную цель — анализ, проектирование, ревью — через цикл задач Task Master до готового результата.
---

# Задача: цель через workflow (architect)

Возьми цель в работу через Task Master. Если цель не указана — спроси её одной фразой, не запускай init вслепую.

1. Примени `$workspace-capability-routing`: зафиксируй outcome, workspace evidence, primary/supporting roles и skills.
2. Создай задачи через `add_task`/`parse_prd`, сохрани только возвращённые IDs и создай scoped run.
3. Для каждого allowlisted ID: atomic claim → `get_task` → `in-progress`; bare `next_task` запрещён.
4. Прорабатывай только claimed task; domain passes делегируй по route evidence.
5. Отдельный Checker проверяет `testStrategy`; только Orchestrator ставит `done`.

Опирайся на `$workflow`, `$task-master`, `$workspace-capability-routing`, `$system-design`. Веди проработку как роль `$architect`.
