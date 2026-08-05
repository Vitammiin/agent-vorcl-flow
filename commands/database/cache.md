---
description: Кэш и Redis — TTL, инвалидация, lock, rate limiting, Streams (database)
argument-hint: "<что кэшируем/задача>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Спроектируй кэширование/Redis-логику: **$ARGUMENTS**.

Паттерн **cache-aside**: чтение из кэша → промах → из БД → запись с **TTL**; инвалидация по событию записи. Защити от **cache stampede** (jitter TTL, single-flight/lock). При необходимости: **distributed lock** (`SET NX PX` с уникальным токеном + release через Lua compare-and-delete; Redlock — осторожно), **rate limiting** (token bucket / sliding window), очереди/события — **Streams** (`XADD` + consumer groups), счётчики (`INCR`), pub/sub. Дизайн ключей с namespace и лимитом памяти/eviction. Работа с Redis — через MCP `redis` (на проде без `KEYS`/`FLUSHDB`; массовые операции — с подтверждением). Опирайся на навыки `redis`, `database`, `backend-architecture`. Делегируй субагенту `database`.
