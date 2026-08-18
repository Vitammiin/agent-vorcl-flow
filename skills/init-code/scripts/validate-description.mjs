#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const REQUIRED = ['Purpose', 'How to Run', 'Technology', 'Structure', 'Runtime and Data Flow', 'Testing', 'Configuration and Integrations', 'Evidence and Unknowns']

function fail(messages) {
  for (const message of messages) process.stderr.write(`INITCODE: ${message}\n`)
  process.exitCode = 1
}

const target = process.argv[2]
if (!target) {
  process.stderr.write('Usage: validate-description.mjs <PROJECT_DESCRIPTION.md>\n')
  process.exit(2)
}

const file = path.resolve(target)
if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
  process.stderr.write(`Description not found: ${target}\n`)
  process.exit(2)
}

const source = fs.readFileSync(file, 'utf8')
const errors = []
if (!/^# Project Description\s*$/m.test(source)) errors.push('missing `# Project Description` title')
const headings = [...source.matchAll(/^## (.+)\s*$/gm)].map((match) => match[1].trim())
if (JSON.stringify(headings) !== JSON.stringify(REQUIRED)) errors.push(`sections must appear exactly as: ${REQUIRED.join(' -> ')}`)
for (const heading of REQUIRED) {
  const start = source.indexOf(`## ${heading}`)
  const next = start < 0 ? -1 : source.indexOf('\n## ', start + 3)
  const body = start < 0 ? '' : source.slice(start + heading.length + 4, next < 0 ? source.length : next).trim()
  if (body.length < 20) errors.push(`${heading}: section is empty or too thin`)
}
const evidence = unique([...source.matchAll(/`([^`\n]+(?:\/[^`\n]+|\.[A-Za-z0-9_-]+))`/g)].map((match) => match[1]).filter((value) => !value.includes(' ')))
if (evidence.length < 5) errors.push(`need at least 5 distinct file-path evidence citations; found ${evidence.length}`)
if (!/(?:Unknown|Not detected|Coverage gap)/i.test(source)) errors.push('Evidence and Unknowns must state unknowns or explicitly say none were detected')
if (/(?:API_KEY|TOKEN|SECRET|PASSWORD|PRIVATE_KEY)\s*=\s*[^\s`<][^\s`]*/i.test(source)) errors.push('possible secret value copied into description')

if (errors.length) fail(errors)
else process.stdout.write(`INITCODE OK: ${path.basename(file)}; evidence=${evidence.length}; sections=${REQUIRED.length}\n`)

function unique(values) { return [...new Set(values)] }
