---
name: mock-data-detection
description: Read-only detection of mock infrastructure, fixtures, fake generators, demo records, static API responses, and placeholder assets leaking into production frontend or backend paths across TS/JS, Python, Go, Java/Kotlin, C#, PHP, Ruby, Rust, Vue/Svelte/HTML. Use when UI or API may run on mocks, fake data, stubs, MSW/faker/WireMock/Mockito-style tooling, or hardcoded sample records; distinguish legitimate tests, stories, seeds, demos, and dev-only adapters from production leaks.
---

# Mock Data Detection

Use `$code-integrity` to collect candidates in `--mode mocks`, then prove runtime reachability before reporting a leak.

## Trace in this order

1. Locate the mock/fake declaration or dependency.
2. Find imports, registrations, dependency-injection bindings, route handlers, build aliases, and environment guards.
3. Identify the production entry point or bundle/server path that can reach it.
4. Check whether a compile-time or runtime guard is fail-closed in production.
5. Report the root leak, not every downstream use.

Legitimate test doubles belong in tests, fixtures, stories, examples, seeds, local demos, or explicit development adapters. A directory named `mocks` is not automatically safe if production imports it. Conversely, the word `mock` in a domain term is not evidence.

## Categories

- `mock-framework-production`: MSW, Jest/Vitest mocks, unittest.mock, responses, WireMock, Mockito, MockWebServer, Moq, NSubstitute, WebMock, VCR, httpmock, or equivalent loaded by production code.
- `fake-generator-production`: Faker/casual/factory libraries used in runtime request or render paths.
- `static-api-response`: handlers returning sample collections/records instead of a service or repository.
- `fixture-import-production`: production entry imports test/fixture/story/seed/demo data.
- `placeholder-asset-production`: placeholder images, lorem, example contacts, or demo identities shown to real users.
- `disabled-real-integration`: real fetch/repository code is bypassed or commented out while a stub supplies data.

Read [references/triage.md](references/triage.md) before assigning severity.

## Output

Include declaration and production consumer locations when they differ. State environment/build guard behavior, affected surface, confidence, and the concrete replacement boundary (API client, service, repository, config, or test-only adapter).
