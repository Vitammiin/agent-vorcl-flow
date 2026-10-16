// Installation metadata comes from package files, never client configuration or
// prose references. A standalone skill deliberately does not pull in role hints.
import fs from 'node:fs'
import path from 'node:path'

export const CORE_SKILLS = Object.freeze([
  'vorcl', 'workflow', 'workspace-capability-routing', 'init-code', 'project-audit',
  'testing', 'testing-strategy',
])
// These are executable cross-skill imports, not suggestions found in prompts.
export const TECHNICAL_DEPENDENCIES = Object.freeze({ 'init-code': Object.freeze(['project-audit']) })

export class ArgumentError extends Error {}

const NAME = /^[a-z0-9][a-z0-9-]*$/
const SWITCHES = new Set([
  '--claude', '--codex', '--cursor', '--kimi', '--all', '--dry-run', '--check-legacy',
  '--help', '-h', '--banner-only', '--list', '--check', '--json',
])

export function parseOptions(args) {
  const switches = new Set()
  const roles = []
  const skills = []
  for (let index = 0; index < args.length; index++) {
    const arg = args[index]
    if (arg === '--role' || arg === '--skill') {
      const name = args[++index]
      if (!name || !NAME.test(name)) throw new ArgumentError(`${arg} requires a skill or role name (lowercase letters, digits and hyphens)`)
      ;(arg === '--role' ? roles : skills).push(name)
    } else if (SWITCHES.has(arg)) switches.add(arg)
    else throw new ArgumentError(`Unknown option: ${arg}. Use --help.`)
  }
  const adapters = ['claude', 'codex', 'cursor', 'kimi'].filter((adapter) => switches.has('--all') || switches.has(`--${adapter}`))
  const list = switches.has('--list')
  const check = switches.has('--check')
  const help = switches.has('--help') || switches.has('-h')
  const banner = switches.has('--banner-only')
  if (list && check) throw new ArgumentError('--list and --check are separate read-only commands')
  if ((list || check) && (switches.has('--dry-run') || switches.has('--check-legacy') || banner)) {
    throw new ArgumentError('--list/--check cannot be combined with --dry-run, --check-legacy or --banner-only')
  }
  if (switches.has('--json') && !list && !check) throw new ArgumentError('--json requires --list or --check')
  if (!help && !banner && !list && !adapters.length && (check || roles.length || skills.length)) {
    throw new ArgumentError('Select an adapter for installation or --check; use --list for discovery')
  }
  return { adapters, roles: [...new Set(roles)], skills: [...new Set(skills)], list, check, help, banner,
    json: switches.has('--json'), dryRun: switches.has('--dry-run'), legacy: switches.has('--check-legacy') }
}

function frontmatter(file) {
  const source = fs.readFileSync(file, 'utf8')
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)
  if (!match) throw new Error(`Invalid skill frontmatter: ${file}`)
  const lines = match[1].split(/\r?\n/)
  const fields = Object.create(null)
  for (let index = 0; index < lines.length; index++) {
    const field = lines[index].match(/^(name|description):\s*(.*)$/)
    if (!field) continue
    const [, name, raw] = field
    if (/^[>|]-?$/.test(raw)) {
      const block = []
      while (index + 1 < lines.length && /^\s+/.test(lines[index + 1])) block.push(lines[++index].trim())
      fields[name] = block.join(' ')
    } else if (raw.startsWith('"')) fields[name] = JSON.parse(raw)
    else if (raw.startsWith("'") && raw.endsWith("'")) fields[name] = raw.slice(1, -1).replaceAll("''", "'")
    else fields[name] = raw.trim()
  }
  if (typeof fields.name !== 'string' || !NAME.test(fields.name) || typeof fields.description !== 'string' || !fields.description) {
    throw new Error(`Missing skill name/description: ${file}`)
  }
  return fields
}

