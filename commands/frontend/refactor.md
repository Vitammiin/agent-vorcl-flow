---
description: Рефакторинг UI/хуков без изменения поведения (frontend)
argument-hint: "<что рефакторим>"
allowed-tools: Read, Write, Edit, Bash
---

Отрефактори: **$ARGUMENTS**.

Сохраняй поведение (тесты зелёные до и после). Приведи код к feature-based структуре (`frontend-architecture`): вынеси логику в хуки, серверные данные — в `api` (TanStack Query), клиентское состояние — в `stores` (Zustand), презентацию — в `components`. Убери дублирование, лишние ререндеры и «prop drilling»; раздели Server/Client Components. Прокомментируй, что улучшилось и какие компромиссы. Опирайся на навыки `react`, `typescript`, `state-management`, `data-fetching`. При необходимости делегируй субагенту `frontend`.
