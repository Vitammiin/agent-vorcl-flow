---
name: task-master
description: Справочник Task Master (task-master-ai) — MCP-сервер и CLI для управления задачами: PRD → задачи → подзадачи → реализация → статусы. Use при работе с задачами, планировании из PRD, разбиении на подзадачи и отслеживании прогресса. Дисциплину задаёт скилл workflow.
---

# Навык: Task Master

Task Master (`task-master-ai`) — управление задачами разработки, ведомое ИИ. MCP-сервер `task-master`. Хранилище — каталог `.taskmaster/`.

## Инициализация
```
task-master init            # создаёт .taskmaster/, tasks/tasks.json, docs/prd.txt, config.json
```
PRD кладётся в `.taskmaster/docs/prd.txt`; задачи — в `.taskmaster/tasks/tasks.json`; конфиг моделей — `.taskmaster/config.json`.

## MCP-инструменты
| Инструмент | Назначение |
|---|---|
| `parse_prd` | Распарсить PRD в структурированные задачи |
| `get_tasks` | Список задач (с фильтром по статусу) |
| `get_task` | Детали задачи (описание, `testStrategy`, подзадачи) |
| `next_task` | Следующая актуальная задача (без блокеров) |
| `expand_task` | Разбить задачу на подзадачи |
| `set_task_status` | Обновить статус задачи |
| `update_subtask` | Дописать заметки/прогресс в подзадачу |
| `add_task` | Добавить точечную задачу (ИИ-ассист) |
| `analyze_project_complexity` | Оценить сложность (1–10) и рекомендации по разбиению |
| `models` | Посмотреть/выбрать main, research и fallback модель |

## CLI-эквиваленты
| CLI | Эквивалент |
|---|---|
| `task-master init` | инициализация |
| `task-master parse-prd <file>` | `parse_prd` |
| `task-master list [--status=<s>]` | `get_tasks` |
| `task-master show <id>` | `get_task` |
| `task-master next` | `next_task` |
| `task-master expand --id=<id> [--research]` | `expand_task` |
| `task-master set-status --id=<id> --status=<s>` | `set_task_status` |
| `task-master update-subtask --id=<id> --prompt="<лог>"` | `update_subtask` |
| `task-master analyze-complexity` | `analyze_project_complexity` |
| `task-master add-task` | `add_task` |
| `task-master models [--setup]` | показать/интерактивно выбрать модели |
| `task-master models --set-main=<model-id>` | выбрать OpenAI/Anthropic main по известному model ID |
| `task-master models --set-main=<model-id> --codex-cli` | выбрать Codex CLI через OAuth |

## Статусы задач
`pending → in-progress → done`; дополнительно `deferred`, `cancelled`, `review`.

## Дисциплина и конфигурация
- Дисциплину цикла (роли Orchestrator/Executor/Checker, канонический порядок, когда можно пропустить, запреты) задаёт скилл **workflow** — этот скилл только справочник инструментов.
- Ключи: `ANTHROPIC_API_KEY` для Claude, `OPENAI_API_KEY` для GPT; `PERPLEXITY_API_KEY` нужен только при выборе Perplexity как research-модели. Хранить их в env/MCP, не в `.taskmaster/config.json`.
- Выбор `main`/`research`/`fallback` хранится в `.taskmaster/config.json` и меняется через `task-master models` или MCP `models`. Быстрая команда плагина — `/task-master:provider`.
- Codex CLI можно выбрать через `--codex-cli` и OAuth (`codex login`) без API-ключа.
