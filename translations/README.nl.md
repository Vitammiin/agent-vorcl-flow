<div align="center">

# Agent-Vorcl-Flow

**Een team van gespecialiseerde AI-subagenten voor [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) en [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — met vaardigheden, opdrachten en MCP tools.**
Met één `npx`-commando worden ze geïnstalleerd. Geen externe backend of cloudhosting: uw codeeragent voert alles lokaal uit.

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
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [**Nederlands**](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 3321a7089b3f749787125626da692c98b8a2d556b237e1ba36bbf67afc34dc3d. -->

</div>

---

## What is this?

Agent-Vorcl-Flow verandert een ondersteunde codeeragent in een **gestructureerd engineeringteam**. In plaats van één algemene assistent krijgt u **25 gerichte subagenten** (architect, op code gebaseerde hoofdarchitect, backend, frontend, Expo mobiele ingenieur, product- en visueel ontwerpingenieur, DB ingenieur, inter-taalintegriteitsauditor, architectuurcartograaf, liveboard-operator en meer), elk met zijn eigen domein **vaardigheden**, snelle **slash-opdrachten** en de **MCP tools** die hij nodig heeft. Elke niet-triviale taak doorloopt een gedisciplineerde **Task Master**-lus – *doel → taken → implementeren → verifiëren → klaar* – zodat het werk wordt gepland, bijgehouden en onderbrekingen overleeft.

- 🧩 **25 subagenten**, 73 vaardigheden, 155 slash-opdrachten
- ⚡ **Installatie met één opdracht** voor Claude Code, Codex, Cursor en/of Kimi CLI — `npx`
- 🔌 **11 MCP servers** aangesloten (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, bestandssysteem, Task Master, Mermaid)
- 🔑 **Eén `.env`-bestand voor alle runtimes** — sleutels die worden gelezen door een opstartprogramma, niet door `~/.zshrc`, dus ze werken zelfs vanuit GUI/IDE-starts; geen externe AVF-service; liveboard is alleen localhost en kortstondig
- 🤝 **Werkt op Claude Code, GPT Codex, Cursor en Kimi CLI** van dezelfde bron

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** en/of **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Target een enkele runtime met een vlag:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Wat het installatieprogramma doet:

| Looptijd | Actie |
| --- | --- |
| **Gedeelde laag** | Kopieert het opstartprogramma naar `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` en maakt `~/.config/agent-vorcl-flow/.env` op basis van de sjabloon (eenmalig) — het enkele sleutelbestand voor elke runtime. |
| **Claude Code** | Registreert deze opslagplaats als plug-in **marktplaats** en schakelt de plug-in in (via `claude plugin …`, met een directe `~/.claude/settings.json`-fallback). |
| **GPT Codex** | Voegt de vaardigheden samen in `~/.agents/skills` en de `config.toml` + `AGENTS.md` blokken in `~/.codex` (idempotent, tussen markeringen). |
| **Cursor** | Installeert vaardigheden in `~/.cursor/skills`, eigen aangepaste subagenten in `~/.cursor/agents` en voegt ontbrekende servers samen in `~/.cursor/mcp.json`. |
| **Kimi CLI** | Installeert vaardigheden in `~/.kimi/skills`, de native Expo aangepaste agent in `~/.kimi/agents`, zowel Expo architectuur/UI haakt in `~/.kimi/config.toml`, en voegt MCP servers samen. |

> Het installatieprogramma vult nooit uw geheimen in; het maakt alleen een lege `.env` op basis van de sjabloon. Daar voeg je sleutels toe (zie [Configuration](#configuration-mcp--keys)).

### Update to the latest version

Voer het installatieprogramma opnieuw uit met de tag npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

Als u slechts één runtime wilt bijwerken, behoudt u dezelfde runtime-vlag die u tijdens de installatie hebt gebruikt:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

De update omvat door Agent-Vorcl-Flow beheerde vaardigheden, agenten, hooks, launcher en configuratieblokken. Het houdt je bestaande `~/.config/agent-vorcl-flow/.env` en zijn geheimen ongewijzigd, en behoudt upstream Firecrawl-vaardigheden. Start daarna de bijgewerkte codeerclient opnieuw (of voer `/reload-plugins` uit in Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Na de installatie **herstart Claude Code** (of voer `/reload-plugins` uit in een open sessie) om de agenten te laden.

---

## How to use

De voorbeelden in deze sectie gebruiken de syntaxis Claude Code; zie de [Cursor](#cursor)- en [GPT Codex](#gpt-codex)-toewijzingen hieronder voor hun eigen syntaxis. In Claude Code zijn er **drie manieren** om het team aan te roepen.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` zoekt uit welke subagent eigenaar moet zijn van het werk en stuurt de volledige Task Master cyclus aan. `/audit` detecteert automatisch backend, frontend, mobiel, data en infrastructuur en schrijft een op bewijs gebaseerde `PROJECT_AUDIT.md` met behulp van alle relevante rollen. `/init-code` leest de repository statisch en creëert een op bewijs gebaseerde `PROJECT_DESCRIPTION.md` zonder projectcode uit te voeren. Zodra dat bestand bestaat, moet elke wijzigende rol de betrokken secties gesynchroniseerd houden; bewezen beschrijving drift blokkeert taakvoltooiing.

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

Elke agent heeft ook zijn eigen `/<agent>:vorcl`-ingangspunt dat de Task Master-lus uitvoert, gericht op die agent.

### The Task Master loop
Elke niet-triviale taak stroomt door **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Hierdoor blijft het werk gepland, gecontroleerd en hervatbaar: niets wordt als 'klaar' verklaard zonder de verificatiestap te doorlopen.

---

## The agents| Agent | Rol | Hoogtepunten |
| --- | --- | --- |
| 🔵 **architect** | Systeem- en oplossingsarchitect | Analyse van vereisten, systeem-/DB/API-ontwerp, architectuurbeoordelingen |
| 🏛️ **hoofdarchitect** | Hoofdsoftware / infrastructuur / AI-architect | Scant echte code in 11 talen en creëert op bewijzen gebaseerde MD, JSON, HTML, PDF, draw.io en Mermaid; updates bij volledige nieuwe scan behouden annotaties |
| 🟢 **backend** | Backend-ontwikkelaar | Knooppunt/TS, Postgres, Redis; modulaire architectuur; elke route volledig gedekt door OpenAPI |
| 🟣 **frontend** | Frontend (React 19 / Next.js App-router) | Componenten, status, gegevens ophalen, weergave/bundeloptimalisatie, tests |
| 📱 **expo-mobiel** | React Native + Expo ingenieur | Modulaire architectuur plus ontwerp-/bewegings-/interactiesysteem, native navigatie, tokens, gebaren, haptiek, verminderde beweging |
| 🟠 **analysator** | Code-auditor (alleen-lezen) | Bugs, typeveiligheid, DB structuur, frontend-spots, backend-geuren |
| 🧭 **integriteit** | Auditor voor code-integriteit in meerdere talen (alleen-lezen) | Productiehardcode en mock/fake/demo/fixture-lekkage via frontend/backend/mobiel/gedeeld |
| 🟡 **branie** | OpenAPI/Swagger dekking (elke stapel) | Vindt routes die niet volledig gedocumenteerd zijn en dekt deze af, met verificatie |
| 🔴 **vuurgevecht** | Webonderzoeker | Live CLI/MCP/REST, app-integratie en voltooide webdata-workflows |
| 🟤 **renderen** | Hosting en implementatie (weergave) | Implementaties, loggestuurde diagnostiek, statistieken, env-vars, Render Postgres |
| 🟦 **database** | DB ingenieur / DBA | Schema, queries & plannen, indexen, N+1, veilige omkeerbare migraties, cache |
| ⚪ **veerkracht** | Betrouwbaarheid: fouten + loggen | proberen/vangen op de juiste grenzen, typefouten, nieuwe pogingen/time-outs, gestructureerde logs |
| 🖼️ **screenshot** | Schermafbeelding UI → code | Verandert een UI screenshot in productieklare, responsieve, toegankelijke code |
| 🎨 **ontwerpstudio** | Product- en visueel ontwerpstudio | Lokale HTML artefacten, prototypes, wireframes, decks/PPTX, documenten, animatie, 3D, ontwerpsystemen en Figma/GitHub/HTML import; aangepast van MIT `JimLiu/baoyu-design` |
| 🔎 **visueel onderzoek** | Screenshot → geverifieerd antwoord | Identificeert de site/pagina, vindt officiële documenten, controleert live gegevens en antwoorden met URL's en vertrouwen |
| 🎯 **aanwijzen** | Screenshot → plaatsen in een bestaand project (alleen-lezen) | Grondeert een screenshot van een actieve app in de echte codebase: component, `file:line`, route/pagina, de exacte besturing en de logica erachter; creëert niets, delegeert de bewerking |
| 📊 **drawio** | Diagrammen (draw.io / diagrams.net) | Stroomdiagram, BPMN, UML, ERD, netwerk/cloud en PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **boogkaart** | Architectuurcartograaf | Deterministische code → `architecture.json` (elk knooppunt met `source:{file,line}`) → interactieve HTML kaart, draw.io, Mermaid, ARCHITECTURE.md, PDF; onbewezen feiten zijn gemarkeerd met `inferred` |
| 🧜 **zeemeermin** | Mermaid diagrammen (+ echte render) | stroomdiagram, volgorde, klasse, staat, ER, gantt, gitGraph, mindmap…; gevalideerd via mcp-zeemeermin/`mmdc`; overhandigt u het bestand (`.mmd` + SVG/PNG/PDF) |
| 🧪 **testen** | Test & verificatie engineer | Eenheid (Vitest/Jest), integratie (Supertest), E2E (Playwright), dekking, jacht op zwakke tests; voert de `testStrategy` van elke taak uit — niets is "gedaan" zonder een groene run |
| 🌿**gitflow** | Git workflow & releases | Conventionele commits, commits op naam (nooit `git add .`), PR's, Keep-a-Changelog, semver releases; alleen pushen met expliciete bevestiging |
| 🛡️ **beveiliging** | Beveiligingsauditor (alleen-lezen) | Geheimen in de boom- en gitgeschiedenis, OWASP Top 10, afhankelijkheids-CVE's, PII; bevindingen worden taken – oplossingen worden gedelegeerd || 📝 **documenten** | Documentatie-ingenieur | README (meertalige pariteit), API documenten van OpenAPI, ARCHITECTUUR, BIJDRAGEN, releaseopmerkingen; elk voorbeeld geverifieerd aan de hand van de code |
| 🐳 **ontwikkelaars** | Containers & CI/CD | Meertraps Dockerfiles, docker-compose voor lokale ontwikkelaar, GitHub Actiepijplijnen, env/geheimenhygiëne, monitoring |
| 📡 **liveboard** | Lokaal activiteitenbord | Live Git werkbomen, agentprocessen en Task Master taken op een kortstondig localhost-dashboard |

**Een paar dingen die de moeite waard zijn om te weten:**
- **Frontend praat altijd met een echte API.** De OpenAPI-specificaties van de backend zijn de enige bron van waarheid; er worden typen gegenereerd (`openapi-typescript` + `openapi-fetch`). Geen schijnvertoningen in het productietraject.
- **`database` mutaties vereisen expliciete bevestiging.** Analyses zijn alleen-lezen; schema-/gegevenswijzigingen (DDL/DML/migraties) worden nooit uitgevoerd zonder uw toestemming.
- **`resilience` wordt geleverd met een veiligheidshaak.** Een niet-blokkerende `PostToolUse`-haak (`catch-guard.js`) markeert voorzichtig lege `catch {}`-blokken in bestanden die u zojuist hebt bewerkt.
- **`archmap` put nooit uit verbeelding.** Extractie en weergave zijn strikt gescheiden: scripts met nulafhankelijkheid brengen de repository naar `architecture.json` (databases met echte FK-kardinaliteit, API routes, AI-agenten met hun modellen/tools/geheugen, importgrafiek, env), en elk diagram wordt alleen vanuit die JSON weergegeven. Alles wat de LLM toevoegt zonder een verifieerbare `file:line` wordt geforceerd gemarkeerd met `inferred:true` en gestippeld getekend.
- **`principal-architect` is de volledige workflow voor architectuurpublicaties.** Het werkt in welke repository de agent ook wordt gestart, negeert Markdown-claims als topologisch bewijs, gebruikt gebundelde offline Tree-sitter WASM voor TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin en Swift, schrijft eerst `ARCHITECTURE.md` en produceert vervolgens het gedeelde JSON-model, op zichzelf staande HTML, PDF, native draw.io en kopieerbare Mermaid L0–L4. `update` voert een volledige nieuwe scan uit en bewaart annotaties en onbeheerde bestanden.
- **`pinpoint` vindt, maakt nooit.** Gegeven een screenshot van een actieve app, wijst het het scherm toe aan de echte code (component, route, de exacte besturing en de logica erachter) en geeft het de bewerking door aan `frontend`/`backend`. Het werkt op wat al bestaat (het omgekeerde van `screenshot`).
- **`visual-research` verifieert in plaats van te raden.** Het behandelt een screenshot als bewijs, bevestigt het officiële domein en de officiële documenten, controleert de huidige sitegegevens en markeert mogelijke phishing- of verouderde waarden.
- **`i18n` dwingt "zero-taal hardcoding" af.** Agenten detecteren eerst of een project meertalig is en passen zich aan: gebruikersgerichte tekenreeksen gaan door een vertaallaag (next-intl / react-i18next / i18next), nooit inline.

---

## Command referenceElke onderstaande opdracht is een slash-opdracht. `<…>` markeert uw invoer.

### `/vorcl` — universal router
| Commando | Wat het doet |
| --- | --- |
| `/vorcl <goal>` | Zet elk doel om in taken, stuurt dit naar de juiste subagent en voert vervolgens de volledige cyclus uit. |
| `/audit [path] [focus]` | Diepgaande, alleen-lezen audit met meerdere rollen → gedetecteerde systemen, bevindingen op het gebied van beveiliging/CVE/veerkracht, doelarchitectuur en gefaseerde `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | Statische codebase-ontdekking → evidence-based `PROJECT_DESCRIPTION.md`; projectcode wordt nooit uitgevoerd. |

### 🔵 architect — architecture
| Commando | Wat het doet |
| --- | --- |
| `/architect:vorcl <goal>` | Doel → taken → cyclus, toegespitst op architectuur. |
| `/architect:analyze <context>` | Analyseer de vereisten en de context van de taak. |
| `/architect:design <problem>` | Ontwerp de oplossingsarchitectuur (systeem, DB, API). |
| `/architect:review <target>` | Beoordeel een bestaande architectuur. |

### 🏛️ principal-architect — code-grounded architecture package
| Commando | Wat het doet |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Voert een grote architectuurdoelstelling uit via Task Master en geverifieerde artefacten. |
| `/principal-architect:create [options]` | Scant de huidige repository en maakt MD, JSON, HTML, PDF, draw.io en Mermaid op basis van codebewijs. |
| `/principal-architect:update [options]` | Scant een bestaand pakket volledig opnieuw, schrijft een bewijsverschil en ververst gegenereerde artefacten atomair. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Commando | Wat het doet |
| --- | --- |
| `/backend:vorcl <goal>` | Doel → taken → cyclus voor backend-werk. |
| `/backend:create-api <endpoint>` | Genereer een API-eindpunt op de modulaire architectuur, volledig gedekt door OpenAPI. |
| `/backend:refactor <target>` | Code refactoreren zonder gedrag te veranderen. |
| `/backend:optimize <target>` | Prestatie-optimalisatie. |
| `/backend:test <target>` | Genereer tests voor de code. |

### 🟣 frontend — React / Next.js
| Commando | Wat het doet |
| --- | --- |
| `/frontend:vorcl <goal>` | Doel → taken → cyclus voor frontendwerk. |
| `/frontend:create-component <spec>` | Genereer een UI-component volgens de featurestructuur. |
| `/frontend:refactor <target>` | Refactor UI / hooks zonder gedrag te veranderen. |
| `/frontend:optimize <target>` | Optimaliseer weergave / bundel / Core Web Vitals. |
| `/frontend:test <target>` | Componenttests genereren. |

### 📱 expo-mobile — React Native / Expo

| Commando | Wat het doet |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Doel → Task Master cyclus voor Expo mobiel werken. |
| `/expo-mobile:create-module <domain>` | Creëer een modulair bedrijfssegment met alleen de lagen die de complexiteit nodig heeft. |
| `/expo-mobile:create-screen <flow>` | Creëer een dunne Expo Router route plus een scherm en statussen die eigendom zijn van de module. |
| `/expo-mobile:design-screen <flow>` | Bouw een premium scherm met gedeelde ontwerp-/bewegingstokens, statussen en toegankelijkheid. |
| `/expo-mobile:motion <interaction>` | Ontwerp native navigatie, veren, gebaren, haptiek en fallbacks met verminderde beweging. |
| `/expo-mobile:add-api <contract>` | Voeg schema/DTO/mapper/query-sleutels en TanStack Query-integratie toe. |
| `/expo-mobile:audit [scope]` | Alleen-lezen architectuurbewaking en op bewijs gebaseerde audit. |
| `/expo-mobile:ui-audit [scope]` | Alleen-lezen ontwerpsysteem, beweging, interactie, toegankelijkheid en prestatie-audit. |
| `/expo-mobile:compatibility [app] [change]` | Live alleen-lezen Expo/RN/Node/package/native-runtime compatibiliteitscontrole op basis van officiële bronnen met versiebeheer. |
| `/expo-mobile:test <scope>` | Voer domeineenheid, React Native Bibliotheek testen en Maestro controles uit. |

### 🟠 analyzer — code audit (read-only)
| Commando | Wat het doet |
| --- | --- |
| `/analyzer:vorcl <goal>` | Audit een doel via Task Master — bevindingen worden taken. |
| `/analyzer:audit` | Volledige audit: bugs, typen, DB, frontend-spots, backend-geuren. |
| `/analyzer:bugs` | Ga op jacht naar bugs: onverwerkte fouten, raceomstandigheden, randgevallen. |
| `/analyzer:types` | Typecontrole — `tsc`, `any`, onveilige casts, zod↔types afwijken. |
| `/analyzer:db` | Auditstructuur — schema, indexen, FK's, N+1, migraties. |
| `/analyzer:mocks` | Compatibiliteitsroute voor nep-/nepgegevens op frontend en backend; delegeert diepgaande meertalige controles op integriteit. |
| `/analyzer:backend` | Vind "slechte" backend-code - architectuurschendingen, logica in controllers. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| Commando | Wat het doet |
| --- | --- |
| `/integrity:vorcl <goal>` | Voert een niet-triviale integriteitsdoelstelling uit via Task Master en zet bevindingen om in eigenaarspecifieke taken. |
| `/integrity:audit [path]` | Scant hardcode en schijnlekken samen en bewijst vervolgens de bereikbaarheid van de productie. |
| `/integrity:hardcode [path]` | Vindt letterlijke gebruikers-/configuratie-/bedrijfswaarden die lokalisatie, configuratie of het registratiesysteem omzeilen. |
| `/integrity:mocks [path]` | Vindt nepframeworks, nepgeneratoren, armaturen, demogegevens en statische reacties die bereikbaar zijn vanuit de productie. |

De gebundelde scanner zonder afhankelijkheid ondersteunt TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML en Razor. In de backend-code worden ook bedrijfswaarden gemarkeerd die verborgen zijn in constanten, statische/eindvelden, standaardparameters, benoemde argumenten en statische catalogi; de auditor vergelijkt ze vervolgens met schema's/modellen/opslagplaatsen/query's/admin-mutaties om te bewijzen dat de database (en niet de code of configuratie) de waarde bezit. Tests, programma's, verhalen, voorbeelden, zaden, gegenereerde code en leverancierswortels worden standaard onderdrukt; Lexicale kandidaten zijn geen gebreken totdat de bereikbaarheid en het eigenaarschap zijn bewezen.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Commando | Wat het doet |
| --- | --- |
| `/swagger:vorcl <goal>` | Doel voor volledige dekking via Task Master — audit → taken → cover → verifiëren. |
| `/swagger:audit` | Alleen-lezen: vind routes die niet volledig onder de specificatie vallen. |
| `/swagger:cover <route>` | Bestrijk een route/module – parameters, antwoorden, beschrijvingen, beveiliging + verificatie. |

### 🔴 firecrawl — web research
| Commando | Wat het doet |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Onderzoeksdoel via Task Master — webdata verzamelen tot een eindresultaat. |
| `/firecrawl:search <query>` | Zoeken op internet naar bronnen over een vraag. |
| `/firecrawl:scrape <url>` | Scrape één URL in markdown/JSON. |
| `/firecrawl:map <url>` | Breng de URL's van een site in kaart. |
| `/firecrawl:crawl <url>` | Een sectie/site recursief crawlen. |
| `/firecrawl:extract <url>` | Gestructureerde extractie via een JSON-schema. |
| `/firecrawl:setup` | Installeer/verifieer CLI plus officiële bouw- en workflowvaardigheden (met bevestiging). |
| `/firecrawl:interact <url>` | Klik, navigeer of vul formulieren in wanneer scrapen onvoldoende is. |
| `/firecrawl:parse <file>` | Parseer een lokaal/privaat document in markdown of JSON. |
| `/firecrawl:monitor <action>` | Maak een lijst van controles of beheer terugkerende monitoren voor paginawijzigingen. |
| `/firecrawl:agent <goal>` | Voer een begrensde, langlopende Firecrawl Agent-taak uit. |
| `/firecrawl:research <query>` | Zoek naar artikelen en GitHub onderzoekscontext. |
| `/firecrawl:ask <jobId>` | Diagnose stellen van een mislukte Firecrawl-taak. |
| `/firecrawl:docs-search <question>` | Doorzoek de huidige officiële Firecrawl documentatie. |
| `/firecrawl:integrate <feature>` | Voeg Firecrawl toe aan applicatiecode via upstream-buildvaardigheden. |
| `/firecrawl:deliverable <artifact>` | Maak een briefing, audit, leadlijst of ander workflow-artefact. |`/firecrawl:setup` voert de officiële `firecrawl-cli init --all`-stroom pas uit na bevestiging. Bestaande officiële `firecrawl-*`-vaardigheden hebben voorrang en worden bewaard door het Codex/Cursor-installatieprogramma; AVF levert compatibele fallbacks voor ontbrekende vaardigheden. Live operatieroute via CLI → MCP → REST/keyless.

### 🟤 render — hosting / deploy (Render)
| Commando | Wat het doet |
| --- | --- |
| `/render:vorcl <goal>` | Infradoel via Task Master — implementeren/diagnostiseren/configureren om klaar te zijn. |
| `/render:deploy <service>` | Een service implementeren/opnieuw implementeren. |
| `/render:logs <service>` | Servicelogboeken en diagnostiek tot aan de hoofdoorzaak. |
| `/render:status <service>` | Servicestatus + implementatie + statistieken. |
| `/render:query <sql>` | Alleen-lezen SQL tegen Render Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Commando | Wat het doet |
| --- | --- |
| `/database:vorcl <goal>` | Gegevensdoel via Task Master — schema/queries/migrations/cache to done. |
| `/database:query <query>` | Alleen-lezen query/analyse. |
| `/database:schema <target>` | Ontwerp/review schema en data-integriteit. |
| `/database:migrate <change>` | Plan een veilige, omkeerbare schema-/gegevensmigratie. |
| `/database:optimize <target>` | Optimaliseren — indexen, N+1, queryplannen, paginering. |
| `/database:cache <target>` | Redis — TTL, invalidatie, vergrendelingen, snelheidsbeperking, streams. |

### ⚪ resilience — error handling + logging
| Commando | Wat het doet |
| --- | --- |
| `/resilience:vorcl <goal>` | Betrouwbaarheidsdoel via Task Master — covercode met try/catch + logs. |
| `/resilience:harden <target>` | Verpak code in try/catch/finally met solide logboekregistratie, geen stille fouten. |
| `/resilience:logging <target>` | Gestructureerde logboekregistratie toevoegen/repareren: niveaus, context, geen geheimen/PII. |
| `/resilience:audit` | Alleen-lezen: vind stille fouten, lege vangsten, gaten in logboekregistratie. |

### 🖼️ screenshot — screenshot UI → code
| Commando | Wat het doet |
| --- | --- |
| `/screenshot:vorcl <goal>` | Een reeks schermen van screenshots via Task Master — uitsplitsing → code. |
| `/screenshot:analyze <image>` | Alleen-lezen uitsplitsing — lay-out, componenten, tokens, statussen → plan. |
| `/screenshot:convert <image> [framework]` | Genereer volledige uitvoerbare code op basis van een screenshot (standaard React + Tailwind v4). |
| `/screenshot:tokens <image>` | Extraheer ontwerptokens (OKLCH-kleuren, typografie, spatiëring) in Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Maak de gegenereerde UI responsief: breekpunten, vloeiende, `clamp()`, containerquery's. |

### 🎨 design-studio — product and visual design
| Commando | Wat het doet |
| --- | --- |
| `/design-studio:vorcl <goal>` | Volledig ontwerpdoel via Task Master — context → varianten → HTML → voorbeeld → verificatie → exporteren. |
| `/design-studio:create <brief>` | Creëer een gepolijst, op zichzelf staand visueel artefact of hifi-film UI. |
| `/design-studio:prototype <flow>` | Bouw een interactief web/mobiel prototype met toestanden en overgangen. |
| `/design-studio:wireframe <flow>` | Bouw een low-fi wireframe gericht op informatiearchitectuur en UX. |
| `/design-studio:design-system <operation>` | Creëer, importeer, compileer, bind, vernieuw of controleer een ontwerpsysteem. |
| `/design-studio:import <type> <source>` | Importeer Figma `.fig`, GitHub of HTML/CSS met herkomst. |
| `/design-studio:deck <brief>` | Bouw een HTML-deck met sprekernotities, animaties en optioneel bewerkbare PPTX. |
| `/design-studio:document <brief>` | Bouw een drukklaar document, cv, memo, one-pager of rapport. |
| `/design-studio:animation <brief>` | Bouw een bewegingsartefact en render dit eventueel naar MP4. |
| `/design-studio:research <question>` | Creëer een door de bron ondersteund visueel onderzoeksartefact. |
| `/design-studio:export <project> <format>` | Exporteer naar standalone HTML, PDF, PPTX, MP4 of een handoff-formaat. |
| `/design-studio:review <target>` | Alleen-lezen visuele, UX, responsieve, a11y en ontwerpsysteembeoordeling. |

### 🔎 visual-research — screenshot → verified web answer
| Commando | Wat het doet |
| --- | --- |
| `/visual-research:vorcl <goal>` | Screenshotonderzoek in meerdere stappen via Task Master. |
| `/visual-research:identify <image>` | Identificeer de site, pagina en functie met betrouwbaar bewijs. |
| `/visual-research:search <image> <target>` | Vind de echte pagina of officiële documentatie aan de hand van visuele aanwijzingen. |
| `/visual-research:answer <image> <question>` | Antwoord met behulp van screenshot-bewijsmateriaal, officiële documenten en actuele livegegevens. |
| `/visual-research:hints <image> <goal>` | Geef veilige, met documentatie ondersteunde stappen voor de zichtbare interface. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Commando | Wat het doet |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Zoek/begrijp/wijzig bestaande UI uit een screenshot via Task Master — kaart → taken → delegeren. |
| `/pinpoint:locate <image>` | Zoek de bestaande component/bestanden uit een screenshot — `file:line`, geen nieuwe code. |
| `/pinpoint:route <image>` | Identificeer de route/pagina waarop het scherm zich bevindt (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <image>` | Bepaal het exacte besturingselement (knop/veld) en de handler ervan in de code. |
| `/pinpoint:trace <target>` | Traceer de logica achter een element: handler → state → data-fetch → API. || `/pinpoint:handoff <change>` | Bouw een nauwkeurig bewerkingsverzoek op basis van bestaande code en delegeer dit naar `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Commando | Wat het doet |
| --- | --- |
| `/drawio:vorcl <goal>` | Een reeks diagrammen via Task Master — build to done. |
| `/drawio:create <description> [type]` | Bouw een diagram op basis van een tekstbeschrijving (geldige native XML). |
| `/drawio:pmp <type> <project>` | Bouw een PMP/PMBOK-diagram — WBS, PERT/CPM, Gantt, RACI, risicomatrix, stakeholderraster. |
| `/drawio:convert <source> [type]` | Converteer een bron naar een diagram — DB schema → ERD, mappen → boom, code → UML, zeemeermin/CSV/JSON. |
| `/drawio:refine <file>` | Verfijn een bestaande `.drawio` — lay-out, thema, knooppunten toevoegen/verwijderen, uitlijnen op raster. |

### 🗺️ archmap — architecture map from code| Commando | Wat het doet |
| --- | --- |
| `/archmap:vorcl <goal>` | Een kaartdoel via Task Master — gebouwd naar een geverifieerde artefactset. |
| `/archmap:map [repo]` | Volledige pijplijn: extractie → `architecture.json` → LLM-annotatie → alle formaten (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Alleen extractie: machineleesbaar `architecture.json` met `source:{file,line}` op elk knooppunt. |
| `/archmap:annotate [json]` | LLM-verrijking van een bestaande `architecture.json` (agentgeheugen, dataflow-semantiek); onbewezen feiten worden automatisch gedegradeerd naar `inferred`. |
| `/archmap:html [json]` | Interactieve, op zichzelf staande HTML kaart — laagwissels, traceerbalken, knooppunt → `file:line` paneel, zoeken, CSS afdrukken. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (meerdere pagina's: Overzicht / ERD / API / Agents) en/of Mermaid-weergaven, gevalideerd. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Commando | Wat het doet |
| --- | --- |
| `/mermaid:vorcl <goal>` | Een reeks diagrammen via Task Master — build to done (rendergeverifieerd). |
| `/mermaid:create <description> [type]` | Bouw een diagram op basis van een beschrijving: geldige syntaxis, geverifieerd door een echte weergave; overhandigt u het bestand. |
| `/mermaid:convert <source> [type]` | Converteer een bron naar Mermaid — DB schema → ER, code → klasse/reeks, mappen → stroomdiagram, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Syntaxis + echte rendertest; vind en repareer fouten (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Exporteren naar SVG/PNG/PDF (zeemeermin-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Verfijn een bestaande `.mmd` — richting, subgraaf, classDef/styles, leesbaarheid. |

### 🧪 testing — tests & verification
| Commando | Wat het doet |
| --- | --- |
| `/testing:vorcl <goal>` | Een test-/verificatiedoel via Task Master — unit + integratie + e2e om klaar te zijn. |
| `/testing:unit <file\|module>` | Eenheidstests (Vitest/Jest) — gelukkig pad, grenzen, fouten; voert ze uit en toont de uitvoer. |
| `/testing:integration <endpoint\|module>` | Integratietesten (Supertest/inject, echte DB of testcontainers). |
| `/testing:e2e <scenario>` | Playwright E2E voor een kritisch gebruikerspad — rolkiezers, armaturen, tracering bij fouten. |
| `/testing:verify <task\|testStrategy>` | Voert de `testStrategy` van een taak uit en retourneert een READY / NOT READY-oordeel met echte uitvoer. |
| `/testing:coverage [path]` | Dekkingsrapport met bevindingen – welke kritische code niet is getest; creëert taken. |
| `/testing:flaky <test>` | Diagnose van een onstabiele test (race, timing, gedeelde staat, spot) en repareert deze voorgoed. |

### 🌿 gitflow — git workflow & releases
| Commando | Wat het doet |
| --- | --- |
| `/gitflow:vorcl <goal>` | Een git/release-doel via Task Master (een release voorbereiden, geschiedenis opschonen, feature branch). |
| `/gitflow:commit <files\|scope>` | Een commit op naam (nooit `git add .`) met een Conventional Commits-bericht; stopt op onbekend WIP. |
| `/gitflow:pr <base> <title>` | Branch → commits → pull-verzoek (gh / GitHub MCP) met wat/waarom/hoe-geverifieerd. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Houd een Changelog bij) gegenereerd op basis van commits tussen tags. |
| `/gitflow:release <version\|auto>` | Semver van commits → manifestversies synchroniseren → tag → GitHub release. Push alleen na expliciete bevestiging. |
| `/gitflow:audit [branch]` | Alleen-lezen geschiedenisaudit: schendingen van conventies, dump-commits, grote blobs, verweesde branches. |

### 🛡️ security — security audit (read-only)
| Commando | Wat het doet |
| --- | --- |
| `/security:vorcl <goal>` | Een beveiligingsdoel via Task Master — audit → bevindingen → taken → gedelegeerde oplossingen. |
| `/security:secrets [path\|branch]` | Geheimen in de werkboom EN git-geschiedenis (alle branches); `${VAR:-}` tijdelijke aanduidingen zijn geen geheimen. |
| `/security:owasp [path]` | OWASP Top 10 in de code: injecties, XSS, auth, datablootstelling, CORS/cookies — met file:line proof. |
| `/security:deps` | Afhankelijkheid CVE's via npm audit / lockfiles - ernst, brekende wijzigingsvlaggen. |
| `/security:pii [path]` | PII/GDPR-risico's: e-mails, telefoons, kaarten in code en logs; privépaden van de ontwikkelaar. |
| `/security:pre-push [branch]` | Snelle gecombineerde controle van gewijzigde bestanden vóór een push: geheimen + injecties + PII; groen/rood oordeel. |

### 📝 docs — documentation
| Commando | Wat het doet |
| --- | --- |
| `/docs:vorcl <goal>` | Een documentatiedoel via Task Master. |
| `/docs:readme [path]` | README maken/bijwerken — what/quickstart/usage/config/troubleshooting; voorbeelden geverifieerd; taalversies gesynchroniseerd. |
| `/docs:api [spec]` | API documenten gegenereerd op basis van de OpenAPI specificatie (eindpunten, params, curl-voorbeelden); suggereert `/swagger:audit` als er geen specificatie is. |
| `/docs:architecture` | ARCHITECTURE.md — modules, grenzen, gegevensstroom; diagrammen gedelegeerd aan `mermaid`/`drawio`. || `/docs:contributing` | CONTRIBUTING.md - opzet, structuur, tests, commit-conventies (uitgelijnd met `gitflow`), PR-proces. |
| `/docs:release-notes <version>` | Release-opmerkingen voor een versie uit CHANGELOG/history. |
| `/docs:audit` | Alleen-lezen documenten↔controle op codeafwijking: verbroken links, verouderde voorbeelden/tellers, niet-gesynchroniseerde vertalingen. |

### 🐳 devops — containers & CI/CD
| Commando | Wat het doet |
| --- | --- |
| `/devops:vorcl <goal>` | Een infrastructuurdoel via Task Master. |
| `/devops:dockerfile [app-type]` | Schrijf/beoordeel een Dockerfile — meertraps, slanke basis, niet-root, HEALTHCHECK; geverifieerd door een echte `docker build`. |
| `/devops:compose` | docker-compose.yml voor lokale ontwikkelaar (app + DB's); env veranderingen hebben `--force-recreate` nodig, wacht op gezond. |
| `/devops:ci [type]` | GitHub Acties — PR-workflow (lint+typecheck+test, npm cache), workflow implementeren, minimale rechten. |
| `/devops:env` | Env-variabele inventaris: waar gelezen, wat is vereist, `.env.example` sjabloon; geheimen nooit in afbeeldingen. |
| `/devops:monitoring` | Gestructureerde logboeken (pino/JSON), gezondheidseindpunt, waar u op moet letten; Geef statistieken weer via de `render`-agent. |

### 📡 liveboard — ephemeral local operations board
| Commando | Wat het doet |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Start een gepolijst dashboard in 43 talen op een gratis localhost-poort; Task Master verandert de stream via SSE en stemt elke 5 minuten af. |
| `/liveboard:vorcl <goal>` | Ontwikkel of wijzig liveboard zelf via de vereiste Task Master workflow. |

Liveboard leest Git werkbomen, lokale Claude/Codex/Cursor processen en de `.taskmaster/tasks/tasks.json` van elke werkboom. De runtimestatus blijft in het geheugen en verdwijnt wanneer het voorgrondproces stopt. De UI detecteert de browsertaal en biedt 43 talen, waaronder Engels, Russisch, Oekraïens, Duits, Frans, Spaans, Portugees, Italiaans, Pools, Turks, Chinees, Japans, Arabisch, Nederlands, Tsjechisch, Slowaaks, Roemeens, Hongaars, Bulgaars, Servisch, Kroatisch, Sloveens, Grieks, Hebreeuws, Perzisch, Hindi, Bengaals, Urdu, Indonesisch, Maleis, Vietnamees, Thais, Koreaans, Zweeds, Noors, Deens, Fins, Ests, Lets, Litouws, Georgisch, Armeens en Azerbeidzjaans. Arabisch, Hebreeuws, Perzisch en Urdu gebruiken de RTL-indeling.

Directe configuratie:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: project waarvan Git werkbomen en Task Master bestanden worden gescand.
- `--port 0`: automatisch een vrije poort selecteren.
- `--interval`: volledig afstemmingsinterval in milliseconden; bestand kijken naar stilstaande streams Task Master verandert onmiddellijk.
- Eindpunten: `/health`, `/api/snapshot`, `/api/events` (SSE) en `POST /api/refresh`.
- Bewaar `--host 127.0.0.1` tenzij u expliciet van plan bent projectinformatie openbaar te maken aan het netwerk.

---

## Configuration (MCP & keys)

Het pakket heeft **geen externe backend of database**. Het optionele liveboard is een in-memory-proces dat alleen beschikbaar is voor localhost. MCP servers hebben tokens nodig, en **elke gebruiker levert zijn eigen**. Om dit op dezelfde manier te laten werken in **Claude Code, Codex, Cursor en Kimi CLI** – en of u nu opstart vanaf een terminal of vanuit Dock / Spotlight / een IDE – wordt elke stdio MCP-server gestart via een klein opstartprogramma (`bin/mcp-env.mjs`) dat uw sleutels uit **één bestand** leest:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Het installatieprogramma maakt het van [`.env.example`](../.env.example). Open het en vul alleen de sleutels in die u gebruikt:

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

> **Waarom een launcher in plaats van `~/.zshrc`?** Env-var-uitbreiding verschilt per runtime (`${VAR:-}` in Claude, `${env:VAR}` in Cursor, letterlijke waarden in Codex/Kimi) en elke runtime leest alleen de omgeving waarin **deze** werd gelanceerd. GUI/IDE-lanceringen op macOS genereren geen bron van `~/.zshrc`, dus geëxporteerde sleutels zijn onzichtbaar en de servers maken met niets verbinding - de klassieke "MCP env not set"-fout. Als u uit één `.env`-bestand leest, worden beide problemen in één keer opgelost.

**Voorrang** (later wint): de gedeelde `~/.config/agent-vorcl-flow/.env` → een `./.env` in de projectroot → een echte `export` in je shell. Bewaar de globale sleutels in het gedeelde bestand, overschrijf per project (bijvoorbeeld een andere `MONGODB_URI`) met een project `.env`, en een echte shell-export wint nog steeds voor CLI runs. Met `AGENT_VORCL_ENV_FILE=/path/.env` kunt u het opstartprogramma naar een ander bestand richten.Een server waarvan de vereiste sleutel ontbreekt **start eenvoudigweg niet**: u ziet een regel `[agent-vorcl-flow] MCP «…» is not configured: …` in het MCP-logboek van de runtime, en elke andere server blijft werken. Voeg de sleutel toe aan `.env` en start opnieuw op. (Je kunt de `GITHUB_TOKEN`/`MONGODB_URI`-namen behouden; het opstartprogramma wijst ze toe aan de `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` die de servers verwachten.)

> ⚠️ **Vereist voor AI-aangedreven Task Master-opdrachten:** configureer ten minste één geselecteerde provider: `ANTHROPIC_API_KEY` voor Claude, `OPENAI_API_KEY` voor GPT of Codex CLI OAuth. Zonder inloggegevens voor het in `.taskmaster/config.json` geselecteerde model kan `/vorcl` geen taken genereren of uitbreiden.

Kies welke Task Master-provider daadwerkelijk de generatie uitvoert; toetsen alleen selecteren het model niet:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

De opdracht maakt gebruik van de officiële `task-master models`-stroom en slaat alleen de modelselectie op in `.taskmaster/config.json`. `PERPLEXITY_API_KEY` is optioneel en alleen nodig als Perplexity als onderzoeksmodel is geselecteerd.

De externe **vercel**- en **render**-servers gebruiken OAuth (autoriseer met `/mcp` in een browser). Voor Renderen in headless/CI stelt u `RENDER_API_KEY` in uw omgeving in en voegt u een Bearer-headervermelding toe aan die server voor uw runtime.

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

De repository bevat nu een native Codex-plug-inmanifest op `.codex-plugin/plugin.json`. Het npm-installatieprogramma blijft beschikbaar en installeert dezelfde mogelijkheden als **skills**, **profielen** en een `AGENTS.md`-router voor Codex CLI, Cursor en Kimi:

| Claude Code | Codex gelijkwaardig |
| --- | --- |
| subagent `@agent-vorcl-flow:frontend` | vaardigheid persona `$frontend` + `codex --profile frontend` |
| opdracht `/analyzer:audit` | taakvaardigheid `$analyzer-audit` |
| opdracht `/vorcl` | taakvaardigheid `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` in `config.toml` |
| `SessionStart` haak | rolroutering in `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Zie [`codex/README.md`](../codex/README.md) voor de volledige mapping.

---

## Cursor

Cursor gebruikt hetzelfde open `SKILL.md`-formaat als de Codex-adapter, plus eigen aangepaste subagenten en globale MCP-configuratie:

| Agent-Vorcl-Flowconcept | Cursor gelijkwaardig |
| --- | --- |
| rol `backend` | aangepaste subagent `/avf-backend` in `~/.cursor/agents` |
| taakopdracht `/backend:create-api` | vaardigheid `/backend-create-api` |
| universeel `/vorcl` | vaardigheid `/vorcl` |
| `.mcp.json` | samengevoegde servers in `~/.cursor/mcp.json` |

Het installatieprogramma converteert roldefinities naar Cursor frontmatter, geeft subagents het voorvoegsel `avf-` om botsingen tussen vaardigheidsnamen te voorkomen, gebruikt `model: inherit` en markeert agenten die alleen audits uitvoeren als `readonly: true`. Bestaande MCP-servergegevens met dezelfde naam blijven behouden. Zie [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) laadt native agentvaardigheden, aangepaste agentbestanden en levenscyclushooks; AVF voegt ook dezelfde MCP-servers samen die worden gebruikt door Claude en Cursor:

| Agent-Vorcl-Flowconcept | Kimi CLI gelijkwaardig |
| --- | --- |
| vaardigheden / taakopdrachten | `~/.kimi/skills` en `/skill:<name>` |
| Expo aangepaste agent | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolGebruik bewaker | samengevoegd tot `~/.kimi/config.toml` |
| `.mcp.json` | samengevoegde servers in `~/.kimi/mcp.json` |
| sleutelbestand per runtime | de gedeelde `~/.config/agent-vorcl-flow/.env` (via het opstartprogramma) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI heeft geen `${VAR}`-uitbreiding in `mcp.json`, dus de sleutels komen van de gedeelde `.env` via het opstartprogramma - precies zoals de andere runtimes. Zie [`kimi/README.md`](../kimi/README.md).

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

**Hoe het in elkaar steekt:** `agents/*.md` geef een rol aan en, in de voorgrond `skills:`, voeg vaardigheden toe → vaardigheden in `skills/*/SKILL.md` worden automatisch geladen op basis van beschrijving → `commands/<agent>/*.md` bieden snelle `/agent:command` snelkoppelingen die delegeren aan de sub-agent → `.mcp.json` geeft agenten hun tools, elk gestart via `bin/mcp-env.mjs`, waarmee geheimen van de gedeelde `.env` worden geladen. Een `SessionStart`-haakje vertelt Claude dat de agenten beschikbaar zijn.

---

## License

MIT — gratis te gebruiken, kopiëren, wijzigen en distribueren; geleverd "as is", zonder garantie en zonder aansprakelijkheid. Zie [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
