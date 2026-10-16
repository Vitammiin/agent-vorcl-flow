#!/usr/bin/env node
// Local, capability-neutral installation. The installer owns only the components
// recorded below; client settings, MCP connections, credentials and task stores
// are always owned by the user.
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ArgumentError, buildInstallCatalog, parseOptions, selectComponents } from '../scripts/install-catalog.mjs'

const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const MANIFEST = '.agent-vorcl-flow-install.json'
const SKILL_DESCRIPTION_MARK_S = '<!-- >>> agent-vorcl-flow project-description >>>'
const SKILL_DESCRIPTION_CONTRACT = `${SKILL_DESCRIPTION_MARK_S}
## Project description maintenance

If this skill changes code, configuration, tests, schemas, deployment, environment, integrations, runtime, or data state and \`PROJECT_DESCRIPTION.md\` exists in task scope: read it before the change. Afterward use \`$init-code\`'s \`check-impact.mjs\` with this task's changed paths and any \`--external\` mutations. Update only materially affected sections, validate the document, and never create it automatically when absent. A proven stale description blocks completion. Read-only skills and Checker report drift but do not edit the document.
<!-- <<< agent-vorcl-flow project-description <<< -->`

const HELP = `Agent-Vorcl-Flow — local skills and agents installer

Usage: agent-vorcl-flow <adapter...> [--role NAME | --skill NAME] [--dry-run]
       agent-vorcl-flow --list [--json]
       agent-vorcl-flow <adapter...> --check [--json]
  --claude       Install skills and avf-* agents under CLAUDE_HOME or ~/.claude
  --codex        Install skills under AVF_SKILLS_DIR or ~/.agents/skills
  --cursor       Install skills and avf-* agents under CURSOR_HOME or ~/.cursor
  --kimi         Install skills and avf-* agents under KIMI_HOME or ~/.kimi
  --all          Explicitly select all four adapters
  --role NAME    Select a role bundle and core workflow (repeatable)
  --skill NAME   Select a standalone skill with its assets (repeatable)
  --list         List packaged skills and role bundles; no installation
  --check        Check selected components against ownership and package hashes
  --json         Machine-readable --list or --check output
  --dry-run      Preview the installation without writing any files
  --check-legacy Report possible legacy AVF settings without modifying them
  --help, -h     Show this help without writing any files
  --banner-only  Print the package name without installing

No adapters selected: show help. Repeating an installation is safe: existing
unowned components and user-modified AVF components are preserved. Only unchanged
components recorded in ${MANIFEST} may be updated.
Without filters, all packaged skills and available native agents are installed.
Filters combine by union. Role bundles include core skills, role commands and
direct hints, plus selected native agents and the testing Checker where available.
Standalone skills include only explicit technical dependencies and no native agents. Task Master
is excluded from filtered bundles unless --skill task-master is explicit.
Check exits 0 when current, 1 for attention, and 2 for invalid arguments.

The installer never registers MCP servers, edits client settings/configuration,
installs services/hooks, creates credentials, or initializes Task Master.
Legacy installations are not removed automatically; use --check-legacy to inspect.
Path overrides must be absolute. No external commands or downloads are run.
`

const args = process.argv.slice(2)
let options
try { options = parseOptions(args) }
catch (error) { console.error(error.message); process.exit(2) }
if (options.help) {
  console.log(HELP)
  process.exit(0)
}
if (options.banner) {
  console.log('Agent-Vorcl-Flow — local skills and agents')
  process.exit(0)
}
if (Number(process.versions.node.split('.')[0]) < 20) {
  console.error(`Node.js >= 20 is required; found ${process.versions.node}.`)
  process.exit(1)
}

const dryRun = options.dryRun
const selected = options.adapters
const log = (message) => console.log(message)
const warn = (message) => console.error(`Preserved: ${message}`)

function location(variable, fallback) {
  const result = process.env[variable] || fallback
  if (!path.isAbsolute(result)) throw new Error(`${variable} must be an absolute path`)
  return path.resolve(result)
}

