---
name: firecrawl-setup
description: "Проверка и установка полного Firecrawl toolkit: CLI, upstream build/workflow skills и browser auth. Мутирует окружение и требует подтверждения."
---

# Firecrawl setup

Проверь `command -v firecrawl` и `firecrawl --status`. Если нужна установка или авторизация, объясни изменения, дождись явного подтверждения и запусти `npx -y firecrawl-cli@latest init --all --browser`. Затем повтори status и сделай smoke scrape `https://firecrawl.dev` в `.firecrawl/install-check.md`. Не сохраняй ключ из чата и не раскрывай секреты.
