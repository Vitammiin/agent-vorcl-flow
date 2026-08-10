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
  "- firecrawl (CLI → MCP → REST, build/workflows): /firecrawl:vorcl, /firecrawl:setup, /firecrawl:search, /firecrawl:scrape, /firecrawl:map, /firecrawl:crawl, /firecrawl:extract, /firecrawl:interact, /firecrawl:parse, /firecrawl:monitor, /firecrawl:agent, /firecrawl:research, /firecrawl:ask, /firecrawl:docs-search, /firecrawl:integrate, /firecrawl:deliverable",
  "- render (хостинг/деплой Render через MCP): /render:vorcl, /render:deploy, /render:logs, /render:status, /render:query",
  "- database (БД через MCP — Postgres/MongoDB/Redis): /database:vorcl, /database:query, /database:schema, /database:migrate, /database:optimize, /database:cache",
  "- resilience (обработка ошибок + логи): /resilience:vorcl, /resilience:harden, /resilience:logging, /resilience:audit",
  "- screenshot (скриншот UI → код): /screenshot:vorcl, /screenshot:analyze, /screenshot:convert, /screenshot:tokens, /screenshot:responsive",
  "- visual-research (скриншот → сайт, docs и live data): /visual-research:vorcl, /visual-research:identify, /visual-research:search, /visual-research:answer, /visual-research:hints",
  "- pinpoint (скриншот → место в существующем проекте, read-only): /pinpoint:vorcl, /pinpoint:locate, /pinpoint:route, /pinpoint:control, /pinpoint:trace, /pinpoint:handoff",
  "- drawio (диаграммы draw.io/diagrams.net): /drawio:vorcl, /drawio:create, /drawio:pmp, /drawio:convert, /drawio:refine",
  "- archmap (карта архитектуры кода: extraction → architecture.json → HTML/drawio/mermaid/PDF): /archmap:vorcl, /archmap:map, /archmap:extract, /archmap:annotate, /archmap:html, /archmap:diagram",
  "- mermaid (Mermaid-диаграммы + валидация/рендер через mcp-mermaid): /mermaid:vorcl, /mermaid:create, /mermaid:convert, /mermaid:validate, /mermaid:render, /mermaid:refine",
  "- testing (тесты + верификация testStrategy): /testing:vorcl, /testing:unit, /testing:integration, /testing:e2e, /testing:verify, /testing:coverage, /testing:flaky",
  "- gitflow (git-гигиена: коммиты, PR, changelog, релизы): /gitflow:vorcl, /gitflow:commit, /gitflow:pr, /gitflow:changelog, /gitflow:release, /gitflow:audit",
  "- security (аудит безопасности, read-only): /security:vorcl, /security:secrets, /security:owasp, /security:deps, /security:pii, /security:pre-push",
  "- docs (документация: README, API-docs, архитектура): /docs:vorcl, /docs:readme, /docs:api, /docs:architecture, /docs:contributing, /docs:release-notes, /docs:audit",
  "- devops (Docker + CI/CD): /devops:vorcl, /devops:dockerfile, /devops:compose, /devops:ci, /devops:env, /devops:monitoring",
  "- liveboard (эфемерное live-табло на 43 языках): /liveboard:start, /liveboard:vorcl",
  "Правило: любая нетривиальная задача идёт через Task Master (скиллы workflow + task-master). Единая точка входа — /vorcl <цель>; у каждого агента есть свой /<agent>:vorcl.",
  "Провайдер Task Master: /task-master:provider <openai|anthropic|codex-cli> [model-id]. Ключи берутся только из окружения.",
].join("\n");

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: note },
  }),
);
