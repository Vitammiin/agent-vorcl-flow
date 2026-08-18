#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

const limits = { files: 850, unpackedSize: 35_000_000 }
const cache = fs.mkdtempSync(path.join(os.tmpdir(), 'avf-npm-pack-'))

try {
  const result = spawnSync('npm', ['pack', '--dry-run', '--json'], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env, npm_config_cache: cache },
  })
  if (result.status !== 0) {
    process.stderr.write(result.stderr || result.stdout)
    process.exit(result.status || 1)
  }
  const pack = JSON.parse(result.stdout)[0]
  const duplicateRuntime = pack.files.filter(({ path: file }) =>
    /^codex\/skills\/.*\/(?:agents|assets|built-in-skills|references|scripts|starter-components|tests)\//.test(file),
  )
  const errors = []
  if (pack.entryCount > limits.files) errors.push(`${pack.entryCount} files exceed budget ${limits.files}`)
  if (pack.unpackedSize > limits.unpackedSize) errors.push(`${pack.unpackedSize} unpacked bytes exceed budget ${limits.unpackedSize}`)
  if (duplicateRuntime.length) errors.push(`${duplicateRuntime.length} duplicated Codex runtime files are packaged`)
  if (errors.length) {
    for (const error of errors) process.stderr.write(`package-budget: ${error}\n`)
    process.exit(1)
  }
  process.stdout.write(`package-budget: ${pack.entryCount} files, ${pack.unpackedSize} unpacked bytes, ${pack.size} tarball bytes\n`)
} finally {
  fs.rmSync(cache, { recursive: true, force: true })
}
