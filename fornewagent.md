# Contributor orientation

Start with [README.md](./README.md), [architecture review](./docs/ARCHITECTURE_REVIEW.md), and [migration boundaries](./docs/MIGRATION.md).

The requested outcome and workspace evidence select the role. Use a session plan by default. A user-selected task tracker is optional; do not initialize, install, reconfigure, or change its provider/model just because its tool or directory exists. Read-only reports do not mutate task metadata. Use only current-goal IDs when a tracker is selected, and require an independent checker before completion.

Do not configure host MCP connections, credentials, model profiles, global instructions, or services as a side effect of adding skills. The installer owns only components recorded in its ledger. Preserve unknown or locally edited components.

Canonical role prompts live in `agents/`, focused tasks in `commands/`, domain skills in `skills/`, metadata in `scripts/roles.json`. Generate Codex entrypoints with `npm run generate:codex`, capability hints with `npm run generate:capabilities`. Do not hand-edit generated mirrors.

For verification run `npm test`, `npm run test:registry`, and `npm run test:package`. The optional loopback HTTP test is enabled with `AVF_E2E_NETWORK=1 npm run runtime:test`; live providers are not part of that test.

If `PROJECT_DESCRIPTION.md` exists in scope, read it before changes and use the `init-code` impact check afterward. Update materially changed statements only. Do not create that document automatically.
