---
description: Независимая верификация scope по testStrategy — прогнать соответствующие наборы, вынести вердикт «готово/не готово» с выводом (testing). Use when задача реализована и перед set_task_status done нужно доказательство.
argument-hint: "<scope и testStrategy; опционально явно выбранный task ID>"
---

Верифицируй переданный scope: **$ARGUMENTS**.

Checker работает report-only: не меняет implementation, acceptance tests, документы или tracker state. Используй существующие host permissions и доступные read-only capabilities; команда не выдаёт новых разрешений на инструменты.

1. Прочитай scope, acceptance criteria и `testStrategy` из handoff сессии. Только при явно выбранном Task Master прочитай задачу по переданному claimed ID через доступный адаптер. Пустая/расплывчатая стратегия означает **НЕ ГОТОВО**: верни предложенный acceptance contract Orchestrator-у, но ничего не записывай.
2. Составь план проверки: какие наборы/команды соответствуют каждому пункту testStrategy (unit/integration/e2e, `tsc --noEmit`, lint, curl health-эндпоинта, ручной сценарий).
3. Прогони каждый пункт реально: команда → вывод. Ничего не помечай выполненным без вставленного вывода.
4. Если acceptance tests отсутствуют или недостаточны — **НЕ ГОТОВО**. Checker их не пишет и не меняет; это отдельная Executor-задача с последующей повторной независимой проверкой.
5. Если в scope существует `PROJECT_DESCRIPTION.md`, проверь changed paths, external mutations (deploy/env/integration/database/runtime) и explanation Executor-а. Подтверждённый material context change без актуализации затронутых разделов и зелёного `validate-description.mjs` → **НЕ ГОТОВО**. При `description impact: none` сверь это с diff и external actions; Checker документ не редактирует.
6. Вердикт: всё зелёное → **ГОТОВО** + сводка «пункт testStrategy → команда → вывод». Что-то красное → **НЕ ГОТОВО** + список падений и первопричина. Статус меняет только Orchestrator.
7. Главное правило: вердикт «готово» без вывода команд запрещён.

Если handoff не определяет scope/testStrategy — верни недостающий контракт Orchestrator-у. Для выбранного Task Master несуществующий ID означает ошибку; bare `next_task` запрещён.

Опирайся на навыки `testing-strategy`, `workflow` (Task Master skill — только если пользователь явно выбрал этот трекер). Делегируй субагенту `testing`.
