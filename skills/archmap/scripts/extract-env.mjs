#!/usr/bin/env node
// archmap extract-env.mjs — фаза 1: env-переменные (process.env + .env.example),
// внешние сервисы (известные SDK в deps) и ключевые технологии (белый список).
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

// ── Ключевые технологии (белый список — не каждый пакет становится tech) ─────
const TECH_DEPS = {
  'fastify': 'fastify', 'express': 'express', '@nestjs/core': 'nestjs', 'next': 'nextjs',
  'prisma': 'prisma', '@prisma/client': 'prisma', 'drizzle-orm': 'drizzle', 'typeorm': 'typeorm',
  'mongoose': 'mongoose', 'ioredis': 'redis', 'redis': 'redis', 'bullmq': 'bullmq', 'bull': 'bullmq',
  'typescript': 'typescript', 'react': 'react', 'vite': 'vite', 'tailwindcss': 'tailwindcss',
  'zod': 'zod', 'electron': 'electron',
}

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

// ── 2+3. Внешние сервисы и технологии из deps всех package.json ──────────────
for (const file of plan.files?.packageJson ?? []) {
  const pkg = readJson(path.join(root, file))
  if (!pkg) continue
  const text = readText(path.join(root, file)) ?? ''
  for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
    for (const dep of Object.keys(pkg[section] ?? {})) {
      const at = text.indexOf(`"${dep}":`)
      const source = { file, line: at === -1 ? 1 : lineOfIndex(text, at) }
      const svc = svcOf(dep)
      if (svc) {
        addNode(makeNode({
          id: `svc:${svc}`, kind: 'external-service', layer: 'infra', label: svc,
          source, meta: { dep },
        }))
      }
      const tech = TECH_DEPS[dep]
      if (tech) {
        addNode(makeNode({
          id: `tech:${tech}`, kind: 'tech', layer: 'infra', label: tech,
          source, meta: { dep },
        }))
      }
    }
  }
}

// ── Запись part-файла ────────────────────────────────────────────────────────
const nodeList = [...nodes.values()]
const edgeList = [...edges.values()]
const stats = {
  env: nodeList.filter((node) => node.kind === 'env').length,
  services: nodeList.filter((node) => node.kind === 'external-service').length,
  tech: nodeList.filter((node) => node.kind === 'tech').length,
}
writeJson(args.out, partFile({ part: 'env', root, nodes: nodeList, edges: edgeList, stats }))
console.log(`archmap extract-env: ${stats.env} env, ${stats.services} services, ` +
  `${stats.tech} tech, ${edgeList.length} reads-env edges → ${args.out}`)
