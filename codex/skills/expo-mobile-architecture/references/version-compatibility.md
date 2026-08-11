# Expo / React Native compatibility playbook

Проверено по первичным источникам **2026-08-11**. Snapshot помогает распознать известные ошибки, но не заменяет online-проверку: Expo patch releases, npm dist-tags, peer ranges, alpha API и known issues меняются быстрее этого файла.

## Неподвижное правило агента

Перед созданием проекта, установкой/обновлением/удалением dependency, SDK upgrade, изменением native config/plugin, Expo Router/navigation, animation/gesture stack, tests или EAS Update:

1. Прочитай фактические `package.json`, lockfile, app config, Babel/Metro config, native folders и CI/EAS Node version.
2. Открой **versioned Expo docs именно для SDK проекта**, current SDK release notes и official compatibility/migration page изменяемой библиотеки.
3. Проверь npm metadata (`version`, `peerDependencies`, `engines`) и дату публикации; `latest` не означает «совместимо с Expo SDK».
4. Запусти read-only preflight:

   ```bash
   node <skill-root>/scripts/compatibility-preflight.mjs --root .
   ```

   Он обязательно выполняет `npx expo install --check` и `npx expo-doctor@latest`. `--offline` разрешён для fixture/аварийной диагностики, но его результат не является доказательством совместимости.
5. Только после review установи package через `npx expo install <package>`. Не используй `npm install <package>@latest` для RN/native/Expo-integrated libraries.
6. После изменения повтори preflight, typecheck, lint, tests и native build на затронутых платформах. Dependency mutation и `expo prebuild --clean` не выполняй скрытно.

Минимальная запись evidence в отчёте: дата, Expo SDK/RN/React/Node, package manager+lockfile, проверенные official URLs, requested/resolved package versions, peer/engine constraints, команды и exit codes, CNG/bare, Expo Go/dev build, iOS/Android targets.

## Текущая официальная core matrix

