---
name: devops-vorcl
description: Инфра-цель через Task Master — докеризация/CI/env/мониторинг до готового с доказательством выводом команд (роль devops). Use когда дана комплексная инфраструктурная цель.
---

# Задача: инфра-цель через Task Master workflow

Возьми инфраструктурную цель в работу через Task Master (`$workflow` + `$task-master`).

1. Убедись, что Task Master инициализирован; иначе `task-master init`.
2. Цель → задачи: комплексная (докеризация + CI + env) — PRD в `.taskmaster/docs/prd.txt` + `parse_prd`; точечная — `add_task`.
3. `next_task` → `get_task`; при сложности — `expand_task` (после `analyze_project_complexity`).
4. Реализуй, фиксируй ход `update_subtask`. `testStrategy` — всегда вывод команд: `docker build` прошёл (размер), `compose ps` — все `healthy`, YAML валиден. env-изменения — только `docker compose up -d --force-recreate`, не `restart`.
5. Доказательство есть → `set_task_status done`; вернись к шагу 3. Прод-деплой — только с явного подтверждения; Render — делегируй `$render`. Опирайся на `$docker`, `$ci-cd`.
