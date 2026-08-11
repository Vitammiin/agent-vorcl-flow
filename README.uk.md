<div align="center">

# Agent-Vorcl-Flow

**Команда спеціалізованих субагентів ШІ для [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) та [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — із навичками, командами та MCP інструментами.**
Одна команда `npx` встановлює їх. Немає віддаленого серверного або хмарного хостингу: ваш агент кодування запускає все локально.

![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-6C5CE7)
![GPT Codex](https://img.shields.io/badge/GPT%20Codex-adapter-1abc9c)
![Cursor](https://img.shields.io/badge/Cursor-native%20adapter-111111)
![Kimi CLI](https://img.shields.io/badge/Kimi%20CLI-adapter-000000)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)
![Agents](https://img.shields.io/badge/agents-22-blue)
![Commands](https://img.shields.io/badge/commands-135-blue)
![License](https://img.shields.io/badge/license-MIT-green)

<details>
<summary>🌐 <strong>Languages (22)</strong> — all translations are stored in Git</summary>

[English](./README.md) · [Русский](./README.ru.md) · [**Українська**](./README.uk.md) · [Deutsch](./README.de.md) · [Français](./README.fr.md) · [Español](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 01861dcfef6354f49ecb1c6e62f9c5316943aeb8305556e432e273d7117f85e6. -->

</div>

---

## Що це?

Agent-Vorcl-Flow перетворює підтримуваного агента кодування на **структуровану команду інженерів**. Замість одного головного помічника ви отримуєте **22 цілеспрямованих суб-агента** (архітектор, бекенд, інтерфейс, Expo мобільний інженер, DB інженер, архітектурний картограф, оператор живої дошки тощо), кожен із **своїми навичками** домену, швидкими **командами косої риски** та **MCP інструментами**, які йому потрібні. Кожне нетривіальне завдання проходить через упорядкований цикл **Task Master** — *ціль → завдання → виконати → перевірити → виконано*, тож робота планується, відстежується та переживає перерви.

- 🧩 **22 субагенти**, 44 навички, 135 команд похилої риски
- ⚡ **Встановлення однією командою** для Claude Code, Codex, Cursor та/або Kimi CLI — `npx`
- 🔌 **11 MCP серверів** підключено (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, рендер, файлова система, Task Master, Mermaid)
- 🔑 **Один `.env` файл для всіх середовищ виконання** — ключі зчитуються програмою запуску, а не `~/.zshrc`, тому вони працюють навіть під час запуску GUI/IDE; немає віддаленої служби AVF; Liveboard є лише локальним і ефемерним
- 🤝 **Працює на Claude Code, GPT Codex, Cursor і Kimi CLI** з того самого джерела

---

## Швидкий старт

### Вимоги
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** та/або **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Установити (одна команда)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Цільове середовище виконання з прапором:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Що робить інсталятор:

| Час виконання | Дія |
| --- | --- |
| **Спільний шар** | Копіює засіб запуску до `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` та створює `~/.config/agent-vorcl-flow/.env` із шаблону (один раз) — єдиний файл ключа для кожного середовища виконання. |
| **Claude Code** | Реєструє це репо як плагін **marketplace** і вмикає плагін (через `claude plugin …`, із прямим `~/.claude/settings.json` резервним варіантом). |
| **GPT Codex** | Об’єднує навички в `~/.agents/skills`, а блоки `config.toml` + `AGENTS.md` в `~/.codex` (ідемпотент, між маркерами). |
| **Cursor** | Встановлює навички в `~/.cursor/skills`, власних субагентів у `~/.cursor/agents` та об’єднує відсутні сервери в `~/.cursor/mcp.json`. |
| **Kimi CLI** | Встановлює навички в `~/.kimi/skills`, власний Expo спеціальний агент у `~/.kimi/agents`, обидві Expo архітектури/UI підключається до `~/.kimi/config.toml` та об’єднує MCP сервери. |

> Інсталятор ніколи не заповнює ваші секрети — він лише створює порожній `.env` із шаблону. Ви додаєте туди ключі (див. [Configuration](#конфігурація-mcp-і-ключі)).

### Оновіть до останньої версії

Знову запустіть програму встановлення з тегом npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

Щоб оновити лише одне середовище виконання, збережіть той самий прапор середовища виконання, який використовувався під час встановлення:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

Оновлення накладає керовані Agent-Vorcl-Flow навички, агенти, хуки, панель запуску та блоки конфігурації. Він зберігає ваш існуючий `~/.config/agent-vorcl-flow/.env` та його секрети незмінними, а також зберігає навички Firecrawl. Після цього перезапустіть оновлений клієнт кодування (або запустіть `/reload-plugins` у Claude Code).

### Альтернативні встановлення (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Після встановлення **перезапустіть Claude Code** (або запустіть `/reload-plugins` у відкритому сеансі), щоб завантажити агенти.

---

## Як використовувати

У прикладах у цьому розділі використовується синтаксис Claude Code; див. зіставлення [Cursor](#cursor) і [GPT Codex](#gpt-codex) нижче для їх рідного синтаксису. У Claude Code є **три способи** викликати команду.

### 1. Універсальна точка входу — просто сформулюйте мету
```text
/vorcl add a shopping cart to checkout
/audit .
```
`/vorcl` визначає, який субагент має володіти роботою, і керує повним Task Master циклом. `/audit` автоматично визначає бекенд, зовнішній інтерфейс, мобільні пристрої, дані та інфраструктуру та пише доказовий `PROJECT_AUDIT.md`, використовуючи всі відповідні ролі.

### 2. Поговоріть із конкретним субагентом
```text
@agent-vorcl-flow:architect  design billing for a SaaS
@agent-vorcl-flow:backend    add a POST /invoices endpoint
```

### 3. Виконайте певну команду похилої риски
```text
/backend:create-api   POST /invoices
/analyzer:audit       src/
/screenshot:convert   ./mockups/dashboard.png  react
```

Кожний агент також має власну точку входу `/<agent>:vorcl`, яка запускає цикл Task Master, що відповідає цьому агенту.

### Петля Task Master
Кожне нетривіальне завдання проходить через **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```

Завдяки цьому робота планується, перевіряється та відновлюється — нічого не оголошується «виконаним» без проходження етапу перевірки.

---

## Агенти| Агент | Роль | Основні моменти |
| --- | --- | --- |
| 🔵 **архітектор** | Архітектор систем і рішень | Аналіз вимог, проектування системи/DB/API, огляди архітектури |
| 🟢 **сервер** | Backend розробник | Вузол/TS, Postgres, Redis; модульна архітектура; кожен маршрут, повністю покритий OpenAPI |
| 🟣 **інтерфейс** | Інтерфейс (React 19 / Next.js App Router) | Компоненти, стан, вибірка даних, оптимізація візуалізації/групування, тести |
| 📱 **expo-mobile** | React Native + Expo інженер | Модульна архітектура плюс система дизайну/руху/взаємодії, власна навігація, маркери, жести, тактильні відчуття, зменшення руху |
| 🟠 **аналізатор** | Аудитор коду (тільки для читання) | Помилки, безпека типів, DB структура, інтерфейс імітує, бекенд пахне |
| 🟡 **пихатість** | OpenAPI/Swagger покриття (будь-який стек) | Знаходить не повністю задокументовані маршрути та покриває їх із перевіркою |
| 🔴 **firecrawl** | Веб-дослідник | Живий CLI/MCP/REST, інтеграція програми та готові робочі процеси веб-даних |
| 🟤 **рендер** | Хостинг і розгортання (Render) | Розгортання, діагностика на основі журналів, метрики, env vars, Render Postgres |
| 🟦 **база даних** | DB інженер / DBA | Схема, запити та плани, індекси, N+1, безпечні оборотні міграції, кеш |
| ⚪ **стійкість** | Надійність: помилки + протоколювання | спробувати/зловити на правильних границях, введені помилки, повторні спроби/тайм-аути, структуровані журнали |
| 🖼️ **скріншот** | Знімок екрана UI → код | Перетворює знімок екрана UI на готовий до використання, адаптивний і доступний код |
| 🔎 **візуальне дослідження** | Скріншот → перевірена відповідь | Ідентифікує сайт/сторінку, знаходить офіційні документи, перевіряє дані в реальному часі та відповідає URL-адресами та впевненістю |
| 🎯 **точна точка** | Знімок екрана → розмістити в існуючому проекті (тільки для читання) | Базує знімок екрана запущеної програми в реальній кодовій базі — компонент, `file:line`, маршрут/сторінка, точний елемент керування та логіка, що стоїть за цим; нічого не створює, делегує редагування |
| 📊 **drawio** | Діаграми (draw.io / diagrams.net) | Блок-схема, BPMN, UML, ERD, мережа/хмара та PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Картограф архітектури | Детермінований код → `architecture.json` (кожен вузол із `source:{file,line}`) → інтерактивна HTML карта, draw.io, Mermaid, ARCHITECTURE.md, PDF; недоведені факти позначені `inferred` |
| 🧜 **русалка** | Mermaid діаграми (+ реальне рендеринг) | блок-схема, послідовність, клас, стан, ER, gantt, gitGraph, mindmap…; перевірено через mcp-mermaid/`mmdc`; передає вам файл (`.mmd` + SVG/PNG/PDF) |
| 🧪 **тестування** | Інженер з випробувань та перевірок | Одиниця (Vitest/Jest), інтеграція (Supertest), E2E (Playwright), охоплення, полювання на нестабільний тест; виконує `testStrategy` кожного завдання — нічого не «зроблено» без зеленого запуску |
| 🌿 **gitflow** | Git робочий процес і випуски | Звичайні коміти, коміти за іменами (ніколи `git add .`), PR, Keep-a-Changelog, випуски semver; push тільки з явним підтвердженням |
| 🛡️ **безпека** | Аудитор безпеки (тільки читання) | Секрети в історії дерева та git, 10 найкращих OWASP, CVE залежностей, ідентифікаційна інформація; висновки стають завданнями — виправлення делегуються |
| 📝 **документи** | Інженер з документального забезпечення | README (багатомовний паритет), API документи з OpenAPI, АРХІТЕКТУРА, ВКАЗІВ, примітки до випуску; кожен приклад перевірено на код |
| 🐳 **devops** | Контейнери та CI/CD | Multistage Dockerfiles, docker-compose для локальних розробників, GitHub конвеєри дій, гігієна env/secrets, моніторинг |
| 📡 **liveboard** | Місцева оперативна рада | Живі Git робочі дерева, процеси агента та Task Master завдання на ефемерній інформаційній панелі локального хосту |**Кілька речей, які варто знати:**
- **Frontend завжди спілкується зі справжнім API.** Специфікація OpenAPI backend є єдиним джерелом правди; з нього генеруються типи (`openapi-typescript` + `openapi-fetch`). Ніяких макетів на шляху виробництва.
- **`database` мутації вимагають явного підтвердження.** Аналітика доступна лише для читання; зміни схем/даних (DDL/DML/міграції) ніколи не запускаються без вашого дозволу.
- **`resilience` містить запобіжний гачок.** Неблокуючий `PostToolUse` гачок (`catch-guard.js`) м’яко позначає порожні `catch {}` блоки у файлах, які ви щойно редагували.
- **`archmap` ніколи не малює з уяви.** Вилучення та рендеринг суворо розділені: сценарії нульової залежності переміщують репо в `architecture.json` (бази даних із реальною потужністю FK, API маршрути, агенти ШІ з їх моделями/інструментами/пам’яттю, графік імпорту, env), і кожна діаграма відображається лише з цього JSON. Усе, що LLM додає без `file:line`, яке можна перевірити, позначається примусово `inferred:true` та малюється пунктиром.
- **`pinpoint` знаходить, ніколи не створює.** Отримавши знімок екрана запущеної програми, він відображає екран на реальний код — компонент, маршрут, точне керування та логіку, що стоїть за цим — і передає редагування `frontend`/`backend`. Він працює на тому, що вже існує (інверсія `screenshot`).
- **`visual-research` перевіряє замість вгадування.** Він розглядає знімок екрана як доказ, підтверджує офіційний домен і документи, перевіряє поточні дані сайту та позначає можливі фішингові або застарілі значення.
- **`i18n` забезпечує «нульове жорстке кодування мови».** Агенти спочатку визначають, чи є проект багатомовним, і адаптуються — рядки, які відкриває користувач, проходять через рівень перекладу (next-intl / react-i18next / i18next), але ніколи не вбудовані.

---

## Посилання на команди

Кожна наведена нижче команда є командою косої риски. `<…>` позначає ваш введений текст.

### `/vorcl` — універсальний маршрутизатор
| Команда | Що він робить |
| --- | --- |
| `/vorcl <goal>` | Перетворює будь-яку ціль на завдання та направляє її потрібному субагенту, а потім запускає повний цикл до виконання. |
| `/audit [path] [focus]` | Глибокий багаторольовий аудит лише для читання → виявлені системи, результати безпеки/CVE/стійкості, цільова архітектура та поетапне `PROJECT_AUDIT.md`. |

### 🔵 архітектор — архітектура
| Команда | Що він робить |
| --- | --- |
| `/architect:vorcl <goal>` | Ціль → завдання → цикл, пов'язаний з архітектурою. |
| `/architect:analyze <context>` | Проаналізуйте вимоги та контекст завдання. |
| `/architect:design <problem>` | Спроектуйте архітектуру рішення (система, DB, API). |
| `/architect:review <target>` | Перегляньте існуючу архітектуру. |

### 🟢 бекенд — сервер (Node/TS, Postgres, Redis)
| Команда | Що він робить |
| --- | --- |
| `/backend:vorcl <goal>` | Ціль → завдання → цикл для бекендової роботи. |
| `/backend:create-api <endpoint>` | Створіть кінцеву точку API на модульній архітектурі, повністю покритій OpenAPI. |
| `/backend:refactor <target>` | Рефакторинг коду без зміни поведінки. |
| `/backend:optimize <target>` | Оптимізація продуктивності. |
| `/backend:test <target>` | Згенеруйте тести для коду. |

### 🟣 інтерфейс — React / Next.js
| Команда | Що він робить |
| --- | --- |
| `/frontend:vorcl <goal>` | Ціль → завдання → цикл роботи з фронтендом. |
| `/frontend:create-component <spec>` | Створіть компонент UI відповідно до структури функції. |
| `/frontend:refactor <target>` | Рефакторинг UI/хуків без зміни поведінки. |
| `/frontend:optimize <target>` | Оптимізуйте візуалізацію/набір/основні веб-показники. |
| `/frontend:test <target>` | Створення компонентних тестів. |

### 📱 expo-mobile — React Native / Expo| Команда | Що він робить |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Мета → Task Master цикл для Expo мобільної роботи. |
| `/expo-mobile:create-module <domain>` | Створіть модульний сегмент бізнесу лише з тими рівнями, які необхідні для його складності. |
| `/expo-mobile:create-screen <flow>` | Створіть тонкий маршрут Expo Router, а також екран і стани, що належать модулю. |
| `/expo-mobile:design-screen <flow>` | Створіть екран преміум-класу зі спільним дизайном/токенами руху, станами та доступністю. |
| `/expo-mobile:motion <interaction>` | Створюйте нативну навігацію, пружини, жести, тактильні дії та резервні копії зі зменшеним рухом. |
| `/expo-mobile:add-api <contract>` | Додайте схему/DTO/відповідач/ключі запиту та інтеграцію TanStack Query. |
| `/expo-mobile:audit [scope]` | Захист архітектури лише для читання та перевірка на основі доказів. |
| `/expo-mobile:ui-audit [scope]` | Система дизайну лише для читання, рух, взаємодія, доступність і аудит ефективності. |
| `/expo-mobile:compatibility [app] [change]` | Аудит сумісності Expo/RN/Node/package/native-runtime у реальному часі лише для читання з офіційними джерелами з версіями. |
| `/expo-mobile:test <scope>` | Запустіть одиницю домену, React Native бібліотеку тестування та Maestro перевірки. |

### 🟠 аналізатор — аудит коду (лише для читання)
| Команда | Що він робить |
| --- | --- |
| `/analyzer:vorcl <goal>` | Аудит цілі за допомогою Task Master — результати стають завданнями. |
| `/analyzer:audit` | Повний аудит: помилки, типи, DB, інтерфейс інтерфейсу, бекенд запахи. |
| `/analyzer:bugs` | Пошук помилок — необроблені помилки, умови перегонів, крайні випадки. |
| `/analyzer:types` | Перевірка типу — `tsc`, `any`, небезпечні приведення, дрейф типів zod↔. |
| `/analyzer:db` | Структура аудиту DB — схема, індекси, FK, N+1, міграції. |
| `/analyzer:mocks` | Знайти макет / підроблені дані на інтерфейсі. |
| `/analyzer:backend` | Знайти «поганий» бекенд-код — порушення архітектури, логіки в контролерах. |

### 🟡 чванство — OpenAPI/Swagger покриття (будь-який стек)
| Команда | Що він робить |
| --- | --- |
| `/swagger:vorcl <goal>` | Ціль повного охоплення через Task Master — перевірка → завдання → покриття → перевірка. |
| `/swagger:audit` | Лише читання: пошук маршрутів, які не повністю охоплені специфікацією. |
| `/swagger:cover <route>` | Охоплення маршруту/модуля — параметри, відповіді, описи, безпека + перевірка. |

### 🔴 firecrawl — веб-дослідження
| Команда | Що він робить |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Мета дослідження через Task Master — збирати веб-дані для отримання кінцевого результату. |
| `/firecrawl:search <query>` | Пошук джерел по питанню в Інтернеті. |
| `/firecrawl:scrape <url>` | Зберіть одну URL-адресу в Markdown/JSON. |
| `/firecrawl:map <url>` | Зіставте URL-адреси сайту. |
| `/firecrawl:crawl <url>` | Рекурсивне сканування розділу/сайту. |
| `/firecrawl:extract <url>` | Структуроване вилучення за схемою JSON. |
| `/firecrawl:setup` | Встановити/перевірити CLI, а також навички офіційної збірки та робочого процесу (з підтвердженням). |
| `/firecrawl:interact <url>` | Клацайте, переміщайтеся або заповнюйте форми, коли копіювання недостатньо. |
| `/firecrawl:parse <file>` | Проаналізуйте локальний/приватний документ у markdown або JSON. |
| `/firecrawl:monitor <action>` | Список перевірок або керування регулярними моніторингами змін сторінки. |
| `/firecrawl:agent <goal>` | Запустіть обмежене довгострокове завдання Firecrawl Агент. |
| `/firecrawl:research <query>` | Пошук статей і GitHub контекст дослідження. |
| `/firecrawl:ask <jobId>` | Діагностика невдалого завдання Firecrawl. |
| `/firecrawl:docs-search <question>` | Пошук поточної офіційної Firecrawl документації. |
| `/firecrawl:integrate <feature>` | Додайте Firecrawl до коду програми за допомогою навичок побудови. |
| `/firecrawl:deliverable <artifact>` | Створіть бриф, аудит, список потенційних клієнтів або інший артефакт робочого процесу. |`/firecrawl:setup` запускає офіційний `firecrawl-cli init --all` потік лише після підтвердження. Існуючі офіційні навички `firecrawl-*` мають пріоритет і зберігаються інсталятором Codex/Cursor; AVF надає сумісні запасні варіанти для відсутніх навичок. Операції в реальному часі здійснюються через CLI → MCP → REST/без ключа.

### 🟤 render — розміщення / розгортання (Render)
| Команда | Що він робить |
| --- | --- |
| `/render:vorcl <goal>` | Інфра ціль через Task Master — розгорнути/діагностувати/налаштувати для завершення. |
| `/render:deploy <service>` | Розгорнути / повторно розгорнути службу. |
| `/render:logs <service>` | Журнали обслуговування та діагностика до першопричини. |
| `/render:status <service>` | Статус служби + розгортання + показники. |
| `/render:query <sql>` | SQL лише для читання проти Render Postgres. |

### 🟦 база даних — DB інженер / DBA (Postgres / MongoDB / Redis)
| Команда | Що він робить |
| --- | --- |
| `/database:vorcl <goal>` | Ціль даних через Task Master — схема/запити/міграції/кеш для виконання. |
| `/database:query <query>` | Запит/аналітика лише для читання. |
| `/database:schema <target>` | Схема проектування/перегляду та цілісність даних. |
| `/database:migrate <change>` | Сплануйте безпечну оборотну міграцію схеми/даних. |
| `/database:optimize <target>` | Оптимізація — індекси, N+1, плани запитів, розбиття на сторінки. |
| `/database:cache <target>` | Redis — TTL, анулювання, блокування, обмеження швидкості, потоки. |

### ⚪ стійкість — обробка помилок + журналювання
| Команда | Що він робить |
| --- | --- |
| `/resilience:vorcl <goal>` | Ціль надійності через Task Master — код покриття з try/catch + logs. |
| `/resilience:harden <target>` | Загортання коду в try/catch/finally з надійним журналюванням, без тихих помилок. |
| `/resilience:logging <target>` | Додати/виправити структуроване журналювання — рівні, контекст, без секретів/ІН. |
| `/resilience:audit` | Лише для читання: пошук тихих збоїв, порожніх уловів, пропусків у журналі. |

### 🖼️ знімок екрана — знімок екрана UI → код
| Команда | Що він робить |
| --- | --- |
| `/screenshot:vorcl <goal>` | Набір екранів зі скріншотів через Task Master — розбивка → код. |
| `/screenshot:analyze <image>` | Розбивка лише для читання — макет, компоненти, маркери, стани → план. |
| `/screenshot:convert <image> [framework]` | Згенеруйте повний код, який можна виконувати, зі знімка екрана (за замовчуванням React + Tailwind v4). |
| `/screenshot:tokens <image>` | Витягніть маркери дизайну (кольори OKLCH, типографіку, інтервали) у Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Зробіть згенерований UI адаптивним — контрольні точки, рідина, `clamp()`, запити контейнерів. |

### 🔎 візуальне дослідження — знімок екрана → перевірена веб-відповідь
| Команда | Що він робить |
| --- | --- |
| `/visual-research:vorcl <goal>` | Багатоетапне дослідження знімків екрана за допомогою Task Master. |
| `/visual-research:identify <image>` | Визначте сайт, сторінку та функцію з достовірними доказами. |
| `/visual-research:search <image> <target>` | Знайдіть справжню сторінку чи офіційну документацію за візуальними підказками. |
| `/visual-research:answer <image> <question>` | Відповідайте, використовуючи скріншоти, офіційні документи та поточні дані. |
| `/visual-research:hints <image> <goal>` | Надайте безпечні, підтверджені документацією кроки для видимого інтерфейсу. |

### 🎯 pinpoint — знімок екрана → місце в існуючому проекті (лише читання)
| Команда | Що він робить |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Знайти/зрозуміти/змінити існуючий UI зі знімка екрана за допомогою Task Master — карта → завдання → делегувати. |
| `/pinpoint:locate <image>` | Знайдіть наявний компонент/файл(и) на знімку екрана — `file:line`, без нового коду. |
| `/pinpoint:route <image>` | Визначте маршрут/сторінку, на якій знаходиться екран (Next.js Маршрутизатор додатків/сторінок, React Маршрутизатор). |
| `/pinpoint:control <image>` | Визначте точний елемент керування (кнопку/поле) та його обробник у коді. |
| `/pinpoint:trace <target>` | Простежте логіку за елементом — обробник → стан → вибірка даних → API. |
| `/pinpoint:handoff <change>` | Створіть точний запит на редагування на основі існуючого коду та делегуйте `frontend`/`backend`. |

### 📊 drawio — діаграми (draw.io / diagrams.net)
| Команда | Що він робить |
| --- | --- |
| `/drawio:vorcl <goal>` | Набір діаграм через Task Master — збірка готова. |
| `/drawio:create <description> [type]` | Побудуйте діаграму з текстового опису (дійсний рідний XML). |
| `/drawio:pmp <type> <project>` | Побудуйте діаграму PMP/PMBOK — WBS, PERT/CPM, Gantt, RACI, матриця ризиків, сітка зацікавлених сторін. |
| `/drawio:convert <source> [type]` | Перетворення джерела на діаграму — DB схема → ERD, папки → дерево, код → UML, русалка/CSV/JSON. |
| `/drawio:refine <file>` | Удосконалення наявного `.drawio` — макет, тема, додавання/видалення вузлів, вирівнювання за сіткою. |

### 🗺️ archmap — карта архітектури з коду| Команда | Що він робить |
| --- | --- |
| `/archmap:vorcl <goal>` | Мета відображення через Task Master — створити перевірений набір артефактів. |
| `/archmap:map [repo]` | Повний конвеєр: вилучення → `architecture.json` → LLM анотація → усі формати (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Лише витяг — машинозчитуваний `architecture.json` з `source:{file,line}` на кожному вузлі. |
| `/archmap:annotate [json]` | LLM збагачення існуючого `architecture.json` (пам’ять агента, семантика потоку даних); недоведені факти автоматично знижуються до `inferred`. |
| `/archmap:html [json]` | Інтерактивна самодостатня HTML карта — перемикання шарів, трасування променів, вузол → панель `file:line`, пошук, друк CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (багатосторінковий: Огляд / ERD / API / Агенти) та/або Mermaid представлення, перевірені. |

### 🧜 русалка — Mermaid діаграми (+ реальне рендеринг)
| Команда | Що він робить |
| --- | --- |
| `/mermaid:vorcl <goal>` | Набір діаграм через Task Master — збірка готова (перевірено візуалізацію). |
| `/mermaid:create <description> [type]` | Побудуйте діаграму з опису — дійсний синтаксис, перевірений реальним рендером; передає вам файл. |
| `/mermaid:convert <source> [type]` | Перетворіть джерело на Mermaid — DB схему → ER, код → клас/послідовність, папки → блок-схему, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Синтаксис + реальний рендер-тест; знайти та виправити помилки (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Експорт до SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Удосконалити наявний `.mmd` — напрямок, підграф, classDef/стилі, читабельність. |

### 🧪 тестування — тести та перевірка
| Команда | Що він робить |
| --- | --- |
| `/testing:vorcl <goal>` | Мета тестування/перевірки через Task Master — одиниця + інтеграція + e2e для завершення. |
| `/testing:unit <file\|module>` | Модульні тести (Vitest/Jest) — щасливий шлях, межі, помилки; запускає їх і показує результат. |
| `/testing:integration <endpoint\|module>` | Тести інтеграції (Supertest/inject, real DB або testcontainers). |
| `/testing:e2e <scenario>` | Playwright E2E для критичного шляху користувача — селектори ролей, фікстури, трасування в разі збою. |
| `/testing:verify <task\|testStrategy>` | Виконує завдання `testStrategy` і повертає вердикт ГОТОВИЙ / НЕ ГОТОВИЙ із реальним результатом. |
| `/testing:coverage [path]` | Звіт про покриття з висновками — який критичний код неперевірений; створює завдання. |
| `/testing:flaky <test>` | Діагностує нестабільний тест (гонка, час, спільний стан, імітація) і виправляє його назавжди. |

### 🌿 gitflow — робочий процес і випуски git
| Команда | Що він робить |
| --- | --- |
| `/gitflow:vorcl <goal>` | Ціль git/release через Task Master (підготувати випуск, очистити історію, розгалуження функцій). |
| `/gitflow:commit <files\|scope>` | Коміт за іменем (ніколи `git add .`) з повідомленням «Звичайні коміти»; зупиняється на невідомому WIP. |
| `/gitflow:pr <base> <title>` | Розгалуження → фіксує → запит на отримання (gh / GitHub MCP) із перевіркою що/чому/як. |
| `/gitflow:changelog [version]` | CHANGELOG.md (зберігати журнал змін), згенерований на основі комітів між тегами. |
| `/gitflow:release <version\|auto>` | Semver із комітів → синхронізувати версії маніфесту → тег → GitHub реліз. Натискайте лише після явного підтвердження. |
| `/gitflow:audit [branch]` | Аудит історії лише для читання: порушення конвенцій, створення дампу, великі блоби, гілки-сиріти. |

### 🛡️ security — аудит безпеки (лише для читання)
| Команда | Що він робить |
| --- | --- |
| `/security:vorcl <goal>` | Ціль безпеки через Task Master — аудит → результати → завдання → делеговані виправлення. |
| `/security:secrets [path\|branch]` | Секрети в робочому дереві ТА історії git (усі гілки); `${VAR:-}` Заповнювачі не є секретами. |
| `/security:owasp [path]` | Топ-10 OWASP у коді: ін’єкції, XSS, автентифікація, доступ до даних, CORS/cookies — із підтвердженням файлу: рядок. |
| `/security:deps` | CVE залежностей через npm аудит/файли блокування — рівень серйозності, прапорці порушення зміни. |
| `/security:pii [path]` | Ризики PII/GDPR: електронні листи, телефони, картки в коді та журналах; приватні шляхи розробника. |
| `/security:pre-push [branch]` | Швидка комбінована перевірка змінених файлів перед натисканням: секрети + ін'єкції + ідентифікаційна інформація; зелений/червоний вердикт. |

### 📝 docs — документація
| Команда | Що він робить |
| --- | --- |
| `/docs:vorcl <goal>` | Мета документування через Task Master. |
| `/docs:readme [path]` | Створити/оновити README — what/quickstart/usage/config/troubleshooting; перевірені приклади; мовні версії синхронізовано. || `/docs:api [spec]` | API документи, створені на основі OpenAPI специфікації (кінцеві точки, параметри, приклади curl); пропонує `/swagger:audit`, якщо немає спец. |
| `/docs:architecture` | ARCHITECTURE.md — модулі, межі, потік даних; діаграми, делеговані `mermaid`/`drawio`. |
| `/docs:contributing` | CONTRIBUTING.md — налаштування, структура, тести, правила фіксації (вирівняно з `gitflow`), PR-процес. |
| `/docs:release-notes <version>` | Примітки до випуску для версії з CHANGELOG/history. |
| `/docs:audit` | Документи лише для читання↔перевірка дрейфу коду: непрацюючі посилання, застарілі приклади/лічильники, несинхронізовані переклади. |

### 🐳 devops — контейнери та CI/CD
| Команда | Що він робить |
| --- | --- |
| `/devops:vorcl <goal>` | Інфраструктурна ціль через Task Master. |
| `/devops:dockerfile [app-type]` | Написати/переглянути Dockerfile — багатоетапний, тонкий базовий, некореневий, HEALTHCHECK; перевірено справжнім `docker build`. |
| `/devops:compose` | docker-compose.yml для локальних розробників (додаток + БД); env зміни потребують `--force-recreate`, чекає здорового. |
| `/devops:ci [type]` | GitHub Дії — робочий процес PR (lint+typecheck+test, npm кеш), робочий процес розгортання, мінімальні дозволи. |
| `/devops:env` | Перелік змінних Env: де читати, що потрібно, `.env.example` шаблон; секрети ніколи не в образах. |
| `/devops:monitoring` | Структуровані журнали (pino/JSON), кінцева точка здоров’я, про що сповіщати; Візуалізація показників через агента `render`. |

### 📡 liveboard — ефемерна локальна оперативна дошка
| Команда | Що він робить |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Запустіть відшліфовану інформаційну панель на 43 мовах на безкоштовному локальному порту; Task Master потік змін через SSE та узгодження кожні 5 хвилин. |
| `/liveboard:vorcl <goal>` | Розробіть або змініть саму liveboard за допомогою необхідного Task Master робочого процесу. |

Liveboard читає Git робочі дерева, локальні Claude/Codex/Cursor процеси та `.taskmaster/tasks/tasks.json` кожного робочого дерева. Стан виконання залишається в пам’яті та зникає, коли активний процес зупиняється. UI визначає мову браузера та пропонує 43 мови, включаючи англійську, російську, українську, німецьку, французьку, іспанську, португальську, італійську, польську, турецьку, китайську, японську, арабську, голландську, чеську, словацьку, румунську, угорську, болгарську, сербську, хорватську, словенську, грецьку, іврит, перську, хінді, бенгальську, урду, індонезійську, малайську, в’єтнамську, тайську, корейську, Шведська, норвезька, датська, фінська, естонська, латвійська, литовська, грузинська, вірменська та азербайджанська. Арабська, іврит, перська та урду використовують розкладку RTL.

Пряма конфігурація:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: проект, Git робочі дерева та Task Master файли якого скануються.
- `--port 0`: автоматичний вибір вільного порту.
- `--interval`: повний інтервал узгодження в мілісекундах; файл перегляд нерухомих потоків Task Master змінюється негайно.
- Кінцеві точки: `/health`, `/api/snapshot`, `/api/events` (SSE) і `POST /api/refresh`.
- Зберігайте `--host 127.0.0.1`, якщо ви явно не маєте наміру надати інформацію про проект мережі.

---

## Конфігурація (MCP і ключі)

У пакеті **немає віддаленого сервера чи бази даних**. Додатковий liveboard — це процес, який виконується в пам’яті лише на локальному хості. MCP серверам потрібні токени, і **кожен користувач надає свої власні**. Щоб ця робота однаково працювала в **Claude Code, Codex, Cursor та Kimi CLI** — незалежно від того, запускаєте ви з терміналу чи з Dock / Spotlight / IDE — кожен сервер stdio MCP запускається через невелику програму запуску (`bin/mcp-env.mjs`), яка зчитує ваші ключі з **одного файлу**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Інсталятор створює його з [`.env.example`](./.env.example). Відкрийте його та введіть лише ключі, якими ви користуєтеся:

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

> **Чому програма запуску замість `~/.zshrc`?** Розширення Env-var залежить від середовища виконання (`${VAR:-}` у Claude, `${env:VAR}` у Cursor, літерали у Codex/Kimi), і кожне середовище виконання зчитує лише середовище, у якому **його** було запущено. GUI / IDE запускаються на macOS не джерело `~/.zshrc`, тому експортовані ключі невидимі, а сервери ні до чого не підключаються — класичний Помилка "MCP env не встановлено". Читання з одного файлу `.env` усуває обидві проблеми одночасно.**Перевага** (пізніше виграє): спільний `~/.config/agent-vorcl-flow/.env` → a `./.env` у корені проекту → справжній `export` у вашій оболонці. Зберігайте глобальні ключі в спільному файлі, змінюйте для кожного проекту (наприклад, інший `MONGODB_URI`) проектом `.env`, і справжній експорт оболонки все одно виграє для CLI запусків. Ви можете навести панель запуску на інший файл за допомогою `AGENT_VORCL_ENV_FILE=/path/.env`.

Сервер, для якого відсутній необхідний ключ, просто **не запускається** — ви побачите однорядковий `[agent-vorcl-flow] MCP «…» is not configured: …` у журналі MCP середовища виконання, а всі інші сервери продовжують працювати. Додайте ключ до `.env` і перезапустіть. (Ви можете зберегти імена `GITHUB_TOKEN`/`MONGODB_URI` — програма запуску зіставляє їх із `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING`, які очікують сервери.)

> ⚠️ **Потрібно для команд Task Master на основі штучного інтелекту:** налаштуйте принаймні одного вибраного постачальника — `ANTHROPIC_API_KEY` для Claude, `OPENAI_API_KEY` для GPT або Codex CLI OAuth. Без облікових даних для моделі, вибраної в `.taskmaster/config.json`, `/vorcl` не може створювати або розширювати завдання.

Виберіть, який Task Master провайдер фактично виконує генерацію; одні ключі не вибирають модель:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Команда використовує офіційний потік `task-master models` і зберігає лише вибір моделі в `.taskmaster/config.json`. `PERPLEXITY_API_KEY` є необов’язковим і потрібним лише тоді, коли як модель дослідження вибрано Perplexity.

Віддалені сервери **vercel** і **render** використовують OAuth (авторизуйтеся за допомогою `/mcp` у браузері). Для Render in headless/CI встановіть `RENDER_API_KEY` у вашому середовищі та додайте запис заголовка Bearer до цього сервера для свого середовища виконання.

---

## Перевірте інсталяцію

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

Codex не має «плагінів», тому ті самі можливості виражаються як **навички**, **профілі** та `AGENTS.md` маршрутизатор:

| Claude Code | Codex еквівалент |
| --- | --- |
| субагент `@agent-vorcl-flow:frontend` | персона навичок `$frontend` + `codex --profile frontend` |
| команда `/analyzer:audit` | уміння виконувати завдання `$analyzer-audit` |
| команда `/vorcl` | уміння виконувати завдання `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` у `config.toml` |
| `SessionStart` гачок | маршрутизація ролі в `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Див. [`codex/README.md`](./codex/README.md) для повного відображення.

---

## Cursor

Cursor використовує той самий відкритий формат `SKILL.md`, що й адаптер Codex, а також власні субагенти та глобальну конфігурацію MCP:

| Agent-Vorcl-Flow концепція | Cursor еквівалент |
| --- | --- |
| роль `backend` | індивідуальний субагент `/avf-backend` у `~/.cursor/agents` |
| команда завдання `/backend:create-api` | навик `/backend-create-api` |
| універсальний `/vorcl` | навик `/vorcl` |
| `.mcp.json` | об’єднані сервери в `~/.cursor/mcp.json` |

Інсталятор перетворює визначення ролей на Cursor frontmatter, додає субагентам префікс `avf-`, щоб уникнути зіткнень імен навичок, використовує `model: inherit` та позначає агентів лише для аудиту як `readonly: true`. Існуючі MCP серверні записи з такими ж іменами зберігаються. Дивіться [`cursor/README.md`](./cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) оригінально завантажує навички агента, спеціальні файли агентів і перехоплювачі життєвого циклу; AVF також об’єднує ті самі сервери MCP, що використовуються Claude та Cursor:

| Agent-Vorcl-Flow концепція | Kimi CLI еквівалент |
| --- | --- |
| навички / команди завдань | `~/.kimi/skills` і `/skill:<name>` |
| Expo митний агент | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse guard | об’єднано в `~/.kimi/config.toml` |
| `.mcp.json` | об’єднані сервери в `~/.kimi/mcp.json` |
| файл ключа під час виконання | спільний `~/.config/agent-vorcl-flow/.env` (через панель запуску) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI не має розширення `${VAR}` у `mcp.json`, тому ключі надходять зі спільного `.env` через панель запуску — так само, як і інші середовища виконання. Див. [`kimi/README.md`](./kimi/README.md).

---

## Структура проекту

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       22 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (44 skills; some ship references, scripts, tests or HTML assets)
commands/     <namespace>/<command>.md    (135 commands, /namespace:command, including /vorcl and /audit)
hooks/        hooks.json + SessionStart + PostToolUse guards (empty catch, Expo architecture/UI boundaries)
.mcp.json     github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, mermaid
.env.example  template for ~/.config/agent-vorcl-flow/.env (single key file for all runtimes)
bin/          install.mjs (the npx installer) + mcp-env.mjs (cross-runtime MCP launcher / .env loader)
codex/        GPT Codex adapter (skills + config.toml + install.sh)
cursor/       Cursor adapter (MCP template + installation notes)
kimi/         Kimi CLI adapter (skills install + Expo agent/hook + MCP)
```

**Як це поєднується:** `agents/*.md` оголосити роль і, у передній частині `skills:`, приєднати навички → навички в `skills/*/SKILL.md` автоматично завантажуються за описом → `commands/<agent>/*.md` надають швидкі `/agent:command` ярлики, які делегують субагенту → `.mcp.json` надають агентам свої інструменти, кожен із яких запускається через `bin/mcp-env.mjs`, який завантажує секрети зі спільного `.env`. Гачок `SessionStart` повідомляє Claude, що агенти доступні.

---

## Ліцензія

MIT — вільне використання, копіювання, зміна та розповсюдження; надається «як є», без гарантій і відповідальності. Див. [LICENSE](./LICENSE).

© 2026 Christian Avis (Vorcl).
