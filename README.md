# Agent-Vorcl-Flow

Engineering roles, skills, and independent verification for Claude Code, Codex, Cursor, and Kimi CLI. AVF works with the tools already available in your session. Your MCP connections, credentials, models, and task tracker remain yours.

<!-- languages:start -->
[English](./README.md) · [Русский](./translations/README.ru.md) · [Українська](./translations/README.uk.md) · [Deutsch](./translations/README.de.md) · [Français](./translations/README.fr.md) · [Español](./translations/README.es.md) · [Português](./translations/README.pt.md) · [Italiano](./translations/README.it.md) · [Polski](./translations/README.pl.md) · [Türkçe](./translations/README.tr.md) · [中文](./translations/README.zh-CN.md) · [日本語](./translations/README.ja.md) · [한국어](./translations/README.ko.md) · [العربية](./translations/README.ar.md) · [Nederlands](./translations/README.nl.md) · [Čeština](./translations/README.cs.md) · [Română](./translations/README.ro.md) · [Magyar](./translations/README.hu.md) · [Български](./translations/README.bg.md) · [Српски](./translations/README.sr.md) · [हिन्दी](./translations/README.hi.md) · [Tiếng Việt](./translations/README.vi.md)
<!-- languages:end -->

## Install

Requires Node.js 20 or newer and a supported coding client. Choose the client explicitly; running without arguments only shows help.

```bash
node bin/install.mjs --help
node bin/install.mjs --codex --dry-run
node bin/install.mjs --codex
```

Use `--claude`, `--cursor`, or `--kimi` for another client, or `--all` to explicitly select all four. For a GitHub/npm installation, use the same adapter flag:

```bash
npx github:Vitammiin/agent-vorcl-flow --codex
npx --yes agent-vorcl-flow@latest --codex
```

These commands use the version available at that remote/package tag; local unreleased changes require the local installer above.

| Client | Installed content | Default location |
| --- | --- | --- |
| Claude Code | Skills and `avf-*` agents | `~/.claude/skills`, `~/.claude/agents` |
| Codex | Skills | `~/.agents/skills` |
| Cursor | Skills and `avf-*` agents | `~/.cursor/skills`, `~/.cursor/agents` |
| Kimi CLI | Skills and `avf-*` agents | `~/.kimi/skills`, `~/.kimi/agents` |

The installer records ownership in `.agent-vorcl-flow-install.json` beside installed components. It updates a component only if its complete file tree still matches the recorded hash. Existing names without ownership records, local edits, and symlinks are preserved. Review any `Preserved:` messages: an older conflicting skill may remain active until you resolve it yourself. Re-run the same command to update managed components.

Absolute path overrides: `CLAUDE_HOME`, `AVF_SKILLS_DIR` (Codex skills), `CURSOR_HOME`, `KIMI_HOME`. `CODEX_HOME` is used only when inspecting legacy configuration. Installation does not edit `AGENTS.md`, client settings, MCP configs, model profiles, environment files, services, or Task Master data. It does not install hooks or invoke other CLIs.

## Use

Load the entry skill in your client's native skill interface. Codex examples:

```text
$vorcl add a shopping cart and verify checkout
$audit .
$init-code .
$backend-refactor simplify invoice validation
```

The optional Claude plugin exposes `/vorcl`, `/audit .`, and `/backend:refactor`; the local installer exposes the corresponding skills and agents. Restart/reload your client after installation if its skill discovery requires it.

`vorcl` reads the requested outcome and workspace evidence, selects one primary role, and loads only relevant skills. The executor implements the change; a separate checker verifies the agreed acceptance criteria. Findings and limitations accompany completion.

The default workflow uses a plan in the current session. A report-only audit does not create tasks, change product state, or silently upgrade itself into remediation. `init-code` creates a project description only when requested. If `PROJECT_DESCRIPTION.md` already exists, modifying work checks its impact and updates only materially affected sections.

## Tools and task tracking

AVF does not ship active MCP server registrations. The empty MCP adapter files are compatibility placeholders. Configure connectors through your own client, with your own server names, versions, accounts, and credentials. Skills discover available capabilities instead of assuming that a particular MCP namespace exists.

Task Master is optional. Select it explicitly for persistent tracking, using an existing connection or CLI that you already configured. Merely finding `.taskmaster` or a Task Master tool is not permission to initialize it, change providers/models, install software, or rewrite its configuration. If no tracker is selected, implementation continues with the session plan.

When tracking is selected, capture only the task IDs for the current goal, preserve the chosen project/tag, claim them before work, and require an independent checker before completion. Never consume an unrelated global backlog. AVF's coordination files live in `.agent-vorcl/`, separately from the tracker's data. See [workflow](./skills/workflow/SKILL.md) and [Task Master adapter guidance](./skills/task-master/SKILL.md).

## Upgrade from the old installer

Old versions installed MCP entries, model profiles, shared credentials, hooks, and in some versions an automatic runtime service. This installer preserves those existing settings; upgrading the source does not undo an earlier machine installation.

```bash
node bin/install.mjs --check-legacy
node bin/install.mjs --codex --dry-run
```

The first command reports recognizable legacy paths without printing configuration values. Back up your client settings, review only AVF-owned entries in that client's UI/configuration, and keep your own MCP definitions and Task Master data. Unknown ownership is never treated as permission to delete. For a detailed review checklist and rollback paths, see [migration](./docs/MIGRATION.md).

Legacy skills without the new ownership ledger are intentionally preserved. Compare them with the new source, back up the versions you want to replace, then resolve those specific collisions. The installer does not guess that a familiar name proves ownership.

## Architecture

| Layer | Responsibility | Source |
| --- | --- | --- |
| Role registry | Ownership and routing metadata | `scripts/roles.json` |
| Agent and command prompts | Role behavior and focused tasks | `agents/`, `commands/` |
| Domain skills | Reusable knowledge, scripts, references | `skills/` |
| Generated Codex prompts | Client-facing skill entrypoints | `codex/skills/` |
| Local installer | Copy/update only owned components | `bin/install.mjs` |
| Optional experimental runtime | Local runs, receipts, routing | `src/`, `bin/runtime.mjs` |

Generated prompts are checked against canonical sources. The installer supplies canonical skill assets without duplicating them in the published Codex mirror. Host tools own execution, connector configuration, and user authorization. AVF does not replace those facilities.

The experimental runtime is a separate manual entrypoint. It is not needed by any installed role, does not register itself with a client, and never reads or updates Task Master. Its state is `.agent-vorcl/runtime/`. See [runtime limits and manual startup](./docs/RUNTIME_V3.md) and the [architecture review](./docs/ARCHITECTURE_REVIEW.md).

## Development and verification

```bash
npm ci
npm test
npm run test:registry
npm run test:package
AVF_E2E_NETWORK=1 npm run runtime:test
```

The last command enables a loopback HTTP integration test; it needs permission to bind a local port. Other tests use fixtures and temporary homes. Installer tests check preservation of user settings and components, repeatability, and side-effect-free inspection. Runtime tests cover concurrency, Task Master isolation, and receipt checks.

```bash
npm run generate:roles
npm run generate:codex
npm run generate:capabilities
npm run docs:locales:generate
```

English and Russian are maintained full guides. Other language pages provide localized pointers to the current guide; they do not pretend to be complete synchronized translations. Locale generation is deterministic and offline. No publication or installation into your real client is part of the test suite.

MIT license. Maintainer: [Vitammiin](https://github.com/Vitammiin).
