---
description: Поиск mock/fake/demo/fixture инфраструктуры и статических ответов, протёкших в production frontend/backend на TS/JS, Python, Go, JVM, C#, PHP, Ruby и Rust (integrity)
argument-hint: "[путь; по умолчанию текущий репозиторий]"
allowed-tools: Read, Grep, Glob, Bash
---

Проведи read-only поиск mock-data leakage в **$ARGUMENTS**.

Запусти scanner `code-integrity` с `--mode mocks`, затем примени `mock-data-detection`. Проследи declaration → import/registration/DI/build alias → production entry point. Проверь environment guards. Отличай легитимные tests/fixtures/stories/examples/seeds/dev adapters от runtime leakage; имя `mock` само по себе не finding.

Для каждого подтверждённого finding укажи declaration и consumer `file:line`, rule ID, evidence, guard/reachability, affected surface, severity, confidence и replacement boundary. Ничего не правь; значимые findings → `add_task`. Делегируй роли `integrity`.
