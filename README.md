<div align="center">

# Agent-Vorcl-Flow

**A team of specialized AI sub-agents for [Claude Code](https://claude.com/claude-code) — with skills, slash commands, and MCP tools.**
One `npx` command installs them. No backend, no hosting — Claude Code runs everything. A **GPT Codex** adapter is included too.

![Claude Code](https://img.shields.io/badge/Claude%20Code-plugin-6C5CE7)
![GPT Codex](https://img.shields.io/badge/GPT%20Codex-adapter-1abc9c)
![Node](https://img.shields.io/badge/node-%E2%89%A518-339933?logo=node.js&logoColor=white)
![Agents](https://img.shields.io/badge/agents-18-blue)
![Commands](https://img.shields.io/badge/commands-99-blue)
![License](https://img.shields.io/badge/license-MIT-green)

🌐 [Русская версия](./README.ru.md)

</div>

---

## What is this?

Agent-Vorcl-Flow turns Claude Code into a **structured engineering team**. Instead of one general assistant, you get **18 focused sub-agents** (architect, backend, frontend, DB engineer, code auditor, test engineer, and more), each with its own domain **skills**, quick **slash commands**, and the **MCP tools** it needs. Every non-trivial task runs through a disciplined **Task Master** loop — *goal → tasks → implement → verify → done* — so work is planned, tracked, and survives interruptions.

- 🧩 **18 sub-agents**, 38 skills, 99 slash commands
- ⚡ **One-command install** for Claude Code and/or Codex — `npx`
- 🔌 **11 MCP servers** wired in (GitHub, Postgres, MongoDB, Redis, Docker, Firecrawl, Vercel, Render, filesystem, Task Master, Mermaid)
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
| 🎯 **pinpoint** | Screenshot → place in an existing project (read-only) | Grounds a running-app screenshot in the real codebase — component, `file:line`, route/page, the exact control, and the logic behind it; creates nothing, delegates the edit |
| 📊 **drawio** | Diagrams (draw.io / diagrams.net) | Flowchart, BPMN, UML, ERD, network/cloud, and PMP/PMBOK (WBS, Gantt, RACI…) |
| 🧜 **mermaid** | Mermaid diagrams (+ real render) | flowchart, sequence, class, state, ER, gantt, gitGraph, mindmap…; validated via mcp-mermaid/`mmdc`; hands you the file (`.mmd` + SVG/PNG/PDF) |
| 🧪 **testing** | Test & verification engineer | Unit (Vitest/Jest), integration (Supertest), E2E (Playwright), coverage, flaky-test hunting; executes each task's `testStrategy` — nothing is "done" without a green run |
| 🌿 **gitflow** | Git workflow & releases | Conventional Commits, by-name commits (never `git add .`), PRs, Keep-a-Changelog, semver releases; push only with explicit confirmation |
| 🛡️ **security** | Security auditor (read-only) | Secrets in tree & git history, OWASP Top 10, dependency CVEs, PII; findings become tasks — fixes are delegated |
| 📝 **docs** | Documentation engineer | README (multi-language parity), API docs from OpenAPI, ARCHITECTURE, CONTRIBUTING, release notes; every example verified against the code |
| 🐳 **devops** | Containers & CI/CD | Multistage Dockerfiles, docker-compose for local dev, GitHub Actions pipelines, env/secrets hygiene, monitoring |

**A few things worth knowing:**
- **Frontend always talks to a real API.** The backend's OpenAPI spec is the single source of truth; types are generated from it (`openapi-typescript` + `openapi-fetch`). No mocks in the production path.
- **`database` mutations require explicit confirmation.** Analytics are read-only; schema/data changes (DDL/DML/migrations) never run without your go-ahead.
- **`resilience` ships a safety hook.** A non-blocking `PostToolUse` hook (`catch-guard.js`) gently flags empty `catch {}` blocks in files you just edited.
- **`pinpoint` finds, never creates.** Given a screenshot of a running app, it maps the screen to the real code — component, route, the exact control and the logic behind it — and hands the edit to `frontend`/`backend`. It works on what already exists (the inverse of `screenshot`).
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

---

## Configuration (MCP & keys)

The plugin **hosts nothing** — it has no backend or database of its own. Its MCP servers just need tokens, and **each user provides their own via environment variables**. `.mcp.json` reads them with the `${VAR:-}` form, and Claude Code takes the values from the environment it was launched in.

> ⚠️ **Required for the core loop:** `ANTHROPIC_API_KEY`. The Task Master MCP server (goal → tasks, `parse_prd`, `add_task`, `expand_task`) silently does nothing without it — agents will still work, but `/vorcl` won't be able to turn goals into tracked tasks.

Export the ones you actually use (for example in `~/.zshrc`):

```bash
export ANTHROPIC_API_KEY=…     # REQUIRED: Task Master (parse_prd / expand)
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
agents/       18 sub-agent definitions (*.md)
skills/       <skill>/SKILL.md            (38 skills)
commands/     <namespace>/<command>.md    (99 commands, /namespace:command) + /vorcl
hooks/        hooks.json + session-start.js + catch-guard.js (PostToolUse: empty catch)
.mcp.json     github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, mermaid
bin/          install.mjs                 (the npx installer)
codex/        GPT Codex adapter (skills + config.toml + install.sh)
```

**How it fits together:** `agents/*.md` declare a role and, in front-matter `skills:`, attach skills → skills in `skills/*/SKILL.md` are auto-loaded by description → `commands/<agent>/*.md` provide quick `/agent:command` shortcuts that delegate to the sub-agent → `.mcp.json` gives agents their tools. A `SessionStart` hook tells Claude the agents are available.

---

## License

MIT — free to use, copy, modify, and distribute; provided "as is", with no warranty and no liability. See [LICENSE](./LICENSE).

© 2026 Christian Avis (Vorcl).
