---
name: mermaid-validate
description: Проверить Mermaid — синтаксис + реальный рендер-тест, найти и устранить ошибки (mmdc / Maid / mcp-mermaid) (роль mermaid). Use when нужен ответ «валиден ли .mmd» и починка ошибок (артефакт — валидный .mmd); нужен файл-изображение SVG/PNG/PDF → $mermaid-render, содержательные правки → $mermaid-refine.
---

# Задача: валидация Mermaid

Проверь Mermaid на валидность и почини (см. `$mermaid-rendering`, `$mermaid-diagrams`).

1. **Линт:** `npx -y @probelabs/maid <путь>` — опечатки заголовка (`lowchart`), непарные `subgraph/end`, `end`-ловушка, неэкранированные подписи.
2. **Эталонный рендер-тест:** `node scripts/mmd-validate.mjs <путь>` из `$mermaid-rendering` (каждый mermaid-блок отдельно, `файл:строка` + сообщение парсера), либо `mcp-mermaid`, либо `npx -p @mermaid-js/mermaid-cli mmdc -i <файл> -o /tmp/_check.svg` — единственная надёжная проверка.
   ⚠️ Своя проверка SVG: маркеры ошибки — `Syntax error in text` и `aria-roledescription="error"`; класс `.error-icon` есть в любом mermaid-SVG, по нему проверять нельзя.
3. Отличи окружение от диаграммы: `Could not find Chrome` / `Tried to find the browser` — это setup (`npx puppeteer browsers install chrome-headless-shell`), корректный `.mmd` не переписывай; `mmd-validate.mjs` помечает такое как `SETUP`, код 3.
4. Читай сообщения парсера, устрани каждую ошибку (кавычки, зарезервированные слова, направление, кардинальности), повтори рендер до зелёного.

Дай: найденные проблемы → правки → финальный зелёный рендер-тест (команда + результат).
