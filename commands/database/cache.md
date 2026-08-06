---
description: Кэш и Redis — TTL, инвалидация, lock, rate limiting, Streams. Use when проектируем кэширование или Redis-логику; read-only чтение ключей — /database:query (database)
argument-hint: "<что кэшируем/задача>"
allowed-tools: Read, Edit, Write, Bash, Grep, Glob
---

Спроектируй кэширование/Redis-логику: **$ARGUMENTS**.

1. Спроектируй по паттерну **cache-aside**: чтение из кэша → промах → из БД → запись с **TTL**; инвалидация по событию записи; защита от **cache stampede** (jitter TTL, single-flight/lock). При необходимости: **distributed lock** (`SET NX PX` с уникальным токеном + release через Lua compare-and-delete; Redlock — осторожно), **rate limiting** (token bucket / sliding window), очереди/события — **Streams** (`XADD` + consumer groups), счётчики (`INCR`), pub/sub. Дизайн ключей с namespace и лимитом памяти/eviction.
2. **Покажи план изменений**: какие ключи/структуры создаёшь или инвалидируешь, TTL и политика eviction, оценка влияния — объём памяти, массовые записи/удаления, обратимость (как откатить/очистить).
3. Перед мутациями в живом Redis (массовые записи, инвалидация по маске, изменение конфигурации) **дождись ЯВНОГО подтверждения человека** — слова вроде «да, применяй»; молчание или «ок» на другой вопрос — НЕ подтверждение. Правки только кода приложения подтверждения не требуют.
4. Применяй через MCP `redis` (на проде без `KEYS`/`FLUSHDB`), затем **проверь результат и покажи доказательство**: `TTL` выставлен у ключей, hit-rate (`INFO stats`: keyspace_hits/misses), выборочный `GET`/`SCAN` по namespace.

Опирайся на навыки `redis`, `database`, `backend-architecture`. Делегируй субагенту `database`.
