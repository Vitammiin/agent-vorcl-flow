<div align="center">

# Agent-Vorcl-Flow

**Ein Team spezialisierter KI-Subagenten für [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) und [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) – mit Fähigkeiten, Befehlen und MCP-Tools.**
Ein `npx`-Befehl installiert sie. Kein Remote-Backend oder Cloud-Hosting: Ihr Coding-Agent führt alles lokal aus.

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

[English](../README.md) · [Русский](./README.ru.md) · [Українська](./README.uk.md) · [**Deutsch**](./README.de.md) · [Français](./README.fr.md) · [Español](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 3321a7089b3f749787125626da692c98b8a2d556b237e1ba36bbf67afc34dc3d. -->

</div>

---

## What is this?

Agent-Vorcl-Flow verwandelt einen unterstützten Coding-Agenten in ein **strukturiertes Engineering-Team**. Anstelle eines allgemeinen Assistenten erhalten Sie **25 fokussierte Unteragenten** (Architekt, Code-basierter Hauptarchitekt, Backend, Frontend, Expo Mobile Engineer, Produkt- und Visual Design Engineer, DB Engineer, Cross-Language Integrity Auditor, Architekturkartograph, Liveboard-Operator und mehr), jeder mit seinen eigenen Domänen-**Fähigkeiten**, schnellen **Slash-Befehlen** und den **MCP Tools**, die er benötigt. Jede nicht-triviale Aufgabe durchläuft eine disziplinierte **Task Master**-Schleife – *Ziel → Aufgaben → implementieren → überprüfen → erledigt* – so wird die Arbeit geplant, nachverfolgt und übersteht Unterbrechungen.

- 🧩 **25 Unteragenten**, 73 Fertigkeiten, 155 Slash-Befehle
- ⚡ **Ein-Befehl-Installation** für Claude Code, Codex, Cursor und/oder Kimi CLI — `npx`
- 🔌 **11 MCP Server** verkabelt (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, Dateisystem, Task Master, Mermaid)
- 🔑 **Eine `.env`-Datei für alle Laufzeiten** – Schlüssel werden von einem Launcher gelesen, nicht von `~/.zshrc`, sodass sie auch bei GUI-/IDE-Starts funktionieren; kein Remote-AVF-Dienst; Liveboard ist nur für Localhost verfügbar und kurzlebig
- 🤝 **Läuft auf Claude Code, GPT Codex, Cursor und Kimi CLI** aus derselben Quelle

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** und/oder **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Zielen Sie mit einem Flag auf eine einzelne Laufzeit:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Was das Installationsprogramm tut:

| Laufzeit | Aktion |
| --- | --- |
| **Gemeinsame Ebene** | Kopiert den Launcher nach `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` und erstellt `~/.config/agent-vorcl-flow/.env` aus der Vorlage (einmal) – die einzelne Schlüsseldatei für jede Laufzeit. |
| **Claude Code** | Registriert dieses Repo als Plugin-**Marktplatz** und aktiviert das Plugin (über `claude plugin …`, mit einem direkten `~/.claude/settings.json`-Fallback). |
| **GPT Codex** | Führt die Fähigkeiten zu `~/.agents/skills` und die `config.toml` + `AGENTS.md`-Blöcke zu `~/.codex` zusammen (idempotent, zwischen Markern). |
| **Cursor** | Installiert Fertigkeiten in `~/.cursor/skills`, native benutzerdefinierte Subagenten in `~/.cursor/agents` und führt fehlende Server in `~/.cursor/mcp.json` zusammen. |
| **Kimi CLI** | Installiert Fähigkeiten in `~/.kimi/skills`, den nativen Expo benutzerdefinierten Agenten in `~/.kimi/agents`, beide Expo-Architekturen/UI-Hooks in `~/.kimi/config.toml` und führt MCP-Server zusammen. |

> Das Installationsprogramm gibt niemals Ihre Geheimnisse ein – es erstellt lediglich ein leeres `.env` aus der Vorlage. Dort fügen Sie Schlüssel hinzu (siehe [Configuration](#configuration-mcp--keys)).

### Update to the latest version

Führen Sie das Installationsprogramm erneut mit dem Tag npm `latest` aus:

```bash
npx --yes agent-vorcl-flow@latest
```

Um nur eine Laufzeit zu aktualisieren, behalten Sie das gleiche Laufzeitflag bei, das Sie bei der Installation verwendet haben:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

Das Update überlagert Agent-Vorcl-Flow-verwaltete Fähigkeiten, Agenten, Hooks, Launcher und Konfigurationsblöcke. Ihr bestehendes `~/.config/agent-vorcl-flow/.env` und seine Geheimnisse bleiben unverändert und die vorgelagerten Firecrawl-Fähigkeiten bleiben erhalten. Starten Sie anschließend den aktualisierten Coding-Client neu (oder führen Sie `/reload-plugins` in Claude Code aus).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Nach der Installation **starten Sie Claude Code** neu (oder führen Sie `/reload-plugins` in einer offenen Sitzung aus), um die Agenten zu laden.

---

## How to use

Die Beispiele in diesem Abschnitt verwenden die Claude Code-Syntax; Die native Syntax finden Sie in den Zuordnungen [Cursor](#cursor) und [GPT Codex](#gpt-codex) weiter unten. In Claude Code gibt es **drei Möglichkeiten**, das Team aufzurufen.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` ermittelt, welcher Subagent die Arbeit besitzen soll, und steuert den gesamten Task Master-Zyklus. `/audit` erkennt automatisch Backend, Frontend, Mobile, Daten und Infrastruktur und schreibt ein evidenzbasiertes `PROJECT_AUDIT.md` unter Verwendung aller relevanten Rollen. `/init-code` liest das Repository statisch und erstellt ein evidenzbasiertes `PROJECT_DESCRIPTION.md`, ohne Projektcode auszuführen. Sobald diese Datei vorhanden ist, muss jede modifizierende Rolle ihre betroffenen Abschnitte synchronisieren; Bewährte Beschreibung Drift blockiert die Aufgabenerledigung.

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

Jeder Agent verfügt außerdem über einen eigenen `/<agent>:vorcl`-Einstiegspunkt, der die Task Master-Schleife für diesen Agenten ausführt.

### The Task Master loop
Jede nicht triviale Aufgabe durchläuft **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Dadurch bleibt die Arbeit geplant, kontrolliert und fortsetzbar – nichts wird als „erledigt“ erklärt, ohne den Überprüfungsschritt bestanden zu haben.

---

## The agents| Agent | Rolle | Höhepunkte |
| --- | --- | --- |
| 🔵 **Architekt** | System- und Lösungsarchitekt | Anforderungsanalyse, System-/DB/API-Design, Architekturprüfungen |
| 🏛️ **Hauptarchitekt** | Hauptsoftware-/Infrastruktur-/KI-Architekt | Scannt echten Code in 11 Sprachen und erstellt evidenzbasierte MD, JSON, HTML, PDF, draw.io und Mermaid; Vollständige Neuscan-Updates behalten Anmerkungen bei |
| 🟢 **Backend** | Backend-Entwickler | Knoten/TS, Postgres, Redis; modulare Architektur; jede von OpenAPI vollständig abgedeckte Strecke |
| 🟣 **Frontend** | Frontend (React 19 / Next.js App Router) | Komponenten, Status, Datenabruf, Render-/Bundle-Optimierung, Tests |
| 📱 **expo-mobile** | React Native + Expo Ingenieur | Modulare Architektur plus Design-/Bewegungs-/Interaktionssystem, native Navigation, Token, Gesten, Haptik, reduzierte Bewegung |
| 🟠 **Analysator** | Code-Auditor (schreibgeschützt) | Fehler, Typsicherheit, DB-Struktur, Frontend-Mocks, Backend-Gerüche |
| 🧭 **Integrität** | Sprachenübergreifender Code-Integritätsprüfer (schreibgeschützt) | Produktions-Hardcode- und Mock-/Fake-/Demo-/Fixture-Leckage im Frontend/Backend/Mobile/Shared |
| 🟡 **Prahlerei** | OpenAPI/Swagger Abdeckung (beliebiger Stapel) | Findet nicht vollständig dokumentierte Routen und deckt diese mit Überprüfung ab |
| 🔴 **Feuerkrabbe** | Webforscher | Live CLI/MCP/REST, App-Integration und fertige Web-Daten-Workflows |
| 🟤 **rendern** | Hosten und Bereitstellen (Rendern) | Bereitstellung, protokollgesteuerte Diagnose, Metriken, Umgebungsvariablen, Rendern Postgres |
| 🟦 **Datenbank** | DB Ingenieur / DBA | Schema, Abfragen und Pläne, Indizes, N+1, sichere reversible Migrationen, Cache |
| ⚪ **Resilienz** | Zuverlässigkeit: Fehler + Protokollierung | Versuchen/Fangen an den richtigen Grenzen, eingegebene Fehler, Wiederholungsversuche/Zeitüberschreitungen, strukturierte Protokolle |
| 🖼️ **Screenshot** | Screenshot UI → Code | Verwandelt einen UI-Screenshot in produktionsbereiten, reaktionsfähigen und zugänglichen Code |
| 🎨 **Designstudio** | Studio für Produkt- und visuelles Design | Lokale HTML Artefakte, Prototypen, Wireframes, Decks/PPTX, Dokumente, Animation, 3D, Designsysteme und Figma/GitHub/HTML-Import; adaptiert vom MIT 😉 |
| 🔎 **visuelle Forschung** | Screenshot → verifizierte Antwort | Identifiziert die Site/Seite, findet offizielle Dokumente, prüft Live-Daten und antwortet mit URLs und Vertrauen |
| 🎯 **punktgenau** | Screenshot → in ein bestehendes Projekt einfügen (schreibgeschützt) | Verankert einen Screenshot einer laufenden App in der echten Codebasis – Komponente, `file:line`, Route/Seite, die genaue Steuerung und die Logik dahinter; erstellt nichts, delegiert die Bearbeitung |
| 📊 **drawio** | Diagramme (draw.io / charts.net) | Flussdiagramm, BPMN, UML, ERD, Netzwerk/Cloud und PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Architekturkartograph | Deterministischer Code → `architecture.json` (jeder Knoten mit `source:{file,line}`) → interaktiv HTML Karte, draw.io, Mermaid, ARCHITECTURE.md, PDF; unbewiesene Tatsachen sind mit `inferred` | gekennzeichnet
| 🧜 **Meerjungfrau** | Mermaid Diagramme (+ reales Rendering) | Flussdiagramm, Sequenz, Klasse, Zustand, ER, Gantt, GitGraph, Mindmap…; validiert über mcp-mermaid/`mmdc`; übergibt dir die Datei (`.mmd` + SVG/PNG/PDF) |
| 🧪 **Testen** | Test- und Verifizierungsingenieur | Einheit (Vitest/Jest), Integration (Supertest), E2E (Playwright), Abdeckung, Flaky-Test-Jagd; führt das `testStrategy` jeder Aufgabe aus – ohne einen grünen Lauf ist nichts „erledigt“ |
| 🌿 **gitflow** | Git Workflow & Freigaben | Konventionelle Commits, By-Name-Commits (nie `git add .`), PRs, Keep-a-Changelog, Semver-Releases; Push nur mit expliziter Bestätigung |
| 🛡️ **Sicherheit** | Sicherheitsprüfer (schreibgeschützt) | Geheimnisse in der Baum- und Git-Geschichte, OWASP Top 10, Abhängigkeits-CVEs, PII; Erkenntnisse werden zu Aufgaben – Korrekturen werden delegiert || 📝 **Dokumente** | Dokumentationsingenieur | README (mehrsprachige Parität), API Dokumente von OpenAPI, ARCHITEKTUR, BEITRAG, Versionshinweise; jedes Beispiel anhand des Codes überprüft |
| 🐳 **Entwickler** | Container & CI/CD | Mehrstufige Docker-Dateien, Docker-Compose für lokale Entwicklung, GitHub Aktionspipelines, Env/Secrets-Hygiene, Überwachung |
| 📡 **Liveboard** | Lokaler Betriebsrat | Live Git Arbeitsbäume, Agentenprozesse und Task Master Aufgaben auf einem kurzlebigen Localhost-Dashboard |

**Ein paar wissenswerte Dinge:**
- **Frontend kommuniziert immer mit einem echten API.** Die OpenAPI-Spezifikation des Backends ist die einzige Quelle der Wahrheit; Daraus werden Typen generiert (`openapi-typescript` + `openapi-fetch`). Keine Mocks im Produktionsweg.
- **`database` Mutationen erfordern eine explizite Bestätigung.** Analysen sind schreibgeschützt; Schema-/Datenänderungen (DDL/DML/Migrationen) werden niemals ohne Ihre Zustimmung ausgeführt.
- **`resilience` verfügt über einen Sicherheitshaken.** Ein nicht blockierender `PostToolUse` Haken (`catch-guard.js`) markiert leere `catch {}` Blöcke in Dateien, die Sie gerade bearbeitet haben.
- **`archmap` schöpft nie aus der Fantasie.** Extraktion und Rendering sind strikt getrennt: Null-Abhängigkeits-Skripte leiten das Repo in `architecture.json` (Datenbanken mit echter FK-Kardinalität, API-Routen, KI-Agenten mit ihren Modellen/Tools/Speicher, Importdiagramm, Umgebung) und jedes Diagramm wird nur aus diesem JSON gerendert. Alles, was das LLM ohne ein überprüfbares `file:line` hinzufügt, wird mit einem `inferred:true` markiert und gestrichelt gezeichnet.
- **`principal-architect` ist der vollständige Architektur-Veröffentlichungsworkflow.** Er funktioniert in jedem Repository, in dem der Agent gestartet wird, ignoriert Markdown-Ansprüche als Topologienachweis, verwendet gebündeltes Offline-Tree-Sitter-WASM für TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin und Swift, schreibt zuerst `ARCHITECTURE.md` und erzeugt dann das gemeinsame JSON-Modell, das eigenständige HTML, PDF, native draw.io und das kopierbare Mermaid L0–L4. `update` führt einen vollständigen Neuscan durch und behält Anmerkungen und nicht verwaltete Dateien bei.
- **`pinpoint` findet, erstellt nie.** Anhand eines Screenshots einer laufenden App ordnet es den Bildschirm dem echten Code zu – Komponente, Route, die genaue Steuerung und die Logik dahinter – und übergibt die Bearbeitung an `frontend`/`backend`. Es funktioniert mit dem, was bereits existiert (das Gegenteil von `screenshot`).
- **`visual-research` verifiziert statt zu raten.** Es behandelt einen Screenshot als Beweis, bestätigt die offizielle Domain und Dokumente, überprüft aktuelle Site-Daten und kennzeichnet mögliches Phishing oder veraltete Werte.
- **`i18n` erzwingt „Null-Sprach-Hardcodierung“.** Agenten erkennen zunächst, ob ein Projekt mehrsprachig ist, und passen sich an – benutzerseitige Zeichenfolgen durchlaufen eine Übersetzungsebene (next-intl/react-i18next/i18next), niemals inline.

---

## Command referenceJeder Befehl unten ist ein Schrägstrich-Befehl. `<…>` markiert Ihre Eingabe.

### `/vorcl` — universal router
| Befehl | Was es tut |
| --- | --- |
| `/vorcl <goal>` | Wandelt jedes Ziel in Aufgaben um, leitet es an den richtigen Unteragenten weiter und führt dann den gesamten Erledigungszyklus durch. |
| `/audit [path] [focus]` | Tiefgreifendes, schreibgeschütztes Multi-Rollen-Audit → erkannte Systeme, Sicherheits-/CVE-/Resilienz-Ergebnisse, Zielarchitektur und schrittweise `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | Statische Codebasiserkennung → evidenzbasiert `PROJECT_DESCRIPTION.md`; Projektcode wird nie ausgeführt. |

### 🔵 architect — architecture
| Befehl | Was es tut |
| --- | --- |
| `/architect:vorcl <goal>` | Ziel → Aufgaben → Zyklus, bezogen auf die Architektur. |
| `/architect:analyze <context>` | Analysieren Sie Anforderungen und den Kontext der Aufgabe. |
| `/architect:design <problem>` | Entwerfen Sie die Lösungsarchitektur (System, DB, API). |
| `/architect:review <target>` | Überprüfen Sie eine vorhandene Architektur. |

### 🏛️ principal-architect — code-grounded architecture package
| Befehl | Was es tut |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Führt ein großes Architekturziel durch Task Master und verifizierte Artefakte. |
| `/principal-architect:create [options]` | Scannt das aktuelle Repository und erstellt MD, JSON, HTML, PDF, draw.io und Mermaid aus Code-Beweisen. |
| `/principal-architect:update [options]` | Führt einen vollständigen erneuten Scan eines vorhandenen Pakets durch, schreibt einen Beweisunterschied und aktualisiert generierte Artefakte atomar. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Befehl | Was es tut |
| --- | --- |
| `/backend:vorcl <goal>` | Ziel → Aufgaben → Zyklus für Backend-Arbeit. |
| `/backend:create-api <endpoint>` | Generieren Sie einen API-Endpunkt auf der modularen Architektur, der vollständig von OpenAPI abgedeckt wird. |
| `/backend:refactor <target>` | Code umgestalten, ohne das Verhalten zu ändern. |
| `/backend:optimize <target>` | Leistungsoptimierung. |
| `/backend:test <target>` | Generieren Sie Tests für den Code. |

### 🟣 frontend — React / Next.js
| Befehl | Was es tut |
| --- | --- |
| `/frontend:vorcl <goal>` | Ziel → Aufgaben → Zyklus für Frontend-Arbeit. |
| `/frontend:create-component <spec>` | Generieren Sie eine UI-Komponente entsprechend der Feature-Struktur. |
| `/frontend:refactor <target>` | Refactor UI / Hooks ohne Verhaltensänderung. |
| `/frontend:optimize <target>` | Optimieren Sie Rendering/Bundle/Core Web Vitals. |
| `/frontend:test <target>` | Komponententests generieren. |

### 📱 expo-mobile — React Native / Expo

| Befehl | Was es tut |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Ziel → Task Master Zyklus für Expo mobiles Arbeiten. |
| `/expo-mobile:create-module <domain>` | Erstellen Sie einen modularen Geschäftsausschnitt mit nur den Schichten, die seine Komplexität erfordert. |
| `/expo-mobile:create-screen <flow>` | Erstellen Sie eine dünne Expo Router-Route sowie einen moduleigenen Bildschirm und Zustände. |
| `/expo-mobile:design-screen <flow>` | Erstellen Sie einen Premium-Bildschirm mit gemeinsamen Design-/Bewegungs-Tokens, Zuständen und Zugänglichkeit. |
| `/expo-mobile:motion <interaction>` | Entwerfen Sie native Navigation, Federn, Gesten, Haptik und Fallbacks mit reduzierter Bewegung. |
| `/expo-mobile:add-api <contract>` | Fügen Sie Schema-/DTO-/Mapper-/Abfrageschlüssel und TanStack Query-Integration hinzu. |
| `/expo-mobile:audit [scope]` | Schreibgeschützter Architekturwächter und evidenzbasiertes Audit. |
| `/expo-mobile:ui-audit [scope]` | Schreibgeschütztes Designsystem, Bewegungs-, Interaktions-, Zugänglichkeits- und Leistungsprüfung. |
| `/expo-mobile:compatibility [app] [change]` | Live-Lese-Kompatibilitätsprüfung für Expo/RN/Node/Paket/Native-Runtime anhand versionierter offizieller Quellen. |
| `/expo-mobile:test <scope>` | Führen Sie die Domäneneinheit, die React Native-Testbibliothek und die Maestro-Prüfungen aus. |

### 🟠 analyzer — code audit (read-only)
| Befehl | Was es tut |
| --- | --- |
| `/analyzer:vorcl <goal>` | Prüfen Sie ein Ziel über Task Master – Erkenntnisse werden zu Aufgaben. |
| `/analyzer:audit` | Vollständiges Audit: Fehler, Typen, DB, Frontend-Mocks, Backend-Gerüche. |
| `/analyzer:bugs` | Suchen Sie nach Fehlern – nicht behandelte Fehler, Rennbedingungen, Randfälle. |
| `/analyzer:types` | Typprüfung – `tsc`, `any`, unsichere Würfe, Zod↔Typendrift. |
| `/analyzer:db` | Audit-Struktur – Schema, Indizes, FKs, N+1, Migrationen. |
| `/analyzer:mocks` | Kompatibilitätsroute für Schein-/Fake-Daten im Frontend und Backend; delegiert tiefgreifende Polyglottenprüfungen an die Integrität. |
| `/analyzer:backend` | Finden Sie „schlechten“ Backend-Code – Architekturverstöße, Logik in Controllern. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| Befehl | Was es tut |
| --- | --- |
| `/integrity:vorcl <goal>` | Führt ein nicht triviales Integritätsziel durch Task Master und wandelt Erkenntnisse in eigentümerspezifische Aufgaben um. |
| `/integrity:audit [path]` | Scannt Hardcode und Scheinlecks zusammen und prüft dann die Erreichbarkeit der Produktion. |
| `/integrity:hardcode [path]` | Findet Benutzer-/Konfigurations-/Geschäftsliterale, die Lokalisierung, Konfiguration oder das Aufzeichnungssystem umgehen. |
| `/integrity:mocks [path]` | Findet Schein-Frameworks, gefälschte Generatoren, Vorrichtungen, Demodaten und statische Antworten, die von der Produktion aus erreichbar sind. |

Der mitgelieferte Null-Abhängigkeits-Scanner unterstützt TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML und Razor. Im Backend-Code werden außerdem Geschäftswerte markiert, die in Konstanten, statischen/endgültigen Feldern, Standardparametern, benannten Argumenten und statischen Katalogen verborgen sind. Der Prüfer vergleicht sie dann mit Schemata/Modellen/Repositorys/Abfragen/Administratormutationen, um zu beweisen, dass die Datenbank – nicht Code oder Konfiguration – Eigentümer des Werts ist. Tests, Fixtures, Storys, Beispiele, Seeds, generierter Code und Vendor Roots werden standardmäßig unterdrückt; Lexikalische Kandidaten sind keine Defekte, bis ihre Erreichbarkeit und ihr Eigentum nachgewiesen sind.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Befehl | Was es tut |
| --- | --- |
| `/swagger:vorcl <goal>` | Vollständiges Abdeckungsziel über Task Master – Audit → Aufgaben → Abdeckung → Verifizieren. |
| `/swagger:audit` | Schreibgeschützt: Routen finden, die nicht vollständig von der Spezifikation abgedeckt werden. |
| `/swagger:cover <route>` | Decken Sie eine Route/ein Modul ab – Parameter, Antworten, Beschreibungen, Sicherheit + Überprüfung. |

### 🔴 firecrawl — web research
| Befehl | Was es tut |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Forschungsziel über Task Master – Webdaten sammeln, um ein fertiges Ergebnis zu erzielen. |
| `/firecrawl:search <query>` | Websuche nach Quellen zu einer Frage. |
| `/firecrawl:scrape <url>` | Scrapen Sie eine URL in markdown/JSON. |
| `/firecrawl:map <url>` | Ordnen Sie die URLs einer Website zu. |
| `/firecrawl:crawl <url>` | Rekursives Crawlen eines Abschnitts/einer Site. |
| `/firecrawl:extract <url>` | Strukturierte Extraktion durch ein JSON-Schema. |
| `/firecrawl:setup` | Installieren/verifizieren CLI plus offizielle Build- und Workflow-Kenntnisse (mit Bestätigung). |
| `/firecrawl:interact <url>` | Klicken, navigieren oder füllen Sie Formulare aus, wenn das Scrapen nicht ausreicht. |
| `/firecrawl:parse <file>` | Analysieren Sie ein lokales/privates Dokument in Markdown oder JSON. |
| `/firecrawl:monitor <action>` | Listen Sie Prüfungen auf oder verwalten Sie wiederkehrende Seitenwechselmonitore. |
| `/firecrawl:agent <goal>` | Führen Sie eine begrenzte, lang laufende Firecrawl Agent-Aufgabe aus. |
| `/firecrawl:research <query>` | Suchen Sie nach Artikeln und GitHub Forschungskontext. |
| `/firecrawl:ask <jobId>` | Diagnostizieren Sie einen fehlgeschlagenen Firecrawl-Job. |
| `/firecrawl:docs-search <question>` | Durchsuchen Sie die aktuelle offizielle Firecrawl-Dokumentation. |
| `/firecrawl:integrate <feature>` | Fügen Sie Firecrawl über vorgelagerte Build-Fähigkeiten zum Anwendungscode hinzu. |
| `/firecrawl:deliverable <artifact>` | Erstellen Sie ein Briefing, ein Audit, eine Lead-Liste oder ein anderes Workflow-Artefakt. |`/firecrawl:setup` führt den offiziellen `firecrawl-cli init --all`-Flow erst nach Bestätigung aus. Vorhandene offizielle `firecrawl-*`-Kenntnisse haben Vorrang und bleiben vom Codex/Cursor-Installer erhalten; AVF liefert kompatible Fallbacks für fehlende Fähigkeiten. Live-Operationen verlaufen über CLI → MCP → REST/Keyless.

### 🟤 render — hosting / deploy (Render)
| Befehl | Was es tut |
| --- | --- |
| `/render:vorcl <goal>` | Infra-Ziel über Task Master – Bereitstellung/Diagnose/Konfiguration bis zum Abschluss. |
| `/render:deploy <service>` | Einen Dienst bereitstellen/erneut bereitstellen. |
| `/render:logs <service>` | Serviceprotokolle und Diagnose bis zur Ursache. |
| `/render:status <service>` | Servicestatus + Bereitstellung + Metriken. |
| `/render:query <sql>` | Schreibgeschütztes SQL gegen Render Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Befehl | Was es tut |
| --- | --- |
| `/database:vorcl <goal>` | Datenziel über Task Master – Schema/Abfragen/Migrationen/Cache erledigt. |
| `/database:query <query>` | Schreibgeschützte Abfrage/Analyse. |
| `/database:schema <target>` | Entwerfen/Überprüfen Sie das Schema und die Datenintegrität. |
| `/database:migrate <change>` | Planen Sie eine sichere, umkehrbare Schema-/Datenmigration. |
| `/database:optimize <target>` | Optimieren – Indizes, N+1, Abfragepläne, Paginierung. |
| `/database:cache <target>` | Redis – TTL, Ungültigmachung, Sperren, Ratenbegrenzung, Streams. |

### ⚪ resilience — error handling + logging
| Befehl | Was es tut |
| --- | --- |
| `/resilience:vorcl <goal>` | Zuverlässigkeitsziel über Task Master – Code mit Try/Catch + Protokollen abdecken. |
| `/resilience:harden <target>` | Wickeln Sie Code in try/catch/finally mit solider Protokollierung ein, ohne stille Fehler. |
| `/resilience:logging <target>` | Strukturierte Protokollierung hinzufügen/korrigieren – Ebenen, Kontext, keine Geheimnisse/PII. |
| `/resilience:audit` | Schreibgeschützt: Stille Fehler, leere Catches und Protokollierungslücken finden. |

### 🖼️ screenshot — screenshot UI → code
| Befehl | Was es tut |
| --- | --- |
| `/screenshot:vorcl <goal>` | Eine Reihe von Bildschirmen aus Screenshots über Task Master – Aufschlüsselung → Code. |
| `/screenshot:analyze <image>` | Schreibgeschützte Aufschlüsselung – Layout, Komponenten, Token, Zustände → Plan. |
| `/screenshot:convert <image> [framework]` | Generieren Sie vollständig ausführbaren Code aus einem Screenshot (Standard React + Tailwind v4). |
| `/screenshot:tokens <image>` | Extrahieren Sie Design-Tokens (OKLCH-Farben, Typografie, Abstände) in Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Machen Sie das generierte UI reaktionsfähig – Haltepunkte, Fluid, `clamp()`, Containerabfragen. |

### 🎨 design-studio — product and visual design
| Befehl | Was es tut |
| --- | --- |
| `/design-studio:vorcl <goal>` | Vollständiges Designziel durch Task Master – Kontext → Varianten → HTML → Vorschau → Verifizierung → Export. |
| `/design-studio:create <brief>` | Erstellen Sie ein elegantes, eigenständiges visuelles Artefakt oder Hi-Fi-Gerät. |
| `/design-studio:prototype <flow>` | Erstellen Sie einen interaktiven Web-/Mobil-Prototyp mit Zuständen und Übergängen. |
| `/design-studio:wireframe <flow>` | Erstellen Sie ein Low-Fi-Wireframe mit Schwerpunkt auf Informationsarchitektur und UX. |
| `/design-studio:design-system <operation>` | Erstellen, importieren, kompilieren, binden, aktualisieren oder überprüfen Sie ein Designsystem. |
| `/design-studio:import <type> <source>` | Importieren Sie Figma `.fig`, GitHub oder HTML/CSS mit Herkunft. |
| `/design-studio:deck <brief>` | Erstellen Sie ein HTML-Deck mit Sprechernotizen, Animationen und optional bearbeitbarem PPTX. |
| `/design-studio:document <brief>` | Erstellen Sie ein druckfertiges Dokument, einen Lebenslauf, ein Memo, einen One-Pager oder einen Bericht. |
| `/design-studio:animation <brief>` | Erstellen Sie ein Bewegungsartefakt und rendern Sie es optional in MP4. |
| `/design-studio:research <question>` | Erstellen Sie ein quellengestütztes visuelles Forschungsartefakt. |
| `/design-studio:export <project> <format>` | Exportieren Sie in das eigenständige HTML-, PDF-, PPTX-, MP4- oder ein Handoff-Format. |
| `/design-studio:review <target>` | Schreibgeschützte visuelle, UX-, Responsive-, A11Y- und Designsystemüberprüfung. |

### 🔎 visual-research — screenshot → verified web answer
| Befehl | Was es tut |
| --- | --- |
| `/visual-research:vorcl <goal>` | Mehrstufige Screenshot-Recherche durch Task Master. |
| `/visual-research:identify <image>` | Identifizieren Sie die Website, Seite und Funktion mit zuverlässigen Beweisen. |
| `/visual-research:search <image> <target>` | Finden Sie anhand visueller Hinweise die echte Seite oder die offizielle Dokumentation. |
| `/visual-research:answer <image> <question>` | Antworten Sie mit Screenshot-Beweisen, offiziellen Dokumenten und aktuellen Live-Daten. |
| `/visual-research:hints <image> <goal>` | Geben Sie sichere, dokumentationsgestützte Schritte für die sichtbare Schnittstelle an. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Befehl | Was es tut |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Vorhandenes UI aus einem Screenshot über Task Master finden/verstehen/ändern – Karte → Aufgaben → delegieren. |
| `/pinpoint:locate <image>` | Suchen Sie die vorhandene(n) Komponente/Datei(en) anhand eines Screenshots – `file:line`, kein neuer Code. |
| `/pinpoint:route <image>` | Identifizieren Sie die Route/Seite, auf der sich der Bildschirm befindet (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <image>` | Bestimmen Sie das genaue Steuerelement (Schaltfläche/Feld) und seinen Handler im Code. |
| `/pinpoint:trace <target>` | Verfolgen Sie die Logik hinter einem Element – ​​Handler → Status → Datenabruf → API. || `/pinpoint:handoff <change>` | Erstellen Sie eine präzise Bearbeitungsanforderung für den vorhandenen Code und delegieren Sie sie an `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Befehl | Was es tut |
| --- | --- |
| `/drawio:vorcl <goal>` | Eine Reihe von Diagrammen über Task Master – Build to Done. |
| `/drawio:create <description> [type]` | Erstellen Sie ein Diagramm aus einer Textbeschreibung (gültiges natives XML). |
| `/drawio:pmp <type> <project>` | Erstellen Sie ein PMP/PMBOK-Diagramm – WBS, PERT/CPM, Gantt, RACI, Risikomatrix, Stakeholder-Raster. |
| `/drawio:convert <source> [type]` | Konvertieren Sie eine Quelle in ein Diagramm – DB Schema → ERD, Ordner → Baum, Code → UML, Meerjungfrau/CSV/JSON. |
| `/drawio:refine <file>` | Verfeinern Sie ein vorhandenes `.drawio` – Layout, Thema, Knoten hinzufügen/entfernen, am Raster ausrichten. |

### 🗺️ archmap — architecture map from code| Befehl | Was es tut |
| --- | --- |
| `/archmap:vorcl <goal>` | Ein Mapping-Ziel über Task Master – Build zu einem verifizierten Artefaktsatz. |
| `/archmap:map [repo]` | Vollständige Pipeline: Extraktion → `architecture.json` → LLM-Annotation → alle Formate (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Nur Extraktion – maschinenlesbares `architecture.json` mit `source:{file,line}` auf jedem Knoten. |
| `/archmap:annotate [json]` | LLM-Anreicherung eines vorhandenen `architecture.json` (Agentenspeicher, Datenflusssemantik); Unbewiesene Tatsachen werden automatisch auf `inferred` herabgestuft. |
| `/archmap:html [json]` | Interaktive, eigenständige HTML-Karte – Ebenenumschaltung, Balkenverfolgung, Knoten → `file:line`-Panel, Suche, Drucken von CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (mehrseitig: Übersicht / ERD / API / Agents) und/oder Mermaid Ansichten, validiert. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Befehl | Was es tut |
| --- | --- |
| `/mermaid:vorcl <goal>` | Eine Reihe von Diagrammen über Task Master – Build to Done (Rendering-verifiziert). |
| `/mermaid:create <description> [type]` | Erstellen Sie ein Diagramm aus einer Beschreibung – gültige Syntax, überprüft durch ein echtes Rendering; gibt Ihnen die Akte. |
| `/mermaid:convert <source> [type]` | Konvertieren Sie eine Quelle in Mermaid – DB Schema → ER, Code → Klasse/Sequenz, Ordner → Flussdiagramm, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Syntax + echter Rendertest; Fehler finden und beheben (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Export nach SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Verfeinern Sie ein vorhandenes `.mmd` – Richtung, Untergraph, Klassendefinition/Stile, Lesbarkeit. |

### 🧪 testing — tests & verification
| Befehl | Was es tut |
| --- | --- |
| `/testing:vorcl <goal>` | Ein Test-/Verifizierungsziel über Task Master – Einheit + Integration + e2e to done. |
| `/testing:unit <file\|module>` | Unit-Tests (Vitest/Jest) – glücklicher Weg, Grenzen, Fehler; führt sie aus und zeigt die Ausgabe an. |
| `/testing:integration <endpoint\|module>` | Integrationstests (Supertest/inject, real DB oder Testcontainer). |
| `/testing:e2e <scenario>` | Playwright E2E für einen kritischen Benutzerpfad – Rollenselektoren, Vorrichtungen, Rückverfolgung bei Fehlern. |
| `/testing:verify <task\|testStrategy>` | Führt `testStrategy` einer Aufgabe aus und gibt ein READY/NOT READY-Urteil mit echter Ausgabe zurück. |
| `/testing:coverage [path]` | Abdeckungsbericht mit Ergebnissen – welcher kritische Code ist ungetestet; erstellt Aufgaben. |
| `/testing:flaky <test>` | Diagnostiziert einen instabilen Test (Rennen, Timing, gemeinsamer Zustand, Mocks) und behebt ihn endgültig. |

### 🌿 gitflow — git workflow & releases
| Befehl | Was es tut |
| --- | --- |
| `/gitflow:vorcl <goal>` | Ein Git/Release-Ziel über Task Master (Release vorbereiten, Verlauf bereinigen, Feature-Branch). |
| `/gitflow:commit <files\|scope>` | Ein By-Name-Commit (niemals `git add .`) mit einer konventionellen Commits-Nachricht; stoppt bei unbekanntem WIP. |
| `/gitflow:pr <base> <title>` | Branch → Commits → Pull Request (gh / GitHub MCP) mit was/warum/wie-verifiziert. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Änderungsprotokoll führen), generiert aus Commits zwischen Tags. |
| `/gitflow:release <version\|auto>` | Semver aus Commits → Manifestversionen synchronisieren → Tag → GitHub Release. Push nur nach ausdrücklicher Bestätigung. |
| `/gitflow:audit [branch]` | Nur-Lese-Verlaufsprüfung: Konventionsverstöße, Dump-Commits, große Blobs, verwaiste Branches. |

### 🛡️ security — security audit (read-only)
| Befehl | Was es tut |
| --- | --- |
| `/security:vorcl <goal>` | Ein Sicherheitsziel über Task Master – Audit → Ergebnisse → Aufgaben → delegierte Korrekturen. |
| `/security:secrets [path\|branch]` | Geheimnisse im Arbeitsbaum UND im Git-Verlauf (alle Zweige); `${VAR:-}` Platzhalter sind keine Geheimnisse. |
| `/security:owasp [path]` | OWASP Top 10 im Code: Injektionen, XSS, Authentifizierung, Datenexposition, CORS/Cookies – mit file:line-Proof. |
| `/security:deps` | Abhängigkeits-CVEs über Audit-/Sperrdateien – Schweregrad, Breaking-Change-Flags. |
| `/security:pii [path]` | PII/DSGVO-Risiken: E-Mails, Telefone, Karten im Code und Protokolle; Private Pfade des Entwicklers. |
| `/security:pre-push [branch]` | Schnelle kombinierte Prüfung geänderter Dateien vor einem Push: Geheimnisse + Injektionen + PII; grün/rotes Urteil. |

### 📝 docs — documentation
| Befehl | Was es tut |
| --- | --- |
| `/docs:vorcl <goal>` | Ein Dokumentationsziel über Task Master. |
| `/docs:readme [path]` | README erstellen/aktualisieren – what/quickstart/usage/config/troubleshooting; Beispiele überprüft; Sprachversionen synchronisiert. |
| `/docs:api [spec]` | API Dokumente, die aus der OpenAPI-Spezifikation generiert wurden (Endpunkte, Parameter, Curl-Beispiele); schlägt `/swagger:audit` vor, wenn keine Spezifikation vorhanden ist. |
| `/docs:architecture` | ARCHITECTURE.md – Module, Grenzen, Datenfluss; Diagramme an `mermaid`/`drawio` delegiert. || `/docs:contributing` | CONTRIBUTING.md – Setup, Struktur, Tests, Commit-Konventionen (ausgeglichen mit `gitflow`), PR-Prozess. |
| `/docs:release-notes <version>` | Versionshinweise für eine Version aus CHANGELOG/history. |
| `/docs:audit` | Schreibgeschützte Dokumente↔Code-Drift-Prüfung: defekte Links, veraltete Beispiele/Zähler, nicht synchronisierte Übersetzungen. |

### 🐳 devops — containers & CI/CD
| Befehl | Was es tut |
| --- | --- |
| `/devops:vorcl <goal>` | Ein Infrastrukturziel über Task Master. |
| `/devops:dockerfile [app-type]` | Schreiben/überprüfen Sie eine Docker-Datei – mehrstufig, schlanke Basis, nicht Root, HEALTHCHECK; durch ein echtes `docker build` verifiziert. |
| `/devops:compose` | docker-compose.yml für lokale Entwickler (App + DBs); Umgebungsänderungen benötigen `--force-recreate`, wartet auf gesunde. |
| `/devops:ci [type]` | GitHub Aktionen – PR-Workflow (lint+typecheck+test, npm Cache), Bereitstellungsworkflow, minimale Berechtigungen. |
| `/devops:env` | Inventar der Umgebungsvariablen: Wo gelesen, was ist erforderlich, `.env.example` Vorlage; Geheimnisse niemals in Bildern. |
| `/devops:monitoring` | Strukturierte Protokolle (Pino/JSON), Gesundheitsendpunkt, worüber gewarnt werden soll; Rendern Sie Metriken über den `render`-Agenten. |

### 📡 liveboard — ephemeral local operations board
| Befehl | Was es tut |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Starten Sie ein ausgefeiltes 43-sprachiges Dashboard auf einem kostenlosen Localhost-Port; Task Master ändert den Stream über SSE und gleicht alle 5 Minuten ab. |
| `/liveboard:vorcl <goal>` | Entwickeln oder ändern Sie das Liveboard selbst durch den erforderlichen Task Master Workflow. |

Liveboard liest Git Arbeitsbäume, lokale Claude/Codex/Cursor Prozesse und das `.taskmaster/tasks/tasks.json` jedes Arbeitsbaums. Der Laufzeitstatus bleibt im Speicher und verschwindet, wenn der Vordergrundprozess stoppt. Das UI erkennt die Browsersprache und bietet 43 Gebietsschemata, darunter Englisch, Russisch, Ukrainisch, Deutsch, Französisch, Spanisch, Portugiesisch, Italienisch, Polnisch, Türkisch, Chinesisch, Japanisch, Arabisch, Niederländisch, Tschechisch, Slowakisch, Rumänisch, Ungarisch, Bulgarisch, Serbisch, Kroatisch, Slowenisch, Griechisch, Hebräisch, Persisch, Hindi, Bengali, Urdu, Indonesisch, Malaiisch, Vietnamesisch, Thailändisch, Koreanisch, Schwedisch, Norwegisch, Dänisch, Finnisch, Estnisch, Lettisch, Litauisch, Georgisch, Armenisch und Aserbaidschanisch. Arabisch, Hebräisch, Persisch und Urdu verwenden das RTL-Layout.

Direkte Konfiguration:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: Projekt, dessen Git Arbeitsbäume und Task Master Dateien gescannt werden.
- `--port 0`: Automatische Auswahl eines freien Ports.
- `--interval`: vollständiges Abstimmungsintervall in Millisekunden; Dateiüberwachung streamt immer noch Task Master ändert sich sofort.
- Endpunkte: `/health`, `/api/snapshot`, `/api/events` (SSE) und `POST /api/refresh`.
- Behalten Sie `--host 127.0.0.1` bei, es sei denn, Sie beabsichtigen ausdrücklich, Projektinformationen dem Netzwerk zugänglich zu machen.

---

## Configuration (MCP & keys)

Das Paket hat **kein Remote-Backend oder eine Datenbank**. Das optionale Liveboard ist ein In-Memory-Prozess nur für Localhost. MCP Server benötigen Token und **jeder Benutzer stellt seine eigenen bereit**. Damit dies für **Claude Code, Codex, Cursor und Kimi CLI** identisch funktioniert – und unabhängig davon, ob Sie von einem Terminal oder von Dock / Spotlight / einer IDE aus starten – wird jeder stdio MCP-Server über einen kleinen Launcher (`bin/mcp-env.mjs`) gestartet, der Ihre Schlüssel aus **einer Datei** liest:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Der Installer erstellt es aus [`.env.example`](../.env.example). Öffnen Sie es und geben Sie nur die Schlüssel ein, die Sie verwenden:

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

> **Warum ein Launcher anstelle von `~/.zshrc`?** Die Env-Var-Erweiterung ist je nach Laufzeit unterschiedlich (`${VAR:-}` in Claude, `${env:VAR}` in Cursor, Literale in Codex/Kimi) und jede Laufzeit liest nur die Umgebung, in der sie gestartet wurde. GUI-/IDE-Starts unter macOS enthalten kein `~/.zshrc`, daher sind exportierte Schlüssel unsichtbar und die Server stellen keine Verbindung her – der klassische Fehler „MCP env not set“. Das Lesen aus einer `.env`-Datei beseitigt beide Probleme gleichzeitig.

**Vorrang** (später gewinnt): das gemeinsame `~/.config/agent-vorcl-flow/.env` → ein `./.env` im Projektstamm → ein echtes `export` in Ihrer Shell. Behalten Sie globale Schlüssel in der freigegebenen Datei, überschreiben Sie jedes Projekt (z. B. ein anderes `MONGODB_URI`) mit einem Projekt `.env`, und ein echter Shell-Export gewinnt immer noch für CLI-Läufe. Sie können den Launcher mit `AGENT_VORCL_ENV_FILE=/path/.env` auf eine andere Datei verweisen.Ein Server, dessen erforderlicher Schlüssel fehlt, **startet einfach nicht** – im MCP-Protokoll der Laufzeit wird ein einzeiliges `[agent-vorcl-flow] MCP «…» is not configured: …` angezeigt, und alle anderen Server arbeiten weiter. Fügen Sie den Schlüssel zu `.env` hinzu und starten Sie neu. (Sie können `GITHUB_TOKEN`/`MONGODB_URI`-Namen behalten – der Launcher ordnet sie dem `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` zu, das die Server erwarten.)

> ⚠️ **Erforderlich für KI-gestützte Task Master-Befehle:** Konfigurieren Sie mindestens einen ausgewählten Anbieter – `ANTHROPIC_API_KEY` für Claude, `OPENAI_API_KEY` für GPT oder Codex CLI OAuth. Ohne Anmeldeinformationen für das in `.taskmaster/config.json` ausgewählte Modell kann `/vorcl` keine Aufgaben generieren oder erweitern.

Wählen Sie aus, welcher Task Master-Anbieter die Generierung tatsächlich durchführt; Tasten allein wählen das Modell nicht aus:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Der Befehl verwendet den offiziellen `task-master models`-Ablauf und speichert nur die Modellauswahl in `.taskmaster/config.json`. `PERPLEXITY_API_KEY` ist optional und wird nur benötigt, wenn Perplexity als Forschungsmodell ausgewählt ist.

Die Remote-Server **vercel** und **render** verwenden OAuth (Autorisierung mit `/mcp` in einem Browser). Legen Sie für „Rendern in Headless/CI“ `RENDER_API_KEY` in Ihrer Umgebung fest und fügen Sie diesem Server für Ihre Laufzeit einen Bearer-Header-Eintrag hinzu.

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

Das Repository enthält jetzt ein natives Codex-Plugin-Manifest unter `.codex-plugin/plugin.json`. Das npm-Installationsprogramm bleibt verfügbar und installiert die gleichen Funktionen wie **Skills**, **Profile** und einen `AGENTS.md`-Router für Codex CLI, Cursor und Kimi:

| Claude Code | Codex Äquivalent |
| --- | --- |
| Unteragent `@agent-vorcl-flow:frontend` | Skill-Persona `$frontend` + `codex --profile frontend` |
| Befehl `/analyzer:audit` | Aufgabenfähigkeit `$analyzer-audit` |
| Befehl `/vorcl` | Aufgabenkompetenz `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` in `config.toml` |
| `SessionStart` Haken | Rollenrouting in `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Die vollständige Zuordnung finden Sie unter [`codex/README.md`](../codex/README.md).

---

## Cursor

Cursor verwendet dasselbe offene `SKILL.md`-Format wie der Codex-Adapter sowie native benutzerdefinierte Subagenten und globale MCP-Konfiguration:

| Agent-Vorcl-Flow Konzept | Cursor Äquivalent |
| --- | --- |
| Rolle `backend` | benutzerdefinierter Subagent `/avf-backend` in `~/.cursor/agents` |
| Aufgabenbefehl `/backend:create-api` | Geschicklichkeit `/backend-create-api` |
| universell `/vorcl` | Geschicklichkeit `/vorcl` |
| `.mcp.json` | zusammengeführte Server in `~/.cursor/mcp.json` |

Das Installationsprogramm konvertiert Rollendefinitionen in Cursor frontmatter, stellt Subagenten ein `avf-` voran, um Kollisionen zwischen Skill-Namen zu vermeiden, verwendet `model: inherit` und markiert Nur-Überwachungsagenten als `readonly: true`. Vorhandene MCP Servereinträge mit demselben Namen bleiben erhalten. Siehe [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) lädt nativ Agentenfähigkeiten, benutzerdefinierte Agentendateien und Lebenszyklus-Hooks; AVF führt außerdem dieselben MCP-Server zusammen, die von Claude und Cursor verwendet werden:

| Agent-Vorcl-Flow Konzept | Kimi CLI Äquivalent |
| --- | --- |
| Fähigkeiten/Aufgabenbefehle | `~/.kimi/skills` und `/skill:<name>` |
| Expo benutzerdefinierter Agent | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse Guard | verschmolzen mit `~/.kimi/config.toml` |
| `.mcp.json` | zusammengeführte Server in `~/.kimi/mcp.json` |
| Schlüsseldatei pro Laufzeit | das geteilte `~/.config/agent-vorcl-flow/.env` (über den Launcher) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI hat keine `${VAR}`-Erweiterung in `mcp.json`, daher kommen Schlüssel vom gemeinsamen `.env` über den Launcher – genau wie die anderen Laufzeiten. Siehe [`kimi/README.md`](../kimi/README.md).

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

**Wie es zusammenpasst:** `agents/*.md` Deklarieren Sie eine Rolle und fügen Sie im Vorfeld `skills:` Fertigkeiten hinzu → Fertigkeiten in `skills/*/SKILL.md` werden automatisch durch Beschreibung geladen → `commands/<agent>/*.md` stellen schnelle `/agent:command`-Verknüpfungen bereit, die an den Unteragenten delegieren → `.mcp.json` gibt Agenten ihre Werkzeuge, die jeweils durch `bin/mcp-env.mjs` gestartet werden, wodurch Geheimnisse aus dem gemeinsam genutzten `.env` geladen werden. Ein `SessionStart`-Hook teilt Claude mit, dass die Agenten verfügbar sind.

---

## License

MIT – kostenlose Nutzung, Vervielfältigung, Änderung und Verbreitung; bereitgestellt „wie besehen“, ohne Gewährleistung und ohne Haftung. Siehe [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
