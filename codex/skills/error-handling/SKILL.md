---
name: error-handling
description: Грамотное покрытие кода обработкой ошибок (try/catch/finally) и структурным логированием без «тихих» падений. Границы try/catch, нормализация (typed errors, cause, unknown в catch), async/finally/ретраи/таймауты; логи — уровни, контекст, лог один раз, без секретов/PII. Use при добавлении/ревью error handling и логирования.
---

# Навык: Error Handling & Logging

Надёжный код без «тихих» падений и с грамотной расстановкой логов.

## try/catch — на границах
Ставь на границах, где ошибка ожидаема (I/O, внешние API, `JSON.parse`/zod, транзакции, cleanup). Не оборачивай всё; программные баги — до глобального обработчика. Не дублируй обработку между слоями.

## Без «тихих» падений
Пустой `catch {}` запрещён — в catch: обработать + лог, пробросить (`throw new AppError(msg, { cause })`), либо преобразовать в доменную ошибку. В прикладном коде бросай только `Error`/наследники (фреймворковый throw для control-flow — Next `redirect()`/`notFound()` — не трогай и не проглатывай без re-throw). `cause` — **ссылка** на исходную ошибку (логгер должен разворачивать цепочку; `console.log` без `util.inspect` — нет). В TS `catch (e: unknown)` — сузь тип.

## Нормализация
Доменные классы (`code`/`httpStatus`/`context`), operational (4xx) vs programmer (5xx). Наружу — единый error-handler (Fastify `setErrorHandler`, Next `error.tsx`) с безопасным телом; валидация входа (zod) → 400. **i18n:** наружу — стабильный машинный `code` (+ параметры), человекочитаемый текст локализуй на границе по локали запроса; логи не локализуй (`$i18n`).

## Async / ресурсы / ретраи
`await` в try; cleanup в `finally`; `Promise.allSettled` где важны все результаты; process-хендлеры `unhandledRejection`/`uncaughtException` → лог + **graceful shutdown и `exit 1`** (не продолжать работу). Внешние вызовы — таймаут (`AbortSignal.timeout`); ретрай только на **транзиентных** ошибках (сеть/таймаут/`5xx`/`429`) с бэкоффом + jitter, мутации — лишь при идемпотентности по эффекту (idempotency key).

## Логи грамотно
Структурные (pino/JSON), уровни `error`/`warn`/`info`/`debug`. **Лог один раз** — на границе обработки (пробрасываешь — не логируй). Поля: операция, ключевые id, `requestId`, ошибка целиком (`stack`+`cause`). Никогда — секреты/PII/токены; на горячих путях сэмплируй. Логи не для управления потоком.

## Фронт / бэк
React — error boundary ловит только ошибки рендера/жизненного цикла (НЕ event handlers/async/SSR); ошибки хендлеров/данных — `try/catch` + состояние `error` у react-query + `onunhandledrejection` (не пустой экран/стек пользователю). Next App Router — `error.tsx` (сегмент) + `global-error.tsx` (корневой layout). Node — `setErrorHandler`, graceful shutdown.

## Анти-паттерны
`catch {}` / `catch { console.log }` без проброса; `catch → null`; `throw 'строка'`; потеря `cause`; двойное логирование; лог секретов; `try` вокруг небросающего кода; необработанные промис-реджекты.
