---
name: expo-mobile-motion
description: Спроектировать coherent navigation, motion, gestures и haptics для Expo user flow.
---

# Expo motion flow

Сначала выполни `$expo-mobile-compatibility` для SDK/RN, Router, Reanimated+Worklets, Gesture Handler, New Architecture и platform/alpha status. Назови purpose каждой animation и spatial relationship. Обычная navigation → native Stack; contextual task → modal/formSheet; object-to-detail zoom → progressive enhancement. Используй shared motion tokens, interruptible springs, Gesture Handler + Reanimated, semantic haptics и centralized Reduced Motion. Сохрани accessible non-gesture path и production fallback. Профилируй новую development/release build; эффект с frame drops упрости. Следуй `$expo-ui-design-motion` и `$expo-mobile-architecture`, работай как `$expo-mobile`.
