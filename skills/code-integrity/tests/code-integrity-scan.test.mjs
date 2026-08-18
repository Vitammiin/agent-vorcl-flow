import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { auditPath } from '../scripts/code-integrity-scan.mjs'

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'code-integrity-'))
  for (const [relative, content] of Object.entries(files)) {
    const file = path.join(root, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }
  return root
}

test('finds frontend hardcode and production mock imports while suppressing tests', (t) => {
  const root = fixture({
    'package.json': '{"dependencies":{"next-intl":"1.0.0"}}',
    'src/frontend/Profile.tsx': 'export const Profile = () => <h1>Welcome back</h1>\n',
    'src/frontend/bootstrap.ts': "import { setupWorker } from 'msw'\nsetupWorker()\n",
    'src/frontend/Profile.test.tsx': 'expect(screen.getByText("Welcome back")).toBeTruthy()\n',
  })
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const report = auditPath(root)
  assert.ok(report.findings.some((item) => item.id === 'hardcode.rendered-text' && item.file.endsWith('Profile.tsx')))
  assert.ok(report.findings.some((item) => item.id === 'mocks.framework-import' && item.file.endsWith('bootstrap.ts')))
  assert.equal(report.findings.some((item) => item.file.includes('.test.')), false)
  assert.equal(report.summary.suppressedTestFiles, 1)
})

test('finds backend placeholder/static responses across Python, Go, and Java', (t) => {
  const root = fixture({
    'backend/python/app.py': 'return jsonify({"email": "test@test.com"})\n',
    'backend/go/handler.go': 'var fakeUsers = []User{{Name: "Demo"}}\n',
    'backend/java/UserController.java': 'return ResponseEntity.ok({name: "Demo User"});\n',
  })
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const report = auditPath(root)
  assert.deepEqual(report.languages, ['go', 'java/kotlin', 'python'])
  assert.ok(report.findings.some((item) => item.id === 'mocks.placeholder-data' && item.language === 'python'))
  assert.ok(report.findings.some((item) => item.id === 'mocks.suspicious-identifier' && item.language === 'go'))
  assert.ok(report.findings.some((item) => item.id === 'mocks.static-api-response' && item.language === 'java/kotlin'))
})

test('does not treat translation calls, routes, generated files, or test fixtures as production findings', (t) => {
  const root = fixture({
    'src/frontend/Page.tsx': 'export const Page = () => <h1>{t("page.title")}</h1>\n',
    'src/backend/routes.ts': 'router.get("/users", handler)\n',
    'src/generated/client.ts': '// @generated\nexport const message = "Generated client"\n',
    'fixtures/users.py': 'fake_user = {"email": "test@test.com"}\n',
  })
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const report = auditPath(root)
  assert.equal(report.findings.length, 0)
  assert.equal(report.summary.generatedFiles, 1)
  assert.equal(report.summary.suppressedTestFiles, 1)
})

test('can include test candidates with an explicit legitimate-test disposition', (t) => {
  const root = fixture({ 'tests/api_test.py': 'fake_user = {"email": "test@test.com"}\n' })
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const report = auditPath(root, { mode: 'mocks', includeTest: true })
  assert.ok(report.findings.length > 0)
  assert.ok(report.findings.every((item) => item.disposition === 'legitimate-test'))
})

test('flags backend database-owned values hidden in constants, collections, and parameters', (t) => {
  const root = fixture({
    'src/backend/billing.ts': [
      "const DEFAULT_PLAN = 'pro'",
      "const PRODUCTS = [{ id: 'starter', price: 19 }]",
      "export function subscribe(accountId: string, plan = 'starter') { return { accountId, plan } }",
      "subscribe({ accountId, tier: 'enterprise' })",
      "const HTTP_STATUS_OK = 200",
    ].join('\n'),
    'src/backend/accounts.py': 'def create_account(role="admin"):\n    return role\n',
  })
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const report = auditPath(root, { mode: 'hardcode' })
  assert.ok(report.findings.some((item) => item.id === 'hardcode.database-owned-constant' && item.evidence.includes('DEFAULT_PLAN')))
  assert.ok(report.findings.some((item) => item.id === 'hardcode.database-owned-collection' && item.evidence.includes('PRODUCTS')))
  assert.ok(report.findings.some((item) => item.id === 'hardcode.database-owned-parameter' && item.evidence.includes("plan = 'starter'")))
  assert.ok(report.findings.some((item) => item.id === 'hardcode.database-owned-parameter' && item.evidence.includes("tier: 'enterprise'")))
  assert.ok(report.findings.some((item) => item.id === 'hardcode.database-owned-parameter' && item.language === 'python'))
  assert.equal(report.findings.some((item) => item.evidence.includes('HTTP_STATUS_OK')), false)
})
