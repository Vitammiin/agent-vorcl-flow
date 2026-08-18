import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inspector = path.join(skillRoot, 'scripts/inspect.mjs')
const validator = path.join(skillRoot, 'scripts/validate-description.mjs')
const impact = path.join(skillRoot, 'scripts/check-impact.mjs')

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'init-code-'))
  for (const [name, body] of Object.entries(files)) {
    const target = path.join(root, name)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, body)
  }
  return root
}

test('inspects code without executing package scripts and emits evidence paths', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'shop', description: 'A small shop API', scripts: { dev: 'node src/server.js', test: 'node --test', postinstall: 'exit 99' }, dependencies: { fastify: '5.0.0', pg: '8.0.0' } }),
    'package-lock.json': '{}',
    'src/server.js': 'throw new Error("must not execute")',
    'src/routes/orders.js': 'export const orders = {}',
    'migrations/001.sql': 'create table orders(id int);',
    'tests/orders.test.js': 'export {}',
    '.env.example': 'DATABASE_URL=\nPUBLIC_ORIGIN=http://localhost\n',
  })
  const result = spawnSync(process.execPath, [inspector, '--root', root, '--format', 'json'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const data = JSON.parse(result.stdout)
  assert.deepEqual(data.projectNames, ['shop'])
  assert.ok(data.systems.includes('backend'))
  assert.ok(data.entrypoints.includes('src/server.js'))
  assert.ok(data.routeCandidates.includes('src/routes/orders.js'))
  assert.ok(data.dataBoundaries.includes('migrations/001.sql'))
  assert.deepEqual(data.environmentVariables[0].names, ['DATABASE_URL', 'PUBLIC_ORIGIN'])
  assert.deepEqual(data.packages[0].commands.map((item) => item.name), ['dev', 'test'])
})

test('does not expose actual env values or scan ignored dependency trees', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'safe' }),
    '.env': 'SECRET_TOKEN=real-secret-value',
    '.env.example': 'SECRET_TOKEN=<required>\n',
    'node_modules/evil/package.json': JSON.stringify({ name: 'evil', description: 'real-secret-value' }),
  })
  const result = spawnSync(process.execPath, [inspector, '--root', root, '--format', 'json'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.doesNotMatch(result.stdout, /real-secret-value|evil/)
  const data = JSON.parse(result.stdout)
  assert.deepEqual(data.environmentVariables, [{ path: '.env.example', names: ['SECRET_TOKEN'] }])
})

test('validator enforces structure, evidence and secret hygiene', () => {
  const sections = {
    Purpose: 'The service handles orders for clients. Evidence: `package.json` and `src/server.js`.',
    'How to Run': 'The declared development command is `npm run dev`, sourced from `package.json`.',
    Technology: 'JavaScript and Fastify are declared in `package.json`; the lockfile is `package-lock.json`.',
    Structure: 'Routes live under `src/routes/orders.js`; database changes live in `migrations/001.sql`.',
    'Runtime and Data Flow': 'Inference: `src/server.js` loads `src/routes/orders.js`; persistence details remain unverified.',
    Testing: 'The test command is declared by `package.json`; examples are in `tests/orders.test.js`.',
    'Configuration and Integrations': 'Variable names are documented in `.env.example`; values are intentionally omitted.',
    'Evidence and Unknowns': 'Unknown: runtime deployment and production database topology are not detected from repository files.',
  }
  const body = ['# Project Description', ...Object.entries(sections).flatMap(([heading, text]) => [`## ${heading}`, text])].join('\n\n')
  const root = fixture({ 'PROJECT_DESCRIPTION.md': body, 'bad.md': body.replace('## Testing', '## Tests').replace('values are intentionally omitted', 'SECRET_TOKEN=real-value') })
  const good = spawnSync(process.execPath, [validator, path.join(root, 'PROJECT_DESCRIPTION.md')], { encoding: 'utf8' })
  assert.equal(good.status, 0, good.stderr)
  assert.match(good.stdout, /INITCODE OK/)
  const bad = spawnSync(process.execPath, [validator, path.join(root, 'bad.md')], { encoding: 'utf8' })
  assert.equal(bad.status, 1)
  assert.match(bad.stderr, /sections must appear exactly/)
  assert.match(bad.stderr, /possible secret value/)
})

