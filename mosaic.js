/* THE MOSAIC BANNER. A band of small tesserae laid on a slightly irregular lattice with a hair of grout between them. Seven photographs are each given a region
   of the band (the nearest of seven seeds), so every region shows its photograph in pieces; at the left, the tiles are deep navy in a few shades, forming the ground
   the title stands on. The tiles settle into place from a little disorder on load, and drift against each other, by depth, with the pointer. */
(function(){
  var box = document.querySelector('.shards[data-imgs]'); if (!box) return;
  var canvas = box.querySelector('canvas'); if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d'), urls = box.getAttribute('data-imgs').split(','), imgs = [], loaded = 0;
  var light = document.documentElement.getAttribute('data-theme') === 'light';
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches || /[?&]still\b/.test(location.search), fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var NAVY = light ? ['#efe7da', '#eadfce', '#f1eadf', '#e8dcc9', '#ede3d3'] : ['#050b22', '#071028', '#060d25', '#091330', '#04091d'];
  var tiles = [], W = 0, H = 0, dpr = 1, regions = [], start = 0, px = 0, py = 0, raf = 0;
  function rnd(a){ a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }
  var seq = 0; function r(){ return rnd(++seq * 7919); }
  function build(){
    seq = 0; var rect = box.getBoundingClientRect(); W = Math.max(1, rect.width); H = Math.max(1, rect.height); dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    var rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16, T = rem * 1.7;
    var cols = Math.max(6, Math.round(W / T)), rows = Math.max(4, Math.round(H / T)), cw = W / cols, ch = H / rows;
    var narrow = window.matchMedia('(max-width:60rem)').matches;
    // lattice of corners, jittered inside, straight on the border
    var V = []; for (var j = 0; j <= rows; j++){ V[j] = []; for (var i = 0; i <= cols; i++){
      var x = i * cw, y = j * ch; if (i > 0 && i < cols) x += (r() - .5) * cw * .55; if (j > 0 && j < rows) y += (r() - .5) * ch * .55; V[j][i] = [x, y]; } }
    // seven regions: the nearest seed gives a tile its photograph
    var seeds = []; for (var s = 0; s < imgs.length; s++) seeds.push([ (narrow ? 0 : .30) * W + (s + .5) / imgs.length * (narrow ? 1 : .70) * W, (.2 + .6 * r()) * H ]);
    tiles = [];
    for (var jj = 0; jj < rows; jj++) for (var ii = 0; ii < cols; ii++){
      var p = [V[jj][ii], V[jj][ii + 1], V[jj + 1][ii + 1], V[jj + 1][ii]], cx = (p[0][0] + p[1][0] + p[2][0] + p[3][0]) / 4, cy = (p[0][1] + p[1][1] + p[2][1] + p[3][1]) / 4;
      var edge = (.36 - .06 * (cy / H)) * W, isNavy = !narrow && cx < edge, k = -1, bd = 1e12;
      if (!isNavy){ for (var q = 0; q < seeds.length; q++){ var dx = (cx - seeds[q][0]) * .7, dy = cy - seeds[q][1], d = dx * dx + dy * dy; if (d < bd){ bd = d; k = q; } } }
      var g = .085, pts = p.map(function(v){ return [cx + (v[0] - cx) * (1 - g), cy + (v[1] - cy) * (1 - g)]; });
      tiles.push({ pts: pts, cx: cx, cy: cy, k: k, tone: isNavy ? NAVY[Math.floor(r() * NAVY.length)] : null, shade: .9 + r() * .18,
        depth: (r() - .5) * 2, ox: (r() - .5) * cw * 5, oy: (r() - .5) * ch * 5, rot: (r() - .5) * .9, delay: (cx / W) * .55 + r() * .25, bb: bbox(pts) });
    }
  }
  function bbox(pts){ var x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; pts.forEach(function(v){ x0 = Math.min(x0, v[0]); y0 = Math.min(y0, v[1]); x1 = Math.max(x1, v[0]); y1 = Math.max(y1, v[1]); }); return [x0, y0, x1 - x0, y1 - y0]; }
  function cover(img){ // each photograph, scaled to cover the whole band, kept for cheap blits
    if (!img || !img.naturalWidth) return null;
    var c = document.createElement('canvas'); c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); var x = c.getContext('2d');
    var s = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight), w = img.naturalWidth * s, h = img.naturalHeight * s; x.drawImage(img, (c.width - w) / 2, (c.height - h) * .4, w, h); return c;
  }
  function ease(t){ t = Math.max(0, Math.min(1, t)); return 1 - Math.pow(1 - t, 4); }
  function draw(now){
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    var t = reduce ? 9 : (now - start) / 1000;
    tiles.forEach(function(tl){
      var e = ease((t - tl.delay) / 1.15), inv = 1 - e, mx = fine ? px * tl.depth * 7 : 0, my = fine ? py * tl.depth * 5 : 0;
      ctx.save(); ctx.globalAlpha = e;
      ctx.translate(tl.cx + tl.ox * inv + mx, tl.cy + tl.oy * inv + my); ctx.rotate(tl.rot * inv); ctx.translate(-tl.cx, -tl.cy);
      ctx.beginPath(); ctx.moveTo(tl.pts[0][0], tl.pts[0][1]); for (var i = 1; i < 4; i++) ctx.lineTo(tl.pts[i][0], tl.pts[i][1]); ctx.closePath();
      if (tl.tone){ ctx.fillStyle = tl.tone; ctx.fill(); }
      else { ctx.clip(); var b = tl.bb, src = regions[tl.k]; if (src) ctx.drawImage(src, b[0] * dpr, b[1] * dpr, b[2] * dpr, b[3] * dpr, b[0], b[1], b[2], b[3]);
        ctx.fillStyle = tl.shade < 1 ? 'rgba(1,4,22,' + ((1 - tl.shade) * 1.2).toFixed(3) + ')' : 'rgba(255,244,214,' + ((tl.shade - 1) * .5).toFixed(3) + ')'; ctx.fill(); }
      ctx.restore();
    });
  }
  function loop(now){ draw(now); if (!reduce && (now - start) / 1000 < 2.2 || moving) raf = requestAnimationFrame(loop); else raf = 0; }
  var moving = false, still = 0;
  function kick(){ if (!raf) raf = requestAnimationFrame(loop); }
  function init(){ build(); regions = imgs.map(cover); start = performance.now(); raf = 0; kick(); }
  urls.forEach(function(u, i){ var im = new Image(); im.onload = im.onerror = function(){ if (++loaded === urls.length){ init(); } }; im.src = u.trim(); imgs[i] = im; });
  var hero = box.closest('.era-hero') || box;
  if (fine && !reduce){
    hero.addEventListener('pointermove', function(e){ var b = hero.getBoundingClientRect(); px = (e.clientX - b.left) / b.width * 2 - 1; py = (e.clientY - b.top) / b.height * 2 - 1; moving = true; clearTimeout(still); still = setTimeout(function(){ moving = false; }, 400); kick(); });
    hero.addEventListener('pointerleave', function(){ px = 0; py = 0; moving = true; clearTimeout(still); still = setTimeout(function(){ moving = false; }, 700); kick(); });
  }
  var rt = 0; window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(function(){ if (loaded === urls.length){ build(); regions = imgs.map(cover); start = performance.now() - 3000; draw(performance.now()); } }, 200); });
})();
