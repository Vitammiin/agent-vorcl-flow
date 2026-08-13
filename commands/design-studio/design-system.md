---
description: Создать, импортировать, скомпилировать, применить или проверить дизайн-систему. Use для tokens, UI kit и component library.
argument-hint: "<create|import|apply|refresh|check> <источник/проект>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Выполни операцию с дизайн-системой **$ARGUMENTS** ролью `design-studio`. Следуй `$design-studio` и нужному built-in skill: `design-system-authoring-guide.md` для authoring, `use-design-system.md` для binding, `import-from-figma.md` для `.fig`. Компилируй и проверяй штатными `agents/compile-design-system.mjs`, `check-design-system.mjs`, `build-preview.mjs`; не обходи ошибки checker.
