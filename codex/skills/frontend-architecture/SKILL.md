---
name: frontend-architecture
description: Обязательные правила feature-based архитектуры фронтенда (по bulletproof-react) — src/features/* со слоями api/components/hooks/stores/types, общие components/ui и lib, однонаправленные зависимости. Use ВСЕГДА при создании или изменении структуры frontend-кода, новых фич и компонентов.
---

# Навык: Feature-based архитектура фронтенда

Дистилляция подхода **bulletproof-react**. Код организуется вокруг фич в `src/features/*`, а не по типам файлов.

## Структура каталогов
```
src/
├── app/            # маршруты Next.js App Router (страницы, layout, loading, error)
├── components/
│   └── ui/         # переиспользуемые UI-примитивы (Button, Input, Dialog…)
├── features/
│   └── <feature>/  # напр. orders, auth, billing
│       ├── api/        # запросы/мутации (TanStack Query hooks) к бэкенду
│       ├── components/ # компоненты фичи
│       ├── hooks/      # логика/хуки фичи
│       ├── stores/     # клиентское состояние фичи (Zustand)
│       ├── types/      # типы фичи
│       └── index.ts    # публичная поверхность фичи
├── lib/            # кросс-фичевый код (api-client, query-client, utils, config)
└── styles/         # глобальные стили/токены Tailwind
```

## Правила зависимостей
1. Поток однонаправленный: `app → features → components/ui + lib`. Обратных импортов нет.
2. Фичи **не** импортируют внутренности друг друга — только через `<feature>/index.ts`.
3. Общий код (api-client, query-client, утилиты) живёт в `src/lib`; фичи импортируют его, не наоборот.
4. UI-примитивы в `components/ui` не знают о доменных фичах.
5. Границы модулей можно защитить ESLint (`import/no-restricted-paths`).

## Слои фичи
- **api** — серверное состояние: `useQuery`/`useMutation` с ключами; типы ответов выведены/провалидированы (zod).
- **components** — презентация + композиция; данные берут из `api`/`hooks`, а не фетчат напрямую в JSX.
- **hooks** — переиспользуемая логика фичи.
- **stores** — только клиентское UI-состояние (Zustand); серверные данные сюда не кладём.
- **types** — доменные типы фичи.
- **index.ts** — что фича отдаёт наружу.

## Server vs Client Components (Next.js)
- По умолчанию Server Component. `"use client"` — только для интерактивности (состояние, обработчики, браузерные API).
- Фетч данных — на сервере (RSC/Server Actions), где возможно; TanStack Query — для клиентского кэша/мутаций.

## Чек-лист новой фичи
- [ ] Каталог `src/features/<feature>/` со слоями `api/components/hooks/stores/types` + `index.ts`.
- [ ] Наружу торчит только `index.ts`.
- [ ] Серверное состояние в `api` (Query), клиентское — в `stores` (Zustand).
- [ ] `"use client"` только там, где нужен.
- [ ] Зависимости идут в одну сторону.

## Интернационализация (i18n)
- Словари живут централизованно (`messages/<locale>.json`) или на уровне фичи (`features/<feature>/locales/`) — единый подход на весь проект. Компоненты берут текст через слой перевода, **не** хардкодят строки в JSX.
- Сначала определи мультиязычность проекта и адаптируйся; ключи, плюрализация и форматирование через `Intl` — скилл **i18n**.
