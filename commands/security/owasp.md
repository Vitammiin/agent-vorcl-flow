---
description: OWASP Top 10 в коде — injection, XSS, broken auth, sensitive exposure, CORS, cookie-флаги в Node/React-проекте. Use when нужен аудит уязвимостей кода; секреты — /security:secrets, зависимости — /security:deps (security)
argument-hint: "[путь/область; по умолчанию весь репозиторий]"
allowed-tools: Read, Grep, Glob, Bash
---

Проведи аудит OWASP Top 10 (**read-only**): **$ARGUMENTS**.

1. **Injection:** конкатенация/интерполяция пользовательского ввода в SQL (`` `SELECT … ${ ``), NoSQL-операторы из req (`$where`, объект из `req.body` прямо в `find`), `exec`/`execSync`/`spawn` с shell-строкой из ввода, `eval`/`new Function`.
2. **XSS:** `dangerouslySetInnerHTML`, `innerHTML =`, `document.write`, рендер raw HTML из API без санации; `href` из данных без проверки схемы (`javascript:`).
3. **Broken auth:** роуты без auth-миддлвары (сверь список роутов с местами подключения guard), JWT с `algorithms: ['none']`/без проверки подписи/вечным сроком, пароли без хэша или со слабым (md5/sha1).
4. **Sensitive exposure:** секреты/токены/PII в `console.log`/логгере, стектрейсы и внутренние ошибки в HTTP-ответах, приватные поля в сериализации без allowlist.
5. **CORS и cookie:** `origin: '*'` вместе с `credentials: true`, отражение `req.headers.origin` без allowlist; cookie без `httpOnly`/`secure`/`sameSite`; отсутствие `helmet`/security-заголовков.
6. Каждая находка: `file:line` + цитата, категория OWASP, severity, конкретная починка. Проверяй контекст — валидация может жить слоем выше, не репорти вслепую.

Пустой **$ARGUMENTS** — весь репозиторий, фронт и бэк раздельно. Ничего не правь: значимые находки — в `add_task` на `backend`/`frontend`.

Опирайся на навыки `security-audit`, `error-handling`, `backend-architecture`, `frontend-architecture`. Делегируй субагенту `security`.
