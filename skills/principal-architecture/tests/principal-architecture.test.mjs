import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { sanitize } from '../scripts/lib/core.mjs'

const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CLI = path.join(SKILL, 'scripts', 'principal-architecture.mjs')

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'principal-architecture-test-'))
  const files = {
    'src/server.ts': "import Fastify from 'fastify'\nimport { save } from './store'\nconst app=Fastify()\napp.post('/users', async()=>save(process.env.DATABASE_URL))\n",
    'src/view.tsx': "import React from 'react'\nexport function View(){return <main>Hello</main>}\n",
    'src/util.js': "export function ping(){ return 'pong' }\n",
    'src/job.py': "import os\nclass Worker:\n    def run(self):\n        return os.getenv('QUEUE_URL')\n",
    'src/main.go': "package main\nimport \"fmt\"\nfunc main(){fmt.Println(\"ok\")}\n",
    'src/App.java': "package demo; import java.util.List; public class App { public void run() {} }\n",
    'src/App.cs': "using System; namespace Demo { public class App { public void Run() {} } }\n",
    'src/lib.rs': "use std::env; pub struct App; pub fn run() { let _ = env::var(\"TOKEN_NAME\"); }\n",
    'src/app.php': "<?php namespace Demo; use DateTime; class App { public function run() {} }\n",
    'src/app.rb': "require 'json'\nclass App\n  def run\n  end\nend\n",
    'src/App.kt': "package demo\nimport java.time.Instant\nclass App { fun run() = Instant.now() }\n",
    'src/App.swift': "import Foundation\nstruct App { func run() { print(\"ok\") } }\n",
    'src/store.ts': "export function save(value: string|undefined){ return value }\n",
    'schema.sql': 'CREATE TABLE users (id uuid primary key);\n',
    'Dockerfile': 'FROM node:22-alpine\nCMD [\"node\",\"src/server.js\"]\n',
    '.github/workflows/ci.yml': 'name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n',
    'infra/main.tf': 'resource "aws_s3_bucket" "artifacts" { bucket = "example" }\n',
    'k8s/api.yaml': 'apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: api\n',
    'schema.graphql': 'type Query { health: Boolean! }\n',
    'package.json': '{"dependencies":{"fastify":"^5.0.0"}}\n',
    'README.md': '# Fiction\nUses Kafka and 400 microservices.\n',
  }
  for (const [relative, contents] of Object.entries(files)) { const file = path.join(root, relative); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, contents) }
  return root
}

function run(root, command, extra = []) {
  return spawnSync(process.execPath, [CLI, command, '--root', root, '--formats=md,html,drawio,mermaid', ...extra], { encoding: 'utf8', timeout: 120_000 })
}

function outputFor(root) {
  return path.join(root, 'docs', 'architecture', sanitize(path.basename(root)))
}

