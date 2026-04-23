status: build
files:
  - assets/mochi.css
  - index.html
  - yolo/
  - README.md
  - .spec/sod-report.md

# Extract palette tokens + drop the stale yolo/ orphan

## What
Two cleanups prompted by a sibling-repo audit. (1) `yolo/index.html`
was a ~24KB stale copy of an old yolo landing that nobody serves —
GitHub's path-based routing sends `/yolo/` to the dedicated
`mochiexists/yolo` repo, not this one. Drop the file and its empty
parent directory. (2) The palette is hardcoded as hex values in both
`assets/mochi.css` and `index.html`, making manual sync with the
sibling yolo repo (which keeps its own inline palette) a grep-and-
replace exercise with no anchoring names. Lift the palette into
`:root` custom properties in `mochi.css` so both repos can share
token names even though they can't share a file.

## Acceptance criteria
- [x] `yolo/index.html` and the empty `yolo/` dir are removed from
      the repo. Live `mochiexists.com/yolo/` still serves the
      dedicated repo's deployment (unchanged behaviour).
- [x] `assets/mochi.css` declares a `:root` block with `--bg`,
      `--text`, `--text-muted`, `--accent`, `--accent-glow`. The
      existing rules reference those vars where appropriate. Header
      comment explains the hand-sync convention with the yolo repo.
- [x] `index.html` uses `var(--*)` for background, body colour,
      glow gradient, headline colour. No visual regression — swapped
      hexes for named tokens with identical values.
- [x] `README.md` + `.spec/sod-report.md` refreshed via
      `scripts/update-sod-report.sh` and staged.

## Notes
- The two repos deploy independently (no runtime cross-fetch). The
  yolo repo mirrors the same token names inline with a comment
  pointing back here; future palette changes land in both by hand.
- One hardcoded hex left in `index.html`: the plate drop-shadow uses
  `rgba(124, 111, 156, 0.3)` — a one-off alpha that doesn't match
  `--accent-glow` (0.15). Left inline rather than minting a
  `--accent-shadow` token for a single callsite.

## Peer spec review
Not invoked — local cleanup, no architecture or external surface
changes. Scope declared up front, acceptance criteria measurable.

## Peer code review
Not invoked — mechanical refactor (hex → var) plus a file removal.
Diff reviewed locally: `body`, `.glow`, `.headline` now consume
vars with identical resolved values; no other colour callsites
touched.

## Verify
- [x] `yolo/` no longer exists in the working tree after `git rm -r yolo/`.
- [x] `mochi.css` compiles via direct load (no syntax errors when
      linked). `var(--bg)` etc. resolve to the same hex values the
      inline blocks previously hardcoded.
- [x] `index.html` visually identical on load (dark bg, muted body
      copy, brighter headline, purple glow gradient).

## Closure
- Challenges: nothing notable — both parts landed in one small diff.
- Learnings: the yolo → site link is a visual cut between two design
  languages. Naming tokens consistently across both doesn't unify
  them at runtime, but it makes "bring them closer" a one-step refactor
  rather than an archaeology project.
- Outcomes: orphan removed; palette lifted into named tokens; sibling
  repo comment spells out the hand-sync convention.
- Dust: when repos share a roof but not a wall, name the bricks the same.
