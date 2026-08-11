---
name: expo-mobile-create-screen
description: Создать Expo Router route и production module screen с полным набором UI-состояний.
---

# Создать Expo screen

Route оставь тонким и импортируй screen через module public API. Screen размести в `modules/<domain>/ui`; данные получай через module hook/Query, rules — через domain/application. Реализуй loading/success/empty/error/refreshing, accessibility и navigation edges. Добавь RNTL test и запусти guard/typecheck/lint/tests. Следуй `$expo-mobile-architecture`, работай как `$expo-mobile`.
