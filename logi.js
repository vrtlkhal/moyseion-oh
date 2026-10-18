/* PRACTICAL INFORMATION: one full-bleed panel, fixed to the bottom of the viewport, on every page.
   Single source: it injects its own style and markup, so a page only has to load this file.
   Closed: just the summary bar. Open: at most 30vh of content, scrolling inside. */
(function(){
  if (document.getElementById('logistics')) return;
  var here = document.currentScript && document.currentScript.src;
  var draft = window.__LOGI_DRAFT || (here ? new URL('draft.html', here).href : 'draft.html');
  var css = ''
  + ':root{--logi-bar:3.25rem}'
  + 'body{padding-bottom:var(--logi-bar)}'
  + '.logi{position:fixed;left:0;bottom:0;width:100vw;z-index:55;background:var(--navy,#010416);border-top:1px solid rgba(131,109,48,.55);text-align:left;font-family:var(--font,"GFS Neohellenic","Gill Sans",serif)}'
  + '.logi summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:.9rem;height:var(--logi-bar);padding:0 1rem;font-size:.72rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-bright,#f1dca4)}'
  + '.logi summary::-webkit-details-marker{display:none}'
  + '.logi summary:hover{color:#fff}'
  + '.logi summary i{position:relative;width:.9rem;height:.9rem}'
  + '.logi summary i::before,.logi summary i::after{content:"";position:absolute;left:50%;top:50%;width:100%;height:1px;background:currentColor;transform:translate(-50%,-50%);transition:transform .4s}'
  + '.logi summary i::after{transform:translate(-50%,-50%) rotate(90deg)}'
  + '.logi[open] summary i::after{transform:translate(-50%,-50%) rotate(0deg)}'
  + '.logi-body{max-height:30vh;overflow-y:auto;overscroll-behavior:contain}'
  + '.logi-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(1rem,2.4vw,2.4rem);max-width:62rem;margin-inline:auto;padding:.4rem 1.2rem 1.6rem;animation:logiIn .5s ease}'
  + '.logi-grid h4{font-weight:400;font-size:.64rem;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-body,#c2a567);margin-bottom:.8rem;padding-bottom:.6rem;border-bottom:1px solid rgba(131,109,48,.3)}'
  + '.logi-grid p{font-size:.84rem;line-height:1.6;color:var(--gold-body,#c2a567);margin-bottom:.7rem}'
  + '.logi-grid b{font-weight:400;color:var(--gold-bright,#f1dca4)}'
  + '.logi-grid a{color:var(--gold-bright,#f1dca4);text-decoration:underline;text-underline-offset:.2em}'
  + '@keyframes logiIn{from{opacity:0;transform:translateY(-.375rem)}to{opacity:1;transform:none}}'
  + '@media (max-width:820px){.logi-grid{grid-template-columns:1fr 1fr}}'
  + '@media (max-width:520px){.logi-grid{grid-template-columns:1fr}}'
  + '@media (prefers-reduced-motion:reduce){.logi-grid{animation:none}}'
  + 'html[data-theme="light"] .logi{background:#f4efe8;border-top-color:rgba(139,90,43,.4)}'
  + 'html[data-theme="light"] .logi summary{color:#1b1713}'
  + 'html[data-theme="light"] .logi-grid h4{color:#8b5a2b;border-bottom-color:rgba(139,90,43,.3)}'
  + 'html[data-theme="light"] .logi-grid p{color:#2a231b}'
  + 'html[data-theme="light"] .logi-grid b,html[data-theme="light"] .logi-grid a{color:#7a1a1a}';
  var st = document.createElement('style'); st.id = 'logi-css'; st.textContent = css; document.head.appendChild(st);
  var d = document.createElement('details'); d.className = 'logi'; d.id = 'logistics';
  d.innerHTML = '<summary><span>Practical information</span><i aria-hidden="true"></i></summary><div class="logi-body"><div class="logi-grid">'
  + '<div><h4>Address</h4><p>Via San Biagio 27<br>75100 Matera (MT)</p><p>Matera Centrale station, 15 min<br>Bari Airport, 65 km<br>Brindisi Airport, 110 km</p></div>'
  + '<div><h4>Transfer</h4><p>Complimentary shuttle, 08:00 &ndash; 20:00.<br>Reserve 24 hours in advance.</p><p><a href="' + draft + '">Contact us on WhatsApp</a></p></div>'
  + '<div><h4>Parking</h4><p><b>Garage Sassi</b><br>Via D&rsquo;Addozio &middot; 800 m<br>10 min by shuttle</p><p><b>Parcheggio La Martella</b><br>Via Lucana 184 &middot; 1.5 km<br>15 min by shuttle</p></div>'
  + '<div><h4>Your stay</h4><p>Check-in by 22:00<br>Check-out by 11:00<br>Luggage deposit available<br>Guests 16 and over<br>No pets</p></div>'
  + '</div></div>';
  document.body.appendChild(d);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && d.open) d.open = false; });
  document.addEventListener('pointerdown', function(e){ if (d.open && !d.contains(e.target)) d.open = false; });
})();
