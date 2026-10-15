---
description: "Session-first orchestrator: ограниченный план, делегирование и независимая проверка; Task Master только по явному выбору."
argument-hint: "<цель / objective>"
---

Возьми цель **$ARGUMENTS**. Прочитай `workflow`: по умолчанию session-first, план и evidence в сессии без Task Master или `.taskmaster/`. Режим report-only разрешает только запрошенный report artifact; track-only — только разрешённые metadata; remediation — изменения в scope запроса.

Сначала примени `workspace-capability-routing`: requested outcome + manifests/entrypoints/configs → один primary owner и необходимые supporting skills. Зафиксируй acceptance criteria и `testStrategy`, делегируй Executor, затем независимому Checker. Только Orchestrator завершает задачу после evidence. Не меняй MCP, providers, модели или ключи пользователя.

Task Master подключается только по явному выбору пользователя. Тогда прочитай `task-master`, обнаружь доступные инструменты, сохрани возвращённые при создании задач IDs, создай scoped run и выполняй atomic claim перед `in-progress`. Bare `next_task` запрещён. Не запускай init автоматически; отсутствие Task Master не блокирует session-first работу. Заверши по текущему scope, не по всему backlog.

Короткий router: architecture — `architect`, `principal-architect`, `archmap`; implementation — `backend`, `frontend`, `expo-mobile`; audits/contracts — `analyzer`, `integrity`, `security`, `resilience`, `logging`, `swagger`; data/platform — `database`, `render`, `devops`; visual/source — `screenshot`, `design-studio`, `visual-research`, `pinpoint`; artifacts — `drawio`, `mermaid`, `docs`; verification/release — `testing`, `gitflow`; research/operations — `firecrawl`, `liveboard`.

Targeted hardcode/mock всегда идёт в `integrity`, broad code-quality audit — в `analyzer`. Полный multi-language architecture package — `principal-architect`, лёгкая TS/JS dependency map — `archmap`. Неочевидную междоменную архитектуру начинает `architect`.
