---
name: mermaid-diagrams
description: Создание диаграмм на языке Mermaid — точный синтаксис по всем 32 типам в каталоге references/ (flowchart, sequence, class, state, ER, gantt, gitGraph, C4, architecture, block, mindmap, treeView, timeline, kanban, pie, xychart, radar, quadrant, sankey, treemap, venn, packet, requirement, journey, swimlane, eventmodeling, cynefin, ishikawa, wardley, railroad, zenuml, usecase), узлы/связи, `subgraph`, `classDef`/`class`/`style`, направление, экранирование подписей, частые AI-ошибки и правила качества. Use при создании, конвертации или правке Mermaid-диаграмм.
---

# Навык: Mermaid-диаграммы

По описанию/исходнику — валидный читаемый Mermaid (`.mmd`). Синтаксис версионно-зависим. Валидацию/рендер см. `$mermaid-rendering`.

**Навигатор.** База: [общий синтаксис](#общий-синтаксис) → [группировка, цвета, стили](#цветагруппы) → [правила качества](#качество). Перед сдачей обязательно: [частые AI-ошибки](#частые-ai-ошибки). Мини-примеры типов — внизу: [Типы](#типы-заголовок).

## Справочники (references/)
Точный синтаксис **не пиши по памяти** — он версионно-зависим. Рядом со скиллом лежит каталог `references/`, дистиллированный из официальной документации mermaid и проверенный рендером: `flowchart.md`, `sequence.md`, `class.md`, `state.md`, `er.md`, `gantt.md`, `gitgraph.md`, `c4.md`, `architecture.md` (+`block`), `hierarchy.md` (mindmap/treeView/timeline/kanban), `charts.md` (pie/xychart/radar/quadrant/sankey/treemap/venn/packet), `modeling.md` (requirement/journey/swimlane/eventmodeling/cynefin/ishikawa/wardley/railroad/usecase), `config.md`, `theming.md`, `gotchas.md`. Открывай только нужный файл.

## Общий синтаксис
Первая строка — тип (`flowchart TD`, `sequenceDiagram`, `classDiagram`…); опечатка ломает файл. Комментарии `%%`. Направление flowchart: `TD`/`LR`/`RL`/`BT`. Подписи со спецсимволами → в кавычки: `A["Текст (v2) & детали"]`.

## Цвета/группы
Группы — `subgraph BACKEND["Сервер"] … end` (парный `end`). Семантические цвета: `classDef service fill:#dae8fc,stroke:#6c8ebf;` + `class API,DB service`; точечно `style A fill:#f8cecc`. Роль → один класс/цвет; граф не перегружай.

## Качество
Тип под задачу (процесс→flowchart, время→sequence, данные→ER, классы→class, состояния→state, план→gantt); направление осознанно (`LR` для длинных цепочек, `TD` для деревьев); большие схемы разбивай; реальный рендер (`$mermaid-rendering`) — окончательный критерий: не отдавай `.mmd`, не прошедший `mmdc`/`mcp-mermaid`. Зелёный рендер ≠ читаемая схема: если можешь посмотреть на PNG/SVG — проверь обрезанные подписи, слипшуюся плотность, спагетти связей, пропорции и контраст; максимум два круга правок, после каждого рендер заново.

## Частые AI-ошибки
Опечатка заголовка (`lowchart`/`sequbceDiagram`); `end` в нижнем регистре как текст узла (пиши `End`/`[End]`/в кавычках); скобки/кавычки/`#`/`;` в подписях без `["..."]`; непарные `subgraph/end`, лишние/недостающие `end` в `alt/loop`; неверная кардинальность ERD; смешение синтаксиса типов; перегруженный граф без `subgraph`/направления.

## Типы (заголовок)
- **flowchart** — процессы: узлы `[..]` `(..)` `{..}` `[(БД)]` `((круг))`; связи `-->` `-.->` `==>` `-->|подпись|`; группы `subgraph … end`.
- **sequenceDiagram** — время: `->>` вызов, `-->>` ответ, `alt/loop/Note`.
- **classDiagram** — классы: `<|--` наследование, `*--` композиция, `-->` ассоциация.
- **stateDiagram-v2** — состояния: `[*] --> S --> [*]`.
- **erDiagram** — данные: `USER ||--o{ ORDER : places` (кардинальности `||`, `o{`, `|{`).
- **gantt** — план (`dateFormat`, `section`); **pie**, **gitGraph**, **mindmap**, **timeline**, **journey**, **quadrantChart**, **sankey-beta**, **C4Context**.
