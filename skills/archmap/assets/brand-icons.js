/* archmap brand-icons.js — узнаваемые значки технологий для карты архитектуры.
 *
 * ЮРИДИЧЕСКАЯ РАМКА (важно, не нарушать при правках).
 * Здесь НЕТ и не должно быть фирменных логотипов. Ни листика MongoDB, ни слона
 * PostgreSQL, ни кита Docker, ни любого другого охраняемого знака. Узнавание строится
 * на трёх незащищаемых слоях:
 *   1) абстрактный глиф — форма по ТИПУ продукта (цилиндр = БД, конверт = почта,
 *      молния = кэш). Такие примитивы рисуются здесь с нуля;
 *   2) фирменный цвет — цвет сам по себе не объект авторского права (значения ниже
 *      приблизительные, «в тон бренду», а не выверенные бренд-константы);
 *   3) монограмма из 1–2 букв — сокращение имени, набранное шрифтом страницы.
 * Цель — чтобы взгляд за долю секунды отличил Redis от Postgres, а НЕ подделать бренд.
 *
 * Файл самодостаточен: без импортов, без сетевых запросов, обычный <script>.
 * Экспортирует в window:
 *   ARCHMAP_GLYPHS     — { имя: SVG-path в системе координат 0 0 24 24 }
 *   ARCHMAP_BRANDS     — { ключ: { label, color, mono, glyph, cat } }
 *   ARCHMAP_BRAND_KEY  — (имя пакета/слаг/подпись) → ключ бренда или null
 *   ARCHMAP_BRAND      — (имя) → запись бренда (+ key, + path) или null
 *   ARCHMAP_BRAND_SVG  — (имя, size) → строка <svg> или '' (удобно для innerHTML)
 *
 * Все пути рисуются ОБВОДКОЙ (fill:none; stroke:currentColor), поэтому рассчитаны на
 * stroke-width ≈ 1.6 и stroke-linecap/linejoin: round. Оптическая плотность у всех
 * глифов подобрана одинаковой, чтобы сетка значков не «рябила».
 */
