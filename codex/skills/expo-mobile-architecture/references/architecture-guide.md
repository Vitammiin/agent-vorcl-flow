# React Native + Expo Modular Architecture — полное руководство

## Содержание

1. Основа и структура
2. Слои простого и сложного модуля
3. State, API, validation и forms
4. Storage, offline, auth и navigation
5. Shared, providers, errors и cross-module flows
6. Mobile concerns: performance, native, permissions, analytics
7. Testing, security и dependency selection
8. Алгоритмы работы и anti-patterns
9. Definition of Done

## 1. Основа и структура

Архитектура рассчитана на production Expo-приложения с большим числом экранов/API, auth, payments, subscriptions, notifications, analytics, background sync, offline и AI-функциями.

Главная формула:

```text
ROUTES → MODULES → SHARED
```

Используй Expo Router + Modular Vertical Slice Architecture; для сложной бизнес-логики добавляй Domain/Application layers. Группируй код прежде всего по бизнес-модулям.

```text
src/
├── app/            # Expo Router: routes/layouts/guards/params
├── modules/        # auth/users/accounts/transactions/payments/...
├── shared/         # api/ui/storage/hooks/lib/config/theme/types
├── providers/      # query/theme/error/global initialization
└── assets/
```

Не создавай для большого приложения глобальную раскладку `components/screens/hooks/services/stores/types/utils/api`: она разбрасывает одну business feature по всему репозиторию.

### Expo Router

Route-файл должен быть тонкой композицией:

```tsx
import { TransactionDetailsScreen } from '@/modules/transactions';

export default function TransactionPage() {
  return <TransactionDetailsScreen />;
}
```

В `app/` допустимы routes, layouts, route groups, tabs/stacks/modals, deep links, params, navigation guards и redirects. Запрещены API calls, validation, calculations, большие components, data transformations и application flows.

## 2. Слои простого и сложного модуля

Простой модуль начинай минимально:

```text
settings/
├── api/       # settings.api.ts, settings.queries.ts, keys
├── model/     # schemas, types; store только если нужен client state
├── hooks/     # React-specific behavior
├── ui/        # screen/form/business components
└── index.ts   # public API
```

Не создавай `domain/application/repository` автоматически.

Для сложного domain с расчётами, invariants, state transitions и несколькими действиями используй:

```text
payments/
├── domain/       # entities, value objects, rules, domain errors
├── application/  # create/cancel/refund use cases
├── api/          # DTO, API methods, keys, queries, mutations
├── data/         # optional repository/storage/native adapters
├── model/        # schemas, types, client store
├── hooks/        # React adapters
├── ui/           # screens/forms/cards/states
├── lib/          # module-specific technical mappers/formatters
└── index.ts
```

### Domain

Domain содержит чистые правила: доступность операции, комиссия, лимит бюджета, статусные переходы, permissions и invariants. Он не импортирует `react`, `react-native`, `expo-*`, Zustand, TanStack Query, axios/fetch, SecureStore, AsyncStorage или SQLite.

```ts
export function canCancelPayment(payment: Payment): boolean {
  return payment.status === 'pending';
}
```

Domain errors (`InsufficientBalanceError`, `SubscriptionExpiredError`) не являются HTTP status или AxiosError.

### Application

Application отвечает «что происходит при бизнес-действии»: координирует domain rules, repository interfaces, API/storage abstractions и несколько шагов use case. UI здесь запрещён.

```text
UI → Application → Domain
API/storage adapters → Application → Domain
```

Добавляй application layer, когда операция объединяет действия, координирует API/storage, использует несколько правил или должна тестироваться отдельно от UI.

Repository нужен только когда use case должен быть независим от источника данных (API/offline/mock). Для простого `GET /settings` он избыточен.

`data/` вводи вместе с реальными repository/storage/native adapters в сложном модуле; не дублируй там простые HTTP-файлы из `api/`.

### UI, hooks и lib

`ui/` содержит React Native composition/components/animations. Сложные permissions, finance rules, transitions и transformations выноси из JSX в domain/application.

Screen координирует состояния query (`loading/error/empty/success/refreshing`), но не содержит бизнес-расчёты. Hook создавай только для React-specific behavior; чистый `calculatePaymentFee()` не превращай в `useCalculatePaymentFee()`.

`lib/` внутри модуля — mappers, formatters и технические helpers этого домена. Не прячь там business rules.

## 3. State, API, validation и forms

### State ownership

