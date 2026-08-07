---
description: "Установка и проверка полного Firecrawl toolkit: CLI, upstream build/workflow skills и browser auth. Мутирует окружение — требует подтверждения."
argument-hint: "[установить | только проверить]"
allowed-tools: Read, Write, Bash, Grep, Glob, WebFetch
---

Проверь Firecrawl для задачи: **$ARGUMENTS**.

Сначала выполни read-only проверки `command -v firecrawl` и `firecrawl --status`. Если установка/авторизация нужна, объясни изменения и дождись явного подтверждения, затем запусти официальный `npx -y firecrawl-cli@latest init --all --browser`. Не принимай и не записывай ключ из чата без отдельного согласия. После установки повтори status, создай `.firecrawl/` и сделай smoke scrape `https://firecrawl.dev` в `.firecrawl/install-check.md`. Сообщи версии, auth status и путь результата без раскрытия секретов.
