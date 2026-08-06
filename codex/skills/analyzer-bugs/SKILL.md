---
name: analyzer-bugs
description: Поиск багов — необработанные ошибки, race conditions, edge cases (роль analyzer, read-only). Use when нужны ошибки поведения и конкурентности; ошибки типов — $analyzer-types, нарушения архитектуры бэка — $analyzer-backend.
---

# Задача: поиск багов

Найди баги (**read-only**) в указанной области.

Ищи: необработанные ошибки и тихие падения (`catch {}`, проглоченные промисы), race conditions, необработанные edge cases (пустые/`null`/границы), неверную логику и off-by-one, утечки ресурсов. Помечай область каждой находки (**Frontend** / **Backend**). Ничего не правь. Формат: `file:line`, что нашли, первопричина, конкретная починка; severity `critical>high>medium>low`. По значимым находкам — `add_task`.
