# Design — Sophisticated GSAP for the 3D artifact + Pretext text measurement

**Date:** 2026-07-23
**File touched:** `Moyseion Hero Landing Page.html` (single-file page)
**Scope:** Two independent improvements bundled in one request.

1. Rebuild the 3D statue's motion as a real, declarative GSAP scrubbed timeline
   (retiring the hand-rolled per-frame follower and the constant idle spin).
2. Replace both render-then-measure text routines (`fitWordmark`, `splitIntoLines`)
   with DOM-free measurement via `@chenglou/pretext`.

These two parts share no state and can be built/verified independently.

---

## Current state (what exists today)

- **Statue** — a gold GLB rendered by three.js in a fixed `~6vw` canvas
  (`#statueWrap` / `#statueCanvas`), inside a `<script type="module">`.
  - `renderLoop()` spins it at a constant, scroll-independent rate
    (`model.rotation.y += 0.006`).
  - `updateStatue()` runs on `gsap.ticker` every frame: figures out which
    manifesto section-pair the viewport is between, lerps a target toward that
    section's *actual* bottom corner via `curX += (tx-curX)*0.18`, and hard-sets
    `wrap.style.opacity` to 0/1 at the span edges.
  - GSAP is used here only as a bare rAF ticker — **no ScrollTrigger, no
    timeline, no easing choreography** on the artifact.
- **Wordmark** — `fitWordmark()` sets `font-size` to a reference value, reads
  `getBoundingClientRect().width`, and solves for the size that hits 98vw. Two
  style writes + one forced reflow per call; re-runs debounced on resize.
- **Line-splitter** — `splitIntoLines()` wraps every word in a `<span>`, reads
  `offsetTop` to group words into visual lines, wraps each line in a `.ln`
  (`overflow:hidden`) for the scroll-reveal wipe, then runs a DOM `scrollWidth`
  rebalance guard. Rebuilt debounced on resize. Forced layout per word.

---

## Part A — Statue: declarative scrubbed GSAP timeline

**Decision:** Approach 1 (declarative). The statue rests at **fixed alternating
viewport corners** rather than tracking each section's moving box. One GSAP
timeline, scrubbed across the whole manifesto span, owns position, the settle
beat, opacity, and rotation.

### A.1 Ownership & coordinate model
- All statue logic stays in the existing `<script type="module">` IIFE (gsap and
  ScrollTrigger are classic globals, reachable from the module via `window`).
- `#statueWrap` stays `position:fixed; top:0; left:0`, moved by
  `transform: translate(x,y)` in **viewport px**. We position the wrap's *center*
  at a chosen anchor: `x = anchorX - size/2`, `y = anchorY - size/2`.
- **Resting anchors** (viewport fractions, tunable consts), preserving the
  existing alternation (`side-left → right corner`, `side-right → left corner`):
  - side-left section → center at `(0.88·vw, 0.80·vh)`
  - side-right section → center at `(0.12·vw, 0.80·vh)`

### A.1b Co-plane with text + pass-through in transit (change request)
- **z-index:** raise `#statueWrap` from `15` (behind content) onto the text's
  layer and render it **over** the paragraph — `z-index:21` (just above the
  `.manifesto` sections at `20`). It stays `pointer-events:none`, so links and
  text selection underneath are unaffected.
- **Constraint:** the statue is one WebGL canvas, so DOM text cannot be sandwiched
  between parts of it — "goes through" means it *passes over/occludes* the pretext
  lines as it crosses, not a per-word depth weave.
- **Cross over only in transit:** rests stay at the clear opposite-side anchors
  (A.1) at `ANCHOR_Y = 0.80` (low corner, below the vertically-centered text), so at
  rest the paragraph is fully legible. IMPLEMENTED: the handoff `x` sweeps straight
  across the viewport middle while `y` **arcs up** to `ANCHOR_Y_CROSS = 0.48` (the
  centered text band, ~mid-viewport) at the segment midpoint and back down to the
  rest corner — so the artifact rises through the words in motion, then settles
  clear. (A fixed low `y` alone would skim below the centered text and not actually
  traverse it — the arc is what makes the pass-through real.)

### A.2 The proxy
A single plain object is tweened; nothing reads the DOM in the hot path:
```js
const S = { x: 0, y: 0, scale: 1, spin: 0, opacity: 0 };
```
Applied every frame by the timeline's `onUpdate` (guarding the async model):
```js
wrap.style.transform = `translate(${S.x}px, ${S.y}px) scale(${S.scale})`;
wrap.style.opacity   = S.opacity;
if (model) model.rotation.y = S.spin;
```
`renderLoop()` is reduced to `renderer.render(...)` only — the `+= 0.006` idle
spin is removed.

