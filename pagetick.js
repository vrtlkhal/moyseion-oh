/* PAGE INDICATOR: the homepage's big outlined marquee, repeated near the foot of every other page, naming where the reader is
   in the site map as category > page. Single source: it injects its own style and markup. The homepage has its own marquees and is skipped. */
(function(){
  var MAP = {
    'moyseion-day.html':    ['Inhabit Moyseion', 'A Day at Moyseion'],
    'moyseion-houses.html': ['Inhabit Moyseion', 'Houses'],
    'moyseion-journal.html': ['Explore', 'Journal'],
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
  + '.page-tick{position:relative;z-index:20;overflow:hidden;height:15vh;max-height:15vh;min-height:5.5rem;display:flex;align-items:center;padding:0;border-top:1px solid rgba(131,109,48,.28);border-bottom:1px solid rgba(131,109,48,.28);margin:6vh 0 0;background:linear-gradient(90deg,rgba(1,4,22,.9),rgba(1,4,22,.55),rgba(1,4,22,.9))}'
  + '.page-tick small{position:absolute;left:clamp(1.1rem,4.6vw,4.2rem);top:.55rem;font-size:.62rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold-body,#c2a567);z-index:2}'
  + '.page-tick div{display:flex;align-items:center;gap:4vw;white-space:nowrap;width:max-content;animation:pageTick 60s linear infinite}'
  + '.page-tick span{font-family:var(--font,"GFS Neohellenic","Gill Sans",serif);font-weight:700;font-size:clamp(1.8rem,min(5vw,7.5vh),4.5rem);line-height:.9;letter-spacing:-.02em;text-transform:uppercase;color:transparent;-webkit-text-stroke:1px rgba(241,220,164,.6)}'
  + '.page-tick span:nth-child(even){color:var(--gold-bright,#f1dca4);-webkit-text-stroke:0;font-weight:400}'
  + '@keyframes pageTick{to{transform:translateX(-50%)}}'
  + '@media (prefers-reduced-motion:reduce){.page-tick div{animation:none}}'
  + 'html[data-theme="light"] .page-tick{background:linear-gradient(90deg,#f4efe8,#efe7da,#f4efe8)}'
  + 'html[data-theme="light"] .page-tick span{-webkit-text-stroke:1px rgba(139,90,43,.7)}'
  + 'html[data-theme="light"] .page-tick span:nth-child(even){color:#8b5a2b;-webkit-text-stroke:0}'
  + 'html[data-theme="light"] .page-tick small{color:#8b5a2b}';
  var st = document.createElement('style'); st.id = 'page-tick-css'; st.textContent = css; document.head.appendChild(st);
  var unit = '', i; for (i = 0; i < 3; i++) unit += '<span>' + path[0] + '</span><span>' + path[1] + '</span>';
  var el = document.createElement('div'); el.className = 'page-tick'; el.id = 'pageTick'; el.setAttribute('role', 'note');
  el.setAttribute('aria-label', T('You are here') + ': Moyseion, ' + path[0] + ', ' + path[1]);
  el.innerHTML = '<small aria-hidden="true">Moyseion &rsaquo; ' + path[0] + ' &rsaquo; ' + path[1] + '</small><div aria-hidden="true">' + unit + unit + '</div>';
  var foot = Array.prototype.slice.call(document.querySelectorAll('footer')).filter(function(x){ return !x.closest('.rev-card'); })[0];   // the page's own footer, never a review card's
  if (foot && foot.parentNode) foot.parentNode.insertBefore(el, foot); else document.body.appendChild(el);
})();
