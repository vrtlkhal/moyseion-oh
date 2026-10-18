// ===========================================================================
//  MOYΣEION — scroll choreography
//  Loaded as a module so pretext can be imported for DOM-free text measurement.
//  gsap / ScrollTrigger / Lenis are classic CDN globals, reached via window.*.
// ===========================================================================
import { prepareWithSegments, measureNaturalWidth } from '@chenglou/pretext';
import { prepareRichInline, materializeRichInlineLineRange, layoutNextRichInlineLineRange } from '@chenglou/pretext/rich-inline';

const root = document.documentElement;

// ---- HARD DEPENDENCY CHECK --------------------------------------------------
// Everything below assumes gsap. The previous build assumed it silently: if
// cdnjs was blocked the module threw on the first gsap.set() and the page was
// left inert — no text, no fallback, nothing. html.no-motion is applied in the
// <head> and is only removed here, once there is something to remove it for.
if (!window.gsap || !window.ScrollTrigger) {
  console.warn('GSAP unavailable — page stays in static no-motion mode');
  document.querySelectorAll('.chrome').forEach(el => el.classList.add('visible'));
  throw new Error('gsap missing');
}
gsap.registerPlugin(ScrollTrigger);

const REDUCED = root.classList.contains('reduced');
root.classList.remove('no-motion');

// ================= MOTION CONSTANTS — TWO, NOT FIVE =================
// The eye forgives different SPEEDS but not different LAGS on things happening
// in one glance. Everything resolves to one of two constants:
//   SYSTEM  — background machinery (mark, rings, capsules). Allowed to trail.
//   CONTENT — what is being read (text, and the statue that guides it).
// Both are SECOND filters: Lenis already smooths the scroll signal upstream.
const SCRUB_SYSTEM  = 0.35;
const SCRUB_CONTENT = 0.12;
// Perceived lightness goes roughly as alpha^(1/2.2), so a LINEAR alpha ramp is
// already ~73% "there" at alpha 0.5 and then finishes abruptly. Pre-distorting
// by this exponent spends the fade where the eye can see it changing.
const ALPHA_GAMMA   = 1.8;

// ================= THE VIEWPORT UNIT =================
// ONE number, shared by CSS (--vh) and JS (VH), updated on ONE rule.
// On iOS the address bar changes innerHeight by ~60-110px mid-scroll. CSS vh
// follows it; ScrollTrigger — configured with ignoreMobileResize below — does
// not recalculate. Left alone the two drift apart for the rest of the session
// and every pin lands in the wrong place. So: a cached VH that only moves when
// the change is big enough that we are going to rebuild anyway.
let VH = window.innerHeight;
let VW = root.clientWidth;          // clientWidth, NOT innerWidth: innerWidth
                                    // includes the scrollbar, while every
                                    // percentage and left:50% on this page
                                    // resolves against the layout viewport,
                                    // which does not. Mixing them put an ~8px
                                    // sideways slide into the statue's exit.
function publishVH(){ root.style.setProperty('--vh', (VH / 100) + 'px'); }
// A resize is "significant" if the width moved at all, or the height moved by
// more than a quarter of the viewport. That threshold is deliberately the same
// one ScrollTrigger's ignoreMobileResize uses, so the two agree by construction.
function significantResize(){
  return root.clientWidth !== VW || Math.abs(window.innerHeight - VH) > VH * 0.25;
}
publishVH();

ScrollTrigger.config({
  ignoreMobileResize: true,   // address-bar show/hide must not re-solve 6 pins
  limitCallbacks: true
});

// ================= WORDMARK FIT =================
// FONT-SIZE fitting, not scaleX: measure natural width at a reference size,
// solve for the size that reaches the target width, apply THAT — uniform
// scaling, proportions correct at every window size. pretext does the
// measurement with arithmetic, so there is no set-size→read-rect reflow and no
// flash of reference-size text. Natural width is width-independent, so we
// prepare + measure ONCE after the webfont is ready; every resize is pure math.
const h1 = document.getElementById('wordmarkText');
const REF_SIZE = 100;
const WM_FIT = 0.784, WM_END_W = 0.14;
let wmNaturalWidth = null;

function prepareWordmark(){
  const FONT = "700 " + REF_SIZE + "px 'GFS Neohellenic'";
  wmNaturalWidth = measureNaturalWidth(
    prepareWithSegments(h1.textContent, FONT, { letterSpacing: REF_SIZE * 0.01 }));
}
function fitWordmark(){
  if (wmNaturalWidth === null) return;
  let fontSize = REF_SIZE * (VW * WM_FIT / wmNaturalWidth);
  fontSize = Math.min(fontSize, VH * 0.42 * WM_FIT / 0.98);   // height guard
  fontSize = Math.max(fontSize, 28);
  h1.style.fontSize = fontSize + 'px';
}

const WM_END_SCALE = WM_END_W / WM_FIT, WM_TOP = 0.04;
const wordmarkEl = document.getElementById('wordmark');
function wordmarkEndY(){
  const H = wordmarkEl.offsetHeight || VH * 0.3;
  return VH * WM_TOP - VH + H * WM_END_SCALE;
}
// THE TITLE'S RESERVED BAND. Once parked, MOYΣEION is a fixed mark in the
// top-left corner and the sections scroll THROUGH that corner — nothing in CSS
// knows it is there. Its parked height comes from the fitted font size, which
// is solved against VW, so it changes with viewport AND aspect. Publishing the
// measured bottom edge lets the sections reserve exactly that much and no more.
function publishWordmarkZone(){
  const H = wordmarkEl.offsetHeight || VH * 0.3;
  root.style.setProperty('--wm-zone', Math.round(VH * WM_TOP + H * WM_END_SCALE) + 'px');
}

// ================= SMOOTH SCROLL =================
// Lenis is scroll-jacking, and scroll-jacking is the single thing a reader who
// asked for reduced motion most needs switched off. The previous build gated
// only the statue and left this running.
let lenis = null;
if (!REDUCED && typeof Lenis === 'function') {
  // LERP, NOT DURATION — these are two mutually exclusive engines inside Lenis
  // and the page had the wrong one. `duration` is TIME-based: every wheel event
  // restarts a fresh 1.15s eased tween from wherever the scroll currently is to
  // a new target. Roll the wheel three times in a second and you have restarted
  // the curve three times, each one re-easing from a different velocity — which
  // is precisely the stutter you feel, and it gets worse the faster you scroll.
  // `lerp` is frame-rate-independent exponential damping: one continuous filter
  // that absorbs new input without ever restarting, and that degrades gracefully
  // on a 144Hz screen or a dropped frame instead of skewing. It is also Lenis's
  // own default, for this reason.
  //
  // 0.1 is the library default; 0.085 is a touch longer-tailed to sit with the
  // page's own SCRUB_SYSTEM trail without the old floatiness.
  lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
} else if (!REDUCED) {
  root.style.scrollBehavior = 'smooth';
  console.warn('Lenis failed to load — native smooth scroll fallback');
}

// ================= THE SHARED CIRCLE =================
// centre = live centre of the rings, radius eased 1 → 0. The photo is clipped
// INSIDE it; the gold copy is masked to OUTSIDE it. Coordinate spaces differ:
// clip-path on the fullscreen photo resolves in viewport px, but mask-image on
// the gold layer resolves in the LAYER'S OWN box — and since the circle is
// centred on the rings, that is simply 50% 50%.
const photo     = document.getElementById('photo');
const rings     = document.getElementById('rings');
const gold      = document.getElementById('ringsGold');
const ringsPush = document.getElementById('ringsPush');

gsap.set('#rings', { xPercent: -50 });

function applyCircle(progress, r0){
  const cx = r0.left + r0.width / 2;
  const cy = r0.top  + r0.height / 2;
  const Rmax = Math.hypot(Math.max(cx, VW - cx), Math.max(cy, VH - cy));
  const R = Rmax * (1 - progress);
  photo.style.clipPath = `circle(${R}px at ${cx}px ${cy}px)`;
  const m = `radial-gradient(circle at 50% 50%, transparent ${R}px, #000 ${R + 0.5}px)`;
  gold.style.webkitMaskImage = m;
  gold.style.maskImage = m;
}

