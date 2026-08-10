// archmap lib/services.mjs — единая таблица распознавания внешних систем (svc:<slug>).
// Один источник правды для трёх экстракторов: extract-env (env-имена, строки подключения,
// deps, .mcp.json), extract-api (какую систему обслуживает MCP-сервер) и extract-agents
// (упоминание системы в теле агента). Одна система = ОДИН узел svc:<slug>; кто нашёл
// сильнее, тот и задаёт meta.evidence (dsn > mcp > env > dep).
// Zero-dependency: чистые данные и матчеры, никакого I/O.

import { matchAll } from './ts.mjs'

export const EVIDENCE_RANK = { dep: 1, env: 2, mcp: 3, dsn: 4 }

// Поля записи таблицы:
//   slug/label/category — узел svc:<slug>; label обязан быть человекочитаемым («MongoDB»),
//                         category ∈ database|cache|queue|ai|payments|messaging|cloud|
//                         observability|auth|search|other (ключ группировки на карте)
//   env        — префикс имени переменной до первого '_' (MONGODB_URI → MONGODB)
//   envExact   — точные имена (DATABASE_URL, GH_TOKEN)
//   envStarts  — префикс без разделителя (PGHOST, ELASTICSEARCH_URL)
//   dsn        — схемы строк подключения БЕЗ '://': иначе этот самый файл при скане кода
//                попадал бы в граф как «модуль, который ходит в MongoDB»
//   deps/depPrefixes — имена пакетов в package.json
//   mcp        — regexp по «<имя сервера> <команда/url>»; undefined → \bslug\b
//   word       — regexp упоминания в тексте; undefined → \bslug\b, null → не искать
//   ambiguous  — имя совпадает с обычным словом (render/resend): regexp уже несёт точную
//                форму бренда, поиск идёт с учётом регистра
export const SERVICES = [
  {
    slug: 'mongodb', label: 'MongoDB', category: 'database',
    env: ['MONGODB', 'MONGO', 'MDB'], dsn: ['mongodb', 'mongodb+srv'],
    deps: ['mongoose', 'mongodb'], mcp: /\bmongo/i, word: /\bmongo(?:db)?\b|\bmongoose\b/,
  },
  {
    slug: 'postgres', label: 'PostgreSQL', category: 'database',
    env: ['POSTGRES', 'POSTGRESQL', 'PGSQL'], envExact: ['DATABASE_URL'], envStarts: ['PG'],
    dsn: ['postgres', 'postgresql'],
    deps: ['pg', 'pg-promise', 'postgres', 'node-pg-migrate'], depPrefixes: ['@neondatabase/'],
    mcp: /\bpostgre|\bpg\b/i, word: /\bpostgres(?:ql)?\b|\bpsql\b/,
  },
  {
    slug: 'mysql', label: 'MySQL', category: 'database',
    env: ['MYSQL', 'MARIADB'], dsn: ['mysql'], deps: ['mysql', 'mysql2'],
    word: /\bmysql\b|\bmariadb\b/,
  },
  {
    slug: 'redis', label: 'Redis', category: 'cache',
    env: ['REDIS', 'VALKEY'], dsn: ['redis', 'rediss'],
    deps: ['ioredis', 'redis'], depPrefixes: ['@upstash/'], word: /\bredis\b/,
  },
  {
    slug: 'kafka', label: 'Kafka', category: 'queue',
    env: ['KAFKA'], deps: ['kafkajs'], word: /\bkafka\b/,
  },
  {
    slug: 'rabbitmq', label: 'RabbitMQ', category: 'queue',
    env: ['RABBITMQ', 'AMQP'], dsn: ['amqp', 'amqps'], deps: ['amqplib'],
    mcp: /\brabbit|\bamqp\b/i, word: /\brabbitmq\b/,
  },
  {
    slug: 'elasticsearch', label: 'Elasticsearch', category: 'search',
    envStarts: ['ELASTIC'], depPrefixes: ['@elastic/'], word: /\belasticsearch\b/,
  },
  {
    slug: 'qdrant', label: 'Qdrant', category: 'database',
    env: ['QDRANT'], depPrefixes: ['@qdrant/'], word: /\bqdrant\b/,
  },
  {
    slug: 'pinecone', label: 'Pinecone', category: 'database',
    env: ['PINECONE'], depPrefixes: ['@pinecone-database/'], word: /\bpinecone\b/,
  },
  {
    slug: 'weaviate', label: 'Weaviate', category: 'database',
    env: ['WEAVIATE'], deps: ['weaviate-ts-client', 'weaviate-client'], word: /\bweaviate\b/,
  },
  {
    slug: 'anthropic', label: 'Anthropic', category: 'ai',
    env: ['ANTHROPIC'], depPrefixes: ['@anthropic-ai/'], word: /\banthropic\b/,
  },
  {
    slug: 'openai', label: 'OpenAI', category: 'ai',
    env: ['OPENAI'], deps: ['openai'], word: /\bopenai\b/,
  },
  {
    slug: 'perplexity', label: 'Perplexity', category: 'ai',
    env: ['PERPLEXITY'], word: /\bperplexity\b/,
  },
  {
    slug: 'vercel-ai', label: 'Vercel AI SDK', category: 'ai',
    deps: ['ai'], depPrefixes: ['@ai-sdk/'], mcp: null, word: null,
  },
  {
    slug: 'stripe', label: 'Stripe', category: 'payments',
    env: ['STRIPE'], deps: ['stripe'], depPrefixes: ['@stripe/'], word: /\bstripe\b/,
  },
  {
    slug: 'apple', label: 'Apple', category: 'auth',
    env: ['APPLE'], depPrefixes: ['@apple/'], word: /\bapple\b/,
  },
  {
    slug: 'twilio', label: 'Twilio', category: 'messaging',
    env: ['TWILIO'], deps: ['twilio'], depPrefixes: ['@twilio/'], word: /\btwilio\b/,
  },
  {
    slug: 'sendgrid', label: 'SendGrid', category: 'messaging',
    env: ['SENDGRID'], depPrefixes: ['@sendgrid/'], word: /\bsendgrid\b/,
  },
  {
    slug: 'resend', label: 'Resend', category: 'messaging',
    env: ['RESEND'], deps: ['resend'], word: /`resend`|\bResend\b/, ambiguous: true,
  },
  {
    slug: 'slack', label: 'Slack', category: 'messaging',
    env: ['SLACK'], depPrefixes: ['@slack/'], word: /\bslack\b/,
  },
  {
    slug: 'livekit', label: 'LiveKit', category: 'messaging',
    env: ['LIVEKIT'], deps: ['livekit-server-sdk'], depPrefixes: ['@livekit/'], word: /\blivekit\b/,
  },
  {
    slug: 'telegram', label: 'Telegram', category: 'messaging',
    env: ['TELEGRAM'], deps: ['telegraf', 'grammy', 'node-telegram-bot-api'], word: /\btelegram\b/,
  },
  {
    slug: 'github', label: 'GitHub', category: 'cloud',
    env: ['GITHUB'], envExact: ['GH_TOKEN'], depPrefixes: ['@octokit/'],
    mcp: /\bgithub\b/i, word: /\bgithub\b/,
  },
  {
    slug: 'aws', label: 'AWS', category: 'cloud',
    env: ['AWS', 'S3'], deps: ['aws-sdk'], depPrefixes: ['@aws-sdk/'],
    mcp: /\baws\b|\bs3\b/i, word: /\baws\b|\bamazon s3\b/,
  },
  {
    slug: 'google', label: 'Google Cloud', category: 'cloud',
    env: ['GOOGLE', 'GCP'], deps: ['googleapis'], depPrefixes: ['@google-cloud/'],
    mcp: /\bgoogle\b|\bgcp\b/i, word: /\bgoogle\b|\bgcp\b/,
  },
  {
    slug: 'firebase', label: 'Firebase', category: 'cloud',
    env: ['FIREBASE'], deps: ['firebase', 'firebase-admin'], depPrefixes: ['firebase-'],
    word: /\bfirebase\b/,
  },
  {
    slug: 'supabase', label: 'Supabase', category: 'cloud',
    env: ['SUPABASE'], depPrefixes: ['@supabase/'], word: /\bsupabase\b/,
  },
  {
    slug: 'vercel', label: 'Vercel', category: 'cloud',
    env: ['VERCEL'], deps: ['vercel'], depPrefixes: ['@vercel/'], word: /\bvercel\b/,
  },
  {
    slug: 'render', label: 'Render', category: 'cloud',
    env: ['RENDER'], word: /`render`|\bRender\b/, ambiguous: true,
  },
  {
    slug: 'cloudflare', label: 'Cloudflare', category: 'cloud',
    env: ['CLOUDFLARE', 'CF'], deps: ['wrangler'], depPrefixes: ['@cloudflare/'],
    word: /\bcloudflare\b/,
  },
  {
    slug: 'cloudinary', label: 'Cloudinary', category: 'cloud',
    env: ['CLOUDINARY'], deps: ['cloudinary'], word: /\bcloudinary\b/,
  },
  {
    slug: 'docker', label: 'Docker', category: 'cloud',
    env: ['DOCKER'], mcp: /\bdocker\b/i, word: /\bdocker\b/,
  },
  {
    slug: 'sentry', label: 'Sentry', category: 'observability',
    env: ['SENTRY'], depPrefixes: ['@sentry/'], word: /\bsentry\b/,
  },
  {
    slug: 'posthog', label: 'PostHog', category: 'observability',
    env: ['POSTHOG'], deps: ['posthog-node', 'posthog-js'], word: /\bposthog\b/,
  },
  {
    slug: 'datadog', label: 'Datadog', category: 'observability',
    env: ['DATADOG', 'DD'], deps: ['dd-trace'], word: /\bdatadog\b/,
  },
  {
    slug: 'firecrawl', label: 'Firecrawl', category: 'other',
    env: ['FIRECRAWL'], deps: ['firecrawl', '@mendable/firecrawl-js'], word: /\bfirecrawl\b/,
  },
]

