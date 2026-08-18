import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const read = (file) => fs.readFileSync(file, 'utf8')

test('shared workflow makes project description maintenance a Definition of Done', () => {
  for (const file of ['skills/workflow/SKILL.md', 'codex/skills/workflow/SKILL.md']) {
    const source = read(file)
    assert.match(source, /PROJECT_DESCRIPTION maintenance/, file)
    assert.match(source, /прочитай его до изменения кода/, file)
    assert.match(source, /check-impact\.mjs/, file)
    assert.match(source, /--external/, file)
    assert.match(source, /material impact/i, file)
    assert.match(source, /stale `PROJECT_DESCRIPTION\.md`.*НЕ ГОТОВО/is, file)
    assert.match(source, /если отсутствует — не создавай автоматически/i, file)
  }
})

test('global adapter context exposes the maintenance rule without duplicating role prompts', () => {
  assert.match(read('codex/AGENTS.md'), /every modifying role reads it before work/)
  assert.match(read('scripts/session-start.js'), /PROJECT_DESCRIPTION\.md.*прочитай до правок/)
  for (const file of fs.readdirSync('agents').filter((name) => name.endsWith('.md'))) {
    assert.match(read(`agents/${file}`), /workflow/, file)
  }
})

test('installer injects maintenance context into direct Cursor and Kimi skills', () => {
  const source = read('bin/install.mjs')
  assert.match(source, /injectProjectDescriptionContract/)
  assert.match(source, /A proven stale description blocks completion/)
  assert.match(source, /--external/)
})

test('independent checker blocks proven description drift but cannot edit it', () => {
  for (const file of ['commands/testing/verify.md', 'codex/skills/testing-verify/SKILL.md']) {
    const source = read(file)
    assert.match(source, /material context change/, file)
    assert.match(source, /validate-description\.mjs/, file)
    assert.match(source, /НЕ ГОТОВО/, file)
    assert.match(source, /Checker документ не редактирует/, file)
  }
  assert.match(read('commands/testing/verify.md'), /allowed-tools: Read, Bash, Grep, Glob/)
})
