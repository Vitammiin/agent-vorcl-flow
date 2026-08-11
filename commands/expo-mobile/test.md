---
description: "Создать и реально прогнать Expo mobile tests: domain unit, React Native Testing Library и Maestro critical flows."
argument-hint: "<module / screen / flow>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Проверь Expo mobile код: **$ARGUMENTS**.

Определи test runner проекта и сначала live-проверь Expo SDK/React/Node, jest-expo и RNTL peer/engine compatibility; не используй deprecated react-test-renderer с React 19. Business rules/state transitions покрывай unit tests, hooks/components — React Native Testing Library, только critical user flows — Maestro. Мокай I/O/native boundary, а не domain. Проверь validation, error/loading/empty/refreshing, permissions, offline/network edges, Reduced Motion и experimental fallbacks. Запусти тесты реально и вставь вывод; готовность только при зелёных compatibility + architecture + UI/motion guards, typecheck, lint и testStrategy. Опирайся на `expo-mobile-architecture`, `expo-ui-design-motion` и `react-testing`; делегируй `expo-mobile`.
