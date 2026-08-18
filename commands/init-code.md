---
description: "Статически прочитать код и создать evidence-based PROJECT_DESCRIPTION.md без запуска проекта и без выдуманных связей."
argument-hint: "[путь; по умолчанию текущий репозиторий] [--update] [--output <file>]"
allowed-tools: Read, Write, Bash, Grep, Glob
---

Инициализируй описание кодовой базы **$ARGUMENTS** через `init-code` в режиме `report-only` из `$workflow`.

1. Запусти `scripts/inspect.mjs` из установленного skill `init-code`; target code, hooks, package scripts и binaries не исполняй.
2. Проверь найденные manifests, entrypoints, routes, schemas, CI и test configs чтением.
3. Создай `PROJECT_DESCRIPTION.md` по output contract skill. Существующий файл без `--update` не перезаписывай: создай timestamped sibling. Значения секретов и `.env` не читай в отчёт.
4. Каждый факт подкрепи относительным `file/path`; inference и unknowns отдели от подтверждённых фактов.
5. Запусти `validate-description.mjs` и отдай путь, detected systems, validator result и coverage gaps.
