// ===========================================================================
//  MOYΣEION — ambient motes
//  A background canvas of slow, drifting specks: dust caught in torchlight,
//  or something less explainable. Independent of motion.js/GSAP on purpose —
//  this is pure atmosphere, not choreography, and it must not go dark just
//  because a CDN script failed elsewhere on the page.
//
//  Motion is a damped random walk, not a clean sine wave: each particle takes
//  small random pushes every frame, pulled gently back to its own baseline
//  drift. A sine wave reads as mechanical the moment two particles are on
//  screen at once and visibly share a rhythm; a walk never repeats itself.
// ===========================================================================
const root = document.documentElement;
const canvas = document.getElementById('particles');

const REDUCED = root.classList.contains('reduced') ||
  (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

if (!canvas || !canvas.getContext || REDUCED) {
  // Static prose, static background. Nothing to build.
} else {
  const ctx = canvas.getContext('2d', { alpha: true });

  // ---- ONE SPRITE, DRAWN MANY TIMES ----------------------------------------
  // A per-particle createRadialGradient() is the kind of thing that is cheap
  // once and ruinous sixty times a frame. Bake the glow into an offscreen
  // sprite exactly once; every particle after that is one drawImage() call.
  const SPRITE_SIZE = 48;
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = SPRITE_SIZE;
  const sctx = sprite.getContext('2d');
  const g = sctx.createRadialGradient(
    SPRITE_SIZE / 2, SPRITE_SIZE / 2, 0,
    SPRITE_SIZE / 2, SPRITE_SIZE / 2, SPRITE_SIZE / 2
  );
  // gold-bright core fading through gold-body into nothing — matches the
  // page's own palette instead of introducing a new colour.
  g.addColorStop(0,    'rgba(241,220,164,0.95)');
  g.addColorStop(0.35, 'rgba(241,220,164,0.4)');
  g.addColorStop(1,    'rgba(194,165,103,0)');
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);

  // ---- SIZE, CAPPED DPR -----------------------------------------------------
  // Retina at full DPR on a canvas this large buys nothing visible for a
  // field of soft 1-5px motes and doubles the fill cost. 1.5 is the ceiling.
  const DPR = Math.min(window.devicePixelRatio || 1, 1.5);
  let W = window.innerWidth, H = window.innerHeight;

  function sizeCanvas(){
    W = window.innerWidth; H = window.innerHeight;
    canvas.width  = Math.round(W * DPR);
    canvas.height = Math.round(H * DPR);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  sizeCanvas();

  // ---- THE FIELD --------------------------------------------------------
  // Count scales with viewport area so a phone isn't paying for a desktop's
  // worth of motes, capped well below where it could show up in a profile.
  const COUNT = Math.max(30, Math.min(90, Math.round((W * H) / 13000)));

  function spawn(p){
    p.x = Math.random() * W;
    p.y = p.fromBottom ? H + Math.random() * 40 : Math.random() * H;
    p.depth = 0.35 + Math.random() * 0.65;    // 0.35 (far, faint, slow) .. 1 (near)
    // Dust-sized, not confetti-sized: ~0.7px far, ~4px at its nearest.
    p.size = (1.1 + Math.random() * 3.0) * (0.4 + 0.6 * p.depth);
    p.baseAlpha = 0.28 + Math.random() * 0.5 * p.depth;
    p.baseRise = (3 + Math.random() * 6) * p.depth;   // px/sec baseline, upward
    p.vx = (Math.random() - 0.5) * 4;
    p.vy = -p.baseRise;
    p.jitter = 5 + Math.random() * 9;                  // px/sec^2-ish, the walk's restlessness
    p.twinklePhase = Math.random() * Math.PI * 2;
    p.twinkleSpeed = 0.0006 + Math.random() * 0.0012;
    return p;
  }
  const particles = [];
  for (let i = 0; i < COUNT; i++) particles.push(spawn({ fromBottom: false }));

  // ---- SCROLL PARALLAX ----------------------------------------------------
  // Nearer motes (depth closer to 1) travel further per pixel of scroll than
  // far ones — the one cue that reads as depth rather than a flat overlay.
  let lastScrollY = window.scrollY;

  let lastT = performance.now();
  let raf = null;

  function frame(t){
    raf = requestAnimationFrame(frame);
    const dt = Math.min(48, t - lastT); // clamp: a tab-switch stall shouldn't fling every particle
    lastT = t;
    const sec = dt / 1000;

    const scrollY = window.scrollY;
    const scrollDelta = scrollY - lastScrollY;
    lastScrollY = scrollY;

    ctx.clearRect(0, 0, W, H);

    for (const p of particles){
      // Random walk: a small push every frame, damped, pulled gently back to
      // this particle's own baseline drift so it wanders without ever running
      // off in one direction.
      p.vx += (Math.random() - 0.5) * p.jitter * sec;
      p.vy += (Math.random() - 0.5) * (p.jitter * 0.6) * sec;
      p.vx *= 0.98;
      p.vy += (-p.baseRise - p.vy) * 0.03;

      p.x += p.vx * sec;
      p.y += p.vy * sec;
      p.y -= scrollDelta * p.depth * 0.35;          // parallax: nearer motes drift more with scroll

      if (p.y < -20){ spawn(p); p.y = H + 20; }
      else if (p.y > H + 20){ spawn(p); p.y = -20; }
      if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;

      const twinkle = 0.5 + 0.5 * Math.sin(t * p.twinkleSpeed + p.twinklePhase);
      ctx.globalAlpha = p.baseAlpha * (0.55 + 0.45 * twinkle);
      const d = p.size * 3;   // sprite has a soft falloff; draw box a few x the visible core
      ctx.drawImage(sprite, p.x - d / 2, p.y - d / 2, d, d);
    }
    ctx.globalAlpha = 1;
  }

  function start(){ if (!raf) { lastT = performance.now(); raf = requestAnimationFrame(frame); } }
  function stop(){ if (raf) { cancelAnimationFrame(raf); raf = null; } }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop(); else start();
  });

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(sizeCanvas, 200);
  });

  start();
}