```text
Remote server state → TanStack Query
Shared client state → Zustand
Local UI state      → useState/useReducer
```

Server state: users, accounts, transactions, messages, notifications, subscriptions, products, analytics и server config. Не копируй query data в Zustand: два cache/source of truth неизбежно расходятся.

Zustand подходит для selected account, onboarding progress, drafts между routes, global filters/modal, UI preferences и wizard state. Он не нужен только потому, что данные видны на нескольких экранах.

### API boundary

Общий `shared/api/client.ts` владеет base URL, headers/auth refresh, timeout, network handling и transport error normalization. Endpoints принадлежат модулю: `modules/payments/api/payments.api.ts`.

Query keys централизуй внутри модуля:

```ts
export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters: TransactionFilters) => [...transactionKeys.lists(), filters] as const,
  details: () => [...transactionKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionKeys.details(), id] as const,
};
```

Mutations держи рядом с API модуля; после успеха используй `invalidateQueries`, `setQueryData` или optimistic update по сценарию. Не синхронизируй server data вручную через глобальный store.

### Validation и модели

Проверяй Zod-схемой API responses, forms, deep-link params, push payloads, WebSocket/AI responses, persisted data и external integrations. TypeScript interface не валидирует runtime.

DTO не равен domain entity:

```text
API DTO → runtime validation → mapper → application/domain model
```

Mapper преобразует snake_case, dates, status names и transport conventions в внутреннюю модель. Generated OpenAPI client/types отделяй от domain models и не редактируй вручную.

### Forms

Серьёзные формы: React Hook Form + Zod; schema — в `model`, component — в `ui`. Не храни форму целиком в Zustand, кроме multi-route wizard/draft, который должен пережить navigation.

## 4. Storage, offline, auth и navigation

- Expo SecureStore: refresh tokens, credentials, encryption keys, secure session data.
- Lightweight persistent storage: theme, language, currency, simple flags, onboarding completion.
- Expo SQLite: offline records, large datasets, indexed search, history, sync queue, structured entities.

Не храни тысячи объектов в SecureStore и не сохраняй secrets/PII в AsyncStorage, Zustand persist, logs, analytics или crash reports.

Offline-first при реальной потребности:

```text
UI → Local DB → Sync Engine/Queue → Backend
```

Глобальный `shared/sync` создавай только для нескольких domains; module-specific sync оставляй в соответствующем модуле. Обрабатывай retries, conflicts, idempotency, connectivity и queue state явно.

Auth — отдельный `modules/auth` с centralized session lifecycle. Credentials читает auth infrastructure/HTTP client, а не каждый endpoint. `(auth)` и `(app)` layouts выполняют routing guard, но backend остаётся security boundary и повторно проверяет authentication, authorization, roles, permissions и ownership.

## 5. Shared, providers, errors и cross-module flows

`shared/` содержит только универсальные infrastructure/UI/config/theme/types. Код, знающий `Transaction`, `Payment`, `Subscription`, `Budget`, остаётся в соответствующем модуле.

Shared UI: Button, Input, Text, Card, Modal, Sheet, Avatar, Loader, Screen, Divider, Badge. `TransactionCard`, `AccountBalance`, `BudgetProgress` — module UI.

Каждый модуль имеет `index.ts`; внешний код импортирует `@/modules/transactions`, а не внутренний путь. Направление:

```text
app → modules → shared
```

`shared → modules/app` и `module → app` запрещены. Cross-module access идёт только через public API. При множестве зависимостей проверь ownership, shared domain concept, orchestration layer или новый business module.

Cross-module use case размещай у владельца бизнес-сценария. `src/processes/` допустим лишь для реально крупных процессов вроде checkout/onboarding/account-recovery, а не заранее.

Providers централизуй в `src/providers/app-providers.tsx`; root layout остаётся простым. Большие contexts избегай.

Transport errors нормализуй в общий `AppError { code, message, status?, details? }` на API boundary. Экран не должен разбирать AxiosError/HTTP format. Domain errors отделяй от transport errors.

## 6. Mobile concerns

### Performance и media

Для больших списков предпочитай FlashList. Измеряй rerenders, unstable props, contexts, heavy render calculations, image sizes и JS-thread blocking; не разбрасывай `useMemo/useCallback` без измеренной причины.

Сложные gestures/animations изолируй в UI и реализуй через Reanimated. Подбирай Expo image component/cache strategy; не загружай original-resolution assets без необходимости, предусматривай placeholder/loading/error.

