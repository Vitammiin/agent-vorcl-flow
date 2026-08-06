---
description: Цель (набор диаграмм) через Task Master — построение Mermaid до готового, с рендер-проверкой (mermaid). Use when диаграмм несколько или схема комплексная; одиночная по описанию → /mermaid:create, из исходника → /mermaid:convert, формат draw.io → /drawio:vorcl
argument-hint: "<цель / objective>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Возьми цель по Mermaid-диаграммам в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Преврати цель в задачи: набор диаграмм — оформи/дополни PRD в `.taskmaster/docs/prd.txt` и запусти `parse_prd`; точечная — `add_task`.
3. `next_task` → `get_task`; при высокой сложности — `expand_task` (после `analyze_project_complexity`).
4. Строй текущую диаграмму, фиксируя ход через `update_subtask`. Каждый `.mmd` прогоняй через реальный рендер (`mcp-mermaid` или `mmdc`) — это и есть `testStrategy`.
5. Проверь `testStrategy` (рендер зелёный); при успехе — `set_task_status --status=done`; вернись к шагу 3, пока есть задачи.

Опирайся на навыки `mermaid-diagrams`, `mermaid-rendering`, `workflow`, `task-master`. Делегируй построение субагенту `mermaid`.