test('skill and command protect existing descriptions and target code', () => {
  for (const file of ['skills/init-code/SKILL.md', 'commands/init-code.md', 'codex/skills/init-code/SKILL.md']) {
    const source = fs.readFileSync(file, 'utf8')
    assert.match(source, /не (?:затирай|перезаписывай)|не будет молча затирать/i, file)
    assert.match(source, /не (?:запускай|исполняет).*код|target code/i, file)
    assert.match(source, /PROJECT_DESCRIPTION/i, file)
  }
})

test('description impact is a no-op when init-code was never run', () => {
  const root = fixture({ 'src/server.ts': 'export {}' })
  const result = spawnSync(process.execPath, [impact, '--root', root, '--changed', 'src/server.ts', '--format', 'json'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const data = JSON.parse(result.stdout)
  assert.equal(data.status, 'not-initialized')
  assert.equal(data.reviewRequired, false)
  assert.match(data.instruction, /Do not create/)
})

test('source, manifest, tests and runtime config require semantic review when description exists', () => {
  const root = fixture({ 'PROJECT_DESCRIPTION.md': '# Project Description', 'src/server.ts': '', 'package.json': '{}', 'tests/server.test.ts': '', '.github/workflows/ci.yml': '' })
  const args = [impact, '--root', root, '--format', 'json', ...['src/server.ts', 'package.json', 'tests/server.test.ts', '.github/workflows/ci.yml'].flatMap((file) => ['--changed', file])]
  const result = spawnSync(process.execPath, args, { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const data = JSON.parse(result.stdout)
  assert.equal(data.status, 'review-required')
  assert.equal(data.reviewRequired, true)
  assert.equal(data.candidates.length, 4)
})

test('documentation-only edits do not force PROJECT_DESCRIPTION churn', () => {
  const root = fixture({ 'PROJECT_DESCRIPTION.md': '# Project Description', 'docs/guide.md': 'text', 'README.md': 'text' })
  const result = spawnSync(process.execPath, [impact, '--root', root, '--changed', 'docs/guide.md', '--changed', 'README.md', '--format', 'json'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const data = JSON.parse(result.stdout)
  assert.equal(data.status, 'no-context-candidates')
  assert.equal(data.reviewRequired, false)
  assert.equal(data.excluded.length, 2)
})

test('impact checker rejects changed paths outside task scope', () => {
  const root = fixture({ 'PROJECT_DESCRIPTION.md': '# Project Description' })
  const result = spawnSync(process.execPath, [impact, '--root', root, '--changed', '../outside.ts'], { encoding: 'utf8' })
  assert.equal(result.status, 2)
  assert.match(result.stderr, /outside root/)
})

test('external mutations require semantic review without filesystem changes', () => {
  const root = fixture({ 'PROJECT_DESCRIPTION.md': '# Project Description' })
  const result = spawnSync(process.execPath, [impact, '--root', root, '--external', 'render-deploy', '--external', 'database-schema:billing', '--format', 'json'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const data = JSON.parse(result.stdout)
  assert.equal(data.status, 'review-required')
  assert.equal(data.reviewRequired, true)
  assert.deepEqual(data.candidates.map((item) => item.external), ['database-schema:billing', 'render-deploy'])
})

test('external impact values reject secret-like assignments', () => {
  const root = fixture({ 'PROJECT_DESCRIPTION.md': '# Project Description' })
  const result = spawnSync(process.execPath, [impact, '--root', root, '--external', 'API_KEY=secret'], { encoding: 'utf8' })
  assert.equal(result.status, 2)
  assert.match(result.stderr, /invalid external impact/)
})

test('text output names external candidates without undefined placeholders', () => {
  const root = fixture({ 'PROJECT_DESCRIPTION.md': '# Project Description' })
  const result = spawnSync(process.execPath, [impact, '--root', root, '--external', 'render-deploy'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /external:render-deploy/)
  assert.doesNotMatch(result.stdout, /undefined/)
})
