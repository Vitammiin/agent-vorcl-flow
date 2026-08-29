#!/usr/bin/env bash
# sync-check.sh — проверка дрейфа Claude-канона и Codex-зеркала.
#
# Канон: agents/, commands/, skills/. Зеркало: codex/skills/, codex/AGENTS.md,
# codex/config.toml + инфра scripts/session-start.js. Скрипт ловит рассинхрон:
#   FAIL — отсутствует файл зеркала или упоминание агента (exit 1);
#   WARN — зеркало подозрительно тонкое (<40% строк канона) — exit 0.
#
# Запуск из корня репо: bash scripts/sync-check.sh

set -u
cd "$(dirname "$0")/.." || exit 1

OK=0
WARN=0
FAIL=0

pass() { OK=$((OK + 1)); }
warn() { printf 'WARN: %s\n' "$1"; WARN=$((WARN + 1)); }
fail() { printf 'FAIL: %s\n' "$1"; FAIL=$((FAIL + 1)); }

# Registry is the deterministic inventory; validator also parses every Markdown
# frontmatter and checks role/profile/router completeness.
if node scripts/generate-role-skills.mjs && node scripts/generate-capability-catalog.mjs && node scripts/validate-registry.mjs; then
  pass
else
  fail "role registry/frontmatter validation failed"
fi

for skill in mobile-thumb-zones react-native-liquid-glass workspace-capability-routing; do
  if [ -d "skills/$skill" ] && [ -d "codex/skills/$skill" ] && diff -qr "skills/$skill" "codex/skills/$skill" >/dev/null; then
    pass
  else
    fail "new routing/mobile skill missing or drifted: skills/$skill ↔ codex/skills/$skill"
  fi
done

# ---------- 1. Персоны: agents/<x>.md → codex/skills/<x>/SKILL.md ----------
for f in agents/*.md; do
  [ -e "$f" ] || continue
  x=$(basename "$f" .md)
  if [ -f "codex/skills/$x/SKILL.md" ]; then
    pass
  else
    fail "нет персоны codex/skills/$x/SKILL.md для агента agents/$x.md"
  fi
done

# ---------- 2. Task-скиллы: commands/<agent>/<cmd>.md → codex/skills/<agent>-<cmd>/SKILL.md ----------
for f in commands/*/*.md; do
  [ -e "$f" ] || continue
  agent=$(basename "$(dirname "$f")")
  cmd=$(basename "$f" .md)
  if [ -f "codex/skills/$agent-$cmd/SKILL.md" ]; then
    pass
  else
    fail "нет task-скилла codex/skills/$agent-$cmd/SKILL.md для команды commands/$agent/$cmd.md"
  fi
done

# Команды верхнего уровня (роутер): commands/<cmd>.md → codex/skills/<cmd>/SKILL.md
for f in commands/*.md; do
  [ -e "$f" ] || continue
  cmd=$(basename "$f" .md)
  if [ -f "codex/skills/$cmd/SKILL.md" ]; then
    pass
  else
    fail "нет скилла codex/skills/$cmd/SKILL.md для команды commands/$cmd.md"
  fi
done

# ---------- 3. Доменные скиллы: skills/<s>/SKILL.md → codex/skills/<s>/SKILL.md ----------
for d in skills/*/; do
  [ -e "$d" ] || continue
  s=$(basename "$d")
  [ -f "skills/$s/SKILL.md" ] || continue
  if [ -f "codex/skills/$s/SKILL.md" ]; then
    pass
  else
    fail "нет зеркала codex/skills/$s/SKILL.md для скилла skills/$s/SKILL.md"
  fi
done

