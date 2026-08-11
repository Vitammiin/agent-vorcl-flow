---
description: Создать Expo Router route и production module screen с полным набором UI-состояний.
argument-hint: "<экран, route и пользовательский сценарий>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Создай экран: **$ARGUMENTS**.

Route в `src/app`/`app` оставь тонким и импортируй screen через public API business module. Screen размести в `modules/<domain>/ui`, данные получай через module hook/Query, сложные rules вынеси в domain/application. Реализуй loading, success, empty, error, refreshing, accessibility и navigation edge cases. Добавь RNTL test; запусти guard/typecheck/lint/tests. Опирайся на `expo-mobile-architecture`; делегируй `expo-mobile`.
