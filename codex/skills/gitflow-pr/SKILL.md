---
name: gitflow-pr
description: Ветка → поимённые коммиты → PR через gh CLI/GitHub MCP — заголовок по конвенции, описание что/зачем/как проверено (роль gitflow). Use когда изменения нужно оформить в pull request.
---

# Задача: оформить pull request

Оформи изменения в PR (см. `$git-workflow`).

1. Сам проверь `git status` и ветку; на `main`/`dev` — создай `feat/<slug>` от HEAD.
2. Незакоммиченное — по правилам `$gitflow-commit` (поимённо, Conventional Commits, чужой WIP не трогать).
3. Squash-ловушка: после squash-PR — `git fetch && git merge-base --is-ancestor origin/<base> HEAD`; base ушёл вперёд и diff со squash-точкой пуст → `git merge -s ours origin/<base>`.
4. Покажи `git log --oneline <base>..HEAD` + сводку diff, **дождись явного подтверждения** → `git push -u origin <ветка>`. Force-push запрещён.
5. PR через GitHub MCP или `gh pr create`: заголовок по конвенции; описание — Что / Зачем / Как проверено (с выводом проверок). Отдай URL как доказательство. Нет gh/MCP — отдай заголовок+описание для ручного создания, пометив это.

Края: ветка не опережает base — PR не создавай, скажи прямо.
