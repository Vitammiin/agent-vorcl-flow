#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const output = path.join(root, 'skills/workspace-capability-routing/references/capability-catalog.json')
const write = process.argv.includes('--write')

function frontmatter(file) {
  const source = fs.readFileSync(file, 'utf8')
  if (!source.startsWith('---\n')) throw new Error(`missing frontmatter: ${path.relative(root, file)}`)
  const end = source.indexOf('\n---', 4)
  if (end < 0) throw new Error(`unterminated frontmatter: ${path.relative(root, file)}`)
  const lines = source.slice(4, end).split('\n')
  const data = Object.create(null)
  for (let index = 0; index < lines.length; index++) {
    const match = lines[index].match(/^([A-Za-z][\w-]*):(?:\s+(.*))?$/)
    if (!match) continue
    const key = match[1]
    const raw = match[2] ?? ''
    if (raw === '>' || raw === '>-' || raw === '|' || raw === '|-') {
      const block = []
      while (index + 1 < lines.length && /^\s+/.test(lines[index + 1])) block.push(lines[++index].trim())
      data[key] = block.join(raw.startsWith('>') ? ' ' : '\n').trim()
    } else if (raw.startsWith('"')) {
      data[key] = JSON.parse(raw)
    } else data[key] = raw.trim()
  }
  return data
}

function agentSkills(roleId) {
  const source = fs.readFileSync(path.join(root, `agents/${roleId}.md`), 'utf8')
  const block = source.match(/^skills:\s*\[([^\]]*)\]\s*$/m)?.[1] ?? ''
  return block.split(',').map((value) => value.trim()).filter(Boolean)
}

function buildCatalog() {
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'scripts/roles.json'), 'utf8'))
  const roles = registry.roles.map((role) => ({ ...role, skills: agentSkills(role.id) }))
  const skills = fs.readdirSync(path.join(root, 'skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, 'skills', entry.name, 'SKILL.md')))
    .map((entry) => frontmatter(path.join(root, 'skills', entry.name, 'SKILL.md')))
    .map(({ name, description }) => ({ name, description }))
    .sort((a, b) => a.name.localeCompare(b.name))
  return { schemaVersion: 1, generatedFrom: ['scripts/roles.json', 'agents/*.md', 'skills/*/SKILL.md'], roles, skills }
}

const rendered = `${JSON.stringify(buildCatalog(), null, 2)}\n`
if (write) {
  fs.mkdirSync(path.dirname(output), { recursive: true })
  fs.writeFileSync(output, rendered)
  process.stdout.write(`Capability catalog generated: ${path.relative(root, output)}\n`)
} else if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== rendered) {
  process.stderr.write(`Capability catalog drift: run node scripts/generate-capability-catalog.mjs --write\n`)
  process.exitCode = 1
} else process.stdout.write('Capability catalog verified\n')
