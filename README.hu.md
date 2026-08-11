<div align="center">

# Agent-Vorcl-Flow

**Speciális mesterséges intelligencia-alügynökök csapata [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/) és [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) számára – készségekkel, parancsokkal és MCP eszközökkel.**
Egy `npx` parancs telepíti őket. Nincs távoli háttérrendszer vagy felhőtárhely: a kódoló ügynök mindent helyben futtat.

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

[English](./README.md) · [Русский](./README.ru.md) · [Українська](./README.uk.md) · [Deutsch](./README.de.md) · [Français](./README.fr.md) · [Español](./README.es.md)<br>
[Português](./README.pt.md) · [Italiano](./README.it.md) · [Polski](./README.pl.md) · [Türkçe](./README.tr.md) · [中文](./README.zh-CN.md) · [日本語](./README.ja.md)<br>
[한국어](./README.ko.md) · [العربية](./README.ar.md) · [Nederlands](./README.nl.md) · [Čeština](./README.cs.md) · [Română](./README.ro.md) · [**Magyar**](./README.hu.md)<br>
[Български](./README.bg.md) · [Српски](./README.sr.md) · [हिन्दी](./README.hi.md) · [Tiếng Việt](./README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: 01861dcfef6354f49ecb1c6e62f9c5316943aeb8305556e432e273d7117f85e6. -->

</div>

---

##  Mi ez?

Agent-Vorcl-Flow a támogatott kódoló ügynököt **strukturált mérnöki csapattá** alakítja. Egy általános asszisztens helyett **22 célzott alügynököt** (építész, háttérrendszer, frontend, Expo mobilmérnök, DB mérnök, építészeti térképész, élőtábla-kezelő stb.) kap, mindegyik saját **készségekkel**, gyors **slash parancsokkal** és a szükséges **MCP eszközökkel**. Minden nem triviális feladat egy fegyelmezett **Task Master** hurkon fut át ​​– *cél → feladatok → végrehajtás → ellenőrzés → kész* –, így a munka megtervezett, nyomon követhető, és túléli a megszakításokat.

- 🧩 **22 segédügynök**, 44 készség, 135 perjel parancs
- ⚡ **Egyparancsos telepítés** Claude Code, Codex, Cursor és/vagy Kimi CLI - `npx`
- 🔌 **11 MCP szerver** be van kötve (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, renderelés, fájlrendszer, Task Master, Mermaid)
- 🔑 **Egy `.env` fájl az összes futási időhöz** — a kulcsokat indítóprogram olvassa be, nem `~/.zshrc`, így még GUI/IDE indításakor is működnek; nincs távoli AVF szolgáltatás; A liveboard csak localhost számára készült, és átmeneti
- 🤝 ** Ugyanabból a forrásból fut Claude Code, GPT Codex, Cursor és Kimi CLI**

---

## Gyors indítás

### Követelmények
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)** és/vagy **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Telepítés (egy parancs)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Célozzon meg egyetlen futtatókörnyezetet jelzővel:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

Mit csinál a telepítő:

| Futásidő | Akció |
| --- | --- |
| **Megosztott réteg** | Másolja az indítót a `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` mappába, és létrehozza a `~/.config/agent-vorcl-flow/.env`-t a sablonból (egyszer) – az egyetlen kulcsfájlt minden futási időhöz. |
| **Claude Code** | Regisztrálja ezt a repót pluginként **marketplace**, és engedélyezi a beépülő modult (`claude plugin …` keresztül, közvetlen `~/.claude/settings.json` tartalékkal). |
| **GPT Codex** | A készségeket `~/.agents/skills`-be, a `config.toml` + `AGENTS.md` blokkokat `~/.codex`-be egyesíti (idempotens, markerek között). |
| **Cursor** | Telepíti a készségeket a `~/.cursor/skills`-be, a natív egyéni al-agenteket a `~/.cursor/agents`-be, és egyesíti a hiányzó szervereket a `~/.cursor/mcp.json`-be. |
| **Kimi CLI** | Telepíti a készségeket a `~/.kimi/skills`-be, a natív Expo egyéni ügynököt a `~/.kimi/agents`-ba, Expo architektúrát/UI akasztókat a `~/.kimi/config.toml`-be, és egyesíti a MCP szervereket. |

