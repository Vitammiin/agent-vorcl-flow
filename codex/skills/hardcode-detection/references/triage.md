# Hardcode triage

## Positive evidence

- Frontend: rendered JSX/template text, `placeholder`, toast/modal copy, browser title, exported static collections used by a page.
- Backend: response/error payloads, validation messages, email/SMS/push templates, generated reports, fixed records returned by handlers.
- Database ownership: matching table/collection/model or repository query exists; admins/users can change the value; other code reads the same concept from storage; a constant/default argument overrides stored state; a static catalog duplicates seeded records.
- Configuration: literal non-loopback hosts, tenant IDs, regions, absolute developer paths, or environment URLs used by runtime code.
- Localization: an established i18n layer exists, but a user-visible literal bypasses it.

## Negative evidence

- Tests, fixtures, stories, examples, seeds, docs, snapshots, migrations, generated clients, vendor directories.
- Stable machine codes, HTTP methods, route paths, MIME types, database column names, telemetry event names.
- Operator-only logs unless the product explicitly localizes operational output.
- Defaults intentionally documented and overridable through config.
- Protocol/rate/safety constants intentionally owned by code or configuration, even if numeric. A business-sounding name alone is only a review candidate.

## Database-owned hardcode proof

1. Match the constant/parameter to schema, ORM model, migration, seed, repository, query, or admin mutation evidence.
2. Trace the use site and show that it bypasses or overwrites the stored value.
3. Identify the correct lookup key (tenant, account, product, plan, locale, effective date) and cache/invalidation boundary if relevant.
4. Report one root finding for the duplicated source of truth, not every reference to the constant.

## Confidence

- `high`: direct render/response path and no owning boundary.
- `medium`: production source with likely user/data reachability, but call graph is incomplete.
- `low`: lexical signal only; keep as review candidate, not a confirmed defect.
