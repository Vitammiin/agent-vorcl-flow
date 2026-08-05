#!/usr/bin/env node
// Хук PostToolUse (плагин agent-vorcl-flow): после Edit/Write/MultiEdit подсвечивает
// ТОЛЬКО реально пустые `catch {}` (без обработки/проброса/лога и даже без комментария)
// в изменённом JS/TS-файле и мягко, НЕ блокируя, советует /resilience:harden.
//
// Гарантии: не блокирует (только additionalContext), не падает (любой сбой → тихий exit 0),
// работает ЛИНЕЙНО по времени без regex-backtracking, молчит если проблем нет.
// Документированный no-op `catch { /* почему */ }` намеренно НЕ флагуется.

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

let src = "";
try {
  src = fs.readFileSync(fp, "utf8");
} catch {
  quiet();
}
if (src.length > 1_000_000) quiet(); // очень большие файлы не сканируем

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
  hits.push(src.slice(0, catchPos).split("\n").length);
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
        `или преобразуй в доменную ошибку. Задокументированный no-op (catch { /* почему */ }) не флагуется. ` +
        `Помощь: /resilience:harden ${fp}`,
    },
  }),
);
process.exit(0);
