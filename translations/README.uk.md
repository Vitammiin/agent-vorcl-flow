<div align="center">

# Agent-Vorcl-Flow

**Команда спеціалізованих субагентів ШІ для [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) та [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — із навичками, командами й інструментами MCP.**
Їх установлює одна команда `npx`. Немає віддаленого серверного або хмарного хостингу: ваш агент кодування запускає все локально.

![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-6C5CE7)
![GPT Codex](https://img.shields.io/badge/GPT%20Codex-adapter-1abc9c)
![Cursor](https://img.shields.io/badge/Cursor-native%20adapter-111111)
![Kimi CLI](https://img.shields.io/badge/Kimi%20CLI-adapter-000000)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)
![Agents](https://img.shields.io/badge/agents-25-blue)
![Commands](https://img.shields.io/badge/commands-155-blue)
![License](https://img.shields.io/badge/license-MIT-green)

<details>
<summary>🌐 <strong>Languages (22)</strong> — translations live in `translations/`</summary>

[English](../README.md) · [Русский](./README.ru.md) · [**Українська**](./README.uk.md) · [Deutsch](./README.de.md) · [Français](./README.fr.md) · [Español](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 3321a7089b3f749787125626da692c98b8a2d556b237e1ba36bbf67afc34dc3d. -->

</div>

---

## What is this?

Agent-Vorcl-Flow перетворює підтримуваного агента кодування на **структуровану команду інженерів**. Замість одного генерального помічника ви отримуєте **25 цілеспрямованих субагентів** (архітектора, головного архітектора, заснованого на коді, бекенда, інтерфейсу, Expo мобільного інженера, інженера з продуктового та візуального дизайну, DB інженера, міжмовного аудитора цілісності, архітектурного картографа, оператора liveboard тощо), кожен зі своїми **навичками** у домені, швидкими **командами з скісною рискою** та необхідні **MCP інструменти**. Кожне нетривіальне завдання проходить через упорядкований цикл **Task Master** — *ціль → завдання → виконати → перевірити → виконано*, тож робота планується, відстежується та переживає перерви.

- 🧩 **25 субагентів**, 73 навички, 155 команд похилої риски
- ⚡ **Встановлення однією командою** для Claude Code, Codex, Cursor та/або Kimi CLI — `npx`
- 🔌 **11 MCP серверів** підключено (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, рендер, файлова система, Task Master, Mermaid)
- 🔑 **Один файл `.env` для всіх середовищ виконання** — ключі зчитуються програмою запуску, а не `~/.zshrc`, тому вони працюють навіть під час запуску GUI/IDE; немає віддаленої служби AVF; Liveboard є лише локальним і ефемерним
- 🤝 **Працює на Claude Code, GPT Codex, Cursor і Kimi CLI** з того самого джерела

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** та/або **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

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
| **Claude Code** | Реєструє це сховище як **ринок** плагіна та вмикає плагін (через `claude plugin …`, із прямим резервним `~/.claude/settings.json`). |
| **GPT Codex** | Об’єднує навички в `~/.agents/skills`, а блоки `config.toml` + `AGENTS.md` в `~/.codex` (ідемпотент, між маркерами). |
| **Cursor** | Встановлює навички в `~/.cursor/skills`, власні користувацькі субагенти в `~/.cursor/agents` і об’єднує відсутні сервери в `~/.cursor/mcp.json`. |
| **Kimi CLI** | Встановлює навички в `~/.kimi/skills`, власний Expo спеціальний агент у `~/.kimi/agents`, обидві Expo архітектури/UI підключається до `~/.kimi/config.toml` та об’єднує MCP сервери. |

> Інсталятор ніколи не заповнює ваші секрети — він лише створює порожній `.env` із шаблону. Ви додаєте туди ключі (див. [Configuration](#configuration-mcp--keys)).

### Update to the latest version

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

Оновлення охоплює керовані Agent-Vorcl-Flow навички, агенти, хуки, панель запуску та блоки конфігурації. Він зберігає ваш існуючий `~/.config/agent-vorcl-flow/.env` та його секрети незмінними, а також зберігає попередні навички Firecrawl. Після цього перезапустіть оновлений клієнт кодування (або запустіть `/reload-plugins` у Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Після встановлення **перезапустіть Claude Code** (або запустіть `/reload-plugins` у відкритому сеансі), щоб завантажити агенти.

---

## How to use

У прикладах у цьому розділі використовується синтаксис Claude Code; дивіться наведені нижче відображення [Cursor](#cursor) і [GPT Codex](#gpt-codex) для їх рідного синтаксису. У Claude Code є **три способи** викликати команду.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` визначає, який субагент має володіти роботою, і керує повним Task Master циклом. `/audit` автоматично визначає бекенд, зовнішній інтерфейс, мобільні пристрої, дані та інфраструктуру та пише доказовий `PROJECT_AUDIT.md`, використовуючи всі відповідні ролі. `/init-code` читає репозиторій статично та створює доказовий `PROJECT_DESCRIPTION.md` без виконання коду проекту. Після того, як цей файл існує, кожна роль, що змінює, повинна підтримувати синхронізацію відповідних розділів; перевірений опис дрейф блокує виконання завдання.

### 2. Talk to a specific sub-agent
```text
@agent-vorcl-flow:architect  design billing for a SaaS
@agent-vorcl-flow:backend    add a POST /invoices endpoint
```

### 3. Run a specific slash command
```text
/backend:create-api   POST /invoices
/analyzer:audit       src/
/screenshot:convert   ./mockups/dashboard.png  react
```

Кожний агент також має власну точку входу `/<agent>:vorcl`, яка запускає цикл Task Master, який відповідає цьому агенту.

### The Task Master loop
Кожне нетривіальне завдання проходить через **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Завдяки цьому робота планується, перевіряється та відновлюється — нічого не оголошується «виконаним» без проходження етапу перевірки.

---

## The agents| Агент | Роль | Основні моменти |
| --- | --- | --- |
| 🔵 **архітектор** | Архітектор систем і рішень | Аналіз вимог, проектування системи/DB/API, огляди архітектури |
| 🏛️ **керівник-архітектор** | Основне програмне забезпечення / інфраструктура / архітектор ШІ | Сканує реальний код 11 мовами та створює доказові MD, JSON, HTML, PDF, draw.io та Mermaid; оновлення повного повторного сканування зберігають анотації |
| 🟢 **сервер** | Backend розробник | Вузол/TS, Postgres, Redis; модульна архітектура; кожен маршрут, повністю покритий OpenAPI |
| 🟣 **інтерфейс** | Інтерфейс (React 19 / Next.js App Router) | Компоненти, стан, вибірка даних, оптимізація візуалізації/групування, тести |
| 📱 **expo-mobile** | React Native + Expo інженер | Модульна архітектура плюс система дизайну/руху/взаємодії, власна навігація, маркери, жести, тактильні відчуття, зменшення руху |
| 🟠 **аналізатор** | Аудитор коду (тільки для читання) | Помилки, безпека типів, DB структура, інтерфейс імітації, бекенд запахи |
| 🧭 **цілісність** | Аудитор цілісності міжмовного коду (тільки для читання) | Робочий жорсткий код і витік фіктивних/фейкових/демо/фікстур через інтерфейс/бекенд/мобільний/спільний |
| 🟡 **пихатість** | OpenAPI/Swagger покриття (будь-який стек) | Знаходить не повністю задокументовані маршрути та покриває їх із перевіркою |
| 🔴 **firecrawl** | Веб-дослідник | Живий CLI/MCP/REST, інтеграція програми та завершені робочі процеси веб-даних |
| 🟤 **рендер** | Хостинг і розгортання (Render) | Розгортання, діагностика на основі журналів, метрики, env vars, Render Postgres |
| 🟦 **база даних** | DB інженер / DBA | Схема, запити та плани, індекси, N+1, безпечні оборотні міграції, кеш |
| ⚪ **стійкість** | Надійність: помилки + протоколювання | спробувати/зловити на правильних границях, введені помилки, повторні спроби/тайм-аути, структуровані журнали |
| 🖼️ **скріншот** | Знімок екрана UI → код | Перетворює знімок екрана UI на готовий до використання, адаптивний і доступний код |
| 🎨 **дизайн-студія** | Студія продуктового та візуального дизайну | Локальні HTML артефакти, прототипи, каркаси, колоди/PPTX, документи, анімація, 3D, системи дизайну та імпорт Figma/GitHub/HTML; адаптовано з MIT `JimLiu/baoyu-design` |
| 🔎 **візуальне дослідження** | Скріншот → перевірена відповідь | Ідентифікує сайт/сторінку, знаходить офіційні документи, перевіряє дані в реальному часі та відповідає URL-адресами та впевненістю |
| 🎯 **точна точка** | Знімок екрана → розмістити в існуючому проекті (тільки для читання) | Засновує знімок екрана запущеної програми на реальній кодовій базі — компонент, `file:line`, маршрут/сторінка, точний елемент керування та логіка, що стоїть за цим; нічого не створює, делегує редагування |
| 📊 **drawio** | Діаграми (draw.io / diagrams.net) | Блок-схема, BPMN, UML, ERD, мережа/хмара та PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Картограф архітектури | Детермінований код → `architecture.json` (кожен вузол із `source:{file,line}`) → інтерактивна HTML карта, draw.io, Mermaid, ARCHITECTURE.md, PDF; недоведені факти позначені `inferred` |
| 🧜 **русалка** | Mermaid діаграм (+ реальне рендеринг) | блок-схема, послідовність, клас, стан, ER, gantt, gitGraph, mindmap…; перевірено через mcp-mermaid/`mmdc`; передає вам файл (`.mmd` + SVG/PNG/PDF) |
| 🧪 **тестування** | Інженер з випробувань та перевірок | Одиниця (Vitest/Jest), інтеграція (Supertest), E2E (Playwright), охоплення, пошук нестійких тестів; виконує `testStrategy` кожного завдання — нічого не «зроблено» без зеленого запуску |
| 🌿 **gitflow** | Git робочий процес і випуски | Звичайні коміти, коміти за іменами (ніколи `git add .`), PR, Keep-a-Changelog, випуски semver; push тільки з явним підтвердженням |
| 🛡️ **безпека** | Аудитор безпеки (тільки читання) | Секрети в історії дерева та git, 10 найкращих OWASP, CVE залежностей, ідентифікаційна інформація; висновки стають завданнями — виправлення делегуються || 📝 **документи** | Інженер з документального забезпечення | README (багатомовний паритет), API документів із OpenAPI, АРХІТЕКТУРА, ВКАЗІВ, примітки до випуску; кожен приклад перевірено на код |
| 🐳 **devops** | Контейнери та CI/CD | Multistage Dockerfiles, docker-compose для локальних розробників, конвеєри GitHub Actions, гігієна env/secrets, моніторинг |
| 📡 **liveboard** | Місцева оперативна рада | Живі Git робочі дерева, процеси агента та Task Master завдання на ефемерній інформаційній панелі локального хосту |

**Кілька речей, які варто знати:**
- **Frontend завжди спілкується зі справжнім API.** Специфікація OpenAPI backend є єдиним джерелом правди; з нього генеруються типи (`openapi-typescript` + `openapi-fetch`). Ніяких макетів на шляху виробництва.
- **`database` мутації вимагають явного підтвердження.** Аналітика доступна лише для читання; зміни схем/даних (DDL/DML/міграції) ніколи не запускаються без вашого дозволу.
- **`resilience` постачає запобіжний гачок.** Неблокуючий гачок `PostToolUse` (`catch-guard.js`) обережно позначає порожні блоки `catch {}` у файлах, які ви щойно редагували.
- **`archmap` ніколи не малює з уяви.** Вилучення та візуалізація суворо розділені: сценарії нульової залежності вводять репо в `architecture.json` (бази даних із реальною потужністю FK, API маршрути, агенти ШІ з їх моделями/інструментами/пам’яттю, графік імпорту, env), і кожна діаграма відображається лише з цього JSON. Все, що LLM додає без перевіреного `file:line`, примусово позначається `inferred:true` і малюється пунктиром.
- **`principal-architect` – це повний робочий процес публікації архітектури.** Він працює в будь-якому сховищі, де запускається агент, ігнорує претензії Markdown як докази топології, використовує офлайновий WASM Tree-sitter для TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin і Swift, спочатку записує `ARCHITECTURE.md`, а потім створює спільну модель JSON, самодостатній HTML, PDF, нативний draw.io та доступний для копіювання Mermaid L0–L4. `update` виконує повне повторне сканування та зберігає анотації та некеровані файли.
- **`pinpoint` знаходить, ніколи не створює.** Отримавши знімок екрана запущеної програми, він відображає екран на реальний код — компонент, маршрут, точне керування та логіку, що стоїть за ним — і передає редагування `frontend`/`backend`. Він працює на тому, що вже існує (інверсія `screenshot`).
- **`visual-research` перевіряє замість вгадування.** Він розглядає знімок екрана як доказ, підтверджує офіційний домен і документи, перевіряє поточні дані сайту та позначає можливі фішингові або застарілі значення.
- **`i18n` забезпечує «нульове жорстке кодування мови».** Агенти спочатку визначають, чи є проект багатомовним, і адаптуються — рядки, які відкриває користувач, проходять через рівень перекладу (next-intl / react-i18next / i18next), але ніколи не вбудовані.

---

## Command referenceКожна наведена нижче команда є командою косої риски. `<…>` позначає ваш введений текст.

### `/vorcl` — universal router
| Команда | Що він робить |
| --- | --- |
| `/vorcl <goal>` | Перетворює будь-яку ціль на завдання та направляє її потрібному субагенту, а потім запускає повний цикл до виконання. |
| `/audit [path] [focus]` | Глибокий багаторольовий аудит лише для читання → виявлені системи, результати безпеки/CVE/відмовостійкості, цільова архітектура та поетапне `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | Виявлення статичної кодової бази → на основі доказів `PROJECT_DESCRIPTION.md`; код проекту ніколи не виконується. |

### 🔵 architect — architecture
| Команда | Що він робить |
| --- | --- |
| `/architect:vorcl <goal>` | Ціль → завдання → цикл, пов'язаний з архітектурою. |
| `/architect:analyze <context>` | Проаналізуйте вимоги та контекст завдання. |
| `/architect:design <problem>` | Спроектуйте архітектуру рішення (система, DB, API). |
| `/architect:review <target>` | Перегляньте існуючу архітектуру. |

### 🏛️ principal-architect — code-grounded architecture package
| Команда | Що він робить |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Запускає велику архітектурну мету через Task Master і перевірені артефакти. |
| `/principal-architect:create [options]` | Сканує поточне сховище та створює MD, JSON, HTML, PDF, draw.io та Mermaid зі свідчень коду. |
| `/principal-architect:update [options]` | Повторно сканує існуючий пакет, записує різницю доказів і атомарно оновлює згенеровані артефакти. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Команда | Що він робить |
| --- | --- |
| `/backend:vorcl <goal>` | Ціль → завдання → цикл для бекендової роботи. |
| `/backend:create-api <endpoint>` | Створіть кінцеву точку API на модульній архітектурі, повністю охопленій OpenAPI. |
| `/backend:refactor <target>` | Рефакторинг коду без зміни поведінки. |
| `/backend:optimize <target>` | Оптимізація продуктивності. |
| `/backend:test <target>` | Згенеруйте тести для коду. |

### 🟣 frontend — React / Next.js
| Команда | Що він робить |
| --- | --- |
| `/frontend:vorcl <goal>` | Ціль → завдання → цикл роботи з фронтендом. |
| `/frontend:create-component <spec>` | Створіть компонент UI відповідно до структури функції. |
| `/frontend:refactor <target>` | Рефакторинг UI / хуки без зміни поведінки. |
| `/frontend:optimize <target>` | Оптимізуйте візуалізацію/набір/основні веб-показники. |
| `/frontend:test <target>` | Створення компонентних тестів. |

### 📱 expo-mobile — React Native / Expo

| Команда | Що він робить |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Ціль → Task Master цикл для Expo мобільної роботи. |
| `/expo-mobile:create-module <domain>` | Створіть модульний сегмент бізнесу лише з тими рівнями, які необхідні для його складності. |
| `/expo-mobile:create-screen <flow>` | Створіть тонкий маршрут Expo Router плюс екран і стани, що належать модулю. |
| `/expo-mobile:design-screen <flow>` | Створіть екран преміум-класу зі спільним дизайном/токенами руху, станами та доступністю. |
| `/expo-mobile:motion <interaction>` | Створюйте нативну навігацію, пружини, жести, тактильні дії та резервні копії зі зменшеним рухом. |
| `/expo-mobile:add-api <contract>` | Додайте схему/DTO/відповідач/ключі запиту та TanStack Query інтеграцію. |
| `/expo-mobile:audit [scope]` | Захист архітектури лише для читання та перевірка на основі доказів. |
| `/expo-mobile:ui-audit [scope]` | Система дизайну лише для читання, рух, взаємодія, доступність і аудит ефективності. |
| `/expo-mobile:compatibility [app] [change]` | Аудит сумісності Expo/RN/Node/package/native-runtime лише для читання в реальному часі з офіційними джерелами з версіями. |
| `/expo-mobile:test <scope>` | Запустіть блок домену, React Native бібліотеку тестування та Maestro перевірки. |

### 🟠 analyzer — code audit (read-only)
| Команда | Що він робить |
| --- | --- |
| `/analyzer:vorcl <goal>` | Аудит цілі за допомогою Task Master — результати стають завданнями. |
| `/analyzer:audit` | Повний аудит: помилки, типи, DB, інтерфейс інтерфейсу, бекенд запахи. |
| `/analyzer:bugs` | Пошук помилок — необроблені помилки, умови перегонів, крайні випадки. |
| `/analyzer:types` | Перевірка типу — `tsc`, `any`, небезпечні приведення, дрейф типів zod↔. |
| `/analyzer:db` | Аудит DB структура — схема, індекси, FK, N+1, міграції. |
| `/analyzer:mocks` | Маршрут сумісності для фіктивних/фальшивих даних на інтерфейсі та сервері; делегує глибокі поліглотні перевірки на цілісність. |
| `/analyzer:backend` | Знайти «поганий» бекенд-код — порушення архітектури, логіки в контролерах. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| Команда | Що він робить |
| --- | --- |
| `/integrity:vorcl <goal>` | Запускає нетривіальну мету цілісності через Task Master і перетворює результати на завдання, призначені для власника. |
| `/integrity:audit [path]` | Сканує жорсткий код і імітує витік разом, а потім доводить доступність виробництва. |
| `/integrity:hardcode [path]` | Знаходить літерали користувача/конфігурації/бізнесу, які обходять локалізацію, конфігурацію або систему запису. |
| `/integrity:mocks [path]` | Знаходить фіктивні фреймворки, підроблені генератори, кріплення, демонстраційні дані та статичні відповіді, доступні з виробництва. |

Поєднаний сканер нульової залежності підтримує TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML і Razor. У базовому коді він також позначає бізнес-значення, приховані в константах, статичних/фінальних полях, параметрах за замовчуванням, іменованих аргументах і статичних каталогах; потім аудитор порівнює їх зі схемами/моделями/репозиторіями/запитами/адміністраторськими мутаціями, щоб довести, що значення належить базі даних, а не коду чи конфігурації. Тести, фікстури, історії, приклади, початкові коди, згенерований код і корені постачальників пригнічуються за замовчуванням; лексичні кандидати не є дефектами, доки не буде доведено доступність і право власності.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Команда | Що він робить |
| --- | --- |
| `/swagger:vorcl <goal>` | Ціль повного охоплення через Task Master — перевірка → завдання → покриття → перевірка. |
| `/swagger:audit` | Лише читання: пошук маршрутів, які не повністю охоплені специфікацією. |
| `/swagger:cover <route>` | Охоплення маршруту/модуля — параметри, відповіді, описи, безпека + перевірка. |

### 🔴 firecrawl — web research
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
| `/firecrawl:agent <goal>` | Запустіть обмежене довгострокове завдання Firecrawl Agent. |
| `/firecrawl:research <query>` | Пошук статей і GitHub контекст дослідження. |
| `/firecrawl:ask <jobId>` | Діагностика невдалого завдання Firecrawl. |
| `/firecrawl:docs-search <question>` | Пошук поточної офіційної Firecrawl документації. |
| `/firecrawl:integrate <feature>` | Додайте Firecrawl до коду програми за допомогою навичок побудови. |
| `/firecrawl:deliverable <artifact>` | Створіть бриф, аудит, список потенційних клієнтів або інший артефакт робочого процесу. |`/firecrawl:setup` запускає офіційний `firecrawl-cli init --all` потік лише після підтвердження. Існуючі офіційні навички `firecrawl-*` мають пріоритет і зберігаються інсталятором Codex/Cursor; AVF надає сумісні запасні варіанти для відсутніх навичок. Операції в реальному часі здійснюються через CLI → MCP → REST/без ключа.

### 🟤 render — hosting / deploy (Render)
| Команда | Що він робить |
| --- | --- |
| `/render:vorcl <goal>` | Інфра ціль через Task Master — розгорнути/діагностувати/налаштувати для завершення. |
| `/render:deploy <service>` | Розгорнути / повторно розгорнути службу. |
| `/render:logs <service>` | Журнали обслуговування та діагностика до першопричини. |
| `/render:status <service>` | Статус служби + розгортання + показники. |
| `/render:query <sql>` | SQL лише для читання проти Render Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Команда | Що він робить |
| --- | --- |
| `/database:vorcl <goal>` | Ціль даних через Task Master — схема/запити/міграції/кеш для виконання. |
| `/database:query <query>` | Запит/аналітика лише для читання. |
| `/database:schema <target>` | Схема проектування/перегляду та цілісність даних. |
| `/database:migrate <change>` | Сплануйте безпечну оборотну міграцію схеми/даних. |
| `/database:optimize <target>` | Оптимізація — індекси, N+1, плани запитів, розбиття на сторінки. |
| `/database:cache <target>` | Redis — TTL, анулювання, блокування, обмеження швидкості, потоки. |

### ⚪ resilience — error handling + logging
| Команда | Що він робить |
| --- | --- |
| `/resilience:vorcl <goal>` | Ціль надійності через Task Master — код покриття з try/catch + logs. |
| `/resilience:harden <target>` | Загортання коду в try/catch/finally з надійним журналюванням, без тихих помилок. |
| `/resilience:logging <target>` | Додати/виправити структуроване журналювання — рівні, контекст, без секретів/ІН. |
| `/resilience:audit` | Лише для читання: пошук тихих збоїв, порожніх уловів, пропусків у журналі. |

### 🖼️ screenshot — screenshot UI → code
| Команда | Що він робить |
| --- | --- |
| `/screenshot:vorcl <goal>` | Набір екранів зі скріншотів через Task Master — розбивка → код. |
| `/screenshot:analyze <image>` | Розбивка лише для читання — макет, компоненти, маркери, стани → план. |
| `/screenshot:convert <image> [framework]` | Згенерувати повний код із знімка екрана (за замовчуванням React + Tailwind v4). |
| `/screenshot:tokens <image>` | Витягніть маркери дизайну (кольори OKLCH, типографіку, інтервали) у Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Зробіть згенерований UI адаптивним — контрольні точки, рідина, `clamp()`, запити контейнерів. |

### 🎨 design-studio — product and visual design
| Команда | Що він робить |
| --- | --- |
| `/design-studio:vorcl <goal>` | Повна мета дизайну через Task Master — контекст → варіанти → HTML → попередній перегляд → перевірка → експорт. |
| `/design-studio:create <brief>` | Створіть відшліфований самостійний візуальний артефакт або Hi-Fi UI. |
| `/design-studio:prototype <flow>` | Створіть інтерактивний веб/мобільний прототип зі станами та переходами. |
| `/design-studio:wireframe <flow>` | Створіть структуру low-fi, орієнтовану на інформаційну архітектуру та UX. |
| `/design-studio:design-system <operation>` | Створюйте, імпортуйте, компілюйте, прив’язуйте, оновлюйте або перевіряйте систему дизайну. |
| `/design-studio:import <type> <source>` | Імпортуйте Figma `.fig`, GitHub або HTML/CSS з походженням. |
| `/design-studio:deck <brief>` | Створіть колоду HTML із нотатками доповідача, анімацією та додатковим редагованим PPTX. |
| `/design-studio:document <brief>` | Створіть готовий для друку документ, резюме, записку, односторінковий лист або звіт. |
| `/design-studio:animation <brief>` | Створіть артефакт руху та за бажанням відтворіть його у форматі MP4. |
| `/design-studio:research <question>` | Створіть артефакт візуального дослідження на основі джерела. |
| `/design-studio:export <project> <format>` | Експортуйте в автономний формат HTML, PDF, PPTX, MP4 або у формат handoff. |
| `/design-studio:review <target>` | Візуальний, UX, реагуючий, a11y і огляд системи дизайну лише для читання. |

### 🔎 visual-research — screenshot → verified web answer
| Команда | Що він робить |
| --- | --- |
| `/visual-research:vorcl <goal>` | Багатоетапне дослідження скріншотів через Task Master. |
| `/visual-research:identify <image>` | Визначте сайт, сторінку та функцію з достовірними доказами. |
| `/visual-research:search <image> <target>` | Знайдіть справжню сторінку чи офіційну документацію за візуальними підказками. |
| `/visual-research:answer <image> <question>` | Відповідайте, використовуючи скріншоти, офіційні документи та актуальні дані. |
| `/visual-research:hints <image> <goal>` | Надайте безпечні, підтверджені документацією кроки для видимого інтерфейсу. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Команда | Що він робить |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Знайти/зрозуміти/змінити існуючий UI зі знімка екрана за допомогою Task Master — карта → завдання → делегувати. |
| `/pinpoint:locate <image>` | Знайдіть наявний компонент/файл(и) на знімку екрана — `file:line`, без нового коду. |
| `/pinpoint:route <image>` | Визначте маршрут/сторінку, на якій знаходиться екран (Next.js Маршрутизатор програм/сторінок, React Маршрутизатор). |
| `/pinpoint:control <image>` | Визначте точний елемент керування (кнопку/поле) та його обробник у коді. |
| `/pinpoint:trace <target>` | Простежте логіку за елементом — обробник → стан → вибірка даних → API. || `/pinpoint:handoff <change>` | Створіть точний запит на редагування на основі існуючого коду та делегуйте `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Команда | Що він робить |
| --- | --- |
| `/drawio:vorcl <goal>` | Набір діаграм через Task Master — збірка готова. |
| `/drawio:create <description> [type]` | Побудуйте діаграму з текстового опису (дійсний рідний XML). |
| `/drawio:pmp <type> <project>` | Побудуйте діаграму PMP/PMBOK — WBS, PERT/CPM, Gantt, RACI, матриця ризиків, сітка зацікавлених сторін. |
| `/drawio:convert <source> [type]` | Перетворення джерела на діаграму — DB схема → ERD, папки → дерево, код → UML, русалка/CSV/JSON. |
| `/drawio:refine <file>` | Удосконалення наявного `.drawio` — макет, тема, додавання/видалення вузлів, вирівнювання за сіткою. |

### 🗺️ archmap — architecture map from code| Команда | Що він робить |
| --- | --- |
| `/archmap:vorcl <goal>` | Мета відображення через Task Master — створити перевірений набір артефактів. |
| `/archmap:map [repo]` | Повний конвеєр: вилучення → `architecture.json` → LLM анотація → усі формати (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Лише витяг — машинозчитуваний `architecture.json` із `source:{file,line}` на кожному вузлі. |
| `/archmap:annotate [json]` | LLM збагачення існуючого `architecture.json` (пам’ять агента, семантика потоку даних); недоведені факти, автоматично понижені до `inferred`. |
| `/archmap:html [json]` | Інтерактивна самодостатня HTML карта — перемикання шарів, трасування променів, вузол → панель `file:line`, пошук, друк CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (багатосторінковий: Огляд / ERD / API / Агенти) та/або Mermaid перегляди, перевірені. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Команда | Що він робить |
| --- | --- |
| `/mermaid:vorcl <goal>` | Набір діаграм за допомогою Task Master — збірка готова (перевірено рендерингом). |
| `/mermaid:create <description> [type]` | Побудуйте діаграму з опису — дійсний синтаксис, перевірений реальним рендером; передає вам файл. |
| `/mermaid:convert <source> [type]` | Перетворіть джерело на Mermaid — DB схему → ER, код → клас/послідовність, папки → блок-схему, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Синтаксис + реальний рендер-тест; знайти та виправити помилки (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Експортувати до SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Удосконалити наявний `.mmd` — напрямок, підграф, classDef/стилі, читабельність. |

### 🧪 testing — tests & verification
| Команда | Що він робить |
| --- | --- |
| `/testing:vorcl <goal>` | Мета тестування/перевірки через Task Master — одиниця + інтеграція + e2e до завершення. |
| `/testing:unit <file\|module>` | Модульні тести (Vitest/Jest) — щасливий шлях, межі, помилки; запускає їх і показує результат. |
| `/testing:integration <endpoint\|module>` | Тести інтеграції (Supertest/inject, real DB або testcontainers). |
| `/testing:e2e <scenario>` | Playwright E2E для критичного шляху користувача — селектори ролей, фікстури, трасування в разі збою. |
| `/testing:verify <task\|testStrategy>` | Виконує `testStrategy` завдання та повертає вердикт ГОТОВИЙ / НЕ ГОТОВИЙ із реальним результатом. |
| `/testing:coverage [path]` | Звіт про покриття з висновками — який критичний код неперевірений; створює завдання. |
| `/testing:flaky <test>` | Діагностує нестабільний тест (гонка, час, спільний стан, імітація) і виправляє його назавжди. |

### 🌿 gitflow — git workflow & releases
| Команда | Що він робить |
| --- | --- |
| `/gitflow:vorcl <goal>` | Ціль git/release через Task Master (підготувати випуск, очистити історію, розгалуження функцій). |
| `/gitflow:commit <files\|scope>` | Коміт за іменем (ніколи `git add .`) із повідомленням «Звичайні коміти»; зупиняється на невідомому WIP. |
| `/gitflow:pr <base> <title>` | Розгалуження → фіксує → запит на вилучення (gh / GitHub MCP) із перевіркою що/чому/як. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Ведення журналу змін), створений із комітів між тегами. |
| `/gitflow:release <version\|auto>` | Semver із комітів → синхронізувати версії маніфесту → тег → GitHub випуск. Натискайте лише після явного підтвердження. |
| `/gitflow:audit [branch]` | Аудит історії лише для читання: порушення конвенцій, фіксація дампу, великі блоби, гілки-сиріти. |

### 🛡️ security — security audit (read-only)
| Команда | Що він робить |
| --- | --- |
| `/security:vorcl <goal>` | Ціль безпеки через Task Master — аудит → результати → завдання → делеговані виправлення. |
| `/security:secrets [path\|branch]` | Секрети в робочому дереві ТА історії git (усі гілки); `${VAR:-}` Заповнювачі не є секретами. |
| `/security:owasp [path]` | Топ-10 OWASP у коді: ін’єкції, XSS, автентифікація, доступ до даних, CORS/cookie — із підтвердженням file:line. |
| `/security:deps` | CVE залежностей через npm аудит/файли блокування — рівень серйозності, прапорці порушення зміни. |
| `/security:pii [path]` | Ризики PII/GDPR: електронні листи, телефони, картки в коді та журналах; приватні шляхи розробника. |
| `/security:pre-push [branch]` | Швидка комбінована перевірка змінених файлів перед натисканням: секрети + ін'єкції + ідентифікаційна інформація; зелений/червоний вердикт. |

### 📝 docs — documentation
| Команда | Що він робить |
| --- | --- |
| `/docs:vorcl <goal>` | Мета документування через Task Master. |
| `/docs:readme [path]` | Створити/оновити README — what/quickstart/usage/config/troubleshooting; перевірені приклади; мовні версії синхронізовано. |
| `/docs:api [spec]` | API документи, створені на основі OpenAPI специфікації (кінцеві точки, параметри, приклади curl); пропонує `/swagger:audit`, якщо немає спец. |
| `/docs:architecture` | ARCHITECTURE.md — модулі, межі, потік даних; діаграми, делеговані `mermaid`/`drawio`. || `/docs:contributing` | CONTRIBUTING.md — налаштування, структура, тести, правила фіксації (відповідно до `gitflow`), PR-процес. |
| `/docs:release-notes <version>` | Примітки до випуску для версії з CHANGELOG/history. |
| `/docs:audit` | Документи лише для читання↔перевірка дрейфу коду: непрацюючі посилання, застарілі приклади/лічильники, несинхронізовані переклади. |

### 🐳 devops — containers & CI/CD
| Команда | Що він робить |
| --- | --- |
| `/devops:vorcl <goal>` | Інфраструктурна ціль через Task Master. |
| `/devops:dockerfile [app-type]` | Написати/переглянути Dockerfile — багатоетапний, тонкий базовий, некореневий, HEALTHCHECK; перевірено справжнім `docker build`. |
| `/devops:compose` | docker-compose.yml для локальних розробників (додаток + БД); env зміни потребують `--force-recreate`, чекає здорового. |
| `/devops:ci [type]` | GitHub Дії — робочий процес PR (lint+typecheck+test, npm кеш), робочий процес розгортання, мінімальні дозволи. |
| `/devops:env` | Env-variable inventory: де читати, що потрібно, `.env.example` шаблон; секрети ніколи не в образах. |
| `/devops:monitoring` | Структуровані журнали (pino/JSON), кінцева точка здоров’я, про що сповіщати; Візуалізація показників через агента `render`. |

### 📡 liveboard — ephemeral local operations board
| Команда | Що він робить |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Запустіть відшліфовану інформаційну панель на 43 мовах на безкоштовному локальному порту; Task Master змінюється потік через SSE та узгоджується кожні 5 хвилин. |
| `/liveboard:vorcl <goal>` | Розробіть або змініть саму liveboard за допомогою необхідного Task Master робочого процесу. |

Liveboard читає Git робочі дерева, локальні процеси Claude/Codex/Cursor та `.taskmaster/tasks/tasks.json` кожного робочого дерева. Стан виконання залишається в пам’яті та зникає, коли активний процес зупиняється. UI визначає мову браузера та пропонує 43 мови, зокрема англійську, російську, українську, німецьку, французьку, іспанську, португальську, італійську, польську, турецьку, китайську, японську, арабську, голландську, чеську, словацьку, румунську, угорську, болгарську, сербську, хорватську, словенську, грецьку, іврит, перську, хінді, бенгальську, урду, індонезійську, малайську, в’єтнамську, тайську, корейську, Шведська, норвезька, датська, фінська, естонська, латвійська, литовська, грузинська, вірменська та азербайджанська. Арабська, іврит, перська та урду використовують розкладку RTL.

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

## Configuration (MCP & keys)

У пакеті **немає віддаленого сервера чи бази даних**. Додатковий liveboard — це процес, який виконується в пам’яті лише на локальному хості. MCP Серверам потрібні токени, і **кожен користувач надає свої власні**. Щоб ця робота працювала однаково в **Claude Code, Codex, Cursor та Kimi CLI** — незалежно від того, запускаєте ви з терміналу чи з Dock / Spotlight / IDE — кожен сервер stdio MCP запускається через невелику програму запуску (`bin/mcp-env.mjs`), яка зчитує ваші ключі з **одного файлу**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Інсталятор створює його з [`.env.example`](../.env.example). Відкрийте його та введіть лише ключі, якими ви користуєтеся:

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

> **Чому програма запуску замість `~/.zshrc`?** Розширення змінної env відрізняється залежно від середовища виконання (`${VAR:-}` у Claude, `${env:VAR}` у Cursor, літерали у Codex/Kimi), і кожне середовище виконання зчитує лише середовище, у якому **його** було запущено. GUI / IDE запускається на macOS не джерело `~/.zshrc`, тому експортовані ключі невидимі, а сервери ні до чого не підключаються — класичний Помилка "MCP env не встановлено". Читання з одного файлу `.env` усуває обидві проблеми одночасно.

**Пріоритет** (пізніше виграє): спільний `~/.config/agent-vorcl-flow/.env` → a `./.env` в корені проекту → справжній `export` у вашій оболонці. Зберігайте глобальні ключі в спільному файлі, замінюйте проект (наприклад, інший `MONGODB_URI`) проектом `.env`, і справжній експорт оболонки все одно виграє для CLI запусків. Ви можете навести панель запуску на інший файл за допомогою `AGENT_VORCL_ENV_FILE=/path/.env`.Сервер, для якого відсутній необхідний ключ, просто **не запускається** — ви побачите однорядковий `[agent-vorcl-flow] MCP «…» is not configured: …` у журналі MCP середовища виконання, а всі інші сервери продовжують працювати. Додайте ключ до `.env` та перезапустіть. (Ви можете зберегти імена `GITHUB_TOKEN`/`MONGODB_URI` — програма запуску зіставляє їх із `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING`, які очікують сервери.)

> ⚠️ **Потрібно для команд Task Master на основі ШІ:** налаштуйте принаймні одного вибраного постачальника — `ANTHROPIC_API_KEY` для Claude, `OPENAI_API_KEY` для GPT або Codex CLI OAuth. Без облікових даних для моделі, вибраної в `.taskmaster/config.json`, `/vorcl` не може створювати або розширювати завдання.

Виберіть, який Task Master постачальник фактично виконує генерацію; одні ключі не вибирають модель:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Команда використовує офіційний потік `task-master models` і зберігає лише вибір моделі в `.taskmaster/config.json`. `PERPLEXITY_API_KEY` є необов’язковим і потрібним лише тоді, коли як модель дослідження вибрано Perplexity.

Віддалені сервери **vercel** і **render** використовують OAuth (авторизуйтеся за допомогою `/mcp` у браузері). Для Render in headless/CI встановіть `RENDER_API_KEY` у вашому середовищі та додайте запис заголовка Bearer до цього сервера для вашого середовища виконання.

---

## Verify the install

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

Репозиторій тепер містить власний маніфест плагіна Codex на `.codex-plugin/plugin.json`. Інсталятор npm залишається доступним і встановлює ті самі можливості, що й **навички**, **профілі** та `AGENTS.md` маршрутизатор для Codex CLI, Cursor та Kimi:

| Claude Code | Codex еквівалент |
| --- | --- |
| субагент `@agent-vorcl-flow:frontend` | майстерність персони `$frontend` + `codex --profile frontend` |
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

Дивіться [`codex/README.md`](../codex/README.md) для повного відображення.

---

## Cursor

Cursor використовує той самий відкритий `SKILL.md` формат, що й адаптер Codex, а також власні субагенти та глобальну конфігурацію MCP:

| Agent-Vorcl-Flow концепція | Cursor еквівалент |
| --- | --- |
| роль `backend` | індивідуальний субагент `/avf-backend` у `~/.cursor/agents` |
| команда завдання `/backend:create-api` | навик `/backend-create-api` |
| універсальний `/vorcl` | навик `/vorcl` |
| `.mcp.json` | об’єднані сервери в `~/.cursor/mcp.json` |

Інсталятор перетворює визначення ролей на Cursor frontmatter, додає субагентам префікс `avf-`, щоб уникнути зіткнень імен навичок, використовує `model: inherit` і позначає агентів лише для аудиту як `readonly: true`. Існуючі записи MCP сервера з такими ж іменами зберігаються. Див. [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) оригінально завантажує навички агента, спеціальні файли агентів і перехоплювачі життєвого циклу; AVF також об’єднує ті самі MCP сервери, що використовуються Claude та Cursor:

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

Kimi CLI не має розширення `${VAR}` у `mcp.json`, тому ключі надходять зі спільного `.env` через панель запуску — так само, як і інші середовища виконання. Див. [`kimi/README.md`](../kimi/README.md).

---

## Project structure

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       25 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (73 skills; some ship references, scripts, tests or HTML assets)
commands/     <namespace>/<command>.md    (150 commands, /namespace:command, including /vorcl and /audit)
hooks/        hooks.json + SessionStart + PostToolUse guards (empty catch, Expo architecture/UI boundaries)
.mcp.json     github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, mermaid
.env.example  template for ~/.config/agent-vorcl-flow/.env (single key file for all runtimes)
translations/ localized README files (21 translations)
bin/          install.mjs (the npx installer) + mcp-env.mjs (cross-runtime MCP launcher / .env loader)
codex/        GPT Codex adapter (skills + config.toml + install.sh)
cursor/       Cursor adapter (MCP template + installation notes)
kimi/         Kimi CLI adapter (skills install + Expo agent/hook + MCP)
```

**Як це поєднується:** `agents/*.md` оголосити роль і, у першому випадку `skills:`, приєднати навички → навички в `skills/*/SKILL.md` автоматично завантажуються за описом → `commands/<agent>/*.md` надають швидкі `/agent:command` ярлики, які делегують субагенту → `.mcp.json` надають агентам свої інструменти, кожен із яких запускається через `bin/mcp-env.mjs`, який завантажує секрети зі спільного `.env`. `SessionStart` гачок повідомляє Claude, що агенти доступні.

---

## License

MIT — вільне використання, копіювання, зміна та розповсюдження; надається «як є», без гарантій і відповідальності. Дивіться [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
