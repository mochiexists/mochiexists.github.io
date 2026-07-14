# AGENTS.md

mochiexists.com — a static personal/brand site for Mochi, deployed on GitHub Pages.

- Pure HTML/CSS/JS, no build tools or frameworks
- Dark theme with purple/earth tones, Georgia serif typography
- Each page lives in its own directory with an `index.html`; shared assets in `assets/`
- Deploys from `main` with CNAME `mochiexists.com`
- `yolo/` is a separate nested repo (`mochiexists/yolo`), gitignored here; it publishes `mochiexists.com/yolo` through its own GitHub Pages setup — commit yolo work in that repo, not this one