// The sigil settles at width:44vw (aspect 1:1), so its rendered HEIGHT scales
// with viewport WIDTH while the push-out that carries it off screen scales with
// viewport HEIGHT — on any non-square aspect the two disagree. Solving the
// end 'top' from live VW/VH fixes the gap at exactly SIGIL_GAP at any aspect.
const SIGIL_GAP = 0.15;
function ringsEndTop(){
  // GSAP writes width:44vw inline, but CSS min-width still clamps the USED
  // width — on a narrow viewport the sigil is wider than 44vw and a 44vw-based
  // half-height under-reads its bottom edge, eating the gap.
  const minW = VW <= 700 ? 130 : 150;
  const halfH = Math.max(VW * 0.44, minW) / 2;
  return VH * (1 - SIGIL_GAP) - halfH;
}

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: document.body, start: 'top top', invalidateOnRefresh: true,
    // FUNCTION-BASED. This was the string '+='+window.innerHeight, built once
    // at module-eval: invalidateOnRefresh only re-runs FUNCTION values, so the
    // hero transition length froze at the load-time viewport height while
    // holdEnd and logoExitStart() below kept reading it live. After any resize
    // the three disagreed and the shimmer fired against the wrong playhead.
    end: () => '+=' + VH,
    scrub: SCRUB_SYSTEM
  }
});

tl.to('#rings', { top: () => ringsEndTop(), y: '-50%', width: '44vw', ease: 'none' }, 0);
// symmetric counter-rotation; class selectors hit all three layers so navy,
// gold and shimmer stay perfectly registered. The figure is never targeted.
tl.to('.ring-0', { rotation:  90, svgOrigin: '500 500', ease: 'none' }, 0);
tl.to('.ring-1', { rotation: -90, svgOrigin: '500 500', ease: 'none' }, 0);
tl.to('.ring-2', { rotation:  90, svgOrigin: '500 500', ease: 'none' }, 0);
tl.to('.ring-3', { rotation: -90, svgOrigin: '500 500', ease: 'none' }, 0);

gsap.to('#wordmark', {
  y: () => wordmarkEndY(), scale: WM_END_SCALE, ease: 'none',
  scrollTrigger: { trigger: document.body, start: 'top top',
                   end: () => '+=' + (VH * 0.28), scrub: SCRUB_SYSTEM,
                   invalidateOnRefresh: true }
});

// ---- one-shot bright-gold shimmer, the instant the gold reveal completes ----
let shimmerPlayed = false;
const SHIM_BAND = 3.2;   // MUST match mask-size in .rings-shimmer (320%)
function playShimmer(){
  if (shimmerPlayed) return;
  shimmerPlayed = true;
  const el = document.getElementById('ringsShimmer');
  const W = el.clientWidth || 1;
  // POSITION IN PX, NOT %. A percentage mask-position is a fraction of
  // (box - image), so with a 320%-wide band the old -140% → 140% sweep put the
  // crest inside the mark only during the last third of the tween, by which
  // time the opacity envelope was already fading. In px the crest is placed
  // directly and both peak dead centre.
  const crestAt = (u) => {
    const pos = (W * (1 - u) - SHIM_BAND * W * 0.5) + 'px 0';
    el.style.maskPosition = pos;
    el.style.webkitMaskPosition = pos;
    el.style.opacity = Math.sin(Math.min(1, Math.max(0, u)) * Math.PI);
  };
  const state = { u: -0.08 };
  crestAt(state.u);
  gsap.to(state, { u: 1.08, duration: 2.2, ease: 'sine.inOut', onUpdate: () => crestAt(state.u) });
}

// ================= PARAGRAPH PREPARATION =================
// Line splitting via pretext rich-inline: visual line breaks computed with
// arithmetic — each inline run measured with its OWN font (body 400 /
// <strong> 700) plus browser-like boundary-whitespace collapse — instead of a
// wrap-every-word + read-offsetTop reflow loop.
//
// prepareRichInline is pretext's expensive, width-INDEPENDENT phase; the
// two-phase design exists so it runs once and every later layout is cheap.
// layoutGen, not a getComputedStyle probe, is the cache key: this is called
// every frame for the traversed paragraph, and getComputedStyle forces a style
// recalc. layoutGen is bumped by the one resize handler and by a locale change
// — the only two things that can alter the clamp()ed font size or the words.
let layoutGen = 0;
function prepareParagraph(p){
  if (p.__pt && p.__pt.gen === layoutGen) return p.__pt;
  const cs = getComputedStyle(p), size = parseFloat(cs.fontSize);
  if (p.dataset.origHtml === undefined) p.dataset.origHtml = p.innerHTML;
  const src = document.createElement('div'); src.innerHTML = p.dataset.origHtml;
  const FAM = "'GFS Neohellenic'", F4 = "400 " + size + "px " + FAM, F7 = "700 " + size + "px " + FAM;
  const items = [], meta = [];
  const push = (text, font, tag, href) => {
    const t = text.replace(/\s+/g, ' ');
    if (t === '') return;
    items.push({ text: t, font }); meta.push({ tag: tag || null, href: href || null });
  };
  [...src.childNodes].forEach(n => {
    if (n.nodeType === 3)            push(n.textContent, F4, null, null);
    else if (n.tagName === 'STRONG') push(n.textContent, F7, 'strong', null);
    else if (n.tagName === 'A')      push(n.textContent, F4, 'a', n.getAttribute('href'));
    else                             push(n.textContent, F4, null, null);
  });
  // THE WIDEST SINGLE WORD in the paragraph, each measured at its own weight.
  // This is the floor for a usable gap, and it has to be measured rather than
  // guessed. layoutNextRichInlineLineRange is asked for a line of a given
  // width and it always returns one — so handed a 60px slot beside the statue
  // it does the only thing it can and breaks inside the word, which is how
  // "system" came out as "syste" on one row and "m," on the next. A gap that
  // cannot hold the longest word is not a gap; the row simply ends early and
  // the text keeps its ragged edge. Measured once per paragraph per layoutGen,
  // not per frame.
  let maxWordW = 0;
  items.forEach(it => {
    it.text.split(' ').forEach(w => {
      if (!w) return;
      const nw = measureNaturalWidth(prepareWithSegments(w, it.font));
      if (nw > maxWordW) maxWordW = nw;
    });
  });
  return (p.__pt = { gen: layoutGen, size, items, meta, maxWordW,
                     LH: parseFloat(cs.lineHeight) || size * 1.5,
                     prepared: prepareRichInline(items) });
}

// ================= LIVE TEXT RE-FLOW AROUND THE MOVING STATUE =================
// SPLIT IN TWO, deliberately:
//     computeRows(p, ellipse, colW) -> rows      pure arithmetic, zero DOM
//     syncRows(p, rows, colW)                    writes ONLY what changed
// computeRows is ~12 pretext calls per paragraph per frame — the cheap,
// width-DEPENDENT phase. CSS shape-outside can punch a STATIC hole for free;
// what it cannot do at any price is re-solve the break positions against a
// MOVING obstacle every frame, which is the only reason pretext is here.

function ellipseFor(pr, box){
  if (!box) return null;
  if (!(box.bottom > pr.top && box.top < pr.bottom && box.right > pr.left && box.left < pr.right)) return null;
  const x0 = box.left - pr.left, x1 = box.right - pr.left, y0 = box.top - pr.top, y1 = box.bottom - pr.top;
  return { cx: (x0 + x1) / 2, rx: (x1 - x0) / 2, cy: (y0 + y1) / 2, ry: (y1 - y0) / 2, y0, y1 };
}

const MIN_GAP = 36;   // absolute floor; the real threshold is the paragraph's
                      // own longest word, measured in prepareParagraph

function computeRows(p, ex, colW){
  const { prepared, LH, maxWordW } = prepareParagraph(p);
  const minGap = Math.max(MIN_GAP, maxWordW + 6);
  const next = (w, cur) => layoutNextRichInlineLineRange(prepared, Math.max(24, w), cur);
  const rows = [];
  let cursor, yTop = 0, guard = 0;
  while (guard++ < 500){
    let hw = 0;
    // Sample the ellipse over the row's whole BAND, not at its midpoint:
    // clamping the ellipse centre into [yTop, yTop+LH] yields the widest cut
    // anywhere in the band, so the words part whenever the statue touches the
    // line at all. Midpoint-only sampling let the model graze a line's
    // ascenders while that row still measured as clear.
    if (ex){
      const yc = ex.cy < yTop ? yTop : (ex.cy > yTop + LH ? yTop + LH : ex.cy);
      const t = (yc - ex.cy) / ex.ry;
      if (yc > ex.y0 && yc < ex.y1 && Math.abs(t) < 1) hw = ex.rx * Math.sqrt(1 - t * t);
    }
    const segs = [];
    if (hw <= 1){
      const r = next(colW, cursor); if (!r) break;
      segs.push({ range: r, left: 0, width: colW }); cursor = r.end;
    } else {
      const x0 = ex.cx - hw, x1 = ex.cx + hw;
      const gapL = x0, gapR = colW - x1;
      if (gapL >= minGap){ const r = next(gapL, cursor); if (r){ segs.push({ range: r, left: 0, width: gapL }); cursor = r.end; } }
      if (gapR >= minGap){ const r = next(gapR, cursor); if (r){ segs.push({ range: r, left: x1, width: gapR }); cursor = r.end; } }
      // Neither side can hold a word — the statue is across the whole column at
      // this row. Fall back to a full-width line rather than emitting nothing:
      // the statue is at z-index 19, BEHIND the text, so the line passes over
      // it, which is the same thing that happens at every non-traversing
      // section and reads as depth rather than as a collision.
      if (!segs.length){ const r = next(colW, cursor); if (!r) break; segs.push({ range: r, left: 0, width: colW }); cursor = r.end; }
    }
    rows.push(segs);
    yTop += LH;
  }
  return rows;
}

