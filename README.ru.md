<div align="center">

# Agent-Vorcl-Flow

**Команда специализированных AI-субагентов для [Claude Code](https://claude.com/claude-code) — со скиллами, слэш-командами и MCP-инструментами.**
Ставится одной командой `npx`. Без бэкенда и хостинга — всё исполняет Claude Code. В комплекте адаптер под **GPT Codex**.

🌐 [English version](./README.md)

</div>

---

## Что это

Agent-Vorcl-Flow превращает Claude Code в **структурированную инженерную команду**. Вместо одного универсального ассистента ты получаешь **13 узкопрофильных субагентов** (архитектор, бэкенд, фронтенд, инженер БД, аудитор кода и другие) — у каждого свои доменные **скиллы**, быстрые **слэш-команды** и нужные ему **MCP-инструменты**. Любая нетривиальная задача идёт через дисциплинированный цикл **Task Master** — *цель → задачи → реализация → проверка → готово* — работа спланирована, отслеживается и переживает прерывания.

- 🧩 **13 субагентов**, 30 скиллов, 67 слэш-команд
- ⚡ **Установка одной командой** в Claude Code и/или Codex — `npx`
- 🔌 **11 MCP-серверов** из коробки (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, filesystem, Task Master, Mermaid)
- 🔑 **Свои ключи** через переменные окружения — плагин ничего не хостит
- 🤝 **Работает в Claude Code и GPT Codex** из одного исходника

---

## Быстрый старт

### Требования
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)** и/или **[GPT Codex](https://developers.openai.com/codex/cli/)** CLI установлен и доступен в `PATH`

### Установка (одна команда)

```bash
# Ставит в Claude Code И/ИЛИ Codex — в то, что найдёт в PATH:
npx github:Vitammiin/agent-vorcl-flow
```

Один конкретный рантайм — флагом:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # только Claude Code
npx github:Vitammiin/agent-vorcl-flow --codex    # только GPT Codex
```

Что делает инсталлер:

| Рантайм | Действие |
| --- | --- |
| **Claude Code** | Регистрирует репозиторий как **marketplace** плагинов и включает плагин (через `claude plugin …`, фолбэк — прямая запись в `~/.claude/settings.json`). |
| **GPT Codex** | Вмёрживает скиллы в `~/.agents/skills`, а блоки `config.toml` + `AGENTS.md` — в `~/.codex` (идемпотентно, между маркерами). |

> Инсталлер не трогает секреты — ключи задаёшь сам через env (см. [MCP и секреты](#mcp-и-секреты)).

### Альтернативные способы (Claude Code)

```bash
# Только на текущую сессию (удобно попробовать):
claude --plugin-dir /путь/к/agent-vorcl-flow

# Или постоянно через локальный маркетплейс:
/plugin marketplace add /путь/к/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

После установки **перезапусти Claude Code** (или выполни `/reload-plugins` в открытой сессии), чтобы агенты подхватились.

---

## Как пользоваться

Есть **три способа** позвать команду. Выбирай любой.

### 1. Универсальная точка входа — просто сформулируй цель
```text
/vorcl добавить корзину в чекаут
```
`/vorcl` сам определяет, какому субагенту отдать работу, и ведёт полный цикл Task Master.

### 2. Обратиться к конкретному субагенту
```text
@agent-vorcl-flow:architect  спроектируй биллинг для SaaS
@agent-vorcl-flow:backend    добавь эндпоинт POST /invoices
```

### 3. Запустить конкретную слэш-команду
```text
/backend:create-api   POST /invoices
/analyzer:audit       src/
/screenshot:convert   ./mockups/dashboard.png  react
```

У каждого агента есть и своя точка входа `/<agent>:vorcl` — цикл Task Master в рамках этого агента.

### Цикл Task Master
Любая нетривиальная задача идёт через **Task Master** (`task-master-ai`, MCP-сервер `task-master`):

```text
цель → задачи (parse_prd / add_task) → next_task → get_task → expand_task
     → реализация → проверка (testStrategy) → set_task_status done
```

Работа спланирована, чекпойнтится и возобновляема — ничего не объявляется «готовым» без прохождения проверки. Дисциплину задаёт скилл `workflow`, справочник команд — скилл `task-master`.

---

## Агенты

| Агент | Роль | Что умеет |
| --- | --- | --- |
| 🔵 **architect** | Архитектор систем и решений | Анализ требований, проектирование системы/БД/API, ревью архитектуры |
| 🟢 **backend** | Backend-разработчик | Node/TS, Postgres, Redis; модульная архитектура; каждый роут полностью покрыт OpenAPI |
| 🟣 **frontend** | Frontend (React 19 / Next.js App Router) | Компоненты, состояние, data-fetching, оптимизация рендера/бандла, тесты |
| 🟠 **analyzer** | Аудитор кода (read-only) | Баги, типобезопасность, структура БД, моки на фронте, «плохой» код на бэке |
| 🟡 **swagger** | Покрытие OpenAPI/Swagger (любой стек) | Находит недокументированные роуты и покрывает их, с проверкой |
| 🔴 **firecrawl** | Веб-исследователь | Поиск, скрейп, карта сайта, обход, структурированное извлечение — LLM-ready |
| 🟤 **render** | Хостинг и деплой (Render) | Деплои, диагностика по логам, метрики, env-переменные, Render Postgres |
| 🟦 **database** | Инженер БД / DBA | Схема, запросы и планы, индексы, N+1, безопасные обратимые миграции, кэш |
| ⚪ **resilience** | Надёжность: ошибки + логи | try/catch на нужных границах, типизированные ошибки, ретраи/таймауты, структурные логи |
| 🖼️ **screenshot** | Скриншот UI → код | Превращает скриншот интерфейса в production-ready, адаптивный, доступный код |
| 🎯 **pinpoint** | Скриншот → место в существующем проекте (read-only) | Привязывает скриншот работающего приложения к реальному коду — компонент, `file:line`, маршрут/страница, конкретный контрол и логика за ним; ничего не создаёт, правку делегирует |
| 📊 **drawio** | Диаграммы (draw.io / diagrams.net) | Flowchart, BPMN, UML, ERD, network/cloud и PMP/PMBOK (WBS, Gantt, RACI…) |
| 🧜 **mermaid** | Mermaid-диаграммы (+ реальный рендер) | flowchart, sequence, class, state, ER, gantt, gitGraph, mindmap…; валидация через mcp-mermaid/`mmdc`; отдаёт готовый файл (`.mmd` + SVG/PNG/PDF) |

**Что стоит знать:**
- **Фронт всегда ходит в реальный API.** Источник истины — OpenAPI-спека бэка; типы генерируются из неё (`openapi-typescript` + `openapi-fetch`). Моков в прод-пути нет.
- **Мутации `database` — только с явным подтверждением.** Аналитика read-only; изменения схемы/данных (DDL/DML/миграции) без твоего «да» не выполняются. Миграции — безопасные и обратимые (expand → backfill → contract).
- **`resilience` ставит защитный хук.** Неблокирующий `PostToolUse`-хук (`catch-guard.js`) мягко подсвечивает пустые `catch {}` в только что отредактированных файлах.
- **`pinpoint` находит, а не создаёт.** По скриншоту работающего приложения строит карту «скриншот → исходники» — компонент, маршрут, конкретный контрол и логика за ним — и передаёт правку `frontend`/`backend`. Работает с тем, что уже есть (обратная задача к `screenshot`). В мультиязычном проекте помнит: текст на экране — **значение перевода**, в коде лежит **ключ** (`t('...')`), — и грепает по обоим.
- **`render` помнит про инфраструктурные детали.** Доступ к БД по IP-allowlist (outbound-IP сервиса → allowlist базы; для Render Postgres — internal URL), диагностика по логам до первопричины.
- **Диаграммы — как файлы-артефакты.** `mermaid` проверяет каждую диаграмму реальным рендером и отдаёт `.mmd` + SVG/PNG/PDF в твоём каталоге; `drawio` отдаёт валидный XML — открывается в app.diagrams.net.
- **Скилл `i18n` — «ноль языкового хардкода».** Агенты сначала определяют, мультиязычен ли проект, и адаптируются — пользовательские строки идут через слой перевода (next-intl / react-i18next / i18next), не инлайном.

---

## Справочник команд

Все команды ниже — слэш-команды. `<…>` — твой ввод.

### `/vorcl` — универсальный роутер
| Команда | Что делает |
| --- | --- |
| `/vorcl <цель>` | Превращает любую цель в задачи, роутит нужному субагенту и ведёт полный цикл до готового. |

### 🔵 architect — архитектура
| Команда | Что делает |
| --- | --- |
| `/architect:vorcl <цель>` | Цель → задачи → цикл в рамках архитектуры. |
| `/architect:analyze <контекст>` | Анализ требований и контекста задачи. |
| `/architect:design <проблема>` | Проектирование архитектуры решения (система, БД, API). |
| `/architect:review <цель>` | Ревью существующей архитектуры. |

### 🟢 backend — сервер (Node/TS, Postgres, Redis)
| Команда | Что делает |
| --- | --- |
| `/backend:vorcl <цель>` | Цель → задачи → цикл для бэкенд-работы. |
| `/backend:create-api <эндпоинт>` | Генерация API-эндпоинта на модульной архитектуре, полностью покрытого OpenAPI. |
| `/backend:refactor <цель>` | Рефакторинг кода без изменения поведения. |
| `/backend:optimize <цель>` | Оптимизация производительности. |
| `/backend:test <цель>` | Генерация тестов для кода. |

### 🟣 frontend — React / Next.js
| Команда | Что делает |
| --- | --- |
| `/frontend:vorcl <цель>` | Цель → задачи → цикл для фронтенд-работы. |
| `/frontend:create-component <спека>` | Генерация UI-компонента по feature-структуре. |
| `/frontend:refactor <цель>` | Рефакторинг UI / хуков без изменения поведения. |
| `/frontend:optimize <цель>` | Оптимизация рендера / бандла / Core Web Vitals. |
| `/frontend:test <цель>` | Генерация тестов компонентов. |

### 🟠 analyzer — аудит кода (read-only)
| Команда | Что делает |
| --- | --- |
| `/analyzer:vorcl <цель>` | Аудит цели через Task Master — находки становятся задачами. |
| `/analyzer:audit` | Полный аудит: баги, типы, БД, моки на фронте, «плохой» код на бэке. |
| `/analyzer:bugs` | Охота на баги — необработанные ошибки, race conditions, edge cases. |
| `/analyzer:types` | Проверка типов — `tsc`, `any`, небезопасные касты, рассинхрон zod↔типы. |
| `/analyzer:db` | Аудит структуры БД — схема, индексы, FK, N+1, миграции. |
| `/analyzer:mocks` | Поиск mockup / фейковых данных на фронтенде. |
| `/analyzer:backend` | Поиск «плохого» кода на бэке — нарушения архитектуры, логика в контроллерах. |

### 🟡 swagger — покрытие OpenAPI/Swagger (любой стек)
| Команда | Что делает |
| --- | --- |
| `/swagger:vorcl <цель>` | Полное покрытие через Task Master — аудит → задачи → покрытие → проверка. |
| `/swagger:audit` | Read-only: найти роуты, не полностью покрытые спекой. |
| `/swagger:cover <роут>` | Покрыть роут/модуль — параметры, ответы, описания, security + проверка. |

### 🔴 firecrawl — веб-ресёрч
| Команда | Что делает |
| --- | --- |
| `/firecrawl:vorcl <цель>` | Ресёрч-цель через Task Master — сбор данных из веба до готового результата. |
| `/firecrawl:search <запрос>` | Веб-поиск источников по вопросу. |
| `/firecrawl:scrape <url>` | Скрейп одного URL в markdown/JSON. |
| `/firecrawl:map <url>` | Карта URL сайта. |
| `/firecrawl:crawl <url>` | Рекурсивный обход раздела/сайта. |
| `/firecrawl:extract <url>` | Структурированное извлечение по JSON-схеме. |

### 🟤 render — хостинг / деплой (Render)
| Команда | Что делает |
| --- | --- |
| `/render:vorcl <цель>` | Инфра-цель через Task Master — деплой/диагностика/настройка до готового. |
| `/render:deploy <сервис>` | Деплой / редеплой сервиса. |
| `/render:logs <сервис>` | Логи сервиса и диагностика до первопричины. |
| `/render:status <сервис>` | Статус сервиса + деплой + метрики. |
| `/render:query <sql>` | Read-only SQL по Render Postgres. |

### 🟦 database — инженер БД / DBA (Postgres / MongoDB / Redis)
| Команда | Что делает |
| --- | --- |
| `/database:vorcl <цель>` | Цель по данным через Task Master — схема/запросы/миграции/кэш до готового. |
| `/database:query <запрос>` | Read-only запрос / аналитика. |
| `/database:schema <цель>` | Проектирование / ревью схемы и целостности данных. |
| `/database:migrate <изменение>` | План безопасной обратимой миграции схемы/данных. |
| `/database:optimize <цель>` | Оптимизация — индексы, N+1, планы запросов, пагинация. |
| `/database:cache <цель>` | Redis — TTL, инвалидация, lock, rate limiting, Streams. |

### ⚪ resilience — обработка ошибок + логирование
| Команда | Что делает |
| --- | --- |
| `/resilience:vorcl <цель>` | Цель по надёжности через Task Master — покрыть код try/catch + логами. |
| `/resilience:harden <цель>` | Обернуть код в try/catch/finally с грамотными логами, без «тихих» падений. |
| `/resilience:logging <цель>` | Расставить/выправить структурное логирование — уровни, контекст, без секретов/PII. |
| `/resilience:audit` | Read-only: найти «тихие» падения, пустые catch, дыры в логах. |

### 🖼️ screenshot — скриншот UI → код
| Команда | Что делает |
| --- | --- |
| `/screenshot:vorcl <цель>` | Набор экранов из скриншотов через Task Master — разбор → код. |
| `/screenshot:analyze <изображение>` | Read-only разбор — layout, компоненты, токены, состояния → план. |
| `/screenshot:convert <изображение> [фреймворк]` | Полный запускаемый код по скриншоту (по умолчанию React + Tailwind v4). |
| `/screenshot:tokens <изображение>` | Извлечь дизайн-токены (цвета OKLCH, типографика, spacing) в Tailwind `@theme`. |
| `/screenshot:responsive <цель>` | Довести сгенерированный UI до адаптивности — брейкпоинты, fluid, `clamp()`, container queries. |

### 🎯 pinpoint — скриншот → место в существующем проекте (read-only)
| Команда | Что делает |
| --- | --- |
| `/pinpoint:vorcl <цель>` | Найти/понять/изменить существующий UI по скриншоту через Task Master — карта → задачи → делегирование. |
| `/pinpoint:locate <изображение>` | Найти существующие компонент/файл(ы) по скриншоту — `file:line`, без нового кода. |
| `/pinpoint:route <изображение>` | Определить маршрут/страницу, на которой открыт экран (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <изображение>` | Определить конкретный контрол (кнопку/поле) и его обработчик в коде. |
| `/pinpoint:trace <цель>` | Проследить логику за элементом — обработчик → состояние → data-fetch → API. |
| `/pinpoint:handoff <правка>` | Собрать точную заявку на правку существующего кода и делегировать `frontend`/`backend`. |

### 📊 drawio — диаграммы (draw.io / diagrams.net)
| Команда | Что делает |
| --- | --- |
| `/drawio:vorcl <цель>` | Набор диаграмм через Task Master — построение до готового. |
| `/drawio:create <описание> [тип]` | Диаграмма по текстовому описанию (валидный нативный XML). |
| `/drawio:pmp <тип> <проект>` | Диаграмма PMP/PMBOK — WBS, PERT/CPM, Gantt, RACI, risk matrix, stakeholder grid. |
| `/drawio:convert <исходник> [тип]` | Конвертация исходника — схема БД → ERD, папки → дерево, код → UML, mermaid/CSV/JSON. |
| `/drawio:refine <файл>` | Доработка существующего `.drawio` — раскладка, тема, узлы, выравнивание по сетке. |

### 🧜 mermaid — Mermaid-диаграммы (+ реальный рендер)
| Команда | Что делает |
| --- | --- |
| `/mermaid:vorcl <цель>` | Набор диаграмм через Task Master — построение до готового (с рендер-проверкой). |
| `/mermaid:create <описание> [тип]` | Диаграмма по описанию — валидный синтаксис, проверен реальным рендером; отдаёт файл. |
| `/mermaid:convert <исходник> [тип]` | Конвертация исходника — схема БД → ER, код → class/sequence, папки → flowchart, `.drawio`/CSV/JSON. |
| `/mermaid:validate <файл>` | Синтаксис + реальный рендер-тест; найти и устранить ошибки (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <файл> [формат] [тема]` | Экспорт в SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <файл>` | Доработка существующего `.mmd` — направление, subgraph, classDef/стили, читаемость. |

---

## MCP и секреты

Плагин **ничего не хостит** — своего бэкенда и базы у него нет. MCP-серверам нужны токены, и каждый пользователь задаёт **свои** через переменные окружения: `.mcp.json` подставляет их формой `${VAR:-}`, а Claude Code берёт значения из окружения, в котором запущен.

> ⚠️ **Обязательный ключ для ядра:** `ANTHROPIC_API_KEY`. Без него MCP-сервер Task Master (цель → задачи: `parse_prd`, `add_task`, `expand_task`) молча не работает — агенты останутся, но `/vorcl` не сможет превращать цели в отслеживаемые задачи.

Экспортируй те, что реально используешь (например, в `~/.zshrc`):

```bash
export ANTHROPIC_API_KEY=…     # ОБЯЗАТЕЛЬНО: Task Master (parse_prd / expand)
export FIRECRAWL_API_KEY=…     # веб-ресёрч firecrawl
export GITHUB_TOKEN=…          # github MCP
export PERPLEXITY_API_KEY=…    # опционально: research-режим Task Master

# Для агента `database` — это подключение к БД ТВОЕГО проекта, не плагина:
export POSTGRES_URL=…          # postgres://user:pass@host:5432/db
export MONGODB_URI=…           # mongodb://user:pass@host:27017/db
export REDIS_URL=…             # redis://host:6379
```

Незаданный ключ — соответствующий MCP-сервер просто молчит, остальное работает.

Удалённые серверы **vercel** и **render** используют OAuth (авторизация командой `/mcp` в браузере). Для Render в headless/CI можно задать `RENDER_API_KEY` и заменить его запись на header-форму: `"headers": { "Authorization": "Bearer ${RENDER_API_KEY:-}" }`.

---

## Проверка установки

```bash
claude plugin validate . --strict      # валидация манифеста и компонентов
/plugin details agent-vorcl-flow       # список подхваченных агентов/скиллов/команд
@agent-vorcl-flow:architect            # субагент появляется в typeahead
/architect:analyze биллинг для SaaS    # запуск слэш-команды
```

---

## GPT Codex

У Codex нет «плагинов», поэтому те же возможности выражены через **скиллы**, **профили** и роутер `AGENTS.md`:

| Claude Code | Эквивалент в Codex |
| --- | --- |
| субагент `@agent-vorcl-flow:frontend` | скилл-персона `$frontend` + `codex --profile frontend` |
| команда `/analyzer:audit` | task-скилл `$analyzer-audit` |
| команда `/vorcl` | task-скилл `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` в `config.toml` |
| хук `SessionStart` | роутинг ролей в `AGENTS.md` |

```bash
codex
> $vorcl  добавить корзину в чекаут
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # роль с повышенным reasoning effort
```

Полная карта соответствий — в [`codex/README.md`](./codex/README.md).

---

## Структура проекта

```text
.claude-plugin/plugin.json      # манифест плагина
.claude-plugin/marketplace.json # локальный маркетплейс (для установки)
agents/       13 определений субагентов (*.md)
skills/       <скилл>/SKILL.md            (30 скиллов)
commands/     <namespace>/<команда>.md    (67 команд, /namespace:команда) + /vorcl
hooks/        hooks.json + session-start.js + catch-guard.js (PostToolUse: пустые catch)
.mcp.json     github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, mermaid
bin/          install.mjs                 (npx-инсталлер)
codex/        адаптер под GPT Codex (skills + config.toml + install.sh)
```

**Как это связано:** `agents/*.md` объявляют роль и в frontmatter `skills:` подключают навыки → скиллы из `skills/*/SKILL.md` автоподхватываются по описанию → команды `commands/<агент>/*.md` дают быстрые `/агент:команда` и делегируют субагенту → `.mcp.json` даёт агентам инструменты. Хук `SessionStart` сообщает Claude о наличии агентов.

---

## Лицензия

MIT — свободное использование, копирование, изменение и распространение; предоставляется «как есть», без гарантий и ответственности. См. [LICENSE](./LICENSE).

© 2026 Christian Avis (Vorcl).
