# AGENTS.md

## Workflow

This project uses `spec-of-dust`. Read `.spec/FLOW.md` before starting any feature work.

On session start, read `.spec/b-startup.md` if it exists, then check `.spec/changes/` for active change files. Ignore `_template.md` and `_example-*`. If a real change file exists, resume from its current status. If none exist and the user requests a change, create one from `.spec/changes/_template.md`.

## Project

mochiexists.com — a static personal/brand site for Mochi, deployed on GitHub Pages.

- Pure HTML/CSS/JS, no build tools or frameworks
- Dark theme with purple/earth tones, Georgia serif typography
- Pages: home, dust (spec-of-dust promo), plate (product), story, yolo
- Assets in `assets/`, each page in its own directory with `index.html`
- CNAME: `mochiexists.com`
- Refresh repo metrics with `bash scripts/update-sod-report.sh` after tracked text-file changes
