import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const launcher = fileURLToPath(new URL('../bin/mcp-env.mjs', import.meta.url))
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'avf-launcher-test-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const home = path.join(root, 'old-avf'); fs.mkdirSync(home)
  const env = { ...process.env, AGENT_VORCL_HOME: home, AGENT_VORCL_ENV_FILE: path.join(home, '.env'), CLAUDE_PROJECT_DIR: root }
  for (const key of ['AVF_FIXTURE_SELECTED', 'AVF_FIXTURE_OTHER', 'AVF_FIXTURE_PROJECT']) delete env[key]
  fs.writeFileSync(path.join(root, '.env'), 'AVF_FIXTURE_PROJECT=project-secret\n')
  fs.writeFileSync(path.join(home, '.env'), 'AVF_FIXTURE_SELECTED=global-secret\n')
  const inspect = 'process.stdout.write(JSON.stringify({selected:process.env.AVF_FIXTURE_SELECTED??null,other:process.env.AVF_FIXTURE_OTHER??null,project:process.env.AVF_FIXTURE_PROJECT??null}))'
  return { root, env, inspect, run: (args) => spawnSync(process.execPath, [launcher, ...args], { cwd: root, env, encoding: 'utf8' }) }
}

test('legacy helper never discovers shared or project environment files', (t) => {
  const { run, inspect } = fixture(t)
  const result = run(['--', process.execPath, '-e', inspect])
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout), { selected: null, other: null, project: null })
})

test('explicit file loads only selected variables and respects the process environment', (t) => {
  const { root, env, run, inspect } = fixture(t)
  const file = path.join(root, 'selected.env')
  fs.writeFileSync(file, 'AVF_FIXTURE_SELECTED="chosen # value"\nAVF_FIXTURE_OTHER=unrelated-secret\n')
  const args = [`--avf-env-file=${file}`, '--need=AVF_FIXTURE_SELECTED', '--', process.execPath, '-e', inspect]
  const result = run(args)
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(JSON.parse(result.stdout), { selected: 'chosen # value', other: null, project: null })
  env.AVF_FIXTURE_SELECTED = 'process-wins'
  assert.equal(JSON.parse(run(args).stdout).selected, 'process-wins')
})

test('missing configuration and invalid options fail without launching the command', (t) => {
  const { root, run } = fixture(t)
  const marker = path.join(root, 'executed')
  const command = [process.execPath, '-e', `require('node:fs').writeFileSync(${JSON.stringify(marker)},'bad')`]
  for (const options of [['--need=AVF_FIXTURE_MISSING'], ['--unknown'], ['--avf-env-file=relative.env', '--need=AVF_FIXTURE_SELECTED']]) {
    const result = run([...options, '--', ...command])
    assert.equal(result.status, 2, result.stderr)
    assert.equal(fs.existsSync(marker), false)
  }
})
