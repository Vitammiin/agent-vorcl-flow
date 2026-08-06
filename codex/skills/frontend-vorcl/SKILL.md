---
name: frontend-vorcl
description: Точка входа в Task Master workflow для цели (роль frontend). Use when нужно довести UI-цель (экраны, фичи, компоненты) через цикл задач Task Master до реализованного и протестированного результата.
---

# Задача: цель через workflow (frontend)

Возьми цель в работу через Task Master. Если цель не указана — спроси её одной фразой, не запускай init вслепую.

1. Инициализация при необходимости (`task-master init`).
2. Цель → задачи: PRD + `parse_prd` (крупное) или `add_task` (точечное).
3. `next_task` → `get_task`; при сложности — `expand_task`.
4. Реализуй задачу по feature-based структуре (`src/features/*`), фиксируя ход через `update_subtask`.
5. Проверь `testStrategy` (тесты компонентов) → `set_task_status --status=done`; повторяй.

Опирайся на `$workflow`, `$task-master`, `$frontend-architecture`. Веди реализацию как роль `$frontend`.
