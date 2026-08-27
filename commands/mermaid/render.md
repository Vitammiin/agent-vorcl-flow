---
description: Экспорт Mermaid в SVG/PNG/PDF — mermaid-cli / Kroki / Mermaid.ink, с темой и фоном (mermaid). Use when .mmd валиден и нужен файл-изображение; проверить/починить синтаксис → /mermaid:validate, изменить содержание → /mermaid:refine
argument-hint: "<путь к .mmd> [формат: svg|png|pdf] [тема: default|dark|neutral|forest]"
allowed-tools: Read, Write, Edit, Bash
---

Отрендери Mermaid в изображение: **$ARGUMENTS**.

Формат по умолчанию — SVG (векторный, для доков), PNG — для вставки в чаты/задачи, PDF — для печати. Основной путь — **mermaid-cli**:
```bash
npx -p @mermaid-js/mermaid-cli mmdc -i <файл>.mmd -o <файл>.<fmt> \
  --theme <тема> --backgroundColor transparent
```
Полезные флаги: `-c config.json` (тема/`themeVariables`/`securityLevel`), `-w`/`-H`/`-s` (размер и ретина для PNG), `-f` (вписать в страницу PDF), `--iconPacks @iconify-json/logos` (иконки для `architecture-beta`), `-p puppeteer.json` с `{"args":["--no-sandbox"]}` (Docker/CI). Markdown на входе (`-i README.md -o out.md`) отрендерит все mermaid-блоки файла разом.

Если `mmdc` падает с `Could not find Chrome` — это **окружение**, а не диаграмма: `npx puppeteer browsers install chrome-headless-shell` (браузер `mmdc` с собой не носит) либо иди через `mcp-mermaid`.

Альтернативы: **Kroki** (`curl -X POST --data-binary @diagram.mmd https://kroki.io/mermaid/svg`) или **Mermaid.ink** (`https://mermaid.ink/img/<base64>`) для быстрого HTTP-рендера без установки. У Kroki для Mermaid **нет PDF** (только PNG/SVG — `/mermaid/pdf` вернёт HTTP 400), и он бывает недоступен: проверяй HTTP-код ответа, иначе `curl -o` запишет тело ошибки прямо в `.svg`. Для приватных диаграмм используй локальный `mmdc` — публичные URL передают содержимое во внешний сервис.

Перед рендером убедись, что `.mmd` валиден (иначе рендер упадёт — см. `/mermaid:validate`). Зафиксируй версию Mermaid для воспроизводимости.

Сохраняй финальный файл **в рабочем каталоге пользователя (рядом с `.mmd` или по указанному пути), в запрошенном формате** — `/tmp` только для промежуточной проверки, не для выдачи. Отдай: **путь к готовому файлу** + использованную команду/сервис + тему + заметку о версии Mermaid. Опирайся на навык `mermaid-rendering`. Делегируй субагенту `mermaid`.
