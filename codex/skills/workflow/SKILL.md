---
name: workflow
description: Обязательная дисциплина работы — любая нетривиальная задача проходит через Task Master (цель → задачи → next → реализация → set-status). Use ВСЕГДА и всеми ролями перед реализацией; определяет цикл Orchestrator/Executor/Checker и точку входа $goal.
---

# Навык: Workflow (Task Master)

**Правило: любая нетривиальная задача проходит через Task Master. Без исключений.** Справочник команд — `$task-master`.

## Три роли цикла
- **Orchestrator** — выбирает следующую задачу: `next_task` / `get_tasks`.
- **Executor** — берёт задачу и делает: `get_task` → при сложности `expand_task` → реализация → `update_subtask`.
- **Checker** — проверяет `testStrategy` → `set_task_status --status=done`.

## Канонический цикл
1. **Цель → задачи.** Крупная фича — PRD в `.taskmaster/docs/prd.txt` + `parse_prd`. Точечная — `add_task`.
2. `next_task` — следующая актуальная задача.
3. `get_task <id>` — детали и `testStrategy`.
4. `expand_task <id>` — при высокой сложности (после `analyze_project_complexity`).
5. **Реализация** — текущая задача профильной ролью (architect/backend/frontend/analyzer).
6. **Проверка** — `testStrategy`; при провале — не закрывать.
7. `set_task_status --status=done` — и назад к шагу 2.

## Точка входа
Задача-скилл `$goal` (и доменные `$<role>-goal`) запускают этот цикл.

## Когда можно пропустить
Только тривиальное: правка 1–3 строки, ответ на вопрос, мелкий фикс. Всё остальное — через цикл.

## Запреты
- Не выдумывай ID задач (`get_task`/`next_task`).
- Не ставь `done` без `testStrategy`.
- Фиксируй прогресс через `update_subtask`.
