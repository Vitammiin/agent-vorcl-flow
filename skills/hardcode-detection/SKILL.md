---
name: hardcode-detection
description: "Evidence-based read-only detection of production hardcode across frontend and backend languages: user-visible strings bypassing i18n, fixed API responses, endpoints/hosts, tenant or environment values, placeholder content, and static business data. Use for requests to find hardcoded text/data/config, i18n bypasses, magic production values, or backend/frontend literals without treating every string literal as a bug."
---

# Hardcode Detection

Use `$code-integrity` to collect candidates in `--mode hardcode`, then validate them in context.

## Confirm a finding only when

- the literal reaches a user, API consumer, notification, template, exported config, or business decision;
- the value should vary by locale, tenant, environment, request, database state, or product configuration; and
- no established translation/config/data boundary owns it.

Do not report route names, stable protocol constants, enum members, SQL fragments, log messages intended only for operators, test expectations, migration snapshots, generated code, vendored code, or deliberate accessibility labels unless project policy requires localization.

## Classify

- `user-visible-text`: JSX/templates, validation/API errors, emails, notifications, document output.
- `environment-value`: concrete host, port, path, tenant, region, or external endpoint that should come from config.
- `static-business-data`: catalog/user/account/status content embedded instead of loaded from the system of record.
- `database-owned-constant`: plan/tier/price/fee/role/category/product/quota/tenant/account values hidden in constants, static/final fields, default parameters, named call arguments, or config objects while the database should own them.
- `formatting-policy`: manual date/currency/plural rules that bypass locale-aware APIs.
- `placeholder-content`: lorem, example identities, placeholder images, demo contact values in production paths.

Read [references/triage.md](references/triage.md) for severity and false-positive rules.

For a `database-owned-*` candidate, trace matching schema/model/migration fields, repository queries, admin mutation paths, and call sites. Confirm a finding only when database state exists or product behavior requires runtime-managed records and the constant/parameter bypasses, shadows, or overrides it. Protocol limits and deliberately config-owned policy remain non-findings.

## Severity

- `critical`: fixed identity/tenant/security-sensitive decision changes real production behavior.
- `high`: fake or stale business output is served to users, or multilingual UI/API bypasses the translation contract.
- `medium`: environment-specific value or user-facing literal creates deployment/localization drift.
- `low`: maintainability issue with limited runtime impact.

Always attach `file:line`, production reachability evidence, root cause, confidence, and a concrete owner-aware remediation.
