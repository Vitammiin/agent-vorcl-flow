---
name: mobile-thumb-zones
description: "Проектирует и проверяет эргономику mobile web и React Native/Expo интерфейсов: досягаемость действий большим пальцем, touch targets, нижнюю навигацию, формы, safe areas и mobile anti-patterns. Use для создания или аудита мобильных экранов; не применять к desktop-only UI."
---

# Mobile Thumb Zones

Используй эргономику как ограничение взаимодействия, а не как декоративный шаблон. Сначала определи платформу, размер/ориентацию экрана, основной сценарий, частоту действий и существующую design system. Не перестраивай информационную архитектуру только ради нижнего расположения контролов.

## Базовые решения

- Primary frequent action должен быть доступен без смены хвата; destructive, редкие и системные действия могут оставаться дальше.
- Не кодируй интерфейс только под правую руку. Вертикальная досягаемость важнее зеркального left/right placement; проверь обе руки и two-handed use.
- Размер hit area и визуальный размер — разные вещи. Увеличивай tappable area через padding/hitSlop, сохраняя визуальную иерархию.
- Учитывай safe-area inset, системную навигацию, клавиатуру, Dynamic Type/zoom и landscape.
- Bottom navigation подходит для небольшого стабильного набора primary destinations. Не превращай каждую страницу в tab bar и не скрывай важные действия в overflow без проверки discoverability.
- Sticky CTA не должен перекрывать контент, focus, keyboard или системные жесты; резервируй под него layout space.
- Формы на узком экране обычно одноколоночные. Клавиатура, autofill и content semantics должны соответствовать данным.
- Hover-only, горизонтальный overflow, маленькие close controls, full-screen interstitials и autoplay со звуком считаются mobile anti-patterns, если продукт явно не доказывает обратное.

## Маршрутизация

- Для responsive web прочитай [references/web.md](references/web.md).
- Для React Native/Expo прочитай [references/native.md](references/native.md).
- При смешанном продукте прочитай оба reference и разделяй требования по платформам.

## Проверка

Проверь critical flow на реальном или репрезентативном устройстве, а не только в desktop viewport. Зафиксируй viewport/device, руку/ориентацию, keyboard state, safe-area behavior, target measurements и найденные блокеры. Conversion claims требуют product analytics/A-B evidence; статья-источник не является доказательством конкретного uplift.

## Definition of Done

- primary action остаётся достижимым и видимым в normal/keyboard/zoom states;
- hit targets соответствуют правилам целевой платформы;
- соседние targets не создают mis-tap risk;
- layout работает для left/right hand, landscape и accessibility scaling;
- navigation и sticky surfaces не перекрывают content/focus/system gestures;
- выводы разделяют нормативные требования, platform guidance и продуктовые рекомендации.