### Config, flags, logging, analytics

Env/API/features централизуй в типизированном `shared/config`; не читай `process.env.*` хаотично. Technical constants — `shared/constants`, domain constants — в domain владельца. Feature flags имеют централизованный typed interface.

Используй `shared/lib/logger` с уровнями и observability context; не оставляй production `console.log` и не логируй secrets/PII.

Product analytics events типизируй и централизуй (`shared/analytics` либо business `modules/analytics`). Не разбрасывай строковые event names по JSX.

Notifications как продукт — module; чистый transport — shared abstraction. Camera/location/notifications/bluetooth permissions запрашивай в ясном user flow: причина, timing, denied и permanently denied states.

Native integrations изолируй в `shared/native` или `modules/<domain>/native`; business logic не зависит напрямую от package, если его можно закрыть adapter-ом.

## 7. Testing, security и dependencies

```text
Domain rules/state transitions/calculations → unit tests
Hooks/components/module composition          → React Native Testing Library
Critical user flows                          → Maestro E2E
```

Приоритет: money rounding, status transitions, permissions, validation, transformations и critical journeys. Для payment тестируй pending→completed/cancelled, запрет completed→cancelled, negative amount, insufficient balance, fees и currency rounding.

Выбери colocated `*.test.ts` или `__tests__` и используй последовательно. Не гоняйся за 100% бессмысленного покрытия.

Перед библиотекой проверь совместимость с Expo SDK и New Architecture, поддержку проекта, наличие решения в текущем стеке и отсутствие дублирующей abstraction. Не добавляй dependency ради 20 строк.

Frontend не security boundary. Hidden button, Router guard, local role и Zustand permission не заменяют server authorization.

## 8. Алгоритмы и anti-patterns

### Новая feature

1. Определи business domain и существующий module.
2. Создай минимальные `api/model/hooks/ui/index.ts`.
3. При выявленной сложной логике добавь `domain/application`.
4. Создай тонкий route, импортирующий module screen через public API.
5. Проверь dependency direction и tests.

### Новый endpoint

1. Найди module.
2. Добавь DTO/runtime schema.
3. Добавь API method, query/mutation и centralized key.
4. Провалидируй response и при необходимости map DTO.
5. Отдай наружу module hook/public API; screen не вызывает API напрямую.

### Новое бизнес-правило

Размести чистую функцию в `domain`, используй из application/UI и покрой unit test. Не дублируй условие в JSX.

### Рефакторинг существующего проекта

Определи реальные domain boundaries, переноси один module за раз, сохраняй behavior, не смешивай structural migration с большим rewrite. После этапа запускай TypeScript, lint, tests и critical flow; удаляй старое только после переноса imports.

### Запрещённые patterns

- God Service (`AppService`, `DataService`), God Store (`useAppStore`) и God Hook (`useEverything`).
- Business calculations/permissions/transitions/validation в JSX или orchestration в огромном `useEffect`.
- Universal `utils.ts`, premature shared и premature abstractions.
- Circular module dependencies.
- Deep relative imports вместо aliases `@/app`, `@/modules`, `@/shared`, `@/providers`.
- Explicit import platform suffix (`foo.ios`) вместо Metro resolution.
- Огромный файл на 1500 строк или искусственная россыпь файлов по 3 строки.
- Barrel-файлы на каждом уровне: главный barrel — public module API.
- Необъяснимые имена `helper.ts`, `utils2.ts`, `manager.ts`, `misc.ts`.

Enforce boundaries через ESLint/guard, а не только память агента: shared не импортирует modules, modules не импортируют app, domain не импортирует React/Expo/API.

## 9. Definition of Done

- Определён правильный business module; код локально понятен при открытии его каталога.
- Route остаётся тонким; API/query keys/mutations принадлежат module.
- Server/client/local state и storage выбраны без дублирования source of truth.
- External data проходит runtime validation; DTO преобразуется mapper-ом.
- Сложная business logic вынесена из UI; domain не зависит от framework/infrastructure.
- Public API проходит через `index.ts`; deep imports и circular dependencies отсутствуют.
- Loading/success/empty/error/refreshing и permission-denied states обработаны.
- Critical business rules и user journeys протестированы.
- Новые abstractions добавлены только по фактической сложности.

Итоговая формула:

```text
Simple:  Route → Module UI → Hook → Query/API → Backend
Complex: Route → UI → Application → Domain ← Data/API → Backend
```
