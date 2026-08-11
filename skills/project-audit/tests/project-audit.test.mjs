import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const inventory = path.join(rootDir, 'scripts/inventory.mjs')
const validator = path.join(rootDir, 'scripts/validate-report.mjs')

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'project-audit-'))
  for (const [name, body] of Object.entries(files)) {
    const target = path.join(root, name)
    fs.mkdirSync(path.dirname(target), { recursive: true })
    fs.writeFileSync(target, body)
  }
  return root
}

test('detects mixed web, backend, Expo, database and infrastructure boundaries', () => {
  const root = fixture({
    'package.json': JSON.stringify({ private: true, workspaces: ['apps/*'] }),
    'pnpm-lock.yaml': 'lockfileVersion: 9',
    'apps/web/package.json': JSON.stringify({ name: 'web', dependencies: { next: '16.0.0', react: '19.0.0' } }),
    'apps/api/package.json': JSON.stringify({ name: 'api', dependencies: { fastify: '5.0.0', pg: '8.0.0' } }),
    'apps/mobile/package.json': JSON.stringify({ name: 'mobile', dependencies: { expo: '57.0.0', 'react-native': '0.86.0' } }),
    'apps/mobile/app/_layout.tsx': 'export default function Layout() {}',
    '.github/workflows/ci.yml': 'name: ci',
    'Dockerfile': 'FROM node:22',
    'openapi.yaml': 'openapi: 3.1.0',
  })
  const result = spawnSync(process.execPath, [inventory, '--root', root, '--format', 'json'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const data = JSON.parse(result.stdout)
  for (const system of ['backend', 'database', 'frontend', 'infrastructure', 'mobile']) assert.ok(data.systems.includes(system), `missing ${system}`)
  for (const role of ['architect', 'backend', 'database', 'devops', 'expo-mobile', 'frontend', 'security', 'swagger']) assert.ok(data.roleHints.includes(role), `missing ${role}`)
})

test('keeps a backend-only project backend-only', () => {
  const root = fixture({ 'package.json': JSON.stringify({ name: 'api', dependencies: { express: '5.0.0' } }), 'package-lock.json': '{}' })
  const result = spawnSync(process.execPath, [inventory, '--root', root, '--format', 'json'], { encoding: 'utf8' })
  assert.equal(result.status, 0)
  const data = JSON.parse(result.stdout)
  assert.ok(data.systems.includes('backend'))
  assert.ok(!data.systems.includes('mobile'))
})

test('does not infer product backends or databases from audit skill documentation paths', () => {
  const root = fixture({
    'package.json': JSON.stringify({ name: 'tooling', bin: { tooling: 'bin/tool.mjs' } }),
    'codex/skills/backend-create-api/SKILL.md': 'mentions postgres mongodb redis',
    'commands/swagger/audit.md': 'audit docs',
  })
  const result = spawnSync(process.execPath, [inventory, '--root', root, '--format', 'json'], { encoding: 'utf8' })
  assert.equal(result.status, 0)
  const data = JSON.parse(result.stdout)
  assert.deepEqual(data.databases, [])
  assert.ok(!data.systems.includes('backend'))
  assert.ok(!data.architectureSignals.includes('openapi'))
})

test('detects polyglot backends, compose databases, standalone OpenAPI and Expo native config', () => {
  const root = fixture({
    'services/python/requirements.txt': 'fastapi==0.120.0\n',
    'services/go/go.mod': 'module example\nrequire github.com/gin-gonic/gin v1.10.0\n',
    'apps/mobile/package.json': JSON.stringify({ dependencies: { expo: '57.0.0', react: '19.2.3', 'react-native': '0.86.0' } }),
    'apps/mobile/app/_layout.tsx': 'export default function Layout() {}',
    'apps/mobile/android/app/src/main/AndroidManifest.xml': '<manifest />',
    'compose.yml': 'services:\n  db:\n    image: postgres:17\n',
    'contracts/openapi.yaml': 'openapi: 3.1.0',
    'README.md': '# Service',
  })
  const result = spawnSync(process.execPath, [inventory, '--root', root, '--format', 'json'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const data = JSON.parse(result.stdout)
  for (const system of ['api-contract', 'backend', 'database', 'infrastructure', 'mobile']) assert.ok(data.systems.includes(system), `missing ${system}`)
  assert.ok(!data.packages.find((pkg) => pkg.name === null)?.kinds.includes('frontend'), 'Expo-only package must not trigger web frontend')
  for (const role of ['backend', 'database', 'devops', 'docs', 'expo-mobile', 'swagger']) assert.ok(data.roleHints.includes(role), `missing ${role}`)
  assert.ok(data.nativeConfig.some((file) => file.endsWith('AndroidManifest.xml')))
})

test('reports malformed manifests and truncated deep trees as coverage gaps', () => {
  const deep = Array.from({ length: 14 }, (_, index) => `d${index}`).join('/')
  const root = fixture({ 'package.json': '{bad', [`${deep}/file.ts`]: 'export {}' })
  const result = spawnSync(process.execPath, [inventory, '--root', root, '--format', 'json'], { encoding: 'utf8' })
  assert.equal(result.status, 0)
  const gaps = JSON.parse(result.stdout).coverageGaps.join('\n')
  assert.match(gaps, /malformed manifest: package.json/)
  assert.match(gaps, /depth limit:/)
})

test('validates complete reports and rejects evidence-free findings', () => {
  const sections = ['Audit metadata', 'Executive summary', 'Detected systems and architecture', 'Findings', 'Dependency vulnerabilities', 'Error handling and resilience', 'Target architecture', 'Replacement and change matrix', 'Remediation roadmap', 'Verification plan', 'Coverage gaps / Needs verification', 'Appendix: commands and sources']
  const content = {
    'Audit metadata': '- Repository: fixture\n- Scope: entire repository\n- Commit/worktree: abc123 clean\n- Timestamp/timezone: 2026-08-11T12:00:00Z UTC\n- Roles: architect, backend, security\n- Package managers: npm with package-lock.json\n- Advisory status: checked online',
    'Executive summary': 'One high-severity architectural boundary defect was confirmed with direct source evidence.',
    'Detected systems and architecture': 'Current architecture: HTTP handlers directly own persistence in a single backend package.',
    Findings: '### AUD-001 — [high] Missing boundary\n- Boundary: Backend\n- Evidence: `src/api.ts:12` — direct database access\n- Root cause: no application boundary\n- Impact: coupling and transaction inconsistency\n- Fix: move query behind an application-owned repository port\n- Target state: repository adapter owned by backend module\n- Verify: unit test and architecture guard\n- Owner: backend',
    'Dependency vulnerabilities': 'Checked UTC: 2026-08-11T12:00:00Z\nSource: npm audit\nStatus: zero advisories reported by scanner',
    'Error handling and resilience': 'The global HTTP error handler exists; transaction rollback still needs verification against integration tests.',
    'Target architecture': 'Routes call application use cases, which own repository ports and preserve framework-independent domain rules.',
    'Replacement and change matrix': '| Current | Problem | Replace/move/add | Target owner/layer | Prerequisite | Risk | Verification |\n|---|---|---|---|---|---|---|\n| route query | coupling | move | backend/application | tests | medium | unit test |',
    'Remediation roadmap': '### P0 Containment\nNo emergency containment.\n### P1 Correctness\nAUD-001 add characterization tests.\n### P2 Architecture\nAUD-001 introduce repository port.\n### P3 Modernization\nDocument module boundary and ownership.',
    'Verification plan': 'Run `npm test` and the architecture guard after each migration seam.',
    'Coverage gaps / Needs verification': 'Production database runtime and load behavior were not available in this fixture audit.',
    'Appendix: commands and sources': 'Command: npm audit --json\nSource: https://github.com/advisories',
  }
  const body = ['# Project Audit', ...sections.flatMap((section) => [`## ${section}`, content[section]])].join('\n')
  const good = fixture({ 'PROJECT_AUDIT.md': body })
  const goodResult = spawnSync(process.execPath, [validator, path.join(good, 'PROJECT_AUDIT.md')], { encoding: 'utf8' })
  assert.equal(goodResult.status, 0, goodResult.stderr)

  const bad = fixture({ 'PROJECT_AUDIT.md': body.replace('`src/api.ts:12` — direct database access', 'looks suspicious').replace(/- Verify:.*\n/, '') })
  const result = spawnSync(process.execPath, [validator, path.join(bad, 'PROJECT_AUDIT.md')], { encoding: 'utf8' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /REPORT004 AUD-001 missing or empty field: Verify/)
  assert.match(result.stderr, /REPORT005/)
})

test('rejects a heading-only report that pretends to be complete', () => {
  const sections = ['Audit metadata', 'Executive summary', 'Detected systems and architecture', 'Findings', 'Dependency vulnerabilities', 'Error handling and resilience', 'Target architecture', 'Replacement and change matrix', 'Remediation roadmap', 'Verification plan', 'Coverage gaps / Needs verification', 'Appendix: commands and sources']
  const root = fixture({ 'PROJECT_AUDIT.md': ['# Project Audit', ...sections.flatMap((section) => [`## ${section}`, 'None'])].join('\n') })
  const result = spawnSync(process.execPath, [validator, path.join(root, 'PROJECT_AUDIT.md')], { encoding: 'utf8' })
  assert.equal(result.status, 1)
  for (const rule of ['REPORT009', 'REPORT010', 'REPORT013', 'REPORT014', 'REPORT017', 'REPORT020']) assert.match(result.stderr, new RegExp(rule), `missing ${rule}`)
})

test('rejects reordered sections, invalid finding enums and incomplete advisories', () => {
  const sections = ['Executive summary', 'Audit metadata', 'Detected systems and architecture', 'Findings', 'Dependency vulnerabilities', 'Error handling and resilience', 'Target architecture', 'Replacement and change matrix', 'Remediation roadmap', 'Verification plan', 'Coverage gaps / Needs verification', 'Appendix: commands and sources']
  const generic = 'This section contains concrete audit evidence and actionable verification details.'
  const bodies = {
    'Audit metadata': '- Repository: fixture\n- Scope: all\n- Commit/worktree: abc clean\n- Timestamp/timezone: 2026-08-11T12:00:00Z UTC\n- Roles: security\n- Package managers: npm\n- Advisory status: checked',
    Findings: '### AUD-001 — [high] Bad enum\n- Boundary: Service\n- Evidence: `src/a.ts:1` fact\n- Root cause: boundary leak\n- Impact: failure\n- Fix: move it\n- Target state: module\n- Verify: test\n- Owner: random',
    'Dependency vulnerabilities': 'Checked UTC: 2026-08-11T12:00:00Z\nSource: npm audit\n### DEP-001 — vulnerable package\n- Package: x',
    'Replacement and change matrix': '| Current | Problem | Replace/move/add | Target owner/layer | Prerequisite | Risk | Verification |',
    'Remediation roadmap': '### P0 Containment\nAUD-001 action\n### P1 Correctness\nAUD-001 action\n### P2 Architecture\nAUD-001 action\n### P3 Modernization\nAUD-001 action',
    'Verification plan': 'Command: `npm test` verifies the remediation without mutation.',
    'Appendix: commands and sources': 'Command: npm audit --json\nSource: https://example.test/advisory',
  }
  const root = fixture({ 'PROJECT_AUDIT.md': ['# Project Audit', ...sections.flatMap((section) => [`## ${section}`, bodies[section] ?? generic])].join('\n') })
  const result = spawnSync(process.execPath, [validator, path.join(root, 'PROJECT_AUDIT.md')], { encoding: 'utf8' })
  assert.equal(result.status, 1)
  for (const rule of ['REPORT008', 'REPORT011', 'REPORT012', 'REPORT016']) assert.match(result.stderr, new RegExp(rule), `missing ${rule}`)
})

test('does not satisfy the last finding with fields from later report sections', () => {
  const sections = ['Audit metadata', 'Executive summary', 'Detected systems and architecture', 'Findings', 'Dependency vulnerabilities', 'Error handling and resilience', 'Target architecture', 'Replacement and change matrix', 'Remediation roadmap', 'Verification plan', 'Coverage gaps / Needs verification', 'Appendix: commands and sources']
  const generic = 'This section contains concrete audit evidence and actionable verification details.'
  const bodies = {
    'Audit metadata': '- Repository: fixture\n- Scope: all\n- Commit/worktree: abc clean\n- Timestamp/timezone: 2026-08-11T12:00:00Z UTC\n- Roles: security\n- Package managers: npm\n- Advisory status: checked',
    Findings: '### AUD-001 — [high] Truncated finding\n- Boundary: Backend\n- Evidence: `src/a.ts:1` fact\n- Root cause: boundary leak\n- Impact: runtime failure',
    'Dependency vulnerabilities': 'Status: NOT VERIFIED\nSource: OSV advisory',
    'Target architecture': '- Fix: move the boundary\n- Target state: isolated module\n- Verify: run tests\n- Owner: backend\nThis later section must not complete an earlier finding.',
    'Replacement and change matrix': '| Current | Problem | Replace/move/add | Target owner/layer | Prerequisite | Risk | Verification |',
    'Remediation roadmap': '### P0 Containment\nAUD-001 action\n### P1 Correctness\nAUD-001 action\n### P2 Architecture\nAUD-001 action\n### P3 Modernization\nAUD-001 action',
    'Verification plan': 'Command: `npm test` verifies the remediation without mutation.',
    'Appendix: commands and sources': 'Command: npm audit --json\nSource: https://example.test/advisory',
  }
  const root = fixture({ 'PROJECT_AUDIT.md': ['# Project Audit', ...sections.flatMap((section) => [`## ${section}`, bodies[section] ?? generic])].join('\n') })
  const result = spawnSync(process.execPath, [validator, path.join(root, 'PROJECT_AUDIT.md')], { encoding: 'utf8' })
  assert.equal(result.status, 1)
  for (const field of ['Fix', 'Target state', 'Verify', 'Owner']) assert.match(result.stderr, new RegExp(`REPORT004 AUD-001 missing or empty field: ${field}`), `missing ${field}`)
})
