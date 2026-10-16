---
description: Проверка типов — tsc, any, небезопасные касты, рассинхрон zod↔типы. Use when вопрос к типобезопасности, а не к логике; баги поведения — /analyzer:bugs (analyzer)
argument-hint: "[путь/область; по умолчанию весь проект]"
---

Проверь типы (**read-only**): **$ARGUMENTS**.

Запусти `tsc --noEmit` (и `eslint`, если есть) — только чтение, без правок. Найди: ошибки компилятора, `any`/`as any`/`@ts-ignore`, небезопасные касты (`as unknown as`), неявные `any`, рассинхрон zod-схем и выведенных типов, отсутствие exhaustive-проверок в `switch`. Помечай область (**Frontend** / **Backend**). Формат: `file:line`, что нашли, первопричина, конкретная починка; severity по влиянию. По значимым находкам — remediation recommendations в отчёте. Опирайся на навык `typescript`. Делегируй субагенту `analyzer`.
