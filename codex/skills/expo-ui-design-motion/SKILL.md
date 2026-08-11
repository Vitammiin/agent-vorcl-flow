---
name: expo-ui-design-motion
description: Обязательные production-правила Design System, Motion System и Interaction System для React Native + Expo. Используй ВСЕГДА при создании или изменении Expo/React Native экранов, UI-компонентов, навигационных переходов, sheets/modals, gestures, animations, haptics, изображений, skeleton/loading/empty states, charts, optimistic UI, accessibility/reduced motion и theme/design tokens.
---

# Expo UI Design, Motion & Interaction

Этот skill отвечает на вопрос **как экран выглядит, двигается и ощущается**. За размещение кода, modules, state и data flow отвечает `expo-mobile-architecture`; применяй оба skill при работе над Expo UI.

## Перед изменением UI

1. Определи пользовательское действие, visual hierarchy и ожидаемый feedback.
2. Полностью выполни online compatibility protocol из `expo-mobile-architecture/references/version-compatibility.md`: versioned Expo docs, upstream matrix/releases, npm peers/engines и live preflight. Alpha/unstable API не делай единственным production path.
3. Выбери семантику перехода: deeper hierarchy, temporary task, same-level state или object-to-detail.
4. Найди существующие design, motion и interaction primitives. Не создавай локальный dialect внутри feature.
5. Спроектируй normal и reduced-motion behaviour до реализации.

## Обязательная философия

- Native first: обычные screen push/pop отдай native stack.
- Motion показывает causality, hierarchy, state change, spatial continuity, feedback или направляет внимание. Иначе не анимируй.
- Spring first для interruptible physical feedback; duration-based motion оставляй для fade/crossfade и контролируемых состояний.
- Gesture follows finger: интерактивный объект следует translation/velocity жеста на UI thread.
- Один тип действия получает один тип перехода во всём приложении.
- Design tokens и motion tokens вместо случайных значений.
- Haptic подтверждает значимое действие, но не каждый tap/scroll.
- Optimistic UI даёт немедленный feedback там, где rollback безопасен.
- Reduced Motion является отдельным обязательным режимом.
- Стабильные 60/120 FPS важнее декоративного эффекта.
- Glass — материал navigation/control surfaces, не универсальный фон.
- Хороший интерфейс скорее недоанимирован, чем переанимирован.

## Spatial navigation

Используй единый словарь:

| Отношение | Переход |
|---|---|
| deeper hierarchy | native default push/pop |
| same-level state | короткий fade/crossfade |
| temporary contextual task | modal или native `formSheet` |
| create/edit flow | sheet для короткой формы; screen для длинного flow |
| object → detail | zoom/shared transition только как progressive enhancement |

Не делай собственный `translateX` для каждого route. Zoom transitions, Native Tabs и platform glass проверяй online по текущему SDK/runtime и всегда предоставляй устойчивый fallback.

## Token boundaries

Базовый контракт:

```text
src/shared/theme/
├── colors.ts
├── typography.ts
├── spacing.ts
├── radius.ts
├── shadows.ts
├── motion.ts
├── opacity.ts
└── index.ts
```

В `motion.ts` держи именованные duration и spring presets. Начальная шкала, которую затем калибруют под бренд:

```text
100–160 ms  tap/icon/checkbox
160–240 ms  button/card/state
240–360 ms  modal/content
300–450 ms  major spatial transition
```

Это product defaults, не норматив Apple/Google. Запрещены случайные duration, bezier, colors, spacing, radius, opacity и typography внутри feature без объяснимой причины.

## Interaction rules

- Interactive controls получают subtle press state: обычно небольшой scale/opacity/background shift с быстрым settle.
- Для gestures используй Gesture Handler + Reanimated и учитывай velocity/cancel/threshold.
- Layout insert/delete/reorder анимируй entering/exiting/layout transitions, если это помогает сохранить continuity.
- Balance, score и charts можно анимировать быстро и interruptibly; данные и accessibility label должны сразу отражать итоговое значение.
- Haptics централизуй за semantic API: `selection`, `success`, `warning`, `error`. Синхронизируй с визуальным outcome, не с началом сетевого ожидания.
- Images показывай через placeholder (BlurHash/ThumbHash), cache policy и короткий transition; задавай корректный размер.
- Data screens имеют skeleton, content, empty, error и refreshing. Spinner оставляй для короткой blocking/local операции.
- Empty state объясняет состояние и предлагает следующий релевантный action.
- Progressive disclosure прячет вторичные actions в contextual menu/sheet, сохраняя primary action видимым.

## Reduced Motion

Централизуй policy и системную настройку. При reduced motion:

- убирай bounce, parallax, repetitive/automatic motion и большие zoom/scale;
- заменяй spatial transform коротким fade или instant state change;
- сохраняй causality, focus, completion feedback и доступность content;
- не отключай animation хаотично по отдельным компонентам.

## Performance gate

- Переноси gesture/animation work на UI thread; не запускай React state update на каждый frame.
- Не анимируй layout-heavy properties без профилирования.
- Проверяй low-end Android и реальное устройство, release build, long lists и concurrent gestures.
- Удали или упрости эффект при dropped frames, input lag, memory churn или нарушении accessibility.
- Не добавляй `useMemo`, `useCallback`, worklets и third-party animation library без измеримой причины.

## Capability policy

Подробные patterns, API/fallback matrix и checklist находятся в [references/design-motion-guide.md](references/design-motion-guide.md). Открывай reference при проектировании navigation, sheets, glass, gestures, image loading, charts или системной accessibility.

## Проверка

Запусти:

```bash
node skills/expo-ui-design-motion/scripts/guard.mjs --root <expo-project>
```

Guard проверяет только детерминированные high-signal нарушения. Он не заменяет visual review, accessibility testing, профилирование на устройстве и проверку reduced motion.

## Definition of Done

- spatial transition соответствует отношению экранов;
- design/motion values идут через tokens;
- press/gesture feedback interruptible и умеренный;
- haptic semantic, редкий и синхронный outcome;
- loading/empty/error/refreshing и image placeholder предусмотрены;
- optimistic update имеет rollback/error path;
- experimental/platform API имеет feature gate и fallback;
- reduced motion проверен;
- screen reader/focus/touch target/contrast не ухудшены;
- release-профиль не показывает заметных frame drops;
- `guard.mjs`, typecheck, lint и релевантные tests зелёные.