// Row identity for the diff. The key MUST come from the fragments: a
// layoutNextRichInlineLineRange result is {fragments, width, end} — it has no
// .start, and .end is a cursor OBJECT. Keying on `range.start + ':' + range.end`
// silently yields 'undefined:[object Object]' for every row, which makes every
// key compare EQUAL: rows keep stale words while their cell widths keep
// updating, and the paragraph drops and duplicates words as the statue moves.
const curKey = (c) => c ? (c.itemIndex === undefined ? '' : c.itemIndex + '.') + c.segmentIndex + '.' + c.graphemeIndex : '-';
function rowKey(segs){
  let k = '', cx = 0;
  for (let i = 0; i < segs.length; i++){
    const s = segs[i], fr = s.range.fragments;
    if (s.left > cx) k += 'S';
    k += fr.length + '{';
    for (let j = 0; j < fr.length; j++) k += fr[j].itemIndex + ':' + curKey(fr[j].start) + '>' + curKey(fr[j].end) + ',';
    k += '}' + curKey(s.range.end) + ';';
    cx = s.left + s.width;
  }
  return k;
}

function fillRange(p, node, range){
  const { prepared, meta } = prepareParagraph(p);
  materializeRichInlineLineRange(prepared, range).fragments.forEach((frag, i) => {
    if (i > 0 && frag.gapBefore > 0) node.appendChild(document.createTextNode(' '));
    const m = meta[frag.itemIndex] || {};
    let c;
    if (m.tag === 'a')          { c = document.createElement('a'); if (m.href) c.setAttribute('href', m.href); c.textContent = frag.text; }
    else if (m.tag === 'strong'){ c = document.createElement('strong'); c.textContent = frag.text; }
    else                        { c = document.createTextNode(frag.text); }
    node.appendChild(c);
  });
}

function buildRow(p, ln, segs, colW){
  ln.textContent = '';
  ln.__cells = [];
  if (segs.length === 1 && segs[0].left === 0 && segs[0].width === colW){
    fillRange(p, ln, segs[0].range);
    endRow(ln);
    return;
  }
  let cx = 0;
  segs.forEach((seg, si) => {
    if (seg.left > cx){                           // spacer — this IS the statue gap
      const sp = document.createElement('span');
      sp.style.cssText = 'display:inline-block;width:' + (seg.left - cx) + 'px';
      ln.appendChild(sp); ln.__cells.push(sp);
    }
    const cell = document.createElement('span');
    cell.style.cssText = 'display:inline-block;width:' + seg.width + 'px;overflow:hidden;white-space:nowrap;vertical-align:top';
    fillRange(p, cell, seg.range);
    // preserve the break-space across the gap for selection / copy / screen
    // readers; overflow:hidden clips it visually
    if (si < segs.length - 1) cell.appendChild(document.createTextNode(' '));
    ln.appendChild(cell); ln.__cells.push(cell);
    cx = seg.left + seg.width;
  });
  endRow(ln);
}

// THE LINE BOUNDARY IS A WORD BOUNDARY, and only the eye was being told so.
// Each visual line is its own .ln block, and the blocks were appended with
// nothing between them — so the rendering was correct while the paragraph's
// textContent read "...Water Sanctuarydevoted to the goddess...". That is what
// copy-and-paste, find-in-page and a screen reader all see. A trailing space
// costs nothing to render (the .ln is nowrap and overflow:hidden, so a space at
// the end of it has nowhere to show) and makes the extracted text correct again.
function endRow(ln){
  const last = ln.lastChild;
  if (last && last.nodeType === 3 && /\s$/.test(last.nodeValue)) return;
  ln.appendChild(document.createTextNode(' '));
}

function commitRows(p, rows, colW){
  p.innerHTML = '';
  const lns = [];
  for (const segs of rows){
    const ln = document.createElement('span'); ln.className = 'ln';
    buildRow(p, ln, segs, colW);
    p.appendChild(ln);
    lns.push(ln);
  }
  p.__lns = lns; p.__rows = rows; p.__colW = colW;
  return lns;
}

// DELTA commit — three tiers, cheapest first. The frame-to-frame case is tier 1
// (statue slid a few px: same words, different gap width) and must stay at a
// couple of style writes. Tier 2 fires when a word hops the gap; tier 3 only
// when the row count changes.
function syncRows(p, rows, colW){
  const prev = p.__rows, lns = p.__lns;
  if (!prev || !lns || prev.length !== rows.length){ commitRows(p, rows, colW); return; }
  for (let i = 0; i < rows.length; i++){
    const segs = rows[i], ln = lns[i];
    if (!ln){ commitRows(p, rows, colW); return; }
    if (rowKey(segs) !== rowKey(prev[i])){
      buildRow(p, ln, segs, colW);                // tier 2
    } else if (segs.length > 1){
      const cells = ln.__cells;                   // tier 1
      if (!cells){ buildRow(p, ln, segs, colW); continue; }
      let cx = 0, ci = 0;
      for (let s = 0; s < segs.length; s++){
        const seg = segs[s];
        if (seg.left > cx){ const sp = cells[ci++]; if (sp) sp.style.width = (seg.left - cx) + 'px'; }
        const cell = cells[ci++]; if (cell) cell.style.width = seg.width + 'px';
        cx = seg.left + seg.width;
      }
    }
  }
  p.__rows = rows;
}

function layoutParagraph(p, box){
  const pr = p.getBoundingClientRect(), colW = p.clientWidth;
  const rows = computeRows(p, ellipseFor(pr, box), colW);
  if (!rows.length){ p.innerHTML = ''; p.__rows = null; p.__lns = []; return []; }
  return commitRows(p, rows, colW);
}
function reflowParagraph(p, box, pr, colW){
  const rows = computeRows(p, ellipseFor(pr, box), colW);
  if (!rows.length) return;
  if (!p.__lns || p.__colW !== colW){ commitRows(p, rows, colW); return; }
  syncRows(p, rows, colW);
}
const splitIntoLines = (p) => layoutParagraph(p, null);

// ================= LINE REVEAL =================
function buildLineReveals(){
  ScrollTrigger.getAll().forEach(st => { if (st.vars.id && String(st.vars.id).startsWith('ln-')) st.kill(); });

  gsap.utils.toArray('.manifesto p').forEach((p, pi) => {
    const lines = splitIntoLines(p);
    if (REDUCED){ gsap.set(lines, { opacity: 1, y: 0 }); return; }
    gsap.set(lines, { opacity: 0.1, y: '0.35em' });
    const n = lines.length;
    // CONSTANT CADENCE. Fixing the WINDOW and dividing by line count gave a
    // 3-line paragraph 18.3% of viewport per line and a 7-line paragraph 7.9%
    // — the same page revealing prose at two speeds 2.3x apart. This is text
    // being READ: cadence is the one thing that must not vary section to
    // section. So fix the SLICE and let the window grow, compressing only when
    // a paragraph runs out of viewport to grow into.
    const LINE_SLICE = 11;
    const winTop = 80, winFloor = 5;
    const slice = Math.min(LINE_SLICE, (winTop - winFloor) / n);
    lines.forEach((ln, i) => {
      const s = winTop - i * slice, e = s - slice;
      gsap.to(ln, {
        opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { id: 'ln-' + pi + '-' + i, trigger: p.closest('.manifesto'),
                         start: 'top ' + s + '%', end: 'top ' + e + '%', scrub: SCRUB_CONTENT }
      });
    });
  });
  ScrollTrigger.refresh();
}

