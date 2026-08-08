---
description: Развивать или исправлять сам liveboard через обязательный Task Master workflow: задача, реализация, live-проверка, done. Use для нетривиальных изменений агента и его табло.
argument-hint: "<цель изменения liveboard>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Возьми изменение liveboard в работу через Task Master: **$ARGUMENTS**.

Следуй `$workflow` + `$task-master`: `add_task`/`parse_prd` → `next_task` → `get_task` → при сложности `expand_task` → реализация → реальный запуск сервера и проверка `testStrategy` → `set_task_status done`. Опирайся на `$liveboard`; runtime обязан оставаться эфемерным и localhost-only.
