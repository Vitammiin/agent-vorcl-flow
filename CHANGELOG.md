# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Read-only installation catalog and integrity checks, plus explicit role/skill selection with bounded dependencies and preserved ownership safeguards.
- A bounded implementation/review handoff with acceptance-to-evidence mapping and separate requirement and quality passes.
- Pull request and branch validation on Node.js 20 and 24, including the real loopback MCP integration test.
- A dated ecosystem review with GitHub popularity snapshots, pinned sources, licensing notes, and adopted/rejected patterns.

### Fixed

- Workspace routing now prioritizes the requested deliverable over incidental dependencies, with English/Russian regression cases for documentation, APIs, databases, infrastructure, audits, and mobile motion.

## [3.0.0] - 2026-10-15

### Breaking changes

- Node.js 20 or newer is required by the locked runtime dependency graph.

- Installation requires an explicit client selection. It installs skills and agents only; MCP connections, credentials, models, hooks, services, and Task Master are no longer configured automatically.
- Workflows use session planning by default. Task Master is an optional adapter selected explicitly by the user; its absence does not block implementation or verification.
- AVF run coordination now belongs in `.agent-vorcl/`, separate from Task Master state. The optional runtime no longer bridges Task Master or exposes generic shell execution and installed-skill mutation.

### Added

- Installer preview and legacy inspection, complete-tree ownership hashes, atomic replacement with rollback, and preservation of unowned or user-modified components.
- Deterministic Codex prompt generation from canonical roles, commands, and domain skills.
- Optional foreground runtime with authenticated loopback HTTP MCP, workspace-bound sessions, durable events, bounded actions, jobs, and independent checker receipts.
- Migration guidance and an architecture review explaining installation ownership and integration boundaries.

### Fixed

- Removed bundled MCP registrations, forced tool/model overrides, global hooks, automatic services, and shared secret loading from default installation.
- Serialized runtime task claims and completion, made status inspection read-only, and restricted the optional environment helper to explicitly requested files and keys.
- Replaced conflicting setup descriptions with maintained English/Russian guides and offline localized navigation.
- Read runtime version metadata from the package manifest so release versions stay consistent.

### Migration

- Existing settings and unowned skills are preserved. Follow `docs/MIGRATION.md` to review and remove legacy configuration; upgrading the package does not silently rewrite an earlier machine installation.

## [2.7.0] - 2026-08-29

### Added

