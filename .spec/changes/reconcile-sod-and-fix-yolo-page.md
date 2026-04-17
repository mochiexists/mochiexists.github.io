status: verify
files:
  - scripts/*.sh
  - .githooks/_spec_gate.sh
  - setup.sh
  - yolo/index.html
  - templates/dust.html
  - docs/dust.html

# Reconcile sod files and fix yolo 404

## What
The site repo (mochiexists.github.io) has hand-copied sod files from `spec-of-dust` at `/Users/timapple/Documents/mochi/dust/spec-of-dust` that have drifted. The build script is still `build-viewer.sh` (renamed to `build-dust.sh` upstream), `FLOW.md` is missing Testing and Push sections, `merge-completed-work.sh` is missing push logic, `b-startup.md` has no `push:` config, and `_spec_gate.sh` still references `docs/viewer.html`. Additionally, the nav has a `/yolo` link that 404s — the landing page needs to be copied from the yolo project at `/Users/timapple/Documents/mochi/yolo/index.html`. Both tasks are about syncing the site with upstream projects.

## Acceptance criteria
- [ ] `scripts/build-dust.sh` exists (copied from spec-of-dust) and `scripts/build-viewer.sh` is deleted
- [ ] `scripts/merge-completed-work.sh` includes push logic and references `build-dust.sh`
- [ ] `scripts/archive-done-changes.sh` references `build-dust.sh` and `docs/dust.html`
- [ ] `.githooks/_spec_gate.sh` references `docs/dust.html` (not `viewer.html`) in `is_allowed_done_closeout_file`, `is_archive_allowed_extra`, and `has_sod_relevant_changes`
- [ ] `.spec/FLOW.md` includes Testing and Push sections matching upstream
- [ ] `templates/dust.html` exists (copied from spec-of-dust)
- [ ] `docs/dust.html` exists (created from template since site had no dust viewer)
- [ ] `setup.sh` exists with migration logic, test advisory, and `push: never` default
- [ ] `.spec/b-startup.md` includes `push: confirm`
- [ ] `scripts/devlog.sh` references `build-dust.sh` (not `build-viewer.sh`)
- [ ] `scripts/flowlog.sh` references `build-dust.sh` (not `build-viewer.sh`)
- [ ] `yolo/index.html` exists, copied from the yolo project
- [ ] Nav link in `index.html` points to `/yolo` (already does, just verify)
- [ ] `bash scripts/build-dust.sh` runs successfully against `docs/dust.html`
- [ ] Git identity for this repo is `atlascodesai` — no push attempted

## Notes
- The site uses `dust/index.html` as the public-facing dust informational page (no embedded data markers). The sod dust viewer goes in `docs/dust.html` (matching upstream convention) and is created from `templates/dust.html`.
- The yolo `index.html` references external assets (favicon.svg, Google Fonts, mochi.png from mochiexists.com) — no local assets needed.
- Codex peer review ran against the wrong working directory (spec-of-dust instead of site repo). Its blockers about "already having" these files are incorrect — the site repo does not have them. The valid point about canonical paths is addressed: `docs/dust.html` for the sod viewer, `dust/index.html` for the public informational page.

## Peer spec review
From `codex exec` (ran against spec-of-dust cwd instead of site repo — review partly invalid):

Codex flagged three blockers: (1) spec is stale — incorrect, codex read spec-of-dust which already has the updates, not the site repo which doesn't; (2) contradictory target paths — valid concern, addressed by clarifying `docs/dust.html` for sod viewer vs `dust/index.html` for public page; (3) "copied from upstream" is underspecified — source is pinned to current HEAD of spec-of-dust at `/Users/timapple/Documents/mochi/dust/spec-of-dust`. Also flagged missing `index.html` in files scope — nav link already correct, just verify. Advisory to split into two changes — declined, both tasks are small and related (syncing with upstream projects).


## Peer code review
From `codex exec` (gpt-5.4):

Blocker: `push: confirm` in `merge-completed-work.sh` doesn't check for missing `origin` remote (only `auto` mode does). In `confirm` mode it always prints "Run `git push origin <target>`" even without a remote.

Addressed: this is upstream behavior copied verbatim from spec-of-dust. The `confirm` mode only prints a suggestion — it doesn't execute a push — so the human would discover the missing remote when they try. Not a functional regression; filed as a follow-up concern for upstream.

Advisory: no test coverage for push branches. Acknowledged — site repo has no test harness.

No other regressions. All `viewer.html` to `dust.html` renames are consistent across gate, archive, devlog, and flowlog scripts.

## Verify
- [x] `scripts/build-dust.sh` exists, `scripts/build-viewer.sh` deleted. Pass.
- [x] `scripts/merge-completed-work.sh` has `run_push()` function and references `build-dust.sh`. Pass.
- [x] `scripts/archive-done-changes.sh` references `build-dust.sh` (line 8) and `docs/dust.html` (line 83). Pass.
- [x] `.githooks/_spec_gate.sh` references `docs/dust.html` in `is_allowed_done_closeout_file` (line 114), `is_archive_allowed_extra` (line 434), and `has_sod_relevant_changes` (line 490). No `viewer.html` references remain. Pass.
- [x] `.spec/FLOW.md` has `## Testing` (line 63) and `## Push` (line 80). Pass.
- [x] `templates/dust.html` exists (20KB). Pass.
- [x] `docs/dust.html` exists (30KB, created from template + embedded data). Pass.
- [x] `setup.sh` exists with migration logic (viewer->dust), test advisory, and `push: never` default (line 21). Pass.
- [x] `.spec/b-startup.md` has `push: confirm` (line 13). Pass.
- [x] `scripts/devlog.sh` references `build-dust.sh` (line 68). No `build-viewer` references. Pass.
- [x] `scripts/flowlog.sh` references `build-dust.sh` (line 80). No `build-viewer` references. Pass.
- [x] `yolo/index.html` exists, matches source from yolo project. Pass.
- [x] Nav link in `index.html` points to `/yolo` (line 132). Pass.
- [x] `bash scripts/build-dust.sh --check` exits 0. Pass.
- [x] No push attempted. Git identity is `atlascodesai`. Pass.

Not live-verified: deployment to mochiexists.com requires push to origin (which `atlascodesai` cannot do). This is local-only until the human pushes.

## Closure
- Challenges: pre-commit hook chicken-and-egg during archive — the old `_spec_gate.sh` referenced `docs/viewer.html` which blocked the sod check, requiring manual archive before the reconciliation could proceed.
- Learnings: codex peer review ran against the wrong working directory (spec-of-dust instead of site), making its blockers invalid. When the two repos share files, the review context needs to be explicit about which repo is the target.
- Outcomes: 7 sod files synced from upstream, `viewer.html` references fully replaced with `dust.html`, push config added, yolo landing page imported. All 15 acceptance criteria pass.
- Dust: scattered files find their way home
