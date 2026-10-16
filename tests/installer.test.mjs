import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const realInstaller = path.resolve('bin/install.mjs')
const MANIFEST = '.agent-vorcl-flow-install.json'

function put(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, content)
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'avf-installer-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const home = path.join(root, 'home')
  const pkg = path.join(root, 'package')
  fs.mkdirSync(home)
  put(path.join(pkg, 'bin', 'install.mjs'), fs.readFileSync(realInstaller))
  put(path.join(pkg, 'scripts', 'install-catalog.mjs'), fs.readFileSync('scripts/install-catalog.mjs'))
  for (const name of ['backend', 'firecrawl', 'workflow']) {
    put(path.join(pkg, 'codex', 'skills', name, 'SKILL.md'), `---\nname: ${name}\ndescription: A fixture skill\n---\n# ${name}\n`)
    put(path.join(pkg, 'skills', name, 'scripts', 'helper.mjs'), '// canonical helper\n')
  }
  put(path.join(pkg, 'scripts', 'vorcl-run.mjs'), '// workflow helper\n')
  put(path.join(pkg, 'scripts', 'roles.json'), JSON.stringify({ roles: [{ id: 'backend', readonly: false }] }))
  put(path.join(pkg, 'agents', 'backend.md'), '---\nname: backend\ndescription: Backend agent\nmodel: sonnet\ntools: Read, Edit, Write, Bash\n---\nUse /backend:vorcl.\n')
  put(path.join(pkg, 'kimi', 'agents', 'backend.yaml'), 'version: 1\nagent:\n  name: backend\n')
  return { root, home, pkg }
}

function run(f, args = [], overrides = {}, installer = path.join(f.pkg, 'bin', 'install.mjs'), interpreter = process.execPath) {
  return spawnSync(interpreter, [installer, ...args], {
    cwd: f.root,
    encoding: 'utf8',
    env: {
      ...process.env,
      HOME: f.home,
      USERPROFILE: f.home,
      PATH: f.root,
      AGENT_VORCL_HOME: path.join(f.home, 'legacy-runtime'),
      XDG_CONFIG_HOME: path.join(f.home, '.config'),
      CLAUDE_HOME: path.join(f.home, '.claude'),
      CODEX_HOME: path.join(f.home, '.codex'),
      CURSOR_HOME: path.join(f.home, '.cursor'),
      KIMI_HOME: path.join(f.home, '.kimi'),
      AVF_SKILLS_DIR: path.join(f.home, '.agents', 'skills'),
      NO_COLOR: '1',
      ...overrides,
    },
  })
}

