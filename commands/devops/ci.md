---
description: GitHub Actions — PR-workflow (lint+typecheck+test с кэшем npm) и main-workflow (build+deploy), concurrency, минимальные permissions, секреты через GitHub secrets; валидация YAML (devops). Use when нужно настроить или починить CI/CD-pipeline.
argument-hint: "[что настроить: pr|deploy|оба] [особенности проекта]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Настрой GitHub Actions: **$ARGUMENTS**.

1. Изучи проект: пакетный менеджер (lockfile), скрипты `lint`/`typecheck`/`test`/`build` в `package.json`, версия Node, существующие workflow в `.github/workflows/`.
2. PR-workflow (`.github/workflows/pr.yml`): триггер `pull_request`; `actions/setup-node` с `cache: npm` (или pnpm — тогда `pnpm/action-setup` до setup-node); шаги `npm ci` → lint → typecheck → test. Только реально существующие скрипты — не выдумывай.
3. Main-workflow (`.github/workflows/deploy.yml`): триггер `push` в main; build + деплой. Для Render — deploy hook (`curl $RENDER_DEPLOY_HOOK`) или auto-deploy по пушу; hook-URL — через GitHub secrets, наблюдение за деплоем — агент `render`.
4. Дисциплина: `concurrency` с `cancel-in-progress: true` (группа по ref) — отмена устаревших прогонов; `permissions: contents: read` на верхнем уровне, расширяй точечно; секреты — только `${{ secrets.* }}`, помни: в fork-PR секреты недоступны, `pull_request_target` без нужды не используй.
5. Валидируй YAML до выдачи: парсером (`node -e "require('js-yaml')..."` / `python3 -c "import yaml..."`) или `actionlint`, если установлен. Покажи вывод валидации.

Края: пустой `$ARGUMENTS` — сделай PR-workflow (минимум), deploy — уточни цель хостинга. Прогон в GitHub подтвердит только реальный push — честно пометь, что локально проверен лишь синтаксис. Прод-деплой активируй только с явного подтверждения владельца.

Отдай: файлы workflow (пути), вывод валидации YAML, какие secrets завести в репозитории, заметки. Опирайся на навыки `ci-cd`, `nodejs`, `render`. Делегируй субагенту `devops`.
