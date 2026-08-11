---
description: Read-only аудит Expo modular architecture с детерминированным guard и доказательствами file:line.
argument-hint: "[путь проекта или scope]"
allowed-tools: Read, Bash, Grep, Glob
---

Проведи read-only аудит: **$ARGUMENTS**.

Найди `expo-mobile-architecture/scripts/guard.mjs` в установленном skill и запусти его с `--root <project> --format json`. Дополнительно проверь state ownership, fat routes, DTO validation, storage/security и business logic in JSX/useEffect по reference. Ничего не исправляй. Отдай findings по severity с `file:line`, rule, impact и remediation; каждую нетривиальную находку оформи через Task Master `add_task`. Делегируй субагенту `expo-mobile`, строго в read-only режиме.
