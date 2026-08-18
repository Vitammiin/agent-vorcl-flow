---
name: task-master-provider
description: "Выбрать и проверить AI provider/model Task Master для main, research и fallback без раскрытия ключей."
---

# Выбор провайдера Task Master

1. Выполни `task-master models`; покажи модели и только наличие ключей, не значения.
2. Для `openai` требуй `OPENAI_API_KEY`, для `anthropic`/`claude` — `ANTHROPIC_API_KEY`, для `codex-cli` — `codex login`.
3. Если model ID не задан, покажи доступные варианты из `task-master models` и попроси выбрать; не угадывай актуальную модель.
4. OpenAI/Anthropic: `task-master models --set-main=<model-id>`. Codex CLI: добавь `--codex-cli`.
5. Повтори `task-master models` и подтверди выбранный `main`.

Не менять `research`/`fallback` без явного запроса. Конфигурация модели хранится в `.taskmaster/config.json`, ключи — только в env/MCP. Perplexity является отдельным опциональным research-провайдером.