- Mobile thumb-zone ergonomics guidance for responsive web and Expo/React Native interfaces, with platform-specific touch-target, reachability, safe-area, keyboard, and device-validation rules.
- React Native Liquid Glass integration guidance that selects between Callstack, Expo Glass Effect, and accessible fallbacks using live compatibility evidence.
- Deterministic workspace-aware capability routing and a generated catalog covering all 26 roles and 78 skills, including Expo audit handoffs and outcome-first routing for video workspaces.
- Mermaid reference library under `skills/mermaid-diagrams/references/`: per-type syntax guides distilled from the official `mermaid-js/mermaid` documentation, with every example verified by a real render on mermaid 11.16.1. The skill's SKILL.md became a router (task to diagram type to reference), so the deep syntax loads on demand instead of living in the prompt.
- Coverage for every current Mermaid diagram type, including the ones the role previously did not know: `architecture-beta`, `block`, `kanban`, `treeView-beta`, `radar-beta`, `treemap-beta`, `venn-beta`, `packet`, `swimlane-beta`, `eventmodeling`, `cynefin-beta`, `ishikawa-beta`, `wardley-beta`, `railroad-ebnf-beta`, `zenuml`.
- `skills/mermaid-rendering/scripts/mmd-validate.mjs`: a zero-dependency render validator that extracts every ```mermaid block from Markdown and reports `file:line` plus the parser message, with `--list` and `--json` modes for CI. It separates a broken render environment from a broken diagram — a missing headless browser is reported as `SETUP` with exit code 3, never as a diagram failure.
- Operational rules for driving a render, verified against the tools themselves: the diagram must also be looked at after the syntax passes (truncated labels, cramped density, edge spaghetti, aspect, contrast, wrong type, capped at two rounds), edits go back into the same file instead of `-v2` copies, and `usecase-beta` is documented as a 32nd type gated on mermaid 11.17+.

### Changed

- The `mermaid` role, its Codex mirror, and the `/mermaid:*` commands now take syntax from the reference library instead of from memory, and document the verified render-check pitfalls (the `.error-icon` CSS class exists in every Mermaid SVG and must not be used as an error marker; `securityLevel` cannot be raised by an in-diagram directive).
- Raised the published package file budget to fit the new reference library.
- Documented verified render-environment traps: `mmdc --version` passes with no browser installed while every export then fails with the same exit code as a syntax error, so a correct `.mmd` must not be rewritten in response; Kroki serves Mermaid as PNG/SVG only (a PDF request returns HTTP 400) and its response code must be checked because `curl -o` will happily write an error body into the output file.

## [2.6.1] - 2026-08-25

### Fixed

- Raised the published package file budget so the new logging role can ship on npm.

## [2.6.0] - 2026-08-25

### Added

- Pino logging role (`logging`) with `pino-logging` skill, scanner, and PostToolUse hooks for Claude and Kimi: one root logger, child context, redaction, and JSON on stdout.

## [2.5.1] - 2026-08-18

### Fixed

- Made principal-architecture tests portable across Linux and macOS by matching the generator's normalized lowercase output slug for randomized temporary directories.

## [2.5.0] - 2026-08-18

### Added

- Apple-inspired interface design guidance plus decision-first web and Expo animation skills with reusable recipes, reduced-motion handling, gesture momentum, interruption, and native-runtime performance rules.
- Cross-language code-integrity auditing for production hardcode and mock, fake, demo, or fixture leakage, including a dedicated read-only `integrity` role and deterministic scanner.
- Static `init-code` workflow for evidence-based `PROJECT_DESCRIPTION.md` generation and impact checks that keep existing project context synchronized.
- Native Codex plugin manifest, deterministic role registry, package-budget enforcement, and installer regression coverage across Claude Code, Codex, Cursor, and Kimi.

### Changed

- Hardened Task Master orchestration with scoped task allowlists, atomic claims, independent verification, explicit degraded modes, and project-description drift checks.
- Expanded frontend, screenshot, design-studio, Expo mobile, analyzer, security, testing, and architecture role contracts with synchronized Codex mirrors and localized documentation.

## [2.4.0] - 2026-08-13

### Added

- Production Design Studio agent with project-type workflows, reusable design systems, asset tracking, Figma import, HTML/PDF/PPTX/video export, and deterministic verification tooling.
- Principal Architect agent that extracts architecture from real polyglot repositories and generates evidence-backed Markdown, JSON, self-contained HTML, PDF, native draw.io, and copyable Mermaid artifacts.
- Bundled Tree-sitter parsers and source-level evidence for TypeScript/JavaScript, Python, Go, Java, Kotlin, PHP, Ruby, Rust, Swift, and C# repositories.
- Architecture rendering patterns adapted from `diagram-design` and `next-ai-draw-io`, with preserved third-party licenses and provenance.
- Repository-local README translations for all 22 documented languages, with automated parity, link, anchor, script, and code-block validation.

### Changed

- Moved translated README files into `translations/` and updated package distribution, documentation, and locale checks accordingly.
- Extended installer metadata, role routing, synchronization checks, and release tests for Design Studio and Principal Architect across Claude Code, Codex, and Cursor.

## [2.3.1] - 2026-08-11

### Fixed

- Restored npm Trusted Publishing by preventing `actions/setup-node` from generating a token-based `.npmrc` that masks the OIDC authentication flow.

## [2.3.0] - 2026-08-11

### Added

- Production Expo/React Native mobile agent with modular architecture rules, commands, hooks, and Claude Code, Codex, Cursor, and Kimi adapters.
- Expo SDK compatibility preflight with online-verification requirements and explicit version-mismatch guidance.
- Expo design, motion, interaction, accessibility, haptics, image-loading, and reduced-motion guidance with automated guards.
- Cross-stack `/audit` command that detects backend, frontend, mobile, database, and infrastructure boundaries and produces an evidence-based `PROJECT_AUDIT.md` remediation plan.
- Polyglot project inventory and strict report validation with regression coverage for incomplete findings and advisory evidence.

### Changed

- Extended the installer and synchronization checks to distribute mobile hooks, compatibility tooling, shared audit skills, and Kimi-native role files consistently.

[Unreleased]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.7.0...v3.0.0
[2.7.0]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.6.1...v2.7.0
[2.6.1]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.6.0...v2.6.1
[2.6.0]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.5.1...v2.6.0
[2.5.1]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.3.1...v2.4.0
[2.3.1]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.2.0...v2.3.0
