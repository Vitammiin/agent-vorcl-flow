<div align="center">

# Agent-Vorcl-Flow

**Команда специализированных AI-субагентов для [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) и [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — со скиллами, командами и MCP-инструментами.**
Ставится одной командой `npx`. Без удалённого бэкенда и облачного хостинга — всё исполняется локально.

<details>
<summary>🌐 <strong>Languages (22)</strong> — translations live in `translations/`</summary>

[English](../README.md) · [**Русский**](./README.ru.md) · [Українська](./README.uk.md) · [Deutsch](./README.de.md) · [Français](./README.fr.md) · [Español](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

</div>

---

## Что это

Agent-Vorcl-Flow превращает поддерживаемый coding agent в **структурированную инженерную команду**. Вместо одного универсального ассистента ты получаешь **24 узкопрофильных субагента** (архитектор, principal-архитектор по реальному коду, бэкенд, фронтенд, Expo mobile-инженер, инженер продуктового и визуального дизайна, инженер БД, картограф архитектуры, оператор liveboard и другие) — у каждого свои доменные **скиллы**, быстрые **слэш-команды** и нужные ему **MCP-инструменты**. Любая нетривиальная задача идёт через дисциплинированный цикл **Task Master** — *цель → задачи → реализация → проверка → готово* — работа спланирована, отслеживается и переживает прерывания.

- 🧩 **24 субагента**, 46 скиллов, 150 слэш-команд
- ⚡ **Установка одной командой** в Claude Code, Codex, Cursor и/или Kimi CLI — `npx`
- 🔌 **11 MCP-серверов** из коробки (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, filesystem, Task Master, Mermaid)
- 🔑 **Один файл `.env` для всех рантаймов** — ключи читает launcher, а не `~/.zshrc`, поэтому они работают даже при запуске из GUI/IDE; удалённого сервиса AVF нет; liveboard локальный и эфемерный
- 🤝 **Работает в Claude Code, GPT Codex, Cursor и Kimi CLI** из одного исходника

---

## Быстрый старт

### Требования
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** и/или **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Установка (одна команда)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Один конкретный рантайм — флагом:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Что делает инсталлер:

| Рантайм | Действие |
| --- | --- |
| **Общий слой** | Кладёт launcher в `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` и создаёт `~/.config/agent-vorcl-flow/.env` из шаблона (один раз) — единый файл ключей для всех рантаймов. |
| **Claude Code** | Регистрирует репозиторий как **marketplace** плагинов и включает плагин (через `claude plugin …`, фолбэк — прямая запись в `~/.claude/settings.json`). |
| **GPT Codex** | Вмёрживает скиллы в `~/.agents/skills`, а блоки `config.toml` + `AGENTS.md` — в `~/.codex` (идемпотентно, между маркерами). |
| **Cursor** | Устанавливает скиллы в `~/.cursor/skills`, нативных субагентов в `~/.cursor/agents` и добавляет отсутствующие серверы в `~/.cursor/mcp.json`. |
| **Kimi CLI** | Ставит skills в `~/.kimi/skills`, нативный Expo agent в `~/.kimi/agents`, оба Expo architecture/UI hook в `~/.kimi/config.toml` и добавляет MCP-серверы. |

> Инсталлер не вписывает секреты — он лишь создаёт пустой `.env` из шаблона. Ключи ты добавляешь туда сам (см. [MCP и секреты](#mcp-и-секреты)).

### Обновление до последней версии

Повторно запусти инсталлер с npm-тегом `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

Чтобы обновить только один рантайм, оставь тот же флаг, который использовался при установке:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

Обновление перезаписывает управляемые Agent-Vorcl-Flow skills, agents, hooks, launcher и конфигурационные блоки. Существующий `~/.config/agent-vorcl-flow/.env` с секретами остаётся без изменений; upstream-скиллы Firecrawl также сохраняются. После обновления перезапусти coding client (либо выполни `/reload-plugins` в Claude Code).

### Альтернативные способы (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

После установки **перезапусти Claude Code** (или выполни `/reload-plugins` в открытой сессии), чтобы агенты подхватились.

---

## Как пользоваться

Примеры в этом разделе используют синтаксис Claude Code; нативный синтаксис смотри ниже в разделах [Cursor](#cursor) и [GPT Codex](#gpt-codex). В Claude Code есть **три способа** позвать команду.

### 1. Универсальная точка входа — просто сформулируй цель
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` сам определяет, какому субагенту отдать работу, и ведёт полный цикл Task Master. `/audit` автоматически находит backend, frontend, mobile, data и infrastructure и создаёт доказательный `PROJECT_AUDIT.md`, используя все релевантные роли.

### 2. Обратиться к конкретному субагенту
```text
@agent-vorcl-flow:architect  design billing for a SaaS
@agent-vorcl-flow:backend    add a POST /invoices endpoint
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
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```

Работа спланирована, чекпойнтится и возобновляема — ничего не объявляется «готовым» без прохождения проверки. Дисциплину задаёт скилл `workflow`, справочник команд — скилл `task-master`.

---

## Агенты

| Агент | Роль | Что умеет |
| --- | --- | --- |
| 🔵 **architect** | Архитектор систем и решений | Анализ требований, проектирование системы/БД/API, ревью архитектуры |
| 🏛️ **principal-architect** | Principal Software / Infrastructure / AI Architect | Сканирует реальный код на 11 языках и создаёт доказательные MD, JSON, HTML, PDF, draw.io и Mermaid; полный rescan сохраняет annotations |
| 🟢 **backend** | Backend-разработчик | Node/TS, Postgres, Redis; модульная архитектура; каждый роут полностью покрыт OpenAPI |
| 🟣 **frontend** | Frontend (React 19 / Next.js App Router) | Компоненты, состояние, data-fetching, оптимизация рендера/бандла, тесты |
| 📱 **expo-mobile** | React Native + Expo инженер | Модульная архитектура + Design/Motion/Interaction System, native navigation, tokens, gestures, haptics, Reduced Motion |
| 🟠 **analyzer** | Аудитор кода (read-only) | Баги, типобезопасность, структура БД, моки на фронте, «плохой» код на бэке |
| 🟡 **swagger** | Покрытие OpenAPI/Swagger (любой стек) | Находит недокументированные роуты и покрывает их, с проверкой |
| 🔴 **firecrawl** | Веб-исследователь | Live CLI/MCP/REST, интеграция в приложения и готовые web-workflows |
| 🟤 **render** | Хостинг и деплой (Render) | Деплои, диагностика по логам, метрики, env-переменные, Render Postgres |
| 🟦 **database** | Инженер БД / DBA | Схема, запросы и планы, индексы, N+1, безопасные обратимые миграции, кэш |
| ⚪ **resilience** | Надёжность: обработка ошибок | try/catch на нужных границах, типизированные ошибки, ретраи/таймауты |
| 🪵 **logging** | Pino structured logging | Один root logger в `infrastructure/logging`, child context, redact, requestId, JSON в stdout |
| 🖼️ **screenshot** | Скриншот UI → код | Превращает скриншот интерфейса в production-ready, адаптивный, доступный код |
| 🎨 **design-studio** | Продуктовый и визуальный дизайн | Локальные HTML-артефакты, прототипы, wireframe, deck/PPTX, документы, animation, 3D, design systems и импорт Figma/GitHub/HTML; адаптировано из MIT `JimLiu/baoyu-design` |
| 🔎 **visual-research** | Скриншот → проверенный ответ | Определяет сайт/страницу, находит официальную документацию, проверяет live data и отвечает с URL и уверенностью |
| 🎯 **pinpoint** | Скриншот → место в существующем проекте (read-only) | Привязывает скриншот работающего приложения к реальному коду — компонент, `file:line`, маршрут/страница, конкретный контрол и логика за ним; ничего не создаёт, правку делегирует |
| 📊 **drawio** | Диаграммы (draw.io / diagrams.net) | Flowchart, BPMN, UML, ERD, network/cloud и PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Картограф архитектуры | Детерминированно код → `architecture.json` (каждый узел с `source:{file,line}`) → интерактивная HTML-карта, draw.io, Mermaid, ARCHITECTURE.md, PDF; недоказанное помечается `inferred` |
| 🧜 **mermaid** | Mermaid-диаграммы (+ реальный рендер) | flowchart, sequence, class, state, ER, gantt, gitGraph, mindmap…; валидация через mcp-mermaid/`mmdc`; отдаёт готовый файл (`.mmd` + SVG/PNG/PDF) |
| 🧪 **testing** | Инженер тестов и верификации | Unit (Vitest/Jest), интеграционные (Supertest), E2E (Playwright), покрытие, ловля flaky; исполняет `testStrategy` задач — ничто не «готово» без зелёного прогона |
| 🌿 **gitflow** | Git-workflow и релизы | Conventional Commits, поимённые коммиты (никогда `git add .`), PR, Keep a Changelog, semver-релизы; push только с явного подтверждения |
| 🛡️ **security** | Аудитор безопасности (read-only) | Секреты в дереве и git-истории, OWASP Top 10, CVE зависимостей, PII; находки становятся задачами — фиксы делегируются |
| 📝 **docs** | Инженер документации | README (паритет языков), API-доки из OpenAPI, ARCHITECTURE, CONTRIBUTING, release notes; каждый пример сверен с кодом |
| 🐳 **devops** | Контейнеры и CI/CD | Multistage Dockerfile, docker-compose для локалки, GitHub Actions, гигиена env/секретов, мониторинг |
| 📡 **liveboard** | Локальное операционное табло | Worktree, процессы агентов и задачи Task Master в реальном времени на эфемерном localhost-сервере |

**Что стоит знать:**
- **Фронт всегда ходит в реальный API.** Источник истины — OpenAPI-спека бэка; типы генерируются из неё (`openapi-typescript` + `openapi-fetch`). Моков в прод-пути нет.
- **Мутации `database` — только с явным подтверждением.** Аналитика read-only; изменения схемы/данных (DDL/DML/миграции) без твоего «да» не выполняются. Миграции — безопасные и обратимые (expand → backfill → contract).
- **`resilience` ставит защитный хук.** Неблокирующий `PostToolUse`-хук (`catch-guard.js`) мягко подсвечивает пустые `catch {}` в только что отредактированных файлах.
- **`logging` владеет Pino-пакетом.** Второй `PostToolUse`-хук (`pino-logging/scripts/scan.mjs`) ловит локальный `pino()`, production `console.log`, секреты в payload и прямые Loki sink. Канон — скилл `pino-logging`.
- **`pinpoint` находит, а не создаёт.** По скриншоту работающего приложения строит карту «скриншот → исходники» — компонент, маршрут, конкретный контрол и логика за ним — и передаёт правку `frontend`/`backend`. Работает с тем, что уже есть (обратная задача к `screenshot`). В мультиязычном проекте помнит: текст на экране — **значение перевода**, в коде лежит **ключ** (`t('...')`), — и грепает по обоим.
- **`visual-research` проверяет, а не угадывает.** Считает скриншот доказательством, подтверждает официальный домен и документацию, сверяет текущие данные сайта и предупреждает о phishing или устаревших значениях.
- **`render` помнит про инфраструктурные детали.** Доступ к БД по IP-allowlist (outbound-IP сервиса → allowlist базы; для Render Postgres — internal URL), диагностика по логам до первопричины.
- **Диаграммы — как файлы-артефакты.** `mermaid` проверяет каждую диаграмму реальным рендером и отдаёт `.mmd` + SVG/PNG/PDF в твоём каталоге; `drawio` отдаёт валидный XML — открывается в app.diagrams.net.
- **`archmap` не рисует из головы.** Extraction и rendering жёстко разделены: zero-dependency скрипты обходят репо в `architecture.json` (базы с реальной кардинальностью FK, роуты, AI-агенты с моделями/тулами/памятью, import-граф, env), и каждая диаграмма рендерится только из этого JSON. Всё, что LLM добавила без проверяемого `file:line`, принудительно помечается `inferred:true` и рисуется пунктиром.
- **`principal-architect` — полный workflow архитектурной публикации.** Он работает в том репозитории, где запущен агент, не считает Markdown доказательством topology, использует bundled offline Tree-sitter WASM для TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin и Swift, сначала пишет `ARCHITECTURE.md`, затем создаёт общий JSON, self-contained HTML, PDF, native draw.io и копируемые Mermaid L0–L4. `update` делает полный rescan и сохраняет annotations и unmanaged-файлы.
- **Скилл `i18n` — «ноль языкового хардкода».** Агенты сначала определяют, мультиязычен ли проект, и адаптируются — пользовательские строки идут через слой перевода (next-intl / react-i18next / i18next), не инлайном.

---

## Справочник команд

Все команды ниже — слэш-команды. `<…>` — твой ввод.

### `/vorcl` — универсальный роутер
| Команда | Что делает |
| --- | --- |
| `/vorcl <цель>` | Превращает любую цель в задачи, роутит нужному субагенту и ведёт полный цикл до готового. |
| `/audit [путь] [фокус]` | Глубокий read-only multi-role аудит → системы, security/CVE/resilience, целевая архитектура и поэтапный `PROJECT_AUDIT.md`. |

### 🔵 architect — архитектура
| Команда | Что делает |
| --- | --- |
| `/architect:vorcl <цель>` | Цель → задачи → цикл в рамках архитектуры. |
| `/architect:analyze <контекст>` | Анализ требований и контекста задачи. |
| `/architect:design <проблема>` | Проектирование архитектуры решения (система, БД, API). |
| `/architect:review <цель>` | Ревью существующей архитектуры. |

### 🏛️ principal-architect — реальная архитектура по коду
| Команда | Что делает |
| --- | --- |
| `/principal-architect:vorcl <цель>` | Проводит крупную архитектурную цель через Task Master и проверяемые артефакты. |
| `/principal-architect:create [options]` | Сканирует текущий репозиторий и создаёт MD, JSON, HTML, PDF, draw.io и Mermaid по evidence из кода. |
| `/principal-architect:update [options]` | Полностью пересканирует пакет, пишет evidence diff и атомарно обновляет generated-артефакты. |

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

### 📱 expo-mobile — React Native / Expo

| Команда | Что делает |
| --- | --- |
| `/expo-mobile:vorcl <цель>` | Цель → Task Master цикл для Expo mobile. |
| `/expo-mobile:create-module <домен>` | Создать business module с минимально необходимыми слоями. |
| `/expo-mobile:create-screen <сценарий>` | Создать тонкий Expo Router route и module screen со всеми состояниями. |
| `/expo-mobile:design-screen <сценарий>` | Создать premium screen через общие design/motion tokens, states и accessibility. |
| `/expo-mobile:motion <interaction>` | Спроектировать native navigation, springs, gestures, haptics и reduced-motion fallback. |
| `/expo-mobile:add-api <контракт>` | Добавить schema/DTO/mapper/query keys и TanStack Query. |
| `/expo-mobile:audit [scope]` | Read-only architecture guard и доказательный аудит. |
| `/expo-mobile:ui-audit [scope]` | Read-only аудит Design System, motion, interactions, accessibility и performance. |
| `/expo-mobile:compatibility [app] [изменение]` | Live read-only аудит совместимости Expo/RN/Node/packages/native runtime по versioned official sources. |
| `/expo-mobile:test <scope>` | Unit/RNTL/Maestro проверки mobile-кода. |

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
| `/firecrawl:setup` | Установка/проверка CLI и официальных build/workflow skills (с подтверждением). |
| `/firecrawl:interact <url>` | Клики, навигация и формы, когда scrape недостаточно. |
| `/firecrawl:parse <файл>` | Парсинг локального/непубличного документа в markdown/JSON. |
| `/firecrawl:monitor <действие>` | Просмотр checks и управление мониторингом изменений. |
| `/firecrawl:agent <цель>` | Ограниченная по стоимости длительная задача Firecrawl Agent. |
| `/firecrawl:research <запрос>` | Поиск научных работ и GitHub-контекста. |
| `/firecrawl:ask <jobId>` | Диагностика упавшего Firecrawl job. |
| `/firecrawl:docs-search <вопрос>` | Поиск по актуальной официальной документации Firecrawl. |
| `/firecrawl:integrate <функция>` | Интеграция Firecrawl в приложение через upstream build skills. |
| `/firecrawl:deliverable <артефакт>` | Создание brief, аудита, lead list или другого workflow-артефакта. |

`/firecrawl:setup` запускает официальный `firecrawl-cli init --all` только после подтверждения. Уже установленные официальные `firecrawl-*` скиллы имеют приоритет и сохраняются установщиком Codex/Cursor; AVF добавляет совместимые fallback-скиллы. Live-операции идут по маршруту CLI → MCP → REST/keyless.

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

### 🪵 logging — Pino structured logging
| Команда | Что делает |
| --- | --- |
| `/logging:vorcl <цель>` | Цель по логированию через Task Master — покрыть или обновить Pino-пакет. |
| `/logging:audit [путь]` | Read-only: один root logger, child context, redact, без console/Loki sink. |
| `/logging:cover <цель>` | Создать `infrastructure/logging` и покрыть модуль/worker/route. |
| `/logging:update <цель>` | Привести легаси `pino()`/`console.log` к канону. |

### 🖼️ screenshot — скриншот UI → код
| Команда | Что делает |
| --- | --- |
| `/screenshot:vorcl <цель>` | Набор экранов из скриншотов через Task Master — разбор → код. |
| `/screenshot:analyze <изображение>` | Read-only разбор — layout, компоненты, токены, состояния → план. |
| `/screenshot:convert <изображение> [фреймворк]` | Полный запускаемый код по скриншоту (по умолчанию React + Tailwind v4). |
| `/screenshot:tokens <изображение>` | Извлечь дизайн-токены (цвета OKLCH, типографика, spacing) в Tailwind `@theme`. |
| `/screenshot:responsive <цель>` | Довести сгенерированный UI до адаптивности — брейкпоинты, fluid, `clamp()`, container queries. |

### 🎨 design-studio — продуктовый и визуальный дизайн
| Команда | Что делает |
| --- | --- |
| `/design-studio:vorcl <цель>` | Полная дизайн-цель через Task Master: контекст → варианты → HTML → preview → проверка → экспорт. |
| `/design-studio:create <бриф>` | Создать polished self-contained артефакт или hi-fi UI. |
| `/design-studio:prototype <сценарий>` | Интерактивный web/mobile prototype с состояниями и переходами. |
| `/design-studio:wireframe <сценарий>` | Low-fi wireframe с фокусом на информационной архитектуре и UX. |
| `/design-studio:design-system <операция>` | Создать, импортировать, скомпилировать, привязать, обновить или проверить дизайн-систему. |
| `/design-studio:import <тип> <источник>` | Импортировать Figma `.fig`, GitHub или HTML/CSS с provenance. |
| `/design-studio:deck <бриф>` | HTML-deck со speaker notes, анимациями и опциональным editable PPTX. |
| `/design-studio:document <бриф>` | Печатный документ, résumé, memo, one-pager или report. |
| `/design-studio:animation <бриф>` | Motion artifact с опциональным экспортом в MP4. |
| `/design-studio:research <вопрос>` | Доказательный визуальный research-артефакт с источниками. |
| `/design-studio:export <проект> <формат>` | Экспорт в standalone HTML, PDF, PPTX, MP4 или handoff-формат. |
| `/design-studio:review <цель>` | Read-only ревью visual/UX/responsive/a11y/design-system. |

### 🔎 visual-research — скриншот → проверенный веб-ответ
| Команда | Что делает |
| --- | --- |
| `/visual-research:vorcl <цель>` | Многошаговое исследование скриншотов через Task Master. |
| `/visual-research:identify <изображение>` | Определить сайт, страницу и функцию с оценкой уверенности. |
| `/visual-research:search <изображение> <цель>` | Найти реальную страницу или официальную документацию по визуальным признакам. |
| `/visual-research:answer <изображение> <вопрос>` | Ответить по скриншоту, official docs и актуальным live data. |
| `/visual-research:hints <изображение> <цель>` | Дать безопасные шаги по интерфейсу, подтверждённые документацией. |

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

### 🗺️ archmap — карта архитектуры по коду

| Команда | Что делает |
| --- | --- |
| `/archmap:vorcl <цель>` | Цель по картированию через Task Master — до проверенного набора артефактов. |
| `/archmap:map [репо]` | Полный пайплайн: extraction → `architecture.json` → LLM-аннотация → все форматы (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [репо]` | Только extraction — машиночитаемый `architecture.json` с `source:{file,line}` у каждого узла. |
| `/archmap:annotate [json]` | LLM-обогащение готового `architecture.json` (память агентов, dataflow-семантика); недоказанное само понижается в `inferred`. |
| `/archmap:html [json]` | Интерактивная self-contained HTML-карта — тумблеры слоёв, trace-подсветка, панель `file:line`, поиск, print-CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (многостраничный: Overview / ERD / API / Agents) и/или Mermaid-вью с валидацией. |

### 🧜 mermaid — Mermaid-диаграммы (+ реальный рендер)
| Команда | Что делает |
| --- | --- |
| `/mermaid:vorcl <цель>` | Набор диаграмм через Task Master — построение до готового (с рендер-проверкой). |
| `/mermaid:create <описание> [тип]` | Диаграмма по описанию — валидный синтаксис, проверен реальным рендером; отдаёт файл. |
| `/mermaid:convert <исходник> [тип]` | Конвертация исходника — схема БД → ER, код → class/sequence, папки → flowchart, `.drawio`/CSV/JSON. |
| `/mermaid:validate <файл>` | Синтаксис + реальный рендер-тест; найти и устранить ошибки (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <файл> [формат] [тема]` | Экспорт в SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <файл>` | Доработка существующего `.mmd` — направление, subgraph, classDef/стили, читаемость. |

### 🧪 testing — тесты и верификация
| Команда | Что делает |
| --- | --- |
| `/testing:vorcl <цель>` | Цель по тестированию через Task Master — unit + integration + e2e до готового. |
| `/testing:unit <файл\|модуль>` | Unit-тесты (Vitest/Jest) — happy path, границы, ошибки; прогоняет и показывает вывод. |
| `/testing:integration <эндпоинт\|модуль>` | Интеграционные тесты (Supertest/inject, реальная БД или testcontainers). |
| `/testing:e2e <сценарий>` | Playwright E2E критического пути — селекторы по ролям, fixtures, trace при падении. |
| `/testing:verify <задача\|testStrategy>` | Исполняет `testStrategy` задачи и выносит вердикт ГОТОВО / НЕ ГОТОВО с реальным выводом. |
| `/testing:coverage [путь]` | Отчёт покрытия с находками — что критичное не покрыто; создаёт задачи. |
| `/testing:flaky <тест>` | Диагностика нестабильного теста (race, timing, shared state, моки) и починка насовсем. |

### 🌿 gitflow — git-workflow и релизы
| Команда | Что делает |
| --- | --- |
| `/gitflow:vorcl <цель>` | Git/релизная цель через Task Master (подготовить релиз, вычистить историю, фиче-ветка). |
| `/gitflow:commit <файлы\|scope>` | Поимённый коммит (никогда `git add .`) с Conventional Commits-сообщением; стоп при чужом WIP. |
| `/gitflow:pr <base> <заголовок>` | Ветка → коммиты → pull request (gh / GitHub MCP) с что/зачем/как-проверено. |
| `/gitflow:changelog [версия]` | CHANGELOG.md (Keep a Changelog) из коммитов между тегами. |
| `/gitflow:release <версия\|auto>` | Semver по коммитам → синхронизация версий манифестов → tag → GitHub release. Push только после явного подтверждения. |
| `/gitflow:audit [ветка]` | Read-only аудит истории: нарушения конвенции, коммиты-свалки, большие блобы, ветки-сироты. |

### 🛡️ security — аудит безопасности (read-only)
| Команда | Что делает |
| --- | --- |
| `/security:vorcl <цель>` | Security-цель через Task Master — аудит → находки → задачи → делегированные фиксы. |
| `/security:secrets [путь\|ветка]` | Секреты в рабочем дереве И git-истории (все ветки); плейсхолдеры `${VAR:-}` — не секреты. |
| `/security:owasp [путь]` | OWASP Top 10 в коде: инъекции, XSS, auth, утечки данных, CORS/cookies — с доказательством file:line. |
| `/security:deps` | CVE зависимостей через npm audit / lock-файлы — severity, флаги ломающих обновлений. |
| `/security:pii [путь]` | PII/GDPR-риски: email, телефоны, карты в коде и логах; личные пути разработчика. |
| `/security:pre-push [ветка]` | Быстрый комплексный чек изменённых файлов перед пушем: секреты + инъекции + PII; зелёный/красный вердикт. |

### 📝 docs — документация
| Команда | Что делает |
| --- | --- |
| `/docs:vorcl <цель>` | Документационная цель через Task Master. |
| `/docs:readme [путь]` | Создать/обновить README — what/quickstart/usage/config/troubleshooting; примеры проверены; языковые версии синхронны. |
| `/docs:api [спека]` | API-доки из OpenAPI-спеки (эндпоинты, параметры, curl-примеры); если спеки нет — предложит `/swagger:audit`. |
| `/docs:architecture` | ARCHITECTURE.md — модули, границы, data flow; диаграммы делегирует `mermaid`/`drawio`. |
| `/docs:contributing` | CONTRIBUTING.md — setup, структура, тесты, конвенции коммитов (согласовано с `gitflow`), PR-процесс. |
| `/docs:release-notes <версия>` | Release notes версии из CHANGELOG/истории. |
| `/docs:audit` | Read-only проверка дрейфа docs↔код: битые ссылки, устаревшие примеры/счётчики, несинхронные переводы. |

### 🐳 devops — контейнеры и CI/CD
| Команда | Что делает |
| --- | --- |
| `/devops:vorcl <цель>` | Инфраструктурная цель через Task Master. |
| `/devops:dockerfile [тип]` | Написать/отревьюить Dockerfile — multistage, slim-база, non-root, HEALTHCHECK; проверка реальным `docker build`. |
| `/devops:compose` | docker-compose.yml для локалки (приложение + БД); изменения env требуют `--force-recreate`, ждёт healthy. |
| `/devops:ci [тип]` | GitHub Actions — PR-workflow (lint+typecheck+test, кэш npm), deploy-workflow, минимальные permissions. |
| `/devops:env` | Инвентаризация env-переменных: где читаются, что обязательно, шаблон `.env.example`; секреты никогда в образах. |
| `/devops:monitoring` | Структурные логи (pino/JSON), health-эндпоинт, что алертить; метрики Render — через агента `render`. |

### 📡 liveboard — эфемерное локальное табло
| Команда | Что делает |
| --- | --- |
| `/liveboard:start [путь] [--port N] [--interval ms]` | Запускает красивое табло на 43 языках на свободном localhost-порту; изменения Task Master идут через SSE, полный перескан — раз в 5 минут. |
| `/liveboard:vorcl <цель>` | Развивает или изменяет сам liveboard через обязательный Task Master workflow. |

Liveboard читает Git worktree, локальные процессы Claude/Codex/Cursor и `.taskmaster/tasks/tasks.json` каждого worktree. Runtime-состояние живёт только в памяти и исчезает после остановки foreground-процесса. UI определяет язык браузера и поддерживает 43 локали, включая English, Русский, Українська, Deutsch, Français, Español, Português, Italiano, Polski, Türkçe, 中文, 日本語, العربية, Nederlands, Čeština, Slovenčina, Română, Magyar, Български, Српски, Hrvatski, Slovenščina, Ελληνικά, עברית, فارسی, हिन्दी, বাংলা, اردو, Bahasa Indonesia, Bahasa Melayu, Tiếng Việt, ไทย, 한국어, Svenska, Norsk, Dansk, Suomi, Eesti, Latviešu, Lietuvių, ქართული, Հայերեն и Azərbaycanca. Для Arabic, Hebrew, Persian и Urdu включается RTL.

Прямая настройка:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root` — проект, в котором сканируются Git worktree и файлы Task Master.
- `--port 0` — автоматический выбор свободного порта.
- `--interval` — период полного перескана в миллисекундах; изменения Task Master всё равно приходят сразу через file watcher.
- Endpoints: `/health`, `/api/snapshot`, `/api/events` (SSE), `POST /api/refresh`.
- Оставляй `--host 127.0.0.1`, если явно не собираешься открывать сведения о проекте в локальную сеть.

---

## MCP и секреты

У пакета нет **удалённого бэкенда или базы**. Опциональный liveboard — localhost-only процесс с состоянием в памяти. MCP-серверам нужны токены, и каждый пользователь задаёт **свои**. Чтобы это работало одинаково в **Claude Code, Codex, Cursor и Kimi CLI** — и при запуске из терминала, и из Dock / Spotlight / IDE — каждый stdio MCP-сервер запускается через небольшой launcher (`bin/mcp-env.mjs`), который читает ключи из **одного файла**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Инсталлер создаёт его из [`.env.example`](../.env.example). Открой и впиши только те ключи, которыми пользуешься:

```dotenv
ANTHROPIC_API_KEY=      # Task Master main provider: Claude
OPENAI_API_KEY=         # alternative main provider: GPT
PERPLEXITY_API_KEY=     # optional: Task Master research mode
FIRECRAWL_API_KEY=      # firecrawl web research
GITHUB_TOKEN=           # github MCP

# For the `database` agent — these point at YOUR project's DB, not the plugin's:
MONGODB_URI=            # mongodb://user:pass@host:27017/db
REDIS_URL=              # redis://host:6379
POSTGRES_URL=           # postgres://user:pass@host:5432/db
```

> **Почему launcher, а не `~/.zshrc`?** Подстановка env-переменных различается по рантаймам (`${VAR:-}` в Claude, `${env:VAR}` в Cursor, литералы в Codex/Kimi), и каждый рантайм видит только то окружение, в котором **его** запустили. Запуск из GUI / IDE на macOS не читает `~/.zshrc`, поэтому экспортированные ключи невидимы и серверы подключаются в никуда — классический сбой «MCP env not set». Чтение из одного `.env` убирает обе проблемы разом.

**Приоритет** (позднее сильнее): общий `~/.config/agent-vorcl-flow/.env` → `./.env` в корне проекта → реальный `export` в окружении. Общие ключи держи в общем файле, переопределяй по проекту (например, другой `MONGODB_URI`) через проектный `.env`, а настоящий shell-export всё равно побеждает для CLI-запусков. Путь к файлу можно переназначить через `AGENT_VORCL_ENV_FILE=/path/.env`.

Сервер, у которого нет нужного ключа, просто **не поднимается** — в MCP-логе рантайма будет однострочка `[agent-vorcl-flow] MCP «…» не настроен: не задан …`, а все остальные серверы продолжают работать. Добавь ключ в `.env` и перезапусти. (Имена `GITHUB_TOKEN`/`MONGODB_URI` можно оставить как есть — launcher сам маппит их в ожидаемые серверами `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING`.)

> ⚠️ **Для AI-команд Task Master нужен хотя бы один выбранный провайдер:** `ANTHROPIC_API_KEY` для Claude, `OPENAI_API_KEY` для GPT или OAuth Codex CLI. Без авторизации для модели из `.taskmaster/config.json` команда `/vorcl` не сможет генерировать и расширять задачи.

Отдельно выбери, какой провайдер Task Master реально выполняет генерацию — само наличие ключа модель не переключает:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Команда использует официальный `task-master models` и сохраняет в `.taskmaster/config.json` только выбор модели. `PERPLEXITY_API_KEY` опционален и нужен лишь тогда, когда Perplexity выбран как research-модель.

Удалённые серверы **vercel** и **render** используют OAuth (авторизация командой `/mcp` в браузере). Для Render в headless/CI можно задать `RENDER_API_KEY` и добавить в запись сервера Bearer-заголовок для своего рантайма.

---

## Проверка установки

```bash
claude plugin validate . --strict      # validate the manifest and components
/plugin details agent-vorcl-flow       # list the loaded agents / skills / commands
@agent-vorcl-flow:architect            # the sub-agent appears in the typeahead
/architect:analyze billing for a SaaS  # run a slash command

# Cursor: open a new Agent window after installation
/vorcl add a shopping cart to checkout
/backend-create-api POST /invoices
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
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Полная карта соответствий — в [`codex/README.md`](../codex/README.md).

---

## Cursor

Cursor использует тот же открытый формат `SKILL.md`, что и Codex-адаптер, а также нативных custom subagents и глобальную MCP-конфигурацию:

| Концепция Agent-Vorcl-Flow | Эквивалент в Cursor |
| --- | --- |
| роль `backend` | custom subagent `/avf-backend` в `~/.cursor/agents` |
| задача `/backend:create-api` | скилл `/backend-create-api` |
| универсальная команда `/vorcl` | скилл `/vorcl` |
| `.mcp.json` | серверы в `~/.cursor/mcp.json` |

Инсталлер преобразует определения ролей во frontmatter Cursor, добавляет субагентам префикс `avf-`, чтобы не конфликтовать со скиллами, ставит `model: inherit` и помечает агентов-аудиторов как `readonly: true`. Существующие одноимённые MCP-серверы сохраняются. Подробнее — в [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) нативно загружает Agent Skills, custom agent files и lifecycle hooks; AVF также добавляет те же MCP-серверы, что для Claude и Cursor:

| Концепция Agent-Vorcl-Flow | Эквивалент в Kimi CLI |
| --- | --- |
| skills / задачи | `~/.kimi/skills` и `/skill:<name>` |
| Expo custom agent | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse guard | блок в `~/.kimi/config.toml` |
| `.mcp.json` | серверы в `~/.kimi/mcp.json` |
| файл ключей на рантайм | общий `~/.config/agent-vorcl-flow/.env` (через launcher) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

У Kimi CLI нет подстановки `${VAR}` в `mcp.json`, поэтому ключи берутся из общего `.env` через launcher — ровно как у остальных рантаймов. Подробнее — в [`kimi/README.md`](../kimi/README.md).

---

## Структура проекта

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       26 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (78 skills; some ship references, scripts, tests or HTML assets)
commands/     <namespace>/<command>.md    (154 commands, /namespace:command, including /vorcl and /audit)
hooks/        hooks.json + SessionStart + PostToolUse guards (empty catch, Pino logging, Expo architecture/UI boundaries)
.mcp.json     github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, mermaid
.env.example  template for ~/.config/agent-vorcl-flow/.env (single key file for all runtimes)
translations/ localized README files (21 translations)
bin/          install.mjs (the npx installer) + mcp-env.mjs (cross-runtime MCP launcher / .env loader)
codex/        GPT Codex adapter (skills + config.toml + install.sh)
cursor/       Cursor adapter (MCP template + installation notes)
kimi/         Kimi CLI adapter (skills install + Expo agent/hook + MCP)
```

**Как это связано:** `agents/*.md` объявляют роль и в frontmatter `skills:` подключают навыки → скиллы из `skills/*/SKILL.md` автоподхватываются по описанию → команды `commands/<агент>/*.md` дают быстрые `/агент:команда` и делегируют субагенту → `.mcp.json` даёт агентам инструменты. Хук `SessionStart` сообщает Claude о наличии агентов.

---

## Лицензия

MIT — свободное использование, копирование, изменение и распространение; предоставляется «как есть», без гарантий и ответственности. См. [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