function success(result) { assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`); return result }

function snapshot(root) {
  const result = {}
  if (!fs.existsSync(root)) return result
  const visit = (dir) => {
    for (const name of fs.readdirSync(dir).sort()) {
      const file = path.join(dir, name)
      const relative = path.relative(root, file)
      const stat = fs.lstatSync(file)
      result[relative] = stat.isDirectory() ? 'directory' : stat.isSymbolicLink() ? ['symlink', fs.readlinkSync(file)] : [fs.readFileSync(file).toString('base64'), stat.mode & 0o777, stat.mtimeMs]
      if (stat.isDirectory()) visit(file)
    }
  }
  visit(root)
  return result
}

test('help, empty invocation, banner and invalid options have no filesystem effects', (t) => {
  const f = fixture(t)
  for (const args of [[], ['--help'], ['-h'], ['--banner-only'], ['--codex', '--help']]) {
    assert.match(success(run(f, args)).stdout, /Agent-Vorcl-Flow/)
    assert.deepEqual(fs.readdirSync(f.home), [])
  }
  for (const args of [['--typo'], ['runtime', 'start'], ['--help', '--typo'], ['--codex', '--typo']]) {
    const result = run(f, args)
    assert.equal(result.status, 2)
    assert.match(result.stderr, /Unknown option/)
    assert.deepEqual(fs.readdirSync(f.home), [])
  }
})

test('all adapters preserve client settings, MCP, credentials, global rules and Task Master byte for byte', (t) => {
  const f = fixture(t)
  const files = [
    '.claude/settings.json', '.claude/.mcp.json', '.codex/config.toml', '.codex/AGENTS.md',
    '.cursor/mcp.json', '.kimi/mcp.json', '.kimi/config.toml',
    '.taskmaster/tasks/tasks.json', '.taskmaster/config.json', 'legacy-runtime/.env', 'legacy-runtime/runtime.json',
  ]
  for (const file of files) put(path.join(f.home, file), `user-owned ${file}\ninvalid settings are still preserved\n`)
  const before = snapshot(f.home)
  success(run(f, ['--all']))
  const after = snapshot(f.home)
  for (const file of files) assert.deepEqual(after[file], before[file], file)
  for (const client of ['.claude', '.cursor', '.kimi']) assert.ok(fs.existsSync(path.join(f.home, client, 'skills/backend/SKILL.md')))
  assert.ok(fs.existsSync(path.join(f.home, '.agents/skills/backend/SKILL.md')))
  assert.ok(fs.existsSync(path.join(f.home, '.claude/agents/avf-backend.md')))
  assert.ok(fs.existsSync(path.join(f.home, '.cursor/agents/avf-backend.md')))
  assert.ok(fs.existsSync(path.join(f.home, '.kimi/agents/avf-backend.yaml')))
  assert.ok(!fs.existsSync(path.join(f.home, '.config')))
  assert.ok(!fs.existsSync(path.join(f.home, 'Library')))
  assert.ok(!fs.existsSync(path.join(f.home, 'legacy-runtime/bin')))
})

test('dry run previews all components without even creating destination directories', (t) => {
  const f = fixture(t)
  const result = success(run(f, ['--all', '--dry-run']))
  assert.match(result.stdout, /Preview/)
  assert.deepEqual(fs.readdirSync(f.home), [])
})

test('unowned skill directories including upstream Firecrawl are never overlaid or adopted', (t) => {
  const f = fixture(t)
  const skills = path.join(f.home, '.agents/skills')
  put(path.join(skills, 'backend/SKILL.md'), 'user backend')
  put(path.join(skills, 'firecrawl/SKILL.md'), 'upstream firecrawl')
  put(path.join(skills, 'firecrawl/scripts/helper.mjs'), 'upstream helper')
  const beforeBackend = snapshot(path.join(skills, 'backend'))
  const beforeFirecrawl = snapshot(path.join(skills, 'firecrawl'))
  const result = success(run(f, ['--codex']))
  assert.match(result.stderr, /not owned by this installer/)
  assert.deepEqual(snapshot(path.join(skills, 'backend')), beforeBackend)
  assert.deepEqual(snapshot(path.join(skills, 'firecrawl')), beforeFirecrawl)
  const owned = JSON.parse(fs.readFileSync(path.join(skills, MANIFEST), 'utf8')).components
  assert.deepEqual(Object.keys(owned), ['workflow'])
})

test('agent name collisions are preserved and generated agents inherit the client model', (t) => {
  const f = fixture(t)
  const target = path.join(f.home, '.cursor/agents/avf-backend.md')
  put(target, 'user agent')
  success(run(f, ['--cursor', '--claude']))
  assert.equal(fs.readFileSync(target, 'utf8'), 'user agent')
  const claude = fs.readFileSync(path.join(f.home, '.claude/agents/avf-backend.md'), 'utf8')
  assert.match(claude, /name: avf-backend/)
  assert.match(claude, /model: inherit/)
  assert.match(claude, /\/backend-vorcl/)
})

test('Cursor permissions come from explicit role metadata rather than a hardcoded tool list', (t) => {
  const f = fixture(t)
  const source = path.join(f.pkg, 'agents/backend.md')
  fs.writeFileSync(source, fs.readFileSync(source, 'utf8').replace(/^tools:.*\n/m, ''))
  success(run(f, ['--cursor']))
  const target = path.join(f.home, '.cursor/agents/avf-backend.md')
  assert.match(fs.readFileSync(target, 'utf8'), /readonly: false/)
  put(path.join(f.pkg, 'scripts', 'roles.json'), JSON.stringify({ roles: [{ id: 'backend', readonly: true }] }))
  success(run(f, ['--cursor']))
  assert.match(fs.readFileSync(target, 'utf8'), /readonly: true/)
})

test('reinstall is byte and mtime idempotent; updates replace only unchanged owned components', (t) => {
  const f = fixture(t)
  success(run(f, ['--all']))
  const first = snapshot(f.home)
  success(run(f, ['--all']))
  assert.deepEqual(snapshot(f.home), first)
  const skill = path.join(f.home, '.agents/skills/backend')
  put(path.join(skill, 'user-note.txt'), 'keep me')
  put(path.join(f.pkg, 'codex/skills/backend/SKILL.md'), '---\nname: backend\ndescription: Updated\n---\nnew backend\n')
  put(path.join(f.pkg, 'skills/workflow/scripts/helper.mjs'), '// updated\n')
  // An obsolete package asset must disappear from an otherwise untouched skill.
  fs.unlinkSync(path.join(f.pkg, 'skills/workflow/scripts/helper.mjs'))
  const local = snapshot(skill)
  const result = success(run(f, ['--codex']))
  assert.match(result.stderr, /locally modified/)
  assert.deepEqual(snapshot(skill), local)
  assert.ok(!fs.existsSync(path.join(f.home, '.agents/skills/workflow/scripts/helper.mjs')))
})

test('an edited installed agent stays untouched during a package upgrade', (t) => {
  const f = fixture(t)
  success(run(f, ['--cursor']))
  const target = path.join(f.home, '.cursor/agents/avf-backend.md')
  fs.appendFileSync(target, '\nUser customization\n')
  const before = fs.readFileSync(target, 'utf8')
  fs.appendFileSync(path.join(f.pkg, 'agents/backend.md'), '\nNew package behavior\n')
  success(run(f, ['--cursor']))
  assert.equal(fs.readFileSync(target, 'utf8'), before)
})

test('skill assets and maintenance context are installed only in owned components', (t) => {
  const f = fixture(t)
  success(run(f, ['--codex']))
  const skills = path.join(f.home, '.agents/skills')
  const prompt = fs.readFileSync(path.join(skills, 'backend/SKILL.md'), 'utf8')
  assert.match(prompt, /PROJECT_DESCRIPTION\.md/)
  assert.match(prompt, /--external/)
  assert.equal((prompt.match(/<!-- >>> agent-vorcl-flow project-description >>>/g) || []).length, 1)
  assert.equal(fs.readFileSync(path.join(skills, 'backend/scripts/helper.mjs'), 'utf8'), '// canonical helper\n')
  assert.equal(fs.readFileSync(path.join(skills, 'workflow/scripts/vorcl-run.mjs'), 'utf8'), '// workflow helper\n')
})

test('relative paths and corrupt ownership state fail before any selected adapter is installed', (t) => {
  const f = fixture(t)
  let result = run(f, ['--all'], { KIMI_HOME: 'relative' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /absolute path/)
  assert.deepEqual(fs.readdirSync(f.home), [])
  const file = path.join(f.home, '.kimi/agents', MANIFEST)
  put(file, '{not json')
  const before = snapshot(f.home)
  result = run(f, ['--all'])
  assert.equal(result.status, 1)
  assert.deepEqual(snapshot(f.home), before)
})

test('destination symlinks are never followed; unowned symlink components are preserved', (t) => {
  const f = fixture(t)
  const external = path.join(f.root, 'external')
  fs.mkdirSync(external)
  fs.symlinkSync(external, path.join(f.home, '.cursor'))
  assert.equal(run(f, ['--all']).status, 1)
  assert.deepEqual(fs.readdirSync(external), [])
  assert.ok(!fs.existsSync(path.join(f.home, '.claude')))
  const skills = path.join(f.home, '.agents/skills')
  fs.mkdirSync(skills, { recursive: true })
  fs.symlinkSync(external, path.join(skills, 'backend'))
  success(run(f, ['--codex']))
  assert.deepEqual(fs.readdirSync(external), [])
  assert.ok(fs.lstatSync(path.join(skills, 'backend')).isSymbolicLink())
})

test('legacy diagnostic is read only and never prints settings or credential values', (t) => {
  const f = fixture(t)
  put(path.join(f.home, '.codex/config.toml'), '# >>> agent-vorcl-flow >>>\nsecret = "unique-private-value"\n')
  put(path.join(f.home, '.codex/AGENTS.md'), '# Agent-Vorcl-Flow\nLegacy rules\n')
  put(path.join(f.home, 'Library/LaunchAgents/io.vorcl.agent-flow-runtime.plist'), 'private service definition')
  put(path.join(f.home, '.config/systemd/user/agent-vorcl-flow-runtime.service'), 'private linux service definition')
  put(path.join(f.home, 'legacy-runtime/.env'), 'private credentials')
  const before = snapshot(f.home)
  const result = success(run(f, ['--check-legacy']))
  assert.match(result.stdout, /Possible legacy AVF configuration/)
  assert.doesNotMatch(result.stdout + result.stderr, /unique-private-value/)
  assert.doesNotMatch(result.stdout + result.stderr, /private credentials|private service definition/)
  assert.match(result.stdout, /AGENTS\.md/)
  assert.match(result.stdout, /io\.vorcl\.agent-flow-runtime\.plist/)
  assert.match(result.stdout, /agent-vorcl-flow-runtime\.service/)
  assert.match(result.stdout, /legacy-runtime/)
  assert.deepEqual(snapshot(f.home), before)
})

test('an existing installer lock cannot be stolen or removed', (t) => {
  const f = fixture(t)
  const lock = path.join(f.home, '.agents/skills/.agent-vorcl-flow-install.lock')
  put(lock, 'another process\n')
  const before = snapshot(f.home)
  const result = run(f, ['--codex'])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /installation lock exists/)
  assert.deepEqual(snapshot(f.home), before)
})

test('package adapters ship no MCP registrations', () => {
  for (const file of ['.mcp.json', 'cursor/mcp.json', 'kimi/mcp.json']) assert.deepEqual(JSON.parse(fs.readFileSync(file, 'utf8')).mcpServers, {}, file)
  for (const file of ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json']) assert.ok(!Object.hasOwn(JSON.parse(fs.readFileSync(file, 'utf8')), 'mcpServers'), file)
  assert.doesNotMatch(fs.readFileSync('codex/config.toml', 'utf8'), /\[(mcp_servers|profiles)\./)
})

test('manual Codex entrypoint delegates to the single installer implementation', () => {
  const source = fs.readFileSync('codex/scripts/install.sh', 'utf8')
  assert.match(source, /exec node "\$PKG_ROOT\/bin\/install\.mjs" --codex "\$@"/)
  assert.doesNotMatch(source, /cp -R|config\.toml.*>>/)
})

test('manual Codex entrypoint forwards help and preview without installing', { skip: !fs.existsSync('/bin/bash') }, (t) => {
  const f = fixture(t)
  // The wrapper intentionally invokes node from PATH, as documented.
  fs.symlinkSync(process.execPath, path.join(f.root, 'node'))
  const script = path.join(f.pkg, 'codex/scripts/install.sh')
  put(script, fs.readFileSync('codex/scripts/install.sh'))
  for (const args of [['--help'], ['--dry-run'], ['--unknown']]) {
    const result = run(f, args, { PATH: `${f.root}:/usr/bin:/bin` }, script, '/bin/bash')
    assert.equal(result.status, args[0] === '--unknown' ? 2 : 0, result.stderr)
    assert.deepEqual(fs.readdirSync(f.home), [])
  }
})

test('real package installs the role set and canonical helpers in an isolated home', (t) => {
  const f = fixture(t)
  success(run(f, ['--all'], {}, realInstaller))
  const roles = JSON.parse(fs.readFileSync('scripts/roles.json', 'utf8')).roles.map(({ id }) => id)
  for (const prefix of ['.agents', '.claude', '.cursor', '.kimi']) {
    for (const role of roles) assert.ok(fs.existsSync(path.join(f.home, prefix, 'skills', role, 'SKILL.md')), `${prefix}: ${role}`)
    for (const file of ['init-code/scripts/inspect.mjs', 'init-code/scripts/check-impact.mjs', 'liveboard/scripts/server.mjs']) assert.ok(fs.existsSync(path.join(f.home, prefix, 'skills', file)), `${prefix}: ${file}`)
  }
  assert.ok(!fs.existsSync(path.join(f.home, '.codex')))
  assert.ok(!fs.existsSync(path.join(f.home, 'legacy-runtime')))
  assert.ok(!fs.existsSync(path.join(f.home, '.taskmaster')))
  for (const prefix of ['.claude', '.cursor', '.kimi']) assert.ok(!fs.existsSync(path.join(f.home, prefix, 'mcp.json')))
  for (const role of ['analyzer', 'integrity', 'security', 'visual-research', 'pinpoint']) {
    const installed = fs.readFileSync(path.join(f.home, '.cursor/agents', `avf-${role}.md`), 'utf8')
    assert.match(installed, /readonly: true/, role)
  }
  for (const role of ['backend', 'frontend', 'testing', 'swagger']) {
    const installed = fs.readFileSync(path.join(f.home, '.cursor/agents', `avf-${role}.md`), 'utf8')
    assert.match(installed, /readonly: false/, role)
  }
})

test('Cursor agent descriptions decode YAML JSON quotes exactly once', (t) => {
  const f = fixture(t)
  const description = 'Backend: preserve "quoted text", C:\\example and Unicode — описание'
  put(path.join(f.pkg, 'agents/backend.md'), `---\nname: backend\ndescription: ${JSON.stringify(description)}\n---\nBackend role.\n`)
  success(run(f, ['--cursor', '--claude']))
  for (const adapter of ['.cursor', '.claude']) {
    const content = fs.readFileSync(path.join(f.home, adapter, 'agents/avf-backend.md'), 'utf8')
    const scalar = content.match(/^description: (.*)$/m)[1]
    assert.equal(JSON.parse(scalar), description, adapter)
  }
})

function roleFixture(t) {
  const f = fixture(t)
  for (const name of ['vorcl', 'workspace-capability-routing', 'init-code', 'project-audit', 'testing', 'testing-strategy', 'nodejs', 'database', 'database-query', 'redis', 'backend-vorcl', 'backend-create-api', 'task-master']) {
    put(path.join(f.pkg, 'codex/skills', name, 'SKILL.md'), `---\nname: ${name}\ndescription: ${JSON.stringify(`Fixture: ${name}`)}\n---\n# ${name}\n`)
  }
  put(path.join(f.pkg, 'scripts/roles.json'), JSON.stringify({ roles: [
    { id: 'backend', skillHints: ['nodejs', 'database', 'task-master'], readonly: false },
    { id: 'database', skillHints: ['redis'], readonly: false },
    { id: 'testing', skillHints: [], readonly: false },
  ] }))
  for (const command of ['backend/vorcl', 'backend/create-api', 'database/query']) put(path.join(f.pkg, 'commands', `${command}.md`), '# Fixture command')
  for (const role of ['database', 'testing']) put(path.join(f.pkg, 'agents', `${role}.md`), `---\nname: ${role}\ndescription: Fixture agent\n---\n# ${role}\n`)
  return f
}

