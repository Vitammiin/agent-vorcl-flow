import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

const installer = path.resolve('bin/install.mjs')

function temporaryHome(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'avf-installer-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  return root
}

function runInstaller(root, adapter) {
  const result = spawnSync(process.execPath, [installer, adapter], {
    cwd: path.resolve('.'),
    encoding: 'utf8',
    env: {
      ...process.env,
      HOME: root,
      USERPROFILE: root,
      PATH: root,
      AGENT_VORCL_HOME: path.join(root, 'avf'),
      CODEX_HOME: path.join(root, 'codex'),
      AVF_SKILLS_DIR: path.join(root, 'skills'),
      NO_COLOR: '1',
    },
  })
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`)
  return result
}

test('Claude fallback normalizes array-form enabledPlugins to the supported object form', (t) => {
  const root = temporaryHome(t)
  const claudeDir = path.join(root, '.claude')
  fs.mkdirSync(claudeDir, { recursive: true })
  fs.writeFileSync(path.join(claudeDir, 'settings.json'), JSON.stringify({
    enabledPlugins: ['existing@example'],
  }))

  runInstaller(root, '--claude')

  const settings = JSON.parse(fs.readFileSync(path.join(claudeDir, 'settings.json'), 'utf8'))
  assert.deepEqual(settings.enabledPlugins, {
    'existing@example': true,
    'agent-vorcl-flow@agent-vorcl-flow': true,
  })
})

test('Claude fallback repairs malformed enabledPlugins without losing unrelated settings', (t) => {
  const root = temporaryHome(t)
  const claudeDir = path.join(root, '.claude')
  fs.mkdirSync(claudeDir, { recursive: true })
  fs.writeFileSync(path.join(claudeDir, 'settings.json'), JSON.stringify({
    enabledPlugins: 'broken',
    theme: 'dark',
  }))

  runInstaller(root, '--claude')

  const settings = JSON.parse(fs.readFileSync(path.join(claudeDir, 'settings.json'), 'utf8'))
  assert.deepEqual(settings.enabledPlugins, { 'agent-vorcl-flow@agent-vorcl-flow': true })
  assert.equal(settings.theme, 'dark')
})

test('Claude fallback preserves object-form plugin choices and enables AVF', (t) => {
  const root = temporaryHome(t)
  const claudeDir = path.join(root, '.claude')
  fs.mkdirSync(claudeDir, { recursive: true })
  fs.writeFileSync(path.join(claudeDir, 'settings.json'), JSON.stringify({
    enabledPlugins: { 'disabled@example': false, 'enabled@example': true },
  }))

  runInstaller(root, '--claude')

  const settings = JSON.parse(fs.readFileSync(path.join(claudeDir, 'settings.json'), 'utf8'))
  assert.deepEqual(settings.enabledPlugins, {
    'disabled@example': false,
    'enabled@example': true,
    'agent-vorcl-flow@agent-vorcl-flow': true,
  })
})

test('Codex install replaces stale AVF blocks and stays idempotent', (t) => {
  const root = temporaryHome(t)
  const codexDir = path.join(root, 'codex')
  fs.mkdirSync(codexDir, { recursive: true })
  const config = path.join(codexDir, 'config.toml')
  const agents = path.join(codexDir, 'AGENTS.md')
  fs.writeFileSync(config, 'model = "user-model"\n# >>> agent-vorcl-flow >>>\nold = true\n# <<< agent-vorcl-flow <<<\n')
  fs.writeFileSync(agents, '# User rules\n# >>> agent-vorcl-flow >>>\nstale\n# <<< agent-vorcl-flow <<<\n')

  runInstaller(root, '--codex')
  const firstConfig = fs.readFileSync(config, 'utf8')
  const firstAgents = fs.readFileSync(agents, 'utf8')
  runInstaller(root, '--codex')

  assert.equal(fs.readFileSync(config, 'utf8'), firstConfig)
  assert.equal(fs.readFileSync(agents, 'utf8'), firstAgents)
  assert.match(firstConfig, /^model = "user-model"/)
  assert.doesNotMatch(firstConfig, /old = true/)
  assert.match(firstConfig, /\[mcp_servers\.github\]/)
  assert.match(firstAgents, /^# User rules/)
  assert.doesNotMatch(firstAgents, /\nstale\n/)
  assert.equal((firstConfig.match(/# >>> agent-vorcl-flow >>>/g) || []).length, 1)
  assert.equal(
    fs.readFileSync(path.join(root, 'skills', 'workflow', 'scripts', 'vorcl-run.mjs'), 'utf8'),
    fs.readFileSync(path.resolve('scripts/vorcl-run.mjs'), 'utf8'),
  )
  const installedLiveboard = fs.readFileSync(path.join(root, 'skills', 'liveboard', 'SKILL.md'), 'utf8')
  const canonicalLiveboard = fs.readFileSync(path.resolve('codex/skills/liveboard/SKILL.md'), 'utf8')
  assert.match(installedLiveboard, /agent-vorcl-flow project-description/)
  assert.ok(installedLiveboard.endsWith(canonicalLiveboard.slice(canonicalLiveboard.indexOf('# Liveboard'))))
  assert.equal(
    fs.readFileSync(path.join(root, 'skills', 'liveboard', 'scripts', 'server.mjs'), 'utf8'),
    fs.readFileSync(path.resolve('skills/liveboard/scripts/server.mjs'), 'utf8'),
  )
  assert.equal(
    fs.readFileSync(path.join(root, 'skills', 'init-code', 'scripts', 'inspect.mjs'), 'utf8'),
    fs.readFileSync(path.resolve('skills/init-code/scripts/inspect.mjs'), 'utf8'),
  )
  assert.equal(
    fs.readFileSync(path.join(root, 'skills', 'init-code', 'scripts', 'check-impact.mjs'), 'utf8'),
    fs.readFileSync(path.resolve('skills/init-code/scripts/check-impact.mjs'), 'utf8'),
  )
  const directSkill = fs.readFileSync(path.join(root, 'skills', 'backend-create-api', 'SKILL.md'), 'utf8')
  assert.match(directSkill, /agent-vorcl-flow project-description/)
  assert.match(directSkill, /PROJECT_DESCRIPTION\.md/)
  assert.match(directSkill, /--external/)
})

test('manual Codex entrypoint delegates to the single installer implementation', () => {
  const source = fs.readFileSync(path.resolve('codex/scripts/install.sh'), 'utf8')
  assert.match(source, /exec node "\$PKG_ROOT\/bin\/install\.mjs" --codex/)
  assert.doesNotMatch(source, /cp -R|config\.toml.*>>/)
})

test('Cursor and Kimi receive the same role set and shared workflow/runtime assets', (t) => {
  const root = temporaryHome(t)
  const roles = JSON.parse(fs.readFileSync(path.resolve('scripts/roles.json'), 'utf8')).roles.map(({ id }) => id)

  runInstaller(root, '--cursor')
  runInstaller(root, '--kimi')

  for (const skillsDir of [path.join(root, '.cursor', 'skills'), path.join(root, '.kimi', 'skills')]) {
    for (const role of roles) assert.ok(fs.existsSync(path.join(skillsDir, role, 'SKILL.md')), `${skillsDir}: missing ${role}`)
    assert.ok(fs.existsSync(path.join(skillsDir, 'workflow', 'scripts', 'vorcl-run.mjs')))
    assert.ok(fs.existsSync(path.join(skillsDir, 'liveboard', 'scripts', 'server.mjs')))
    assert.ok(fs.existsSync(path.join(skillsDir, 'init-code', 'scripts', 'inspect.mjs')))
    assert.ok(fs.existsSync(path.join(skillsDir, 'init-code', 'scripts', 'check-impact.mjs')))
    assert.ok(fs.existsSync(path.join(skillsDir, 'init-code', 'scripts', 'validate-description.mjs')))
    const directSkill = fs.readFileSync(path.join(skillsDir, 'frontend-create-component', 'SKILL.md'), 'utf8')
    assert.match(directSkill, /agent-vorcl-flow project-description/)
    assert.match(directSkill, /A proven stale description blocks completion/)
  }
  assert.ok(fs.existsSync(path.join(root, '.cursor', 'agents', 'avf-backend.md')))
  assert.ok(fs.existsSync(path.join(root, '.kimi', 'agents', 'avf-expo-mobile.yaml')))
})

test('Codex install omits AVF TOML tables already owned by the user', (t) => {
  const root = temporaryHome(t)
  const codexDir = path.join(root, 'codex')
  fs.mkdirSync(codexDir, { recursive: true })
  const config = path.join(codexDir, 'config.toml')
  fs.writeFileSync(config, '[mcp_servers.github]\ncommand = "custom-github"\n')

  runInstaller(root, '--codex')

  const installed = fs.readFileSync(config, 'utf8')
  assert.equal((installed.match(/\[mcp_servers\.github\]/g) || []).length, 1)
  assert.match(installed, /command = "custom-github"/)
  assert.match(installed, /\[mcp_servers\.filesystem\]/)
})

test('Codex install refuses a malformed marked block without changing the config', (t) => {
  const root = temporaryHome(t)
  const codexDir = path.join(root, 'codex')
  fs.mkdirSync(codexDir, { recursive: true })
  const config = path.join(codexDir, 'config.toml')
  const malformed = 'model = "user-model"\n# >>> agent-vorcl-flow >>>\nunterminated = true\n'
  fs.writeFileSync(config, malformed)

  const result = spawnSync(process.execPath, [installer, '--codex'], {
    cwd: path.resolve('.'),
    encoding: 'utf8',
    env: {
      ...process.env,
      HOME: root,
      USERPROFILE: root,
      PATH: root,
      AGENT_VORCL_HOME: path.join(root, 'avf'),
      CODEX_HOME: codexDir,
      AVF_SKILLS_DIR: path.join(root, 'skills'),
      NO_COLOR: '1',
    },
  })

  assert.equal(result.status, 1)
  assert.match(result.stderr, /повреждён marked block/)
  assert.equal(fs.readFileSync(config, 'utf8'), malformed)
})
