/* PRACTICAL INFORMATION: one full-bleed panel, fixed to the bottom of the viewport, on every page.
   Single source: it injects its own style and markup, so a page only has to load this file.
   Closed: a slim bar with the two facts a guest looks for first. Open: at most 30vh, four columns, each with its own mark. */
(function(){
  if (document.getElementById('logistics')) return;
  var here = document.currentScript && document.currentScript.src;
  var draft = window.__LOGI_DRAFT || (here ? new URL('draft.html', here).href : 'draft.html');
  var css = ''
  + ':root{--logi-bar:3.25rem}'
  + 'body{padding-bottom:var(--logi-bar)}'
  + '.logi{position:fixed;left:0;bottom:0;width:100vw;z-index:55;background:var(--navy,#010416);border-top:1px solid rgba(131,109,48,.55);text-align:left;font-family:var(--font,"GFS Neohellenic","Gill Sans",serif)}'
  + '.logi.logi-wait{transform:translateY(100%);visibility:hidden;pointer-events:none}'
  + '.logi{transition:transform .5s ease,visibility 0s}.logi.logi-wait{transition:transform .5s ease,visibility 0s linear .5s}'
  + '.logi summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:1.4rem;height:var(--logi-bar);padding:0 1rem;font-size:.72rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-bright,#f1dca4)}'
  + '.logi summary::-webkit-details-marker{display:none}'
  + '.logi summary:hover{color:#fff}'
  + '.logi-quick{display:flex;align-items:center;gap:1.1rem;letter-spacing:.2em;color:var(--gold-body,#c2a567)}'
  + '.logi-quick b{font-weight:400;color:var(--gold-bright,#f1dca4)}'
  + '.logi-quick i{width:1px;height:.9rem;background:rgba(131,109,48,.55)}'
  + '.logi summary .plus{position:relative;width:.9rem;height:.9rem;flex:0 0 auto}'
  + '.logi summary .plus::before,.logi summary .plus::after{content:"";position:absolute;left:50%;top:50%;width:100%;height:1px;background:currentColor;transform:translate(-50%,-50%);transition:transform .4s}'
  + '.logi summary .plus::after{transform:translate(-50%,-50%) rotate(90deg)}'
  + '.logi[open] summary .plus::after{transform:translate(-50%,-50%) rotate(0deg)}'
  + '.logi-body{max-height:38.2vh;overflow-y:auto;overscroll-behavior:contain;border-top:1px solid rgba(131,109,48,.28)}'
  + '.logi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));max-width:72rem;margin-inline:auto;animation:logiIn .5s ease}'
  + '.logi-col{padding:1.2rem clamp(1rem,2vw,1.8rem) 1.4rem;border-left:1px solid rgba(131,109,48,.28);min-width:0}'
  + '.logi-col:last-child{border-right:1px solid rgba(131,109,48,.28)}'
  + '.logi-head{display:flex;align-items:center;gap:.8rem;margin-bottom:.9rem}'
  + '.logi-head svg{width:2.1rem;height:2.1rem;flex:0 0 auto;color:var(--gold-body,#c2a567)}'
  + '.logi-head h4{font-weight:400;font-size:.66rem;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-bright,#f1dca4)}'
  + '.logi-col p{margin:0 0 .5rem;font-size:.86rem;line-height:1.5;color:var(--gold-body,#c2a567)}'
  + '.logi-col b{font-weight:400;color:var(--gold-bright,#f1dca4)}'
  + '.logi-col a{color:var(--gold-bright,#f1dca4);text-decoration:none;border-bottom:1px solid rgba(131,109,48,.55)}'
  + '.logi-col a:hover{border-color:var(--gold-bright,#f1dca4)}'
  + '.logi-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.7rem}'
  + '.logi-chips span{font-size:.6rem;letter-spacing:.16em;text-transform:uppercase;padding:.3rem .55rem;border:1px solid rgba(131,109,48,.5);color:var(--gold-body,#c2a567);white-space:nowrap}'
  + '.logi-times{display:grid;grid-template-columns:1fr 1fr;gap:.8rem;margin-bottom:.6rem}'
  + '.logi-times div{border-top:1px solid rgba(131,109,48,.5);padding-top:.5rem}'
  + '.logi-times small{display:block;font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-deep,#836d30);margin-bottom:.2rem}'
  + '.logi-times strong{font-weight:400;font-size:1.7rem;line-height:1;letter-spacing:.02em;color:var(--gold-bright,#f1dca4)}'
  + '.logi-park{display:flex;justify-content:space-between;gap:.8rem;padding:.35rem 0;border-bottom:1px solid rgba(131,109,48,.22);font-size:.84rem;color:var(--gold-body,#c2a567)}'
  + '.logi-park span:last-child{color:var(--gold-bright,#f1dca4);white-space:nowrap;font-size:.74rem;letter-spacing:.08em}'
  + '@keyframes logiIn{from{opacity:0;transform:translateY(-.375rem)}to{opacity:1;transform:none}}'
  + '@media (max-width:900px){.logi-grid{grid-template-columns:1fr 1fr}.logi-col:nth-child(2){border-right:1px solid rgba(131,109,48,.28)}.logi-col:nth-child(n+3){border-top:1px solid rgba(131,109,48,.28)}}'
  + '@media (max-width:560px){.logi-grid{grid-template-columns:1fr}.logi-col{border-right:1px solid rgba(131,109,48,.28);border-top:1px solid rgba(131,109,48,.28)}.logi-quick{display:none}}'
  + '@media (prefers-reduced-motion:reduce){.logi-grid{animation:none}}'
  + 'html[data-theme="light"] .logi{background:#f6f1e9;border-top-color:rgba(131,109,48,.4)}'
  + 'html[data-theme="light"] .logi summary,html[data-theme="light"] .logi-head h4,html[data-theme="light"] .logi-col b,html[data-theme="light"] .logi-col a,html[data-theme="light"] .logi-times strong,html[data-theme="light"] .logi-quick b,html[data-theme="light"] .logi-park span:last-child{color:#7d3217}'
  + 'html[data-theme="light"] .logi-col p,html[data-theme="light"] .logi-head svg,html[data-theme="light"] .logi-chips span,html[data-theme="light"] .logi-park,html[data-theme="light"] .logi-quick{color:#4a3a1c}'
  + 'html[data-theme="light"] .logi-times small{color:#9c3f1c}'
  + 'html[data-theme="light"] .logi,html[data-theme="light"] .logi-col,html[data-theme="light"] .logi-body,html[data-theme="light"] .logi-chips span,html[data-theme="light"] .logi-times div,html[data-theme="light"] .logi-park{border-color:rgba(131,109,48,.3)}';
  var st = document.createElement('style'); st.id = 'logi-css'; st.textContent = css; document.head.appendChild(st);
  var ic = function(d){ return '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; };
  var PIN = ic('<path d="M24 42S10 29 10 19a14 14 0 0 1 28 0c0 10-14 23-14 23z"/><circle cx="24" cy="19" r="5"/>');
  var PHONE = ic('<path d="M14 8h6l3 8-4 3a22 22 0 0 0 10 10l3-4 8 3v6a4 4 0 0 1-4 4C22 38 10 26 10 12a4 4 0 0 1 4-4z"/>');
  var CAR = ic('<path d="M7 29V23l4-9h26l4 9v6M7 29h34M7 29v6h6v-4M41 29v6h-6v-4"/><circle cx="14" cy="26" r="1.4"/><circle cx="34" cy="26" r="1.4"/>');
  var CLOCK = ic('<circle cx="24" cy="24" r="17"/><path d="M24 14v10l7 4"/>');
  var d = document.createElement('details'); d.className = 'logi'; d.id = 'logistics';
  d.innerHTML = '<summary><span>Practical information</span><span class="logi-quick"><span>Check-in <b>22:00</b></span><i></i><span>Check-out <b>11:00</b></span></span><span class="plus" aria-hidden="true"></span></summary><div class="logi-body"><div class="logi-grid">'
  + '<div class="logi-col"><div class="logi-head">' + PIN + '<h4>Find us</h4></div><p><b>Via Gradelle S. Nicola del Sole 3</b><br>75100 Matera</p><div class="logi-chips"><span>Station &middot; 15 min</span><span>Bari airport &middot; 65 km</span><span>Brindisi airport &middot; 110 km</span></div></div>'
  + '<div class="logi-col"><div class="logi-head">' + PHONE + '<h4>Contact</h4></div><p><a href="tel:+3908351971880">+39 0835 1971880</a></p><p><a href="mailto:info@moyseion.com">info@moyseion.com</a></p><p><a href="' + draft + '">Write to us on WhatsApp</a></p></div>'
  + '<div class="logi-col"><div class="logi-head">' + CAR + '<h4>Arrive</h4></div><p><b>Shuttle</b> 08:00 &ndash; 20:00, complimentary. Reserve 24 hours ahead.</p><div class="logi-park"><span>Garage Sassi</span><span>800 m &middot; 10 min</span></div><div class="logi-park"><span>Parcheggio La Martella</span><span>1.5 km &middot; 15 min</span></div></div>'
  + '<div class="logi-col"><div class="logi-head">' + CLOCK + '<h4>Your stay</h4></div><div class="logi-times"><div><small>Check-in</small><strong>by 22:00</strong></div><div><small>Check-out</small><strong>11:00</strong></div></div><div class="logi-chips"><span>Luggage deposit</span><span>Guests 16+</span><span>No pets</span></div></div>'
  + '</div></div>';
  document.body.appendChild(d);
  // a page can hold the panel back until a marker has been scrolled past: data-logi-after on any element
  var gate = document.querySelector('[data-logi-after]');
  if (gate){
    d.classList.add('logi-wait');
    var q = false;
    var check = function(){ q = false; var past = gate.getBoundingClientRect().bottom <= 0; d.classList.toggle('logi-wait', !past); if (!past) d.open = false; };
    var tick = function(){ if (!q){ q = true; requestAnimationFrame(check); } };
    window.addEventListener('scroll', tick, { passive: true }); window.addEventListener('resize', tick); check();
  }
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && d.open) d.open = false; });
  document.addEventListener('pointerdown', function(e){ if (d.open && !d.contains(e.target)) d.open = false; });
})();
