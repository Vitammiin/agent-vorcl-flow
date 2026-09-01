import fs from 'node:fs'
import path from 'node:path'
import { sha256 } from '../../shared/runtime-utils.mjs'

const frontmatter = (source) => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  return Object.fromEntries(match[1].split(/\r?\n/).map((line) => line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)).filter(Boolean).map((item) => [item[1], item[2].replace(/^['"]|['"]$/g, '')]))
}

const inlineList = (value) => String(value ?? '').trim().replace(/^\[/, '').replace(/\]$/, '').split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)

export class RegistryService {
  constructor(packageRoot) { this.packageRoot = packageRoot; this.registry = this.#compile() }
  list() { return structuredClone(this.registry) }
  route(goal) {
    const terms = new Set(goal.toLowerCase().split(/[^a-z0-9а-яё+-]+/u).filter((term) => term.length > 2))
    const ranked = this.registry.roles.map((role) => {
      const haystack = `${role.id} ${role.route} ${role.owns}`.toLowerCase()
      const score = [...terms].reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0)
      return { role, score }
    }).sort((a, b) => b.score - a.score || a.role.id.localeCompare(b.role.id))
    const winner = ranked[0]?.score ? ranked[0].role : this.registry.roles.find((role) => role.id === 'architect')
    return { ownerRole: winner.id, supportingSkills: winner.requiredSkills, checkerRole: winner.checker, confidence: ranked[0]?.score ? Math.min(0.95, 0.45 + ranked[0].score * 0.1) : 0.35 }
  }

  #compile() {
    const source = JSON.parse(fs.readFileSync(path.join(this.packageRoot, 'scripts', 'roles.json'), 'utf8'))
    if (source.schemaVersion !== 2) throw new Error('roles.json schemaVersion 2 is required')
    const skills = fs.readdirSync(path.join(this.packageRoot, 'skills'), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => {
      const file = path.join(this.packageRoot, 'skills', entry.name, 'SKILL.md')
      const body = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
      return { id: entry.name, origin: 'builtin', sha256: sha256(body), ...frontmatter(body) }
    })
    const roleSkills = new Map()
    for (const role of source.roles) {
      const file = path.join(this.packageRoot, 'agents', `${role.id}.md`)
      const meta = fs.existsSync(file) ? frontmatter(fs.readFileSync(file, 'utf8')) : {}
      roleSkills.set(role.id, inlineList(meta.skills))
    }
    const commands = []
    const visit = (directory, prefix = '') => {
      for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const id = prefix ? `${prefix}:${entry.name.replace(/\.md$/, '')}` : entry.name.replace(/\.md$/, '')
        if (entry.isDirectory()) visit(path.join(directory, entry.name), id)
        else if (entry.name.endsWith('.md')) commands.push(id)
      }
    }
    visit(path.join(this.packageRoot, 'commands'))
    const roles = source.roles.map((role) => ({ ...source.defaults, ...role, requiredSkills: roleSkills.get(role.id) ?? [] }))
    return { schemaVersion: 2, generatedAt: new Date().toISOString(), roles, skills, commands: commands.sort() }
  }
}
