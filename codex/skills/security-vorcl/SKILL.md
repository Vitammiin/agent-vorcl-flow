---
name: security-vorcl
description: Security-цель через Task Master — аудит → findings → задачи на фиксы → делегирование исполнителям (роль security, read-only). Use when аудит должен закончиться задачами и циклом починки, а не отчётом.
---

# Задача: security-цель через Task Master workflow

Возьми security-цель в работу через Task Master (`$workflow` + `$task-master`).

1. Убедись, что Task Master инициализирован; иначе `task-master init`.
2. Прогони аудит (**read-only**): секреты (дерево + `git log -p --all`), OWASP Top 10, зависимости (`npm audit`), PII. Каждая находка — с доказательством (`file:line`/коммит + цитата) и severity.
3. Проверь контекст каждой находки до репорта: env-подстановки, плейсхолдеры, фейки в тестах — не findings.
4. Значимое — в `add_task` (заголовок, категория, severity, доказательство, починка, исполнитель). Реальный секрет — critical + обязательная ротация.
5. `next_task` → `get_task`; фиксы делегируй профильным ролям (`$backend`/`$frontend`; git-история — роль gitflow) — сам ничего не правь. Автор фикса проверяет `testStrategy` → `set_task_status done`; вернись к шагу 5.

Без цели — полный аудит репозитория. Вердикт «чисто» — только со списком прогнанных проверок. Опирайся на `$security-audit`, `$secrets-detection`.
