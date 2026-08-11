---
name: expo-mobile-audit
description: Read-only аудит Expo modular architecture с детерминированным guard и доказательствами file:line.
---

# Аудит Expo architecture

Запусти `$expo-mobile-architecture` `scripts/guard.mjs --root <project> --format json`. Затем read-only проверь state ownership, fat routes, validation/mappers, storage/security и business logic in JSX/useEffect. Ничего не исправляй. Отдай findings с severity, `file:line`, impact и remediation; создай Task Master tasks для нетривиальных находок.
