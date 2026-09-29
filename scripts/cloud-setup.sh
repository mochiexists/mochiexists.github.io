#!/usr/bin/env bash
# Claude Code cloud session setup (run by the SessionStart hook in .claude/settings.json).
# Plain static site: nothing to install. The check (scripts/check-site.py) needs only python3.
set -euo pipefail

command -v python3 >/dev/null || { echo "cloud-setup: python3 is required" >&2; exit 1; }
