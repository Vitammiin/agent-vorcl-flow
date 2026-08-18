---
name: integrity-hardcode
description: "Поиск production-хардкода во frontend/backend на разных языках: user-visible text, fixed API/data/config values, endpoints и i18n bypass. Use когда нужно найти hardcoded literals без ложного правила «любая строка — ошибка»."
---

# Integrity: hardcode

Запусти `$code-integrity` scanner с `--mode hardcode`, затем примени `$hardcode-detection`. На backend отдельно проверь constants/static/final fields, default parameters, named arguments и config objects с планами/ценами/ролями/лимитами/категориями/tenant/account values: сопоставь их со schema/model/migration/repository/query/admin mutation и докажи обход или overwrite database state. Исключи code/config-owned protocols, routes, enums, SQL, operator logs, tests, fixtures, generated и vendor.

Для каждого finding: severity, область, `file:line`, rule ID, evidence, production reachability, root cause, remediation и confidence. Ничего не правь; значимые findings → `add_task`.
