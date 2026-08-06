---
name: docs-vorcl
description: Док-цель через Task Master — документация до готового с проверкой примеров, ссылок и языкового паритета (роль docs). Use когда дана крупная цель по документации проекта.
---

# Задача: цель по документации через Task Master workflow

Возьми цель по документации в работу через Task Master (`$workflow` + `$task-master`).

1. Убедись, что Task Master инициализирован; иначе `task-master init`.
2. Цель → задачи: комплексная (README + API + ARCHITECTURE + …) — PRD в `.taskmaster/docs/prd.txt` + `parse_prd`; точечная — `add_task`. Каждому документу — задача с `testStrategy`: примеры прогнаны, ссылки живые, счётчики/версии из реальных файлов, языки синхронны.
3. `next_task` → `get_task`; при сложности — `expand_task` (после `analyze_project_complexity`).
4. Пиши документ, фиксируй ход `update_subtask`. Примеры прогоняй/сверяй со `scripts`, факты — грепом. API-факты — только из OpenAPI-спеки (нет спеки — сначала `$swagger-audit`); диаграммы — через `$mermaid`/`$drawio`, не вслепую.
5. `testStrategy` проверен **доказательствами** (вывод команд, греп-сверки) → `set_task_status done`; вернись к шагу 3. Опирайся на `$technical-writing`.
