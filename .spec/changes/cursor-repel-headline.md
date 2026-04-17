status: done
files:
  - index.html
  - dust/index.html
  - assets/repel.js

# Cursor-repel headline

## What
Add a cursor-responsive text displacement effect to the homepage and `/dust` page headlines: individual letters push away from the mouse and spring back when it leaves, like petting a cat. Reinforces the site's "soft reactive matter" feeling (glow + breathing plate). Zero-dep vanilla JS, respects `prefers-reduced-motion`.

Also adds an `<h1>mochi exists</h1>` to the homepage (currently missing — brand lives only in image alt text) so the effect has a natural home and the page gains a real heading.

## Acceptance criteria
- [ ] Homepage HTML ships with a plain static `<h1>mochi exists</h1>` (no inline spans, no JS required to render); placed inside the existing centered column above the `.plate` image, not breaking the vertical centering or visibly clipping at the viewport edges when letters displace
- [ ] `assets/repel.js` enhances any `<h1>` with class `repel` at runtime by wrapping each non-whitespace character in a `<span aria-hidden="true">`, and sets `aria-label` on the `<h1>` to its original text so screen readers announce the heading as one phrase (not letter by letter)
- [ ] With a hover-capable fine pointer (`matchMedia('(hover: hover) and (pointer: fine)').matches === true`), letters translate away from the cursor up to a maximum of 14px displacement, influence radius 120px, and return to rest within 400ms after the cursor leaves the radius
- [ ] With no hover capability or coarse pointer (touch, most tablets), the script does nothing — no letter wrapping, no listeners attached, no movement
- [ ] Users with `prefers-reduced-motion: reduce` see no letter movement (script does nothing) AND the existing `.plate` `breathe` animation is disabled via CSS media query in `index.html`
- [ ] Same effect applied to the `/dust` page `<h1>dust</h1>` (add class `repel`, load the script)
- [ ] With JS blocked, both pages render headlines as normal static text with no layout shift
- [ ] Copy/paste of the homepage headline yields the string `mochi exists` (not character-separated or duplicated)
- [ ] `repel.js` does not touch or depend on the existing inline glow listener; glow behavior is unchanged on both pages

## Notes
- Implementation sketch: on load, find `h1.repel`, read its `textContent`, set `aria-label` to that string, replace its children with `<span aria-hidden="true">`-wrapped characters (whitespace preserved as plain text). Attach one `mousemove` listener to `document`; per frame compute per-letter displacement from cursor using `getBoundingClientRect()` centers; apply `transform: translate(x,y)` via `requestAnimationFrame`. Use CSS `transition: transform 300ms ease-out` on the spans so return-to-rest is handled by CSS when displacement targets go to zero.
- Keep letter displacement subtle (hard cap 14px) — site tone is quiet, not chaotic.
- `repel.js` reads its own `mousemove` events independently of the inline glow script. Extracting/sharing glow is explicitly out of scope for this change.
- `assets/` currently only holds images — adding a JS file there is a new pattern but fits the flat structure.
- Follow-up (out of scope): extract the duplicated `.glow` JS from `index.html` and `dust/index.html` into `assets/glow.js`.

## Peer spec review
From `codex exec` (gpt-5.4):

Blockers:
- "Reuse the existing glow-tracking `mousemove` listener" conflicts with "single shared script at `assets/repel.js`." Glow is duplicated inline in `index.html` and `dust/index.html`. Spec should say whether `repel.js` reads raw events independently, or this change also extracts/shared-owns glow.
- Accessibility criterion is too vague for per-letter spans. Without an explicit approach, screen readers may announce letters individually. Specify the pattern to preserve heading semantics.
- Touch/pointer scope is ambiguous. On hybrid devices, "pointer/mouse-driven only" needs a concrete rule like hover-capable fine pointers only.

Risks:
- Home layout is vertically centered with `body { overflow: hidden; }` and only the plate/nav exist now. Adding an `<h1>` above the plate may disturb spacing or clip displaced letters unless the headline layout is specified.
- "~120px" and "~400ms" are fuzzy for verify. Tighten ranges or mark them intentionally approximate.

Advisory:
- Requiring literal span wrapping in shipped HTML is overbuilt. Safer to let JS enhance static text at runtime so no-JS remains clean.

Addressed in spec:
- Blocker 1: added criterion that `repel.js` reads its own `mousemove` independently; glow untouched; glow extraction explicitly out of scope.
- Blocker 2: criterion now says JS sets `aria-label` on the `<h1>` to its original text and marks letter spans `aria-hidden="true"` so the heading is announced as one phrase.
- Blocker 3: criterion uses `matchMedia('(hover: hover) and (pointer: fine)')` as the concrete rule; script does nothing otherwise.
- Risk 1: criterion specifies placement inside existing centered column above the plate, without breaking centering or clipping displaced letters at viewport edges.
- Risk 2: tightened to exact values — 14px max displacement, 120px influence radius, 400ms return.
- Advisory: shipped HTML is now plain `<h1>mochi exists</h1>` with class `repel`; spans are created by JS at runtime; added a no-JS criterion.


