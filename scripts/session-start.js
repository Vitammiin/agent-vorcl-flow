#!/usr/bin/env node
// Keep SessionStart cheap: discovery details are loaded only after a route is chosen.
const note = [
  "Agent-Vorcl-Flow активен.",
  "Точка входа: /vorcl <цель>; полный read-only аудит: /audit [путь].",
  "Роли вызываются как /<role>:vorcl. Основные маршруты: architect, principal-architect, backend, frontend, expo-mobile, analyzer, integrity, swagger, firecrawl, render, database, resilience, screenshot, design-studio, visual-research, pinpoint, drawio, archmap, mermaid, testing, gitflow, security, docs, devops, liveboard.",
  "Targeted hardcode/mock → integrity; broad quality audit → analyzer. Full multi-language architecture package → principal-architect; lightweight TS/JS map → archmap.",
  "Нетривиальные изменения веди через workflow + task-master; детали загружай из выбранной роли, не весь каталог.",
  "Если в scope есть PROJECT_DESCRIPTION.md: прочитай до правок, после правок проверь description impact через init-code и обнови затронутые разделы; stale описание блокирует done.",
].join("\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: note },
  }),
);
