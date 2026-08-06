---
description: Шаг 2 конвейера pinpoint (read-only) — определить маршрут/страницу, на которой открыт экран со скриншота (App Router / React Router) (pinpoint). Use when вопрос «какая это страница/URL?»; сам файл компонента → /pinpoint:locate, элемент на странице → /pinpoint:control
argument-hint: "<путь к скриншоту> [подсказка: раздел/URL]"
allowed-tools: Read, Grep, Glob, Bash
---

Определи маршрут/страницу, на которой открыт экран: **$ARGUMENTS**.

Открой скриншот через Read, найди компонент экрана (по видимому тексту/иконкам — см. `ui-source-mapping`) и свяжи его с маршрутом по конвенциям фреймворка: **Next.js App Router** (`app/**/page.tsx`, сегменты, `[param]`, группы `(group)`, `layout.tsx`), **Pages Router** (`pages/**`), **React Router** (`<Route path>`/`createBrowserRouter`, `Outlet`, `index`). Иди в обе стороны: от компонента → кто его рендерит → до `page`/`Route`; и от активного пункта навигации (крошки/выделенный пункт/видимый URL) → его `href`/`to` → до целевого маршрута.

Отдай URL/путь и где он объявлен (**`file:line`**), плюс каркас (`layout`) при наличии. Только чтение. Опирайся на навыки `ui-source-mapping`, `nextjs`, `react`, `frontend-architecture`. Делегируй субагенту `pinpoint`.
