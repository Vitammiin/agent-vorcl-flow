#!/usr/bin/env bash
# Compatibility entrypoint. The Node installer is the single implementation
# for fresh installs, upgrades, conflict handling and runtime overlays.
set -euo pipefail

PKG_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
exec node "$PKG_ROOT/bin/install.mjs" --codex
