---
name: web-scraping
description: Веб-скрапинг, краулинг, поиск и извлечение структурированных данных через Firecrawl (MCP firecrawl-mcp) — превращает веб в LLM-ready markdown/JSON. Инструменты scrape/map/crawl/search/extract, когда какой, ключевые параметры, экономия кредитов, structured extract по JSON-схеме. Use для веб-ресёрча, сбора данных с сайтов, мониторинга контента.
version: 1.0.0
---

# Навык: Web scraping / research (Firecrawl)

Firecrawl превращает веб в **LLM-ready** markdown или структурированный JSON. Через MCP-сервер `firecrawl-mcp` (ключ `FIRECRAWL_API_KEY=fc-...`) доступны инструменты: `firecrawl_scrape`, `firecrawl_map`, `firecrawl_crawl` (+ `firecrawl_check_crawl_status`), `firecrawl_search`, `firecrawl_extract`.

## Когда какой инструмент
- **search** — URL неизвестен: веб-поиск (источники web/news/images), опционально сразу скрейпит результаты. Точка входа ресёрча.
- **scrape** — знаешь **один** URL → markdown (`onlyMainContent`), html, links или JSON по схеме. Синхронно, дёшево.
- **map** — быстро получить **все** URL сайта (карта ссылок). Очень дёшево. Делай **перед** crawl, чтобы выбрать нужные страницы.
- **crawl** — рекурсивно обойти сайт/раздел (много страниц). Асинхронно → опрашивай `firecrawl_check_crawl_status`. Всегда ограничивай `limit`.
- **extract** — структурированные данные с одной/нескольких страниц или домена по `prompt` + JSON `schema`; `enableWebSearch`, `showSources`.

Правило выбора: одна известная страница со структурой → `scrape` в JSON-режиме (синхронно, дёшево), а не `extract`. Не знаешь, что где → `search`/`map` сначала.

## Ключевые параметры scrape
- `formats`: `["markdown"]` (дефолт-выбор), `["links"]`, `["html"]`, либо JSON: `{ type: "json", prompt, schema }`.
- `onlyMainContent: true` (дефолт) — выкидывает шапки/меню/футеры/сайдбары.
- `maxAge` (дефолт ~2 дня, мс) — кэш: отдаёт свежую копию, ускоряет скрейп до ×5. Ставь `0`, если нужны строго свежие данные.
- `includeTags`/`excludeTags` — сузить до нужных селекторов.
- `timeout`, `blockAds` (дефолт true), `proxy` (`basic`/`enhanced`/`auto`), `parsers: ["pdf"]`.

## Экономия кредитов и практики
- `map` дёшев — используй для разведки перед дорогим `crawl`.
- `maxAge`-кэш вместо повторных скрейпов одного URL.
- `onlyMainContent` + точечные `includeTags` — меньше мусора, дешевле обработка LLM.
- `crawl` всегда с `limit`; `enhanced` proxy — до 5 кредитов, включай только когда `basic` не берёт (anti-bot).
- PDF — 1 кредит/страница (`parsers: ["pdf"]`).
- После `search` вызывай `firecrawl_search_feedback` с ID запроса — это рефандит 1 кредит и улучшает качество.

## Структурированное извлечение (schema)
JSON-режим `scrape` (одна страница) или `extract` (несколько/домен) — задай `prompt` + JSON Schema:
```json
{
  "url": "https://example.com/product",
  "formats": [{
    "type": "json",
    "prompt": "Extract the product info",
    "schema": {
      "type": "object",
      "properties": { "name": {"type":"string"}, "price": {"type":"number"} },
      "required": ["name", "price"]
    }
  }]
}
```
`extract` дополнительно: `enableWebSearch: true` (дообогащение из поиска), `showSources: true` (вернуть URL-источники).

## Ресёрч-поток
1. `search` по вопросу → отбери релевантные источники.
2. `scrape`/`extract` нужных страниц (structured, если нужна форма).
3. Для целого сайта: `map` → выбери страницы → `crawl`/`scrape` только их.
4. Синтез с **цитированием URL** каждого утверждения; факты сверяй по ≥2 источникам.

## Осторожно
- Уважай `robots.txt`, ToS сайта и правовые ограничения; не собирай персональные/чувствительные данные без основания.
- Помечай источник (URL) каждого факта; не выдавай скрейп за проверенную истину.
- Большие `crawl` — дорого и медленно: сначала `map` + `limit`, затем точечно.