// ---- SECTION ENVELOPE — a pure function of the section's live rect ----
// buildLineReveals only brings text IN and never takes it back out, so a
// section that has been read stays at full strength while the next arrives and
// neither is "the" one. This is the envelope around that reveal.
//
// DELIBERATELY NOT A ScrollTrigger. Every .manifesto except .m-close is pinned;
// a second scrubbed trigger using a pinned element as its own trigger resolves
// start/end against the pin-spacer, not the element, and lands on its end
// keyframe forever. The element's rect is true in both states: 0 while pinned,
// real geometry while in flow. Reading it per frame sidesteps the pin question.
const FADE_IN_VH  = 0.35;
const FADE_OUT_VH = 0.45;
const envSections = [...gsap.utils.toArray('.manifesto'), document.getElementById('coda')].filter(Boolean);
const envLast   = new WeakMap();
const envSmooth = new WeakMap();

// Document-space range per envelope section, cached on refresh. A pinned
// section lives inside a ScrollTrigger .pin-spacer, and the SPACER is what
// occupies document space, so that is the box whose range matters.
let envRanges = [];
function measureEnvelope(){
  envRanges = envSections.map(sec => {
    const par = sec.parentNode;
    const holder = (par && par.classList && par.classList.contains('pin-spacer')) ? par : sec;
    let top = 0, el = holder;
    while (el){ top += el.offsetTop; el = el.offsetParent; }
    return { top, bottom: top + holder.offsetHeight };
  });
}

function sectionRead(){
  const sy = window.scrollY;
  return envSections.map((sec, i) => {
    // CULL FIRST. This ran getBoundingClientRect() on all eight sections every
    // frame for the life of the page — eight forced layout reads to be told
    // seven of them are still at zero. Only a section whose document range comes
    // near the viewport can have a non-zero envelope, and that test is pure
    // arithmetic against a cached range. Typical frame now reads two rects.
    const g = envRanges[i];
    if (g && (g.bottom < sy - VH * 0.5 || g.top > sy + VH * 1.5)) return 0;
    const r = sec.getBoundingClientRect();
    const inP  = (VH - r.top) / (VH * FADE_IN_VH);
    const outP = r.bottom / (VH * FADE_OUT_VH);
    const o = inP < outP ? inP : outP;
    return o < 0 ? 0 : o > 1 ? 1 : o;
  });
}
function sectionWrite(vals, deltaMS){
  // Exponential damping on the same time constant the text and statue use.
  // Driving opacity straight off the raw rect made this the one element on the
  // page with zero lag — welded to the scroll while everything beside it trailed.
  const k = 1 - Math.exp(-((deltaMS || 16.7) / 1000) / SCRUB_CONTENT);
  envSections.forEach((sec, i) => {
    const prev = envSmooth.get(sec);
    const damped = prev === undefined ? vals[i] : prev + (vals[i] - prev) * k;
    envSmooth.set(sec, damped);
    // Ease, THEN gamma. smootherstep is the page's one curve; the gamma is the
    // perceptual correction.
    const o = Math.round(Math.pow(smootherstep(damped), ALPHA_GAMMA) * 100) / 100;
    if (envLast.get(sec) === o) return;    // 1%-quantised: skip writes the
    envLast.set(sec, o);                   // compositor cannot show anyway
    sec.style.opacity = o;
  });
}

// ================= THE CLOSING LINE IGNITES, WORD BY WORD =================
// The mark flares once at the start; the sentence flares at the end.
const CLOSE_FROM = '#c2a567';
const CLOSE_TO   = '#f1dca4';

function wrapWords(rootNode){
  const out = [];
  (function walk(node){
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3){
        const frag = document.createDocumentFragment();
        child.nodeValue.split(/(\s+)/).forEach(tok => {
          if (tok === '') return;
          if (/^\s+$/.test(tok)){ frag.appendChild(document.createTextNode(tok)); return; }
          const w = document.createElement('span');
          w.className = 'wd'; w.textContent = tok;
          frag.appendChild(w); out.push(w);
        });
        child.parentNode.replaceChild(frag, child);
      } else if (child.nodeType === 1) walk(child);
    });
  })(rootNode);
  return out;
}

function buildCloseShimmer(){
  ScrollTrigger.getAll().forEach(st => { if (st.vars.id && String(st.vars.id).startsWith('cw-')) st.kill(); });
  const p = document.querySelector('.manifesto.m-close p');
  if (!p) return;
  const words = [];
  p.querySelectorAll('.ln').forEach(ln => words.push(...wrapWords(ln)));
  if (!words.length) return;
  if (REDUCED){ gsap.set(words, { color: CLOSE_TO }); return; }
  const sec = p.closest('.manifesto');
  const n = words.length;
  // Driven off the SECTION's own passage, not a viewport window: .m-close is
  // near the end of the document and is never pushed far past the top, so a
  // window that had to reach the ceiling would never finish.
  const top0 = 85, span = 55;
  // fromTo with an EXPLICIT start, not set() + to(). A plain to() re-records
  // its start value from the live DOM on every refresh, and if the words happen
  // to be lit at that moment it records the LIT colour as the start: the
  // sentence then arrives pre-ignited and never animates again.
  // immediateRender:false so the from lands when the trigger first runs, not at
  // build time where it would fight the line reveal rebuilding these same nodes.
  words.forEach((w, i) => {
    gsap.fromTo(w, { color: CLOSE_FROM }, {
      color: CLOSE_TO, ease: 'none', immediateRender: false,
      scrollTrigger: { id: 'cw-' + i, trigger: sec,
                       start: 'top ' + (top0 - (i / n) * span) + '%',
                       end:   'top ' + (top0 - ((i + 1) / n) * span) + '%',
                       scrub: SCRUB_CONTENT }
    });
  });
}

// ================= STATUE — POSITION IS A PURE FUNCTION OF SCROLL =================
// No gsap.to() in here, on purpose. A time-based tween fired from an onToggle
// runs on wall-clock time no matter how fast you are actually scrolling (fast
// scroll → it lags; slow scroll → it arrives early and sits there), and
// scrubbing back re-fires it with overwrite:true. Every frame solves position
// straight from scrollY, so the statue is wherever the scroll says it is.
const statueWrapEl = document.getElementById('statueWrap');

const LAND_AT   = 0.80;   // pin progress where a traverse ends
const SETTLE    = 0.35;   // of the window left: glide in over this much, dwell for the rest
const ANCHOR_LIFT = 1.1;  // statue CENTRE above the section's bottom edge, x its own size.
                          // Must exceed 0.5 or its lower half hangs out of the section.
const UNDER_GAP = 0.72;   // statue CENTRE below the last line's box, x statue size
const DAMP      = 0.20;   // exponential follow, frame-rate normalised
const ENGAGE_AT = 0.30;   // section top must clear this fraction of vh
const PAD_X     = 0.86, PAD_Y = 1.50;   // exclusion ellipse, x statue size
const WRAP_MIN_COL = 240; // narrower columns get no wrap-hole at all
const FADE_VH   = 0.6;
const frameSecBot = new Map();

// TURNS travelled, read by statue.js. Whole numbers === the statue's ORIGINAL
// state: facing front, at rest depth. That is the contract turnAt() honours.
window.__statueTurn = 0;
const TURN_TRAV = 1;
const TURN_ARC  = 1;
const manifestoPs = gsap.utils.toArray('.manifesto p');
const showLines = (lines) => { if (lines && lines.length) gsap.set(lines, { opacity: 1, y: 0 }); };
const killReveal = (pi) => ScrollTrigger.getAll().forEach(st => { if (st.vars.id && String(st.vars.id).indexOf('ln-' + pi + '-') === 0) st.kill(); });

// zero velocity at BOTH ends (unlike smoothstep), so a traverse eases out of
// the incoming transit and into the outgoing one with no velocity
// discontinuity — that seam is what used to read as a jerk. A function
// DECLARATION: the section envelope above needs it at module-eval time.
function smootherstep(t){ t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * t * (t * (t * 6 - 15) + 10); }
const clamp01 = (t) => t < 0 ? 0 : t > 1 ? 1 : t;

