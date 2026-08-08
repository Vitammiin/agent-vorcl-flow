---
name: liveboard-start
description: Запустить роль liveboard и её эфемерное 43-язычное localhost HTML-табло worktree, активных агентов и задач Task Master на свободном порту. Use когда пользователь просит показать состояние проекта в реальном времени.
---

# Запуск Liveboard

Используй `$liveboard`. Корень — аргумент пользователя или текущий Git root. Запусти `scripts/server.mjs` из каталога скилла `$liveboard` в foreground, дождись `liveboard-ready`, отдай URL и держи процесс живым до явной остановки.

Передай явно заданные `--port` и `--interval`; defaults: `127.0.0.1`, свободный порт, 300000 мс. UI сам определяет одну из 43 локалей и даёт переключатель языка; Arabic, Hebrew, Persian и Urdu работают в RTL.

Не создавать runtime-файлы и не открывать внешний bind.