;(function (global) {
  'use strict'

  // ── Абстрактные глифы ─────────────────────────────────────────────────────
  // Форма = тип продукта, а не бренд. Одна форма спокойно обслуживает несколько
  // технологий: различие даёт цвет + монограмма.
  var GLYPHS = {
    // хранение и данные
    db: 'M5 6a7 3 0 1 0 14 0a7 3 0 1 0 -14 0 M5 6v12a7 3 0 0 0 14 0V6 M5 12a7 3 0 0 0 14 0',
    vector: 'M12 4.4a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 1 0 0-4.2z M5.5 14.6a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 1 0 0-4.2z M18.5 14.6a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 1 0 0-4.2z M10.4 8.2 7.1 14.9 M13.6 8.2l3.3 6.7 M7.6 16.7h8.8',
    layers: 'M12 2.5 3.5 7l8.5 4.5L20.5 7 12 2.5z M3.5 12 12 16.5 20.5 12 M3.5 16.5 12 21 20.5 16.5',
    box: 'M12 3 21 7.5v9L12 21 3 16.5v-9L12 3z M3 7.5 12 12l9-4.5 M12 12v9',
    braces: 'M10 3.5c-2 0-3 1-3 3v2.5c0 1.7-1 2.7-2.5 3 1.5.3 2.5 1.3 2.5 3V17.5c0 2 1 3 3 3 M14 3.5c2 0 3 1 3 3v2.5c0 1.7 1 2.7 2.5 3-1.5.3-2.5 1.3-2.5 3V17.5c0 2-1 3-3 3',

    // поток, очередь, связи
    // три «сообщения» подряд: мелкие стрелки и перегородки на 20px превращались
    // в решётку, поэтому оставлены только крупные блоки
    queue: 'M3.2 8.4h4.6v7.2H3.2z M9.7 8.4h4.6v7.2H9.7z M16.2 8.4h4.6v7.2h-4.6z',
    stream: 'M2.5 7c1.5-2.6 4.5-2.6 6 0s4.5 2.6 6 0s4.5-2.6 6 0 M2.5 12c1.5-2.6 4.5-2.6 6 0s4.5 2.6 6 0s4.5-2.6 6 0 M2.5 17c1.5-2.6 4.5-2.6 6 0s4.5 2.6 6 0s4.5-2.6 6 0',
    link: 'M9.5 13.5a4.5 4.5 0 0 0 6.8.5l2.5-2.5a4.5 4.5 0 0 0-6.4-6.4L11 6.5 M14.5 10.5a4.5 4.5 0 0 0-6.8-.5l-2.5 2.5a4.5 4.5 0 0 0 6.4 6.4l1.4-1.4',
    arrow: 'M3 12h15 M13.5 7l5 5-5 5',
    git: 'M7 2.8a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 1 0 0-4.4z M7 16.8a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 1 0 0-4.4z M17 9.8a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 1 0 0-4.4z M7 7.2v9.6 M7 9.5a4 4 0 0 0 4 2.5h3.8',
    plug: 'M9 3v4 M15 3v4 M6.5 7h11v4a5.5 5.5 0 0 1-11 0V7z M12 16.5V21',

    // облако и хостинг
    cloud: 'M8 19h9.5a4.2 4.2 0 0 0 .3-8.4A6 6 0 0 0 6.4 9.6 5.2 5.2 0 0 0 8 19z',
    globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z M3.4 12h17.2 M12 3a5 9 0 1 0 0 18 5 9 0 1 0 0-18z',
    triangle: 'M12 4 21 20H3L12 4z',
    hex: 'M12 2.8 20 7.4v9.2L12 21.2 4 16.6V7.4L12 2.8z',
    // спицы намеренно не доходят ни до втулки, ни до обода: иначе на 16–20px
    // рисунок сливается в тёмное пятно
    wheel: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 1 0 0-7.2z M12 4.7v3.7 M12 15.6v3.7 M15.1 10.2l3.2-1.8 M15.1 13.8l3.2 1.8 M8.9 10.2 5.7 8.4 M8.9 13.8l-3.2 1.8',

    // деньги
    pay: 'M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M3 10h18 M6.5 14.5h3',
    wallet: 'M5 6h12a2 2 0 0 1 2 2v1h2v5h-2v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M16.6 11.5h.01',

    // связь
    mail: 'M4.5 6h15A1.5 1.5 0 0 1 21 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5v-9A1.5 1.5 0 0 1 4.5 6z M3.6 7.4 12 13.2l8.4-5.8',
    chat: 'M5 4.5h14A2 2 0 0 1 21 6.5v7a2 2 0 0 1-2 2h-6.2L8.5 20v-4.5H5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z',

    // безопасность и доступ
    lock: 'M6 11h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z M8.5 11V8a3.5 3.5 0 0 1 7 0v3',
    shield: 'M12 3 4.5 6v6c0 4.5 3.2 7.6 7.5 9 4.3-1.4 7.5-4.5 7.5-9V6L12 3z',
    key: 'M7 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 1 0 0-7z M10.5 12h9 M14 12v3 M18.5 12v3',

    // наблюдаемость и аналитика
    chart: 'M4 4v16h16 M8 20v-6 M12.7 20v-11 M17.4 20v-8',
    gauge: 'M3.5 17.5a8.5 8.5 0 1 1 17 0 M12 17.5 16.2 11.4 M11.2 17.5a.8 .8 0 1 0 1.6 0 .8 .8 0 1 0-1.6 0z',
    search: 'M11 4a7 7 0 1 0 0 14 7 7 0 1 0 0-14z M16 16l4.5 4.5',

    // код, рантайм, инструменты
    code: 'M9 7 4 12l5 5 M15 7l5 5-5 5 M13.5 4.5 10.5 19.5',
    chip: 'M8 8h8v8H8z M10.5 4v4 M13.5 4v4 M10.5 16v4 M13.5 16v4 M4 10.5h4 M4 13.5h4 M16 10.5h4 M16 13.5h4',
    terminal: 'M4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5z M7 10l2.5 2.5L7 15 M13 15h4.5',
    window: 'M4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11A1.5 1.5 0 0 1 4.5 5z M3 9.5h18 M5.9 7.2h.01 M8.4 7.2h.01 M10.9 7.2h.01',
    flask: 'M9.5 3v6.2L4.6 18a2 2 0 0 0 1.7 3h11.4a2 2 0 0 0 1.7-3l-4.9-8.8V3 M8 3h8 M7 14h10',
    check: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z M7.8 12.2l2.9 2.9 5.5-5.9',
    pen: 'M4 20l1-4.2L16.4 4.4a2.2 2.2 0 0 1 3.2 3.2L8.2 19 4 20z M14.6 6.2l3.2 3.2',

    // энергия и «искра»
    bolt: 'M13 3 5 13.5h6l-2 7.5 8-11h-6l2-7z',
    flame: 'M12 21c3.9 0 6.5-2.6 6.5-6 0-4.5-4-6.5-4-10.5-2 1.5-3 3.5-3 5.5-1-.8-1.5-1.8-1.5-3-2 1.8-4.5 4.6-4.5 8 0 3.4 2.6 6 6.5 6z',
    ai: 'M10.5 5.4c.6 3.1 1.5 4 4.6 4.6-3.1.6-4 1.5-4.6 4.6-.6-3.1-1.5-4-4.6-4.6 3.1-.6 4-1.5 4.6-4.6z M17.6 14.2c.4 2 .9 2.5 2.9 2.9-2 .4-2.5.9-2.9 2.9-.4-2-.9-2.5-2.9-2.9 2-.4 2.5-.9 2.9-2.9z'
  }

  // ── Таблица технологий ────────────────────────────────────────────────────
  // Ключи совпадают со слагами skills/archmap/scripts/lib/services.mjs (svc:<slug>)
  // И с нормализованными именами npm-пакетов.
  var BRANDS = {
    // ─ базы данных и хранилища ─
    mongodb: { label: 'MongoDB', color: '#47A248', mono: 'M', glyph: 'db', cat: 'database' },
    postgres: { label: 'PostgreSQL', color: '#4169E1', mono: 'PG', glyph: 'db', cat: 'database' },
    mysql: { label: 'MySQL', color: '#4479A1', mono: 'MY', glyph: 'db', cat: 'database' },
    sqlite: { label: 'SQLite', color: '#0F80CC', mono: 'SL', glyph: 'db', cat: 'database' },
    redis: { label: 'Redis', color: '#FF4438', mono: 'R', glyph: 'bolt', cat: 'cache' },
    elasticsearch: { label: 'Elasticsearch', color: '#00BFB3', mono: 'ES', glyph: 'search', cat: 'search' },
    clickhouse: { label: 'ClickHouse', color: '#FFCC01', mono: 'CH', glyph: 'chart', cat: 'database' },
    qdrant: { label: 'Qdrant', color: '#DC244C', mono: 'Q', glyph: 'vector', cat: 'database' },
    pinecone: { label: 'Pinecone', color: '#6D4AFF', mono: 'PC', glyph: 'vector', cat: 'database' },
    weaviate: { label: 'Weaviate', color: '#00C9A7', mono: 'W', glyph: 'vector', cat: 'database' },

    // ─ очереди и стриминг ─
    kafka: { label: 'Kafka', color: '#8E99A8', mono: 'K', glyph: 'stream', cat: 'queue' },
    rabbitmq: { label: 'RabbitMQ', color: '#FF6600', mono: 'RQ', glyph: 'queue', cat: 'queue' },
    bullmq: { label: 'BullMQ', color: '#EA4C46', mono: 'BQ', glyph: 'queue', cat: 'queue' },
    nats: { label: 'NATS', color: '#27AAE1', mono: 'N', glyph: 'stream', cat: 'queue' },

    // ─ облака и хостинг ─
    aws: { label: 'AWS', color: '#FF9900', mono: 'AW', glyph: 'cloud', cat: 'cloud' },
    gcp: { label: 'Google Cloud', color: '#4285F4', mono: 'GC', glyph: 'cloud', cat: 'cloud' },
    google: { label: 'Google Cloud', color: '#4285F4', mono: 'G', glyph: 'cloud', cat: 'cloud' },
    azure: { label: 'Azure', color: '#0089D6', mono: 'AZ', glyph: 'cloud', cat: 'cloud' },
    vercel: { label: 'Vercel', color: '#D0D6DE', mono: 'V', glyph: 'triangle', cat: 'cloud' },
    render: { label: 'Render', color: '#46E3B7', mono: 'RE', glyph: 'layers', cat: 'cloud' },
    netlify: { label: 'Netlify', color: '#00C7B7', mono: 'NF', glyph: 'hex', cat: 'cloud' },
    cloudflare: { label: 'Cloudflare', color: '#F6821F', mono: 'CF', glyph: 'shield', cat: 'cloud' },
    fly: { label: 'Fly.io', color: '#7B3FE4', mono: 'FL', glyph: 'globe', cat: 'cloud' },
    railway: { label: 'Railway', color: '#B57BFF', mono: 'RW', glyph: 'arrow', cat: 'cloud' },
    heroku: { label: 'Heroku', color: '#9B7BD4', mono: 'H', glyph: 'layers', cat: 'cloud' },
    digitalocean: { label: 'DigitalOcean', color: '#0080FF', mono: 'DO', glyph: 'globe', cat: 'cloud' },
    cloudinary: { label: 'Cloudinary', color: '#5A6EE0', mono: 'CD', glyph: 'window', cat: 'cloud' },

    // ─ контейнеры и оркестрация ─
    docker: { label: 'Docker', color: '#2496ED', mono: 'D', glyph: 'box', cat: 'cloud' },
    kubernetes: { label: 'Kubernetes', color: '#326CE5', mono: 'K8', glyph: 'wheel', cat: 'cloud' },

    // ─ платежи ─
    stripe: { label: 'Stripe', color: '#635BFF', mono: 'S', glyph: 'pay', cat: 'payments' },
    paddle: { label: 'Paddle', color: '#FDDD35', mono: 'PD', glyph: 'pay', cat: 'payments' },
    paypal: { label: 'PayPal', color: '#0070BA', mono: 'PP', glyph: 'wallet', cat: 'payments' },

    // ─ связь и уведомления ─
    twilio: { label: 'Twilio', color: '#F22F46', mono: 'TW', glyph: 'chat', cat: 'messaging' },
    sendgrid: { label: 'SendGrid', color: '#1A82E2', mono: 'SG', glyph: 'mail', cat: 'messaging' },
    resend: { label: 'Resend', color: '#B9C0CC', mono: 'RS', glyph: 'mail', cat: 'messaging' },
    nodemailer: { label: 'Nodemailer', color: '#22A06B', mono: 'NM', glyph: 'mail', cat: 'messaging' },
    slack: { label: 'Slack', color: '#36C5F0', mono: 'SK', glyph: 'chat', cat: 'messaging' },
    telegram: { label: 'Telegram', color: '#2AABEE', mono: 'TG', glyph: 'chat', cat: 'messaging' },
    livekit: { label: 'LiveKit', color: '#1FD5F9', mono: 'LK', glyph: 'stream', cat: 'messaging' },

    // ─ ИИ ─
    openai: { label: 'OpenAI', color: '#10A37F', mono: 'OA', glyph: 'ai', cat: 'ai' },
    anthropic: { label: 'Anthropic', color: '#D97757', mono: 'A', glyph: 'ai', cat: 'ai' },
    langchain: { label: 'LangChain', color: '#3FAE8E', mono: 'LC', glyph: 'link', cat: 'ai' },
    huggingface: { label: 'Hugging Face', color: '#FFD21E', mono: 'HF', glyph: 'ai', cat: 'ai' },
    ollama: { label: 'Ollama', color: '#C2C8D0', mono: 'OL', glyph: 'terminal', cat: 'ai' },
    perplexity: { label: 'Perplexity', color: '#20B8CD', mono: 'PX', glyph: 'search', cat: 'ai' },
    gemini: { label: 'Gemini', color: '#4C8DF6', mono: 'GM', glyph: 'ai', cat: 'ai' },
    'vercel-ai': { label: 'Vercel AI SDK', color: '#6E7A8A', mono: 'AI', glyph: 'ai', cat: 'ai' },

    // ─ аутентификация ─
    auth0: { label: 'Auth0', color: '#EB5424', mono: 'A0', glyph: 'lock', cat: 'auth' },
    clerk: { label: 'Clerk', color: '#6C47FF', mono: 'CL', glyph: 'shield', cat: 'auth' },
    firebase: { label: 'Firebase', color: '#FFCA28', mono: 'FB', glyph: 'flame', cat: 'auth' },
    supabase: { label: 'Supabase', color: '#3ECF8E', mono: 'SB', glyph: 'bolt', cat: 'auth' },
    jwt: { label: 'JWT', color: '#FB015B', mono: 'JW', glyph: 'key', cat: 'auth' },
    apple: { label: 'Apple', color: '#A6AEB8', mono: 'AP', glyph: 'shield', cat: 'auth' },

    // ─ наблюдаемость ─
    sentry: { label: 'Sentry', color: '#E1567C', mono: 'SN', glyph: 'shield', cat: 'observability' },
    datadog: { label: 'Datadog', color: '#7C3FBF', mono: 'DD', glyph: 'gauge', cat: 'observability' },
    posthog: { label: 'PostHog', color: '#F54E00', mono: 'PH', glyph: 'chart', cat: 'observability' },
    grafana: { label: 'Grafana', color: '#F46800', mono: 'GF', glyph: 'gauge', cat: 'observability' },
    prometheus: { label: 'Prometheus', color: '#E6522C', mono: 'PM', glyph: 'flame', cat: 'observability' },
    pino: { label: 'Pino', color: '#86C0E0', mono: 'PN', glyph: 'terminal', cat: 'observability' },
    opentelemetry: { label: 'OpenTelemetry', color: '#F5A800', mono: 'OT', glyph: 'stream', cat: 'observability' },

    // ─ фреймворки ─
    fastify: { label: 'Fastify', color: '#A6B3C2', mono: 'F', glyph: 'bolt', cat: 'framework' },
    express: { label: 'Express', color: '#6B7280', mono: 'EX', glyph: 'arrow', cat: 'framework' },
    nestjs: { label: 'NestJS', color: '#E0234E', mono: 'NJ', glyph: 'box', cat: 'framework' },
    next: { label: 'Next.js', color: '#8B94A3', mono: 'N', glyph: 'triangle', cat: 'framework' },
    react: { label: 'React', color: '#61DAFB', mono: 'R', glyph: 'chip', cat: 'framework' },
    vue: { label: 'Vue', color: '#42B883', mono: 'VU', glyph: 'triangle', cat: 'framework' },
    svelte: { label: 'Svelte', color: '#FF3E00', mono: 'SV', glyph: 'code', cat: 'framework' },
    angular: { label: 'Angular', color: '#DD0031', mono: 'NG', glyph: 'shield', cat: 'framework' },
    remix: { label: 'Remix', color: '#3DEFE9', mono: 'RX', glyph: 'layers', cat: 'framework' },
    nuxt: { label: 'Nuxt', color: '#00DC82', mono: 'NX', glyph: 'hex', cat: 'framework' },
    trpc: { label: 'tRPC', color: '#398CCB', mono: 'TR', glyph: 'arrow', cat: 'framework' },

    // ─ рантаймы и инструменты ─
    node: { label: 'Node.js', color: '#5FA04E', mono: 'ND', glyph: 'hex', cat: 'tooling' },
    bun: { label: 'Bun', color: '#F3C98B', mono: 'BN', glyph: 'bolt', cat: 'tooling' },
    typescript: { label: 'TypeScript', color: '#3178C6', mono: 'TS', glyph: 'code', cat: 'tooling' },
    vite: { label: 'Vite', color: '#A259FF', mono: 'VT', glyph: 'bolt', cat: 'tooling' },
    webpack: { label: 'webpack', color: '#8DD6F9', mono: 'WP', glyph: 'box', cat: 'tooling' },
    esbuild: { label: 'esbuild', color: '#FFCF00', mono: 'EB', glyph: 'bolt', cat: 'tooling' },
    turbo: { label: 'Turborepo', color: '#EF4E7B', mono: 'TB', glyph: 'arrow', cat: 'tooling' },
    eslint: { label: 'ESLint', color: '#6A56E0', mono: 'EL', glyph: 'search', cat: 'tooling' },
    prettier: { label: 'Prettier', color: '#F7B93E', mono: 'PT', glyph: 'pen', cat: 'tooling' },
    vitest: { label: 'Vitest', color: '#FCC72B', mono: 'VI', glyph: 'flask', cat: 'tooling' },
    jest: { label: 'Jest', color: '#C63D14', mono: 'J', glyph: 'flask', cat: 'tooling' },
    playwright: { label: 'Playwright', color: '#2EAD33', mono: 'PW', glyph: 'window', cat: 'tooling' },
    cypress: { label: 'Cypress', color: '#69D3A7', mono: 'CY', glyph: 'flask', cat: 'tooling' },
    prisma: { label: 'Prisma', color: '#5A67D8', mono: 'PR', glyph: 'layers', cat: 'tooling' },
    drizzle: { label: 'Drizzle', color: '#C5F74F', mono: 'DZ', glyph: 'braces', cat: 'tooling' },
    typeorm: { label: 'TypeORM', color: '#FF4D4F', mono: 'TO', glyph: 'link', cat: 'tooling' },
    mongoose: { label: 'Mongoose', color: '#B33A3A', mono: 'MG', glyph: 'link', cat: 'tooling' },
    zod: { label: 'Zod', color: '#3E67B1', mono: 'Z', glyph: 'check', cat: 'tooling' },
    tailwind: { label: 'Tailwind CSS', color: '#38BDF8', mono: 'TL', glyph: 'pen', cat: 'tooling' },
    github: { label: 'GitHub', color: '#A2AAB5', mono: 'GH', glyph: 'git', cat: 'cloud' },
    gitlab: { label: 'GitLab', color: '#FC6D26', mono: 'GL', glyph: 'git', cat: 'cloud' },
    firecrawl: { label: 'Firecrawl', color: '#FF7A00', mono: 'FC', glyph: 'globe', cat: 'other' },
    mcp: { label: 'MCP', color: '#B08CE8', mono: 'MC', glyph: 'plug', cat: 'other' }
  }

  // ── Нормализация имён ─────────────────────────────────────────────────────
  // Один и тот же продукт приходит под разными именами: слаг узла (`svc:postgres`),
  // имя npm-пакета (`pg`, `@aws-sdk/client-s3`), человекочитаемая подпись
  // («PostgreSQL», «Google Cloud»). Всё сводим к одному ключу.

  // Скоуп npm (без '@') → ключ бренда. Проверяется, если полное «@scope/pkg» не нашлось.
  var SCOPES = {
    'aws-sdk': 'aws', 'aws-cdk': 'aws', 'aws-crypto': 'aws', 'smithy': 'aws',
    'google-cloud': 'google', 'azure': 'azure', 'vercel': 'vercel',
    'cloudflare': 'cloudflare', 'netlify': 'netlify', 'supabase': 'supabase',
    'firebase': 'firebase', 'clerk': 'clerk', 'auth0': 'auth0',
    'sentry': 'sentry', 'datadog': 'datadog', 'grafana': 'grafana', 'opentelemetry': 'opentelemetry',
    'fastify': 'fastify', 'nestjs': 'nestjs', 'angular': 'angular', 'vue': 'vue',
    'sveltejs': 'svelte', 'remix-run': 'remix', 'nuxt': 'nuxt', 'nuxtjs': 'nuxt',
    'langchain': 'langchain', 'anthropic-ai': 'anthropic', 'huggingface': 'huggingface',
    'ai-sdk': 'vercel-ai', 'modelcontextprotocol': 'mcp',
    'prisma': 'prisma', 'drizzle-team': 'drizzle', 'elastic': 'elasticsearch',
    'qdrant': 'qdrant', 'pinecone-database': 'pinecone', 'clickhouse': 'clickhouse',
    'upstash': 'redis', 'neondatabase': 'postgres', 'octokit': 'github', 'gitbeaker': 'gitlab',
    'livekit': 'livekit', 'slack': 'slack', 'twilio': 'twilio', 'sendgrid': 'sendgrid',
    'stripe': 'stripe', 'paddle': 'paddle', 'paypal': 'paypal', 'apple': 'apple',
    'playwright': 'playwright', 'typescript-eslint': 'eslint', 'vitejs': 'vite',
    'tailwindcss': 'tailwind', 'trpc': 'trpc', 'bull-board': 'bullmq', 'nats-io': 'nats',
    'mendable': 'firecrawl', 'nestjs-modules': 'nestjs', 'swc': 'typescript'
  }

  // Скоуп сам по себе не отвечает на вопрос: @google/generative-ai — это Gemini,
  // а @google-cloud/* — это GCP. Такие случаи разбираются по полному имени.
  var SCOPED_EXACT = {
    '@google/generative-ai': 'gemini',
    '@google/genai': 'gemini',
    '@google-ai/generativelanguage': 'gemini',
    '@aws-sdk/client-s3': 'aws',
    '@types/node': 'node',
    '@nestjs/typeorm': 'typeorm',
    '@prisma/client': 'prisma'
  }

  // Точные синонимы: имя пакета / подпись / слаг → ключ бренда.
  var ALIASES = {
    // postgres
    pg: 'postgres', postgresql: 'postgres', 'pg-promise': 'postgres', 'pg-pool': 'postgres',
    'node-pg-migrate': 'postgres', psql: 'postgres', neon: 'postgres', 'postgres-js': 'postgres',
    // mongo
    mongo: 'mongodb', 'mongodb-memory-server': 'mongodb', atlas: 'mongodb',
    // mysql / sqlite
    mysql2: 'mysql', mariadb: 'mysql', sqlite3: 'sqlite', 'better-sqlite3': 'sqlite', 'libsql': 'sqlite',
    // redis
    ioredis: 'redis', valkey: 'redis', 'connect-redis': 'redis',
    // поиск / вектора
    elastic: 'elasticsearch', opensearch: 'elasticsearch',
    // очереди
    kafkajs: 'kafka', 'node-rdkafka': 'kafka', amqplib: 'rabbitmq', amqp: 'rabbitmq',
    rabbit: 'rabbitmq', bull: 'bullmq', 'nats-io': 'nats',
    // облака
    'amazon-s3': 'aws', s3: 'aws', 'aws-sdk': 'aws', 'google-cloud': 'google',
    googleapis: 'google', 'gcloud': 'google', 'firebase-admin': 'firebase',
    'firebase-functions': 'firebase', wrangler: 'cloudflare', workers: 'cloudflare',
    'fly-io': 'fly', flyio: 'fly', 'digital-ocean': 'digitalocean', do: 'digitalocean',
    'render-com': 'render', k8s: 'kubernetes', kubectl: 'kubernetes', helm: 'kubernetes',
    'docker-compose': 'docker', dockerfile: 'docker', 'microsoft-azure': 'azure',
    // платежи
    'stripe-js': 'stripe', paddlejs: 'paddle', 'paypal-rest-sdk': 'paypal',
    // связь
    telegraf: 'telegram', grammy: 'telegram', 'node-telegram-bot-api': 'telegram',
    'telegram-bot': 'telegram', 'livekit-server-sdk': 'livekit', 'livekit-client': 'livekit',
    'slack-bolt': 'slack', mailer: 'nodemailer',
    // ai
    'openai-node': 'openai', 'openai-api': 'openai', claude: 'anthropic',
    'anthropic-ai': 'anthropic', 'claude-code': 'anthropic', 'langchainjs': 'langchain',
    'langgraph': 'langchain', 'hugging-face': 'huggingface', hf: 'huggingface',
    'google-generative-ai': 'gemini', 'generative-ai': 'gemini', 'gemini-api': 'gemini',
    'ai-sdk': 'vercel-ai', 'vercel-ai-sdk': 'vercel-ai', 'model-context-protocol': 'mcp',
    // auth
    jsonwebtoken: 'jwt', jose: 'jwt', 'jwt-decode': 'jwt', passport: 'jwt',
    'next-auth': 'auth0', authjs: 'auth0',
    // наблюдаемость
    'dd-trace': 'datadog', datadog: 'datadog', 'posthog-node': 'posthog', 'posthog-js': 'posthog',
    'prom-client': 'prometheus', 'pino-pretty': 'pino', 'pino-http': 'pino', otel: 'opentelemetry',
    // фреймворки
    nest: 'nestjs', 'nextjs': 'next', 'next-js': 'next', 'react-dom': 'react',
    'react-native': 'react', preact: 'react', 'vuejs': 'vue', 'svelte-kit': 'svelte',
    sveltekit: 'svelte', angularjs: 'angular', 'remix-run': 'remix', 'nuxtjs': 'nuxt',
    'express-js': 'express', expressjs: 'express', koa: 'express', hapi: 'express',
    // инструменты
    ts: 'typescript', tsx: 'typescript', 'ts-node': 'typescript', tsc: 'typescript',
    typescriptlang: 'typescript', turborepo: 'turbo', 'ts-jest': 'jest',
    'playwright-core': 'playwright', 'prisma-client': 'prisma', 'drizzle-orm': 'drizzle',
    'drizzle-kit': 'drizzle', 'tailwindcss': 'tailwind', 'postcss': 'tailwind',
    'nodejs': 'node', 'node-js': 'node', 'firecrawl-js': 'firecrawl',
    'github-actions': 'github', gh: 'github', git: 'github'
  }

  // Хвосты имён пакетов, которые ничего не говорят о бренде.
  var NOISE_SUFFIX = /-(js|jsx|ts|tsx|node|nodejs|client|server|sdk|core|api|admin|bot|cli|driver|adapter|plugin|loader|preset|config|types)$/

  function normalizeToken (value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function resolveToken (token) {
    if (!token) return null
    if (Object.prototype.hasOwnProperty.call(BRANDS, token)) return token
    if (Object.prototype.hasOwnProperty.call(ALIASES, token)) return ALIASES[token]
    var trimmed = token
    // «firecrawl-js» → «firecrawl», «openai-node-client» → «openai»
    for (var i = 0; i < 3 && NOISE_SUFFIX.test(trimmed); i++) {
      trimmed = trimmed.replace(NOISE_SUFFIX, '')
      if (Object.prototype.hasOwnProperty.call(BRANDS, trimmed)) return trimmed
      if (Object.prototype.hasOwnProperty.call(ALIASES, trimmed)) return ALIASES[trimmed]
    }
    return null
  }

  function brandKey (raw, depth) {
    if (typeof raw !== 'string') return null
    var name = raw.trim().toLowerCase()
    if (!name) return null
    depth = depth || 0
    if (depth > 3) return null

    // префиксы источников: узел графа svc:postgres, node:fs, npm:pg
    name = name.replace(/^(?:svc|node|npm|pkg|dep|module):/, '').trim()
    if (!name) return null

    // версия: pg@8.11.0, @sentry/node@7.0.0, next@latest
    var at = name.indexOf('@', 1)
    if (at > 0) name = name.slice(0, at)
    // диапазоны semver, приклеенные без '@': pg^8, next >=14 (пробел внутри подписи
    // «Google Cloud» при этом обязан выжить — режем только перед номером версии)
    name = name.replace(/\s*[\^~]\s*\d[\w.\-+*]*$/, '').replace(/\s*[><=]+\s*\d[\w.\-+*]*$/, '').trim()
    if (!name) return null

    if (name.charAt(0) === '@') {
      var slash = name.indexOf('/')
      var scope = slash === -1 ? name.slice(1) : name.slice(1, slash)
      var rest = slash === -1 ? '' : name.slice(slash + 1)
      var head = rest.split('/')[0]
      var full = head ? '@' + scope + '/' + head : '@' + scope
      if (Object.prototype.hasOwnProperty.call(SCOPED_EXACT, full)) return SCOPED_EXACT[full]
      if (Object.prototype.hasOwnProperty.call(ALIASES, full)) return ALIASES[full]
      // @types/pg, @tsconfig/node20 — смотрим внутрь
      if (scope === 'types' || scope === 'tsconfig') return head ? brandKey(head, depth + 1) : null
      if (Object.prototype.hasOwnProperty.call(SCOPES, scope)) return SCOPES[scope]
      var fromScope = resolveToken(normalizeToken(scope))
      if (fromScope) return fromScope
      return head ? resolveToken(normalizeToken(head)) : null
    }

    // подпакет: next/router, firebase/app, aws-sdk/clients/s3
    var headPlain = name.split('/')[0]
    var direct = resolveToken(normalizeToken(headPlain))
    if (direct) return direct
    // подпись целиком: «Google Cloud», «Amazon S3», «Next.js»
    return resolveToken(normalizeToken(name))
  }

  function brandFor (raw) {
    var key = brandKey(raw)
    if (!key) return null
    var brand = BRANDS[key]
    return {
      key: key,
      label: brand.label,
      color: brand.color,
      mono: brand.mono,
      glyph: brand.glyph,
      cat: brand.cat,
      path: GLYPHS[brand.glyph] || ''
    }
  }

  function brandSvg (raw, size) {
    var brand = brandFor(raw)
    if (!brand) return ''
    var px = Number(size) > 0 ? Number(size) : 20
    return '<svg viewBox="0 0 24 24" width="' + px + '" height="' + px + '" fill="none" ' +
      'stroke="' + brand.color + '" stroke-width="1.6" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true"><path d="' + brand.path + '"/></svg>'
  }

  global.ARCHMAP_GLYPHS = GLYPHS
  global.ARCHMAP_BRANDS = BRANDS
  global.ARCHMAP_BRAND_KEY = function (name) { return brandKey(name, 0) }
  global.ARCHMAP_BRAND = brandFor
  global.ARCHMAP_BRAND_SVG = brandSvg
})(typeof window !== 'undefined' ? window : globalThis)
