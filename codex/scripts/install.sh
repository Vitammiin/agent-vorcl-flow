#!/usr/bin/env bash
# Установка адаптера Agent-Vorcl-Flow в Codex CLI.
# Идемпотентно: скиллы → ~/.agents/skills, конфиг/AGENTS.md → ~/.codex (между маркерами).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # папка codex/
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
SKILLS_DIR="$HOME/.agents/skills"
S="# >>> agent-vorcl-flow >>>"
E="# <<< agent-vorcl-flow <<<"

echo "→ Скиллы → $SKILLS_DIR"
mkdir -p "$SKILLS_DIR"
cp -R "$ROOT"/skills/* "$SKILLS_DIR"/

echo "→ config.toml → $CODEX_HOME/config.toml"
mkdir -p "$CODEX_HOME"; touch "$CODEX_HOME/config.toml"
if grep -qF "$S" "$CODEX_HOME/config.toml"; then
  echo "  уже установлено — пропуск"
else
  { printf '\n%s\n' "$S"; cat "$ROOT/config.toml"; printf '%s\n' "$E"; } >> "$CODEX_HOME/config.toml"
  echo "  добавлено (mcp_servers + profiles)"
fi

echo "→ AGENTS.md → $CODEX_HOME/AGENTS.md"
touch "$CODEX_HOME/AGENTS.md"
if grep -qF "$S" "$CODEX_HOME/AGENTS.md"; then
  echo "  уже установлено — пропуск"
else
  { printf '\n%s\n' "$S"; cat "$ROOT/AGENTS.md"; printf '%s\n' "$E"; } >> "$CODEX_HOME/AGENTS.md"
  echo "  добавлено"
fi

echo "✔ Готово. Впишите токены в $CODEX_HOME/config.toml, затем: codex → \$architect"
