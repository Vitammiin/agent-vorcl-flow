---
name: integrity-audit
description: Кросс-языковой read-only аудит production-кода на хардкод и утечки mocks/fake/demo/fixture данных во frontend/backend/mobile/shared. Use для общей проверки mixed repository; узкие режимы — $integrity-hardcode и $integrity-mocks.
---

# Integrity audit

Используй `$code-integrity` scanner с `--mode all`, затем проверь каждый кандидат в контексте и докажи production reachability. Применяй `$hardcode-detection` и `$mock-data-detection`. Покрой реальные языки репозитория; отдели tests/fixtures/stories/examples/seeds/generated/vendor. Не правь код и не исполняй target application.

Вывод: подтверждённые findings по severity и области; отдельно review-кандидаты. Каждый finding содержит `file:line`, rule ID, evidence, production path, root cause, confidence и конкретную починку с владельцем. Значимые findings оформи через `add_task`.
