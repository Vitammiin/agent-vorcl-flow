---
description: Релизная/git-цель через Task Master — коммиты, PR, changelog, релиз до готового с доказательствами. Use when цель по git/релизу многошаговая (gitflow)
argument-hint: "<цель / objective>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Возьми git/релизную цель в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Преврати цель в задачи: релиз целиком / серия PR — оформи PRD в `.taskmaster/docs/prd.txt` и запусти `parse_prd`; точечная (один коммит/PR) — `add_task`.
3. `next_task` → `get_task`; при высокой сложности — `expand_task` (после `analyze_project_complexity`).
4. Выполняй текущую задачу, фиксируя ход через `update_subtask`. Правила: `git status`/`git diff` смотри сам; коммиты — только поимённо (НИКОГДА `git add .`/`-A`); незнакомые изменения — стоп и спроси; push/publish/force — только с явного подтверждения владельца.
5. Проверь `testStrategy` — доказательство выводом команд (`git status`, hash, ссылка на PR/release); при успехе — `set_task_status --status=done`; вернись к шагу 3, пока есть задачи.

Если `$ARGUMENTS` пуст — определи по `git status`/`git log` вероятную цель (незакоммиченная работа? неотрелизенные коммиты?) и предложи её владельцу до создания задач.

Опирайся на навыки `git-workflow`, `workflow`, `task-master`. Делегируй субагенту `gitflow`.
