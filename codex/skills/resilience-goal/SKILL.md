---
name: resilience-goal
description: Точка входа в Task Master workflow для цели по надёжности (роль resilience). Use когда нужно покрыть код обработкой ошибок и логами и довести это через задачи до готового.
---

# Задача: цель по надёжности через workflow (resilience)

Возьми цель по надёжности кода в работу через Task Master (см. `$resilience`, `$error-handling`).

1. Инициализация при необходимости (`task-master init`).
2. Цель → задачи (`add_task`; крупное — PRD + `parse_prd`): какие границы покрыть try/catch, где нормализовать ошибки, какие логи и на каком уровне, какие «тихие» падения убрать.
3. `next_task` → `get_task`; правь код: try/catch на границах (I/O/внешние/парсинг/транзакции), проброс с `cause` или обработка + лог, `finally` для ресурсов, структурные логи (уровни, контекст, лог один раз, без секретов/PII). Ход — `update_subtask`.
4. Проверь `testStrategy` (нет пустых `catch`, ошибки нормализованы, логи на границе без дублей и утечек, тесты зелёные) → `set_task_status --status=done`; повторяй.

Первопричину чини, а не глуши try/catch'ем. Опирайся на `$error-handling`, `$backend-architecture`, `$nodejs`, `$typescript`, `$react`, `$workflow`, `$task-master`. Веди как роль `$resilience`.
