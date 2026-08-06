---
name: gitflow-audit
description: Read-only аудит git-истории — нарушения Conventional Commits, коммиты-свалки, большие бинарники, ветки-сироты (роль gitflow). Use когда нужно проверить гигиену репозитория.
---

# Задача: read-only аудит git-истории

Проведи read-only аудит истории (см. `$git-workflow`). Ничего не правь и не удаляй — только находки.

1. Конвенция: `git log --pretty='%h %s' --no-merges` — сообщения вне `тип(scope): суть`, breaking без `!`/футера.
2. Коммиты-свалки: `git log --stat` — гигантские смешанные коммиты (ломают ревью/bisect/changelog).
3. Бинарники: `git rev-list --objects --all | git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | awk '$1=="blob" && $3>1000000'` — блобы >1 МБ, кандидаты в LFS/`.gitignore`.
4. Ветки-сироты: `git branch -a --no-merged` + `git for-each-ref --sort=-committerdate refs/heads` + `git worktree list` — брошенные невлитые ветки.
5. Версии: последний тег vs версии манифестов; коммиты после тега без `[Unreleased]` в changelog.

Формат: `commit/файл/ветка → что не так → чем грозит → починка`, severity `critical>high>medium>low`, сводка таблицей. Исправления (перепись истории, удаление веток) — деструктивны, отдельно и только с явного подтверждения владельца.