> A telepítő soha nem adja meg a titkait – csak egy üres `.env`-t hoz létre a sablonból. Itt adhat hozzá gombokat (lásd [Configuration](#konfiguráció-mcp-és-gombok)).

### Frissítés a legújabb verzióra

Futtassa újra a telepítőt a npm `latest` címkével:

```bash
npx --yes agent-vorcl-flow@latest
```

Ha csak egy futtatókörnyezetet szeretne frissíteni, tartsa meg ugyanazt a futásidejű jelzőt, amelyet a telepítés során használt:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

A frissítés átfedi a Agent-Vorcl-Flow által kezelt készségeket, ügynököket, hookokat, indító- és konfigurációs blokkokat. Változatlanul megőrzi meglévő `~/.config/agent-vorcl-flow/.env` és titkait, és megőrzi az upstream Firecrawl készségeket. Ezután indítsa újra a frissített kódoló klienst (vagy futtassa a `/reload-plugins`-t Claude Code-ban).

### Alternatív telepítések (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

A telepítés után **indítsa újra a Claude Code** programot (vagy futtassa a `/reload-plugins`-t nyílt munkamenetben) az ügynökök betöltéséhez.

---

## Hogyan kell használni

Az ebben a részben található példák Claude Code szintaxist használnak; lásd az alábbi [Cursor](#cursor) és [GPT Codex](#gpt-codex) leképezéseket a natív szintaxisukért. A Claude Code-ben **háromféleképpen** lehet meghívni a csapatot.

### 1. Univerzális belépési pont – csak adja meg a célt
```text
/vorcl add a shopping cart to checkout
/audit .
```
`/vorcl` kitalálja, hogy melyik alügynök legyen a munka tulajdonosa, és végrehajtja a teljes Task Master ciklust. `/audit` automatikusan felismeri a háttérrendszert, a frontendet, a mobilt, az adatokat és az infrastruktúrát, és bizonyítékokon alapuló `PROJECT_AUDIT.md`-et ír az összes releváns szerepkör felhasználásával.

### 2. Beszéljen egy adott alügynökkel
```text
@agent-vorcl-flow:architect  design billing for a SaaS
@agent-vorcl-flow:backend    add a POST /invoices endpoint
```

### 3. Futtasson egy adott perjel parancsot
```text
/backend:create-api   POST /invoices
/analyzer:audit       src/
/screenshot:convert   ./mockups/dashboard.png  react
```

Minden ügynöknek saját `/<agent>:vorcl` belépési pontja is van, amely az adott ügynökhöz tartozó Task Master hurkot futtatja.

### A Task Master hurok
Minden nem triviális feladat a **Task Master**-on (`task-master-ai`) keresztül halad:

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```

Ez a munka megtervezett, ellenőrzött és folytatható marad – semmi sem lesz „kész” az ellenőrzési lépés áthaladása nélkül.

---

## Az ügynökök| ügynök | Szerep | Kiemelések |
| --- | --- | --- |
| 🔵 **építész** | Rendszer- és megoldástervező | Követelményelemzés, rendszer/DB/API tervezés, architektúra áttekintések |
| 🟢 **háttér** | Háttérfejlesztő | Node/TS, Postgres, Redis; moduláris architektúra; minden útvonalat teljesen lefed OpenAPI |
| 🟣 **frontend** | Frontend (React 19 / Next.js App Router) | Összetevők, állapot, adatlekérés, renderelés/köteg optimalizálás, tesztek |
| 📱 **expo-mobile** | React Native + Expo mérnök | Moduláris architektúra plusz tervezés/mozgás/interakciós rendszer, natív navigáció, tokenek, gesztusok, tapintások, csökkentett mozgás |
| 🟠 **elemző** | Kódellenőr (csak olvasható) | Hibák, típusbiztonság, DB szerkezet, frontend gúnyok, háttérszagok |
| 🟡 **swagger** | OpenAPI/Swagger lefedettség (bármilyen köteg) | Megkeresi a nem teljesen dokumentált útvonalakat, és lefedi azokat, ellenőrzéssel |
| 🔴 **firecrawl** | Webkutató | Élő CLI/MCP/REST, alkalmazásintegráció és kész webadat-munkafolyamatok |
| 🟤 **render** | Tárhely és telepítés (Render) | Telepítések, naplóvezérelt diagnosztika, metrikák, env vars, renderelés Postgres |
| 🟦 **adatbázis** | DB mérnök / DBA | Séma, lekérdezések és tervek, indexek, N+1, biztonságos visszafordítható migráció, gyorsítótár |
| ⚪ **rugalmasság** | Megbízhatóság: hibák + naplózás | try/catch a megfelelő határokon, gépelt hibák, újrapróbálkozások/időtúllépések, strukturált naplók |
| 🖼️ **képernyőkép** | Képernyőkép UI → kód | A UI képernyőképet gyártásra kész, reszponzív, hozzáférhető kóddá változtatja |
| 🔎 **vizuális kutatás** | Képernyőkép → ellenőrzött válasz | Azonosítja a webhelyet/oldalt, megkeresi a hivatalos dokumentumokat, ellenőrzi az élő adatokat és a válaszokat URL-ekkel és bizalommal |
| 🎯 **pont** | Képernyőkép → hely egy meglévő projektben (csak olvasható) | Földel egy futó alkalmazás képernyőképet a valós kódbázisban – komponens, `file:line`, útvonal/oldal, a pontos vezérlés és a mögötte lévő logika; nem hoz létre semmit, delegálja a szerkesztést |
| 📊 **drawio** | Diagramok (draw.io / diagrams.net) | Folyamatábra, BPMN, UML, ERD, hálózat/felhő és PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Építészet térképész | Determinisztikus kód → `architecture.json` (minden `source:{file,line}`-vel rendelkező csomópont) → interaktív HTML térkép, draw.io, Mermaid, ARCHITECTURE.md, PDF; a nem bizonyított tényeket `inferred` |
| 🧜 **sellő** | Mermaid diagramok (+ valós render) | folyamatábra, sorozat, osztály, állapot, ER, gantt, gitGraph, gondolattérkép…; mcp-mermaid/`mmdc`-n keresztül érvényesítve; átadja Önnek a fájlt (`.mmd` + SVG/PNG/PDF) |
| 🧪 **teszt** | Teszt- és ellenőrző mérnök | Egység (Vitest/Jest), integráció (Supertest), E2E (Playwright), lefedettség, pelyhes teszt vadászat; végrehajtja az egyes feladatok `testStrategy`-ját — zöld futás nélkül semmi sem "készül".
| 🌿 **gitflow** | Git munkafolyamat és kiadások | Hagyományos véglegesítés, név szerinti véglegesítés (soha `git add .`), PR, Keep-a-Changelog, semver kiadások; push csak kifejezett megerősítéssel |
| 🛡️ **biztonság** | Biztonsági ellenőr (csak olvasható) | Titkok a fa és git történetében, OWASP Top 10, függőségi CVE-k, PII; a megállapítások feladatokká válnak – a javításokat delegálják |
| 📝 **docs** | Dokumentációs mérnök | README (többnyelvű paritás), API dokumentumok a OpenAPI-tól, ARCHITECTURE, CONTRIBUTING, kiadási megjegyzések; minden példa a | kóddal ellenőrzött
| 🐳 **devops** | Konténerek és CI/CD | Többlépcsős Dockerfiles, docker-compose helyi fejlesztésekhez, GitHub Actions pipelines, env/Secrets higiénia, monitoring |
| 📡 **élőtábla** | Helyi Műveleti Tanács | Élő Git munkafák, ügynöki folyamatok és Task Master feladatok egy efemer helyi host irányítópulton |**Néhány dolgot érdemes tudni:**
- **A Frontend mindig egy valódi API-vel beszél.** A backend OpenAPI specifikációja az igazság egyetlen forrása; típusok generálódnak belőle (`openapi-typescript` + `openapi-fetch`). Nincs gúny a gyártási úton.
- **`database` mutációk kifejezett megerősítést igényelnek.** Az Analytics csak olvasható; A séma/adatmódosítások (DDL/DML/migrációk) soha nem futnak az Ön engedélye nélkül.
- **`resilience` biztonsági horgot szállít.** A nem blokkoló `PostToolUse` kampó (`catch-guard.js`) finoman megjelöli az üres `catch {}` blokkokat az imént szerkesztett fájlokban.
- **`archmap` soha nem a képzeletből merít.** A kinyerést és a megjelenítést szigorúan elválasztják egymástól: a nulla függőségi szkriptek a repót a `architecture.json`-be vezetik (valódi FK-számos adatbázisok, API útvonalak, AI-ügynökök a modelljeikkel/eszközeikkel/memóriáikkal, import gráf, env), és minden diagram csak ebből készül. Bármi, amit az LLM igazolható `file:line` nélkül ad hozzá, kényszerjellel `inferred:true` van megjelölve, és szaggatottan húzódik.
- **`pinpoint` talál, soha nem hoz létre.** Ha egy futó alkalmazás képernyőképet kap, a képernyőt leképezi a valódi kódra – komponensre, útvonalra, pontos vezérlésre és a mögötte lévő logikára –, és átadja a szerkesztést a `frontend`/`backend`-nek. A már létezőn működik (a `screenshot` inverze).
- **`visual-research` találgatás helyett ellenőrzi.** A képernyőképet bizonyítékként kezeli, megerősíti a hivatalos domaint és a dokumentumokat, ellenőrzi az aktuális webhelyadatokat, és megjelöli az esetleges adathalászat vagy elavult értékeket.
- **`i18n` kényszeríti a "nulla nyelvű hardcoding"-ot.** Az ügynökök először észlelik, hogy egy projekt többnyelvű-e, és alkalmazkodnak hozzá – a felhasználóhoz tartozó karakterláncok átmennek egy fordítási rétegen (next-intl / react-i18next / i18next), soha nem inline.

---

## Parancs hivatkozás

Minden alábbi parancs egy perjel parancs. `<…>` jelöli a bevitt értéket.

### `/vorcl` — univerzális router
| Parancs | Mit csinál |
| --- | --- |
| `/vorcl <goal>` | Bármely célt feladattá alakítja, és a megfelelő alügynökhöz irányítja, majd a teljes ciklust lefuttatja. |
| `/audit [path] [focus]` | Mély, csak olvasható, több szerepkörű audit → észlelt rendszerek, biztonsági/CVE/rugalmassági megállapítások, célarchitektúra és szakaszos `PROJECT_AUDIT.md`. |

### 🔵 építész — építészet
| Parancs | Mit csinál |
| --- | --- |
| `/architect:vorcl <goal>` | Cél → feladatok → ciklus, architektúrára ható. |
| `/architect:analyze <context>` | Elemezze a követelményeket és a feladat kontextusát. |
| `/architect:design <problem>` | Tervezze meg a megoldás architektúráját (rendszer, DB, API). |
| `/architect:review <target>` | Tekintse át a meglévő architektúrát. |

### 🟢 háttérrendszer — szerver (Node/TS, Postgres, Redis)
| Parancs | Mit csinál |
| --- | --- |
| `/backend:vorcl <goal>` | Cél → feladatok → ciklus a háttérmunkához. |
| `/backend:create-api <endpoint>` | Hozzon létre egy API végpontot a moduláris architektúrán, amelyet teljesen lefed a OpenAPI. |
| `/backend:refactor <target>` | Refaktor kód a viselkedés megváltoztatása nélkül. |
| `/backend:optimize <target>` | Teljesítmény optimalizálás. |
| `/backend:test <target>` | Generáljon teszteket a kódhoz. |

### 🟣 frontend — React / Next.js
| Parancs | Mit csinál |
| --- | --- |
| `/frontend:vorcl <goal>` | Cél → feladatok → ciklus frontend munkához. |
| `/frontend:create-component <spec>` | Hozzon létre egy UI komponenst a szolgáltatásszerkezetet követve. |
| `/frontend:refactor <target>` | Refaktor UI / horgok a viselkedés megváltoztatása nélkül. |
| `/frontend:optimize <target>` | Optimalizálja a megjelenítést / csomagot / alapvető webes vitalokat. |
| `/frontend:test <target>` | Alkatrésztesztek generálása. |

### 📱 expo-mobile — React Native / Expo| Parancs | Mit csinál |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Cél → Task Master ciklus Expo mobil munkához. |
| `/expo-mobile:create-module <domain>` | Hozzon létre egy moduláris üzleti szeletet, amely csak az összetettségéhez szükséges rétegeket tartalmazza. |
| `/expo-mobile:create-screen <flow>` | Hozzon létre egy vékony Expo Router útvonalat, valamint egy modul tulajdonában lévő képernyőt és állapotokat. |
| `/expo-mobile:design-screen <flow>` | Építsen prémium képernyőt megosztott tervezési/mozgási tokenekkel, állapotokkal és kisegítő lehetőségekkel. |
| `/expo-mobile:motion <interaction>` | Tervezze meg a natív navigációt, rugókat, gesztusokat, tapintásokat és csökkentett mozgású tartalékokat. |
| `/expo-mobile:add-api <contract>` | Adjon hozzá séma/DTO/mapper/query kulcsokat és TanStack Query integrációt. |
| `/expo-mobile:audit [scope]` | Csak olvasható architektúraőr és bizonyítékokon alapuló audit. |
| `/expo-mobile:ui-audit [scope]` | Csak olvasható tervezőrendszer, mozgás, interakció, hozzáférhetőség és teljesítmény-audit. |
| `/expo-mobile:compatibility [app] [change]` | Élő, csak olvasható Expo/RN/Node/package/native-runtime kompatibilitási audit verziószámú hivatalos forrásokhoz képest. |
| `/expo-mobile:test <scope>` | Futtassa a tartományegységet, a React Native Tesztkönyvtárat és a Maestro ellenőrzéseket. |

### 🟠 analizátor – kódaudit (csak olvasható)
| Parancs | Mit csinál |
| --- | --- |
| `/analyzer:vorcl <goal>` | A cél ellenőrzése a Task Master segítségével – a megállapítások feladatokká válnak. |
| `/analyzer:audit` | Teljes audit: hibák, típusok, DB, frontend gúnyok, háttérszagok. |
| `/analyzer:bugs` | Hunt bug – kezeletlen hibák, versenykörülmények, szélsőséges esetek. |
| `/analyzer:types` | Típusellenőrzés – `tsc`, `any`, nem biztonságos dobások, zod↔típusok eltolódása. |
| `/analyzer:db` | Audit DB struktúra — séma, indexek, FK-k, N+1, migrációk. |
| `/analyzer:mocks` | Keressen makett/hamis adatokat a frontenden. |
| `/analyzer:backend` | Keressen „rossz” háttérkódot – architektúra-sértések, logika a vezérlőkben. |

### 🟡 swagger — OpenAPI/Swagger lefedettség (bármilyen köteg)
| Parancs | Mit csinál |
| --- | --- |
| `/swagger:vorcl <goal>` | Teljes lefedettségi cél a következőn keresztül: Task Master — audit → feladatok → fedő → ellenőrzés. |
| `/swagger:audit` | Csak olvasható: olyan útvonalak keresése, amelyeket a specifikáció nem fed le teljesen. |
| `/swagger:cover <route>` | Útvonal/modul lefedése – paraméterek, válaszok, leírások, biztonság + ellenőrzés. |

### 🔴 firecrawl — webkutatás
| Parancs | Mit csinál |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Kutatási cél a Task Master segítségével — webes adatok gyűjtése a kész eredményig. |
| `/firecrawl:search <query>` | Internetes keresés források után egy kérdésre. |
| `/firecrawl:scrape <url>` | Kaparjon egy URL-t a markdown/JSON-ba. |
| `/firecrawl:map <url>` | Térképezze fel egy webhely URL-címét. |
| `/firecrawl:crawl <url>` | Szakasz/webhely rekurzív feltérképezése. |
| `/firecrawl:extract <url>` | Strukturált kinyerés JSON séma szerint. |
| `/firecrawl:setup` | Telepítés/ellenőrzés CLI, valamint hivatalos összeállítási és munkafolyamat-készségek (megerősítéssel). |
| `/firecrawl:interact <url>` | Kattintson, navigáljon vagy töltse ki az űrlapokat, ha a kaparás nem elegendő. |
| `/firecrawl:parse <file>` | Elemezze a helyi/privát dokumentumot a markdown-ba vagy JSON-be. |
| `/firecrawl:monitor <action>` | Listázza az ellenőrzéseket, vagy kezelje az ismétlődő oldalváltás-figyelőket. |
| `/firecrawl:agent <goal>` | Futtasson egy korlátozott, hosszú távú Firecrawl ügynök feladatot. |
| `/firecrawl:research <query>` | Keresési cikkek és GitHub kutatási kontextus. |
| `/firecrawl:ask <jobId>` | Sikertelen Firecrawl feladat diagnosztizálása. |
| `/firecrawl:docs-search <question>` | Keresés az aktuális hivatalos Firecrawl dokumentációban. |
| `/firecrawl:integrate <feature>` | Adja hozzá Firecrawl-t az alkalmazáskódhoz az upstream összeállítási készségekkel. |
| `/firecrawl:deliverable <artifact>` | Készítsen egy rövid, audit, lead listát vagy egyéb munkafolyamat-műterméket. |`/firecrawl:setup` csak megerősítés után futtatja a hivatalos `firecrawl-cli init --all` folyamatot. A meglévő hivatalos `firecrawl-*` ismeretek elsőbbséget élveznek, és azokat a Codex/Cursor telepítő megőrzi; Az AVF kompatibilis tartalékokat biztosít a hiányzó készségekhez. Az élő műveletek a következőn keresztül haladnak: CLI → MCP → REST/keyless.

### 🟤 renderelés — tárhely/telepítés (renderelés)
| Parancs | Mit csinál |
| --- | --- |
| `/render:vorcl <goal>` | Infracél a Task Master-n keresztül — üzembe helyezés/diagnosztizálás/konfigurálás, hogy elkészüljön. |
| `/render:deploy <service>` | Szolgáltatás üzembe helyezése / újratelepítése. |
| `/render:logs <service>` | Szerviznaplók és diagnosztika egészen a kiváltó okig. |
| `/render:status <service>` | Szolgáltatás állapota + üzembe helyezés + mérőszámok. |
| `/render:query <sql>` | Csak olvasható SQL a renderelés ellen Postgres. |

### 🟦 adatbázis — DB mérnök / DBA (Postgres / MongoDB / Redis)
| Parancs | Mit csinál |
| --- | --- |
| `/database:vorcl <goal>` | Adatcél a Task Master-on keresztül — séma/queries/migrations/cache to done. |
| `/database:query <query>` | Csak olvasható lekérdezés / elemzés. |
| `/database:schema <target>` | Tervezze meg / tekintse át a sémát és az adatok integritását. |
| `/database:migrate <change>` | Tervezzen meg egy biztonságos, visszafordítható séma-/adatmigrációt. |
| `/database:optimize <target>` | Optimalizálás — indexek, N+1, lekérdezési tervek, lapozás. |
| `/database:cache <target>` | Redis — TTL, érvénytelenítés, zárolások, sebességkorlátozás, adatfolyamok. |

### ⚪ rugalmasság — hibakezelés + naplózás
| Parancs | Mit csinál |
| --- | --- |
| `/resilience:vorcl <goal>` | Megbízhatósági cél a Task Master-n keresztül — fedőkód try/catch + naplókkal. |
| `/resilience:harden <target>` | Csomagolja be a kódot a try/catch/finish-be tömör naplózással, csendes hibák nélkül. |
| `/resilience:logging <target>` | Strukturált naplózás hozzáadása/javítása – szintek, kontextus, nincsenek titkok/PII. |
| `/resilience:audit` | Csak olvasható: csendes hibák, üres fogások, naplózási hiányosságok keresése. |

### 🖼️ képernyőkép — képernyőkép UI → kód
| Parancs | Mit csinál |
| --- | --- |
| `/screenshot:vorcl <goal>` | Képernyők készlete képernyőképekből a Task Master - lebontás → kódon keresztül. |
| `/screenshot:analyze <image>` | Csak olvasható bontás — elrendezés, összetevők, tokenek, állapotok → terv. |
| `/screenshot:convert <image> [framework]` | Teljes futtatható kód létrehozása képernyőképből (alapértelmezett React + Tailwind v4). |
| `/screenshot:tokens <image>` | Kivonja a tervezési tokeneket (OKLCH színek, tipográfia, térköz) a Tailwind `@theme` mappába. |
| `/screenshot:responsive <target>` | Tegye a generált UI reszponzívvá — töréspontok, fluidum, `clamp()`, tárolólekérdezések. |

### 🔎 Visual-Research — képernyőkép → ellenőrzött webes válasz
| Parancs | Mit csinál |
| --- | --- |
| `/visual-research:vorcl <goal>` | Többlépcsős képernyőkép-kutatás a Task Master-n keresztül. |
| `/visual-research:identify <image>` | Azonosítsa a webhelyet, oldalt és funkciót megbízható bizonyítékokkal. |
| `/visual-research:search <image> <target>` | Keresse meg a valódi oldalt vagy a hivatalos dokumentációt vizuális nyomokból. |
| `/visual-research:answer <image> <question>` | Válaszoljon képernyőképekkel, hivatalos dokumentumokkal és aktuális élő adatokkal. |
| `/visual-research:hints <image> <goal>` | Adjon biztonságos, dokumentációval alátámasztott lépéseket a látható felülethez. |

### 🎯 pontos meghatározás — képernyőkép → elhelyezés egy meglévő projektben (csak olvasható)
| Parancs | Mit csinál |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Meglévő UI keresése/megértése/módosítása képernyőképen a Task Master segítségével — térkép → feladatok → delegálás. |
| `/pinpoint:locate <image>` | Keresse meg a meglévő komponenst/fájl(oka)t egy képernyőképen – `file:line`, nincs új kód. |
| `/pinpoint:route <image>` | Határozza meg az útvonalat/oldalt, amelyen a képernyő látható (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <image>` | Határozza meg a pontos vezérlőt (gomb/mező) és kezelőjét a kódban. |
| `/pinpoint:trace <target>` | Kövesse nyomon egy elem mögötti logikát — kezelő → állapot → adatlehívás → API. |
| `/pinpoint:handoff <change>` | Készítsen pontos szerkesztési kérelmet a meglévő kód alapján, és delegálja a `frontend`/`backend` címre. |

### 📊 drawio — diagramok (draw.io / diagrams.net)
| Parancs | Mit csinál |
| --- | --- |
| `/drawio:vorcl <goal>` | Diagramok készlete a Task Master-n keresztül — építéstől készig. |
| `/drawio:create <description> [type]` | Készítsen diagramot szöveges leírásból (érvényes natív XML). |
| `/drawio:pmp <type> <project>` | PMP/PMBOK diagram készítése – WBS, PERT/CPM, Gantt, RACI, kockázati mátrix, érdekelt felek rács. |
| `/drawio:convert <source> [type]` | Forrás konvertálása diagrammá — DB séma → ERD, mappák → fa, kód → UML, sellő/CSV/JSON. |
| `/drawio:refine <file>` | Meglévő `.drawio` finomítása – elrendezés, téma, csomópontok hozzáadása/eltávolítása, rácshoz igazítás. |

### 🗺️ archmap — architektúra térkép kódból| Parancs | Mit csinál |
| --- | --- |
| `/archmap:vorcl <goal>` | Leképezési cél a Task Master segítségével – ellenőrzött műtermékkészletre épít. |
| `/archmap:map [repo]` | Teljes folyamat: kivonás → `architecture.json` → LLM-annotáció → minden formátum (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Csak kivonás – géppel olvasható `architecture.json`, minden csomóponton `source:{file,line}`. |
| `/archmap:annotate [json]` | Meglévő `architecture.json` LLM gazdagítása (ügynök memória, adatfolyam szemantika); bizonyítatlan tények automatikusan lefokozva `inferred`-ra. |
| `/archmap:html [json]` | Interaktív, önálló HTML térkép — fóliaváltások, nyomkövetési nyalábok, csomópont → `file:line` panel, keresés, CSS nyomtatás. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (többoldalas: Áttekintés / ERD / API / Ügynökök) és/vagy Mermaid nézetek, érvényesítve. |

### 🧜 sellő — Mermaid diagramok (+ valós render)
| Parancs | Mit csinál |
| --- | --- |
| `/mermaid:vorcl <goal>` | Diagramok készlete a Task Master-n keresztül — építéstől készig (megjelenítés ellenőrzött). |
| `/mermaid:create <description> [type]` | Diagram készítése leírásból – érvényes szintaxis, valódi renderelés által ellenőrzött; átadja a fájlt. |
| `/mermaid:convert <source> [type]` | Forrás konvertálása Mermaid — DB séma → ER, kód → osztály/szekvencia, mappák → folyamatábra, `.drawio`/CSV/JSON formátumba. |
| `/mermaid:validate <file>` | Szintaxis + valós renderelési teszt; találja meg és javítsa ki a hibákat (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Exportálás ide: SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Meglévő `.mmd` finomítása — irány, részgráf, classDef/stílusok, olvashatóság. |

### 🧪 tesztelés — tesztek és ellenőrzés
| Parancs | Mit csinál |
| --- | --- |
| `/testing:vorcl <goal>` | Tesztelési/ellenőrzési cél a következőn keresztül: Task Master — unit + integration + e2e to done. |
| `/testing:unit <file\|module>` | Egységtesztek (Vitest/Jest) — boldog út, határok, hibák; futtatja őket, és megjeleníti a kimenetet. |
| `/testing:integration <endpoint\|module>` | Integrációs tesztek (Supertest/inject, valódi DB vagy tesztkonténerek). |
| `/testing:e2e <scenario>` | Playwright E2E a kritikus felhasználói útvonalhoz – szerepválasztók, fixtures, nyomkövetés hiba esetén. |
| `/testing:verify <task\|testStrategy>` | Végrehajtja egy feladat `testStrategy`-jét, és a READY / NOT READY ítéletet ad vissza valós kimenettel. |
| `/testing:coverage [path]` | Lefedettségi jelentés megállapításokkal – mely kritikus kód nem tesztelt; feladatokat hoz létre. |
| `/testing:flaky <test>` | Diagnosztizál egy instabil tesztet (verseny, időzítés, megosztott állapot, gúnyok), és véglegesen kijavítja. |

### 🌿 gitflow – git munkafolyamat és kiadások
| Parancs | Mit csinál |
| --- | --- |
| `/gitflow:vorcl <goal>` | Git/release cél a Task Master segítségével (kiadás előkészítése, előzmények törlése, szolgáltatáság). |
| `/gitflow:commit <files\|scope>` | Név szerinti véglegesítés (soha `git add .`) Hagyományos véglegesítés üzenettel; leáll az ismeretlen WIP-en. |
| `/gitflow:pr <base> <title>` | Branch → commits → pull kérés (gh / GitHub MCP) a mit/miért/hogyan ellenőrizve. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Változásnapló megőrzése) a címkék közötti véglegesítésekből jön létre. |
| `/gitflow:release <version\|auto>` | Semver a véglegesítésből → jegyzékverziók szinkronizálása → címke → GitHub kiadás. Csak kifejezett megerősítés után nyomja meg. |
| `/gitflow:audit [branch]` | Írásvédett előzmények auditálása: egyezmények megsértése, kiíratott kötelezettségvállalások, nagy blobok, árva ágak. |

### 🛡️ biztonság — biztonsági audit (csak olvasható)
| Parancs | Mit csinál |
| --- | --- |
| `/security:vorcl <goal>` | Biztonsági cél a Task Master — ellenőrzés → megállapítások → feladatok → delegált javítások révén. |
| `/security:secrets [path\|branch]` | Titkok a működő fában ÉS a git történelemben (minden ág); `${VAR:-}` A helyőrzők nem titkok. |
| `/security:owasp [path]` | OWASP Top 10 a kódban: injekciók, XSS, hitelesítés, adatexpozíció, CORS/cookie-k – fájl:sorellenőrzéssel. |
| `/security:deps` | Függőségi CVE-k npm auditon / zárolt fájlokon keresztül – súlyosság, törés-változás jelzők. |
| `/security:pii [path]` | PII/GDPR kockázatok: e-mailek, telefonok, kártyák kódban és naplókban; a fejlesztő privát útvonalait. |
| `/security:pre-push [branch]` | A módosított fájlok gyors kombinált ellenőrzése leküldés előtt: titkok + injekciók + személyazonossági adatok; zöld/piros ítélet. |

### 📝 dokumentumok — dokumentáció
| Parancs | Mit csinál |
| --- | --- |
| `/docs:vorcl <goal>` | Dokumentációs cél a Task Master segítségével. |
| `/docs:readme [path]` | README létrehozása/frissítése — what/quickstart/usage/config/troubleshooting; példák ellenőrizve; nyelvi verziók szinkronizálva. || `/docs:api [spec]` | API a OpenAPI specifikációból generált dokumentumok (végpontok, paraméterek, curl példák); javasolja `/swagger:audit` ha nincs specifikáció. |
| `/docs:architecture` | ARCHITECTURE.md — modulok, határok, adatáramlás; diagramok delegálva `mermaid`/`drawio`. |
| `/docs:contributing` | CONTRIBUTING.md — beállítás, struktúra, tesztek, véglegesítési konvenciók (a `gitflow`-hoz igazítva), PR folyamat. |
| `/docs:release-notes <version>` | Kiadási megjegyzések a CHANGELOG/history egyik verziójához. |
| `/docs:audit` | Csak olvasható dokumentumok↔kódeltolódás ellenőrzése: hibás hivatkozások, elavult példák/számlálók, szinkronizálatlan fordítások. |

### 🐳 devops — konténerek és CI/CD
| Parancs | Mit csinál |
| --- | --- |
| `/devops:vorcl <goal>` | Egy infrastrukturális cél a Task Master-n keresztül. |
| `/devops:dockerfile [app-type]` | Dockerfile írása/áttekintése – többlépcsős, vékony alap, nem root, HEALTHCHECK; valódi `docker build` igazolta. |
| `/devops:compose` | docker-compose.yml helyi fejlesztőhöz (app + DB-k); env változások kell `--force-recreate`, várja az egészséges. |
| `/devops:ci [type]` | GitHub Műveletek — PR munkafolyamat (szösz+típusellenőrzés+teszt, npm gyorsítótár), munkafolyamat üzembe helyezése, minimális engedélyek. |
| `/devops:env` | Env-változó leltár: hol olvasható, mi szükséges, `.env.example` sablon; titkok soha képekben. |
| `/devops:monitoring` | Strukturált naplók (pino/JSON), állapot-végpont, mire kell figyelmeztetni; Mutatók megjelenítése a `render` ügynökön keresztül. |

### 📡 liveboard — átmeneti helyi műveleti tábla
| Parancs | Mit csinál |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Indítson el egy csiszolt 43 nyelvű irányítópultot egy ingyenes localhost porton; Task Master 5 percenként váltja az adatfolyamot az SSE-n keresztül, és egyezteti. |
| `/liveboard:vorcl <goal>` | Fejlessze vagy módosítsa magát az élőtáblát a szükséges Task Master munkafolyamattal. |

Liveboard beolvassa a Git munkafákat, a helyi Claude/Codex/Cursor folyamatokat és az egyes munkafák `.taskmaster/tasks/tasks.json`-jét. A futásidejű állapot a memóriában marad, és eltűnik, amikor az előtérbeli folyamat leáll. A UI érzékeli a böngésző nyelvét, és 43 nyelvi beállítási lehetőséget kínál, köztük angol, orosz, ukrán, német, francia, spanyol, portugál, olasz, lengyel, török, kínai, japán, arab, holland, cseh, szlovák, román, magyar, bolgár, szerb, horvát, szlovén, görög, héber, svéd, perzsa, hindi, bengáli, thai, indonéz, urdu, vietnami norvég, dán, finn, észt, lett, litván, grúz, örmény és azerbajdzsáni. Az arab, a héber, a perzsa és az urdu nyelven RTL elrendezést használnak.

Közvetlen konfiguráció:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: olyan projekt, amelynek Git munkafáit és Task Master fájljait szkennelték.
- `--port 0`: automatikusan kiválaszt egy szabad portot.
- `--interval`: teljes egyeztetési intervallum ezredmásodpercben; A fájlnézés továbbra is stream Task Master azonnal megváltozik.
- Végpontok: `/health`, ​​`/api/snapshot`, `/api/events` (SSE) és `POST /api/refresh`.
- Tartsa meg a `--host 127.0.0.1`-t, hacsak nem szándékozik kifejezetten a projektinformációkat a hálózat számára közzétenni.

---

## Konfiguráció (MCP és gombok)

A csomag **nincs távoli háttérrendszere vagy adatbázisa**. Az opcionális élő tábla egy, csak lokális szerveren működő memóriafolyamat. MCP A szervereknek tokenekre van szükségük, és **minden felhasználó megadja a sajátját**. Annak érdekében, hogy ez azonos módon működjön a **Claude Code, Codex, Cursor és Kimi CLI** között – és függetlenül attól, hogy terminálról vagy Dockról / Spotlightról / IDE-ről indít – minden stdio MCP szerver egy kis indítón (`bin/mcp-env.mjs`) indul, amely **egy fájlból** olvassa be a kulcsokat:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

A telepítő a [`.env.example`](./.env.example) elemből hozza létre. Nyissa meg, és csak a használt kulcsokat írja be:

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

> **Miért indító a `~/.zshrc` helyett?** Az Env-var bővítése futási időnként eltérő (`${VAR:-}` Claude, `${env:VAR}` Cursor, literálok Codex/Kimi), és minden futtatókörnyezet csak azt a környezetet olvassa, amelyben **ez** elindult. A GUI / IDE indítása macOS-en semmi sem csatlakozik, és a kulcsok nem exportálhatók. a klasszikus „MCP env not set” hiba. Egy `.env` fájl olvasása mindkét problémát egyszerre eltávolítja.**Precedence** (később nyer): a megosztott `~/.config/agent-vorcl-flow/.env` → egy `./.env` a projektgyökérben → egy valódi `export` a shellben. Tartsa meg a globális kulcsokat a megosztott fájlban, írja felül projektenként (például egy másik `MONGODB_URI`) egy projekttel `.env`, és az eredeti shell-export továbbra is nyer a CLI futtatások során. A `AGENT_VORCL_ENV_FILE=/path/.env` gombbal egy másik fájlra irányíthatja az indítót.

Az a kiszolgáló, amelyről hiányzik a szükséges kulcs, egyszerűen **nem indul el** — egysoros `[agent-vorcl-flow] MCP «…» is not configured: …` jelenik meg a futásidejű MCP naplójában, és minden más szerver tovább működik. Adja hozzá a kulcsot a `.env`-hoz, és indítsa újra. (Megtarthatja a `GITHUB_TOKEN`/`MONGODB_URI` neveket – az indító a szerverek által elvárt `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` névhez rendeli őket.)

> ⚠️ **A mesterséges intelligencia által működtetett Task Master parancsokhoz szükséges:** konfiguráljon legalább egy kiválasztott szolgáltatót – `ANTHROPIC_API_KEY` Claude, `OPENAI_API_KEY` GPT esetén vagy Codex CLI OAuth. A `.taskmaster/config.json`-ben kiválasztott modell hitelesítő adatai nélkül a `/vorcl` nem tud feladatokat generálni vagy kibontani.

Válassza ki, hogy valójában melyik szolgáltató üzemelteti a generálást; a billentyűk önmagukban nem választják ki a modellt:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

A parancs a hivatalos `task-master models` folyamatot használja, és csak a modellválasztást tárolja a `.taskmaster/config.json`-ban. `PERPLEXITY_API_KEY` opcionális, és csak akkor szükséges, ha a Perplexity van kiválasztva kutatási modellként.

A távoli **vercel** és **render** szerverek OAuth-ot használnak (engedélyezés a `/mcp`-vel a böngészőben). A Render in headless/CI esetén állítsa be a `RENDER_API_KEY` értéket a környezetben, és adjon hozzá egy Bearer fejléc bejegyzést a kiszolgálóhoz a futásidőhöz.

---

##  Ellenőrizze a telepítést

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

A Codex nem rendelkezik „bővítményekkel”, így ugyanazok a képességek **készségek**, **profilok** és `AGENTS.md` útválasztó formájában vannak kifejezve:

| Claude Code | Codex egyenértékű |
| --- | --- |
| alügynök `@agent-vorcl-flow:frontend` | készség személy `$frontend` + `codex --profile frontend` |
| parancs `/analyzer:audit` | feladat készség `$analyzer-audit` |
| parancs `/vorcl` | feladat készség `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` in `config.toml` |
| `SessionStart` horog | szerepkör-útválasztás a `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

A teljes feltérképezést lásd: [`codex/README.md`](./codex/README.md).

---

## Cursor

A Cursor ugyanazt a nyitott `SKILL.md` formátumot használja, mint a Codex adapter, plusz natív egyéni al-agenseket és globális MCP konfigurációt:

| Agent-Vorcl-Flow koncepció | Cursor egyenértékű |
| --- | --- |
| szerep `backend` | egyéni al-agent `/avf-backend` in `~/.cursor/agents` |
| feladat parancs `/backend:create-api` | készség `/backend-create-api` |
| univerzális `/vorcl` | készség `/vorcl` |
| `.mcp.json` | egyesített szerverek itt: `~/.cursor/mcp.json` |

A telepítő a szerepkör-definíciókat Cursor frontmatterre konvertálja, az alágenseket `avf-` előtaggal látja el, hogy elkerülje a készségnevek ütközését, a `model: inherit`-t használja, és a csak auditálásra alkalmas ügynököket `readonly: true`-ként jelöli meg. Az azonos nevű meglévő MCP szerverbejegyzések megmaradnak. Lásd [`cursor/README.md`](./cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) natív módon tölti be az ügynökkészségeket, az egyéni ügynökfájlokat és az életciklus-horogokat; Az AVF a Claude és a Cursor által használt MCP szervereket is egyesíti:

| Agent-Vorcl-Flow koncepció | Kimi CLI egyenértékű |
| --- | --- |
| készségek / feladatparancsok | `~/.kimi/skills` és `/skill:<name>` |
| Expo egyedi ügynök | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse védő | egyesült a `~/.kimi/config.toml` |
| `.mcp.json` | egyesített szerverek itt: `~/.kimi/mcp.json` |
| futásidejű kulcsfájl | a megosztott `~/.config/agent-vorcl-flow/.env` (az indítón keresztül) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

A Kimi CLI nem rendelkezik `${VAR}` bővítéssel a `mcp.json`-ben, így a kulcsok a megosztott `.env`-ból származnak az indítón keresztül – pontosan úgy, mint a többi futtatókörnyezetben. Lásd [`kimi/README.md`](./kimi/README.md).

---

##  A projekt felépítése

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

**Hogyan illeszkedik egymáshoz:** `agents/*.md` deklaráljon egy szerepkört, és `skills:` elsőként `skills:` csatolja a készségeket → a `skills/*/SKILL.md`-ban lévő készségek automatikusan betöltődnek a leírás alapján → `commands/<agent>/*.md` biztosítanak gyors `/agent:command` parancsikonokat, amelyek átruházzák az alügynököt → `.mcp.json` eszközöket ad az ügynököknek, amelyek mindegyike a `bin/mcp-env.mjs`-n keresztül kezdődik, amely betölti a titkokat a megosztott `MONGODB_URI`-ból. Egy `SessionStart` kampó jelzi Claude, hogy az ügynökök elérhetők.

---

##  Licenc

MIT – szabadon használható, másolható, módosítható és terjeszthető; „ahogy van”, garancia és felelősség nélkül. Lásd [LICENSE](./LICENSE).

© 2026 Christian Avis (Vorcl).
