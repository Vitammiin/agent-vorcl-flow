---
name: design-studio-vorcl
description: Точка входа в обязательный Task Master workflow для комплексного визуального проекта роли design-studio. Use для многошаговой дизайн-цели от контекста и вариантов до preview, проверки и экспорта.
---

# Design Studio через Task Master

Возьми цель через `$workflow` и `$task-master`: создай/получи задачу, вызови `next_task` и `get_task`, при поддержке разверни её, реализуй через `$design-studio` в `designs/<project>/`, проверь HTTP-preview и `testStrategy`, затем поставь `done`. Загружай только релевантные built-in skills по `project-types.json`.
