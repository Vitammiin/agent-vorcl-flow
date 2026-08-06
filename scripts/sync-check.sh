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

# ---------- 4. Каждый агент упомянут в AGENTS.md, config.toml, session-start.js ----------
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

  if grep -q "$x" scripts/session-start.js 2>/dev/null; then
    pass
  else
    fail "агент $x не упомянут в scripts/session-start.js"
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
