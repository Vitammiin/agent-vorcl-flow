# Project audit

The current architecture/code review and implemented changes are recorded in [docs/ARCHITECTURE_REVIEW.md](./docs/ARCHITECTURE_REVIEW.md).

The key defect was ownership: installing agent instructions also installed MCP servers, a shared credential loader, and a runtime that could update Task Master without the user choosing that integration. The redesigned default is local skills/agents, session-based planning, inherited host tools, independent verification, and preservation of user configuration.

See [migration](./docs/MIGRATION.md) for existing machine installations and [runtime limits](./docs/RUNTIME_V3.md) for the optional experimental server. Fixture tests do not claim to validate every live connector or replace a user's existing client setup.
