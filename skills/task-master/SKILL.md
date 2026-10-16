---
name: task-master
description: "Опциональный адаптер Task Master для явно выбранного пользователем persistent tracking; существующие capabilities и настройки сохраняются, workflow задаёт scoped IDs и atomic claims."
---

# Task Master — opt-in adapter

Загружай этот навык только если пользователь явно выбрал Task Master для текущей задачи или запросил его настройку. Наличие `.taskmaster/`, установленного CLI или подключённого MCP не является выбором. По умолчанию работай session-first по **workflow**; отсутствие Task Master не блокирует обычную разработку.

## Обнаружение вместо установки

1. Найди фактически доступные инструменты сессии по описаниям. Имя сервера, tool prefix, параметры и версия могут отличаться; не предполагай `mcp__task_master__*` или конкретный transport.
2. Прочитай schema нужной операции и установи project root и tag/namespace, если они поддержаны. Не переключай глобальный active project/tag и не меняй чужие tasks.
3. Если MCP недоступен, используй уже установленный и настроенный CLI только в явно выбранном Task Master режиме; проверь `--help` и передай project root поддерживаемым способом. Не выполняй `npx ...@latest`, install или init ради продолжения обычной работы.
4. При недоступном адаптере сообщи, что persistence не выполнена, и продолжай независимую работу session-first. Не создавай replacement JSON и не заявляй об успешных статусах.

## Operations (названия для ориентира)

| Возможность | Типичные названия | Граница |
| --- | --- | --- |
| Прочитать задачи | `get_tasks`, `get_task` / `list`, `show` | Только выбранный project/tag |
| Создать задачи | `add_task`, `parse_prd` | Захватить IDs из ответа записи; не перезаписывать PRD или существующий backlog |
| Разбить задачу | `expand_task` | Только allowlisted task и явная необходимость |
| Изменить статус | `set_task_status` / `set-status` | Atomic claim до `in-progress`; только Orchestrator ставит `done` |
| Прогресс подзадачи | `update_subtask` | Только реально существующий subtask ID; не top-level ID |
| Посмотреть модели | `models` | Read-only inspection при запросе пользователя |

`next_task`/`next` не являются claim: bare `next_task` по общему backlog запрещён. Для allowlisted задач следуй scoped run contract из **workflow**. AVF claims/runs хранятся отдельно в `.agent-vorcl/`; `.taskmaster/` принадлежит самому Task Master, JSON вручную не редактируй.

При transport failure допустим один повтор idempotent read. После неизвестного исхода write сначала reconcile по read; не повторяй add/parse/status вслепую и не захватывай IDs неустановленной операции. Auth/provider/encoding ошибки не исправляй сменой конфигурации.

## Настройка — отдельный явный запрос

`task-master init` допустим только если пользователь отдельно попросил инициализацию конкретного проекта. Сначала проверь существующие файлы и `--help`; не перезаписывай project/backlog и не меняй MCP registration. Если пользователь запросил смену provider/model, используй `/task-master:provider` и только заданные поля. Существующие providers, main/research/fallback models, transport и credentials сохраняются по умолчанию. Ключи не выводи и не записывай в проект; используй существующий механизм секретов пользователя.