function exists(file) {
  try { fs.lstatSync(file); return true }
  catch (error) { if (error.code === 'ENOENT') return false; throw error }
}

// Never follow a destination symlink, including ancestors and broken links.
function assertSafePath(destination) {
  let current = path.resolve(destination)
  while (true) {
    if (exists(current) && fs.lstatSync(current).isSymbolicLink()) throw new Error(`refusing symbolic-link destination: ${current}`)
    const parent = path.dirname(current)
    if (parent === current) return
    current = parent
  }
}

function injectProjectDescriptionContract(source, name) {
  if (source.includes(SKILL_DESCRIPTION_MARK_S)) return source
  const frontmatter = source.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/)
  if (!frontmatter) throw new Error(`Invalid SKILL.md frontmatter: ${name}`)
  const offset = frontmatter[0].length
  return `${source.slice(0, offset)}\n${SKILL_DESCRIPTION_CONTRACT}\n${source.slice(offset)}`
}

// Represent each directory as files + modes. Empty directories are included so
// locally added content is detected before any managed component is replaced.
function collectFiles(source, prefix = '', result = new Map()) {
  const stat = fs.lstatSync(source)
  if (stat.isSymbolicLink() || (!stat.isFile() && !stat.isDirectory())) throw new Error(`unsupported file type: ${source}`)
  if (stat.isFile()) result.set(prefix, { type: 'file', mode: stat.mode & 0o777, data: fs.readFileSync(source) })
  else {
    result.set(prefix, { type: 'directory', mode: stat.mode & 0o777 })
    for (const entry of fs.readdirSync(source).sort()) collectFiles(path.join(source, entry), prefix ? `${prefix}/${entry}` : entry, result)
  }
  return result
}

function digest(files) {
  const hash = createHash('sha256')
  for (const [name, entry] of [...files].sort(([a], [b]) => a.localeCompare(b, 'en'))) {
    hash.update(JSON.stringify([name, entry.type, entry.mode, entry.data?.length ?? 0]))
    if (entry.data) hash.update(entry.data)
  }
  return hash.digest('hex')
}

function skillFiles(name) {
  const files = collectFiles(path.join(PKG_ROOT, 'codex', 'skills', name))
  const canonical = path.join(PKG_ROOT, 'skills', name)
  if (exists(canonical)) {
    for (const entry of fs.readdirSync(canonical).sort()) {
      if (entry === 'SKILL.md' || entry === 'tests') continue
      collectFiles(path.join(canonical, entry), entry, files)
    }
  }
  const prompt = files.get('SKILL.md')
  if (!prompt || prompt.type !== 'file') throw new Error(`Missing SKILL.md: ${name}`)
  prompt.data = Buffer.from(injectProjectDescriptionContract(prompt.data.toString('utf8'), name))
  if (name === 'workflow') {
    const helper = path.join(PKG_ROOT, 'scripts', 'vorcl-run.mjs')
    if (exists(helper)) {
      if (!files.has('scripts')) files.set('scripts', { type: 'directory', mode: 0o755 })
      collectFiles(helper, 'scripts/vorcl-run.mjs', files)
    }
  }
  return files
}

function agentFiles(source, adapter) {
  if (adapter === 'kimi') return collectFiles(source)
  const content = fs.readFileSync(source, 'utf8')
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) throw new Error(`Invalid agent frontmatter: ${source}`)
  const field = (name) => match[1].match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim()
  if (!field('name') || !field('description')) throw new Error(`Missing agent name/description: ${source}`)
  const rawDescription = field('description')
  const description = rawDescription.startsWith('"') ? JSON.parse(rawDescription) : rawDescription
  const body = match[2].replace(/\/([a-z][a-z0-9-]*):([a-z0-9-]+)/g, '/$1-$2')
  const registry = path.join(PKG_ROOT, 'scripts', 'roles.json')
  const role = exists(registry) ? JSON.parse(fs.readFileSync(registry, 'utf8')).roles.find((entry) => entry.id === field('name')) : null
  const readonly = role?.readonly === true
  const frontmatter = adapter === 'cursor'
    ? `name: avf-${field('name')}\ndescription: ${JSON.stringify(description)}\nmodel: inherit\nreadonly: ${readonly}`
    : match[1].replace(/^name:.*$/m, `name: avf-${field('name')}`).replace(/^model:.*$/m, 'model: inherit')
  return new Map([['', { type: 'file', mode: 0o644, data: Buffer.from(`---\n${frontmatter}\n---\n${body}`) }]])
}

