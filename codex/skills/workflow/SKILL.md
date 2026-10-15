---
name: workflow
description: "Session-first workflow: ограниченный план, acceptance criteria и независимая проверка; Task Master — только явно выбранный адаптер со scoped IDs и atomic claim."
---

# Workflow

## Режим и трекер — независимые решения

- **report-only** — только ответ или явно запрошенный report artifact; без Task Master, `.taskmaster/`, product/config/data writes.
- **track-only** — только явно разрешённые task metadata; не разрешает implementation.
- **remediation** — изменения в пределах запроса пользователя.

По умолчанию **session-first**: план, scope, прогресс и evidence остаются в текущей сессии. Нетривиальная задача не требует установки трекера, MCP, API-ключей или runtime. Наличие `.taskmaster/`, подключённого MCP или команды `/vorcl` не означает согласие использовать Task Master. Другой выбранный трекер используй через его доступные инструменты и границы текущей цели, не мигрируй backlog.

## Session-first цикл

1. Зафиксируй цель, владельца scope, ограничения, acceptance criteria и `testStrategy`.
2. Разбей работу на ограниченные шаги в сессии. Оркестратор распределяет независимые scopes; не выдавай один изменяемый scope двум исполнителям одновременно.
3. Executor реализует разрешённый scope и передаёт changed paths, проверки и ограничения.
4. Независимый Checker выполняет `testStrategy`, не меняет implementation и acceptance tests, возвращает `ГОТОВО`/`НЕ ГОТОВО` с evidence. Если отдельный контекст недоступен, честно укажи ограничение проверки; не имитируй независимого Checker.
5. Только Orchestrator завершает шаг после проверки и останавливается по текущей цели. Работа не требует файлового task-state.

## Task Master: только по явному выбору

Этот адаптер включается только если пользователь явно выбрал Task Master для текущей работы. Сначала прочитай **task-master** и обнаружь реальные capabilities текущей сессии; имена MCP-серверов и tools не фиксированы. Без доступного адаптера продолжай независимую работу session-first и сообщи, что persistence недоступна. Не устанавливай сервер, не запускай init и не меняй providers/models/ключи автоматически.

1. Создай задачи через доступные операции `add_task`/`parse_prd` и сохрани IDs из результата записи. Не импортируй чужие задачи и не перезаписывай существующий PRD. Bare `next_task` по общему backlog запрещён.
2. Создай scoped run: `node <plugin-root>/scripts/vorcl-run.mjs create --run <run-id> --tasks <id,id> --owner <agent> --root <project>`. В standalone skill используй `<workflow-skill>/scripts/vorcl-run.mjs`. AVF хранит claims/runs в `.agent-vorcl/`, никогда в `.taskmaster/`.
3. Для каждого allowlisted ID: atomic `claim --run <run-id> --task <id>` → чтение задачи → проверка статуса → `in-progress`. Продлевай lease через `renew`; `reclaim --from-run <expected-old-run>` и `unlock --expected-lock <id>` требуют ожидаемого владельца/lock. Не обходи отказ claim.
4. Executor работает только над claimed task; `update_subtask` — только для существующего subtask ID, не top-level task. Не редактируй Task Master JSON вручную.
5. Checker возвращает независимый verdict по `testStrategy`; только Orchestrator записывает `done`. Цикл ограничен allowlist run, не repository backlog.

## PROJECT_DESCRIPTION maintenance

Это общий Definition of Done для любой изменяющей роли.

1. До реализации проверь `<scope-root>/PROJECT_DESCRIPTION.md`. Если файл существует, прочитай его до изменения кода; если отсутствует — не создавай автоматически.
2. После реализации перед Checker собери только changed paths текущей задачи и запусти, если доступен:

   ```bash
   node <init-code-skill>/scripts/check-impact.mjs --root <scope-root> --changed <path> [--changed <path> ...] [--external <kind[:detail]> ...]
   ```

3. Передавай `--external` для выполненных вне worktree мутаций (`render-deploy`, `environment`, `integration`, `database-schema`, `runtime`), даже если changed paths пусты. При `review-required` сравни файловый diff и external mutations с утверждениями документа. Material impact есть, когда изменились назначение/возможности, команды запуска/build/test, стек/runtime, packages/modules/boundaries/entrypoints/routes, data flow/schema, integrations, env names, testing/CI/deploy context.
4. Если material impact подтверждён, в той же задаче обнови только затронутые разделы `PROJECT_DESCRIPTION.md`, сохрани корректные пользовательские пояснения, замени stale evidence paths и запусти `validate-description.mjs` из `$init-code`.
5. Если material impact отсутствует, документ не редактируй; передай Checker краткое evidence-based объяснение `description impact: none`.
6. Изменение контекста при оставшемся stale `PROJECT_DESCRIPTION.md` означает **НЕ ГОТОВО**. Report-only роли и Checker сами этот файл не исправляют.

Роли для маршрутизации: `architect`, `principal-architect`, `backend`, `frontend`, `expo-mobile`, `analyzer`, `integrity`, `swagger`, `firecrawl`, `render`, `database`, `resilience`, `logging`, `screenshot`, `design-studio`, `visual-research`, `pinpoint`, `drawio`, `archmap`, `mermaid`, `testing`, `gitflow`, `security`, `docs`, `devops`, `liveboard`. Канонические ownership/negative criteria находятся в `scripts/roles.json`.

## Запреты

- Не изменять MCP configuration, providers, модели или секреты ради обычного workflow.
- Не создавать Task Master state без явного выбора; report-only не пишет task/product state.
- В Task Master режиме не брать чужие IDs и не работать без успешного atomic claim перед `in-progress`.
- Не закрывать задачу без доказательств проверки и не скрывать отсутствие независимого Checker.
- Не закрывать modifying task с подтверждённым дрейфом существующего `PROJECT_DESCRIPTION.md`.
