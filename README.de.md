<div align="center">

# Agent-Vorcl-Flow

**Ein Team spezialisierter KI-Subagenten für [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) und [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) – mit Fähigkeiten, Befehlen und MCP-Tools.**
Ein `npx`-Befehl installiert sie. Kein Remote-Backend oder Cloud-Hosting: Ihr Coding-Agent führt alles lokal aus.

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

[English](./README.md) · [Русский](./README.ru.md) · [Українська](./README.uk.md) · [**Deutsch**](./README.de.md) · [Français](./README.fr.md) · [Español](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 01861dcfef6354f49ecb1c6e62f9c5316943aeb8305556e432e273d7117f85e6. -->

</div>

---

## Was ist das?

Agent-Vorcl-Flow verwandelt einen unterstützten Coding-Agenten in ein **strukturiertes Engineering-Team**. Anstelle eines allgemeinen Assistenten erhalten Sie **22 fokussierte Unteragenten** (Architekt, Backend, Frontend, Expo Mobile Engineer, DB Engineer, Architekturkartograph, Liveboard-Operator und mehr), jeder mit seinen eigenen Domänen-**Fähigkeiten**, schnellen **Slash-Befehlen** und den benötigten **MCP-Tools**. Jede nicht triviale Aufgabe durchläuft eine disziplinierte **Task Master**-Schleife – *Ziel → Aufgaben → Implementieren → Überprüfen → Erledigt* – damit die Arbeit geplant und nachverfolgt wird und Unterbrechungen übersteht.

- 🧩 **22 Unteragenten**, 44 Fertigkeiten, 135 Slash-Befehle
- ⚡ **Ein-Befehl-Installation** für Claude Code, Codex, Cursor und/oder Kimi CLI — `npx`
- 🔌 **11 MCP Server** verkabelt (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, Dateisystem, Task Master, Mermaid)
- 🔑 **Eine `.env`-Datei für alle Laufzeiten** – Schlüssel werden von einem Launcher gelesen, nicht von `~/.zshrc`, sodass sie auch bei GUI-/IDE-Starts funktionieren; kein Remote-AVF-Dienst; Liveboard ist nur für Localhost verfügbar und kurzlebig
- 🤝 **Läuft auf Claude Code, GPT Codex, Cursor und Kimi CLI** aus derselben Quelle

---

## Schnellstart

### Anforderungen
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** und/oder **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Installieren (ein Befehl)

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
| **GPT Codex** | Verbindet die Fertigkeiten mit `~/.agents/skills` und die `config.toml` + `AGENTS.md`-Blöcke mit `~/.codex` (idempotent, zwischen Markern). |
| **Cursor** | Installiert Fertigkeiten in `~/.cursor/skills`, native benutzerdefinierte Subagenten in `~/.cursor/agents` und führt fehlende Server in `~/.cursor/mcp.json` zusammen. |
| **Kimi CLI** | Installiert Fähigkeiten in `~/.kimi/skills`, den nativen Expo benutzerdefinierten Agenten in `~/.kimi/agents`, beide Expo-Architekturen/UI-Hooks in `~/.kimi/config.toml` und führt MCP-Server zusammen. |

> Das Installationsprogramm gibt niemals Ihre Geheimnisse ein – es erstellt lediglich ein leeres `.env` aus der Vorlage. Dort fügen Sie Schlüssel hinzu (siehe [Configuration](#konfiguration-mcp--tasten)).

### Aktualisieren Sie auf die neueste Version

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

Das Update überlagert Agent-Vorcl-Flow-verwaltete Skills, Agents, Hooks, Launcher und Konfigurationsblöcke. Ihr bestehendes `~/.config/agent-vorcl-flow/.env` und seine Geheimnisse bleiben unverändert und die vorgelagerten Firecrawl-Fähigkeiten bleiben erhalten. Starten Sie anschließend den aktualisierten Coding-Client neu (oder führen Sie `/reload-plugins` in Claude Code aus).

### Alternative Installationen (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Nach der Installation **starten Sie Claude Code** neu (oder führen Sie `/reload-plugins` in einer offenen Sitzung aus), um die Agenten zu laden.

---

## Anwendung

Die Beispiele in diesem Abschnitt verwenden die Claude Code-Syntax; Sehen Sie sich die [Cursor](#cursor)- und [GPT Codex](#gpt-codex)-Zuordnungen unten für ihre native Syntax an. In Claude Code gibt es **drei Möglichkeiten**, das Team aufzurufen.

### 1. Universeller Einstiegspunkt – geben Sie einfach ein Ziel an
```text
/vorcl add a shopping cart to checkout
/audit .
```
`/vorcl` ermittelt, welcher Subagent die Arbeit besitzen soll, und steuert den gesamten Task Master-Zyklus. `/audit` erkennt automatisch Backend, Frontend, Mobile, Daten und Infrastruktur und schreibt ein evidenzbasiertes `PROJECT_AUDIT.md` unter Verwendung aller relevanten Rollen.

### 2. Sprechen Sie mit einem bestimmten Subagenten
```text
@agent-vorcl-flow:architect  design billing for a SaaS
@agent-vorcl-flow:backend    add a POST /invoices endpoint
```

### 3. Führen Sie einen bestimmten Slash-Befehl aus
```text
/backend:create-api   POST /invoices
/analyzer:audit       src/
/screenshot:convert   ./mockups/dashboard.png  react
```

Jeder Agent verfügt außerdem über einen eigenen `/<agent>:vorcl`-Einstiegspunkt, der die Task Master-Schleife für diesen Agenten ausführt.

### Die Task Master-Schleife
Jede nicht triviale Aufgabe durchläuft **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```

Dadurch bleibt die Arbeit geplant, kontrolliert und fortsetzbar – nichts wird als „erledigt“ erklärt, ohne den Überprüfungsschritt bestanden zu haben.

---

## Die Agenten| Agent | Rolle | Höhepunkte |
| --- | --- | --- |
| 🔵 **Architekt** | System- und Lösungsarchitekt | Anforderungsanalyse, System-/DB/API-Design, Architekturprüfungen |
| 🟢 **Backend** | Backend-Entwickler | Knoten/TS, Postgres, Redis; modulare Architektur; jede von OpenAPI vollständig abgedeckte Strecke |
| 🟣 **Frontend** | Frontend (React 19 / Next.js App Router) | Komponenten, Status, Datenabruf, Render-/Bundle-Optimierung, Tests |
| 📱 **expo-mobile** | React Native + Expo Ingenieur | Modulare Architektur plus Design-/Bewegungs-/Interaktionssystem, native Navigation, Token, Gesten, Haptik, reduzierte Bewegung |
| 🟠 **Analysator** | Code-Auditor (schreibgeschützt) | Fehler, Typsicherheit, DB-Struktur, Frontend-Mocks, Backend-Gerüche |
| 🟡 **Prahlerei** | OpenAPI/Swagger Abdeckung (beliebiger Stapel) | Findet nicht vollständig dokumentierte Routen und deckt diese mit Überprüfung ab |
| 🔴 **Feuerkrabbe** | Webforscher | Live CLI/MCP/REST, App-Integration und fertige Web-Daten-Workflows |
| 🟤 **rendern** | Hosten und Bereitstellen (Rendern) | Bereitstellung, protokollgesteuerte Diagnose, Metriken, Umgebungsvariablen, Rendern Postgres |
| 🟦 **Datenbank** | DB Ingenieur / DBA | Schema, Abfragen und Pläne, Indizes, N+1, sichere reversible Migrationen, Cache |
| ⚪ **Resilienz** | Zuverlässigkeit: Fehler + Protokollierung | Versuchen/Fangen an den richtigen Grenzen, eingegebene Fehler, Wiederholungsversuche/Zeitüberschreitungen, strukturierte Protokolle |
| 🖼️ **Screenshot** | Screenshot UI → Code | Verwandelt einen UI Screenshot in produktionsbereiten, reaktionsfähigen und zugänglichen Code |
| 🔎 **visuelle Forschung** | Screenshot → verifizierte Antwort | Identifiziert die Site/Seite, findet offizielle Dokumente, prüft Live-Daten und antwortet mit URLs und Vertrauen |
| 🎯 **punktgenau** | Screenshot → in ein bestehendes Projekt einfügen (schreibgeschützt) | Verankert einen Screenshot einer laufenden App in der echten Codebasis – Komponente, `file:line`, Route/Seite, die genaue Steuerung und die Logik dahinter; erstellt nichts, delegiert die Bearbeitung |
| 📊 **drawio** | Diagramme (draw.io / charts.net) | Flussdiagramm, BPMN, UML, ERD, Netzwerk/Cloud und PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Architekturkartograph | Deterministischer Code → `architecture.json` (jeder Knoten mit `source:{file,line}`) → interaktive HTML Karte, draw.io, Mermaid, ARCHITECTURE.md, PDF; unbewiesene Tatsachen sind mit `inferred` | gekennzeichnet
| 🧜 **Meerjungfrau** | Mermaid Diagramme (+ reales Rendering) | Flussdiagramm, Sequenz, Klasse, Zustand, ER, Gantt, GitGraph, Mindmap…; validiert über mcp-mermaid/`mmdc`; übergibt dir die Datei (`.mmd` + SVG/PNG/PDF) |
| 🧪 **Testen** | Test- und Verifizierungsingenieur | Einheit (Vitest/Jest), Integration (Supertest), E2E (Playwright), Abdeckung, Flaky-Test-Jagd; führt das `testStrategy` jeder Aufgabe aus – ohne einen grünen Lauf wird nichts „erledigt“ |
| 🌿 **gitflow** | Git Workflow & Freigaben | Konventionelle Commits, By-Name-Commits (nie `git add .`), PRs, Keep-a-Changelog, Semver-Releases; Push nur mit expliziter Bestätigung |
| 🛡️ **Sicherheit** | Sicherheitsprüfer (schreibgeschützt) | Geheimnisse in der Baum- und Git-Geschichte, OWASP Top 10, Abhängigkeits-CVEs, PII; Erkenntnisse werden zu Aufgaben – Korrekturen werden delegiert |
| 📝 **Dokumente** | Dokumentationsingenieur | README (mehrsprachige Parität), API-Dokumente von OpenAPI, ARCHITEKTUR, BEITRAG, Versionshinweise; jedes Beispiel anhand des Codes überprüft |
| 🐳 **Entwickler** | Container & CI/CD | Mehrstufige Docker-Dateien, Docker-Compose für lokale Entwicklung, GitHub Aktionspipelines, Env/Secrets-Hygiene, Überwachung |
| 📡 **Liveboard** | Lokaler Betriebsrat | Live Git Arbeitsbäume, Agentenprozesse und Task Master Aufgaben auf einem kurzlebigen Localhost-Dashboard |**Ein paar wissenswerte Dinge:**
- **Frontend kommuniziert immer mit einem echten API.** Die OpenAPI-Spezifikation des Backends ist die einzige Quelle der Wahrheit; Daraus werden Typen generiert (`openapi-typescript` + `openapi-fetch`). Keine Mocks im Produktionsweg.
- **`database` Mutationen erfordern eine explizite Bestätigung.** Analysen sind schreibgeschützt; Schema-/Datenänderungen (DDL/DML/Migrationen) werden niemals ohne Ihre Zustimmung ausgeführt.
- **`resilience` verfügt über einen Sicherheitshaken.** Ein nicht blockierender `PostToolUse`-Haken (`catch-guard.js`) markiert sanft leere `catch {}`-Blöcke in Dateien, die Sie gerade bearbeitet haben.
- **`archmap` schöpft nie aus der Fantasie.** Extraktion und Rendering sind strikt getrennt: Null-Abhängigkeits-Skripte leiten das Repo in `architecture.json` (Datenbanken mit echter FK-Kardinalität, API-Routen, KI-Agenten mit ihren Modellen/Tools/Speicher, Importdiagramm, Umgebung), und jedes Diagramm wird nur aus diesem JSON gerendert. Alles, was das LLM ohne ein überprüfbares `file:line` hinzufügt, wird mit `inferred:true` zwangsmarkiert und gestrichelt dargestellt.
- **`pinpoint` findet, erstellt nie.** Anhand eines Screenshots einer laufenden App ordnet es den Bildschirm dem echten Code zu – Komponente, Route, die genaue Steuerung und die Logik dahinter – und übergibt die Bearbeitung an `frontend`/`backend`. Es funktioniert mit dem, was bereits existiert (das Gegenteil von `screenshot`).
- **`visual-research` verifiziert statt zu raten.** Es behandelt einen Screenshot als Beweis, bestätigt die offizielle Domain und Dokumente, überprüft aktuelle Site-Daten und kennzeichnet mögliches Phishing oder veraltete Werte.
- **`i18n` erzwingt „Null-Sprach-Hardcodierung“.** Agenten erkennen zunächst, ob ein Projekt mehrsprachig ist, und passen sich an – benutzerseitige Zeichenfolgen durchlaufen eine Übersetzungsebene (next-intl/react-i18next/i18next), niemals inline.

---

## Befehlsreferenz

Jeder Befehl unten ist ein Schrägstrich-Befehl. `<…>` markiert Ihre Eingabe.

### `/vorcl` – Universal-Router
| Befehl | Was es tut |
| --- | --- |
| `/vorcl <goal>` | Wandelt jedes Ziel in Aufgaben um, leitet es an den richtigen Unteragenten weiter und führt dann den gesamten Erledigungszyklus durch. |
| `/audit [path] [focus]` | Tiefgreifendes, schreibgeschütztes Multi-Rollen-Audit → erkannte Systeme, Sicherheits-/CVE-/Resilienz-Ergebnisse, Zielarchitektur und phasenweise `PROJECT_AUDIT.md`. |

### 🔵 Architekt – Architektur
| Befehl | Was es tut |
| --- | --- |
| `/architect:vorcl <goal>` | Ziel → Aufgaben → Zyklus, bezogen auf die Architektur. |
| `/architect:analyze <context>` | Analysieren Sie Anforderungen und den Kontext der Aufgabe. |
| `/architect:design <problem>` | Entwerfen Sie die Lösungsarchitektur (System, DB, API). |
| `/architect:review <target>` | Überprüfen Sie eine vorhandene Architektur. |

### 🟢 Backend – Server (Knoten/TS, Postgres, Redis)
| Befehl | Was es tut |
| --- | --- |
| `/backend:vorcl <goal>` | Ziel → Aufgaben → Zyklus für Backend-Arbeit. |
| `/backend:create-api <endpoint>` | Generieren Sie einen API-Endpunkt auf der modularen Architektur, der vollständig von OpenAPI abgedeckt wird. |
| `/backend:refactor <target>` | Code umgestalten, ohne das Verhalten zu ändern. |
| `/backend:optimize <target>` | Leistungsoptimierung. |
| `/backend:test <target>` | Generieren Sie Tests für den Code. |

### 🟣 Frontend – React / Next.js
| Befehl | Was es tut |
| --- | --- |
| `/frontend:vorcl <goal>` | Ziel → Aufgaben → Zyklus für Frontend-Arbeit. |
| `/frontend:create-component <spec>` | Generieren Sie eine UI-Komponente entsprechend der Feature-Struktur. |
| `/frontend:refactor <target>` | Refactor UI / Hooks ohne Verhaltensänderung. |
| `/frontend:optimize <target>` | Optimieren Sie Rendering/Bundle/Core Web Vitals. |
| `/frontend:test <target>` | Komponententests generieren. |

### 📱 expo-mobile — React Native / Expo| Befehl | Was es tut |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Ziel → Task Master Zyklus für Expo mobiles Arbeiten. |
| `/expo-mobile:create-module <domain>` | Erstellen Sie einen modularen Geschäftsausschnitt mit nur den Schichten, die seine Komplexität erfordert. |
| `/expo-mobile:create-screen <flow>` | Erstellen Sie eine dünne Expo Router-Route sowie einen moduleigenen Bildschirm und Zustände. |
| `/expo-mobile:design-screen <flow>` | Erstellen Sie einen Premium-Bildschirm mit gemeinsamen Design-/Bewegungs-Tokens, Zuständen und Zugänglichkeit. |
| `/expo-mobile:motion <interaction>` | Entwerfen Sie native Navigation, Federn, Gesten, Haptik und Fallbacks mit reduzierter Bewegung. |
| 😉 | Fügen Sie Schema-/DTO-/Mapper-/Abfrageschlüssel und TanStack Query-Integration hinzu. |
| `/expo-mobile:audit [scope]` | Schreibgeschützter Architekturwächter und evidenzbasiertes Audit. |
| `/expo-mobile:ui-audit [scope]` | Schreibgeschütztes Designsystem, Bewegungs-, Interaktions-, Zugänglichkeits- und Leistungsprüfung. |
| `/expo-mobile:compatibility [app] [change]` | Live-Lese-Kompatibilitätsprüfung für Expo/RN/Node/Paket/Native-Runtime anhand versionierter offizieller Quellen. |
| `/expo-mobile:test <scope>` | Führen Sie die Domäneneinheit, React Native Testing Library und Maestro Prüfungen aus. |

### 🟠 Analysator – Code-Audit (schreibgeschützt)
| Befehl | Was es tut |
| --- | --- |
| `/analyzer:vorcl <goal>` | Prüfen Sie ein Ziel über Task Master – Erkenntnisse werden zu Aufgaben. |
| `/analyzer:audit` | Vollständiges Audit: Fehler, Typen, DB, Frontend-Mocks, Backend-Gerüche. |
| `/analyzer:bugs` | Suchen Sie nach Fehlern – nicht behandelte Fehler, Rennbedingungen, Randfälle. |
| `/analyzer:types` | Typprüfung – `tsc`, `any`, unsichere Würfe, Zod↔Typendrift. |
| `/analyzer:db` | Audit-DB-Struktur – Schema, Indizes, FKs, N+1, Migrationen. |
| `/analyzer:mocks` | Finden Sie Mockup-/Fake-Daten im Frontend. |
| `/analyzer:backend` | Finden Sie „schlechten“ Backend-Code – Architekturverstöße, Logik in Controllern. |

### 🟡 Swagger – OpenAPI/Swagger Coverage (beliebiger Stapel)
| Befehl | Was es tut |
| --- | --- |
| `/swagger:vorcl <goal>` | Vollständiges Abdeckungsziel über Task Master – Audit → Aufgaben → Abdeckung → Verifizieren. |
| `/swagger:audit` | Schreibgeschützt: Routen finden, die nicht vollständig von der Spezifikation abgedeckt werden. |
| `/swagger:cover <route>` | Decken Sie eine Route/ein Modul ab – Parameter, Antworten, Beschreibungen, Sicherheit + Überprüfung. |

### 🔴 Firecrawl – Webrecherche
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
| `/firecrawl:ask <jobId>` | Diagnostizieren Sie einen fehlgeschlagenen Firecrawl Job. |
| `/firecrawl:docs-search <question>` | Durchsuchen Sie die aktuelle offizielle Firecrawl-Dokumentation. |
| `/firecrawl:integrate <feature>` | Fügen Sie Firecrawl über vorgelagerte Build-Fähigkeiten zum Anwendungscode hinzu. |
| `/firecrawl:deliverable <artifact>` | Erstellen Sie ein Briefing, ein Audit, eine Lead-Liste oder ein anderes Workflow-Artefakt. |`/firecrawl:setup` führt den offiziellen `firecrawl-cli init --all`-Flow erst nach Bestätigung aus. Vorhandene offizielle `firecrawl-*`-Kenntnisse haben Vorrang und bleiben vom Codex/Cursor-Installer erhalten; AVF liefert kompatible Fallbacks für fehlende Fähigkeiten. Der Live-Betrieb erfolgt über CLI → MCP → REST/Keyless.

### 🟤 rendern – Hosten/Bereitstellen (Rendern)
| Befehl | Was es tut |
| --- | --- |
| `/render:vorcl <goal>` | Infra-Ziel über Task Master – Bereitstellung/Diagnose/Konfiguration bis zum Abschluss. |
| `/render:deploy <service>` | Einen Dienst bereitstellen/erneut bereitstellen. |
| `/render:logs <service>` | Serviceprotokolle und Diagnose bis zur Ursache. |
| `/render:status <service>` | Servicestatus + Bereitstellung + Metriken. |
| `/render:query <sql>` | Schreibgeschütztes SQL für Render Postgres. |

### 🟦 Datenbank – DB Ingenieur / DBA (Postgres / MongoDB / Redis)
| Befehl | Was es tut |
| --- | --- |
| `/database:vorcl <goal>` | Datenziel über Task Master – Schema/Abfragen/Migrationen/Cache erledigt. |
| `/database:query <query>` | Schreibgeschützte Abfrage/Analyse. |
| `/database:schema <target>` | Entwerfen/Überprüfen Sie das Schema und die Datenintegrität. |
| `/database:migrate <change>` | Planen Sie eine sichere, umkehrbare Schema-/Datenmigration. |
| `/database:optimize <target>` | Optimieren – Indizes, N+1, Abfragepläne, Paginierung. |
| `/database:cache <target>` | Redis – TTL, Ungültigmachung, Sperren, Ratenbegrenzung, Streams. |

### ⚪ Resilienz – Fehlerbehandlung + Protokollierung
| Befehl | Was es tut |
| --- | --- |
| `/resilience:vorcl <goal>` | Zuverlässigkeitsziel über Task Master – Code mit Try/Catch + Protokollen abdecken. |
| `/resilience:harden <target>` | Wickeln Sie Code in try/catch/finally mit solider Protokollierung ein, ohne stille Fehler. |
| `/resilience:logging <target>` | Strukturierte Protokollierung hinzufügen/korrigieren – Ebenen, Kontext, keine Geheimnisse/PII. |
| `/resilience:audit` | Schreibgeschützt: Stille Fehler, leere Catches und Protokollierungslücken finden. |

### 🖼️ Screenshot – Screenshot UI → Code
| Befehl | Was es tut |
| --- | --- |
| `/screenshot:vorcl <goal>` | Eine Reihe von Bildschirmen aus Screenshots über Task Master – Aufschlüsselung → Code. |
| `/screenshot:analyze <image>` | Schreibgeschützte Aufschlüsselung – Layout, Komponenten, Token, Zustände → Plan. |
| `/screenshot:convert <image> [framework]` | Generieren Sie vollständig ausführbaren Code aus einem Screenshot (Standard React + Tailwind v4). |
| `/screenshot:tokens <image>` | Extrahieren Sie Design-Tokens (OKLCH-Farben, Typografie, Abstände) in Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Machen Sie das generierte UI reaktionsfähig – Haltepunkte, Fluid, `clamp()`, Containerabfragen. |

### 🔎 visuelle Recherche – Screenshot → verifizierte Web-Antwort
| Befehl | Was es tut |
| --- | --- |
| `/visual-research:vorcl <goal>` | Mehrstufige Screenshot-Recherche durch Task Master. |
| `/visual-research:identify <image>` | Identifizieren Sie die Website, Seite und Funktion mit zuverlässigen Beweisen. |
| `/visual-research:search <image> <target>` | Finden Sie anhand visueller Hinweise die echte Seite oder die offizielle Dokumentation. |
| `/visual-research:answer <image> <question>` | Antworten Sie mit Screenshot-Beweisen, offiziellen Dokumenten und aktuellen Live-Daten. |
| `/visual-research:hints <image> <goal>` | Geben Sie sichere, dokumentationsgestützte Schritte für die sichtbare Schnittstelle an. |

### 🎯 punktgenau – Screenshot → in ein bestehendes Projekt einfügen (schreibgeschützt)
| Befehl | Was es tut |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Vorhandenes UI aus einem Screenshot über Task Master – Karte → Aufgaben → Delegieren finden/verstehen/ändern. |
| `/pinpoint:locate <image>` | Suchen Sie die vorhandene(n) Komponente/Datei(en) anhand eines Screenshots – `file:line`, kein neuer Code. |
| `/pinpoint:route <image>` | Identifizieren Sie die Route/Seite, auf der sich der Bildschirm befindet (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <image>` | Bestimmen Sie das genaue Steuerelement (Schaltfläche/Feld) und seinen Handler im Code. |
| `/pinpoint:trace <target>` | Verfolgen Sie die Logik hinter einem Element – ​​Handler → Status → Datenabruf → API. |
| `/pinpoint:handoff <change>` | Erstellen Sie eine präzise Bearbeitungsanforderung für den vorhandenen Code und delegieren Sie sie an `frontend`/`backend`. |

### 📊 drawio – Diagramme (draw.io / charts.net)
| Befehl | Was es tut |
| --- | --- |
| `/drawio:vorcl <goal>` | Eine Reihe von Diagrammen über Task Master – Build to Done. |
| `/drawio:create <description> [type]` | Erstellen Sie ein Diagramm aus einer Textbeschreibung (gültiges natives XML). |
| `/drawio:pmp <type> <project>` | Erstellen Sie ein PMP/PMBOK-Diagramm – WBS, PERT/CPM, Gantt, RACI, Risikomatrix, Stakeholder-Raster. |
| `/drawio:convert <source> [type]` | Konvertieren Sie eine Quelle in ein Diagramm – DB Schema → ERD, Ordner → Baum, Code → UML, Meerjungfrau/CSV/JSON. |
| `/drawio:refine <file>` | Verfeinern Sie ein vorhandenes `.drawio` – Layout, Thema, Knoten hinzufügen/entfernen, am Raster ausrichten. |

### 🗺️ Archmap – Architekturkarte aus Code| Befehl | Was es tut |
| --- | --- |
| `/archmap:vorcl <goal>` | Ein Mapping-Ziel über Task Master – Build zu einem verifizierten Artefaktsatz. |
| `/archmap:map [repo]` | Vollständige Pipeline: Extraktion → `architecture.json` → LLM-Annotation → alle Formate (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Nur Extraktion – maschinenlesbares `architecture.json` mit `source:{file,line}` auf jedem Knoten. |
| `/archmap:annotate [json]` | LLM-Anreicherung eines vorhandenen `architecture.json` (Agentenspeicher, Datenflusssemantik); unbewiesene Tatsachen werden automatisch auf `inferred` herabgestuft. |
| `/archmap:html [json]` | Interaktive, eigenständige HTML-Karte – Ebenenumschaltung, Balkenverfolgung, Knoten → `file:line`-Panel, Suche, Drucken von CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (mehrseitig: Übersicht / ERD / API / Agents) und/oder Mermaid Ansichten, validiert. |

### 🧜 Meerjungfrau – Mermaid Diagramme (+ echte Darstellung)
| Befehl | Was es tut |
| --- | --- |
| `/mermaid:vorcl <goal>` | Eine Reihe von Diagrammen über Task Master – Build to Done (Rendering-verifiziert). |
| `/mermaid:create <description> [type]` | Erstellen Sie ein Diagramm aus einer Beschreibung – gültige Syntax, überprüft durch ein echtes Rendering; gibt Ihnen die Akte. |
| `/mermaid:convert <source> [type]` | Konvertieren Sie eine Quelle in Mermaid – DB Schema → ER, Code → Klasse/Sequenz, Ordner → Flussdiagramm, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Syntax + echter Rendertest; Fehler finden und beheben (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Export nach SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Verfeinern Sie ein vorhandenes `.mmd` – Richtung, Untergraph, Klassendefinition/Stile, Lesbarkeit. |

### 🧪 Testen – Tests und Verifizierung
| Befehl | Was es tut |
| --- | --- |
| `/testing:vorcl <goal>` | Ein Test-/Verifizierungsziel über Task Master – Einheit + Integration + e2e to done. |
| `/testing:unit <file\|module>` | Unit-Tests (Vitest/Jest) – glücklicher Weg, Grenzen, Fehler; führt sie aus und zeigt die Ausgabe an. |
| `/testing:integration <endpoint\|module>` | Integrationstests (Supertest/inject, real DB oder Testcontainer). |
| `/testing:e2e <scenario>` | Playwright E2E für einen kritischen Benutzerpfad – Rollenselektoren, Vorrichtungen, Ablaufverfolgung bei Fehlern. |
| `/testing:verify <task\|testStrategy>` | Führt den `testStrategy` einer Aufgabe aus und gibt ein READY/NOT READY-Urteil mit echter Ausgabe zurück. |
| `/testing:coverage [path]` | Abdeckungsbericht mit Ergebnissen – welcher kritische Code ist ungetestet; erstellt Aufgaben. |
| `/testing:flaky <test>` | Diagnostiziert einen instabilen Test (Rennen, Timing, gemeinsamer Zustand, Mocks) und behebt ihn endgültig. |

### 🌿 Gitflow – Git-Workflow und -Releases
| Befehl | Was es tut |
| --- | --- |
| `/gitflow:vorcl <goal>` | Ein Git-/Release-Ziel über Task Master (Release vorbereiten, Verlauf bereinigen, Feature-Branch). |
| `/gitflow:commit <files\|scope>` | Ein By-Name-Commit (nie `git add .`) mit einer konventionellen Commits-Nachricht; stoppt bei unbekanntem WIP. |
| `/gitflow:pr <base> <title>` | Zweig → Commits → Pull-Anfrage (gh / GitHub MCP) mit was/warum/wie-verifiziert. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Änderungsprotokoll führen), generiert aus Commits zwischen Tags. |
| `/gitflow:release <version\|auto>` | Semver aus Commits → Manifestversionen synchronisieren → Tag → GitHub Release. Push nur nach ausdrücklicher Bestätigung. |
| `/gitflow:audit [branch]` | Nur-Lese-Verlaufsprüfung: Konventionsverstöße, Dump-Commits, große Blobs, verwaiste Branches. |

### 🛡️ Sicherheit – Sicherheitsaudit (schreibgeschützt)
| Befehl | Was es tut |
| --- | --- |
| `/security:vorcl <goal>` | Ein Sicherheitsziel über Task Master – Audit → Ergebnisse → Aufgaben → delegierte Korrekturen. |
| `/security:secrets [path\|branch]` | Geheimnisse im Arbeitsbaum UND im Git-Verlauf (alle Zweige); `${VAR:-}` Platzhalter sind keine Geheimnisse. |
| `/security:owasp [path]` | OWASP Top 10 im Code: Injektionen, XSS, Authentifizierung, Datenexposition, CORS/Cookies – mit file:line-Proof. |
| `/security:deps` | Abhängigkeits-CVEs über Audit-/Sperrdateien – Schweregrad, Breaking-Change-Flags. |
| `/security:pii [path]` | PII/DSGVO-Risiken: E-Mails, Telefone, Karten im Code und Protokolle; Private Pfade des Entwicklers. |
| `/security:pre-push [branch]` | Schnelle kombinierte Prüfung geänderter Dateien vor einem Push: Geheimnisse + Injektionen + PII; grün/rotes Urteil. |

### 📝 Dokumente – Dokumentation
| Befehl | Was es tut |
| --- | --- |
| `/docs:vorcl <goal>` | Ein Dokumentationsziel über Task Master. |
| `/docs:readme [path]` | README erstellen/aktualisieren – what/quickstart/usage/config/troubleshooting; Beispiele überprüft; Sprachversionen synchronisiert. || `/docs:api [spec]` | API Dokumente, die aus der OpenAPI-Spezifikation generiert wurden (Endpunkte, Parameter, Curl-Beispiele); schlägt `/swagger:audit` vor, wenn keine Spezifikation vorhanden ist. |
| `/docs:architecture` | ARCHITECTURE.md – Module, Grenzen, Datenfluss; Diagramme an `mermaid`/`drawio` delegiert. |
| `/docs:contributing` | CONTRIBUTING.md – Setup, Struktur, Tests, Commit-Konventionen (ausgeglichen mit `gitflow`), PR-Prozess. |
| `/docs:release-notes <version>` | Versionshinweise für eine Version aus CHANGELOG/history. |
| `/docs:audit` | Schreibgeschützte Dokumente↔Code-Drift-Prüfung: defekte Links, veraltete Beispiele/Zähler, nicht synchronisierte Übersetzungen. |

### 🐳 Entwickler – Container & CI/CD
| Befehl | Was es tut |
| --- | --- |
| `/devops:vorcl <goal>` | Ein Infrastrukturziel über Task Master. |
| `/devops:dockerfile [app-type]` | Schreiben/überprüfen Sie eine Docker-Datei – mehrstufig, schlanke Basis, nicht Root, HEALTHCHECK; durch ein echtes `docker build` verifiziert. |
| `/devops:compose` | docker-compose.yml für lokale Entwickler (App + DBs); Umgebungsänderungen benötigen `--force-recreate`, wartet auf gesunde. |
| `/devops:ci [type]` | GitHub Aktionen – PR-Workflow (lint+typecheck+test, npm Cache), Bereitstellungsworkflow, minimale Berechtigungen. |
| `/devops:env` | Inventar der Umgebungsvariablen: Wo gelesen, was ist erforderlich, `.env.example` Vorlage; Geheimnisse niemals in Bildern. |
| `/devops:monitoring` | Strukturierte Protokolle (Pino/JSON), Gesundheitsendpunkt, worauf Sie achten sollten; Rendern Sie Metriken über den `render`-Agenten. |

### 📡 Liveboard – kurzlebiges lokales Operationsboard
| Befehl | Was es tut |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Starten Sie ein ausgefeiltes 43-sprachiges Dashboard auf einem kostenlosen Localhost-Port. Task Master ändert den Stream über SSE und gleicht alle 5 Minuten ab. |
| `/liveboard:vorcl <goal>` | Entwickeln oder ändern Sie das Liveboard selbst durch den erforderlichen Task Master-Workflow. |

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
- `--interval`: vollständiges Abstimmungsintervall in Millisekunden; Dateiüberwachung streamt weiterhin Task Master ändert sich sofort.
- Endpunkte: `/health`, `/api/snapshot`, `/api/events` (SSE) und `POST /api/refresh`.
- Behalten Sie `--host 127.0.0.1`, es sei denn, Sie beabsichtigen ausdrücklich, Projektinformationen dem Netzwerk zugänglich zu machen.

---

## Konfiguration (MCP & Tasten)

Das Paket hat **kein Remote-Backend oder eine Datenbank**. Das optionale Liveboard ist ein In-Memory-Prozess nur für Localhost. MCP Server benötigen Token und **jeder Benutzer stellt seine eigenen bereit**. Damit dies für **Claude Code, Codex, Cursor und Kimi CLI** identisch funktioniert – und unabhängig davon, ob Sie von einem Terminal oder von Dock / Spotlight / einer IDE aus starten – wird jeder stdio MCP-Server über einen kleinen Launcher (`bin/mcp-env.mjs`) gestartet, der Ihre Schlüssel aus **einer Datei** liest:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Der Installer erstellt es aus [`.env.example`](./.env.example). Öffnen Sie es und geben Sie nur die Schlüssel ein, die Sie verwenden:

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

> **Warum ein Launcher anstelle von `~/.zshrc`?** Die Env-Var-Erweiterung ist je nach Laufzeit unterschiedlich (`${VAR:-}` in Claude, `${env:VAR}` in Cursor, Literale in Codex/Kimi) und jede Laufzeit liest nur die Umgebung, in der sie gestartet wurde. GUI-/IDE-Starts unter macOS enthalten kein `~/.zshrc`, daher sind exportierte Schlüssel unsichtbar und die Server stellen keine Verbindung her – der klassische Fehler „MCP env not set“. Das Lesen aus einer `.env`-Datei beseitigt beide Probleme gleichzeitig.**Vorrang** (später gewinnt): das gemeinsam genutzte `~/.config/agent-vorcl-flow/.env` → ein `./.env` im Projektstamm → ein echtes `export` in Ihrer Shell. Behalten Sie globale Schlüssel in der gemeinsam genutzten Datei, überschreiben Sie jedes Projekt (z. B. ein anderes `MONGODB_URI`) mit einem Projekt `.env`, und ein echter Shell-Export gewinnt immer noch für CLI-Läufe. Sie können den Launcher mit `AGENT_VORCL_ENV_FILE=/path/.env` auf eine andere Datei richten.

Ein Server, dessen erforderlicher Schlüssel fehlt, **startet einfach nicht** – im MCP-Protokoll der Laufzeit wird ein einzeiliges `[agent-vorcl-flow] MCP «…» is not configured: …` angezeigt, und alle anderen Server arbeiten weiter. Fügen Sie den Schlüssel zu `.env` hinzu und starten Sie neu. (Sie können `GITHUB_TOKEN`/`MONGODB_URI`-Namen behalten – der Launcher ordnet sie dem `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` zu, das die Server erwarten.)

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

## Überprüfen Sie die Installation

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

Codex verfügt über keine „Plugins“, daher werden dieselben Fähigkeiten als **Fähigkeiten**, **Profile** und ein `AGENTS.md`-Router ausgedrückt:

| Claude Code | Codex Äquivalent |
| --- | --- |
| Unteragent `@agent-vorcl-flow:frontend` | Skill-Persona `$frontend` + `codex --profile frontend` |
| Befehl `/analyzer:audit` | Aufgabenkompetenz `$analyzer-audit` |
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

Die vollständige Zuordnung finden Sie unter [`codex/README.md`](./codex/README.md).

---

## Cursor

Cursor verwendet dasselbe offene `SKILL.md`-Format wie der Codex-Adapter sowie native benutzerdefinierte Subagenten und globale MCP-Konfiguration:

| Agent-Vorcl-Flow Konzept | Cursor Äquivalent |
| --- | --- |
| Rolle `backend` | benutzerdefinierter Subagent `/avf-backend` in `~/.cursor/agents` |
| Aufgabenbefehl `/backend:create-api` | Fähigkeit `/backend-create-api` |
| universell `/vorcl` | Fähigkeit `/vorcl` |
| `.mcp.json` | zusammengeführte Server in `~/.cursor/mcp.json` |

Das Installationsprogramm konvertiert Rollendefinitionen in Cursor frontmatter, stellt Subagenten `avf-` voran, um Kollisionen zwischen Skill-Namen zu vermeiden, verwendet `model: inherit` und markiert Nur-Überwachungsagenten als `readonly: true`. Vorhandene MCP-Servereinträge mit demselben Namen bleiben erhalten. Siehe [`cursor/README.md`](./cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) lädt nativ Agentenfähigkeiten, benutzerdefinierte Agentendateien und Lebenszyklus-Hooks; AVF führt außerdem dieselben MCP-Server zusammen, die von Claude und Cursor verwendet werden:

| Agent-Vorcl-Flow Konzept | Kimi CLI Äquivalent |
| --- | --- |
| Fähigkeiten/Aufgabenbefehle | `~/.kimi/skills` und `/skill:<name>` |
| Expo benutzerdefinierter Agent | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse Guard | verschmolzen in `~/.kimi/config.toml` |
| `.mcp.json` | zusammengeführte Server in `~/.kimi/mcp.json` |
| Schlüsseldatei pro Laufzeit | das geteilte `~/.config/agent-vorcl-flow/.env` (über den Launcher) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI hat keine `${VAR}`-Erweiterung in `mcp.json`, daher kommen Schlüssel vom gemeinsamen `.env` über den Launcher – genau wie die anderen Laufzeiten. Siehe [`kimi/README.md`](./kimi/README.md).

---

## Projektstruktur

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

**Wie es zusammenpasst:** `agents/*.md` Deklarieren Sie eine Rolle und fügen Sie im Vorfeld `skills:` Fertigkeiten hinzu → Fertigkeiten in `skills/*/SKILL.md` werden automatisch durch Beschreibung geladen → `commands/<agent>/*.md` stellen schnelle `/agent:command` Verknüpfungen bereit, die an den Unteragenten delegieren → `.mcp.json` gibt Agenten ihre Werkzeuge, die jeweils durch `bin/mcp-env.mjs` gestartet werden, wodurch Geheimnisse aus dem gemeinsam genutzten `.env` geladen werden. Ein `SessionStart`-Hook teilt Claude mit, dass die Agenten verfügbar sind.

---

## Lizenz

MIT – kostenlose Nutzung, Vervielfältigung, Änderung und Verbreitung; bereitgestellt „wie besehen“, ohne Gewährleistung und ohne Haftung. Siehe [LICENSE](./LICENSE).

© 2026 Christian Avis (Vorcl).
