import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

import { routeWorkspace } from '../skills/workspace-capability-routing/scripts/route.mjs'

const root = path.resolve('.')

function fixture(t, packageJson) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'avf-route-'))
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }))
  if (packageJson) fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify(packageJson))
  return directory
}

test('capability catalog is complete and reproducible', () => {
  const result = spawnSync(process.execPath, ['scripts/generate-capability-catalog.mjs'], { cwd: root, encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'skills/workspace-capability-routing/references/capability-catalog.json'), 'utf8'))
  const registry = JSON.parse(fs.readFileSync(path.join(root, 'scripts/roles.json'), 'utf8'))
  const skillNames = fs.readdirSync(path.join(root, 'skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(root, 'skills', entry.name, 'SKILL.md')))
    .map((entry) => entry.name).sort()
  assert.deepEqual(catalog.roles.map((role) => role.id), registry.roles.map((role) => role.id))
  assert.deepEqual(catalog.skills.map((skill) => skill.name).sort(), skillNames)
})

test('routes Expo Liquid Glass screen to mobile skills and compatibility', (t) => {
  const directory = fixture(t, { dependencies: { expo: '57.0.0', 'react-native': '0.86.0', '@callstack/liquid-glass': '0.8.1' } })
  const route = routeWorkspace(directory, 'Create an Expo mobile screen with Liquid Glass')
  assert.equal(route.primaryRole, 'expo-mobile')
  for (const skill of ['expo-mobile-architecture', 'expo-ui-design-motion', 'mobile-thumb-zones', 'react-native-liquid-glass', 'expo-mobile-compatibility']) assert.ok(route.skillHints.includes(skill), `missing ${skill}`)
})

test('routes responsive web UI to frontend thumb ergonomics', (t) => {
  const directory = fixture(t, { dependencies: { next: '16.0.0', react: '19.0.0', 'react-dom': '19.0.0' } })
  const route = routeWorkspace(directory, 'Build a responsive mobile checkout screen')
  assert.equal(route.primaryRole, 'frontend')
  assert.ok(route.skillHints.includes('mobile-thumb-zones'))
  assert.ok(!route.skillHints.includes('react-native-liquid-glass'))
})

test('requested video artifact wins over incidental Node backend signals', (t) => {
  const directory = fixture(t, { dependencies: { express: '5.0.0', remotion: '4.0.0' } })
  const route = routeWorkspace(directory, 'Create and render an MP4 product video')
  assert.equal(route.primaryRole, 'design-studio')
  assert.ok(route.skillHints.includes('animate'))
  assert.ok(!route.skillHints.includes('backend-architecture'))
})

test('backend-only API remains free of mobile skill noise', (t) => {
  const directory = fixture(t, { dependencies: { fastify: '5.0.0' } })
  const route = routeWorkspace(directory, 'Add an HTTP API endpoint')
  assert.equal(route.primaryRole, 'backend')
  assert.ok(route.skillHints.includes('backend-architecture'))
  assert.ok(!route.skillHints.includes('mobile-thumb-zones'))
  assert.ok(!route.skillHints.includes('react-native-liquid-glass'))
})

test('explicit greenfield Expo intent works without existing mobile dependencies', (t) => {
  const directory = fixture(t, null)
  const route = routeWorkspace(directory, 'Design an Expo screen for one-handed use')
  assert.equal(route.primaryRole, 'expo-mobile')
  assert.ok(route.skillHints.includes('mobile-thumb-zones'))
})

test('Expo audit hands off mobile reachability and compatibility checks', (t) => {
  const directory = fixture(t, { dependencies: { expo: '57.0.0', 'react-native': '0.86.0' } })
  const route = routeWorkspace(directory, 'Audit the Expo mobile screen reachability and native compatibility')
  assert.ok(['analyzer', 'architect'].includes(route.primaryRole))
  assert.ok(route.supportingRoles.includes('expo-mobile'))
  for (const skill of ['expo-mobile-audit', 'expo-mobile-ui-audit', 'mobile-thumb-zones', 'expo-mobile-compatibility']) {
    assert.ok(route.skillHints.includes(skill), `missing ${skill}`)
  }
})

test('skills are attached only to relevant agents', () => {
  const read = (name) => fs.readFileSync(path.join(root, `agents/${name}.md`), 'utf8')
  for (const role of ['frontend', 'expo-mobile', 'design-studio', 'screenshot']) assert.match(read(role), /mobile-thumb-zones/)
  assert.match(read('expo-mobile'), /react-native-liquid-glass/)
  for (const role of ['architect', 'analyzer']) assert.match(read(role), /workspace-capability-routing/)
  for (const role of ['backend', 'database', 'devops']) {
    assert.doesNotMatch(read(role), /mobile-thumb-zones/)
    assert.doesNotMatch(read(role), /react-native-liquid-glass/)
  }
})

const mixedPackage = { dependencies: { expo: '*', 'react-native': '*', next: '*', express: '*', '@callstack/liquid-glass': '*' } }
const routingCases = [
  ['README over application stack', 'Update the README for this Next.js application', 'docs'],
  ['Russian README over stack', 'Перепиши README приложения Expo', 'docs'],
  ['Russian natural README request', 'Сделай README для Next.js', 'docs'],
  ['Russian documentation noun request', 'Улучшение документации приложения Next.js', 'docs'],
  ['Russian README noun request', 'Обновление README для Next.js', 'docs'],
  ['README about full current architecture', 'Update README about the complete current architecture', 'docs'],
  ['API implementation using README', 'Fix API endpoint based on README instructions', 'backend'],
  ['API path is not an explicit role', 'Implement a backend API endpoint /docs', 'backend'],
  ['nested API path is not an explicit role', 'Implement a backend API endpoint /render/status', 'backend'],
  ['unknown slash command is not an explicit role', '/docs:not-a-command implement a backend HTTP API endpoint', 'backend'],
  ['command prefix in an API path is not an invocation', 'Implement a backend API endpoint /docs:readme/status', 'backend'],
  ['Russian API using README', 'Сделай серверный эндпоинт согласно README', 'backend'],
  ['architecture prose is documentation', 'Write architecture documentation for the existing application', 'docs'],
  ['API documentation is documentation', 'Document the HTTP API endpoint', 'docs'],
  ['API implementation over Next', 'Add an HTTP API endpoint to the Next.js and Express application', 'backend'],
  ['Russian server API', 'Реализуй серверный эндпоинт авторизации в приложении Expo', 'backend'],
  ['API tests as an incidental check', 'Add an HTTP API endpoint and unit tests', 'backend'],
  ['README used only as context', 'Read README as reference, then implement an HTTP API endpoint', 'backend'],
  ['database schema over mobile', 'Design the PostgreSQL schema for an Expo app', 'database'],
  ['database index over mobile', 'Add a database index for the mobile screen query', 'database'],
  ['Russian database index', 'Добавь индекс таблицы PostgreSQL для приложения Expo', 'database'],
  ['Russian schema', 'Измени схему БД приложения Expo', 'database'],
  ['CI over backend', 'Create a GitHub Actions CI pipeline for Express', 'devops'],
  ['Docker over backend', 'Add a Dockerfile for the Express API service', 'devops'],
  ['Russian Docker', 'Настрой Docker Compose для сервиса Express', 'devops'],
  ['git release', 'Prepare a git release and changelog', 'gitflow'],
  ['Russian release', 'Подготовь релиз npm пакета', 'gitflow'],
  ['complete current package owns formats', 'Create a full multi-language current architecture package with MD, JSON, HTML, draw.io and Mermaid', 'principal-architect'],
  ['Russian current package', 'Создай полный многоязычный пакет текущей архитектуры с Mermaid', 'principal-architect'],
  ['target architecture', 'Design the target system architecture for a new commerce platform', 'architect'],
  ['Russian target architecture', 'Спроектируй целевую архитектуру новой системы', 'architect'],
  ['focused Pino architecture', 'Review the Pino structured logging architecture', 'logging'],
  ['Russian focused Pino architecture', 'Проверь архитектуру структурированного логирования Pino', 'logging'],
  ['broad audit including Pino', 'Audit code quality across the whole repository, including Pino logging', 'analyzer'],
  ['Pino architecture documentation', 'Write documentation about the Pino architecture', 'docs'],
  ['lightweight map', 'Create a lightweight TS/JS architecture dependency map', 'archmap'],
  ['Russian lightweight map', 'Создай лёгкую карту зависимостей архитектуры TS/JS', 'archmap'],
  ['targeted hardcode audit', 'Audit hardcoded mock data for production leakage', 'integrity'],
  ['Russian targeted integrity', 'Найди хардкод и заглушки, достигающие production', 'integrity'],
  ['broad audit owns mixed findings', 'Audit code quality across the whole repository, including mock data and OWASP', 'analyzer'],
  ['Russian broad audit', 'Проведи комплексный аудит качества кода всего проекта', 'analyzer'],
  ['targeted security', 'Audit OWASP and CVE exposure in the Expo app', 'security'],
  ['Russian security', 'Проведи аудит безопасности и уязвимостей', 'security'],
  ['security narrative in README', 'Write README documentation about the security audit', 'docs'],
  ['security fixes need implementer', 'Fix the CVE in the HTTP API endpoint', 'backend'],
  ['existing screenshot source', 'Locate the existing component file:line from this screenshot', 'pinpoint'],
  ['Russian screenshot source', 'Найди существующий исходник по скриншоту', 'pinpoint'],
  ['screenshot to new UI', 'Recreate this screenshot as new UI', 'screenshot'],
  ['Russian screenshot to UI', 'Создай новый интерфейс по скриншоту', 'screenshot'],
  ['visual identification', 'Identify which website this screenshot shows with live web evidence', 'visual-research'],
  ['native drawio artifact', 'Create a native draw.io system diagram', 'drawio'],
  ['Russian drawio', 'Создай нативную диаграмму draw.io', 'drawio'],
  ['Mermaid artifact', 'Create a Mermaid sequence diagram of the API', 'mermaid'],
  ['Russian Mermaid', 'Построй диаграмму последовательности Mermaid', 'mermaid'],
  ['Mermaid mention in documentation', 'Update README examples about Mermaid diagrams', 'docs'],
  ['web research over backend', 'Search the web for official API documentation', 'firecrawl'],
  ['Russian web research', 'Найди в интернете актуальные сведения о SDK', 'firecrawl'],
  ['Expo animation is UI work', 'Animate an Expo button and screen transition', 'expo-mobile', ['animate-expo']],
  ['Russian Expo motion', 'Добавь анимацию кнопки Expo', 'expo-mobile', ['animate-expo']],
  ['web animation is UI work', 'Animate the button in the Next.js web UI', 'frontend', ['animate']],
  ['negated video', 'Do not create a video; animate the Expo button', 'expo-mobile', ['animate-expo']],
  ['Russian negated video', 'Не создавай видео, добавь анимацию кнопки Expo', 'expo-mobile', ['animate-expo']],
  ['actual video deliverable', 'Create and render an MP4 product video', 'design-studio', ['animate']],
  ['video export may demonstrate UI', 'Create and export an MP4 video showing the checkout UI', 'design-studio', ['animate']],
  ['Russian video may demonstrate UI', 'Создай MP4 ролик с демонстрацией кнопки интерфейса', 'design-studio', ['animate']],
  ['video player UI is still UI', 'Create a Next.js video player UI with MP4 playback', 'frontend'],
  ['glass documentation', 'Update README about Liquid Glass support', 'docs'],
  ['glass schema', 'Change the database schema for the Liquid Glass mobile screen', 'database'],
  ['glass backend', 'Implement HTTP API endpoint for Liquid Glass preferences', 'backend'],
  ['focused API tests', 'Write integration tests for the HTTP API endpoint', 'testing'],
  ['Russian API tests', 'Напиши интеграционные тесты для API', 'testing'],
  ['OpenAPI coverage', 'Audit OpenAPI specification coverage', 'swagger'],
  ['explicit command owner', '$backend-refactor improve this implementation', 'backend'],
  ['explicit slash command owner', '/docs:readme update project overview', 'docs'],
  ['explicit role in Russian', 'Используй роль database для этой задачи', 'database'],
  ['negated role', 'Do not use $security; implement an HTTP API endpoint', 'backend'],
]

for (const [label, goal, primaryRole, expectedSkills = []] of routingCases) {
  test(`deliverable-first routing: ${label}`, (t) => {
    const directory = fixture(t, mixedPackage)
    const route = routeWorkspace(directory, goal)
    assert.equal(route.primaryRole, primaryRole, JSON.stringify(route, null, 2))
    assert.ok(route.routingReason.length > 20)
    for (const skill of expectedSkills) assert.ok(route.skillHints.includes(skill), `missing ${skill}`)
    if (!['expo-mobile', 'analyzer'].includes(primaryRole)) {
      assert.ok(!route.skillHints.includes('react-native-liquid-glass'), 'unrelated Liquid Glass dependency polluted the request')
      assert.ok(!route.supportingRoles.includes('expo-mobile'), 'mobile dependency alone added a supporting owner')
    }
  })
}

test('explicit catalog roles are recognized without inventing names or hints', (t) => {
  const directory = fixture(t, null)
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'skills/workspace-capability-routing/references/capability-catalog.json'), 'utf8'))
  const roles = new Set(catalog.roles.map(({ id }) => id))
  const available = new Set(catalog.skills.map(({ name }) => name))
  for (const role of roles) {
    const commandDirectory = path.join(root, 'commands', role)
    if (fs.existsSync(commandDirectory)) for (const file of fs.readdirSync(commandDirectory)) if (file.endsWith('.md')) available.add(`${role}-${file.slice(0, -3)}`)
    const route = routeWorkspace(directory, `$${role} handle the requested task`)
    assert.equal(route.primaryRole, role)
    assert.equal(route.matchedRule, 'explicit-role')
    assert.ok(roles.has(route.checkerRole))
    for (const hint of route.skillHints) assert.ok(available.has(hint), `invented hint: ${hint}`)
  }
  for (const [, goal] of routingCases) {
    const route = routeWorkspace(directory, goal)
    assert.ok(roles.has(route.primaryRole))
    for (const hint of route.skillHints) assert.ok(available.has(hint), `invented hint: ${hint}`)
  }
})

