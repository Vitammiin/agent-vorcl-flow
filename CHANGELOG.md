# Changelog

All notable changes to this project are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

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

[Unreleased]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.4.0...HEAD
[2.4.0]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.3.1...v2.4.0
[2.3.1]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/Vitammiin/agent-vorcl-flow/compare/v2.2.0...v2.3.0
