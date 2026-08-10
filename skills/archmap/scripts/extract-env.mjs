#!/usr/bin/env node
// archmap extract-env.mjs — фаза 1: env-переменные (process.env + .env.example),
// внешние сервисы (известные SDK в deps) и ПОЛНЫЙ техстек: каждая зависимость всех
// package.json (dependencies + devDependencies) становится узлом tech с meta.category —
// именно по category lib/graph.mjs buildGroups строит блоки верхнего уровня карты.
// Использование: node extract-env.mjs --root <target> --plan <plan.json> --out <env.part.json>

import path from 'node:path'
import {
  parseArgs, readText, readJson, lineOfIndex, makeNode, makeEdge, partFile, writeJson, loadPlan,
} from './lib/core.mjs'
import { RE, matchAll } from './lib/ts.mjs'

const args = parseArgs(process.argv.slice(2), {
  root: { flag: '--root', default: process.cwd() },
  plan: { flag: '--plan', default: null },
  out: { flag: '--out', default: null },
})
if (args.help || !args.plan || !args.out) {
  console.log('Usage: node extract-env.mjs --root <target> --plan <plan.json> --out <env.part.json>')
  process.exit(args.help ? 0 : 1)
}
const root = path.resolve(args.root)
const plan = loadPlan(args.plan)

const nodes = new Map()
const edges = new Map()
const addNode = (node) => { if (!nodes.has(node.id)) nodes.set(node.id, node) }
const addEdge = (edge) => { if (!edges.has(edge.id)) edges.set(edge.id, edge) }

// ── Известные SDK → внешний сервис (только белый список) ─────────────────────
const SVC_DEPS = {
  'stripe': 'stripe', 'twilio': 'twilio', 'resend': 'resend', '@sendgrid/mail': 'sendgrid',
  'aws-sdk': 'aws', 'firebase': 'firebase', 'firebase-admin': 'firebase',
  'posthog-node': 'posthog', 'posthog-js': 'posthog', 'googleapis': 'google',
  '@anthropic-ai/sdk': 'anthropic', 'openai': 'openai', 'ai': 'vercel-ai',
}
const SVC_PREFIXES = [
  ['@aws-sdk/', 'aws'], ['@sentry/', 'sentry'], ['@supabase/', 'supabase'], ['@slack/', 'slack'],
]
const svcOf = (dep) => SVC_DEPS[dep] ?? SVC_PREFIXES.find(([prefix]) => dep.startsWith(prefix))?.[1] ?? null

