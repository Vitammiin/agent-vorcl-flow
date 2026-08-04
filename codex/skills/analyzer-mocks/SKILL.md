---
name: analyzer-mocks
description: Поиск mockup/фейковых данных на фронтенде (роль analyzer, read-only). Use для выявления заглушек, просочившихся в прод-путь.
---

# Задача: поиск mockup на фронте

Найди mockup/фейковые данные на **фронтенде** (**read-only**) в указанной области.

Ищи заглушки в прод-пути: хардкод-массивы/объекты вместо API (`const MOCK_*`, `fakeData`, статические списки в компонентах), `lorem ipsum`/placeholder-тексты и картинки, `TODO`/`FIXME`/`hardcoded`, замоканные хендлеры (MSW `setupWorker`/`handlers`, `jest.mock`), закомментированные реальные вызовы, значения-заглушки (`example.com`, `test@test`). Отличай легитимные фикстуры (`__tests__`/`*.stories.*`/`mocks/`) от утечки в прод — помечай. Ничего не правь. Формат: `file:line`, что нашли, первопричина, конкретная починка (реальный запрос через `api`/TanStack Query); severity: mockup в прод-пути = `critical/high`. По значимым находкам — `add_task`. Опирайся на `$frontend-architecture`, `$react`, `$nextjs`.
