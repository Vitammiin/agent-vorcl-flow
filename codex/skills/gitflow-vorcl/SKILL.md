---
name: gitflow-vorcl
description: Релизная/git-цель через Task Master — коммиты, PR, changelog, релиз до готового с доказательствами выводом команд (роль gitflow). Use когда git/релизная цель многошаговая.
---

# Задача: git/релизная цель через Task Master workflow

Возьми git/релизную цель в работу через Task Master (`$workflow` + `$task-master`).

1. Убедись, что Task Master инициализирован; иначе `task-master init`.
2. Цель → задачи: релиз/серия PR — PRD в `.taskmaster/docs/prd.txt` + `parse_prd`; точечная — `add_task`.
3. `next_task` → `get_task`; при сложности — `expand_task` (после `analyze_project_complexity`).
4. Выполняй, фиксируя ход `update_subtask`. Правила: `git status`/`git diff` смотри сам; коммиты только поимённо (НИКОГДА `git add .`/`-A`); незнакомые изменения — стоп и спроси; push/publish — только с явного подтверждения.
5. `testStrategy` = доказательство выводом команд (`git status`, hash, URL PR/release) → `set_task_status done`; вернись к шагу 3. Опирайся на `$git-workflow`.
