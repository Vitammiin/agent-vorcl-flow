<div align="center">

# Agent-Vorcl-Flow

**O echipă de subagenți AI specializati pentru [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) și [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — cu abilități, comenzi și MCP instrumente.**
O comandă `npx` le instalează. Fără backend la distanță sau găzduire în cloud: agentul dvs. de codare rulează totul local.

![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-6C5CE7)
![GPT Codex](https://img.shields.io/badge/GPT%20Codex-adapter-1abc9c)
![Cursor](https://img.shields.io/badge/Cursor-native%20adapter-111111)
![Kimi CLI](https://img.shields.io/badge/Kimi%20CLI-adapter-000000)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)
![Agents](https://img.shields.io/badge/agents-24-blue)
![Commands](https://img.shields.io/badge/commands-150-blue)
![License](https://img.shields.io/badge/license-MIT-green)

<details>
<summary>🌐 <strong>Languages (22)</strong> — translations live in `translations/`</summary>

[English](../README.md) · [Русский](./README.ru.md) · [Українська](./README.uk.md) · [Deutsch](./README.de.md) · [Français](./README.fr.md) · [Español](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [**Română**](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: cb534cab9c402c71fa70c1c162992b77ee2b6861eaecbd4a45a448b036314aeb. -->

</div>

---

## Ce este asta?

Agent-Vorcl-Flow transformă un agent de codificare acceptat într-o **echipă de inginerie structurată**. În loc de un asistent general, veți obține **24 de sub-agenți concentrați** (arhitect, arhitect principal bazat pe cod, backend, frontend, Expo inginer mobil, inginer de produs și proiectare vizuală, DB inginer, cartograf arhitectură, operator liveboard și alții), fiecare cu propriul domeniu **aptitudini**, rapid ** și instrumentul slash** de comandă. Fiecare sarcină netrivială trece printr-o buclă disciplinată **Task Master** — *scop → sarcini → implementare → verificare → terminată* — astfel încât munca este planificată, urmărită și supraviețuiește întreruperilor.

- 🧩 **24 sub-agenți**, 46 de abilități, 150 de comenzi oblice
- ⚡ **Instalare cu o singură comandă** pentru Claude Code, Codex, Cursor și/sau Kimi CLI — `npx`
- 🔌 **11 MCP servere** conectate (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, sistem de fișiere, Task Master, Mermaid)
- 🔑 **Un fișier `.env` pentru toate timpii de execuție** — chei citite de un lansator, nu `~/.zshrc`, deci funcționează chiar și din lansări GUI/IDE; fără serviciu AVF la distanță; liveboard este doar localhost și efemer
- 🤝 **Rulează pe Claude Code, GPT Codex, Cursor și Kimi CLI** din aceeași sursă

---

## Pornire rapidă

### Cerințe
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** și/sau **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Instalare (o comandă)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Vizați un singur timp de execuție cu un steag:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Ce face instalatorul:

| Timp de rulare | Acțiune |
| --- | --- |
| **Strat partajat** | Copiază lansatorul în `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` și creează `~/.config/agent-vorcl-flow/.env` din șablon (o dată) — fișierul cheie unică pentru fiecare timp de execuție. |
| **Claude Code** | Înregistrează acest repo ca plugin **piață** și activează pluginul (prin `claude plugin …`, cu o alternativă directă `~/.claude/settings.json`). |
| **GPT Codex** | Îmbină abilitățile în `~/.agents/skills` și blocurile `config.toml` + `AGENTS.md` în `~/.codex` (idempotent, între markeri). |
| **Cursor** | Instalează abilități în `~/.cursor/skills`, subagenți personalizați nativi în `~/.cursor/agents` și îmbină serverele lipsă în `~/.cursor/mcp.json`. |
| **Kimi CLI** | Instalează abilitățile în `~/.kimi/skills`, agentul personalizat nativ Expo în `~/.kimi/agents`, ambele Expo arhitectură/UI se conectează în `~/.kimi/config.toml` și îmbină MCP servere. |

> Programul de instalare nu completează niciodată secretele dvs. — creează doar un `.env` gol din șablon. Adăugați chei acolo (vezi [Configuration](#configurare-mcp-și-taste)).

### Actualizați la cea mai recentă versiune

Rulați din nou programul de instalare cu eticheta npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

Pentru a actualiza un singur timp de execuție, păstrați același indicator de execuție pe care l-ați folosit în timpul instalării:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

Actualizarea se suprapune abilități gestionate de Agent-Vorcl-Flow, agenți, cârlige, lansator și blocuri de configurare. Îți păstrează `~/.config/agent-vorcl-flow/.env` existente și secretele sale neschimbate și păstrează abilitățile Firecrawl din amonte. Reporniți ulterior clientul de codare actualizat (sau rulați `/reload-plugins` în Claude Code).

### Instalări alternative (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

După instalare, **reporniți Claude Code** (sau rulați `/reload-plugins` într-o sesiune deschisă) pentru a încărca agenții.

---

## Cum se utilizează

Exemplele din această secțiune folosesc sintaxa Claude Code; vezi mapările [Cursor](#cursor) și [GPT Codex](#gpt-codex) de mai jos pentru sintaxa lor nativă. În Claude Code există **trei moduri** de a invoca echipa.

### 1. Punct de intrare universal - doar indicați un obiectiv
```text
/vorcl add a shopping cart to checkout
/audit .
```
`/vorcl` își dă seama ce subagent ar trebui să dețină lucrarea și conduce întregul ciclu Task Master. `/audit` detectează automat backend, front-end, mobil, date și infrastructură și scrie un `PROJECT_AUDIT.md` bazat pe dovezi folosind toate rolurile relevante.

### 2. Discutați cu un anumit sub-agent
```text
@agent-vorcl-flow:architect  design billing for a SaaS
@agent-vorcl-flow:backend    add a POST /invoices endpoint
```

### 3. Rulați o comandă slash specifică
```text
/backend:create-api   POST /invoices
/analyzer:audit       src/
/screenshot:convert   ./mockups/dashboard.png  react
```

Fiecare agent are, de asemenea, propriul său punct de intrare `/<agent>:vorcl` care rulează bucla Task Master destinată agentului respectiv.

### Bucla Task Master
Fiecare sarcină non-trivială curge prin **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Acest lucru menține munca planificată, controlată și reluabilă - nimic nu este declarat „terminat” fără a trece pasul de verificare.

---

## Agenții| Agent | Rol | Repere |
| --- | --- | --- |
| 🔵 **arhitect** | Arhitect de sisteme și soluții | Analiza cerințelor, proiectare sistem/DB/API, recenzii arhitecturii |
| 🏛️ **principal-arhitect** | Principal software / infrastructură / arhitect AI | Scanează cod real în 11 limbi și creează MD, JSON, HTML, PDF, draw.io și Mermaid, susținute de dovezi; actualizările rescanate complet păstrează adnotările |
| 🟢 **backend** | Dezvoltator backend | Nod/TS, Postgres, Redis; arhitectura modulara; fiecare traseu acoperit integral de OpenAPI |
| 🟣 **frontend** | Frontend (React 19 / Next.js App Router) | Componente, stare, preluare de date, optimizare randare/bundle, teste |
| 📱 **expo-mobile** | React Native + Expo inginer | Arhitectură modulară plus Sistem de proiectare/mișcare/interacțiune, navigare nativă, jetoane, gesturi, haptică, mișcare redusă |
| 🟠 **analizator** | Auditor cod (numai citire) | Bug-uri, siguranța tipului, DB structură, batjocuri de front-end, mirosuri de backend |
| 🟡 **tâmpit** | Acoperire OpenAPI/Swagger (orice stivă) | Găsește rute nedocumentate complet și le acoperă, cu verificare |
| 🔴 **firecrawl** | Cercetător web | Live CLI/MCP/REST, integrarea aplicației și fluxurile de lucru de date web finalizate |
| 🟤 **renda** | Gazduire si implementare (Render) | Implementări, diagnosticare bazată pe jurnal, metrici, vars env, Render Postgres |
| 🟦 **bază de date** | DB inginer / DBA | Schemă, interogări și planuri, indexuri, N+1, migrări reversibile sigure, cache |
| ⚪ **rezistenta** | Fiabilitate: erori + înregistrare | încercați/prindeți la limitele potrivite, erori de tastare, reîncercări/timeout-uri, jurnalele structurate |
| 🖼️ **captură de ecran** | Captură de ecran UI → cod | Transformă o captură de ecran UI într-un cod accesibil, receptiv și pregătit pentru producție |
| 🎨 **design-studio** | Studio de design de produs și vizual | Local HTML artefacte, prototipuri, wireframes, deck-uri/PPTX, documente, animație, 3D, sisteme de proiectare și import Figma/GitHub/HTML; adaptat după MIT `JimLiu/baoyu-design` |
| 🔎 **vizual-cercetare** | Captură de ecran → răspuns verificat | Identifică site-ul/pagina, găsește documente oficiale, verifică datele live și răspunde cu adrese URL și cu încredere |
| 🎯 **punctează** | Captură de ecran → plasare într-un proiect existent (numai citire) | Întemeiază o captură de ecran a aplicației care rulează în baza de cod reală — componentă, `file:line`, ruta/pagina, controlul exact și logica din spatele acesteia; nu creează nimic, delegă editarea |
| 📊 **drawio** | Diagrame (draw.io / diagrams.net) | Diagramă, BPMN, UML, ERD, rețea/cloud și PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **arhhartă** | Cartograf de arhitectură | Cod determinist → `architecture.json` (fiecare nod cu `source:{file,line}`) → hartă interactivă HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF; faptele nedovedite sunt marcate `inferred` |
| 🧜 **sirenă** | Mermaid diagrame (+ randare reală) | organigramă, secvență, clasă, stare, ER, gantt, gitGraph, mindmap...; validat prin mcp-mermaid/`mmdc`; vă înmânează fișierul (`.mmd` + SVG/PNG/PDF) |
| 🧪 **testare** | Inginer de testare și verificare | Unit (Vitest/Jest), integrare (Supertest), E2E (Playwright), acoperire, flaky-test hunting; execută fiecare sarcină `testStrategy` — nimic nu este „făcut” fără o rulare verde |
| 🌿 **gitflow** | Git flux de lucru și versiuni | Comite convenționale, comite după nume (niciodată `git add .`), PR-uri, Keep-a-Changelog, lansări semver; push numai cu confirmare explicită |
| 🛡️ **securitate** | Auditor de securitate (numai citire) | Secrete în istoria arborelui și git, OWASP Top 10, CVE-uri de dependență, PII; constatările devin sarcini — corecțiile sunt delegate |
| 📝 **docs** | Inginer documentare | README (multi-language parity), API documente din OpenAPI, ARHITECTURE, CONTRIBUTING, note de lansare; fiecare exemplu verificat cu codul || 🐳 **devops** | Containere și CI/CD | Dockerfiles în mai multe etape, docker-compose pentru dezvoltarea locală, GitHub Conducte de acțiuni, igiena mediului/secrete, monitorizare |
| 📡 **liveboard** | Consiliul local de operațiuni | Live Git arbori de lucru, procese de agent și Task Master sarcini pe un tablou de bord efemer localhost |

**Câteva lucruri care merită știute:**
- **Frontend-ul vorbește întotdeauna cu un API real.** Specificațiile OpenAPI ale backend-ului sunt singura sursă de adevăr; din acesta sunt generate tipuri (`openapi-typescript` + `openapi-fetch`). Fără batjocuri în calea de producție.
- **`database` mutațiile necesită o confirmare explicită.** Analytics sunt doar pentru citire; Schimbările de schemă/date (DDL/DML/migrații) nu rulează niciodată fără aprobarea dumneavoastră.
- **`resilience` livrează un cârlig de siguranță.** Un cârlig `PostToolUse` neblocant (`catch-guard.js`) semnalează ușor blocurile `catch {}` goale din fișierele pe care tocmai le-ați editat.
- **`archmap` nu se bazează niciodată din imaginație.** Extragerea și redarea sunt strict separate: scripturile cu dependență zero parcurg repo-ul în `architecture.json` (baze de date cu cardinalitate FK reală, API rute, agenți AI cu modelele/instrumentele/memoria lor, graficul de import, env) și fiecare diagramă este redată numai din acel JSON. Orice adaugă LLM fără un `file:line` verificabil este marcat cu forța `inferred:true` și desenat întrerupt.
- **`principal-architect` este fluxul de lucru complet al publicării arhitecturii.** Funcționează în orice depozit care lansează agentul, ignoră afirmațiile Markdown ca dovezi de topologie, folosește WASM offline Tree-sitter pentru TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin și Swift, scrie mai întâi modelul partajat, apoi produce `ARCHITECTURE.md` HTML, PDF, draw.io nativ și copiabil Mermaid L0–L4. `update` efectuează o rescanare completă și păstrează adnotările și fișierele negestionate.
- **`pinpoint` găsește, nu creează niciodată.** Având în vedere o captură de ecran a unei aplicații care rulează, mapează ecranul la codul real - componentă, rută, controlul exact și logica din spatele acestuia - și dă editarea către `frontend`/`backend`. Funcționează pe ceea ce există deja (inversul lui `screenshot`).
- **`visual-research` verifică în loc să ghicească.** Tratează o captură de ecran ca o dovadă, confirmă domeniul și documentele oficiale, verifică datele actuale ale site-ului și semnalează posibile valori de phishing sau învechite.
- **`i18n` impune „codarea în limba zero.”** Agenții detectează mai întâi dacă un proiect este multilingv și se adaptează — șirurile orientate către utilizator trec printr-un strat de traducere (next-intl / react-i18next / i18next), niciodată în linie.

---

## Referință de comandăFiecare comandă de mai jos este o comandă slash. `<…>` marchează intrarea dvs.

### `/vorcl` — router universal
| Comanda | Ce face |
| --- | --- |
| `/vorcl <goal>` | Transformă orice obiectiv în sarcini și îl direcționează către agentul secundar potrivit, apoi rulează întregul ciclu până la finalizare. |
| `/audit [path] [focus]` | Audit profund multi-rol, numai în citire, → sisteme detectate, constatări de securitate/CVE/reziliență, arhitectură țintă și `PROJECT_AUDIT.md` în faze. |

### 🔵 arhitect — arhitectură
| Comanda | Ce face |
| --- | --- |
| `/architect:vorcl <goal>` | Obiectiv → sarcini → ciclu, în funcție de arhitectură. |
| `/architect:analyze <context>` | Analizați cerințele și contextul sarcinii. |
| `/architect:design <problem>` | Proiectați arhitectura soluției (sistem, DB, API). |
| `/architect:review <target>` | Examinați o arhitectură existentă. |

### 🏛️ principal-architect — pachet de arhitectură bazat pe cod
| Comanda | Ce face |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Rulează un obiectiv mare de arhitectură prin Task Master și artefacte verificate. |
| `/principal-architect:create [options]` | Scanează depozitul curent și creează MD, JSON, HTML, PDF, draw.io și Mermaid din dovezile de cod. |
| `/principal-architect:update [options]` | Scanează complet un pachet existent, scrie o diferență de dovezi și reîmprospătează atomic artefactele generate. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Comanda | Ce face |
| --- | --- |
| `/backend:vorcl <goal>` | Obiectiv → sarcini → ciclu pentru munca de backend. |
| `/backend:create-api <endpoint>` | Generați un punct final API pe arhitectura modulară, acoperit complet de OpenAPI. |
| `/backend:refactor <target>` | Refactorizarea codului fără a modifica comportamentul. |
| `/backend:optimize <target>` | Optimizarea performanței. |
| `/backend:test <target>` | Generați teste pentru cod. |

### 🟣 frontend — React / Next.js
| Comanda | Ce face |
| --- | --- |
| `/frontend:vorcl <goal>` | Obiectiv → sarcini → ciclu pentru lucrul frontal. |
| `/frontend:create-component <spec>` | Generați o componentă UI urmând structura caracteristicii. |
| `/frontend:refactor <target>` | Refactorizați UI / cârlige fără a schimba comportamentul. |
| `/frontend:optimize <target>` | Optimizați randarea / pachetul / Core Web Vitals. |
| `/frontend:test <target>` | Generați teste de componente. |

### 📱 expo-mobil — React Native / Expo| Comanda | Ce face |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Obiectiv → Task Master ciclu pentru Expo munca mobilă. |
| `/expo-mobile:create-module <domain>` | Creați o porțiune de afaceri modulară cu doar straturile de care are nevoie complexitatea sa. |
| `/expo-mobile:create-screen <flow>` | Creați o rută subțire Expo Router plus un ecran și stări deținute de modul. |
| `/expo-mobile:design-screen <flow>` | Creați un ecran premium cu simboluri de design/mișcare partajate, stări și accesibilitate. |
| `/expo-mobile:motion <interaction>` | Proiectați navigație nativă, arcuri, gesturi, tactile și mișcare redusă de rezervă. |
| `/expo-mobile:add-api <contract>` | Adăugați chei de schemă/DTO/mapper/interogare și integrare TanStack Query. |
| `/expo-mobile:audit [scope]` | Garanția arhitecturii doar în citire și auditul bazat pe dovezi. |
| `/expo-mobile:ui-audit [scope]` | Sistem de proiectare numai în citire, audit de mișcare, interacțiune, accesibilitate și performanță. |
| `/expo-mobile:compatibility [app] [change]` | Audit de compatibilitate live numai pentru citire Expo/RN/Node/pachet/native-runtime față de sursele oficiale versionate. |
| `/expo-mobile:test <scope>` | Rulați unitatea de domeniu, React Native Testare bibliotecă și Maestro verificări. |

### 🟠 analizor — audit de cod (numai citire)
| Comanda | Ce face |
| --- | --- |
| `/analyzer:vorcl <goal>` | Auditează un obiectiv prin Task Master — constatările devin sarcini. |
| `/analyzer:audit` | Audit complet: erori, tipuri, DB, batjocuri de front-end, mirosuri de backend. |
| `/analyzer:bugs` | Vânează erori — erori nerezolvate, condiții de cursă, cazuri limită. |
| `/analyzer:types` | Verificarea tipului — `tsc`, `any`, aruncări nesigure, deriva de tip zod↔. |
| `/analyzer:db` | Audit DB structura — schemă, indici, FK, N+1, migrări. |
| `/analyzer:mocks` | Găsiți modele / date false pe front-end. |
| `/analyzer:backend` | Găsiți codul backend „prost” - încălcări ale arhitecturii, logica în controlere. |

### 🟡 swagger — OpenAPI/Swagger acoperire (orice stivă)
| Comanda | Ce face |
| --- | --- |
| `/swagger:vorcl <goal>` | Obiectiv de acoperire completă prin Task Master — audit → sarcini → acoperire → verificare. |
| `/swagger:audit` | Numai citire: găsiți rute care nu sunt acoperite în totalitate de specificații. |
| `/swagger:cover <route>` | Acoperiți o rută/modul — parametri, răspunsuri, descrieri, securitate + verificare. |

### 🔴 firecrawl — cercetare web
| Comanda | Ce face |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Scopul cercetării prin Task Master — colectați date web pentru a obține un rezultat final. |
| `/firecrawl:search <query>` | Căutare pe Web pentru surse pentru o întrebare. |
| `/firecrawl:scrape <url>` | Răzuiți o adresă URL în markdown/JSON. |
| `/firecrawl:map <url>` | Harta adresele URL ale unui site. |
| `/firecrawl:crawl <url>` | Accesați cu crawlere recursiv o secțiune/un site. |
| `/firecrawl:extract <url>` | Extracție structurată printr-o schemă JSON. |
| `/firecrawl:setup` | Instalați/verificați CLI plus abilități oficiale de construcție și flux de lucru (cu confirmare). |
| `/firecrawl:interact <url>` | Faceți clic, navigați sau completați formularele atunci când scrapingul este insuficient. |
| `/firecrawl:parse <file>` | Analizați un document local/privat în markdown sau JSON. |
| `/firecrawl:monitor <action>` | Listați verificările sau gestionați monitoare recurente de schimbare a paginii. |
| `/firecrawl:agent <goal>` | Rulați o sarcină de agent Firecrawl de lungă durată limitată. |
| `/firecrawl:research <query>` | Căutați lucrări și GitHub context de cercetare. |
| `/firecrawl:ask <jobId>` | Diagnosticați o lucrare Firecrawl eșuată. |
| `/firecrawl:docs-search <question>` | Căutați documentația oficială curentă Firecrawl. |
| `/firecrawl:integrate <feature>` | Adăugați Firecrawl la codul aplicației prin abilitățile de construire din amonte. |
| `/firecrawl:deliverable <artifact>` | Produceți un rezumat, un audit, o listă de clienți potențiali sau un alt artefact al fluxului de lucru. |`/firecrawl:setup` rulează fluxul oficial `firecrawl-cli init --all` numai după confirmare. Aptitudinile oficiale `firecrawl-*` existente au prioritate și sunt păstrate de către instalatorul Codex/Cursor; AVF furnizează alternative compatibile pentru abilitățile lipsă. Operațiunile live sunt direcționate prin CLI → MCP → REST/fără cheie.

### 🟤 randare — găzduire / implementare (Rendare)
| Comanda | Ce face |
| --- | --- |
| `/render:vorcl <goal>` | Scopul infrastructurii prin Task Master — implementați/diagnosticați/configurați pentru a finaliza. |
| `/render:deploy <service>` | Implementați/redistribuiți un serviciu. |
| `/render:logs <service>` | Jurnalele de service și diagnosticarea până la cauza principală. |
| `/render:status <service>` | Starea serviciului + implementare + valori. |
| `/render:query <sql>` | SQL numai pentru citire față de Render Postgres. |

### 🟦 bază de date — DB inginer / DBA (Postgres / MongoDB / Redis)
| Comanda | Ce face |
| --- | --- |
| `/database:vorcl <goal>` | Obiectivul de date prin Task Master — schemă/interogări/migrări/cache până la finalizat. |
| `/database:query <query>` | Interogare/analitică numai pentru citire. |
| `/database:schema <target>` | Proiectați / revizuiți schema și integritatea datelor. |
| `/database:migrate <change>` | Planificați o migrare sigură, reversibilă a schemei/datelor. |
| `/database:optimize <target>` | Optimizare — indexuri, N+1, planuri de interogare, paginare. |
| `/database:cache <target>` | Redis — TTL, invalidare, blocări, limitare a ratei, fluxuri. |

### ⚪ rezistență — gestionarea erorilor + înregistrare în jurnal
| Comanda | Ce face |
| --- | --- |
| `/resilience:vorcl <goal>` | Obiectiv de fiabilitate prin Task Master — cod de acoperire cu try/catch + jurnal. |
| `/resilience:harden <target>` | Codul înfășurat în try/catch/finally cu înregistrare solidă, fără eșecuri silențioase. |
| `/resilience:logging <target>` | Adăugați/remediați înregistrarea structurată — niveluri, context, fără secrete/PII. |
| `/resilience:audit` | Numai citire: găsiți erori silențioase, capturi goale, goluri de înregistrare. |

### 🖼️ captură de ecran — captură de ecran UI → cod
| Comanda | Ce face |
| --- | --- |
| `/screenshot:vorcl <goal>` | Un set de ecrane din capturi de ecran prin Task Master — defalcare → cod. |
| `/screenshot:analyze <image>` | Defalcare numai în citire — aspect, componente, jetoane, stări → plan. |
| `/screenshot:convert <image> [framework]` | Generați cod rulabil complet dintr-o captură de ecran (implicit React + Tailwind v4). |
| `/screenshot:tokens <image>` | Extrageți jetoanele de design (culori OKLCH, tipografie, spațiere) în Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Faceți ca UI generat să răspundă — puncte de întrerupere, fluid, `clamp()`, interogări container. |

### 🎨 design-studio — produs și design vizual
| Comanda | Ce face |
| --- | --- |
| `/design-studio:vorcl <goal>` | Scopul complet de proiectare prin Task Master — context → variante → HTML → previzualizare → verificare → export. |
| `/design-studio:create <brief>` | Creați un artefact vizual de sine stătător lustruit sau hi-fi UI. |
| `/design-studio:prototype <flow>` | Construiți un prototip interactiv web/mobil cu stări și tranziții. |
| `/design-studio:wireframe <flow>` | Construiți un cadru low-fi axat pe arhitectura informațiilor și UX. |
| `/design-studio:design-system <operation>` | Creați, importați, compilați, legați, reîmprospătați sau verificați un sistem de proiectare. |
| `/design-studio:import <type> <source>` | Importați Figma `.fig`, GitHub sau HTML/CSS cu proveniență. |
| `/design-studio:deck <brief>` | Construiți un deck HTML cu note de difuzor, animații și opțional PPTX editabil. |
| `/design-studio:document <brief>` | Creați un document gata de tipărit, un CV, un memoriu, o pagină sau un raport. |
| `/design-studio:animation <brief>` | Construiți un artefact de mișcare și opțional redați-l în MP4. |
| `/design-studio:research <question>` | Creați un artefact de cercetare vizuală susținut de sursă. |
| `/design-studio:export <project> <format>` | Exportați în format autonom HTML, PDF, PPTX, MP4 sau un format de transfer. |
| `/design-studio:review <target>` | Examinare vizuală numai în citire, UX, receptivă, a11y și a sistemului de proiectare. |

### 🔎 cercetare vizuală — captură de ecran → răspuns web verificat
| Comanda | Ce face |
| --- | --- |
| `/visual-research:vorcl <goal>` | Cercetare capturi de ecran în mai mulți pași prin Task Master. |
| `/visual-research:identify <image>` | Identificați site-ul, pagina și caracteristica cu dovezi de încredere. |
| `/visual-research:search <image> <target>` | Găsiți pagina reală sau documentația oficială din indicii vizuale. |
| `/visual-research:answer <image> <question>` | Răspundeți folosind dovezi de captură de ecran, documente oficiale și date live actuale. |
| `/visual-research:hints <image> <goal>` | Oferiți pași siguri, susținuți de documentație pentru interfața vizibilă. |

### 🎯 identificați — captură de ecran → plasați într-un proiect existent (numai citire)
| Comanda | Ce face |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Găsiți/înțelegeți/modificați UI existente dintr-o captură de ecran prin Task Master — hartă → sarcini → delegat. || `/pinpoint:locate <image>` | Localizați componenta/fișierele existente dintr-o captură de ecran - `file:line`, fără cod nou. |
| `/pinpoint:route <image>` | Identificați ruta/pagina pe care se află ecranul (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <image>` | Indicați controlul exact (buton/câmp) și gestionarea acestuia în cod. |
| `/pinpoint:trace <target>` | Urmăriți logica din spatele unui element — handler → stare → date-fetch → API. |
| `/pinpoint:handoff <change>` | Creați o solicitare de editare precisă pe baza codului existent și delegați la `frontend`/`backend`. |

### 📊 drawio — diagrame (draw.io / diagrams.net)
| Comanda | Ce face |
| --- | --- |
| `/drawio:vorcl <goal>` | Un set de diagrame prin Task Master — build to done. |
| `/drawio:create <description> [type]` | Construiți o diagramă dintr-o descriere text (XML nativ valid). |
| `/drawio:pmp <type> <project>` | Construiți o diagramă PMP/PMBOK - WBS, PERT/CPM, Gantt, RACI, matrice de risc, grila părților interesate. |
| `/drawio:convert <source> [type]` | Convertiți o sursă într-o diagramă — DB schemă → ERD, foldere → arbore, cod → UML, sirenă/CSV/JSON. |
| `/drawio:refine <file>` | Rafinați un `.drawio` existent — aspect, temă, adăugați/eliminați noduri, aliniați la grilă. |

### 🗺️ archmap — harta arhitecturii din cod| Comanda | Ce face |
| --- | --- |
| `/archmap:vorcl <goal>` | Un obiectiv de cartografiere prin Task Master — construiți după un set de artefacte verificat. |
| `/archmap:map [repo]` | Canal complet: extracție → `architecture.json` → adnotare LLM → toate formatele (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Numai extracție — `architecture.json` citibil de mașină cu `source:{file,line}` pe fiecare nod. |
| `/archmap:annotate [json]` | Îmbogățirea LLM a unui `architecture.json` existent (memorie agent, semantică a fluxului de date); fapte nedovedite retrogradate automat la `inferred`. |
| `/archmap:html [json]` | Hartă HTML interactivă autonomă — comută layer, grinzi de urmărire, nod → `file:line` panou, căutare, imprimare CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (cu mai multe pagini: Prezentare generală / ERD / API / Agenți) și/sau Mermaid vizualizări, validate. |

### 🧜 sirenă — Mermaid diagrame (+ randare reală)
| Comanda | Ce face |
| --- | --- |
| `/mermaid:vorcl <goal>` | Un set de diagrame prin Task Master — build to done (verificat de randare). |
| `/mermaid:create <description> [type]` | Construiți o diagramă dintr-o descriere — sintaxă validă, verificată printr-o randare reală; vă înmânează dosarul. |
| `/mermaid:convert <source> [type]` | Convertiți o sursă în Mermaid — DB schemă → ER, cod → clasă/secvență, foldere → organigramă, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Sintaxă + test de redare reală; găsiți și remediați erorile (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Exportați în SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Rafinați un `.mmd` existent — direcție, subgraf, classDef/stiluri, lizibilitate. |

### 🧪 testare — teste și verificare
| Comanda | Ce face |
| --- | --- |
| `/testing:vorcl <goal>` | Un obiectiv de testare/verificare prin Task Master — unitate + integrare + e2e de finalizat. |
| `/testing:unit <file\|module>` | Teste unitare (Vitest/Jest) — cale fericită, limite, erori; le rulează și arată rezultatul. |
| `/testing:integration <endpoint\|module>` | Teste de integrare (Supertest/inject, real DB sau testcontainers). |
| `/testing:e2e <scenario>` | Playwright E2E pentru o cale critică de utilizator — selectoare de rol, dispozitive de fixare, urmărire la eșec. |
| `/testing:verify <task\|testStrategy>` | Execută `testStrategy` a unei sarcini și returnează un verdict PREGĂTIT / NU GĂTIT cu rezultate reale. |
| `/testing:coverage [path]` | Raport de acoperire cu constatări - ce cod critic nu este testat; creează sarcini. |
| `/testing:flaky <test>` | Diagnostică un test instabil (cursă, cronometrare, stare partajată, batjocuri) și îl remediază definitiv. |

### 🌿 gitflow — flux de lucru și versiuni git
| Comanda | Ce face |
| --- | --- |
| `/gitflow:vorcl <goal>` | Un obiectiv git/release prin Task Master (pregătirea unei versiuni, curățarea istoricului, ramură caracteristică). |
| `/gitflow:commit <files\|scope>` | O comitere după nume (niciodată `git add .`) cu un mesaj de confirmare convențională; se oprește pe WIP necunoscut. |
| `/gitflow:pr <base> <title>` | Branch → commit → pull request (gh / GitHub MCP) cu ce/de ce/cum-verificat. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Păstrați un jurnal de modificări) generat din comiterea dintre etichete. |
| `/gitflow:release <version\|auto>` | Semver de la comitere → sincronizare versiuni manifest → etichetă → GitHub lansare. Apăsați numai după confirmarea explicită. |
| `/gitflow:audit [branch]` | Audit istoric numai pentru citire: încălcări ale convențiilor, comite de descărcare, bloburi mari, ramuri orfane. |

### 🛡️ securitate — audit de securitate (numai citire)
| Comanda | Ce face |
| --- | --- |
| `/security:vorcl <goal>` | Un obiectiv de securitate prin Task Master — audit → constatări → sarcini → remedieri delegate. |
| `/security:secrets [path\|branch]` | Secretele din arborele de lucru ȘI istoria git (toate ramurile); `${VAR:-}` substituenții nu sunt secrete. |
| `/security:owasp [path]` | OWASP Top 10 în cod: injecții, XSS, autentificare, expunere de date, CORS/cookie-uri — cu fișier:dovadă de linie. |
| `/security:deps` | CVE-uri de dependență prin npm audit / lockfiles — severitate, steaguri de schimbare a rupturii. |
| `/security:pii [path]` | Riscuri PII/GDPR: e-mailuri, telefoane, carduri în cod și jurnale; căile private ale dezvoltatorului. |
| `/security:pre-push [branch]` | Verificare rapidă combinată a fișierelor modificate înainte de un push: secrete + injecții + PII; verdictul verde/rosu. |

### 📝 documente — documentație
| Comanda | Ce face |
| --- | --- |
| `/docs:vorcl <goal>` | Un obiectiv de documentare prin Task Master. |
| `/docs:readme [path]` | Creați/actualizați README — ce/quickstart/usage/config/troubleshooting; exemple verificate; versiuni de limbă sincronizate. || `/docs:api [spec]` | API documente generate din specificația OpenAPI (puncte finale, parametri, exemple de curl); sugerează `/swagger:audit` dacă nu există specificații. |
| `/docs:architecture` | ARCHITECTURE.md — module, limite, flux de date; diagrame delegate la `mermaid`/`drawio`. |
| `/docs:contributing` | CONTRIBUTING.md — setare, structură, teste, convenții de commit (aliniat cu `gitflow`), proces PR. |
| `/docs:release-notes <version>` | Note de lansare pentru o versiune din CHANGELOG/history. |
| `/docs:audit` | Docs-doar citire↔verificare declinare a codului: link-uri întrerupte, exemple/contoare învechite, traduceri nesincronizate. |

### 🐳 devops — containere și CI/CD
| Comanda | Ce face |
| --- | --- |
| `/devops:vorcl <goal>` | Un obiectiv de infrastructură prin Task Master. |
| `/devops:dockerfile [app-type]` | Scrieți/revizuiți un Dockerfile — cu mai multe etape, bază subțire, non-root, HEALTHCHECK; verificat printr-un `docker build` real. |
| `/devops:compose` | docker-compose.yml pentru dezvoltarea locală (aplicație + DB); schimbările env au nevoie de `--force-recreate`, așteaptă sănătos. |
| `/devops:ci [type]` | GitHub Acțiuni — flux de lucru PR (lint+typecheck+test, npm cache), implementare flux de lucru, permisiuni minime. |
| `/devops:env` | Inventar variabil de mediu: unde se citește, ce este necesar, `.env.example` șablon; secrete niciodată în imagini. |
| `/devops:monitoring` | Jurnalele structurate (pino/JSON), punctul final de sănătate, despre ce să avertizeze; Redați valorile prin agentul `render`. |

### 📡 liveboard — consiliu de operațiuni local efemer
| Comanda | Ce face |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Porniți un tablou de bord elegant în 43 de limbi pe un port localhost gratuit; Task Master schimbă fluxul prin SSE și reconciliază la fiecare 5 minute. |
| `/liveboard:vorcl <goal>` | Dezvoltați sau modificați propriul liveboard prin fluxul de lucru Task Master necesar. |

Liveboard citește Git arbori de lucru, procese locale Claude/Codex/Cursor și `.taskmaster/tasks/tasks.json` ale fiecărui arbore de lucru. Starea de rulare rămâne în memorie și dispare când procesul de prim-plan se oprește. UI detectează limba browserului și oferă 43 de locații, inclusiv engleză, rusă, ucraineană, germană, franceză, spaniolă, portugheză, italiană, poloneză, turcă, chineză, japoneză, arabă, olandeză, cehă, slovacă, română, maghiară, bulgară, sârbă, croată, slovenă, greacă, ebraică, persană, hindi, bengaleză, urdu, indoneziană, malay, coreeană, suedeză, finlandeză, estonă, daneză, suedeză, finlandeză, daneză, norvegiană letonă, lituaniană, georgiană, armeană și azeră. Arabă, ebraică, persană și urdu folosesc aspectul RTL.

Configurare directa:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: proiect ale cărui Git arbori de lucru și Task Master fișiere sunt scanate.
- `--port 0`: selectați automat un port liber.
- `--interval`: interval complet de reconciliere în milisecunde; vizionarea fișierelor fluxuri încă Task Master se modifică imediat.
- Puncte finale: `/health`, `/api/snapshot`, `/api/events` (SSE) și `POST /api/refresh`.
- Păstrați `--host 127.0.0.1` cu excepția cazului în care intenționați în mod explicit să expuneți informațiile despre proiect în rețea.

---

## Configurare (MCP și taste)

Pachetul nu are **nu există backend la distanță sau bază de date**. Liveboard-ul opțional este un proces în memorie doar pentru gazdă locală. MCP serverele au nevoie de jetoane și **fiecare utilizator își oferă propriile**. Pentru ca acest lucru să funcționeze identic între **Claude Code, Codex, Cursor și Kimi CLI** — și indiferent dacă lansați de pe un terminal sau de pe Dock / Spotlight / un IDE — fiecare server stdio MCP este pornit printr-un lansator mic (`bin/mcp-env.mjs`) care vă citește cheile dintr-un **un fișier**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Programul de instalare îl creează din [`.env.example`](../.env.example). Deschideți-l și completați doar cheile pe care le utilizați:

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

> **De ce un lansator în loc de `~/.zshrc`?** Expansiunea Env-var diferă în funcție de timp de rulare (`${VAR:-}` în Claude, `${env:VAR}` în Cursor, literale în Codex/Kimi) și fiecare runtime citește doar mediul în care a fost lansat. Eroare „MCP env not set”. Citirea dintr-un fișier `.env` elimină ambele probleme simultan.**Precedență** (câștigă mai târziu): `~/.config/agent-vorcl-flow/.env` partajat → un `./.env` în rădăcina proiectului → un `export` real în shell-ul tău. Păstrați cheile globale în fișierul partajat, înlocuiți per-proiect (de exemplu, un alt `MONGODB_URI`) cu un proiect `.env` și un export shell autentic câștigă în continuare pentru CLI rulări. Puteți îndrepta lansatorul către un alt fișier cu `AGENT_VORCL_ENV_FILE=/path/.env`.

Un server a cărui cheie necesară lipsește pur și simplu **nu pornește** — veți vedea un `[agent-vorcl-flow] MCP «…» is not configured: …` cu o singură linie în jurnalul MCP al rulării și orice alt server continuă să funcționeze. Adăugați cheia la `.env` și reporniți. (Puteți păstra nume `GITHUB_TOKEN`/`MONGODB_URI` — lansatorul le mapează la `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` la care se așteaptă serverele.)

> ⚠️ **Necesar pentru comenzile Task Master bazate pe AI:** configurați cel puțin un furnizor selectat — `ANTHROPIC_API_KEY` pentru Claude, `OPENAI_API_KEY` pentru GPT sau Codex CLI OAuth. Fără acreditările pentru modelul selectat în `.taskmaster/config.json`, `/vorcl` nu poate genera sau extinde sarcini.

Alegeți care Task Master furnizor realizează generarea; cheile singure nu selectează modelul:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Comanda folosește fluxul oficial `task-master models` și stochează doar selecția de model în `.taskmaster/config.json`. `PERPLEXITY_API_KEY` este opțional și este necesar numai atunci când Perplexity este selectat ca model de cercetare.

Serverele de la distanță **vercel** și **render** folosesc OAuth (autorizare cu `/mcp` într-un browser). Pentru Render în headless/CI, setați `RENDER_API_KEY` în mediul dvs. și adăugați o intrare de antet Bearer la acel server pentru timpul de rulare.

---

## Verificați instalarea

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

Codex nu are „plugin-uri”, așa că aceleași capabilități sunt exprimate ca **aptitudini**, **profiluri** și un `AGENTS.md` router:

| Claude Code | Codex echivalent |
| --- | --- |
| subagent `@agent-vorcl-flow:frontend` | skill persona `$frontend` + `codex --profile frontend` |
| comanda `/analyzer:audit` | abilitate de sarcină `$analyzer-audit` |
| comanda `/vorcl` | abilitate de sarcină `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` în `config.toml` |
| `SessionStart` cârlig | rutarea rolurilor în `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Consultați [`codex/README.md`](../codex/README.md) pentru maparea completă.

---

## Cursor

Cursor utilizează același format `SKILL.md` deschis ca adaptorul Codex, plus subagenți personalizați nativi și configurație globală MCP:

| Agent-Vorcl-Flow concept | Cursor echivalent |
| --- | --- |
| rol `backend` | subagent personalizat `/avf-backend` în `~/.cursor/agents` |
| comanda sarcinii `/backend:create-api` | pricepere `/backend-create-api` |
| universal `/vorcl` | pricepere `/vorcl` |
| `.mcp.json` | servere îmbinate în `~/.cursor/mcp.json` |

Programul de instalare convertește definițiile rolului în Cursor frontmatter, prefixează subagenții cu `avf-` pentru a evita coliziunile de nume de abilități, folosește `model: inherit` și marchează agenții numai de audit ca `readonly: true`. Cele MCP intrări de server existente cu aceleași nume sunt păstrate. Vezi [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) încarcă nativ abilități de agent, fișiere de agent personalizate și cârlige pentru ciclul de viață; De asemenea, AVF combină aceleași servere MCP folosite de Claude și Cursor:

| Agent-Vorcl-Flow concept | Kimi CLI echivalent |
| --- | --- |
| abilități/comenzi sarcini | `~/.kimi/skills` și `/skill:<name>` |
| Expo agent personalizat | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo Apărător PostToolUse | fuzionat în `~/.kimi/config.toml` |
| `.mcp.json` | servere îmbinate în `~/.kimi/mcp.json` |
| fișier cheie per runtime | `~/.config/agent-vorcl-flow/.env` partajat (prin intermediul lansatorului) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI nu are o expansiune `${VAR}` în `mcp.json`, așa că cheile vin din `.env` partajat prin intermediul lansatorului – exact ca și celelalte timpi de execuție. Vezi [`kimi/README.md`](../kimi/README.md).

---

## Structura proiectului

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       24 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (46 skills; some ship references, scripts, tests or HTML assets)
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

**Cum se potrivește:** `agents/*.md` declarați un rol și, în primul rând, `skills:`, atașați abilitățile → abilitățile în `skills/*/SKILL.md` sunt încărcate automat după descriere → `commands/<agent>/*.md` oferă `/agent:command` comenzi rapide care deleg sub-agent → `.mcp.json` oferă agenților instrumentele lor, fiecare început prin `bin/mcp-env.mjs` care încarcă secretele din `.env`. Un cârlig `SessionStart` spune Claude agenții sunt disponibili.

---

## Licență

MIT — liber de utilizat, copiat, modificat și distribuit; furnizat „ca atare”, fără garanție și fără răspundere. Vezi [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
