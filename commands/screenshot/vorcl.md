---
description: Цель (интерфейс/набор экранов из скриншотов) через Task Master — разбор → код до готового (screenshot). Use when экранов несколько или цель комплексная; один экран → /screenshot:convert, существующий UI в кодовой базе → /pinpoint:vorcl
argument-hint: "<цель: экран/набор экранов + путь(и) к скриншоту(ам)>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Возьми цель по конвертации скриншота(ов) в код в работу через Task Master: **$ARGUMENTS**.

1. Убедись, что Task Master инициализирован (`.taskmaster/`); если нет — `task-master init`.
2. Открой скриншот(ы) через Read и разложи цель на задачи (`add_task`; целый интерфейс — PRD + `parse_prd`): какие экраны/компоненты воспроизвести, какие переиспользуемые компоненты выделить, какие дизайн-токены (`@theme`) извлечь, какой фреймворк.
3. `next_task` → `get_task`; воспроизводи UI: семантический HTML, точные цвета (hex→OKLCH-токены), spacing/пропорции, состояния, адаптив, a11y. Ход фиксируй через `update_subtask`.
4. Проверь `testStrategy` (вёрстка соответствует скриншоту, токены на месте, a11y и адаптив есть, тесты/сборка зелёные) → `set_task_status --status=done`; вернись к шагу 3.

Воспроизводи точно, не «на глаз»; неоднозначное помечай допущением или уточняй. Опирайся на навыки `screenshot-to-code`, `tailwind`, `react`, `nextjs`, `typescript`, `frontend-architecture`, `workflow`, `task-master`. Делегируй субагенту `screenshot`.
