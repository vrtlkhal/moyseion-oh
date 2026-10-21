/* PAGE INDICATOR: the homepage's big outlined marquee, repeated near the foot of every other page, naming where the reader is: Moyseion + the page. Single source: it injects its own style and markup. The homepage has its own marquees and is skipped. */
(function(){
  var MAP = {
    'moyseion-day.html':    ['Inhabit Moyseion', 'A Day at Moyseion'],
    'moyseion-houses.html': ['Inhabit Moyseion', 'Houses'],
    'moyseion-explore.html': ['Explore', 'Explore'],
    'moyseion-journal.html': ['Explore', 'Journal'],
    'moyseion-archive.html': ['Journal', 'Archive'],
    'moyseion-neolithic.html': ['Houses', 'Neolithic'],
    'moyseion-enotrian.html': ['Houses', 'Enotrian'],
    'moyseion-magnagraecia.html': ['Houses', 'Magna Graecia'],
    'moyseion-press.html':  ['More', 'Press'],
    'draft.html':           ['Draft', 'Not displayed on this live draft']
  };
  var file = (location.pathname.split('/').pop() || '').toLowerCase();
  var path = MAP[file]; if (!path) return;
  var T = function(x){ return window.MoyI18n ? window.MoyI18n.t(x) : x; };
  path = [T(path[0]), T(path[1])];
  if (document.getElementById('pageTick')) return;
  var css = ''
  + '.page-tick{position:relative;z-index:20;overflow:hidden;height:5.6vh;min-height:2.8rem;display:flex;align-items:center;margin:9vh 0 0;border-top:1px solid rgba(131,109,48,.35);border-bottom:1px solid rgba(131,109,48,.35)}'
  + '.page-tick small{display:none}'
  + '.page-tick div{display:flex;align-items:center;gap:3vw;white-space:nowrap;width:max-content;animation:pageTick 120s linear infinite}'
  + '.page-tick span{font-family:var(--font,"GFS Neohellenic","Gill Sans",serif);font-weight:400;font-size:clamp(.8rem,2.6vh,1.6rem);line-height:1;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-body,#c2a567);opacity:.8;-webkit-text-stroke:0}'
  + '.page-tick span.mo{opacity:.4}.page-tick span::before{content:"\\2022";margin-right:3vw;color:rgba(131,109,48,.7);-webkit-text-stroke:0}'
  + '.page-tick + footer{margin-top:0 !important;border-top:0 !important}'
  + '@keyframes pageTick{to{transform:translateX(-50%)}}'
  + '@media (prefers-reduced-motion:reduce){.page-tick div{animation:none}}'
  + 'html[data-theme="light"] .page-tick span{color:#4a3a1c}';
  var st = document.createElement('style'); st.id = 'page-tick-css'; st.textContent = css; document.head.appendChild(st);
  var unit = '', i; for (i = 0; i < 3; i++) unit += '<span class="mo">Moyseion</span><span>' + path[1] + '</span>';
  var el = document.createElement('div'); el.className = 'page-tick'; el.id = 'pageTick'; el.setAttribute('role', 'note');
  el.setAttribute('aria-label', T('You are here') + ': Moyseion, ' + path[1]);
  el.innerHTML = '<small aria-hidden="true">Moyseion &rsaquo; ' + path[1] + '</small><div aria-hidden="true">' + unit + unit + '</div>';
  // the hand-off: one quiet link to the page that naturally follows, so a reader can walk the site without the menu
  var NEXT = {
    'moyseion-day.html': ['moyseion-houses.html', 'Houses'],
    'moyseion-houses.html': ['moyseion-neolithic.html', 'Neolithic'],
    'moyseion-neolithic.html': ['moyseion-enotrian.html', 'Enotrian'],
    'moyseion-enotrian.html': ['moyseion-magnagraecia.html', 'Magna Graecia'],
    'moyseion-magnagraecia.html': ['moyseion-day.html', 'A Day at Moyseion'],
    'moyseion-press.html': ['moyseion-journal.html', 'Journal']
  };
  var nx = NEXT[file], nxEl = null;
  if (nx){
    st.textContent += '.page-next{position:relative;z-index:20;display:flex;justify-content:flex-end;align-items:baseline;gap:1.2rem;margin:9vh var(--pad,clamp(1.1rem,4.6vw,4.2rem)) 0;color:var(--gold-body,#c2a567);text-decoration:none;font-family:var(--font,"GFS Neohellenic",serif)}'
      + '.page-next small{font-size:.66rem;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-deep,#836d30)}'
      + '.page-next b{font-weight:400;font-size:clamp(1.4rem,2.6vw,2.6rem);line-height:1;color:var(--gold-bright,#f1dca4);transition:transform .4s}'
      + '.page-next:hover b,.page-next:focus-visible b{transform:translateX(.4rem)}'
      + 'html[data-theme="light"] .page-next b{color:#7d3217}html[data-theme="light"] .page-next small{color:#9c3f1c}';
    nxEl = document.createElement('a'); nxEl.className = 'page-next'; nxEl.href = nx[0];
    nxEl.innerHTML = '<small>' + T('Next') + '</small><b>' + T(nx[1]) + ' &rarr;</b>';
  }
  var foot = Array.prototype.slice.call(document.querySelectorAll('footer')).filter(function(x){ return !x.closest('.rev-card'); })[0];   // the page's own footer, never a review card's
  if (foot && foot.parentNode) foot.parentNode.insertBefore(el, foot); else document.body.appendChild(el);
  if (nxEl) el.parentNode.insertBefore(nxEl, el);
  if (document.querySelector('.ar-band')) el.style.marginTop = '0';   // the Archive band runs straight into the page band, no gap
})();
