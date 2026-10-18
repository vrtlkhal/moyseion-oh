# Statue scroll-traverse + live pretext re-flow

Date: 2026-08-03
File: `Moyseion Hero Landing Page.html` (single file)

## Problem

The statue GLB does not travel. It teleports.

1. **Motion is time-based, not scroll-based.** `activateStatue` fires from a
   ScrollTrigger `onToggle` and runs `gsap.to(statuePos, {duration: 0.7,
   ease: 'power3.inOut'})`. Once fired it runs on wall-clock time, decoupled
   from the scroll wheel. Scroll fast and it drifts behind; scroll slow and it
   arrives early and waits. Scrubbing back re-fires the same tween with
   `overwrite: true`.
2. **It is frozen for the whole pin.** Each section pins for `2.1 * innerHeight`
   of scroll and the statue sits at `SEAT_X 0.50 / SEAT_Y 0.50` — dead centre of
   the paragraph — for all of it. The rhythm is park → jump → park → jump.
3. **pretext is doing nothing dynamic.** `layoutParagraph(p, box)` is called
   **once** per section activation. It wipes `innerHTML` and rebuilds every line
   against a *static* hole. That is the work of a CSS `shape-outside`. The whole
   reason pretext is in this project is that it can re-solve line breaks against
   a **moving** obstacle, which CSS cannot do. That capability is currently
   unused.
4. **Rotation is `sin(p * PI * 6)`** — three oscillations per section. Nervous
   jitter, not travel.

## Decisions (agreed with user)

| Question | Decision |
|---|---|
| In-section motion | **Full traverse**, paragraph top → bottom, gently eased. Every line parts around the statue at some point. |
| Handoff | **Scroll-scrubbed arc through the margin**, alternating side with `side-left`/`side-right`. |
| Rotation | **Literal full 360° Z turn** across the whole manifesto run, monotonic. |
| Text re-flow | **Live, every frame, everywhere the statue goes.** Non-negotiable — this is the point of pretext here. |

## Architecture

### 1. `layoutParagraph` splits in two

Currently one function that computes *and* commits. Becomes:

- **`computeRows(p, ellipse)` — pure.** Streams rows through
  `layoutNextRichInlineLineRange` against the ellipse half-width at each row's
  y. Returns `rows: Seg[][]` where `Seg = {range, left, width}`. Touches no DOM.
  Runs every frame for every engaged paragraph.
- **`syncRows(p, rows)` — commits the delta.** Diffs against `p.__rows` (last
  committed) and writes the minimum:

  | Change | Action | Frequency |
  |---|---|---|
  | Only `left`/`width` moved | patch spacer + cell `style.width` in place | every frame — *this is the visible parting* |
  | A word crossed the gap (`range` changed) | rebuild that one row's children | every few frames |
  | Row count changed | append/remove trailing `.ln` | rare |

  Row identity key: `segs.map(s => s.range.start + ':' + s.range.end).join('|')`.
  Geometry is compared separately so it can take the cheap path.

- **`layoutParagraph(p, box)`** stays as a thin `computeRows` + full commit
  wrapper, so `splitIntoLines`, `buildLineReveals` and the resize path are
  untouched.

### 2. Live set, not a single `activeP`

During the handoff arc the statue overlaps two paragraphs at once. Each frame:

1. **Read phase** — `getBoundingClientRect()` for candidate paragraphs only
   (the pinned section ± 1). Batched, before any write.
2. **Solve phase** — statue target from scroll, damp, ellipse in viewport space.
3. **Write phase** — `computeRows` + `syncRows` per engaged paragraph, then the
   statue transform.

One forced layout per frame, not N. A paragraph that stops intersecting is
restored to the plain full-width split once, then left alone.

**Engagement gate.** A paragraph engages only once its section top passes
`ENGAGE_AT = 0.30` of the viewport. Line reveals run `top 80%` → `top 25%` and
the pin starts at `top top`, so without the gate the arc would arrive mid-reveal
and fight it. On engage: kill that paragraph's `ln-*` triggers and force all
lines visible (existing `killReveal` / `showLines` behaviour, unchanged).

### 3. Motion — pure `f(scrollY)`, zero `gsap.to`

