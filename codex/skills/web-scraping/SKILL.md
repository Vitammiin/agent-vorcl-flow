---
name: web-scraping
description: Веб-скрапинг, краулинг, поиск и извлечение структурированных данных через Firecrawl (MCP firecrawl-mcp) — превращает веб в LLM-ready markdown/JSON. Инструменты scrape/map/crawl/search/extract, когда какой, ключевые параметры, экономия кредитов, structured extract по JSON-схеме. Use для веб-ресёрча, сбора данных с сайтов, мониторинга контента.
---

# Навык: Web scraping / research (Firecrawl)

Firecrawl превращает веб в **LLM-ready** markdown или структурированный JSON. Через MCP-сервер `firecrawl-mcp` (ключ `FIRECRAWL_API_KEY=fc-...`) доступны: `firecrawl_scrape`, `firecrawl_map`, `firecrawl_crawl` (+ `firecrawl_check_crawl_status`), `firecrawl_search`, `firecrawl_extract`.

## Когда какой инструмент
- **search** — URL неизвестен: веб-поиск (web/news/images), опц. сразу скрейпит результаты. Точка входа ресёрча.
- **scrape** — знаешь **один** URL → markdown (`onlyMainContent`), html, links или JSON по схеме. Синхронно, дёшево.
- **map** — быстро получить **все** URL сайта. Очень дёшево. Делай **перед** crawl.
- **crawl** — рекурсивно обойти сайт/раздел (много страниц). Асинхронно → `firecrawl_check_crawl_status`. Всегда с `limit`.
- **extract** — структурированные данные с одной/нескольких страниц/домена по `prompt` + JSON `schema`; `enableWebSearch`, `showSources`.

Правило: известная страница со структурой → `scrape` в JSON-режиме, а не `extract`. Не знаешь что где → `search`/`map` сначала.

## Ключевые параметры scrape
- `formats`: `["markdown"]` (дефолт), `["links"]`, `["html"]`, либо JSON `{ type: "json", prompt, schema }`.
- `onlyMainContent: true` (дефолт) — без шапок/меню/футеров.
- `maxAge` (дефолт ~2 дня, мс) — кэш, ускоряет до ×5; `0` для строго свежих данных.
- `includeTags`/`excludeTags`, `timeout`, `blockAds` (true), `proxy` (`basic`/`enhanced`/`auto`), `parsers: ["pdf"]`.

## Экономия кредитов и практики
- `map` дёшев — разведка перед дорогим `crawl`.
- `maxAge`-кэш вместо повторных скрейпов.
- `onlyMainContent` + `includeTags` — меньше мусора, дешевле обработка.
- `crawl` всегда с `limit`; `enhanced` proxy — до 5 кредитов, только при anti-bot.
- PDF — 1 кредит/страница. После `search` — `firecrawl_search_feedback` (рефанд 1 кредита).

## Структурированное извлечение (schema)
```json
{
  "url": "https://example.com/product",
  "formats": [{
    "type": "json",
    "prompt": "Extract the product info",
    "schema": { "type": "object", "properties": { "name": {"type":"string"}, "price": {"type":"number"} }, "required": ["name","price"] }
  }]
}
```
`extract` дополнительно: `enableWebSearch: true`, `showSources: true` (URL-источники).

## Ресёрч-поток
`search` → отобрать источники → `scrape`/`extract` нужных → синтез с **цитированием URL** (факты по ≥2 источникам). Для сайта: `map` → выбрать → `crawl`/`scrape`.

## Осторожно
- Уважай `robots.txt`, ToS и правовые ограничения; не собирай персональные/чувствительные данные без основания.
- Помечай источник (URL) каждого факта. Большие `crawl` дороги — сначала `map` + `limit`.
