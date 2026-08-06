---
name: testing-e2e
description: Playwright e2e-сценарии критического пути — селекторы по ролям, fixtures/auth-state, web-first assertions, trace при падении (роль testing). Use when нужно проверить пользовательский сценарий в реальном браузере.
---

# Задача: Playwright e2e-сценарии

Напиши e2e-тесты критического пути (см. `$e2e-playwright`, `$testing-strategy`).

1. Проверь `playwright.config.*`; нет — согласуй `npm init playwright@latest`, настрой `webServer`.
2. Сценарий — шагами пользователя (вход → действие → видимый результат); не дублируй unit/integration.
3. Селекторы: `getByRole` (с `name`) > `getByLabel`/`getByPlaceholder` > `getByTestId` > CSS.
4. Auth — fixture/`storageState` (логин один раз в setup-проекте), не через UI в каждом тесте.
5. Только web-first assertions (`toBeVisible`/`toHaveText`); НИКАКИХ `waitForTimeout`/sleep. Включи `trace: 'on-first-retry'`, `screenshot: 'only-on-failure'`.
6. Прогони `npx playwright test` и вставь вывод; при падении — `show-trace`, чини первопричину. Приложение не поднимается — сначала почини запуск.
