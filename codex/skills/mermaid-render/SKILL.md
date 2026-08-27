---
name: mermaid-render
description: Экспорт Mermaid в SVG/PNG/PDF — mermaid-cli / Kroki / Mermaid.ink, с темой и фоном (роль mermaid). Use when .mmd валиден и нужен файл-изображение; проверить/починить синтаксис → $mermaid-validate, изменить содержание → $mermaid-refine.
---

# Задача: рендер Mermaid в изображение

Отрендери `.mmd` в изображение (см. `$mermaid-rendering`).

Формат: SVG (доки), PNG (чаты/задачи), PDF (печать). Основной путь — mermaid-cli:
```
npx -p @mermaid-js/mermaid-cli mmdc -i <файл>.mmd -o <файл>.<fmt> --theme <тема> --backgroundColor transparent
```
Полезные флаги: `-c config.json`, `-w`/`-H`/`-s` (размер и ретина для PNG), `-f` (вписать в PDF), `--iconPacks` (иконки `architecture-beta`), `-p puppeteer.json` с `--no-sandbox` (Docker/CI).

`Could not find Chrome` — это окружение, а не диаграмма: `npx puppeteer browsers install chrome-headless-shell` (`mmdc` браузер с собой не носит).

Альтернативы — Kroki / Mermaid.ink (HTTP без установки; ⚠️ публичные URL шлют содержимое вовне — приватное рендерь локально). У Kroki для Mermaid только PNG/SVG — `/mermaid/pdf` даёт HTTP 400; проверяй код ответа, иначе `curl -o` запишет тело ошибки в файл. Перед рендером убедись, что `.mmd` валиден (`$mermaid-validate`). Зафиксируй версию Mermaid.

Дай: путь к файлу + команду/сервис + тему + заметку о версии Mermaid.
