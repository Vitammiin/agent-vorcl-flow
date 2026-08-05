---
name: workflow
description: Обязательная дисциплина работы — любая нетривиальная задача проходит через Task Master (цель → задачи → next → реализация → set-status). Use ВСЕГДА и всеми агентами перед реализацией; определяет цикл ролей Orchestrator/Executor/Checker, как вызывать (точки входа /vorcl и /<agent>:vorcl), последовательность MCP-инструментов task-master и шпаргалку команд.
---

# Навык: Workflow (Task Master)

**Правило: любая нетривиальная задача проходит через Task Master. Без исключений.** Справочник инструментов — скилл **task-master**.

## Как вызывать (точки входа)

### 1. Слэш-командой — обычный путь
- **`/vorcl <цель>`** — универсальный вход: при необходимости инициализирует Task Master, раскладывает цель на задачи и ведёт весь цикл, сам определяя домен и делегируя профильному субагенту.
- **`/<agent>:vorcl <цель>`** — если область известна заранее, входи сразу в неё:
  `/architect:vorcl` · `/backend:vorcl` · `/frontend:vorcl` · `/analyzer:vorcl` · `/swagger:vorcl` · `/firecrawl:vorcl` · `/render:vorcl` · `/database:vorcl` · `/resilience:vorcl` · `/screenshot:vorcl` · `/drawio:vorcl`

Примеры:
```
/vorcl          собрать биллинг для SaaS (API + экран + БД)
/backend:vorcl  добавить эндпоинт POST /invoices с валидацией и тестами
/drawio:vorcl   схема архитектуры сервиса + ERD базы
```

### 2. Напрямую инструментами task-master — если работаешь без слэш-команды
```
task-master init                       # один раз, если нет .taskmaster/
add_task "добавить POST /invoices"     # точечная задача (крупная фича — parse_prd)
next_task                              # → следующая задача (id)
get_task <id>                          # детали + testStrategy
expand_task <id>                       # при высокой сложности (после analyze_project_complexity)
# … реализация … update_subtask <id> "<что сделано / заметки>"
set_task_status --id=<id> --status=done
```

## Три роли цикла
- **Orchestrator** — выбирает следующую задачу: `next_task` / `get_tasks`.
- **Executor** — берёт задачу и делает: `get_task` → при сложности `expand_task` → реализация → `update_subtask` (лог хода/заметок).
- **Checker** — проверяет `testStrategy` → `set_task_status --status=done`.

## Канонический цикл
1. **Цель → задачи.** Крупная фича — оформи/дополни PRD в `.taskmaster/docs/prd.txt` и запусти `parse_prd`. Точечная задача — `add_task`.
2. `next_task` — взять следующую актуальную задачу.
3. `get_task <id>` — прочитать детали и `testStrategy`.
4. `expand_task <id>` — при высокой сложности (после `analyze_project_complexity`).
5. **Реализация** — делать текущую задачу; делегировать доменному субагенту (architect/backend/frontend/analyzer/…/drawio).
6. **Проверка** — прогнать `testStrategy`; при провале — не закрывать.
7. `set_task_status --status=done` — и вернуться к шагу 2, пока есть задачи.

## Шпаргалка команд (хуки)
| Триггер | Что делает |
|---|---|
| `/vorcl <цель>` | Универсальный вход; роутит к профильному субагенту и ведёт цикл |
| `/<agent>:vorcl <цель>` | Вход сразу в область агента (backend/frontend/…/drawio) |
| `task-master init` | Создать `.taskmaster/` (один раз на проект) |
| `add_task "<описание>"` | Точечная задача (ИИ-ассист) |
| `parse_prd` | PRD (`.taskmaster/docs/prd.txt`) → набор задач |
| `next_task` | Следующая актуальная задача (без блокеров) |
| `get_task <id>` | Детали задачи + `testStrategy` |
| `analyze_project_complexity` | Оценка сложности 1–10 перед разбиением |
| `expand_task <id>` | Разбить задачу на подзадачи |
| `update_subtask <id> "<лог>"` | Зафиксировать прогресс/заметки |
| `set_task_status --id=<id> --status=done` | Закрыть задачу (после `testStrategy`) |

CLI-эквиваленты MCP-инструментов и статусы задач — в скилле **task-master**.

## Когда можно пропустить
Только тривиальные действия: правка в 1–3 строки, ответ на вопрос, переименование, мелкий фикс без риска. Всё остальное — через цикл.

## Запреты
- Не выдумывай ID задач — всегда `get_task`/`next_task`.
- Не ставь `done` без прохождения `testStrategy`.
- Не теряй контекст между задачами — фиксируй через `update_subtask`.
