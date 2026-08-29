---
name: workspace-capability-routing
description: Анализирует одновременно пользовательскую цель и фактический workspace, затем выбирает минимальный набор Agent-Vorcl-Flow ролей и доменных скиллов с evidence и negative criteria. Use для architect/analyzer/audit/vorcl маршрутизации; не использовать вместо реализации выбранной роли.
---

# Workspace Capability Routing

Маршрутизация начинается не с языка проекта, а с желаемого результата пользователя. Runtime, manifests и структура workspace уточняют способ работы, но не переопределяют артефакт: Node-проект с целью создать видео — не backend-задача только из-за `package.json`.

## Preflight

1. Зафиксируй requested outcome, target audience/surface, modifying или read-only режим и явно названные ограничения.
2. Прочитай локальные `AGENTS.md`, `PROJECT_DESCRIPTION.md` (если существует), manifests/lockfiles, entrypoints, configs и несколько релевантных файлов. Для greenfield честно отметь отсутствие evidence.
3. Получи детерминированные hints:

   ```bash
   node <skill-root>/scripts/route.mjs --root <workspace> --goal "<user goal>" --format json
   ```

4. При неоднозначности прочитай [references/capability-catalog.json](references/capability-catalog.json). Каталог содержит все поставляемые роли, ownership/negative criteria и skills; не загружай тела всех скиллов.
5. Выбери одного primary owner, только необходимые supporting roles/domain skills и независимого Checker. Каждый выбор подкрепи prompt или workspace evidence.

## Decision rules

- Requested deliverable важнее incidental technology signal.
- Existing system: сначала фактические boundaries/versions/conventions; greenfield: требования и ограничения.
- Mobile/Expo screen work добавляет ergonomics/design/compatibility skills; version-sensitive native library — только после live preflight.
- Multi-surface audit использует профильные read-only passes; targeted audit не расширяй до всего каталога.
- `architect` нужен для реальной междоменной развилки, а не как обязательный посредник любой маленькой задачи.
- supporting role без отдельного ownership или verification contribution — шум, его не подключай.
- Skill hint не означает разрешение на install, deploy, migration, external mutation или destructive action.

## Output contract

```json
{
  "systems": ["mobile"],
  "workspaceEvidence": ["package.json: expo"],
  "intentSignals": ["mobile-ui"],
  "primaryRole": "expo-mobile",
  "supportingRoles": [],
  "skillHints": ["expo-mobile-architecture", "expo-ui-design-motion", "mobile-thumb-zones"],
  "checkerRole": "testing",
  "uncertainties": []
}
```

Script output — hints, не окончательное решение. Исправляй route по более сильному evidence и кратко объясняй divergence. Перед handoff укажи scope каждого участника и что намеренно не подключено.
