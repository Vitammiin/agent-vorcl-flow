---
description: Спроектировать coherent navigation, motion, gestures и haptics для Expo user flow.
argument-hint: "<flow или interaction>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Спроектируй interaction flow: **$ARGUMENTS**.

Сначала выполни live compatibility preflight: Expo SDK/RN, Router, Reanimated+Worklets matrix, Gesture Handler, New Architecture и platform/alpha status. Назови purpose каждой animation и spatial relationship. Обычную навигацию отдай native Stack; contextual task — modal/formSheet; object-to-detail zoom — только progressive enhancement. Используй shared motion tokens, interruptible springs, Gesture Handler + Reanimated для движения вместе с пальцем и semantic haptics через shared adapter. Реализуй centralized Reduced Motion fallback и доступный не-жестовый путь. Профилируй новый development/release build; эффект с frame drops упрости или удали. Следуй `expo-ui-design-motion` и `expo-mobile-architecture`; делегируй `expo-mobile`.
