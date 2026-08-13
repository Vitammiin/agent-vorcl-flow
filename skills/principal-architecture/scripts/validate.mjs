import fs from 'node:fs'
import path from 'node:path'
import { readJson, readText } from './lib/core.mjs'
import { validateDrawio } from './validate-drawio.mjs'

export function validateModel(model, root) {
  const errors = []; const ids = new Set()
  for (const node of model.nodes || []) {
    if (ids.has(node.id)) errors.push(`duplicate node id: ${node.id}`); ids.add(node.id)
    if (!node.evidence?.length) errors.push(`node has no evidence: ${node.id}`)
    for (const evidence of node.evidence || []) validateEvidence(evidence, root, errors, node.id)
  }
  const edgeIds = new Set()
  for (const edge of model.edges || []) {
    if (edgeIds.has(edge.id)) errors.push(`duplicate edge id: ${edge.id}`); edgeIds.add(edge.id)
    if (!ids.has(edge.from) || !ids.has(edge.to)) errors.push(`dangling edge: ${edge.id}`)
    if (!edge.evidence?.length) errors.push(`edge has no evidence: ${edge.id}`)
    for (const evidence of edge.evidence || []) validateEvidence(evidence, root, errors, edge.id)
  }
  if (model.evidencePolicy?.markdownAsEvidence !== false) errors.push('Markdown must not be architecture evidence')
  return errors
}

function validateEvidence(evidence, root, errors, owner) {
  const file = path.resolve(root, evidence.file || '')
  if (file !== root && !file.startsWith(`${root}${path.sep}`)) return errors.push(`evidence escapes root: ${owner}`)
  if (!fs.existsSync(file)) return errors.push(`missing evidence file: ${owner} -> ${evidence.file}`)
  const lines = readText(file).split('\n').length
  if (!Number.isInteger(evidence.line) || evidence.line < 1 || evidence.line > lines) errors.push(`invalid evidence line: ${owner} -> ${evidence.file}:${evidence.line}`)
}

export function validateArtifacts({ model, root, output, formats }) {
  const errors = validateModel(model, root)
  const required = { md: 'ARCHITECTURE.md', html: 'architecture.html', pdf: 'architecture.pdf', drawio: 'architecture.drawio' }
  for (const format of formats) if (required[format] && !fs.existsSync(path.join(output, required[format]))) errors.push(`missing ${required[format]}`)
  if (formats.includes('html')) {
    const html = readText(path.join(output, 'architecture.html'))
    if (/https?:\/\//i.test(html)) errors.push('HTML contains a network URL')
    if (!html.includes('id="model"')) errors.push('HTML does not embed model')
    if (!/<svg\b[^>]*role="img"[^>]*aria-labelledby="([^"]+)"/.test(html)) errors.push('HTML overview SVG is not accessibly labelled')
    if (!/<svg\b[^>]*>[\s\n]*<title\b[^>]*>[^<]+<\/title>[\s\n]*<desc\b[^>]*>[^<]+<\/desc>/.test(html)) errors.push('HTML overview SVG needs title and desc as its first children')
    if (/<(?:iframe|object|embed|base)\b/i.test(html)) errors.push('HTML contains an unsafe embedded document element')
    if (/\son[a-z]+\s*=/i.test(html)) errors.push('HTML contains inline executable event attributes')
  }
  if (formats.includes('drawio')) {
    const xml = readText(path.join(output, 'architecture.drawio'))
    if (!xml.startsWith('<?xml') || !xml.includes('<mxfile') || !xml.includes('<mxGraphModel')) errors.push('draw.io XML structure is invalid')
    errors.push(...validateDrawio(xml).map((error) => `draw.io: ${error}`))
  }
  if (formats.includes('mermaid')) {
    const directory = path.join(output, 'mermaid')
    if (!fs.existsSync(directory) || !fs.readdirSync(directory).some((file) => file.endsWith('.mmd'))) errors.push('no Mermaid files generated')
  }
  return errors
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [modelFile, root, output] = process.argv.slice(2); const model = readJson(modelFile); const errors = validateArtifacts({ model, root: path.resolve(root), output: path.resolve(output), formats: ['md', 'html', 'drawio', 'mermaid'] })
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 } else console.log('principal architecture validation: ok')
}
