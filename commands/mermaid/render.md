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
Альтернативы: **Kroki** (`https://kroki.io/mermaid/svg/<base64>`) или **Mermaid.ink** (`https://mermaid.ink/img/<base64>`) для быстрого HTTP-рендера без установки — но для приватных диаграмм используй локальный `mmdc` (публичные URL передают содержимое во внешний сервис).

Перед рендером убедись, что `.mmd` валиден (иначе рендер упадёт — см. `/mermaid:validate`). Зафиксируй версию Mermaid для воспроизводимости.

Сохраняй финальный файл **в рабочем каталоге пользователя (рядом с `.mmd` или по указанному пути), в запрошенном формате** — `/tmp` только для промежуточной проверки, не для выдачи. Отдай: **путь к готовому файлу** + использованную команду/сервис + тему + заметку о версии Mermaid. Опирайся на навык `mermaid-rendering`. Делегируй субагенту `mermaid`.