### A.3 Timeline construction (`buildStatueTimeline()`)
Rebuilt from measured layout, so it is correct at any size. **One scroll axis**
governs both the ScrollTrigger and the internal rest times — no double
normalization:
1. Define the driving scroll axis in px:
   `scrollStart = scrollY where section[0] center hits viewport middle`,
   `scrollEnd   = scrollY where section[last] center hits viewport middle`.
   The ScrollTrigger uses exactly these as `start`/`end`.
2. Each section's rest time is that same axis normalized:
   `f_i = (scrollY_i_center_at_mid − scrollStart) / (scrollEnd − scrollStart)`,
   so `f_0 = 0`, `f_last = 1`, interior rests fall in between. Rest alignment is
   therefore exact regardless of unequal section heights.
3. Build a paused timeline of total duration 1:
   - **Position:** for each i, a keyframe placing `S.x/S.y` at that section's
     resting anchor at time `f_i`; handoffs between rests use `ease:'power2.inOut'`.
   - **Settle beat:** around each rest, `S.scale` keyframes `1 → 1.12 → 1`
     (`power2.out` / `power2.in`). Because the timeline is scrubbed, the beat is
     reversible — consistent with the site's fully-scrubbed motion language.
   - **Opacity:** `S.opacity 0→1` over the first ~5% of the span, `1→0` over the
     last ~5%.
   - **Rotation:** one continuous `ease:'none'` tween `S.spin: 0 → TURNS·2π`
     spanning `0`→end. `ease:'none'` over a scrubbed timeline == linear in scroll,
     i.e. "rotation scrubbed to scroll," fully reversible. `TURNS` default `1.5`
     (tunable) so it reads as a slow, legible turn, not a blur.
4. Drive it with one ScrollTrigger: `{ animation: tlStatue, scrub: 0.5,
   start: spanStart px, end: spanEnd px }`. `scrub:0.5` matches the rings' smoothed feel.

### A.4 Refresh / resize
- Anchors (vw/vh) and rest fractions (`f_i`) are layout-dependent, so the timeline
  is **rebuilt on `ScrollTrigger`'s `refresh` event** (kill old trigger + timeline,
  rebuild). This piggybacks on the existing resize path, which already ends
  `buildLineReveals()` with `ScrollTrigger.refresh()`.
- **Ordering:** section positions depend on paragraph heights, which depend on the
  line-splitter output. The statue must rebuild *after* line reveals settle. Using
  the `refresh` event guarantees the statue reads a settled layout. Initial build
  also runs post-`document.fonts.ready`.

### A.5 Tunable constants (top of the IIFE)
`ANCHOR_LEFT_X/Y`, `ANCHOR_RIGHT_X/Y`, `TURNS`, `SETTLE_SCALE`, `SCRUB`.

---

## Part B — Pretext: wordmark + per-run splitter

**Decision:** pretext for both. The splitter uses a **per-run multi-font
line-breaker** to handle mixed `400`/`700` weights.

### B.0 Structural change
- Convert the main logic `<script>` (currently classic, ~L346–629) to
  `<script type="module">` so it can `import` pretext.
- Add pretext to the existing importmap (verified: v0.0.8, ESM-only, zero deps;
  both URLs resolve `200` and re-export the needed symbols):
  ```json
  "@chenglou/pretext": "https://cdn.jsdelivr.net/npm/@chenglou/pretext@0.0.8/+esm",
  "@chenglou/pretext/rich-inline": "https://cdn.jsdelivr.net/npm/@chenglou/pretext@0.0.8/rich-inline/+esm"
  ```
- `gsap`, `ScrollTrigger`, `Lenis` remain classic CDN globals — reachable from a
  module via `window`. The separate `#dsCard` toggle script is independent.
  Module scripts defer; nothing external calls into these functions, so deferral
  is safe. All pretext calls are gated on `await document.fonts.ready` (else every
  number describes the fallback face).

### B.1 Wordmark (clean win)
`MOYΣEION` is a single homogeneous word.
```js
import { prepareWithSegments, measureNaturalWidth } from '@chenglou/pretext';
const REF = 100;
const FONT = "700 100px 'GFS Neohellenic'";          // mirror the h1 CSS exactly, named font
const prepWM = prepareWithSegments('MOYΣEION', FONT, { letterSpacing: REF * 0.01 }); // 0.01em
const naturalWidth = measureNaturalWidth(prepWM);    // width-independent → cache once
function fitWordmark(){
  let fs = REF * (window.innerWidth * 0.98 / naturalWidth);
  fs = Math.min(fs, window.innerHeight * 0.42);
  fs = Math.max(fs, 28);
  h1.style.fontSize = fs + 'px';
}
```
Removes the set-size→read-`getBoundingClientRect` reflow and the flash of
reference-size text before the fit is applied. The linear solve stays valid
because width and letter-spacing both scale linearly with font-size.

