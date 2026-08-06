---
name: devops-compose
description: docker-compose.yml для локальной разработки — приложение + postgres/mongo/redis, volumes, healthcheck, env-файл; поднять до healthy у всех сервисов (роль devops). Use когда нужно локальное окружение в контейнерах или починить compose.
---

# Задача: docker-compose для локальной разработки

Собери и подними compose (см. `$docker`).

1. Определи нужды проекта (строки подключения, драйверы в `package.json`): postgres/mongo/redis — лишних сервисов не добавляй.
2. `docker-compose.yml`: приложение + базы **пиненных прод-версий** (не `latest`); named volumes; `healthcheck` у баз (`pg_isready` / `mongosh --eval` / `redis-cli ping`); `depends_on` с `condition: service_healthy`; переменные через `env_file: .env` + шаблон `.env.example`.
3. **Имена сервисов, не localhost:** хосты в строках подключения — `postgres`/`redis` (имена сервисов); `localhost` внутри контейнера — сам контейнер → `ECONNREFUSED`.
4. Подними: `docker compose up -d` → `docker compose ps` до `healthy` у ВСЕХ; `logs --tail 50` без `ECONNREFUSED`/рестарт-циклов. Не отдавай до зелёного.
5. **env-правило:** изменения env применяй `docker compose up -d --force-recreate` — `restart` НЕ перечитывает env.

Daemon недоступен — отдай файлы + команды проверки с честной пометкой. Отдай пути + вывод `compose ps` + заметки.
