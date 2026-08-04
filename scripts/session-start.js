#!/usr/bin/env node
// Хук SessionStart: подсказывает Claude, что плагин agent-vorcl-flow активен,
// и перечисляет доступные субагенты и их команды.
const note = [
  "Плагин agent-vorcl-flow активен. Доступны субагенты и команды:",
  "- architect (архитектура): /architect:analyze, /architect:design, /architect:review",
  "- backend (сервер): /backend:create-api, /backend:refactor, /backend:optimize, /backend:test",
].join("\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: note },
  }),
);
