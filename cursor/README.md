# Agent-Vorcl-Flow для Cursor

Адаптер устанавливает skills в `~/.cursor/skills` и custom agents с префиксом `avf-` в `~/.cursor/agents`. Агенты наследуют выбранную в клиенте модель; роли аудита получают `readonly: true` по реестру `scripts/roles.json`.

```bash
npx github:Vitammiin/agent-vorcl-flow --cursor --dry-run
npx github:Vitammiin/agent-vorcl-flow --cursor
```

Каталог можно изменить через абсолютный путь `CURSOR_HOME`. Без флагов установщик показывает справку; `--all` явно выбирает все адаптеры. После установки откройте новый чат или перезапустите Cursor.

```text
/vorcl добавить корзину в checkout
/backend-create-api POST /invoices
/analyzer-audit
/avf-backend реализуй API выставления счетов
```

Workflow хранит план и результаты в текущем чате. Task Master используется только по явному выбору пользователя и через уже доступные инструменты. Подключения MCP, `mcp.json`, настройки клиента, секреты и hooks установщик не изменяет.

Повторная установка обновляет только неизменённые компоненты, записанные в `.agent-vorcl-flow-install.json`. Чужие skills/agents, upstream Firecrawl и локальные изменения сохраняются целиком. Старые установки без реестра владения также сохраняются и требуют ручного разбора перед заменой.

Для поиска следов прежней версии без изменений файлов:

```bash
npx github:Vitammiin/agent-vorcl-flow --check-legacy
```

Проверка выводит только пути. Порядок перехода описан в [руководстве по миграции](../docs/MIGRATION.md).
