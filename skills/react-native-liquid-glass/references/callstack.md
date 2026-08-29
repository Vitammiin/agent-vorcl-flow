# Callstack provider

Official source: [callstack/liquid-glass](https://github.com/callstack/liquid-glass).

## Compatibility preflight

На дату каждого применения проверь README, latest release/tag, npm metadata, peer dependencies и issues. Не фиксируй в реализации observed values из skill. README на момент подготовки требовал iOS 26, Xcode 26+ и React Native 0.80+ и явно не поддерживал Expo Go; эти условия могут измениться.

Для Expo custom native module означает development/release build. Проверь autolinking, pods, new architecture requirements и фактическую сборку target app.

## API boundary

- `LiquidGlassView` — отдельная glass surface.
- `LiquidGlassContainerView` — объединение близких glass elements через `spacing`.
- `isLiquidGlassSupported` — provider-specific capability boolean.
- Основные props на момент источника: `interactive`, `effect`, `animated`, `animationDuration`, `tintColor`, `colorScheme`.

Импортируй реальные types установленной версии и не воспроизводи этот список как собственную wrapper type. На unsupported iOS provider может отрисовать обычный `View`; всё равно предоставь явный tokenized fallback для readable appearance и Android parity.

## Tests

- capability true/false branches;
- reduce transparency on/off;
- clear/regular/none и theme changes;
- container spacing/merging только там, где это нужно дизайну;
- unsupported iOS и Android сохраняют actions/layout;
- development/release device build, не Expo Go screenshot.
