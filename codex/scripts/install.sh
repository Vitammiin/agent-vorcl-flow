#!/usr/bin/env bash
# Установка адаптера Agent-Vorcl-Flow в Codex CLI.
# Идемпотентно: скиллы → ~/.agents/skills, конфиг/AGENTS.md → ~/.codex (между маркерами).
# Секреты MCP не хранятся в config.toml — серверы стартуют через launcher bin/mcp-env.mjs,
# который читает ключи из общего ~/.config/agent-vorcl-flow/.env.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"   # папка codex/
PKG_ROOT="$(cd "$ROOT/.." && pwd)"                         # корень пакета
CODEX_HOME="${CODEX_HOME:-$HOME/.codex}"
SKILLS_DIR="$HOME/.agents/skills"
AVF_HOME="${AGENT_VORCL_HOME:-${XDG_CONFIG_HOME:-$HOME/.config}/agent-vorcl-flow}"
LAUNCHER="$AVF_HOME/bin/mcp-env.mjs"
S="# >>> agent-vorcl-flow >>>"
E="# <<< agent-vorcl-flow <<<"

echo "→ Общий слой (launcher + .env) → $AVF_HOME"
mkdir -p "$AVF_HOME/bin"
cp "$PKG_ROOT/bin/mcp-env.mjs" "$LAUNCHER"
echo "  launcher → $LAUNCHER"
if [ -f "$AVF_HOME/.env" ]; then
  echo "  .env уже есть — не трогаю"
elif [ -f "$PKG_ROOT/.env.example" ]; then
  cp "$PKG_ROOT/.env.example" "$AVF_HOME/.env"
  chmod 600 "$AVF_HOME/.env" 2>/dev/null || true
  echo "  создан $AVF_HOME/.env — впиши сюда свои ключи"
fi

echo "→ Скиллы → $SKILLS_DIR"
mkdir -p "$SKILLS_DIR"
cp -R "$ROOT"/skills/* "$SKILLS_DIR"/

echo "→ config.toml → $CODEX_HOME/config.toml"
mkdir -p "$CODEX_HOME"; touch "$CODEX_HOME/config.toml"
if grep -qF "$S" "$CODEX_HOME/config.toml"; then
  echo "  уже установлено — пропуск"
else
  # Подставляем абсолютный путь launcher'а вместо плейсхолдера __AVF_LAUNCHER__.
  { printf '\n%s\n' "$S"; sed "s#__AVF_LAUNCHER__#${LAUNCHER}#g" "$ROOT/config.toml"; printf '%s\n' "$E"; } >> "$CODEX_HOME/config.toml"
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

echo "✔ Готово. Впиши ключи в $AVF_HOME/.env, затем: codex → \$architect"
