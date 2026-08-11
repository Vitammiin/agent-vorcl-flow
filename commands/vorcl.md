---
description: Универсальная точка входа в Task Master workflow — превращает цель в задачи и ведёт цикл до готового. Use when есть цель/фича/багфикс любого домена и нужен полный цикл «цель → задачи → реализация → проверка → done» с делегированием нужным субагентам.
argument-hint: "<цель / objective>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Возьми цель в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Преврати цель в задачи: крупная фича — оформи/дополни PRD в `.taskmaster/docs/prd.txt` и запусти `parse_prd`; точечная — `add_task`.
3. `next_task` → `get_task`; при высокой сложности — `expand_task` (после `analyze_project_complexity`).
4. Реализуй текущую задачу, фиксируя ход через `update_subtask`.
5. Проверь `testStrategy`; при успехе — `set_task_status --status=done`; вернись к шагу 3, пока есть задачи.

Опирайся на навыки `workflow`, `task-master`. Оркестрацию цикла веди сам, а реализацию каждой задачи делегируй субагенту по домену:

| Домен задачи | Субагент |
| --- | --- |
| Архитектура, выбор технологий, system design | `architect` |
| API, серверная логика, Node.js/TypeScript | `backend` |
| UI, React/Next.js, состояние, загрузка данных | `frontend` |
| React Native + Expo: routes, screens, modules, state, storage, native | `expo-mobile` |
| Аудит кода без правок (баги, типы, mockup, БД) | `analyzer` |
| Покрытие OpenAPI/Swagger | `swagger` |
| Веб-ресёрч, сбор данных с сайтов | `firecrawl` |
| Хостинг/деплой/логи на Render | `render` |
| Схема БД, запросы, миграции, кэш (Postgres/Mongo/Redis) | `database` |
| Обработка ошибок, try/catch, логирование | `resilience` |
| Скриншот UI → новый код | `screenshot` |
| Скриншот → место в существующем коде (read-only) | `pinpoint` |
| Диаграммы draw.io (сложная раскладка, PMP/PMBOK) | `drawio` |
| Карта архитектуры по коду (architecture.json, ERD, интерактивный HTML) | `archmap` |
| Диаграммы Mermaid (в git/README, с рендер-проверкой) | `mermaid` |
| Тесты (unit/integration/e2e), верификация testStrategy | `testing` |
| Коммиты, PR, changelog, релизы, git-гигиена | `gitflow` |
| Аудит безопасности: секреты, OWASP, CVE, PII (read-only) | `security` |
| Документация: README, API-доки, ARCHITECTURE | `docs` |
| Docker, docker-compose, CI/CD (GitHub Actions) | `devops` |

Задача может пройти через нескольких субагентов (например, `architect` → `backend` → `swagger` → `testing` → `gitflow`). Если домен неочевиден — начни с `architect` (анализ), а не гадай.