let seats = [], statueSize = 44;
function measureSeats(){
  seats = [];
  ScrollTrigger.getAll().forEach(st => {
    if (!st.vars.id || String(st.vars.id).indexOf('pin-') !== 0) return;
    const sec = st.trigger; if (!sec) return;
    const p = sec.querySelector('p'); if (!p) return;
    const sr = sec.getBoundingClientRect(), pr = p.getBoundingClientRect();
    // PLAIN-layout row count — the paragraph's true depth, solved against a
    // null exclusion, so it describes the layout the paragraph is restored to
    // rather than whatever hole-punched layout it is wearing at refresh time.
    const plainRows = computeRows(p, null, p.clientWidth);
    seats.push({
      sec, p, pi: manifestoPs.indexOf(p),
      start: st.start, end: st.end,
      colLeft: pr.left, colW: pr.width,
      top: pr.top - sr.top,     // === viewport top once pinned (pin puts sec.top at 0)
      h: pr.height,
      secH: sr.height,          // === viewport BOTTOM once pinned, same reason
      LH: prepareParagraph(p).LH,
      nRows: plainRows.length || 1,
      traverses: sec.hasAttribute('data-traverse'),
      side: sec.classList.contains('side-right') ? 1 : -1
    });
  });
  // ---- THE CLOSING SECTION GETS A SEAT TOO ----
  // .m-close is deliberately not pinned, so it never produced a 'pin-' trigger
  // and the loop above could not see it: the statue's last anchor was section
  // 06 and the closing line had nothing standing under it. Its seat is
  // MEASURED rather than pinned — "from where its foot clears the viewport
  // floor, to where the coda has been read".
  const closeSec = document.querySelector('.manifesto.m-close');
  const closeP   = closeSec && closeSec.querySelector('p');
  if (closeSec && closeP){
    const cr = closeSec.getBoundingClientRect();
    const cpr = closeP.getBoundingClientRect();
    const docTop = cr.top + window.scrollY;
    const coda = document.getElementById('coda');
    const codaBot = coda ? coda.getBoundingClientRect().bottom + window.scrollY : docTop + cr.height;
    seats.push({
      sec: closeSec, p: closeP, pi: manifestoPs.indexOf(closeP),
      start: Math.max(0, docTop + cr.height - VH),
      // Ends where the coda has arrived, NOT at maxScroll: the page now
      // continues past the manifesto into the visit section and the footer, and
      // the statue standing over a call to action would be reading as a
      // decoration of it. It hands the page over to the coda's own mark.
      end: Math.max(0, codaBot - VH * 0.55),
      colLeft: cpr.left, colW: cpr.width,
      top: cpr.top - cr.top, h: cpr.height, secH: cr.height,
      LH: prepareParagraph(closeP).LH,
      nRows: (computeRows(closeP, null, closeP.clientWidth) || []).length || 1,
      traverses: false, side: -1
    });
  }
  seats.sort((a, b) => a.start - b.start);
  seats.forEach((s, i) => { s.idx = i; });
}

// THE axis, as one number.
const pageAxisX = () => root.clientWidth / 2;

// the travelling part, at normalised progress q down the paragraph. The y range
// is the paragraph grown by HALF THE EXCLUSION BOX at each end, so at q=0 and
// q=1 the box is exactly clear of the text and the first/last lines are fully
// re-opened. Exactness earns its keep at q=1: the wrap-hole is handed back to
// plain layout there, and that can only be a no-op if the hole has already
// closed on its own.
function travPoint(s, q, top, h){
  const clear = statueSize * PAD_Y / 2;
  return { x: pageAxisX(), y: (top - clear) + (h + 2 * clear) * smootherstep(q) };
}

// THE FULL STOP — centred under the paragraph, one clear gap below its last
// line. The y comes from the PLAIN row count (nRows x LH), never from a live
// rect: while the statue is still traversing, the paragraph is wearing a
// wrap-hole and is up to a line taller, so a live height would drag the
// landing down and snap back the moment the hole closed.
function punctPoint(s, top){
  return { x: pageAxisX(), y: top + s.nRows * s.LH + statueSize * UNDER_GAP };
}

// ================= THE ONE TRAVERSE =================
// Six sections of the statue walking through the prose was six times the same
// trick, and the trick competes with the reading. It happens once, in the
// SANCTUARY section (data-traverse in the markup), where the subject is an
// object being walked around. Everywhere else the statue hangs at the foot of
// the section as its punctuation, and the section carries it.
//
// wrapP is the contract that keeps that honest: it names the ONE paragraph
// allowed to re-flow, and only while the statue is actually inside it. The
// previous build tested `s.p !== tgt.holdP`, and the between-section branch
// returned no holdP at all — so `s.p !== undefined` was true for every
// candidate and a hole could punch open in a neighbouring paragraph mid-transit,
// the one case the design said could not happen.
function traverse(s, u, liveRect){
  if (!s.traverses){
    const bot = frameSecBot.has(s.idx) ? frameSecBot.get(s.idx) : s.secH;
    return { x: pageAxisX(), y: bot - statueSize * ANCHOR_LIFT, wrapP: null };
  }
  if (u <= LAND_AT){
    const pt = travPoint(s, u / LAND_AT, s.top, s.h);
    return { x: pt.x, y: pt.y, wrapP: s.p };
  }
  const a = travPoint(s, 1, s.top, s.h), b = punctPoint(s, s.top);
  const e = smootherstep(clamp01(((u - LAND_AT) / (1 - LAND_AT)) / SETTLE));
  return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, wrapP: null };
}

// ================= LOGO PHASE — the statue IS the mark, then leaves it =======
// Before the first seat this used to be dead scroll. The statue spends it
// standing at the centre of the concentric mark, turning as the rings draw
// themselves, then walks out to take up its job as the reader's guide.
// Both turn counts are WHOLE: a whole number of turns is pose-identical to
// zero, so the hand-off into the schedule needs no correction and no seam.
const LOGO_TURNS = 1, EXIT_TURNS = 1;
const LOGO_FIT   = 1.18;   // wrap px / measured figure height — the model does
                           // not fill its square canvas, so the wrap runs a
                           // little larger for the GLB to read at the same
                           // optical size as the outline it replaces
const logoGlyph  = document.querySelector('.rings-gold .logo-center');
const HAS_LOGO_PHASE = !!logoGlyph;
const holdEnd = () => VH * 1.75;   // hero-track(100vh transition) + contemplation(75vh)

function logoSeat(){
  const r = logoGlyph.getBoundingClientRect();
  if (!r.height) return null;
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, size: r.height * LOGO_FIT };
}

function logoStateAt(sy, first){
  const seat = logoSeat();
  if (!seat) return null;
  const xs = holdEnd();
  if (sy <= xs){
    // PARKED IN THE MARK. The spin is driven by tl.progress(), NOT by scrollY:
    // that is the smoothed playhead the ring bands themselves animate on.
    // Reading raw scroll here would let the statue run ahead of its own rings.
    return { x: seat.x, y: seat.y, size: seat.size, turn: tl.progress() * LOGO_TURNS, wrapP: null };
  }
  const span = Math.max(1, first.start - xs);
  const e = smootherstep(clamp01((sy - xs) / span));
  const b = traverse(first, 0, null);
  // Straight down out of the mark: the rings sit at left:50%, so the mark's
  // centre and the page's centre line are the same x. The statue drops onto the
  // axis it was already standing on and never leaves it again.
  return {
    x: seat.x + (b.x - seat.x) * e,
    y: seat.y + (b.y - seat.y) * e,
    size: seat.size + (statueSize - seat.size) * e,
    turn: LOGO_TURNS + e * EXIT_TURNS,
    wrapP: null
  };
}

function statueTargetAt(sy, liveRect, liveIdx){
  if (!seats.length) return null;
  const rectFor = (i) => (i === liveIdx ? liveRect : null);
  const first = seats[0], last = seats[seats.length - 1];
  if (sy <= first.start) return traverse(first, 0, rectFor(0));
  if (sy >= last.end)    return traverse(last, 1, rectFor(seats.length - 1));
  for (let i = 0; i < seats.length; i++){
    const s = seats[i];
    if (sy > s.end) continue;
    if (sy >= s.start) return traverse(s, (sy - s.start) / (s.end - s.start), rectFor(i));
    const prev = seats[i - 1];
    const span = s.start - prev.end;
    const e = smootherstep(span > 0 ? clamp01((sy - prev.end) / span) : 1);
    const a = traverse(prev, 1, rectFor(i - 1));
    const b = traverse(s, 0, rectFor(i));
    // NO BOW. On a plumb line the transit between sections is simply the
    // remaining vertical distance, eased — x is already identical at both ends.
    return { x: a.x, y: a.y + (b.y - a.y) * e, wrapP: null };
  }
  return null;
}

function statueOpacity(sy){
  const first = seats[0], last = seats[seats.length - 1];
  const r = VH * FADE_VH;
  // With the logo phase the statue is on screen from the first pixel — it IS
  // the centre of the mark — so there is nothing to fade in.
  if (sy < first.start) return HAS_LOGO_PHASE ? 1 : clamp01((sy - (first.start - r)) / r);
  if (sy > last.end)    return clamp01(1 - (sy - last.end) / r);
  return 1;
}

