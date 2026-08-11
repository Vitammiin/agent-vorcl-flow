---
description: Live compatibility audit Expo SDK, React Native, React, Node, Router, native libraries, tests и EAS runtime без изменения проекта.
argument-hint: "[путь к Expo app] [пакет или планируемое изменение]"
allowed-tools: Read, Bash, Grep, Glob
---

# Expo compatibility preflight

Работай строго read-only. Полностью прочитай `expo-mobile-architecture/references/version-compatibility.md`, затем запусти `scripts/compatibility-preflight.mjs --root <project>` **без** `--offline`. Определи фактические SDK/RN/React/Node, package manager/lockfile, CNG/bare, Expo Go/dev build и EAS runtime policy. Для затронутых packages открой versioned Expo docs, current release notes, official upstream compatibility/migration и live npm `version/peerDependencies/engines`; сохрани URL и дату. Покажи точные `нельзя → правильно`, risk и необходимые rebuild/migration/tests. Ничего не устанавливай, не запускай `--fix` и `prebuild --clean`. Findings оформи с evidence; нетривиальные — Task Master tasks. Следуй `expo-mobile-architecture`; делегируй `expo-mobile` только в read-only режиме.
