import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { lineOf, readText, sha256, source } from './core.mjs'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const PARSERS = path.resolve(HERE, '..', '..', 'assets', 'parsers')

const LANGUAGES = {
  '.js': ['javascript', 'tree-sitter-javascript.wasm'], '.jsx': ['javascript', 'tree-sitter-javascript.wasm'],
  '.mjs': ['javascript', 'tree-sitter-javascript.wasm'], '.cjs': ['javascript', 'tree-sitter-javascript.wasm'],
  '.ts': ['typescript', 'tree-sitter-typescript.wasm'], '.tsx': ['tsx', 'tree-sitter-tsx.wasm'],
  '.py': ['python', 'tree-sitter-python.wasm'], '.go': ['go', 'tree-sitter-go.wasm'],
  '.java': ['java', 'tree-sitter-java.wasm'], '.cs': ['csharp', 'tree-sitter-c_sharp.wasm'],
  '.rs': ['rust', 'tree-sitter-rust.wasm'], '.php': ['php', 'tree-sitter-php.wasm'],
  '.rb': ['ruby', 'tree-sitter-ruby.wasm'], '.kt': ['kotlin', 'tree-sitter-kotlin.wasm'],
  '.kts': ['kotlin', 'tree-sitter-kotlin.wasm'], '.swift': ['swift', 'tree-sitter-swift.wasm'],
}

const DEFINITION_TYPES = new Set([
  'class_declaration', 'class_definition', 'interface_declaration', 'object_declaration', 'struct_item',
  'struct_declaration', 'enum_declaration', 'enum_item', 'trait_item', 'protocol_declaration',
  'function_declaration', 'function_definition', 'method_declaration', 'method_definition',
])

const IMPORT_TYPES = new Set([
  'import_statement', 'import_declaration', 'import_header', 'using_directive', 'use_declaration',
  'use_list', 'require', 'require_relative', 'namespace_use_declaration',
])

const TECH_PACKAGES = new Map([
  ['fastify', ['Fastify', 'framework']], ['express', ['Express', 'framework']], ['@nestjs/core', ['NestJS', 'framework']],
  ['next', ['Next.js', 'client']], ['react', ['React', 'client']], ['react-native', ['React Native', 'client']], ['expo', ['Expo', 'client']],
  ['pg', ['PostgreSQL', 'data']], ['postgres', ['PostgreSQL', 'data']], ['mongoose', ['MongoDB', 'data']], ['mongodb', ['MongoDB', 'data']],
  ['redis', ['Redis', 'data']], ['ioredis', ['Redis', 'data']], ['kafkajs', ['Kafka', 'event']], ['bullmq', ['BullMQ', 'event']],
  ['openai', ['OpenAI', 'ai']], ['@anthropic-ai/sdk', ['Anthropic', 'ai']], ['langchain', ['LangChain', 'ai']],
  ['@modelcontextprotocol/sdk', ['MCP', 'ai']], ['prisma', ['Prisma', 'data']], ['@prisma/client', ['Prisma', 'data']],
])

let runtimePromise
async function runtime() {
  if (!runtimePromise) runtimePromise = (async () => {
    const { Parser, Language } = await import(pathToFileURL(path.join(PARSERS, 'web-tree-sitter.mjs')).href)
    await Parser.init({ locateFile: () => path.join(PARSERS, 'web-tree-sitter.wasm') })
    return { Parser, Language, cache: new Map() }
  })()
  return runtimePromise
}

async function parseAst(text, extension) {
  const descriptor = LANGUAGES[extension]
  if (!descriptor) return null
  const state = await runtime()
  const [languageName, wasm] = descriptor
  let language = state.cache.get(wasm)
  if (!language) {
    language = await state.Language.load(path.join(PARSERS, wasm))
    state.cache.set(wasm, language)
  }
  const parser = new state.Parser()
  parser.setLanguage(language)
  const tree = parser.parse(text)
  return { tree, languageName, parser }
}

