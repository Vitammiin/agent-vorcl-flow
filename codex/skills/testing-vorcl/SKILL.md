---
name: testing-vorcl
description: Цель тестирования через Task Master — покрытие/верификация до готового, зелёные прогоны как доказательство (роль testing). Use when дана цель по тестам и её нужно довести через задачи.
---

# Задача: цель тестирования через Task Master workflow

Возьми цель по тестированию в работу через Task Master (`$workflow` + `$task-master`).

1. Определи раннер проекта по `package.json` (Vitest/Jest/node:test/Playwright) — не навязывай свой.
2. Task Master инициализирован (`.taskmaster/`)? иначе `task-master init`.
3. Цель → задачи: крупная — PRD в `.taskmaster/docs/prd.txt` + `parse_prd`; точечная — `add_task`.
4. `next_task` → `get_task`; при сложности — `expand_task` (после `analyze_project_complexity`).
5. Пиши тесты: сначала красный (без фикса / со сломанным ожиданием) — потом зелёный; ход фиксируй `update_subtask`.
6. Зелёный вывод раннера = выполненная `testStrategy` → `set_task_status done`; вернись к шагу 4. Никаких «tests pass» без вставленного вывода. Опирайся на `$testing-strategy`, `$e2e-playwright`.
