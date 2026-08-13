#!/usr/bin/env node
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { DEFAULT_IGNORES, parseArgs, readJson, resolveProject, stableJson, walkFiles, writeText } from './lib/core.mjs'
import { buildModel, diffModels } from './lib/model.mjs'
import { renderMarkdown } from './render-md.mjs'
import { renderHtml } from './render-html.mjs'
import { renderDrawio } from './render-drawio.mjs'
import { renderMermaid } from './render-mermaid.mjs'
import { renderPdf } from './render-pdf.mjs'
import { validateArtifacts } from './validate.mjs'

const GENERATED = ['ARCHITECTURE.md', 'architecture.model.json', 'architecture.manifest.json', 'architecture.diff.json', 'architecture.config.json', 'architecture.annotations.json', 'architecture.html', 'architecture.drawio', 'architecture.pdf', 'mermaid']

function help() {
  return `Usage:
  principal-architecture.mjs create [--root <repo>] [--scope <path>] [--out <path>] [--formats all|md,html,pdf,drawio,mermaid] [--target]
  principal-architecture.mjs update [same options]
  principal-architecture.mjs validate --root <repo> --out <path>\n`
}

function loadSettings(output) {
  const defaults = { schemaVersion: '1.0.0', ignores: [], maxFileBytes: 1_500_000, diagram: { theme: 'editorial-dark', audience: 'engineer', detail: 'adaptive', maxNodesPerPage: 24 } }
  const saved = readJson(path.join(output, 'architecture.config.json'), {})
  const config = { ...defaults, ...saved, diagram: { ...defaults.diagram, ...(saved.diagram || {}) } }
  const annotations = readJson(path.join(output, 'architecture.annotations.json'), { schemaVersion: '1.0.0', notes: [], proposals: [] })
  return { config, annotations }
}

function materialize(staging, project, model, formats, options, settings, diff) {
  const sourcePrefix = path.relative(project.output, project.root).split(path.sep).join('/') || '.'
  const markdown = renderMarkdown(model, { diff: options.command === 'update' ? diff : undefined, annotations: settings.annotations, target: options.target, sourcePrefix })
  writeText(path.join(staging, 'ARCHITECTURE.md'), markdown)
  writeText(path.join(staging, 'architecture.model.json'), stableJson(model))
  writeText(path.join(staging, 'architecture.diff.json'), stableJson(diff))
  writeText(path.join(staging, 'architecture.config.json'), stableJson(settings.config))
  writeText(path.join(staging, 'architecture.annotations.json'), stableJson(settings.annotations))
  if (formats.includes('html') || formats.includes('pdf')) renderHtml(model, markdown, path.join(staging, 'architecture.html'), settings.config.diagram)
  if (formats.includes('drawio')) renderDrawio(model, path.join(staging, 'architecture.drawio'), settings.config.diagram)
  if (formats.includes('mermaid')) renderMermaid(model, path.join(staging, 'mermaid'))
  const pdf = formats.includes('pdf') ? renderPdf(path.join(staging, 'architecture.html'), path.join(staging, 'architecture.pdf')) : { status: 'not-requested' }
  const manifest = { schemaVersion: '1.0.0', generator: 'principal-architecture', rootRelativeOutput: path.relative(project.root, project.output).split(path.sep).join('/'), scope: model.repository.scope, formats, modelHash: model.modelHash, pdf, generated: GENERATED.filter((entry) => entry === 'architecture.manifest.json' || fs.existsSync(path.join(staging, entry))), generatedAt: new Date().toISOString() }
  writeText(path.join(staging, 'architecture.manifest.json'), stableJson(manifest))
  return manifest
}

function install(staging, output, command) {
  if (command === 'create' && fs.existsSync(path.join(output, 'architecture.manifest.json'))) throw new Error(`architecture package already exists at ${output}; use update`)
  const priorManifest = readJson(path.join(output, 'architecture.manifest.json'), { generated: [] })
  const parent = path.dirname(output)
  fs.mkdirSync(parent, { recursive: true })
  const replacement = path.join(parent, `.${path.basename(output)}.principal-next-${process.pid}`)
  const backup = path.join(parent, `.${path.basename(output)}.principal-backup-${process.pid}`)
  fs.rmSync(replacement, { recursive: true, force: true })
  if (fs.existsSync(output)) fs.cpSync(output, replacement, { recursive: true })
  else fs.mkdirSync(replacement, { recursive: true })
  for (const entry of priorManifest.generated || []) {
    const target = path.join(replacement, entry)
    if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true })
  }
  for (const entry of fs.readdirSync(staging)) {
    const source = path.join(staging, entry); const target = path.join(replacement, entry)
    if (fs.existsSync(target)) fs.rmSync(target, { recursive: true, force: true })
    fs.cpSync(source, target, { recursive: true })
  }
  if (!fs.existsSync(output)) return fs.renameSync(replacement, output)
  fs.rmSync(backup, { recursive: true, force: true })
  fs.renameSync(output, backup)
  try {
    fs.renameSync(replacement, output)
    fs.rmSync(backup, { recursive: true, force: true })
  } catch (error) {
    if (fs.existsSync(output)) fs.rmSync(output, { recursive: true, force: true })
    fs.renameSync(backup, output)
    throw error
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) return process.stdout.write(help())
  if (!['create', 'update', 'validate'].includes(options.command)) throw new Error(`unknown command: ${options.command}\n${help()}`)
  const project = resolveProject(options)
  if (options.command === 'validate') {
    const model = readJson(path.join(project.output, 'architecture.model.json')); if (!model) throw new Error('architecture.model.json not found')
    const manifest = readJson(path.join(project.output, 'architecture.manifest.json')); const errors = validateArtifacts({ model, root: project.root, output: project.output, formats: manifest.formats || [] })
    if (errors.length) throw new Error(errors.join('\n'))
    return process.stdout.write('principal architecture validation: ok\n')
  }
  if (options.command === 'update' && !fs.existsSync(path.join(project.output, 'architecture.manifest.json'))) throw new Error(`no architecture package at ${project.output}; run create first`)
  const settings = loadSettings(project.output)
  const files = walkFiles({ ...project, ignores: [...DEFAULT_IGNORES, ...(settings.config.ignores || [])], maxFileBytes: settings.config.maxFileBytes })
  const previous = readJson(path.join(project.output, 'architecture.model.json'))
  const model = await buildModel({ ...project, files, target: options.target })
  const diff = diffModels(previous, model)
  const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'principal-architecture-'))
  try {
    const manifest = materialize(staging, project, model, options.formats, options, settings, diff)
    const errors = validateArtifacts({ model, root: project.root, output: staging, formats: options.formats })
    if (errors.length) throw new Error(errors.join('\n'))
    install(staging, project.output, options.command)
    process.stdout.write(`${options.command} complete: ${project.output}\nmodel ${model.modelHash}\nfiles ${model.stats.files}, nodes ${model.stats.nodes}, edges ${model.stats.edges}\npdf ${manifest.pdf.status}\n`)
  } finally { fs.rmSync(staging, { recursive: true, force: true }) }
}

main().catch((error) => { process.stderr.write(`principal architecture failed: ${error.message}\n`); process.exitCode = 1 })
