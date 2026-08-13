---
description: Экспортировать артефакт Design Studio в standalone HTML, PDF, PPTX, MP4 или handoff-формат. Use после проверки исходного проекта.
argument-hint: "<проект> <html|pdf|pptx|mp4|figma|canva>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Экспортируй **$ARGUMENTS** ролью `design-studio` через matching built-in export skill. Сначала проверь исходный HTML в preview. PPTX разрешён только для deck-stage проекта: editable по умолчанию, screenshots лишь по явному запросу. После экспорта проверь существование, открываемость и ожидаемое число страниц/слайдов/кадров.
