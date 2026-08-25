<div align="center">

# Agent-Vorcl-Flow

**A team of specialized AI sub-agents for [Claude Code](https://claude.com/claude-code), [GPT Codex](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/), and [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — with skills, commands, and MCP tools.**
One `npx` command installs them. No remote backend or cloud hosting: your coding agent runs everything locally.

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

[**English**](./README.md) · [Русский](./translations/README.ru.md) · [Українська](./translations/README.uk.md) · [Deutsch](./translations/README.de.md) · [Français](./translations/README.fr.md) · [Español](./translations/README.es.md)<br>
[Português](./translations/README.pt.md) · [Italiano](./translations/README.it.md) · [Polski](./translations/README.pl.md) · [Türkçe](./translations/README.tr.md) · [中文](./translations/README.zh-CN.md) · [日本語](./translations/README.ja.md)<br>
[한국어](./translations/README.ko.md) · [العربية](./translations/README.ar.md) · [Nederlands](./translations/README.nl.md) · [Čeština](./translations/README.cs.md) · [Română](./translations/README.ro.md) · [Magyar](./translations/README.hu.md)<br>
[Български](./translations/README.bg.md) · [Српски](./translations/README.sr.md) · [हिन्दी](./translations/README.hi.md) · [Tiếng Việt](./translations/README.vi.md)

<sub>English is canonical; every link above opens a repository-local README file.</sub>
</details>

</div>

---

## What is this?

Agent-Vorcl-Flow turns a supported coding agent into a **structured engineering team**. Instead of one general assistant, you get **26 focused sub-agents** (architect, code-grounded principal architect, backend, frontend, Expo mobile engineer, product and visual design engineer, DB engineer, cross-language integrity auditor, architecture cartographer, liveboard operator, logging engineer, and more), each with its own domain **skills**, quick **slash commands**, and the **MCP tools** it needs. Every non-trivial task runs through a disciplined **Task Master** loop — *goal → tasks → implement → verify → done* — so work is planned, tracked, and survives interruptions.

- 🧩 **26 sub-agents**, 75 skills, 159 slash commands
- ⚡ **One-command install** for Claude Code, Codex, Cursor, and/or Kimi CLI — `npx`
- 🔌 **11 MCP servers** wired in (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, filesystem, Task Master, Mermaid)
- 🔑 **One `.env` file for all runtimes** — keys read by a launcher, not `~/.zshrc`, so they work even from GUI/IDE launches; no remote AVF service; liveboard is localhost-only and ephemeral
- 🤝 **Runs on Claude Code, GPT Codex, Cursor, and Kimi CLI** from the same source

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)**, **[GPT Codex](https://developers.openai.com/codex/cli/)**, **[Cursor](https://cursor.com/)**, and/or **[Kimi CLI](https://github.com/MoonshotAI/kimi-cli)**

### Install (one command)

```bash
# Installs adapters for Claude Code, Codex, Cursor, and Kimi CLI:
npx github:Vitammiin/agent-vorcl-flow
```

Target a single runtime with a flag:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
npx github:Vitammiin/agent-vorcl-flow --cursor   # Cursor only
npx github:Vitammiin/agent-vorcl-flow --kimi     # Kimi CLI only
```

What the installer does:

| Runtime | Action |
| --- | --- |
| **Shared layer** | Copies the launcher to `~/.config/agent-vorcl-flow/bin/mcp-env.mjs` and creates `~/.config/agent-vorcl-flow/.env` from the template (once) — the single key file for every runtime. |
| **Claude Code** | Registers this repo as a plugin **marketplace** and enables the plugin (via `claude plugin …`, with a direct `~/.claude/settings.json` fallback). |
| **GPT Codex** | Merges the skills into `~/.agents/skills` and the `config.toml` + `AGENTS.md` blocks into `~/.codex` (idempotent, between markers). |
| **Cursor** | Installs skills into `~/.cursor/skills`, native custom subagents into `~/.cursor/agents`, and merges missing servers into `~/.cursor/mcp.json`. |
| **Kimi CLI** | Installs skills into `~/.kimi/skills`, the native Expo custom agent into `~/.kimi/agents`, both Expo architecture/UI hooks into `~/.kimi/config.toml`, and merges MCP servers. |

> The installer never fills in your secrets — it only creates an empty `.env` from the template. You add keys there (see [Configuration](#configuration-mcp--keys)).

### Update to the latest version

Run the installer again with the npm `latest` tag:

```bash
npx --yes agent-vorcl-flow@latest
```

To update only one runtime, keep the same runtime flag you used during installation:

```bash
npx --yes agent-vorcl-flow@latest --claude
npx --yes agent-vorcl-flow@latest --codex
npx --yes agent-vorcl-flow@latest --cursor
npx --yes agent-vorcl-flow@latest --kimi
```

The update overlays Agent-Vorcl-Flow-managed skills, agents, hooks, launcher, and configuration blocks. It keeps your existing `~/.config/agent-vorcl-flow/.env` and its secrets unchanged, and preserves upstream Firecrawl skills. Restart the updated coding client afterward (or run `/reload-plugins` in Claude Code).

### Alternative installs (Claude Code)

```bash
# Load for the current session only (great for trying it out):
claude --plugin-dir /path/to/agent-vorcl-flow

# Or install persistently from a local marketplace:
/plugin marketplace add /path/to/agent-vorcl-flow
/plugin install agent-vorcl-flow
```

After install, **restart Claude Code** (or run `/reload-plugins` in an open session) to load the agents.

---

## How to use

The examples in this section use Claude Code syntax; see the [Cursor](#cursor) and [GPT Codex](#gpt-codex) mappings below for their native syntax. In Claude Code there are **three ways** to invoke the team.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
/audit .
/init-code .
```
`/vorcl` figures out which sub-agent should own the work and drives the full Task Master cycle. `/audit` auto-detects backend, frontend, mobile, data and infrastructure and writes an evidence-based `PROJECT_AUDIT.md` using all relevant roles. `/init-code` reads the repository statically and creates an evidence-based `PROJECT_DESCRIPTION.md` without executing project code. Once that file exists, every modifying role must keep its affected sections synchronized; proven description drift blocks task completion.

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

Every agent also has its own `/<agent>:vorcl` entry point that runs the Task Master loop scoped to that agent.

### The Task Master loop
Every non-trivial task flows through **Task Master** (`task-master-ai`):

```text
goal → tasks (parse_prd / add_task) → next_task → get_task → expand_task
     → implement → verify (testStrategy) → set_task_status done
```

This keeps work planned, checkpointed, and resumable — nothing is declared "done" without passing its verification step.

---

## The agents

| Agent | Role | Highlights |
| --- | --- | --- |
| 🔵 **architect** | Systems & solution architect | Requirements analysis, system/DB/API design, architecture reviews |
| 🏛️ **principal-architect** | Principal software / infrastructure / AI architect | Scans real code in 11 languages and creates evidence-backed MD, JSON, HTML, PDF, draw.io and Mermaid; full-rescan updates preserve annotations |
| 🟢 **backend** | Backend developer | Node/TS, Postgres, Redis; modular architecture; every route fully covered by OpenAPI |
| 🟣 **frontend** | Frontend (React 19 / Next.js App Router) | Components, state, data-fetching, render/bundle optimization, tests |
| 📱 **expo-mobile** | React Native + Expo engineer | Modular architecture plus Design/Motion/Interaction System, native navigation, tokens, gestures, haptics, Reduced Motion |
| 🟠 **analyzer** | Code auditor (read-only) | Bugs, type safety, DB structure, frontend mocks, backend smells |
| 🧭 **integrity** | Cross-language code integrity auditor (read-only) | Production hardcode and mock/fake/demo/fixture leakage across frontend/backend/mobile/shared |
| 🟡 **swagger** | OpenAPI/Swagger coverage (any stack) | Finds routes not fully documented and covers them, with verification |
| 🔴 **firecrawl** | Web researcher | Live CLI/MCP/REST, app integration and finished web-data workflows |
| 🟤 **render** | Hosting & deploy (Render) | Deploys, log-driven diagnostics, metrics, env vars, Render Postgres |
| 🟦 **database** | DB engineer / DBA | Schema, queries & plans, indexes, N+1, safe reversible migrations, cache |
| ⚪ **resilience** | Reliability: error handling | try/catch at the right boundaries, typed errors, retries/timeouts |
| 🪵 **logging** | Pino structured logging | One root logger in `infrastructure/logging`, child context, redact, requestId, JSON on stdout |
| 🖼️ **screenshot** | Screenshot UI → code | Turns a UI screenshot into production-ready, responsive, accessible code |
| 🎨 **design-studio** | Product & visual design studio | Local HTML artifacts, prototypes, wireframes, decks/PPTX, documents, animation, 3D, design systems and Figma/GitHub/HTML import; adapted from MIT `JimLiu/baoyu-design` |
| 🔎 **visual-research** | Screenshot → verified answer | Identifies the site/page, finds official docs, checks live data and answers with URLs and confidence |
| 🎯 **pinpoint** | Screenshot → place in an existing project (read-only) | Grounds a running-app screenshot in the real codebase — component, `file:line`, route/page, the exact control, and the logic behind it; creates nothing, delegates the edit |
| 📊 **drawio** | Diagrams (draw.io / diagrams.net) | Flowchart, BPMN, UML, ERD, network/cloud, and PMP/PMBOK (WBS, Gantt, RACI…) |
| 🗺️ **archmap** | Architecture cartographer | Deterministic code → `architecture.json` (every node with `source:{file,line}`) → interactive HTML map, draw.io, Mermaid, ARCHITECTURE.md, PDF; unproven facts are marked `inferred` |
| 🧜 **mermaid** | Mermaid diagrams (+ real render) | flowchart, sequence, class, state, ER, gantt, gitGraph, mindmap…; validated via mcp-mermaid/`mmdc`; hands you the file (`.mmd` + SVG/PNG/PDF) |
| 🧪 **testing** | Test & verification engineer | Unit (Vitest/Jest), integration (Supertest), E2E (Playwright), coverage, flaky-test hunting; executes each task's `testStrategy` — nothing is "done" without a green run |
| 🌿 **gitflow** | Git workflow & releases | Conventional Commits, by-name commits (never `git add .`), PRs, Keep-a-Changelog, semver releases; push only with explicit confirmation |
| 🛡️ **security** | Security auditor (read-only) | Secrets in tree & git history, OWASP Top 10, dependency CVEs, PII; findings become tasks — fixes are delegated |
| 📝 **docs** | Documentation engineer | README (multi-language parity), API docs from OpenAPI, ARCHITECTURE, CONTRIBUTING, release notes; every example verified against the code |
| 🐳 **devops** | Containers & CI/CD | Multistage Dockerfiles, docker-compose for local dev, GitHub Actions pipelines, env/secrets hygiene, monitoring |
| 📡 **liveboard** | Local operations board | Live Git worktrees, agent processes and Task Master tasks on an ephemeral localhost dashboard |

**A few things worth knowing:**
- **Frontend always talks to a real API.** The backend's OpenAPI spec is the single source of truth; types are generated from it (`openapi-typescript` + `openapi-fetch`). No mocks in the production path.
- **`database` mutations require explicit confirmation.** Analytics are read-only; schema/data changes (DDL/DML/migrations) never run without your go-ahead.
- **`resilience` ships a safety hook.** A non-blocking `PostToolUse` hook (`catch-guard.js`) gently flags empty `catch {}` blocks in files you just edited.
- **`logging` owns the Pino package.** A second `PostToolUse` hook (`pino-logging/scripts/scan.mjs`) flags local `pino()`, production `console.log`, secrets in payloads, and direct Loki sinks. Full architecture lives in `pino-logging`.
- **`archmap` never draws from imagination.** Extraction and rendering are strictly separated: zero-dependency scripts walk the repo into `architecture.json` (databases with real FK cardinality, API routes, AI agents with their models/tools/memory, import graph, env), and every diagram is rendered from that JSON only. Anything the LLM adds without a verifiable `file:line` is force-marked `inferred:true` and drawn dashed.
- **`principal-architect` is the full architecture publication workflow.** It works in whichever repository launches the agent, ignores Markdown claims as topology evidence, uses bundled offline Tree-sitter WASM for TS/JS, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin and Swift, writes `ARCHITECTURE.md` first, then produces the shared JSON model, self-contained HTML, PDF, native draw.io and copyable Mermaid L0–L4. `update` performs a full rescan and preserves annotations and unmanaged files.
- **`pinpoint` finds, never creates.** Given a screenshot of a running app, it maps the screen to the real code — component, route, the exact control and the logic behind it — and hands the edit to `frontend`/`backend`. It works on what already exists (the inverse of `screenshot`).
- **`visual-research` verifies instead of guessing.** It treats a screenshot as evidence, confirms the official domain and docs, checks current site data, and flags possible phishing or stale values.
- **`i18n` enforces "zero language hardcoding."** Agents first detect whether a project is multilingual and adapt — user-facing strings go through a translation layer (next-intl / react-i18next / i18next), never inline.

---

## Command reference

Every command below is a slash command. `<…>` marks your input.

### `/vorcl` — universal router
| Command | What it does |
| --- | --- |
| `/vorcl <goal>` | Turns any goal into tasks and routes it to the right sub-agent, then runs the full cycle to done. |
| `/audit [path] [focus]` | Deep read-only multi-role audit → detected systems, security/CVE/resilience findings, target architecture and phased `PROJECT_AUDIT.md`. |
| `/init-code [path] [--update]` | Static codebase discovery → evidence-based `PROJECT_DESCRIPTION.md`; project code is never executed. |

### 🔵 architect — architecture
| Command | What it does |
| --- | --- |
| `/architect:vorcl <goal>` | Goal → tasks → cycle, scoped to architecture. |
| `/architect:analyze <context>` | Analyze requirements and the task's context. |
| `/architect:design <problem>` | Design the solution architecture (system, DB, API). |
| `/architect:review <target>` | Review an existing architecture. |

### 🏛️ principal-architect — code-grounded architecture package
| Command | What it does |
| --- | --- |
| `/principal-architect:vorcl <goal>` | Runs a large architecture objective through Task Master and verified artifacts. |
| `/principal-architect:create [options]` | Scans the current repository and creates MD, JSON, HTML, PDF, draw.io and Mermaid from code evidence. |
| `/principal-architect:update [options]` | Full-rescans an existing package, writes an evidence diff and atomically refreshes generated artifacts. |

### 🟢 backend — server (Node/TS, Postgres, Redis)
| Command | What it does |
| --- | --- |
| `/backend:vorcl <goal>` | Goal → tasks → cycle for backend work. |
| `/backend:create-api <endpoint>` | Generate an API endpoint on the modular architecture, fully covered by OpenAPI. |
| `/backend:refactor <target>` | Refactor code without changing behavior. |
| `/backend:optimize <target>` | Performance optimization. |
| `/backend:test <target>` | Generate tests for the code. |

### 🟣 frontend — React / Next.js
| Command | What it does |
| --- | --- |
| `/frontend:vorcl <goal>` | Goal → tasks → cycle for frontend work. |
| `/frontend:create-component <spec>` | Generate a UI component following the feature structure. |
| `/frontend:refactor <target>` | Refactor UI / hooks without changing behavior. |
| `/frontend:optimize <target>` | Optimize render / bundle / Core Web Vitals. |
| `/frontend:test <target>` | Generate component tests. |

### 📱 expo-mobile — React Native / Expo

| Command | What it does |
| --- | --- |
| `/expo-mobile:vorcl <goal>` | Goal → Task Master cycle for Expo mobile work. |
| `/expo-mobile:create-module <domain>` | Create a modular business slice with only the layers its complexity needs. |
| `/expo-mobile:create-screen <flow>` | Create a thin Expo Router route plus a module-owned screen and states. |
| `/expo-mobile:design-screen <flow>` | Build a premium screen with shared design/motion tokens, states and accessibility. |
| `/expo-mobile:motion <interaction>` | Design native navigation, springs, gestures, haptics and reduced-motion fallbacks. |
| `/expo-mobile:add-api <contract>` | Add schema/DTO/mapper/query keys and TanStack Query integration. |
| `/expo-mobile:audit [scope]` | Read-only architecture guard and evidence-based audit. |
| `/expo-mobile:ui-audit [scope]` | Read-only Design System, motion, interaction, accessibility and performance audit. |
| `/expo-mobile:compatibility [app] [change]` | Live read-only Expo/RN/Node/package/native-runtime compatibility audit against versioned official sources. |
| `/expo-mobile:test <scope>` | Run domain unit, React Native Testing Library and Maestro checks. |

### 🟠 analyzer — code audit (read-only)
| Command | What it does |
| --- | --- |
| `/analyzer:vorcl <goal>` | Audit a goal via Task Master — findings become tasks. |
| `/analyzer:audit` | Full audit: bugs, types, DB, frontend mocks, backend smells. |
| `/analyzer:bugs` | Hunt bugs — unhandled errors, race conditions, edge cases. |
| `/analyzer:types` | Type check — `tsc`, `any`, unsafe casts, zod↔types drift. |
| `/analyzer:db` | Audit DB structure — schema, indexes, FKs, N+1, migrations. |
| `/analyzer:mocks` | Compatibility route for mock/fake data on frontend and backend; delegates deep polyglot checks to integrity. |
| `/analyzer:backend` | Find "bad" backend code — architecture violations, logic in controllers. |

### 🧭 integrity — hardcode & mock-data audit (read-only, polyglot)

| Command | What it does |
| --- | --- |
| `/integrity:vorcl <goal>` | Runs a non-trivial integrity objective through Task Master and turns findings into owner-specific tasks. |
| `/integrity:audit [path]` | Scans hardcode and mock leakage together, then proves production reachability. |
| `/integrity:hardcode [path]` | Finds user/config/business literals that bypass localization, configuration, or the system of record. |
| `/integrity:mocks [path]` | Finds mock frameworks, fake generators, fixtures, demo data, and static responses reachable from production. |

The bundled zero-dependency scanner supports TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML and Razor. On backend code it also flags business values hidden in constants, static/final fields, default parameters, named arguments, and static catalogs; the auditor then compares them with schemas/models/repositories/queries/admin mutations to prove that the database—not code or config—owns the value. Tests, fixtures, stories, examples, seeds, generated code, and vendor roots are suppressed by default; lexical candidates are not defects until reachability and ownership are proven.

### 🟡 swagger — OpenAPI/Swagger coverage (any stack)
| Command | What it does |
| --- | --- |
| `/swagger:vorcl <goal>` | Full-coverage goal via Task Master — audit → tasks → cover → verify. |
| `/swagger:audit` | Read-only: find routes not fully covered by the spec. |
| `/swagger:cover <route>` | Cover a route/module — params, responses, descriptions, security + verification. |

### 🔴 firecrawl — web research
| Command | What it does |
| --- | --- |
| `/firecrawl:vorcl <goal>` | Research goal via Task Master — collect web data to a finished result. |
| `/firecrawl:search <query>` | Web search for sources on a question. |
| `/firecrawl:scrape <url>` | Scrape one URL into markdown/JSON. |
| `/firecrawl:map <url>` | Map a site's URLs. |
| `/firecrawl:crawl <url>` | Recursively crawl a section/site. |
| `/firecrawl:extract <url>` | Structured extraction by a JSON schema. |
| `/firecrawl:setup` | Install/verify CLI plus official build and workflow skills (with confirmation). |
| `/firecrawl:interact <url>` | Click, navigate or fill forms when scraping is insufficient. |
| `/firecrawl:parse <file>` | Parse a local/private document into markdown or JSON. |
| `/firecrawl:monitor <action>` | List checks or manage recurring page-change monitors. |
| `/firecrawl:agent <goal>` | Run a bounded long-running Firecrawl Agent task. |
| `/firecrawl:research <query>` | Search papers and GitHub research context. |
| `/firecrawl:ask <jobId>` | Diagnose a failed Firecrawl job. |
| `/firecrawl:docs-search <question>` | Search current official Firecrawl documentation. |
| `/firecrawl:integrate <feature>` | Add Firecrawl to application code via upstream build skills. |
| `/firecrawl:deliverable <artifact>` | Produce a brief, audit, lead list or other workflow artifact. |

`/firecrawl:setup` runs the official `firecrawl-cli init --all` flow only after confirmation. Existing official `firecrawl-*` skills take precedence and are preserved by the Codex/Cursor installer; AVF supplies compatible fallbacks for missing skills. Live operations route through CLI → MCP → REST/keyless.

### 🟤 render — hosting / deploy (Render)
| Command | What it does |
| --- | --- |
| `/render:vorcl <goal>` | Infra goal via Task Master — deploy/diagnose/configure to done. |
| `/render:deploy <service>` | Deploy / redeploy a service. |
| `/render:logs <service>` | Service logs and diagnostics down to root cause. |
| `/render:status <service>` | Service status + deploy + metrics. |
| `/render:query <sql>` | Read-only SQL against Render Postgres. |

### 🟦 database — DB engineer / DBA (Postgres / MongoDB / Redis)
| Command | What it does |
| --- | --- |
| `/database:vorcl <goal>` | Data goal via Task Master — schema/queries/migrations/cache to done. |
| `/database:query <query>` | Read-only query / analytics. |
| `/database:schema <target>` | Design / review schema and data integrity. |
| `/database:migrate <change>` | Plan a safe, reversible schema/data migration. |
| `/database:optimize <target>` | Optimize — indexes, N+1, query plans, pagination. |
| `/database:cache <target>` | Redis — TTL, invalidation, locks, rate limiting, Streams. |

### ⚪ resilience — error handling + logging
| Command | What it does |
| --- | --- |
| `/resilience:vorcl <goal>` | Reliability goal via Task Master — cover code with try/catch + logs. |
| `/resilience:harden <target>` | Wrap code in try/catch/finally with solid logging, no silent failures. |
| `/resilience:logging <target>` | Add/fix structured logging — levels, context, no secrets/PII. |
| `/resilience:audit` | Read-only: find silent failures, empty catches, logging gaps. |

### 🪵 logging — Pino structured logging
| Command | What it does |
| --- | --- |
| `/logging:vorcl <goal>` | Logging goal via Task Master — cover or update the Pino package. |
| `/logging:audit [path]` | Read-only: one root logger, child context, redact, no console/Loki sink. |
| `/logging:cover <target>` | Create `infrastructure/logging` and cover a module/worker/route. |
| `/logging:update <target>` | Bring legacy `pino()`/`console.log` to the canonical package. |

### 🖼️ screenshot — screenshot UI → code
| Command | What it does |
| --- | --- |
| `/screenshot:vorcl <goal>` | A set of screens from screenshots via Task Master — breakdown → code. |
| `/screenshot:analyze <image>` | Read-only breakdown — layout, components, tokens, states → plan. |
| `/screenshot:convert <image> [framework]` | Generate full runnable code from a screenshot (default React + Tailwind v4). |
| `/screenshot:tokens <image>` | Extract design tokens (OKLCH colors, typography, spacing) into Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Make the generated UI responsive — breakpoints, fluid, `clamp()`, container queries. |

### 🎨 design-studio — product and visual design
| Command | What it does |
| --- | --- |
| `/design-studio:vorcl <goal>` | Full design goal through Task Master — context → variants → HTML → preview → verification → export. |
| `/design-studio:create <brief>` | Create a polished self-contained visual artifact or hi-fi UI. |
| `/design-studio:prototype <flow>` | Build an interactive web/mobile prototype with states and transitions. |
| `/design-studio:wireframe <flow>` | Build a low-fi wireframe focused on information architecture and UX. |
| `/design-studio:design-system <operation>` | Create, import, compile, bind, refresh or check a design system. |
| `/design-studio:import <type> <source>` | Import Figma `.fig`, GitHub or HTML/CSS with provenance. |
| `/design-studio:deck <brief>` | Build an HTML deck with speaker notes, animations and optional editable PPTX. |
| `/design-studio:document <brief>` | Build a print-ready document, résumé, memo, one-pager or report. |
| `/design-studio:animation <brief>` | Build a motion artifact and optionally render it to MP4. |
| `/design-studio:research <question>` | Create a source-backed visual research artifact. |
| `/design-studio:export <project> <format>` | Export to standalone HTML, PDF, PPTX, MP4 or a handoff format. |
| `/design-studio:review <target>` | Read-only visual, UX, responsive, a11y and design-system review. |

### 🔎 visual-research — screenshot → verified web answer
| Command | What it does |
| --- | --- |
| `/visual-research:vorcl <goal>` | Multi-step screenshot research through Task Master. |
| `/visual-research:identify <image>` | Identify the site, page and feature with confidence evidence. |
| `/visual-research:search <image> <target>` | Find the real page or official documentation from visual clues. |
| `/visual-research:answer <image> <question>` | Answer using screenshot evidence, official docs and current live data. |
| `/visual-research:hints <image> <goal>` | Give safe, documentation-backed steps for the visible interface. |

### 🎯 pinpoint — screenshot → place in an existing project (read-only)
| Command | What it does |
| --- | --- |
| `/pinpoint:vorcl <goal>` | Find/understand/change existing UI from a screenshot via Task Master — map → tasks → delegate. |
| `/pinpoint:locate <image>` | Locate the existing component/file(s) from a screenshot — `file:line`, no new code. |
| `/pinpoint:route <image>` | Identify the route/page the screen is on (Next.js App/Pages Router, React Router). |
| `/pinpoint:control <image>` | Pinpoint the exact control (button/field) and its handler in the code. |
| `/pinpoint:trace <target>` | Trace the logic behind an element — handler → state → data-fetch → API. |
| `/pinpoint:handoff <change>` | Build a precise edit request against existing code and delegate to `frontend`/`backend`. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Command | What it does |
| --- | --- |
| `/drawio:vorcl <goal>` | A set of diagrams via Task Master — build to done. |
| `/drawio:create <description> [type]` | Build a diagram from a text description (valid native XML). |
| `/drawio:pmp <type> <project>` | Build a PMP/PMBOK diagram — WBS, PERT/CPM, Gantt, RACI, risk matrix, stakeholder grid. |
| `/drawio:convert <source> [type]` | Convert a source to a diagram — DB schema → ERD, folders → tree, code → UML, mermaid/CSV/JSON. |
| `/drawio:refine <file>` | Refine an existing `.drawio` — layout, theme, add/remove nodes, align to grid. |

### 🗺️ archmap — architecture map from code

| Command | What it does |
| --- | --- |
| `/archmap:vorcl <goal>` | A mapping goal via Task Master — build to a verified artifact set. |
| `/archmap:map [repo]` | Full pipeline: extraction → `architecture.json` → LLM annotation → all formats (HTML, draw.io, Mermaid, ARCHITECTURE.md, PDF). |
| `/archmap:extract [repo]` | Extraction only — machine-readable `architecture.json` with `source:{file,line}` on every node. |
| `/archmap:annotate [json]` | LLM enrichment of an existing `architecture.json` (agent memory, dataflow semantics); unproven facts auto-demoted to `inferred`. |
| `/archmap:html [json]` | Interactive self-contained HTML map — layer toggles, trace beams, node → `file:line` panel, search, print CSS. |
| `/archmap:diagram [json] [drawio\|mermaid]` | draw.io (multi-page: Overview / ERD / API / Agents) and/or Mermaid views, validated. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Command | What it does |
| --- | --- |
| `/mermaid:vorcl <goal>` | A set of diagrams via Task Master — build to done (render-verified). |
| `/mermaid:create <description> [type]` | Build a diagram from a description — valid syntax, verified by a real render; hands you the file. |
| `/mermaid:convert <source> [type]` | Convert a source to Mermaid — DB schema → ER, code → class/sequence, folders → flowchart, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Syntax + real render-test; find and fix errors (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Export to SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Refine an existing `.mmd` — direction, subgraph, classDef/styles, readability. |

### 🧪 testing — tests & verification
| Command | What it does |
| --- | --- |
| `/testing:vorcl <goal>` | A testing/verification goal via Task Master — unit + integration + e2e to done. |
| `/testing:unit <file\|module>` | Unit tests (Vitest/Jest) — happy path, boundaries, errors; runs them and shows the output. |
| `/testing:integration <endpoint\|module>` | Integration tests (Supertest/inject, real DB or testcontainers). |
| `/testing:e2e <scenario>` | Playwright E2E for a critical user path — role selectors, fixtures, trace on failure. |
| `/testing:verify <task\|testStrategy>` | Executes a task's `testStrategy` and returns a READY / NOT READY verdict with real output. |
| `/testing:coverage [path]` | Coverage report with findings — what critical code is untested; creates tasks. |
| `/testing:flaky <test>` | Diagnoses an unstable test (race, timing, shared state, mocks) and fixes it for good. |

### 🌿 gitflow — git workflow & releases
| Command | What it does |
| --- | --- |
| `/gitflow:vorcl <goal>` | A git/release goal via Task Master (prepare a release, clean up history, feature branch). |
| `/gitflow:commit <files\|scope>` | A by-name commit (never `git add .`) with a Conventional Commits message; stops on unknown WIP. |
| `/gitflow:pr <base> <title>` | Branch → commits → pull request (gh / GitHub MCP) with what/why/how-verified. |
| `/gitflow:changelog [version]` | CHANGELOG.md (Keep a Changelog) generated from commits between tags. |
| `/gitflow:release <version\|auto>` | Semver from commits → sync manifest versions → tag → GitHub release. Push only after explicit confirmation. |
| `/gitflow:audit [branch]` | Read-only history audit: convention violations, dump commits, big blobs, orphan branches. |

### 🛡️ security — security audit (read-only)
| Command | What it does |
| --- | --- |
| `/security:vorcl <goal>` | A security goal via Task Master — audit → findings → tasks → delegated fixes. |
| `/security:secrets [path\|branch]` | Secrets in the working tree AND git history (all branches); `${VAR:-}` placeholders are not secrets. |
| `/security:owasp [path]` | OWASP Top 10 in the code: injections, XSS, auth, data exposure, CORS/cookies — with file:line proof. |
| `/security:deps` | Dependency CVEs via npm audit / lockfiles — severity, breaking-change flags. |
| `/security:pii [path]` | PII/GDPR risks: emails, phones, cards in code and logs; developer's private paths. |
| `/security:pre-push [branch]` | Fast combined check of changed files before a push: secrets + injections + PII; green/red verdict. |

### 📝 docs — documentation
| Command | What it does |
| --- | --- |
| `/docs:vorcl <goal>` | A documentation goal via Task Master. |
| `/docs:readme [path]` | Create/update README — what/quickstart/usage/config/troubleshooting; examples verified; language versions synced. |
| `/docs:api [spec]` | API docs generated from the OpenAPI spec (endpoints, params, curl examples); suggests `/swagger:audit` if no spec. |
| `/docs:architecture` | ARCHITECTURE.md — modules, boundaries, data flow; diagrams delegated to `mermaid`/`drawio`. |
| `/docs:contributing` | CONTRIBUTING.md — setup, structure, tests, commit conventions (aligned with `gitflow`), PR process. |
| `/docs:release-notes <version>` | Release notes for a version from CHANGELOG/history. |
| `/docs:audit` | Read-only docs↔code drift check: broken links, stale examples/counters, unsynced translations. |

### 🐳 devops — containers & CI/CD
| Command | What it does |
| --- | --- |
| `/devops:vorcl <goal>` | An infrastructure goal via Task Master. |
| `/devops:dockerfile [app-type]` | Write/review a Dockerfile — multistage, slim base, non-root, HEALTHCHECK; verified by a real `docker build`. |
| `/devops:compose` | docker-compose.yml for local dev (app + DBs); env changes need `--force-recreate`, waits for healthy. |
| `/devops:ci [type]` | GitHub Actions — PR workflow (lint+typecheck+test, npm cache), deploy workflow, minimal permissions. |
| `/devops:env` | Env-variable inventory: where read, what's required, `.env.example` template; secrets never in images. |
| `/devops:monitoring` | Structured logs (pino/JSON), health endpoint, what to alert on; Render metrics via the `render` agent. |

### 📡 liveboard — ephemeral local operations board
| Command | What it does |
| --- | --- |
| `/liveboard:start [path] [--port N] [--interval ms]` | Start a polished 43-language dashboard on a free localhost port; Task Master changes stream through SSE and reconcile every 5 minutes. |
| `/liveboard:vorcl <goal>` | Develop or change liveboard itself through the required Task Master workflow. |

Liveboard reads Git worktrees, local Claude/Codex/Cursor processes and each worktree's `.taskmaster/tasks/tasks.json`. Runtime state stays in memory and disappears when the foreground process stops. The UI detects the browser language and offers 43 locales, including English, Russian, Ukrainian, German, French, Spanish, Portuguese, Italian, Polish, Turkish, Chinese, Japanese, Arabic, Dutch, Czech, Slovak, Romanian, Hungarian, Bulgarian, Serbian, Croatian, Slovenian, Greek, Hebrew, Persian, Hindi, Bengali, Urdu, Indonesian, Malay, Vietnamese, Thai, Korean, Swedish, Norwegian, Danish, Finnish, Estonian, Latvian, Lithuanian, Georgian, Armenian, and Azerbaijani. Arabic, Hebrew, Persian, and Urdu use RTL layout.

Direct configuration:

```bash
node skills/liveboard/scripts/server.mjs \
  --root /path/to/project \
  --host 127.0.0.1 \
  --port 0 \
  --interval 300000
```

- `--root`: project whose Git worktrees and Task Master files are scanned.
- `--port 0`: automatically select a free port.
- `--interval`: full reconciliation interval in milliseconds; file watching still streams Task Master changes immediately.
- Endpoints: `/health`, `/api/snapshot`, `/api/events` (SSE), and `POST /api/refresh`.
- Keep `--host 127.0.0.1` unless you explicitly intend to expose project information to the network.

---

## Configuration (MCP & keys)

The package has **no remote backend or database**. The optional liveboard is a localhost-only in-memory process. MCP servers need tokens, and **each user provides their own**. To make this work identically across **Claude Code, Codex, Cursor and Kimi CLI** — and whether you launch from a terminal or from Dock / Spotlight / an IDE — every stdio MCP server is started through a small launcher (`bin/mcp-env.mjs`) that reads your keys from **one file**:

```
~/.config/agent-vorcl-flow/.env          # Windows: %APPDATA%\agent-vorcl-flow\.env
```

The installer creates it from [`.env.example`](./.env.example). Open it and fill in only the keys you use:

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

> **Why a launcher instead of `~/.zshrc`?** Env-var expansion differs per runtime (`${VAR:-}` in Claude, `${env:VAR}` in Cursor, literals in Codex/Kimi) and each runtime reads only the environment **it** was launched in. GUI / IDE launches on macOS don't source `~/.zshrc`, so exported keys are invisible and the servers connect to nothing — the classic "MCP env not set" failure. Reading from one `.env` file removes both problems at once.

**Precedence** (later wins): the shared `~/.config/agent-vorcl-flow/.env` → a `./.env` in the project root → a real `export` in your shell. Keep global keys in the shared file, override per-project (e.g. a different `MONGODB_URI`) with a project `.env`, and a genuine shell export still wins for CLI runs. You can point the launcher at a different file with `AGENT_VORCL_ENV_FILE=/path/.env`.

A server whose required key is missing simply **does not start** — you'll see a one-line `[agent-vorcl-flow] MCP «…» is not configured: …` in the runtime's MCP log, and every other server keeps working. Add the key to `.env` and restart. (You may keep `GITHUB_TOKEN`/`MONGODB_URI` names — the launcher maps them to the `GITHUB_PERSONAL_ACCESS_TOKEN`/`MDB_MCP_CONNECTION_STRING` the servers expect.)

> ⚠️ **Required for AI-powered Task Master commands:** configure at least one selected provider — `ANTHROPIC_API_KEY` for Claude, `OPENAI_API_KEY` for GPT, or Codex CLI OAuth. Without credentials for the model selected in `.taskmaster/config.json`, `/vorcl` cannot generate or expand tasks.

Choose which Task Master provider actually runs generation; keys alone do not select the model:

```bash
/task-master:provider anthropic <model-id>   # Claude via ANTHROPIC_API_KEY
/task-master:provider openai <model-id>      # GPT via OPENAI_API_KEY
/task-master:provider codex-cli <model-id>   # ChatGPT OAuth via `codex login`
```

The command uses the official `task-master models` flow and stores only model selection in `.taskmaster/config.json`. `PERPLEXITY_API_KEY` is optional and only needed when Perplexity is selected as the research model.

The remote **vercel** and **render** servers use OAuth (authorize with `/mcp` in a browser). For Render in headless/CI, set `RENDER_API_KEY` in your environment and add a Bearer header entry to that server for your runtime.

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

The repository now includes a native Codex plugin manifest at `.codex-plugin/plugin.json`. The npm installer remains available and installs the same capabilities as **skills**, **profiles**, and an `AGENTS.md` router for Codex CLI, Cursor, and Kimi:

| Claude Code | Codex equivalent |
| --- | --- |
| sub-agent `@agent-vorcl-flow:frontend` | skill persona `$frontend` + `codex --profile frontend` |
| command `/analyzer:audit` | task skill `$analyzer-audit` |
| command `/vorcl` | task skill `$vorcl` |
| `.mcp.json` | `[mcp_servers.*]` in `config.toml` |
| `SessionStart` hook | role routing in `AGENTS.md` |

```bash
codex
> $vorcl  add a shopping cart to checkout
> $backend-create-api  POST /invoices
> $analyzer-audit
codex --profile analyzer     # a role with higher reasoning effort
```

See [`codex/README.md`](./codex/README.md) for the full mapping.

---

## Cursor

Cursor uses the same open `SKILL.md` format as the Codex adapter, plus native custom subagents and global MCP configuration:

| Agent-Vorcl-Flow concept | Cursor equivalent |
| --- | --- |
| role `backend` | custom subagent `/avf-backend` in `~/.cursor/agents` |
| task command `/backend:create-api` | skill `/backend-create-api` |
| universal `/vorcl` | skill `/vorcl` |
| `.mcp.json` | merged servers in `~/.cursor/mcp.json` |

The installer converts role definitions to Cursor frontmatter, prefixes subagents with `avf-` to avoid skill-name collisions, uses `model: inherit`, and marks audit-only agents as `readonly: true`. Existing MCP server entries with the same names are preserved. See [`cursor/README.md`](./cursor/README.md).

---

## Kimi CLI

[Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI) natively loads Agent Skills, custom agent files and lifecycle hooks; AVF also merges the same MCP servers used by Claude and Cursor:

| Agent-Vorcl-Flow concept | Kimi CLI equivalent |
| --- | --- |
| skills / task commands | `~/.kimi/skills` and `/skill:<name>` |
| Expo custom agent | `kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml` |
| Expo PostToolUse guard | merged into `~/.kimi/config.toml` |
| `.mcp.json` | merged servers in `~/.kimi/mcp.json` |
| per-runtime key file | the shared `~/.config/agent-vorcl-flow/.env` (via the launcher) |

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
kimi mcp list          # verify connected servers
kimi mcp test github   # check a server's connection and tools
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Kimi CLI has no `${VAR}` expansion in `mcp.json`, so keys come from the shared `.env` through the launcher — exactly like the other runtimes. See [`kimi/README.md`](./kimi/README.md).

---

## Project structure

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       26 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (75 skills; some ship references, scripts, tests or HTML assets)
commands/     <namespace>/<command>.md    (154 commands, /namespace:command, including /vorcl and /audit)
hooks/        hooks.json + SessionStart + PostToolUse guards (empty catch, Pino logging, Expo architecture/UI boundaries)
.mcp.json     github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, mermaid
.env.example  template for ~/.config/agent-vorcl-flow/.env (single key file for all runtimes)
translations/ localized README files (21 translations)
bin/          install.mjs (the npx installer) + mcp-env.mjs (cross-runtime MCP launcher / .env loader)
codex/        GPT Codex adapter (skills + config.toml + install.sh)
cursor/       Cursor adapter (MCP template + installation notes)
kimi/         Kimi CLI adapter (skills install + Expo agent/hook + MCP)
```

**How it fits together:** `agents/*.md` declare a role and, in front-matter `skills:`, attach skills → skills in `skills/*/SKILL.md` are auto-loaded by description → `commands/<agent>/*.md` provide quick `/agent:command` shortcuts that delegate to the sub-agent → `.mcp.json` gives agents their tools, each started through `bin/mcp-env.mjs` which loads secrets from the shared `.env`. A `SessionStart` hook tells Claude the agents are available.

---

## License

MIT — free to use, copy, modify, and distribute; provided "as is", with no warranty and no liability. See [LICENSE](./LICENSE).

© 2026 Christian Avis (Vorcl).
