#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const IGNORE = new Set(['.git', '.next', '.nuxt', '.output', '.taskmaster', '.agent-vorcl', '.turbo', 'build', 'coverage', 'dist', 'node_modules', 'target', 'vendor'])

function parseArgs(argv) {
  const result = { root: process.cwd(), goal: '', format: 'json' }
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index]
    if (['--root', '--goal', '--format'].includes(value)) {
      const next = argv[++index]
      if (next === undefined || next.startsWith('--')) throw new Error(`${value} requires a value`)
      result[value.slice(2)] = next
    }
    else if (value === '--help' || value === '-h') return { help: true }
    else throw new Error(`unknown argument: ${value}`)
  }
  if (!result.root) throw new Error('--root requires a path')
  if (!['json', 'text'].includes(result.format)) throw new Error('--format must be json or text')
  return result
}

function walk(root, directory = root, depth = 0, files = []) {
  if (depth > 5) return files
  for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink() || (entry.isDirectory() && IGNORE.has(entry.name))) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(root, absolute, depth + 1, files)
    else if (entry.isFile()) files.push(path.relative(root, absolute).split(path.sep).join('/'))
  }
  return files
}

function packageInventory(root, files) {
  const packages = []
  for (const relative of files.filter((file) => path.basename(file) === 'package.json')) {
    try {
      const value = JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'))
      const dependencies = Object.keys({ ...value.dependencies, ...value.devDependencies, ...value.peerDependencies, ...value.optionalDependencies }).sort()
      packages.push({ path: relative, name: value.name ?? null, dependencies })
    } catch {
      packages.push({ path: relative, name: null, dependencies: [], malformed: true })
    }
  }
  return packages
}

function hasAny(values, candidates) {
  return candidates.some((candidate) => values.has(candidate))
}

function pushUnique(target, values) {
  for (const value of values) if (!target.includes(value)) target.push(value)
}

// Read the bundled catalog, never a similarly named file in the inspected workspace.
// Command skills exist as source commands in a checkout and as sibling SKILL.md
// files after installation. Both layouts must produce valid, available hints.
const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const skillsRoot = path.dirname(skillRoot)
const catalog = JSON.parse(fs.readFileSync(path.join(skillRoot, 'references/capability-catalog.json'), 'utf8'))
const roleIds = new Set(catalog.roles.map(({ id }) => id))
const skillNames = new Set(catalog.skills.map(({ name }) => name))
if (!roleIds.has('architect') || !roleIds.has('testing')) throw new Error('Capability catalog is missing the fallback or checker role')

function hasSkill(name) {
  if (skillNames.has(name)) return true
  if (!/^[a-z][a-z0-9-]*$/.test(name)) return false
  const installed = path.join(skillsRoot, name, 'SKILL.md')
  if (fs.existsSync(installed)) {
    const header = fs.readFileSync(installed, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1]
    const declared = header?.match(/^name:\s*(.+?)\s*$/m)?.[1]
    if (declared === name || declared === JSON.stringify(name) || declared === `'${name}'`) return true
  }
  for (const role of roleIds) {
    if (!name.startsWith(`${role}-`)) continue
    const command = path.join(skillsRoot, '..', 'commands', role, `${name.slice(role.length + 1)}.md`)
    if (fs.existsSync(command) && /^---\r?\n[\s\S]*?^description:/m.test(fs.readFileSync(command, 'utf8'))) return true
  }
  return false
}

