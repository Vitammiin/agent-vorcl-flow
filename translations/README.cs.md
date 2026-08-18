<div align="center">

# Agent-Vorcl-Flow

**Tým specializovaných dílčích agentů AI pro [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) a [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — s dovednostmi, příkazy a MCP nástroji.**
Jeden `npx` příkaz je nainstaluje. Žádný vzdálený backend nebo cloud hosting: váš kódovací agent provozuje vše lokálně.

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
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [**Čeština**](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 3321a7089b3f749787125626da692c98b8a2d556b237e1ba36bbf67afc34dc3d. -->

</div>

---

## What is this?

Agent-Vorcl-Flow změní podporovaného kódovacího agenta na **strukturovaný inženýrský tým**. Namísto jednoho obecného asistenta získáte **25 zaměřených dílčích agentů** (architekt, kódově založený hlavní architekt, backend, frontend, Expo mobilní inženýr, produktový a vizuální designový inženýr, DB inženýr, auditor integrity mezi jazyky, kartograf architektury, operátor liveboardu a další), každý s vlastní doménou **dovednosti**, které potřebuje, rychlé**** a **přelomené příkazy**.**. Každý netriviální úkol prochází disciplinovanou **Task Master** smyčkou — *cíl → úkoly → implementovat → ověřit → hotovo* — takže práce je plánována, sledována a přečkává přerušení.

- 🧩 **25 podagentů**, 73 dovedností, 155 příkazů lomítka
- ⚡ **Instalace jedním příkazem** pro Claude Code, Codex, Cursor a/nebo Kimi CLI — `npx`
- 🔌 **11 MCP serverů** připojených kabelem (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, souborový systém, Task Master, Mermaid)
- 🔑 **Jeden soubor `.env` pro všechna běhová prostředí** – klíče čte spouštěč, nikoli `~/.zshrc`, takže fungují i při spuštění GUI/IDE; žádná vzdálená služba AVF; liveboard je pouze localhost a pomíjivý
- 🤝 **Běží na Claude Code, GPT Codex, Cursor a Kimi CLI** ze stejného zdroje

---

## Quick start

### Requirements
- **Node.js ≥ 18**
– **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** a/nebo **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Zacilte jedno běhové prostředí pomocí příznaku:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Co dělá instalační program:

| Doba běhu | Akce |
| --- | --- |
| **Sdílená vrstva** | Zkopíruje spouštěč do `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` a vytvoří `~/.config/agent-vorcl-flow/.env` ze šablony (jednou) – soubor jediného klíče pro každé běhové prostředí. |
| **Claude Code** | Registruje toto repo jako plugin **marketplace** a povolí plugin (přes `claude plugin …`, s přímou `~/.claude/settings.json` záložní). |
| **GPT Codex** | Sloučí dovednosti do `~/.agents/skills` a bloky `config.toml` + `AGENTS.md` do `~/.codex` (idempotentní, mezi značkami). |
| **Cursor** | Nainstaluje dovednosti do `~/.cursor/skills`, nativní vlastní subagenty do `~/.cursor/agents` a sloučí chybějící servery do `~/.cursor/mcp.json`. |
| **Kimi CLI** | Nainstaluje dovednosti do `~/.kimi/skills`, nativního vlastního agenta Expo do `~/.kimi/agents`, jak architekturu Expo/UI zavěsí do `~/.kimi/config.toml`, tak sloučí servery MCP. |

> Instalační program nikdy nevyplňuje vaše tajemství – pouze vytvoří ze šablony prázdný `.env`. Zde přidáte klíče (viz [Configuration](#configuration-mcp--keys)).

### Update to the latest version

Spusťte znovu instalační program se značkou npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

Chcete-li aktualizovat pouze jedno běhové prostředí, ponechte stejný příznak běhového prostředí, jaký jste použili při instalaci:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

Aktualizace překrývá dovednosti spravované Agent-Vorcl-Flow, agenty, háčky, spouštěč a konfigurační bloky. Udržuje vaše stávající `~/.config/agent-vorcl-flow/.env` a jeho tajemství nezměněné a zachovává upstream Firecrawl dovednosti. Poté restartujte aktualizovaného kódovacího klienta (nebo spusťte `/reload-plugins` v Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Po instalaci **restartujte Claude Code** (nebo spusťte `/reload-plugins` v otevřené relaci), aby se agenti načetli.

---

## How to use

Příklady v této části používají syntaxi Claude Code; jejich nativní syntaxi naleznete v mapování [Cursor](#cursor) a [GPT Codex](#gpt-codex) níže. V Claude Code existují **tři způsoby**, jak vyvolat tým.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` zjistí, který sub-agent by měl dílo vlastnit, a řídí celý Task Master cyklus. `/audit` automaticky detekuje backend, frontend, mobilní zařízení, data a infrastrukturu a sepisuje důkazy založené `PROJECT_AUDIT.md` pomocí všech relevantních rolí. `/init-code` čte úložiště staticky a vytváří `PROJECT_DESCRIPTION.md` založený na důkazech bez provádění kódu projektu. Jakmile tento soubor existuje, musí každá modifikující role udržovat své dotčené sekce synchronizované; osvědčený popis drift blokuje dokončení úkolu.

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

Každý agent má také svůj vlastní vstupní bod `/<agent>:vorcl`, který spouští smyčku Task Master v rozsahu k danému agentovi.

### The Task Master loop
Každý netriviální úkol prochází **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Díky tomu je práce plánovaná, kontrolovaná a obnovitelná – nic není prohlášeno za „hotové“, aniž by prošlo ověřovacím krokem.

---

## The agents| Agent | Role | Hlavní body |
| --- | --- | --- |
| 🔵 **architekt** | Architekt systémů a řešení | Analýza požadavků, systém/DB/API design, recenze architektury |
| 🏛️ **hlavní architekt** | Hlavní software / infrastruktura / architekt AI | Skenuje skutečný kód v 11 jazycích a vytváří MD, JSON, HTML, PDF, draw.io a Mermaid podložené důkazy; aktualizace po úplném opětovném skenování zachovávají anotace |
| 🢢 **backend** | Backendový vývojář | Uzel/TS, Postgres, Redis; modulární architektura; každá trasa plně pokrytá OpenAPI |
| 🟣 **frontend** | Frontend (React 19 / Next.js App Router) | Komponenty, stav, načítání dat, optimalizace renderu/balíčku, testy |
| 📱 **expo-mobil** | React Native + Expo inženýr | Modulární architektura plus systém designu/pohybu/interakce, nativní navigace, tokeny, gesta, haptika, omezený pohyb |
| 🠠 **analyzátor** | Auditor kódu (pouze pro čtení) | Chyby, typová bezpečnost, DB struktura, frontendové falešné, backendové pachy |
| 🧭 **integrita** | Auditor integrity mezijazykového kódu (pouze pro čtení) | Produkční pevný kód a únik falešného/falešného/dema/přípravku přes frontend/backend/mobil/sdílený |
| 🡨 **swagger** | OpenAPI/Swagger pokrytí (libovolná sada) | Vyhledá cesty, které nejsou plně zdokumentovány, a pokryje je s ověřením |
| 🔴 **firecrawl** | Webový výzkumník | Živé CLI/MCP/REST, integrace aplikací a hotové pracovní toky webových dat |
| 🤤 **vykreslení** | Hosting a nasazení (vykreslení) | Nasazení, diagnostika řízená protokoly, metriky, proměnné prostředí, vykreslení Postgres |
| 🦠 **databáze** | DB inženýr / DBA | Schéma, dotazy a plány, indexy, N+1, bezpečné vratné migrace, mezipaměť |
| ⚪ **odolnost** | Spolehlivost: chyby + protokolování | zkuste/chytněte na správných hranicích, typové chyby, opakování/časové limity, strukturované protokoly |
| 🖼️ **snímek obrazovky** | Snímek obrazovky UI → kód | Promění snímek obrazovky UI na přístupný kód připravený k produkci |
| 🎨 **design-studio** | Studio produktového a vizuálního designu | Místní HTML artefakty, prototypy, drátěné modely, balíčky/PPTX, dokumenty, animace, 3D, designové systémy a import Figma/GitHub/HTML; převzato z MIT `JimLiu/baoyu-design` |
| 🔎 **vizuální výzkum** | Snímek obrazovky → ověřená odpověď | Identifikuje web/stránku, najde oficiální dokumenty, zkontroluje živá data a odpoví pomocí URL a důvěryhodně |
| 🎯 **špička** | Snímek obrazovky → umístit do existujícího projektu (pouze pro čtení) | Ukotví snímek obrazovky spuštěné aplikace do skutečné kódové báze – komponenta, `file:line`, trasa/stránka, přesné ovládání a logika za tím; nevytvoří nic, deleguje úpravy |
| 📊 **drawio** | Diagramy (draw.io / diagrams.net) | Vývojový diagram, BPMN, UML, ERD, síť/cloud a PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Kartograf architektury | Deterministický kód → `architecture.json` (každý uzel s `source:{file,line}`) → interaktivní HTML mapa, draw.io, Mermaid, ARCHITECTURE.md, PDF; neprokázaná fakta jsou označena `inferred` |
| 🧜 **mořská panna** | Mermaid diagramy (+ skutečný render) | vývojový diagram, sekvence, třída, stav, ER, Gantt, gitGraph, mapa mysli…; ověřeno přes mcp-mermaid/`mmdc`; vám předá soubor (`.mmd` + SVG/PNG/PDF) |
| 🧪 **testování** | Testovací a ověřovací technik | Jednotka (Vitest/Jest), integrace (Supertest), E2E (Playwright), pokrytí, lov flaky-test; provede `testStrategy` každého úkolu — bez zeleného běhu se nic „nedělá“ |
| 🌿 **gitflow** | Git workflow & releases | Konvenční závazky, závazky podle jména (nikdy `git add .`), PR, Keep-a-Changelog, semver releases; push pouze s výslovným potvrzením |
| 🛡️ **bezpečnost** | Bezpečnostní auditor (pouze pro čtení) | Secrets in tree & git history, OWASP Top 10, CVE závislosti, PII; zjištění se stávají úkoly – opravy jsou delegovány || 📝 **docs** | Dokumentační inženýr | README (vícejazyčná parita), API dokumenty z OpenAPI, ARCHITECTURE, CONTRIBUTING, poznámky k vydání; každý příklad ověřen proti kódu |
| 🐳 **devops** | Nádoby & CI/CD | Vícefázové soubory Dockerfiles, docker-compose pro místní vývojáře, GitHub kanály akcí, hygiena env/tajemství, monitorování |
| 📡 **živé prkno** | Místní provozní rada | Živé Git pracovní stromy, procesy agentů a Task Master úkoly na pomíjivém řídicím panelu localhost |

**Pár věcí, které stojí za to vědět:**
- **Frontend vždy mluví se skutečným API.** Specifikace backendu OpenAPI je jediným zdrojem pravdy; se z něj generují typy (`openapi-typescript` + `openapi-fetch`). Žádné zesměšňování v cestě výroby.
- **`database` mutace vyžadují výslovné potvrzení.** Analytics jsou pouze pro čtení; změny schématu/dat (DDL/DML/migrace) nikdy neproběhnou bez vašeho souhlasu.
- **`resilience` dodává bezpečnostní háček.** Neblokující háček `PostToolUse` (`catch-guard.js`) jemně označí prázdné `catch {}` bloky v souborech, které jste právě upravili.
- **`archmap` nikdy nečerpá z představivosti.** Extrakce a vykreslování jsou přísně odděleny: skripty s nulovou závislostí vloží repo do `architecture.json` (databáze se skutečnou kardinalitou FK, API trasy, agenti AI s jejich modely/nástroji/pamětí, importní graf, env) a každý diagram je vykreslen pouze z tohoto JSON. Vše, co LLM přidá bez ověřitelného `file:line`, je vynuceno `inferred:true` a nakresleno čárkovaně.
- **`principal-architect` je kompletní pracovní postup publikace architektury.** Funguje v jakémkoli úložišti spouští agenta, ignoruje tvrzení Markdown jako důkaz topologie, používá přibalený offline Tree-sitter WASM pro TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin a Swift, nejprve zapíše `/backend:vorcl <goal>`, poté vytvoří samostatný model, vytvoří samostatný PDF, nativní draw.io a kopírovatelné Mermaid L0–L4. `update` provede úplné opětovné skenování a zachová anotace a nespravované soubory.
- **`pinpoint` najde, nikdy nevytvoří.** Díky snímku obrazovky spuštěné aplikace namapuje obrazovku na skutečný kód – komponentu, trasu, přesné ovládání a logiku za tím – a úpravu předá `frontend`/`backend`. Funguje na tom, co již existuje (převrácená hodnota k `screenshot`).
- **`visual-research` místo hádání ověřuje.** Snímek obrazovky považuje za důkaz, potvrzuje oficiální doménu a dokumenty, kontroluje aktuální data webu a označí možné phishingové nebo zastaralé hodnoty.
- **`i18n` vynucuje „pevné kódování nulového jazyka“.** Agenti nejprve zjistí, zda je projekt vícejazyčný, a přizpůsobí se – řetězce pro uživatele procházejí vrstvou překladu (next-intl / reag-i18next / i18next), nikdy nejsou vložené.

---

## Command referenceKaždý níže uvedený příkaz je lomítko. `<…>` označuje váš vstup.

### `/vorcl` — universal router
| Příkaz | Co to dělá |
| --- | --- |
| `/vorcl <goal>` | Promění jakýkoli cíl na úkoly a nasměruje je ke správnému podřízenému agentovi a poté spustí celý cyklus, aby bylo hotovo. |
| `/audit [path] [focus]` | Hluboký vícerolový audit pouze pro čtení → detekované systémy, zjištění bezpečnosti/CVE/odolnosti, cílová architektura a fázované `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | Statické objevování kódové báze → evidence-based `PROJECT_DESCRIPTION.md`; kód projektu se nikdy nespustí. |

### 🔵 architect — architecture
| Příkaz | Co to dělá |
| --- | --- |
| `/architect:vorcl <goal>` | Cíl → úkoly → cyklus, v rozsahu do architektury. |
| `/architect:analyze <context>` | Analyzujte požadavky a kontext úkolu. |
| `/architect:design <problem>` | Navrhněte architekturu řešení (systém, DB, API). |
| `/architect:review <target>` | Zkontrolujte existující architekturu. |

### 🏛️ principal-architect — code-grounded architecture package
| Příkaz | Co to dělá |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Spouští velký cíl architektury prostřednictvím Task Master a ověřených artefaktů. |
| `/principal-architect:create [options]` | Prohledá aktuální úložiště a vytvoří MD, JSON, HTML, PDF, draw.io a Mermaid z evidence kódu. |
| `/principal-architect:update [options]` | Plně znovu naskenuje existující balíček, zapíše důkazový rozdíl a atomicky obnoví generované artefakty. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Příkaz | Co to dělá |
| --- | --- |
|  | Cíl → úkoly → cyklus pro backendovou práci. |
| `/backend:create-api <endpoint>` | Vygenerujte koncový bod API na modulární architektuře, plně pokrytý OpenAPI. |
| `/backend:refactor <target>` | Refaktorujte kód bez změny chování. |
| `/backend:optimize <target>` | Optimalizace výkonu. |
| `/backend:test <target>` | Vygenerujte testy pro kód. |

### 🟣 frontend — React / Next.js
| Příkaz | Co to dělá |
| --- | --- |
| `/frontend:vorcl <goal>` | Cíl → úkoly → cyklus pro frontendovou práci. |
| `/frontend:create-component <spec>` | Vygenerujte komponent UI podle struktury funkcí. |
| `/frontend:refactor <target>` | Refaktor UI / háčky beze změny chování. |
| `/frontend:optimize <target>` | Optimalizujte render / balíček / Core Web Vitals. |
| `/frontend:test <target>` | Generování testů součástí. |

### 📱 expo-mobile — React Native / Expo

| Příkaz | Co to dělá |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Cíl → Task Master cyklus pro Expo mobilní práci. |
| `/expo-mobile:create-module <domain>` | Vytvořte modulární obchodní řez pouze s vrstvami, které vyžaduje jeho složitost. |
| `/expo-mobile:create-screen <flow>` | Vytvořte tenkou trasu Expo Router plus obrazovku a stavy vlastněné modulem. |
| `/expo-mobile:design-screen <flow>` | Sestavte si prémiovou obrazovku se sdílenými tokeny designu/pohybu, stavy a přístupností. |
| `/expo-mobile:motion <interaction>` | Navrhněte nativní navigaci, pružiny, gesta, haptiku a nouzová řešení se sníženým pohybem. |
| `/expo-mobile:add-api <contract>` | Přidejte klíče schématu/DTO/mapovač/dotaz a integraci TanStack Query. |
| `/expo-mobile:audit [scope]` | Ochrana architektury pouze pro čtení a audit založený na důkazech. |
| `/expo-mobile:ui-audit [scope]` | Designový systém pouze pro čtení, pohyb, interakce, přístupnost a audit výkonu. |
| `/expo-mobile:compatibility [app] [change]` | Živý audit kompatibility Expo/RN/Node/package/native-runtime pouze pro čtení s verzemi oficiálních zdrojů. |
| `/expo-mobile:test <scope>` | Spusťte doménovou jednotku, React Native Testing Library a Maestro kontroly. |

### 🟠 analyzer — code audit (read-only)
| Příkaz | Co to dělá |
| --- | --- |
| `/analyzer:vorcl <goal>` | Auditujte cíl pomocí Task Master — zjištění se stávají úkoly. |
| `/analyzer:audit` | Úplný audit: chyby, typy, DB, frontend zesměšňování, backend pachy. |
| `/analyzer:bugs` | Hunt bugs — neošetřené chyby, závodní podmínky, hraniční případy. |
| `/analyzer:types` | Kontrola typu — `tsc`, `any`, nebezpečné náhozy, posun typu zod↔. |
| `/analyzer:db` | Audit DB struktura — schéma, indexy, FK, N+1, migrace. |
| `/analyzer:mocks` | Cesta kompatibility pro falešná/falešná data na frontendu a backendu; deleguje hluboké polyglot kontroly na integritu. |
| `/analyzer:backend` | Najděte „špatný“ backend kód – porušení architektury, logika v kontrolérech. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| Příkaz | Co to dělá |
| --- | --- |
| `/integrity:vorcl <goal>` | Spouští netriviální cíl integrity prostřednictvím Task Master a mění zjištění na úkoly specifické pro vlastníka. |
| `/integrity:audit [path]` | Skenuje pevný kód a simuluje úniky společně, pak prokazuje dosažitelnost výroby. |
| `/integrity:hardcode [path]` | Vyhledá literály user/config/business, které obcházejí lokalizaci, konfiguraci nebo systém záznamů. |
| `/integrity:mocks [path]` | Najde falešné rámce, falešné generátory, příslušenství, demo data a statické odezvy dostupné z produkce. |

Přiložený skener s nulovou závislostí podporuje TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML a Razor. V backendovém kódu také označí obchodní hodnoty skryté v konstantách, statických/finálních polích, výchozích parametrech, pojmenovaných argumentech a statických katalozích; auditor je poté porovná se schématy/modely/úložišti/dotazy/administračními mutacemi, aby prokázal, že databázi – nikoli kód nebo konfiguraci – vlastní hodnotu. Testy, příslušenství, příběhy, příklady, semena, generovaný kód a kořeny dodavatelů jsou ve výchozím nastavení potlačeny; lexikální kandidáti nejsou defekty, dokud není prokázána dosažitelnost a vlastnictví.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Příkaz | Co to dělá |
| --- | --- |
| `/swagger:vorcl <goal>` | Cíl plného pokrytí prostřednictvím Task Master — audit → úkoly → pokrytí → ověřit. |
| `/swagger:audit` | Jen pro čtení: najděte trasy, které nejsou plně pokryty specifikací. |
| `/swagger:cover <route>` | Pokrytí cesty/modulu — parametry, odpovědi, popisy, zabezpečení + ověření. |

### 🔴 firecrawl — web research
| Příkaz | Co to dělá |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Cíl výzkumu prostřednictvím Task Master — shromažďovat data z webu do konečného výsledku. |
| `/firecrawl:search <query>` | Hledání zdrojů na webu na otázku. |
| `/firecrawl:scrape <url>` | Seškrábněte jednu adresu URL do markdown/JSON. |
| `/firecrawl:map <url>` | Mapujte adresy URL webu. |
| `/firecrawl:crawl <url>` | Rekurzivně procházet sekci/web. |
| `/firecrawl:extract <url>` | Strukturovaná extrakce podle JSON schématu. |
| `/firecrawl:setup` | Nainstalujte/ověřte CLI plus oficiální dovednosti sestavení a workflow (s potvrzením). |
| `/firecrawl:interact <url>` | Klikněte, procházejte nebo vyplňujte formuláře, když je škrábání nedostatečné. |
| `/firecrawl:parse <file>` | Analyzujte místní/soukromý dokument do markdown nebo JSON. |
| `/firecrawl:monitor <action>` | Seznam kontrol nebo správa monitorů opakujících se změn stránek. |
| `/firecrawl:agent <goal>` | Spusťte omezenou dlouhotrvající úlohu Firecrawl Agent. |
| `/firecrawl:research <query>` | Prohledejte články a GitHub výzkumný kontext. |
| `/firecrawl:ask <jobId>` | Diagnostikujte neúspěšnou Firecrawl úlohu. |
| `/firecrawl:docs-search <question>` | Prohledejte aktuální oficiální dokumentaci Firecrawl. |
| `/firecrawl:integrate <feature>` | Přidejte Firecrawl do kódu aplikace pomocí upstreamových dovedností sestavení. |
| `/firecrawl:deliverable <artifact>` | Vytvořte brief, audit, seznam potenciálních zákazníků nebo jiný artefakt pracovního postupu. |`/firecrawl:setup` spustí oficiální `firecrawl-cli init --all` tok až po potvrzení. Stávající oficiální `firecrawl-*` dovednosti mají přednost a jsou zachovány instalačním programem Codex/Cursor; AVF poskytuje kompatibilní záložní prostředky pro chybějící dovednosti. Živá trasa operací přes CLI → MCP → REST/keyless.

### 🟤 render — hosting / deploy (Render)
| Příkaz | Co to dělá |
| --- | --- |
| `/render:vorcl <goal>` | Infra cíl přes Task Master — nasazení/diagnostika/konfigurace hotovo. |
| `/render:deploy <service>` | Nasadit / znovu nasadit službu. |
| `/render:logs <service>` | Servisní protokoly a diagnostika až ke kořenové příčině. |
| `/render:status <service>` | Stav služby + nasazení + metriky. |
| `/render:query <sql>` | SQL pouze pro čtení proti Render Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Příkaz | Co to dělá |
| --- | --- |
| `/database:vorcl <goal>` | Datový cíl prostřednictvím Task Master — schéma/dotazy/migrace/mezipaměť hotovo. |
| `/database:query <query>` | Dotaz/analýza pouze pro čtení. |
| `/database:schema <target>` | Navrhněte / zkontrolujte schéma a integritu dat. |
| `/database:migrate <change>` | Naplánujte si bezpečnou, reverzibilní migraci schématu/dat. |
| `/database:optimize <target>` | Optimalizovat — indexy, N+1, plány dotazů, stránkování. |
| `/database:cache <target>` | Redis — TTL, zneplatnění, zámky, omezení rychlosti, toky. |

### ⚪ resilience — error handling + logging
| Příkaz | Co to dělá |
| --- | --- |
| `/resilience:vorcl <goal>` | Cíl spolehlivosti prostřednictvím Task Master — krycí kód s pokusem/úlovkem + protokoly. |
| `/resilience:harden <target>` | Zabalte kód do try/catch/konečně se solidním protokolováním, bez tichých selhání. |
| `/resilience:logging <target>` | Přidat/opravit strukturované protokolování – úrovně, kontext, žádná tajemství/PII. |
| `/resilience:audit` | Pouze pro čtení: najděte tichá selhání, prázdné úlovky, mezery v protokolování. |

### 🖼️ screenshot — screenshot UI → code
| Příkaz | Co to dělá |
| --- | --- |
| `/screenshot:vorcl <goal>` | Sada obrazovek ze snímků obrazovky přes Task Master — členění → kód. |
| `/screenshot:analyze <image>` | Členění pouze pro čtení — rozložení, komponenty, tokeny, stavy → plán. |
| `/screenshot:convert <image> [framework]` | Vygenerujte celý spustitelný kód ze snímku obrazovky (výchozí React + Tailwind v4). |
| `/screenshot:tokens <image>` | Extrahujte tokeny designu (barvy OKLCH, typografie, mezery) do Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Vytvořte vygenerované UI tak, aby byly citlivé – body přerušení, plynulé, `clamp()`, kontejnerové dotazy. |

### 🎨 design-studio — product and visual design
| Příkaz | Co to dělá |
| --- | --- |
| `/design-studio:vorcl <goal>` | Úplný cíl návrhu prostřednictvím Task Master — kontext → varianty → HTML → náhled → ověření → export. |
| `/design-studio:create <brief>` | Vytvořte vyleštěný samostatný vizuální artefakt nebo hi-fi UI. |
| `/design-studio:prototype <flow>` | Sestavte interaktivní web/mobilní prototyp se stavy a přechody. |
| `/design-studio:wireframe <flow>` | Vybudujte low-fi wireframe zaměřený na informační architekturu a UX. |
| `/design-studio:design-system <operation>` | Vytvořte, importujte, zkompilujte, svažte, obnovte nebo zkontrolujte návrhový systém. |
| `/design-studio:import <type> <source>` | Importujte Figma `.fig`, GitHub nebo HTML/CSS s původem. |
| `/design-studio:deck <brief>` | Sestavte si HTML deck s poznámkami reproduktoru, animacemi a volitelně upravitelným PPTX. |
| `/design-studio:document <brief>` | Vytvořte dokument připravený k tisku, resumé, poznámku, jednu stránku nebo zprávu. |
| `/design-studio:animation <brief>` | Sestavte pohybový artefakt a případně jej vykreslete do MP4. |
| `/design-studio:research <question>` | Vytvořte artefakt vizuálního výzkumu podporovaný zdrojem. |
| `/design-studio:export <project> <format>` | Export do samostatného formátu HTML, PDF, PPTX, MP4 nebo předání. |
| `/design-studio:review <target>` | Vizuální, UX, responzivní, a11y a designový systém pouze pro čtení. |

### 🔎 visual-research — screenshot → verified web answer
| Příkaz | Co to dělá |
| --- | --- |
| `/visual-research:vorcl <goal>` | Vícekrokový průzkum screenshotů prostřednictvím Task Master. |
| `/visual-research:identify <image>` | Identifikujte web, stránku a funkci s důvěryhodnými důkazy. |
| `/visual-research:search <image> <target>` | Najděte skutečnou stránku nebo oficiální dokumentaci z vizuálních vodítek. |
| `/visual-research:answer <image> <question>` | Odpovězte pomocí screenshotů, oficiálních dokumentů a aktuálních živých dat. |
| `/visual-research:hints <image> <goal>` | Poskytněte bezpečné, dokumentací podložené kroky pro viditelné rozhraní. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Příkaz | Co to dělá |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Najděte/pochopte/změňte existující UI ze snímku obrazovky pomocí Task Master — mapa → úkoly → delegovat. |
| `/pinpoint:locate <image>` | Vyhledejte existující součást/soubor(y) ze snímku obrazovky – `file:line`, žádný nový kód. |
| `/pinpoint:route <image>` | Identifikujte trasu/stránku, na které je obrazovka (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <image>` | Označte v kódu přesný ovládací prvek (tlačítko/pole) a jeho handler. |
| `/pinpoint:trace <target>` | Sledujte logiku za prvkem — handler → stav → načítání dat → API. || `/pinpoint:handoff <change>` | Vytvořte přesný požadavek na úpravu podle stávajícího kódu a delegujte jej na `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Příkaz | Co to dělá |
| --- | --- |
| `/drawio:vorcl <goal>` | Sada diagramů přes Task Master – sestavení je hotovo. |
| `/drawio:create <description> [type]` | Sestavte diagram z textového popisu (platný nativní XML). |
| `/drawio:pmp <type> <project>` | Sestavte diagram PMP/PMBOK — WBS, PERT/CPM, Gantt, RACI, matice rizik, mřížka zainteresovaných stran. |
| `/drawio:convert <source> [type]` | Převeďte zdroj na diagram — DB schéma → ERD, složky → strom, kód → UML, mořská panna/CSV/JSON. |
| `/drawio:refine <file>` | Upřesněte stávající `.drawio` — rozvržení, motiv, přidání/odebrání uzlů, zarovnání do mřížky. |

### 🗺️ archmap — architecture map from code| Příkaz | Co to dělá |
| --- | --- |
| `/archmap:vorcl <goal>` | Cíl mapování přes Task Master — sestavení na ověřenou sadu artefaktů. |
| `/archmap:map [repo]` | Úplný kanál: extrakce → `architecture.json` → anotace LLM → všechny formáty (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Pouze extrakce – strojově čitelné `architecture.json` s `source:{file,line}` na každém uzlu. |
| `/archmap:annotate [json]` | LLM obohacení stávajícího `architecture.json` (paměť agenta, sémantika toku dat); neprokázaná fakta automaticky degradována na `inferred`. |
| `/archmap:html [json]` | Interaktivní samostatná HTML mapa — přepínání vrstev, trasování paprsků, uzel → `file:line` panel, vyhledávání, tisk CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (více stránek: Přehled / ERD / API / Agenti) a/nebo Mermaid zobrazení, ověřeno. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Příkaz | Co to dělá |
| --- | --- |
| `/mermaid:vorcl <goal>` | Sada diagramů přes Task Master — build to done (render-verified). |
| `/mermaid:create <description> [type]` | Sestavte diagram z popisu — platná syntaxe, ověřená skutečným renderem; předá vám soubor. |
| `/mermaid:convert <source> [type]` | Převeďte zdroj na Mermaid — DB schéma → ER, kód → třída/sekvence, složky → vývojový diagram, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Syntaxe + reálný render-test; najít a opravit chyby (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Export do SVG/PNG/PDF (mořská panna-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Upřesněte existující `.mmd` — směr, podgraf, classDef/styly, čitelnost. |

### 🧪 testing — tests & verification
| Příkaz | Co to dělá |
| --- | --- |
| `/testing:vorcl <goal>` | Cíl testování/ověření prostřednictvím Task Master — jednotka + integrace + e2e hotovo. |
| `/testing:unit <file\|module>` | Unit testy (Vitest/Jest) — šťastná cesta, hranice, chyby; spustí je a zobrazí výstup. |
| `/testing:integration <endpoint\|module>` | Integrační testy (Supertest/inject, reálné DB nebo testovací kontejnery). |
| `/testing:e2e <scenario>` | Playwright E2E pro kritickou cestu uživatele – selektory rolí, přípravky, trasování při selhání. |
| `/testing:verify <task\|testStrategy>` | Provede `testStrategy` úlohy a vrátí verdikt PŘIPRAVENO / NE PŘIPRAVENO se skutečným výstupem. |
| `/testing:coverage [path]` | Zpráva o pokrytí se zjištěními – jaký kritický kód není otestován; vytváří úkoly. |
| `/testing:flaky <test>` | Diagnostikuje nestabilní test (závod, načasování, sdílený stav, zesměšňování) a nadobro jej opraví. |

### 🌿 gitflow — git workflow & releases
| Příkaz | Co to dělá |
| --- | --- |
| `/gitflow:vorcl <goal>` | Cíl git/release přes Task Master (příprava vydání, vyčištění historie, větev funkcí). |
| `/gitflow:commit <files\|scope>` | Potvrzení podle jména (nikdy `git add .`) se zprávou Konvenční potvrzení; zastaví na neznámém WIP. |
| `/gitflow:pr <base> <title>` | Větev → potvrzení → požadavek na stažení (gh / GitHub MCP) s ověřením co/proč/jak. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Udržovat seznam změn) generovaný z potvrzení mezi tagy. |
| `/gitflow:release <version\|auto>` | Semver z commitů → synchronizace verzí manifestu → tag → GitHub vydání. Zatlačte až po výslovném potvrzení. |
| `/gitflow:audit [branch]` | Audit historie pouze pro čtení: porušení konvencí, odevzdání výpisu, velké bloby, osiřelé větve. |

### 🛡️ security — security audit (read-only)
| Příkaz | Co to dělá |
| --- | --- |
| `/security:vorcl <goal>` | Bezpečnostní cíl prostřednictvím Task Master — audit → zjištění → úkoly → delegované opravy. |
| `/security:secrets [path\|branch]` | Tajemství pracovního stromu A historie git (všechny větve); `${VAR:-}` zástupné symboly nejsou tajemství. |
| `/security:owasp [path]` | OWASP Top 10 v kódu: injekce, XSS, auth, vystavení dat, CORS/cookies — s file:line proof. |
| `/security:deps` | Závislosti CVE přes npm audit / lockfiles — závažnost, příznaky změny přerušení. |
| `/security:pii [path]` | Rizika PII/GDPR: e-maily, telefony, karty v kódu a protokoly; soukromé cesty vývojáře. |
| `/security:pre-push [branch]` | Rychlá kombinovaná kontrola změněných souborů před odesláním: tajné informace + injekce + PII; zelený/červený verdikt. |

### 📝 docs — documentation
| Příkaz | Co to dělá |
| --- | --- |
| `/docs:vorcl <goal>` | Dokumentační cíl prostřednictvím Task Master. |
| `/docs:readme [path]` | Vytvořit/aktualizovat README — what/quickstart/usage/config/troubleshooting; příklady ověřené; jazykové verze synchronizovány. |
| `/docs:api [spec]` | API dokumenty generované ze specifikace OpenAPI (koncové body, parametry, příklady zvlnění); navrhuje `/swagger:audit` pokud není spec. |
| `/docs:architecture` | ARCHITECTURE.md — moduly, hranice, datový tok; diagramy delegované na `mermaid`/`drawio`. || `/docs:contributing` | CONTRIBUTING.md — nastavení, struktura, testy, konvence odevzdání (v souladu s `gitflow`), proces PR. |
| `/docs:release-notes <version>` | Poznámky k vydání pro verzi z CHANGELOG/historie. |
| `/docs:audit` | Kontrola posunu kódu docs↔jen pro čtení: nefunkční odkazy, zastaralé příklady/počítadla, nesynchronizované překlady. |

### 🐳 devops — containers & CI/CD
| Příkaz | Co to dělá |
| --- | --- |
| `/devops:vorcl <goal>` | Cíl infrastruktury prostřednictvím Task Master. |
| `/devops:dockerfile [app-type]` | Napište/revidujte Dockerfile — vícestupňový, tenký základ, bez kořene, HEALTHCHECK; ověřeno skutečným `docker build`. |
| `/devops:compose` | docker-compose.yml pro místní vývojáře (aplikace + DB); env změny potřebují `--force-recreate`, čeká na zdravé. |
| `/devops:ci [type]` | GitHub Akce — PR workflow (lint+typecheck+test, npm cache), nasazení workflow, minimální oprávnění. |
| `/devops:env` | Env-variabilní inventář: kde číst, co je požadováno, `.env.example` šablona; tajemství nikdy v obrazech. |
| `/devops:monitoring` | Strukturované protokoly (pino/JSON), koncový bod zdraví, na co upozornit; Vykreslování metrik prostřednictvím agenta `render`. |

### 📡 liveboard — ephemeral local operations board
| Příkaz | Co to dělá |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Spusťte vyleštěný 43jazyčný dashboard na bezplatném portu localhost; Task Master mění tok přes SSE a sladění každých 5 minut. |
| `/liveboard:vorcl <goal>` | Vyviňte nebo změňte liveboard sám pomocí požadovaného Task Master pracovního postupu. |

Liveboard čte Git pracovní stromy, místní procesy Claude/Codex/Cursor a `.taskmaster/tasks/tasks.json` každého pracovního stromu. Stav běhu zůstane v paměti a zmizí, když se proces na popředí zastaví. UI detekuje jazyk prohlížeče a nabízí 43 lokalit, včetně angličtiny, ruštiny, ukrajinštiny, němčiny, francouzštiny, španělštiny, portugalštiny, italštiny, polštiny, turečtiny, čínštiny, japonštiny, arabštiny, holandštiny, češtiny, slovenštiny, rumunštiny, maďarštiny, bulharštiny, srbštiny, chorvatštiny, slovinštiny, řečtiny, hebrejštiny, perštiny, hindštiny, bengálštiny, urdštiny, indonéštiny, malajštiny, švédštiny, vietnamštiny, thajštiny, norštiny, vietnamštiny, thajštiny estonština, lotyština, litevština, gruzínština, arménština a ázerbájdžánština. Arabština, hebrejština, perština a urdština používají rozložení RTL.

Přímá konfigurace:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: projekt, jehož Git pracovní stromy a Task Master soubory jsou skenovány.
- `--port 0`: automatický výběr volného portu.
- `--interval`: interval úplného odsouhlasení v milisekundách; sledování souborů se stále streamuje Task Master se okamžitě změní.
- Koncové body: `/health`, `/api/snapshot`, `/api/events` (SSE) a `POST /api/refresh`.
- Ponechejte `--host 127.0.0.1`, pokud výslovně nezamýšlíte vystavit informace o projektu síti.

---

## Configuration (MCP & keys)

Balíček nemá **žádný vzdálený backend nebo databázi**. Volitelný liveboard je proces v paměti pouze pro localhost. MCP servery potřebují tokeny a **každý uživatel poskytuje své vlastní**. Aby to fungovalo identicky napříč **Claude Code, Codex, Cursor a Kimi CLI** – a ať už spouštíte z terminálu nebo z Docku / Spotlight / IDE – každý server stdio MCP se spouští pomocí malého spouštěče (`bin/mcp-env.mjs`), který čte vaše klíče z **jednoho souboru**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Instalační program jej vytvoří z [`.env.example`](../.env.example). Otevřete jej a vyplňte pouze klíče, které používáte:

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

> **Proč spouštěč místo `~/.zshrc`?** Expanze Env-var se liší podle běhového prostředí (`${VAR:-}` v Claude, `${env:VAR}` v Cursor, literály v Codex/Kimi) a každé běhové prostředí čte pouze prostředí **to** bylo spuštěno. Spouštění GUI / IDE na macOS nepřipojuje nic `/skill:<name>` klasické klíče nejsou k exportu připojeny `~/.zshrc`, env není nastaveno" selhání. Čtení z jednoho souboru `.env` odstraní oba problémy najednou.

**Prednost** (později vyhrává): sdílené `~/.config/agent-vorcl-flow/.env` → a `./.env` v kořenovém adresáři projektu → skutečné `export` ve vašem shellu. Uchovávejte globální klíče ve sdíleném souboru, přepište každý projekt (např. jiný `MONGODB_URI`) projektem `.env` a skutečný export shellu stále vyhrává na CLI spuštění. Spouštěč můžete nasměrovat na jiný soubor pomocí `AGENT_VORCL_ENV_FILE=/path/.env`.Server, jehož požadovaný klíč chybí, se jednoduše **nestartuje** — v protokolu MCP běhového prostředí uvidíte jednořádkový `[agent-vorcl-flow] MCP «…» is not configured: …` a každý další server funguje dál. Přidejte klíč do `.env` a restartujte. (Můžete si ponechat názvy `GITHUB_TOKEN`/`MONGODB_URI` – spouštěč je namapuje na `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING`, které servery očekávají.)

> ⚠️ **Vyžadováno pro Task Master příkazy poháněné umělou inteligencí:** nakonfigurujte alespoň jednoho vybraného poskytovatele — `ANTHROPIC_API_KEY` pro Claude, `OPENAI_API_KEY` pro GPT nebo Codex CLI OAuth. Bez přihlašovacích údajů pro model vybraný v `.taskmaster/config.json` nemůže `/vorcl` generovat ani rozšiřovat úlohy.

Vyberte, který poskytovatel Task Master skutečně provozuje generování; samotné klíče nevyberou model:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Příkaz používá oficiální tok `task-master models` a ukládá pouze výběr modelu do `.taskmaster/config.json`. `PERPLEXITY_API_KEY` je volitelný a potřebný pouze v případě, že je jako výzkumný model vybrána Perplexity.

Vzdálené servery **vercel** a **render** používají OAuth (autorizaci pomocí `/mcp` v prohlížeči). Pro Render in headless/CI nastavte ve svém prostředí `RENDER_API_KEY` a přidejte na tento server položku záhlaví Bearer pro vaše běhové prostředí.

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

Úložiště nyní obsahuje nativní manifest Codex pluginu na `.codex-plugin/plugin.json`. Instalační program npm zůstane dostupný a nainstaluje stejné možnosti jako **dovednosti**, **profily** a `AGENTS.md` router pro Codex CLI, Cursor a Kimi:

| Claude Code | Codex ekvivalent |
| --- | --- |
| zástupce `@agent-vorcl-flow:frontend` | dovednost persona `$frontend` + `codex --profile frontend` |
| příkaz `/analyzer:audit` | úkolová dovednost `$analyzer-audit` |
| příkaz `/vorcl` | úkolová dovednost `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` v `config.toml` |
| `SessionStart` háček | směrování rolí v `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Úplné mapování viz [`codex/README.md`](../codex/README.md).

---

## Cursor

Cursor používá stejný otevřený formát `SKILL.md` jako adaptér Codex, plus nativní vlastní podagenti a globální MCP konfigurace:

| Agent-Vorcl-Flow koncept | Cursor ekvivalent |
| --- | --- |
| role `backend` | zakázkový zástupce `/avf-backend` v `~/.cursor/agents` |
| úkolový příkaz `/backend:create-api` | dovednost `/backend-create-api` |
| univerzální `/vorcl` | dovednost `/vorcl` |
| `.mcp.json` | sloučené servery v `~/.cursor/mcp.json` |

Instalační program převede definice rolí na Cursor frontmatter, předpony podagentům s `avf-`, aby se zabránilo kolizím názvů dovedností, použije `model: inherit` a označí agenty pouze pro audit jako `readonly: true`. Stávající položky MCP serveru se stejnými názvy jsou zachovány. Viz [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) nativně načítá dovednosti agenta, vlastní soubory agentů a háčky životního cyklu; AVF také sloučí stejné MCP servery, které používají Claude a Cursor:

| Agent-Vorcl-Flow koncept | Kimi CLI ekvivalent |
| --- | --- |
| dovednosti / příkazy úkolů | `~/.kimi/skills` a  |
| Expo zakázkový agent | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse guard | sloučeny do `~/.kimi/config.toml` |
| `.mcp.json` | sloučené servery v `~/.kimi/mcp.json` |
| soubor klíče za běhu | sdílené `~/.config/agent-vorcl-flow/.env` (prostřednictvím spouštěče) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI nemá rozšíření `${VAR}` v `mcp.json`, takže klíče pocházejí ze sdíleného `.env` přes spouštěč – přesně jako ostatní běhové prostředí. Viz [`kimi/README.md`](../kimi/README.md).

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

**Jak to do sebe zapadá:** `agents/*.md` deklarujte roli a v první řadě `skills:` připojte dovednosti → dovednosti v `skills/*/SKILL.md` se automaticky načítají popisem → `commands/<agent>/*.md` poskytují rychlé `/agent:command` zkratky, které delegují na podagenta → `.mcp.json` poskytuje agentům jejich nástroje, z nichž každý začíná přes `bin/mcp-env.mjs`, který načítá tajemství ze sdíleného `.env`. Háček `SessionStart` informuje Claude, že agenti jsou k dispozici.

---

## License

MIT – volně k použití, kopírování, úpravám a distribuci; poskytovány „tak jak jsou“, bez záruky a odpovědnosti. Viz [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