test('discovery lists all generated skill kinds without resolving destinations or creating a home', (t) => {
  const f = roleFixture(t)
  fs.rmdirSync(f.home)
  const result = success(run(f, ['--list', '--json'], { AVF_SKILLS_DIR: 'invalid relative destination' }))
  const catalog = JSON.parse(result.stdout)
  assert.equal(catalog.skills.length, 16)
  assert.deepEqual(catalog.skills.find(({ name }) => name === 'backend-create-api'), { name: 'backend-create-api', description: 'Fixture: backend-create-api', kind: 'command', role: 'backend' })
  assert.equal(catalog.skills.find(({ name }) => name === 'backend').kind, 'role')
  assert.match(catalog.semantics.skill, /technical dependencies/)
  assert.match(catalog.semantics.role, /direct skill hints only/)
  assert.deepEqual(catalog.technicalDependencies, { 'init-code': ['project-audit'] })
  assert.equal(fs.existsSync(f.home), false)
  const real = JSON.parse(success(run(f, ['--list', '--json'], {}, realInstaller)).stdout)
  assert.equal(real.skills.length, 236)
  assert.equal(real.roles.length, 26)
  assert.ok(real.skills.some(({ name, kind }) => name === 'frontend-create-component' && kind === 'command'))
  for (const name of ['vorcl', 'audit', 'init-code']) {
    const skill = real.skills.find((entry) => entry.name === name)
    assert.equal(skill.kind, 'command', name)
    assert.equal(skill.role, undefined, name)
  }
  assert.equal(fs.existsSync(f.home), false)
})

