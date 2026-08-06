---
name: e2e-playwright
description: E2E на Playwright — селекторы (getByRole > testid > css), fixtures/auth-state (storageState), web-first assertions без sleep, trace/screenshot при падении, параллельность/шардинг, CI-конфиг, Page Object. Use при написании, ревью или стабилизации браузерных e2e-тестов.
---

# Навык: Playwright E2E

E2E — только **критический путь пользователя** в реальном браузере; не дублируй unit/integration.

## Селекторы (по убыванию)
`getByRole('button', { name: … })` (как видит пользователь, заодно a11y) > `getByLabel`/`getByPlaceholder`/`getByText` > `getByTestId` (нет роли/текст нестабилен) > CSS/XPath (последний резерв).

## Ожидания
Только web-first assertions: `await expect(locator).toBeVisible()/toHaveText()/toHaveURL()` — авто-ретраятся. НИКАКИХ `waitForTimeout`/sleep (главный источник flaky). Действия (`click`/`fill`) сами ждут actionability — не оборачивай ручными wait.

## Auth
Логин один раз в setup-проекте → `page.context().storageState({ path: 'playwright/.auth/user.json' })`; рабочие проекты подключают его через `use.storageState` + `dependencies: ['setup']`. Роли пользователей — отдельные state-файлы + fixtures. Не логинься через UI в каждом тесте.

## Диагностика
`use: { trace: 'on-first-retry', screenshot: 'only-on-failure', video: 'retain-on-failure' }`; смотреть `npx playwright show-trace` / `show-report` (таймлайн, DOM-снапшоты, сеть, консоль). Чини первопричину по trace, не селектор наугад.

## Параллельность / CI
Файлы — параллельно (`workers`), каждый тест независим (свои данные, лучше API-сиды); `fullyParallel` — только при полной изоляции. Шардинг: `--shard=1/4` … + `merge-reports`. CI-минимум: `forbidOnly: !!CI`, `retries: CI ? 1 : 0` (retry — телеметрия flaky, не лекарство), `webServer` для автоподъёма приложения.

## Page Object
Выноси в класс страницы повторяющиеся локаторы + действия; assertions — в тестах. Не строй POM на 3 теста — часто хватает fixtures.
