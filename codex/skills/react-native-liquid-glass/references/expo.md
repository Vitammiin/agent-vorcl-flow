# Expo provider

Official source: [Expo GlassEffect](https://docs.expo.dev/versions/latest/sdk/glass-effect/). Всегда открывай документацию именно установленной Expo SDK, а не только `latest`.

## Compatibility and API

- Устанавливай version-matched package через `npx expo install expo-glass-effect` только в authorised implementation task.
- `GlassView` и `GlassContainer` — provider components.
- Проверяй одновременно `isLiquidGlassAvailable()` и `isGlassEffectAPIAvailable()` согласно versioned docs; второй gate защищает runtime combinations без API.
- Учитывай `AccessibilityInfo.isReduceTransparencyEnabled()` отдельно: component availability не означает, что пользователь разрешил прозрачный материал.
- Используй `glassEffectStyle`, `isInteractive`, `tintColor` и `colorScheme` только по types установленной версии.

## Known rendering constraint

Versioned Expo docs предупреждают, что `opacity: 0` на `GlassView` или его parent может отключить rendering glass. Для transitions используй documented `glassEffectStyle` animation или текущий documented wrapper workaround; перед переносом рецепта снова проверь docs/issues выбранной SDK.

## Tests

- compiler/component availability и runtime API availability;
- reduce transparency и ordinary View fallback;
- iOS 26 supported/unsupported runtime, Android fallback;
- animation path без opacity regression;
- Expo Go только если package реально включён в версию Expo Go; production evidence — development/release build.
