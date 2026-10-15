# Сравнение с популярными проектами для coding agents

Дата снимка: **2026-10-15**. Цель — найти проверяемые улучшения AVF, сохранив пользовательские MCP, модели, credentials и Task Master.

## Как выбирались источники

Поиск GitHub API по `agent skills in:name,description stars:>5000` с сортировкой `stars desc`, затем проверка известных сопоставимых установщиков и workflow-проектов. Число звёзд, состояние репозитория, лицензия и текущий commit проверялись отдельно. Ниже выборка популярных аналогов, а не исчерпывающий мировой рейтинг: сборники ссылок и несопоставимые приложения не включены. Звёзды показывают распространённость, но не доказывают качество или улучшение результатов модели.

README и релевантные исходники изучались без установки upstream plugins, запуска hooks или копирования их настроек. Ссылки на конкретные файлы закреплены на исследованных commits; число звёзд неизбежно меняется.

| Проект | Звёзды на дату снимка | Сопоставимая часть | Лицензия |
| --- | ---: | --- | --- |
| [obra/superpowers](https://github.com/obra/superpowers) | 299 829 | Workflow, ограниченные задания, независимый review | MIT |
| [mattpocock/skills](https://github.com/mattpocock/skills) | 292 766 | Небольшие переиспользуемые skills | MIT |
| [affaan-m/ECC](https://github.com/affaan-m/ECC) | 280 292 | Профили установки, диагностика и ownership | MIT |
| [anthropics/skills](https://github.com/anthropics/skills) | 181 388 | Progressive disclosure, описания и проверка triggers | Лицензии по каталогам; skill-creator — Apache-2.0 |
| [github/spec-kit](https://github.com/github/spec-kit) | 141 431 | Прослеживаемость требований и проверка результата | MIT |
| [bmad-code-org/BMAD-METHOD](https://github.com/bmad-code-org/BMAD-METHOD) | 54 193 | Ограниченный контекст и проверка утверждений | MIT, отдельное уведомление о trademarks |
| [vercel-labs/skills](https://github.com/vercel-labs/skills) | 35 107 | Явный выбор skills и клиентов | MIT |
| [numman-ali/openskills](https://github.com/numman-ali/openskills) | 10 784 | Переносимые skills и установка | Apache-2.0 по LICENSE |
| [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) | 10 561 | Один владелец verdict, незавершённая проверка | MIT |

Старый `gsd-build/get-shit-done` имел 64 288 звёзд, но был архивирован; для анализа текущего подхода использован `open-gsd/gsd-core`. У BMAD исследована main-ветка с preview v7, а не стабильный релиз. Исходники ECC доступны под новым именем репозитория. Эти различия важны при повторении исследования.

## Что изменено в AVF

### 1. Выборочная установка и проверка состояния

Проблема: даже для одной роли AVF устанавливал весь каталог из 236 навыков и все доступные native agents. Наличие файлов не означает, что клиент загружает их тела в каждый prompt, но затрудняет выбор и разбор конфликтов имён.

Из [Vercel Skills README](https://github.com/vercel-labs/skills/blob/13e4063a1cf913f5606d57d42ab83a86f5001e04/README.md) взят принцип явного выбора навыков/клиентов; из [ECC README](https://github.com/affaan-m/ECC/blob/76aaa77df6adc5b889e689007bf99b9a4f74af34/README.md) — ограниченные профили и проверяемое состояние установки.

AVF теперь предоставляет `--list`, повторяемые `--role` / `--skill` и read-only `--check`, включая JSON. Role bundle включает небольшой общий набор, выбранную роль, её команды и прямые domain hints; произвольные упоминания в тексте не становятся зависимостями. Явные технические зависимости разрешаются отдельно. Task Master не добавляется в выборочный набор без `--skill task-master`. Не выбранные компоненты не удаляются.

Реализация: [installer](../bin/install.mjs), [install catalog](../scripts/install-catalog.mjs). Поведение полного набора без фильтров сохранено для совместимости. Checks сравнивают исходники, установленные файлы и ledger, не читают секреты или пользовательские MCP configs и ничего не исправляют автоматически.

### 2. Результат задачи важнее стека

Проблема: исходный router мог выбирать frontend для README в Next.js, backend для CI в Express или видеодизайн для анимации кнопки Expo. Это ошибки локальной классификации, обнаруженные на fixtures, а не утверждение о качестве сторонних проектов.

Вместо переноса чужой системы команд AVF уточняет собственный [router](../skills/workspace-capability-routing/scripts/route.mjs): документация, API, база данных, CI, полный пакет текущей архитектуры, targeted integrity и security получают своих владельцев. Mobile UI motion остаётся в Expo. Поддерживающие skills добавляются только при релевантной цели. Отсутствие убедительного intent остаётся явной неопределённостью.

Подход к проверке triggers полезен в [Anthropic skill-creator](https://github.com/anthropics/skills/blob/dbd4588f9e1033efb41dad4bef2f7947c8993d44/skills/skill-creator/SKILL.md): рядом с положительными примерами нужны близкие отрицательные. AVF добавляет детерминированные EN/RU regression cases. Это проверка алгоритма маршрутизации; полноценного сравнительного LLM benchmark в этой работе нет.

### 3. Краткий handoff и evidence на каждый критерий

Из [Spec Kit analyze](https://github.com/github/spec-kit/blob/f6e72bc8523de8ec8368129cbdea78d45f27cef8/templates/commands/analyze.md) и [converge](https://github.com/github/spec-kit/blob/f6e72bc8523de8ec8368129cbdea78d45f27cef8/templates/commands/converge.md) взята связь требований с проверкой полноты. Из [Superpowers reviewer prompt](https://github.com/obra/superpowers/blob/bb92a77741419a4ab5f06e711a283343f1ada0c3/skills/subagent-driven-development/task-reviewer-prompt.md) — самостоятельное чтение изменений и отдельная оценка соответствия задаче и качества. [BMAD claims check](https://github.com/bmad-code-org/BMAD-METHOD/blob/8f0d50e1817fdd8fcf05a20c524218222d13cd8d/skills/bmad-code-review/references/claims-check.md) полезен как напоминание проверять утверждения автора по фактическому пути исполнения.

В [workflow](../skills/workflow/SKILL.md) добавлен компактный контракт; подробный [handoff](../skills/workflow/references/handoff.md) читается по необходимости. Проверки имеют результаты PASS / FAIL / NOT_RUN. Orchestrator остаётся единственным владельцем завершения; идея также согласуется с [GSD ADR](https://github.com/open-gsd/gsd-core/blob/43850b922007c39a96e13fb63ec6a6fae7c41264/docs/adr/5057-one-owner-per-workflow-verdict.md). Недоступный инструмент не превращается в успешную проверку.

Session-first сохранён: нет обязательной папки спецификаций, записи task state, дополнительных approval checkpoints или требования коммита после каждого шага. Небольшие изменения не получают искусственно тяжёлый процесс. Модульность [mattpocock/skills](https://github.com/mattpocock/skills/blob/49dd158d1076134a641b33efb035946536778336/README.md) и progressive disclosure Anthropic поддерживают это решение; тела всех установленных skills заранее не читаются.

### 4. Проверки до публикации

Ранее основной GitHub workflow запускался по release tag. Новый [Validate workflow](../.github/workflows/validate.yml) проверяет pull requests и dev/main на Node.js 20 и 24: registry/mirrors, tests с loopback HTTP, package budget и syntax. Он не публикует пакет и не использует release secrets. Добавление workflow не устраняет ограничение GitHub billing: успешный запуск на GitHub нужно проверять отдельно от локальных результатов.

## Что сознательно не перенесено

- Автоматические изменения MCP/settings, выбор моделей, hooks, секреты, фоновые службы и непрерывное обучение — несовместимы с границами AVF.
- Обязательный внешний tracker, постоянное дерево planning-документов и остановка обычной работы без subagents — не нужны session-first режиму.
- Принудительная перезапись установленного skill при update: в исследованном [OpenSkills updater](https://github.com/numman-ali/openskills/blob/57d933a4f0d5c8659bd8b285f50fb9554360f0b3/src/commands/update.ts) заменяется каталог. AVF сохраняет проверку полного дерева и пользовательские изменения.
- Автоматические обновления со стороннего branch, общий memory store и установка одновременно через несколько механизмов — дополнительные источники неясной принадлежности файлов.
- Копирование upstream prompts и кода не выполнялось. Реализованы собственные механизмы по наблюдаемым принципам; лицензии отдельных skills нельзя выводить из популярности или лицензии соседнего каталога.

## Проверяемые границы результата

Регрессионные тесты проверяют выборочный состав, неизвестные имена, отсутствие записей в режимах inspection, сохранение пользовательских компонентов, ownership и маршруты на fixtures. Общий suite и package/registry checks проверяют совместимость с существующими адаптерами. Это не гарантия исполнения каждым LLM: качество конкретного агента и клиента остаётся предметом отдельной оценки. Публикация npm и обновление реальной установки — отдельные операции; этот документ не означает, что они состоялись.
