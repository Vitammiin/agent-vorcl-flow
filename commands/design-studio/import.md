---
description: Импортировать визуальный источник из Figma .fig, GitHub или существующего HTML/CSS с provenance. Use когда дизайн должен опираться на реальный источник.
argument-hint: "<figma|github|html> <путь или URL> [scope]"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob, WebFetch
---

Импортируй **$ARGUMENTS** ролью `design-studio`. Выбери ровно один маршрут `$design-studio`: `import-from-figma.md`, `import-from-github.md` или `import-from-html.md`. Для `.fig` используй штатный offline importer; для GitHub сначала исследуй дерево и забирай минимальный scope во временный каталог; сохраняй URL/commit и лицензионные notices.