// THE TURN — same segmentation as statueTargetAt, so rotation and travel are
// two readings of one path. It advances only while the statue MOVES, and is a
// WHOLE number of turns at every landing. Undamped on purpose: position can lag
// and be forgiven, a resting statue frozen three-quarters turned away cannot.
function turnAt(sy){
  const n = seats.length, per = TURN_TRAV + TURN_ARC;
  const first = seats[0], last = seats[n - 1];
  if (sy <= first.start) return 0;
  if (sy >= last.end)    return (n - 1) * per + TURN_TRAV;
  for (let i = 0; i < n; i++){
    const s = seats[i];
    if (sy > s.end) continue;
    if (sy >= s.start){
      const u = (sy - s.start) / (s.end - s.start);
      return i * per + smootherstep(clamp01(u / LAND_AT)) * TURN_TRAV;
    }
    const prev = seats[i - 1], span = s.start - prev.end;
    return (i - 1) * per + TURN_TRAV + smootherstep(span > 0 ? clamp01((sy - prev.end) / span) : 1) * TURN_ARC;
  }
  return 0;
}

// ================= CHROME — nav, progress bar =================
const chrome     = document.getElementById('chrome');
const progRing   = document.getElementById('progressRing');
const progFill   = document.getElementById('progressFill');
let chromeShown = false, lastProg = -1, lastFade = -1;
// Fraction of the descent, from here, over which the bar fades itself out —
// it should read as "the page is finishing", not sit pinned at full width
// once the reader has reached the coda.
const PROG_FADE_FROM = 0.94;

function chromeFrame(sy){
  const show = sy > VH * 0.9;
  if (show !== chromeShown){
    chromeShown = show;
    chrome.classList.toggle('visible', show);
    progRing.classList.toggle('visible', show);
  }
  const max = Math.max(1, document.documentElement.scrollHeight - VH);
  const prog = clamp01(sy / max);
  window.__pageProgress = prog;                 // statue.js walks the key light by this
  const q = Math.round(prog * 400) / 400;       // fine-grained — a bar shows width, not a dash count
  if (q !== lastProg){
    lastProg = q;
    progFill.style.width = (q * 100) + '%';
  }
  const fade = 1 - smootherstep(clamp01((prog - PROG_FADE_FROM) / (1 - PROG_FADE_FROM)));
  const fq = Math.round(fade * 100) / 100;
  if (fq !== lastFade){
    lastFade = fq;
    progRing.style.setProperty('--prog-fade', fq);
  }
}

// ================= THE PAGE'S FRAME FUNCTION =================
// ONE ticker. The rings driver used to be its own, registered first, and it
// called getBoundingClientRect() before writing clip-path and two mask strings
// — so the frame went read → write → read → write and cost TWO forced layouts,
// which is exactly what the careful read/write split inside the statue frame
// existed to avoid. The boundary between the two functions threw away the
// discipline inside them. Merged: every read on the page happens in phase 1,
// every write in phase 3, and the frame costs one forced layout.
const pos = { x: 0, y: 0 };
let posInit = false;
let lastWrapPx = -1, lastPush = -1, circleSettled = false;
const engaged = new Set();

function pageFrame(time, deltaMS){
  if (document.hidden) return;
  const sy = window.scrollY;

  // ---- 1. GLOBAL READ PHASE ----
  const ringsRect = circleSettled ? null : rings.getBoundingClientRect();
  const secVals   = sectionRead();
  frameSecBot.clear();            // rebuilt below; a stale bottom anchors to last frame
  const cands = [];
  let liveIdx = -1, liveRect = null;
  const ready = seats.length > 0;
  if (ready) for (let i = 0; i < seats.length; i++){
    const s = seats[i];
    // only the pinned section and its immediate neighbours can be touched, so
    // this is 1-3 elements, not all seven
    if (sy < s.start - VH * 1.2 || sy > s.end + VH * 1.2) continue;
    const r = s.p.getBoundingClientRect();
    const secR = s.sec.getBoundingClientRect();
    cands.push({ s, r, colW: s.p.clientWidth, secTop: secR.top });
    frameSecBot.set(s.idx, secR.bottom);
    if (sy >= s.start && sy <= s.end){ liveIdx = i; liveRect = r; }
  }
  const logo = (ready && HAS_LOGO_PHASE && sy < seats[0].start) ? logoStateAt(sy, seats[0]) : null;

  // ---- 2. SOLVE ----
  const p = tl.progress();
  const hEnd = holdEnd();
  const tgt = ready ? (logo || statueTargetAt(sy, liveRect, liveIdx)) : null;

  // ---- 3. WRITE ----
  chromeFrame(sy);

  // rings: the circle is DONE once the transition has played out and the hold
  // is behind us. After that R is pinned at 0 and re-writing a clip-path and
  // two radial-gradient mask strings 60 times a second, for twelve viewports,
  // buys nothing but mask re-rasterisation.
  if (ringsRect){
    applyCircle(p, ringsRect);
    if (p > 0.999 && sy > hEnd) circleSettled = true;
  } else if (sy <= hEnd){
    circleSettled = false;        // scrolled back up: the circle is live again
  }
  // fire the shimmer the instant the animation's scroll INPUT completes, not
  // when the scrubbed progress finally settles. Upper bound: a reload restores
  // scroll position, so without it the one-shot would be spent on frame 1, to
  // nobody, on any reload from further down the page.
  if (sy >= VH * 0.98 && sy < hEnd) playShimmer();
  // clamped: past this the mark is off screen and the exact value is invisible
  const push = Math.min(Math.max(0, sy - hEnd), VH * 2.2);
  if (push !== lastPush){ lastPush = push; ringsPush.style.transform = 'translateY(' + (-push) + 'px)'; }

  sectionWrite(secVals, deltaMS);
  if (!tgt) return;

  // Damping absorbs scroll jitter, but its real job is the seat correction:
  // seats are pre-measured from the PLAIN layout, while a live-reflowed
  // paragraph can come out a line taller. Without this every entry pops a line.
  const k = 1 - Math.pow(1 - DAMP, Math.min(3, (deltaMS || 16.7) / 16.7));
  if (!posInit){ pos.x = tgt.x; pos.y = tgt.y; posInit = true; }
  else { pos.x += (tgt.x - pos.x) * k; pos.y += (tgt.y - pos.y) * k; }

  // Exclusion box stays on the TRAVEL size even while the statue is still
  // logo-sized: the box only matters once it is walking through text, and the
  // seats were measured against that size.
  const halfX = statueSize * PAD_X / 2, halfY = statueSize * PAD_Y / 2;
  const box = { left: pos.x - halfX, right: pos.x + halfX, top: pos.y - halfY, bottom: pos.y + halfY };
  window.__statueTurn = logo ? logo.turn : turnAt(sy);
  const curPx = logo ? logo.size : statueSize;

  if (Math.abs(curPx - lastWrapPx) > 0.5){    // sub-pixel churn is invisible and
    lastWrapPx = curPx;                       // a width write costs a relayout
    statueWrapEl.style.width = curPx + 'px';
  }
  // The mark is not one size during the logo phase — it grows as the rings draw
  // themselves. Sizing the backing store once at scroll 0 would leave a 2x
  // upscale at exactly the moment the statue is largest. Grow to the high-water
  // mark instead, never shrink; 8px hysteresis keeps this to a handful of
  // reallocations rather than one per frame.
  if (curPx > (window.__statueMaxPx || 0) + 8){
    window.__statueMaxPx = Math.ceil(curPx);
    if (window.__statueResize) window.__statueResize();
  }
  statueWrapEl.style.transform = 'translate(' + (pos.x - curPx / 2) + 'px,' + (pos.y - curPx / 2) + 'px)';
  statueWrapEl.style.opacity = statueOpacity(sy);

  for (let c = 0; c < cands.length; c++){
    const { s, r, colW, secTop } = cands[c];
    // Engage only once the line-reveal window has cleared: reveals run
    // top 80% → top 25% while the pin starts at top:top, so without this gate
    // the arriving statue and the reveal would fight over the same .ln nodes,
    // and rebuilt nodes lose their tweens.
    const gate = secTop <= VH * ENGAGE_AT;
    const hits = gate && tgt.wrapP === s.p && colW >= WRAP_MIN_COL &&
                 box.bottom > r.top && box.top < r.bottom &&
                 box.right > r.left && box.left < r.right;
    if (hits){
      if (!engaged.has(s.p)){ engaged.add(s.p); killReveal(s.pi); showLines(s.p.__lns); }
      // DON'T RE-SOLVE A HOLE THAT HASN'T MOVED. The solve is ~12 pretext calls
      // plus a row-by-row diff, and it runs on the frame budget of the one
      // section that traverses. Below about half a pixel the obstacle cannot
      // change a single break position, so the whole pass is dead work — and it
      // lands exactly when the reader has stopped scrolling and the damping is
      // still creeping the last fraction of a pixel into place.
      if (Math.abs(pos.y - (s.__reflowY === undefined ? -1e9 : s.__reflowY)) > 0.4 || s.__reflowW !== colW){
        s.__reflowY = pos.y; s.__reflowW = colW;
        reflowParagraph(s.p, box, r, colW);
      }
    } else if (engaged.has(s.p)){
      engaged.delete(s.p);
      s.__reflowY = undefined;                 // re-entry must rebuild
      showLines(layoutParagraph(s.p, null));   // restore plain full-width text
    }
  }
}

