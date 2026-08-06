---
name: security-audit
description: Практический security-аудит Node/React — OWASP Top 10 с grep-паттернами и точками поиска, разбор npm audit (severity, false positives, overrides), чек-лист заголовков/CORS/cookie, severity-шкала и доказательный отчёт. Use для аудита уязвимостей кода и CVE в зависимостях.
---

# Навык: Security-аудит Node/React

Finding без доказательства — не finding: каждая позиция привязана к `file:line`/коммиту и подтверждена цитатой или выводом команды. Аудит — read-only.

## OWASP Top 10 практично
- **SQL/NoSQL injection:** `` `.*(SELECT|INSERT).*\$\{`` ; `find\(\s*req\.(body|query)`, `\$where` → параметризация/zod-валидация, allowlist полей.
- **Command injection:** `exec(Sync)?\(`, `spawn` с shell-строкой, `eval\(` → `execFile` с массивом аргументов.
- **XSS:** `dangerouslySetInnerHTML`, `innerHTML\s*=`, `document.write`, `href` из данных → санация (DOMPurify)/рендер текстом.
- **Broken auth:** роуты без guard-миддлвары (сверь список роутов с подключениями), `jwt.sign` без `expiresIn`, `algorithms: ['none']`, md5/sha1 для паролей.
- **Sensitive exposure:** `console.log(req.body|user|token)`, стектрейсы в HTTP-ответах, сериализация без allowlist (см. `$error-handling`).
- **Path traversal / SSRF / redirect:** `readFile`/`path.join`/`fetch`/`redirect` с `req.*` → проверка префикса корня, allowlist хостов/путей.
Контекст прежде репорта: валидация может жить слоем выше — сверься с `$backend-architecture`/`$frontend-architecture`.

## Разбор `npm audit`
`npm audit --json` (или pnpm/yarn по lock-файлу); `npm ls <pkg>` — путь зависимости. Severity advisory ≠ severity проекта: dev-only и недостижимый путь → вероятный false positive, помечай отдельно. Фиксы: `npm audit fix` → minor/major bump (major = ломающее, отдельная задача) → `overrides` для транзитивных без фикса (временно). Реестр недоступен — репортуй «CVE-проверка не выполнена», не «уязвимостей нет».

## Чек-лист заголовков / CORS / cookie
`origin: '*'` + `credentials: true` или отражение `req.headers.origin` — красный флаг (нужен allowlist); cookie сессии без `httpOnly`/`secure`/`sameSite`; нет `helmet`/CSP; стектрейс наружу; auth-эндпоинты без rate limit; `x-powered-by` не отключён.

## Severity-шкала
**critical** — тривиальная эксплуатация, максимальный ущерб (секрет в коде/истории, injection на публичном эндпоинте); **high** — реальная эксплуатация (XSS, роут без auth, достижимая CVE high); **medium** — нужны условия (cookie-флаги, PII в логах, CORS-отражение); **low** — hardening (CSP, `x-powered-by`, dev-only CVE).

## Принципы отчёта
Доказательство обязательно; вердикт «чисто» — только со списком прогнанных проверок и непроверенного; ложные срабатывания фильтруй до отчёта (сомнительное — «требует проверки»); значимое → `add_task` с исполнителем.
