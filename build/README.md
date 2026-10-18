# MOYΣEION homepage — rebuilt

`Moyseion Hero Landing Page - MOTION.html` in the parent folder is untouched. This is the
same page, split and fixed. Serve it (ES modules need a server): `python3 -m http.server`.

    index.html          markup + one inlined copy of the concentric mark
    css/style.css       tokens, layout, reduced-motion
    js/motion.js        scroll choreography, text layout, i18n, sound
    js/statue.js        three.js — the GLB, its pose and its light
    assets/             font subsets, images (avif/webp/jpg), statue.glb

## Left for you

- **Photographs.** Three of six capsules have one. Add files to `assets/img/` and list them
  in `IMAGES` in `js/motion.js` — nothing else to change. Slots without a photo render as a
  plate (the mark, faint on navy), not a blank swatch.
- **The Italian.** `LOCALES.it` in `js/motion.js` is a faithful draft, not a signed-off
  translation. Have whoever wrote the English read it before it ships.
- **Routes.** `/houses`, `/rituals`, `/visit`, `/contact`, `/privacy` are site-relative and
  currently resolve to nothing, same as in the original.
- **OG image URL** is hardcoded to `https://www.moyseion.com/` — change if the host differs.

## Two switches worth knowing

- `data-traverse` on a `<section>` makes the statue walk down through that paragraph with
  the text parting around it. It is on section 03 only, on purpose.
- `SPIN_FULL` in `js/statue.js` restores the original 2π yaw. It is off because the GLB is
  an extruded relief (3.69 × 4.85 × 0.16), so a full turn passes through two edge-on
  slivers and a blank back per turn.
