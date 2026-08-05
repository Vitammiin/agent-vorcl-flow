---
description: Проектирование/ревью схемы и целостности данных (database)
argument-hint: "<сущность/таблица/коллекция или задача>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Спроектируй или отревьюй схему данных: **$ARGUMENTS**.

Сначала выбери хранилище под природу данных и запросов. **Postgres** — нормализация (и осознанная денормализация), типы, `NOT NULL`/`UNIQUE`/`CHECK`, внешние ключи, индексы под запросы, партиционирование больших таблиц. **MongoDB** — форма документа, **embedding vs referencing** по паттернам доступа, schema-валидаторы, ограничение роста массивов/размера документа. **Redis** — дизайн ключей (namespace), типы, обязательный TTL, eviction. Инспекция текущей схемы — read-only через MCP (`information_schema`/`pg_indexes`, `listCollections`/`listIndexes`). Изменения схемы (DDL) оформляй как миграцию (`/database:migrate`) и применяй только с подтверждением. Опирайся на навыки `database`, `postgresql`, `mongodb`, `redis`, `backend-architecture`. Делегируй субагенту `database`.
