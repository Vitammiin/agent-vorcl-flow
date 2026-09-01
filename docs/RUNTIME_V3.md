# Agent-Vorcl-Flow Runtime v3 beta

Runtime v3 is an opt-in local control plane shared by Claude Code, Codex, Cursor, and Kimi. Existing role, skill, and slash-command names remain compatible; `AVF_RUNTIME_MODE=legacy` keeps the v2 execution path available through v3.1.

## Start and inspect

```bash
agent-vorcl-flow runtime install-service
agent-vorcl-flow runtime start
agent-vorcl-flow runtime status
agent-vorcl-flow runtime doctor
agent-vorcl-flow runtime stop
```

The daemon listens only on `127.0.0.1:19790`. Its MCP endpoint is `/mcp`; `/health` exposes readiness without project data. The installer creates `~/.config/agent-vorcl-flow/runtime.json` with mode `0600` and injects its bearer token into supported client configurations. Clients that cannot send an authorization header stay on the legacy adapter.

Set `AVF_ALLOWED_ROOTS` to a platform-delimited list of directories to restrict which workspaces may be bound. Every MCP session is fixed to the canonical real path of one workspace. Rebinding is rejected while a mutation is active.

## Durable state

Each bound project stores runtime state under `.taskmaster/avf-runtime/`:

- `events.jsonl` is an append-only normalized event stream;
- `snapshot.json` is an atomically replaced projection of runs, claims, approvals, jobs, and receipts.

Task Master remains the task source of truth. Runtime task completion additionally requires a successful `ToolReceipt@1` with `checkerVerdict: "READY"`.

## Permission model

Actions are classified as `read`, `workspace_write`, `destructive`, `external`, `publish`, or `costly`. Every class except `read` requires a single-use approval bound to the session, run, targets, payload digest, and a ten-minute expiry. Generic chat acknowledgements are not approvals.

The autonomous workspace backend accepts argv arrays, never shell strings. It confines cwd and file paths to the bound real workspace, rejects symlink escapes, allowlists environment variables, caps output at 1 MiB, and enforces a ten-minute command timeout.

## MCP tools

The stable `avf_*` tools cover workspace binding, capability routing, run lifecycle, atomic task claims, approvals and execution, external receipts, durable jobs, event reads, and skill provenance. Obtain the authoritative list with MCP `tools/list`; schemas are validated by Zod at the boundary.

## Providers

`OpenAIResponsesAdapter` and `AnthropicMessagesAdapter` isolate provider wire formats and map their stream events to the common runtime vocabulary. API keys are read from environment variables and redacted from logs and events. Provider contract tests use local fixtures; live tests must be explicitly enabled in a secret-bearing CI job.

## Skill updates

Installed skills have a SHA-256 ledger and an origin of `builtin`, `upstream`, `local`, or `local_modified`. Atomic updates replace only an unchanged builtin copy. A locally modified skill is preserved and marked as having an available update.

## Migration and rollback

Runtime indexes existing Task Master workspaces without rewriting task records. Disable the v3 path with:

```bash
export AVF_RUNTIME_MODE=legacy
```

With this flag, `runtime start` is a no-op and `runtime status` reports `legacy`; the existing v2 roles, skills, commands, and Task Master workflow remain available. Static client entries may show the optional v3 endpoint as unavailable. Remove the legacy path no earlier than v4, after all supported clients pass the HTTP/auth compatibility matrix.