function readManifest(root) {
  const file = path.join(root, MANIFEST)
  if (!exists(file)) return { schemaVersion: 1, components: {} }
  assertSafePath(file)
  const manifest = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (manifest?.schemaVersion !== 1 || !manifest.components || typeof manifest.components !== 'object' || Array.isArray(manifest.components)) {
    throw new Error(`Invalid ownership manifest: ${file}`)
  }
  for (const [name, value] of Object.entries(manifest.components)) {
    if (!/^[a-z0-9][a-z0-9._-]*$/i.test(name) || name === '..' || !/^[a-f0-9]{64}$/.test(value)) throw new Error(`Invalid ownership record: ${file}`)
  }
  return manifest
}

function writeManifest(root, manifest) {
  const file = path.join(root, MANIFEST)
  const next = JSON.stringify(manifest, null, 2) + '\n'
  if (exists(file) && fs.readFileSync(file, 'utf8') === next) return
  const temp = path.join(root, `.avf-manifest-${process.pid}-${Math.random().toString(16).slice(2)}.tmp`)
  try {
    fs.writeFileSync(temp, next, { flag: 'wx', mode: 0o600 })
    fs.renameSync(temp, file)
  } finally { if (exists(temp)) fs.unlinkSync(temp) }
}

function materialize(files, target) {
  for (const [relative, entry] of [...files].sort(([a], [b]) => a.length - b.length || a.localeCompare(b))) {
    const destination = relative ? path.join(target, ...relative.split('/')) : target
    if (entry.type === 'directory') fs.mkdirSync(destination, { recursive: true, mode: entry.mode })
    else { fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, entry.data, { mode: entry.mode }) }
    fs.chmodSync(destination, entry.mode)
  }
}

function installComponents(root, incoming) {
  assertSafePath(root)
  // Competing installer processes must not overwrite each other's ownership
  // records. A crash leaves a visible lock for explicit operator inspection.
  let lock = null
  let lockFd = null
  if (!dryRun) {
    fs.mkdirSync(root, { recursive: true })
    lock = path.join(root, '.agent-vorcl-flow-install.lock')
    try { lockFd = fs.openSync(lock, 'wx', 0o600) }
    catch (error) {
      if (error.code === 'EEXIST') throw new Error(`installation lock exists; inspect before retrying: ${lock}`)
      throw error
    }
    fs.writeFileSync(lockFd, `${process.pid}\n`)
  }
  try {
  const manifest = readManifest(root)
  const stats = { installed: 0, updated: 0, unchanged: 0, preserved: 0 }
  for (const [name, files] of incoming) {
    const target = path.join(root, name)
    const present = exists(target)
    let before = null
    if (present) {
      // A matching name does not establish ownership, even for legacy AVF files.
      if (!Object.hasOwn(manifest.components, name)) { stats.preserved++; warn(`${target} (not owned by this installer)`); continue }
      try { before = digest(collectFiles(target)) }
      catch { stats.preserved++; warn(`${target} (unsupported local file or symlink)`); continue }
      if (before !== manifest.components[name]) { stats.preserved++; warn(`${target} (locally modified)`); continue }
    }
    const after = digest(files)
    if (before === after) { stats.unchanged++; continue }
    if (!dryRun) {
      fs.mkdirSync(root, { recursive: true })
      const staging = fs.mkdtempSync(path.join(root, '.avf-stage-'))
      const staged = path.join(staging, 'next')
      const backup = path.join(staging, 'previous')
      let committed = false
      try {
        materialize(files, staged)
        // Recheck after staging so a concurrent edit is not silently replaced.
        if (present ? !exists(target) || digest(collectFiles(target)) !== before : exists(target)) {
          throw new Error(`destination changed during installation: ${target}`)
        }
        if (present) fs.renameSync(target, backup)
        let published = false
        try {
          fs.renameSync(staged, target)
          published = true
          manifest.components[name] = after
          // Persist ownership with each component; interrupted runs remain safe.
          writeManifest(root, manifest)
          committed = true
        } catch (error) {
          if (published) fs.rmSync(target, { recursive: true, force: true })
          if (present) fs.renameSync(backup, target)
          throw error
        }
      } finally {
        // If rollback itself failed, retain the backup for recovery.
        if (committed || !exists(backup)) fs.rmSync(staging, { recursive: true, force: true })
      }
    }
    stats[present ? 'updated' : 'installed']++
  }
  log(`${dryRun ? 'Preview' : 'Installed'} ${root}: ${Object.entries(stats).map(([key, count]) => `${count} ${key}`).join(', ')}`)
  } finally {
    if (lockFd !== null) fs.closeSync(lockFd)
    if (lock !== null) fs.unlinkSync(lock)
  }
}

