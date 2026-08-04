---
name: frontend-architecture
description: Обязательные правила feature-based архитектуры фронтенда (по bulletproof-react) — src/features/* со слоями api/components/hooks/stores/types, общие components/ui и lib, однонаправленные зависимости. Use ВСЕГДА при создании или изменении структуры frontend-кода, новых фич и компонентов.
---

# Навык: Feature-based архитектура фронтенда

Дистилляция подхода **bulletproof-react**. Код организуется вокруг фич в `src/features/*`, а не по типам файлов.

## Структура каталогов
```
src/
├── app/            # маршруты Next.js App Router
├── components/ui/  # переиспользуемые UI-примитивы
├── features/
│   └── <feature>/  # orders, auth, billing…
│       ├── api/        # запросы/мутации (TanStack Query)
│       ├── components/ # компоненты фичи
│       ├── hooks/      # логика/хуки фичи
│       ├── stores/     # клиентское состояние (Zustand)
│       ├── types/      # типы фичи
│       └── index.ts    # публичная поверхность
├── lib/            # api-client, query-client, utils, config
└── styles/         # токены Tailwind
```

## Правила зависимостей
1. Поток однонаправленный: `app → features → components/ui + lib`.
2. Фичи не импортируют внутренности друг друга — только через `<feature>/index.ts`.
3. Общий код — в `src/lib`; фичи импортируют его, не наоборот.
4. UI-примитивы `components/ui` не знают о доменных фичах.
5. Границы можно защитить ESLint (`import/no-restricted-paths`).

## Слои фичи
- **api** — серверное состояние (`useQuery`/`useMutation`, типы через zod).
- **components** — презентация; данные из `api`/`hooks`, не фетч в JSX.
- **hooks** — логика фичи.
- **stores** — только клиентское UI-состояние (Zustand).
- **types** — доменные типы.
- **index.ts** — публичная поверхность.

## Server vs Client (Next.js)
- По умолчанию Server Component; `"use client"` — только для интерактивности.
- Фетч на сервере (RSC/Server Actions), где возможно; TanStack Query — клиентский кэш/мутации.
