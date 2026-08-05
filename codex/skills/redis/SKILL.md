---
name: redis
description: Redis для Node.js/TypeScript (node-redis) — структуры данных и когда что, кэш-стратегии (cache-aside, TTL+jitter, защита от stampede), eviction/maxmemory, атомарность (одиночные команды, MULTI/WATCH, Lua), rate limiting, distributed lock, Pub/Sub vs Streams (consumer groups), персистентность. Use при проектировании кэша, очередей, rate limiting или блокировок.
---

# Навык: Redis (Node.js / TypeScript)

In-memory хранилище: кэш, счётчики, очереди, блокировки, Pub/Sub. Клиент по умолчанию — **node-redis** (`redis`), альтернатива — `ioredis`.

## Золотые правила
- **Кэш ≠ источник истины.** Всё в Redis восстановимо из БД; любой ключ может быть вытеснен или потерян при рестарте.
- **Неймспейсы ключей**: `app:user:{id}:profile`, `rl:{userId}:{window}` — основа инвалидации.
- **TTL почти на всё**; ключ без срока течёт по памяти.
- **Никогда `KEYS` в проде** (блокирует) — только `SCAN`. Осторожно с `SMEMBERS`/`HGETALL` на больших коллекциях.
- **Меньше round-trips**: пачкой через pipeline/`MULTI`; read-modify-write — Lua или `WATCH`, не «прочитал в коде → записал».
- Избегай огромных ключей/коллекций.

## Структуры данных — когда что
- **String** — кэш JSON, счётчики (`INCR`), флаги, локи.
- **Hash** — объект по полям (`HSET`/`HGETALL`/`HINCRBY`), частичные апдейты.
- **List** — простая очередь (`LPUSH`/`BRPOP`), без гарантий доставки.
- **Set** — уникальность, членство, пересечения.
- **Sorted Set** — лидерборды, приоритетные/отложенные очереди, sliding-window rate limit.
- **Stream** — надёжная очередь событий с consumer groups и подтверждением (предпочтительнее List).
- **Bitmap/HyperLogLog** — компактные метрики.

## Клиент node-redis
Один общий клиент; **отдельные** подключения (`duplicate()`) для Pub/Sub и блокирующих команд.
```ts
import { createClient } from 'redis'
export const redis = createClient({ url: process.env.REDIS_URL })
redis.on('error', (err) => logger.error({ err }, 'Redis error'))
await redis.connect()

await redis.set('user:42:profile', JSON.stringify(profile), { EX: 3600 })
await redis.hSet('user:42', { name: 'Ann', plan: 'pro' })
await redis.multi().incr('stats:views').expire('stats:views', 86400).exec()
```

## Кэш-стратегии
- **Cache-aside**: кэш → промах → БД → `SET ... EX` → отдать.
- **TTL + jitter**: случайные ±% к сроку, чтобы ключи не протухали синхронно.
- **Инвалидация при записи**: после апдейта БД — `DEL`/перезапись точечно по неймспейсу (не `FLUSHALL`).
- **Защита от stampede**: первый промах берёт короткий лок `SET key:lock token NX PX 5000` и наполняет кэш, остальные ждут/отдают stale.
- **Eviction**: `maxmemory` + `maxmemory-policy` — `allkeys-lru` (дефолт для кэша), `volatile-ttl`/`volatile-lru` если у всех есть TTL, `noeviction` если терять нельзя.

## Атомарность
- Одиночная команда атомарна (`INCR`, `SETNX`…) — предпочитай составным.
- `MULTI`/`EXEC` без вклинивания; `WATCH` key — optimistic locking.
- Lua (`EVAL`) — атомарный read-modify-write (safe rate limit, release лока).

## Rate limiting
- **Fixed window** атомарно через Lua:
  ```lua
  local c = redis.call('INCR', KEYS[1])
  if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  return c
  ```
  Без Lua — `INCR` + `EXPIRE` в `MULTI`.
- **Sliding window** на ZSet: `ZREMRANGEBYSCORE key 0 now-window` → `ZADD key now now` → `ZCARD key`, общий `EXPIRE`.
- **Token bucket** — hash + Lua.

## Distributed lock
```ts
const ok = await redis.set(`lock:${id}`, token, { NX: true, PX: 30000 })
```
Освобождать только своим токеном, атомарно:
```lua
if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end
```
TTL обязателен (анти-deadlock). Строгие гарантии на кластере — Redlock (не абсолют: короткие критсекции + идемпотентность).

## Pub/Sub vs Streams
- **Pub/Sub** — fire-and-forget, без персистентности; офлайн-подписчик теряет сообщения. Подписка — отдельным подключением:
  ```ts
  const sub = redis.duplicate(); await sub.connect()
  await sub.subscribe('cache:invalidate', (msg) => handle(msg))
  ```
- **Streams + consumer groups** — надёжная доставка с подтверждением:
  ```ts
  await redis.xAdd('jobs', '*', { type: 'email', to: user.email })
  await redis.xGroupCreate('jobs', 'workers', '0', { MKSTREAM: true }).catch(() => {})
  const res = await redis.xReadGroup('workers', 'w1', [{ key: 'jobs', id: '>' }], { COUNT: 10, BLOCK: 5000 })
  await redis.xAck('jobs', 'workers', id)
  ```
  Зависшие в PEL переназначай через `XAUTOCLAIM`. Каждому блокирующему `XREADGROUP` — свой клиент.

## Персистентность
- **RDB** — снапшоты (`save 60 1000`, `BGSAVE`): компактно, быстрый рестарт, теряешь данные между снапшотами.
- **AOF** — журнал; `appendfsync everysec` (рекомендуемо) / `always` / `no`.
- Для кэша часто не нужна; для очередей/локов — AOF или управляемый Redis.

## Антипаттерны
- `KEYS *` в проде; огромные ключи; ключи без TTL.
- Единственная копия данных только в кэше.
- Read-modify-write в коде вместо Lua/`WATCH`.
- Блокирующие команды/подписки на общем клиенте.
- `FLUSHALL` вместо точечной инвалидации.