// Reduced motion: no traverse, no transit, no per-frame solve. The statue
// parks. It still stands in the mark — that is an identity, not an effect, and
// removing it would leave the sigil hollow — but it does not spin or walk out.
let reducedIdx = -1;
function pageFrameReduced(time, deltaMS){
  if (document.hidden) return;
  const sy = window.scrollY;
  const ringsRect = circleSettled ? null : rings.getBoundingClientRect();
  const secVals = sectionRead();
  const hEnd = holdEnd();

  chromeFrame(sy);
  if (ringsRect){
    applyCircle(tl.progress(), ringsRect);
    if (tl.progress() > 0.999 && sy > hEnd) circleSettled = true;
  } else if (sy <= hEnd) circleSettled = false;
  const push = Math.min(Math.max(0, sy - hEnd), VH * 2.2);
  if (push !== lastPush){ lastPush = push; ringsPush.style.transform = 'translateY(' + (-push) + 'px)'; }
  sectionWrite(secVals, deltaMS);
  if (!seats.length) return;

  if (HAS_LOGO_PHASE && sy < seats[0].start){
    const seat = logoSeat();
    if (seat){
      window.__statueTurn = 0;
      if (Math.abs(seat.size - lastWrapPx) > 0.5){ lastWrapPx = seat.size; statueWrapEl.style.width = seat.size + 'px'; }
      statueWrapEl.style.transform = 'translate(' + (seat.x - seat.size / 2) + 'px,' + (seat.y - seat.size / 2) + 'px)';
      statueWrapEl.style.opacity = 1;
      reducedIdx = -1;
      return;
    }
  }
  if (Math.abs(statueSize - lastWrapPx) > 0.5){ lastWrapPx = statueSize; statueWrapEl.style.width = statueSize + 'px'; }
  let idx = -1;
  for (let i = 0; i < seats.length; i++) if (sy >= seats[i].start && sy <= seats[i].end){ idx = i; break; }
  statueWrapEl.style.opacity = statueOpacity(sy);
  if (idx === reducedIdx) return;
  reducedIdx = idx;
  if (idx < 0) return;
  const s = seats[idx], r = s.p.getBoundingClientRect();
  const b = punctPoint(s, r.top);
  statueWrapEl.style.transform = 'translate(' + (b.x - statueSize / 2) + 'px,' + (b.y - statueSize / 2) + 'px)';
  killReveal(s.pi);
  showLines(layoutParagraph(s.p, null));
}

function refreshStatue(){
  // Clear the inline width FIRST: the logo phase writes an explicit px width
  // every time the size changes, so measuring offsetWidth without this would
  // measure our own last write instead of the CSS vw travel size, and the
  // statue would ratchet.
  statueWrapEl.style.width = '';
  statueSize = statueWrapEl.offsetWidth || 44;
  lastWrapPx = -1; lastPush = -1; circleSettled = false;
  if (HAS_LOGO_PHASE){
    const seat = logoSeat();
    if (seat) window.__statueMaxPx = Math.ceil(seat.size);
  }
  if (window.__statueResize) window.__statueResize();
  measureSeats();
  measureEnvelope();
  posInit = false;
  reducedIdx = -1;
}
ScrollTrigger.addEventListener('refresh', refreshStatue);
gsap.ticker.add(REDUCED ? pageFrameReduced : pageFrame);

// ================= PER-SECTION CAPSULES =================
// THE MANIFEST. Every capsule image on the page is listed here and nowhere
// else — drop a file into assets/img/ and add its basename to a section and it
// appears, at three formats, with the right alt text. The previous build filled
// all eighteen slots with flat hexes from the palette, which is not a
// placeholder so much as a missing asset with the lights left on.
//
// Slots with no photograph render as a PLATE: the mark, faint, on navy. A
// section with a photograph shows the plate first and the photograph slides
// over it, so the capsule reads as developing into the artefact rather than as
// a slideshow with gaps in it.
const IMAGES = {
  'manifesto-structure': [{ file: 'cap-neolithic', alt: 'Neolithic wall painting from the Matera territory.' }],
  'manifesto-sanctuary': [{ file: 'cap-trera',     alt: 'Seventh-century BC Trera pottery, reproduced philologically.' }],
  'manifesto-senses':    [{ file: 'cap-enotrian',  alt: 'Enotrian decorative work in ochre and black.' }]
};
const PLATE_SVG = '<svg viewBox="0 0 1000 1000" aria-hidden="true"><use href="#mk-ring2"/></svg>';

function buildSections(){
  gsap.utils.toArray('.manifesto').forEach((sec, sidx) => {
    // Closing section: no images, no pin, no statue seat from here.
    if (sec.classList.contains('m-close')) return;
    if (!sec.querySelector('.section-imgs')){
      const panel = document.createElement('div');
      panel.className = 'section-imgs';
      const shots = IMAGES[sec.id] || [];
      // plate first, photographs over it
      const plate = document.createElement('div');
      plate.className = 'slide plate';
      plate.innerHTML = PLATE_SVG;
      panel.appendChild(plate);
      shots.forEach(shot => {
        const d = document.createElement('div');
        d.className = 'slide';
        // window.__IMG exists only in the single-file build, where every image
        // is already a data: URI and there is nothing left to negotiate.
        d.innerHTML = (window.__IMG && window.__IMG[shot.file])
          ? '<img src="' + window.__IMG[shot.file] + '" alt="' + shot.alt + '" decoding="async">'
          : '<picture>' +
              '<source type="image/avif" srcset="assets/img/' + shot.file + '.avif">' +
              '<source type="image/webp" srcset="assets/img/' + shot.file + '.webp">' +
              '<img src="assets/img/' + shot.file + '.jpg" alt="' + shot.alt + '" loading="lazy" decoding="async">' +
            '</picture>';
        panel.appendChild(d);
      });
      sec.appendChild(panel);
    }
    const imgs = [...sec.querySelectorAll('.section-imgs .slide')];
    const N = imgs.length;
    const sign = sec.classList.contains('side-right') ? -1 : 1;   // in from the MARGIN side
    imgs.forEach((im, i) => { im.style.zIndex = i; im.style.transform = 'translateX(' + (i === 0 ? 0 : 100 * sign) + '%)'; });

    // PIN LENGTH IS THE PARAGRAPH'S LENGTH. It was a flat 2.1 viewports for
    // every section, so a three-line paragraph held the page for exactly as
    // long as a nine-line one and section 05 read as a wait. This is the same
    // argument the line-reveal cadence already makes, applied one level up.
    const p = sec.querySelector('p');
    const pinLen = () => {
      const rows = p ? (computeRows(p, null, p.clientWidth).length || 1) : 5;
      const extra = sec.hasAttribute('data-traverse') ? 0.55 : 0;   // the traverse needs room to read
      return Math.round(VH * Math.min(2.6, Math.max(1.3, 0.85 + 0.16 * rows + extra)));
    };
    ScrollTrigger.create({
      trigger: sec, start: 'top top', end: () => '+=' + pinLen(),
      pin: true, pinSpacing: true, scrub: SCRUB_SYSTEM,
      id: 'pin-' + (sec.id || sidx), invalidateOnRefresh: true,
      onUpdate: N < 2 ? null : self => {
        const prog = self.progress, seg = 1 / (N - 1);
        for (let i = 1; i < N; i++){
          let local = (prog - (i - 1) * seg) / seg;
          local = local < 0 ? 0 : local > 1 ? 1 : local;
          // quintic: zero ACCELERATION at both ends. Cubic smoothstep has zero
          // velocity but finite acceleration, so beside the statue — which has
          // always used smootherstep — the capsule slide began with a small
          // kick nothing else on the page has. One curve.
          imgs[i].style.transform = 'translateX(' + ((1 - smootherstep(local)) * 100 * sign) + '%)';
        }
      }
    });
  });
}

