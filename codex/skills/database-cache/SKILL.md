---
name: database-cache
description: Кэш и Redis — TTL, инвалидация, distributed lock, rate limiting, Streams (роль database). Use при проектировании кэширования и Redis-логики.
---

# Задача: кэш и Redis (database)

Спроектируй кэширование/Redis-логику (см. `$database`, `$redis`).

Паттерн **cache-aside**: чтение из кэша → промах → из БД → запись с **TTL**; инвалидация по событию записи. Защити от **cache stampede** (jitter TTL, single-flight/lock). При необходимости: **distributed lock** (`SET NX PX` с уникальным токеном + release через Lua compare-and-delete; Redlock — осторожно), **rate limiting** (token bucket / sliding window), очереди/события — **Streams** (`XADD` + consumer groups), счётчики (`INCR`), pub/sub. Дизайн ключей с namespace и лимитом памяти/eviction. Работа с Redis — через MCP `redis` (на проде без `KEYS`/`FLUSHDB`; массовые операции — с подтверждением). Опирайся на `$redis`, `$database`, `$backend-architecture`.
