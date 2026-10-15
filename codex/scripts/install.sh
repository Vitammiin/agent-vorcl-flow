#!/usr/bin/env bash
# Compatibility entrypoint. The Node installer is the single implementation
# for local skills, safe upgrades and conflict handling.
set -euo pipefail

PKG_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
exec node "$PKG_ROOT/bin/install.mjs" --codex "$@"
