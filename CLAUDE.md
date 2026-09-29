# CLAUDE.md

Read @AGENTS.md for project context.

## Cloud sessions

For Claude Code on the web (claude.ai/code). `scripts/cloud-setup.sh` runs automatically at session start (static site, nothing to install).

- Check: `python3 scripts/check-site.py` (titles, meta descriptions, internal links; known gaps in `scripts/check-site.baseline`).
- Work on the session's branch and open a PR. Merging to `main` publishes mochiexists.com via GitHub Pages, so never push `main`. There are no deploy scripts.
- No secrets are available or needed. Keep changes small and in Mochi's voice.