// ── Категории техстека: точное имя → префикс скоупа → эвристика → 'other' ────
// Категория — не украшение: это ключ группировки (buildGroups → grp:infra:tech:<category>),
// то есть блок верхнего уровня карты. Незнакомый пакет обязан попасть хоть куда-то.
const CATEGORY_EXACT = {
  // framework
  'fastify': 'framework', 'express': 'framework', 'koa': 'framework', 'hono': 'framework',
  'hapi': 'framework', 'elysia': 'framework', 'next': 'framework', 'nuxt': 'framework',
  'react': 'framework', 'react-dom': 'framework', 'react-native': 'framework', 'preact': 'framework',
  'vue': 'framework', 'svelte': 'framework', 'solid-js': 'framework', 'astro': 'framework',
  'expo': 'framework', 'electron': 'framework', 'cors': 'framework', 'helmet': 'framework',
  'fastify-plugin': 'framework',
  // database
  'prisma': 'database', 'drizzle-orm': 'database', 'drizzle-kit': 'database', 'typeorm': 'database',
  'mongoose': 'database', 'mongodb': 'database', 'sequelize': 'database', 'kysely': 'database',
  'knex': 'database', 'pg': 'database', 'pg-promise': 'database', 'mysql': 'database',
  'mysql2': 'database', 'better-sqlite3': 'database', 'sqlite3': 'database', 'postgres': 'database',
  'node-pg-migrate': 'database', 'mikro-orm': 'database',
  // cache-queue
  'ioredis': 'cache-queue', 'redis': 'cache-queue', 'bullmq': 'cache-queue', 'bull': 'cache-queue',
  'bee-queue': 'cache-queue', 'amqplib': 'cache-queue', 'kafkajs': 'cache-queue',
  'agenda': 'cache-queue', 'node-cache': 'cache-queue', 'lru-cache': 'cache-queue',
  // ai
  'openai': 'ai', 'ai': 'ai', 'langchain': 'ai', 'llamaindex': 'ai', 'tiktoken': 'ai',
  'ollama': 'ai', 'js-tiktoken': 'ai', 'gpt-tokenizer': 'ai',
  // auth
  'jsonwebtoken': 'auth', 'jose': 'auth', 'bcrypt': 'auth', 'bcryptjs': 'auth', 'argon2': 'auth',
  '@fastify/jwt': 'auth', 'next-auth': 'auth', 'oauth': 'auth', 'otplib': 'auth',
  'speakeasy': 'auth', 'express-session': 'auth', 'cookie-session': 'auth',
  // payments
  'stripe': 'payments', 'braintree': 'payments', 'paypal-rest-sdk': 'payments',
  // http-client
  'axios': 'http-client', 'got': 'http-client', 'node-fetch': 'http-client', 'undici': 'http-client',
  'ky': 'http-client', 'superagent': 'http-client', 'cross-fetch': 'http-client', 'request': 'http-client',
  // validation
  'zod': 'validation', 'joi': 'validation', 'yup': 'validation', 'ajv': 'validation',
  'class-validator': 'validation', 'class-transformer': 'validation', 'valibot': 'validation',
  'superstruct': 'validation',
  // testing
  'vitest': 'testing', 'jest': 'testing', 'ts-jest': 'testing', 'mocha': 'testing', 'chai': 'testing',
  'supertest': 'testing', 'playwright': 'testing', 'cypress': 'testing', 'sinon': 'testing',
  'jsdom': 'testing', 'happy-dom': 'testing', 'testcontainers': 'testing', 'nyc': 'testing', 'c8': 'testing',
  // build
  'typescript': 'build', 'tsx': 'build', 'ts-node': 'build', 'esbuild': 'build', 'vite': 'build',
  'webpack': 'build', 'rollup': 'build', 'tsup': 'build', 'turbo': 'build', 'nodemon': 'build',
  'postcss': 'build', 'autoprefixer': 'build', 'rimraf': 'build', 'cross-env': 'build',
  'concurrently': 'build', 'tsc-alias': 'build', 'tsconfig-paths': 'build', 'jiti': 'build',
  // lint
  'eslint': 'lint', 'prettier': 'lint', 'stylelint': 'lint', 'husky': 'lint', 'lint-staged': 'lint',
  'commitlint': 'lint', 'biome': 'lint', 'globals': 'lint', 'typescript-eslint': 'lint',
  // ui
  'tailwindcss': 'ui', 'styled-components': 'ui', 'framer-motion': 'ui', 'motion': 'ui',
  'lucide-react': 'ui', 'clsx': 'ui', 'class-variance-authority': 'ui', 'tailwind-merge': 'ui',
  'react-icons': 'ui', 'recharts': 'ui', 'd3': 'ui', 'antd': 'ui', 'bootstrap': 'ui', 'sass': 'ui',
  'nativewind': 'ui',
  // observability
  'pino': 'observability', 'pino-pretty': 'observability', 'winston': 'observability',
  'bunyan': 'observability', 'morgan': 'observability', 'prom-client': 'observability',
  'dd-trace': 'observability', 'elastic-apm-node': 'observability', 'debug': 'observability',
  // cloud
  'aws-sdk': 'cloud', 'googleapis': 'cloud', 'firebase': 'cloud', 'firebase-admin': 'cloud',
  'vercel': 'cloud', 'wrangler': 'cloud', 'cloudinary': 'cloud', 'minio': 'cloud',
  // messaging
  'nodemailer': 'messaging', 'resend': 'messaging', 'twilio': 'messaging', 'telegraf': 'messaging',
  'grammy': 'messaging', 'node-telegram-bot-api': 'messaging', 'discord.js': 'messaging',
  'mailgun.js': 'messaging', 'postmark': 'messaging', 'web-push': 'messaging',
  'mailparser': 'messaging', 'imap': 'messaging', 'svix': 'messaging', 'livekit-server-sdk': 'messaging',
  // utility
  'lodash': 'utility', 'lodash-es': 'utility', 'dayjs': 'utility', 'date-fns': 'utility',
  'moment': 'utility', 'uuid': 'utility', 'nanoid': 'utility', 'qs': 'utility', 'dotenv': 'utility',
  'dotenv-expand': 'utility', 'chalk': 'utility', 'picocolors': 'utility', 'kleur': 'utility',
  'commander': 'utility', 'yargs': 'utility', 'minimist': 'utility', 'yaml': 'utility',
  'js-yaml': 'utility', 'semver': 'utility', 'glob': 'utility', 'fast-glob': 'utility',
  'ms': 'utility', 'p-limit': 'utility', 'p-retry': 'utility', 'mime': 'utility',
  'mime-types': 'utility', 'slugify': 'utility', 'cheerio': 'utility', 'execa': 'utility',
  'zx': 'utility', 'fs-extra': 'utility', 'archiver': 'utility', 'sharp': 'utility',
  'multer': 'utility', 'node-cron': 'utility', 'croner': 'utility', 'luxon': 'utility',
  'exceljs': 'utility', 'xlsx': 'utility', 'pdfkit': 'utility', 'pdf-parse': 'utility',
  'pdf-lib': 'utility', 'mupdf': 'utility', 'geoip-lite': 'utility', 'jszip': 'utility',
}

