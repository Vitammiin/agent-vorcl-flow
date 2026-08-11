---
description: Спроектировать и реализовать premium Expo screen через единый Design, Motion и Interaction System.
argument-hint: "<экран, сценарий и brand/context>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Создай или улучши экран: **$ARGUMENTS**.

Сначала определи hierarchy, primary action, spatial navigation, loading/content/empty/error/refreshing и reduced-motion variant. Используй semantic colors/typography/spacing/radius/shadows/opacity/motion tokens, native Stack/formSheet, subtle press feedback, semantic haptics, image placeholders и optimistic UI только с rollback. Alpha/platform capabilities допускай лишь как progressive enhancement с fallback. Route оставь тонким, UI — внутри business module. Проверь accessibility, release performance, оба Expo guard, typecheck/lint/tests. Следуй `expo-mobile-architecture` + `expo-ui-design-motion`; делегируй `expo-mobile`.
