#!/usr/bin/env node
// Хук SessionStart: подсказывает Claude, что плагин agent-vorcl-flow активен,
// и перечисляет доступные субагенты и их команды.
const note = [
  "Плагин agent-vorcl-flow активен. Доступны субагенты и команды:",
  "- architect (архитектура): /architect:vorcl, /architect:analyze, /architect:design, /architect:review",
  "- backend (сервер): /backend:vorcl, /backend:create-api, /backend:refactor, /backend:optimize, /backend:test",
  "- frontend (React/Next.js): /frontend:vorcl, /frontend:create-component, /frontend:refactor, /frontend:optimize, /frontend:test",
  "- analyzer (аудит, read-only): /analyzer:vorcl, /analyzer:audit, /analyzer:bugs, /analyzer:types, /analyzer:db, /analyzer:mocks, /analyzer:backend",
  "- swagger (покрытие OpenAPI/Swagger, любой стек): /swagger:vorcl, /swagger:audit, /swagger:cover",
  "- firecrawl (веб-ресёрч через Firecrawl MCP): /firecrawl:vorcl, /firecrawl:search, /firecrawl:scrape, /firecrawl:map, /firecrawl:crawl, /firecrawl:extract",
  "- render (хостинг/деплой Render через MCP): /render:vorcl, /render:deploy, /render:logs, /render:status, /render:query",
  "- database (БД через MCP — Postgres/MongoDB/Redis): /database:vorcl, /database:query, /database:schema, /database:migrate, /database:optimize, /database:cache",
  "- resilience (обработка ошибок + логи): /resilience:vorcl, /resilience:harden, /resilience:logging, /resilience:audit",
  "- screenshot (скриншот UI → код): /screenshot:vorcl, /screenshot:analyze, /screenshot:convert, /screenshot:tokens, /screenshot:responsive",
  "- drawio (диаграммы draw.io/diagrams.net): /drawio:vorcl, /drawio:create, /drawio:pmp, /drawio:convert, /drawio:refine",
  "Правило: любая нетривиальная задача идёт через Task Master (скиллы workflow + task-master). Единая точка входа — /vorcl <цель>; у каждого агента есть свой /<agent>:vorcl.",
].join("\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: note },
  }),
);
