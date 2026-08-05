---
name: mermaid-rendering
description: Валидация, рендеринг и экспорт Mermaid — mcp-mermaid (MCP), @mermaid-js/mermaid-cli (`mmdc`), Kroki, Mermaid.ink, Maid-линтер, официальный mermaid npm SDK и Mermaid Chart MCP; фиксация версии, CI-проверка рендером, экспорт SVG/PNG/PDF, security (`securityLevel`), приватность (локальный vs публичные URL). Use для проверки синтаксиса Mermaid, генерации изображений и настройки CI.
version: 1.0.0
---

# Навык: Валидация и рендеринг Mermaid

Ключевой принцип: **ни один LLM не является валидатором Mermaid**. Даже синтаксически «правильная на вид» диаграмма может не отрендериться или различаться между версиями. Поэтому окончательный критерий готовности — **реальный рендер**, а `.mmd` хранится в git и проверяется в CI.

## 1. Инструменты экосистемы
| Инструмент | Тип | Когда |
|---|---|---|
| **mermaid** (npm) | SDK / браузер | Встраивание в веб-приложение, рендер в DOM |
| **@mermaid-js/mermaid-cli** (`mmdc`) | CLI / Node | Эталонный рендер в SVG/PNG/PDF, CI/CD |
| **mcp-mermaid** | MCP-сервер (self-hosted) | Генерация/валидация/рендер из агента — **подключён в этом плагине** |
| **Mermaid Chart MCP** | hosted MCP | text-to-diagram без своего сервера (закрытая инфра) |
| **Maid** (`@probelabs/maid`) | линтер / MCP | Быстрая проверка markdown и типовых AI-ошибок (не полная семантика) |
| **Kroki** | HTTP API (self-host) | Единый endpoint Mermaid + десятки других форматов |
| **Mermaid.ink** | HTTP-renderer | Простой URL → SVG/PNG/JPEG/WebP/PDF |

## 2. MCP `mcp-mermaid` (основной путь в плагине)
Подключён в `.mcp.json` (`npx -y mcp-mermaid`, self-hosted, без ключей). Умеет проверять синтаксис и возвращать исходник/файл/base64/SVG/PNG. Для приватных данных выбирай `file`/`svg`/`base64` вместо публичных URL. Это предпочтительный способ валидации/рендера прямо из агента.

## 3. Эталонный CLI-рендер (`mmdc`)
```bash
npx -p @mermaid-js/mermaid-cli mmdc -i diagram.mmd -o diagram.svg \
  --theme dark --backgroundColor transparent
# форматы: -o out.svg | out.png | out.pdf ; темы: default|dark|neutral|forest
```
Ненулевой exit-код = невалидный `.mmd`. Это финальная проверка перед публикацией.

## 4. Линт (быстрый предфильтр)
```bash
npx -y @probelabs/maid docs/          # markdown с mermaid-блоками или .mmd
```
Ловит опечатки заголовка, непарные `subgraph/end`, `end`-ловушку, неэкранированные подписи. Maid **не** заменяет реальный рендер — за ним всегда `mmdc`/`mcp-mermaid`.

Связка для документационного CI:
```bash
npx -y @probelabs/maid docs/ && \
npx -p @mermaid-js/mermaid-cli mmdc -i docs/architecture.mmd -o build/architecture.svg
```

## 5. HTTP-сервисы (без установки)
- **Kroki:** `POST https://kroki.io/mermaid/svg` (или base64 в URL) — Mermaid + PlantUML/Graphviz и др.
- **Mermaid.ink:** `https://mermaid.ink/img/<base64(mmd)>` → PNG, `/svg/<base64>` → SVG.
- ⚠️ Публичные URL передают содержимое диаграммы во внешний сервис. Для конфиденциальных схем — локальный `mmdc`, self-hosted Kroki или `mcp-mermaid` с `file`/`base64`.

## 6. Встраивание в веб (mermaid npm SDK)
```javascript
import mermaid from "mermaid";
mermaid.initialize({ startOnLoad: false, securityLevel: "sandbox", theme: "neutral" });
const { svg } = await mermaid.render("id", "flowchart LR\n  User --> API --> DB");
document.querySelector("#diagram").innerHTML = svg;
```

## 7. Безопасность
Mermaid допускает HTML-подобные конструкции; полная санация сложна. Для недоверенного ввода — `securityLevel: "sandbox"` (iframe, но ограничивает интерактивность) или `"strict"`. Не рендери чужой Mermaid с `securityLevel: "loose"`.

## 8. Воспроизводимость и CI
- **Фиксируй версию Mermaid** (диаграммы версионно-зависимы) — pin в `package.json`/образе.
- Храни `.mmd` в git; рендер (SVG/PNG) — как **build-артефакт**, а не источник истины.
- В CI: линт (Maid) → эталонный рендер (`mmdc`) → падение сборки при ошибке. Реальный рендер — единственный надёжный gate.
