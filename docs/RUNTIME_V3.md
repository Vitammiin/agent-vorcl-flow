# Optional experimental runtime

The installed roles and skills do not require a daemon. This runtime is a separate experiment for local routing, run receipts, and coordination. The installer does not start it, register an MCP connection, create a token, or install a service.

## Explicit startup

From a stable checkout with dependencies installed:

```bash
node bin/runtime.mjs --help
node bin/runtime.mjs status
node bin/runtime.mjs doctor
node bin/runtime.mjs serve
```

Stop the foreground process with Ctrl+C. `status`, `doctor`, and `--help` never create configuration. `serve` creates its private `runtime.json` with mode `0600` under `AGENT_VORCL_HOME`, the XDG config directory, or the platform default. No client configuration is edited. Any connection to `/mcp` and its bearer token is configured manually by the user.

The listener is loopback-only (`127.0.0.1:19790` by default). `AVF_RUNTIME_PORT` selects the port; `AVF_ALLOWED_ROOTS` is a platform-delimited list of permitted workspace roots. Leaving that list unset allows the trusted local caller to bind any accessible directory. Set it when restricting workspaces matters.

No project/global `.env` is discovered. Optional provider execution reads the environment inherited from its explicitly started process. `AGENT_VORCL_ENV_FILE` can explicitly select an environment file. Existing process variables take precedence, including intentionally empty values. Credentials are not shared with user MCP servers.

## Ownership and persistence

State is stored under `.agent-vorcl/runtime/` in the bound workspace: `events.jsonl` and `snapshot.json`. Runtime task IDs belong only to this ledger. The runtime never probes `.taskmaster`, reads its task store, invokes its CLI, or completes its tasks. Use the chosen host task provider separately if persistent tracking was explicitly requested.

Claims and completion mutations are serialized in one runtime process. An independent caller supplies a successful `READY` receipt before a task can complete. This validates receipt structure and run/task matching; the service cannot establish that an external checker was actually independent. That responsibility remains with the host workflow. Run only one runtime process per workspace; the event store is not a distributed database or a cross-process lock service.

Skill tools only read packaged skills. Installed skill ownership and updates belong to the standalone installer.

## Trust boundary

This is a trusted local-client API, not an operating-system sandbox or a human approval interface. The same authenticated client can propose and approve an action. Digest-bound, single-use approval records prevent payload substitution and accidental replay; they do not prove human consent. The host remains responsible for user authorization and sandboxing.

The MCP API exposes bounded file reads/search and approved file writes. Generic command execution is not exposed. Internal search uses fixed `rg` arguments; it does not evaluate a shell string. Paths are checked against the bound workspace, but the runtime is not intended to handle a hostile process racing filesystem symlinks. Use the host's native execution tool for commands.

Optional OpenAI/Anthropic provider loops can read/search and propose file changes. They do not execute their proposals. Providers are selected explicitly; no Task Master model or provider settings are touched. Live provider calls are outside the offline test suite.

## Verification and compatibility

`npm run runtime:test` runs deterministic fixture tests. `AVF_E2E_NETWORK=1 npm run runtime:test` additionally starts a temporary loopback HTTP server to verify MCP authentication, initialization, tool discovery, and workspace binding. It makes no external provider requests.

The API is experimental and this beta removes implicit Task Master integration, arbitrary-command execution, installed-skill mutation, and service installation. See [migration](./MIGRATION.md) for legacy installations. `AVF_RUNTIME_MODE=legacy` remains a no-write disabled mode for callers already using that flag.
