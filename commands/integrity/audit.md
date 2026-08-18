---
description: Кросс-языковой read-only аудит production-кода на хардкод и утечки mocks/fake/demo/fixture данных во frontend и backend. Use для общей проверки mixed repository; узкие режимы — /integrity:hardcode и /integrity:mocks (integrity)
argument-hint: "[путь; по умолчанию текущий репозиторий]"
allowed-tools: Read, Grep, Glob, Bash
---

Проведи read-only integrity-аудит **$ARGUMENTS**.

Используй `code-integrity` scanner с `--mode all`, затем проверь каждый кандидат в контексте и докажи production reachability. Применяй `hardcode-detection` и `mock-data-detection`. Покрой Frontend/Backend/Mobile/Shared и реальные языки репозитория; отдели tests/fixtures/stories/examples/seeds/generated/vendor. Не правь код и не исполняй target application.

Вывод: подтверждённые findings по severity и области; отдельно review-кандидаты. Каждый finding содержит `file:line`, rule ID, evidence, production path, root cause, confidence и конкретную починку с владельцем. Значимые findings оформи через `add_task`. Делегируй роли `integrity`.
