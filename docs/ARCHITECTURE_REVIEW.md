# Architecture review and redesign

Reviewed local source from `a25a05c` (the runtime-v3 beta) and the existing role/skill distribution. The main failure was conflicting ownership: a prompt/skills package also configured host tools, credentials, services, models, and another product's task data. This redesign makes the default installation a local content adapter.

## Findings and changes

| Finding in the previous implementation | Consequence | New boundary |
| --- | --- | --- |
| `bin/install.mjs` always called shared runtime setup and service installation | Installing skills generated a token, shared env file, and startup service | Installer copies owned content only; runtime starts explicitly in the foreground |
| MCP templates bundled a fixed server set and names | Collisions with each user's servers, transports, auth, versions and permissions | Empty compatibility configs; no MCP registration in plugins or installers |
| The shared launcher loaded global and project `.env`, then aliased provider credentials | Unrelated servers inherited credentials and environment assumptions | No auto discovery or aliases; legacy helper accepts an explicit file and selected variables |
| Agents had fixed models/tool whitelists and preloaded many domain skills | Host choices were overridden and connected tools could disappear from subagents | Inherit host capabilities; load only task-relevant domain skills |
| Most role entrypoints required Task Master init/global `next_task` despite the scoped workflow contract | Unwanted config writes, unrelated backlog consumption, inconsistent completion authority | Session plan by default; explicit provider choice and scoped IDs when persistent tracking is selected |
| Runtime task completion called `npx -y task-master-ai set-status` when tasks existed | Hidden installation/network access and mutations to a user-owned tracker | Bridge removed; runtime task IDs and completion belong only to its own ledger |
| Runtime and workflow helpers stored AVF state inside `.taskmaster` | An unrelated workflow could create/alter a task-provider namespace | AVF state moved to `.agent-vorcl/`; no automatic import or cleanup of old state |
| Runtime claim check/write and completion read/update were not atomic | Two owners could claim one task; parallel completion lost an update | Serialized lifecycle mutations with concurrency regression tests |
| Runtime skill updater hashed only SKILL.md and replaced whole trees | User edits to scripts/assets could be lost | Runtime is a catalog reader; installer hashes and checks entire owned components |
| Existing components were overwritten based on matching names | User or upstream skills could be replaced | Unknown ownership, local modifications, and symbolic links are preserved |
| Codex prompts and canonical role prompts drifted | Different clients received contradictory workflows | Deterministic generation and drift checks from canonical sources |
| Native plugin hook discovery injected unrelated guards into every project | Installing the plugin changed global editing behavior | Default hook manifest is empty; guard scripts remain available when relevant |
| Locale parity relied on generated hashes and matching code fences | A hash refresh could label stale instructions as current | Two maintained full guides and honest offline localized navigation |

## Responsibility map

`agents/` describes role behavior, `commands/` focused tasks, and `skills/` domain knowledge and helper scripts. `scripts/roles.json` is the role registry, including ownership and read-only semantics. Generators produce Codex entrypoints and routing metadata; tests enforce drift checks.

`bin/install.mjs` is an adapter, not a host configuration manager. It validates selected destinations, records component ownership, and updates only unchanged owned trees under a destination lock. It does not infer permission from an existing filename. A crash can leave an installation lock requiring inspection; the installer fails closed rather than racing another writer.

The host client owns MCP discovery, credentials, model selection, execution permissions, and connected task tools. Role prompts describe capabilities and do not force a common server namespace. Task Master is one optional tracker; its absence does not block implementation. Read-only reports never mutate task providers.

The experimental runtime is outside the default path. It owns local run state and validates receipts; it is not a human authorization boundary, sandbox, distributed coordinator, or replacement Task Master server. Generic command execution and installed-skill updates are absent from its MCP API. See [runtime limitations](./RUNTIME_V3.md).

## Verification strategy

Behavioral tests use temporary homes and workspaces to exercise real installer commands, including preservation of user MCP/config/Task Master files, unknown ownership, local asset edits, symlinks, repeat installation, dry-run and invalid arguments. Workflow tests cover explicit opt-in and scoped coordination. Runtime tests reproduce competing claims and parallel completion, and prove that completing a local run leaves Task Master data unchanged.

HTTP integration checks a real temporary loopback listener for auth, initialize, discovery, and workspace binding. Registry, generated prompt drift, locale links/examples, package budget, and JavaScript syntax are checked separately. Live provider calls and real client installations are intentionally outside these fixture tests; clients still need reload/discovery verification in their own environment.

## Migration constraints

Existing machine installations are preserved. The change does not silently remove old server entries, model profiles, hooks, services, secrets, or skills. Run the read-only legacy report and follow [migration](./MIGRATION.md). An old skill without an ownership ledger may continue to inject old instructions until explicitly replaced by its owner.

The role catalog remains broad. This work consolidates the control/ownership boundaries and loading policy; it does not claim to redesign or live-validate every specialized third-party integration or every domain asset. Version-sensitive domain actions still require task-specific verification against the connected tool's actual schema.
