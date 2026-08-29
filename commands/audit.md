---
description: Глубокий multi-role аудит всего проекта: сам определяет backend/frontend/mobile/data/infra, проверяет архитектуру, bugs, security, try-catch/error handling, CVE и создаёт PROJECT_AUDIT.md с remediation roadmap.
argument-hint: "[путь; по умолчанию текущий репозиторий] [опциональный focus]"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch, WebSearch, Task
---

Проведи полный аудит **$ARGUMENTS** через `project-audit` и Task Master. Сам production code не изменяй: разрешены только итоговый Markdown и audit tasks.

1. Найди `$workspace-capability-routing` и `$project-audit`; получи prompt+workspace route через `route.mjs`, затем запусти audit `inventory.mjs --root <scope> --format json`. Проверь inference по manifests/entrypoints/native config, перенеси `coverageGaps` в отчёт и сохрани выбранные/исключённые roles/skills с evidence.
2. По inventory подключи обязательные роли `architect`, `analyzer`, `security`, `resilience`, `testing` и только релевантные `backend`, `frontend`, `expo-mobile`, `database`, `swagger`, `devops`, `docs`. На платформе с subagents передай каждой отдельный read-only scope без write tools; в Codex/Kimi выполни те же named-skill passes последовательно и честно укажи execution model.
3. Недоверенный project code/plugins не исполняй. Typecheck/lint/tests запускай только для доверенного repo или после явного approval точной команды; никаких fix/install/migration/codegen scripts. Уязвимости зависимостей проверь online по lockfile через официальный scanner/advisory source; сохрани source и UTC date. Отсутствующий scanner = coverage gap, не «чисто».
4. Не требуй try/catch в каждой функции: проверь I/O/transaction/job/process/native boundaries и существующий centralized error propagation.
5. Дедуплицируй findings по root cause, назначь severity по impact, а не keyword. Любая находка обязана иметь `file:line` или воспроизводимое external evidence, root cause, impact, exact fix, target layer и verification.
6. Опиши current architecture и реалистичную target architecture: что переместить, разделить, заменить и добавить; permitted dependencies; incremental phases, prerequisites, rollback и tests. Не предлагай rewrite/микросервисы/DDD-абстракции без доказанной причины.
7. Материализуй `PROJECT_AUDIT.md`; при существующем файле создай timestamped новый. Проверь `validate-report.mjs` и приложи его реальный вывод.
8. Critical/high findings оформи Task Master tasks с dependencies/testStrategy. Не применяй исправления.

Финальный ответ содержит путь к отчёту, detected systems, число findings по severity, список использованных ролей, advisory status/date, validator result и созданные Task Master IDs.
