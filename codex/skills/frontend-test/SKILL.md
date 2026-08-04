---
name: frontend-test
description: Генерация тестов компонентов (роль frontend). Use когда нужно покрыть React/Next.js UI поведенческими тестами.
---

# Задача: тесты компонентов

Напиши тесты для указанного пользователем компонента/фичи.

Поведенческие тесты по `$react-testing`: Testing Library + Vitest, поиск по ролям/тексту, взаимодействие через `user-event`, структура AAA. Мокай границу сети через MSW; свежий `QueryClient` на тест (`retry: false`). Покрой happy path и состояния loading/empty/error, крайние случаи. Прогони тесты и покажи зелёный вывод. Опирайся на `$react-testing`, `$react`.
