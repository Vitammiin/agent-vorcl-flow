---
name: task-master
description: "Справочник Task Master: MCP/CLI, задачи, статусы, scoped run, safe retry и fallback. Use для persistent task tracking; дисциплину и режимы задаёт $workflow."
---

# Навык: Task Master

Task Master (`task-master-ai`) — управление задачами разработки, ведомое ИИ. MCP-сервер `task-master`. Хранилище — `.taskmaster/`.

## Инициализация
```
task-master init            # .taskmaster/, tasks/tasks.json, docs/prd.txt, config.json
```

## MCP-инструменты
| Инструмент | Назначение |
|---|---|
| `parse_prd` | PRD → задачи |
| `get_tasks` | Список задач |
| `get_task` | Детали задачи (+`testStrategy`) |
| `next_task` | Глобальная подсказка backlog; не claim scoped run |
| `expand_task` | Разбить на подзадачи |
| `set_task_status` | Обновить статус |
| `update_subtask` | Заметки/прогресс |
| `add_task` | Точечная задача |
| `analyze_project_complexity` | Оценка сложности + рекомендации |
| `models` | Посмотреть/выбрать main, research и fallback модель |

## CLI-эквиваленты
`init` · `parse-prd <file>` · `list [--status=<s>]` · `show <id>` · `next` · `expand --id=<id> [--research]` · `set-status --id=<id> --status=<s>` · `update-subtask --id=<id> --prompt="<лог>"` · `analyze-complexity` · `add-task` · `models`.

## Статусы
`pending → in-progress → done`; плюс `deferred`, `cancelled`, `review`.

## Дисциплина и конфигурация
- Дисциплину задаёт `$workflow`. Сохраняй IDs текущего `add_task`/`parse_prd`; scoped run + atomic claim обязательны до `in-progress`. Bare `next_task` может вернуть чужую задачу.
- `update_subtask` допустим только для настоящего `<task>.<subtask>`; top-level note API нет, JSON вручную не редактируй.
- Transport: один retry только для idempotent reads. Перед retry write проверь через `get_task`/`get_tasks`, не применилось ли оно. Auth/provider/encoding: CLI с явным project root и UTF-8 file input или честный degraded mode, без слепого повтора.
- `ANTHROPIC_API_KEY` обслуживает Claude, `OPENAI_API_KEY` — GPT; `PERPLEXITY_API_KEY` нужен только для Perplexity research. Ключи остаются в env/MCP.
- Модели `main`/`research`/`fallback` выбираются через `task-master models`/MCP `models` и сохраняются в `.taskmaster/config.json`. Используй `$task-master-provider` для безопасного переключения.
- Codex CLI работает через `task-master models --set-main=<id> --codex-cli` и OAuth (`codex login`) без API-ключа.
