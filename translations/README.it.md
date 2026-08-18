<div align="center">

# Agent-Vorcl-Flow

**Un team di sub-agenti IA specializzati per [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) e [Kimi CLI](https://github.com/MoonshotAI/kimi-cli), con abilità, comandi e strumenti MCP.**
Un comando `npx` li installa. Nessun backend remoto o hosting nel cloud: il tuo agente di codifica esegue tutto localmente.

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
[Português](./README.pt.md) · [**Italiano**](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 72c33da6cabafc1329d572eb271a485d678403c7f9b5e6a96911fd227cabbc6c. -->

</div>

---

## What is this?

Agent-Vorcl-Flow trasforma un agente di codifica supportato in un **team di ingegneri strutturato**. Invece di un assistente generale, avrai a disposizione **25 sub-agenti focalizzati** (architetto, architetto principale basato sul codice, backend, frontend, Expo ingegnere mobile, ingegnere di progettazione visiva e di prodotto, DB ingegnere, revisore dell'integrità multilingue, cartografo di architettura, operatore liveboard e altro), ciascuno con le proprie **competenze** di dominio, rapidi **comandi barra** e gli **MCP strumenti** di cui ha bisogno. Ogni attività non banale viene eseguita attraverso un ciclo disciplinato **Task Master** — *obiettivo → attività → implementazione → verifica → fatto* — in modo che il lavoro venga pianificato, monitorato e sopravviva alle interruzioni.

- 🧩 **25 sub-agenti**, 71 abilità, 155 comandi barra
- ⚡ **Installazione con un solo comando** per Claude Code, Codex, Cursor e/o Kimi CLI — `npx`
- 🔌 **11 MCP server** collegati (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, file system, Task Master, Mermaid)
- 🔑 **Un file `.env` per tutti i runtime**: chiavi lette da un launcher, non da `~/.zshrc`, quindi funzionano anche dai lanci GUI/IDE; nessun servizio AVF remoto; liveboard è solo localhost ed effimero
- 🤝 **Gira su Claude Code, GPT Codex, Cursor e Kimi CLI** dalla stessa fonte

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** e/o **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Scegli come target un singolo runtime con un flag:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Cosa fa l'installatore:

| Durata | Azione |
| --- | --- |
| **Livello condiviso** | Copia il programma di avvio in `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` e crea `~/.config/agent-vorcl-flow/.env` dal modello (una volta): il file chiave singolo per ogni runtime. |
| **Claude Code** | Registra questo repository come plugin **marketplace** e abilita il plugin (tramite `claude plugin …`, con un fallback diretto `~/.claude/settings.json`). |
| **GPT Codex** | Unisce le abilità in `~/.agents/skills` e i blocchi `config.toml` + `AGENTS.md` in `~/.codex` (idempotente, tra i marcatori). |
| **Cursor** | Installa le competenze in `~/.cursor/skills`, gli agenti secondari personalizzati nativi in ​​`~/.cursor/agents` e unisce i server mancanti in `~/.cursor/mcp.json`. |
| **Kimi CLI** | Installa le competenze in `~/.kimi/skills`, l'agente personalizzato nativo Expo in `~/.kimi/agents`, entrambi gli hook di architettura/UI Expo in `~/.kimi/config.toml` e unisce i server MCP. |

> Il programma di installazione non inserisce mai i tuoi segreti: crea solo una `.env` vuota dal modello. Qui si aggiungono le chiavi (vedi [Configuration](#configuration-mcp--keys)).

### Update to the latest version

Esegui nuovamente il programma di installazione con il tag npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

Per aggiornare solo un runtime, mantieni lo stesso flag di runtime utilizzato durante l'installazione:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

L'aggiornamento si sovrappone a competenze, agenti, hook, launcher e blocchi di configurazione gestiti da Agent-Vorcl-Flow. Mantiene invariati il ​​tuo `~/.config/agent-vorcl-flow/.env` esistente e i suoi segreti e preserva le abilità Firecrawl a monte. Successivamente riavviare il client di codifica aggiornato (o eseguire `/reload-plugins` in Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Dopo l'installazione, **riavvia Claude Code** (o esegui `/reload-plugins` in una sessione aperta) per caricare gli agenti.

---

## How to use

Gli esempi in questa sezione utilizzano la sintassi Claude Code; vedere le mappature [Cursor](#cursor) e [GPT Codex](#gpt-codex) di seguito per la loro sintassi nativa. In Claude Code ci sono **tre modi** per invocare la squadra.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` stabilisce quale sub-agente dovrebbe possedere il lavoro e guida l'intero ciclo Task Master. `/audit` rileva automaticamente backend, frontend, dispositivi mobili, dati e infrastruttura e scrive un `PROJECT_AUDIT.md` basato sull'evidenza utilizzando tutti i ruoli rilevanti. `/init-code` legge il repository in modo statico e crea un `PROJECT_DESCRIPTION.md` basato sull'evidenza senza eseguire il codice del progetto. Una volta che il file esiste, ogni ruolo di modifica deve mantenere sincronizzate le sezioni interessate; la descrizione comprovata deriva blocca il completamento dell'attività.

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

Ogni agente ha anche il proprio punto di ingresso `/<agent>:vorcl` che esegue il ciclo Task Master limitato a quell'agente.

### The Task Master loop
Ogni attività non banale scorre attraverso **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Ciò mantiene il lavoro pianificato, controllato e ripristinabile: nulla viene dichiarato "fatto" senza aver superato la fase di verifica.

---

## The agents| Agente | Ruolo | In evidenza |
| --- | --- | --- |
| 🔵 **architetto** | Architetto di sistemi e soluzioni | Analisi dei requisiti, progettazione di sistemi/DB/API, revisioni dell'architettura |
| 🏛️ **architetto-principale** | Principale architetto software/infrastruttura/AI | Esegue la scansione del codice reale in 11 lingue e crea MD, JSON, HTML, PDF, draw.io e Mermaid supportati da prove; gli aggiornamenti della scansione completa preservano le annotazioni |
| 🟢 **backend** | Sviluppatore backend | Nodo/TS, Postgres, Redis; architettura modulare; ogni percorso interamente coperto da OpenAPI |
| 🟣 **frontend** | Frontend (React 19 / Next.js App Router) | Componenti, stato, recupero dei dati, ottimizzazione del rendering/bundle, test |
| 📱 **expo-mobile** | React Native + Expo ingegnere | Architettura modulare più sistema di progettazione/movimento/interazione, navigazione nativa, token, gesti, aspetti tattili, movimento ridotto |
| 🟠 **analizzatore** | Revisore del codice (sola lettura) | Bug, sicurezza dei tipi, struttura DB, mock del frontend, odori del backend |
| 🧭 **integrità** | Revisore dell'integrità del codice multilingue (sola lettura) | Hardcode di produzione e perdita di mock/fake/demo/fixture su frontend/backend/mobile/condiviso |
| 🟡 **spavalderia** | Copertura OpenAPI/Swagger (qualsiasi stack) | Trova percorsi non completamente documentati e li copre, con verifica |
| 🔴 **firecrawl** | Ricercatore web | Live CLI/MCP/REST, integrazione di app e flussi di lavoro con dati Web finiti |
| 🟤 **render** | Hosting e distribuzione (Rendering) | Distribuzioni, diagnostica basata su log, metriche, variabili di ambiente, rendering Postgres |
| 🟦 **database** | DB ingegnere/DBA | Schema, query e piani, indici, N+1, migrazioni reversibili sicure, cache |
| ⚪ **resilienza** | Affidabilità: errori + registrazione | provare/catturare i limiti corretti, errori digitati, tentativi/timeout, log strutturati |
| 🖼️ **screenshot** | Schermata UI → codice | Trasforma uno screenshot UI in codice accessibile, reattivo e pronto per la produzione |
| 🎨 **studio-di-design** | Studio di progettazione visiva e prodotto | Locale HTML artefatti, prototipi, wireframe, deck/PPTX, documenti, animazioni, 3D, sistemi di progettazione e importazione Figma/GitHub/HTML; adattato dal MIT `JimLiu/baoyu-design` |
| 🔎 **ricerca-visiva** | Schermata → risposta verificata | Identifica il sito/pagina, trova documenti ufficiali, controlla i dati in tempo reale e risponde con URL e sicurezza |
| 🎯 **localizzare** | Screenshot → posiziona in un progetto esistente (sola lettura) | Basa uno screenshot dell'app in esecuzione nella base di codice reale: componente, `file:line`, percorso/pagina, controllo esatto e logica dietro di esso; non crea nulla, delega la modifica |
| 📊 **drawio** | Diagrammi (draw.io / diagrams.net) | Diagramma di flusso, BPMN, UML, ERD, rete/cloud e PMP/PMBOK (WBS, Gantt, RACI...) |
| 🗺️ **archmap** | Cartografo di architettura | Codice deterministico → `architecture.json` (ogni nodo con `source:{file,line}`) → mappa interattiva HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF; i fatti non dimostrati sono contrassegnati con `inferred` |
| 🧜 **sirena** | Mermaid diagrammi (+ render reale) | diagramma di flusso, sequenza, classe, stato, ER, gantt, gitGraph, mappa mentale...; convalidato tramite mcp-mermaid/`mmdc`; ti porge il file (`.mmd` + SVG/PNG/PDF) |
| 🧪 **test** | Ingegnere di test e verifica | Unità (Vitest/Jest), integrazione (Supertest), E2E (Playwright), copertura, caccia al test instabile; esegue il `testStrategy` di ogni attività: nulla viene "fatto" senza una corsa verde |
| 🌿 **gitflow** | Git flusso di lavoro e versioni | Commit convenzionali, commit per nome (mai `git add .`), PR, Keep-a-Changelog, rilasci semestrali; push solo con conferma esplicita |
| 🛡️ **sicurezza** | Revisore della sicurezza (sola lettura) | Segreti nella cronologia degli alberi e di git, OWASP Top 10, CVE delle dipendenze, PII; i risultati diventano compiti: le correzioni vengono delegate || 📝 **documenti** | Ingegnere della documentazione | README (parità multilingue), API documenti da OpenAPI, ARCHITETTURA, CONTRIBUTI, note sulla versione; ogni esempio verificato rispetto al codice |
| 🐳 **devops** | Contenitori & CI/CD | Dockerfile multistadio, docker-compose per sviluppatori locali, GitHub Pipeline di azioni, igiene ambiente/segreti, monitoraggio |
| 📡 **tavola live** | Consiglio operativo locale | Git alberi di lavoro, processi agente e Task Master attività in tempo reale su una dashboard effimera localhost |

**Alcune cose che vale la pena sapere:**
- **Il frontend parla sempre con un vero API.** Le specifiche OpenAPI del backend sono l'unica fonte di verità; da esso vengono generati i tipi (`openapi-typescript` + `openapi-fetch`). Nessuna presa in giro nel percorso di produzione.
- **`database` le mutazioni richiedono una conferma esplicita.** Le analisi sono di sola lettura; le modifiche a schema/dati (DDL/DML/migrazioni) non vengono mai eseguite senza il tuo consenso.
- **`resilience` viene fornito con un gancio di sicurezza.** Un gancio `PostToolUse` non bloccante (`catch-guard.js`) segnala delicatamente i blocchi `catch {}` vuoti nei file appena modificati.
- **`archmap` non attinge mai dall'immaginazione.** Estrazione e rendering sono strettamente separati: script a dipendenza zero guidano il repository in `architecture.json` (database con cardinalità FK reale, percorsi API, agenti AI con i loro modelli/strumenti/memoria, grafico di importazione, env) e ogni diagramma viene renderizzato solo da quello JSON. Tutto ciò che il LLM aggiunge senza una `file:line` verificabile è contrassegnato con `inferred:true` e disegnato tratteggiato.
- **`principal-architect` è il flusso di lavoro completo di pubblicazione dell'architettura.** Funziona in qualunque repository avvii l'agente, ignora le affermazioni di Markdown come prova della topologia, utilizza WASM Tree-sitter offline in bundle per TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin e Swift, scrive prima `ARCHITECTURE.md`, quindi produce il modello condiviso JSON, autonomo HTML, PDF, draw.io nativo e copiabile Mermaid L0–L4. `update` esegue una nuova scansione completa e conserva annotazioni e file non gestiti.
- **`pinpoint` trova, non crea mai.** Dato uno screenshot di un'app in esecuzione, mappa lo schermo sul codice reale (componente, percorso, controllo esatto e logica dietro di esso) e passa la modifica a `frontend`/`backend`. Funziona su ciò che già esiste (l'inverso di `screenshot`).
- **`visual-research` verifica invece di indovinare.** Tratta uno screenshot come prova, conferma il dominio ufficiale e i documenti, controlla i dati correnti del sito e segnala possibili valori di phishing o obsoleti.
- **`i18n` impone l'"hardcoding in lingua zero".** Gli agenti rilevano innanzitutto se un progetto è multilingue e si adattano: le stringhe rivolte all'utente passano attraverso un livello di traduzione (next-intl / react-i18next / i18next), mai inline.

---

## Command referenceOgni comando seguente è un comando barra. `<…>` contrassegna il tuo input.

### `/vorcl` — universal router
| Comando | Cosa fa |
| --- | --- |
| `/vorcl <goal>` | Trasforma qualsiasi obiettivo in attività e lo indirizza al giusto agente secondario, quindi esegue l'intero ciclo fino al completamento. |
| `/audit [path] [focus]` | Audit multiruolo approfondito di sola lettura → sistemi rilevati, risultati di sicurezza/CVE/resilienza, architettura target e fasi `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | Scoperta di codebase statiche → basata sull'evidenza `PROJECT_DESCRIPTION.md`; il codice del progetto non viene mai eseguito. |

### 🔵 architect — architecture
| Comando | Cosa fa |
| --- | --- |
| `/architect:vorcl <goal>` | Obiettivo → compiti → ciclo, mirato all'architettura. |
| `/architect:analyze <context>` | Analizzare i requisiti e il contesto dell'attività. |
| `/architect:design <problem>` | Progettare l'architettura della soluzione (sistema, DB, API). |
| `/architect:review <target>` | Esaminare un'architettura esistente. |

### 🏛️ principal-architect — code-grounded architecture package
| Comando | Cosa fa |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Esegue un obiettivo architettonico di grandi dimensioni attraverso Task Master e artefatti verificati. |
| `/principal-architect:create [options]` | Esegue la scansione del repository corrente e crea MD, JSON, HTML, PDF, draw.io e Mermaid dalle prove del codice. |
| `/principal-architect:update [options]` | Esegue nuovamente la scansione completa di un pacchetto esistente, scrive un diff delle prove e aggiorna atomicamente gli artefatti generati. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Comando | Cosa fa |
| --- | --- |
| `/backend:vorcl <goal>` | Obiettivo → attività → ciclo per il lavoro di backend. |
| `/backend:create-api <endpoint>` | Genera un endpoint API sull'architettura modulare, completamente coperto da OpenAPI. |
| `/backend:refactor <target>` | Refactoring del codice senza modificare il comportamento. |
| `/backend:optimize <target>` | Ottimizzazione delle prestazioni. |
| `/backend:test <target>` | Genera test per il codice. |

### 🟣 frontend — React / Next.js
| Comando | Cosa fa |
| --- | --- |
| `/frontend:vorcl <goal>` | Obiettivo → attività → ciclo per il lavoro frontend. |
| `/frontend:create-component <spec>` | Genera un componente UI seguendo la struttura delle caratteristiche. |
| `/frontend:refactor <target>` | Refactoring UI / hook senza modificare il comportamento. |
| `/frontend:optimize <target>` | Ottimizza rendering/raggruppamento/Core Web Vitals. |
| `/frontend:test <target>`| Genera test dei componenti. |

### 📱 expo-mobile — React Native / Expo

| Comando | Cosa fa |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Obiettivo → Ciclo Task Master per Expo lavoro mobile. |
| `/expo-mobile:create-module <domain>` | Crea una sezione aziendale modulare con solo i livelli necessari per la sua complessità. |
| `/expo-mobile:create-screen <flow>` | Crea un percorso sottile Expo Router più una schermata e stati di proprietà del modulo. |
| `/expo-mobile:design-screen <flow>` | Costruisci uno schermo premium con token di progettazione/movimento, stati e accessibilità condivisi. |
| `/expo-mobile:motion <interaction>` | Progetta navigazione nativa, molle, gesti, aspetti tattili e fallback a movimento ridotto. |
| `/expo-mobile:add-api <contract>` | Aggiungi chiavi schema/DTO/mapper/query e integrazione TanStack Query. |
| `/expo-mobile:audit [scope]` | Protezione dell'architettura di sola lettura e audit basato sull'evidenza. |
| `/expo-mobile:ui-audit [scope]` | Sistema di progettazione di sola lettura, movimento, interazione, accessibilità e controllo delle prestazioni. |
| `/expo-mobile:compatibility [app] [change]` | Controllo di compatibilità live di sola lettura Expo/RN/nodo/pacchetto/runtime nativo rispetto a fonti ufficiali con versione. |
| `/expo-mobile:test <scope>` | Esegui l'unità di dominio, React Native Test della libreria e Maestro controlli. |

### 🟠 analyzer — code audit (read-only)
| Comando | Cosa fa |
| --- | --- |
| `/analyzer:vorcl <goal>` | Controlla un obiettivo tramite Task Master: i risultati diventano compiti. |
| `/analyzer:audit` | Audit completo: bug, tipi, DB, mock del frontend, odori del backend. |
| `/analyzer:bugs` | Caccia ai bug: errori non gestiti, condizioni di gara, casi limite. |
| `/analyzer:types` | Controllo del tipo: `tsc`, `any`, lanci non sicuri, deriva di tipi zod↔. |
| `/analyzer:db` | Struttura dell'audit: schema, indici, FK, N+1, migrazioni. |
| `/analyzer:mocks` | Percorso di compatibilità per dati fittizi/falsi su frontend e backend; delega controlli poliglotti approfonditi all'integrità. |
| `/analyzer:backend` | Trova codice backend "cattivo": violazioni dell'architettura, logica nei controller. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| Comando | Cosa fa |
| --- | --- |
| `/integrity:vorcl <goal>` | Persegue un obiettivo di integrità non banale attraverso Task Master e trasforma i risultati in compiti specifici del proprietario. |
| `/integrity:audit [path]` | Esegue insieme la scansione dell'hardcode e delle false perdite, quindi dimostra la raggiungibilità della produzione. |
| `/integrity:hardcode [path]` | Trova valori letterali utente/config/aziendali che ignorano la localizzazione, la configurazione o il sistema di record. |
| `/integrity:mocks [path]` | Trova strutture fittizie, generatori falsi, dispositivi, dati dimostrativi e risposte statiche raggiungibili dalla produzione. |

Lo scanner a dipendenza zero in bundle supporta TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML e Razor. Nel codice backend contrassegna anche i valori aziendali nascosti nelle costanti, nei campi statici/finali, nei parametri predefiniti, negli argomenti denominati e nei cataloghi statici; il revisore li confronta quindi con schemi/modelli/repository/query/mutazioni di amministrazione per dimostrare che il database, non il codice o la configurazione, possiede il valore. Test, dispositivi, storie, esempi, semi, codice generato e root dei fornitori vengono soppressi per impostazione predefinita; I candidati lessicali non sono difetti finché la raggiungibilità e la proprietà non vengono dimostrate.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Comando | Cosa fa |
| --- | --- |
| `/swagger:vorcl <goal>`| Obiettivo di copertura totale tramite Task Master — audit → attività → copertura → verifica. |
| `/swagger:audit` | Sola lettura: trova percorsi non completamente coperti dalle specifiche. |
| `/swagger:cover <route>` | Copri un percorso/modulo: parametri, risposte, descrizioni, sicurezza + verifica. |

### 🔴 firecrawl — web research
| Comando | Cosa fa |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Obiettivo della ricerca tramite Task Master: raccogliere dati web per ottenere un risultato finale. |
| `/firecrawl:search <query>` | Ricerca sul Web di fonti su una domanda. |
| `/firecrawl:scrape <url>` | Raschia un URL in markdown/JSON. |
| `/firecrawl:map <url>` | Mappa gli URL di un sito. |
| `/firecrawl:crawl <url>` | Eseguire la scansione ricorsiva di una sezione/sito. |
| `/firecrawl:extract <url>` | Estrazione strutturata mediante uno schema JSON. |
| `/firecrawl:setup` | Installa/verifica CLI oltre alle competenze ufficiali relative alla build e al flusso di lavoro (con conferma). |
| `/firecrawl:interact <url>` | Fare clic, navigare o compilare moduli quando lo scraping non è sufficiente. |
| `/firecrawl:parse <file>` | Analizza un documento locale/privato in markdown o JSON. |
| `/firecrawl:monitor <action>` | Elenca i controlli o gestisci i monitoraggi di cambio pagina ricorrenti. |
| `/firecrawl:agent <goal>` | Eseguire un'attività limitata dell'agente Firecrawl a esecuzione prolungata. |
| `/firecrawl:research <query>` | Cerca articoli e GitHub contesto di ricerca. |
| `/firecrawl:ask <jobId>` | Diagnosticare un lavoro Firecrawl non riuscito. |
| `/firecrawl:docs-search <question>` | Cerca la documentazione ufficiale Firecrawl corrente. |
| `/firecrawl:integrate <feature>` | Aggiungi Firecrawl al codice dell'applicazione tramite competenze di compilazione upstream. |
| `/firecrawl:deliverable <artifact>` | Produci un brief, un audit, un elenco di lead o altri artefatti del flusso di lavoro. |`/firecrawl:setup` esegue il flusso ufficiale `firecrawl-cli init --all` solo dopo la conferma. Le competenze ufficiali `firecrawl-*` esistenti hanno la precedenza e vengono conservate dall'installatore Codex/Cursor; AVF fornisce fallback compatibili per le competenze mancanti. Le operazioni live vengono eseguite tramite CLI → MCP → REST/keyless.

### 🟤 render — hosting / deploy (Render)
| Comando | Cosa fa |
| --- | --- |
| `/render:vorcl <goal>` | Obiettivo infra tramite Task Master: distribuisci/diagnostica/configura per completare. |
| `/render:deploy <service>` | Distribuire/ridistribuire un servizio. |
| `/render:logs <service>` | Registri di servizio e diagnostica fino alla causa principale. |
| `/render:status <service>` | Stato del servizio + distribuzione + metriche. |
| `/render:query <sql>` | SQL di sola lettura rispetto a Render Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Comando | Cosa fa |
| --- | --- |
| `/database:vorcl <goal>` | Obiettivo dati tramite Task Master: schema/query/migrazioni/cache da completare. |
| `/database:query <query>` | Query/analisi di sola lettura. |
| `/database:schema <target>` | Progettare/esaminare lo schema e l'integrità dei dati. |
| `/database:migrate <change>` | Pianificare una migrazione di schemi/dati sicura e reversibile. |
| `/database:optimize <target>` | Ottimizza: indici, N+1, piani di query, impaginazione. |
| `/database:cache <target>` | Redis — TTL, invalidazione, blocchi, limitazione della velocità, flussi. |

### ⚪ resilience — error handling + logging
| Comando | Cosa fa |
| --- | --- |
| `/resilience:vorcl <goal>` | Obiettivo di affidabilità tramite Task Master: codice di copertura con try/catch + log. |
| `/resilience:harden <target>` | Avvolgi il codice in try/catch/finally con una registrazione solida, senza errori silenziosi. |
| `/resilience:logging <target>` | Aggiungi/correggi la registrazione strutturata: livelli, contesto, nessun segreto/PII. |
| `/resilience:audit` | Sola lettura: trova errori silenziosi, catch vuoti, lacune di registrazione. |

### 🖼️ screenshot — screenshot UI → code
| Comando | Cosa fa |
| --- | --- |
| `/screenshot:vorcl <goal>` | Una serie di schermate da screenshot tramite Task Master — ripartizione → codice. |
| `/screenshot:analyze <image>` | Suddivisione di sola lettura: layout, componenti, token, stati → piano. |
| `/screenshot:convert <image> [framework]` | Genera codice eseguibile completo da uno screenshot (predefinito React + Tailwind v4). |
| `/screenshot:tokens <image>`| Estrai i token di progettazione (colori OKLCH, tipografia, spaziatura) in Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Rendi reattivo il UI generato: query sui punti di interruzione, fluide, `clamp()` e sul contenitore. |

### 🎨 design-studio — product and visual design
| Comando | Cosa fa |
| --- | --- |
| `/design-studio:vorcl <goal>` | Obiettivo di progettazione completo tramite Task Master — contesto → varianti → HTML → anteprima → verifica → esportazione. |
| `/design-studio:create <brief>` | Crea un artefatto visivo raffinato e autonomo o un impianto hi-fi UI. |
| `/design-studio:prototype <flow>` | Costruisci un prototipo web/mobile interattivo con stati e transizioni. |
| `/design-studio:wireframe <flow>` | Costruisci un wireframe low-fi incentrato sull'architettura dell'informazione e sulla UX. |
| `/design-studio:design-system <operation>` | Crea, importa, compila, associa, aggiorna o controlla un sistema di progettazione. |
| `/design-studio:import <type> <source>` | Importa Figma `.fig`, GitHub o HTML/CSS con provenienza. |
| `/design-studio:deck <brief>` | Costruisci un mazzo HTML con note del relatore, animazioni e PPTX modificabile opzionale. |
| `/design-studio:document <brief>` | Crea un documento, un curriculum, un promemoria, una pagina o un rapporto pronto per la stampa. |
| `/design-studio:animation <brief>` | Costruisci un artefatto di movimento e facoltativamente eseguine il rendering in MP4. |
| `/design-studio:research <question>` | Crea un artefatto di ricerca visiva supportato dall'origine. |
| `/design-studio:export <project> <format>` | Esporta in formato autonomo HTML, PDF, PPTX, MP4 o handoff. |
| `/design-studio:review <target>`| Revisione visiva, UX, reattiva, a11y e del sistema di progettazione di sola lettura. |

### 🔎 visual-research — screenshot → verified web answer
| Comando | Cosa fa |
| --- | --- |
| `/visual-research:vorcl <goal>` | Ricerca di screenshot in più passaggi tramite Task Master. |
| `/visual-research:identify <image>` | Identifica il sito, la pagina e la funzionalità con prove attendibili. |
| `/visual-research:search <image> <target>` | Trova la pagina reale o la documentazione ufficiale da indizi visivi. |
| `/visual-research:answer <image> <question>` | Rispondi utilizzando prove di screenshot, documenti ufficiali e dati attuali in tempo reale. |
| `/visual-research:hints <image> <goal>` | Fornisci passaggi sicuri e supportati dalla documentazione per l'interfaccia visibile. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Comando | Cosa fa |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Trova/comprendi/modifica UI esistente da uno screenshot tramite Task Master — mappa → attività → delega. |
| `/pinpoint:locate <image>` | Individua il/i componente/file esistente/i da uno screenshot — `file:line`, nessun nuovo codice. |
| `/pinpoint:route <image>` | Identificare il percorso/pagina su cui si trova la schermata (Next.js App/Pagine Router, React Router). |
| `/pinpoint:control <image>` | Individuare il controllo esatto (pulsante/campo) e il relativo gestore nel codice. |
| `/pinpoint:trace <target>` | Traccia la logica dietro un elemento: gestore → stato → recupero dati → API. || `/pinpoint:handoff <change>` | Crea una richiesta di modifica precisa rispetto al codice esistente e delega a `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Comando | Cosa fa |
| --- | --- |
| `/drawio:vorcl <goal>` | Una serie di diagrammi tramite Task Master: build to done. |
| `/drawio:create <description> [type]` | Costruisci un diagramma da una descrizione testuale (XML nativo valido). |
| `/drawio:pmp <type> <project>`| Costruisci un diagramma PMP/PMBOK: WBS, PERT/CPM, Gantt, RACI, matrice di rischio, griglia degli stakeholder. |
| `/drawio:convert <source> [type]` | Converti una sorgente in un diagramma: DB schema → ERD, cartelle → albero, codice → UML, sirena/CSV/JSON. |
| `/drawio:refine <file>` | Perfeziona un `.drawio` esistente: layout, tema, aggiungi/rimuovi nodi, allinea alla griglia. |

### 🗺️ archmap — architecture map from code| Comando | Cosa fa |
| --- | --- |
| `/archmap:vorcl <goal>` | Un obiettivo di mappatura tramite Task Master: crea un set di artefatti verificato. |
| `/archmap:map [repo]` | Pipeline completa: estrazione → `architecture.json` → annotazione LLM → tutti i formati (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Solo estrazione: `architecture.json` leggibile dalla macchina con `source:{file,line}` su ogni nodo. |
| `/archmap:annotate [json]`| Arricchimento LLM di un `architecture.json` esistente (memoria dell'agente, semantica del flusso di dati); fatti non dimostrati retrocessi automaticamente a `inferred`. |
| `/archmap:html [json]` | Mappa HTML interattiva autonoma: attiva/disattiva livelli, traccia raggi, nodo → pannello `file:line`, ricerca, stampa CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (multipagina: Panoramica / ERD / API / Agenti) e/o Mermaid visualizzazioni, convalidate. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Comando | Cosa fa |
| --- | --- |
| `/mermaid:vorcl <goal>` | Una serie di diagrammi tramite Task Master — build to done (render-verified). |
| `/mermaid:create <description> [type]` | Costruisci un diagramma da una descrizione: sintassi valida, verificata da un rendering reale; ti porge il file. |
| `/mermaid:convert <source> [type]` | Convertire una sorgente in Mermaid — DB schema → ER, codice → classe/sequenza, cartelle → diagramma di flusso, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Sintassi + test di rendering reale; trovare e correggere gli errori (mmdc/Maid/mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Esporta in SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Perfeziona un `.mmd` esistente: direzione, sottografo, classDef/stili, leggibilità. |

### 🧪 testing — tests & verification
| Comando | Cosa fa |
| --- | --- |
| `/testing:vorcl <goal>` | Un obiettivo di test/verifica tramite Task Master — unità + integrazione + e2e da ​​completare. |
| `/testing:unit <file\|module>` | Test unitari (Vitest/Jest): percorso felice, confini, errori; li esegue e mostra l'output. |
| `/testing:integration <endpoint\|module>` | Test di integrazione (Supertest/inject, real DB o testcontainers). |
| `/testing:e2e <scenario>` | Playwright E2E per un percorso utente critico: selettori di ruolo, dispositivi, traccia in caso di fallimento. |
| `/testing:verify <task\|testStrategy>` | Esegue il `testStrategy` di un'attività e restituisce un verdetto PRONTO / NON PRONTO con output reale. |
| `/testing:coverage [path]` | Rapporto di copertura con risultati: quale codice critico non è stato testato; crea compiti. |
| `/testing:flaky <test>` | Diagnostica un test instabile (gara, cronometraggio, stato condiviso, simulazioni) e lo risolve definitivamente. |

### 🌿 gitflow — git workflow & releases
| Comando | Cosa fa |
| --- | --- |
| `/gitflow:vorcl <goal>` | Un obiettivo git/release tramite Task Master (preparare una release, ripulire la cronologia, feature branch). |
| `/gitflow:commit <files\|scope>` | Un commit con nome (mai `git add .`) con un messaggio di commit convenzionali; si ferma su WIP sconosciuto. |
| `/gitflow:pr <base> <title>` | Ramo → commit → richiesta pull (gh / GitHub MCP) con cosa/perché/come verificato. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Keep a Changelog) generato dai commit tra i tag. |
| `/gitflow:release <version\|auto>` | Semver da commit → sincronizza versioni manifest → tag → GitHub rilascio. Push solo dopo esplicita conferma. |
| `/gitflow:audit [branch]` | Controllo della cronologia di sola lettura: violazioni delle convenzioni, commit di dump, big blob, rami orfani. |

### 🛡️ security — security audit (read-only)
| Comando | Cosa fa |
| --- | --- |
| `/security:vorcl <goal>` | Un obiettivo di sicurezza tramite Task Master — audit → risultati → attività → correzioni delegate. |
| `/security:secrets [path\|branch]` | Segreti nell'albero di lavoro E nella cronologia git (tutti i rami); `${VAR:-}` i segnaposto non sono segreti. |
| `/security:owasp [path]` | OWASP Top 10 nel codice: iniezioni, XSS, autenticazione, esposizione dei dati, CORS/cookie — con prova file:line. |
| `/security:deps` | CVE di dipendenza tramite npm audit/lockfile: gravità, flag di modifica sostanziale. |
| `/security:pii [path]` | Rischi PII/GDPR: email, telefoni, carte in codice e log; percorsi privati ​​dello sviluppatore. |
| `/security:pre-push [branch]` | Controllo rapido combinato dei file modificati prima di un push: segreti + iniezioni + PII; verdetto rosso/verde. |

### 📝 docs — documentation
| Comando | Cosa fa |
| --- | --- |
| `/docs:vorcl <goal>` | Un obiettivo di documentazione tramite Task Master. |
| `/docs:readme [path]` | Crea/aggiorna README: cosa/quickstart/usage/config/troubleshooting; esempi verificati; versioni linguistiche sincronizzate. |
| `/docs:api [spec]` | API documenti generati dalle OpenAPI specifiche (endpoint, parametri, esempi di curl); suggerisce `/swagger:audit` se nessuna specifica. |
| `/docs:architecture` | ARCHITECTURE.md — moduli, confini, flusso di dati; diagrammi delegati a `mermaid`/`drawio`. || `/docs:contributing` | CONTRIBUTING.md: impostazione, struttura, test, convenzioni di commit (allineate con `gitflow`), processo PR. |
| `/docs:release-notes <version>` | Note di rilascio per una versione da CHANGELOG/history. |
| `/docs:audit` | Documenti di sola lettura↔controllo della deriva del codice: collegamenti interrotti, esempi/contatori obsoleti, traduzioni non sincronizzate. |

### 🐳 devops — containers & CI/CD
| Comando | Cosa fa |
| --- | --- |
| `/devops:vorcl <goal>` | Un obiettivo infrastrutturale tramite Task Master. |
| `/devops:dockerfile [app-type]` | Scrivi/revisiona un Dockerfile — multistage, slim base, non root, HEALTHCHECK; verificato da un vero `docker build`. |
| `/devops:compose` | docker-compose.yml per sviluppo locale (app + DB); I cambiamenti ambientali richiedono `--force-recreate`, aspettano sani. |
| `/devops:ci [type]` | GitHub Azioni: flusso di lavoro PR (lint+typecheck+test, npm cache), flusso di lavoro di distribuzione, autorizzazioni minime. |
| `/devops:env` | Inventario variabile d'ambiente: dove leggere, cosa è richiesto, `.env.example` modello; segreti mai nelle immagini. |
| `/devops:monitoring` | Registri strutturati (pino/JSON), endpoint sanitario, su cosa avvisare; Eseguire il rendering delle metriche tramite l'agente `render`. |

### 📡 liveboard — ephemeral local operations board
| Comando | Cosa fa |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Avvia una dashboard lucida in 43 lingue su una porta localhost gratuita; Task Master cambia flusso tramite SSE e riconcilia ogni 5 minuti. |
| `/liveboard:vorcl <goal>` | Sviluppa o modifica la liveboard stessa attraverso il flusso di lavoro Task Master richiesto. |

Liveboard legge Git alberi di lavoro, Claude/Codex/Cursor processi locali e `.taskmaster/tasks/tasks.json` di ciascun albero di lavoro. Lo stato di runtime rimane in memoria e scompare quando il processo in primo piano si interrompe. UI rileva la lingua del browser e offre 43 lingue, tra cui inglese, russo, ucraino, tedesco, francese, spagnolo, portoghese, italiano, polacco, turco, cinese, giapponese, arabo, olandese, ceco, slovacco, rumeno, ungherese, bulgaro, serbo, croato, sloveno, greco, ebraico, persiano, hindi, bengalese, urdu, indonesiano, malese, vietnamita, tailandese, coreano, svedese, norvegese, danese, finlandese, estone, lettone, lituano, georgiano, armeno e azero. Arabo, ebraico, persiano e urdu utilizzano il layout RTL.

Configurazione diretta:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: progetto di cui vengono scansionati Git alberi di lavoro e Task Master file.
- `--port 0`: seleziona automaticamente una porta libera.
- `--interval`: intervallo di riconciliazione completo in millisecondi; la visione di file continua a trasmettere in streaming Task Master cambia immediatamente.
- Endpoint: `/health`, `/api/snapshot`, `/api/events` (SSE) e `POST /api/refresh`.
- Conserva `--host 127.0.0.1` a meno che tu non intenda esplicitamente esporre le informazioni del progetto alla rete.

---

## Configuration (MCP & keys)

Il pacchetto **non ha backend o database remoto**. La liveboard opzionale è un processo in memoria solo localhost. MCP i server necessitano di token e **ogni utente fornisce i propri**. Per fare in modo che funzioni in modo identico su **Claude Code, Codex, Cursor e Kimi CLI** — e sia che venga avviato da un terminale o da Dock/Spotlight/un IDE — ogni server stdio MCP viene avviato tramite un piccolo launcher (`bin/mcp-env.mjs`) che legge le chiavi da **un file**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Il programma di installazione lo crea da [`.env.example`](../.env.example). Aprilo e inserisci solo le chiavi che usi:

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

> **Perché un launcher invece di `~/.zshrc`?** L'espansione Env-var differisce in base al runtime (`${VAR:-}` in Claude, `${env:VAR}` in Cursor, letterali in Codex/Kimi) e ogni runtime legge solo l'ambiente **in** è stato avviato. I lanci GUI/IDE su macOS non generano `~/.zshrc`, quindi le chiavi esportate sono invisibili e i server non si connettono a nulla: il classico errore "MCP env non impostato". La lettura di un file `.env` rimuove entrambi i problemi contemporaneamente.

**Precedenza** (successivamente vince): la `~/.config/agent-vorcl-flow/.env` condivisa → una `./.env` nella radice del progetto → una `export` reale nella tua shell. Mantieni le chiavi globali nel file condiviso, sovrascrivi per progetto (ad esempio un diverso `MONGODB_URI`) con un progetto `.env` e un'autentica esportazione della shell vince comunque per CLI esecuzioni. Puoi puntare il programma di avvio su un file diverso con `AGENT_VORCL_ENV_FILE=/path/.env`.Un server a cui manca la chiave richiesta semplicemente **non si avvia**: vedrai una riga `[agent-vorcl-flow] MCP «…» is not configured: …` nel registro MCP del runtime e tutti gli altri server continueranno a funzionare. Aggiungi la chiave a `.env` e riavvia. (Puoi mantenere i nomi `GITHUB_TOKEN`/`MONGODB_URI`: il programma di avvio li mappa sui `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` previsti dai server.)

> ⚠️ **Obbligatorio per i comandi Task Master basati sull'intelligenza artificiale:** configura almeno un provider selezionato: `ANTHROPIC_API_KEY` per Claude, `OPENAI_API_KEY` per GPT o Codex CLI OAuth. Senza credenziali per il modello selezionato in `.taskmaster/config.json`, `/vorcl` non può generare o espandere attività.

Scegli quale Task Master fornitore esegue effettivamente la generazione; i tasti da soli non selezionano il modello:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Il comando utilizza il flusso ufficiale `task-master models` e memorizza solo la selezione del modello in `.taskmaster/config.json`. `PERPLEXITY_API_KEY` è facoltativo e necessario solo quando Perplessità è selezionata come modello di ricerca.

I server remoti **vercel** e **render** utilizzano OAuth (autorizza con `/mcp` in un browser). Per Render in headless/CI, imposta `RENDER_API_KEY` nel tuo ambiente e aggiungi una voce di intestazione Bearer a quel server per il tuo runtime.

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

Il repository ora include un manifest del plugin nativo Codex su `.codex-plugin/plugin.json`. Il programma di installazione npm rimane disponibile e installa le stesse funzionalità di **competenze**, **profili** e un router `AGENTS.md` per Codex CLI, Cursor e Kimi:

| Claude Code | Codex equivalente |
| --- | --- |
| subagente `@agent-vorcl-flow:frontend` | personaggio con abilità `$frontend` + `codex --profile frontend` |
| comando `/analyzer:audit` | abilità nel compito `$analyzer-audit` |
| comando `/vorcl` | abilità nel compito `$vorcl` |
| `.mcp.json`| `[mcp_servers.*]` in `config.toml` |
| `SessionStart` gancio | routing dei ruoli in `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Vedi [`codex/README.md`](../codex/README.md) per la mappatura completa.

---

## Cursor

Cursor utilizza lo stesso formato aperto `SKILL.md` dell'adattatore Codex, oltre ad agenti secondari personalizzati nativi e configurazione MCP globale:

| Agent-Vorcl-Flow concetto | Cursor equivalente |
| --- | --- |
| ruolo `backend` | subagente personalizzato `/avf-backend` in `~/.cursor/agents` |
| comando attività `/backend:create-api` | abilità `/backend-create-api` |
| universale `/vorcl` | abilità `/vorcl` |
| `.mcp.json` | server uniti in `~/.cursor/mcp.json` |

Il programma di installazione converte le definizioni dei ruoli in Cursor frontmatter, antepone i subagenti con `avf-` per evitare collisioni tra i nomi delle competenze, utilizza `model: inherit` e contrassegna gli agenti di solo controllo come `readonly: true`. Le voci del server MCP esistenti con gli stessi nomi vengono conservate. Vedi [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) carica in modo nativo le competenze dell'agente, i file dell'agente personalizzato e gli hook del ciclo di vita; AVF unisce anche gli stessi server MCP utilizzati da Claude e Cursor:

| Agent-Vorcl-Flow concetto | Kimi CLI equivalente |
| --- | --- |
| abilità/comandi di attività | `~/.kimi/skills` e `/skill:<name>` |
| Expo agente doganale | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo Protezione PostToolUse | confluito in `~/.kimi/config.toml` |
| `.mcp.json` | server uniti in `~/.kimi/mcp.json` |
| File di chiave per runtime | il condiviso `~/.config/agent-vorcl-flow/.env` (tramite il launcher) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI non ha espansione `${VAR}` in `mcp.json`, quindi le chiavi provengono dalla `.env` condivisa tramite il launcher, esattamente come gli altri runtime. Vedi [`kimi/README.md`](../kimi/README.md).

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

**Come si incastrano:** `agents/*.md` dichiara un ruolo e, in primo piano `skills:`, allega competenze → le competenze in `skills/*/SKILL.md` vengono caricate automaticamente in base alla descrizione → `commands/<agent>/*.md` fornisce rapide `/agent:command` scorciatoie che delegano al sub-agente → `.mcp.json` fornisce agli agenti i propri strumenti, ciascuno avviato tramite `bin/mcp-env.mjs` che carica i segreti dalla condivisione `.env`. Un gancio `SessionStart` indica Claude che gli agenti sono disponibili.

---

## License

MIT: libero di utilizzare, copiare, modificare e distribuire; fornito "così com'è", senza garanzia e senza responsabilità. Vedi [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
