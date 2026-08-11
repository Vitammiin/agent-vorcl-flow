#!/usr/bin/env node

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const REQUIRED = [
  'Audit metadata', 'Executive summary', 'Detected systems and architecture', 'Findings',
  'Dependency vulnerabilities', 'Error handling and resilience', 'Target architecture',
  'Replacement and change matrix', 'Remediation roadmap', 'Verification plan',
  'Coverage gaps / Needs verification', 'Appendix: commands and sources',
]

export function validateReport(source) {
  const errors = []
  if (!/^# Project Audit\s*$/m.test(source)) errors.push('REPORT001 missing "# Project Audit" title')
  const sectionEntries = REQUIRED.map((heading) => ({ heading, index: source.search(new RegExp(`^## ${heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*$`, 'm')) }))
  for (const section of sectionEntries) if (section.index < 0) errors.push(`REPORT002 missing section: ${section.heading}`)
  const present = sectionEntries.filter((section) => section.index >= 0)
  if (present.some((section, index) => index > 0 && section.index < present[index - 1].index)) errors.push('REPORT008 required sections are out of order')
  const sectionBody = (heading) => {
    const entry = sectionEntries.find((item) => item.heading === heading)
    if (!entry || entry.index < 0) return ''
    const start = source.indexOf('\n', entry.index) + 1
    const end = source.indexOf('\n## ', start)
    return source.slice(start, end < 0 ? source.length : end).trim()
  }
  for (const heading of ['Audit metadata', 'Executive summary', 'Detected systems and architecture', 'Target architecture', 'Remediation roadmap', 'Verification plan', 'Appendix: commands and sources']) {
    const body = sectionBody(heading)
    if (body.length < 30 || /^(?:none|n\/a|todo|нет)\.?$/i.test(body)) errors.push(`REPORT009 section is empty or non-actionable: ${heading}`)
  }
  const metadata = sectionBody('Audit metadata')
  for (const field of ['Repository', 'Scope', 'Commit/worktree', 'Timestamp/timezone', 'Roles', 'Package managers', 'Advisory status']) if (!new RegExp(`^- ${field}:\\s*\\S`, 'mi').test(metadata)) errors.push(`REPORT010 metadata missing field: ${field}`)
  const findingHeaders = [...source.matchAll(/^### (AUD-\d{3,}) — \[(critical|high|medium|low)\] .+$/gm)]
  const ids = findingHeaders.map((match) => match[1])
  if (new Set(ids).size !== ids.length) errors.push('REPORT003 duplicate finding IDs')
  for (let i = 0; i < findingHeaders.length; i++) {
    const start = findingHeaders[i].index
    const nextFinding = findingHeaders[i + 1]?.index ?? source.length
    const bodyStart = source.indexOf('\n', start) + 1
    const nextSectionOffset = source.slice(bodyStart).search(/^##(?!#)\s/m)
    const nextSection = nextSectionOffset < 0 ? source.length : bodyStart + nextSectionOffset
    const end = Math.min(nextFinding, nextSection)
    const block = source.slice(start, end)
    for (const field of ['Boundary', 'Evidence', 'Root cause', 'Impact', 'Fix', 'Target state', 'Verify', 'Owner']) if (!new RegExp(`^- ${field}:\\s*\\S`, 'm').test(block)) errors.push(`REPORT004 ${ids[i]} missing or empty field: ${field}`)
    if (!/^- Boundary:\s*(?:Backend|Frontend|Mobile|Database|Infrastructure|Cross-cutting)\s*$/m.test(block)) errors.push(`REPORT011 ${ids[i]} invalid Boundary`)
    if (!/^- Owner:\s*(?:architect|analyzer|backend|frontend|expo-mobile|security|resilience|database|swagger|devops|testing|docs)(?:\s*,\s*(?:architect|analyzer|backend|frontend|expo-mobile|security|resilience|database|swagger|devops|testing|docs))*\s*$/m.test(block)) errors.push(`REPORT012 ${ids[i]} invalid Owner`)
    const evidence = block.match(/^- Evidence:\s*(.+)$/m)?.[1] ?? ''
    if (!/`[^`\n]+:\d+`/.test(evidence) && !/(command|scanner|runtime|schema|advisory)/i.test(evidence)) errors.push(`REPORT005 ${ids[i]} evidence lacks file:line or named external evidence`)
  }
  const findingsBody = sectionBody('Findings')
  if (!findingHeaders.length && !/Audit verdict:\s*clean/i.test(findingsBody)) errors.push('REPORT013 findings require at least one AUD finding or explicit "Audit verdict: clean"')
  if (!findingHeaders.length && !/Evidence:\s*(?:`[^`]+:\d+`|command|scanner|runtime|schema)/i.test(findingsBody)) errors.push('REPORT014 clean verdict lacks reproducible evidence')
  if (!/^\|\s*Current\s*\|\s*Problem\s*\|\s*Replace\/move\/add\s*\|\s*Target owner\/layer\s*\|\s*Prerequisite\s*\|\s*Risk\s*\|\s*Verification\s*\|\s*$/mi.test(sectionBody('Replacement and change matrix'))) errors.push('REPORT006 replacement matrix header is incomplete')
  const dependencySection = source.split(/^## Dependency vulnerabilities\s*$/m)[1]?.split(/^## /m)[0] ?? ''
  if (!/(?:Checked UTC:\s*\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?Z|Status:\s*NOT VERIFIED)/i.test(dependencySection)) errors.push('REPORT007 dependency section lacks exact UTC check or NOT VERIFIED status')
  if (!/Source:\s*(?:https?:\/\/|[\w.-]+(?: audit| scanner| advisory))/i.test(dependencySection)) errors.push('REPORT015 dependency section lacks advisory/scanner source')
  for (const match of dependencySection.matchAll(/^### DEP-\d{3,}.*$/gm)) {
    const start = match.index
    const next = dependencySection.indexOf('\n### DEP-', start + 1)
    const block = dependencySection.slice(start, next < 0 ? dependencySection.length : next)
    for (const field of ['Package', 'Installed', 'Affected range', 'Patched', 'Direct/transitive', 'Source']) if (!new RegExp(`^- ${field}:\\s*\\S`, 'mi').test(block)) errors.push(`REPORT016 ${match[0].split(/\s/)[1]} missing dependency field: ${field}`)
  }
  const roadmap = sectionBody('Remediation roadmap')
  for (const phase of ['P0', 'P1', 'P2', 'P3']) if (!new RegExp(`^### ${phase}\\b`, 'm').test(roadmap)) errors.push(`REPORT017 roadmap missing phase ${phase}`)
  if (ids.length && !ids.every((id) => roadmap.includes(id))) errors.push('REPORT018 roadmap does not reference every finding ID')
  if (!/(?:`[^`]+`|Command:)/i.test(sectionBody('Verification plan'))) errors.push('REPORT019 verification plan lacks commands/tests')
  const appendix = sectionBody('Appendix: commands and sources')
  if (!/Command:\s*\S/i.test(appendix) || !/Source:\s*\S/i.test(appendix)) errors.push('REPORT020 appendix must list commands and sources')
  return errors
}

function main() {
  const file = process.argv[2]
  if (!file || process.argv.includes('--help')) { process.stdout.write('Usage: validate-report.mjs <PROJECT_AUDIT.md>\n'); process.exitCode = file ? 0 : 2; return }
  try {
    const errors = validateReport(fs.readFileSync(path.resolve(file), 'utf8'))
    if (errors.length) { process.stderr.write(`${errors.join('\n')}\nproject-audit report: ${errors.length} error(s)\n`); process.exitCode = 1 }
    else process.stdout.write('project-audit report: valid\n')
  } catch (error) { process.stderr.write(`project-audit report: ${error.message}\n`); process.exitCode = 2 }
}

const isEntry = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isEntry) main()
