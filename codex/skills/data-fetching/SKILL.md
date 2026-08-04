---
name: data-fetching
description: Серверное состояние на TanStack Query (React Query) — ключи запросов, кэш, инвалидация, мутации, оптимистичные обновления, синхронизация с RSC/Server Actions. Use при загрузке/мутации серверных данных во фронтенде.
---

# Навык: Data fetching (TanStack Query)

Серверное состояние на **TanStack Query**. Клиентское UI-состояние — в Zustand (`$state-management`).

## Ключи запросов
- Иерархические ключи-массивы: `['orders']`, `['orders', id]`, `['orders', { status }]`.
- Фабрика ключей в `features/<feature>/api`.

## Запросы
- `useQuery({ queryKey, queryFn })`; валидируй ответ (zod).
- Осознанные `staleTime`/`gcTime`; `placeholderData`/`keepPreviousData` для пагинации.
- Состояния `isLoading/isError/data` обрабатывай явно.

## Мутации
- `useMutation`; после успеха — `invalidateQueries({ queryKey })`.
- Оптимистично: `onMutate` (снимок + set), `onError` (откат), `onSettled` (инвалидация).

## Интеграция с Next.js
- `prefetchQuery` → `dehydrate`/`HydrationBoundary`.
- Мутации через Server Actions + инвалидация кэша Query.
- Один `QueryClient` на запрос на сервере; стабильный инстанс на клиенте в `src/lib`.

## Пример
```ts
export const ordersKeys = { all: ['orders'] as const, detail: (id: string) => ['orders', id] as const };
export function useOrders() {
  return useQuery({ queryKey: ordersKeys.all, queryFn: fetchOrders });
}
```
