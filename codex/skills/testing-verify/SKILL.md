---
name: testing-verify
description: Верификация задачи Task Master по её testStrategy — прогнать наборы, вынести вердикт «готово/не готово» с выводом (роль testing). Use when задача реализована и перед set_task_status done нужно доказательство.
---

# Задача: верифицировать задачу Task Master по testStrategy

Исполни `testStrategy` задачи и вынеси вердикт (см. `$testing-strategy`, `$workflow`, `$task-master`).

1. `get_task` по ID → прочитай `testStrategy` задачи и сабтасков; пустая/расплывчатая — сформулируй проверяемую из description, зафиксируй `update_subtask`.
2. План проверки: каждому пункту testStrategy — набор/команда (unit/integration/e2e, `tsc --noEmit`, lint, curl health, ручной сценарий).
3. Прогони каждый пункт реально: команда → вывод; без вставленного вывода ничего не помечай выполненным.
4. Недостающие тесты — напиши (`$testing-unit`/`$testing-integration`/`$testing-e2e`) и прогони.
5. Всё зелёное → **ГОТОВО** + сводка «пункт → команда → вывод», можно `set_task_status done`. Красное → **НЕ ГОТОВО** + падения с первопричиной; статус не меняй, находки — `update_subtask`.
6. Вердикт «готово» без вывода команд запрещён. Пустой ввод — `next_task`/`get_tasks` и уточни задачу.
