#!/usr/bin/env node
// Offline locale navigation. Only English and Russian are full maintained guides.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const locales = [
  ['en', 'English'], ['ru', 'Русский'],
  ['uk', 'Українська', 'Актуальна документація доступна англійською та російською. Ця сторінка містить посилання, а не повний переклад.'],
  ['de', 'Deutsch', 'Die aktuelle Dokumentation ist auf Englisch und Russisch verfügbar. Diese Seite enthält Links, keine vollständige Übersetzung.'],
  ['fr', 'Français', 'La documentation actuelle est disponible en anglais et en russe. Cette page contient des liens, pas une traduction complète.'],
  ['es', 'Español', 'La documentación actual está disponible en inglés y ruso. Esta página contiene enlaces, no una traducción completa.'],
  ['pt', 'Português', 'A documentação atual está disponível em inglês e russo. Esta página contém links, não uma tradução completa.'],
  ['it', 'Italiano', 'La documentazione aggiornata è disponibile in inglese e russo. Questa pagina contiene collegamenti, non una traduzione completa.'],
  ['pl', 'Polski', 'Aktualna dokumentacja jest dostępna w języku angielskim i rosyjskim. Ta strona zawiera odnośniki, a nie pełne tłumaczenie.'],
  ['tr', 'Türkçe', 'Güncel belgeler İngilizce ve Rusça olarak mevcuttur. Bu sayfa tam çeviri değil, bağlantılar içerir.'],
  ['zh-CN', '中文', '最新文档提供英文和俄文版本。本页仅提供链接，并非完整翻译。'],
  ['ja', '日本語', '最新のドキュメントは英語とロシア語で提供されています。このページはリンク集であり、完全な翻訳ではありません。'],
  ['ko', '한국어', '최신 문서는 영어와 러시아어로 제공됩니다. 이 페이지는 전체 번역이 아닌 링크 안내입니다.'],
  ['ar', 'العربية', 'الوثائق الحالية متاحة بالإنجليزية والروسية. تحتوي هذه الصفحة على روابط وليست ترجمة كاملة.'],
  ['nl', 'Nederlands', 'De actuele documentatie is beschikbaar in het Engels en Russisch. Deze pagina bevat links, geen volledige vertaling.'],
  ['cs', 'Čeština', 'Aktuální dokumentace je dostupná v angličtině a ruštině. Tato stránka obsahuje odkazy, nikoli úplný překlad.'],
  ['ro', 'Română', 'Documentația actuală este disponibilă în engleză și rusă. Această pagină conține linkuri, nu o traducere completă.'],
  ['hu', 'Magyar', 'Az aktuális dokumentáció angol és orosz nyelven érhető el. Ez az oldal hivatkozásokat tartalmaz, nem teljes fordítást.'],
  ['bg', 'Български', 'Актуалната документация е на английски и руски. Тази страница съдържа връзки, а не пълен превод.'],
  ['sr', 'Српски', 'Актуелна документација је доступна на енглеском и руском. Ова страница садржи везе, а не потпун превод.'],
  ['hi', 'हिन्दी', 'वर्तमान दस्तावेज़ अंग्रेज़ी और रूसी में उपलब्ध हैं। इस पृष्ठ में लिंक हैं, पूरा अनुवाद नहीं।'],
  ['vi', 'Tiếng Việt', 'Tài liệu hiện tại có bằng tiếng Anh và tiếng Nga. Trang này cung cấp liên kết, không phải bản dịch đầy đủ.'],
]
const fileFor = (code) => code === 'en' ? 'README.md' : `translations/README.${code}.md`
const links = (active) => locales.map(([code, label]) => {
  const target = active === 'en' ? `./${fileFor(code)}` : code === 'en' ? '../README.md' : `./README.${code}.md`
  return `[${label}](${target})`
}).join(' · ')
const navigation = (code) => `<!-- languages:start -->\n${links(code)}\n<!-- languages:end -->`
const notice = ([code, label, message]) => `# Agent-Vorcl-Flow — ${label}\n\n<!-- Localized navigation only; generated offline by scripts/readme-locales.mjs. -->\n\n${code === 'ar' ? `<p dir="rtl">${message}</p>` : message}\n\n[English guide](../README.md) · [Русское руководство](./README.ru.md) · [Migration](../docs/MIGRATION.md)\n\n${navigation(code)}\n`
const fences = (text) => text.match(/```[\s\S]*?```/g) ?? []

function generate() {
  for (const locale of locales) {
    const [code] = locale; const file = path.join(root, fileFor(code))
    if (code === 'en' || code === 'ru') {
      const before = fs.readFileSync(file, 'utf8')
      if (!/<!-- languages:start -->[\s\S]*?<!-- languages:end -->/.test(before)) throw new Error(`Missing navigation markers: ${fileFor(code)}`)
      fs.writeFileSync(file, before.replace(/<!-- languages:start -->[\s\S]*?<!-- languages:end -->/, navigation(code)))
    } else fs.writeFileSync(file, notice(locale))
  }
}
function check() {
  const errors = []
  for (const locale of locales) {
    const [code] = locale; const file = path.join(root, fileFor(code))
    if (!fs.existsSync(file)) { errors.push(`Missing ${fileFor(code)}`); continue }
    const source = fs.readFileSync(file, 'utf8')
    if (!source.includes(navigation(code))) errors.push(`Stale navigation: ${fileFor(code)}`)
    if (!['en', 'ru'].includes(code) && source !== notice(locale)) errors.push(`Stale localized pointer: ${fileFor(code)}`)
    for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0]
      if (target && !/^[a-z]+:/i.test(target) && !fs.existsSync(path.resolve(path.dirname(file), target))) errors.push(`Broken local link in ${fileFor(code)}: ${target}`)
    }
  }
  const en = fs.readFileSync(path.join(root, 'README.md'), 'utf8')
  const ru = fs.readFileSync(path.join(root, 'translations/README.ru.md'), 'utf8')
  if (JSON.stringify(fences(en)) !== JSON.stringify(fences(ru))) errors.push('English and Russian command examples differ')
  if ((en.match(/^## /gm) ?? []).length !== (ru.match(/^## /gm) ?? []).length) errors.push('English and Russian section counts differ')
  if (errors.length) throw new Error(errors.join('\n'))
  console.log(`README check: 2 maintained guides, ${locales.length - 2} localized pointers; links and command examples verified`)
}
try {
  const args = process.argv.slice(2)
  if (args.length > 1 || args.some((arg) => !['--check', '--generate', '--help'].includes(arg))) throw new Error('Usage: readme-locales.mjs --check | --generate | --help')
  if (args[0] === '--help') console.log('Offline locale navigation: --check | --generate')
  else { if (args[0] === '--generate') generate(); check() }
} catch (error) { console.error(error.message); process.exitCode = 1 }
