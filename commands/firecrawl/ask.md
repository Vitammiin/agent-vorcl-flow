---
description: Диагностика упавшего или неожиданного Firecrawl job по реальному jobId через support/ask.
argument-hint: "<jobId> — <вопрос/ошибка>"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Диагностируй Firecrawl job: **$ARGUMENTS**.

Не угадывай причину. Собери реальный jobId, endpoint, безопасные параметры, status и error. Проверь наличие CLI-команды через `--help`; иначе используй MCP или POST `/v2/support/ask`. Не отправляй ключи, cookies или PII. Верни ответ поддержки и machine-readable fix parameters, но не повторяй мутацию без проверки и требуемого подтверждения.