// ================= AMBIENT SOUND =================
// Opt-in, off by default, synthesised — no asset, no autoplay, and the button
// press is itself the user gesture the audio policy requires. Two detuned
// oscillators under a low-pass with a slow amplitude drift: a room tone, not
// a track.
const soundBtn = document.getElementById('soundToggle');
let audio = null;
function toggleSound(){
  const on = soundBtn.getAttribute('aria-pressed') === 'true';
  if (on){
    if (audio) audio.gain.gain.linearRampToValueAtTime(0, audio.ctx.currentTime + 1.2);
    soundBtn.setAttribute('aria-pressed', 'false');
    return;
  }
  if (!audio){
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const gain = ctx.createGain(); gain.gain.value = 0;
    const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 420; filter.Q.value = 0.7;
    [55, 82.41, 110.5].forEach((f, i) => {                   // A1, E2, A2 — an open fifth
      const o = ctx.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sine';
      o.frequency.value = f;
      o.detune.value = (i - 1) * 6;
      const g = ctx.createGain(); g.gain.value = i === 2 ? 0.16 : 0.4;
      o.connect(g); g.connect(filter); o.start();
    });
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.06;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 60;
    lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();
    filter.connect(gain); gain.connect(ctx.destination);
    audio = { ctx, gain };
  }
  if (audio.ctx.state === 'suspended') audio.ctx.resume();
  audio.gain.gain.linearRampToValueAtTime(0.09, audio.ctx.currentTime + 2.5);
  soundBtn.setAttribute('aria-pressed', 'true');
}
soundBtn.addEventListener('click', toggleSound);
// Never leave a drone playing into a tab the reader has left.
document.addEventListener('visibilitychange', () => {
  if (!audio) return;
  const target = document.hidden ? 0 : (soundBtn.getAttribute('aria-pressed') === 'true' ? 0.09 : 0);
  audio.gain.gain.linearRampToValueAtTime(target, audio.ctx.currentTime + 0.4);
});

// ================= LANGUAGE =================
// The copy lives here, not in the markup, so a locale swap is one innerHTML
// write per node followed by the same rebuild a resize does. The Italian is a
// DRAFT: it is a faithful rendering of the English, but this is a real venue's
// manifesto and it should be read by whoever wrote the original before it ships.
const LOCALES = {
  it: {
    'nav.visit':  'Soggiorna',
    'nav.sound':  'Suono',
    's1': 'Il <strong>MOY&Sigma;EION</strong> è un luogo dove si può soggiornare per rivivere, in modo immersivo e multisensoriale, esperienze di vita appartenenti al mondo della <strong>Magna Grecia</strong> (dal VII al IV secolo a.C.) e dei popoli che abitarono il territorio di Matera prima dei coloni greci (IV millennio – VII secolo a.C.).',
    's2': 'La struttura occupa circa mille metri quadri all’interno dei Sassi di Matera, dove sono state ricostruite tre case <a href="/houses">neolitiche</a>, cinque case <a href="/houses">enotrie</a> e otto case della <a href="/houses">Magna Grecia</a>, accanto ad aree destinate alla vita comune.',
    's3': 'Vi si trova la ricostruzione di un <a href="https://www.moyseion.com/water-sanctuary">Santuario delle Acque</a> dedicato alla dea <strong>Demetra</strong>. Arredi e manufatti sono stati, per quanto possibile, riprodotti filologicamente con tecniche di archeologia sperimentale. I bagni, l’impianto idrico e di climatizzazione, i materassi e tutti i dispositivi richiesti dalle norme igienico-sanitarie non fanno parte dell’allestimento.',
    's4': 'Il soggiorno comprende inoltre, per chi lo desidera, la partecipazione a una serie di rituali accompagnati da musiche e danze: il rituale della <a href="/rituals">Xenia</a> (l’accoglienza dell’ospite), il <a href="/water-sanctuary-ritual">rituale del Santuario delle Acque</a>, il rituale del <a href="/rituals">Simposio</a> e il rituale del Pasto del Mattino. Durante i rituali agli ospiti è richiesto di indossare costumi appropriati.',
    's5': 'Luci, suoni, danze, profumi, tessuti, cibi, gioielli, cosmetici e prodotti per la cura del corpo sono tutti riproduzioni filologiche di prodotti esistiti in epoca magnogreca.',
    's6': 'Ma soprattutto il MOY&Sigma;EION è un luogo dello spirito, dove si può tentare di riaccendere quelle scintille del passato che ci sono state trasmesse, ma che oggi giacciono biologicamente sopite dentro di noi. Un luogo dove acquisire esperienze culturali tramandate da altre civiltà e da altre epoche, la cui originaria dimensione affettiva può essere in parte recuperata; dove scoprire <strong>mostri sublimi</strong>, la cui profondità rende la nostra conoscenza razionale inadeguata alla nuova percezione della condizione umana.',
    's7': 'Vivi il MOY&Sigma;EION e forse diventerai una persona un po’ diversa; nel peggiore dei casi, avrai deciso di restare la stessa.',
    'visit.h':    'I soggiorni si concordano, per piccoli gruppi.',
    'visit.p':    'Il MOY&Sigma;EION non è un museo da attraversare. Diteci chi viene e quando, e vi diremo quali case sono libere e quali rituali cadono in quella settimana.',
    'visit.cta1': 'Prenota un soggiorno',
    'visit.cta2': 'Guarda le case',
    'foot.where': 'Sassi di Matera, Basilicata',
    'foot.contact': 'Contatti',
    'foot.privacy': 'Privacy'
  }
};
const EN = {};
document.querySelectorAll('[data-i18n]').forEach(el => { EN[el.dataset.i18n] = el.innerHTML; });

function setLang(lang, rebuild){
  const dict = lang === 'en' ? EN : LOCALES[lang];
  if (!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = dict[el.dataset.i18n];
    if (v === undefined) return;
    el.innerHTML = v;
    // prepareParagraph caches the ORIGINAL html the first time it sees a node
    // and reads from that cache forever after, because by then the node has
    // been replaced by .ln wrappers. A locale change has to invalidate both
    // that and the pretext prepare keyed on layoutGen.
    delete el.dataset.origHtml;
    el.__pt = null; el.__lns = null; el.__rows = null;
  });
  root.lang = lang;
  document.querySelectorAll('.lang-opt').forEach(b =>
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
  try { localStorage.setItem('moy-lang', lang); } catch (e) {}
  if (rebuild) relayout();
}
document.querySelectorAll('.lang-opt').forEach(b =>
  b.addEventListener('click', () => setLang(b.dataset.lang, true)));

// ================= REBUILD — ONE HANDLER, ONE ORDER, ONE REFRESH =================
// There were three resize listeners: a 200ms debounce here, a 300ms one at the
// bottom of the file, and an undebounced one in the three.js module. They fired
// in an order nothing guaranteed, and ScrollTrigger.refresh() ran twice per
// resize — once against a half-updated layout.
function relayout(){
  layoutGen++;            // invalidate every cached pretext prepare: the
                          // clamp(...vw...) font size or the words may have changed
  fitWordmark();
  publishWordmarkZone();  // BEFORE buildLineReveals: the reserved band changes
                          // the sections' padding, so the splitter must measure
                          // against the post-reserve box
  buildLineReveals();     // ends with its own ScrollTrigger.refresh()
  buildCloseShimmer();    // the rebuild above threw away the closing word spans
  ScrollTrigger.refresh();
}

let resizeT;
window.addEventListener('resize', () => {
  if (!significantResize()) return;   // an iOS address bar is not a resize
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    VH = window.innerHeight; VW = root.clientWidth;
    publishVH();
    if (window.__statueResize) window.__statueResize();
    relayout();
  }, 200);
});

// ================= BOOT =================
// buildSections adds ~9,000px of pin spacers to the document height, and
// buildCloseShimmer positions its triggers against that height. Built any
// earlier, every start/end lands near 7k in a 17k document and the closing
// sentence arrives pre-ignited. Order here is load-bearing.
function boot(){
  prepareWordmark();
  fitWordmark();
  publishWordmarkZone();
  buildLineReveals();
  buildSections();
  buildCloseShimmer();
  ScrollTrigger.refresh();
  try {
    const saved = localStorage.getItem('moy-lang');
    if (saved && saved !== 'en') setLang(saved, true);
  } catch (e) {}
}
if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot); else boot();
