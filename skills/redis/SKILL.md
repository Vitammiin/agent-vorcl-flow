---
name: redis
description: Redis для Node.js/TypeScript (node-redis) — структуры данных и когда что, кэш-стратегии (cache-aside, TTL+jitter, защита от stampede), eviction/maxmemory, атомарность (одиночные команды, MULTI/WATCH, Lua), rate limiting, distributed lock, Pub/Sub vs Streams (consumer groups), персистентность. Use при проектировании кэша, очередей, rate limiting или блокировок.
version: 1.0.0
---

# Навык: Redis (Node.js / TypeScript)

In-memory хранилище: кэш, счётчики, очереди, блокировки, Pub/Sub. Клиент по умолчанию — **node-redis** (`redis`), альтернатива — `ioredis`.

**Навигатор.** База: [золотые правила](#золотые-правила) → [структуры данных — когда что](#структуры-данных--когда-что) → [клиент node-redis](#клиент-node-redis). Кэширую: [кэш-стратегии](#кэш-стратегии) (TTL+jitter, stampede, eviction). Считаю/лимитирую/блокирую: [атомарность](#атомарность) → [rate limiting](#rate-limiting) · [distributed lock](#distributed-lock). Очереди/события: [Pub/Sub vs Streams](#pubsub-vs-streams). Эксплуатация: [персистентность](#персистентность-эксплуатация) · перед сдачей — [антипаттерны](#антипаттерны).

## Золотые правила
- **Кэш ≠ источник истины.** Всё в Redis должно быть восстановимо из БД. Любой ключ может быть вытеснен (eviction) или потерян при перезапуске.
- **Неймспейсы ключей**: `app:user:{id}:profile`, `rl:{userId}:{window}`. Стабильная схема — основа инвалидации.
- **TTL почти на всё.** Ключ без срока живёт вечно и течёт по памяти. Голые данные без TTL — только для того, что осознанно вечно.
- **Никогда `KEYS` в проде** (блокирует сервер) — только `SCAN` курсором. Так же осторожно с `SMEMBERS`/`HGETALL` на больших коллекциях.
- **Меньше round-trips**: несколько команд — через pipeline/`MULTI`, а не по одной. Read-modify-write — через Lua или `WATCH`, а не «прочитал в приложении → записал».
- Избегай огромных ключей (мегабайтные строки, коллекции на миллионы полей) — они бьют по latency.

## Структуры данных — когда что
- **String** — кэш JSON/HTML, счётчики (`INCR`/`INCRBY`), флаги, блокировки. Атомарные `INCR` — основа rate limiting.
- **Hash** — объект по полям (`HSET`/`HGETALL`/`HINCRBY`); когда нужны частичные обновления без перезаписи всего JSON.
- **List** — простая FIFO/LIFO-очередь (`LPUSH`/`RPOP`, блокирующий `BRPOP`); лёгкие задачи без гарантий доставки.
- **Set** — уникальность, членство, пересечения (теги, «кто онлайн»).
- **Sorted Set (ZSet)** — лидерборды, приоритетные очереди, sliding-window rate limit, отложенные задачи (score = timestamp).
- **Stream** — надёжная очередь событий с consumer groups и подтверждениями (см. ниже). Предпочтительнее List для реальных очередей.
- **Bitmap / HyperLogLog** — компактные метрики (daily active, приблизительный подсчёт уникальных).

## Клиент node-redis
Один общий клиент на приложение (переиспользуй подключение); **отдельные** подключения (`duplicate()`) для Pub/Sub и блокирующих команд.
```ts
import { createClient } from 'redis'

export const redis = createClient({ url: process.env.REDIS_URL })
redis.on('error', (err) => logger.error({ err }, 'Redis error')) // обязательный обработчик
await redis.connect()

// кэш со сроком
await redis.set('user:42:profile', JSON.stringify(profile), { EX: 3600 })
const raw = await redis.get('user:42:profile')

// частичные обновления — hash
await redis.hSet('user:42', { name: 'Ann', plan: 'pro' })

// пачка команд одним round-trip
await redis.multi().incr('stats:views').expire('stats:views', 86400).exec()
```

## Кэш-стратегии
- **Cache-aside (lazy)**: читаем из кэша → промах → читаем БД → `SET ... EX` → отдаём. Дефолт для чтения.
- **TTL + jitter**: к сроку добавляй случайные ±% (`EX: base + rand`), чтобы ключи не протухали синхронно (cache stampede по времени).
- **Инвалидация при записи**: после апдейта в БД — `DEL`/перезапись ключа. Инвалидация точечная по неймспейсу, не `FLUSHALL`.
- **Защита от stampede** (все промахнулись разом → лавина в БД): первый запрос берёт короткий лок `SET key:lock token NX PX 5000` и наполняет кэш, остальные ждут/отдают stale.
- **Eviction**: сконфигурируй `maxmemory` + `maxmemory-policy`. Для чистого кэша — `allkeys-lru` (дефолт-рекомендация Redis); если TTL есть у всех ключей — `volatile-ttl`/`volatile-lru`; `noeviction` — когда терять данные нельзя (тогда команды записи вернут ошибку при переполнении).

## Атомарность
- **Одиночная команда атомарна** (`INCR`, `SETNX`, `LPUSH`…). Предпочитай их составным операциям.
- **`MULTI`/`EXEC`** — команды выполняются подряд без вклинивания; **`WATCH` key** даёт optimistic locking (транзакция отменяется, если ключ изменился).
- **Lua (`EVAL`)** — для атомарного read-modify-write (проверка + запись за один вызов, без гонок). Именно так делают безопасный rate limit и release лока.

## Rate limiting
- **Fixed window** — просто, но race на первом инкременте; делай атомарно через Lua:
  ```lua
  local c = redis.call('INCR', KEYS[1])
  if c == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
  return c
  ```
  (превысил лимит → отклоняем). Без Lua: `INCR` + `EXPIRE` в `MULTI`.
- **Sliding window** — точнее, на ZSet: `ZREMRANGEBYSCORE key 0 now-window` → `ZADD key now now` → `ZCARD key` (сравнить с лимитом), общий `EXPIRE`.
- **Token bucket** — hash (tokens, ts) + Lua на пополнение/списание.

## Distributed lock
```ts
// захват: значение — уникальный токен, PX — авторазблокировка при падении клиента
const ok = await redis.set(`lock:${id}`, token, { NX: true, PX: 30000 })
```
Освобождать **только своим** токеном, атомарно (иначе снимешь чужой лок после своего TTL):
```lua
if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end
```
TTL обязателен (защита от deadlock). Для строгих гарантий на кластере — Redlock; помни, что это не абсолютная взаимоисключаемость (нужны короткие критические секции и идемпотентность).

## Pub/Sub vs Streams
- **Pub/Sub** — fire-and-forget: нет персистентности, офлайн-подписчик теряет сообщения. Для live-уведомлений, инвалидации кэша. Подписка требует **отдельного** подключения:
  ```ts
  const sub = redis.duplicate(); await sub.connect()
  await sub.subscribe('cache:invalidate', (msg) => handle(msg)) // подписчик не шлёт другие команды
  ```
- **Streams + consumer groups** — надёжные очереди/шину событий с доставкой и подтверждением:
  ```ts
  await redis.xAdd('jobs', '*', { type: 'email', to: user.email })              // producer
  await redis.xGroupCreate('jobs', 'workers', '0', { MKSTREAM: true }).catch(() => {})
  const res = await redis.xReadGroup('workers', 'w1', [{ key: 'jobs', id: '>' }], { COUNT: 10, BLOCK: 5000 })
  // ...обработать... затем подтвердить:
  await redis.xAck('jobs', 'workers', id)
  ```
  Необработанные висят в PEL — переназначай зависшие через `XAUTOCLAIM`. **Каждому блокирующему `XREADGROUP` — свой клиент**; `XADD`/`XACK` можно на общем.

## Персистентность (эксплуатация)
- **RDB** — периодические снапшоты (`save 60 1000` — дамп каждые 60с при ≥1000 изменений; `BGSAVE`). Компактно, быстрый рестарт, но теряешь данные между снапшотами.
- **AOF** — журнал команд; `appendfsync everysec` (рекомендуемо: быстро, риск потери ~1с) / `always` (надёжно, медленно) / `no`.
- Для кэша персистентность часто вообще не нужна (данные восстановимы). Для очередей/локов — включай AOF или используй управляемый Redis.

## Антипаттерны
- `KEYS *` в проде; огромные ключи/коллекции; ключи без TTL, текущие по памяти.
- Единственная копия данных живёт только в кэше (потеряется при eviction/рестарте).
- Read-modify-write в коде вместо Lua/`WATCH` (гонки).
- Блокирующие команды (`BRPOP`/`XREADGROUP BLOCK`) и подписки на общем клиенте.
- `FLUSHALL` вместо точечной инвалидации по неймспейсу.
