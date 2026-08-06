---
description: Верификация задачи Task Master по её testStrategy — прогнать соответствующие наборы, вынести вердикт «готово/не готово» с выводом (testing). Use when задача реализована и перед set_task_status done нужно доказательство.
argument-hint: "<id задачи Task Master> [контекст]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Верифицируй задачу Task Master: **$ARGUMENTS**.

1. `get_task` по ID → прочитай `testStrategy` задачи и её сабтасков. Пустая/расплывчатая — сформулируй проверяемую из description и зафиксируй через `update_subtask`.
2. Составь план проверки: какие наборы/команды соответствуют каждому пункту testStrategy (unit/integration/e2e, `tsc --noEmit`, lint, curl health-эндпоинта, ручной сценарий).
3. Прогони каждый пункт реально: команда → вывод. Ничего не помечай выполненным без вставленного вывода.
4. Недостающие по testStrategy тесты — напиши (`/testing:unit` / `/testing:integration` / `/testing:e2e`) и прогони.
5. Вердикт: всё зелёное → **ГОТОВО** + сводка «пункт testStrategy → команда → вывод», можно `set_task_status --status=done`. Что-то красное → **НЕ ГОТОВО** + список падений с выводом и первопричиной; статус НЕ меняй, находки зафиксируй `update_subtask`.
6. Главное правило: вердикт «готово» без вывода команд запрещён.

Край: пустой $ARGUMENTS — `next_task`/`get_tasks` и уточни, какую задачу верифицировать; ID не существует — покажи список задач и спроси.

Опирайся на навыки `testing-strategy`, `workflow`, `task-master`. Делегируй субагенту `testing`.
