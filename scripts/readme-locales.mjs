#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CANONICAL = path.join(ROOT, 'README.md')
const GENERATED_MARKER_PATTERN = /<!-- Generated from README\.md by scripts\/readme-locales\.mjs(?:; source-sha256: [a-f0-9]{64})?\. -->/

const LOCALES = [
  { code: 'en', label: 'English', file: 'README.md', source: true },
  { code: 'ru', label: 'Русский', file: 'README.ru.md', source: true },
  { code: 'uk', label: 'Українська', file: 'README.uk.md' },
  { code: 'de', label: 'Deutsch', file: 'README.de.md' },
  { code: 'fr', label: 'Français', file: 'README.fr.md' },
  { code: 'es', label: 'Español', file: 'README.es.md' },
  { code: 'pt', label: 'Português', file: 'README.pt.md' },
  { code: 'it', label: 'Italiano', file: 'README.it.md' },
  { code: 'pl', label: 'Polski', file: 'README.pl.md' },
  { code: 'tr', label: 'Türkçe', file: 'README.tr.md' },
  { code: 'zh-CN', label: '中文', file: 'README.zh-CN.md' },
  { code: 'ja', label: '日本語', file: 'README.ja.md' },
  { code: 'ko', label: '한국어', file: 'README.ko.md' },
  { code: 'ar', label: 'العربية', file: 'README.ar.md', rtl: true },
  { code: 'nl', label: 'Nederlands', file: 'README.nl.md' },
  { code: 'cs', label: 'Čeština', file: 'README.cs.md' },
  { code: 'ro', label: 'Română', file: 'README.ro.md' },
  { code: 'hu', label: 'Magyar', file: 'README.hu.md' },
  { code: 'bg', label: 'Български', file: 'README.bg.md' },
  { code: 'sr', label: 'Српски', file: 'README.sr.md' },
  { code: 'hi', label: 'हिन्दी', file: 'README.hi.md' },
  { code: 'vi', label: 'Tiếng Việt', file: 'README.vi.md' },
]

const REQUIRED_TOKENS = [
  'npx github:Vitammiin/agent-vorcl-flow',
  'npx --yes agent-vorcl-flow@latest',
  '/audit .',
]

const SCRIPT_PATTERNS = new Map([
  ['ru', /\p{Script=Cyrillic}/u],
  ['uk', /\p{Script=Cyrillic}/u],
  ['bg', /\p{Script=Cyrillic}/u],
  ['sr', /\p{Script=Cyrillic}/u],
  ['zh-CN', /\p{Script=Han}/u],
  ['ja', /[\p{Script=Hiragana}\p{Script=Katakana}]/u],
  ['ko', /\p{Script=Hangul}/u],
  ['ar', /\p{Script=Arabic}/u],
  ['hi', /\p{Script=Devanagari}/u],
])

const PROTECTED_TERMS = [
  'Agent-Vorcl-Flow', 'Claude Code', 'GPT Codex', 'Kimi CLI', 'Task Master',
  'TanStack Query', 'React Native', 'Expo Router', 'Node.js', 'Next.js',
  'PostgreSQL', 'MongoDB', 'SecureStore', 'TypeScript', 'JavaScript',
  'Firecrawl', 'Playwright', 'OpenAPI', 'Tailwind', 'Swagger', 'Zustand',
  'SQLite', 'Maestro', 'Mermaid', 'GitHub', 'Docker', 'Vercel', 'Postgres',
  'Redis', 'React', 'Expo', 'Codex', 'Cursor', 'Kimi', 'Claude', 'Liveboard',
  'OIDC', 'MCP', 'CLI', 'API', 'JSON', 'YAML', 'HTML', 'PDF', 'SVG', 'PNG',
  'npm', 'npx', 'Git', 'CI', 'UI', 'DB',
].sort((left, right) => right.length - left.length)

