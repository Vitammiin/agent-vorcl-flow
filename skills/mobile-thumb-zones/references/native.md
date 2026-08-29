# React Native and Expo thumb-zone guidance

## Platform targets

- iOS: для обычного tappable control стремись к hit region не меньше 44×44 pt. Визуальный glyph может быть меньше.
- Android: рекомендуемый touch target — не меньше 48×48 dp.
- В React Native увеличивай область через container padding или `hitSlop`; также настрой `pressRetentionOffset`, если небольшой drift не должен отменять tap.
- Не используй один pixel constant как доказательство соответствия обеим платформам.

Sources: [Apple accessibility guidance](https://developer.apple.com/design/human-interface-guidelines/accessibility), [Apple buttons](https://developer.apple.com/design/human-interface-guidelines/buttons), [Android accessibility](https://developer.android.com/guide/topics/ui/accessibility/views/apps-views).

## Reachability and system UI

- Primary actions и frequent navigation держи в естественной lower/middle зоне, но учитывай platform navigation conventions.
- Используй safe-area primitives; bottom bars и sheets не должны конфликтовать с home indicator, Android gesture navigation или keyboard.
- Проверяй keyboard avoidance/controller strategy, focus transfer, screen reader order и Dynamic Type/font scaling.
- Для tab bar выбирай небольшой стабильный набор destinations. Contextual action может жить в bottom sheet, если sheet не маскирует navigation и имеет accessible dismissal.
- Left/right hand проверяй на устройстве; не закрепляй единственный critical control в дальнем боковом углу.

## Verification

Проверяй release/development build на representative iOS и Android devices, portrait/landscape, largest supported text, screen reader, keyboard opened, reduced motion и системные gesture areas. Expo Go не доказывает поведение custom native packages.
