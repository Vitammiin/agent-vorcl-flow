---
description: Поиск «плохого» кода на бэкенде — нарушения архитектуры, логика в контроллерах (analyzer)
argument-hint: "[путь бэкенда; по умолчанию src бэка]"
allowed-tools: Read, Grep, Glob, Bash
---

Найди «плохой» код на **бэкенде** (**read-only**): **$ARGUMENTS**.

Сверяйся с модульной архитектурой из скилла `backend-architecture` (`src/modules/*`, слои `controller · service · repository · routes · schemas · dto · types · middleware · index`). Ищи нарушения: бизнес-логика в контроллерах, прямой доступ к БД из service/controller (в обход repository), импорт внутренностей чужого модуля мимо `index.ts`, слои, «перепрыгивающие» поток `routes → controller → service → repository`, отсутствие валидации входа (zod) и обработки ошибок, тихие падения, дублирование, «магические» значения, секреты в коде. Ничего не правь. Формат: `file:line`, что нашли, первопричина, конкретная починка; severity по влиянию. По значимым находкам — `add_task` (Task Master). Опирайся на навыки `backend-architecture`, `typescript`. Делегируй субагенту `analyzer`.
