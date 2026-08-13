---
name: workflow
description: Обязательная дисциплина работы — любая нетривиальная задача проходит через Task Master (цель → задачи → next → реализация → set-status). Use ВСЕГДА и всеми ролями перед реализацией; определяет цикл Orchestrator/Executor/Checker, как вызывать ($vorcl и $<role>-vorcl) и последовательность цикла. Справочник команд/инструментов — $task-master.
---

# Навык: Workflow (Task Master)

**Правило: любая нетривиальная задача проходит через Task Master. Без исключений.** Справочник инструментов — `$task-master`.

## Как вызывать (точки входа)

### 1. Скилл-задачей — обычный путь
- **`$vorcl <цель>`** — универсальный вход: при необходимости инициализирует Task Master, раскладывает цель на задачи и ведёт весь цикл, роутя к профильной роли.
- **`$<role>-vorcl <цель>`** — если область известна заранее, входи сразу в неё:
  `$architect-vorcl` · `$principal-architect-vorcl` · `$backend-vorcl` · `$frontend-vorcl` · `$expo-mobile-vorcl` · `$analyzer-vorcl` · `$swagger-vorcl` · `$firecrawl-vorcl` · `$render-vorcl` · `$database-vorcl` · `$resilience-vorcl` · `$screenshot-vorcl` · `$design-studio-vorcl` · `$pinpoint-vorcl` · `$drawio-vorcl` · `$mermaid-vorcl`

Примеры:
```
$vorcl          собрать биллинг для SaaS (API + экран + БД)
$backend-vorcl  добавить эндпоинт POST /invoices с валидацией и тестами
$drawio-vorcl   схема архитектуры сервиса + ERD базы
```

### 2. Напрямую инструментами task-master — если работаешь без скилл-задачи
Последовательность та же, что в каноническом цикле ниже: `task-master init` (один раз, если нет `.taskmaster/`) → далее по циклу. Синтаксис MCP-инструментов, CLI-эквиваленты и статусы — в `$task-master`.

## Три роли цикла
- **Orchestrator** — выбирает следующую задачу: `next_task` / `get_tasks`.
- **Executor** — берёт задачу и делает: `get_task` → при сложности `expand_task` → реализация → `update_subtask`.
- **Checker** — проверяет `testStrategy` → `set_task_status --status=done`.

## Канонический цикл
1. **Цель → задачи.** Крупная фича — PRD в `.taskmaster/docs/prd.txt` + `parse_prd`. Точечная — `add_task`.
2. `next_task` — следующая актуальная задача.
3. `get_task <id>` — детали и `testStrategy`.
4. `expand_task <id>` — при высокой сложности (после `analyze_project_complexity`).
5. **Реализация** — текущая задача профильной ролью (architect/backend/frontend/analyzer/…/drawio/mermaid).
6. **Проверка** — `testStrategy`; при провале — не закрывать.
7. `set_task_status --status=done` — и назад к шагу 2.

Полный справочник команд (MCP-инструменты, CLI-эквиваленты, статусы, конфигурация) — в `$task-master`.

## Когда можно пропустить
Только тривиальное: правка 1–3 строки, ответ на вопрос, мелкий фикс. Всё остальное — через цикл.

## Запреты
- Не выдумывай ID задач (`get_task`/`next_task`).
- Не ставь `done` без `testStrategy`.
- Фиксируй прогресс через `update_subtask`.
