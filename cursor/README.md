# Agent-Vorcl-Flow — адаптер для Cursor

Инсталлер использует нативные механизмы Cursor:

- `~/.cursor/skills/<name>/SKILL.md` — все доменные и task-скиллы; доступны автоматически и через `/name`.
- `~/.cursor/agents/avf-<name>.md` — 20 custom subagents с `model: inherit`; read-only роли получают `readonly: true`. Префикс `avf-` не даёт именам конфликтовать со скиллами-персонами.
- `~/.cursor/mcp.json` — MCP-серверы. Существующие серверы пользователя не перезаписываются.

## Установка

```bash
npx github:Vitammiin/agent-vorcl-flow --cursor
```

Можно переопределить каталог конфигурации: `CURSOR_HOME=/path/to/.cursor`.

После установки перезапустите Cursor или откройте новое окно Agent. В чате доступны, например:

```text
/vorcl добавить корзину в checkout
/backend-create-api POST /invoices
/analyzer-audit
/avf-backend реализуй API выставления счетов
/firecrawl-setup
/firecrawl-research сравни подходы к browser agents
/visual-research-answer ./screen.png почему кнопка недоступна?
```

В Cursor namespaced Claude-команды представлены дефисными skills: например, `/firecrawl:interact` → `/firecrawl-interact`, `/firecrawl:integrate` → `/firecrawl-integrate`. Официальные upstream `firecrawl-*` skills не перезаписываются.

Cursor подхватывает MCP-переменные в формате `${env:NAME}`. Перед запуском задайте нужные ключи в окружении (`ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `FIRECRAWL_API_KEY` и подключения БД).
