---
description: "Добавить Expo mobile API boundary: runtime schema, DTO mapper, query keys и TanStack Query hook/mutation."
argument-hint: "<endpoint / contract / module>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Добавь API интеграцию: **$ARGUMENTS**.

Найди владельца-module. Создай schema/DTO, API method, centralized query keys и query/mutation; response валидируй, DTO преобразуй mapper-ом. Общий HTTP/auth/error transport переиспользуй из `shared/api`. Не вызывай API из screen и не копируй server data в Zustand. Проверь cache update, error/loading/empty/refreshing и tests. Опирайся на `expo-mobile-architecture`; делегируй `expo-mobile`.
