# Agent-Vorcl-Flow — адаптер для Kimi CLI

Skills, нативный Expo custom agent, architecture hook и MCP-серверы для [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) (MoonshotAI).

## Установка

```bash
npx github:Vitammiin/agent-vorcl-flow --kimi
```

Установщик:
1. кладёт launcher в `~/.config/agent-vorcl-flow/bin/mcp-env.mjs`;
2. создаёт единый файл секретов `~/.config/agent-vorcl-flow/.env` из шаблона (если его ещё нет);
3. копирует AVF skills в `~/.kimi/skills` — они доступны автоматически и через `/skill:<name>`;
4. устанавливает `~/.kimi/agents/avf-expo-mobile.yaml`;
5. идемпотентно добавляет Expo PostToolUse guard в `~/.kimi/config.toml`;
6. вмёрживает серверы в `~/.kimi/mcp.json`, не затирая существующие.

Затем впиши ключи в `~/.config/agent-vorcl-flow/.env` (тот же файл, что для Claude/Codex/Cursor)
и перезапусти Kimi. Expo-профиль запускается так:

```bash
kimi --agent-file ~/.kimi/agents/avf-expo-mobile.yaml
```

Примеры skills:

```text
/skill:expo-mobile-vorcl добавить offline-first транзакции
/skill:expo-mobile-create-screen экран истории операций
/skill:expo-mobile-audit
```

## Почему через launcher

Kimi CLI не поддерживает подстановку `${VAR}` в `mcp.json` и берёт окружение своего процесса —
при GUI-запуске в нём нет того, что ты экспортировал в `~/.zshrc`. Поэтому каждый сервер
запускается через `bin/mcp-env.mjs`, который сам читает секреты из `.env`. Синтаксис
подстановки рантайма при этом не важен — работает одинаково везде.

## Проверка

```bash
kimi mcp list          # список подключённых серверов
kimi mcp test github   # проверить соединение и инструменты сервера
/hooks                 # убедиться, что Expo guard загружен
```

Сервер без нужного ключа не поднимается — в логах будет строка вида
`[agent-vorcl-flow] MCP «…» не настроен: не задан …`. Добавь ключ в `.env` — заработает.

## Ручная установка (без установщика)

Скопируй `codex/skills/*` в `~/.kimi/skills`, `kimi/agents/*` в `~/.kimi/agents`, затем
добавь `kimi/hooks.toml` в `~/.kimi/config.toml`, заменив `__AVF_EXPO_GUARD__` абсолютным путём
к `skills/expo-mobile-architecture/scripts/guard.mjs`. Для MCP скопируй `mcp.json` и замени
`__AVF_LAUNCHER__` абсолютным путём к `bin/mcp-env.mjs`, либо добавь сервер точечно:

```bash
kimi mcp add --transport stdio mermaid -- \
  node /абсолютный/путь/bin/mcp-env.mjs -- npx -y mcp-mermaid
```
