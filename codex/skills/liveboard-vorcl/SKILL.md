---
name: liveboard-vorcl
description: "Изменить liveboard через Task Master: задача, реализация, live-проверка и done."
---

# Liveboard через Task Master

Следуй `$workflow` + `$task-master`: цель → `add_task`/`parse_prd` → `next_task` → `get_task` → при сложности `expand_task` → реализация → запуск сервера и `testStrategy` → `set_task_status done`. Опирайся на `$liveboard`; runtime остаётся memory-only и localhost-only.