function nodeName(node) {
  const named = node.namedChildren || []
  const candidate = named.find((child) => /^(identifier|type_identifier|name|constant|simple_identifier)$/.test(child.type))
  if (candidate) return candidate.text
  const match = node.text.match(/(?:class|interface|struct|enum|trait|protocol|object|fun|func|function|def|fn|void|public|private|protected|static|async|suspend|final|open|data|record|abstract|internal|export|default|const|let|var|[A-Za-z_][\w<>?\[\], ]+)\s+([A-Za-z_$][\w$]*)\s*(?:[({:<]|$)/)
  return match?.[1]
}

function importTarget(text) {
  const patterns = [
    /from\s+['"]([^'"]+)['"]/, /import\s+['"]([^'"]+)['"]/, /require\s*\(\s*['"]([^'"]+)['"]/,
    /^\s*import\s+([\w.]+)/, /^\s*from\s+([\w.]+)\s+import/, /^\s*use\s+([^;{]+)/,
    /^\s*using\s+([\w.]+)/, /^\s*require(?:_relative)?\s+['"]([^'"]+)/, /^\s*(?:include|require)\s*[(']([^')]+)/,
  ]
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match) return match[1].trim()
  }
  return undefined
}

function layerFor(relative, text) {
  const lower = relative.toLowerCase()
  if (/\.github\/|dockerfile|containerfile|compose|k8s|kubernetes|terraform|\.tf$|infrastructure\//.test(lower)) return 'infra'
  if (/schema|migration|repository|model|entity|\.sql$|\.prisma$/.test(lower)) return 'data'
  if (/agent|rag|llm|mcp|prompt|embedding|vector/.test(lower) || /openai|anthropic|modelcontextprotocol|langchain|llamaindex/i.test(text)) return 'ai'
  if (/page|screen|component|view|frontend|client|mobile|web\//.test(lower)) return 'client'
  if (/route|controller|handler|api\//.test(lower)) return 'api'
  return 'application'
}

function addNode(nodes, node) {
  const current = nodes.get(node.id)
  if (!current || (current.inferred && !node.inferred)) nodes.set(node.id, node)
}

function addEdge(edges, edge) {
  if (!edges.has(edge.id)) edges.set(edge.id, edge)
}

function evidence(relative, line, parser, confidence = 'high') {
  return [source(relative, line, parser, confidence)]
}

function scanLines(text, callback) {
  text.split('\n').forEach((line, index) => callback(line, index + 1))
}

function detectLineFacts({ relative, text, parserName, moduleId, nodes, edges }) {
  scanLines(text, (line, lineNumber) => {
    const routePatterns = [
      /\.(get|post|put|patch|delete|options|head)\s*\(\s*['"`]([^'"`]+)/i,
      /@(Get|Post|Put|Patch|Delete)\s*\(\s*['"`]([^'"`]*)/,
      /@(app|router)\.(get|post|put|patch|delete)\s*\(\s*['"`]([^'"`]+)/i,
      /\bMap(Get|Post|Put|Patch|Delete)\s*\(\s*['"`]([^'"`]+)/,
      /\bHandleFunc\s*\(\s*['"`]([^'"`]+)/,
    ]
    for (const pattern of routePatterns) {
      const match = line.match(pattern)
      if (!match) continue
      let method = 'ANY'; let route = match[2] || match[1]
      if (/HandleFunc/.test(pattern.source)) route = match[1]
      else if (/@\(app\|router\)/.test(pattern.source)) { method = match[2].toUpperCase(); route = match[3] }
      else if (match[1] && /^(get|post|put|patch|delete|options|head)$/i.test(match[1])) method = match[1].toUpperCase()
      const id = `route:${method}:${route}`
      addNode(nodes, { id, kind: 'route', layer: 'api', label: `${method} ${route}`, evidence: evidence(relative, lineNumber, parserName), meta: { method, path: route } })
      addEdge(edges, { id: `edge:defines:${moduleId}->${id}`, kind: 'defines', from: moduleId, to: id, label: 'handler', evidence: evidence(relative, lineNumber, parserName) })
      break
    }

    const envPatterns = [
      /process\.env\.([A-Z][A-Z0-9_]*)/g, /process\.env\[['"]([A-Z][A-Z0-9_]*)['"]\]/g,
      /(?:os\.)?(?:getenv|environ\.get)\s*\(\s*['"]([A-Z][A-Z0-9_]*)/g, /System\.getenv\s*\(\s*['"]([A-Z][A-Z0-9_]*)/g,
      /std::env::var\s*\(\s*"([A-Z][A-Z0-9_]*)/g, /ENV\[['"]([A-Z][A-Z0-9_]*)['"]\]/g,
    ]
    for (const pattern of envPatterns) for (const match of line.matchAll(pattern)) {
      const id = `env:${match[1]}`
      addNode(nodes, { id, kind: 'environment', layer: 'infra', label: match[1], evidence: evidence(relative, lineNumber, parserName), meta: { valueRedacted: true } })
      addEdge(edges, { id: `edge:reads-env:${moduleId}->${id}`, kind: 'reads-env', from: moduleId, to: id, evidence: evidence(relative, lineNumber, parserName) })
    }

    const tableMatch = line.match(/\b(?:CREATE\s+TABLE(?:\s+IF\s+NOT\s+EXISTS)?|model|collection|table)\s+[`"']?([A-Za-z_][\w.]*)/i)
    if (tableMatch) {
      const id = `data:${tableMatch[1]}`
      addNode(nodes, { id, kind: 'data-store', layer: 'data', label: tableMatch[1], evidence: evidence(relative, lineNumber, parserName), meta: { candidateSourceOfTruth: true } })
      addEdge(edges, { id: `edge:defines:${moduleId}->${id}`, kind: 'defines', from: moduleId, to: id, evidence: evidence(relative, lineNumber, parserName) })
    }

    const eventMatch = line.match(/(?:publish|emit|produce|send|dispatch|enqueue|queue\.add)\s*\(\s*['"`]([A-Za-z0-9_.:-]+)/i)
    if (eventMatch) {
      const id = `event:${eventMatch[1]}`
      addNode(nodes, { id, kind: 'event', layer: 'event', label: eventMatch[1], evidence: evidence(relative, lineNumber, parserName), meta: { delivery: 'at-least-once-unverified' } })
      addEdge(edges, { id: `edge:publishes:${moduleId}->${id}`, kind: 'publishes', from: moduleId, to: id, evidence: evidence(relative, lineNumber, parserName) })
    }

    const externalPatterns = [
      ['Kafka', /\b(kafka|KafkaProducer|KafkaConsumer)\b/i, 'event'], ['Redis', /\b(redis|ioredis|RedisClient)\b/i, 'data'],
      ['PostgreSQL', /\b(postgres|postgresql|pg\.Pool|Npgsql)\b/i, 'data'], ['MongoDB', /\b(mongodb|mongoose|MongoClient)\b/i, 'data'],
      ['OpenAI', /\b(openai|OpenAIClient)\b/i, 'ai'], ['Anthropic', /\b(anthropic|Anthropic)\b/i, 'ai'],
      ['MCP', /\b(modelcontextprotocol|MCPServer|McpServer)\b/i, 'ai'], ['OpenTelemetry', /\b(opentelemetry|OpenTelemetry|OTEL_)\b/i, 'observability'],
    ]
    for (const [name, pattern, category] of externalPatterns) if (pattern.test(line)) {
      const id = `technology:${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      addNode(nodes, { id, kind: 'technology', layer: category === 'ai' ? 'ai' : category === 'data' ? 'data' : category === 'event' ? 'event' : 'infra', label: name, evidence: evidence(relative, lineNumber, parserName), meta: { category } })
      addEdge(edges, { id: `edge:uses:${moduleId}->${id}`, kind: 'uses', from: moduleId, to: id, evidence: evidence(relative, lineNumber, parserName) })
    }
  })
}

function addDeclaredComponent({ nodes, edges, moduleId, relative, parserName, line, kind, layer, label, category, relation = 'declares', meta = {} }) {
  const slug = String(label).toLowerCase().replace(/[^a-z0-9_.:/-]+/g, '-')
  const id = `${kind}:${slug}`
  addNode(nodes, { id, kind, layer, label, evidence: evidence(relative, line, parserName), meta: { category, ...meta } })
  addEdge(edges, { id: `edge:${relation}:${moduleId}->${id}`, kind: relation, from: moduleId, to: id, evidence: evidence(relative, line, parserName) })
}

function detectDeclarativeFacts({ relative, text, parserName, moduleId, nodes, edges }) {
  const basename = path.posix.basename(relative).toLowerCase()
  const lower = relative.toLowerCase()

  if (basename === 'package.json') {
    try {
      const manifest = JSON.parse(text)
      for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
        for (const [dependency, version] of Object.entries(manifest[section] || {}).sort(([a], [b]) => a.localeCompare(b))) {
          const tech = TECH_PACKAGES.get(dependency)
          addDeclaredComponent({ nodes, edges, moduleId, relative, parserName: 'json-manifest', line: lineOf(text, text.indexOf(`"${dependency}"`)), kind: 'external-dependency', layer: tech?.[1] === 'ai' ? 'ai' : tech?.[1] === 'data' ? 'data' : 'external', label: tech?.[0] || dependency, category: tech?.[1] || 'library', relation: 'depends-on', meta: { package: dependency, versionRange: String(version), manifestSection: section } })
        }
      }
    } catch { /* malformed JSON remains represented by its module and parse-error evidence */ }
  }

  if (basename === 'dockerfile' || basename === 'containerfile') {
    for (const match of text.matchAll(/^\s*FROM\s+([^\s]+)(?:\s+AS\s+([^\s]+))?/gim)) {
      addDeclaredComponent({ nodes, edges, moduleId, relative, parserName: 'dockerfile', line: lineOf(text, match.index), kind: 'container-image', layer: 'infra', label: match[1], category: 'container', meta: { stage: match[2] || null } })
    }
  }

  if (/compose[^/]*\.ya?ml$/.test(lower)) {
    let inServices = false
    scanLines(text, (line, lineNumber) => {
      if (/^services:\s*(?:#.*)?$/.test(line)) { inServices = true; return }
      if (inServices && /^\S/.test(line) && !/^services:/.test(line)) inServices = false
      const match = inServices && line.match(/^\s{2}([A-Za-z0-9_.-]+):\s*(?:#.*)?$/)
      if (match) addDeclaredComponent({ nodes, edges, moduleId, relative, parserName: 'docker-compose', line: lineNumber, kind: 'deployment-service', layer: 'infra', label: match[1], category: 'container-service' })
    })
  }

  if (/\.github\/workflows\/[^/]+\.ya?ml$/.test(lower)) {
    let inJobs = false
    scanLines(text, (line, lineNumber) => {
      if (/^jobs:\s*(?:#.*)?$/.test(line)) { inJobs = true; return }
      if (inJobs && /^\S/.test(line) && !/^jobs:/.test(line)) inJobs = false
      const match = inJobs && line.match(/^\s{2}([A-Za-z0-9_.-]+):\s*(?:#.*)?$/)
      if (match) addDeclaredComponent({ nodes, edges, moduleId, relative, parserName: 'github-actions', line: lineNumber, kind: 'ci-job', layer: 'infra', label: match[1], category: 'ci-cd' })
    })
  }

  if (/\.tf$/.test(lower)) {
    for (const match of text.matchAll(/^\s*(resource|data|module)\s+"([^"]+)"(?:\s+"([^"]+)")?/gm)) {
      const label = [match[1], match[2], match[3]].filter(Boolean).join('.')
      addDeclaredComponent({ nodes, edges, moduleId, relative, parserName: 'terraform-hcl', line: lineOf(text, match.index), kind: 'infrastructure-resource', layer: 'infra', label, category: 'terraform', meta: { blockType: match[1], resourceType: match[2], resourceName: match[3] || null } })
    }
  }

  if (/\.ya?ml$/.test(lower) && /(^|\/)(k8s|kubernetes|manifests?|deploy(?:ment)?s?)(\/|$)/.test(lower)) {
    const documents = text.split(/^---\s*$/m); let offset = 0
    for (const document of documents) {
      const kind = document.match(/^kind:\s*([^#\n]+)/m)?.[1]?.trim()
      const name = document.match(/^metadata:\s*\n(?:^[ \t].*\n)*?^[ \t]+name:\s*([^#\n]+)/m)?.[1]?.trim()
      if (kind) addDeclaredComponent({ nodes, edges, moduleId, relative, parserName: 'kubernetes-yaml', line: lineOf(text, offset + document.indexOf(`kind:`)), kind: 'infrastructure-resource', layer: 'infra', label: name ? `${kind}/${name}` : kind, category: 'kubernetes', meta: { resourceKind: kind, resourceName: name || null } })
      offset += document.length + 4
    }
  }

  if (/\.(graphql|gql)$/.test(lower)) {
    for (const match of text.matchAll(/^\s*(type|interface|input|enum|union|scalar)\s+([A-Za-z_][\w]*)/gm)) {
      addDeclaredComponent({ nodes, edges, moduleId, relative, parserName: 'graphql-sdl', line: lineOf(text, match.index), kind: 'api-contract', layer: 'api', label: `${match[1]} ${match[2]}`, category: 'graphql', meta: { definitionType: match[1] } })
    }
  }

  if (/\.(json|ya?ml)$/.test(lower) && /(?:openapi|swagger)/i.test(text.slice(0, 500))) {
    scanLines(text, (line, lineNumber) => {
      const pathMatch = line.match(/^\s{0,4}["']?(\/[^"':]+)["']?:\s*$/)
      if (pathMatch) addDeclaredComponent({ nodes, edges, moduleId, relative, parserName: 'openapi', line: lineNumber, kind: 'route', layer: 'api', label: `OPENAPI ${pathMatch[1]}`, category: 'api-contract', meta: { method: 'DECLARED', path: pathMatch[1] } })
    })
  }
}

function resolveRelativeImport(filesByRelative, fromFile, target) {
  if (!target?.startsWith('.')) return undefined
  const base = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), target))
  const candidates = [base, ...['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.py', '.go', '.java', '.cs', '.rs', '.php', '.rb', '.kt', '.swift'].map((ext) => `${base}${ext}`), ...['index.ts', 'index.tsx', 'index.js', '__init__.py'].map((name) => `${base}/${name}`)]
  return candidates.find((candidate) => filesByRelative.has(candidate))
}

function packageName(target) {
  if (!target) return undefined
  if (target.startsWith('@')) return target.split('/').slice(0, 2).join('/')
  return target.split('/')[0].split('.')[0]
}

export async function extractArchitecture({ root, files }) {
  const nodes = new Map(); const edges = new Map(); const fileRecords = []
  const filesByRelative = new Map(files.map((file) => [file.relative, file]))

  for (const file of files) {
    const text = readText(file.absolute)
    if (!text) continue
    const moduleId = `module:${file.relative}`
    let ast = null; let parserName = 'declarative'
    try { ast = await parseAst(text, file.extension); if (ast) parserName = `tree-sitter:${ast.languageName}` } catch (error) { parserName = 'lexer-fallback' }
    const module = { id: moduleId, kind: 'module', layer: layerFor(file.relative, text), label: file.relative, evidence: evidence(file.relative, 1, parserName, ast ? 'high' : 'medium'), meta: { language: ast?.languageName || file.extension.slice(1) || 'config', bytes: file.size, sha256: sha256(text), parseErrors: ast?.tree.rootNode.hasError || false } }
    addNode(nodes, module)
    fileRecords.push({ file: file.relative, language: module.meta.language, parser: parserName, parseErrors: module.meta.parseErrors, sha256: module.meta.sha256 })

    if (ast) {
      const stack = [ast.tree.rootNode]
      while (stack.length) {
        const node = stack.pop()
        if (DEFINITION_TYPES.has(node.type)) {
          const name = nodeName(node)
          if (name) {
            const id = `symbol:${file.relative}:${name}:${node.startPosition.row + 1}`
            addNode(nodes, { id, kind: /class|interface|struct|enum|trait|protocol|object/.test(node.type) ? 'type' : 'function', layer: module.layer, label: name, evidence: evidence(file.relative, node.startPosition.row + 1, parserName), meta: { syntaxType: node.type } })
            addEdge(edges, { id: `edge:contains:${moduleId}->${id}`, kind: 'contains', from: moduleId, to: id, evidence: evidence(file.relative, node.startPosition.row + 1, parserName) })
          }
        }
        if (IMPORT_TYPES.has(node.type)) {
          const target = importTarget(node.text)
          const local = resolveRelativeImport(filesByRelative, file.relative, target)
          if (local) {
            const targetId = `module:${local}`
            addEdge(edges, { id: `edge:imports:${moduleId}->${targetId}`, kind: 'imports', from: moduleId, to: targetId, label: target, evidence: evidence(file.relative, node.startPosition.row + 1, parserName) })
          } else if (target) {
            const pkg = packageName(target)
            const tech = TECH_PACKAGES.get(pkg)
            const id = `external:${pkg}`
            addNode(nodes, { id, kind: 'external-dependency', layer: tech?.[1] === 'ai' ? 'ai' : tech?.[1] === 'data' ? 'data' : 'external', label: tech?.[0] || pkg, evidence: evidence(file.relative, node.startPosition.row + 1, parserName), meta: { package: pkg, category: tech?.[1] || 'library' } })
            addEdge(edges, { id: `edge:imports:${moduleId}->${id}`, kind: 'imports', from: moduleId, to: id, label: target, evidence: evidence(file.relative, node.startPosition.row + 1, parserName) })
          }
        }
        for (const child of node.namedChildren || []) stack.push(child)
      }
      ast.tree.delete()
      ast.parser.delete()
    }
    detectLineFacts({ relative: file.relative, text, parserName, moduleId, nodes, edges })
    detectDeclarativeFacts({ relative: file.relative, text, parserName, moduleId, nodes, edges })
  }

  for (const edge of [...edges.values()]) {
    if (!nodes.has(edge.from) || !nodes.has(edge.to)) edges.delete(edge.id)
  }

  const sortedNodes = [...nodes.values()].sort((a, b) => a.id.localeCompare(b.id))
  const sortedEdges = [...edges.values()].sort((a, b) => a.id.localeCompare(b.id))
  return { nodes: sortedNodes, edges: sortedEdges, files: fileRecords.sort((a, b) => a.file.localeCompare(b.file)) }
}

export const parserMatrix = Object.fromEntries(Object.entries(LANGUAGES).map(([extension, [language, wasm]]) => [extension, { language, wasm }]))
