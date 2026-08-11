---
name: expo-mobile-test
description: "Создать и реально прогнать Expo tests: domain unit, React Native Testing Library и Maestro critical flows."
---

# Тестировать Expo mobile

Определи runner проекта и через `$expo-mobile-compatibility` проверь SDK/React/Node, jest-expo и RNTL peers/engines; не используй react-test-renderer с React 19. Domain rules/transitions покрывай unit tests, hooks/components — React Native Testing Library, critical user flows — Maestro. Мокай I/O/native boundaries, не domain. Проверь validation, data states, permissions, offline/network edges, Reduced Motion и experimental fallbacks. Запусти compatibility + оба Expo guard/typecheck/lint/tests реально и покажи вывод. Следуй `$expo-mobile-architecture`, `$expo-ui-design-motion` и `$react-testing`.
