---
description: Security-цель через Task Master — аудит → findings → задачи на фиксы → делегирование исполнителям. Use when аудит безопасности должен закончиться не отчётом, а задачами и циклом починки до готового; быстрый разовый чек — /security:pre-push (security)
argument-hint: "<цель аудита / область>"
allowed-tools: Read, Grep, Glob, Bash
---

Возьми security-цель в работу через Task Master: **$ARGUMENTS**.

1. Этот маршрут означает явно выбранный `track-only`; обычный security report Task Master не меняет.
2. Прогони аудит (**read-only** — ничего не правь): секреты (рабочее дерево + `git log -p --all`), OWASP Top 10 в коде, зависимости (`npm audit`), PII в коде и логах. Каждая находка — с доказательством (`file:line` или коммит-хэш + цитата) и severity.
3. Перед репортом проверь контекст каждой находки: `${VAR:-default}`, `process.env.*`, плейсхолдеры и фейки в тестах/доках — не findings.
4. `add_task` для значимого finding; сохрани возвращённые IDs и создай scoped run. Реальный секрет — critical + обязательная ротация.
5. Atomic claim каждого ID → `get_task` → `in-progress`; фиксы делегируй `backend`/`frontend`/`gitflow`. Bare `next_task` запрещён.
6. Независимый `testing` выполняет `testStrategy`; только Orchestrator ставит `done`.

Пустой **$ARGUMENTS** — полный аудит текущего репозитория (все четыре категории). В финале перечисли прогнанные проверки и что не проверялось — вердикт «чисто» только с выводом команд.

Опирайся на навыки `security-audit`, `secrets-detection`, `workflow`, `task-master`. Сам аудит веди как субагент `security` (только чтение).
