/* THE MENU BAR, ONE SOURCE FOR EVERY PAGE BUT THE HOMEPAGE (which carries the same bar inline, with its scroll-gated states).
   It injects its own style and markup and hides whatever bar the page had before, so all pages share one bar: brand, the four
   links, ONE plan-your-stay button, the theme switch, and the + that opens the full-width site map. */
(function(){
  if (document.getElementById('mnav')) return;
  var here = window.__NAV_BASE != null ? window.__NAV_BASE : (document.currentScript && document.currentScript.src ? new URL('./', document.currentScript.src).href : '');
  var P = { home: here + 'Moyseion-v3-blend.html', day: here + 'proposal/moyseion-day.html', houses: here + 'proposal/moyseion-houses.html', press: here + 'proposal/moyseion-press.html', journal: here + 'proposal/moyseion-journal.html', archive: here + 'proposal/moyseion-archive.html', neo: here + 'proposal/moyseion-neolithic.html', eno: here + 'proposal/moyseion-enotrian.html', mag: here + 'proposal/moyseion-magnagraecia.html', draft: here + 'draft.html', explore: here + 'proposal/moyseion-explore.html' };
  var css = ''
  // PAGE BAND: every inner page opens the same way, a photograph behind the title, 38.2vh; Moyseion above, a dateline below
  + '.pg-band{position:relative;isolation:isolate;overflow:hidden;margin:4rem 0 0;min-height:clamp(14rem,38.2vh,22rem);display:flex;flex-direction:column;justify-content:flex-end;align-items:flex-start;text-align:left;padding:7rem var(--pad,clamp(1.1rem,4.6vw,4.2rem)) clamp(1rem,3vh,1.8rem);box-sizing:border-box}'
  + '.pg-band::before{content:"";position:absolute;inset:0;z-index:-2;background:var(--img) var(--pos,center 45%)/cover no-repeat}'
  + '.pg-band::after{content:"";position:absolute;inset:0;z-index:-1;background:linear-gradient(90deg,rgba(1,4,22,.88) 0%,rgba(1,4,22,.66) 32%,rgba(1,4,22,.18) 68%,rgba(1,4,22,.08) 100%),linear-gradient(0deg,rgba(1,4,22,.55),rgba(1,4,22,0) 55%)}'
  + '.pg-kick{margin:0 0 .2rem;font-size:.66rem;letter-spacing:.42em;text-transform:uppercase;color:#c2a567}.pg-kick a{color:#c2a567;text-decoration:none}.pg-kick a:hover{color:#f1dca4}'
  + '.pg-band h1,html body .era-hero h1{color:#f1dca4;margin:0 0 .9rem}'
  + '.pg-date{margin:0;font-size:.68rem;letter-spacing:.3em;text-transform:uppercase;line-height:1.6;color:#e9dfcf}'
  // SECTION HEADINGS: tracked capitals and one thin rule after them, on every page
  + 'html body:not(#_) .gal-head,html body:not(#_) .section-label,html body:not(#_) .ex-head h2{display:flex;align-items:center;gap:1.4rem}'
  + 'html body:not(#_) .gal-head::after,html body:not(#_) .section-label::after,html body:not(#_) .ex-head h2::after{content:"";flex:1 1 auto;min-width:3rem;height:1px;background:rgba(131,109,48,.45)}'
  + 'html body:not(#_) .ex-head h2{flex:1 1 auto}'
  // PLAN YOUR STAY: outlined, filled with gold on hover
  + '.mn-btn:hover,.mn-btn:focus-visible{background:#c2a567;border-color:#c2a567;color:#010416}'
  // WIDE SCREENS: content keeps the same margins as the bar, no centred 96rem column
  + 'html body:not(#_) .rows,html body:not(#_) .notes,html body:not(#_) .masonry,html body:not(#_) .gal-head,html body:not(#_) .eras-nav,html body:not(#_) .dws,html body:not(#_) .foot{max-width:none}'
  // SITE SYSTEM: one size for each repeated element on every inner page (title, eyebrow, breadcrumb, section heading,
  // dateline). Golden steps; the :not(#_) lifts these above each page's own older rules.
  + 'html body:not(#_) h1{font-weight:400;font-size:clamp(3.4rem,6.6vw,6.6rem);line-height:.92;letter-spacing:-.02em}'
  + 'html body:not(#_) .crumbs,html body:not(#_) .crumbs a,html body:not(#_) .eyebrow,html body:not(#_) .era-hero .layer{font-size:.66rem;letter-spacing:.42em;text-transform:uppercase;font-weight:400}'
  + 'html body:not(#_) .gal-head,html body:not(#_) .section-label,html body:not(#_) .ex-head h2{font-size:clamp(1rem,1.5vw,1.4rem);letter-spacing:.34em;text-transform:uppercase;font-weight:400}'
  + 'html body:not(#_) .era-hero .when,html body:not(#_) .era-hero .lede.tracked,html body:not(#_) .ex-hero .lede{font-size:.68rem;letter-spacing:.3em;text-transform:uppercase}'
  + '@media (max-width:40rem){html body:not(#_) h1{font-size:clamp(2.8rem,13vw,4.4rem)}}'
  + '.mn-back{position:absolute;z-index:40;top:calc(4rem + 1.1rem);left:var(--pad,clamp(1.1rem,4.6vw,4.2rem));display:inline-flex;align-items:center;gap:.7rem;font-family:var(--font,"GFS Neohellenic","Gill Sans",serif);font-size:.62rem;letter-spacing:.34em;text-transform:uppercase;color:#c2a567;text-decoration:none;transition:color .3s}'
  + '.mn-back span{display:grid;place-items:center;width:1.9rem;height:1.9rem;border:1px solid rgba(131,109,48,.55);border-radius:50%;font-size:.8rem;letter-spacing:0;transition:border-color .3s,transform .4s}'
  + '.mn-back:hover,.mn-back:focus-visible{color:#f1dca4}.mn-back:hover span,.mn-back:focus-visible span{border-color:#f1dca4;transform:translateX(-.2rem)}'
  + 'html[data-theme="light"] .mn-back{color:#4a3a1c}html[data-theme="light"] .mn-back:hover{color:#7d3217}'
  + '.mn-brand svg use[href^="#mk-ring"]{transform-box:view-box;transform-origin:50% 50%;animation:mnSpin linear infinite}'
  + '.mn-brand svg use[href="#mk-ring0"]{animation-duration:240s}.mn-brand svg use[href="#mk-ring1"]{animation-duration:160s;animation-direction:reverse}.mn-brand svg use[href="#mk-ring2"]{animation-duration:110s}.mn-brand svg use[href="#mk-ring3"]{animation-duration:70s;animation-direction:reverse}'
  + '@keyframes mnSpin{to{transform:rotate(360deg)}}@media (prefers-reduced-motion:reduce){.mn-brand svg use{animation:none}}'
  + 'header.nav,.sheet#sheet,nav[aria-label="Primary"]:not(.mnav){display:none!important}'
  + '.mnav{--g-deep:#836d30;--g-body:#c2a567;--g-bright:#f1dca4;--g-line:rgba(131,109,48,.45);--g-soft:rgba(131,109,48,.28);--g-bg:#010416;--pad:clamp(1.1rem,4.6vw,4.2rem);'
  + 'position:fixed;top:0;left:0;right:0;z-index:60;height:4rem;display:flex;align-items:center;gap:2rem;padding:0 var(--pad);box-sizing:border-box;font-family:var(--font,"GFS Neohellenic","Gill Sans",serif);'
  + 'background:rgba(1,4,22,.84);-webkit-backdrop-filter:blur(.875rem);backdrop-filter:blur(.875rem);border-bottom:1px solid var(--g-soft)}'
  + '.mnav *{box-sizing:border-box}'
  + '.mnav a,.mnav button{font-family:inherit}'
  + '.mn-brand{display:flex;align-items:center;gap:.8rem;flex:0 0 auto;text-decoration:none;color:var(--g-bright)}'
  + '.mn-brand svg{width:2.75rem;height:2.75rem;flex:0 0 auto;color:var(--g-body)}'
  + '.mn-brand b{display:block;font-weight:700;font-size:1.25rem;letter-spacing:.14em;line-height:1}'
  + '.mn-brand small{display:block;margin-top:.3rem;font-size:.55rem;letter-spacing:.34em;color:var(--g-deep);text-transform:uppercase}'
  + '.mn-menu{display:flex;align-items:center;gap:clamp(1rem,2.4vw,2.6rem);margin:0 0 0 auto;padding:0;list-style:none}'
  + '.mn-menu a{white-space:nowrap;font-size:.82rem;letter-spacing:.13em;text-transform:uppercase;color:var(--g-body);padding:.5rem 0;text-decoration:none;transition:color .3s}'
  + '.mn-menu a:hover,.mn-menu a:focus-visible,.mn-menu a[aria-current]{color:var(--g-bright)}'
  + '.mn-btn{display:inline-flex;align-items:center;justify-content:center;font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;padding:.8rem 1.5rem;border:1px solid var(--g-body);color:var(--g-bright);background:none;line-height:1;text-decoration:none;white-space:nowrap;transition:background .3s,color .3s,border-color .3s}'
  + '.mn-btn:hover,.mn-btn:focus-visible{background:var(--g-body);border-color:var(--g-body);color:var(--g-bg)}'
  + '.mn-theme{font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--g-body);background:none;border:0;cursor:pointer;padding:.5rem .2rem;white-space:nowrap}'
  + '.mn-theme:hover,.mn-theme:focus-visible{color:var(--g-bright)}'
  + '.mn-wrap{flex:0 0 auto}'
  + '.mn-plus{width:1.875rem;height:1.875rem;border:1px solid var(--g-line);border-radius:50%;position:relative;color:var(--g-bright);background:none;cursor:pointer;transition:border-color .3s,background .3s,transform .4s}'
  + '.mn-plus i{position:absolute;left:50%;top:50%;width:.6875rem;height:1px;background:currentColor;transform:translate(-50%,-50%)}'
  + '.mn-plus i:nth-child(2){transform:translate(-50%,-50%) rotate(90deg)}'
  + '.mn-plus:hover{border-color:var(--g-bright);background:rgba(241,220,164,.07)}'
  + '.mn-plus[aria-expanded="true"]{transform:rotate(45deg);border-color:var(--g-bright)}'
  + '.mn-pop{position:absolute;top:100%;left:0;right:0;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));padding:0 var(--pad);background:rgba(1,4,22,.97);-webkit-backdrop-filter:blur(.875rem);backdrop-filter:blur(.875rem);'
  + 'border-top:1px solid var(--g-line);border-bottom:1px solid var(--g-line);opacity:0;visibility:hidden;transform:translateY(-.375rem);transition:opacity .3s,transform .3s,visibility 0s .3s;z-index:70}'
  + '.mn-wrap.open .mn-pop{opacity:1;visibility:visible;transform:none;transition-delay:0s}'
  + '.mn-col{padding:clamp(1.6rem,3.4vh,2.6rem) clamp(1.2rem,2.2vw,2.4rem);border-left:1px solid var(--g-soft);display:flex;flex-direction:column;align-items:flex-start;min-width:0}'
  + '.mn-col:nth-child(4){border-right:1px solid var(--g-soft)}'
  + '.mn-col h4{font-weight:400;font-size:.6rem;letter-spacing:.34em;text-transform:uppercase;color:var(--g-deep);margin:0 0 1.1rem}'
  + '.mn-col a{display:block;position:relative;font-size:.86rem;letter-spacing:.12em;padding:.42rem 0;color:var(--g-body);text-decoration:none;white-space:nowrap;transition:color .3s,padding .4s}'
  + '.mn-col a::before{content:"";position:absolute;left:0;top:50%;width:0;height:1px;background:var(--g-bright);transition:width .4s}'
  + '.mn-col a:hover,.mn-col a:focus-visible{color:var(--g-bright);padding-left:1.4rem}'
  + '.mn-col a:hover::before,.mn-col a:focus-visible::before{width:.9rem}'
  + '.mn-col a.sub{font-size:.74rem;padding-left:1rem;opacity:.85}'
  + '.mn-lang{display:flex;align-items:center;gap:.7rem}'
  + '.mn-lang button{font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;color:var(--g-body);background:none;border:0;padding:.3rem .2rem;cursor:pointer}'
  + '.mn-lang button[aria-pressed="true"]{color:var(--g-bright)}.mn-lang button[aria-pressed="false"]{opacity:.65}'
  + '.mn-lang .rule{width:1px;height:.9rem;background:var(--g-line)}'
  + '.mn-foot{grid-column:1 / -1;display:grid;grid-template-columns:1fr auto 1fr;gap:2rem;padding:1.1rem 0 1.2rem;border-top:1px solid var(--g-soft);font-size:.62rem;letter-spacing:.3em;text-transform:uppercase;color:var(--g-deep)}'
  + '.mn-foot span:nth-child(2){text-align:center}.mn-foot span:nth-child(3){text-align:right}'
  + '.mn-burger{display:none;margin-left:auto;width:2.75rem;height:2.75rem;position:relative;background:none;border:0;cursor:pointer;z-index:62}'
  + '.mn-burger i{position:absolute;left:.6875rem;right:.6875rem;height:1px;background:var(--g-bright);transition:transform .35s,opacity .3s,top .35s}'
  + '.mn-burger i:nth-child(1){top:1rem}.mn-burger i:nth-child(2){top:1.375rem}.mn-burger i:nth-child(3){top:1.75rem}'
  + '.mnav.open .mn-burger i:nth-child(1){top:1.375rem;transform:rotate(45deg)}.mnav.open .mn-burger i:nth-child(2){opacity:0}.mnav.open .mn-burger i:nth-child(3){top:1.375rem;transform:rotate(-45deg)}'
  + '.mn-sheet{display:none}'
  + 'html[data-theme="light"] .mnav{--g-deep:#9c3f1c;--g-body:#4a3a1c;--g-bright:#7d3217;--g-line:rgba(131,109,48,.4);--g-soft:rgba(131,109,48,.28);--g-bg:#f6f1e9;background:rgba(246,241,233,.92)}'
  + 'html[data-theme="light"] .mn-pop{background:rgba(246,241,233,.98)}'
  + 'html[data-theme="light"] .mn-btn:hover{color:#fff;background:#9c3f1c;border-color:#9c3f1c}'
  + '@media (max-width:820px){'
  + '.mn-menu,.mn-wrap{display:none}.mn-burger{display:block}.mn-brand small{display:none}.mn-brand b{font-size:1rem}.mnav{gap:1rem}.mn-btn{padding:.7rem 1rem;font-size:.66rem}.mn-theme{font-size:.66rem}'
  + '.mn-sheet{display:flex;flex-direction:column;gap:1.6rem;position:fixed;top:0;left:0;width:100vw;height:61.8vh;min-height:22rem;overflow:auto;padding:5.5rem var(--pad) 1.6rem;background:rgba(1,4,22,.98);border-bottom:1px solid var(--g-line);opacity:0;visibility:hidden;transform:translateY(-.5rem);transition:opacity .3s,transform .3s,visibility 0s .3s;z-index:61}'
  + 'html[data-theme="light"] .mn-sheet{background:rgba(246,241,233,.98)}'
  + '.mnav.open .mn-sheet{opacity:1;visibility:visible;transform:none;transition-delay:0s}'
  + '.mn-sheet h4{font-weight:400;font-size:.62rem;letter-spacing:.34em;text-transform:uppercase;color:var(--g-deep);margin:0 0 .5rem;padding-bottom:.6rem;border-bottom:1px solid var(--g-soft)}'
  + '.mn-sheet a{display:block;font-size:1.35rem;padding:.35rem 0;color:var(--g-bright);text-decoration:none}'
  + '}'
  + '@media (prefers-reduced-motion:reduce){.mnav *,.mn-pop,.mn-sheet{transition:none!important}}';
  var st = document.createElement('style'); st.id = 'mnav-css'; st.textContent = css; document.head.appendChild(st);

  var hasMark = !!document.getElementById('mk-logo'), light = document.documentElement.getAttribute('data-theme') === 'light';
  var sigil = hasMark ? '<svg viewBox="0 0 1000 1000" aria-hidden="true"><use href="#mk-ring0"/><use href="#mk-ring1"/><use href="#mk-ring2"/><use href="#mk-ring3"/><use href="#mk-logo"/></svg>' : '';
  var cols = '<div class="mn-col"><h4>Inhabit</h4><a href="' + P.day + '">A Day at Moyseion</a><a href="' + P.day + '#akratisma">Akratisma</a><a href="' + P.day + '#water">Water Sanctuary</a><a href="' + P.day + '#symposium">Symposium</a><a href="' + P.houses + '">Houses</a><a class="sub" href="' + P.neo + '">Neolithic</a><a class="sub" href="' + P.eno + '">Enotrian</a><a class="sub" href="' + P.mag + '">Magna Graecia</a></div>'
    + '<div class="mn-col"><h4>Explore</h4><a href="' + P.draft + '">The Idea</a><a href="' + P.explore + '#research">Archaeological Research</a><a href="' + P.journal + '">Journal</a><a class="sub" href="' + P.archive + '">Archive</a><a class="sub" href="' + P.journal + '?tag=theatre">Theatre</a><a href="https://fondazione-moyseion-isama.com" target="_blank" rel="noopener">Fondazione ISAMA</a></div>'
    + '<div class="mn-col"><h4>More</h4><a href="' + P.press + '">Press</a><a href="' + P.draft + '">About</a><a href="' + P.draft + '">Contact</a><a href="' + P.draft + '">Privacy</a></div>'
    + '<div class="mn-col"><h4>Settings</h4><div class="mn-lang"><button type="button" data-lang="en" aria-pressed="true">EN</button><span class="rule" aria-hidden="true"></span><button type="button" data-lang="it" aria-pressed="false">IT</button></div></div>';
  var nav = document.createElement('nav'); nav.className = 'mnav'; nav.id = 'mnav'; nav.setAttribute('aria-label', 'Primary');
  nav.innerHTML = '<a class="mn-brand" href="' + P.home + '#top" aria-label="MOΥΣEION">' + sigil + '<span><b>MOΥΣEION</b><small>Matera</small></span></a>'
    + '<ul class="mn-menu"><li><a href="' + P.explore + '">Explore</a></li><li><a href="' + P.houses + '">Houses</a></li><li><a href="' + P.journal + '?tag=events">Events</a></li><li><a href="' + P.journal + '">Journal</a></li><li><a href="' + P.draft + '">About</a></li></ul>'
    + '<div class="mn-wrap"><button class="mn-plus" type="button" aria-label="More: all pages, language, sound" aria-expanded="false" aria-controls="mnPop"><i></i><i></i></button>'
    + '<div class="mn-pop" id="mnPop">' + cols + '<div class="mn-foot" aria-hidden="true"><span>Matera &middot; Basilicata</span><span>Research &amp; Hospitality</span><span>Revive</span></div></div></div>'
    + '<div class="mn-cta"><a class="mn-btn" href="' + P.draft + '">Plan your stay</a></div>'
    + '<button type="button" class="mn-theme" id="mnTheme" aria-label="' + (light ? 'Switch to dark mode' : 'Switch to light mode') + '">' + (light ? 'Dark' : 'Light') + '</button>'
    + '<button type="button" class="mn-burger" aria-label="Menu" aria-expanded="false" aria-controls="mnSheet"><i></i><i></i><i></i></button>'
    + '<div class="mn-sheet" id="mnSheet"><div><h4>Menu</h4><a href="' + P.explore + '">Explore</a><a href="' + P.houses + '">Houses</a><a href="' + P.journal + '?tag=events">Events</a><a href="' + P.journal + '">Journal</a><a href="' + P.draft + '">About</a></div>'
    + '<div><h4>Inhabit</h4><a href="' + P.day + '">A Day at Moyseion</a><a href="' + P.day + '#akratisma">Akratisma</a><a href="' + P.day + '#symposium">Symposium</a><a href="' + P.press + '">Press</a></div></div>';
  document.body.insertBefore(nav, document.body.firstChild);
  // BACK: a quiet way to the previous page, top left under the bar, on every page but the homepage (which has no nav.js).
  // It goes back in history when the reader came from this site, otherwise to the homepage.
  var back = document.createElement('a'); back.className = 'mn-back'; back.href = P.home;
  back.innerHTML = '<span aria-hidden="true">&larr;</span>Back';
  back.addEventListener('click', function(e){
    var same = document.referrer && document.referrer.indexOf(location.origin) === 0;
    if (same && history.length > 1){ e.preventDefault(); history.back(); }
  });
  document.body.insertBefore(back, nav.nextSibling);

  var wrap = nav.querySelector('.mn-wrap'), plus = nav.querySelector('.mn-plus'), burger = nav.querySelector('.mn-burger');
  function setO(o){ wrap.classList.toggle('open', o); plus.setAttribute('aria-expanded', o ? 'true' : 'false'); }
  plus.addEventListener('click', function(e){ e.stopPropagation(); setO(!wrap.classList.contains('open')); });
  burger.addEventListener('click', function(e){ e.stopPropagation(); var o = !nav.classList.contains('open'); nav.classList.toggle('open', o); burger.setAttribute('aria-expanded', o ? 'true' : 'false'); });
  document.addEventListener('click', function(e){ if (!wrap.contains(e.target)) setO(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape'){ setO(false); nav.classList.remove('open'); } });
  nav.querySelector('#mnTheme').addEventListener('click', function(){
    var to = light ? 'dark' : 'light';
    if (window.__moySetTheme) return window.__moySetTheme(to);
    try { localStorage.setItem('moy-theme', to); } catch (e) {}
    location.reload();
  });
  var lang = null; try { lang = localStorage.getItem('moy-lang'); } catch (e) {}
  nav.querySelectorAll('.mn-lang button').forEach(function(b){
    b.setAttribute('aria-pressed', (lang || 'en') === b.getAttribute('data-lang') ? 'true' : 'false');
    b.addEventListener('click', function(){ try { localStorage.setItem('moy-lang', b.getAttribute('data-lang')); } catch (e) {} nav.querySelectorAll('.mn-lang button').forEach(function(o){ o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); }); });
  });
})();