function protectedToken(index, ascii) {
  if (ascii) return `V9K${index.toString(36).toUpperCase()}X7M`
  if (index >= 0x1900) throw new Error('too many protected Markdown segments')
  return String.fromCodePoint(0xE000 + index)
}

function languageBlock(active) {
  const links = LOCALES.map((locale) => {
    const label = locale.code === active ? `**${locale.label}**` : locale.label
    return `[${label}](./${locale.file})`
  })
  const rows = []
  for (let index = 0; index < links.length; index += 6) rows.push(links.slice(index, index + 6).join(' · '))
  return [
    '<details>',
    `<summary>🌐 <strong>Languages (${LOCALES.length})</strong> — all translations are stored in Git</summary>`,
    '',
    rows.join('<br>\n'),
    '',
    '<sub>English is canonical; every link above opens a repository-local README file.</sub>',
    '</details>',
  ].join('\n')
}

function generatedMarker(canonical) {
  const hash = createHash('sha256').update(canonical).digest('hex')
  return `<!-- Generated from README.md by scripts/readme-locales.mjs; source-sha256: ${hash}. -->`
}

function syncGeneratedMarker(source, canonical) {
  if (!GENERATED_MARKER_PATTERN.test(source)) throw new Error('generated README marker was not found')
  return source.replace(GENERATED_MARKER_PATTERN, generatedMarker(canonical))
}

function replaceLanguageBlock(source, replacement) {
  const start = source.indexOf('<details>')
  const end = source.indexOf('</details>', start)
  if (start < 0 || end < 0) throw new Error('README language switcher was not found')
  return `${source.slice(0, start)}${replacement}${source.slice(end + '</details>'.length)}`
}

function protectMarkdown(source, { asciiTokens = false } = {}) {
  const values = []
  const protect = (value) => {
    const token = protectedToken(values.length, asciiTokens)
    values.push(value)
    return token
  }
  let text = source
  text = text.replace(/```[\s\S]*?```/g, protect)
  text = text.replace(/`[^`\n]+`/g, protect)
  text = text.replace(/!?\[[^\]\n]*\]\((?:[^()\n]|\([^)]*\))+\)/g, protect)
  text = text.replace(/\]\((?:[^()\n]|\([^)]*\))+\)/g, protect)
  text = text.replace(/<[^>\n]+>/g, protect)
  text = text.replace(/https?:\/\/[^\s)>]+/g, protect)
  const terms = PROTECTED_TERMS.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  text = text.replace(new RegExp(`(?<![\\p{Letter}\\p{Number}])(?:${terms})(?![\\p{Letter}\\p{Number}])`, 'gu'), protect)
  text = text.replace(/^(\s{0,3}#{1,6}\s+)/gm, protect)
  return {
    text,
    restore(translated) {
      let output = translated
      for (let index = values.length - 1; index >= 0; index--) {
        const token = protectedToken(index, asciiTokens)
        output = output.split(token).join(values[index])
      }
      const leaked = asciiTokens ? output.match(/V9K[0-9A-Z]+X7M/i) : output.match(/[\uE000-\uF8FF]/u)
      if (leaked) throw new Error(`translation changed protected token ${leaked[0]}`)
      return output
    },
  }
}

function chunks(source, limit = 3400) {
  const paragraphs = source.split(/(\n\n+)/)
  const result = []
  let current = ''
  for (const paragraph of paragraphs) {
    if (current && current.length + paragraph.length > limit) {
      result.push(current)
      current = ''
    }
    if (paragraph.length <= limit) {
      current += paragraph
      continue
    }
    const lines = paragraph.split(/(?<=\n)/)
    for (const line of lines) {
      if (current && current.length + line.length > limit) {
        result.push(current)
        current = ''
      }
      if (line.length > limit) {
        for (let offset = 0; offset < line.length; offset += limit) result.push(line.slice(offset, offset + limit))
      } else current += line
    }
  }
  if (current) result.push(current)
  return result
}

async function translateChunk(text, locale) {
  if (!text.trim()) return text
  const query = new URLSearchParams({ client: 'gtx', sl: 'en', tl: locale, dt: 't', q: text })
  let lastError
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?${query}`, {
        signal: AbortSignal.timeout(30_000),
        headers: { 'user-agent': 'agent-vorcl-flow-readme-localizer/1.0' },
      })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const body = await response.json()
      return body[0].map((segment) => segment[0]).join('')
    } catch (error) {
      lastError = error
      if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, attempt * 750))
    }
  }
  throw new Error(`translation failed for ${locale}: ${lastError?.message ?? 'unknown error'}`)
}

