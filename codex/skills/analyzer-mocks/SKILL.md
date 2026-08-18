---
name: analyzer-mocks
description: Совместимый маршрут поиска mockup/фейковых данных во frontend/backend (роль analyzer → integrity, read-only). Use когда UI/API может жить на MSW/faker/fixtures/static responses; глубокий кросс-языковой маршрут — $integrity-mocks.
---

# Поиск mockup во frontend/backend

Используй `$code-integrity` (`--mode mocks`) и `$mock-data-detection`. Ищи mock frameworks, faker, fixture/demo imports, static UI/API records, placeholder content и отключённые реальные интеграции. Докажи declaration → import/registration/DI/build → production entry point; tests/stories/seeds/dev adapters без production import не являются утечкой.

Ничего не правь. Формат: declaration/consumer `file:line`, rule ID, evidence, reachability/guard, root cause, severity, confidence и replacement boundary. Значимые findings оформи через `add_task`; используй специализированную роль `$integrity`.
