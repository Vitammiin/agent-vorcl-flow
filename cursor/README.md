# Agent-Vorcl-Flow — адаптер для Cursor

Инсталлер использует нативные механизмы Cursor:

- `~/.cursor/skills/<name>/SKILL.md` — все доменные и task-скиллы; доступны автоматически и через `/name`.
- `~/.cursor/agents/avf-<name>.md` — 22 custom subagents с `model: inherit`; read-only роли получают `readonly: true`. Префикс `avf-` не даёт именам конфликтовать со скиллами-персонами.
- `~/.cursor/mcp.json` — MCP-серверы. Существующие серверы пользователя не перезаписываются.

## Установка

```bash
npx github:Vitammiin/agent-vorcl-flow --cursor
```

Можно переопределить каталог конфигурации: `CURSOR_HOME=/path/to/.cursor`.

После установки перезапустите Cursor или откройте новое окно Agent. В чате доступны, например:

```text
/vorcl добавить корзину в checkout
/audit .
/backend-create-api POST /invoices
/analyzer-audit
/avf-backend реализуй API выставления счетов
/firecrawl-setup
/firecrawl-research сравни подходы к browser agents
/visual-research-answer ./screen.png почему кнопка недоступна?
/avf-expo-mobile добавь offline-first экран транзакций
/expo-mobile-design-screen premium dashboard портфеля
/expo-mobile-motion card-to-details interaction
/expo-mobile-audit
/expo-mobile-ui-audit
/expo-mobile-compatibility ./apps/mobile Reanimated upgrade
```

В Cursor namespaced Claude-команды представлены дефисными skills: например, `/firecrawl:interact` → `/firecrawl-interact`, `/firecrawl:integrate` → `/firecrawl-integrate`. Официальные upstream `firecrawl-*` skills не перезаписываются.

Ключи задавать в окружении/`~/.zshrc` больше не нужно: MCP-серверы стартуют через launcher `bin/mcp-env.mjs`, который читает секреты из единого `~/.config/agent-vorcl-flow/.env` (тот же файл для Claude/Codex/Cursor/Kimi). Установщик создаёт его из `.env.example` и подставляет абсолютный путь launcher'а в `~/.cursor/mcp.json`. Впиши нужные ключи (`ANTHROPIC_API_KEY`, `GITHUB_TOKEN`, `FIRECRAWL_API_KEY`, подключения БД) в этот `.env`; сервер без ключа просто не поднимается, остальные работают.
