---
name: data-fetching
description: Серверное состояние на TanStack Query (React Query) поверх реального API бэкенда. Источник истины — Fastify Swagger (OpenAPI): типы генерируются из спеки (openapi-typescript), запросы идут типобезопасным openapi-fetch. Ключи, кэш, инвалидация, мутации, оптимистичные обновления, RSC/Server Actions. Моков в прод-пути нет. Use при загрузке/мутации серверных данных во фронтенде.
---

# Навык: Data fetching (TanStack Query + OpenAPI)

Серверное состояние — на **TanStack Query** поверх **реального API бэкенда**. Клиентское UI-состояние — в Zustand (`$state-management`).

## Правило №1: всегда реальный API, источник истины — Fastify Swagger
- Фронт **всегда** бьёт в реальные эндпоинты бэка. Моков в прод-пути нет (MSW — только в тестах, `$react-testing`).
- Источник правды контракта — **OpenAPI-спека Fastify Swagger** (`GET /documentation/json`); полнота спеки — забота бэка (`$swagger-coverage`).
- Типы клиента **генерируются из спеки**, не пишутся руками.

## Типизированный клиент (openapi-typescript + openapi-fetch)
- Генерация типов (скрипт `gen:api`, перегенерировать при изменении бэка): `npx openapi-typescript http://localhost:3000/documentation/json -o src/shared/api/schema.d.ts`.
- Один клиент в `src/shared/api/client.ts`:
  ```ts
  import createClient from 'openapi-fetch'
  import type { paths } from './schema'
  export const api = createClient<paths>({ baseUrl: process.env.NEXT_PUBLIC_API_URL })
  ```
  Пути/query/body/ответы проверяются на типах против спеки — рассинхрон ловит компилятор.

## Слой api фичи
- `queryFn`/`mutationFn` вызывают `api.GET/POST/...` по эндпоинту из спеки; валидацию ответа обеспечивает сериализатор Fastify по response-схеме.
- Фабрику ключей держи в `features/<feature>/api`.

## Ключи запросов
- Иерархические ключи-массивы: `['orders']`, `['orders', id]`, `['orders', { status }]`.

## Запросы
- `useQuery({ queryKey, queryFn })`; состояния `isLoading/isError/data` обрабатывай явно.
- Осознанные `staleTime`/`gcTime`; `placeholderData`/`keepPreviousData` для пагинации.

## Мутации
- `useMutation`; после успеха — `invalidateQueries({ queryKey })`.
- Оптимистично: `onMutate` (снимок + set), `onError` (откат), `onSettled` (инвалидация).

## Интеграция с Next.js
- `prefetchQuery` → `dehydrate`/`HydrationBoundary` (тем же клиентом `api`).
- Мутации через Server Actions + инвалидация кэша Query.
- Один `QueryClient` на запрос на сервере; стабильный инстанс на клиенте в `src/lib`.

## Пример
```ts
import { api } from '@/shared/api/client'

export const ordersKeys = { all: ['orders'] as const, detail: (id: string) => ['orders', id] as const };

const fetchOrders = async () => {
  const { data, error } = await api.GET('/orders');
  if (error) throw error;
  return data;
};

export function useOrders() {
  return useQuery({ queryKey: ordersKeys.all, queryFn: fetchOrders });
}
```