// This is a bounded heuristic, not a language model. Suppress explicitly negated
// clauses and report uncertainty for ambiguous fallbacks instead of claiming a
// complete semantic interpretation of arbitrary prose.
function activeGoal(goal) {
  return goal.replace(/(?:^|[,;.!\n])\s*(?:do not|don't|never|not|не нужно|не надо|не|без)(?:\s+)[^,;.!\n]*?(?=,|;|\.|!|\n|\s+but\s+|\s+но\s+|\s+а\s+|$)/gu, ' ')
}

function explicitRoles(goal) {
  const selected = []
  for (const match of goal.matchAll(/(?:^|[\s(])([$\/])([a-z][a-z0-9-]*)(?::([a-z][a-z0-9-]*))?(?![\w/:-])/g)) {
    const [, marker, name, command] = match
    // Bare /docs and /render/status may be API paths, not AVF commands.
    // A slash invocation needs a real role:command; $role is unambiguous.
    if (marker === '/') {
      if (command && roleIds.has(name) && hasSkill(`${name}-${command}`)) pushUnique(selected, [name])
      continue
    }
    if (command) continue
    const role = [...roleIds].sort((a, b) => b.length - a.length).find((id) => name === id || (name.startsWith(`${id}-`) && hasSkill(name)))
    if (role) pushUnique(selected, [role])
  }
  for (const role of roleIds) {
    if (goal.includes(`use the ${role} role`) || goal.includes(`use ${role} role`) || goal.includes(`роль ${role}`) || goal.includes(`ролью ${role}`)) pushUnique(selected, [role])
  }
  return selected
}

export function routeWorkspace(rootInput, goalInput = '') {
  const root = path.resolve(rootInput)
  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`root is not a directory: ${rootInput}`)
  const files = walk(root)
  const packages = packageInventory(root, files)
  const dependencies = new Set(packages.flatMap((item) => item.dependencies))
  const originalGoal = String(goalInput).normalize('NFKC').toLowerCase()
  const goal = activeGoal(originalGoal)
  const systems = []
  const workspaceEvidence = []
  const intentSignals = []
  const uncertainties = []
  const mobile = hasAny(dependencies, ['expo', 'expo-router', 'react-native'])
  const frontend = hasAny(dependencies, ['next', 'nuxt', 'react-dom', 'svelte', '@angular/core', 'vue'])
  const backend = hasAny(dependencies, ['@nestjs/core', 'express', 'fastify', 'hapi', 'koa', 'trpc', '@trpc/server'])
  if (mobile) systems.push('mobile')
  if (frontend) systems.push('frontend')
  if (backend) systems.push('backend')
  const infrastructure = files.filter((file) => /(^|\/)(?:Dockerfile(?:\.[^/]+)?|(?:docker-)?compose[^/]*\.ya?ml)$|^\.github\/workflows\/[^/]+\.ya?ml$/.test(file))
  if (infrastructure.length) systems.push('infrastructure')
  const signalDependencies = new Set(['expo', 'expo-router', 'react-native', 'next', 'nuxt', 'react-dom', 'svelte', '@angular/core', 'vue', '@nestjs/core', 'express', 'fastify', 'hapi', 'koa', 'trpc', '@trpc/server', '@callstack/liquid-glass', 'expo-glass-effect', 'remotion'])
  for (const item of packages) {
    const matched = item.dependencies.filter((name) => signalDependencies.has(name))
    if (matched.length) workspaceEvidence.push(`${item.path}: ${matched.join(', ')}`)
    if (item.malformed) workspaceEvidence.push(`${item.path}: malformed manifest`)
  }
  pushUnique(workspaceEvidence, infrastructure)
  for (const file of ['AGENTS.md', 'PROJECT_DESCRIPTION.md']) if (files.includes(file)) workspaceEvidence.push(file)

  const audit = /\b(audit|review|inspect|analyse|analyze)\b|аудит|ревью|провер|проанализир/.test(goal)
  const architecture = /architect|system design|архитект|проектир.*систем/.test(goal)
  const broadAudit = audit && /\b(whole|entire|broad|overall|code quality)\b|всего проекта|всего репозитория|общий аудит|качества кода|комплексн.*аудит/.test(goal)
  const native = /\b(expo|react native|ios app|android app)\b|нативн.*прилож/.test(goal)
  const webUi = /\b(web|website|browser|next(?:\.js)?|react dom|html|css)\b|веб|браузер/.test(goal)
  const ui = /\b(ui|ux|responsive|screen|button|component|layout|gesture|thumb|touch|tap|sheet|transition|checkout)\b|интерфейс|экран|кнопк|жест|верстк|вёрстк/.test(goal)
  const mobileUi = ui && /\b(mobile|responsive|thumb|touch|tap|ios|android|expo|react native|one-handed)\b|мобил|экран|палец|жест|одной рук/.test(goal)
  const motion = /\b(animat(?:e|ion|ions)|motion|transition|gesture|haptic)\b|анимац|переход.*экран|жест/.test(goal)
  const compatibility = /\bcompatib|совместим|поддержк.*(?:ios|android)|(?:ios|android).*поддержк/.test(goal)
  const glassRequested = /liquid[ -]?glass|glass effect|жидк.*стек|стеклян/.test(goal)
  const screenshot = /\bscreenshot\b|скриншот|снимк.*экран/.test(goal)
  const sourceLocation = /\b(locate|find|trace|existing|source|file:line)\b|найди|найти|исходник|существующ|файл.*строк/.test(goal)
  const fullCurrentArchitecture = architecture && /\b(current|existing|as-is)\b|текущ|существующ/.test(goal) && /\b(full|complete|multi-language|package)\b|полн|многоязыч|пакет/.test(goal)
  const documentation = /\b(?:write|update|edit|rewrite|translate|proofread|review|audit|improve|create|make|fix)\s+(?:(?:the|a|an|our|this|project|api|architecture|security|developer|installation|existing|new|complete|full)\s+){0,5}(?:readme|contributing|documentation|docs|release notes|user guide)\b|\b(?:document|explain)\b|(?:напиши|написать|обнови|обновить|перепиши|переведи|создай|сделай|исправь|проверь|улучши|улучшение|обновление|переработка|перевод|написание|создание)\s+(?:(?:новую|новый|полную|полный|подробную|подробный|существующую|проектную|техническую|api)\s+){0,4}(?:readme|документац|документ|руководств)|документиру|описание api|^\s*(?:readme|documentation|документация)(?:\s|$)/.test(goal)
  const targetedIntegrity = /hardcod|mock[ -]?data|production leakage|хардкод|мок[ -]?данн|моков|заглушк|тестов.*данн.*прод/.test(goal)
  const targetedSecurity = /\b(security|owasp|cve|secrets?|pii|vulnerabilit(?:y|ies))\b|безопасност|уязвим|секрет.*утеч|утеч.*секрет/.test(goal)
  const remediation = /\b(fix|patch|remediate|implement|remove)\b|исправ|устрани|устранить|удали|реализ/.test(goal)
  const api = /\b(api endpoint|http api|rest api|rest endpoint|graphql|backend|server[- ]side|endpoint|business logic)\b|серверн|бэкенд|бекенд|эндпоинт|бизнес-логик/.test(goal)
  const databaseWork = /\b(?:sql|postgres(?:ql)?|mongodb|redis|database|schema migration|database index|query plan)\b|баз[аыуе] данных|схем.*(?:бд|данных)|индекс.*(?:бд|таблиц)|миграц.*(?:бд|баз|схем)|sql[ -]?запрос/.test(goal)
  const devopsWork = /\b(docker(?:file)?|compose|ci\/cd|github actions|ci pipeline|build pipeline)\b|контейнеризац|пайплайн|настрой.*(?:ci|сборк)/.test(goal)
  const releaseWork = /\b(commit|pull request|git release|npm release|publish|changelog|gitflow)\b|\b(?:tag|ship|prepare|cut)\b[^.;\n]{0,20}\brelease\b|коммит|пул[ -]?реквест|(?:подготов|выпус|опублику)[^.;\n]{0,30}релиз/.test(goal)
  const videoExport = /\bexport\b[^.;\n]{0,30}\b(?:video|movie|mp4|webm|mov)\b|\b(?:create|make|produce|render)\s+(?:(?:a|an|the|new|short|product|demo)\s+){0,4}(?:mp4|webm|mov)\b|(?:создай|создать|сделай|экспортируй|экспортировать|отрендери)\s+(?:(?:новый|короткий|демонстрационный)\s+){0,3}(?:mp4|webm|mov|видео|ролик)/.test(goal)
  const videoArtifact = /\b(movie|video|motion graphic)\b|видео|ролик/.test(goal) && !ui
  const structuredLogging = /\bpino\b|structured logging|структурированн.*лог/.test(goal)
  const webResearch = /\b(web research|online research|search the web|research online|crawl|scrape)\b|исследован.*(?:сайт|интернет)|найди.*(?:интернет|сайт)|поиск.*интернет|собери.*(?:веб|сайт)|спарс/.test(goal)
  const testWork = /\b(?:write|add|create|run|fix|debug|verify)\s+(?:(?:the|new|more|failing|flaky|unit|integration|e2e|api|backend|frontend|automated)\s+){0,5}(?:tests?|test suite|coverage|e2e)\b|(?:напиши|добавь|запусти|исправь)\s+(?:(?:новые|интеграционные|модульные|падающие|e2e)\s+){0,3}(?:тест|покрыти)|независим.*проверк|independent verification/.test(goal)

  const rules = [
    ['current-architecture-package', fullCurrentArchitecture && !(documentation && /readme|contributing|release notes|руководств/.test(goal)), 'principal-architect', ['principal-architecture'], 'The requested artifact is a complete package of the current architecture.'],
    ['documentation', documentation, 'docs', ['technical-writing'], 'The requested deliverable is documentation.'],
    ['video-export', videoExport && !/\b(player|playback|upload)\b|плеер|воспроизвед|загруз/.test(goal), 'design-studio', ['design-studio', 'animate'], 'The requested deliverable is an exported video, even when it demonstrates UI.'],
    ['source-location', screenshot && sourceLocation, 'pinpoint', ['ui-source-mapping'], 'The screenshot must be traced to existing source.'],
    ['visual-identification', screenshot && /identify|identif|live web|what (?:site|app)|определи|что за|какой сайт/.test(goal), 'visual-research', ['visual-evidence'], 'The screenshot needs identification backed by web evidence.'],
    ['screenshot-implementation', screenshot && /build|recreat|implement|convert|new ui|создай|воссоздай|сверстай|реализ|нов.*интерфейс/.test(goal), 'screenshot', ['screenshot-to-code'], 'The requested deliverable is new UI reconstructed from a screenshot.'],
    ['drawio-artifact', /draw\.?io|\bpmp\b/.test(goal), 'drawio', ['drawio-diagrams'], 'The requested artifact is a native draw.io/PMP diagram.'],
    ['mermaid-artifact', /\bmermaid\b/.test(goal), 'mermaid', ['mermaid-diagrams', 'mermaid-rendering'], 'The requested artifact is a Mermaid diagram.'],
    ['architecture-map', architecture && /\b(lightweight|ts\/js|dependency map)\b|легк|лёгк|карт.*зависим/.test(goal), 'archmap', ['archmap'], 'The requested deliverable is a lightweight dependency map.'],
    ['integrity-audit', targetedIntegrity && !broadAudit && !remediation, 'integrity', ['code-integrity', 'hardcode-detection', 'mock-data-detection'], 'The request targets hardcode or mock data reaching production.'],
    ['security-audit', targetedSecurity && !broadAudit && !remediation, 'security', ['security-audit'], 'The request targets read-only security findings.'],
    ['web-research', webResearch, 'firecrawl', ['web-scraping'], 'The requested evidence comes from the live web.'],
    ['openapi-coverage', /\b(openapi|swagger)\b/.test(goal) && !remediation, 'swagger', ['swagger-coverage'], 'The request targets API specification or coverage.'],
    ['structured-logging', structuredLogging && !broadAudit, 'logging', ['pino-logging'], 'The request targets structured application logging.'],
    ['code-audit', audit && !remediation && (!architecture || broadAudit), 'analyzer', ['analyzer-audit'], 'The requested deliverable is a read-only code audit.'],
    ['git-release', releaseWork, 'gitflow', ['git-workflow'], 'The requested outcome is a commit, pull request or release.'],
    ['devops', devopsWork, 'devops', ['docker', 'ci-cd'], 'The requested deliverable is container or CI/CD configuration.'],
    ['database', databaseWork && !api, 'database', ['database'], 'The requested work concerns database schema, queries, migrations or indexes.'],
    ['verification', testWork, 'testing', ['testing-strategy'], 'The requested deliverable is tests or an independent verification verdict.'],
    ['target-architecture', architecture, 'architect', ['system-design'], 'The request concerns target architecture or design choices.'],
    ['backend-api', api && !ui, 'backend', ['backend-architecture'], 'The request explicitly targets server API or business logic.'],
    ['failure-boundaries', /error handling|error boundar|failure boundar|try\/catch|обработк.*ошиб|границ.*отказ/.test(goal), 'resilience', ['error-handling'], 'The request targets error handling or failure boundaries.'],
    ['render-operations', /\brender(?:\.com)?\b/.test(goal) && /deploy|hosting|logs|status|деплой|хостинг|лог|статус/.test(goal), 'render', ['render'], 'The request targets Render hosting operations.'],
    ['video-artifact', videoArtifact, 'design-studio', ['design-studio', 'animate'], 'The requested deliverable is a video artifact.'],
    ['design-artifact', /\b(design system|wireframe|slide deck|prototype)\b|дизайн-систем|вайрфрейм|прототип|презентац/.test(goal), 'design-studio', ['design-studio'], 'The requested deliverable is a product or visual design artifact.'],
    ['mobile-implementation', native || (mobile && !webUi && (ui || motion || compatibility || glassRequested)), 'expo-mobile', ['expo-mobile-architecture'], 'The request targets native mobile implementation.'],
    ['web-implementation', webUi || (frontend && ui), 'frontend', ['frontend-architecture'], 'The request targets web UI implementation.'],
    ['liveboard', /\bliveboard\b|ephemeral.*dashboard|времен.*дашборд/.test(goal), 'liveboard', ['liveboard'], 'The requested artifact is an ephemeral local work dashboard.'],
  ]
  const selected = explicitRoles(goal)
  let rule = selected.length ? ['explicit-role', true, selected[0], [], `The request explicitly selects the ${selected[0]} role.`] : rules.find(([, matches]) => matches)
  if (selected.length > 1) uncertainties.push(`Multiple roles were explicitly requested (${selected.join(', ')}); confirm their scope before handoff.`)
  if (!rule) {
    const surfaces = systems.filter((system) => system !== 'infrastructure')
    const fallback = surfaces.length === 1 ? ({ mobile: 'expo-mobile', frontend: 'frontend', backend: 'backend' })[surfaces[0]] : 'architect'
    rule = ['workspace-fallback', true, fallback, [], `No supported deliverable matched; ${fallback} is a provisional owner based on workspace evidence.`]
    uncertainties.push('No specific requested deliverable matched the routing rules; inspect the goal and entrypoints before selecting an owner.')
    if (surfaces.length > 1) uncertainties.push('Multiple application surfaces were found; dependencies alone cannot select the task owner.')
  }
  const [matchedRule, , primaryRole, baseHints, routingReason] = rule
  if (!roleIds.has(primaryRole)) throw new Error(`Unknown role in routing rule: ${primaryRole}`)
  const supportingRoles = []
  const skillHints = []
  const addSkills = (...names) => pushUnique(skillHints, names.filter(hasSkill))
  const addRole = (name) => { if (roleIds.has(name) && name !== primaryRole) pushUnique(supportingRoles, [name]) }
  addSkills(...baseHints)
  // These canonical hints also cover standalone installations without command skills.
  const defaultSkills = { architect: 'system-design', 'principal-architect': 'principal-architecture', backend: 'backend-architecture', frontend: 'frontend-architecture', 'expo-mobile': 'expo-mobile-architecture', analyzer: 'analyzer', integrity: 'code-integrity', swagger: 'swagger-coverage', firecrawl: 'web-scraping', render: 'render', database: 'database', resilience: 'error-handling', logging: 'pino-logging', screenshot: 'screenshot-to-code', 'design-studio': 'design-studio', 'visual-research': 'visual-evidence', pinpoint: 'ui-source-mapping', drawio: 'drawio-diagrams', archmap: 'archmap', mermaid: 'mermaid-diagrams', testing: 'testing-strategy', gitflow: 'git-workflow', security: 'security-audit', docs: 'technical-writing', devops: 'ci-cd', liveboard: 'liveboard' }
  if (!skillHints.length) addSkills(defaultSkills[primaryRole], primaryRole)
  if (audit) intentSignals.push('audit')
  if (architecture) intentSignals.push('architecture')
  intentSignals.push(matchedRule)

  const mobileAudit = primaryRole === 'analyzer' && (native || (mobile && mobileUi))
  if (mobileAudit) {
    addRole('expo-mobile')
    addSkills('expo-mobile-audit')
    if (mobileUi) addSkills('expo-mobile-ui-audit', 'mobile-thumb-zones')
  }
  const mobileWork = primaryRole === 'expo-mobile' || mobileAudit
  if (mobileWork && ui) {
    pushUnique(intentSignals, ['mobile-ui'])
    addSkills('expo-ui-design-motion', 'mobile-thumb-zones')
  }
  if (mobileWork && motion) addSkills('animate-expo')
  if (primaryRole === 'frontend' && mobileUi) addSkills('mobile-thumb-zones')
  if (primaryRole === 'frontend' && motion) addSkills('animate')
  // A glass dependency is evidence only when the requested work touches native UI.
  const liquid = mobileWork && (ui || compatibility || glassRequested) && (glassRequested || hasAny(dependencies, ['@callstack/liquid-glass', 'expo-glass-effect']))
  if (liquid) {
    pushUnique(intentSignals, ['liquid-glass'])
    addSkills('react-native-liquid-glass', 'expo-mobile-compatibility')
  } else if (mobileWork && compatibility) addSkills('expo-mobile-compatibility')
  if (targetedSecurity && remediation && primaryRole !== 'docs') uncertainties.push('Security remediation needs an implementation owner; the read-only security role must not apply fixes.')
  if (!packages.length) uncertainties.push('No package.json found; verify non-JavaScript manifests and entrypoints manually.')
  if (packages.some((item) => item.malformed)) uncertainties.push('Malformed package manifests were ignored; workspace evidence is incomplete.')
  if (!originalGoal.trim()) uncertainties.push('Goal is empty; routing uses workspace evidence only.')
  if (!systems.length) uncertainties.push('No supported application surface was detected from package dependencies or infrastructure files.')
  return { systems, workspaceEvidence, intentSignals, primaryRole, supportingRoles, skillHints, checkerRole: 'testing', matchedRule, routingReason, uncertainties }
}

function formatText(result) {
  return [
    `Systems: ${result.systems.join(', ') || 'none'}`,
    `Evidence: ${result.workspaceEvidence.join('; ') || 'none'}`,
    `Intent: ${result.intentSignals.join(', ') || 'none'}`,
    `Primary role: ${result.primaryRole}`,
    `Reason: ${result.routingReason}`,
    `Supporting roles: ${result.supportingRoles.join(', ') || 'none'}`,
    `Skills: ${result.skillHints.join(', ') || 'none'}`,
    `Checker: ${result.checkerRole}`,
    `Uncertainties: ${result.uncertainties.join('; ') || 'none'}`,
  ].join('\n') + '\n'
}

async function main() {
  let args
  try { args = parseArgs(process.argv.slice(2)) } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 2; return }
  if (args.help) { process.stdout.write('Usage: route.mjs [--root <workspace>] [--goal <text>] [--format json|text]\n'); return }
  try {
    const result = routeWorkspace(args.root, args.goal)
    process.stdout.write(args.format === 'json' ? `${JSON.stringify(result, null, 2)}\n` : formatText(result))
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 2 }
}

const isEntry = process.argv[1] && fs.existsSync(process.argv[1]) && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntry) await main()
