---
description: docker-compose.yml для локальной разработки — приложение + postgres/mongo/redis, volumes, healthcheck, env-файл; поднять и довести все сервисы до healthy (devops). Use when нужно локальное окружение в контейнерах или починить compose.
argument-hint: "[путь к проекту] [нужные сервисы: postgres|mongo|redis]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Собери docker-compose для локальной разработки: **$ARGUMENTS**.

1. Определи нужды проекта: какие базы реально используются (строки подключения в коде/env, драйверы в `package.json`) — postgres/mongo/redis. Не добавляй лишних сервисов.
2. Напиши `docker-compose.yml`: приложение (build из Dockerfile или образ) + базы **пиненных версий, тех же что в проде** (не `latest`); named volumes для данных; `healthcheck` у каждой базы (`pg_isready` / `mongosh --eval` / `redis-cli ping`); у приложения `depends_on` с `condition: service_healthy`; переменные — через `env_file: .env` (сам `.env` в `.gitignore`, шаблон — `.env.example`).
3. **Имена сервисов, не localhost:** в строках подключения приложения хосты — `postgres`/`mongo`/`redis` (имена сервисов compose). `localhost` внутри контейнера — это сам контейнер; `ECONNREFUSED` между сервисами почти всегда отсюда.
4. Подними: `docker compose up -d`, затем `docker compose ps` — дождись `healthy` у ВСЕХ сервисов; проверь `docker compose logs --tail 50` на `ECONNREFUSED` и циклы перезапуска. Не отдавай результат до зелёного состояния.
5. **Правило env (критично):** при изменении env-переменных применяй `docker compose up -d --force-recreate` — `docker compose restart` НЕ перечитывает env. Зафиксируй это комментарием в compose или README-заметкой.

Края: пустой `$ARGUMENTS` — текущий каталог, набор баз выведи из кода. Нет Dockerfile — сначала `/devops:dockerfile`. Docker daemon недоступен — отдай файлы + команды проверки, честно пометив, что поднятие не прогнано.

Отдай: `docker-compose.yml` + `.env.example` (пути), вывод `docker compose ps` со статусами, заметки. Опирайся на навыки `docker`, `nodejs`. Делегируй субагенту `devops`.
