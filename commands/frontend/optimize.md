---
description: Оптимизация рендера/бандла/Core Web Vitals (frontend)
argument-hint: "<что оптимизируем>"
allowed-tools: Read, Write, Edit, Bash
---

Оптимизируй: **$ARGUMENTS**.

Сначала измерь (профайлер React, бандл-анализ, Lighthouse/Core Web Vitals — LCP/INP/CLS), потом оптимизируй по данным. Возможные меры: сократить клиентский JS (больше Server Components), code-splitting/`dynamic`, мемоизация против реальных перерендеров, `next/image`/`next/font`, кэш и ревалидация данных (`revalidateTag`/staleTime Query), устранение layout shift. Покажи «до/после» метрики. Опирайся на навыки `react`, `nextjs`, `data-fetching`. При необходимости делегируй субагенту `frontend`.
