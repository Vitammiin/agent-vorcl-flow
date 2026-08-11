---
description: Создать Expo Router route и production module screen с полным набором UI-состояний.
argument-hint: "<экран, route и пользовательский сценарий>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Создай экран: **$ARGUMENTS**.

Route в `src/app`/`app` оставь тонким и импортируй screen через public API business module. До Router/native UI dependency решения выполни live compatibility preflight и используй versioned Expo docs. Screen размести в `modules/<domain>/ui`, данные получай через module hook/Query, сложные rules вынеси в domain/application. Реализуй loading, success, empty, error, refreshing, accessibility, Reduced Motion и navigation edge cases. Используй design/motion tokens и semantic interaction vocabulary. Добавь RNTL test; запусти compatibility и оба Expo guard, typecheck, lint и tests. Опирайся на `expo-mobile-architecture` и `expo-ui-design-motion`; делегируй `expo-mobile`.