const CATEGORY_PREFIX = [
  ['@anthropic-ai/', 'ai'], ['@langchain/', 'ai'], ['@modelcontextprotocol/', 'ai'],
  ['@ai-sdk/', 'ai'], ['@huggingface/', 'ai'], ['@google/generative-ai', 'ai'],
  ['@prisma/', 'database'], ['@mikro-orm/', 'database'], ['@libsql/', 'database'],
  ['@neondatabase/', 'database'], ['@pinecone-database/', 'database'], ['@qdrant/', 'database'],
  ['@upstash/', 'cache-queue'], ['@bull-board/', 'cache-queue'],
  ['@auth/', 'auth'], ['passport', 'auth'], ['bcrypt', 'auth'], ['next-auth', 'auth'],
  ['@paddle/', 'payments'], ['@stripe/', 'payments'], ['paypal', 'payments'], ['@apple/', 'payments'],
  ['@sinclair/', 'validation'],
  ['@playwright/', 'testing'], ['@testing-library/', 'testing'], ['@vitest/', 'testing'],
  ['@faker-js/', 'testing'], ['@cypress/', 'testing'],
  ['@typescript-eslint/', 'lint'], ['@eslint/', 'lint'], ['@commitlint/', 'lint'],
  ['@biomejs/', 'lint'], ['eslint-', 'lint'], ['prettier-', 'lint'], ['stylelint-', 'lint'],
  ['@babel/', 'build'], ['@swc/', 'build'], ['@vitejs/', 'build'], ['@rollup/', 'build'],
  ['@esbuild', 'build'], ['babel-', 'build'], ['webpack-', 'build'], ['vite-plugin-', 'build'],
  ['@radix-ui/', 'ui'], ['@mui/', 'ui'], ['@emotion/', 'ui'], ['@headlessui/', 'ui'],
  ['@heroicons/', 'ui'], ['@tailwindcss/', 'ui'], ['@shadcn/', 'ui'], ['@storybook/', 'ui'],
  ['tailwind-', 'ui'], ['@chakra-ui/', 'ui'],
  ['@sentry/', 'observability'], ['@opentelemetry/', 'observability'], ['@logtail/', 'observability'],
  ['posthog', 'observability'], ['datadog', 'observability'],
  ['@aws-sdk/', 'cloud'], ['@google-cloud/', 'cloud'], ['@azure/', 'cloud'], ['@supabase/', 'cloud'],
  ['@vercel/', 'cloud'], ['@cloudflare/', 'cloud'], ['firebase-', 'cloud'],
  ['@sendgrid/', 'messaging'], ['@slack/', 'messaging'], ['@twilio/', 'messaging'],
  ['@livekit/', 'messaging'],
  ['@nestjs/', 'framework'], ['@sveltejs/', 'framework'], ['@remix-run/', 'framework'],
  ['@angular/', 'framework'], ['@hapi/', 'framework'], ['@expo/', 'framework'],
  ['@fastify/', 'framework'], ['@koa/', 'framework'], ['@react-native', 'framework'],
  ['fastify-', 'framework'],
  ['csv-', 'utility'], ['papaparse', 'utility'],
]

const CATEGORY_RULES = [
  [/eslint|prettier|stylelint|biome/, 'lint'],
  [/(^|[-@/])jest([-./]|$)|playwright|vitest|mocha|cypress|testing-library|(^|-)test(ing)?($|-)/, 'testing'],
  [/webpack|rollup|babel|esbuild|swc|bundler|minify|uglify/, 'build'],
  [/opentelemetry|sentry|logger|logging|metrics|tracing/, 'observability'],
  [/tailwind|radix|storybook|icons?($|-)|chakra/, 'ui'],
  [/redis|kafka|rabbit|amqp|queue/, 'cache-queue'],
  [/postgres|mysql|sqlite|mongo|prisma|drizzle|typeorm|sequelize|(^|-)sql($|-)/, 'database'],
  [/openai|anthropic|langchain|(^|-)llm($|-)|embedding/, 'ai'],
  [/aws|gcloud|azure|firebase|supabase|vercel|cloudflare/, 'cloud'],
  [/telegram|mailer|email|smtp|slack|discord|twilio|sendgrid/, 'messaging'],
  [/jwt|oauth|auth($|[-/])|passport|crypto-?(hash|pass)/, 'auth'],
  [/stripe|paddle|payment|billing/, 'payments'],
  [/fetch|axios|http-?client/, 'http-client'],
  [/schema|validat|dompurify|sanitiz/, 'validation'],
  [/app-store|in-app-purchase|revenuecat/, 'payments'],
  [/pdf|xlsx|excel|docx|csv|zip|archive|date|time(zone)?($|-)/, 'utility'],
]