test('filters reject missing, unknown and traversing names and incompatible commands before writes', (t) => {
  const f = fixture(t)
  for (const args of [
    ['--all', '--role'], ['--all', '--skill', '--dry-run'], ['--all', '--skill', '../backend'],
    ['--all', '--skill', 'unknown'], ['--all', '--role', 'unknown'], ['--skill', 'backend'],
    ['--check'], ['--json'], ['--list', '--check'], ['--list', '--dry-run'],
    ['--list', '--check-legacy'], ['--all', '--check', '--check-legacy'],
  ]) {
    const result = run(f, args)
    assert.equal(result.status, 2, `${args.join(' ')}: ${result.stdout}\n${result.stderr}`)
    assert.deepEqual(fs.readdirSync(f.home), [])
  }
})

test('role bundles union core, commands and direct hints without recursive expansion or implicit Task Master', (t) => {
  const f = roleFixture(t)
  const args = ['--all', '--role', 'backend', '--skill', 'firecrawl', '--role', 'backend']
  success(run(f, [...args, '--dry-run']))
  assert.deepEqual(fs.readdirSync(f.home), [])
  const selection = JSON.parse(success(run(f, ['--list', '--json', '--role', 'backend', '--skill', 'firecrawl'])).stdout).selection
  assert.deepEqual(selection.skills, ['backend', 'backend-create-api', 'backend-vorcl', 'database', 'firecrawl', 'init-code', 'nodejs', 'project-audit', 'testing', 'testing-strategy', 'vorcl', 'workflow', 'workspace-capability-routing'])
  const union = JSON.parse(success(run(f, ['--list', '--json', '--role', 'backend', '--role', 'database'])).stdout).selection
  assert.deepEqual(union.agentRoles, ['backend', 'database', 'testing'])
  assert.ok(union.skills.includes('database-query'))
  assert.ok(union.skills.includes('redis'))
  assert.ok(!union.skills.includes('task-master'))
  success(run(f, args))
  for (const adapter of ['.agents', '.claude', '.cursor', '.kimi']) {
    const root = path.join(f.home, adapter, 'skills')
    assert.deepEqual(fs.readdirSync(root).filter((name) => !name.startsWith('.')).sort(), selection.skills)
    assert.ok(!fs.existsSync(path.join(root, 'task-master')))
  }
  for (const adapter of ['.claude', '.cursor']) {
    assert.deepEqual(fs.readdirSync(path.join(f.home, adapter, 'agents')).filter((name) => !name.startsWith('.')).sort(), ['avf-backend.md', 'avf-testing.md'])
  }
  assert.deepEqual(fs.readdirSync(path.join(f.home, '.kimi/agents')).filter((name) => !name.startsWith('.')), ['avf-backend.yaml'])
  assert.ok(!fs.existsSync(path.join(f.home, '.taskmaster')))
  const before = snapshot(f.home)
  success(run(f, args))
  assert.deepEqual(snapshot(f.home), before)
  success(run(f, ['--codex', '--role', 'backend', '--skill', 'task-master']))
  assert.ok(fs.existsSync(path.join(f.home, '.agents/skills/task-master/SKILL.md')))
  assert.ok(!fs.existsSync(path.join(f.home, '.taskmaster')))
})

