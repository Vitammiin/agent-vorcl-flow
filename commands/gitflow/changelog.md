---
description: CHANGELOG.md по Keep a Changelog из истории коммитов между тегами — рубрики Added/Fixed/Changed/Breaking. Use when нужно собрать или обновить changelog (gitflow)
argument-hint: "[диапазон: <tag>..<tag|HEAD>; пусто — с последнего тега]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Собери/обнови `CHANGELOG.md` по истории коммитов: **$ARGUMENTS**.

1. Определи диапазон: если не задан — последний тег через `git describe --tags --abbrev=0` (или `git tag --sort=-v:refname | head -1`), диапазон `<tag>..HEAD`. Тегов нет — вся история, и пометь это.
2. Сними историю: `git log <диапазон> --pretty='%h %s' --no-merges` (+ `%b` для футеров `BREAKING CHANGE`).
3. Разложи по рубрикам Keep a Changelog по типам Conventional Commits: `feat` → **Added**; `fix` → **Fixed**; `refactor`/`perf` и поведенческие правки → **Changed**; `!`/футер `BREAKING CHANGE` → **Breaking**; при наличии — **Deprecated**/**Removed**/**Security**. `chore`/`ci`/`test` в changelog не тащи, если не влияют на пользователя.
4. Пиши для человека: что изменилось для пользователя плагина/продукта, а не пересказ сообщений коммитов; хаос-коммиты («wip», «fixes») раскрой по diff.
5. Впиши в `CHANGELOG.md`: формат `## [X.Y.Z] - YYYY-MM-DD`, свежие релизы сверху, секция `[Unreleased]` — для ещё не отрелизенного. Файла нет — создай с шапкой Keep a Changelog.
6. Покажи вставленный фрагмент и итоговый `git status` (файл изменён, ничего не закоммичено без запроса).

Края: пустая история в диапазоне — скажи прямо и ничего не сочиняй; сообщения вне конвенции — классифицируй по diff и пометь допущением.

Опирайся на навык `git-workflow`. Делегируй субагенту `gitflow`.
