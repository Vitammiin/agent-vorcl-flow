---
description: Read-only аудит Expo modular architecture с детерминированным guard и доказательствами file:line.
argument-hint: "[путь проекта или scope]"
allowed-tools: Read, Bash, Grep, Glob
---

Проведи read-only аудит: **$ARGUMENTS**.

Найди `expo-mobile-architecture/scripts/guard.mjs` и запусти с `--root <project> --format json`; затем запусти live `compatibility-preflight.mjs --root <project> --format json`. Дополнительно проверь state ownership, fat routes, DTO validation, storage/security, business logic in JSX/useEffect, duplicates/native runtime и documented excludes/overrides. Ничего не исправляй. Отдай findings по severity с `file:line`, rule, official URL/date, impact и remediation; каждую нетривиальную находку оформи через Task Master `add_task`. Делегируй субагенту `expo-mobile`, строго в read-only режиме.