test('standalone skill selection includes canonical assets and no native agents; later filters never prune', (t) => {
  const f = roleFixture(t)
  success(run(f, ['--all', '--skill', 'backend']))
  for (const adapter of ['.agents', '.claude', '.cursor', '.kimi']) {
    assert.ok(fs.existsSync(path.join(f.home, adapter, 'skills/backend/scripts/helper.mjs')))
    assert.ok(!fs.existsSync(path.join(f.home, adapter, 'skills/workflow')))
    assert.ok(!fs.existsSync(path.join(f.home, adapter, 'agents')))
  }
  success(run(f, ['--codex', '--skill', 'firecrawl', '--skill', 'firecrawl']))
  const root = path.join(f.home, '.agents/skills')
  assert.deepEqual(Object.keys(JSON.parse(fs.readFileSync(path.join(root, MANIFEST))).components), ['backend', 'firecrawl'])
  fs.appendFileSync(path.join(root, 'backend/SKILL.md'), '\nUser edit to an unselected component\n')
  const before = snapshot(f.home)
  const report = JSON.parse(success(run(f, ['--codex', '--skill', 'firecrawl', '--check', '--json'])).stdout)
  assert.equal(report.components.length, 1)
  assert.equal(report.components[0].status, 'current')
  assert.deepEqual(snapshot(f.home), before)
})

