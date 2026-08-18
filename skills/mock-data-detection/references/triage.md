# Mock-data triage

## Severity

- `critical`: production writes, billing, authorization, compliance, or destructive operations use fake identities/state.
- `high`: production UI/API serves fabricated or static business data, or a mock intercepts real network calls.
- `medium`: production bundle contains dormant mock tooling with a plausible activation path; placeholder content reaches a secondary surface.
- `low`: dead/demo code is packaged but proven unreachable; prefer cleanup without overstating runtime impact.

## Required proof

At least one of:

- import/registration from a production entry point;
- build alias or dependency-injection binding active in production;
- route/render call path to static data;
- missing, inverted, or permissive environment guard;
- production dependency declaration plus runtime import.

Keep lexical-only hits as review candidates. Suppress files under tests, fixtures, stories, examples, docs, seeds, migrations, generated output, and vendor roots unless production imports them.
