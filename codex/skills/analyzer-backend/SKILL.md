---
name: analyzer-backend
description: Поиск «плохого» кода на бэкенде — нарушения архитектуры, логика в контроллерах (роль analyzer, read-only). Use when ищем нарушения слоёв и структуры бэка; конкретные баги поведения — $analyzer-bugs.
---

# Задача: аудит «плохого» кода на беке

Найди «плохой» код на **бэкенде** (**read-only**) в указанной области.

Сверяйся с модульной архитектурой из `$backend-architecture` (`src/modules/*`, слои `controller · service · repository · routes · schemas · dto · types · middleware · index`). Ищи нарушения: бизнес-логика в контроллерах, прямой доступ к БД из service/controller (мимо repository), импорт внутренностей чужого модуля мимо `index.ts`, слои, «перепрыгивающие» поток `routes → controller → service → repository`, отсутствие валидации входа (zod) и обработки ошибок, тихие падения, дублирование, «магические» значения, секреты в коде. Ничего не правь. Формат: `file:line`, что нашли, первопричина, конкретная починка; severity по влиянию. По значимым находкам — `add_task`. Опирайся на `$backend-architecture`, `$typescript`.
