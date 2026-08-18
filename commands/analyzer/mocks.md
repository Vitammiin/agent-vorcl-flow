---
description: Совместимый маршрут поиска mockup/фейковых данных во frontend/backend; кросс-языковой глубокий маршрут — /integrity:mocks. Use когда UI/API может жить на заглушках (analyzer → integrity)
argument-hint: "[путь frontend/backend; по умолчанию весь src]"
allowed-tools: Read, Grep, Glob, Bash
---

Найди mockup/фейковые данные на **frontend и backend** (**read-only**): **$ARGUMENTS**.

Используй `code-integrity` (`--mode mocks`) и `mock-data-detection`. Ищи mock frameworks, faker, fixtures/demo imports, static UI/API records, placeholder content и отключённые реальные интеграции. Докажи declaration → import/registration/DI/build → production entry point; tests/stories/seeds/dev adapters без production import не являются утечкой. Ничего не правь. Формат: declaration/consumer `file:line`, rule ID, evidence, reachability/guard, root cause, severity, confidence и конкретная replacement boundary. По значимым находкам — `add_task`. Делегируй специализированной роли `integrity`.
