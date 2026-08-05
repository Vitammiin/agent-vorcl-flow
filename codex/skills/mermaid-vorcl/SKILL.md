---
name: mermaid-vorcl
description: Цель (набор Mermaid-диаграмм) через Task Master — построение до готового с рендер-проверкой (роль mermaid). Use когда дана цель по диаграммам и нужно довести её через задачи.
---

# Задача: цель по Mermaid через Task Master workflow

Возьми цель по Mermaid-диаграммам в работу через Task Master (`$workflow` + `$task-master`).

1. Убедись, что Task Master инициализирован; иначе `task-master init`.
2. Цель → задачи: набор диаграмм — PRD в `.taskmaster/docs/prd.txt` + `parse_prd`; точечная — `add_task`.
3. `next_task` → `get_task`; при сложности — `expand_task` (после `analyze_project_complexity`).
4. Строй диаграмму, фиксируй ход `update_subtask`. Каждый `.mmd` прогоняй через реальный рендер (`mcp-mermaid`/`mmdc`) — это `testStrategy`.
5. Рендер зелёный → `set_task_status done`; вернись к шагу 3. Опирайся на `$mermaid-diagrams`, `$mermaid-rendering`.
