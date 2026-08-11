---
name: expo-mobile-create-screen
description: Создать Expo Router route и production module screen с полным набором UI-состояний.
---

# Создать Expo screen

Route оставь тонким и импортируй screen через module public API. До Router/native UI решений выполни `$expo-mobile-compatibility`. Screen размести в `modules/<domain>/ui`; данные получай через module hook/Query, rules — через domain/application. Реализуй loading/success/empty/error/refreshing, semantic tokens, accessibility, Reduced Motion и navigation edges. Добавь RNTL test и запусти compatibility + оба Expo guard/typecheck/lint/tests. Следуй `$expo-mobile-architecture` + `$expo-ui-design-motion`, работай как `$expo-mobile`.
