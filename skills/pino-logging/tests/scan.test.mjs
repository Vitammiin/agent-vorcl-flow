import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { formatText, scanProject, scanSource } from '../scripts/scan.mjs'

const scanner = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../scripts/scan.mjs')

/**
 * @param {Record<string, string>} files
 * @returns {string}
 */
function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pino-logging-'))
  for (const [relative, content] of Object.entries(files)) {
    const file = path.join(root, relative)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, content)
  }
  return root
}

test('accepts a modular root logger and module child logger', () => {
  const root = fixture({
    'src/infrastructure/logging/logger.ts': [
      "import pino from 'pino'",
      'export const logger = pino({',
      "  level: process.env.LOG_LEVEL ?? 'info',",
      "  redact: { paths: ['password', '*.token'], censor: '[REDACTED]' },",
      "  transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,",
      '})',
      '',
    ].join('\n'),
    'src/modules/debtors/debtor.service.ts': [
      "import { createModuleLogger } from '../../infrastructure/logging'",
      "const log = createModuleLogger('debtors', 'DebtorService')",
      "export function createDebtor(debtorId: string): void {",
      "  log.info({ event: 'debtor.created', debtorId }, 'Debtor created')",
      '}',
      '',
    ].join('\n'),
  })
  const findings = scanProject(root)
  assert.deepEqual(findings, [])
  assert.equal(formatText(findings), 'pino-logging: clean\n')
})

test('flags local pino(), console, interpolated message, err.message and secrets', () => {
  const source = [
    "import pino from 'pino'",
    'const logger = pino()',
    "logger.info(`User ${userId} updated`)",
    'logger.error(err.message)',
    "logger.info({ password: body.password, token: body.token }, 'signup')",
    "logger.info({ body: req.body }, 'payload')",
    "console.log('debug')",
    '',
  ].join('\n')
  const rules = scanSource('src/modules/users/user.service.ts', source).map((item) => item.rule)
  assert.ok(rules.includes('pino.local-instance'))
  assert.ok(rules.includes('pino.interpolated-message'))
  assert.ok(rules.includes('pino.error-as-message'))
  assert.ok(rules.includes('pino.secret-field'))
  assert.ok(rules.includes('pino.request-body'))
  assert.ok(rules.includes('pino.console-log'))
})

test('flags missing redact, unconditional pretty, direct Loki and client import', () => {
  const root = fixture({
    'src/infrastructure/logging/logger.ts': [
      "import pino from 'pino'",
      "export const logger = pino({ transport: { target: 'pino-pretty' } })",
      '',
    ].join('\n'),
    'src/infrastructure/logging/sink.ts': "export const url = 'https://loki.example/loki/api/v1/push'\n",
    'src/app/ui/panel.tsx': "'use client'\nimport pino from 'pino'\nexport const log = pino()\n",
  })
  const rules = scanProject(root).map((item) => item.rule)
  assert.ok(rules.includes('pino.missing-redact'))
  assert.ok(rules.includes('pino.pretty-unconditional'))
  assert.ok(rules.includes('pino.direct-collector'))
  assert.ok(rules.includes('pino.client-import'))
})

test('CLI json and hook stay deterministic and fail-open', () => {
  const root = fixture({
    'src/modules/pay.ts': "console.info('x')\n",
  })
  const json = spawnSync(process.execPath, [scanner, '--root', root, '--format', 'json'], { encoding: 'utf8' })
  assert.equal(json.status, 1)
  const first = JSON.parse(json.stdout)
  const second = spawnSync(process.execPath, [scanner, '--root', root, '--format', 'json'], { encoding: 'utf8' })
  assert.equal(second.stdout, json.stdout)
  assert.equal(first.findings[0].rule, 'pino.console-log')
  const hook = spawnSync(process.execPath, [scanner, '--hook'], {
    encoding: 'utf8',
    cwd: root,
    input: JSON.stringify({ tool_input: { file_path: path.join(root, 'src/modules/pay.ts') }, cwd: root }),
  })
  assert.equal(hook.status, 0)
  const payload = JSON.parse(hook.stdout)
  assert.match(payload.hookSpecificOutput.additionalContext, /pino-logging guard/)
  const cleanHook = spawnSync(process.execPath, [scanner, '--hook'], {
    encoding: 'utf8',
    input: '{',
  })
  assert.equal(cleanHook.status, 0)
  assert.equal(cleanHook.stdout, '')
})
