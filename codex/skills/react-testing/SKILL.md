---
name: react-testing
description: Тестирование React-компонентов — Testing Library + Vitest/Jest, поведенческие проверки от лица пользователя, MSW для мокинга сети. Use при написании или ревью тестов фронтенда.
---

# Навык: React testing

Поведенческие тесты компонентов на **Testing Library** + **Vitest** (или Jest).

## Принцип
- Тестируй поведение, а не реализацию.
- Поиск по ролям/тексту: `getByRole`, `getByLabelText`, `findByText`; `data-testid` — крайняя мера.
- Взаимодействие — `@testing-library/user-event`.

## Структура (AAA)
- Arrange (рендер + провайдеры) → Act (действие) → Assert (видимый результат).
- Провайдеры (QueryClientProvider, стор, тема) — через `renderWithProviders`.

## Сеть и данные
- Мокай границу сети через **MSW**, не внутренние модули.
- Свежий `QueryClient` на тест, `retry: false`.

## Асинхронность
- `await findBy*` / `await waitFor(...)`; не по таймингу.
- Проверяй loading/empty/error, не только happy path.

## Пример
```tsx
test('показывает заказы', async () => {
  renderWithProviders(<OrdersList />);
  expect(await screen.findByText('Заказ #1')).toBeInTheDocument();
});
```
