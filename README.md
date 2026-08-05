<div align="center">

# Agent-Vorcl-Flow

**A team of specialized AI sub-agents for [Claude Code](https://claude.com/claude-code) — with skills, slash commands, and MCP tools.**
One `npx` command installs them. No backend, no hosting — Claude Code runs everything. A **GPT Codex** adapter is included too.

![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-6C5CE7)
![GPT Codex](https://img.shields.io/badge/GPT%20Codex-adapter-1abc9c)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)
![Agents](https://img.shields.io/badge/agents-11-blue)
![Commands](https://img.shields.io/badge/commands-55%2B-blue)
![License](https://img.shields.io/badge/license-proprietary-important)

🌐 [Русская версия](./README.ru.md)

</div>

---

## What is this?

Agent-Vorcl-Flow turns Claude Code into a **structured engineering team**. Instead of one general assistant, you get **12 focused sub-agents** (architect, backend, frontend, DB engineer, code auditor, and more), each with its own domain **skills**, quick **slash commands**, and the **MCP tools** it needs. Every non-trivial task runs through a disciplined **Task Master** loop — *goal → tasks → implement → verify → done* — so work is planned, tracked, and survives interruptions.

- 🧩 **11 sub-agents**, 27 skills, 55+ slash commands
- ⚡ **One-command install** for Claude Code and/or Codex — `npx`
- 🔌 **10 MCP servers** wired in (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, filesystem, Task Master)
- 🔑 **Bring your own keys** via environment variables — the plugin hosts nothing
- 🤝 **Runs on Claude Code and GPT Codex** from the same source

---

## Quick start

### Requirements
- **Node.js ≥ 18**
- **[Claude Code](https://claude.com/claude-code)** and/or **[GPT Codex](https://developers.openai.com/codex/cli/)** CLI installed and on your `PATH`

### Install (one command)

```bash
# Installs into Claude Code AND/OR Codex — whichever is found on your PATH:
npx github:Vitammiin/agent-vorcl-flow
```

Target a single runtime with a flag:

```bash
npx github:Vitammiin/agent-vorcl-flow --claude   # Claude Code only
npx github:Vitammiin/agent-vorcl-flow --codex    # GPT Codex only
```

What the installer does:

| Runtime | Action |
| --- | --- |
| **Claude Code** | Registers this repo as a plugin **marketplace** and enables the plugin (via `claude plugin …`, with a direct `~/.claude/settings.json` fallback). |
| **GPT Codex** | Merges the skills into `~/.agents/skills` and the `config.toml` + `AGENTS.md` blocks into `~/.codex` (idempotent, between markers). |

> The installer never touches your secrets — you set your own keys via env (see [Configuration](#configuration-mcp--keys)).

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

There are **three ways** to invoke the team. Pick whichever fits.

### 1. Universal entry point — just state a goal
```text
/vorcl add a shopping cart to checkout
```
`/vorcl` figures out which sub-agent should own the work and drives the full Task Master cycle.

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
| 🟢 **backend** | Backend developer | Node/TS, Postgres, Redis; modular architecture; every route fully covered by OpenAPI |
| 🟣 **frontend** | Frontend (React 19 / Next.js App Router) | Components, state, data-fetching, render/bundle optimization, tests |
| 🟠 **analyzer** | Code auditor (read-only) | Bugs, type safety, DB structure, frontend mocks, backend smells |
| 🟡 **swagger** | OpenAPI/Swagger coverage (any stack) | Finds routes not fully documented and covers them, with verification |
| 🔴 **firecrawl** | Web researcher | Search, scrape, map, crawl, structured extraction — LLM-ready output |
| 🟤 **render** | Hosting & deploy (Render) | Deploys, log-driven diagnostics, metrics, env vars, Render Postgres |
| 🟦 **database** | DB engineer / DBA | Schema, queries & plans, indexes, N+1, safe reversible migrations, cache |
| ⚪ **resilience** | Reliability: errors + logging | try/catch at the right boundaries, typed errors, retries/timeouts, structured logs |
| 🖼️ **screenshot** | Screenshot UI → code | Turns a UI screenshot into production-ready, responsive, accessible code |
| 📊 **drawio** | Diagrams (draw.io / diagrams.net) | Flowchart, BPMN, UML, ERD, network/cloud, and PMP/PMBOK (WBS, Gantt, RACI…) |
| 🧜 **mermaid** | Mermaid diagrams (+ real render) | flowchart, sequence, class, state, ER, gantt, gitGraph, mindmap…; validated via mcp-mermaid/`mmdc`; hands you the file (`.mmd` + SVG/PNG/PDF) |

**A few things worth knowing:**
- **Frontend always talks to a real API.** The backend's OpenAPI spec is the single source of truth; types are generated from it (`openapi-typescript` + `openapi-fetch`). No mocks in the production path.
- **`database` mutations require explicit confirmation.** Analytics are read-only; schema/data changes (DDL/DML/migrations) never run without your go-ahead.
- **`resilience` ships a safety hook.** A non-blocking `PostToolUse` hook (`catch-guard.js`) gently flags empty `catch {}` blocks in files you just edited.
- **`i18n` enforces "zero language hardcoding."** Agents first detect whether a project is multilingual and adapt — user-facing strings go through a translation layer (next-intl / react-i18next / i18next), never inline.

---

## Command reference

Every command below is a slash command. `<…>` marks your input.

### `/vorcl` — universal router
| Command | What it does |
| --- | --- |
| `/vorcl <goal>` | Turns any goal into tasks and routes it to the right sub-agent, then runs the full cycle to done. |

### 🔵 architect — architecture
| Command | What it does |
| --- | --- |
| `/architect:vorcl <goal>` | Goal → tasks → cycle, scoped to architecture. |
| `/architect:analyze <context>` | Analyze requirements and the task's context. |
| `/architect:design <problem>` | Design the solution architecture (system, DB, API). |
| `/architect:review <target>` | Review an existing architecture. |

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

### 🟠 analyzer — code audit (read-only)
| Command | What it does |
| --- | --- |
| `/analyzer:vorcl <goal>` | Audit a goal via Task Master — findings become tasks. |
| `/analyzer:audit` | Full audit: bugs, types, DB, frontend mocks, backend smells. |
| `/analyzer:bugs` | Hunt bugs — unhandled errors, race conditions, edge cases. |
| `/analyzer:types` | Type check — `tsc`, `any`, unsafe casts, zod↔types drift. |
| `/analyzer:db` | Audit DB structure — schema, indexes, FKs, N+1, migrations. |
| `/analyzer:mocks` | Find mockup / fake data on the frontend. |
| `/analyzer:backend` | Find "bad" backend code — architecture violations, logic in controllers. |

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

### 🖼️ screenshot — screenshot UI → code
| Command | What it does |
| --- | --- |
| `/screenshot:vorcl <goal>` | A set of screens from screenshots via Task Master — breakdown → code. |
| `/screenshot:analyze <image>` | Read-only breakdown — layout, components, tokens, states → plan. |
| `/screenshot:convert <image> [framework]` | Generate full runnable code from a screenshot (default React + Tailwind v4). |
| `/screenshot:tokens <image>` | Extract design tokens (OKLCH colors, typography, spacing) into Tailwind `@theme`. |
| `/screenshot:responsive <target>` | Make the generated UI responsive — breakpoints, fluid, `clamp()`, container queries. |

### 📊 drawio — diagrams (draw.io / diagrams.net)
| Command | What it does |
| --- | --- |
| `/drawio:vorcl <goal>` | A set of diagrams via Task Master — build to done. |
| `/drawio:create <description> [type]` | Build a diagram from a text description (valid native XML). |
| `/drawio:pmp <type> <project>` | Build a PMP/PMBOK diagram — WBS, PERT/CPM, Gantt, RACI, risk matrix, stakeholder grid. |
| `/drawio:convert <source> [type]` | Convert a source to a diagram — DB schema → ERD, folders → tree, code → UML, mermaid/CSV/JSON. |
| `/drawio:refine <file>` | Refine an existing `.drawio` — layout, theme, add/remove nodes, align to grid. |

### 🧜 mermaid — Mermaid diagrams (+ real render)
| Command | What it does |
| --- | --- |
| `/mermaid:vorcl <goal>` | A set of diagrams via Task Master — build to done (render-verified). |
| `/mermaid:create <description> [type]` | Build a diagram from a description — valid syntax, verified by a real render; hands you the file. |
| `/mermaid:convert <source> [type]` | Convert a source to Mermaid — DB schema → ER, code → class/sequence, folders → flowchart, `.drawio`/CSV/JSON. |
| `/mermaid:validate <file>` | Syntax + real render-test; find and fix errors (mmdc / Maid / mcp-mermaid). |
| `/mermaid:render <file> [format] [theme]` | Export to SVG/PNG/PDF (mermaid-cli / Kroki / Mermaid.ink). |
| `/mermaid:refine <file>` | Refine an existing `.mmd` — direction, subgraph, classDef/styles, readability. |

---

## Configuration (MCP & keys)

The plugin **hosts nothing** — it has no backend or database of its own. Its MCP servers just need tokens, and **each user provides their own via environment variables**. `.mcp.json` reads them with the `${VAR:-}` form, and Claude Code takes the values from the environment it was launched in.

Export the ones you actually use (for example in `~/.zshrc`):

```bash
export ANTHROPIC_API_KEY=…     # Task Master (parse_prd / expand)
export FIRECRAWL_API_KEY=…     # firecrawl web research
export GITHUB_TOKEN=…          # github MCP
export PERPLEXITY_API_KEY=…    # optional: Task Master research mode

# For the `database` agent — these point at YOUR project's DB, not the plugin's:
export POSTGRES_URL=…          # postgres://user:pass@host:5432/db
export MONGODB_URI=…           # mongodb://user:pass@host:27017/db
export REDIS_URL=…             # redis://host:6379
```

An unset key simply means that MCP server stays quiet — everything else keeps working.

The remote **vercel** and **render** servers use OAuth (authorize with `/mcp` in a browser). For Render in headless/CI you can set `RENDER_API_KEY` and switch its entry to a header form: `"headers": { "Authorization": "Bearer ${RENDER_API_KEY:-}" }`.

---

## Verify the install

```bash
claude plugin validate . --strict      # validate the manifest and components
/plugin details agent-vorcl-flow       # list the loaded agents / skills / commands
@agent-vorcl-flow:architect            # the sub-agent appears in the typeahead
/architect:analyze billing for a SaaS  # run a slash command
```

---

## GPT Codex

Codex has no "plugins," so the same capabilities are expressed as **skills**, **profiles**, and an `AGENTS.md` router:

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

## Project structure

```text
.claude-plugin/plugin.json      # plugin manifest
.claude-plugin/marketplace.json # local marketplace (for install)
agents/       12 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (29 skills)
commands/     <namespace>/<command>.md    (61 commands, /namespace:command) + /vorcl
hooks/        hooks.json + session-start.js + catch-guard.js (PostToolUse: empty catch)
.mcp.json     github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, mermaid
bin/          install.mjs                 (the npx installer)
codex/        GPT Codex adapter (skills + config.toml + install.sh)
```

**How it fits together:** `agents/*.md` declare a role and, in front-matter `skills:`, attach skills → skills in `skills/*/SKILL.md` are auto-loaded by description → `commands/<agent>/*.md` provide quick `/agent:command` shortcuts that delegate to the sub-agent → `.mcp.json` gives agents their tools. A `SessionStart` hook tells Claude the agents are available.

---

## License

Proprietary — **use only**. Everyone may install and use it freely (personal or commercial), but copying/redistribution and modification are not permitted; provided "as is", with no warranty and no liability. See [LICENSE](./LICENSE).

© 2026 Christian Avis and Vorcl.