function legacyReport() {
  const home = os.homedir()
  const candidates = [
    path.join(location('CLAUDE_HOME', path.join(home, '.claude')), 'settings.json'),
    path.join(location('CODEX_HOME', path.join(home, '.codex')), 'config.toml'),
    path.join(location('CODEX_HOME', path.join(home, '.codex')), 'AGENTS.md'),
    path.join(location('CURSOR_HOME', path.join(home, '.cursor')), 'mcp.json'),
    path.join(location('KIMI_HOME', path.join(home, '.kimi')), 'mcp.json'),
    path.join(location('KIMI_HOME', path.join(home, '.kimi')), 'config.toml'),
  ]
  let found = 0
  for (const file of candidates) {
    if (!exists(file)) continue
    if (/agent-vorcl-flow|AVF_RUNTIME_TOKEN|mcp-env\.mjs|127\.0\.0\.1:19790|__AVF_LAUNCHER__/i.test(fs.readFileSync(file, 'utf8'))) {
      found++
      log(`Possible legacy AVF configuration: ${file}`)
    }
  }
  const configHome = location('XDG_CONFIG_HOME', path.join(home, '.config'))
  const avfHome = location('AGENT_VORCL_HOME', process.platform === 'win32' && process.env.APPDATA ? path.join(process.env.APPDATA, 'agent-vorcl-flow') : path.join(configHome, 'agent-vorcl-flow'))
  const legacyArtifacts = [
    avfHome,
    path.join(home, 'Library', 'LaunchAgents', 'io.vorcl.agent-flow-runtime.plist'),
    path.join(home, '.config', 'systemd', 'user', 'agent-vorcl-flow-runtime.service'),
  ]
  for (const file of legacyArtifacts) {
    if (!exists(file)) continue
    found++
    log(`Possible legacy AVF runtime artifact: ${file}`)
  }
  log(found ? 'Review these files in your client settings. No settings or values were changed or printed.' : 'No recognizable legacy AVF client configuration found.')
}