test('a missing required role component fails before any adapter is installed', (t) => {
  const f = roleFixture(t)
  fs.rmSync(path.join(f.pkg, 'codex/skills/backend-create-api'), { recursive: true })
  const result = run(f, ['--all', '--role', 'backend'])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /missing required skill backend-create-api/)
  assert.deepEqual(fs.readdirSync(f.home), [])
})

test('check reports missing components without making destinations, locks or configuration', (t) => {
  const f = fixture(t)
  fs.rmdirSync(f.home)
  const result = run(f, ['--all', '--check', '--json'])
  assert.equal(result.status, 1, result.stderr)
  const report = JSON.parse(result.stdout)
  assert.equal(report.summary.missing, 15)
  assert.ok(report.components.every(({ status }) => status === 'missing'))
  assert.equal(fs.existsSync(f.home), false)
})

test('check distinguishes current, source updates, local edits, missing and unowned without changing files', (t) => {
  const f = fixture(t)
  success(run(f, ['--codex']))
  const root = path.join(f.home, '.agents/skills')
  put(path.join(root, 'unrelated/SKILL.md'), 'unrelated user skill')
  put(path.join(root, '.agent-vorcl-flow-install.lock'), 'a live installer lock must not be read or changed')
  for (const file of ['.codex/config.toml', '.cursor/mcp.json', '.kimi/mcp.json', '.claude/settings.json', '.taskmaster/tasks/tasks.json']) put(path.join(f.home, file), 'private unparseable client config')
  let before = snapshot(f.home)
  let report = JSON.parse(success(run(f, ['--codex', '--check', '--json'])).stdout)
  assert.equal(report.summary.current, 3)
  assert.equal(report.components.length, 3)
  assert.deepEqual(snapshot(f.home), before)
  fs.appendFileSync(path.join(root, 'backend/SKILL.md'), '\nUser edit')
  fs.rmSync(path.join(root, 'firecrawl'), { recursive: true })
  fs.appendFileSync(path.join(f.pkg, 'codex/skills/workflow/SKILL.md'), '\nNew package revision')
  before = snapshot(f.home)
  let result = run(f, ['--codex', '--check', '--json'])
  assert.equal(result.status, 1)
  report = JSON.parse(result.stdout)
  assert.deepEqual(report.components.map(({ name, status }) => [name, status]), [['backend', 'modified'], ['firecrawl', 'missing'], ['workflow', 'update-available']])
  assert.deepEqual(snapshot(f.home), before)
  const manifest = JSON.parse(fs.readFileSync(path.join(root, MANIFEST)))
  delete manifest.components.firecrawl
  put(path.join(root, MANIFEST), JSON.stringify(manifest))
  put(path.join(root, 'firecrawl/SKILL.md'), 'upstream provider skill')
  before = snapshot(f.home)
  result = run(f, ['--codex', '--skill', 'firecrawl', '--check', '--json'])
  assert.equal(result.status, 1)
  assert.equal(JSON.parse(result.stdout).components[0].status, 'unowned')
  assert.deepEqual(snapshot(f.home), before)
})

