---
name: principal-architecture
description: "Создавать и обновлять production-grade архитектурный пакет текущего репозитория строго по исходному коду, конфигурации, схемам БД, manifests, CI/CD и IaC: сначала ARCHITECTURE.md с file:line evidence, затем JSON, self-contained HTML, PDF, draw.io и копируемые Mermaid L0-L4. Use when нужно нарисовать реальную архитектуру существующего проекта, провести code-aware architecture review, показать data/event/AI/MCP/deployment/security flows или обновить ранее созданные архитектурные артефакты. Не использовать Markdown-описания как доказательство фактической topology."
---

# Principal Architecture

Строить архитектуру работающего репозитория, а не иллюстрацию его README. Всегда начинать с кода и машинных конфигураций. Отделять `CURRENT` от review-рекомендаций; `TARGET` и `MIGRATION` добавлять только по явному запросу `--target`.

## Обязательный pipeline

1. Работать относительно текущего repository root (`cwd`); указанный `--scope` обязан оставаться внутри него.
2. Для нетривиальной цели пройти `$workflow` + `$task-master` через `$principal-architect-vorcl`.
3. Запустить независимый bundled runtime:

```bash
node "<skill-root>/scripts/principal-architecture.mjs" create [--scope <relative-path>] [--formats all|md,html,pdf,drawio,mermaid] [--target]
node "<skill-root>/scripts/principal-architecture.mjs" update [те же параметры]
node "<skill-root>/scripts/principal-architecture.mjs" validate --out <relative-output>
```

4. По умолчанию писать в `docs/architecture/<scope-slug>/` внутри анализируемого репозитория.
5. Сначала материализовать `ARCHITECTURE.md`, затем остальные представления из единого `architecture.model.json`.
6. Проверить JSON evidence, self-contained HTML, draw.io XML, Mermaid реальным рендером при наличии `mmdc`, PDF визуально при наличии Chrome/Poppler.
7. Для draw.io обязательно запустить `node "<skill-root>/scripts/validate-drawio.mjs" <architecture.drawio>`; проверка включает page-scoped IDs, dangling edges, geometry и overlaps.

## Evidence contract

- Каждый фактический node и edge обязан иметь `evidence:[{file,line,parser,confidence}]`.
- Не считать README, `.md` и комментарии доказательством topology. Они допустимы только как `declared/unverified` в human annotations.
- Не исполнять код целевого проекта, package scripts, build tools или migrations.
- Не читать значения секретов. Сохранять только имена env-переменных и redacted connection type.
- Не следовать по symlink и не писать за пределами repository root.
- Dynamic/reflection/runtime wiring, которое нельзя доказать, оставлять в `Unknowns`.

## Portable parsers

Bundled Tree-sitter WASM поддерживает JS/JSX, TS/TSX, Python, Go, Java, C#, Rust, PHP, Ruby, Kotlin и Swift. Declarative scanners покрывают JSON/YAML/TOML/XML, SQL/Prisma/GraphQL/OpenAPI, Terraform/HCL, Docker/Compose, Kubernetes и GitHub Actions. При parse error понижать confidence и сообщать это; не выдумывать недостающие связи.

## Create и update

- `create` отказывается перезаписывать существующий managed package и предлагает `update`.
- `update` всегда делает полный rescan, строит результат во временном каталоге, валидирует и только затем заменяет файлы из manifest.
- Сохранять `architecture.config.json`, `architecture.annotations.json` и любые unmanaged-файлы пользователя.
- Писать `architecture.diff.json` с added/removed/changed nodes и edges.
- Если Chrome/Chromium/Edge отсутствует, создавать portable text-first PDF встроенным renderer; отсутствие браузера не отменяет PDF-артефакт.
- Настройки визуализации хранить в `architecture.config.json > diagram`: `theme`, `audience`, `detail`, `maxNodesPerPage`. По умолчанию использовать adaptive detail и не более 24 конкретных nodes на draw.io page.

## Архитектурное мышление

Читать [architecture-methodology.md](references/architecture-methodology.md) для system/data/event/AI/security/platform review. Читать [evidence-model.md](references/evidence-model.md) при изменении extraction/schema. Читать [rendering-contract.md](references/rendering-contract.md) при изменении визуальных артефактов.

Не усложнять ради схемы: по умолчанию предпочитать modular monolith с эволюционными boundaries. Microservices, Kafka, CQRS, Event Sourcing, Kubernetes и дополнительные databases рекомендовать только при доказанной нагрузке, ownership, SLA, isolation или history/replay необходимости.

## Формат сдачи

Отдать путь к каталогу, сводку stats, detected parsers, findings по severity, unknowns, diff для update и статус каждого формата. Ни одного утверждения о CURRENT без evidence из `architecture.model.json`.
