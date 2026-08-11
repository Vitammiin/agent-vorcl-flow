# Expo UI Design & Motion Guide

## Source-of-truth policy

Feature availability меняется между Expo SDK и платформами. Перед реализацией сверяй installed versions с официальными страницами:

- Expo Router Stack и Modals: `docs.expo.dev/router/advanced/stack/`, `docs.expo.dev/router/advanced/modals/`
- Expo Router Native Tabs: `docs.expo.dev/router/advanced/native-tabs/`
- Expo Glass Effect, Haptics, Image: `docs.expo.dev/versions/latest/sdk/{glass-effect,haptics,image}/`
- Reanimated spring/layout/accessibility/performance: `docs.swmansion.com/react-native-reanimated/`
- Gesture Handler composition: `docs.swmansion.com/react-native-gesture-handler/`
- Apple HIG Motion/Accessibility/Materials и Material motion guidance

На момент проверки 2026-08-11 официальные Expo docs подтверждают native stack animation options, `formSheet` с configurable detents, Native Tabs как alpha через `expo-router/unstable-native-tabs`, Expo Image placeholders/transitions и Expo Haptics semantic APIs. Не переносить этот snapshot в код как вечную истину: повторно проверить на установленном SDK.

## Capability and fallback matrix

| Capability | Preferred path | Required fallback |
|---|---|---|
| Regular navigation | Expo Router native Stack default push/pop | stable native Stack without custom transition |
| Fast same-level change | native fade/crossfade | instant state change under reduced motion |
| Contextual task | `presentation: 'formSheet'` + supported detents | modal/full screen route where sheet behaviour is unavailable |
| Object → detail | official zoom/shared API when supported | native push; never block navigation on shared transition |
| Tabs | stable tabs path selected for installed SDK | keep alpha Native Tabs behind explicit product/platform gate |
| Liquid Glass | native `GlassView` only when runtime supports it | opaque/translucent tokenized `View` preserving contrast and layout |
| Image loading | Expo Image placeholder + cache + transition | tokenized surface/skeleton with no layout shift |
| Haptics | semantic `selection/success/warning/error` adapter | silent visual feedback; haptics may be unavailable/disabled |
| Gesture animation | Gesture Handler + Reanimated UI thread | accessible buttons/actions for equivalent operation |

Never infer runtime availability solely from OS version strings when the library exposes a supported capability check.

## Design System

### Color

Use one brand accent, a neutral surface ladder and semantic status colors. Components consume semantic aliases such as `background`, `surface`, `surfaceElevated`, `textPrimary`, `textSecondary`, `success`, `warning`, `error`; they do not own brand hex values.

Contrast and platform accessibility settings outrank glass, blur, tint and decorative gradients.

### Spacing, shape and depth

Start with a compact scale such as `4, 8, 12, 16, 24, 32, 48, 64`; target roughly 90% token usage, not punitive prohibition of all exceptional values. Establish hierarchy first through spacing, surface levels, typography and grouping. Add borders only when they clarify a boundary.

Radius, shadows and opacity are named by semantic role. Avoid nested cards, indiscriminate shadows and glass-inside-glass.

### Typography

Define visibly distinct roles: display, title, headline, body, label and caption. The main metric or action dominates; labels and metadata recede without falling below readable contrast/size. Respect Dynamic Type/font scaling and prevent critical controls from clipping.

## Motion System

### Vocabulary

Keep a small reusable vocabulary:

- press: subtle compression + spring settle;
- success: state/check completion + optional success haptic;
- delete: collapse + fade after confirmed/optimistic state change;
- insert: fade + short spatial offset;
- sheet: native presentation or interruptible vertical spring;
- detail: native push, optionally enhanced by zoom;
- number: short count toward final value;
- loading: layout-shaped skeleton.

Animation must answer at least one question: what caused this, where did it come from, what changed, what is important, or did the action complete?

### Springs and timings

Use named spring presets (`snappy`, `smooth`, `expressive`) that specify one consistent Reanimated spring parameter model. Avoid mixing incompatible physics/duration spring configurations. Ensure interruptibility and sensible velocity continuation.

