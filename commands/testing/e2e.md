---
description: Playwright e2e-сценарии критического пути — селекторы по ролям, fixtures/auth-state, web-first assertions, trace при падении (testing). Use when нужно проверить пользовательский сценарий в реальном браузере.
argument-hint: "<сценарий/критический путь> [URL]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Напиши Playwright e2e-тесты для сценария: **$ARGUMENTS**.

1. Проверь `playwright.config.*`; нет — согласуй `npm init playwright@latest` и настрой `webServer` для автоподъёма приложения.
2. Опиши сценарий шагами пользователя (критический путь: вход → действие → видимый результат); не гоняй через e2e то, что покрывается unit/integration.
3. Селекторы: `getByRole` (с `name`) > `getByLabel`/`getByPlaceholder` > `getByTestId` > CSS — в последнюю очередь.
4. Аутентификация — через fixture/`storageState` (логин один раз в setup-проекте), не через UI в каждом тесте.
5. Ожидания только web-first: `await expect(locator).toBeVisible()/toHaveText()`; НИКАКИХ `waitForTimeout`/sleep.
6. В конфиге включи `trace: 'on-first-retry'` и `screenshot: 'only-on-failure'`.
7. Прогони: `npx playwright test` — вставь вывод в ответ; при падении открой trace (`npx playwright show-trace`) и чини первопричину, не селектор наугад.

Край: пустой $ARGUMENTS — спроси сценарий; приложение не поднимается — сначала почини запуск, не пиши тесты «вслепую».

Опирайся на навыки `e2e-playwright`, `testing-strategy`. Делегируй субагенту `testing`.
