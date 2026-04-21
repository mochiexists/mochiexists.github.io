status: done
files:
  - assets/mochi.css
  - index.html
  - dust/index.html
  - docs/dust.html
  - templates/dust.html
  - README.md
  - .spec/sod-report.md
  - mochi/

# Cleanup orphans and extract shared CSS

## What
Three small cleanup items from a site review: (1) the `/mochi/` directory held two unreferenced PNGs (already deleted — `mochi-favicon.png` was a duplicate of `/assets/favicon.png`; `2026-02-02-mochi-plate-v1.png` was a dated source asset). Now remove the empty directory and commit. (2) Home (`index.html`) and `/dust` re-implement the same primitives inline — `.glow`, `.repel` headline, `.frequency` footer, `.links` nav, and shared color tokens. Extract to `/assets/mochi.css` and have both pages link it; keep page-specific layout inline. Yolo stays divergent on purpose. (3) Add a one-line label to `docs/dust.html` clarifying that it shows *this site's* workflow run, not upstream spec-of-dust history.

## Acceptance criteria
- [ ] `assets/mochi.css` exists with only the truly shared primitives: `.repel span { display: inline-block; }`, `.frequency` footer, `.links a` base (color `#7c6f9c`, text-decoration none, transition), `.links a:hover` (color `#c8c8d0`, opacity 1), and a header comment noting shared color values. Page-specific values (font-size, letter-spacing, opacity, text-transform) stay inline. `.glow` and `.headline` stay inline because sizes/rules differ per page.
- [ ] `index.html` links `<link rel="stylesheet" href="assets/mochi.css">` (relative); `dust/index.html` links `<link rel="stylesheet" href="/assets/mochi.css">` (absolute). The matching rules are removed from each page's inline `<style>`.
- [ ] Both pages still render the same visually (glow follows mouse, repel works, 528 Hz footer present, nav styled).
- [ ] `docs/dust.html` shows a short visible label near the top that reads something like: "Showing this site's own dust workflow run — not upstream spec-of-dust history." Placement: under the subtitle, styled as a muted note.
- [ ] `README.md` + `.spec/sod-report.md` refreshed via `scripts/update-sod-report.sh` and staged.

## Notes
- Yolo intentionally diverges (Crimson Pro + JetBrains Mono palette). Do not touch.
- `/ovm/api/*` is intentionally unlinked until OVM gets its own site. Do not add nav.
- `mochi/` directory deletions happened earlier in this session; included in scope so this change covers the full cleanup.
- `templates/dust.html` is the pristine setup copy (used by `setup.sh` when migrating new consumers); kept in sync with `docs/dust.html` so the subtitle label travels with future clones.

## Peer spec review
Codex (2026-04-21):
- Blocker: `mochi/` AC is stale (already absent) — dropped.
- Risk: CSS rules aren't identical across pages (`.glow` size/gradient differ, nav spacing differs, only home has `.headline`). Scope narrowed to truly shared primitives; page-specific values stay inline.
- Ambiguity: link path differs per page (`assets/mochi.css` on `/`, `/assets/mochi.css` on `/dust`). Called out in AC.
- Ambiguity: `.repel` support = `span { display: inline-block; }` only, not a full heading style move. Clarified.
- Advisory: docs/dust.html label copy/placement — specified in AC.
- Advisory: README refresh is closeout plumbing — kept as AC for sod-gate compliance.


## Peer code review
Codex (2026-04-21):
- Blocker: shared `.links` nav base not actually extracted — only `:hover` was in `mochi.css`. Addressed: extracted the truly shared subset (color `#7c6f9c`, text-decoration none, transition) into `assets/mochi.css`; page-specific values (font-size, letter-spacing, opacity, text-transform) stay inline. Spec AC tightened to match.
- Blocker: scope violation — diff touched `templates/dust.html` and deleted `mochi/` files but spec's `files:` list didn't include them. Addressed: added `templates/dust.html` and `mochi/` to scope; updated Notes to reflect both are intentional.
- Advisory: `templates/dust.html` sync with `docs/dust.html` clarified in Notes.


## Verify
Verified against local static server at `http://localhost:4321/`.

- [x] `assets/mochi.css` contains only truly shared primitives: `.repel span`, `.frequency`, `.links a` base (color `#7c6f9c`, text-decoration none, transition), `.links a:hover`, and a header comment listing shared color values. Page-specific values (font-size, letter-spacing, opacity, text-transform) remain inline. Pass.
- [x] `index.html` links `<link rel="stylesheet" href="assets/mochi.css">` (relative); `dust/index.html` links `<link rel="stylesheet" href="/assets/mochi.css">` (absolute). Inline duplicates removed. Pass.
- [x] Home rendered live: stylesheet loaded, headline enhanced (11 repel spans on "mochi exists"), link color `rgb(124, 111, 156)` and font-size 14px (0.875rem inline), frequency fixed at 11.2px (0.7rem). Glow gradient present. Pass.
- [x] `/dust/` rendered live: stylesheet loaded, h1 enhanced (4 repel spans on "dust"), link font-size 13.12px (0.82rem) + letter-spacing 1.5744px (0.12em) + text-transform lowercase all inline, shared color inherited. Frequency opacity 0.2. Pass.
- [x] `docs/dust.html` subtitle now reads: "Browse workflow logs from spec-of-dust. / Showing this site's own dust workflow run — not upstream spec-of-dust history." Confirmed in live DOM. Pass.
- [x] `templates/dust.html` mirrors the `docs/dust.html` subtitle update so new consumers pick up the label on setup. Pass.
- [x] `bash scripts/build-dust.sh --check` exits 0 after rebuild. Pass.
- [x] `README.md` and `.spec/sod-report.md` refreshed via `scripts/update-sod-report.sh`. Pass.

Not live-verified against external target: change is local-only. Deployment to `mochiexists.com` depends on a push from an authorized Git identity (not `atlascodesai`).


## Closure
- Challenges: peer code review caught both a missed requirement (nav base wasn't extracted, only hover was) and a scope gate violation (`templates/dust.html` + `mochi/` not declared in `files:`). Both addressed before verify.
- Learnings: extracting shared CSS is mostly about being honest about what's *actually* identical. First pass conflated "pattern" with "rule" — `.links` looks shared across pages but only color + text-decoration + transition survived a diff. The rest is per-page expression of the same idea.
- Outcomes: `assets/mochi.css` (~25 lines) now owns `.repel span`, `.frequency`, and the shared `.links a` base. Home + `/dust` linked and visually verified. Two orphan PNGs and the empty `/mochi/` dir gone. `docs/dust.html` now labels itself as this site's own workflow run. `templates/dust.html` kept in sync for future setup runs.
- Dust: shared things learn their shape by what stays when the rest is taken away.
