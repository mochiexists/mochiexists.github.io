status: done
files:
  - docs/dust.html
  - templates/dust.html

# Dust filter — poetry view for dust lines

## What
Add a 5th filter button `Dust` to the dust viewer (`docs/dust.html`). When active, hide the normal card timeline and render a minimal quote-wall of just the `dust:` lines from each change with a non-empty dust entry. Each line is subtly expandable to reveal the full change details on demand — the expand affordance should be visually minimal so the page reads as a wall of poetry by default. Applies to `templates/dust.html` too so the setup copy stays in sync.

## Acceptance criteria
- [ ] A 5th filter button labeled `Dust` appears in `.toolbar` after `Changes`, using the same `.filter-btn` styling, with `data-filter="dust"`
- [ ] Clicking `Dust` activates the same visual state as other filter buttons (`.filter-btn.active`) and deactivates the others
- [ ] When `Dust` is active: both `#activeSection` and `#timeline` are emptied; a new `#dustWall` container (or reuse of `#timeline`) renders only change entries whose `dust` field is non-empty and is not `nothing notable`. No devlog/flowlog entries shown. `#activeSection` hidden.
- [ ] In Dust mode each line is italic, accent-colored (`var(--accent)`), with generous vertical spacing, and **without**: card border, card background, timestamp, status badge, `.dust-line` top border, and `.dust-line` `❖` prefix. Only the italic + accent treatment is kept from existing styling.
- [ ] Each line is rendered via `<details>`/`<summary>`. The `<summary>` contains the dust line itself. Expansion reveals the existing change card (the same markup `buildEntry` produces for `_source === "change"`), minus the duplicated dust line (suppress `.dust-line` inside the expanded card to avoid repetition).
- [ ] Expand affordance is visually minimal: no default triangle/marker (use `summary::-webkit-details-marker { display: none }` and `list-style: none`), a small `·` glyph fades in on `:hover` or `:focus-visible` of the summary. Summary stays keyboard-focusable and tap-activatable on mobile (default `<summary>` behavior).
- [ ] The existing `All` / `Devlog` / `Flowlog` / `Changes` filters continue to work exactly as before (regression check).
- [ ] `entryCount` reads `N dust line` (singular) or `N dust lines` (plural) when Dust is active.
- [ ] `templates/dust.html` mirrors the same changes so new consumers get the filter on setup.
- [ ] `bash scripts/build-dust.sh --check` exits 0 after rebuild.

## Notes
- Dust lines are already parsed into the `dust` field on each change in `EMBEDDED_CHANGES`. No backend/build changes required.
- Palette stays warm paper (`--bg: #f4efe6`, `--accent: #8c4f2f`). Lean into existing `.dust-line` italic styling.
- Expansion should use `<details>`/`<summary>` or a click handler — pick whichever keeps the affordance smaller.
- If a change has no dust line or `nothing notable` as dust, it should be excluded from Dust view (don't render empty italic lines).

## Peer spec review
Codex (2026-04-21):
- Blocker: expansion markup was underspecified vs current renderer — clarified to use `<details>`/`<summary>` and reuse `buildEntry` change-card output with the internal `.dust-line` suppressed to avoid duplication.
- Blocker: keyboard/touch rule for expand affordance — clarified: `<summary>` is natively focusable and tappable; the subtle `·` glyph is a visual hint, not the hit target.
- Risk: `.dust-line` has a top border + `❖` prefix — AC now explicit that Dust mode keeps only italic + accent, drops both.
- Risk: `#activeSection` needs to hide in Dust mode too — added to AC.
- Ambiguity: `entryCount` copy — pinned to `N dust line` / `N dust lines`.
- Advisory: don't build a second full renderer — reused `buildEntry`.


## Peer code review
Codex (2026-04-21):
- Blocker: open-state glyph was `×`, spec pinned it to `·` fading on hover/focus. Addressed: removed the `×` override; glyph stays as `·` with 0.55 opacity when hovered/focused/open.
- Advisory: `outline: none` on summary with no real focus affordance. Addressed: added dotted underline on `:focus-visible` (tiny, palette-coherent).
- Advisory: dust placeholder check was exact-string. Addressed: `isRealDust` now trims whitespace so `"   "` / whitespace-only dust lines are excluded.
- Otherwise aligned: Dust filter is change-only, hides `#activeSection`, reuses the existing change card with dust suppressed, updates `entryCount`, template mirrored.


## Verify
Verified live at `http://localhost:4321/docs/dust.html`.

- [x] 5th filter button `Dust` present after `Changes`, shares `.filter-btn` styling, `data-filter="dust"`. Confirmed in DOM: `['All','Devlog','Flowlog','Changes','Dust']`. Pass.
- [x] Clicking `Dust` sets `.filter-btn.active` on it and removes from others (uses existing click handler loop). Screenshot confirms active state. Pass.
- [x] When active: `#activeSection.style.display === "none"` and `.textContent === ""`; `#timeline` class swapped to `dust-wall`; only change entries with real dust lines rendered (3 items). Pass.
- [x] Each line italic + accent color `rgb(140, 79, 47)` + font-size 18.4px (1.15rem) + list-style none + cursor pointer. No card border, no timestamps, no status badges, no `.dust-line` top-border/glyph leaking in. Pass.
- [x] `<details>`/`<summary>` used; expanding reveals `article.entry.change` inside; `.dust-line` suppressed inside expanded card (verified via `first.querySelector('article .dust-line') === null`). Pass.
- [x] Minimal expand glyph: `·` only, opacity 0 default, 0.55 on hover/focus-visible/open. No `×` swap. Focus-visible adds subtle dotted underline for keyboard users. Pass.
- [x] Regression: all other filters still work (All=11, Devlog=2, Flowlog=3, Changes=4) with normal `.timeline` class restored. Pass.
- [x] `entryCount`: reads `3 dust lines` (plural) in Dust mode. Singular `1 dust line` branch present in code. Pass.
- [x] `templates/dust.html` mirrors all CSS, HTML, and JS changes. Pass.
- [x] `bash scripts/build-dust.sh` runs clean (`Dust data is already current` after rebuild). `--check` passes. Pass.

Not live-verified against external target: change is local-only. Deployment to `mochiexists.com` requires a push from an authorized Git identity.


## Closure
- Challenges: peer spec review flagged four ambiguities (expand markup, keyboard/touch, `.dust-line` chrome, `#activeSection` hiding) that would have produced a janky first build. Peer code review caught one real blocker (`×` override drifted from spec) and two easy advisories. Caught before verify both times.
- Learnings: `<details>`/`<summary>` + `::-webkit-details-marker { display: none }` + `list-style: none` gets you a zero-chrome disclosure affordance with keyboard and touch support for free. Worth reaching for over custom click handlers every time.
- Outcomes: Dust filter added to `docs/dust.html` and `templates/dust.html`. Activating it swaps the timeline into a quiet wall of italic lines; each line expands to the full change card (minus the duplicated dust line) on click/tap/Enter. Everything else unchanged.
- Dust: the walls hold the quiet ones, and let them in one at a time.
