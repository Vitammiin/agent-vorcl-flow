#!/usr/bin/env node
// Хук SessionStart: подсказывает Claude, что плагин agent-vorcl-flow активен,
// и перечисляет доступные субагенты и их команды.
const note = [
  "Плагин agent-vorcl-flow активен. Доступны субагенты и команды:",
  "- architect (архитектура): /architect:goal, /architect:analyze, /architect:design, /architect:review",
  "- backend (сервер): /backend:goal, /backend:create-api, /backend:refactor, /backend:optimize, /backend:test",
  "- frontend (React/Next.js): /frontend:goal, /frontend:create-component, /frontend:refactor, /frontend:optimize, /frontend:test",
  "- analyzer (аудит, read-only): /analyzer:goal, /analyzer:audit, /analyzer:bugs, /analyzer:types, /analyzer:db, /analyzer:mocks, /analyzer:backend",
  "- swagger (покрытие Fastify Swagger/OpenAPI): /swagger:goal, /swagger:audit, /swagger:cover",
  "- firecrawl (веб-ресёрч через Firecrawl MCP): /firecrawl:goal, /firecrawl:search, /firecrawl:scrape, /firecrawl:map, /firecrawl:crawl, /firecrawl:extract",
  "- render (хостинг Render через MCP): /render:deploy, /render:logs, /render:status, /render:query",
  "Правило: любая нетривиальная задача идёт через Task Master (скиллы workflow + task-master). Единая точка входа — /goal <цель>; у каждого агента есть свой /<agent>:goal.",
].join("\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: note },
  }),
);
