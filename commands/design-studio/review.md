---
description: Read-only ревью визуального артефакта, UX, адаптива, a11y и соблюдения design system. Use для проверки без изменения файлов.
argument-hint: "<проект/URL/файл> [критерии]"
allowed-tools: Read, Bash, Grep, Glob
---

Проведи read-only ревью **$ARGUMENTS** ролью `design-studio`. Используй `$design-studio`, `design-feedback.md` и штатные checker/preview utilities. Проверь visual hierarchy, layout, typography, states, responsive viewport, a11y, console errors и design-system drift. Ничего не правь; отдай findings по severity с evidence и конкретной рекомендацией.
