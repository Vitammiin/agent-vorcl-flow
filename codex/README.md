# Agent-Vorcl-Flow — адаптер для GPT Codex

Те же роли и навыки, что и в плагине Claude Code, но в форматах Codex CLI.

## Что внутри
```
codex/
├── skills/<name>/SKILL.md   # навыки Codex (.agents/skills): 2 персоны + 9 доменных + 7 задач
├── config.toml              # MCP-серверы [mcp_servers.*] + профили ролей [profiles.*]
├── AGENTS.md                # роутинг ролей (architect, backend)
└── scripts/install.sh       # установка в ~/.agents/skills и ~/.codex
```

## Маппинг Claude Code → Codex
| Claude Code | Codex |
|---|---|
| субагент `@…:architect` | скилл-персона `$architect` + `codex --profile architect` |
| скилл `system-design` | скилл `$system-design` |
| команда `/architect:analyze` | скилл-задача `$architect-analyze` |
| `.mcp.json` | `[mcp_servers.*]` в `config.toml` |
| хук SessionStart | роутинг ролей в `AGENTS.md` |

> У Codex нет субагентов и слэш-команд как в Claude Code — всё выражено через **skills** (вызов `$name`), **profiles** и **AGENTS.md**.

## Установка
```bash
bash codex/scripts/install.sh
# затем впишите токены в ~/.codex/config.toml:
#   GITHUB_PERSONAL_ACCESS_TOKEN, URL для postgres/redis
```

## Использование
```
codex
> $architect  спроектируй биллинг для SaaS
> $architect-analyze  требования к биллингу
> $backend-create-api  POST /invoices

codex --profile architect   # роль с повышенным reasoning
```
