---
name: frontend-create-component
description: Генерация UI-компонента по feature-структуре (роль frontend). Use когда нужно создать React/Next.js компонент с типами, состоянием, данными и тестом.
---

# Задача: создание UI-компонента

Сгенерируй компонент по спецификации, которую дал пользователь.

Размести код по feature-based архитектуре из `$frontend-architecture`: фича `src/features/<feature>/`, слои `types → api (TanStack Query) → stores (Zustand, если нужно) → components`, экспорт через `index.ts`. Общие примитивы — из `src/components/ui`. Реши Server vs Client Component (`"use client"` только при интерактивности). Стилизуй Tailwind v4 (токены из `@theme`; варианты — `cva`/`cn`), типизируй пропсы, обеспечь a11y и состояния loading/empty/error. Дай пример теста (Testing Library). Опирайся на `$react`, `$nextjs`, `$typescript`, `$tailwind`.
