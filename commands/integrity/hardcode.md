---
description: Поиск production-хардкода во frontend/backend на разных языках: user-visible text, fixed API/data/config values, endpoints и i18n bypass. Use когда нужно найти hardcoded literals без ложного правила «любая строка — ошибка» (integrity)
argument-hint: "[путь; по умолчанию текущий репозиторий]"
allowed-tools: Read, Grep, Glob, Bash
---

Проведи read-only поиск хардкода в **$ARGUMENTS**.

Запусти scanner `code-integrity` с `--mode hardcode`, затем примени критерии `hardcode-detection`. На backend отдельно проверь constants/static/final fields, default parameters, named arguments и config objects с планами/ценами/ролями/лимитами/категориями/tenant/account values: сопоставь их со schema/model/migration/repository/query/admin mutation и докажи обход или overwrite database state. Исключи code/config-owned protocols, routes, enums, SQL, operator logs, tests, fixtures, generated и vendor.

Для каждого подтверждённого finding: severity, область, `file:line`, rule ID, evidence, production reachability, root cause, remediation и confidence. Ничего не правь; значимые findings → `add_task`. Делегируй роли `integrity`.
