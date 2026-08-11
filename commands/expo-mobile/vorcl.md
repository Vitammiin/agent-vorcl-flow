---
description: Точка входа Expo Mobile цели через Task Master до реализованного и проверенного результата.
argument-hint: "<цель / objective>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Возьми Expo/React Native цель в работу через Task Master: **$ARGUMENTS**. Если цель пуста — уточни её одной фразой.

Выполни обязательный цикл `add_task`/`parse_prd` → `next_task` → `get_task` → при сложности `expand_task` → live `/expo-mobile:compatibility` для dependency/SDK/native/navigation/test changes → реализация по `expo-mobile-architecture`, а для UI также `expo-ui-design-motion` → `testStrategy` → `set_task_status done`. Прогресс фиксируй через `update_subtask`. Определи business module до создания файлов; route оставь тонким. Делегируй реализацию субагенту `expo-mobile`.