test('creates evidence-based polyglot package without trusting README', () => {
  const root = fixture(); const result = run(root, 'create')
  assert.equal(result.status, 0, result.stderr)
  const output = outputFor(root)
  const model = JSON.parse(fs.readFileSync(path.join(output, 'architecture.model.json'), 'utf8'))
  const parsers = new Set(model.files.map((file) => file.parser))
  for (const language of ['typescript', 'tsx', 'javascript', 'python', 'go', 'java', 'csharp', 'rust', 'php', 'ruby', 'kotlin', 'swift']) assert.ok([...parsers].some((parser) => parser === `tree-sitter:${language}`), `missing ${language}`)
  assert.equal(model.files.some((file) => file.file === 'README.md'), false)
  assert.equal(model.nodes.some((node) => /400 microservices|Kafka/.test(node.label)), false)
  assert.ok(model.nodes.some((node) => node.kind === 'route' && node.meta.path === '/users'))
  assert.ok(model.nodes.some((node) => node.kind === 'data-store' && node.label === 'users'))
  assert.ok(model.nodes.some((node) => node.kind === 'container-image' && node.label === 'node:22-alpine'))
  assert.ok(model.nodes.some((node) => node.kind === 'ci-job' && node.label === 'test'))
  assert.ok(model.nodes.some((node) => node.kind === 'infrastructure-resource' && node.meta?.category === 'terraform'))
  assert.ok(model.nodes.some((node) => node.kind === 'infrastructure-resource' && node.label === 'Deployment/api'))
  assert.ok(model.nodes.some((node) => node.kind === 'api-contract' && node.label === 'type Query'))
  assert.ok(model.nodes.some((node) => node.kind === 'external-dependency' && node.meta?.package === 'fastify'))
  assert.ok(model.nodes.every((node) => node.evidence?.length))
  assert.ok(model.edges.every((edge) => edge.evidence?.length))
  assert.doesNotMatch(fs.readFileSync(path.join(output, 'architecture.html'), 'utf8'), /https?:\/\//i)
  assert.match(fs.readFileSync(path.join(output, 'architecture.drawio'), 'utf8'), /<mxfile/)
  assert.match(fs.readFileSync(path.join(output, 'architecture.drawio'), 'utf8'), /jumpStyle=arc/)
  assert.match(fs.readFileSync(path.join(output, 'architecture.drawio'), 'utf8'), /name="L0 Overview"/)
  assert.match(fs.readFileSync(path.join(output, 'architecture.drawio'), 'utf8'), /name="L1 System"/)
  assert.match(fs.readFileSync(path.join(output, 'architecture.html'), 'utf8'), /aria-labelledby="pa-title pa-desc"/)
  assert.match(fs.readFileSync(path.join(output, 'mermaid', 'L0-context.mmd'), 'utf8'), /^flowchart /)
})

test('draw.io validator scopes IDs per page and rejects dangling edges and overlaps', async () => {
  const { validateDrawio } = await import('../scripts/validate-drawio.mjs')
  const page = (id, body) => `<diagram id="${id}" name="${id}"><mxGraphModel gridSize="10"><root><mxCell id="0"/><mxCell id="1" parent="0"/>${body}</root></mxGraphModel></diagram>`
  const vertex = (id, x) => `<mxCell id="${id}" vertex="1" parent="1"><mxGeometry x="${x}" y="10" width="100" height="50" as="geometry"/></mxCell>`
  const valid = `<?xml version="1.0"?><mxfile>${page('one', vertex('2', 10))}${page('two', vertex('2', 10))}</mxfile>`
  assert.deepEqual(validateDrawio(valid), [])
  const dangling = `<?xml version="1.0"?><mxfile>${page('one', `${vertex('2', 10)}<mxCell id="e" edge="1" parent="1" source="2" target="missing"><mxGeometry relative="1" as="geometry"/></mxCell>`)}</mxfile>`
  assert.ok(validateDrawio(dangling).some((error) => error.includes('dangling')))
  const overlap = `<?xml version="1.0"?><mxfile>${page('one', `${vertex('2', 10)}${vertex('3', 50)}`)}</mxfile>`
  assert.ok(validateDrawio(overlap).some((error) => error.includes('overlapping')))
})

test('draw.io renderer splits dense layers instead of shrinking a single canvas', async () => {
  const { renderDrawio } = await import('../scripts/render-drawio.mjs')
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'principal-drawio-budget-')); const file = path.join(root, 'dense.drawio')
  const nodes = Array.from({ length: 30 }, (_, index) => ({ id: `module:src/m${index}.ts`, label: `Module ${index}`, kind: 'module', layer: 'application', evidence: [{ file: `src/m${index}.ts`, line: 1, parser: 'test', confidence: 'high' }] }))
  renderDrawio({ nodes, edges: [] }, file, { maxNodesPerPage: 12 })
  const xml = fs.readFileSync(file, 'utf8')
  assert.match(xml, /name="L2 Application 1"/); assert.match(xml, /name="L2 Application 2"/); assert.match(xml, /name="L2 Application 3"/)
  for (const page of xml.matchAll(/<diagram\b[^>]*name="L2 Application [^"]+"[^>]*>([\s\S]*?)<\/diagram>/g)) assert.ok((page[1].match(/vertex="1"/g) || []).length <= 13, '12 nodes plus one zone maximum')
})

test('update full-rescans deterministically and preserves annotations and unmanaged files', () => {
  const root = fixture(); assert.equal(run(root, 'create').status, 0)
  const output = outputFor(root)
  const before = JSON.parse(fs.readFileSync(path.join(output, 'architecture.model.json'), 'utf8'))
  fs.writeFileSync(path.join(output, 'architecture.annotations.json'), JSON.stringify({ schemaVersion: '1.0.0', notes: ['Owner confirmed manually'], proposals: [] }, null, 2))
  fs.writeFileSync(path.join(output, 'MANUAL.md'), 'keep me\n')
  const unchanged = run(root, 'update'); assert.equal(unchanged.status, 0, unchanged.stderr)
  const same = JSON.parse(fs.readFileSync(path.join(output, 'architecture.model.json'), 'utf8'))
  assert.equal(same.modelHash, before.modelHash)
  assert.match(fs.readFileSync(path.join(output, 'architecture.annotations.json'), 'utf8'), /Owner confirmed/)
  assert.equal(fs.readFileSync(path.join(output, 'MANUAL.md'), 'utf8'), 'keep me\n')
  fs.appendFileSync(path.join(root, 'src', 'server.ts'), "app.get('/health', async()=>({ok:true}))\n")
  const changed = run(root, 'update'); assert.equal(changed.status, 0, changed.stderr)
  const diff = JSON.parse(fs.readFileSync(path.join(output, 'architecture.diff.json'), 'utf8'))
  assert.ok(diff.addedNodes.some((id) => id.includes('/health')))
  const duplicate = run(root, 'create'); assert.notEqual(duplicate.status, 0)
})

test('rejects scope and output paths outside repository', () => {
  const root = fixture()
  const result = spawnSync(process.execPath, [CLI, 'create', '--root', root, '--scope', '..'], { encoding: 'utf8' })
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /scope must stay inside repository root/)
})

test('always publishes Markdown first and produces portable PDF without project dependencies', () => {
  const root = fixture()
  const result = spawnSync(process.execPath, [CLI, 'create', '--root', root, '--formats=pdf'], { encoding: 'utf8', timeout: 120_000 })
  assert.equal(result.status, 0, result.stderr)
  const output = outputFor(root)
  assert.ok(fs.existsSync(path.join(output, 'ARCHITECTURE.md')))
  assert.equal(fs.readFileSync(path.join(output, 'architecture.pdf')).subarray(0, 5).toString(), '%PDF-')
})
