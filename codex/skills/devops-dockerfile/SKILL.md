---
name: devops-dockerfile
description: Написать/ревью Dockerfile — multistage, node-slim, non-root, HEALTHCHECK, .dockerignore; проверка реальным docker build с размером образа (роль devops). Use когда нужно докеризовать приложение или починить Dockerfile.
---

# Задача: написать или отревьюить Dockerfile

Напиши/отревьюй Dockerfile (см. `$docker`, `$nodejs`).

1. Изучи проект: `package.json` (скрипты, `engines`), lockfile, точка входа, порт.
2. Multistage: `deps` (манифесты + `npm ci`) → `build` (исходники + сборка) → `runner` (`node:XX-slim` пиненный, `npm ci --omit=dev`, только артефакты).
3. Безопасность: non-root `USER`, никаких секретов в слоях/`ARG`, `NODE_ENV=production`. Добавь `HEALTHCHECK` и `.dockerignore` (`node_modules`, `.git`, `.env*`, `dist`).
4. **Обязательно** прогони `docker build -t app:check .`; при ошибке читай полный вывод и чини до зелёного. Покажи размер (`docker image ls`); slim-Node обычно 150–300 MB.

Daemon недоступен — отдай файлы + команды проверки, честно пометив, что build не прогнан. Отдай пути + вывод build + размер + заметки о решениях.
