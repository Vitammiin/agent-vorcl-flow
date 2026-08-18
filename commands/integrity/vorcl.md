---
description: Integrity-цель через Task Master: кросс-языковой read-only аудит hardcode/mocks → evidence → задачи владельцам. Use для нетривиального или многошагового аудита production integrity (integrity)
argument-hint: "<цель и область>"
allowed-tools: Read, Grep, Glob, Bash
---

Выполни integrity-цель через обязательный Task Master workflow: **$ARGUMENTS**.

`add_task`/`parse_prd` → `next_task` → `get_task` → при сложности `expand_task` → read-only аудит через `code-integrity`, `hardcode-detection`, `mock-data-detection` → проверка evidence contract/testStrategy → findings как задачи профильным владельцам → `set_task_status done`. Не выдумывай ID и не исправляй production code. Делегируй роли `integrity`.
