---
name: frontend-refactor
description: Рефакторинг UI/хуков без изменения поведения (роль frontend). Use когда нужно улучшить структуру фронтенд-кода, сохранив функциональность.
---

# Задача: рефакторинг фронтенда

Отрефактори указанный пользователем код, сохраняя поведение (тесты зелёные до и после).

Приведи к feature-based структуре (`$frontend-architecture`): логику — в хуки, серверные данные — в `api` (TanStack Query), клиентское состояние — в `stores` (Zustand), презентацию — в `components`. Убери дублирование, лишние ререндеры и prop drilling; раздели Server/Client Components. Поясни, что улучшилось и какие компромиссы. Опирайся на `$react`, `$typescript`, `$state-management`, `$data-fetching`.
