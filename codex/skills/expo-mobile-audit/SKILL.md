---
name: expo-mobile-audit
description: Read-only аудит Expo modular architecture с детерминированным guard и доказательствами file:line.
---

# Аудит Expo architecture

Запусти `$expo-mobile-architecture` `scripts/guard.mjs --root <project> --format json` и live `scripts/compatibility-preflight.mjs --root <project> --format json`. Затем read-only проверь state ownership, fat routes, validation/mappers, storage/security, duplicates/native runtime и documented excludes/overrides. Ничего не исправляй. Отдай findings с severity, `file:line`, official URL/date, impact и remediation; создай Task Master tasks для нетривиальных находок.