# ---------- 4. Каждый агент доступен через compact Codex router и profile ----------
for f in agents/*.md; do
  [ -e "$f" ] || continue
  x=$(basename "$f" .md)

  if grep -q "$x" codex/AGENTS.md 2>/dev/null; then
    pass
  else
    fail "агент $x не упомянут в codex/AGENTS.md"
  fi

  if grep -q "^\[profiles\.$x\]" codex/config.toml 2>/dev/null; then
    pass
  else
    fail "нет [profiles.$x] в codex/config.toml"
  fi

done

# ---------- 5. Остатки устаревшего имени /goal (переименовано в /vorcl) ----------
goal_hits=$(grep -rnF -e '/goal' -e '$goal' commands codex agents skills README* 2>/dev/null)
if [ -n "$goal_hits" ]; then
  printf '%s\n' "$goal_hits"
  fail "найдены остатки устаревшего имени /goal или \$goal (см. выше) — роутер называется /vorcl"
else
  pass
fi

# ---------- 6. Тонкие зеркала: codex/skills/<x>/SKILL.md < 40% строк agents/<x>.md ----------
for f in agents/*.md; do
  [ -e "$f" ] || continue
  x=$(basename "$f" .md)
  t="codex/skills/$x/SKILL.md"
  [ -f "$t" ] || continue # отсутствие уже зафиксировано как FAIL выше
  canon=$(wc -l < "$f" | tr -d ' ')
  mirror=$(wc -l < "$t" | tr -d ' ')
  if [ "$((mirror * 100))" -lt "$((canon * 40))" ]; then
    warn "codex/skills/$x/SKILL.md тонкий: $mirror строк против $canon в agents/$x.md (< 40%)"
  else
    pass
  fi
done

# ---------- 7. Expo Mobile runtime/resources и Kimi-native adapter ----------
for rel in \
  SKILL.md \
  agents/openai.yaml \
  references/architecture-guide.md \
  references/version-compatibility.md \
  scripts/compatibility-preflight.mjs \
  scripts/guard.mjs \
  tests/compatibility-preflight.test.mjs \
  tests/guard.test.mjs
do
  canonical="skills/expo-mobile-architecture/$rel"
  mirror="codex/skills/expo-mobile-architecture/$rel"
  if [ -f "$canonical" ] && [ -f "$mirror" ] && cmp -s "$canonical" "$mirror"; then
    pass
  else
    fail "Expo architecture resource отсутствует или разошёлся: $canonical ↔ $mirror"
  fi
done

for rel in \
  SKILL.md \
  agents/openai.yaml \
  references/architecture-methodology.md \
  references/evidence-model.md \
  references/rendering-contract.md \
  scripts/principal-architecture.mjs \
  scripts/render-md.mjs \
  scripts/render-html.mjs \
  scripts/render-drawio.mjs \
  scripts/render-mermaid.mjs \
  scripts/render-pdf.mjs \
  scripts/validate.mjs \
  scripts/lib/core.mjs \
  scripts/lib/extract.mjs \
  scripts/lib/model.mjs \
  tests/principal-architecture.test.mjs \
  assets/THIRD_PARTY_NOTICES.md
do
  canonical="skills/principal-architecture/$rel"
  mirror="codex/skills/principal-architecture/$rel"
  if [ -f "$canonical" ] && [ -f "$mirror" ] && cmp -s "$canonical" "$mirror"; then
    pass
  else
    fail "Principal architecture resource отсутствует или разошёлся: $canonical ↔ $mirror"
  fi
done

# ---------- 8. Code Integrity skills + deterministic scanner ----------
for skill in code-integrity hardcode-detection mock-data-detection; do
  if [ -d "skills/$skill" ] && [ -d "codex/skills/$skill" ] && diff -qr "skills/$skill" "codex/skills/$skill" >/dev/null; then
    pass
  else
    fail "Code Integrity skill отсутствует или разошёлся: skills/$skill ↔ codex/skills/$skill"
  fi
done

if [ -f .codex-plugin/plugin.json ] && grep -q '"skills": "./skills/"' .codex-plugin/plugin.json; then
  pass
else
  fail "Codex plugin manifest отсутствует или не публикует ./skills/"
fi

if [ -d skills/principal-architecture/assets/parsers ] && [ -d codex/skills/principal-architecture/assets/parsers ] && diff -qr skills/principal-architecture/assets/parsers codex/skills/principal-architecture/assets/parsers >/dev/null; then
  pass
else
  fail "Principal architecture parser runtime отсутствует или разошёлся"
fi

for rel in \
  SKILL.md \
  agents/openai.yaml \
  references/audit-playbook.md \
  scripts/inventory.mjs \
  scripts/validate-report.mjs \
  tests/project-audit.test.mjs
do
  canonical="skills/project-audit/$rel"
  mirror="codex/skills/project-audit/$rel"
  if [ -f "$canonical" ] && [ -f "$mirror" ] && cmp -s "$canonical" "$mirror"; then
    pass
  else
    fail "Project audit resource отсутствует или разошёлся: $canonical ↔ $mirror"
  fi
done

for rel in \
  SKILL.md \
  agents/openai.yaml \
  references/design-motion-guide.md \
  scripts/guard.mjs \
  tests/guard.test.mjs
do
  canonical="skills/expo-ui-design-motion/$rel"
  mirror="codex/skills/expo-ui-design-motion/$rel"
  if [ -f "$canonical" ] && [ -f "$mirror" ] && cmp -s "$canonical" "$mirror"; then
    pass
  else
    fail "Expo UI/motion resource отсутствует или разошёлся: $canonical ↔ $mirror"
  fi
done

for skill in apple-design animate animate-expo; do
  if [ -d "skills/$skill" ] && [ -d "codex/skills/$skill" ] && diff -qr "skills/$skill" "codex/skills/$skill" >/dev/null; then
    pass
  else
    fail "Motion skill отсутствует или разошёлся: skills/$skill ↔ codex/skills/$skill"
  fi
done

if [ -f kimi/agents/expo-mobile.yaml ] && grep -q 'expo-mobile' kimi/agents/expo-mobile.yaml; then pass; else fail "нет Kimi Expo custom agent"; fi
if [ -f kimi/agents/logging.yaml ] && grep -q 'pino-logging' kimi/agents/logging.yaml; then pass; else fail "нет Kimi logging custom agent"; fi
if [ -f kimi/hooks.toml ] && grep -q '__AVF_EXPO_GUARD__' kimi/hooks.toml && grep -q '__AVF_EXPO_UI_GUARD__' kimi/hooks.toml && grep -q '__AVF_EXPO_COMPATIBILITY__' kimi/hooks.toml && grep -q '__AVF_LOGGING_GUARD__' kimi/hooks.toml; then pass; else fail "нет полного Kimi Expo/logging hook template"; fi
if grep -q 'srcAgents.*kimi.*agents' bin/install.mjs && grep -q 'srcHooks.*kimi.*hooks.toml' bin/install.mjs; then
  pass
else
  fail "Kimi installer не подключает native agent/hook"
fi

# ---------- Сводка ----------
echo ""
echo "Итог: OK=$OK WARN=$WARN FAIL=$FAIL"
if [ "$FAIL" -gt 0 ]; then
  echo "Зеркало разошлось с каноном — исправь FAIL-пункты выше."
  exit 1
fi
if [ "$WARN" -gt 0 ]; then
  echo "Файлы на месте, но есть тонкие зеркала — при случае догони их до канона."
fi
exit 0