### B.2 Line-splitter (pretext `rich-inline`)
Pretext ships a purpose-built helper — `@chenglou/pretext/rich-inline` — for
inline-only rich text with per-run fonts and browser-like boundary whitespace
collapse. It handles the mixed `400`/`700` weights natively, so **no hand-rolled
greedy breaker is needed**. For each `<p>`:

1. **Build items.** Walk `childNodes` in order into a `RichInlineItem[]`, tagging
   each with the font of its run and remembering its source element:
   - text node → `{ text, font: FONT_400 }`, tag `null`
   - `<strong>` → `{ text, font: FONT_700 }`, tag `'strong'`
   - `<a>` → `{ text, font: FONT_400 }`, tag `'a'`, `href` (underline/color don't
     affect width; leave `break:'normal'` so links can wrap)

   Normalize each chunk's internal whitespace (`\s+ → ' '`) to mirror
   `white-space:normal`; rich-inline owns the *cross-item* boundary collapse. Keep
   a parallel `itemMeta[itemIndex] = { tag, href }` map for reconstruction.
2. **Measure.** Read the paragraph's rendered `font-size` (`getComputedStyle`) and
   content width (`clientWidth`) **once each** — the container's own width is a
   layout fact CSS owns, not something pretext computes (its size comes from
   `clamp(...vw...)`, so both change on resize). `FONT_{400,700} =
   "{weight} {size}px 'GFS Neohellenic'"`.
3. **Lay out.** `prepareRichInline(items)` once, then
   `walkRichInlineLineRanges(prepared, contentWidth, range => …)`; materialize each
   range (`materializeRichInlineLineRange`) to get its fragments. Each fragment
   carries `itemIndex`, `text`, and `gapBefore` (the collapsed boundary space).
4. **Rebuild DOM.** Emit one `.ln` (`overflow:hidden`) per line. For each fragment,
   append a leading space when `gapBefore > 0`, then the fragment text wrapped per
   `itemMeta`: `<a href>` / `<strong>` / bare text node. A run split across a line
   break yields one wrapper element per line (matches how browsers render a wrapped
   link/bold). Real text nodes stay in the DOM → selection / find-in-page / screen
   readers unaffected (no `white-space:pre` takeover).
5. **Font/resize.** Gate on `document.fonts.ready`; rebuild debounced on resize.
   Re-preparing on resize is correct because the font *size* changes — the one case
   pretext explicitly sanctions re-`prepare`. No per-word `offsetTop` reads, no
   rebalance/`scrollWidth` guard: the whole render-then-measure loop is gone.

The scroll-reveal wiring (`buildLineReveals`, adaptive stagger, per-line
ScrollTriggers) is unchanged — it still consumes `.ln` elements.

The scroll-reveal wiring (`buildLineReveals`, adaptive stagger, per-line
ScrollTriggers) is unchanged — it still consumes `.ln` elements.

---

## Part C — Housekeeping
- Update the `#dsCard` "Libraries" list to include `@chenglou/pretext` (the card is
  a "remove before ship" work tool, but should stay accurate).
- Out of scope / leave as-is: the `.manifesto` work-frame outline and `#dsCard`
  (both already marked "remove before ship").
- No new base64. Pretext loads from CDN ESM.

---

## Risks & verification
- **Pretext ESM entry** — RESOLVED. v0.0.8 main + `rich-inline` `+esm` bundles both
  return `200` and re-export `prepareWithSegments`, `measureNaturalWidth`,
  `prepareRichInline`, `walkRichInlineLineRanges`, `materializeRichInlineLineRange`.
- **Module conversion** — verify no global/timing dependency breaks when the main
  script becomes `type="module"` (deferred, strict mode).
- **Rich-inline fidelity** — spot-check computed line breaks against the browser's
  real wrapping on the three mixed-weight paragraphs (Essence, Sanctuary, Spirit)
  and confirm boundary spaces around `<a>`/`<strong>` render correctly.
- **Motion verification** — headless Chrome fires rAF only once, so scroll motion
  can't be confirmed by a single screenshot. Verify the timeline logic statically
  and, if needed, via a standalone scroll test harness (progress-driven, stepping
  `tlStatue.progress()` manually rather than by real scroll).
- **Reversibility** — scrubbing back up must cleanly reverse position, settle beat,
  opacity, and rotation (a property the current one-way lerp/idle-spin lacks).

## Out of scope
- Narrative handoff from the rings, continuous scroll-spin outside the span, or any
  material/lighting choreography (explicitly deferred).
