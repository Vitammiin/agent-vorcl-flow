import fs from 'node:fs'

// Page-scoped IDs, dangling-edge checks, and nested-cell rejection are adapted
// from next-ai-draw-io's XML safety model. See assets/THIRD_PARTY_NOTICES.md.

function attributes(source) {
  const result = new Map(); const duplicates = []
  for (const match of source.matchAll(/\s([A-Za-z_:][\w:.-]*)\s*=\s*(["'])(.*?)\2/g)) {
    if (result.has(match[1])) duplicates.push(match[1]); else result.set(match[1], match[3])
  }
  return { result, duplicates }
}

export function validateDrawio(xml) {
  const errors = []
  if (!/^\s*<\?xml[^>]*>\s*<mxfile\b/.test(xml)) errors.push('document must start with XML declaration and mxfile')
  if (/&(?!(?:lt|gt|amp|quot|apos|#[0-9]+|#x[0-9a-fA-F]+);)/.test(xml.replace(/<!--[\s\S]*?-->/g, ''))) errors.push('unescaped ampersand')
  let cellDepth = 0
  for (const match of xml.matchAll(/<\/?mxCell\b[^>]*>/g)) {
    if (match[0].startsWith('</')) cellDepth = Math.max(0, cellDepth - 1)
    else if (!match[0].endsWith('/>')) { if (cellDepth) errors.push('nested mxCell elements are forbidden'); cellDepth++ }
  }
  const pageIds = new Set(); let pages = 0
  for (const page of xml.matchAll(/<diagram\b([^>]*)>([\s\S]*?)<\/diagram>/g)) {
    pages++; const pageAttrs = attributes(page[1]); const pageId = pageAttrs.result.get('id'); const name = pageAttrs.result.get('name') || `index ${pages - 1}`
    if (!pageId) errors.push(`page ${name} has no id`); else if (pageIds.has(pageId)) errors.push(`duplicate page id ${pageId}`); else pageIds.add(pageId)
    if (!/<mxGraphModel\b[^>]*\bgridSize="10"/.test(page[2])) errors.push(`page ${name} has no 10px grid`)
    const cellIds = new Set(); const cells = []
    for (const cell of page[2].matchAll(/<mxCell\b([^>]*?)(?:\/>|>([\s\S]*?)<\/mxCell>)/g)) {
      const parsed = attributes(cell[1]); const id = parsed.result.get('id')
      if (parsed.duplicates.length) errors.push(`cell ${id || '?'} has duplicate attributes: ${parsed.duplicates.join(', ')}`)
      if (!id) errors.push(`page ${name} has cell without id`); else if (cellIds.has(id)) errors.push(`page ${name} has duplicate cell id ${id}`); else cellIds.add(id)
      cells.push({ id, attrs: parsed.result, body: cell[2] || '' })
    }
    if (!cellIds.has('0') || !cellIds.has('1')) errors.push(`page ${name} is missing root cells 0/1`)
    for (const cell of cells) if (cell.attrs.get('edge') === '1') {
      const from = cell.attrs.get('source'); const to = cell.attrs.get('target')
      if (!from || !to) errors.push(`edge ${cell.id} is missing source/target`)
      else if (!cellIds.has(from) || !cellIds.has(to)) errors.push(`edge ${cell.id} is dangling (${from} -> ${to})`)
    }
    const rectangles = []
    for (const cell of cells) if (cell.attrs.get('vertex') === '1' && !/connectable=0/.test(cell.attrs.get('style') || '')) {
      const geometry = cell.body.match(/<mxGeometry\b([^>]*)\/>/); if (!geometry) { errors.push(`vertex ${cell.id} has no geometry`); continue }
      const values = attributes(geometry[1]).result; const rect = ['x', 'y', 'width', 'height'].map((key) => Number(values.get(key)))
      if (rect.some((value) => !Number.isFinite(value))) errors.push(`vertex ${cell.id} has invalid geometry`)
      else rectangles.push({ id: cell.id, x: rect[0], y: rect[1], w: rect[2], h: rect[3] })
    }
    for (let left = 0; left < rectangles.length; left++) for (let right = left + 1; right < rectangles.length; right++) {
      const a = rectangles[left]; const b = rectangles[right]
      if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) errors.push(`overlapping vertices ${a.id} and ${b.id}`)
    }
  }
  if (!pages) errors.push('mxfile has no diagram pages')
  return errors
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const file = process.argv[2]; if (!file) throw new Error('Usage: validate-drawio.mjs <file.drawio>')
  const errors = validateDrawio(fs.readFileSync(file, 'utf8'))
  if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1 } else console.log(`draw.io validation: ok (${file})`)
}
