---
name: liveboard-vorcl
description: Изменять или расширять сам liveboard через Task Master workflow: задача, реализация, live-проверка и done (роль liveboard). Use для нетривиальной разработки liveboard.
---

# Liveboard через Task Master

Следуй `$workflow` + `$task-master`: цель → `add_task`/`parse_prd` → `next_task` → `get_task` → при сложности `expand_task` → реализация → запуск сервера и `testStrategy` → `set_task_status done`. Опирайся на `$liveboard`; runtime остаётся memory-only и localhost-only.
