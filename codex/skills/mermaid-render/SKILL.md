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
Альтернативы — Kroki / Mermaid.ink (HTTP без установки; ⚠️ публичные URL шлют содержимое вовне — приватное рендерь локально). Перед рендером убедись, что `.mmd` валиден (`$mermaid-validate`). Зафиксируй версию Mermaid.

Дай: путь к файлу + команду/сервис + тему + заметку о версии Mermaid.