test('ambiguous goals expose a provisional fallback and multiple explicit owners', (t) => {
  const directory = fixture(t, mixedPackage)
  const route = routeWorkspace(directory, 'Improve things')
  assert.equal(route.primaryRole, 'architect')
  assert.equal(route.matchedRule, 'workspace-fallback')
  assert.ok(route.uncertainties.some((value) => value.includes('Multiple application surfaces')))
  assert.deepEqual(route, routeWorkspace(directory, 'Improve things'))
  const selected = routeWorkspace(directory, '$backend and $database coordinate')
  assert.equal(selected.primaryRole, 'backend')
  assert.ok(selected.uncertainties.some((value) => value.includes('Multiple roles')))
})

test('malformed manifests do not hide nested valid evidence; ignored directories and symlinks are not read', (t) => {
  const directory = fixture(t, null)
  fs.writeFileSync(path.join(directory, 'package.json'), '{broken')
  for (const relative of ['apps/api', 'node_modules/unrelated', '.agent-vorcl/state', '.taskmaster', 'vendor/demo']) {
    fs.mkdirSync(path.join(directory, relative), { recursive: true })
    fs.writeFileSync(path.join(directory, relative, 'package.json'), JSON.stringify({ dependencies: { [relative === 'apps/api' ? 'fastify' : 'expo']: '*' } }))
  }
  const external = fixture(t, { dependencies: { next: '*' } })
  fs.symlinkSync(external, path.join(directory, 'symlink-app'), 'dir')
  const route = routeWorkspace(directory, '')
  assert.deepEqual(route.systems, ['backend'])
  assert.equal(route.primaryRole, 'backend')
  assert.ok(route.workspaceEvidence.includes('apps/api/package.json: fastify'))
  assert.ok(route.uncertainties.some((value) => value.includes('Malformed')))
  assert.ok(route.uncertainties.some((value) => value.includes('Goal is empty')))
})

