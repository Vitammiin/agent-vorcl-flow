---
name: expo-mobile-architecture
description: >
  Обязательные правила production-архитектуры React Native + Expo для приложений с большой
  бизнес-логикой: Expo Router только для маршрутов, Modular Vertical Slice в src/modules/*,
  shared infrastructure в src/shared/*, TanStack Query для server state, Zustand для shared
  client state, domain/application/data/ui для сложных сценариев. Use ВСЕГДА при создании или
  изменении экранов, модулей, API, stores, бизнес-логики, навигации, storage, forms, hooks,
  offline sync, native integrations и структуры Expo/React Native проекта.
---

# Expo Mobile Modular Architecture

Применяй архитектуру:

```text
Expo Router → business modules → shared infrastructure
                     ↓
            application → domain
```

## Обязательный workflow

1. Перед любым dependency/SDK/native/navigation/test tooling изменением выполни обязательный online compatibility protocol из `references/version-compatibility.md`; версии по памяти запрещены.
2. Определи бизнес-домен изменения: `auth`, `payments`, `transactions`, `settings` или другой.
3. Найди или создай `src/modules/<domain>/`; не раскладывай одну feature по глобальным `screens/services/hooks/stores/types`.
4. Классифицируй код: route, UI, server state, client state, domain rule, application use case, API, storage или shared infrastructure.
5. Выбери минимальную структуру модуля. Для простой CRUD-feature используй `api/model/hooks/ui/index.ts`; добавляй `domain/` и `application/` только при реальных правилах, инвариантах или orchestration.
6. Сохрани направление зависимостей `app → modules → shared`. `domain` держи чистым от React Native, Expo, HTTP, Query, Zustand и storage.
7. Внешние данные провалидируй runtime schema; DTO преобразуй mapper-ом в внутреннюю модель.
8. Экспортируй внешний контракт через `modules/<domain>/index.ts`; запрети deep imports между модулями.
9. Реализуй loading, success, empty, error и refreshing для data-driven экранов.
10. Добавь тесты бизнес-инвариантов и затронутого пользовательского сценария.
11. Запусти compatibility preflight, архитектурный guard и проверки проекта до выдачи результата.

## Неподвижные границы

- Route-файлы Expo Router оставляй тонкими: параметры, guards, redirect и композиция module screen.
- Server state храни в TanStack Query; не копируй API-данные в Zustand.
- Shared client state храни в Zustand; локальный UI state — в `useState`/`useReducer`.
- Secrets храни в Expo SecureStore, preferences — в лёгком persistent storage, structured offline data — в Expo SQLite.
- Endpoint, schema, query keys и mutations размещай внутри владельца-модуля; общий HTTP client — в `shared/api`.
- Shared UI содержит только primitives/design system; бизнес-компоненты принадлежат модулю.
- Cross-module imports выполняй только через публичный `index.ts`; циклы запрещены.
- Не вводи repository, event bus, CQRS, DI container, `processes/` или domain layer заранее.
- Не используй frontend navigation/hidden controls как security boundary; backend повторно проверяет authz/ownership.
- Не логируй tokens, credentials, card data и PII; native packages и permissions изолируй за контролируемой границей.

## Выбор слоя

| Вид ответственности | Место |
| --- | --- |
| Route/layout/deep-link/guard | `src/app/**` |
| Бизнес UI | `src/modules/<domain>/ui/**` |
| Query/mutation/DTO/HTTP | `src/modules/<domain>/api/**` |
| Repository/storage/native adapters при сложном domain | `src/modules/<domain>/data/**` |
| React-specific behavior | `src/modules/<domain>/hooks/**` |
| Runtime schemas/client state | `src/modules/<domain>/model/**` |
| Чистые правила/invariants | `src/modules/<domain>/domain/**` |
| Сложный use case/orchestration | `src/modules/<domain>/application/**` |
| Универсальная infrastructure/UI | `src/shared/**` |
| Глобальная инициализация | `src/providers/**` |

## Progressive disclosure

Перед архитектурным проектированием, созданием нового модуля или крупным рефакторингом полностью прочитай [references/architecture-guide.md](references/architecture-guide.md). Для точечной правки найди там релевантный раздел по заголовку.

Перед установкой/обновлением/удалением packages, Expo SDK upgrade, изменением native config/plugin, Router/navigation, Reanimated/gestures, test tooling или EAS Update полностью прочитай [references/version-compatibility.md](references/version-compatibility.md). Live official docs и registry metadata важнее snapshot.

## Автоматическая проверка

Из корня Expo-проекта выполни:

```bash
node <skill-root>/scripts/guard.mjs --root .
```

Guard проверяет направление зависимостей, публичные API модулей, чистоту domain, route imports, явные platform-suffix imports и Node built-ins. Он не заменяет `tsc`, ESLint и tests. Код возврата: `0` — чисто, `1` — нарушения, `2` — ошибка запуска. JSON для CI: `--format json`.

Compatibility preflight по умолчанию выполняет static rules и live read-only checks:

```bash
node <skill-root>/scripts/compatibility-preflight.mjs --root .
```

`--offline` не подтверждает готовность dependency work. Исправления (`expo install --fix`, package mutation, `prebuild --clean`) выполняй отдельным осознанным шагом после review.

## Definition of Done

- Ответственность принадлежит правильному business module.
- Route тонкий; domain не зависит от framework/infrastructure.
- TanStack Query/Zustand/local state/storage выбраны по природе данных.
- External data валидируется; DTO не протекает в domain без mapper.
- Модуль экспортирует public API; deep imports и циклы отсутствуют.
- Data states и critical business tests реализованы.
- Online compatibility preflight, `guard.mjs`, typecheck, lint и релевантные tests зелёные.
