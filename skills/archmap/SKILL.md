---
name: archmap
description: Карта архитектуры кода из любого TS/JS-репозитория — детерминированный extraction скриптами в architecture.json (каждый узел с source:{file,line}) и rendering в интерактивный HTML, draw.io, Mermaid, ARCHITECTURE.md и PDF. Use when нужно построить карту архитектуры, ERD, граф связей «кто к чему имеет доступ» (базы, роуты, AI-агенты, память, env, технологии) или интерактивную схему по коду. Триггеры — карта архитектуры, architecture map, ERD по коду, граф зависимостей, визуализировать проект, architecture.json.
version: 1.0.0
---

# Навык: archmap — карта архитектуры кода

Двухфазный конвейер: **Extraction** (детерминированные zero-dependency Node-скрипты обходят репо и пишут `architecture.json`, где каждый узел и ребро несут `source:{file,line}`) → **Rendering** (все форматы рисуются строго из JSON — ни одного факта «из головы»). LLM-фаза может дополнить семантику (агенты, память, роуты доступа) только со ссылками на источники; всё бездоказательное принудительно помечается `inferred:true` и рисуется пунктиром.

**Навигатор.** База: [Пайплайн](#1-пайплайн) → [Спека architecture.json](#2-спека-architecturejson-v1) → [LLM-аннотация](#3-llm-аннотация-annotationsjson). Рендеры: [Форматы](#4-рендеры). Перед сдачей: [Правила качества](#5-правила-качества) → [Антипаттерны](#антипаттерны).

## 1. Пайплайн

Скрипты лежат в `<skill-root>/scripts/` (только `node:*`, npm-зависимостей нет). Рабочий каталог пайплайна — `.archmap/` в целевом репо (предложи добавить в `.gitignore`), итоговые артефакты копируются в `docs/architecture/`.

```bash
S="<skill-root>/scripts"; R="<target-repo>"; O="$R/.archmap"
node "$S/scan.mjs" --root "$R" --out-dir "$O"                 # → plan.json (стеки, списки файлов, typescript)
node "$S/extract-data.mjs"    --root "$R" --plan "$O/plan.json" --out "$O/data.part.json"     # ─┐
node "$S/extract-api.mjs"     --root "$R" --plan "$O/plan.json" --out "$O/api.part.json"      #  │ независимы —
node "$S/extract-agents.mjs"  --root "$R" --plan "$O/plan.json" --out "$O/agents.part.json"   #  │ запускай одной
node "$S/extract-modules.mjs" --root "$R" --plan "$O/plan.json" --out "$O/modules.part.json"  #  │ параллельной пачкой
node "$S/extract-env.mjs"     --root "$R" --plan "$O/plan.json" --out "$O/env.part.json"      # ─┘
node "$S/merge.mjs" --root "$R" --parts "$O/*.part.json" --out "$O/architecture.json" --check
# ── (опц.) LLM-фаза: прочитай architecture.json, напиши $O/annotations.json, затем: ──
node "$S/merge.mjs" --root "$R" --parts "$O/*.part.json" --annotate "$O/annotations.json" --out "$O/architecture.json" --check
node "$S/to-html.mjs"    --in "$O/architecture.json" --out "$O/architecture.html"
node "$S/to-drawio.mjs"  --in "$O/architecture.json" --out "$O/architecture.drawio"
node "$S/to-mermaid.mjs" --in "$O/architecture.json" --out "$O/architecture.mmd" --view overview
node "$S/to-md.mjs"      --in "$O/architecture.json" --out "$O/ARCHITECTURE.md"
node "$S/to-pdf.mjs"     --in "$O/architecture.html" --out "$O/architecture.pdf"   # мягкий skip без Chrome
```

Экстрактор недетектированного стека пишет пустой part-файл и выходит с кодом 0. Скрипт `scan.mjs` грузит **только** пакет `typescript` из node_modules целевого репо (`createRequire`, per-file `createSourceFile`, код проекта не исполняется); если его нет — regex-fallback (`stacks.parser:"regex"`, узлы с `meta.parser:"regex"`), Prisma/SQL/Next-структура/agents-md при этом не деградируют.

## 2. Спека architecture.json (v1)

Корень: `version, generatedAt, root, repo{name,monorepo,packages[{name,path}]}, stacks{detected[],parser,tsVersion,evidence}, layers[6], nodes[], edges[], stats`.

Слои фиксированы (порядок = колонки рендеров): `client #38bdf8 · api #34d399 · agents #a78bfa · logic #fbbf24 · data #f472b6 · infra #94a3b8`.

**Node** — `{id, kind, layer, label, source:{file,line}, inferred, meta}`. Все поля обязательны; `source.file` относителен root (POSIX). Kinds по слоям:

| layer | kinds |
|---|---|
| data | `table`, `enum`, `store` (meta.storeKind: redis\|queue\|vector\|s3\|cache) |
| api | `route`, `ws`, `webhook`, `cron`, `mcp-server`, `mcp-tool`, `middleware` |
| agents | `agent`, `llm-call`, `memory` |
| logic | `module`, `package` |
| infra | `env`, `external-service`, `tech` |
| client | `page`, `component` |

Id детерминированы: `table:User`, `route:GET /api/users/:id`, `module:src/lib/db.ts`, `pkg:@app/web`, `env:DATABASE_URL`, `agent:analyzer`, `mcp:firecrawl`, `mcp:firecrawl/tool:scrape`, `svc:stripe`, `store:redis:main`, `cron:cleanup`, `tech:fastify`.

**Колонки таблиц — в meta** (не отдельные узлы): `meta.columns: [{name, type, pk?, fk?:{table,column}, unique?, nullable?, line}]`, `meta.indexes`, `meta.orm`. **Параметры роутов — в meta**: `meta.method, meta.path, meta.params[{name,in,type,required}], meta.middleware[], meta.handler{file,line,name}, meta.auth, meta.framework`.

**Edge** — `{id:"e:<kind>:<from>-><to>", kind, from, to, label?, source, inferred, meta}`. Kinds: `fk` (meta.cardinality: 1:1|1:N|N:1|N:M, meta.through для N:M), `import`, `depends` (workspace-пакеты), `handles` (route→module), `uses` (→store/table/svc), `reads-env`, `invokes` (→svc модели; meta.model, meta.provider), `member` (mcp-server→tool, agent→tool), `guards` (middleware→route), `dataflow` (семантика LLM, почти всегда inferred).

Контракт (валидирует `merge.mjs --check`): каждое `from`/`to` существует (иначе stub `inferred:true`); стабильная сортировка nodes/edges — повторный прогон байт-в-байт идентичен; циклы SCC помечаются `meta.cycle:true`.

## 3. LLM-аннотация (annotations.json)

Файл той же формы `{nodes:[], edges:[]}`. Правила: добавляй только то, чего экстракторы не видят (семантические `dataflow`-рёбра, память агентов, назначение модулей); каждому элементу давай лучшее доказательство `source:{file,line}`; **merge сам проверит** — файл не существует или line вне диапазона → элемент принудительно `inferred:true`. Не дублируй существующие id — merge отдаст приоритет извлечённым данным.

## 4. Рендеры

| Формат | Скрипт | Что внутри |
|---|---|---|
| `architecture.html` | `to-html.mjs` | Главный артефакт: self-contained, тёмная тема, SVG-колонки по слоям, тумблеры слоёв, чекбокс inferred, клик по узлу → панель file:line/колонки/params/рёбра, Trace up/down, поиск, pan/zoom/fit, print-CSS (Cmd+P → PDF) |
| `architecture.drawio` | `to-drawio.mjs` | Многостраничный mxfile: Overview (слои-контейнеры) / Data ERD (shape=table, ER-стрелки по cardinality) / API / Agents; `--pages` выбирает подмножество; проверь `xmllint --noout` |
| `architecture.mmd` | `to-mermaid.mjs` | `--view overview|data|api|modules|all`: flowchart LR с subgraph-слоями, erDiagram для данных; cap ~80 узлов с агрегацией; валидируй `/mermaid:validate` |
| `ARCHITECTURE.md` | `to-md.mjs` | Обзор стеков + mermaid-блоки + таблицы роутов/таблиц/агентов/ENV со ссылками `file#L`; секция Inferred отдельно |
| `architecture.pdf` | `to-pdf.mjs` | Chrome/Chromium/Edge headless `--print-to-pdf` (ищется по каноническим путям + `CHROME_PATH`); нет браузера — skip с подсказкой про Cmd+P |

Во всех рендерах `inferred` рисуется пунктиром/бейджем — это обязательное требование, не опция.

## 5. Правила качества

- **Узел без source не существует.** Ни один рендер не рисует то, чего нет в architecture.json; агент никогда не «дорисовывает» связи в HTML/drawio руками.
- **Повторяемость.** Дважды прогнанный пайплайн на неизменённом репо обязан дать идентичный граф — расходиться может только `generatedAt` (он берётся из времени скана; повторный `merge` тех же part-файлов даёт и его тем же). Любое расхождение в `nodes`/`edges` — баг экстрактора, а не «особенность».
- **Большие графы.** Схлопывание делает `merge.mjs` (по умолчанию `--detail auto`): >150 файловых module-узлов → директории (файлы остаются в `meta.files`, рёбра ремапятся и агрегируются с `meta.count`), `stats.truncated:true`; `--detail full` отключает. Экстракторы всегда пишут file-уровень. Mermaid-overview дополнительно капится ~80 узлами.
- **Read-only к целевому репо**: пайплайн пишет только в `--out-dir` и `docs/architecture/`.
- **Проверка артефактов**: HTML открывается с `file://` без сети; drawio — `xmllint --noout`; mermaid — реальный рендер; счётчики в ARCHITECTURE.md — из stats, не по памяти.

## Антипаттерны

Рисовать схему до/вместо extraction («красивая, но выдуманная»); узлы и рёбра без `source:{file,line}` или с выдуманными путями; немаркированные LLM-догадки (обязан быть `inferred:true` + пунктир); колонки таблиц как отдельные узлы (взрыв графа — колонки живут в meta); `createProgram`/type-checker или исполнение кода целевого проекта (только per-file AST); правка architecture.json руками вместо annotations.json (перетрётся следующим merge); рендер из головы при пустом part-файле вместо честного «стек не задетектирован»; игнорировать `stats.truncated` и выдавать усечённый граф за полный.
