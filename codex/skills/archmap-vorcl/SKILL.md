---
name: archmap-vorcl
description: Цель по картированию архитектуры через Task Master — до полного набора проверенных артефактов (роль archmap). Use when целей несколько или репо крупное/монорепо; разовая полная карта → $archmap-map, только JSON → $archmap-extract, только HTML → $archmap-html.
---

# Задача: цель по картированию архитектуры через workflow (archmap)

Возьми цель по картированию архитектуры в работу через Task Master (см. `$archmap`, `$workflow`, `$task-master`).

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Разложи цель на задачи (`add_task`; крупное репо/монорепо — PRD + `parse_prd`): scan и extraction по слоям, merge с проверкой контракта, LLM-аннотация, рендеры по форматам, финальная сверка артефактов.
3. `next_task` → `get_task`; выполняй фазами скилла `$archmap`: скрипты extraction → `architecture.json` (каждый узел с `source:{file,line}`) → `annotations.json` → рендеры строго из JSON. Ход фиксируй через `update_subtask`.
4. Проверь `testStrategy` (повторный прогон даёт идентичный JSON; HTML открывается с `file://`; `xmllint --noout` для drawio; mermaid отрендерен; inferred помечен пунктиром) → `set_task_status --status=done`; вернись к шагу 3.

Отдавай пути к артефактам + сводку из `stats` + список inferred. Опирайся на `$archmap`, `$system-design`, `$drawio-diagrams`, `$mermaid-diagrams`, `$workflow`, `$task-master`. Веди как роль `$archmap`.