function categorize (name) {
  const exact = CATEGORY_EXACT[name]
  if (exact) return exact
  const prefix = CATEGORY_PREFIX.find(([value]) => name.startsWith(value))
  if (prefix) return prefix[1]
  const rule = CATEGORY_RULES.find(([regex]) => regex.test(name))
  if (rule) return rule[1]
  return 'other'
}

// @types/* — не технология, а тайпинги; workspace-пакеты живут как pkg:-узлы (extract-modules).
const workspaceNames = new Set((plan.repo?.packages ?? []).map((pkg) => pkg.name))
const isTechDep = (dep) => !dep.startsWith('@types/') && !workspaceNames.has(dep)

// ── 1. Env-переменные: process.env в коде + ребро reads-env от модуля ────────
for (const file of plan.files?.code ?? []) {
  const text = readText(path.join(root, file))
  if (!text) continue
  for (const { match, index } of matchAll(RE.envAccess, text)) {
    const name = match[1] ?? match[2]
    const line = lineOfIndex(text, index)
    addNode(makeNode({
      id: `env:${name}`, kind: 'env', layer: 'infra', label: name,
      source: { file, line }, meta: {},
    }))
    // module-узлы создаёт extract-modules; недостающие endpoint'ы merge закроет stub'ом
    addEdge(makeEdge({ kind: 'reads-env', from: `module:${file}`, to: `env:${name}`, source: { file, line } }))
  }
}

// ── 1b. Переменные из .env.example ───────────────────────────────────────────
for (const file of plan.files?.envFiles ?? []) {
  const text = readText(path.join(root, file))
  if (!text) continue
  const lines = text.split('\n')
  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(/^([A-Z][A-Z0-9_]*)\s*=/)
    if (!match) continue
    const id = `env:${match[1]}`
    if (nodes.has(id)) {
      nodes.get(id).meta.inExample = true
    } else {
      addNode(makeNode({
        id, kind: 'env', layer: 'infra', label: match[1],
        source: { file, line: index + 1 }, meta: { inExample: true },
      }))
    }
  }
}

// ── 2+3. Внешние сервисы (svc) и весь техстек (tech) из deps всех package.json ─
// svc и tech намеренно сосуществуют: у них разные kind и разный смысл на карте
// («мы платим этому сервису» vs «в коде стоит эта библиотека»).
for (const file of plan.files?.packageJson ?? []) {
  const pkg = readJson(path.join(root, file))
  if (!pkg) continue
  const text = readText(path.join(root, file)) ?? ''
  for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
    for (const [dep, version] of Object.entries(pkg[section] ?? {})) {
      const at = text.indexOf(`"${dep}":`)
      const source = { file, line: at === -1 ? 1 : lineOfIndex(text, at) }
      const svc = svcOf(dep)
      if (svc) {
        addNode(makeNode({
          id: `svc:${svc}`, kind: 'external-service', layer: 'infra', label: svc,
          source, meta: { dep },
        }))
      }
      // peer — контракт для потребителя пакета, а не стек самого репо
      if (section === 'peerDependencies' || !isTechDep(dep)) continue
      const id = `tech:${dep}`
      const dev = section === 'devDependencies'
      const existing = nodes.get(id)
      if (existing) {
        // прод-зависимость в любом пакете монорепо перевешивает dev в другом
        if (!dev) existing.meta.dev = false
        continue
      }
      addNode(makeNode({
        id, kind: 'tech', layer: 'infra', label: dep, source,
        meta: {
          version: typeof version === 'string' ? version : '',
          category: categorize(dep),
          dev,
          package: file,
        },
      }))
    }
  }
}

// ── Запись part-файла ────────────────────────────────────────────────────────
const nodeList = [...nodes.values()]
const edgeList = [...edges.values()]
const techNodes = nodeList.filter((node) => node.kind === 'tech')
const byCategory = {}
for (const node of techNodes) {
  byCategory[node.meta.category] = (byCategory[node.meta.category] ?? 0) + 1
}
const stats = {
  env: nodeList.filter((node) => node.kind === 'env').length,
  services: nodeList.filter((node) => node.kind === 'external-service').length,
  tech: techNodes.length,
  techByCategory: Object.fromEntries(Object.keys(byCategory).sort().map((key) => [key, byCategory[key]])),
}
writeJson(args.out, partFile({ part: 'env', root, nodes: nodeList, edges: edgeList, stats }))
const categorySummary = Object.entries(stats.techByCategory)
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([category, count]) => `${category} ${count}`)
  .join(', ')
console.log(`archmap extract-env: ${stats.env} env, ${stats.services} services, ` +
  `${stats.tech} tech, ${edgeList.length} reads-env edges → ${args.out}`)
if (categorySummary) console.log(`  tech по категориям: ${categorySummary}`)