Use named duration tokens for fade/crossfade and small non-physical state transitions. Never sleep or delay business logic merely to let animation finish.

### Press feedback

Scale is normally around `0.98`, never a theatrical transformation by default. Combine at most a subtle scale, opacity or surface change. Disabled, loading, hover/focus (where applicable) and pressed states must remain distinguishable.

### Layout and data motion

Entering/exiting/layout animation maintains list continuity. Stable keys are mandatory. Animate only visible deltas and avoid stagger that delays access to content.

For numbers/charts, expose final accessible text immediately, cancel obsolete animations, handle rapid data changes and skip/reduce drawing motion under Reduced Motion. Chart selection follows the finger and may emit sparse selection haptics only at meaningful point changes.

## Interaction System

### Sheets and progressive disclosure

Use sheets for filters, pickers, sorting, short contextual forms/actions and confirmation. Keep multi-step, deep-linkable or recovery-heavy flows as routes. Detents must not hide submit/error content behind keyboard or safe area.

Show the primary action inline and secondary/destructive actions behind a labelled menu or sheet. Destructive actions require clear wording, appropriate confirmation and undo where suitable.

### Gestures

An object follows the finger before release. Model activation threshold, simultaneous/exclusive composition, bounds, cancel, velocity and settle. Preserve a non-gesture accessible path. Do not steal native back, scroll or system gestures.

### Haptics

Central semantic adapter owns platform calls and capability/error handling. Suggested mapping:

- selection: picker/toggle or meaningful tab/state selection;
- success: completed save/payment/action;
- warning: destructive confirmation or consequential boundary;
- error: rejected action.

Avoid haptics for routine navigation, every button, every scroll tick or speculative network start.

### Optimistic UI

Use for reversible low-risk actions such as favorite, archive, toggle, reorder or simple delete. Define snapshot, optimistic cache update, server reconciliation, rollback and visible error. Payments and irreversible operations require domain-specific guarantees; perceived speed never overrides correctness.

## Loading, empty states and images

Skeleton geometry should resemble final content and avoid indefinite shimmer/repetitive motion. A button-level spinner is appropriate for a short blocking submit. Empty state explains what is absent and gives one relevant next action.

Expo Image should reserve dimensions, use BlurHash/ThumbHash or a local placeholder where appropriate, choose cache policy deliberately and crossfade briefly without hiding content. Avoid original-resolution downloads when the display size is small.

## Glass and native materials

Use glass for floating navigation/control surfaces such as a tab bar, toolbar, media controls or contextual overlay. Gate it by official runtime support. The fallback must preserve size, hit area, contrast, hierarchy and behaviour. Do not nest glass and do not use it as a substitute for spacing or surface hierarchy.

## Accessibility and Reduced Motion

Central policy consumes the system preference (for example through supported Reanimated accessibility APIs) and lets primitives choose normal/reduced variants. Reduced mode removes large spatial movement, bounce, parallax, repetitive shimmer and automatic loops; use short fade or instant updates.

Also validate screen reader labels/state, focus after route/modal transitions, minimum touch targets, contrast, Dynamic Type, keyboard navigation where relevant and accessible alternatives to gesture-only actions.

## Performance review

Profile release builds on representative low-end Android and modern high-refresh iOS hardware. Inspect JS/UI frame rate, input latency, long list scrolling, image memory, rerenders and concurrent gestures. Avoid frame-by-frame JS state, large animated layout trees and effects that compete with scroll. Prefer simpler motion when a device cannot sustain its refresh target.

## Screen review checklist

1. Is the primary information/action visually obvious?
2. Do colors, spacing, radius, typography, opacity and motion use shared tokens?
3. Does navigation express the spatial relationship?
4. Does every animation have a named purpose and cancellation path?
5. Does the gesture track the finger and coexist with native gestures?
6. Are haptics semantic and sparse?
7. Are skeleton/content/empty/error/refreshing represented?
8. Is optimistic UI safe, reconciled and reversible?
9. Do experimental/native capabilities have tested fallbacks?
10. Does Reduced Motion remain coherent?
11. Are accessibility and Dynamic Type intact?
12. Does release performance sustain the device target?
