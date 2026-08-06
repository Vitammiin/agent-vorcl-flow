---
name: git-workflow
description: Git-гигиена и релизная дисциплина — Conventional Commits и BREAKING CHANGE, semver-бамп, поимённые коммиты и запрет `git add .`/`-A` при параллельных сессиях, ловушка squash-merge (`merge-base --is-ancestor`, `merge -s ours`), Keep a Changelog, запрет force-push и push без явного подтверждения. Use для коммитов, PR, changelog и релизов.
---

# Навык: Git-workflow и релизы

История — публичный документ. Состояние репозитория проверяй сам (`git status`, `git diff`), не верь отчётам на слово.

## Conventional Commits
`тип(scope): суть` (до ~72 симв.): `feat` → minor; `fix`/`docs`/`refactor`/`perf` → patch; `test`/`chore`/`ci`/`build` → без бампа. **BREAKING CHANGE** (`!` после типа и/или футер) — единственное, что бампает major. Версия релиза = максимум по коммитам с прошлого тега; тег `vX.Y.Z` обязан совпадать с версиями манифестов.

## Поимённые коммиты
Параллельные сессии слепы друг к другу — `git add .`/`-A` молча захватит чужой WIP. Всегда: `git status --porcelain` → `git diff -- <файл>` → `git add <файл> <файл>` по именам → `git commit` → снова `git status` (чужой WIP нетронут). Незнакомые изменения — стоп и спроси владельца.

## Squash-merge ловушка
После squash-PR base не связан с историей ветки → ложные конфликты в следующем PR. Перед пушем: `git fetch && git merge-base --is-ancestor origin/main HEAD`; base ушёл вперёд и `git diff origin/main <squash-точка>` пуст (feat — надмножество) → `git merge -s ours origin/main` (делает base предком без потерь). Анализируй заранее, не жди GitHub.

## Worktree
Параллельная/фоновая задача в том же репо → `git worktree add <root>/<repo>-<slug>-<stamp> -b feat/<slug> HEAD`; после вливания — `git worktree remove --force … && git worktree prune`.

## Changelog (Keep a Changelog)
`## [X.Y.Z] - YYYY-MM-DD`, `[Unreleased]` сверху; рубрики Added (feat) / Fixed (fix) / Changed (refactor, perf) / Breaking + Deprecated/Removed/Security. Пиши для человека, не пересказ коммитов; `chore`/`ci`/`test` не тащи.

## Безопасность
Force-push запрещён (в крайнем случае `--force-with-lease` с явного подтверждения). push/publish/release — только с явного подтверждения владельца; локальные коммиты и теги — свободно. Односложное «ок»/«go» — не авторизация: переспроси, назвав действие явно.
