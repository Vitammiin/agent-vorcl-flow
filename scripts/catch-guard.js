#!/usr/bin/env node
// Хук PostToolUse (плагин agent-vorcl-flow): после Edit/Write/MultiEdit проверяет
// изменённый JS/TS-файл на «тихие» catch (пустые или только с комментарием) и
// мягко, НЕ блокируя, советует добавить обработку/проброс/лог. Молчит, если проблем нет.
// Это подпорка роли `resilience` и правила проекта «обработка ошибок без тихих падений».

const fs = require("fs");

function exitQuiet() {
  process.exit(0);
}

let raw = "";
try {
  raw = fs.readFileSync(0, "utf8");
} catch {
  exitQuiet();
}

let data;
try {
  data = JSON.parse(raw || "{}");
} catch {
  exitQuiet();
}

const fp = data?.tool_input?.file_path || data?.tool_input?.path;
// только исходники JS/TS (.js/.jsx/.ts/.tsx/.mjs/.cjs/.mts/.cts)
if (!fp || !/\.(?:[cm]?jsx?|[cm]?tsx?)$/.test(fp)) exitQuiet();

let src = "";
try {
  src = fs.readFileSync(fp, "utf8");
} catch {
  exitQuiet();
}

// catch-блок, содержащий только пробелы и/или комментарии → «тихое» падение
const silentCatch = /catch\s*(?:\([^)]*\))?\s*\{\s*(?:\/\/[^\n]*\s*|\/\*[\s\S]*?\*\/\s*)*\}/g;

const hits = [];
let m;
while ((m = silentCatch.exec(src)) !== null) {
  const line = src.slice(0, m.index).split("\n").length;
  hits.push(line);
  if (hits.length >= 20) break;
}

if (hits.length === 0) exitQuiet();

const list = hits.map((l) => `  • ${fp}:${l}`).join("\n");
const note =
  `⚠️ resilience-guard: «тихие» catch без обработки/проброса/лога:\n${list}\n` +
  `В каждом catch сделай одно: обработай + залогируй, пробрось (throw new AppError(msg, { cause: error })) ` +
  `или преобразуй в доменную ошибку. Не логируй секреты/PII. Помощь: /resilience:harden ${fp}`;

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "PostToolUse", additionalContext: note },
  }),
);
process.exit(0);
