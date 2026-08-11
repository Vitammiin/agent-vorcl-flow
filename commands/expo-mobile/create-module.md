---
description: Создать production business module React Native + Expo по Modular Vertical Slice Architecture.
argument-hint: "<business domain и требования>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Создай или расширь business module: **$ARGUMENTS**.

Сначала изучи проект и существующие boundaries. Минимум — `api/model/hooks/ui/index.ts`; добавляй `domain/application/repository/sync/native` только при доказанной сложности. Server state веди TanStack Query, client state — Zustand только при необходимости, external data валидируй, DTO маппируй. Экспортируй public API и не создавай deep imports. Добавь business tests и запусти architecture guard/typecheck/lint/tests. Опирайся на `expo-mobile-architecture`; делегируй `expo-mobile`.
