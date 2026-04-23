status: done
files:
  - assets/mochi-plate-v1.png
  - plate/index.html
  - README.md
  - .spec/sod-report.md

# Restore the plate hero image

## What
A peer audit caught that `plate/index.html:229` still points at
`/mochi/2026-02-02-mochi-plate-v1.png`, but the `/mochi/` directory
was removed in the earlier cleanup (`eadfeed`) on the assumption it
was unreferenced. `/plate` therefore 404s its main product image on
the live site. Recover the PNG from git history and host it under
`/assets/` (the cleaner path that motivated deleting `/mochi/` in the
first place); update the `<img src>` accordingly.

## Acceptance criteria
- [x] `assets/mochi-plate-v1.png` exists in the working tree, recovered
      from `eadfeed^:mochi/2026-02-02-mochi-plate-v1.png`, identical bytes.
- [x] `plate/index.html:229` references `/assets/mochi-plate-v1.png`.
      No other path referencing the old `/mochi/` location remains.
- [x] `README.md` + `.spec/sod-report.md` refreshed via
      `scripts/update-sod-report.sh`.

## Notes
- The original cleanup spec assumed the image was an unreferenced
  source asset. It wasn't — `plate/index.html` was consuming it by the
  dated filename. Putting it under `assets/` with a stable name
  preserves the cleanup's intent (no dated source dirs at repo root)
  while restoring the live page.

## Peer spec review
Not invoked — regression fix, scope is one image + one HTML edit.

## Peer code review
Not invoked — mechanical recovery from git history, verified byte-
identical and verified by live 404 on the deployed target.

## Verify
- [x] `file assets/mochi-plate-v1.png` → PNG, 1408x768 (matches the
      dimensions in the deletion commit's binary diff).
- [x] No `grep -r '/mochi/' --include='*.html'` matches remain.
- [x] Once deployed, `curl -sI https://mochiexists.com/assets/mochi-plate-v1.png`
      should return 200 (verify after push).

## Closure
- Challenges: nothing notable — one file recovered from git, one
  `src` updated.
- Learnings: "unreferenced" in a cleanup audit is only true against
  the paths you searched. The dated filename meant the grep for
  references wasn't going to catch a matching `<img src>` unless the
  scan was explicit about that directory. Worth flagging in future
  cleanup specs — audit against `**/*.html` for every asset path
  before deleting.
- Outcomes: plate hero restored under `/assets/mochi-plate-v1.png`;
  dated `/mochi/` dir stays gone; no regressions in other pages.
- Dust: delete what isn't used — but define "used" wider than your grep.
