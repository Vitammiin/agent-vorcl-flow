---
name: gitflow-changelog
description: CHANGELOG.md по Keep a Changelog из истории коммитов между тегами — Added/Fixed/Changed/Breaking (роль gitflow). Use когда нужно собрать или обновить changelog.
---

# Задача: собрать changelog

Собери/обнови `CHANGELOG.md` по истории коммитов (см. `$git-workflow`).

1. Диапазон: последний тег (`git describe --tags --abbrev=0`) → `<tag>..HEAD`; тегов нет — вся история, пометь это.
2. `git log <диапазон> --pretty='%h %s' --no-merges` (+ тела для футеров `BREAKING CHANGE`).
3. Рубрики: `feat` → Added; `fix` → Fixed; `refactor`/`perf` → Changed; `!`/футер → Breaking; при наличии — Deprecated/Removed/Security. `chore`/`ci`/`test` не тащи.
4. Пиши для человека (что изменилось для пользователя), не пересказ коммитов; хаос-сообщения раскрой по diff и пометь допущением.
5. Формат: `## [X.Y.Z] - YYYY-MM-DD`, свежее сверху, `[Unreleased]` для неотрелизенного. Покажи вставленный фрагмент + `git status` (без коммита, если не просили).

Края: пустая история в диапазоне — скажи прямо, не сочиняй.
