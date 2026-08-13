import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

export const DEFAULT_IGNORES = [
  '.git', '.hg', '.svn', 'node_modules', 'vendor', 'Pods', '.gradle', '.idea', '.vscode',
  'dist', 'build', 'coverage', '.next', '.nuxt', '.expo', '.turbo', '.cache', 'target',
  'DerivedData', '.venv', 'venv', '__pycache__', 'docs/architecture',
]

export const SOURCE_EXTENSIONS = new Set([
  '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.py', '.go', '.java', '.cs', '.rs',
  '.php', '.rb', '.kt', '.kts', '.swift', '.sql', '.prisma', '.graphql', '.gql', '.hcl', '.tf',
  '.json', '.yaml', '.yml', '.toml', '.xml',
])

export function parseArgs(argv) {
  const [command = 'create', ...rest] = argv
  const options = { command, root: process.cwd(), formats: ['md', 'html', 'drawio', 'mermaid', 'pdf'], target: false }
  for (let index = 0; index < rest.length; index++) {
    const argument = rest[index]
    const read = (name) => argument === name ? rest[++index] : argument.startsWith(`${name}=`) ? argument.slice(name.length + 1) : undefined
    let value
    if ((value = read('--root')) !== undefined) options.root = value
    else if ((value = read('--scope')) !== undefined) options.scope = value
    else if ((value = read('--out')) !== undefined) options.out = value
    else if ((value = read('--formats')) !== undefined) options.formats = value === 'all' ? ['md', 'html', 'drawio', 'mermaid', 'pdf'] : value.split(',').map((item) => item.trim()).filter(Boolean)
    else if (argument === '--target') options.target = true
    else if (argument === '--help' || argument === '-h') options.help = true
    else throw new Error(`unknown argument: ${argument}`)
  }
  // Markdown is the mandatory first publication layer even when callers ask
  // for only one visual format.
  if (!options.formats.includes('md')) options.formats.unshift('md')
  return options
}

export function resolveProject(options) {
  const root = fs.realpathSync(path.resolve(options.root))
  const scope = options.scope ? path.resolve(root, options.scope) : root
  const realScope = fs.realpathSync(scope)
  if (realScope !== root && !realScope.startsWith(`${root}${path.sep}`)) throw new Error('scope must stay inside repository root')
  const slug = sanitize(options.scope || path.basename(root))
  const output = path.resolve(root, options.out || path.join('docs', 'architecture', slug))
  if (output !== root && !output.startsWith(`${root}${path.sep}`)) throw new Error('output must stay inside repository root')
  return { root, scope: realScope, slug, output }
}

export function sanitize(value) {
  return String(value).replaceAll('\\', '/').replace(/^\.\//, '').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'repository'
}

export function posixRelative(root, file) {
  return path.relative(root, file).split(path.sep).join('/') || '.'
}

export function walkFiles({ root, scope, output, ignores = DEFAULT_IGNORES, maxFileBytes = 1_500_000 }) {
  const files = []
  const ignorePaths = ignores.map((item) => item.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/$/, ''))
  const outputReal = path.resolve(output)
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const absolute = path.join(directory, entry.name)
      if (absolute === outputReal || absolute.startsWith(`${outputReal}${path.sep}`)) continue
      const relative = posixRelative(root, absolute)
      if (ignorePaths.some((ignore) => relative === ignore || relative.startsWith(`${ignore}/`) || relative.split('/').includes(ignore))) continue
      if (entry.isSymbolicLink()) continue
      if (entry.isDirectory()) visit(absolute)
      else if (entry.isFile()) {
        const extension = path.extname(entry.name).toLowerCase()
        const special = ['Dockerfile', 'Containerfile', 'Gemfile', 'Rakefile'].includes(entry.name)
        if (!SOURCE_EXTENSIONS.has(extension) && !special) continue
        const stat = fs.statSync(absolute)
        if (stat.size > maxFileBytes) continue
        files.push({ absolute, relative, extension, size: stat.size })
      }
    }
  }
  visit(scope)
  return files
}

export function readText(file) {
  const buffer = fs.readFileSync(file)
  if (buffer.includes(0)) return ''
  return buffer.toString('utf8')
}

export function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
  return value
}

export function stableJson(value) {
  return `${JSON.stringify(stable(value), null, 2)}\n`
}

export function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, value)
}

export function readJson(file, fallback = undefined) {
  if (!fs.existsSync(file)) return fallback
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function source(file, line, parser, confidence = 'high') {
  return { file, line: Math.max(1, Number(line) || 1), parser, confidence }
}

export function lineOf(text, offset) {
  return text.slice(0, Math.max(0, offset)).split('\n').length
}

export function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
}

export function escapeHtml(value) {
  return escapeXml(value)
}

export function commandExists(command) {
  const paths = (process.env.PATH || '').split(path.delimiter)
  return paths.some((directory) => {
    try { return fs.statSync(path.join(directory, command)).isFile() } catch { return false }
  })
}
