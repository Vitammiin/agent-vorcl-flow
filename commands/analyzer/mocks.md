---
description: Поиск mockup/фейковых данных на фронтенде. Use when подозрение, что UI живёт на заглушках — MSW-хендлеры, faker, хардкод вместо API; проверка типов — /analyzer:types (analyzer)
argument-hint: "[путь фронтенда; по умолчанию src фронта]"
allowed-tools: Read, Grep, Glob, Bash
---

Найди mockup/фейковые данные на **фронтенде** (**read-only**): **$ARGUMENTS**.

Ищи заглушки, попавшие в прод-путь: хардкод-массивы/объекты вместо реальных API-вызовов (`const MOCK_*`, `fakeData`, статические списки в компонентах), `lorem ipsum`/placeholder-тексты и картинки-заглушки, `TODO`/`FIXME`/`hardcoded`, замоканные хендлеры (MSW `setupWorker`/`handlers`, `jest.mock`), генераторы фейков (`faker`/`casual`) в прод-коде, закомментированные реальные вызовы, значения-заглушки (`example.com`, `123-456`, `test@test`). Отличай легитимные фикстуры тестов/сторибука (в `__tests__`/`*.stories.*`/`mocks/`) от утечки в прод — помечай это. Ничего не правь. Формат: `file:line`, что нашли, первопричина (почему заглушка вместо реальных данных), конкретная починка (реальный запрос через `api`/TanStack Query); severity: mockup в прод-пути = `critical/high`. По значимым находкам — `add_task` (Task Master). Опирайся на навыки `frontend-architecture`, `react`, `nextjs`. Делегируй субагенту `analyzer`.
