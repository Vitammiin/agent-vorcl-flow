---
name: frontend-optimize
description: Оптимизация рендера/бандла/Core Web Vitals (роль frontend). Use когда нужно ускорить фронтенд по замерам.
---

# Задача: оптимизация фронтенда

Оптимизируй указанное пользователем.

Сначала измерь (профайлер React, бандл-анализ, Lighthouse/Core Web Vitals — LCP/INP/CLS), потом оптимизируй по данным: меньше клиентского JS (больше Server Components), code-splitting/`dynamic`, мемоизация против реальных перерендеров, `next/image`/`next/font`, кэш и ревалидация данных, устранение layout shift. Покажи «до/после». Опирайся на `$react`, `$nextjs`, `$data-fetching`.
