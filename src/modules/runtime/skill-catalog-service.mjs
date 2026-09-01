import fs from 'node:fs'
import path from 'node:path'
import { readJson, sha256, writeJsonAtomic } from '../../shared/runtime-utils.mjs'

export class SkillCatalogService {
  constructor(packageRoot, home) {
    this.packageRoot = packageRoot
    this.home = home
    this.skillsRoot = path.join(home, 'skills')
    this.ledgerFile = path.join(home, 'skill-ledger.json')
    fs.mkdirSync(this.skillsRoot, { recursive: true })
  }
  list() {
    const ledger = readJson(this.ledgerFile, { version: 1, skills: {} })
    return Object.entries(ledger.skills).map(([id, record]) => ({ id, ...record }))
  }
  read(skillId) {
    const file = path.join(this.skillsRoot, skillId, 'SKILL.md')
    if (!fs.existsSync(file)) throw new Error(`Skill is not installed: ${skillId}`)
    return { skillId, content: fs.readFileSync(file, 'utf8') }
  }
  syncBuiltin(skillId) {
    if (!/^[a-z0-9][a-z0-9-]*$/.test(skillId)) throw new Error('Unsafe skill ID')
    const source = path.join(this.packageRoot, 'skills', skillId)
    if (!fs.existsSync(source)) throw new Error(`Unknown builtin skill: ${skillId}`)
    const sourceBody = fs.readFileSync(path.join(source, 'SKILL.md'), 'utf8')
    const sourceHash = sha256(sourceBody)
    const ledger = readJson(this.ledgerFile, { version: 1, skills: {} })
    const existing = ledger.skills[skillId]
    const target = path.join(this.skillsRoot, skillId)
    if (existing && fs.existsSync(path.join(target, 'SKILL.md'))) {
      const localHash = sha256(fs.readFileSync(path.join(target, 'SKILL.md'), 'utf8'))
      if (localHash !== existing.installedHash) {
        ledger.skills[skillId] = { ...existing, origin: 'local_modified', localHash, updateAvailable: existing.sourceHash !== sourceHash }
        writeJsonAtomic(this.ledgerFile, ledger)
        return { skillId, status: 'preserved_local_modified' }
      }
    }
    const staging = path.join(this.skillsRoot, `.${skillId}.${process.pid}.staging`)
    fs.cpSync(source, staging, { recursive: true })
    if (fs.existsSync(target)) fs.renameSync(target, `${target}.previous`)
    fs.renameSync(staging, target)
    if (fs.existsSync(`${target}.previous`)) fs.rmSync(`${target}.previous`, { recursive: true })
    ledger.skills[skillId] = { origin: 'builtin', sourceHash, installedHash: sourceHash, installedAt: new Date().toISOString(), updateAvailable: false }
    writeJsonAtomic(this.ledgerFile, ledger)
    return { skillId, status: 'installed', sha256: sourceHash }
  }
}
