---
name: data-fetching
description: Серверное состояние на TanStack Query (React Query) — ключи запросов, кэш, инвалидация, мутации, оптимистичные обновления, синхронизация с RSC/Server Actions. Use при загрузке/мутации серверных данных во фронтенде.
version: 1.0.0
---

# Навык: Data fetching (TanStack Query)

Серверное состояние на **TanStack Query**. Клиентское UI-состояние — в Zustand (скилл `state-management`).

## Ключи запросов
- Иерархические ключи-массивы: `['orders']`, `['orders', id]`, `['orders', { status }]`.
- Держи фабрику ключей в `features/<feature>/api` — единый источник правды для инвалидации.

## Запросы
- `useQuery({ queryKey, queryFn })`; валидируй ответ (zod) и типизируй.
- Настрой `staleTime`/`gcTime` осознанно; `placeholderData`/`keepPreviousData` для пагинации.
- Состояния `isLoading/isError/data` обрабатывай явно (loading/empty/error UI).

## Мутации
- `useMutation({ mutationFn, onSuccess })`; после успеха — `queryClient.invalidateQueries({ queryKey })`.
- **Оптимистичные обновления**: `onMutate` (снимок + оптимистичный set), `onError` (откат), `onSettled` (инвалидация).

## Интеграция с Next.js
- Фетч на сервере (RSC/Server Actions) + гидрация: `prefetchQuery` → `dehydrate`/`HydrationBoundary`.
- Мутации через Server Actions, затем инвалидация клиентского кэша Query.
- Один `QueryClient` на запрос на сервере; на клиенте — стабильный инстанс в `src/lib`.

## Пример
```ts
export const ordersKeys = { all: ['orders'] as const, detail: (id: string) => ['orders', id] as const };

export function useOrders() {
  return useQuery({ queryKey: ordersKeys.all, queryFn: fetchOrders });
}
```
