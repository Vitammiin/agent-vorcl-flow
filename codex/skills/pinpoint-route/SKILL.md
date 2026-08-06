---
name: pinpoint-route
description: Определить маршрут/страницу, на которой открыт экран со скриншота — Next.js App/Pages Router, React Router (роль pinpoint). Use для привязки экрана к маршруту/URL.
---

# Задача: определить маршрут экрана (pinpoint)

Определи маршрут/страницу, на которой открыт экран (см. `$ui-source-mapping`). Найди компонент экрана и свяжи с маршрутом: **Next.js App Router** (`app/**/page.tsx`, сегменты, `[param]`, `(group)`, `layout.tsx`), **Pages Router** (`pages/**`), **React Router** (`<Route path>`/`createBrowserRouter`, `Outlet`, `index`). Иди в обе стороны: компонент → кто рендерит → `page`/`Route`; и активный пункт навигации (крошки/URL) → `href`/`to` → маршрут. Отдай URL/путь и где объявлен (**`file:line`**) + каркас `layout`. Только чтение. Опирайся на `$ui-source-mapping`, `$nextjs`, `$react`, `$frontend-architecture`.
