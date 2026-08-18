<div align="center">

# Agent-Vorcl-Flow

**Екип от специализирани AI подагенти за [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) и [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — с умения, команди и MCP инструменти.**
Една команда `npx` ги инсталира. Без отдалечен бекенд или облачен хостинг: вашият кодиращ агент изпълнява всичко локално.

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

[English](../README.md) · [Русский](./README.ru.md) · [Українська](./README.uk.md) · [Deutsch](./README.de.md) · [Français](./README.fr.md) · [Español](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[**Български**](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 72c33da6cabafc1329d572eb271a485d678403c7f9b5e6a96911fd227cabbc6c. -->

</div>

---

## What is this?

Agent-Vorcl-Flow превръща поддържан кодиращ агент в **структуриран инженерен екип**. Вместо един общ асистент, вие получавате **25 фокусирани под-агента** (архитект, базиран на код главен архитект, бекенд, фронтенд, Expo мобилен инженер, инженер по продуктов и визуален дизайн, DB инженер, одитор на интегритета на различни езици, картограф на архитектура, оператор на liveboard и други), всеки със собствени **умения** на домейн, бързи **команди с наклонена черта** и необходимите **MCP инструменти**. Всяка нетривиална задача преминава през дисциплиниран **Task Master** цикъл — *цел → задачи → изпълнение → проверка → готово* — така че работата се планира, проследява и оцелява при прекъсвания.

- 🧩 **25 подагента**, 71 умения, 155 команди с наклонена черта
- ⚡ **Инсталиране с една команда** за Claude Code, Codex, Cursor и/или Kimi CLI — `npx`
- 🔌 **11 MCP сървъра** свързани (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, файлова система, Task Master, Mermaid)
- 🔑 **Един `.env` файл за всички изпълнения** — ключовете се четат от стартер, а не от `~/.zshrc`, така че работят дори от GUI/IDE стартирания; няма отдалечена AVF услуга; liveboard е само за локален хост и ефимерен
- 🤝 **Работи на Claude Code, GPT Codex, Cursor и Kimi CLI** от един и същ източник

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** и/или **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Насочване към едно време за изпълнение с флаг:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Какво прави инсталаторът:

| Време на изпълнение | Действие |
| --- | --- |
| **Споделен слой** | Копира програмата за стартиране в `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` и създава `~/.config/agent-vorcl-flow/.env` от шаблона (веднъж) — единствен ключов файл за всяко време на изпълнение. |
| **Claude Code** | Регистрира това репо като **пазар** на приставка и активира приставката (чрез `claude plugin …`, с директен резервен `~/.claude/settings.json`). |
| **GPT Codex** | Обединява уменията в `~/.agents/skills` и блоковете `config.toml` + `AGENTS.md` в `~/.codex` (идемпотентен, между маркерите). |
| **Cursor** | Инсталира умения в `~/.cursor/skills`, нативни потребителски подагенти в `~/.cursor/agents` и обединява липсващи сървъри в `~/.cursor/mcp.json`. |
| **Kimi CLI** | Инсталира умения в `~/.kimi/skills`, нативния Expo персонализиран агент в `~/.kimi/agents`, както Expo архитектура/UI се свързва в `~/.kimi/config.toml`, така и обединява MCP сървъри. |

> Инсталаторът никога не попълва вашите тайни — той само създава празно `.env` от шаблона. Добавяте ключове там (вижте [Configuration](#configuration-mcp--keys)).

### Update to the latest version

Стартирайте инсталатора отново с маркера npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

За да актуализирате само едно време за изпълнение, запазете същия флаг за изпълнение, който сте използвали по време на инсталирането:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

Актуализацията покрива управлявани от Agent-Vorcl-Flow умения, агенти, кукички, стартер и конфигурационни блокове. Той запазва вашето съществуващо `~/.config/agent-vorcl-flow/.env` и неговите тайни непроменени и запазва уменията нагоре по веригата Firecrawl. След това рестартирайте актуализирания клиент за кодиране (или стартирайте `/reload-plugins` в Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

След инсталирането **рестартирайте Claude Code** (или стартирайте `/reload-plugins` в отворена сесия), за да заредите агентите.

---

## How to use

Примерите в този раздел използват Claude Code синтаксис; вижте съпоставянията [Cursor](#cursor) и [GPT Codex](#gpt-codex) по-долу за техния естествен синтаксис. В Claude Code има **три начина** за извикване на екипа.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` определя кой подагент трябва да притежава работата и задвижва пълния Task Master цикъл. `/audit` автоматично открива бекенда, предния край, мобилните устройства, данните и инфраструктурата и пише базирано на доказателства `PROJECT_AUDIT.md` използване на всички съответни роли. `/init-code` чете хранилището статично и създава базирано на доказателства `PROJECT_DESCRIPTION.md` без да изпълнява код на проекта. След като този файл съществува, всяка модифицираща роля трябва да поддържа засегнатите си секции синхронизирани; доказано описание дрейф блокира изпълнението на задачата.

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

Всеки агент също има своя собствена входна точка `/<agent>:vorcl`, която изпълнява цикъла Task Master, обхванат от този агент.

### The Task Master loop
Всяка нетривиална задача преминава през **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Това поддържа работата планирана, контролна точка и възможност за възобновяване - нищо не се обявява за "свършено", без да премине стъпката за проверка.

---

## The agents| Агент | Роля | Акценти |
| --- | --- | --- |
| 🔵 **архитект** | Архитект на системи и решения | Анализ на изискванията, дизайн на системата/DB/API, прегледи на архитектурата |
| 🏛️ **главен архитект** | Основен софтуер / инфраструктура / AI архитект | Сканира реален код на 11 езика и създава подкрепени с доказателства MD, JSON, HTML, PDF, draw.io и Mermaid; актуализации при пълно повторно сканиране запазват анотации |
| 🟢 **бекенд** | Backend разработчик | Възел/TS, Postgres, Redis; модулна архитектура; всеки маршрут, изцяло покрит от OpenAPI |
| 🟣 **преден интерфейс** | Frontend (React 19 / Next.js App Router) | Компоненти, състояние, извличане на данни, оптимизиране на рендиране/пакет, тестове |
| 📱 **expo-mobile** | React Native + Expo инженер | Модулна архитектура плюс система за дизайн/движение/взаимодействие, собствена навигация, токени, жестове, хаптика, намалено движение |
| 🟠 **анализатор** | Одитор на код (само за четене) | Грешки, безопасност на типа, структура DB, подигравки на интерфейса, миризми на задния край |
| 🧭 **интегритет** | Одитор за интегритет на междуезичен код (само за четене) | Производствен твърд код и изтичане на макет/фалшив/демо/фикстура през интерфейс/бекенд/мобилен/споделен |
| 🟡 **перчене** | OpenAPI/Swagger покритие (всеки стек) | Намира маршрути, които не са напълно документирани и ги покрива с проверка |
| 🔴 **firecrawl** | Уеб изследовател | Живи CLI/MCP/REST, интеграция на приложения и завършени работни потоци с уеб данни |
| 🟤 **изобразяване** | Хостинг и внедряване (Render) | Внедрявания, управлявана от журнал диагностика, показатели, env vars, Render Postgres |
| 🟦 **база данни** | DB инженер / DBA | Схема, заявки и планове, индекси, N+1, безопасни обратими миграции, кеш |
| ⚪ **устойчивост** | Надеждност: грешки + регистриране | опит/улавяне в правилните граници, въведени грешки, повторни опити/изчакване, структурирани регистрационни файлове |
| 🖼️ **екранна снимка** | Екранна снимка UI → код | Превръща UI екранна снимка в готов за производство, отзивчив и достъпен код |
| 🎨 **дизайн-студио** | Студио за продуктов и визуален дизайн | Локални HTML артефакти, прототипи, телени рамки, палуби/PPTX, документи, анимация, 3D, системи за проектиране и импортиране на Figma/GitHub/HTML; адаптирано от MIT `JimLiu/baoyu-design` |
| 🔎 **визуално изследване** | Екранна снимка → потвърден отговор | Идентифицира сайта/страницата, намира официални документи, проверява данни на живо и отговаря с URL адреси и увереност |
| 🎯 **точна точка** | Екранна снимка → място в съществуващ проект (само за четене) | Основава екранна снимка на работещо приложение в реалната кодова база — компонент, `file:line`, маршрут/страница, точното управление и логиката зад него; не създава нищо, делегира редактирането |
| 📊 **drawio** | Диаграми (draw.io / diagrams.net) | Блок-схема, BPMN, UML, ERD, мрежа/облак и PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Архитектурен картограф | Детерминиран код → `architecture.json` (всеки възел с `source:{file,line}`) → интерактивна HTML карта, draw.io, Mermaid, ARCHITECTURE.md, PDF; недоказаните факти са отбелязани с `inferred` |
| 🧜 **русалка** | Mermaid диаграми (+ реално изобразяване) | блок-схема, последователност, клас, състояние, ER, gantt, gitGraph, mindmap…; потвърдено чрез mcp-mermaid/`mmdc`; ви дава файла (`.mmd` + SVG/PNG/PDF) |
| 🧪 **тестване** | Инженер за изпитване и проверка | Единица (Vitest/Jest), интеграция (Supertest), E2E (Playwright), покритие, търсене на нестабилен тест; изпълнява `testStrategy` на всяка задача — нищо не е „свършено“ без зелено изпълнение |
| 🌿 **gitflow** | Git работен процес и издания | Конвенционални ангажименти, ангажименти по име (никога `git add .`), PR, Keep-a-Changelog, издания на semver; натискане само с изрично потвърждение |
| 🛡️ **сигурност** | Одитор на сигурността (само за четене) | Тайни в историята на дървото и git, Топ 10 на OWASP, CVE на зависимости, PII; констатациите стават задачи — поправките се делегират || 📝 **документи** | Инженер по документация | README (многоезичен паритет), API документи от OpenAPI, АРХИТЕКТУРА, ПРИНОС, бележки по изданието; всеки пример, проверен спрямо кода |
| 🐳 **devops** | Контейнери и CI/CD | Многоетапни Dockerfiles, docker-compose за локални разработки, GitHub Actions тръбопроводи, env/secrets хигиена, мониторинг |
| 📡 **liveboard** | Местен оперативен съвет | Живи Git работни дървета, процеси на агенти и Task Master задачи на ефимерно табло за управление на локален хост |

**Няколко неща, които си струва да знаете:**
- **Frontend винаги говори с истински API.** Спецификацията OpenAPI на бекенда е единственият източник на истина; типовете се генерират от него (`openapi-typescript` + `openapi-fetch`). Без подигравки в производствения път.
- **`database` мутациите изискват изрично потвърждение.** Анализите са само за четене; промените в схемата/данните (DDL/DML/миграции) никога не се изпълняват без вашето разрешение.
- **`resilience` доставя предпазна кука.** Неблокираща `PostToolUse` кука (`catch-guard.js`) внимателно маркира празни `catch {}` блокове във файловете, които току-що сте редактирали.
- **`archmap` никога не черпи от въображение.** Извличането и изобразяването са строго разделени: скриптове с нулева зависимост обхождат репото в `architecture.json` (бази данни с реална FK кардиналност, API маршрути, AI агенти с техните модели/инструменти/памет, графика за импортиране, env) и всяка диаграма се изобразява само от това JSON. Всичко, което LLM добавя без проверимо `file:line`, се маркира принудително с `inferred:true` и се чертае с пунктир.
- **`principal-architect` е пълният работен поток за публикуване на архитектура.** Работи във всяко хранилище, което стартира агента, игнорира претенциите на Markdown като доказателство за топология, използва пакетен офлайн Tree-sitter WASM за TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin и Swift, първо пише `ARCHITECTURE.md`, след това произвежда споделения JSON модел, самостоятелен HTML, PDF, собствен draw.io и копируем Mermaid L0–L4. `update` извършва пълно повторно сканиране и запазва анотациите и неуправляваните файлове.
- **`pinpoint` намира, никога не създава.** Като се има екранна снимка на работещо приложение, то картографира екрана към реалния код — компонент, маршрут, точното управление и логиката зад него — и предава редакцията на `frontend`/`backend`. Работи върху това, което вече съществува (обратно на `screenshot`).
- **`visual-research` проверява вместо да гадае.** Той третира екранна снимка като доказателство, потвърждава официалния домейн и документи, проверява текущите данни на сайта и маркира възможни фишинг или остарели стойности.
- **`i18n` налага "нулево езиково твърдо кодиране."** Агентите първо откриват дали даден проект е многоезичен и се адаптират - обърнатите към потребителя низове преминават през слой за превод (next-intl / react-i18next / i18next), никога вградени.

---

## Command referenceВсяка команда по-долу е команда с наклонена черта. `<…>` маркира въведеното от вас.

### `/vorcl` — universal router
| Команда | Какво прави |
| --- | --- |
| `/vorcl <goal>` | Превръща всяка цел в задачи и я насочва към правилния подагент, след което изпълнява пълния цикъл до изпълнение. |
| `/audit [path] [focus]` | Задълбочен многоролев одит само за четене → открити системи, констатации за сигурност/CVE/устойчивост, целева архитектура и поетапно `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | Откриване на статична кодова база → базирано на доказателства `PROJECT_DESCRIPTION.md`; кодът на проекта никога не се изпълнява. |

### 🔵 architect — architecture
| Команда | Какво прави |
| --- | --- |
| `/architect:vorcl <goal>` | Цел → задачи → цикъл, обхванат от архитектурата. |
| `/architect:analyze <context>` | Анализирайте изискванията и контекста на задачата. |
| `/architect:design <problem>` | Проектирайте архитектурата на решението (система, DB, API). |
| `/architect:review <target>` | Преглед на съществуваща архитектура. |

### 🏛️ principal-architect — code-grounded architecture package
| Команда | Какво прави |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Изпълнява голяма архитектурна цел чрез Task Master и проверени артефакти. |
| `/principal-architect:create [options]` | Сканира текущото хранилище и създава MD, JSON, HTML, PDF, draw.io и Mermaid от доказателства за код. |
| `/principal-architect:update [options]` | Пълно повторно сканиране на съществуващ пакет, записва разлика в доказателствата и атомарно опреснява генерираните артефакти. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Команда | Какво прави |
| --- | --- |
| `/backend:vorcl <goal>` | Цел → задачи → цикъл за бекенд работа. |
| `/backend:create-api <endpoint>` | Генерирайте API крайна точка на модулната архитектура, изцяло покрита от OpenAPI. |
| `/backend:refactor <target>` | Рефакторинг на код без промяна на поведението. |
| `/backend:optimize <target>` | Оптимизация на производителността. |
| `/backend:test <target>` | Генерирайте тестове за кода. |

### 🟣 frontend — React / Next.js
| Команда | Какво прави |
| --- | --- |
| `/frontend:vorcl <goal>` | Цел → задачи → цикъл за фронтенд работа. |
| `/frontend:create-component <spec>` | Генерирайте компонент UI, следвайки структурата на функцията. |
| `/frontend:refactor <target>` | Рефакторинг UI / куки без промяна на поведението. |
| `/frontend:optimize <target>` | Оптимизиране на изобразяване / пакет / основни уеб показатели. |
| `/frontend:test <target>` | Генерирайте компонентни тестове. |

### 📱 expo-mobile — React Native / Expo

| Команда | Какво прави |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Цел → Task Master цикъл за Expo мобилна работа. |
| `/expo-mobile:create-module <domain>` | Създайте модулен бизнес сегмент само със слоевете, от които се нуждае неговата сложност. |
| `/expo-mobile:create-screen <flow>` | Създайте тънък Expo Router маршрут плюс притежаван от модул екран и състояния. |
| `/expo-mobile:design-screen <flow>` | Изградете първокласен екран със споделен дизайн/токени за движение, състояния и достъпност. |
| `/expo-mobile:motion <interaction>` | Проектирайте естествена навигация, пружини, жестове, хаптики и резервни варианти с намалено движение. |
| `/expo-mobile:add-api <contract>` | Добавете ключове за схема/DTO/картограф/заявка и TanStack Query интеграция. |
| `/expo-mobile:audit [scope]` | Защита на архитектурата само за четене и одит, основан на доказателства. |
| `/expo-mobile:ui-audit [scope]` | Система за проектиране само за четене, движение, взаимодействие, достъпност и одит на ефективността. |
| `/expo-mobile:compatibility [app] [change]` | Одит на съвместимостта само за четене на живо Expo/RN/Node/package/native-runtime спрямо официални източници с версии. |
| `/expo-mobile:test <scope>` | Изпълнете единица на домейн, React Native Библиотека за тестване и Maestro проверки. |

### 🟠 analyzer — code audit (read-only)
| Команда | Какво прави |
| --- | --- |
| `/analyzer:vorcl <goal>` | Одитирайте цел чрез Task Master — констатациите стават задачи. |
| `/analyzer:audit` | Пълен одит: бъгове, типове, DB, подигравки на интерфейса, миризми на задния интерфейс. |
| `/analyzer:bugs` | Търсене на грешки — необработени грешки, условия на състезание, крайни случаи. |
| `/analyzer:types` | Проверка на типа — `tsc`, `any`, несигурни отливки, отклонение на zod↔типове. |
| `/analyzer:db` | Одит DB структура — схема, индекси, FK, N+1, миграции. |
| `/analyzer:mocks` | Маршрут за съвместимост за фалшиви/фалшиви данни на преден и бекенд; делегира задълбочени полиглот проверки на целостта. |
| `/analyzer:backend` | Намерете „лош“ бекенд код — нарушения на архитектурата, логика в контролерите. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| Команда | Какво прави |
| --- | --- |
| `/integrity:vorcl <goal>` | Изпълнява нетривиална цел за интегритет чрез Task Master и превръща констатациите в специфични за собственика задачи. |
| `/integrity:audit [path]` | Сканира заедно твърд код и фалшиво изтичане, след което доказва достъпността на продукцията. |
| `/integrity:hardcode [path]` | Намира потребителски/конфигурационни/бизнес литерали, които заобикалят локализацията, конфигурацията или системата за запис. |
| `/integrity:mocks [path]` | Намира фалшиви рамки, фалшиви генератори, приспособления, демонстрационни данни и статични отговори, достъпни от производството. |

Включеният скенер с нулева зависимост поддържа TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML и Razor. В бекенд кода той също маркира бизнес стойности, скрити в константи, статични/крайни полета, параметри по подразбиране, именувани аргументи и статични каталози; след това одиторът ги сравнява със схеми/модели/репозитории/заявки/административни мутации, за да докаже, че базата данни, а не кодът или конфигурацията, притежава стойността. Тестове, приспособления, истории, примери, семена, генериран код и корени на доставчика са потиснати по подразбиране; лексикалните кандидати не са дефекти, докато не се докаже достъпността и собствеността.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Команда | Какво прави |
| --- | --- |
| `/swagger:vorcl <goal>` | Цел за пълно покритие чрез Task Master — одит → задачи → покритие → проверка. |
| `/swagger:audit` | Само за четене: намиране на маршрути, които не са напълно обхванати от спецификацията. |
| `/swagger:cover <route>` | Покрийте маршрут/модул — параметри, отговори, описания, сигурност + проверка. |

### 🔴 firecrawl — web research
| Команда | Какво прави |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Изследователска цел чрез Task Master — събирайте уеб данни до завършен резултат. |
| `/firecrawl:search <query>` | Уеб търсене на източници по въпрос. |
| `/firecrawl:scrape <url>` | Изтрийте един URL адрес в markdown/JSON. |
| `/firecrawl:map <url>` | Карта на URL адресите на сайт. |
| `/firecrawl:crawl <url>` | Рекурсивно обхождане на раздел/сайт. |
| `/firecrawl:extract <url>` | Структурирано извличане по JSON схема. |
| `/firecrawl:setup` | Инсталирайте/проверете CLI плюс официални умения за изграждане и работен процес (с потвърждение). |
| `/firecrawl:interact <url>` | Щракнете, навигирайте или попълнете формуляри, когато изтриването е недостатъчно. |
| `/firecrawl:parse <file>` | Анализирайте локален/личен документ в markdown или JSON. |
| `/firecrawl:monitor <action>` | Избройте проверките или управлявайте монитори за повтарящи се промени на страници. |
| `/firecrawl:agent <goal>` | Изпълнете ограничена дългосрочна Firecrawl Agent задача. |
| `/firecrawl:research <query>` | Търсете статии и GitHub изследователски контекст. |
| `/firecrawl:ask <jobId>` | Диагностицирайте неуспешна Firecrawl задача. |
| `/firecrawl:docs-search <question>` | Търсете текущата официална Firecrawl документация. |
| `/firecrawl:integrate <feature>` | Добавете Firecrawl към кода на приложението чрез умения за изграждане нагоре по веригата. |
| `/firecrawl:deliverable <artifact>` | Създайте кратка информация, одит, списък с потенциални клиенти или друг артефакт на работния процес. |`/firecrawl:setup` изпълнява официалния `firecrawl-cli init --all` поток само след потвърждение. Съществуващите официални `firecrawl-*` умения имат предимство и се запазват от Codex/Cursor инсталатора; AVF предоставя съвместими резервни варианти за липсващи умения. Маршрут за операции на живо през CLI → MCP → REST/без ключ.

### 🟤 render — hosting / deploy (Render)
| Команда | Какво прави |
| --- | --- |
| `/render:vorcl <goal>` | Инфра цел чрез Task Master — внедряване/диагностика/конфигуриране до готово. |
| `/render:deploy <service>` | Внедрете / преразположете услуга. |
| `/render:logs <service>` | Сервизни регистрационни файлове и диагностика до основната причина. |
| `/render:status <service>` | Състояние на услугата + внедряване + показатели. |
| `/render:query <sql>` | SQL само за четене срещу Render Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Команда | Какво прави |
| --- | --- |
| `/database:vorcl <goal>` | Цел за данни чрез Task Master — схема/заявки/миграции/кеш за готово. |
| `/database:query <query>` | Заявка/аналитика само за четене. |
| `/database:schema <target>` | Схема за проектиране/преглед и цялост на данните. |
| `/database:migrate <change>` | Планирайте безопасна, обратима миграция на схема/данни. |
| `/database:optimize <target>` | Оптимизиране — индекси, N+1, планове за заявки, пагинация. |
| `/database:cache <target>` | Redis — TTL, анулиране, ключалки, ограничаване на скоростта, потоци. |

### ⚪ resilience — error handling + logging
| Команда | Какво прави |
| --- | --- |
| `/resilience:vorcl <goal>` | Цел за надеждност чрез Task Master — покривен код с try/catch + регистрационни файлове. |
| `/resilience:harden <target>` | Обвийте кода в try/catch/finally със стабилно регистриране, без тихи грешки. |
| `/resilience:logging <target>` | Добавяне/коригиране на структурирано регистриране — нива, контекст, без тайни/ПИИ. |
| `/resilience:audit` | Само за четене: намиране на тихи повреди, празни уловки, пропуски в регистриране. |

### 🖼️ screenshot — screenshot UI → code
| Команда | Какво прави |
| --- | --- |
| `/screenshot:vorcl <goal>` | Набор от екрани от екранни снимки чрез Task Master — разбивка → код. |
| `/screenshot:analyze <image>` | Разбивка само за четене — оформление, компоненти, токени, състояния → план. |
| `/screenshot:convert <image> [framework]` | Генериране на пълен изпълняваем код от екранна снимка (по подразбиране React + Tailwind v4). |
| `/screenshot:tokens <image>` | Извлечете жетони за дизайн (OKLCH цветове, типография, интервали) в Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Направете генерирания UI отзивчив — точки на прекъсване, течност, `clamp()`, заявки за контейнери. |

### 🎨 design-studio — product and visual design
| Команда | Какво прави |
| --- | --- |
| `/design-studio:vorcl <goal>` | Пълна цел на дизайна чрез Task Master — контекст → варианти → HTML → визуализация → проверка → експортиране. |
| `/design-studio:create <brief>` | Създайте полиран самостоятелен визуален артефакт или hi-fi UI. |
| `/design-studio:prototype <flow>` | Изградете интерактивен уеб/мобилен прототип със състояния и преходи. |
| `/design-studio:wireframe <flow>` | Изградете ниско-фи кабелна рамка, фокусирана върху информационната архитектура и UX. |
| `/design-studio:design-system <operation>` | Създавайте, импортирайте, компилирайте, свързвайте, опреснявайте или проверявайте система за проектиране. |
| `/design-studio:import <type> <source>` | Импортирайте Figma `.fig`, GitHub или HTML/CSS с произход. |
| `/design-studio:deck <brief>` | Създайте HTML палуба с бележки на говорителя, анимации и опционален редактируем PPTX. |
| `/design-studio:document <brief>` | Създайте готов за отпечатване документ, автобиография, бележка, едностраницен лист или отчет. |
| `/design-studio:animation <brief>` | Създайте артефакт на движение и по желание го рендирайте в MP4. |
| `/design-studio:research <question>` | Създайте артефакт за визуално изследване, подкрепен от източник. |
| `/design-studio:export <project> <format>` | Експортирайте в самостоятелен HTML, PDF, PPTX, MP4 или формат за предаване. |
| `/design-studio:review <target>` | Визуален преглед само за четене, UX, responsive, a11y и дизайн на системата. |

### 🔎 visual-research — screenshot → verified web answer
| Команда | Какво прави |
| --- | --- |
| `/visual-research:vorcl <goal>` | Многоетапно изследване на екранни снимки чрез Task Master. |
| `/visual-research:identify <image>` | Идентифицирайте сайта, страницата и функцията с уверени доказателства. |
| `/visual-research:search <image> <target>` | Намерете истинската страница или официалната документация от визуални улики. |
| `/visual-research:answer <image> <question>` | Отговорете, като използвате доказателства от екранни снимки, официални документи и текущи данни на живо. |
| `/visual-research:hints <image> <goal>` | Дайте безопасни, подкрепени с документация стъпки за видимия интерфейс. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Команда | Какво прави |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Намерете/разберете/променете съществуващ UI от екранна снимка чрез Task Master — карта → задачи → делегат. |
| `/pinpoint:locate <image>` | Намерете съществуващия компонент/файл(ове) от екранна снимка — `file:line`, без нов код. |
| `/pinpoint:route <image>` | Идентифицирайте маршрута/страницата, на която е екранът (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <image>` | Посочете точния контрол (бутон/поле) и неговия манипулатор в кода. |
| `/pinpoint:trace <target>` | Проследете логиката зад елемент — манипулатор → състояние → извличане на данни → API. || `/pinpoint:handoff <change>` | Създайте прецизна заявка за редактиране спрямо съществуващ код и делегирайте на `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Команда | Какво прави |
| --- | --- |
| `/drawio:vorcl <goal>` | Набор от диаграми чрез Task Master — изграждане до готово. |
| `/drawio:create <description> [type]` | Изградете диаграма от текстово описание (валиден собствен XML). |
| `/drawio:pmp <type> <project>` | Изградете диаграма PMP/PMBOK — WBS, PERT/CPM, Gantt, RACI, матрица на риска, мрежа на заинтересованите страни. |
| `/drawio:convert <source> [type]` | Преобразувайте източник в диаграма — DB схема → ERD, папки → дърво, код → UML, русалка/CSV/JSON. |
| `/drawio:refine <file>` | Прецизиране на съществуващо `.drawio` — оформление, тема, добавяне/премахване на възли, подравняване към мрежата. |

### 🗺️ archmap — architecture map from code| Команда | Какво прави |
| --- | --- |
| `/archmap:vorcl <goal>` | Цел за картографиране чрез Task Master — изграждане до проверен набор от артефакти. |
| `/archmap:map [repo]` | Пълен конвейер: извличане → `architecture.json` → LLM анотация → всички формати (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Само извличане — машинно четимо `architecture.json` с `source:{file,line}` на всеки възел. |
| `/archmap:annotate [json]` | LLM обогатяване на съществуващ `architecture.json` (памет на агент, семантика на потока от данни); недоказани факти, автоматично понижени до `inferred`. |
| `/archmap:html [json]` | Интерактивна самостоятелна HTML карта — превключване на слоеве, проследяване на лъчи, възел → `file:line` панел, търсене, отпечатване на CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (мултистраници: Общ преглед / ERD / API / Агенти) и/или Mermaid изгледи, валидирани. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Команда | Какво прави |
| --- | --- |
| `/mermaid:vorcl <goal>` | Набор от диаграми чрез Task Master — компилиране до готово (проверено рендиране). |
| `/mermaid:create <description> [type]` | Изградете диаграма от описание — валиден синтаксис, проверен от реален рендер; ви дава файла. |
| `/mermaid:convert <source> [type]` | Преобразувайте източник в Mermaid — DB схема → ER, код → клас/последователност, папки → блок-схема, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Синтаксис + реален рендер тест; намиране и коригиране на грешки (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Експортиране в SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Прецизиране на съществуващ `.mmd` — посока, подграф, classDef/стилове, четливост. |

### 🧪 testing — tests & verification
| Команда | Какво прави |
| --- | --- |
| `/testing:vorcl <goal>` | Цел за тестване/проверка чрез Task Master — единица + интеграция + e2e до готово. |
| `/testing:unit <file\|module>` | Единични тестове (Vitest/Jest) — щастлив път, граници, грешки; ги изпълнява и показва резултата. |
| `/testing:integration <endpoint\|module>` | Интеграционни тестове (Супертест/инжектиране, истински DB или тестови контейнери). |
| `/testing:e2e <scenario>` | Playwright E2E за критичен потребителски път — селектори на роли, фиксиране, проследяване при повреда. |
| `/testing:verify <task\|testStrategy>` | Изпълнява `testStrategy` на задача и връща решение ГОТОВ / НЕ ГОТОВ с реален резултат. |
| `/testing:coverage [path]` | Доклад за покритие с констатации — кой критичен код не е тестван; създава задачи. |
| `/testing:flaky <test>` | Диагностицира нестабилен тест (раса, време, споделено състояние, подигравки) и го коригира завинаги. |

### 🌿 gitflow — git workflow & releases
| Команда | Какво прави |
| --- | --- |
| `/gitflow:vorcl <goal>` | Цел на git/release чрез Task Master (подготвяне на издание, почистване на хронологията, клон на функциите). |
| `/gitflow:commit <files\|scope>` | Комит по име (никога `git add .`) със съобщение за конвенционални ангажименти; спира на неизвестен WIP. |
| `/gitflow:pr <base> <title>` | Разклонение → извършва → заявка за изтегляне (gh / GitHub MCP) с потвърдено какво/защо/как. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Поддържане на регистър на промените), генериран от ангажименти между тагове. |
| `/gitflow:release <version\|auto>` | Semver от ангажименти → синхронизиране на версии на манифест → етикет → GitHub освобождаване. Push само след изрично потвърждение. |
| `/gitflow:audit [branch]` | Одит на хронологията само за четене: нарушения на конвенцията, ангажименти за изхвърляне, големи петна, оставени клонове. |

### 🛡️ security — security audit (read-only)
| Команда | Какво прави |
| --- | --- |
| `/security:vorcl <goal>` | Цел за сигурност чрез Task Master — одит → констатации → задачи → делегирани корекции. |
| `/security:secrets [path\|branch]` | Тайни в работното дърво И git история (всички клонове); `${VAR:-}` Заместителите не са тайни. |
| `/security:owasp [path]` | Топ 10 на OWASP в кода: инжекции, XSS, удостоверяване, излагане на данни, CORS/бисквитки — с доказателство за файл:ред. |
| `/security:deps` | CVE на зависимост чрез npm одит/файлове за заключване — сериозност, флагове за нарушаване на промяната. |
| `/security:pii [path]` | PII/GDPR рискове: имейли, телефони, карти в код и регистрационни файлове; частни пътища на разработчика. |
| `/security:pre-push [branch]` | Бърза комбинирана проверка на променени файлове преди натискане: тайни + инжекции + PII; зелена/червена присъда. |

### 📝 docs — documentation
| Команда | Какво прави |
| --- | --- |
| `/docs:vorcl <goal>` | Цел за документиране чрез Task Master. |
| `/docs:readme [path]` | Създаване/актуализиране на README — what/quickstart/usage/config/troubleshooting; проверени примери; синхронизирани езикови версии. |
| `/docs:api [spec]` | API документи, генерирани от OpenAPI спецификацията (крайни точки, параметри, curl примери); предлага `/swagger:audit`, ако няма спец. |
| `/docs:architecture` | ARCHITECTURE.md — модули, граници, поток от данни; диаграми, делегирани на `mermaid`/`drawio`. || `/docs:contributing` | CONTRIBUTING.md — настройка, структура, тестове, конвенции за ангажиране (подравнени с `gitflow`), PR процес. |
| `/docs:release-notes <version>` | Бележки по изданието за версия от CHANGELOG/history. |
| `/docs:audit` | Документи само за четене↔проверка на отклонение на кода: повредени връзки, остарели примери/броячи, несинхронизирани преводи. |

### 🐳 devops — containers & CI/CD
| Команда | Какво прави |
| --- | --- |
| `/devops:vorcl <goal>` | Инфраструктурна цел чрез Task Master. |
| `/devops:dockerfile [app-type]` | Напишете/прегледайте Dockerfile — многостепенна, тънка основа, не-root, HEALTHCHECK; потвърдено от реално `docker build`. |
| `/devops:compose` | docker-compose.yml за локални разработчици (приложение + DB); env промените се нуждаят от `--force-recreate`, чака здравословен. |
| `/devops:ci [type]` | GitHub Действия — PR работен процес (lint+typecheck+test, npm кеш), внедряване на работен процес, минимални разрешения. |
| `/devops:env` | Env-variable опис: къде се чете, какво се изисква, `.env.example` шаблон; тайни никога в изображения. |
| `/devops:monitoring` | Структурирани регистрационни файлове (pino/JSON), крайна точка на здравето, за какво да предупреждавате; Изобразяване на показатели чрез агента `render`. |

### 📡 liveboard — ephemeral local operations board
| Команда | Какво прави |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Стартирайте изпипано табло за управление на 43 езика на безплатен локален хост порт; Task Master променя потока през SSE и съгласува на всеки 5 минути. |
| `/liveboard:vorcl <goal>` | Разработете или променете самото табло на живо чрез необходимия Task Master работен процес. |

Liveboard чете Git работни дървета, локални Claude/Codex/Cursor процеси и `.taskmaster/tasks/tasks.json` на всяко работно дърво. Състоянието на изпълнение остава в паметта и изчезва, когато процесът на преден план спре. UI разпознава езика на браузъра и предлага 43 локализации, включително английски, руски, украински, немски, френски, испански, португалски, италиански, полски, турски, китайски, японски, арабски, холандски, чешки, словашки, румънски, унгарски, български, сръбски, хърватски, словенски, гръцки, иврит, персийски, хинди, бенгалски, урду, индонезийски, малайски, виетнамски, тайландски, корейски, Шведски, норвежки, датски, финландски, естонски, латвийски, литовски, грузински, арменски и азербайджански. Арабски, иврит, персийски и урду използват RTL оформление.

Директна конфигурация:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: проект, чиито Git работни дървета и Task Master файлове се сканират.
- `--port 0`: автоматично избира свободен порт.
- `--interval`: пълен интервал на съгласуване в милисекунди; гледане на файлове неподвижни потоци Task Master се променя незабавно.
- Крайни точки: `/health`, `/api/snapshot`, `/api/events` (SSE) и `POST /api/refresh`.
- Запазете `--host 127.0.0.1`, освен ако изрично не възнамерявате да изложите информация за проекта в мрежата.

---

## Configuration (MCP & keys)

Пакетът няма **няма отдалечен бекенд или база данни**. Допълнителното табло на живо е процес в паметта само на локален хост. MCP сървърите се нуждаят от токени и **всеки потребител предоставя свои собствени**. За да може това да работи еднакво в **Claude Code, Codex, Cursor и Kimi CLI** — и независимо дали стартирате от терминал или от Dock / Spotlight / IDE — всеки stdio MCP сървър се стартира чрез малък стартер (`bin/mcp-env.mjs`), който чете вашите ключове от **един файл**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Инсталаторът го създава от [`.env.example`](../.env.example). Отворете го и попълнете само ключовете, които използвате:

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

> **Защо стартер вместо `~/.zshrc`?** Разширяването на Env-var се различава за време на изпълнение (`${VAR:-}` в Claude, `${env:VAR}` в Cursor, литерали в Codex/Kimi) и всяко време на изпълнение чете само средата, в която **то** е стартирано. GUI / IDE стартира на macOS не източник `~/.zshrc`, така че експортираните ключове са невидими и сървърите не се свързват с нищо – класическото Грешка „MCP env не е зададена“. Четенето от един `.env` файл премахва и двата проблема наведнъж.

**Предимство** (по-късно печели): споделеният `~/.config/agent-vorcl-flow/.env` → a `./.env` в корена на проекта → истински `export` във вашата обвивка. Запазете глобалните ключове в споделения файл, заменете за всеки проект (напр. различен `MONGODB_URI`) с проект `.env` и експортирането на оригинална обвивка все още печели за CLI изпълнения. Можете да насочите стартовия панел към друг файл с `AGENT_VORCL_ENV_FILE=/path/.env`.Сървър, чийто изискван ключ липсва, просто **не стартира** — ще видите едноредов `[agent-vorcl-flow] MCP «…» is not configured: …` в MCP журнала на средата за изпълнение и всеки друг сървър продължава да работи. Добавете ключа към `.env` и рестартирайте. (Можете да запазите `GITHUB_TOKEN`/`MONGODB_URI` имена — програмата за стартиране ги съпоставя с `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING`, които сървърите очакват.)

> ⚠️ **Изисква се за захранвани с изкуствен интелект Task Master команди:** конфигурирайте поне един избран доставчик — `ANTHROPIC_API_KEY` за Claude, `OPENAI_API_KEY` за GPT или Codex CLI OAuth. Без идентификационни данни за модела, избран в `.taskmaster/config.json`, `/vorcl` не може да генерира или разширява задачи.

Изберете кой Task Master доставчик всъщност управлява генерирането; само ключовете не избират модела:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Командата използва официалния поток `task-master models` и съхранява само избора на модел в `.taskmaster/config.json`. `PERPLEXITY_API_KEY` не е задължително и е необходимо само когато Perplexity е избрано като изследователски модел.

Отдалечените сървъри **vercel** и **render** използват OAuth (упълномощаване с `/mcp` в браузър). За Render in headless/CI, задайте `RENDER_API_KEY` във вашата среда и добавете запис в заглавката на Bearer към този сървър за вашето време за изпълнение.

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

Хранилището вече включва оригинален Codex манифест на приставка на `.codex-plugin/plugin.json`. Инсталаторът npm остава наличен и инсталира същите възможности като **умения**, **профили** и `AGENTS.md` рутер за Codex CLI, Cursor и Kimi:

| Claude Code | Codex еквивалент |
| --- | --- |
| подагент `@agent-vorcl-flow:frontend` | умение персона `$frontend` + `codex --profile frontend` |
| команда `/analyzer:audit` | умение за изпълнение на задачи `$analyzer-audit` |
| команда `/vorcl` | умение за изпълнение на задачи `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` в `config.toml` |
| `SessionStart` кука | ролева маршрутизация в `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Вижте [`codex/README.md`](../codex/README.md) за пълното картографиране.

---

## Cursor

Cursor използва същия отворен `SKILL.md` формат като Codex адаптера, плюс нативни персонализирани субагенти и глобална MCP конфигурация:

| Agent-Vorcl-Flow концепция | Cursor еквивалент |
| --- | --- |
| роля `backend` | потребителски субагент `/avf-backend` в `~/.cursor/agents` |
| команда за задача `/backend:create-api` | умение `/backend-create-api` |
| универсален `/vorcl` | умение `/vorcl` |
| `.mcp.json` | обединени сървъри в `~/.cursor/mcp.json` |

Инсталаторът преобразува дефинициите на ролите в Cursor frontmatter, префиксира подагентите с `avf-`, за да избегне сблъсъци между имена на умения, използва `model: inherit` и маркира агентите само за одит като `readonly: true`. Съществуващите MCP сървърни записи със същите имена се запазват. Вижте [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) първоначално зарежда агентски умения, персонализирани агентски файлове и кукички за жизнения цикъл; AVF също обединява същите MCP сървъри, използвани от Claude и Cursor:

| Agent-Vorcl-Flow концепция | Kimi CLI еквивалент |
| --- | --- |
| умения / команди за задачи | `~/.kimi/skills` и `/skill:<name>` |
| Expo персонализиран агент | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse guard | обединени в `~/.kimi/config.toml` |
| `.mcp.json` | обединени сървъри в `~/.kimi/mcp.json` |
| ключов файл за време на изпълнение | споделеното `~/.config/agent-vorcl-flow/.env` (чрез стартовия панел) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI няма разширение `${VAR}` в `mcp.json`, така че ключовете идват от споделеното `.env` чрез стартовия панел — точно както другите изпълнения. Вижте [`kimi/README.md`](../kimi/README.md).

---

## Project structure

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       25 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (71 skills; some ship references, scripts, tests or HTML assets)
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

**Как се вписва:** `agents/*.md` декларирайте роля и, в преден план `skills:`, прикрепете умения → уменията в `skills/*/SKILL.md` се зареждат автоматично чрез описание → `commands/<agent>/*.md` предоставят бързи `/agent:command` преки пътища, които делегират на подагента → `.mcp.json` предоставя на агентите техните инструменти, всеки стартиран чрез `bin/mcp-env.mjs`, който зарежда тайни от споделеното `.env`. Кука `SessionStart` казва Claude, че агентите са налични.

---

## License

MIT — безплатно използване, копиране, модифициране и разпространение; предоставено "както е", без гаранция и отговорност. Вижте [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
