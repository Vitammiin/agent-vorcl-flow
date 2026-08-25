---
description: "Универсальный scoped Task Master orchestrator: фиксирует IDs текущей цели, атомарно claim-ит их и делегирует реализацию и независимую проверку."
argument-hint: "<цель / objective>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Возьми цель: **$ARGUMENTS**. Сначала выбери режим из `workflow`: report-only пишет только явно запрошенный report artifact, но не `.taskmaster`/product state; track-only не меняет product code; remediation разрешает изменения только в границах запроса.

Для persistent режима:

1. `add_task`/`parse_prd`; сохрани только возвращённые IDs.
2. Создай scoped run через `scripts/vorcl-run.mjs`; для каждого ID выполни atomic claim, затем `get_task` и `set_task_status in-progress`. Bare `next_task` запрещён.
3. Делегируй Executor по registry `scripts/roles.json`. Он работает только над claimed ID.
4. Отдельный Checker выполняет `testStrategy`, не редактируя implementation/acceptance tests.
5. Только Orchestrator ставит `done`; остановись, когда терминальны IDs run, а не весь backlog.

Короткий router: architecture — `architect`, `principal-architect`, `archmap`; implementation — `backend`, `frontend`, `expo-mobile`; audits/contracts — `analyzer`, `integrity`, `security`, `resilience`, `logging`, `swagger`; data/platform — `database`, `render`, `devops`; visual/source — `screenshot`, `design-studio`, `visual-research`, `pinpoint`; artifacts — `drawio`, `mermaid`, `docs`; verification/release — `testing`, `gitflow`; research/operations — `firecrawl`, `liveboard`.

Targeted hardcode/mock всегда идёт в `integrity`, broad code-quality audit — в `analyzer`. Полный multi-language architecture package — `principal-architect`, лёгкая TS/JS dependency map — `archmap`. Неочевидную междоменную архитектуру начинает `architect`.