test('check reports symlinks and invalid ownership manifests as unsafe without following or printing contents', (t) => {
  const f = fixture(t)
  const root = path.join(f.home, '.agents/skills')
  const external = path.join(f.root, 'private-external')
  put(path.join(external, 'SKILL.md'), 'secret-sentinel-must-not-be-printed')
  fs.mkdirSync(root, { recursive: true })
  fs.symlinkSync(external, path.join(root, 'backend'))
  let result = run(f, ['--codex', '--skill', 'backend', '--check', '--json'])
  assert.equal(result.status, 1)
  assert.equal(JSON.parse(result.stdout).components[0].status, 'unsafe')
  assert.doesNotMatch(result.stdout + result.stderr, /secret-sentinel/)
  put(path.join(root, MANIFEST), '{secret-sentinel-must-not-be-printed')
  const before = snapshot(f.home)
  result = run(f, ['--codex', '--check', '--json'])
  assert.equal(result.status, 1)
  assert.equal(JSON.parse(result.stdout).summary.unsafe, 3)
  assert.doesNotMatch(result.stdout + result.stderr, /secret-sentinel/)
  assert.deepEqual(snapshot(f.home), before)
  fs.rmSync(root, { recursive: true })
  fs.symlinkSync(external, root)
  result = run(f, ['--codex', '--check', '--json'])
  assert.equal(result.status, 1)
  assert.equal(JSON.parse(result.stdout).summary.unsafe, 3)
  assert.deepEqual(fs.readdirSync(external), ['SKILL.md'])
})

