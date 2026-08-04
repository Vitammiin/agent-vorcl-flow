---
description: Генерация UI-компонента по feature-структуре (frontend)
argument-hint: "<описание компонента>"
allowed-tools: Read, Write, Edit, Bash
---

Сгенерируй компонент: **$ARGUMENTS**.

Размести код по feature-based архитектуре из скилла `frontend-architecture`: определи фичу в `src/features/<feature>/` и разложи по слоям — `types` (типы), `api` (запросы/мутации TanStack Query, если нужны данные), `stores` (клиентское состояние на Zustand, если нужно), `components` (сам компонент), экспорт через `index.ts`. Общие примитивы — из `src/components/ui`. Реши Server vs Client Component (`"use client"` только при интерактивности). Стилизуй Tailwind (варианты через `cva`), типизируй пропсы, обеспечь a11y и состояния loading/empty/error. Дай пример теста (Testing Library). Опирайся на навыки `react`, `nextjs`, `typescript`, `tailwind`. При необходимости делегируй субагенту `frontend`.
