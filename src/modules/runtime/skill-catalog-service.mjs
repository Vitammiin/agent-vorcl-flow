import fs from 'node:fs'
import path from 'node:path'
import { sha256 } from '../../shared/runtime-utils.mjs'

// Runtime is a reader. Only the standalone installer owns installed skill updates.
export class SkillCatalogService {
  constructor(packageRoot) { this.skillsRoot = path.join(packageRoot, 'skills') }
  list() {
    return fs.readdirSync(this.skillsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(this.skillsRoot, entry.name, 'SKILL.md')))
      .map((entry) => ({ id: entry.name, origin: 'builtin', sha256: sha256(this.read(entry.name).content) }))
  }
  read(skillId) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(skillId)) throw new Error('Unsafe skill ID')
    const file = path.join(this.skillsRoot, skillId, 'SKILL.md')
    if (!fs.existsSync(file)) throw new Error(`Unknown builtin skill: ${skillId}`)
    return { skillId, content: fs.readFileSync(file, 'utf8') }
  }
}
