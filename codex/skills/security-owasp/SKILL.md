---
name: security-owasp
description: OWASP Top 10 в коде — injection, XSS, broken auth, sensitive exposure, CORS, cookie-флаги в Node/React (роль security, read-only). Use для аудита уязвимостей кода.
---

# Задача: аудит OWASP Top 10

Проведи аудит OWASP Top 10 (**read-only**) по указанной области; без области — весь репозиторий, фронт и бэк раздельно (grep-паттерны — `$security-audit`).

1. **Injection:** интерполяция ввода в SQL, объект из `req.body` в Mongo `find`, `exec`/`spawn` с shell-строкой, `eval`.
2. **XSS:** `dangerouslySetInnerHTML`, `innerHTML =`, `document.write`, `href` из данных без проверки схемы.
3. **Broken auth:** роуты без guard-миддлвары, JWT без `expiresIn`/с `none`, слабые хэши паролей.
4. **Sensitive exposure:** секреты/PII в логах, стектрейсы в HTTP-ответах, сериализация без allowlist (см. `$error-handling`).
5. **CORS/cookie:** `origin: '*'` + credentials, отражение `req.headers.origin`; cookie без `httpOnly`/`secure`/`sameSite`; нет `helmet`.

Каждая находка: `file:line` + цитата, категория, severity, конкретная починка. Проверяй контекст (валидация может жить слоем выше — `$backend-architecture`/`$frontend-architecture`). Ничего не правь; значимое — `add_task` на `$backend`/`$frontend`.