test('infrastructure and non-JavaScript work keep explicit outcomes without pretending stack detection', (t) => {
  const directory = fixture(t, null)
  fs.mkdirSync(path.join(directory, '.github/workflows'), { recursive: true })
  fs.writeFileSync(path.join(directory, '.github/workflows/ci.yml'), 'name: test\n')
  fs.writeFileSync(path.join(directory, 'Dockerfile'), 'FROM scratch\n')
  fs.writeFileSync(path.join(directory, 'pyproject.toml'), '[project]\nname = "api"\n')
  const route = routeWorkspace(directory, 'Implement an HTTP API endpoint in Python')
  assert.equal(route.primaryRole, 'backend')
  assert.deepEqual(route.systems, ['infrastructure'])
  assert.ok(route.workspaceEvidence.includes('.github/workflows/ci.yml'))
  assert.ok(route.uncertainties.some((value) => value.includes('non-JavaScript')))
})

test('standalone installed script resolves command hints from sibling skill metadata', (t) => {
  const installation = fixture(t, null)
  const skill = path.join(installation, 'skills/workspace-capability-routing')
  fs.mkdirSync(path.join(skill, 'scripts'), { recursive: true })
  fs.mkdirSync(path.join(skill, 'references'), { recursive: true })
  for (const file of ['scripts/route.mjs', 'references/capability-catalog.json']) fs.copyFileSync(path.join(root, 'skills/workspace-capability-routing', file), path.join(skill, file))
  for (const name of ['analyzer-audit', 'expo-mobile-audit', 'expo-mobile-ui-audit', 'expo-mobile-compatibility']) {
    const destination = path.join(installation, 'skills', name)
    fs.mkdirSync(destination, { recursive: true })
    fs.writeFileSync(path.join(destination, 'SKILL.md'), `---\nname: ${JSON.stringify(name)}\ndescription: Installed task command\n---\n`)
  }
  const directory = fixture(t, { dependencies: { expo: '*', '@callstack/liquid-glass': '*' } })
  const command = [path.join(skill, 'scripts/route.mjs'), '--root', directory, '--goal', 'Audit Expo mobile screen compatibility']
  const result = spawnSync(process.execPath, command, { encoding: 'utf8', cwd: installation })
  assert.equal(result.status, 0, result.stderr)
  const route = JSON.parse(result.stdout)
  assert.deepEqual(route, routeWorkspace(directory, 'Audit Expo mobile screen compatibility'))
  fs.writeFileSync(path.join(installation, 'skills/expo-mobile-audit/SKILL.md'), '---\nname: unrelated\n---\n')
  const mismatched = spawnSync(process.execPath, command, { encoding: 'utf8', cwd: installation })
  assert.equal(mismatched.status, 0, mismatched.stderr)
  assert.ok(!JSON.parse(mismatched.stdout).skillHints.includes('expo-mobile-audit'))
})

test('CLI reports missing arguments and invalid roots without stack traces', (t) => {
  const directory = fixture(t, null)
  const script = path.join(root, 'skills/workspace-capability-routing/scripts/route.mjs')
  for (const args of [['--goal'], ['--root'], ['--format'], ['--root', '--goal', 'text'], ['--root', path.join(directory, 'missing')], ['--format', 'yaml']]) {
    const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' })
    assert.equal(result.status, 2, JSON.stringify(args))
    assert.ok(result.stderr.trim())
    assert.doesNotMatch(result.stderr, /at routeWorkspace|at main/)
  }
  const result = spawnSync(process.execPath, [script, '--root', directory, '--goal', 'Update README', '--format', 'text'], { encoding: 'utf8' })
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /Primary role: docs/)
  assert.match(result.stdout, /Reason: The requested deliverable is documentation/)
})
