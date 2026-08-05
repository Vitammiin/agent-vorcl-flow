---
name: drawio-goal
description: Точка входа в Task Master workflow для цели по построению диаграмм draw.io (роль drawio). Use когда нужно построить набор диаграмм и довести через задачи до готового.
---

# Задача: цель по диаграммам через workflow (drawio)

Возьми цель (набор диаграмм / комплексная схема) в работу через Task Master (см. `$drawio`, `$drawio-diagrams`, `$pmp-diagrams`).

1. Инициализация при необходимости (`task-master init`).
2. Разложи цель на задачи (`add_task`; набор — PRD + `parse_prd`): какие диаграммы, какой тип у каждой, какие исходники читать, какие библиотеки нужны.
3. `next_task` → `get_task`; строй `.drawio`: правильный тип, аккуратная раскладка (сетка, ортогональные рёбра), семантические цвета, легенда. Ход — `update_subtask`.
4. Проверь `testStrategy` (XML валиден `xmllint --noout`; рёбра с `source`/`target`; id уникальны; читаемо) → `set_task_status --status=done`; повторяй.

Отдавай файл + путь + какие `?clibs` включить. Неоднозначное помечай/уточняй. Опирайся на `$drawio-diagrams`, `$pmp-diagrams`, `$system-design`, `$workflow`, `$task-master`. Веди как роль `$drawio`.
