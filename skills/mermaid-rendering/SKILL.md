---
name: mermaid-rendering
description: Валидация, рендеринг и экспорт Mermaid — готовый рендер-валидатор scripts/mmd-validate.mjs, mcp-mermaid (MCP), @mermaid-js/mermaid-cli (mmdc) с полным набором флагов, Kroki, Mermaid.ink, Maid-линтер, официальный mermaid npm SDK и Mermaid Chart MCP; фиксация версии, CI-проверка рендером, экспорт SVG/PNG/PDF, темы и конфиг при рендере, security (securityLevel), приватность (локальный рендер против публичных URL). Use для проверки синтаксиса Mermaid, генерации изображений и настройки CI.
version: 2.0.0
---

# Навык: Валидация и рендеринг Mermaid

Ключевой принцип: **ни один LLM не является валидатором Mermaid**. Даже синтаксически «правильная на вид» диаграмма может не отрендериться или различаться между версиями. Поэтому окончательный критерий готовности — **реальный рендер**, а `.mmd` хранится в git и проверяется в CI.

## 1. Готовый валидатор (быстрый путь)

В скилле лежит zero-dependency скрипт `scripts/mmd-validate.mjs`: достаёт каждый ` ```mermaid ` блок из markdown (или берёт `.mmd` целиком) и прогоняет через настоящий `mmdc`.

```bash
node scripts/mmd-validate.mjs docs/architecture.md src/diagrams/   # рендер каждого блока
node scripts/mmd-validate.mjs --list README.md                     # только перечислить блоки
node scripts/mmd-validate.mjs --json docs/                         # машинный вывод для CI
MMD_CONCURRENCY=4 node scripts/mmd-validate.mjs docs/              # параллельность (по умолчанию 2)
```
Вывод — `PASS`/`FAIL` с `файл:строка` и сообщением парсера. Коды выхода: `0` — всё валидно, `1` — есть FAIL, `2` — ошибка вызова, `3` — **сломано окружение рендера** (нет headless-браузера); такие блоки помечаются `SETUP`, а не `FAIL`, потому что диаграмма в них не проверена и править её нельзя. Один блок ≈ 2-4 с (под капотом headless-браузер), это нормально.

## 2. Инструменты экосистемы

| Инструмент | Тип | Когда |
|---|---|---|
| **mermaid** (npm) | SDK / браузер | Встраивание в веб-приложение, рендер в DOM |
| **@mermaid-js/mermaid-cli** (`mmdc`) | CLI / Node | Эталонный рендер в SVG/PNG/PDF, CI/CD |
| **mcp-mermaid** | MCP-сервер (self-hosted) | Генерация/валидация/рендер из агента — **подключён в этом плагине** |
| **Mermaid Chart MCP** | hosted MCP | text-to-diagram без своего сервера (закрытая инфра) |
| **Maid** (`@probelabs/maid`) | линтер / MCP | Быстрая проверка markdown и типовых AI-ошибок (не полная семантика) |
| **Kroki** | HTTP API (self-host) | Единый endpoint Mermaid + десятки других форматов |
| **Mermaid.ink** | HTTP-renderer | Простой URL → SVG/PNG/JPEG/WebP/PDF |

## 3. MCP `mcp-mermaid` (основной путь в плагине)

Подключён в `.mcp.json` (`npx -y mcp-mermaid`, self-hosted, без ключей). Умеет проверять синтаксис и возвращать исходник/файл/base64/SVG/PNG. Для приватных данных выбирай `file`/`svg`/`base64` вместо публичных URL. Это предпочтительный способ валидации/рендера прямо из агента.

## 4. Эталонный CLI-рендер (`mmdc`)

```bash
npx -p @mermaid-js/mermaid-cli mmdc -i diagram.mmd -o diagram.svg \
  --theme dark --backgroundColor transparent
```

⚠️ **`mmdc` не тащит с собой браузер.** Он рендерит через headless-Chrome (puppeteer). Проверено: `mmdc --version`
проходит и выходит с кодом 0 даже когда браузера нет, а любой экспорт при этом падает — причём с кодом 1, тем же,
что и синтаксическая ошибка. Ставится браузер так:

```bash
npx puppeteer browsers install chrome-headless-shell   # или PUPPETEER_EXECUTABLE_PATH=<системный Chrome>
```

| Флаг | Смысл |
|---|---|
| `-i` / `-o` | вход и выход; расширение выхода задаёт формат (`.svg`, `.png`, `.pdf`, `.md`). `-` — stdin/stdout |
| `-t, --theme` | `default` · `forest` · `dark` · `neutral` (в CLI только эти четыре) |
| `-b, --backgroundColor` | `white`, `transparent`, `#F0F0F0` |
| `-w, --width` / `-H, --height` | размер вьюпорта, по умолчанию 800×600 (важно для PNG) |
| `-s, --scale` | множитель puppeteer для ретины |
| `-e, --outputFormat` | принудительный формат, если по расширению не вывести |
| `-c, --configFile` | JSON с конфигом mermaid (`theme`, `themeVariables`, `flowchart`, `securityLevel`, …) |
| `-C, --cssFile` | свой CSS для страницы рендера |
| `-p, --puppeteerConfigFile` | настройки puppeteer (`{"args":["--no-sandbox"]}` — нужно в Docker/CI) |
| `-j, --jobs` | параллельные джобы при markdown-входе (по умолчанию половина CPU) |
| `-a, --artefacts` | куда класть картинки при markdown-входе |
| `-f, --pdfFit` | вписать диаграмму в страницу PDF |
| `--iconPacks` | iconify-паки для иконок (`architecture-beta`, узлы с иконками) |
| `-q, --quiet` | без прогресс-вывода |

