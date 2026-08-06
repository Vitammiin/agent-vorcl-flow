---
description: Написать или отревьюить Dockerfile — multistage, node-slim, non-root, HEALTHCHECK, .dockerignore; проверка реальным docker build с размером образа (devops). Use when нужно докеризовать приложение или починить/улучшить Dockerfile.
argument-hint: "[путь к проекту или Dockerfile] [пожелания]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Напиши или отревьюй Dockerfile: **$ARGUMENTS**.

1. Изучи проект: `package.json` (скрипты `build`/`start`, версия Node в `engines`), lockfile (npm/pnpm), точка входа, порт. Существующий `Dockerfile` — прочитай и ревьюй по чек-листу ниже.
2. Построй multistage: `deps` (только `package*.json` + `npm ci`) → `build` (исходники + сборка) → `runner` (`node:XX-slim` пиненной версии, `npm ci --omit=dev` или копия prod-`node_modules`, только артефакты сборки).
3. Безопасность: non-root `USER` (`node` или свой uid), никаких секретов в слоях/`ARG`, `NODE_ENV=production`.
4. Добавь `HEALTHCHECK` (curl/wget или `node -e "fetch(...)"` на health-эндпоинт) и `.dockerignore` минимум с `node_modules`, `.git`, `.env*`, `dist`, `*.md`.
5. Проверь: `docker build -t app:check .` — прогони реально, при ошибке читай полный вывод и чини до зелёного. Покажи размер образа (`docker image ls app:check`); сравни с ожиданием (slim-образ Node-приложения — обычно 150–300 MB).

Края: пустой `$ARGUMENTS` — работай с текущим каталогом, спроси при неоднозначности. Docker daemon недоступен (`docker info` падает) — отдай файлы + команды проверки, честно пометив, что build не прогнан. Монорепо — уточни, какой пакет собираем.

Отдай: `Dockerfile` + `.dockerignore` (пути), вывод `docker build` и размер образа, заметки о решениях. Опирайся на навыки `docker`, `nodejs`. Делегируй субагенту `devops`.
