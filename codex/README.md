# Agent-Vorcl-Flow — адаптер для GPT Codex

Те же роли и навыки, что и в плагине Claude Code, но в форматах Codex CLI.

## Что внутри
```
codex/
├── skills/<name>/SKILL.md   # навыки Codex (.agents/skills): персоны ролей + доменные + задачи
├── config.toml              # MCP-серверы [mcp_servers.*] + профили ролей [profiles.*]
├── AGENTS.md                # роутинг ролей (architect, backend, frontend, analyzer, swagger, firecrawl, render, database, resilience, screenshot, pinpoint, drawio, mermaid)
└── scripts/install.sh       # установка в ~/.agents/skills и ~/.codex
```

## Роли
`$architect` · `$backend` · `$frontend` · `$analyzer` · `$swagger` · `$firecrawl` · `$render` · `$database` · `$resilience` · `$screenshot` · `$pinpoint` · `$drawio` · `$mermaid`. Все работают через Task Master (`$workflow` + `$task-master`); единая точка входа — `$vorcl`, у каждой роли свой `$<role>-vorcl`. У `render` и `database` персона и доменный скилл совпадают — это `$render` и `$database`; у `resilience` доменный скилл — `$error-handling`, у `screenshot` — `$screenshot-to-code`, у `pinpoint` — `$ui-source-mapping`, у `drawio` — `$drawio-diagrams` + `$pmp-diagrams`, у `mermaid` — `$mermaid-diagrams` + `$mermaid-rendering`. Кросс-сквозной скилл `$i18n` (интернационализация, запрет языкового хардкода) подключён у `$frontend`, `$backend`, `$screenshot`, `$pinpoint`, `$resilience`, `$architect` и `$analyzer`.

## Маппинг Claude Code → Codex
| Claude Code | Codex |
|---|---|
| субагент `@…:frontend` | скилл-персона `$frontend` + `codex --profile frontend` |
| скилл `frontend-architecture` | скилл `$frontend-architecture` |
| команда `/analyzer:audit` | скилл-задача `$analyzer-audit` |
| команда `/vorcl` | скилл-задача `$vorcl` |
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
> $vorcl  добавить корзину в чекаут          # цель → задачи → цикл (роутит к роли)
> $architect  спроектируй биллинг для SaaS
> $backend-create-api  POST /invoices
> $frontend-create-component  список заказов с пагинацией
> $frontend-vorcl  экран профиля пользователя
> $analyzer-audit                            # полный read-only аудит
> $analyzer-mocks  src/features              # mockup-данные на фронте
> $render-vorcl  подними api-сервис и дай ему доступ к БД   # инфра-цель → задачи → цикл
> $render-deploy  api  --clear-cache        # деплой на Render (сначала выбери workspace)
> $render-logs  api                         # диагностика логов до первопричины (build vs runtime)
> $screenshot-convert  ./mock/dashboard.png  react   # скриншот UI → компонент (React + Tailwind v4)
> $screenshot-tokens   ./mock/dashboard.png          # извлечь дизайн-токены (@theme, OKLCH)
> $pinpoint-locate     ./shot.png                    # скриншот → место в существующем коде (file:line)
> $pinpoint-route      ./shot.png                    # на какой странице/маршруте открыт экран
> $drawio-create  флоу оформления заказа  flowchart  # описание → .drawio (нативный XML)
> $drawio-pmp     wbs  проект запуска мобильного приложения   # WBS-дерево в draw.io
> $drawio-convert ./prisma/schema.prisma  erd        # схема БД → ERD .drawio
> $mermaid-create  флоу оформления заказа  flowchart   # описание → .mmd (проверен рендером)
> $mermaid-convert ./prisma/schema.prisma  er          # схема БД → erDiagram .mmd

codex --profile analyzer    # роль аудита с повышенным reasoning
codex --profile render      # роль хостинга/деплоя на Render
```
