---
name: expo-mobile-compatibility
description: Live read-only compatibility audit Expo SDK, React Native, React, Node, Router, native libraries, tests и EAS runtime.
---

# Expo compatibility preflight

Работай строго read-only по `$expo-mobile-architecture`. Полностью прочитай его `references/version-compatibility.md`, затем запусти `scripts/compatibility-preflight.mjs --root <project>` без `--offline`. Определи SDK/RN/React/Node, package manager/lockfile, CNG/bare, Expo Go/dev build и EAS runtime policy. Для затронутых packages проверь versioned Expo docs, current release notes, official upstream matrix/migration и live npm `version/peerDependencies/engines`; сохрани URL и дату. Покажи точные «нельзя → правильно», risk и rebuild/migration/tests. Ничего не устанавливай, не запускай `--fix` или `prebuild --clean`. Findings оформи как `$expo-mobile`; нетривиальные — Task Master tasks.
