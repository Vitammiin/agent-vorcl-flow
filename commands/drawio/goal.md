---
description: Цель (набор диаграмм) через Task Master — построение draw.io/diagrams.net до готового (drawio)
argument-hint: "<цель: какие диаграммы построить + контекст/исходники>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Возьми цель по построению диаграмм draw.io в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Разложи цель на задачи (`add_task`; набор диаграмм / крупная схема — PRD + `parse_prd`): какие диаграммы нужны, какой тип у каждой (flowchart/swimlane/BPMN/UML/network/ERD/org/mind map или PMP/PMBOK), какие исходники читать, какие custom-библиотеки понадобятся.
3. `next_task` → `get_task`; строй `.drawio` XML: правильный тип, аккуратная раскладка (grid, ортогональные рёбра, без наложений), семантические цвета, легенда где нужна. Ход фиксируй через `update_subtask`.
4. Проверь `testStrategy` (XML валиден — `xmllint --noout`; у рёбер реальные `source`/`target`; id уникальны; диаграмма читаема) → `set_task_status --status=done`; вернись к шагу 3.

Отдавай готовый файл + путь + какие `?clibs` включить в diagrams.net. Неоднозначное помечай допущением или уточняй. Опирайся на навыки `drawio-diagrams`, `pmp-diagrams`, `system-design`, `workflow`, `task-master`. Делегируй субагенту `drawio`.
