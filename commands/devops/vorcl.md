---
description: Инфра-цель через Task Master — докеризация/CI/env/мониторинг до готового, с доказательством работоспособности (devops). Use when дана комплексная инфраструктурная цель.
argument-hint: "<цель / objective>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Возьми инфраструктурную цель в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Преврати цель в задачи: комплексная (докеризация + CI + env) — оформи/дополни PRD в `.taskmaster/docs/prd.txt` и запусти `parse_prd`; точечная — `add_task`.
3. `next_task` → `get_task`; при высокой сложности — `expand_task` (после `analyze_project_complexity`).
4. Реализуй текущую задачу, фиксируя ход через `update_subtask`. `testStrategy` — всегда вывод команд: `docker build` проходит (размер образа), `docker compose ps` — все `healthy`, YAML workflow валиден. Помни: изменения env применяются только через `docker compose up -d --force-recreate`, не `restart`.
5. Проверь `testStrategy` (доказательство есть); при успехе — `set_task_status --status=done`; вернись к шагу 3, пока есть задачи.

Край: пустой `$ARGUMENTS` — спроси цель, не выдумывай. Docker daemon недоступен — честно сообщи, отдай файлы + команды проверки для владельца. Прод-деплой и необратимые активации — только с явного подтверждения; деплой на Render делегируй агенту `render`.

Опирайся на навыки `docker`, `ci-cd`, `workflow`, `task-master`. Делегируй реализацию субагенту `devops`.
