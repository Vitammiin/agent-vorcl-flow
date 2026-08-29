---
name: react-native-liquid-glass
description: "Выбирает и безопасно интегрирует Liquid Glass в React Native/Expo: сравнивает @callstack/liquid-glass, expo-glass-effect и обычный View fallback, проверяет SDK/RN/Xcode/runtime, accessibility и native build. Use только для iOS glass surfaces или их cross-platform fallback; не применять как общий visual style."
---

# React Native Liquid Glass

Liquid Glass — platform capability для navigation/control surfaces, а не универсальный фон. Сначала докажи, что материал помогает hierarchy/interaction и сохраняет contrast; иначе используй обычный surface.

## Provider decision

1. Прочитай `package.json`, Expo config, lockfile, native folders и runtime/build policy. Определи Expo SDK, React Native, CNG/bare, Xcode, iOS target, Expo Go/dev build и уже установленный provider.
2. Выполни live compatibility protocol из `$expo-mobile-architecture`; версии из этого skill — не источник истины.
3. Сохраняй существующий совместимый provider, если нет доказанной причины миграции.
4. Для Expo-проекта сначала оцени version-matched `expo-glass-effect`; для bare RN или явно выбранного Callstack оцени `@callstack/liquid-glass`.
5. Если native toolchain/runtime/accessibility не поддерживает glass, выбери обычный tokenized `View` surface. Android и старый iOS всегда имеют полноценный fallback.

| Сигнал | Предпочтение |
| --- | --- |
| Compatible Expo SDK, нужен Expo-supported path | `expo-glass-effect` |
| Bare RN или Callstack уже принят и совместим | `@callstack/liquid-glass` |
| Expo Go обязателен | только provider, реально включённый в текущий Expo Go; Callstack не подходит |
| Нет iOS 26/toolchain support или нужен одинаковый Android UI | обычный `View`/blur fallback |

## Provider-specific guidance

- Для Callstack прочитай [references/callstack.md](references/callstack.md).
- Для Expo прочитай [references/expo.md](references/expo.md).
- Не смешивай API names и support checks двух providers.

## Shared constraints

- Feature detection выполняй API выбранного provider, не только `Platform.OS` или версией iOS.
- Учитывай `AccessibilityInfo.isReduceTransparencyEnabled()` и сохраняй readable opaque fallback.
- Glass должен иметь meaningful content/background relationship, predictable contrast и bounded rendering area.
- Native dependency/config change требует новой development/release build и совместимого EAS `runtimeVersion`; OTA update не доставляет native module.
- Проверяй normal/dark scheme, reduce transparency, reduced motion, unsupported iOS, Android, device rotation и release performance.
- Не устанавливай package и не меняй native config без scope/authorization текущей задачи.

## Definition of Done

- provider выбран по workspace evidence и live compatibility sources;
- support detection и accessibility gate покрыты тестами;
- fallback сохраняет content, actions, contrast и layout на всех unsupported paths;
- native build выполнена там, где provider добавляет native code;
- эффект ограничен подходящими surfaces и не ухудшает input latency/FPS;
- в handoff указаны provider/version sources, build type, tested devices и известные ограничения.
