---
name: docs-release-notes
description: Release notes версии из CHANGELOG/git-истории — готовый текст для GitHub release, в связке с gitflow (роль docs). Use когда готовится релиз и нужны заметки версии.
---

# Задача: собрать release notes версии

Собери release notes (формат — Keep a Changelog, см. `$technical-writing`).

1. Диапазон: `git tag --sort=-v:refname` → последний тег..HEAD, либо заданная версия. Тегов нет — спроси точку отсчёта.
2. Факты: `CHANGELOG.md` (ведётся — он первичен) + `git log --oneline <диапазон>` + `git diff --stat`. Ни одного пункта, которого нет в истории/CHANGELOG.
3. Группировка: Added / Changed / Fixed / Deprecated / Removed / Security; **breaking changes — отдельно и первыми**, с инструкцией миграции.
4. Пиши для пользователя релиза: «что изменилось и что делать», не «refactor utils»; мелкие технические коммиты агрегируй.
5. Сверь номер версии с `package.json`/манифестом; расходится — остановись и спроси.
6. Выдай markdown для GitHub release; ведётся `CHANGELOG.md` — добавь секцию версии. **Релиз/теги/push не создавай** — это зона роли gitflow; твой продукт — текст.

Отдай текст + диапазон и число коммитов-источников (доказательство: фрагмент `git log`).
