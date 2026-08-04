---
description: Поиск багов — необработанные ошибки, race conditions, edge cases (analyzer)
argument-hint: "[путь/область; по умолчанию весь репозиторий]"
allowed-tools: Read, Grep, Glob, Bash
---

Найди баги (**read-only**): **$ARGUMENTS**.

Ищи: необработанные ошибки и тихие падения (`catch {}`, проглоченные промисы), race conditions и проблемы конкурентности, необработанные edge cases (пустые/`null`/границы), неверную логику и off-by-one, утечки ресурсов. Помечай область каждой находки (**Frontend** / **Backend**), не смешивай их. Ничего не правь. Формат: `file:line`, что нашли, первопричина, конкретная починка; severity `critical>high>medium>low`. По значимым находкам — `add_task` (Task Master). Делегируй субагенту `analyzer`.