async function mapPool(items, concurrency, worker) {
  const output = new Array(items.length)
  let cursor = 0
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      output[index] = await worker(items[index], index)
    }
  }))
  return output
}

function replaceFencedBlocks(source, canonicalBlocks) {
  let index = 0
  const output = source.replace(/```[\s\S]*?```/g, () => canonicalBlocks[index++])
  if (index !== canonicalBlocks.length) throw new Error(`source README has ${index} fenced blocks; expected ${canonicalBlocks.length}`)
  return output
}

function updateSourceSwitchers(canonical) {
  const canonicalBlocks = fencedBlocks(canonical)
  for (const locale of LOCALES.filter((item) => item.source)) {
    const file = path.join(ROOT, locale.file)
    let source = fs.readFileSync(file, 'utf8')
    source = replaceLanguageBlock(source, languageBlock(locale.code))
    if (locale.code !== 'en') source = replaceFencedBlocks(source, canonicalBlocks)
    fs.writeFileSync(file, source)
  }
}

async function generateLocale(locale, canonical) {
  const languageToken = '<avf-language-switcher></avf-language-switcher>'
  const withoutSwitcher = replaceLanguageBlock(canonical, languageToken)
  const protectedSource = protectMarkdown(withoutSwitcher, { asciiTokens: locale.code === 'zh-CN' })
  const translatedChunks = await mapPool(chunks(protectedSource.text), 3, (chunk) => translateChunk(chunk, locale.code))
  let output = protectedSource.restore(translatedChunks.join(''))
  output = output.replace(languageToken, languageBlock(locale.code))
  output = localizeAnchorLinks(canonical, output)
  const marker = generatedMarker(canonical)
  output = output.replace('</details>', `</details>\n\n${marker}`, 1)
  if (locale.rtl) output = output.replace(marker, `${marker}\n<p dir="rtl">هذه ترجمة عربية محفوظة داخل المستودع.</p>`)
  if (!output.endsWith('\n')) output += '\n'
  fs.writeFileSync(path.join(ROOT, locale.file), output)
  process.stdout.write(`generated ${locale.file}\n`)
}

function count(source, pattern) {
  return [...source.matchAll(pattern)].length
}

function fencedBlocks(source) {
  return source.match(/```[\s\S]*?```/g) ?? []
}

