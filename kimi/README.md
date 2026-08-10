# Agent-Vorcl-Flow — адаптер для Kimi CLI

MCP-серверы плагина для [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI). Kimi
читает `~/.kimi/mcp.json` в той же `mcpServers`-схеме, что Claude и Cursor.

## Установка

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
```

Установщик:
1. кладёт launcher в `~/.config/agent-vorcl-flow/bin/mcp-env.mjs`;
2. создаёт единый файл секретов `~/.config/agent-vorcl-flow/.env` из шаблона (если его ещё нет);
3. вмёрживает наши серверы в `~/.kimi/mcp.json`, подставляя абсолютный путь launcher'а
   (существующие серверы не затирает).

Затем впиши ключи в `~/.config/agent-vorcl-flow/.env` (тот же файл, что для Claude/Codex/Cursor)
и перезапусти Kimi.

## Почему через launcher

Kimi CLI не поддерживает подстановку `${VAR}` в `mcp.json` и берёт окружение своего процесса —
при GUI-запуске в нём нет того, что ты экспортировал в `~/.zshrc`. Поэтому каждый сервер
запускается через `bin/mcp-env.mjs`, который сам читает секреты из `.env`. Синтаксис
подстановки рантайма при этом не важен — работает одинаково везде.

## Проверка

```bash
kimi mcp list          # список подключённых серверов
kimi mcp test github   # проверить соединение и инструменты сервера
```

Сервер без нужного ключа не поднимается — в логах будет строка вида
`[agent-vorcl-flow] MCP «…» не настроен: не задан …`. Добавь ключ в `.env` — заработает.

## Ручная установка (без установщика)

Скопируй `mcp.json` в `~/.kimi/mcp.json` и замени в нём `__AVF_LAUNCHER__` на абсолютный путь
к `bin/mcp-env.mjs`. Либо добавь сервер точечно:

```bash
kimi mcp add --transport stdio mermaid -- \
  node /абсолютный/путь/bin/mcp-env.mjs -- npx -y mcp-mermaid
```
