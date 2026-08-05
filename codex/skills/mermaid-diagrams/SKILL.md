---
name: mermaid-diagrams
description: Создание диаграмм на языке Mermaid — синтаксис по типам (flowchart, sequence, class, state, ER, gantt, pie, gitGraph, mindmap, timeline и др.), узлы/связи, `subgraph`, `classDef`/`class`/`style`, направление, экранирование подписей, частые AI-ошибки и правила качества. Use при создании, конвертации или правке Mermaid-диаграмм.
---

# Навык: Mermaid-диаграммы

По описанию/исходнику — валидный читаемый Mermaid (`.mmd`). Синтаксис версионно-зависим. Валидацию/рендер см. `$mermaid-rendering`.

## Общий синтаксис
Первая строка — тип (`flowchart TD`, `sequenceDiagram`, `classDiagram`…); опечатка ломает файл. Комментарии `%%`. Направление flowchart: `TD`/`LR`/`RL`/`BT`. Подписи со спецсимволами → в кавычки: `A["Текст (v2) & детали"]`.

## Типы (заголовок)
- **flowchart** — процессы: узлы `[..]` `(..)` `{..}` `[(БД)]` `((круг))`; связи `-->` `-.->` `==>` `-->|подпись|`; группы `subgraph … end`.
- **sequenceDiagram** — время: `->>` вызов, `-->>` ответ, `alt/loop/Note`.
- **classDiagram** — классы: `<|--` наследование, `*--` композиция, `-->` ассоциация.
- **stateDiagram-v2** — состояния: `[*] --> S --> [*]`.
- **erDiagram** — данные: `USER ||--o{ ORDER : places` (кардинальности `||`, `o{`, `|{`).
- **gantt** — план (`dateFormat`, `section`); **pie**, **gitGraph**, **mindmap**, **timeline**, **journey**, **quadrantChart**, **sankey-beta**, **C4Context**.

## Цвета/группы
`classDef service fill:#dae8fc,stroke:#6c8ebf;` + `class API,DB service`; точечно `style A fill:#f8cecc`. Роль → один класс.

## Частые AI-ошибки
Опечатка заголовка (`lowchart`); `end` в нижнем регистре; скобки/кавычки в подписях без `["..."]`; непарные `subgraph/end`; неверная кардинальность ERD; смешение синтаксиса типов; перегруженный граф без `subgraph`.

## Качество
Тип под задачу; направление осознанно; большие схемы разбивай; реальный рендер (`$mermaid-rendering`) — окончательный критерий.