Источник: [Expo SDK reference](https://docs.expo.dev/versions/latest/).

| Expo SDK | React Native | React | Minimum Node | Важное |
| --- | --- | --- | --- | --- |
| 57 | 0.86 | 19.2.3 | 22.13.x | Android 7+, compile/target 36; iOS 16.4+, Xcode 26.4+ |
| 56 | 0.85 | 19.2.3 | 20.19.x | Не путать с SDK 57 |
| 55 | 0.83 | 19.2.0 | 20.19.x | New Architecture обязательна |
| 54 | 0.81 | 19.1.0 | 20.19.x | Последний SDK, где legacy architecture ещё можно отключать |

**Нельзя:** «проект свежий, поэтому поставлю последний React Native/React/Node-пакет независимо».
**Правильно:** Expo SDK определяет совместимую RN/React line; точные patch versions разрешает `npx expo install --check` в момент работы.

SDK 57 release notes: [Expo SDK 57](https://expo.dev/changelog/sdk-57). Upgrade делается по одному SDK за шаг: [upgrade walkthrough](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/).

### SDK 57 package snapshot: Expo recommendation vs registry latest

Это намеренно датированный пример того, почему нельзя ставить latest вслепую:

| Package | Expo SDK 57 versioned docs | npm latest на 2026-08-11 | Вывод |
| --- | --- | --- | --- |
| `expo-router` | 57.x (patch выбирает Expo CLI) | 57.0.12 | Major одинаков, patch всё равно live-check |
| `react-native-reanimated` | 4.5.1 | 4.5.3 | Не заменять Expo pair без проверки Worklets |
| `react-native-worklets` | 0.10 line | 0.11.3 | 0.11 допустим не для каждой Reanimated line |
| `react-native-gesture-handler` | ~2.32.0 | 3.1.0 | Latest major не является SDK 57 default |
| `react-native-screens` | ~4.26.0 | 4.27.0 | Expo patch/minor first |
| `@shopify/flash-list` | 2.0.2 | 2.3.2 | Expo-рекомендация может отставать от registry |
| `react-native-safe-area-context` | ~5.7.0 | проверять live | Версию выбирает Expo CLI |
| `react-native-svg` | 15.15.4 | проверять live | Версию выбирает Expo CLI |

Versioned sources: [Router](https://docs.expo.dev/versions/v57.0.0/sdk/router/), [Reanimated](https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/), [Gesture Handler](https://docs.expo.dev/versions/v57.0.0/sdk/gesture-handler/), [Screens](https://docs.expo.dev/versions/v57.0.0/sdk/screens/), [FlashList](https://docs.expo.dev/versions/v57.0.0/sdk/flash-list/), [Safe Area](https://docs.expo.dev/versions/v57.0.0/sdk/safe-area-context/), [SVG](https://docs.expo.dev/versions/v57.0.0/sdk/svg/).

Во время перехода SDK команда `create-expo-app@latest` без явного template может временно создавать предыдущий SDK. На 2026-08-11 Expo docs показывают `--template default@sdk-57`; перед scaffold обязательно открыть [current create-expo-app docs](https://docs.expo.dev/more/create-expo/) и явно зафиксировать нужный template, не превращая этот временный suffix в вечное правило.

## Exact pitfalls: нельзя / правильно

### Install и документация

**Нельзя:** копировать setup с unversioned/latest документации библиотеки и ставить `@latest`. Например, latest Gesture Handler docs уже относятся к 3.x, а Expo SDK 57 рекомендует 2.32.
**Правильно:** сначала Expo versioned page (`/versions/v57.0.0/...`), затем upstream compatibility table для выбранной line, затем `npx expo install`.

**Нельзя:** считать версию в старом ответе/PR/skill вечной.
**Правильно:** live-check каждый раз; snapshot используется только как detector против заведомо плохих пар.

**Нельзя:** скрывать warning через `expo.install.exclude` без объяснения.
**Правильно:** для каждого exclude записать owner, причину, проверенные peer/native constraints, тестовые платформы и дату пересмотра. Expo исключает такие пакеты из checks `expo install`, Doctor и start.

Official sources: [Using libraries](https://docs.expo.dev/workflow/using-libraries/), [Expo CLI dependency validation](https://docs.expo.dev/more/expo-cli/), [package.json config](https://docs.expo.dev/versions/latest/config/package-json/).

### New Architecture

**Нельзя:** пытаться «починить» SDK 55+ через `newArchEnabled:false`; setting игнорируется.
**Правильно:** удалить ложный flag и обновить/заменить library. SDK 54 — последняя переходная версия.

**Нельзя:** использовать Reanimated 4 на Legacy Architecture.
**Правильно:** Reanimated 4 только на New Architecture; compatibility проверять сразу по RN и Worklets.

Источник: [Expo New Architecture](https://docs.expo.dev/guides/new-architecture/).

### Reanimated + Worklets + Gesture Handler

Для SDK 57 Expo рекомендует Reanimated 4.5.1, Worklets 0.10 и Gesture Handler ~2.32.0; patch может дрейфовать, поэтому source of truth — `expo install --check`.

| Reanimated | Допустимый Worklets |
| --- | --- |
| 4.3 | 0.8 |
| 4.4 | 0.9 или 0.10 |
| 4.5 | 0.10 или 0.11 |

RN 0.86 поддерживается Reanimated 4.4/4.5/4.6, но не 4.3.

**Нельзя:** Reanimated 4 без `react-native-worklets`.
**Правильно:** `npx expo install react-native-reanimated react-native-worklets`.

**Нельзя:** Reanimated 3 вместе с установленным Worklets.
**Правильно:** либо Reanimated 3 без Worklets, либо согласованная migration на 4.

**Нельзя:** одновременно добавлять `react-native-reanimated/plugin` и `react-native-worklets/plugin`.
**Правильно:** в Expo `babel-preset-expo` конфигурирует plugin автоматически. При нестандартном bare setup следуй upstream migration: для Reanimated 4 manual plugin называется `react-native-worklets/plugin`.

**Нельзя:** ставить `@gorhom/bottom-sheet` старее 5.1.8 с Reanimated 4.
**Правильно:** version ≥5.1.8 и отдельная проверка текущих peers/releases.

SDK 56/57 known regression: импорт Reanimated с Hermes V1 может увеличить memory примерно на 25–30%; официальный временный workaround — Worklets bundle mode. Не включай workaround бессрочно: перепроверь release notes/issue перед применением.

Источники: [Expo SDK 57 Reanimated](https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/), [Reanimated compatibility](https://docs.swmansion.com/react-native-reanimated/docs/guides/compatibility/), [migration from 3.x](https://docs.swmansion.com/react-native-reanimated/docs/guides/migration-from-3.x/), [Gesture Handler SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/gesture-handler/).

### Expo Router / React Navigation

**Нельзя:** в SDK 56+ импортировать app code напрямую из внешних `@react-navigation/*` entry points.
**Правильно:** использовать соответствующие Expo Router entry points и официальный migration/codemod.

**Нельзя:** считать Native Tabs, Experimental Stack, zoom/shared transition стабильной основой критического flow.
**Правильно:** проверить актуальный release status; alpha/experimental включать как progressive enhancement с stable fallback и platform gate.

**Нельзя:** вручную связывать major Router 56 с SDK 57.
**Правильно:** `npx expo install expo-router`; Router major соответствует SDK, patch выбирает Expo.

Источник: [Expo Router SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/router/).

### Expo Go и native build

**Нельзя:** считать «работает в Expo Go» production compatibility test. Expo Go содержит фиксированный набор native code и предназначен как playground.
**Правильно:** production app проверять в development build с реальными native libraries/config.

**Нельзя:** после установки/update native package, изменения app config или SDK продолжать старый dev client.
**Правильно:** regenerate/rebuild. Для CNG официальный flow — `npx expo prebuild --clean`, затем `npx expo run:ios|android` либо EAS build. `--clean` пересоздаёт native folders, поэтому сначала review/commit пользовательских native изменений.

**Нельзя:** выполнять destructive prebuild как «безопасный check».
**Правильно:** preflight read-only; mutation/prebuild — отдельный осознанный шаг с сохранённым diff.

Источники: [Using libraries](https://docs.expo.dev/workflow/using-libraries/), [Development builds](https://docs.expo.dev/develop/development-builds/introduction/).

### EAS Update / native runtime

**Нельзя:** отправлять OTA update с новым/изменённым native module в старый runtime. JS bundle не добавит отсутствующий native code.
**Правильно:** native change → новый binary/dev build и новый compatible `runtimeVersion`.

**Нельзя:** вручную держать один вечный runtime string.
**Правильно:** для большинства проектов использовать `runtimeVersion: { "policy": "fingerprint" }`: fingerprint меняется при SDK/custom native code изменениях. Если выбран `appVersion`/`nativeVersion`, явно управлять версиями для каждого build/channel/platform.

Источник: [Expo Updates runtime version](https://docs.expo.dev/versions/latest/sdk/updates/).

### Monorepo и duplicates

**Нельзя:** две версии React Native в monorepo, две React в app или duplicate Turbo/Expo/native modules. Native build может скомпилировать только одну версию native module.
**Правильно:** `npm why <package>` / `pnpm why` / `yarn why`, затем align workspace constraints и только при необходимости documented `overrides` (npm) / `resolutions` (Yarn).

**Нельзя:** добавлять resolution, не проверив, что forced version удовлетворяет всем peers/native APIs.
**Правильно:** resolution — последний контролируемый workaround с tests на обеих платформах.

SDK 54+ поддерживает isolated installs, но отдельные RN packages могут ломаться. При доказанной pnpm-проблеме допустим `nodeLinker: hoisted`; это workaround, а не default ritual. SDK 55+ автоматически выравнивает Metro/native autolinking resolution в monorepo.

Источник: [Expo monorepos](https://docs.expo.dev/guides/monorepos/).

### Tests

**Нельзя:** `react-test-renderer` в React 19 Expo testing stack. Он deprecated и не поддерживает актуальный workflow.
**Правильно:** `jest-expo` + React Native Testing Library, установленные через `npx expo install`.

**Нельзя:** в SDK 56/Node 20 бездумно ставить latest RNTL 14: на 2026-08-11 его engine требует Node 22.13+.
**Правильно:** либо поднять Node, либо выбрать versioned Expo-compatible RNTL; проверить `npm view @testing-library/react-native version peerDependencies engines --json`.

**Нельзя:** переносить TanStack Query v4 snippets в v5 (`cacheTime`, positional overloads, старые loading semantics).
**Правильно:** v5 object signatures, `gcTime`, `isPending`; для RN связать AppState с `focusManager`, network state — с `onlineManager`/NetInfo.

Источники: [Expo unit testing](https://docs.expo.dev/develop/unit-testing/), [TanStack Query v5 migration](https://tanstack.com/query/latest/docs/framework/react/guides/migrating-to-v5), [React Native example](https://tanstack.com/query/v5/docs/framework/react/examples/react-native).

### Glass / platform API

**Нельзя:** рендерить Liquid Glass только по `Platform.OS === 'ios'` или только по iOS version. Некоторые iOS 26 beta/runtime combinations не имеют API и могут crash.
**Правильно:** gate через `isLiquidGlassAvailable()` **и** `isGlassEffectAPIAvailable()`, учесть `AccessibilityInfo.isReduceTransparencyEnabled()`, иметь обычный View fallback.

**Нельзя:** скрывать `GlassView` через `opacity: 0` на нём или parent — native glass перестаёт рендериться.
**Правильно:** использовать documented `glassEffectStyle` animation или wrapper workaround после live-check текущей документации.

Источник: [Expo GlassEffect SDK 57](https://docs.expo.dev/versions/v57.0.0/sdk/glass-effect/).

## Upgrade runbook

1. Создай отдельную branch/worktree; зафиксируй baseline tests и native builds.
2. Upgrade только на один Expo SDK за шаг.
3. Прочитай SDK release notes, RN release notes, deprecated API/migration pages и Native Upgrade Helper для non-CNG.
4. `npx expo install expo@^<sdk>.0.0 --fix`; review dependency/lockfile diff.
5. `npx expo-doctor@latest`; исправь root causes, не маскируй exclude/cache clear.
6. CNG: осознанно regenerate native folders. Non-CNG: применяй native diffs/Pods вручную.
7. Создай новый development/release build. Проверь iOS и Android, deep links, push, permissions, background tasks, updates, offline, gestures/animations.
8. Повтори preflight/typecheck/lint/unit/RNTL/Maestro. Для EAS Update проверь runtime fingerprint/channel.

Cache clearing идёт после version alignment, а не вместо него. Старый Metro/dev server также может создавать ложный RN mismatch — останови его и убедись, что устройство подключено к правильному bundle.

## Version-sensitive Definition of Done

- Online Expo checks выполнены в день изменения и сохранены в отчёте.
- Использованы versioned Expo docs + official upstream compatibility/release source; не блог/StackOverflow как source of truth.
- Expo/RN/React/Node, Router, Reanimated/Worklets/Gesture и test stack согласованы.
- Один package manager и lockfile; duplicate React/RN/native modules исключены.
- Expo Go не выдан за production evidence; native change проверен новой build.
- EAS Update не пересекает native runtime boundary.
- Alpha/platform API gated и имеет проверенный fallback.
- Любое исключение/override/workaround имеет owner, причину, ссылку и review date.