function githubSlugs(source) {
  const seen = new Map()
  return [...source.matchAll(/^#{2,6}\s+(.+)$/gm)].map((match) => {
    let slug = match[1]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .replace(/[`*_~]/g, '')
      .toLocaleLowerCase('en-US')
      .replace(/[^\p{Letter}\p{Number}\p{Mark}\s_-]/gu, '')
      .trim()
      .replace(/\s/g, '-')
    const duplicate = seen.get(slug) ?? 0
    seen.set(slug, duplicate + 1)
    if (duplicate) slug = `${slug}-${duplicate}`
    return slug
  })
}

function localizeAnchorLinks(canonical, translated) {
  const canonicalSlugs = githubSlugs(canonical)
  const translatedSlugs = githubSlugs(translated)
  if (canonicalSlugs.length !== translatedSlugs.length) throw new Error('translated heading count differs from README.md')
  const mapping = new Map(canonicalSlugs.map((slug, index) => [slug, translatedSlugs[index]]))
  return translated.replace(/\]\(#([^)]+)\)/g, (match, slug) => `](#${mapping.get(slug) ?? slug})`)
}

function check() {
  const errors = []
  const canonical = fs.readFileSync(CANONICAL, 'utf8')
  const canonicalFences = fencedBlocks(canonical)
  const canonicalH2 = count(canonical, /^## /gm)
  for (const locale of LOCALES) {
    const file = path.join(ROOT, locale.file)
    if (!fs.existsSync(file)) {
      errors.push(`missing ${locale.file}`)
      continue
    }
    const source = fs.readFileSync(file, 'utf8')
    if (source.includes('translate.google.com')) errors.push(`${locale.file}: external translation link remains`)
    for (const target of LOCALES) if (!source.includes(`](./${target.file})`)) errors.push(`${locale.file}: missing local link to ${target.file}`)
    if (!locale.source && !source.includes(generatedMarker(canonical))) errors.push(`${locale.file}: generated source hash differs from README.md`)
    if (JSON.stringify(fencedBlocks(source)) !== JSON.stringify(canonicalFences)) errors.push(`${locale.file}: fenced code blocks differ from README.md`)
    if (count(source, /^## /gm) !== canonicalH2) errors.push(`${locale.file}: H2 section count differs from README.md`)
    const availableAnchors = new Set(githubSlugs(source))
    for (const match of source.matchAll(/\]\(#([^)]+)\)/g)) if (!availableAnchors.has(match[1])) errors.push(`${locale.file}: broken local anchor #${match[1]}`)
    for (const token of REQUIRED_TOKENS) if (!source.includes(token)) errors.push(`${locale.file}: missing required token ${token}`)
    if (SCRIPT_PATTERNS.has(locale.code) && !SCRIPT_PATTERNS.get(locale.code).test(source)) errors.push(`${locale.file}: expected ${locale.code} writing system was not detected`)
    if (locale.rtl && !source.includes('dir="rtl"')) errors.push(`${locale.file}: missing RTL marker`)
  }
  if (errors.length) {
    process.stderr.write(`${errors.join('\n')}\nREADME locale check: ${errors.length} error(s)\n`)
    return 1
  }
  process.stdout.write(`README locale check: ${LOCALES.length} local files are in parity\n`)
  return 0
}

async function main() {
  const argv = process.argv.slice(2)
  const localeOption = argv.find((argument) => argument.startsWith('--locale='))
  const requestedLocale = localeOption?.slice('--locale='.length)
  const args = new Set(argv.filter((argument) => argument !== localeOption))
  if (args.has('--help')) {
    process.stdout.write('Usage: readme-locales.mjs --check | --generate [--locale=<code>] | --sync-anchors\n')
    return
  }
  if (args.has('--generate')) {
    const canonical = fs.readFileSync(CANONICAL, 'utf8')
    updateSourceSwitchers(canonical)
    const generatedLocales = LOCALES.filter((locale) => !locale.source && (!requestedLocale || locale.code === requestedLocale))
    if (!generatedLocales.length) throw new Error(`unknown generated locale: ${requestedLocale}`)
    await mapPool(generatedLocales, 2, (locale) => generateLocale(locale, canonical))
    process.exitCode = check()
    return
  }
  if (args.has('--sync-anchors')) {
    const canonical = fs.readFileSync(CANONICAL, 'utf8')
    for (const locale of LOCALES.filter((item) => !item.source)) {
      const file = path.join(ROOT, locale.file)
      const source = localizeAnchorLinks(canonical, fs.readFileSync(file, 'utf8'))
      fs.writeFileSync(file, syncGeneratedMarker(source, canonical))
    }
    process.exitCode = check()
    return
  }
  if (args.size && !args.has('--check')) throw new Error(`unknown argument: ${[...args][0]}`)
  process.exitCode = check()
}

main().catch((error) => {
  process.stderr.write(`README locale generation failed: ${error.message}\n`)
  process.exitCode = 2
})
