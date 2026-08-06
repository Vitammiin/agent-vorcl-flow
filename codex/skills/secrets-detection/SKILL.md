---
name: secrets-detection
description: Обнаружение секретов в коде и git-истории — паттерны ключей (sk-, ghp_, AKIA, xox., private keys, user:pass@), git log -p --all, gitleaks/trufflehog и grep-альтернативы, фильтр ложных срабатываний, протокол с обязательной ротацией. Use для поиска утёкших ключей/токенов и чека перед пушем.
---

# Навык: Обнаружение секретов

**Найденный секрет = скомпрометирован**: ключ, побывавший в git-истории, утёк независимо от приватности репо; удаление из истории утечку не отменяет — обязательна ротация.

## Паттерны
`sk-[A-Za-z0-9_-]{20,}` (OpenAI/Anthropic) · `gh[pos]_…`/`github_pat_…` (GitHub) · `AKIA[0-9A-Z]{16}` (AWS) · `xox[bpoas]-…` (Slack) · `rnd_…` (Render) · `fc-…` (Firecrawl) · `AIza[0-9A-Za-z_-]{35}` (Google) · `Bearer\s+[A-Za-z0-9._~+/-]{20,}` литералом · длинный `eyJ…` (JWT) · `-----BEGIN … PRIVATE KEY-----` · `://user:pass@` в URL · `(?i)(password|secret|api_?key|token)\s*[:=]\s*['"][^'"]{8,}`.

## Где искать
```bash
rg -n --hidden -g '!node_modules' -g '!.git' '<паттерн>'   # рабочее дерево
git ls-files | grep -iE '\.env'                             # .env закоммичен? есть ли в .gitignore
git log -p --all -S '<паттерн>' --pickaxe-regex             # вся история, все ветки
git log --all --diff-filter=D --summary                     # удалённые файлы
```
Плюс: `git diff --cached` (staged), `git stash show -p`, сорсмапы/артефакты сборки.

## Инструменты
Есть `gitleaks` — `gitleaks detect --log-opts="--all" -v`; есть `trufflehog` — `trufflehog git file://. --only-verified`. Нет — ручные `rg`/`git log -p -S`/`git grep` по таблице паттернов, прогон помечай как ручной. Ничего не устанавливай в чужой проект при read-only аудите.

## Что НЕ секрет
Env-подстановки (`${VAR}`, `${VAR:-default}`, `process.env.X`); плейсхолдеры (`<your-key>`, `xxx`, `changeme`, `sk-...`); очевидные фейки в тестах/доках (`AKIAIOSFODNN7EXAMPLE`); публичные по дизайну ключи (Maps browser key с рестрикциями, Sentry DSN) — понижай severity, проверяй рестрикции. Сомнительное — секция «требует проверки».

## Протокол при находке
1. **Ротация ключа — первична и обязательна** (отозвать/перевыпустить у провайдера).
2. Проверить логи провайдера за период экспозиции.
3. Чистка истории (`git filter-repo`/BFG) — вторично, задачей на роль gitflow (force-push, координация).
4. Предотвращение: секреты в env/менеджер, `.env` в `.gitignore`, pre-push чек, gitleaks в CI.
5. В отчёте значение **маскируй** (`sk-ant-…Xy9Q`); указывай `file:line`/коммит, провайдера, severity (реальный ключ = critical).
