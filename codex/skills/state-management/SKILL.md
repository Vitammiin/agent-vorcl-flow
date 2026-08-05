---
name: state-management
description: Клиентское состояние на Zustand — слайсы, селекторы, персист, экшены; граница «что НЕ поднимать в глобальный стор». Use при проектировании или правке клиентских сторов состояния во фронтенде.
---

# Навык: State management (Zustand)

Клиентское UI-состояние на **Zustand**. Серверные данные — в TanStack Query (`$data-fetching`).

## Что держать в сторе
- Только клиентское UI-состояние: модалки, вкладки, черновики форм, тема, флаги.
- **Не** держи серверные данные, производное состояние (селектор) и локальное состояние компонента.
- **Не** храни переведённые строки — держи ключи/текущую локаль, текст резолвь через слой перевода при рендере (`$i18n`).

## Структура
- Стор на фичу (`src/features/<feature>/stores`), не один god-store.
- Слайсы `(set, get) => ({...})` объединяй.
- Экшены — внутри стора.

## Селекторы и перфоманс
- Узкая подписка: `useStore(s => s.value)`.
- Несколько полей — `useShallow`.

## Персист и middleware
- `persist` с `partialize` и `version`/`migrate`; `devtools`; `immer`.

## Пример
```ts
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) => set((s) => ({ items: [...s.items, item] })),
      clear: () => set({ items: [] }),
    }),
    { name: "cart", partialize: (s) => ({ items: s.items }) },
  ),
);
```
