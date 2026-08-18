---
name: testing-verify
description: "Независимая read-only верификация claimed задачи по testStrategy. Checker не меняет implementation, acceptance tests или статусы; возвращает evidence-based ГОТОВО/НЕ ГОТОВО Orchestrator-у."
---

# Задача: верифицировать задачу Task Master по testStrategy

Исполни `testStrategy` задачи и вынеси вердикт (см. `$testing-strategy`, `$workflow`, `$task-master`).

1. `get_task` по явно переданному claimed ID. Пустая/расплывчатая `testStrategy` → **НЕ ГОТОВО** + предложенный acceptance contract без записи.
2. План проверки: каждому пункту testStrategy — набор/команда (unit/integration/e2e, `tsc --noEmit`, lint, curl health, ручной сценарий).
3. Прогони каждый пункт реально: команда → вывод; без вставленного вывода ничего не помечай выполненным.
4. Недостающие acceptance tests → **НЕ ГОТОВО**; Checker их не пишет и не меняет.
5. Если в scope существует `PROJECT_DESCRIPTION.md`, проверь changed paths, external mutations (deploy/env/integration/database/runtime) и explanation Executor-а. Подтверждённый material context change без актуализации разделов и зелёного `validate-description.mjs` → **НЕ ГОТОВО**. При `description impact: none` сверь вывод с diff и external actions; Checker документ не редактирует.
6. Всё зелёное → **ГОТОВО** + сводка «пункт → команда → вывод». Красное → **НЕ ГОТОВО** + первопричина. Статус меняет только Orchestrator.
7. Пустой ввод → запроси claimed ID; bare `next_task` запрещён.
