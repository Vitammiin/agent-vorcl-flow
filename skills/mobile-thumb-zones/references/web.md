# Mobile web thumb-zone guidance

## Standards and targets

- WCAG 2.2 SC 2.5.8 (AA) требует target не меньше 24×24 CSS px либо выполнения одного из его исключений, включая spacing exception. Не называй 48×48 CSS px нормативным минимумом WCAG.
- WCAG SC 2.5.5 (AAA) задаёт enhanced target 44×44 CSS px с исключениями.
- Для frequent/high-impact mobile controls разумный product baseline — 44×44 CSS px или больше, но помечай его как design target, а не универсальное AA-требование.
- Проверяй фактический clickable box через layout/devtools, а не размер icon glyph.

Sources: [WCAG 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html), [WCAG 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced), [W3C CSS technique C42](https://www.w3.org/WAI/WCAG22/Techniques/css/C42).

## Layout and navigation

- Используй `env(safe-area-inset-bottom)` для fixed/sticky bottom surfaces и оставляй content padding равным реальной высоте surface плюс inset.
- Primary CTA размещай в естественной нижней/средней зоне только если это не нарушает reading/order semantics.
- Persistent bottom navigation рассматривай для 3–5 стабильных primary destinations. Более сложную IA сначала спроектируй, а не запихивай в шестую вкладку.
- Проверяй 320 CSS px, zoom/reflow, landscape, browser chrome и virtual keyboard; горизонтальный scroll допустим только для явно горизонтального компонента.

## Forms

- На узких экранах предпочитай full-width single-column fields.
- Используй корректные `type`, `inputMode`, `autoComplete`, `enterKeyHint`, labels и error association.
- Не фиксируй CTA под keyboard без scroll/focus strategy; активное поле и ошибка должны оставаться видимыми.
- Минимальный font size не подменяет проверку zoom, reflow и user settings.

## Audit evidence

Для каждой проблемы запиши selector/component, viewport, измеренный hit box/spacing, state и воспроизводимый сценарий. Исходная статья — [SocialScript thumb zones](https://www.socialscript.in/blog/designing-for-thumb-zones-mobile-ux-patterns-that-convert) — используется как источник паттернов, но не как норматив WCAG или доказательство conversion uplift.
