---
description: Выбрать AI-провайдера и модель Task Master: OpenAI по OPENAI_API_KEY, Claude по ANTHROPIC_API_KEY или Codex CLI по OAuth. Use когда нужно переключить main/fallback model или уйти от Perplexity для обычной генерации задач.
argument-hint: "<openai|anthropic|codex-cli> [model-id]"
allowed-tools: Read, Bash, Grep, Glob
---

Настрой провайдера Task Master для текущего проекта: **$ARGUMENTS**.

1. Выполни `task-master models` и покажи текущие `main`, `research`, `fallback` и только факт наличия ключей — никогда их значения.
2. Проверь выбранный способ:
   - `openai` → требуется `OPENAI_API_KEY`;
   - `anthropic`/`claude` → требуется `ANTHROPIC_API_KEY`;
   - `codex-cli` → API-ключ не обязателен, нужна авторизация `codex login`.
3. Если `model-id` не передан, получи доступный список через `task-master models` и попроси пользователя выбрать; не угадывай актуальный ID модели.
4. Установи main-модель официальной CLI-командой:
   - OpenAI/Anthropic: `task-master models --set-main=<model-id>` (провайдер определяется Task Master по модели);
   - Codex CLI: `task-master models --set-main=<model-id> --codex-cli`.
5. Снова выполни `task-master models` и докажи, что `main` переключён. Не меняй `research` и `fallback`, если пользователь явно не попросил.

Выбор сохраняется самим Task Master в `.taskmaster/config.json`; ключи остаются только в окружении/MCP-конфиге и никогда не записываются в проект. `PERPLEXITY_API_KEY` относится к опциональной research-модели и не нужен, если обычные AI-команды обслуживает выбранный `main`.
