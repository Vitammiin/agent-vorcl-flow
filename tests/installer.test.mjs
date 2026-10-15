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
    assert.equal(result.status, 1)
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
    assert.equal(result.status, args[0] === '--unknown' ? 1 : 0, result.stderr)
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
