---
description: Ветка → поимённые коммиты → PR через gh CLI/GitHub MCP — заголовок по конвенции, описание что/зачем/как проверено. Use when изменения нужно оформить в pull request (gitflow)
argument-hint: "<задача/изменения> [base-ветка; по умолчанию dev или main]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Оформи изменения в pull request: **$ARGUMENTS**.

1. Сам проверь `git status` и текущую ветку (`git branch --show-current`). Если стоишь на `main`/`dev` — создай ветку `feat/<slug>` (или `fix/<slug>`) от HEAD.
2. Незакоммиченные изменения задачи — закоммить по правилам `/gitflow:commit`: только поимённо, Conventional Commits, чужой WIP не трогать.
3. Ловушка squash-merge: если у ветки уже был squash-PR в base — `git fetch && git merge-base --is-ancestor origin/<base> HEAD`; если base ушёл вперёд, а `git diff origin/<base> <squash-точка>` пуст — `git merge -s ours origin/<base>` (см. навык `git-workflow`).
4. Покажи владельцу `git status` + `git log --oneline <base>..HEAD` + сводку diff и **дождись явного подтверждения** — только затем `git push -u origin <ветка>`. Force-push запрещён.
5. Создай PR: GitHub MCP (`mcp__github__create_pull_request`) или `gh pr create`. Заголовок — по Conventional Commits (`feat(scope): …`); описание — три блока: **Что** (суть изменений), **Зачем** (мотивация/задача), **Как проверено** (команды тестов/проверок с результатом — не пустые слова).
6. Отдай URL PR как доказательство. Нет ни MCP, ни `gh` — сделай локальную часть и отдай готовый заголовок+описание для ручного создания, явно пометив это.

Края: пустой `$ARGUMENTS` — восстанови суть по `git log`/`git diff` и подтверди у владельца; нечего коммитить и ветка не опережает base — скажи прямо, PR не создавай.

Опирайся на навык `git-workflow`. Делегируй субагенту `gitflow`.
