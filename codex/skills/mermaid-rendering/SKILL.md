---
name: mermaid-rendering
description: Валидация, рендеринг и экспорт Mermaid — готовый валидатор scripts/mmd-validate.mjs, mcp-mermaid (MCP), @mermaid-js/mermaid-cli (`mmdc`), Kroki, Mermaid.ink, Maid-линтер, mermaid npm SDK; фиксация версии, CI-проверка рендером, экспорт SVG/PNG/PDF, security, приватность. Use для проверки синтаксиса, генерации изображений и CI.
---

# Навык: Валидация и рендеринг Mermaid

Ни один LLM не валидатор Mermaid — окончательный критерий готовности это **реальный рендер**. `.mmd` в git, проверка в CI.

## Инструменты
- **`scripts/mmd-validate.mjs`** (рядом со скиллом) — прогоняет каждый ` ```mermaid ` блок markdown через настоящий `mmdc`, печатает `файл:строка` + сообщение парсера. Коды: `0` ок, `1` FAIL, `2` ошибка вызова, `3` сломано окружение рендера (блоки помечены `SETUP`, диаграммы НЕ проверены). Флаги `--list`, `--json`.
- **mcp-mermaid** (MCP, self-hosted, в этом адаптере) — валидация/рендер из агента; для приватного — `file`/`svg`/`base64`, не публичные URL.
- **@mermaid-js/mermaid-cli** (`mmdc`) — эталонный рендер/CI: `npx -p @mermaid-js/mermaid-cli mmdc -i d.mmd -o d.svg --theme dark`. Ненулевого exit НЕ достаточно: `gitGraph TB` без двоеточия даёт exit 0 и error-SVG. Проверяй и SVG — по `Syntax error in text` / `aria-roledescription="error"`, но НЕ по `.error-icon` (он есть в любом mermaid-SVG).
- **Maid** (`npx -y @probelabs/maid docs/`) — быстрый линт типовых AI-ошибок; не заменяет рендер.
- **Kroki** / **Mermaid.ink** — HTTP-рендер без установки (⚠️ публичные URL шлют содержимое вовне; приватное — локально). У Kroki для Mermaid только `png`/`svg` — `/mermaid/pdf` отдаёт HTTP 400; проверяй HTTP-код, а не наличие файла (`curl -o` запишет тело ошибки в .svg).
- **mermaid** (npm) — встраивание в веб: `mermaid.initialize({ securityLevel: "sandbox" })`.

## CI-связка
`npx -y @probelabs/maid docs/ && npx -p @mermaid-js/mermaid-cli mmdc -i docs/a.mmd -o build/a.svg`.

## Сломанное окружение ≠ ошибка диаграммы
`mmdc` рендерит через headless-браузер и не тащит его с собой: `--version` проходит без браузера, а экспорт падает с кодом 1 — как при синтаксической ошибке. `Could not find Chrome` / `Tried to find the browser` → `npx puppeteer browsers install chrome-headless-shell` (или `PUPPETEER_EXECUTABLE_PATH`), корректный `.mmd` не переписывай.

## Security / воспроизводимость
Mermaid допускает HTML-вставки — для недоверенного ввода `securityLevel: "sandbox"`/`"strict"`. Фиксируй версию Mermaid; рендер (SVG/PNG) — build-артефакт, не источник истины.
