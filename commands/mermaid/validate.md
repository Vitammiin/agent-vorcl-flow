---
description: Проверить Mermaid — синтаксис + реальный рендер-тест, найти и устранить ошибки (mmdc / Maid / mcp-mermaid) (mermaid). Use when нужен ответ «валиден ли .mmd» и починка ошибок (артефакт — валидный .mmd); нужен файл-изображение SVG/PNG/PDF → /mermaid:render, содержательные правки → /mermaid:refine
argument-hint: "<путь к .mmd или markdown с mermaid-блоками>"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

Проверь Mermaid на валидность и почини: **$ARGUMENTS**.

1. **Линт** (быстро, ловит типовые AI-ошибки): `npx -y @probelabs/maid <путь>` — опечатки заголовка (`lowchart`→`flowchart`), непарные `subgraph/end`, `end` в нижнем регистре, неэкранированные подписи.
2. **Эталонный рендер-тест** (окончательный критерий): готовый скрипт скилла — `node skills/mermaid-rendering/scripts/mmd-validate.mjs <путь>` (прогоняет каждый mermaid-блок markdown отдельно и печатает `файл:строка` + сообщение парсера), либо `mcp-mermaid` (MCP), либо `npx -p @mermaid-js/mermaid-cli mmdc -i <файл> -o /tmp/_check.svg`. Реальный рендер — единственная надёжная проверка; Maid не покрывает всю семантику.
   ⚠️ Если пишешь свою проверку SVG — маркеры ошибки это `Syntax error in text` и `aria-roledescription="error"`; CSS-класс `.error-icon` есть в **любом** mermaid-SVG и по нему проверять нельзя.
3. **Отличи поломку окружения от ошибки диаграммы.** `mmdc` рендерит через headless-браузер и не тащит его с собой: `mmdc --version` проходит и без браузера, а экспорт падает с кодом 1 — тем же, что и при синтаксической ошибке. Увидев `Could not find Chrome` / `Tried to find the browser ... no executable was found` — **не переписывай корректный `.mmd`**: поставь браузер (`npx puppeteer browsers install chrome-headless-shell`) или проверь через `mcp-mermaid`. `mmd-validate.mjs` помечает такие случаи как `SETUP` и выходит с кодом 3.
4. Читай сообщения парсера, **устрани каждую ошибку** (кавычки в подписях, зарезервированные слова, направление, кардинальности ERD), повтори рендер до зелёного.

Отдай: список найденных проблем → внесённые правки → финальный зелёный рендер-тест (команда + результат). Если файл валиден с первого раза — покажи это выводом рендера. Опирайся на навыки `mermaid-rendering`, `mermaid-diagrams`. Делегируй субагенту `mermaid`.
