/* PAGE INDICATOR: the homepage's big outlined marquee, repeated near the foot of every other page, naming where the reader is
   in the site map as category > page. Single source: it injects its own style and markup. The homepage has its own marquees and is skipped. */
(function(){
  var MAP = {
    'moyseion-day.html':    ['Inhabit Moyseion', 'A Day at Moyseion'],
    'moyseion-houses.html': ['Inhabit Moyseion', 'Houses'],
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
  + '.page-tick{position:relative;z-index:20;overflow:hidden;height:10vh;min-height:4.5rem;display:flex;align-items:center;margin:6vh 0 0;border-top:1px solid rgba(131,109,48,.35);border-bottom:1px solid rgba(131,109,48,.35)}'
  + '.page-tick small{display:none}'
  + '.page-tick div{display:flex;align-items:center;gap:5vw;white-space:nowrap;width:max-content;animation:pageTick 120s linear infinite}'
  + '.page-tick span{font-family:var(--font,"GFS Neohellenic","Gill Sans",serif);font-weight:400;font-size:clamp(1.3rem,4.2vh,2.6rem);line-height:1;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-body,#c2a567);opacity:.8;-webkit-text-stroke:0}'
  + '.page-tick span:nth-child(even)::before{content:"\\2022";margin-right:5vw;color:rgba(131,109,48,.7);-webkit-text-stroke:0}'
  + '@keyframes pageTick{to{transform:translateX(-50%)}}'
  + '@media (prefers-reduced-motion:reduce){.page-tick div{animation:none}}'
  + 'html[data-theme="light"] .page-tick span{color:#3a3128}';
  var st = document.createElement('style'); st.id = 'page-tick-css'; st.textContent = css; document.head.appendChild(st);
  var unit = '', i; for (i = 0; i < 3; i++) unit += '<span>' + path[0] + '</span><span>' + path[1] + '</span>';
  var el = document.createElement('div'); el.className = 'page-tick'; el.id = 'pageTick'; el.setAttribute('role', 'note');
  el.setAttribute('aria-label', T('You are here') + ': Moyseion, ' + path[0] + ', ' + path[1]);
  el.innerHTML = '<small aria-hidden="true">Moyseion &rsaquo; ' + path[0] + ' &rsaquo; ' + path[1] + '</small><div aria-hidden="true">' + unit + unit + '</div>';
  var foot = Array.prototype.slice.call(document.querySelectorAll('footer')).filter(function(x){ return !x.closest('.rev-card'); })[0];   // the page's own footer, never a review card's
  if (foot && foot.parentNode) foot.parentNode.insertBefore(el, foot); else document.body.appendChild(el);
})();