export function buildInstallCatalog(root) {
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'scripts/roles.json'), 'utf8'))
  const roleIds = new Set(registry.roles.map(({ id }) => id))
  if (roleIds.size !== registry.roles.length || [...roleIds].some((id) => !NAME.test(id))) throw new Error('Invalid role registry')
  const commands = new Map()
  const commandsRoot = path.join(root, 'commands')
  if (fs.existsSync(commandsRoot)) {
    for (const entry of fs.readdirSync(commandsRoot, { withFileTypes: true })) {
      if (entry.isFile() && entry.name.endsWith('.md')) commands.set(entry.name.slice(0, -3), null)
    }
  }
  const roles = registry.roles.map((role) => {
    const dir = path.join(root, 'commands', role.id)
    const names = fs.existsSync(dir) ? fs.readdirSync(dir).filter((file) => file.endsWith('.md')).map((file) => `${role.id}-${file.slice(0, -3)}`).sort() : []
    for (const name of names) commands.set(name, role.id)
    const hints = role.skillHints ?? []
    if (!Array.isArray(hints) || hints.some((name) => typeof name !== 'string' || !NAME.test(name))) throw new Error(`Invalid skill hints for role: ${role.id}`)
    return { name: role.id, description: role.route ?? role.owns ?? role.id, commands: names,
      skillHints: [...hints], readonly: role.readonly === true,
      nativeAgents: ['claude', 'cursor', 'kimi'].filter((adapter) => adapter === 'kimi'
        ? ['yaml', 'yml'].some((extension) => fs.existsSync(path.join(root, 'kimi/agents', `${role.id}.${extension}`)))
        : fs.existsSync(path.join(root, 'agents', `${role.id}.md`))) }
  }).sort((a, b) => a.name.localeCompare(b.name, 'en'))
  const skills = fs.readdirSync(path.join(root, 'codex/skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const fields = frontmatter(path.join(root, 'codex/skills', entry.name, 'SKILL.md'))
      if (fields.name !== entry.name) throw new Error(`Skill name does not match directory: ${entry.name}`)
      // Match generate-codex-skills precedence: commands override roles/domains.
      return { ...fields, kind: commands.has(entry.name) ? 'command' : roleIds.has(entry.name) ? 'role' : 'domain',
        ...(commands.get(entry.name) ? { role: commands.get(entry.name) } : {}) }
    }).sort((a, b) => a.name.localeCompare(b.name, 'en'))
  return { schemaVersion: 1,
    semantics: {
      skill: 'Standalone skill plus its packaged canonical assets and explicit technical dependencies; no role bundle, hint expansion or native agents.',
      role: 'Core skills, selected role and commands, and direct skill hints only. Native agents are limited to selected roles and the testing Checker where the adapter provides them.',
      taskMaster: 'Task Master is optional and is never included in a filtered bundle unless explicitly selected with --skill task-master.',
    }, coreSkills: [...CORE_SKILLS], technicalDependencies: TECHNICAL_DEPENDENCIES, roles, skills }
}

export function selectComponents(catalog, options) {
  const knownSkills = new Set(catalog.skills.map(({ name }) => name))
  const knownRoles = new Map(catalog.roles.map((role) => [role.name, role]))
  for (const name of options.skills) if (!knownSkills.has(name)) throw new ArgumentError(`Unknown skill: ${name}. Use --list.`)
  for (const name of options.roles) if (!knownRoles.has(name)) throw new ArgumentError(`Unknown role: ${name}. Use --list.`)
  const filtered = options.skills.length > 0 || options.roles.length > 0
  const selected = new Set(filtered ? options.skills : knownSkills)
  const agentRoles = new Set(filtered ? [] : knownRoles.keys())
  const reasons = Object.create(null)
  const add = (name, reason) => {
    if (name === 'task-master' && !options.skills.includes(name)) return
    if (!knownSkills.has(name)) throw new Error(`Package is missing required skill ${name} (${reason})`)
    selected.add(name)
    ;(reasons[name] ??= []).push(reason)
  }
  for (const name of options.skills) add(name, 'explicit skill')
  for (const name of options.roles) {
    const role = knownRoles.get(name)
    agentRoles.add(name)
    agentRoles.add('testing')
    for (const skill of CORE_SKILLS) add(skill, 'role core')
    add(name, `role ${name}`)
    for (const skill of role.commands) add(skill, `command of ${name}`)
    for (const skill of role.skillHints) add(skill, `direct hint of ${name}`)
  }
  if (filtered) {
    for (const name of selected) {
      for (const dependency of TECHNICAL_DEPENDENCIES[name] ?? []) add(dependency, `technical dependency of ${name}`)
    }
  }
  return { mode: filtered ? 'filtered' : 'all', requestedRoles: options.roles, requestedSkills: options.skills,
    skills: [...selected].sort(), agentRoles: [...agentRoles].sort(), reasons }
}
