---
name: task-master
description: Справочник Task Master (task-master-ai) — MCP-сервер и CLI для управления задачами: PRD → задачи → подзадачи → реализация → статусы. Use при работе с задачами, планировании из PRD, разбиении на подзадачи и отслеживании прогресса. Дисциплину задаёт скилл workflow.
---

# Навык: Task Master

Task Master (`task-master-ai`) — управление задачами разработки, ведомое ИИ. MCP-сервер `task-master`. Хранилище — каталог `.taskmaster/`.

## Инициализация
```
task-master init            # создаёт .taskmaster/, tasks.json, .taskmaster/docs/prd.txt, .taskmasterconfig
```
PRD кладётся в `.taskmaster/docs/prd.txt`; задачи — в `.taskmaster/tasks.json`; конфиг моделей — `.taskmasterconfig`.

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

## Статусы задач
`pending → in-progress → done`; дополнительно `deferred`, `cancelled`, `review`.

## Дисциплина и конфигурация
- Дисциплину цикла (роли Orchestrator/Executor/Checker, канонический порядок, когда можно пропустить, запреты) задаёт скилл **workflow** — этот скилл только справочник инструментов.
- `--research` (Perplexity) даёт актуальные практики при `expand`, если задан `PERPLEXITY_API_KEY`.
- Ключи задаются через userConfig плагина (`anthropic_api_key`, опц. `perplexity_api_key`); при их отсутствии Task Master пытается использовать авторизацию среды.