## Peer code review
From `codex exec` (gpt-5.4):

No clear blocker in the diff against the spec.

Advisory:
- Homepage "inside the existing centered column" is only implicitly met — no wrapper, `body` flex column does the layout. Real risk is visual: `body { overflow: hidden; }` means centering/clipping on short viewports still needs actual verify, especially with the new `h1` above the plate.
- `display: inline-block` is set both in JS and CSS. Not harmful, just redundant.
- Per-letter `getBoundingClientRect()` on every animation frame is acceptable for these tiny headlines, but main performance cost if reused on longer text later.

Requirement coverage otherwise solid: reduced-motion exits early and disables the home plate animation, coarse/non-hover pointers do nothing, headings stay static without JS, glow listener remains independent, accessibility/copy behavior matches spec intent.

Addressed in build:
- Short-viewport risk: changed homepage body `overflow: hidden` → `overflow-x: hidden` so vertical overflow scrolls gracefully on short viewports, preventing the new h1 from pushing links off-screen. Horizontal overflow (from 14px displaced letters near viewport edges) still suppressed.
- Redundant `inline-block`: removed from `assets/repel.js`; CSS in `index.html` and `dust/index.html` owns it.
- Per-frame `getBoundingClientRect()`: left as-is (spec scope is only "mochi exists" and "dust", both short); noted as a cost consideration for any future reuse.


## Verify
- [x] Shipped HTML: `index.html:119` has `<h1 class="headline repel">mochi exists</h1>`, plain static text, no inline spans. Pass.
- [x] Placement/centering: measured at 1645×935 viewport — headline center x=822.4, plate center x=822.4, links center x=822.4, viewport center x=822.5. Vertical centering preserved by `body` flex column. Body `overflow-x: hidden` prevents horizontal clipping; vertical overflow now scrolls on short viewports instead of clipping. Pass.
- [x] JS enhancement: live DOM check showed `aria-label="mochi exists"`, 11 aria-hidden spans (m,o,c,h,i,e,x,i,s,t,s) with space preserved as a text node. Pass.
- [x] Displacement math: manual replica of the update loop at cursor 5px from letter `m` produced tx=13.42 (capped near 14), falloff smooth — `o`=9.1 at 42px, `c`=6.14 at 67px, `h`=3.04 at 94px, `i`=0.46 at 116px, `e`=0 at 147px (outside 120 radius). Pass.
- [x] Return within 400ms: CSS `transition: transform 400ms cubic-bezier(0.22, 1, 0.36, 1)` on each letter span; when cursor leaves radius, script writes empty transform, CSS animates to rest. Pass (by CSS transition duration).
- [x] Hover/fine-pointer guard: `matchMedia('(hover: hover) and (pointer: fine)')` checked before any DOM enhancement; script `return`s early otherwise. No listeners, no wrapping, no movement on touch/coarse pointers. Pass (by code inspection).
- [x] Reduced motion: script early-returns; CSS `@media (prefers-reduced-motion: reduce) { .plate { animation: none; } }` disables breathe. Pass (by code inspection).
- [x] Dust page: `/dust/` h1 enhanced — aria-label="dust", 4 aria-hidden spans (d,u,s,t), script loaded from `/assets/repel.js`. Pass.
- [x] No-JS: grep confirms shipped HTML contains `<h1 class="headline repel">mochi exists</h1>` and `<h1 class="repel">dust</h1>` as plain text. Pass.
- [x] Copy/paste: programmatic selection of h1 contents yielded exact string `mochi exists`. Pass.
- [x] Glow listener unchanged: `repel.js` reads its own `mousemove`; glow handler in `index.html:119-128` and `dust/index.html:269-278` untouched; live check confirmed glow still responds to mouse. Pass.

Not live-verified against external target: this change is to the static site in-repo only. Deployment to `mochiexists.com` is a separate step (merge → GitHub Pages publish). Treat this verify as local-only until the commit lands on `main` and Pages serves it.

## Closure
- Challenges: `requestAnimationFrame` is throttled in background/hidden tabs, so automated verification of live transform writes wasn't possible — worked around by verifying the motion math directly against real span rects.
- Learnings: Codex's pre-build review caught three real blockers (listener conflict, a11y vagueness, pointer scope) and one unscoped visual risk. Naming "ships as plain HTML + JS enhancement" as an explicit criterion turned a fuzzy advisory into a testable one.
- Outcomes: Homepage gains a real `<h1>`, `/dust` headline reuses the same effect. Shared `assets/repel.js` (~85 lines, zero deps). Respects reduced-motion and coarse pointers. Also a tiny fix: body `overflow` relaxed to `overflow-x` so short viewports scroll instead of clipping.
- Dust: letters lean away like fur under a hand, then settle.
