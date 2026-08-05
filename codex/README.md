# Agent-Vorcl-Flow — адаптер для GPT Codex

Те же роли и навыки, что и в плагине Claude Code, но в форматах Codex CLI.

## Что внутри
```
codex/
├── skills/<name>/SKILL.md   # навыки Codex (.agents/skills): персоны ролей + доменные + задачи
├── config.toml              # MCP-серверы [mcp_servers.*] + профили ролей [profiles.*]
├── AGENTS.md                # роутинг ролей (architect, backend, frontend, analyzer, swagger, firecrawl, render, database, resilience, screenshot, drawio)
└── scripts/install.sh       # установка в ~/.agents/skills и ~/.codex
```

## Роли
`$architect` · `$backend` · `$frontend` · `$analyzer` · `$swagger` · `$firecrawl` · `$render` · `$database` · `$resilience` · `$screenshot` · `$drawio`. Все работают через Task Master (`$workflow` + `$task-master`); единая точка входа — `$goal`, у каждой роли свой `$<role>-goal`. У `render` и `database` персона и доменный скилл совпадают — это `$render` и `$database`; у `resilience` доменный скилл — `$error-handling`, у `screenshot` — `$screenshot-to-code`, у `drawio` — `$drawio-diagrams` + `$pmp-diagrams`.

## Маппинг Claude Code → Codex
| Claude Code | Codex |
|---|---|
| субагент `@…:frontend` | скилл-персона `$frontend` + `codex --profile frontend` |
| скилл `frontend-architecture` | скилл `$frontend-architecture` |
| команда `/analyzer:audit` | скилл-задача `$analyzer-audit` |
| команда `/goal` | скилл-задача `$goal` |
| `.mcp.json` (task-master) | `[mcp_servers.task-master]` в `config.toml` |
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
> $goal  добавить корзину в чекаут          # цель → задачи → цикл (роутит к роли)
> $architect  спроектируй биллинг для SaaS
> $backend-create-api  POST /invoices
> $frontend-create-component  список заказов с пагинацией
> $frontend-goal  экран профиля пользователя
> $analyzer-audit                            # полный read-only аудит
> $analyzer-mocks  src/features              # mockup-данные на фронте
> $render-goal  подними api-сервис и дай ему доступ к БД   # инфра-цель → задачи → цикл
> $render-deploy  api  --clear-cache        # деплой на Render (сначала выбери workspace)
> $render-logs  api                         # диагностика логов до первопричины (build vs runtime)
> $screenshot-convert  ./mock/dashboard.png  react   # скриншот UI → компонент (React + Tailwind v4)
> $screenshot-tokens   ./mock/dashboard.png          # извлечь дизайн-токены (@theme, OKLCH)
> $drawio-create  флоу оформления заказа  flowchart  # описание → .drawio (нативный XML)
> $drawio-pmp     wbs  проект запуска мобильного приложения   # WBS-дерево в draw.io
> $drawio-convert ./prisma/schema.prisma  erd        # схема БД → ERD .drawio

codex --profile analyzer    # роль аудита с повышенным reasoning
codex --profile render      # роль хостинга/деплоя на Render
```