**Markdown-режим.** `mmdc -i README.md -o README-out.md` отрендерит **все** mermaid-блоки файла (и `:::mermaid` тоже), параллельно по `-j`, и подставит ссылки на картинки — быстрый способ прогнать документ целиком, но он падает на первом невалидном блоке, не показывая, какой именно. Для точной диагностики — `scripts/mmd-validate.mjs`.

**Как читать результат.** Обычно ненулевой exit-код = невалидный `.mmd` (SVG при этом не создаётся), но **одного exit-кода не хватает**: проверено, что `gitGraph TB` (без двоеточия) даёт `EXIT=0` и при этом записывает error-графику. Надёжная проверка = exit-код **и** содержимое SVG: ищи `Syntax error in text` или `aria-roledescription="error"`. ⚠️ **Не проверяй по `.error-icon`**: этот CSS-класс есть в **любом** mermaid-SVG (часть встроенной таблицы стилей) и даёт ложные срабатывания — типовая ошибка самодельных CI-проверок. `scripts/mmd-validate.mjs` делает обе проверки.

**Отличай «сломано окружение» от «сломана диаграмма».** `Could not find Chrome` / `Tried to find the browser ... no executable was found` — это setup, а не синтаксис: `.mmd` может быть безупречен. Не переписывай корректную разметку по такой ошибке — поставь браузер или проверь через `mcp-mermaid`.

## 5. Линт (быстрый предфильтр)

```bash
npx -y @probelabs/maid docs/          # markdown с mermaid-блоками или .mmd
```
Ловит опечатки заголовка, непарные `subgraph/end`, `end`-ловушку, неэкранированные подписи. Maid **не** заменяет реальный рендер — за ним всегда `mmdc`/`mcp-mermaid`.

## 6. HTTP-сервисы (без установки)

**Kroki** — Mermaid + PlantUML/Graphviz и ещё ~20 форматов. Предпочитай POST: у GET-формы с base64 есть предел длины URL.

```bash
curl -sS -X POST -H "Content-Type: text/plain" --data-binary @diagram.mmd \
  -w "HTTP %{http_code}\n" https://kroki.io/mermaid/svg -o diagram.svg
```

- Для Mermaid Kroki отдаёт **только `png` и `svg`**: `POST /mermaid/pdf` → HTTP 400 `Unsupported output format: pdf for mermaid` (проверено). PDF — только локальный `mmdc`.
- **Проверяй HTTP-код**, а не наличие файла: `curl -o` запишет тело ошибки прямо в `diagram.svg`. При проверке backend Mermaid у Kroki отвечал HTTP 500 и на POST, и на GET-форму — как запасной путь он не гарантирован.

**Mermaid.ink:** `https://mermaid.ink/img/<base64(mmd)>` → PNG, `/svg/<base64>` → SVG.

⚠️ Публичные URL передают содержимое диаграммы во внешний сервис. Для конфиденциальных схем — локальный `mmdc`, self-hosted Kroki или `mcp-mermaid` с `file`/`base64`.

## 7. Встраивание в веб (mermaid npm SDK)

```javascript
import mermaid from "mermaid";
mermaid.initialize({ startOnLoad: false, securityLevel: "sandbox", theme: "neutral" });
const { svg } = await mermaid.render("id", "flowchart LR\n  User --> API --> DB");
document.querySelector("#diagram").innerHTML = svg;
```

## 8. Безопасность

Mermaid допускает HTML-подобные конструкции; полная санация сложна. Для недоверенного ввода — `securityLevel: "sandbox"` (iframe, но ограничивает интерактивность) или `"strict"`. Не рендери чужой Mermaid с `securityLevel: "loose"`: `loose` разрешает `click`-обработчики и произвольный HTML в подписях.

Ключи, защищённые от переопределения директивой `%%{init}%%` внутри самой диаграммы, перечислены в конфиге `secure` — по умолчанию (проверено в mermaid 11.16.1) это `secure`, `securityLevel`, `startOnLoad`, `maxTextSize`, `suppressErrorRendering`, `maxEdges`. Автор диаграммы не поднимет себе права директивой, но всё остальное (тема, шрифты, layout) он переопределить может — при рендере недоверенного ввода задавай `securityLevel` снаружи, через `-c configFile` или `initialize`.

## 9. Версии и воспроизводимость

- **Фиксируй версию Mermaid** — синтаксис версионно-зависим: типы приходят как `*-beta` и позже теряют суффикс (`block-beta` → `block`, `xychart-beta` → `xychart`, `packet-beta` → `packet`). Старое имя обычно ещё работает, новое — нет на старых версиях. Pin в `package.json`/образе и укажи версию рядом с диаграммой.
- На `mermaid` 11.16.1 (`mermaid-cli` 11.16.0) проверены рендером все типы из скилла `mermaid-diagrams`, включая свежие `architecture-beta`, `radar-beta`, `treemap-beta`, `venn-beta`, `treeView-beta`, `swimlane-beta`, `cynefin-beta`, `ishikawa-beta`, `wardley-beta`, `railroad-ebnf-beta`, `eventmodeling`, `kanban`.
- Храни `.mmd` в git; рендер (SVG/PNG) — как **build-артефакт**, а не источник истины.

## 10. CI

```bash
npx -y @probelabs/maid docs/ \
  && node scripts/mmd-validate.mjs --json docs/ \
  && npx -p @mermaid-js/mermaid-cli mmdc -i docs/architecture.mmd -o build/architecture.svg
```
Линт (Maid) → рендер каждого блока → сборка публикуемых артефактов; падение на любом шаге валит сборку. В Docker/CI добавляй `-p puppeteer.json` с `--no-sandbox`. Реальный рендер — единственный надёжный gate.
