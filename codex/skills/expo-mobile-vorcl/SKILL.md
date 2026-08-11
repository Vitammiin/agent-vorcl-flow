---
name: expo-mobile-vorcl
description: Точка входа Expo Mobile цели через Task Master до реализованного и проверенного результата.
---

# Expo Mobile цель через workflow

Возьми цель через `$workflow` + `$task-master`: `add_task`/`parse_prd` → `next_task` → `get_task` → при сложности `expand_task` → `$expo-mobile-compatibility` для dependency/SDK/native/navigation/test changes → реализация по `$expo-mobile-architecture`, а для UI также `$expo-ui-design-motion` → `testStrategy` → `set_task_status done`. Прогресс фиксируй через `update_subtask`. Определи business module до файлов и веди реализацию как `$expo-mobile`.
