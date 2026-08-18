# Project Audit

## Audit metadata

- Repository: `agent-vorcl-flow`
- Scope: read-only аудит ролей, skills, команд, Task Master workflow, адаптеров, установщика и проверок синхронизации
- Commit/worktree: `1cd00348b10dda30b1a75def339528223719dfc4`; до аудита рабочее дерево уже содержало 58 изменений текущей разработки
- Timestamp/timezone: `2026-08-17 11:55:46 EDT` (`2026-08-17T15:55:46Z`)
- Roles: `project-audit`, `architect-review`; независимые проходы prompts, orchestrator и adapters
- Package managers: npm; четыре lockfile-копии для двух design-studio utilities
- Advisory status: npm advisory проверен онлайн в `2026-08-17T15:55:46Z`

## Executive summary

Вердикт: концепция сильная, реализация оркестратора пока небезопасна для параллельной работы и неэкономна по контексту. Роли обычно хорошо ограничены по предметной области и требуют доказательства, но реестры и зеркала дублируются, а Task Master не изолирует задачи одного запуска.

Приоритет: сначала изоляция run/task и безопасный upgrade установщика; затем единый реестр ролей/skills и сокращение eager-контекста. После этого система станет заметно проще и дешевле без потери возможностей.

## Detected systems and architecture

Текущий поток: `agents/*.md` + `commands/**/*.md` + `skills/*` → ручные зеркала `codex/skills/*` и глобальный `codex/AGENTS.md` → npm installer → Claude/Codex/Cursor/Kimi. Task Master хранит общий backlog в `.taskmaster/tasks/tasks.json`; `/vorcl` выбирает задачи из него без run scope.

Инвентарь: 25 ролей, 154 команды, 49 канонических skills и 223 Codex skills. Prompt-корпус: agents 185 KB, canonical skills 316 KB, Codex skills 547 KB; дополнительно каждый Codex-сеанс получает 27.7 KB `AGENTS.md`, Claude SessionStart — 5.7 KB каталога.

## Findings

### AUD-001 — [high] Запуск оркестратора не изолирован от общего backlog

- Boundary: Cross-cutting
- Evidence: `skills/workflow/SKILL.md:33` создаёт задачу, `skills/workflow/SKILL.md:34` вызывает глобальный `next_task`, а `skills/workflow/SKILL.md:39` продолжает до исчерпания задач; в этом аудите после создания задачи 27 `next_task` вернул чужую задачу 13. Переход в `in-progress` отсутствует в `commands/vorcl.md:11`.
- Root cause: нет run/goal ID, allowlist созданных task IDs, owner/lease и атомарного claim.
- Impact: агент может выполнить или закрыть чужую задачу; два агента могут одновременно взять одну задачу.
- Fix: возвращать и сохранять `runId` + созданные IDs; выбирать только внутри run; атомарно делать `pending → in-progress` с owner/lease; завершать цикл по allowlist, не по всему backlog.
- Target state: один вызов `/vorcl` видит и закрывает только свои задачи; повторный claim невозможен.
- Verify: интеграционный тест с двумя runs и общим backlog; каждый получает только собственные IDs, stale lease обрабатывается явно.
- Owner: architect, testing

### AUD-002 — [high] Установщик ломает fallback и не обновляет уже установленную конфигурацию

- Boundary: Infrastructure
- Evidence: `bin/install.mjs:184` предполагает массив `enabledPlugins` и на `bin/install.mjs:185` вызывает `.includes/.push`, хотя object-form приводит к `TypeError`; `bin/install.mjs:216` полностью пропускает существующий marked block, поэтому новые profiles/MCP/AGENTS не устанавливаются.
- Root cause: схема settings не нормализуется, а marker append используется вместо структурного merge/versioned replace.
- Impact: Claude fallback может не включить plugin; Codex upgrade навсегда сохраняет устаревшие инструкции и способен конфликтовать с пользовательскими TOML tables.
- Fix: поддержать array/object/malformed fixtures; TOML разбирать, сливать только owned keys, marked block заменять атомарно и валидировать перед rename.
- Target state: повторная установка идемпотентна, обновляет AVF-owned данные и не меняет user-owned данные.
- Verify: temporary-home tests для fresh/upgrade/conflict и JSON/TOML parse после каждого сценария.
- Owner: devops, testing

### AUD-003 — [high] Зелёный sync-check не подтверждает валидность и эквивалентность зеркал

