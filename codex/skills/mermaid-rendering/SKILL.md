---
name: mermaid-rendering
description: Валидация, рендеринг и экспорт Mermaid — mcp-mermaid (MCP), @mermaid-js/mermaid-cli (`mmdc`), Kroki, Mermaid.ink, Maid-линтер, mermaid npm SDK; фиксация версии, CI-проверка рендером, экспорт SVG/PNG/PDF, security, приватность. Use для проверки синтаксиса, генерации изображений и CI.
---

# Навык: Валидация и рендеринг Mermaid

Ни один LLM не валидатор Mermaid — окончательный критерий готовности это **реальный рендер**. `.mmd` в git, проверка в CI.

## Инструменты
- **mcp-mermaid** (MCP, self-hosted, в этом адаптере) — валидация/рендер из агента; для приватного — `file`/`svg`/`base64`, не публичные URL.
- **@mermaid-js/mermaid-cli** (`mmdc`) — эталонный рендер/CI: `npx -p @mermaid-js/mermaid-cli mmdc -i d.mmd -o d.svg --theme dark`. Ненулевой exit = невалидно.
- **Maid** (`npx -y @probelabs/maid docs/`) — быстрый линт типовых AI-ошибок; не заменяет рендер.
- **Kroki** / **Mermaid.ink** — HTTP-рендер без установки (⚠️ публичные URL шлют содержимое вовне; приватное — локально).
- **mermaid** (npm) — встраивание в веб: `mermaid.initialize({ securityLevel: "sandbox" })`.

## CI-связка
`npx -y @probelabs/maid docs/ && npx -p @mermaid-js/mermaid-cli mmdc -i docs/a.mmd -o build/a.svg`.

## Security / воспроизводимость
Mermaid допускает HTML-вставки — для недоверенного ввода `securityLevel: "sandbox"`/`"strict"`. Фиксируй версию Mermaid; рендер (SVG/PNG) — build-артефакт, не источник истины.
