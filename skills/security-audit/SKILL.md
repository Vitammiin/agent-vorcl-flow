---
name: security-audit
description: Практический security-аудит Node/React — OWASP Top 10 с grep-паттернами и точками поиска, разбор npm audit (severity, false positives, overrides), чек-лист заголовков/CORS/cookie, severity-шкала и принципы доказательного отчёта. Use для аудита уязвимостей кода, проверки зависимостей на CVE и оформления security-findings.
version: 1.0.0
---

# Навык: Security-аудит Node/React

Ключевой принцип: **finding без доказательства — не finding**. Каждая позиция отчёта привязана к `file:line`/коммиту и подтверждена цитатой или выводом команды. Аудит — read-only; фиксы применяют исполнители.

## 1. OWASP Top 10 практично (Node/React)
| Категория | Где искать | Grep-паттерн (rg) | Пример фикса |
|---|---|---|---|
| SQL injection | репозитории/сервисы, raw-запросы | `` `.*(SELECT|INSERT|UPDATE|DELETE).*\$\{`` | параметризованные запросы (`$1`/`?`), query builder |
| NoSQL injection | Mongo `find`/`update` c данными из req | `find\(\s*req\.(body|query)` · `\$where` | схема-валидация ввода (zod), явный allowlist полей |
| Command injection | скрипты, обёртки CLI | `exec(Sync)?\(` · `spawn\(.*sh` · `eval\(` | `execFile`/`spawn` с массивом аргументов, без shell |
| XSS | React-компоненты, шаблоны | `dangerouslySetInnerHTML` · `innerHTML\s*=` · `document\.write` | санация (DOMPurify) или рендер текстом; `href` — проверка схемы |
| Broken auth | роуты vs auth-миддлвары | `router\.(get|post|put|delete)` без guard рядом | guard на уровне роутера/модуля, deny-by-default |
| Слабый JWT | конфиг auth | `algorithms.*none` · `jwt\.sign` без `expiresIn` | RS256/HS256 явно, короткий TTL + refresh |
| Sensitive exposure | логгер, error-хендлеры, сериализация | `console\.log\(.*(req\.body|user|token|password)` | allowlist-сериализация, фильтр полей в логгере |
| Path traversal | файловые эндпоинты | `readFile.*req\.` · `path\.join\(.*req\.` | `path.resolve` + проверка префикса корня |
| SSRF | серверный fetch по URL из ввода | `fetch\(\s*req\.` · `axios\(\s*req\.` | allowlist хостов, запрет приватных диапазонов |
| Открытый redirect | `res.redirect` из ввода | `redirect\(\s*req\.` | allowlist путей/относительные URL |

Проверяй контекст перед репортом: валидация может жить слоем выше (граница модуля) — сверься со скиллами `backend-architecture`/`frontend-architecture`.

## 2. Разбор `npm audit`
```bash
npm audit --json          # машиночитаемо; pnpm audit / yarn npm audit — по lock-файлу
npm ls <pkg>              # прямой или транзитивный путь
```
- **Severity advisory ≠ severity для проекта.** Уточняй: dev-only зависимость (`devDependencies`, не попадает в прод) или недостижимый уязвимый путь → вероятный false positive, помечай отдельно.
- **Фиксы по нарастанию:** патч в диапазоне (`npm audit fix`) → minor/major bump (major = ломающее, отдельная задача + changelog) → `overrides` в `package.json` для транзитивных без фикса (временная мера, фиксируй TODO на снятие).
- Реестр недоступен — честно репортуй «CVE-проверка не выполнена», без прогона «уязвимостей нет» не бывает.

## 3. Чек-лист заголовков / CORS / cookie
| Проверка | Красный флаг | Норма |
|---|---|---|
| CORS origin | `origin: '*'` при `credentials: true`; отражение `req.headers.origin` | явный allowlist origin'ов |
| Cookie сессии | нет `httpOnly` / `secure` / `sameSite` | `httpOnly: true, secure: true, sameSite: 'lax'` (или `strict`) |
| Security-заголовки | нет `helmet`/аналога | `helmet()` в цепочке миддлвар; CSP хотя бы report-only |
| Ошибки наружу | стектрейс/`err.message` БД в HTTP-ответе | generic-ответ + подробность в лог (см. `error-handling`) |
| Rate limiting | login/reset без лимита | rate limiter на auth-эндпоинтах |
| `x-powered-by` | выдаёт Express | `app.disable('x-powered-by')` (helmet делает сам) |

## 4. Severity-шкала
| Уровень | Критерий | Примеры |
|---|---|---|
| **critical** | эксплуатация тривиальна, ущерб максимален | реальный секрет в коде/истории; SQL/command injection на публичном эндпоинте |
| **high** | эксплуатация реальна, нужны условия | XSS с данными пользователей; роут без auth; CVE high с достижимым путём |
| **medium** | нужен доступ/стечение условий | слабые cookie-флаги; PII в логах; CORS-отражение |
| **low** | hardening, прямой эксплуатации нет | нет CSP; `x-powered-by`; dev-only CVE |

## 5. Принципы отчёта
- **Доказательство обязательно:** цитата строки + `file:line` (или коммит), вывод команды (`npm audit`, `rg`). Без него — не репортим.
- **No false confidence:** вердикт «чисто» — только со списком прогнанных проверок (паттерны, области, глубина истории) и явным перечнем непроверенного.
- **Ложные срабатывания — фильтруй до отчёта:** проверь контекст строки; сомнительное — в отдельную секцию «требует проверки», не в findings.
- **Finding → задача:** значимое оформляй в Task Master (`add_task`: суть, severity, доказательство, починка, исполнитель `backend`/`frontend`/`gitflow`).
