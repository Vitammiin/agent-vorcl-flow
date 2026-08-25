# Agent-Vorcl-Flow — compact Codex router

Use `$vorcl` for a non-trivial implementation goal and `$audit` for a read-only whole-project audit. Load only the selected role and its task/domain skills; do not preload the full catalog.

## Workflow contract

For non-trivial changes use `$workflow` + `$task-master`. Keep the IDs created for this run and work only from that allowlist; atomically claim before `in-progress`. The Executor implements, an independent Checker verifies `testStrategy`, and only the orchestrator marks `done`. Report-only permits only an explicitly requested report artifact—never Task Master or product-state writes.

If `PROJECT_DESCRIPTION.md` exists in task scope, every modifying role reads it before work and performs the `$init-code` description-impact check afterward. Update only sections whose described context materially changed; a proven stale description blocks `done`. Do not create the file automatically when it is absent.

## Routing

| Need | Primary role | Do not use for |
| --- | --- | --- |
| Target system design, technology choice | `$architect` | Full current-repository artifact package |
| Complete multi-language CURRENT architecture package | `$principal-architect` | Lightweight TS/JS map |
| Backend API/business logic | `$backend` | Web UI |
| React/Next.js UI/state/data | `$frontend` | Backend API |
| React Native/Expo | `$expo-mobile` | Web-only UI |
| Broad read-only quality audit | `$analyzer` | Targeted hardcode/mock scan |
| Hardcode/mock-data production leakage | `$integrity` | General code-quality audit |
| OpenAPI coverage | `$swagger` | General API implementation |
| Web research/extraction | `$firecrawl` | Local repository analysis |
| Render deploy/status/logs | `$render` | Generic CI/CD |
| PostgreSQL/MongoDB/Redis | `$database` | App business logic |
| Error handling/failure boundaries | `$resilience` | Pino logging architecture |
| Pino structured logging architecture | `$logging` | Error handling try/catch |
| Screenshot → new UI | `$screenshot` | Locate existing UI source |
| Product/visual design artifacts | `$design-studio` | Source-code location |
| Screenshot identification + live web evidence | `$visual-research` | Code generation |
| Screenshot → existing `file:line` | `$pinpoint` | New UI generation |
| Native draw.io/PMP diagram | `$drawio` | Repository extraction |
| Lightweight TS/JS dependency/architecture map | `$archmap` | Full multi-language architecture package |
| Validated Mermaid diagram | `$mermaid` | Repository extraction |
| Unit/integration/E2E and independent verdict | `$testing` | Feature implementation |
| Commits/PR/changelog/release | `$gitflow` | Product code |
| Read-only secrets/OWASP/CVE/PII audit | `$security` | Remediation implementation |
| README/API/architecture documentation | `$docs` | Architecture extraction |
| Docker/Compose/GitHub Actions | `$devops` | Render-specific operation |
| Ephemeral local work dashboard | `$liveboard` | Persistent reporting |

Each role has `$<role>-vorcl` and focused task skills discoverable by name. Relevant domain skills are loaded after routing. If no route clearly matches, use `$architect-analyze`.

Mutation safeguards: database, hosting, publishing, push/release, external messages, and destructive operations require the authorization stated by the selected role. Read-only roles never edit production code.

MCP capabilities may include github, filesystem, postgres, mongodb, redis, docker, firecrawl, vercel, render, task-master, and mermaid; use only those available in the current session.