- Boundary: Cross-cutting
- Evidence: `scripts/sync-check.sh:56` проверяет для обычных skills только наличие, а `scripts/sync-check.sh:101` — лишь отношение числа строк; команда вернула `OK=373 WARN=0 FAIL=0`, но YAML parser обнаружил 19 невалидных frontmatter, например `codex/skills/analyzer/SKILL.md:3` и `codex/skills/architect/SKILL.md:3`, и 40 из 49 canonical/Codex пар различаются.
- Root cause: зеркала поддерживаются вручную без канонической metadata schema, declared transforms и полноценного parser validation.
- Impact: skill может не загрузиться, а семантический drift публикуется как успешная синхронизация.
- Fix: единый registry/spec; генерировать wrappers и manifests; для намеренных различий хранить allowlisted transform/hash; валидировать весь frontmatter реальным YAML parser.
- Target state: один источник правды, deterministic generation и CI, который падает на parse/drift.
- Verify: regenerate produces zero diff; все 223 `SKILL.md` parse; mutation-test одного description и одного body ломает CI.
- Owner: architect, devops, testing

### AUD-004 — [medium] Eager-каталоги и 154 task wrappers расходуют контекст без пользы

- Boundary: Cross-cutting
- Evidence: `codex/AGENTS.md:5` начинает полный каталог 25 ролей размером 27,682 bytes; `scripts/session-start.js:5` внедряет ещё 5,695 bytes в каждый Claude session; `package.json:23` и `package.json:31` публикуют оба полных дерева. Инвентарь насчитал 223 Codex skills при 49 domain skills.
- Root cause: discovery реализован полной перечислительной загрузкой, а не коротким router + progressive disclosure.
- Impact: постоянная token latency/cost, больше ложных trigger-кандидатов и больше поверхностей drift.
- Fix: глобально оставить компактный capability/mutation router; детали загружать после выбора роли; заменить task-skill на один action router на роль или сделать task skills explicit-only с коротким metadata.
- Target state: глобальный routing prompt меньше 5 KB; около 25 persona + 49 domain + router вместо 223 eager entries.
- Verify: snapshot размера global prompts/metadata и routing benchmark на типовых запросах без падения точности.
- Owner: architect, testing

### AUD-005 — [medium] Границы ролей и routing tables расходятся

- Boundary: Cross-cutting
- Evidence: analyzer объявляет mock/hardcode область в `agents/analyzer.md:26`, integrity повторно владеет ею в `agents/integrity.md:19`; список entrypoints в `skills/workflow/SKILL.md:15` не содержит `integrity`, `security`, `testing`, `liveboard` и другие объявленные роли; универсальная таблица `commands/vorcl.md:17` также не содержит новых `integrity`, `visual-research`, `liveboard` маршрутов.
- Root cause: capability ownership и routing inventories редактируются вручную в нескольких файлах; нет positive/negative routing criteria.
- Impact: лишний architect hop, случайный выбор общего analyzer вместо точного integrity и лишняя загрузка skills.
- Fix: генерировать route table из registry; targeted hardcode/mock закрепить за integrity, analyzer оставить broad audit и thin redirect; явно развести principal-architect и archmap по результату/масштабу.
- Target state: у каждой capability один primary owner, fallback и отрицательные критерии; все advertised роли достижимы.
- Verify: registry completeness test и table-driven routing cases для audit/mock/map/screenshot/read-only.
- Owner: architect, analyzer, testing

### AUD-006 — [medium] Read-only и независимый Checker существуют только декларативно

- Boundary: Cross-cutting
- Evidence: `skills/workflow/SKILL.md:27` описывает три роли, но `commands/vorcl.md:12` поручает одному потоку реализацию, проверку и закрытие; `agents/analyzer.md:14` требует Task Master writes и последующие исправления при заявленном read-only на `agents/analyzer.md:17`.
- Root cause: не определены режимы report-only/track/remediate и identity separation Checker/Executor.
- Impact: read-only запрос меняет `.taskmaster`, а автор реализации может сам принять собственные тесты.
- Fix: report-only = ноль persistent writes; track-only и remediation требуют соответствующей авторизации; checker работает в отдельном контексте, не редактирует acceptance tests, только возвращает evidence/verdict.
- Target state: mutation mode входит в task contract; закрывает orchestrator только после независимого verdict.
- Verify: policy tests на три режима и provenance check `executor != checker` для high-risk задач.
- Owner: architect, testing

### AUD-007 — [medium] Адаптеры и package boundary не покрыты release-тестами

- Boundary: Infrastructure
- Evidence: `package.json:9` запускает skill tests, но не installer/manifest/package tests; manual Codex path копирует только skills, тогда как runtime overlay выполняется отдельно в `bin/install.mjs:205`; `package.json:23` и `package.json:31` включают два тяжёлых дерева. `npm pack --dry-run` ранее дал 1,052 files и 60.7 MB unpacked.
- Root cause: тестируется содержимое skills, но не установка, upgrade и фактически публикуемый артефакт.
- Impact: неполная manual install, удвоенный payload и adapter regression могут выйти при зелёном `npm test`.
- Fix: один installer core для всех documented paths; temporary-home matrix для Claude/Codex/Cursor/Kimi; pack assertions; shared runtime assets без физического дублирования.
- Target state: все способы установки дают одинаковый capability set; package size и file list имеют budget.
- Verify: CI запускает install/upgrade smoke, parse manifests/config, `npm pack --dry-run` и capability diff.
- Owner: devops, testing

