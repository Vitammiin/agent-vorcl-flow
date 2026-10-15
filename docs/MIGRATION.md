# Migration to user-owned integrations

This is a source-level change. Updating this repository does not change existing client installations, remove legacy servers, or repair an already-running user session. The new installer deliberately leaves unknown ownership untouched.

## Inspect before changing anything

Run `node bin/install.mjs --check-legacy` to report recognizable legacy configuration paths. It prints paths, never tokens or configuration contents. Detection is a hint, not proof of ownership or a complete inventory. A server configured under a custom name may need manual review.

Back up the relevant files before editing them. Use the client's settings UI when possible. Review these legacy surfaces:

| Surface | What an old AVF installation may have added |
| --- | --- |
| `~/.codex/config.toml` | Marked AVF block, model profiles, MCP servers, local `agent-vorcl` endpoint |
| `~/.codex/AGENTS.md` | Marked AVF router requiring Task Master for every change |
| `~/.claude/settings.json` | AVF plugin/marketplace enablement |
| `~/.cursor/mcp.json` | Servers invoking the AVF `mcp-env.mjs` launcher |
| `~/.kimi/mcp.json`, `~/.kimi/config.toml` | AVF server registrations and guard hooks |
| `~/.config/agent-vorcl-flow/` | Shared `.env`, copied launchers, runtime state |
| `~/Library/LaunchAgents/io.vorcl.agent-flow-runtime.plist` | macOS auto-start service from the early runtime beta |
| `~/.config/systemd/user/agent-vorcl-flow-runtime.service` | Linux service definition from the early runtime beta |

Paths may differ when client home/XDG overrides were used. The earlier Windows runtime could create `start-runtime.cmd` in its AVF home; any separately registered startup task also needs review.

## Resolve ownership

1. Disable the old AVF plugin in the client if it is still injecting bundled MCP or global hooks. Use either the new local skills installation or the explicitly selected plugin, avoiding duplicate role copies.
2. Review only entries demonstrably introduced by AVF. Preserve custom server definitions, URLs, environment mappings, provider/model settings and all `.taskmaster` records. Do not delete an entire marked block if it now contains user changes.
3. If an old runtime service is active, stop/disable that specific service through the operating system's service manager before removing its own startup entry. Do not kill a process solely because an old PID file names it.
4. Review old skills with matching names. A legacy installation has no new ownership ledger, so the safe installer preserves it. Back up and move only the components you decide to replace, then repeat the install. There is no blanket force-overwrite option.
5. Install the chosen adapter with `--dry-run`, inspect the report, then repeat without `--dry-run`. Reload the client and verify your normal MCP/Task Master operations using the client tools you already trust.

The installer neither deletes nor imports the old shared secrets file. It never starts Task Master or selects its provider/model. Keep secrets in the integration configuration of your choice.

## Rollback

Restore the specific client configuration and components from your backup. Newly installed components are identified by the per-directory `.agent-vorcl-flow-install.json`; inspect that manifest rather than deleting all skills or all client settings. Keep modified components and task data. No unattended migration or rollback is performed.

## Changed interfaces

- No-argument install now shows help. Use `--codex`, `--claude`, `--cursor`, `--kimi`, or `--all` explicitly.
- The installer no longer dispatches `runtime` or registers a plugin/marketplace. Run the optional runtime with `node bin/runtime.mjs serve` from a stable checkout.
- Background `start`, `stop`, and `install-service` are removed; runtime inspection is read-only and foreground startup is explicit.
- Runtime `avf_task_get` and `avf_skill_update` are removed. Use your chosen task provider and the standalone installer.
- Runtime completion updates only its own run ledger; it does not execute `npx` or mark Task Master tasks done.
- AVF run coordination and runtime data use `.agent-vorcl/`. Old `.taskmaster` coordination/runtime data is left intact and is not imported automatically. Finish or review active legacy runs before starting a new one.
- The legacy `mcp-env.mjs` helper no longer discovers global/project `.env` files or maps provider aliases. Manual use accepts only explicitly selected file variables via `--avf-env-file` and `--need`. It is never installed or registered by the new installer.
