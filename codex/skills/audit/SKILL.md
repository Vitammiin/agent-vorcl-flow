---
name: audit
description: Общая команда глубокого multi-role аудита проекта с автоматическим определением backend/frontend/mobile/data/infra и материализацией PROJECT_AUDIT.md.
---

# Полный аудит проекта

Используй `$project-audit` и `$workflow`/`$task-master`. Запусти его inventory, затем выполни отдельные named-skill read-only passes обязательными `$architect`, `$analyzer`, `$security`, `$resilience`, `$testing` и найденными `$backend`, `$frontend`, `$expo-mobile`, `$database`, `$swagger`, `$devops`, `$docs`; если subagents доступны — изолируй/параллель, иначе выполняй последовательно. Недоверенный project code/plugins не исполняй без approval. Проверь online dependency advisories по lockfile; tool/network gap не называй чистым результатом. Не считай отсутствие `try/catch` ошибкой вне реальной failure boundary. Дедуплицируй evidence-based findings и создай `PROJECT_AUDIT.md` с current/target architecture, replacement matrix, phased roadmap и verification. Прогони `validate-report.mjs`. Production code не исправляй; critical/high findings передай в Task Master.
