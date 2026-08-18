---
name: security-vorcl
description: Security-цель через Task Master — аудит → findings → задачи на фиксы → делегирование исполнителям (роль security, read-only). Use when аудит должен закончиться задачами и циклом починки, а не отчётом.
---

# Задача: security-цель через Task Master workflow

Возьми security-цель в работу через Task Master (`$workflow` + `$task-master`).

1. Маршрут означает явно выбранный `track-only`; обычный security report Task Master не меняет.
2. Прогони аудит (**read-only**): секреты (дерево + `git log -p --all`), OWASP Top 10, зависимости (`npm audit`), PII. Каждая находка — с доказательством (`file:line`/коммит + цитата) и severity.
3. Проверь контекст каждой находки до репорта: env-подстановки, плейсхолдеры, фейки в тестах — не findings.
4. Значимое → `add_task`; сохрани возвращённые IDs и создай scoped run. Реальный секрет — critical + обязательная ротация.
5. Atomic claim каждого ID → `get_task` → `in-progress`; фиксы делегируй `$backend`/`$frontend`/`$gitflow`. Bare `next_task` запрещён.
6. Независимый `$testing` выполняет `testStrategy`; статус меняет только Orchestrator.

Без цели — полный аудит репозитория. Вердикт «чисто» — только со списком прогнанных проверок. Опирайся на `$security-audit`, `$secrets-detection`.
