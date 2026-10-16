import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const read = (file) => fs.readFileSync(file, 'utf8')

test('universal orchestrators require scoped IDs and atomic claim', () => {
  for (const file of ['skills/workflow/SKILL.md', 'codex/skills/workflow/SKILL.md', 'commands/vorcl.md', 'codex/skills/vorcl/SKILL.md']) {
    const source = read(file)
    assert.match(source, /scoped run/i, file)
    assert.match(source, /claim/i, file)
    assert.match(source, /Bare `next_task`.*запрещ/i, file)
  }
})

test('verification route cannot author acceptance tests or close tasks', () => {
  const claude = read('commands/testing/verify.md')
  const codex = read('codex/skills/testing-verify/SKILL.md')

  assert.doesNotMatch(claude, /^allowed-tools:/m)
  assert.match(claude, /Checker работает report-only/)
  assert.match(claude, /не меняет implementation, acceptance tests, документы или tracker state/)
  for (const source of [claude, codex]) {
    assert.match(source, /Checker.*не пишет|Checker их не пишет/)
    assert.match(source, /Статус меняет только Orchestrator|статус меняет только Orchestrator/)
    assert.doesNotMatch(source, /можно `set_task_status/)
  }
})

test('read-only roles default to report-only task semantics', () => {
  for (const file of ['agents/analyzer.md', 'codex/skills/analyzer/SKILL.md', 'agents/security.md', 'codex/skills/security/SKILL.md']) {
    const source = read(file)
    assert.match(source, /По умолчанию.*report-only|по умолчанию `report-only`/i, file)
    assert.match(source, /track-only/, file)
  }
})

test('role entrypoints default to session planning and preserve opt-in scoped tracking', () => {
  const { roles } = JSON.parse(read('scripts/roles.json'))
  for (const { id } of roles) {
    for (const file of [`commands/${id}/vorcl.md`, `codex/skills/${id}-vorcl/SKILL.md`]) {
      const source = read(file)
      assert.match(source, /session-first/, file)
      assert.match(source, /только по явному выбору пользователя/, file)
      assert.match(source, /atomic claim перед `in-progress`/, file)
      assert.match(source, /Bare `next_task` запрещён/, file)
      assert.match(source, /независим.*Checker|Независимый Checker/, file)
      assert.doesNotMatch(source, /если нет — `task-master init`|`next_task`\s*→|ВСЕГДА.*Task Master/, file)
    }
  }
})

test('roles inherit the host model and discover connections without a fixed tool whitelist', () => {
  const { roles } = JSON.parse(read('scripts/roles.json'))
  for (const { id, readonly, skillHints } of roles) {
    const source = read(`agents/${id}.md`)
    const frontmatter = source.match(/^---\n([\s\S]*?)\n---/)[1]
    assert.doesNotMatch(frontmatter, /^(model|tools):/m, id)
    assert.match(frontmatter, /^skills: \[workflow\]$/m, id)
    assert.match(source, /имена серверов и tool prefixes у пользователя могут отличаться/, id)
    assert.equal(typeof readonly, 'boolean', id)
    assert.ok(Array.isArray(skillHints), id)
    assert.ok(!skillHints.includes('task-master'), id)
  }
  assert.equal(roles.find(({ id }) => id === 'analyzer').readonly, true)
  assert.equal(roles.find(({ id }) => id === 'testing').readonly, false)
  assert.equal(roles.find(({ id }) => id === 'swagger').readonly, false)
})

test('report-only audit routes never auto-create tracker state', () => {
  for (const file of ['commands/audit.md', 'skills/project-audit/SKILL.md', 'skills/project-audit/references/audit-playbook.md']) {
    const source = read(file)
    assert.match(source, /report-only/)
    assert.doesNotMatch(source, /создай Task Master tasks|Create tasks for confirmed|Markdown file and Task Master metadata|Создай\/получи Task Master/)
  }
  for (const dir of ['analyzer', 'integrity', 'security']) {
    for (const file of fs.readdirSync(`commands/${dir}`).filter((name) => name.endsWith('.md') && name !== 'vorcl.md')) {
      assert.doesNotMatch(read(`commands/${dir}/${file}`), /`add_task`/, `${dir}/${file}`)
    }
  }
})

test('Task Master adapter cannot initialize or switch providers as a prerequisite', () => {
  const source = read('skills/task-master/SKILL.md')
  assert.match(source, /только если пользователь явно выбрал/)
  assert.match(source, /Наличие.*не является выбором/)
  assert.match(source, /не меняй MCP registration/)
  assert.match(source, /только если пользователь отдельно попросил инициализацию/)
  assert.match(source, /providers.*models.*сохраняются по умолчанию/)
  assert.match(source, /не повторяй add\/parse\/status вслепую/)
  assert.match(read('commands/task-master/provider.md'), /только явно запрошенное изменение/)
})

test('commands inherit host authorization instead of imposing tool overrides', () => {
  const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = `${directory}/${entry.name}`
    return entry.isDirectory() ? walk(file) : entry.name.endsWith('.md') ? [file] : []
  })
  for (const file of walk('commands')) {
    const frontmatter = read(file).match(/^---\n([\s\S]*?)\n---/)[1]
    assert.doesNotMatch(frontmatter, /^(allowed-tools|tools|model):/m, file)
  }
})