## Dependency vulnerabilities

Checked UTC: 2026-08-17T15:55:46Z. Source: `npm audit` against the npm advisory service for both canonical lockfile projects. Codex copies use duplicated lockfiles and не сканировались повторно.

### DEP-001 — moderate: esbuild development-server request exposure

- Package: `esbuild`
- Installed: resolved version in `skills/design-studio/agents/gen-video/package-lock.json` and `gen-pptx/package-lock.json`, affected by advisory range
- Affected range: `<=0.24.2`
- Patched: `0.25.0+`; npm proposes `0.28.2` with semver-major change
- Direct/transitive: direct dev dependency in both utilities
- Source: https://github.com/advisories/GHSA-67mh-4wv8-2f99

## Error handling and resilience

Сильная сторона — доказательная проверка и запрет закрывать задачу при провале testStrategy. Слабые места — отсутствие lease/recovery у Task Master и типизированного recovery у installer. Нужны явные классы ошибок transport/auth/provider/encoding, проверка результата неизвестной write-операции перед retry и атомарная запись config.

## Target architecture

Один versioned registry описывает role, capabilities, mutation mode, routes, core skills и adapters. Генератор выпускает Claude commands/agents, Codex thin wrappers, profiles и компактные discovery indexes. `/vorcl` создаёт scoped run с allowlist и lease; Executor и Checker разделены. Shared runtime/reference assets хранятся один раз и накладываются installer-ом.

## Replacement and change matrix

| Current | Problem | Replace/move/add | Target owner/layer | Prerequisite | Risk | Verification |
| --- | --- | --- | --- | --- | --- | --- |
| Global `next_task` | Cross-run task theft | Scoped run + claim/lease | orchestrator | Task Master metadata support | High | concurrent run test |
| Marker append | stale/conflicting config | parsed owned-key merge | installer | TOML parser/schema | High | upgrade fixtures |
| Manual mirrors | drift/invalid YAML | registry + generator | build tooling | metadata schema | Medium | zero-diff generation |
| Full catalogs | recurring token cost | compact router + lazy load | adapters | registry | Medium | context budget snapshot |
| Overlapping roles | ambiguous routing | primary/fallback/negative criteria | role registry | capability matrix | Medium | routing cases |
| Same author/checker | weak acceptance | independent verdict contract | workflow | identity/provenance | Medium | policy tests |
| Duplicated payload | large/untested distribution | shared assets + adapter smoke | packaging | installer core | Medium | pack/install CI |

## Remediation roadmap

### P0 — correctness

- AUD-001: run scope, captured IDs, claim/lease.
- AUD-002: safe settings/TOML merge and upgrade tests.

### P1 — one source of truth

- AUD-003: registry, generator and full parser/drift CI.
- AUD-005: capability ownership and generated routing.
- AUD-006: explicit mutation modes and independent Checker.

### P2 — efficiency and distribution

- AUD-004: compact global router and progressive disclosure.
- AUD-007: unified installer, adapter matrix, package budget.

### P3 — optimization

- После baseline измерить routing accuracy, средний loaded context и install size; удалить совместимые legacy wrappers только по usage data. DEP-001 обновлять отдельной задачей с тестом design-studio utilities.

## Verification plan

Минимальный gate: `bash scripts/sync-check.sh`; YAML parse всех `codex/skills/*/SKILL.md`; `npm test`; temporary-home installer matrix; два конкурентных `/vorcl` runs; `npm pack --dry-run`; `node skills/project-audit/scripts/validate-report.mjs PROJECT_AUDIT.md`. CI должен проверять budgets global prompt, skill count и package bytes.

## Coverage gaps / Needs verification

Не выполнялись реальные установки в пользовательские home и concurrent Task Master stress test, чтобы сохранить read-only scope. Официальный Python `quick_validate.py` не запустился из-за отсутствующего `PyYAML`; YAML frontmatter проверен системным Ruby/Psych. Advisory покрывает два уникальных canonical lockfile, но не повторные Codex-копии. Рабочее дерево было грязным до аудита, поэтому production changes не атрибутировались аудиту.

## Appendix: commands and sources

- Command: `node skills/project-audit/scripts/inventory.mjs --root . --format json` — inventory и detection.
- Command: `bash scripts/sync-check.sh` — результат `OK=373 WARN=0 FAIL=0`.
- Command: Ruby/Psych parse всех `codex/skills/*/SKILL.md` — 19 YAML errors.
- Command: `npm audit --json` в `skills/design-studio/agents/gen-video` и `gen-pptx` — по одной moderate advisory.
- Command: `git rev-parse HEAD`, `git status --short`, `wc`, `find` — commit, baseline и размеры.
- Source: `skills/workflow/SKILL.md`, `commands/vorcl.md`, `bin/install.mjs`, `scripts/sync-check.sh`, `codex/AGENTS.md`, `scripts/session-start.js`, `package.json`, `.codex-plugin/plugin.json`.
