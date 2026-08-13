import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const CANDIDATES = process.platform === 'darwin'
  ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge']
  : ['google-chrome', 'chromium', 'chromium-browser', 'microsoft-edge']

function findBrowser() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH
  for (const candidate of CANDIDATES) {
    if (path.isAbsolute(candidate) && fs.existsSync(candidate)) return candidate
    if (!path.isAbsolute(candidate)) { const result = spawnSync('which', [candidate], { encoding: 'utf8' }); if (result.status === 0) return result.stdout.trim() }
  }
}

function printableText(html) {
  const article = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)?.[1] || html
  return article
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<\/(?:h[1-6]|p|li|tr|div|section)>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
    .split('\n').map((line) => line.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n')
}

function wrap(text, width = 105) {
  const lines = []
  for (const paragraph of text.split('\n')) {
    let line = ''
    for (const word of paragraph.split(' ')) {
      if (line && `${line} ${word}`.length > width) { lines.push(line); line = word }
      else line = line ? `${line} ${word}` : word
    }
    if (line) lines.push(line)
  }
  return lines
}

function pdfEscape(value) {
  return value.replace(/[^\x20-\x7e]/g, '?').replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)')
}

function writeFallbackPdf(html, output) {
  const lines = wrap(printableText(fs.readFileSync(html, 'utf8')))
  const chunks = Array.from({ length: Math.max(1, Math.ceil(lines.length / 54)) }, (_, index) => lines.slice(index * 54, (index + 1) * 54))
  const objects = new Map(); const pageRefs = []
  objects.set(1, '<< /Type /Catalog /Pages 2 0 R >>')
  objects.set(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  chunks.forEach((pageLines, index) => {
    const contentNumber = 4 + index * 2; const pageNumber = contentNumber + 1
    const commands = `BT\n/F1 9 Tf\n42 760 Td\n12 TL\n${pageLines.map((line) => `(${pdfEscape(line)}) Tj T*`).join('\n')}\nET`
    objects.set(contentNumber, `<< /Length ${Buffer.byteLength(commands)} >>\nstream\n${commands}\nendstream`)
    objects.set(pageNumber, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentNumber} 0 R >>`)
    pageRefs.push(`${pageNumber} 0 R`)
  })
  objects.set(2, `<< /Type /Pages /Kids [${pageRefs.join(' ')}] /Count ${pageRefs.length} >>`)
  const max = Math.max(...objects.keys()); let body = '%PDF-1.4\n% architecture-report\n'; const offsets = [0]
  for (let number = 1; number <= max; number++) {
    offsets[number] = Buffer.byteLength(body)
    body += `${number} 0 obj\n${objects.get(number)}\nendobj\n`
  }
  const xref = Buffer.byteLength(body)
  body += `xref\n0 ${max + 1}\n0000000000 65535 f \n${offsets.slice(1).map((offset) => `${String(offset).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${max + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(output, body, 'binary')
  return { status: 'generated', renderer: 'built-in-pdf-fallback', bytes: fs.statSync(output).size }
}

export function renderPdf(html, output) {
  const browser = findBrowser()
  if (!browser) return writeFallbackPdf(html, output)
  const result = spawnSync(browser, ['--headless', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${path.resolve(output)}`, `file://${path.resolve(html)}`], { encoding: 'utf8', timeout: 120_000 })
  if (result.status !== 0 || !fs.existsSync(output)) return { ...writeFallbackPdf(html, output), browserFailure: (result.stderr || result.stdout || 'browser failed').trim() }
  return { status: 'generated', browser, bytes: fs.statSync(output).size }
}

if (import.meta.url === `file://${process.argv[1]}`) console.log(JSON.stringify(renderPdf(process.argv[2], process.argv[3]), null, 2))