function checkComponents(plans, selection) {
  const components = []
  for (const [root, incoming, adapter, kind] of plans) {
    let manifest
    let unsafeReason = null
    try { assertSafePath(root) }
    catch { unsafeReason = 'symbolic-link or unreadable destination root' }
    if (!unsafeReason) {
      try { manifest = readManifest(root) }
      catch { unsafeReason = 'invalid or unreadable ownership manifest' }
    }
    for (const [name, files] of incoming) {
      const target = path.join(root, name)
      let status = 'unsafe'
      let reason = unsafeReason
      if (!reason) {
        try {
          assertSafePath(target)
          if (!exists(target)) status = 'missing'
          else {
            const actual = digest(collectFiles(target))
            if (!Object.hasOwn(manifest.components, name)) status = 'unowned'
            else if (actual !== manifest.components[name]) status = 'modified'
            else status = actual === digest(files) ? 'current' : 'update-available'
          }
        } catch { reason = 'symbolic-link, unsupported or unreadable component' }
      }
      components.push({ adapter, kind, name, path: target, status, ...(reason ? { reason } : {}) })
    }
  }
  const summary = Object.fromEntries(['current', 'update-available', 'modified', 'unowned', 'missing', 'unsafe'].map((status) => [status, components.filter((entry) => entry.status === status).length]))
  const needsAttention = components.some(({ status }) => status !== 'current')
  if (options.json) log(JSON.stringify({ schemaVersion: 1, selection, summary, components, needsAttention }, null, 2))
  else {
    for (const item of components) log(`${item.status}: ${item.adapter} ${item.kind} ${item.name}${item.reason ? ` (${item.reason})` : ''}`)
    log(`Check: ${Object.entries(summary).map(([status, count]) => `${count} ${status}`).join(', ')}. No files changed.`)
  }
  process.exitCode = needsAttention ? 1 : 0
}

function runInstaller() {
  if (options.legacy) legacyReport()
  if (!selected.length && !options.list) {
    if (!options.legacy) log(HELP)
    return
  }
  const catalog = buildInstallCatalog(PKG_ROOT)
  const selection = selectComponents(catalog, options)
  if (options.list) {
    if (options.json) log(JSON.stringify({ ...catalog, selection }, null, 2))
    else {
      log(`Agent-Vorcl-Flow: ${catalog.skills.length} packaged skills, ${catalog.roles.length} role bundles`)
      log(`Standalone: ${catalog.semantics.skill}`)
      log(`Role bundle: ${catalog.semantics.role}`)
      log(catalog.semantics.taskMaster)
      log(`Core: ${catalog.coreSkills.join(', ')}`)
      for (const role of catalog.roles) log(`--role ${role.name}: ${role.description}`)
      for (const skill of catalog.skills) log(`--skill ${skill.name} [${skill.kind}]: ${skill.description}`)
      if (selection.mode === 'filtered') log(`Selected ${selection.skills.length} skills: ${selection.skills.join(', ')}`)
    }
    return
  }
  const home = os.homedir()
  // Validate all selected paths and ownership manifests before writing anywhere.
  const adapters = selected.map((adapter) => {
    const clientHome = adapter === 'codex' ? null : location(`${adapter.toUpperCase()}_HOME`, path.join(home, `.${adapter}`))
    return { adapter, skills: adapter === 'codex' ? location('AVF_SKILLS_DIR', path.join(home, '.agents', 'skills')) : path.join(clientHome, 'skills'), agents: clientHome && path.join(clientHome, 'agents') }
  })
  const skills = new Map(selection.skills.map((name) => [name, skillFiles(name)]))
  const plans = []
  for (const { adapter, skills: skillsRoot, agents: agentsRoot } of adapters) {
    plans.push([skillsRoot, skills, adapter, 'skill'])
    if (agentsRoot) {
      const source = path.join(PKG_ROOT, ...(adapter === 'kimi' ? ['kimi', 'agents'] : ['agents']))
      const files = fs.readdirSync(source).filter((file) => adapter === 'kimi' ? /\.ya?ml$/.test(file) : file.endsWith('.md'))
        .filter((file) => selection.mode === 'all' || selection.agentRoles.includes(file.replace(/\.(?:md|ya?ml)$/, ''))).sort()
      if (files.length) plans.push([agentsRoot, new Map(files.map((file) => [`avf-${file}`, agentFiles(path.join(source, file), adapter)])), adapter, 'agent'])
    }
  }
  if (options.check) { checkComponents(plans, selection); return }
  for (const [root] of plans) { assertSafePath(root); readManifest(root) }
  for (const [root, components] of plans) installComponents(root, components)
  log('MCP connections, Task Master state and client configuration were not modified.')
}

try { runInstaller() }
catch (error) {
  console.error(`${options.check ? 'Check' : options.list ? 'Discovery' : 'Installation'} failed: ${error.message}`)
  process.exitCode = error instanceof ArgumentError ? 2 : 1
}
