---
description: Цель по надёжности через Task Master — покрыть код try/catch и логами без «тихих» падений (resilience)
argument-hint: "<цель: модуль/фича/область>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Возьми цель по надёжности кода в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Разложи цель на задачи (`add_task`; крупное — PRD + `parse_prd`): какие границы покрыть try/catch, где нормализовать ошибки, какие логи и на каком уровне расставить, какие «тихие» падения убрать.
3. `next_task` → `get_task`; правь код: try/catch на правильных границах (I/O/внешние/парсинг/транзакции), проброс с `cause` или осмысленная обработка + лог, `finally` для ресурсов, структурные логи (уровни, контекст, лог один раз, без секретов/PII). Ход фиксируй через `update_subtask`.
4. Проверь `testStrategy` (нет пустых `catch`, ошибки нормализованы, логи на границе обработки без дублей и утечек, тесты зелёные) → `set_task_status --status=done`; вернись к шагу 3.

Первопричину чини, а не глуши try/catch'ем. Опирайся на навыки `error-handling`, `backend-architecture`, `nodejs`, `typescript`, `react`, `workflow`, `task-master`. Делегируй субагенту `resilience`.
