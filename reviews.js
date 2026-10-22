/* REVIEWS BAND: 100vw x 38.2vh, a slow drift of guest reviews, towards the foot of the page; it can be stepped back and
   forth with the two arrows, or dragged / swiped, and it rests while the pointer or the keyboard is on it.
   Fill it by setting window.__REVIEWS before this script, e.g. [{text:'...', author:'Name', rating:5}, ...].
   Until real reviews are supplied it shows clearly marked placeholders: it never invents a review. */
(function(){
  if (document.getElementById('reviewsBand')) return;
  var list = (window.__REVIEWS && window.__REVIEWS.length) ? window.__REVIEWS : [
    { text: 'Review to be supplied.', author: 'Placeholder', rating: 0 },
    { text: 'Review to be supplied.', author: 'Placeholder', rating: 0 },
    { text: 'Review to be supplied.', author: 'Placeholder', rating: 0 },
    { text: 'Review to be supplied.', author: 'Placeholder', rating: 0 }
  ];
  var css = ''
  + '.rev-band{position:relative;z-index:20;width:100vw;height:38.2vh;min-height:13rem;overflow:hidden;display:flex;align-items:center;margin:0;border-top:1px solid rgba(131,109,48,.45);border-bottom:1px solid rgba(131,109,48,.45);background:var(--navy,#010416);font-family:var(--font,"GFS Neohellenic","Gill Sans",serif)}'
  + '.rev-label{position:absolute;left:clamp(1.1rem,4.6vw,4.2rem);top:1rem;z-index:2;font-size:.62rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold-body,#c2a567)}'
  + '.rev-track{display:flex;gap:1.6rem;width:max-content;padding:2.4rem 0 0;will-change:transform;cursor:grab;touch-action:pan-y}.rev-track.is-drag{cursor:grabbing}.rev-track.is-drag .rev-card{pointer-events:none}'
  + '.rev-card{position:relative;flex:0 0 auto;width:clamp(16rem,24vw,22rem);height:calc(38.2vh - 5rem);min-height:8.5rem;overflow:hidden;padding:1.1rem 1.6rem 1rem 2.6rem;border-left:1px solid rgba(131,109,48,.55);display:flex;flex-direction:column;justify-content:space-between;color:var(--gold-body,#c2a567);outline:none;transition:width .6s cubic-bezier(.2,.7,.2,1),background .5s}'
  + '.rev-card::before{content:"\\201C";position:absolute;left:.7rem;top:.1rem;font-size:3.2rem;line-height:1;color:var(--gold-deep,#836d30)}'
  + '.rev-card p{margin:0;font-size:.95rem;line-height:1.55;color:var(--gold-bright,#f1dca4);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}'
  + '.rev-card .rev-meta{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding-top:.7rem;font-size:.66rem;letter-spacing:.24em;text-transform:uppercase}'
  + '.rev-card:hover,.rev-card:focus-visible{width:clamp(22rem,46vw,42rem);background:linear-gradient(90deg,rgba(241,220,164,.06),transparent 80%)}'
  + '.rev-card:hover p,.rev-card:focus-visible p{display:block;overflow-y:auto;max-height:100%;-webkit-line-clamp:unset}'
  + '.rev-stars{letter-spacing:.2em;color:var(--gold-bright,#f1dca4)}'
  + '.rev-nav{position:absolute;right:clamp(1.1rem,4.6vw,4.2rem);top:.6rem;z-index:3;display:flex;gap:.6rem}'
  + '.rev-nav button{display:grid;place-items:center;width:2.2rem;height:2.2rem;padding:0;border:1px solid rgba(131,109,48,.55);border-radius:50%;background:none;color:var(--gold-body,#c2a567);font:inherit;font-size:.9rem;cursor:pointer;transition:border-color .3s,color .3s,transform .4s}'
  + '.rev-nav button:hover,.rev-nav button:focus-visible{border-color:var(--gold-bright,#f1dca4);color:var(--gold-bright,#f1dca4)}'
  + '.rev-nav button[data-d="-1"]:hover{transform:translateX(-.15rem)}.rev-nav button[data-d="1"]:hover{transform:translateX(.15rem)}'
  + 'html[data-theme="light"] .rev-nav button{color:#9c3f1c}'
  + '.rev-cta{position:relative;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.2vh;height:23.6vh;min-height:12rem;box-sizing:border-box;padding:0 1rem;text-align:center;font-family:var(--font,"GFS Neohellenic","Gill Sans",serif)}'
  + '.rev-cta p{margin:0;font-size:.78rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-body,#c2a567)}'
  + '.rev-cta h3{margin:0;font-weight:400;font-size:clamp(1.4rem,2.4vw,2.4rem);line-height:1.15;color:var(--gold-bright,#f1dca4);max-width:22em;text-wrap:balance}'
  + '.rev-cta em{max-width:40em;font-size:clamp(.92rem,1.1vw,1.08rem);line-height:1.55;color:var(--gold-body,#c2a567)}'
  + '.rev-cta a{display:inline-flex;align-items:center;justify-content:center;font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;padding:.9rem 2rem;border:1px solid var(--gold-body,#c2a567);color:var(--gold-bright,#f1dca4);text-decoration:none;transition:background .3s,color .3s,border-color .3s}'
  + '.rev-cta a:hover,.rev-cta a:focus-visible{background:var(--gold-body,#c2a567);border-color:var(--gold-body,#c2a567);color:var(--navy,#010416)}'
  + '.mnav.cta-away .mn-cta{opacity:0;visibility:hidden;pointer-events:none;transition:opacity .5s ease,visibility 0s linear .5s}'
  + 'html[data-theme="light"] .rev-cta p{color:#9c3f1c}html[data-theme="light"] .rev-cta a{color:#8f3a1a;border-color:#9c3f1c}html[data-theme="light"] .rev-cta a:hover{background:#9c3f1c;color:#fff}'
  + 'html[data-theme="light"] .rev-band{background:#f6f1e9}'
  + 'html[data-theme="light"] .rev-card p{color:#7d3217}html[data-theme="light"] .rev-card,html[data-theme="light"] .rev-label{color:#9c3f1c}html[data-theme="light"] .rev-card{border-left-color:rgba(131,109,48,.55)}';
  var st = document.createElement('style'); st.id = 'rev-css'; st.textContent = css; document.head.appendChild(st);
  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }
  var cards = list.map(function(r){
    var n = Math.max(0, Math.min(5, r.rating | 0));
    return '<article class="rev-card" tabindex="0"><p>' + esc(r.text) + '</p><div class="rev-meta"><span>' + esc(r.author) + '</span>' + (n ? '<span class="rev-stars" aria-label="' + n + ' out of 5">' + new Array(n + 1).join('&#9733;') + '</span>' : '') + '</div></article>';
  }).join('');
  var band = document.createElement('section'); band.className = 'rev-band'; band.id = 'reviewsBand'; band.setAttribute('aria-label', 'Reviews');
  band.innerHTML = '<span class="rev-label">Reviews</span><div class="rev-nav"><button type="button" data-d="-1" aria-label="Previous">&larr;</button><button type="button" data-d="1" aria-label="Next">&rarr;</button></div><div class="rev-track">' + cards + cards + cards + cards + '</div>';
  var cta = document.createElement('div'); cta.className = 'rev-cta';
  cta.innerHTML = '<p>Plan a stay</p><h3>Choose the era you will sleep in.</h3><em>Every stay includes the Water Sanctuary of Demeter and, for those who want them, the rituals.</em><a href="' + (window.__REV_PLAN || ((window.__NAV_BASE || '') + 'draft.html')) + '">Plan your stay</a>';
  var foot = Array.prototype.slice.call(document.querySelectorAll('footer')).filter(function(x){ return !x.closest('.rev-card'); })[0];
  if (foot && foot.parentNode){ foot.parentNode.insertBefore(band, foot); foot.parentNode.insertBefore(cta, foot); } else { document.body.appendChild(band); document.body.appendChild(cta); }
  // the drift: one offset, written once a frame. Four copies of the cards; the offset wraps by one copy, so it never ends.
  var track = band.querySelector('.rev-track'), x = 0, target = null, hold = false, drag = null, unit = 0, last = 0, seen = true;
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function step(){ var c = track.querySelector('.rev-card'), g = parseFloat(getComputedStyle(track).columnGap) || 0; return c ? c.offsetWidth + g : 300; }
  function wrap(){
    unit = track.scrollWidth / 4; if (!unit) return;
    while (x >= unit){ x -= unit; if (target !== null) target -= unit; if (drag) drag.x0 -= unit; }
    while (x < 0){ x += unit; if (target !== null) target += unit; if (drag) drag.x0 += unit; }
  }
  function frame(t){
    var dt = last ? Math.min(64, t - last) : 16; last = t;
    if (target !== null){ x += (target - x) * Math.min(1, dt / 120); if (Math.abs(target - x) < 0.5){ x = target; target = null; } }
    else if (!hold && !drag && !reduce && seen) x += dt * 0.02;
    wrap(); track.style.transform = 'translate3d(' + (-x).toFixed(2) + 'px,0,0)';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  band.querySelectorAll('.rev-nav button').forEach(function(b){
    b.addEventListener('click', function(){ var d = +b.getAttribute('data-d'), from = target === null ? x : target, s = step(); target = (Math.round(from / s) + d) * s; });
  });
  band.addEventListener('pointerenter', function(){ hold = true; }); band.addEventListener('pointerleave', function(){ hold = false; });
  band.addEventListener('focusin', function(){ hold = true; }); band.addEventListener('focusout', function(){ hold = false; });
  track.addEventListener('pointerdown', function(e){ if (e.button) return; drag = { px: e.clientX, x0: x, moved: false }; target = null; track.setPointerCapture(e.pointerId); });
  track.addEventListener('pointermove', function(e){ if (!drag) return; var dx = e.clientX - drag.px; if (Math.abs(dx) > 4){ drag.moved = true; track.classList.add('is-drag'); } x = drag.x0 - dx; });
  function end(){ if (!drag) return; var s = step(); if (drag.moved) target = Math.round(x / s) * s; drag = null; track.classList.remove('is-drag'); }
  track.addEventListener('pointerup', end); track.addEventListener('pointercancel', end);
  if ('IntersectionObserver' in window) new IntersectionObserver(function(es){ seen = es[0].isIntersecting; }).observe(band);
  // one ask on screen: the bar's plan button steps aside while this one is in view
  if ('IntersectionObserver' in window){
    new IntersectionObserver(function(es){ var n = document.getElementById('mnav'); if (n) n.classList.toggle('cta-away', es[0].isIntersecting); }, { threshold: 0.4 }).observe(cta);
  }
})();
