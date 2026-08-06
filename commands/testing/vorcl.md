---
description: Цель тестирования через Task Master — покрытие/верификация до готового, зелёные прогоны как доказательство (testing). Use when дана цель по тестам/верификации и её нужно довести через задачи.
argument-hint: "<цель / objective>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Возьми цель по тестированию в работу через Task Master: **$ARGUMENTS**.

1. Определи тест-раннер проекта по `package.json` (Vitest/Jest/node:test/Playwright) — не навязывай свой.
2. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
3. Преврати цель в задачи: крупная (покрыть модуль, поднять покрытие, e2e-набор) — оформи/дополни PRD в `.taskmaster/docs/prd.txt` и запусти `parse_prd`; точечная — `add_task`.
4. `next_task` → `get_task`; при высокой сложности — `expand_task` (после `analyze_project_complexity`).
5. Пиши тесты: новый тест сначала покажи красным (без фикса / со сломанным ожиданием), потом делай зелёным. Ход фиксируй `update_subtask`.
6. Прогони набор и вставь вывод раннера в отчёт; зелёный прогон = выполненная `testStrategy` → `set_task_status --status=done`; вернись к шагу 4, пока есть задачи.

Край: пустой $ARGUMENTS — спроси цель (что покрывать / что верифицировать). Никогда не пиши «tests pass» без вставленного вывода команды.

Опирайся на навыки `testing-strategy`, `e2e-playwright`, `workflow`, `task-master`. Делегируй субагенту `testing`.
