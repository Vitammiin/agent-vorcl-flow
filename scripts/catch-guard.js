#!/usr/bin/env node
// Хук PostToolUse (плагин agent-vorcl-flow): после Edit/Write/MultiEdit подсвечивает
// ТОЛЬКО реально пустые `catch {}` (без обработки/проброса/лога и даже без комментария)
// в изменённом JS/TS-файле и мягко, НЕ блокируя, советует /resilience:harden.
//
// Гарантии: не блокирует (только additionalContext), не падает (любой сбой → тихий exit 0),
// работает ЛИНЕЙНО по времени без regex-backtracking, молчит если проблем нет.
// Не флагуется: задокументированный no-op `catch { /* почему */ }` и строка с маркером
// подавления `catch-guard-ignore`.

const fs = require("fs");
function quiet() {
  process.exit(0);
}

let raw = "";
try {
  raw = fs.readFileSync(0, "utf8");
} catch {
  quiet();
}

let data;
try {
  data = JSON.parse(raw || "{}");
} catch {
  quiet();
}

const fp = data?.tool_input?.file_path || data?.tool_input?.path;
if (!fp || !/\.(?:[cm]?jsx?|[cm]?tsx?)$/.test(fp)) quiet();

// только обычный файл разумного размера (не FIFO/сокет/каталог; не гигантский бандл)
let stat;
try {
  stat = fs.statSync(fp);
} catch {
  quiet();
}
if (!stat.isFile() || stat.size > 1_000_000) quiet();

let src = "";
try {
  src = fs.readFileSync(fp, "utf8");
} catch {
  quiet();
}

// Один линейный проход: содержимое строк/шаблонов/комментариев → пробелы (длина и \n сохранены),
// чтобы не ловить catch/скобки внутри них и не давать поводов для backtracking.
function strip(s) {
  const out = new Array(s.length);
  let st = "code"; // code | line | block | sq | dq | tpl
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const d = s[i + 1];
    const nl = c === "\n";
    if (st === "code") {
      if (c === "/" && d === "/") { out[i] = " "; out[++i] = " "; st = "line"; continue; }
      if (c === "/" && d === "*") { out[i] = " "; out[++i] = " "; st = "block"; continue; }
      if (c === "'") { out[i] = " "; st = "sq"; continue; }
      if (c === '"') { out[i] = " "; st = "dq"; continue; }
      if (c === "`") { out[i] = " "; st = "tpl"; continue; }
      out[i] = c;
      continue;
    }
    if (st === "line") { out[i] = nl ? "\n" : " "; if (nl) st = "code"; continue; }
    if (st === "block") {
      if (c === "*" && d === "/") { out[i] = " "; out[++i] = " "; st = "code"; continue; }
      out[i] = nl ? "\n" : " ";
      continue;
    }
    // строковые состояния: sq | dq | tpl
    if (c === "\\") { out[i] = " "; if (i + 1 < s.length) out[++i] = s[i] === "\n" ? "\n" : " "; continue; }
    const end = (st === "sq" && c === "'") || (st === "dq" && c === '"') || (st === "tpl" && c === "`");
    out[i] = nl ? "\n" : " ";
    if (end) st = "code";
  }
  return out.join("");
}

// Смещения переводов строк — один проход; номер строки и текст строки за O(log n)/O(1).
const nlOffsets = [];
for (let i = 0; i < src.length; i++) if (src[i] === "\n") nlOffsets.push(i);
function lineAt(pos) {
  let lo = 0, hi = nlOffsets.length;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (nlOffsets[mid] < pos) lo = mid + 1; else hi = mid; }
  return lo + 1;
}
function lineText(line) {
  const start = line > 1 ? nlOffsets[line - 2] + 1 : 0;
  const end = line - 1 < nlOffsets.length ? nlOffsets[line - 1] : src.length;
  return src.slice(start, end);
}

const code = strip(src);
const re = /(^|[^.\w$])catch\b/g; // 'catch' как ключевое слово, не `.catch(...)` и не часть идентификатора
const hits = [];
let m;
while ((m = re.exec(code)) !== null && hits.length < 20) {
  const catchPos = m.index + m[1].length;
  let j = catchPos + 5; // сразу после 'catch'
  while (j < code.length && /\s/.test(code[j])) j++;
  if (code[j] === "(") { // необязательный (param) — пропускаем по балансу скобок
    let depth = 1;
    j++;
    while (j < code.length && depth > 0) {
      const ch = code[j++];
      if (ch === "(") depth++;
      else if (ch === ")") depth--;
    }
  }
  while (j < code.length && /\s/.test(code[j])) j++;
  if (code[j] !== "{") continue;
  let p = j + 1;
  while (p < code.length && /\s/.test(code[p])) p++;
  if (code[p] !== "}") continue; // тело не пустое (есть код) → пропускаем
  if (src.slice(j + 1, p).trim() !== "") continue; // в оригинале есть комментарий → задокументировано
  const line = lineAt(catchPos);
  if (lineText(line).includes("catch-guard-ignore")) continue; // явное подавление
  hits.push(line);
}

if (hits.length === 0) quiet();

const list = hits.map((l) => `  • ${fp}:${l}`).join("\n");
process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext:
        `⚠️ resilience-guard: пустой catch {} без обработки/проброса/лога:\n${list}\n` +
        `Сделай одно: обработай + залогируй, пробрось (throw new AppError(msg, { cause: error })) ` +
        `или преобразуй в доменную ошибку. Задокументированный no-op (catch { /* почему */ }) не флагуется; ` +
        `для намеренного пустого — маркер catch-guard-ignore в строке. Помощь: /resilience:harden ${fp}`,
    },
  }),
);
process.exit(0);
