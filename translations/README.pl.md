<div align="center">

# Agent-Vorcl-Flow

**Zespół wyspecjalizowanych podagentów AI dla [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) i [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — wyposażony w umiejętności, polecenia i narzędzia MCP.**
Instaluje je jedno polecenie `npx`. Żadnego zdalnego backendu ani hostingu w chmurze: Twój agent kodujący obsługuje wszystko lokalnie.

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
[Português](./README.pt.md) · [Italiano](./README.it.md) · [**Polski**](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [Magyar](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 3321a7089b3f749787125626da692c98b8a2d556b237e1ba36bbf67afc34dc3d. -->

</div>

---

## What is this?

Agent-Vorcl-Flow zmienia obsługiwanego agenta kodującego w **ustrukturyzowany zespół inżynierów**. Zamiast jednego ogólnego asystenta otrzymujesz **25 wyspecjalizowanych podagentów** (architekt, główny architekt zorientowany na kod, backend, frontend, Expo inżynier mobilny, inżynier produktu i projektanta wizualnego, DB inżynier, audytor integralności międzyjęzykowej, kartograf architektury, operator liveboardu i nie tylko), każdy z własną domeną **umiejętności**, szybkimi **poleceniami ukośnikowymi** i **MCP narzędziami**, których potrzebuje. Każde nietrywialne zadanie przebiega przez zdyscyplinowaną **Task Master** pętlę — *cel → zadania → wdrożenie → weryfikacja → wykonane* — dzięki czemu praca jest planowana, śledzona i przetrwa wszelkie przerwy.

- 🧩 **25 podagentów**, 73 umiejętności, 155 poleceń ukośnikowych
- ⚡ **Instalacja jednym poleceniem** dla Claude Code, Codex, Cursor i/lub Kimi CLI — `npx`
- 🔌 **11 MCP serwerów** podłączonych przewodowo (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, system plików, Task Master, Mermaid)
- 🔑 **Jeden plik `.env` dla wszystkich środowisk wykonawczych** — klucze odczytywane są przez program uruchamiający, a nie `~/.zshrc`, więc działają nawet po uruchomieniu GUI/IDE; brak zdalnej usługi AVF; liveboard jest dostępny tylko na serwerze lokalnym i jest tymczasowy
- 🤝 **Działa na Claude Code, GPT Codex, Cursor i Kimi CLI** z tego samego źródła

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** i/lub **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Wybierz jedno środowisko wykonawcze za pomocą flagi:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Co robi instalator:

| Czas wykonania | Akcja |
| --- | --- |
| **Warstwa wspólna** | Kopiuje program uruchamiający do `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` i tworzy `~/.config/agent-vorcl-flow/.env` z szablonu (jednorazowo) — pojedynczy plik klucza dla każdego środowiska wykonawczego. |
| **Claude Code** | Rejestruje to repozytorium jako wtyczkę **marketplace** i włącza wtyczkę (przez `claude plugin …`, z bezpośrednim powrotem do `~/.claude/settings.json`). |
| **GPT Codex** | Łączy umiejętności w `~/.agents/skills`, a bloki `config.toml` + `AGENTS.md` w `~/.codex` (idempotentne, pomiędzy znacznikami). |
| **Cursor** | Instaluje umiejętności w `~/.cursor/skills`, natywnych niestandardowych subagentów w `~/.cursor/agents` i łączy brakujące serwery w `~/.cursor/mcp.json`. |
| **Kimi CLI** | Instaluje umiejętności w `~/.kimi/skills`, natywnego agenta niestandardowego Expo w `~/.kimi/agents`, architekturę Expo/UI podłącza się do `~/.kimi/config.toml` i łączy MCP serwery. |

> Instalator nigdy nie wprowadza Twoich sekretów — tworzy jedynie puste `.env` z szablonu. Dodajesz tam klucze (patrz [Configuration](#configuration-mcp--keys)).

### Update to the latest version

Uruchom instalator ponownie ze znacznikiem npm `latest`:

```bash
npx --yes agent-vorcl-flow@latest
```

Aby zaktualizować tylko jedno środowisko wykonawcze, zachowaj tę samą flagę środowiska wykonawczego, której użyłeś podczas instalacji:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

Aktualizacja nakłada zarządzane przez Agent-Vorcl-Flow umiejętności, agentów, haki, program uruchamiający i bloki konfiguracyjne. Utrzymuje istniejące `~/.config/agent-vorcl-flow/.env` i jego tajemnice bez zmian oraz zachowuje umiejętności wyższego szczebla Firecrawl. Uruchom ponownie zaktualizowanego klienta kodowania później (lub uruchom `/reload-plugins` w Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

Po instalacji **uruchom ponownie Claude Code** (lub uruchom `/reload-plugins` w otwartej sesji), aby załadować agentów.

---

## How to use

W przykładach w tej sekcji zastosowano składnię Claude Code; zobacz mapowania [Cursor](#cursor) i [GPT Codex](#gpt-codex) poniżej, aby zapoznać się z ich natywną składnią. W Claude Code istnieją **trzy sposoby** wezwania zespołu.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` ustala, który podagent powinien być właścicielem dzieła i kieruje pełnym cyklem Task Master. `/audit` automatycznie wykrywa backend, frontend, urządzenia mobilne, dane i infrastrukturę i pisze opartą na dowodach analizę, `PROJECT_AUDIT.md` wykorzystując wszystkie odpowiednie role. `/init-code` odczytuje repozytorium statycznie i tworzy oparte na dowodach `PROJECT_DESCRIPTION.md` bez wykonywania kodu projektu. Kiedy ten plik już istnieje, każda rola modyfikująca musi synchronizować swoje sekcje; sprawdzony opis dryfu blokuje wykonanie zadania.

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

Każdy agent ma także swój własny punkt wejścia, który uruchamia pętlę Task Master obejmującą tego agenta.

### The Task Master loop
Każde nietrywialne zadanie przechodzi przez **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```Dzięki temu praca jest zaplanowana, kontrolowana i możliwa do wznowienia — nic nie jest uznawane za „ukończone” bez przejścia etapu weryfikacji.

---

## The agents| Agent | Rola | Najważniejsze |
| --- | --- | --- |
| 🔵 **architekt** | Architekt systemów i rozwiązań | Analiza wymagań, projektowanie systemów/DB/API, recenzje architektury |
| 🏛️ **główny-architekt** | Główny architekt oprogramowania / infrastruktury / AI | Skanuje prawdziwy kod w 11 językach i tworzy poparte dowodami MD, JSON, HTML, PDF, Draw.io i Mermaid; aktualizacje pełnego ponownego skanowania zachowują adnotacje |
| 🟢 **backend** | Programista backendu | Węzeł/TS, Postgres, Redis; architektura modułowa; każda trasa w pełni ujęta w OpenAPI |
| 🟣 **frontend** | Frontend (React 19 / Next.js App Router) | Komponenty, stan, pobieranie danych, optymalizacja renderowania/pakowania, testy |
| 📱 **expo-mobile** | React Native + Expo inżynier | Architektura modułowa plus system projektowania/ruchu/interakcji, natywna nawigacja, tokeny, gesty, haptyka, zredukowany ruch |
| 🟠 **analizator** | Audytor kodu (tylko do odczytu) | Błędy, bezpieczeństwo typów, DB struktura, makiety frontendu, zapachy backendu |
| 🧭 **uczciwość** | Audytor integralności kodu w wielu językach (tylko do odczytu) | Wyciek twardego kodu produkcyjnego i próbnych/fałszywych/demo/urządzeń w interfejsie/backendzie/urządzeniu mobilnym/współdzielonym |
| 🟡 **przechwala** | pokrycie OpenAPI/Swagger (dowolny stos) | Znajduje trasy nie w pełni udokumentowane i obejmuje je wraz z weryfikacją |
| 🔴 **fajerwerk** | Badacz sieci | Na żywo CLI/MCP/REST, integracja aplikacji i gotowe przepływy pracy z danymi internetowymi |
| 🟤 **render** | Hosting i wdrażanie (renderowanie) | Wdrożenia, diagnostyka oparta na logach, metryki, zmienne środowiskowe, renderowanie Postgres |
| 🟦 **baza danych** | DB inżynier / DBA | Schemat, zapytania i plany, indeksy, N+1, bezpieczne migracje odwracalne, pamięć podręczna |
| ⚪ **odporność** | Niezawodność: błędy + rejestrowanie | spróbuj/złap na właściwych granicach, błędy wpisane, ponowne próby/przekroczenia limitu czasu, logi strukturalne |
| 🖼️ **zrzut ekranu** | Zrzut ekranu UI → kod | Zamienia zrzut ekranu UI w gotowy do produkcji, responsywny i dostępny kod |
| 🎨 **studio projektowe** | Studio projektowania produktowego i wizualnego | Lokalne HTML artefakty, prototypy, modele szkieletowe, talie/PPTX, dokumenty, animacje, 3D, systemy projektowe i import Figma/GitHub/HTML; zaadaptowane z MIT `JimLiu/baoyu-design` |
| 🔎 **badania wizualne** | Zrzut ekranu → zweryfikowana odpowiedź | Identyfikuje witrynę/stronę, znajduje oficjalne dokumenty, sprawdza aktualne dane i odpowiada za pomocą adresów URL i pewności |
| 🎯 **precyzyjny** | Zrzut ekranu → umieść w istniejącym projekcie (tylko do odczytu) | Opiera zrzut ekranu działającej aplikacji na prawdziwej bazie kodu — komponencie, `file:line`, trasie/stronie, dokładnej kontroli i logice; niczego nie tworzy, deleguje edycję |
| 📊 **rysunek** | Diagramy (draw.io / diagrams.net) | Schemat blokowy, BPMN, UML, ERD, sieć/chmura i PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archimapa** | Kartograf architektury | Kod deterministyczny → `architecture.json` (każdy węzeł z `source:{file,line}`) → interaktywna HTML mapa, Draw.io, Mermaid, ARCHITECTURE.md, PDF; fakty niepotwierdzone zaznaczono `inferred` |
| 🧜 **syrenka** | Mermaid diagramy (+ rzeczywisty render) | schemat blokowy, sekwencja, klasa, stan, ER, Gantta, gitGraph, mapa myśli…; zatwierdzone przez mcp-mermaid/`mmdc`; wręcza ci plik (`.mmd` + SVG/PNG/PDF) |
| 🧪 **testowanie** | Inżynier ds. testów i weryfikacji | Jednostka (Vitest/Jest), integracja (Supertest), E2E (Playwright), zasięg, polowanie na niestabilne testy; wykonuje `testStrategy` każdego zadania — nic nie jest „zrobione” bez zielonego uruchomienia |
| 🌿 **gitflow** | Git przepływ pracy i wydania | Konwencjonalne zatwierdzenia, zatwierdzenia po nazwie (nigdy `git add .`), PR, Keep-a-Changelog, wydania semver; push tylko z wyraźnym potwierdzeniem |
| 🛡️ **bezpieczeństwo** | Audytor bezpieczeństwa (tylko do odczytu) | Sekrety w historii drzewa i gita, OWASP Top 10, zależności CVE, PII; ustalenia stają się zadaniami — poprawki są delegowane || 📝 **dokumenty** | Inżynier dokumentacji | README (parzystość wielu języków), API dokumentacja z OpenAPI, ARCHITEKTURA, WKŁAD, informacje o wydaniu; każdy przykład zweryfikowany z kodem |
| 🐳 **devops** | Pojemniki i CI/CD | Wieloetapowe pliki Dockerfile, tworzenie dokerów dla lokalnych programistów, GitHub Potoki akcji, higiena środowiska/tajemnic, monitorowanie |
| 📡 **liveboard** | Lokalna tablica operacyjna | Żywe Git drzewa robocze, procesy agentów i Task Master zadania na efemerycznym panelu lokalnego hosta |

**Kilka rzeczy, które warto wiedzieć:**
- **Frontend zawsze rozmawia z prawdziwym API.** Specyfikacja backendu OpenAPI jest jedynym źródłem prawdy; z niego generowane są typy (`openapi-typescript` + `openapi-fetch`). Żadnych drwin na ścieżce produkcyjnej.
- **`database` mutacje wymagają wyraźnego potwierdzenia.** Analizy są tylko do odczytu; zmiany schematu/danych (DDL/DML/migracje) nigdy nie działają bez Twojej zgody.
- **`resilience` dostarczany jest z haczykiem zabezpieczającym.** Nieblokujący haczyk `PostToolUse` (`catch-guard.js`) delikatnie oznacza puste bloki `catch {}` w właśnie edytowanych plikach.
- **`archmap` nigdy nie czerpie z wyobraźni.** Ekstrakcja i renderowanie są ściśle oddzielone: ​​skrypty o zerowej zależności przenoszą repo do `architecture.json` (bazy danych z rzeczywistą licznością FK, API trasy, agenci AI z ich modelami/narzędziami/pamięcią, wykres importu, env), a każdy diagram jest renderowany tylko na podstawie tego JSON. Wszystko, co LLM doda bez sprawdzalnego `file:line`, jest oznaczane siłą `inferred:true` i rysowane przerywaną linią.
- **`principal-architect` to przepływ pracy związany z publikacją pełnej architektury.** Działa w dowolnym repozytorium uruchamiającym agenta, ignoruje roszczenia Markdown jako dowód topologii, korzysta z dołączonego modułu Tree-sitter WASM dla TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin i Swift, najpierw pisze `ARCHITECTURE.md`, następnie tworzy współdzielony model JSON, samodzielny HTML, PDF, natywny Draw.io i kopiowalne Mermaid L0–L4. `update` wykonuje pełne ponowne skanowanie i zachowuje adnotacje oraz niezarządzane pliki.
- **`pinpoint` znajduje, nigdy nie tworzy.** Biorąc pod uwagę zrzut ekranu działającej aplikacji, odwzorowuje ekran na prawdziwy kod — komponent, trasę, dokładną kontrolę i logikę stojącą za nim — i przekazuje edycję `frontend`/`backend`. Działa na tym, co już istnieje (odwrotność `screenshot`).
- **`visual-research` weryfikuje zamiast zgadywać.** Traktuje zrzut ekranu jako dowód, potwierdza oficjalną domenę i dokumenty, sprawdza aktualne dane witryny i oznacza możliwe próby wyłudzenia informacji lub nieaktualne wartości.
- **`i18n` wymusza „kodowanie języka zerowego”.** Agenci najpierw wykrywają, czy projekt jest wielojęzyczny i dostosowują się — ciągi znaków widoczne dla użytkownika przechodzą przez warstwę tłumaczenia (next-intl / reagują-i18next / i18next), nigdy bezpośrednio.

---

## Command referenceKażde poniższe polecenie jest poleceniem ukośnika. `<…>` oznacza wprowadzone dane.

### `/vorcl` — universal router
| Polecenie | Co to robi |
| --- | --- |
| `/vorcl <goal>` | Zamienia dowolny cel w zadania i kieruje go do odpowiedniego podagenta, a następnie uruchamia pełny cykl do wykonania. |
| `/audit [path] [focus]` | Głęboki audyt wielozadaniowy tylko do odczytu → wykryte systemy, ustalenia dotyczące bezpieczeństwa/CVE/odporności, architektura docelowa i etapowe `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | Odkrywanie statycznej bazy kodu → oparte na dowodach `PROJECT_DESCRIPTION.md`; kod projektu nigdy nie jest wykonywany. |

### 🔵 architect — architecture
| Polecenie | Co to robi |
| --- | --- |
| `/architect:vorcl <goal>` | Cel → zadania → cykl w ujęciu architektonicznym. |
| `/architect:analyze <context>` | Przeanalizuj wymagania i kontekst zadania. |
| `/architect:design <problem>` | Zaprojektuj architekturę rozwiązania (system, DB, API). |
| `/architect:review <target>` | Przejrzyj istniejącą architekturę. |

### 🏛️ principal-architect — code-grounded architecture package
| Polecenie | Co to robi |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Przeprowadza duży cel architektury przez Task Master i zweryfikowane artefakty. |
| `/principal-architect:create [options]` | Skanuje bieżące repozytorium i tworzy MD, JSON, HTML, PDF, Draw.io i Mermaid na podstawie dowodów kodu. |
| `/principal-architect:update [options]` | Pełne ponowne skanowanie istniejącego pakietu, zapisanie różnicy dowodów i atomowe odświeżanie wygenerowanych artefaktów. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Polecenie | Co to robi |
| --- | --- |
| `/backend:vorcl <goal>` | Cel → zadania → cykl pracy backendowej. |
| `/backend:create-api <endpoint>` | Wygeneruj punkt końcowy API w architekturze modułowej, w pełni objęty OpenAPI. |
| `/backend:refactor <target>` | Refaktoryzuj kod bez zmiany zachowania. |
| `/backend:optimize <target>` | Optymalizacja wydajności. |
| `/backend:test <target>` | Wygeneruj testy dla kodu. |

### 🟣 frontend — React / Next.js
| Polecenie | Co to robi |
| --- | --- |
| `/frontend:vorcl <goal>` | Cel → zadania → cykl pracy frontendowej. |
| `/frontend:create-component <spec>` | Wygeneruj komponent UI zgodnie ze strukturą cech. |
| `/frontend:refactor <target>` | Refaktoryzuj UI / hooki bez zmiany zachowania. |
| `/frontend:optimize <target>` | Zoptymalizuj renderowanie/pakiet/podstawowe wskaźniki internetowe. |
| `/frontend:test <target>` | Generuj testy komponentowe. |

### 📱 expo-mobile — React Native / Expo

| Polecenie | Co to robi |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Cel → Task Master cykl na Expo pracę mobilną. |
| `/expo-mobile:create-module <domain>` | Utwórz modułowy segment biznesowy zawierający tylko te warstwy, których wymaga jego złożoność. |
| `/expo-mobile:create-screen <flow>` | Utwórz cienką trasę Expo Router oraz ekran i stany należące do modułu. |
| `/expo-mobile:design-screen <flow>` | Zbuduj ekran premium ze wspólnymi tokenami projektu/ruchu, stanami i dostępnością. |
| `/expo-mobile:motion <interaction>` | Projektuj natywną nawigację, sprężyny, gesty, elementy dotykowe i awarie o ograniczonym ruchu. |
| `/expo-mobile:add-api <contract>` | Dodaj klucze schematu/DTO/mappera/zapytania i integrację TanStack Query. |
| `/expo-mobile:audit [scope]` | Ochrona architektury tylko do odczytu i audyt oparty na dowodach. |
| `/expo-mobile:ui-audit [scope]` | Projektowanie tylko do odczytu, audyt ruchu, interakcji, dostępności i wydajności. |
| `/expo-mobile:compatibility [app] [change]` | Audyt na żywo kompatybilności tylko do odczytu Expo/RN/Node/package/native-runtime z wersjami oficjalnych źródeł. |
| `/expo-mobile:test <scope>` | Uruchom jednostkę domeny, React Native Bibliotekę testową i Maestro sprawdź. |

### 🟠 analyzer — code audit (read-only)
| Polecenie | Co to robi |
| --- | --- |
| `/analyzer:vorcl <goal>` | Kontroluj cel za pomocą Task Master — ustalenia stają się zadaniami. |
| `/analyzer:audit` | Pełny audyt: błędy, typy, DB, makiety frontendu, zapachy backendu. |
| `/analyzer:bugs` | Poluj na błędy — nieobsługiwane błędy, warunki wyścigu, przypadki Edge. |
| `/analyzer:types` | Kontrola typu — `tsc`, `any`, niebezpieczne rzuty, dryf typów zod↔. |
| `/analyzer:db` | Struktura audytu — schemat, indeksy, FK, N+1, migracje. |
| `/analyzer:mocks` | Ścieżka zgodności dla fałszywych/fałszywych danych na interfejsie i zapleczu; deleguje głębokie kontrole poligloty na rzecz uczciwości. |
| `/analyzer:backend` | Znajdź „zły” kod backendu — naruszenia architektury, logika w kontrolerach. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)| Polecenie | Co to robi |
| --- | --- |
| `/integrity:vorcl <goal>` | Realizuje nietrywialny cel dotyczący integralności poprzez Task Master i przekształca ustalenia w zadania specyficzne dla właściciela. |
| `/integrity:audit [path]` | Skanuje jednocześnie kod twardy i próbny wyciek, a następnie sprawdza dostępność produkcyjną. |
| `/integrity:hardcode [path]` | Znajduje literały użytkownika/config/biznesowe, które pomijają lokalizację, konfigurację lub system rekordów. |
| `/integrity:mocks [path]` | Znajduje fałszywe frameworki, fałszywe generatory, urządzenia, dane demonstracyjne i odpowiedzi statyczne dostępne z poziomu produkcyjnego. |

Dołączony skaner o zerowej zależności obsługuje TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML i Razor. W kodzie zaplecza flaguje także wartości biznesowe ukryte w stałych, polach statycznych/końcowych, parametrach domyślnych, nazwanych argumentach i katalogach statycznych; audytor następnie porównuje je ze schematami/modelami/repozytoriami/zapytaniami/mutacjami administratora, aby udowodnić, że baza danych – a nie kod czy konfiguracja – jest właścicielem wartości. Testy, wyposażenie, historie, przykłady, nasiona, wygenerowany kod i katalogi główne dostawców są domyślnie pomijane; kandydaci leksykalni nie są defektami, dopóki nie zostanie udowodniona osiągalność i własność.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Polecenie | Co to robi |
| --- | --- |
| `/swagger:vorcl <goal>` | Cel pełnego pokrycia poprzez Task Master — audyt → zadania → okładka → weryfikacja. |
| `/swagger:audit` | Tylko do odczytu: znajdź trasy nie w pełni objęte specyfikacją. |
| `/swagger:cover <route>` | Obejmuje trasę/moduł — parametry, odpowiedzi, opisy, bezpieczeństwo + weryfikacja. |

### 🔴 firecrawl — web research
| Polecenie | Co to robi |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Cel badawczy poprzez Task Master — zbieranie danych internetowych do gotowego wyniku. |
| `/firecrawl:search <query>` | Wyszukiwanie w Internecie źródeł na temat danego pytania. |
| `/firecrawl:scrape <url>` | Zeskrob jeden adres URL do Markdown/JSON. |
| `/firecrawl:map <url>` | Mapuj adresy URL witryny. |
| `/firecrawl:crawl <url>` | Rekurencyjne indeksowanie sekcji/witryny. |
| `/firecrawl:extract <url>` | Ekstrakcja strukturalna według schematu JSON. |
| `/firecrawl:setup` | Zainstaluj/zweryfikuj CLI oraz oficjalne umiejętności kompilacji i przepływu pracy (z potwierdzeniem). |
| `/firecrawl:interact <url>` | Kliknij, nawiguj lub wypełniaj formularze, gdy skrobanie nie jest wystarczające. |
| `/firecrawl:parse <file>` | Przeanalizuj dokument lokalny/prywatny w przecenie lub JSON. |
| `/firecrawl:monitor <action>` | Lista kontroli lub zarządzanie powtarzającymi się monitorami zmian stron. |
| `/firecrawl:agent <goal>` | Uruchom ograniczone, długotrwałe zadanie agenta. |
| `/firecrawl:research <query>` | Wyszukaj artykuły i GitHub kontekst badawczy. |
| `/firecrawl:ask <jobId>` | Zdiagnozuj nieudane Firecrawl zadanie. |
| `/firecrawl:docs-search <question>` | Przeszukaj aktualną oficjalną dokumentację Firecrawl. |
| `/firecrawl:integrate <feature>` | Dodaj Firecrawl do kodu aplikacji, korzystając z umiejętności tworzenia wcześniejszych wersji. |
| `/firecrawl:deliverable <artifact>` | Stwórz brief, audyt, listę potencjalnych klientów lub inny artefakt przepływu pracy. |`/firecrawl:setup` uruchamia `firecrawl-cli init --all` oficjalny przepływ dopiero po potwierdzeniu. Istniejące `firecrawl-*` oficjalne umiejętności mają pierwszeństwo i są zachowywane przez instalatora Codex/Cursor; AVF zapewnia kompatybilne rozwiązania zastępcze dla brakujących umiejętności. Operacje na żywo kierują się przez CLI → MCP → REST/bezkluczykowy.

### 🟤 render — hosting / deploy (Render)
| Polecenie | Co to robi |
| --- | --- |
| `/render:vorcl <goal>` | Cel Infra przez Task Master — wdrożenie/diagnostyka/skonfigurowanie, aby gotowe. |
| `/render:deploy <service>` | Wdróż/ponownie wdróż usługę. |
| `/render:logs <service>` | Dzienniki serwisowe i diagnostyka aż do pierwotnej przyczyny. |
| `/render:status <service>` | Stan usługi + wdrożenie + metryki. |
| `/render:query <sql>` | SQL tylko do odczytu względem Render Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Polecenie | Co to robi |
| --- | --- |
| `/database:vorcl <goal>` | Cel danych przez Task Master — schemat/zapytania/migracje/pamięć podręczna do zrobienia. |
| `/database:query <query>` | Zapytanie/analiza tylko do odczytu. |
| `/database:schema <target>` | Zaprojektuj/przejrzyj schemat i integralność danych. |
| `/database:migrate <change>` | Zaplanuj bezpieczną, odwracalną migrację schematu/danych. |
| `/database:optimize <target>` | Optymalizuj — indeksy, N+1, plany zapytań, paginacja. |
| `/database:cache <target>` | Redis — TTL, unieważnienie, blokady, ograniczenie szybkości, strumienie. |

### ⚪ resilience — error handling + logging
| Polecenie | Co to robi |
| --- | --- |
| `/resilience:vorcl <goal>` | Cel niezawodności poprzez Task Master — kod osłony z try/catch + dzienniki. |
| `/resilience:harden <target>` | Zawiń kod w try/catch/finally z solidnym rejestrowaniem, bez cichych błędów. |
| `/resilience:logging <target>` | Dodaj/napraw logowanie strukturalne — poziomy, kontekst, brak sekretów/PII. |
| `/resilience:audit` | Tylko do odczytu: znajdź ciche awarie, puste połowy, luki w rejestrowaniu. |

### 🖼️ screenshot — screenshot UI → code
| Polecenie | Co to robi |
| --- | --- |
| `/screenshot:vorcl <goal>` | Zestaw screenów ze zrzutów ekranu poprzez Task Master — podział → kod. |
| `/screenshot:analyze <image>` | Podział tylko do odczytu — układ, komponenty, tokeny, stany → plan. |
| `/screenshot:convert <image> [framework]` | Wygeneruj pełny, możliwy do uruchomienia kod ze zrzutu ekranu (domyślnie React + Tailwind v4). |
| `/screenshot:tokens <image>` | Wyodrębnij żetony projektu (kolory OKLCH, typografia, odstępy) do Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Spraw, aby wygenerowany UI był responsywny — punkty przerwania, płyn, `clamp()`, zapytania dotyczące kontenerów. |

### 🎨 design-studio — product and visual design
| Polecenie | Co to robi |
| --- | --- |
| `/design-studio:vorcl <goal>` | Pełny cel projektowy poprzez Task Master — kontekst → warianty → HTML → podgląd → weryfikacja → eksport. |
| `/design-studio:create <brief>` | Stwórz dopracowany, samodzielny artefakt wizualny lub sprzęt hi-fi UI. |
| `/design-studio:prototype <flow>` | Zbuduj interaktywny prototyp internetowy/mobilny ze stanami i przejściami. |
| `/design-studio:wireframe <flow>` | Zbuduj model szkieletowy low-fi skupiony na architekturze informacji i UX. |
| `/design-studio:design-system <operation>` | Twórz, importuj, kompiluj, wiąż, odświeżaj lub sprawdzaj system projektowy. |
| `/design-studio:import <type> <source>` | Importuj Figmę `.fig`, GitHub lub HTML/CSS z pochodzeniem. |
| `/design-studio:deck <brief>` | Zbuduj talię HTML z notatkami prelegenta, animacjami i opcjonalnym edytowalnym PPTX. |
| `/design-studio:document <brief>` | Utwórz dokument, życiorys, notatkę, jednostronicowy raport lub gotowy do druku dokument. |
| `/design-studio:animation <brief>` | Zbuduj artefakt ruchu i opcjonalnie wyrenderuj go do formatu MP4. |
| `/design-studio:research <question>` | Utwórz wizualny artefakt badawczy oparty na źródle. |
| `/design-studio:export <project> <format>` | Eksportuj do samodzielnego formatu HTML, PDF, PPTX, MP4 lub do formatu przekazania. |
| `/design-studio:review <target>` | Przegląd wizualny, UX, responsywny, a11y i system projektowania tylko do odczytu. |

### 🔎 visual-research — screenshot → verified web answer
| Polecenie | Co to robi |
| --- | --- |
| `/visual-research:vorcl <goal>` | Wieloetapowe badanie zrzutów ekranu w Task Master. |
| `/visual-research:identify <image>` | Zidentyfikuj witrynę, stronę i funkcję na podstawie wiarygodnych dowodów. |
| `/visual-research:search <image> <target>` | Znajdź prawdziwą stronę lub oficjalną dokumentację na podstawie wskazówek wizualnych. |
| `/visual-research:answer <image> <question>` | Odpowiedz, korzystając ze zrzutów ekranu, oficjalnych dokumentów i aktualnych danych. |
| `/visual-research:hints <image> <goal>` | Podaj bezpieczne, poparte dokumentacją kroki dotyczące widocznego interfejsu. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Polecenie | Co to robi |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Znajdź/zrozum/zmień istniejące UI na zrzucie ekranu za pomocą Task Master — mapa → zadania → deleguj. |
| `/pinpoint:locate <image>` | Znajdź istniejące komponenty/pliki na zrzucie ekranu — `file:line`, bez nowego kodu. |
| `/pinpoint:route <image>` | Zidentyfikuj trasę/stronę, na której znajduje się ekran (Next.js Router aplikacji/stron, React Router). |
| `/pinpoint:control <image>` | Wskaż dokładną kontrolkę (przycisk/pole) i jej procedurę obsługi w kodzie. |
| `/pinpoint:trace <target>` | Prześledź logikę elementu — procedura obsługi → stan → pobieranie danych → API. || `/pinpoint:handoff <change>` | Zbuduj precyzyjne żądanie edycji w oparciu o istniejący kod i deleguj do `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Polecenie | Co to robi |
| --- | --- |
| `/drawio:vorcl <goal>` | Zestaw diagramów za pośrednictwem Task Master — gotowy do użycia. |
| `/drawio:create <description> [type]` | Zbuduj diagram na podstawie opisu tekstowego (prawidłowy natywny kod XML). |
| `/drawio:pmp <type> <project>` | Zbuduj diagram PMP/PMBOK — WBS, PERT/CPM, Gantta, RACI, macierz ryzyka, siatka interesariuszy. |
| `/drawio:convert <source> [type]` | Konwertuj źródło na diagram — DB schemat → ERD, foldery → drzewo, kod → UML, syrenka/CSV/JSON. |
| `/drawio:refine <file>` | Udoskonal istniejący `.drawio` — układ, motyw, dodaj/usuń węzły, wyrównaj do siatki. |

### 🗺️ archmap — architecture map from code| Polecenie | Co to robi |
| --- | --- |
| `/archmap:vorcl <goal>` | Cel mapowania za pomocą Task Master — zbuduj na zweryfikowanym zestawie artefaktów. |
| `/archmap:map [repo]` | Pełny potok: ekstrakcja → `architecture.json` → adnotacja LLM → wszystkie formaty (HTML, Draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Tylko ekstrakcja — `architecture.json` do odczytu maszynowego z `source:{file,line}` w każdym węźle. |
| `/archmap:annotate [json]` | Wzbogacenie LLM istniejącego `architecture.json` (pamięć agenta, semantyka przepływu danych); niepotwierdzone fakty zostały automatycznie zdegradowane do `inferred`. |
| `/archmap:html [json]` | Interaktywna, samodzielna mapa HTML — przełączanie warstw, wiązki śledzenia, węzeł → panel `file:line`, wyszukiwanie, drukowanie CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | Draw.io (wielostronicowe: Przegląd / ERD / API / Agenci) i/lub Mermaid widoki, sprawdzone. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Polecenie | Co to robi |
| --- | --- |
| `/mermaid:vorcl <goal>` | Zestaw diagramów za pośrednictwem Task Master — kompilacja do wykonania (zweryfikowana przez renderowanie). |
| `/mermaid:create <description> [type]` | Zbuduj diagram na podstawie opisu — poprawna składnia, zweryfikowana przez rzeczywisty render; wręcza ci plik. |
| `/mermaid:convert <source> [type]` | Konwertuj źródło na Mermaid — DB schemat → ER, kod → klasa/sekwencja, foldery → schemat blokowy, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Składnia + prawdziwy test renderowania; znajdź i napraw błędy (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Eksportuj do SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Udoskonal istniejący `.mmd` — kierunek, podgraf, classDef/style, czytelność. |

### 🧪 testing — tests & verification
| Polecenie | Co to robi |
| --- | --- |
| `/testing:vorcl <goal>` | Cel testowania/weryfikacji poprzez Task Master — jednostka + integracja + e2e do zrobienia. |
| `/testing:unit <file\|module>` | Testy jednostkowe (Vitest/Jest) — szczęśliwa ścieżka, granice, błędy; uruchamia je i wyświetla wynik. |
| `/testing:integration <endpoint\|module>` | Testy integracyjne (Supertest/inject, real DB lub kontenery testowe). |
| `/testing:e2e <scenario>` | Playwright E2E dla krytycznej ścieżki użytkownika — selektory ról, urządzenia, śledzenie w przypadku awarii. |
| `/testing:verify <task\|testStrategy>` | Wykonuje zadanie `testStrategy` i zwraca werdykt GOTOWY/NIE GOTOWY z rzeczywistym wyjściem. |
| `/testing:coverage [path]` | Raport zasięgu z ustaleniami — jaki kluczowy kod nie został przetestowany; tworzy zadania. |
| `/testing:flaky <test>` | Diagnozuje niestabilny test (wyścig, czas, stan współdzielony, kpiny) i naprawia go na dobre. |

### 🌿 gitflow — git workflow & releases
| Polecenie | Co to robi |
| --- | --- |
| `/gitflow:vorcl <goal>` | Cel git/release poprzez Task Master (przygotowanie wydania, oczyszczenie historii, gałąź funkcji). |
| `/gitflow:commit <files\|scope>` | Zatwierdzenie po nazwie (nigdy `git add .`) z komunikatem o zatwierdzeniu konwencjonalnym; zatrzymuje się na nieznanym WIP. |
| `/gitflow:pr <base> <title>` | Oddział → zatwierdza → żądanie ściągnięcia (gh / GitHub MCP) z zweryfikowaniem, co/dlaczego/jak. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Prowadź dziennik zmian) generowany na podstawie zatwierdzeń pomiędzy tagami. |
| `/gitflow:release <version\|auto>` | Semver z zatwierdzeń → wersje manifestu synchronizacji → tag → wydanie GitHub. Push tylko po wyraźnym potwierdzeniu. |
| `/gitflow:audit [branch]` | Kontrola historii tylko do odczytu: naruszenia konwencji, zatwierdzenia zrzutu, duże obiekty blob, gałęzie osierocone. |

### 🛡️ security — security audit (read-only)
| Polecenie | Co to robi |
| --- | --- |
| `/security:vorcl <goal>` | Cel bezpieczeństwa poprzez Task Master — audyt → ustalenia → zadania → delegowane poprawki. |
| `/security:secrets [path\|branch]` | Sekrety w drzewie roboczym ORAZ historia git (wszystkie gałęzie); `${VAR:-}` symbole zastępcze nie są tajemnicą. |
| `/security:owasp [path]` | OWASP Top 10 w kodzie: wtryski, XSS, autoryzacja, ekspozycja danych, CORS/cookies — z dowodem file:line. |
| `/security:deps` | Zależność CVE poprzez npm pliki audytu/blokady — ważność, flagi zmian naruszających. |
| `/security:pii [path]` | Ryzyko PII/RODO: e-maile, telefony, karty w kodzie i dzienniki; prywatne ścieżki dewelopera. |
| `/security:pre-push [branch]` | Szybka łączona kontrola zmienionych plików przed wypchnięciem: sekrety + zastrzyki + PII; werdykt zielony/czerwony. |

### 📝 docs — documentation
| Polecenie | Co to robi |
| --- | --- |
| `/docs:vorcl <goal>` | Cel dokumentacyjny poprzez Task Master. |
| `/docs:readme [path]` | Utwórz/zaktualizuj plik README — what/quickstart/usage/config/troubleshooting; zweryfikowane przykłady; wersje językowe zsynchronizowane. |
| `/docs:api [spec]` | API dokumenty wygenerowane na podstawie specyfikacji OpenAPI (punkty końcowe, parametry, przykłady zwijania); sugeruje `/swagger:audit`, jeśli nie ma specyfikacji. |
| `/docs:architecture` | ARCHITECTURE.md — moduły, granice, przepływ danych; diagramy delegowane do `mermaid`/`drawio`. || `/docs:contributing` | CONTRIBUTING.md — konfiguracja, struktura, testy, konwencje zatwierdzania (zgodne z `gitflow`), proces PR. |
| `/docs:release-notes <version>` | Informacje o wydaniu dla wersji z CHANGELOG/history. |
| `/docs:audit` | Dokumenty tylko do odczytu↔sprawdzanie dryfu kodu: uszkodzone linki, nieaktualne przykłady/liczniki, niezsynchronizowane tłumaczenia. |

### 🐳 devops — containers & CI/CD
| Polecenie | Co to robi |
| --- | --- |
| `/devops:vorcl <goal>` | Cel infrastrukturalny poprzez Task Master. |
| `/devops:dockerfile [app-type]` | Napisz/przejrzyj plik Dockerfile — wieloetapowy, smukły, bez uprawnień roota, HEALTHCHECK; zweryfikowane przez prawdziwe `docker build`. |
| `/devops:compose` | docker-compose.yml dla lokalnego programisty (aplikacja + bazy danych); zmiany env wymagają `--force-recreate`, czekają na zdrowe. |
| `/devops:ci [type]` | GitHub Akcje — przepływ pracy PR (lint+kontrola typu+test, npm pamięć podręczna), wdrażanie przepływu pracy, minimalne uprawnienia. |
| `/devops:env` | Zapasy zmiennej Env: gdzie czytane, co jest wymagane, `.env.example` szablon; tajemnice, których nigdy nie ma na obrazach. |
| `/devops:monitoring` | Ustrukturyzowane dzienniki (pino/JSON), punkt końcowy kondycji, o czym należy ostrzegać; Renderuj metryki za pośrednictwem agenta `render`. |

### 📡 liveboard — ephemeral local operations board
| Polecenie | Co to robi |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Uruchom dopracowany 43-języczny pulpit nawigacyjny na bezpłatnym porcie localhost; Task Master zmienia strumień przez SSE i uzgadnia co 5 minut. |
| `/liveboard:vorcl <goal>` | Opracuj lub zmień sam liveboard poprzez wymagany Task Master przepływ pracy. |

Liveboard odczytuje Git drzewa robocze, lokalne procesy Claude/Codex/Cursor i `.taskmaster/tasks/tasks.json` każdego drzewa roboczego. Stan środowiska wykonawczego pozostaje w pamięci i znika po zatrzymaniu procesu na pierwszym planie. UI wykrywa język przeglądarki i oferuje 43 ustawienia regionalne, w tym angielski, rosyjski, ukraiński, niemiecki, francuski, hiszpański, portugalski, włoski, polski, turecki, chiński, japoński, arabski, holenderski, czeski, słowacki, rumuński, węgierski, bułgarski, serbski, chorwacki, słoweński, grecki, hebrajski, perski, hindi, bengalski, urdu, indonezyjski, malajski, wietnamski, tajski, koreański, szwedzki, norweski, duński, fiński, estoński, łotewski, litewski, Gruzin, Ormianin i Azerbejdżan. W językach arabskim, hebrajskim, perskim i urdu używany jest układ RTL.

Konfiguracja bezpośrednia:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: projekt, którego Git drzewa robocze i Task Master pliki są skanowane.
- `--port 0`: automatycznie wybiera wolny port.
- `--interval`: interwał pełnego uzgodnienia w milisekundach; oglądanie plików w strumieniach Task Master zmienia się natychmiast.
- Punkty końcowe: `/health`, `/api/snapshot`, `/api/events` (SSE) i `POST /api/refresh`.
- Zachowaj `--host 127.0.0.1`, chyba że wyraźnie zamierzasz udostępniać informacje o projekcie w sieci.

---

## Configuration (MCP & keys)

Pakiet nie zawiera **nie zdalnego backendu ani bazy danych**. Opcjonalny liveboard to proces w pamięci dostępny tylko dla hosta lokalnego. MCP serwery potrzebują tokenów i **każdy użytkownik zapewnia własne**. Aby to działało identycznie na **Claude Code, Codex, Cursor i Kimi CLI** — niezależnie od tego, czy uruchamiasz z terminala, czy z Docka/Spotlight/IDE — każdy serwer stdio MCP jest uruchamiany za pomocą małego programu uruchamiającego (`bin/mcp-env.mjs`), który odczytuje klucze z **jednego pliku**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

Instalator tworzy go z [`.env.example`](../.env.example). Otwórz go i wpisz tylko te klucze, których używasz:

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

> **Dlaczego program uruchamiający zamiast `~/.zshrc`?** Rozszerzanie Env-var różni się w zależności od czasu wykonania (`${VAR:-}` w Claude, `${env:VAR}` w Cursor, literały w Codex/Kimi) i każde środowisko wykonawcze odczytuje tylko środowisko, w którym** zostało uruchomione**. GUI/IDE uruchamiane na macOS nie pobiera `~/.zshrc`, więc wyeksportowane klucze są niewidoczne, a serwery nie łączą się z niczym — klasyczny „MCP env nie ustawiono” awaria. Odczyt jednego pliku `.env` eliminuje oba problemy jednocześnie.

**Pierwsze** (później wygrywa): udostępnione `~/.config/agent-vorcl-flow/.env` → `./.env` w katalogu głównym projektu → prawdziwe `export` w Twojej powłoce. Zachowaj klucze globalne w udostępnionym pliku, zastąp każdy projekt (np. inny `MONGODB_URI`) projektem `.env`, a prawdziwy eksport powłoki nadal będzie zwycięski dla CLI przebiegów. Możesz wskazać program uruchamiający na inny plik za pomocą `AGENT_VORCL_ENV_FILE=/path/.env`.Serwer, któremu brakuje wymaganego klucza, po prostu **nie uruchamia się** — w dzienniku MCP środowiska wykonawczego zobaczysz jednowierszowe `[agent-vorcl-flow] MCP «…» is not configured: …`, a każdy inny serwer będzie nadal działał. Dodaj klucz do `.env` i uruchom ponownie. (Możesz zachować nazwy `GITHUB_TOKEN`/`MONGODB_URI` — program uruchamiający mapuje je na nazwy `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` oczekiwane przez serwery.)

> ⚠️ **Wymagane w przypadku poleceń Task Master opartych na sztucznej inteligencji:** skonfiguruj co najmniej jednego wybranego dostawcę — `ANTHROPIC_API_KEY` dla Claude, `OPENAI_API_KEY` dla GPT lub Codex CLI OAuth. Bez poświadczeń dla modelu wybranego w `.taskmaster/config.json`, `/vorcl` nie może generować ani rozszerzać zadań.

Wybierz, który Task Master dostawca faktycznie obsługuje generowanie; same klawisze nie wybierają modelu:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

Polecenie korzysta z oficjalnego przepływu `task-master models` i przechowuje tylko wybrane modele w `.taskmaster/config.json`. `PERPLEXITY_API_KEY` jest opcjonalne i potrzebne tylko wtedy, gdy jako model badawczy wybrano Perplexity.

Zdalne serwery **vercel** i **render** korzystają z OAuth (autoryzuj za pomocą `/mcp` w przeglądarce). W przypadku renderowania w trybie headless/CI ustaw `RENDER_API_KEY` w swoim środowisku i dodaj wpis nagłówka Bearer do tego serwera dla swojego środowiska wykonawczego.

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

Repozytorium zawiera teraz natywny manifest wtyczki Codex w wersji `.codex-plugin/plugin.json`. Instalator npm pozostaje dostępny i instaluje te same możliwości, co **umiejętności**, **profile** i router `AGENTS.md` dla Codex CLI, Cursor i Kimi:

| Claude Code | Codex odpowiednik |
| --- | --- |
| subagent `@agent-vorcl-flow:frontend` | osobowość umiejętności `$frontend` + `codex --profile frontend` |
| polecenie `/analyzer:audit` | umiejętność zadaniowa `$analyzer-audit` |
| polecenie `/vorcl` | umiejętność wykonywania zadań `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` w `config.toml` |
| `SessionStart` hak | routing ról w `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

Pełne mapowanie można znaleźć na [`codex/README.md`](../codex/README.md).

---

## Cursor

Cursor korzysta z tego samego otwartego formatu `SKILL.md` co adapter Codex, a także natywnych, niestandardowych subagentów i globalnej konfiguracji MCP:

| Agent-Vorcl-Flow koncepcja | Cursor odpowiednik |
| --- | --- |
| rola `backend` | niestandardowy subagent `/avf-backend` w `~/.cursor/agents` |
| polecenie zadania `/backend:create-api` | umiejętność `/backend-create-api` |
| uniwersalny `/vorcl` | umiejętność `/vorcl` |
| `.mcp.json` | połączone serwery w `~/.cursor/mcp.json` |

Instalator konwertuje definicje ról na Cursor frontmatter, poprzedza podagentów `avf-`, aby uniknąć kolizji nazw umiejętności, używa `model: inherit` i oznacza agentów przeznaczonych wyłącznie do audytu jako `readonly: true`. Istniejące wpisy serwera MCP o tych samych nazwach zostaną zachowane. Zobacz [`cursor/README.md`](../cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) natywnie ładuje umiejętności agenta, niestandardowe pliki agentów i haki cyklu życia; AVF łączy również te same serwery MCP, z których korzystają Claude i Cursor:

| Agent-Vorcl-Flow koncepcja | Kimi CLI odpowiednik |
| --- | --- |
| umiejętności / polecenia zadań | `~/.kimi/skills` i `/skill:<name>` |
| Expo agent celny | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUżyj osłony | połączone w `~/.kimi/config.toml` |
| `.mcp.json` | połączone serwery w `~/.kimi/mcp.json` |
| plik klucza czasu wykonania | udostępniony `~/.config/agent-vorcl-flow/.env` (przez program uruchamiający) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI nie ma rozwinięcia `${VAR}` w `mcp.json`, więc klucze pochodzą ze wspólnego `.env` poprzez program uruchamiający — dokładnie tak samo jak inne środowiska wykonawcze. Zobacz [`kimi/README.md`](../kimi/README.md).

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

**Jak to do siebie pasuje:** `agents/*.md` zadeklaruj rolę i na wstępie `skills:` dołącz umiejętności → umiejętności w `skills/*/SKILL.md` są ładowane automatycznie według opisu → `commands/<agent>/*.md` zapewniają szybkie `/agent:command` skróty, które przekazują subagentowi → `.mcp.json` daje agentom narzędzia, każde uruchamiane przez `bin/mcp-env.mjs`, które ładuje sekrety ze wspólnego `.env`. Haczyk `SessionStart` informuje Claude, że agenci są dostępni.

---

## License

MIT — bezpłatne używanie, kopiowanie, modyfikowanie i rozpowszechnianie; dostarczane „tak jak jest”, bez gwarancji i odpowiedzialności. Zobacz [LICENSE](../LICENSE).

© 2026 Christian Avis (Vorcl).