**Seats.** Built on `ScrollTrigger.refresh`. For each non-`m-close` section,
record its pin trigger's `start`/`end` scroll values plus the paragraph
geometry it will have *when pinned* (section top at viewport 0, so the
paragraph's offset within the section is the viewport top). Stored as
`{colLeft, colW, top, h, side}`.

For the currently-pinned section the live rect is read instead — exact, and
already being read for the re-flow.

**In-pin traverse**, `u` = pin progress:

```
y = top + h * lerp(-0.02, 1.02, smootherstep(u))
x = colLeft + colW * 0.50 + sin(PI * u) * colW * LEAN * side
```

`smootherstep` (6t⁵−15t⁴+10t³) has zero velocity at both ends, so the traverse
eases out of the incoming arc and into the outgoing one with no velocity
discontinuity. The −0.02/1.02 overshoot lets the first and last lines fully
re-open at the extremes.

**Handoff arc**, `t` across `[pin[i].end, pin[i+1].start]`:

```
e     = smootherstep(t)
base  = lerp(exit_i, entry_{i+1}, e)          exit  = traverse end of i
bowX  = sin(PI * t) * innerWidth  * ARC_X * side_i    entry = traverse start of i+1
bowY  = sin(PI * t) * innerHeight * ARC_Y
```

Bow pushes into the *departing* text margin — away from `.section-imgs`, which
sits at `z-index: 22`, in front of the statue, and would otherwise swallow it.
Sides alternate with the existing `side-left`/`side-right` rhythm, so the page
gets a pendulum.

**Damping.** `pos += (target - pos) * (1 - exp(-k * dt * 60))`, `k ≈ 0.2`.
Frame-rate normalised. Absorbs scroll jitter, and — more importantly — absorbs
seat corrections: seats are pre-measured from the *plain* layout, but a
live-reflowed paragraph can be a line taller. Without the damp that correction
pops on every section entry.

### 4. Rotation

`window.__statueRoll` = global progress across `[pin[0].start, pin[last].end]`.

```
model.rotation.set(0, 0, BASE_TILT + roll * 2 * PI * ROLL_TURNS)   // ROLL_TURNS = 1
```

Monotonic, ~51° per section. Replaces the `sin(p * PI * 6)` wobble.

### 5. Ellipse sizing (changed)

Current `GUTTER = 0.78` gives `rx = 0.39 * size` — *narrower than the statue
itself*. Static that reads as tight kerning; moving, it reads as collision.
New `PAD_X`/`PAD_Y` exposed as constants, starting at `0.86` / `1.50`
(`rx = 0.43 * size`), tuned by screenshot.

### 6. `prefers-reduced-motion`

Statue parks at the seat centre, hole computed once per section, no per-frame
work, no traverse, no arc. Rotation static.

## Wordmark (separate ask, same session)

- `text-align: left` with a `6vw` left pad (matches `.manifesto` padding).
- **20% smaller initially**: fit target `0.98` → `0.784` of viewport width.
- Travels to the **top-left corner** instead of top-centre.
  `transform-origin` `50% 100%` → `0% 100%` so the left edge stays pinned under
  scale. End scale derived as `WM_END_W / WM_FIT` so the final mark keeps a
  fixed viewport width regardless of the fit change. End `y` solved from the
  measured height so the mark's top lands at a fixed margin — function-based
  value + `invalidateOnRefresh`.

## Constants

```
SEAT_X 0.50   LEAN 0.10   ARC_X 0.10   ARC_Y 0.10
TRAV_A -0.02  TRAV_B 1.02 DAMP 0.20    ENGAGE_AT 0.30
PAD_X 0.86    PAD_Y 1.50  ROLL_TURNS 1 WRAP_MIN_COL 240
WM_FIT 0.784  WM_END_W 0.14
```

## Verification

- **Path math in node** — `smootherstep`, traverse, bow and damp are plain
  functions of scroll. Extract and assert: continuity at every pin/arc boundary,
  monotonic y within a pin, damp convergence, no NaN at t=0/1.
- **Live re-flow in headless Chrome** — serve the folder, `--headless=new
  --virtual-time-budget`, `--dump-dom` at several scroll offsets; assert the
  `.ln` segmentation actually *differs* between offsets (that is the whole
  claim) and that concatenated text is byte-identical to the source at every
  offset.
- three.js `WebGLRenderer` throws under `--disable-gpu`; use
  `--enable-unsafe-swiftshader --use-angle=swiftshader` and verify by reading
  pixels back off the canvas.

### Results

| Check | Result |
|---|---|
| Path math (10 assertions, node) | all pass |
| Pinned sweep, 21 samples | 21/21 lossless, **21 distinct segmentations** |
| Handoff arc, 26 checks | 26/26 lossless |
| All 6 sections at mid-pin | split + lossless |
| Statue overlapping unparted text | 0 frames of 12 overlap frames |
| GLB render | WebGL live, 14.5% of canvas drawn, no console errors |

## Bugs found during verification

Three, all caught by the probes rather than by reading the code.

1. **`rowKey` read properties that do not exist** (the serious one). A
   `layoutNextRichInlineLineRange` result is `{fragments, width, end}` — it has
   **no `.start`**, and `.end` is a cursor *object*
   `{itemIndex, segmentIndex, graphemeIndex}`. Keying on
   `range.start + ':' + range.end` produced the literal string
   `'undefined:[object Object]'` for every row, so every key compared **equal**,
   the content tier never fired, and rows kept stale words while their cell
   widths kept updating. Symptoms were dropped and duplicated words at row
   boundaries (`can stay stay to relive`, `way, way,`, `of of`) and a row count
   frozen at 7. The key is now built from the fragments' item/segment/grapheme
   positions. Verified against the pre-rework build, which was 9/9 lossless, to
   confirm this was a regression and not pre-existing.

2. **`side` was inverted.** `.side-left` puts the text on the left, so its free
   margin is `-x` — but `side` was `side-right ? -1 : 1`, which aimed the handoff
   bow *at* `.section-imgs` (z-index 22, in front of the statue) instead of away
   from it. `side` is now defined as the outward-margin direction, and the node
   test derives the expression from source rather than restating it.

3. **The ellipse was sampled only at each row's midpoint.** A statue grazing a
   line's ascenders or descenders — over the glyphs, but not across the line's
   centre — left that row measured as clear, so the glb sat visibly on top of
   unparted words. Now sampled across the row's whole band by clamping the
   ellipse centre into `[yTop, yTop + LH]`, which also yields the widest cut
   anywhere in the band. Fixed the last overlap frame and raised the sweep from
   17 to 21 distinct segmentations.

## Known limitation

The handoff arc never engages either paragraph (0 frames with both split). That
is correct rather than broken — the margin bow is what keeps the statue clear of
the copy in transit, and the overlap probe confirms it never covers unparted
text. Noted because the two-paragraph live set is therefore not exercised in
practice; it exists for narrow viewports where the arc stays inside the column.