const BY_SLUG = new Map(SERVICES.map((service) => [service.slug, service]))

export const serviceBySlug = (slug) => BY_SLUG.get(slug) ?? null

function escapeRegExp (value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const defaultWord = (slug) => new RegExp(`\\b${escapeRegExp(slug)}\\b`, 'i')

// ── env-переменные: точное имя → префикс до '_' → префикс без разделителя ────
export function serviceForEnv (name) {
  for (const service of SERVICES) {
    if (service.envExact?.includes(name)) return service
  }
  const prefix = name.split('_')[0]
  for (const service of SERVICES) {
    if (service.env?.includes(prefix)) return service
  }
  for (const service of SERVICES) {
    if (service.envStarts?.some((start) => name.startsWith(start))) return service
  }
  return null
}

// ── package.json: точное имя пакета → скоуп/префикс ─────────────────────────
export function serviceForDep (dep) {
  for (const service of SERVICES) {
    if (service.deps?.includes(dep)) return service
  }
  for (const service of SERVICES) {
    if (service.depPrefixes?.some((prefix) => dep.startsWith(prefix))) return service
  }
  return null
}

// ── Строки подключения в коде: схемы mongodb, postgres, redis, amqp, mysql ───
// После схемы обязан идти хост/переменная: перечисление схем через запятую в прозе
// (как в этом самом комментарии) — не доказательство подключения.
const DSN_SCHEMES = new Map()
for (const service of SERVICES) {
  for (const scheme of service.dsn ?? []) DSN_SCHEMES.set(scheme, service)
}
const DSN_SOURCE = [...DSN_SCHEMES.keys()]
  .sort((a, b) => b.length - a.length || a.localeCompare(b))
  .map(escapeRegExp)
  .join('|')

export const DSN_RE = new RegExp(`\\b(${DSN_SOURCE})://[^\\s,;)\\]]`, 'gi')

export const serviceForDsn = (scheme) => DSN_SCHEMES.get(scheme.toLowerCase()) ?? null

// ── MCP-серверы: сопоставление по имени сервера И по строке запуска ──────────
// filesystem/memory/thinking и подобные обслуживают локальную машину, а не внешнюю
// систему — для них svc намеренно НЕ заводится.
export const MCP_LOCAL = new Set([
  'filesystem', 'fs', 'memory', 'sequential-thinking', 'sequentialthinking',
  'time', 'fetch', 'everything', 'git',
])

export function mcpHaystack (config) {
  const values = [
    config?.command,
    ...(Array.isArray(config?.args) ? config.args : []),
    config?.url,
    ...Object.keys(config?.env ?? {}),
    ...Object.values(config?.env ?? {}),
  ]
  return values.filter((value) => typeof value === 'string').join(' ')
}

export function serviceForMcp (name, haystack = '') {
  if (MCP_LOCAL.has(name)) return null
  const text = `${name} ${haystack}`
  for (const service of SERVICES) {
    if (service.mcp === null) continue
    const regex = service.mcp ?? defaultWord(service.slug)
    if (regex.test(text)) return service
  }
  return null
}

// Имена env-переменных, от которых зависит MCP-сервер: --need=X, ${X}, %%X%%, "env": {X: …}
const MCP_ENV_SKIP = new Set([
  'CLAUDE_PLUGIN_ROOT', 'CLAUDE_PROJECT_DIR', 'CLAUDE_CONFIG_DIR', 'HOME', 'PATH', 'PWD', 'TMPDIR',
])
const MCP_ENV_RE = /--need=([A-Za-z0-9_]+)|\$\{([A-Za-z0-9_]+)\}|%%([A-Za-z0-9_]+)%%|\$([A-Z][A-Z0-9_]+)/g

export function mcpEnvNames (config) {
  const names = new Set()
  const push = (name) => {
    if (name && /^[A-Z][A-Z0-9_]{2,}$/.test(name) && !MCP_ENV_SKIP.has(name)) names.add(name)
  }
  for (const key of Object.keys(config?.env ?? {})) push(key)
  for (const { match } of matchAll(MCP_ENV_RE, mcpHaystack(config))) {
    push(match[1] ?? match[2] ?? match[3] ?? match[4])
  }
  return [...names].sort()
}

// ── Упоминания систем в свободном тексте (тела агентов, документация) ────────
// Возвращает [{service, index, length, quoted}] по возрастанию index.
// Для ambiguous-систем regexp сам несёт точную форму, поэтому регистр значим.
export function serviceMentions (text) {
  const found = []
  for (const service of SERVICES) {
    if (service.word === null) continue
    const regex = service.word ?? defaultWord(service.slug)
    const flags = service.ambiguous ? 'g' : 'gi'
    for (const { match, index } of matchAll(new RegExp(regex.source, flags), text)) {
      const length = match[0].length
      found.push({
        service,
        index,
        length,
        quoted: text[index - 1] === '`' && text[index + length] === '`',
      })
    }
  }
  return found.sort((a, b) => a.index - b.index || a.service.slug.localeCompare(b.service.slug))
}