test('real selective init-code installs its executable dependency and runs from the installed bundle', (t) => {
  const f = fixture(t)
  success(run(f, ['--codex', '--skill', 'init-code'], {}, realInstaller))
  const root = path.join(f.home, '.agents/skills')
  assert.deepEqual(fs.readdirSync(root).filter((name) => !name.startsWith('.')).sort(), ['init-code', 'project-audit'])
  const workspace = path.join(f.root, 'tiny-project')
  put(path.join(workspace, 'package.json'), '{"name":"tiny-project","private":true}')
  put(path.join(workspace, 'src/index.js'), 'export const value = 1\n')
  const result = run(f, ['--root', workspace, '--format', 'json'], {}, path.join(root, 'init-code/scripts/inspect.mjs'))
  success(result)
  assert.doesNotThrow(() => JSON.parse(result.stdout))
  assert.ok(!fs.existsSync(path.join(f.home, '.taskmaster')))
  const check = JSON.parse(success(run(f, ['--codex', '--skill', 'init-code', '--check', '--json'], {}, realInstaller)).stdout)
  assert.equal(check.summary.current, 2)
})

test('real role installation supplies a small usable bundle and only selected native roles', (t) => {
  const f = fixture(t)
  success(run(f, ['--cursor', '--role', 'backend'], {}, realInstaller))
  const root = path.join(f.home, '.cursor')
  const installed = fs.readdirSync(path.join(root, 'skills')).filter((name) => !name.startsWith('.'))
  assert.ok(installed.length > 6 && installed.length < 60, installed.length)
  for (const name of ['backend', 'backend-vorcl', 'backend-create-api', 'vorcl', 'workflow', 'init-code', 'project-audit', 'testing', 'testing-strategy', 'nodejs']) assert.ok(installed.includes(name), name)
  assert.ok(!installed.includes('task-master'))
  assert.deepEqual(fs.readdirSync(path.join(root, 'agents')).filter((name) => !name.startsWith('.')).sort(), ['avf-backend.md', 'avf-testing.md'])
  assert.ok(!fs.existsSync(path.join(root, 'mcp.json')))
  const check = JSON.parse(success(run(f, ['--cursor', '--role', 'backend', '--check', '--json'], {}, realInstaller)).stdout)
  assert.ok(check.components.every(({ status }) => status === 'current'))
})
