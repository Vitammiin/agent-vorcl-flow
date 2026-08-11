---
description: Read-only аудит Expo Design System, motion, interactions, accessibility и performance risk.
argument-hint: "[путь проекта или scope]"
allowed-tools: Read, Bash, Grep, Glob
---

Проведи read-only аудит: **$ARGUMENTS**.

Запусти `expo-ui-design-motion/scripts/guard.mjs --root <project> --format json`. Дополнительно проверь navigation semantics, token coverage, motion purpose, gesture continuity, haptic density, loading/empty/image states, optimistic rollback, experimental fallbacks, Reduced Motion, accessibility и release performance evidence. Ничего не исправляй. Отдай findings по severity с `file:line`, impact и remediation; нетривиальные findings оформи через Task Master `add_task`. Следуй `expo-ui-design-motion`; делегируй `expo-mobile` строго read-only.
