---
name: integrity-mocks
description: Поиск mock/fake/demo/fixture инфраструктуры и статических ответов, протёкших в production frontend/backend на TS/JS, Python, Go, JVM, C#, PHP, Ruby и Rust. Use когда UI или API могут работать на заглушках.
---

# Integrity: mocks

Запусти `$code-integrity` scanner с `--mode mocks`, затем примени `$mock-data-detection`. Проследи declaration → import/registration/DI/build alias → production entry point и проверь environment guards. Отличай tests/fixtures/stories/examples/seeds/dev adapters от runtime leakage; имя `mock` само по себе не finding.

Для finding укажи declaration и consumer `file:line`, rule ID, evidence, guard/reachability, affected surface, severity, confidence и replacement boundary. Ничего не правь; значимые findings → `add_task`.
