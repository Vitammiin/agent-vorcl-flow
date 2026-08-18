---
description: Верификация задачи Task Master по её testStrategy — прогнать соответствующие наборы, вынести вердикт «готово/не готово» с выводом (testing). Use when задача реализована и перед set_task_status done нужно доказательство.
argument-hint: "<id задачи Task Master> [контекст]"
allowed-tools: Read, Bash, Grep, Glob
---

Верифицируй задачу Task Master: **$ARGUMENTS**.

1. `get_task` по явно переданному claimed ID → прочитай `testStrategy`. Пустая/расплывчатая стратегия означает **НЕ ГОТОВО**: верни предложенный acceptance contract Orchestrator-у, но ничего не записывай.
2. Составь план проверки: какие наборы/команды соответствуют каждому пункту testStrategy (unit/integration/e2e, `tsc --noEmit`, lint, curl health-эндпоинта, ручной сценарий).
3. Прогони каждый пункт реально: команда → вывод. Ничего не помечай выполненным без вставленного вывода.
4. Если acceptance tests отсутствуют или недостаточны — **НЕ ГОТОВО**. Checker их не пишет и не меняет; это отдельная Executor-задача с последующей повторной независимой проверкой.
5. Если в scope существует `PROJECT_DESCRIPTION.md`, проверь changed paths, external mutations (deploy/env/integration/database/runtime) и explanation Executor-а. Подтверждённый material context change без актуализации затронутых разделов и зелёного `validate-description.mjs` → **НЕ ГОТОВО**. При `description impact: none` сверь это с diff и external actions; Checker документ не редактирует.
6. Вердикт: всё зелёное → **ГОТОВО** + сводка «пункт testStrategy → команда → вывод». Что-то красное → **НЕ ГОТОВО** + список падений и первопричина. Статус меняет только Orchestrator.
7. Главное правило: вердикт «готово» без вывода команд запрещён.

Край: пустой `$ARGUMENTS` — запроси конкретный claimed ID; bare `next_task` запрещён. ID не существует — верни ошибку Orchestrator-у.

Опирайся на навыки `testing-strategy`, `workflow`, `task-master`. Делегируй субагенту `testing`.
