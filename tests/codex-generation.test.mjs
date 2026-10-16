import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

const generator = path.resolve('scripts/generate-codex-skills.mjs')

test('all shipped Codex prompts match the canonical source of truth', () => {
  assert.match(execFileSync(process.execPath, [generator], { encoding: 'utf8' }), /Codex prompts verified/)
})

test('generation preserves domain instructions, adapts routes and detects stale prompts', (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'avf-generation-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  for (const dir of ['scripts', 'agents', 'commands/demo', 'skills/demo', 'skills/example']) fs.mkdirSync(path.join(root, dir), { recursive: true })
  fs.copyFileSync(generator, path.join(root, 'scripts/generate-codex-skills.mjs'))
  fs.writeFileSync(path.join(root, 'scripts/roles.json'), JSON.stringify({ roles: [{ id: 'demo' }] }))
  fs.writeFileSync(path.join(root, 'agents/demo.md'), '---\nname: demo\ndescription: "Role: with colon"\n---\n\nUse `/demo:vorcl` and `demo`; preserve `src/demo/file.ts`, `image/foo:tag` and `https://example.test/demo:vorcl`.\n')
  fs.writeFileSync(path.join(root, 'skills/demo/SKILL.md'), '---\nname: demo\ndescription: >-\n  Multiline domain\n---\n\nDomain implementation contract.\n')
  const ordinary = '---\nname: example\ndescription: >-\n  Multiline example\n---\n\nExact domain content.\n'
  fs.writeFileSync(path.join(root, 'skills/example/SKILL.md'), ordinary)
  fs.writeFileSync(path.join(root, 'commands/demo/vorcl.md'), '---\ndescription: "Session-first"\n---\n\nGoal: $ARGUMENTS; `/demo:vorcl`.\n')
  const args = [path.join(root, 'scripts/generate-codex-skills.mjs')]
  assert.equal(spawnSync(process.execPath, args).status, 1)
  execFileSync(process.execPath, [...args, '--write'])
  const role = fs.readFileSync(path.join(root, 'codex/skills/demo/SKILL.md'), 'utf8')
  assert.match(role, /description: "Role: with colon"/)
  assert.match(role, /`\$demo-vorcl`/)
  assert.match(role, /Domain implementation contract/)
  assert.doesNotMatch(role, /\$\$/)
  assert.match(role, /`image\/foo:tag`/)
  assert.match(role, /`https:\/\/example\.test\/demo:vorcl`/)
  assert.match(role, /`src\/demo\/file.ts`/)
  assert.equal(fs.readFileSync(path.join(root, 'codex/skills/example/SKILL.md'), 'utf8'), ordinary)
  assert.equal(spawnSync(process.execPath, args).status, 0)
  fs.appendFileSync(path.join(root, 'codex/skills/demo/SKILL.md'), '\nUnreviewed policy drift.\n')
  assert.equal(spawnSync(process.execPath, args).status, 1)
})
