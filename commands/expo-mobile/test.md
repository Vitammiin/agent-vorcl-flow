---
description: "Создать и реально прогнать Expo mobile tests: domain unit, React Native Testing Library и Maestro critical flows."
argument-hint: "<module / screen / flow>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Проверь Expo mobile код: **$ARGUMENTS**.

Определи test runner проекта. Business rules/state transitions покрывай unit tests, hooks/components — React Native Testing Library, только critical user flows — Maestro. Мокай I/O/native boundary, а не domain. Проверь validation, error/loading/empty/refreshing, permissions и offline/network edges. Запусти тесты реально и вставь вывод; готовность только при зелёном guard/typecheck/lint/testStrategy. Опирайся на `expo-mobile-architecture` и `react-testing`; делегируй `expo-mobile`.
