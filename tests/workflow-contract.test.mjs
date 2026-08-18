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

  assert.match(claude, /allowed-tools: Read, Bash, Grep, Glob/)
  assert.doesNotMatch(claude, /allowed-tools:.*(?:Write|Edit)/)
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
