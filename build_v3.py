# -*- coding: utf-8 -*-
# Version 3 = Version 1's content, images, videos and motion (the homepage file, untouched) re-skinned in Version 2's aesthetic.
import re, sys
SRC = "Moyseion Hero Landing Page - MOTION v3.html"
OUT = "Moyseion-v3-blend.html"
s = open(SRC, encoding='utf-8').read()

def sub(a, b, cnt=1):
    global s
    assert a in s, "missing: " + a[:80]
    s = s.replace(a, b, cnt)

# ------------------------------------------------------------------ header (V2's bar) replacing the Menu button
sig = lambda cls: '<svg class="%s" viewBox="0 0 1000 1000" aria-hidden="true">%s<g><use href="#mk-logo"/></g></svg>' % (
    cls, ''.join('<g class="sg sg%d"><use href="#mk-ring%d"/></g>' % (i, i) for i in range(4)))
BRAND = '<a class="v3-brand" href="#top" aria-label="MOΥΣEION">%s<span><b>MOΥΣEION</b><small>Matera</small></span></a>' % sig('sigil mini')
INH = [('proposal/moyseion-day.html','Your Day at Moyseion'),('proposal/moyseion-plan.html','Plan Your Stay'),('proposal/moyseion-inhabit.html#water','Water Sanctuary'),('proposal/moyseion-inhabit.html#akratisma','Akratisma'),('proposal/moyseion-houses.html','Houses')]
EXP = [('proposal/moyseion-explore.html#idea','The Idea'),('proposal/moyseion-explore.html#research','Archaeological Research'),('proposal/moyseion-explore.html#journal','Journal'),('proposal/moyseion-press.html','Press')]
dd_inh = ''.join('<a href="%s">%s</a>' % (h, t) for h, t in INH)
dd_exp = ''.join('<a href="%s">%s</a>' % (h, t) for h, t in EXP)
sheet_links = '<div><h4>Inhabit</h4>' + ''.join('<a href="%s">%s</a>' % (h, t) for h, t in INH) + '</div><div><h4>Explore</h4>' + ''.join('<a href="%s">%s</a>' % (h, t) for h, t in EXP) + '<a href="#">About</a></div>'
NAV = '''<nav class="chrome" id="chrome" aria-label="Primary">
  %s
  <ul class="v3-menu">
    <li class="has-dd"><button class="dd-btn" type="button" aria-haspopup="true">Inhabit Moyseion</button><div class="dd">%s</div></li>
    <li class="has-dd"><button class="dd-btn" type="button" aria-haspopup="true">Explore Moyseion</button><div class="dd">%s</div></li>
    <li><a href="proposal/moyseion-explore.html#journal">Journal</a></li>
    <li><a href="#">About</a></li>
  </ul>
  <div class="v3-cta"><a class="btn" href="#visit" data-go="visit">Plan your stay</a><a class="btn fill" href="#">Book your stay</a></div>
  <div class="tools-wrap"><button class="plus" type="button" aria-label="Language and sound" aria-expanded="false" aria-controls="toolsPop"><i></i><i></i></button>
    <div class="tools-pop" id="toolsPop"><div class="menu-langs"><button type="button" class="lang-opt" data-lang="en" aria-pressed="true">EN</button><span class="rule" aria-hidden="true"></span><button type="button" class="lang-opt" data-lang="it" aria-pressed="false">IT</button></div>
      <button type="button" id="soundToggle" aria-pressed="false" title="Ambient sound"><span data-i18n="nav.sound">Sound</span></button><button type="button" class="thm" id="themeBtn">Light</button></div></div>
  <button type="button" class="menu-btn" id="menuBtn" aria-label="Menu" aria-expanded="false" aria-controls="menuPanel"><i></i><i></i><i></i></button>
  <div class="menu-panel" id="menuPanel">
    <div class="sheet-cols">%s</div>
    <div class="sheet-row"><a class="btn" href="#visit" data-go="visit">Plan your stay</a><a class="btn fill" href="#">Book your stay</a></div>
  </div>
</nav>''' % (BRAND, dd_inh, dd_exp, sheet_links)
a = s.index('<nav class="chrome" id="chrome"'); b = s.index('</nav>', a) + 6
s = s[:a] + NAV + s[b:]

# ------------------------------------------------------------------ footer (V2's)
SOC = {
 'ig': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".8" fill="currentColor"/></svg>',
 'fb': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3C16.7 2.3 15.8 2 14.7 2 12.4 2 10.8 3.4 10.8 6v2.5H8.2V12h2.6v10H14V12h2.6l.4-3.5z"/></svg>',
 'mail': '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="11" width="36" height="26" rx="2"/><path d="M6 14l18 14 18-14"/></svg>'}
FOOT = '''<footer class="site-foot v3foot"><div class="foot">
  <nav aria-label="Footer"><a href="/contact" data-i18n="foot.contact">Contact</a><a href="#">FAQ</a><a href="proposal/moyseion-press.html">Press</a><a href="/privacy" data-i18n="foot.privacy">Privacy</a><a href="#">Terms</a><a href="#">Careers</a></nav>
  <div class="social"><a href="#" aria-label="Instagram">%s</a><a href="#" aria-label="Facebook">%s</a></div>
  <a class="news" href="#">%s Newsletter</a>
  <p class="foot-note" data-i18n="foot.note">For more on the research and archaeology: <a href="https://fondazione-moyseion-isama.com" target="_blank" rel="noopener">fondazione-moyseion-isama.com</a></p>
</div></footer>''' % (SOC['ig'], SOC['fb'], SOC['mail'])
a = s.index('<footer class="site-foot">'); b = s.index('</footer>', a) + 9
s = s[:a] + s[b:]            # the footer lives INSIDE the closing section, so the film runs to the very end
v = s.index('<section class="visit" id="visit">'); ve = s.index('</section>', v)
s = s[:ve] + FOOT + '\n' + s[ve:]

# ------------------------------------------------------------------ section eyebrows + label before the reels
names = {'manifesto-essence': ('01', 'Essence'), 'manifesto-structure': ('02', 'Structure'), 'manifesto-sanctuary': ('03', 'Sanctuary'),
         'manifesto-rituals': ('04', 'Rituals'), 'manifesto-senses': ('05', 'Senses'), 'manifesto-spirit': ('06', 'Spirit')}
for sid, (n, t) in names.items():
    sub('id="%s"' % sid, 'id="%s"' % sid)   # sanity
    m = re.search(r'(<section[^>]*id="%s"[^>]*>\s*<div class="manifesto-inner">)' % sid, s)
    assert m, sid
    s = s[:m.end()] + '<div class="v3-eyebrow"><i>%s</i> %s</div>' % (n, t) + s[m.end():]
sub('<section class="reels" aria-label="From our social channels">', '<div class="v3-label"><span>From inside</span></div>\n<section class="reels" aria-label="From our social channels">')
sub('<section class="rail" id="rail"', '<section class="rail" id="rail"')

# ------------------------------------------------------------------ JS patches
sub("root.style.setProperty('--wm-zone', Math.round(VH * wmTop() + H * wmEndScale()) + 'px');", "root.style.setProperty('--wm-zone', '84px');   // the header bar carries the name; sections reserve its height")
sub("""let wmHidden = false;
function chromeFrame(sy){
  // The closing sigil carries the name; retire the parked corner wordmark once that section arrives.
  const hideWm = visitEl.getBoundingClientRect().top < VH * 0.4;
  if (hideWm !== wmHidden){ wmHidden = hideWm; wordmarkEl.classList.toggle('is-hidden', hideWm); }""",
"""let wmLit = 1;
function chromeFrame(sy){
  // The bar's own name takes over from the big title: it dissolves into the bar over the last of its rise.
  const wmO = 1 - clamp01((sy - holdEnd() * 0.78) / (holdEnd() * 0.22));
  if (Math.abs(wmO - wmLit) > 0.01){ wmLit = wmO; wordmarkEl.style.opacity = wmO.toFixed(3); }""")
sub("var IDS = ['manifesto-essence','manifesto-structure','reels-1','manifesto-sanctuary','water-1','manifesto-rituals','manifesto-senses','manifesto-spirit','manifesto-close','visit'];",
    "var IDS = ['manifesto-essence','manifesto-structure','reels-1','manifesto-sanctuary','water-1','manifesto-rituals','manifesto-senses','manifesto-spirit','manifesto-close','rail','visit'];")
s = s.replace('<title>MOY&Sigma;EION &middot; Magna Graecia in Matera</title>', '<title>MOY&Sigma;EION &middot; Magna Graecia in Matera &middot; Version 3</title>', 1)

# ------------------------------------------------------------------ V2 aesthetic over V1's structure
CSS = r'''
/* ============================================================================================
   VERSION 3. Version 1's content, images, videos and motion; Version 2's aesthetic: the header bar,
   cards, ruled labels, filled gold buttons, footer. Nothing below changes what moves, only how it is dressed.
   ============================================================================================ */
:root{--line:rgba(131,109,48,.45);--line-soft:rgba(131,109,48,.28);--navy-2:#060b24;--navy-3:#0b1230;--nav-h:76px;--pad3:clamp(1.1rem,4.6vw,4.2rem)}
html{scroll-behavior:auto}
.sigil{display:block;color:var(--gold-body)}
.sigil.mini{width:44px;height:44px;flex:0 0 auto}
.sg{transform-box:view-box;transform-origin:500px 500px;animation:v3spin 90s linear infinite}
.sg1,.sg3{animation-direction:reverse;animation-duration:120s}
.v3-brand .sg{animation-duration:160s}
@keyframes v3spin{to{transform:rotate(360deg)}}

/* header */
nav.chrome{position:fixed;top:0;left:0;right:0;bottom:auto;width:auto;z-index:60;height:var(--nav-h);display:flex;flex-direction:row;align-items:center;gap:2rem;padding:0 var(--pad3);
  opacity:1!important;transform:none!important;pointer-events:auto!important;border-bottom:1px solid transparent;transition:background .5s ease,border-color .5s ease,height .4s ease}
nav.chrome::before{content:'';position:absolute;left:0;right:0;top:0;height:140%;z-index:-1;background:linear-gradient(180deg,rgba(1,4,22,.82),rgba(1,4,22,0));pointer-events:none;transition:opacity .4s}
nav.chrome.solid{background:rgba(1,4,22,.84);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-color:var(--line-soft);height:64px}
nav.chrome.solid::before{opacity:0}
nav.chrome > *{pointer-events:auto!important}
.v3-brand{display:flex;align-items:center;gap:.8rem;flex:0 0 auto;color:var(--gold-bright);text-decoration:none}
.v3-brand b{display:block;font-weight:700;font-size:1.35rem;letter-spacing:.14em;line-height:1}
.v3-brand small{display:block;font-size:.55rem;letter-spacing:.34em;color:var(--gold-deep);text-transform:uppercase;margin-top:.3rem}
.v3-menu{display:flex;align-items:center;gap:clamp(1rem,2.4vw,2.6rem);margin-left:auto;list-style:none}
.v3-menu>li{position:relative}
.v3-menu a,.v3-menu .dd-btn{white-space:nowrap;font-family:var(--font);font-size:.82rem;letter-spacing:.13em;text-transform:uppercase;color:var(--gold-body);padding:.5rem 0;display:inline-flex;align-items:center;gap:.4rem;text-decoration:none;background:none;border:0;cursor:pointer;transition:color .3s}
.v3-menu a:hover,.v3-menu .dd-btn:hover{color:var(--gold-bright)}
.dd-btn::after{content:'';width:.38rem;height:.38rem;border-right:1px solid currentColor;border-bottom:1px solid currentColor;transform:rotate(45deg) translateY(-2px);margin-left:.2rem}
.v3-menu .dd{position:absolute;top:100%;left:-1.2rem;min-width:15rem;padding:.7rem 0;background:rgba(1,4,22,.96);border:1px solid var(--line);opacity:0;visibility:hidden;transform:translateY(8px);transition:opacity .3s,transform .3s,visibility 0s .3s;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px)}
.v3-menu .has-dd:hover .dd,.v3-menu .has-dd:focus-within .dd{opacity:1;visibility:visible;transform:none;transition-delay:0s}
.v3-menu .dd a{display:block;padding:.6rem 1.3rem;letter-spacing:.1em;font-size:.76rem}
.v3-menu .dd a:hover{background:rgba(241,220,164,.06)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.7rem;font-family:var(--font);font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;padding:.8rem 1.5rem;border:1px solid var(--gold-body);color:var(--gold-bright);text-decoration:none;white-space:nowrap;background:none;cursor:pointer;transition:background .35s,color .35s,border-color .35s,box-shadow .35s}
.btn:hover{border-color:var(--gold-bright);background:rgba(241,220,164,.07);box-shadow:0 0 1.6rem rgba(241,220,164,.12)}
.btn.fill{background:var(--gold-body);color:var(--navy);border-color:var(--gold-body);font-weight:700}
.btn.fill:hover{background:var(--gold-bright);border-color:var(--gold-bright);color:var(--navy)}
.v3-cta{display:flex;gap:.8rem}
nav.chrome .v3-cta .btn,nav.chrome .sheet-row .btn{display:inline-flex;align-items:center;justify-content:center;font-family:var(--font);font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;padding:.8rem 1.5rem;border:1px solid var(--gold-body);color:var(--gold-bright);background:none;line-height:1;text-decoration:none;white-space:nowrap}
nav.chrome .v3-cta .btn:hover,nav.chrome .sheet-row .btn:hover{border-color:var(--gold-bright);background:rgba(241,220,164,.07);color:var(--gold-bright)}
nav.chrome .v3-cta .btn.fill,nav.chrome .sheet-row .btn.fill{background:var(--gold-body);color:var(--navy);border-color:var(--gold-body);font-weight:700}
nav.chrome .v3-cta .btn.fill:hover,nav.chrome .sheet-row .btn.fill:hover{background:var(--gold-bright);border-color:var(--gold-bright);color:var(--navy)}
.v3-tools{display:flex;align-items:center;gap:1rem}
.v3-tools .menu-langs{display:flex;align-items:center;gap:.5rem}
.v3-tools .lang-opt,.v3-tools #soundToggle{font-family:var(--font);font-size:.74rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-body);background:none;border:0;cursor:pointer;padding:.4rem .2rem}
.v3-tools #soundToggle[aria-pressed="true"]{color:var(--gold-bright)}
.v3-tools .rule{width:1px;height:.9rem;background:rgba(131,109,48,.55)}
.menu-btn{display:none;margin-left:auto;width:44px;height:44px;position:relative;z-index:62;background:none;border:0}
.menu-btn i{position:absolute;left:11px;right:11px;height:1px;background:var(--gold-bright);transition:transform .35s,opacity .3s,top .35s}
.menu-btn i:nth-child(1){top:16px}.menu-btn i:nth-child(2){top:22px}.menu-btn i:nth-child(3){top:28px}
nav.chrome.open .menu-btn i:nth-child(1){top:22px;transform:rotate(45deg)}
nav.chrome.open .menu-btn i:nth-child(2){opacity:0}
nav.chrome.open .menu-btn i:nth-child(3){top:22px;transform:rotate(-45deg)}
nav.chrome .menu-panel{display:none}
@media (max-width:1180px) and (min-width:821px){
  nav.chrome .v3-cta .btn:not(.fill){display:none}
  nav.chrome{gap:1rem}.v3-menu{gap:1.1rem}
  .v3-menu a,.v3-menu .dd-btn{font-size:.7rem;letter-spacing:.09em}
  nav.chrome .v3-cta .btn{padding:.7rem 1rem;font-size:.68rem}.v3-brand b{font-size:1.1rem}
}
@media (max-width:820px){
  .v3-menu,.v3-cta,.v3-tools{display:none}
  nav.chrome .menu-btn{display:block}
  nav.chrome .menu-panel{display:flex;flex-direction:column;position:fixed;top:0;left:0;width:100vw;height:calc(var(--vh)*50);min-height:22rem;overflow:auto;z-index:61;align-items:stretch;justify-content:flex-start;
    background:rgba(1,4,22,.97);border:0;border-bottom:1px solid var(--line);padding:calc(var(--nav-h) + .2rem) 7vw 1.4rem;gap:1rem;opacity:0;visibility:hidden;transform:translateY(-1.2rem);pointer-events:none;
    transition:opacity .35s,transform .35s,visibility 0s .35s}
  nav.chrome.open .menu-panel{opacity:1;visibility:visible;transform:none;pointer-events:auto;transition-delay:0s}
  nav.chrome.open .menu-panel *{pointer-events:auto}
  .sheet-cols{display:grid;grid-template-columns:1fr 1fr;gap:.1rem 1.6rem}
  .sheet-cols a{display:block;font-size:.95rem;letter-spacing:.08em;padding:.42rem 0;color:var(--gold-body);text-decoration:none}
  .sheet-row{display:flex;gap:.7rem;flex-wrap:wrap;align-items:center}
  nav.chrome .sheet-row .btn{padding:.7rem 1rem;font-size:.7rem}
  .sheet-row .menu-langs{display:flex;align-items:center;gap:.8rem;margin-right:auto}
  .menu-panel .lang-opt,.sheet-sound{font-family:var(--font);font-size:.9rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-body);background:none;border:0;padding:.5rem .3rem}
  .menu-panel .lang-opt[aria-pressed="true"]{color:var(--gold-bright)}
  .menu-panel .rule{width:1px;height:1rem;background:rgba(131,109,48,.55)}
  .v3-brand b{font-size:1.15rem}
}

/* the "+" after the title: language and sound unfold from it */
.tools-wrap{position:relative;flex:0 0 auto;margin-left:-.6rem}
.plus{width:30px;height:30px;border:1px solid var(--line);border-radius:50%;position:relative;color:var(--gold-bright);background:none;cursor:pointer;transition:border-color .3s,background .3s,transform .4s}
.plus i{position:absolute;left:50%;top:50%;width:11px;height:1px;background:currentColor;transform:translate(-50%,-50%)}
.plus i:nth-child(2){transform:translate(-50%,-50%) rotate(90deg)}
.plus:hover{border-color:var(--gold-bright);background:rgba(241,220,164,.07)}
.plus[aria-expanded="true"]{transform:rotate(45deg);border-color:var(--gold-bright)}
.tools-pop{position:absolute;top:calc(100% + .8rem);right:0;left:auto;min-width:11rem;padding:.9rem 1.1rem;display:flex;flex-direction:column;gap:.8rem;background:rgba(1,4,22,.95);border:1px solid var(--line);border-radius:12px;-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
  opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .3s,transform .3s,visibility 0s .3s;z-index:70}
.tools-wrap.open .tools-pop{opacity:1;visibility:visible;transform:none;transition-delay:0s}
.tools-pop .menu-langs{display:flex;align-items:center;gap:.7rem}
.tools-pop .rule{width:1px;height:.9rem;background:var(--line)}
.tools-pop .lang-opt,.tools-pop #soundToggle{font-family:var(--font);font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-body);background:none;border:0;padding:.3rem .2rem;cursor:pointer;text-align:left}
.tools-pop .lang-opt[aria-pressed="true"],.tools-pop #soundToggle[aria-pressed="true"]{color:var(--gold-bright)}
.tools-pop .lang-opt[aria-pressed="false"]{opacity:.65}
.tools-pop #soundToggle::before{content:'';display:inline-block;width:.5rem;height:.5rem;border-radius:50%;margin-right:.6rem;border:1px solid var(--gold-deep)}
.tools-pop #soundToggle[aria-pressed="true"]::before{background:var(--gold-bright);border-color:var(--gold-bright);box-shadow:0 0 .6rem rgba(241,220,164,.6)}
.sheet-cols h4{font-weight:400;font-size:.6rem;letter-spacing:.3em;color:var(--gold-deep);text-transform:uppercase;margin:.4rem 0 .2rem}

/* the big title dissolves into the bar's own name */
.wordmark{transition:none}

/* ruled labels and eyebrows */
.v3-eyebrow{display:flex;align-items:center;gap:1rem;font-size:.74rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-body);margin-bottom:clamp(1rem,2vw,1.6rem);opacity:.9}
.v3-eyebrow i{font-style:normal;color:var(--gold-deep)}
.v3-eyebrow::after{content:'';height:1px;width:3.2rem;background:var(--line)}
.manifesto.side-right .v3-eyebrow{flex-direction:row-reverse}
.v3-label{position:relative;z-index:20;display:flex;align-items:center;justify-content:center;gap:1.4rem;font-size:.82rem;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-bright);padding:0 var(--pad3);margin:8vh 0 3vh}
.v3-label::before,.v3-label::after{content:'';flex:1;height:1px;background:var(--line-soft);max-width:22rem}

/* text and capsule sit in a card */
.manifesto:not(.m-close) .manifesto-inner{padding:clamp(1.4rem,3vw,3rem);border:1px solid var(--line-soft);border-radius:14px;
  background:radial-gradient(ellipse 90% 60% at 50% 0%,rgba(131,109,48,.13),transparent 70%),linear-gradient(170deg,var(--navy-3),var(--navy-2) 60%,#050a1f)}
.section-imgs{border-radius:50% / 20%}

/* water band: inset and framed */
.water-band{width:auto;margin:10vh var(--pad3);border-radius:14px;border:1px solid var(--line-soft)}

/* reels: V2 captions already match; frame them the same way */
.reel-frame{border-color:var(--line)}

/* explore rail as cards */
.rail-head h2{font-size:clamp(1.7rem,3.2vw,3rem)}
.rail-card{padding:clamp(1rem,1.6vw,1.5rem);border:1px solid var(--line-soft);border-radius:14px;gap:1.2rem;
  background:radial-gradient(ellipse 90% 60% at 50% 0%,rgba(131,109,48,.13),transparent 70%),linear-gradient(170deg,var(--navy-3),var(--navy-2) 60%,#050a1f);
  transition:border-color .45s,transform .5s cubic-bezier(.2,.7,.2,1),box-shadow .5s}
.rail-card:hover{border-color:var(--gold-body);transform:translateY(-6px);box-shadow:0 1.6rem 3.2rem rgba(0,0,0,.45),0 0 2.4rem rgba(241,220,164,.07)}
.rail-card .cap{box-shadow:none}
.rail-track .rail-card.tile:nth-child(n){padding:0;gap:0;transform:none;border-radius:14px;background:#0a1024}
.rail-track.mosaic{padding-top:.5rem;padding-bottom:2rem}
.rail-card.tile .tl{text-align:left;padding:clamp(.8rem,1.3vw,1.3rem)}
.rail-track .rail-card.tile:nth-child(n):hover{transform:none}

/* closing section: V2's buttons */
.visit-actions a{font-family:var(--font);font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;padding:.8rem 1.5rem;border:1px solid var(--gold-body);color:var(--gold-bright);transition:background .35s,color .35s,border-color .35s,box-shadow .35s}
.visit-actions a:hover,.visit-actions a:focus-visible{border-color:var(--gold-bright);background:rgba(241,220,164,.07);box-shadow:0 0 1.6rem rgba(241,220,164,.12)}
.visit-actions a.primary{background:var(--gold-body);color:var(--navy);border-color:var(--gold-body);font-weight:700}
.visit-actions a.primary:hover{background:var(--gold-bright);border-color:var(--gold-bright);color:var(--navy)}

/* the film runs to the very end: the footer sits on it, over a soft scrim, with no band of its own */
.visit{padding-bottom:0}
.visit .coda{margin-top:auto}
.visit .visit-actions{margin-bottom:auto}
.visit::before{background:linear-gradient(rgba(1,4,22,.7),rgba(1,4,22,.5) 45%,rgba(1,4,22,.3))!important}
.visit > .site-foot.v3foot{align-self:stretch;width:auto;margin:clamp(1.4rem,4vh,2.6rem) -5% 0;-webkit-backdrop-filter:none;backdrop-filter:none}
.visit > .site-foot.v3foot .foot-note{width:100%;max-width:none;font-size:.7rem;line-height:1.5}
/* footer */
.site-foot.v3foot{display:block;border-top:1px solid rgba(241,220,164,.22);background:linear-gradient(0deg,rgba(1,4,22,.72),rgba(1,4,22,.45) 55%,rgba(1,4,22,0));padding:clamp(1.6rem,3vw,2.6rem) var(--pad3);font-size:inherit;letter-spacing:normal}
.v3foot .foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem 1.6rem;max-width:96rem;margin:0 auto}
/* a slim band, at every width: one compact row (it wraps, never stacks into a block) */
.site-foot.v3foot{padding:.9rem var(--pad3) .8rem!important}
.v3foot .v3-brand{gap:.55rem}
.v3foot .v3-brand .sigil.mini{width:28px;height:28px}
.v3foot .v3-brand b{font-size:.95rem}
.v3foot .v3-brand small{display:none}
.v3foot nav{display:flex;gap:.4rem 1.3rem;justify-content:center;flex-wrap:wrap;flex:1 1 auto}
.v3foot nav a{font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-body);text-decoration:none}
.v3foot nav a:hover{color:var(--gold-bright)}
.v3foot .social{display:flex;gap:.9rem}
.v3foot .social a{width:18px;height:18px;color:var(--gold-body);transition:color .3s,transform .3s}
.v3foot .social a:hover{color:var(--gold-bright);transform:translateY(-2px)}
.v3foot .news{display:inline-flex;align-items:center;gap:.5rem;font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-body);padding-left:0;border:0;text-decoration:none}
.v3foot .news svg{width:18px;height:18px}
.v3foot .news:hover{color:var(--gold-bright)}
.v3foot .foot-note{flex:1 0 100%;margin:.2rem 0 0;text-align:center;font-size:.7rem;letter-spacing:.06em;color:var(--gold-body);padding-top:.6rem;border-top:1px solid var(--line-soft)}
@media (max-width:560px){.v3foot .foot{justify-content:center}.v3foot nav{flex:1 0 100%;order:3}}
'''
a = s.index('</style>')
s = s[:a] + CSS + s[a:]

# ------------------------------------------------------------------ behaviour
JS = r'''<script>
(function(){
  var nav = document.getElementById('chrome');
  function solid(){ nav.classList.toggle('solid', window.scrollY > 24); document.documentElement.classList.toggle('nav-on', window.scrollY > window.innerHeight * 1.75); }
  window.addEventListener('scroll', solid, { passive:true }); solid();

  // anchors: pinned sections are reached at their pin start, everything else at its top
  function target(id){
    if (!window.ScrollTrigger) return null;
    var st = ScrollTrigger.getAll().filter(function(t){ return t.vars && t.vars.id === 'pin-' + id; })[0];
    if (st) return st.start;
    var el = document.getElementById(id); return el ? el.getBoundingClientRect().top + window.scrollY - 70 : null;
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-go]');
    if (a){
      var y = target(a.getAttribute('data-go'));
      if (y !== null){ e.preventDefault(); window.scrollTo({ top:y, behavior:'smooth' }); nav.classList.remove('open'); var mb = document.getElementById('menuBtn'); if (mb) mb.setAttribute('aria-expanded','false'); }
    }
    // framed by the review page: open the matching Version 2 page there instead of leaving this one
    var l = e.target.closest && e.target.closest('a[href^="proposal/"]');
    if (l && window.parent !== window){ e.preventDefault(); window.parent.postMessage({ type:'moy-open', href:l.getAttribute('href') }, '*'); }
  }, true);
  var tw = document.querySelector('.tools-wrap'), pl = tw && tw.querySelector('.plus');
  if (pl){
    var setO = function(o){ tw.classList.toggle('open', o); pl.setAttribute('aria-expanded', o ? 'true' : 'false'); };
    pl.addEventListener('click', function(e){ e.stopPropagation(); setO(!tw.classList.contains('open')); });
    document.addEventListener('click', function(e){ if (!tw.contains(e.target)) setO(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') setO(false); });
  }
  var proxy = document.getElementById('soundProxy');
  if (proxy) proxy.addEventListener('click', function(){ document.getElementById('soundToggle').click(); });
  nav.querySelectorAll('.menu-panel a').forEach(function(a){ a.addEventListener('click', function(){ nav.classList.remove('open'); }); });
})();
</script>
'''

# =====================================================================================================
# VERSION 3, TAKEN FURTHER. Same content, images, videos and motion as Version 1, but the page is now an
# editorial object: viewfinder corners, giant ghost numerals, outlined type bleeding off the edges, tickers
# that run with the scroll, a section counter, a trailing ring cursor, hairline-grid mosaic. Nothing here
# changes what the page says or what moves in it, only how it is staged.
# =====================================================================================================
DARING_CSS = r"""
/* ---- frame: viewfinder corners + HUD ---- */
.v3-frame{position:fixed;inset:14px;z-index:58;pointer-events:none}
.v3-frame i{position:absolute;width:22px;height:22px;border:0 solid rgba(241,220,164,.55)}
.v3-frame i:nth-child(1){left:0;top:0;border-left-width:1px;border-top-width:1px}
.v3-frame i:nth-child(2){right:0;top:0;border-right-width:1px;border-top-width:1px}
.v3-frame i:nth-child(3){left:0;bottom:0;border-left-width:1px;border-bottom-width:1px}
.v3-frame i:nth-child(4){right:0;bottom:0;border-right-width:1px;border-bottom-width:1px}
.v3-hud,.v3-coord{transition:opacity .5s}
html.hud-off .v3-hud{opacity:0}
html.end-on .v3-coord{opacity:0}
.v3-hud{position:fixed;left:34px;bottom:26px;z-index:58;pointer-events:none;display:flex;align-items:baseline;gap:.9rem;font-family:var(--font);color:var(--gold-bright);mix-blend-mode:difference}
.v3-hud b{font-size:1.1rem;font-weight:400;line-height:.8;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.v3-hud span{font-size:.6rem;letter-spacing:.34em;text-transform:uppercase;opacity:.85}
.v3-hud em{font-style:normal;font-size:.6rem;letter-spacing:.2em;opacity:.55}
.v3-coord{display:none;position:fixed;right:34px;bottom:26px;z-index:58;pointer-events:none;text-align:right;font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-bright);opacity:.8;mix-blend-mode:difference;line-height:1.9}
.v3-coord u{display:block;text-decoration:none;opacity:.6}
.v3-ring{position:fixed;left:0;top:0;width:34px;height:34px;margin:-17px 0 0 -17px;border:1px solid rgba(241,220,164,.75);border-radius:50%;z-index:90;pointer-events:none;mix-blend-mode:difference;transition:width .35s cubic-bezier(.2,.7,.2,1),height .35s cubic-bezier(.2,.7,.2,1),margin .35s cubic-bezier(.2,.7,.2,1),background .3s;opacity:0}
.v3-ring.on{opacity:1}
.v3-ring.big{width:74px;height:74px;margin:-37px 0 0 -37px;background:rgba(241,220,164,.18)}
@media (hover:none){.v3-ring{display:none}}
@media (max-width:820px){.v3-frame{inset:8px}.v3-coord{display:none}.v3-hud{bottom:22px}}

/* the bar appears only once the first section has been scrolled */
html:not(.nav-on) nav.chrome{opacity:0!important;transform:translateY(-100%)!important;pointer-events:none!important}
html:not(.nav-on) nav.chrome *{pointer-events:none!important}
nav.chrome{transition:opacity .5s ease,transform .5s ease,background .5s ease,height .4s ease!important}
/* ---- header becomes a floating glass pill of links ---- */

/* ---- the sections: open typography, ghost numerals, hairlines ---- */
main{counter-reset:sec}
.manifesto:not(.m-close){counter-increment:sec}
.manifesto:not(.m-close) .manifesto-inner{position:relative;z-index:2;padding:0 0 0 clamp(1.2rem,2.2vw,2.4rem);border:0;border-left:1px solid var(--gold-deep);border-radius:0;background:none}
.manifesto.side-right:not(.m-close) .manifesto-inner{padding:0 clamp(1.2rem,2.2vw,2.4rem) 0 0;border-left:0;border-right:1px solid var(--gold-deep)}
.v3-eyebrow{font-size:.7rem;letter-spacing:.42em;margin-bottom:clamp(1.2rem,2.4vw,2.2rem)}
.v3-eyebrow i{font-size:1.7rem;letter-spacing:0;line-height:1;color:var(--gold-bright);font-style:normal}
.v3-eyebrow::after{width:5rem}
.manifesto p{text-wrap:balance}
.manifesto strong{color:var(--gold-bright)}

/* alcoves: clean, one hairline, no halo */
.section-imgs{outline:1px solid rgba(241,220,164,.85)!important;outline-offset:-1px;
  box-shadow:0 0 .7rem rgba(241,220,164,.28),0 0 2.2rem rgba(241,220,164,.12),inset 0 0 0 1px rgba(1,4,22,.55)!important;transition:box-shadow .6s ease}
.section-imgs:hover{box-shadow:0 0 .9rem rgba(241,220,164,.4),0 0 3rem rgba(241,220,164,.18),inset 0 0 0 1px rgba(1,4,22,.55)!important}

/* ---- tickers: giant outlined words that travel with the scroll ---- */
.v3-tick{position:relative;z-index:20;overflow:hidden;padding:clamp(3rem,9vh,7rem) 0;border-top:1px solid var(--line-soft);border-bottom:1px solid var(--line-soft);margin:6vh 0;background:linear-gradient(90deg,rgba(1,4,22,.9),rgba(1,4,22,.55),rgba(1,4,22,.9))}
.v3-tick div{display:flex;gap:4vw;white-space:nowrap;width:max-content;will-change:transform}
.v3-tick span{font-family:var(--font);font-weight:700;font-size:clamp(3.5rem,9vw,9rem);line-height:.9;letter-spacing:-.02em;text-transform:uppercase;color:transparent;-webkit-text-stroke:1px rgba(241,220,164,.6)}
.v3-tick span:nth-child(even){color:var(--gold-bright);-webkit-text-stroke:0;font-weight:400}
.v3-tick.rev{border-top:0}
.v3-tick small{position:absolute;left:var(--pad3);top:1.1rem;font-size:.62rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold-body);z-index:2}

/* ---- water band: bleeds edge to edge, with the sanctuary written across it ---- */
.water-band{width:100vw;margin:10vh 0;border:0;border-radius:0}

/* ---- reels: arches, tilted, numbered ---- */
.reel-frame{border-radius:0;border-color:rgba(241,220,164,.4)}
.reel:nth-child(n){transform:none}
.reel-title{font-size:.66rem;letter-spacing:.4em}
.reel-title::before{content:counter(reel,decimal-leading-zero) ' — ';color:var(--gold-deep)}
.reels{counter-reset:reel}.reel{counter-increment:reel}
@media (max-width:520px){.reel:nth-child(n){transform:none}}

/* ---- the mosaic: clean tiles, photographs in full colour, every title on a solid plate ---- */
.rail-track.mosaic{gap:clamp(.6rem,1vw,1rem);background:none;padding:.4rem var(--pad3) 1rem;border:0;margin:0;width:auto;--row:clamp(10rem,36vh,19rem)}
.rail-track .rail-card.tile:nth-child(n){border-radius:0!important;border:1px solid rgba(131,109,48,.55);background:#050a1f;transform:none;scroll-snap-align:start}
.rail-track .rail-card.tile:nth-child(n):hover{transform:none;box-shadow:none;border-color:var(--gold-bright)}
.rail-card.tile img{filter:none!important;transition:transform 1.2s cubic-bezier(.2,.7,.2,1)}
.rail-card.tile:hover img,.rail-card.tile:focus-visible img{transform:scale(1.05)}
.rail-card.tile::after{display:none}
.rail-card.tile::before{content:counter(tile,decimal-leading-zero);counter-increment:tile;position:absolute;left:0;top:0;z-index:3;padding:.5rem .8rem;background:var(--navy);color:var(--gold-bright);font-size:.75rem;letter-spacing:.3em;border-right:1px solid rgba(131,109,48,.55);border-bottom:1px solid rgba(131,109,48,.55)}
.rail-track.mosaic{counter-reset:tile}
.rail-card.tile .tl{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:.8rem 1rem .9rem;background:rgba(1,4,22,.94);border-top:1px solid rgba(131,109,48,.55);text-align:left!important}
.rail-card.tile .tl b{font-size:clamp(.95rem,1.25vw,1.3rem);text-transform:uppercase;letter-spacing:.14em;color:var(--gold-bright)}
.rail-card.tile .tl span{display:block;font-size:clamp(.75rem,.85vw,.88rem);line-height:1.4;margin-top:.25rem;color:var(--gold-body);opacity:1;-webkit-line-clamp:2}
.rail-card.tile .tl i{opacity:1!important;transform:none!important;margin-top:.45rem;font-size:.66rem;color:var(--gold-bright)}
.rail-card.tile.big .tl b{font-size:clamp(1.4rem,2.4vw,2.4rem)}
.rail-card.tile.big .tl span{-webkit-line-clamp:3;font-size:clamp(.85rem,1vw,1.05rem)}
.rail-card.tile:not(.big):not(.wide):not(.tall) .tl span{-webkit-line-clamp:1}
.rail-head h2{font-size:clamp(2.4rem,6vw,6rem);letter-spacing:-.01em;line-height:.95}
.rail-nav button{border-radius:0}
@media (max-width:520px){.rail-track.mosaic{--row:clamp(9rem,24vh,13rem)}.rail-card.tile .tl span{-webkit-line-clamp:1}}

/* ---- closing: the name, enormous, outlined, under the sigil ---- */
.visit-actions a,.btn{border-radius:0}
"""
DARING_HTML = """
<div class="v3-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
<div class="v3-hud" aria-hidden="true"><b id="hudN">00</b><span id="hudT">MOΥΣEION</span><em>/ 06</em></div>
<div class="v3-ring" id="v3ring" aria-hidden="true"></div>
"""
TICK = lambda label, words, rev: '<div class="v3-tick%s" aria-hidden="true" data-tick="%s"><small>%s</small><div>%s</div></div>' % (
    ' rev' if rev else '', '-1' if rev else '1', label, ''.join('<span>%s</span>' % w for w in words * 2))
DARING_JS = r"""<script>
(function(){
  // ---- trailing ring cursor (fine pointers only)
  var ring = document.getElementById('v3ring');
  if (ring && window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    var x = -100, y = -100, rx = x, ry = y;
    window.addEventListener('mousemove', function(e){ x = e.clientX; y = e.clientY; ring.classList.add('on'); }, { passive:true });
    (function loop(){ rx += (x - rx) * .2; ry += (y - ry) * .2; ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)'; requestAnimationFrame(loop); })();
    document.addEventListener('mouseover', function(e){ ring.classList.toggle('big', !!(e.target.closest && e.target.closest('a,button,.rail-card,.reel'))); });
  }
  // ---- section counter
  var secs = [].slice.call(document.querySelectorAll('.manifesto:not(.m-close)')), hudN = document.getElementById('hudN'), hudT = document.getElementById('hudT'), last = -1;
  var NAMES = ['Essence','Structure','Sanctuary','Rituals','Senses','Spirit'];
  function hud(){
    var best = -1, bd = 1e9, mid = window.innerHeight / 2;
    secs.forEach(function(s, i){ var r = s.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return; var d = Math.abs((r.top + r.bottom) / 2 - mid); if (d < bd){ bd = d; best = i; } });
    document.documentElement.classList.toggle('hud-off', best < 0);
    var vs = document.getElementById('visit'); document.documentElement.classList.toggle('end-on', !!vs && vs.getBoundingClientRect().top < window.innerHeight * .6);
    if (best !== last){ last = best; hudN.textContent = best < 0 ? '00' : String(best + 1).padStart(2, '0'); hudT.textContent = best < 0 ? 'MOΥΣEION' : NAMES[best]; }
  }
  window.addEventListener('scroll', hud, { passive:true }); hud();
  // ---- tickers travel with the scroll
  function ticks(){
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('.v3-tick').forEach(function(t){
      var dir = +t.getAttribute('data-tick'), row = t.querySelector('div'), run = function(){ return row.scrollWidth / 2; };
      gsap.fromTo(row, { x: dir > 0 ? 0 : function(){ return -run(); } }, { x: dir > 0 ? function(){ return -run(); } : 0, ease:'none',
        scrollTrigger:{ trigger:t, start:'top bottom', end:'bottom top', scrub:.6, invalidateOnRefresh:true } });
    });
  }
  window.addEventListener('load', function(){ setTimeout(ticks, 900); });
})();
</script>
"""
a = s.index('<div class="photo" id="photo">')
s = s[:a] + DARING_HTML + s[a:]
# tickers: after the structure section and before the rail
sub('<div class="v3-label"><span>From inside</span></div>', TICK('Matera · 7th c. BCE', ['Magna Graecia', 'Neolithic', 'Enotrian', 'Sassi'], False) + '\n<div class="v3-label"><span>From inside</span></div>')
sub('<section class="rail" id="rail"', TICK('Rituals · Waters · Words', ['Xenia', 'Symposium', 'Akratisma', 'Demeter'], True) + '\n<section class="rail" id="rail"')

# ---------------- MYSTIQUE + LUXURY: the museum / hotel duality ----------------
DUAL_CSS = r"""
/* brand carries the duality */
.v3-brand small{letter-spacing:.2em;white-space:nowrap;font-size:.5rem}
@media (max-width:520px){.v3-brand small{letter-spacing:.1em;font-size:.44rem}}
/* a darker, warmer atmosphere: lamp-lit, like a site at night */
.vignette{background:radial-gradient(ellipse 110% 80% at 50% 45%,transparent 0%,transparent 35%,rgba(1,4,22,.78) 100%)!important}

/* ---- DUALITY: Excavation | Residence ---- */
.dual{position:relative;z-index:20;padding:12vh 0 10vh}
.dual-head{text-align:center;padding:0 var(--pad3);margin-bottom:6vh}
.dual-head p{font-size:.7rem;letter-spacing:.5em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:1.4rem}
.dual-head h2{font-weight:400;font-size:clamp(2.2rem,5.4vw,5.4rem);line-height:1.02;color:var(--gold-bright);letter-spacing:-.01em}
.dual-head h2 em{font-style:normal;display:block;font-size:.42em;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-body);margin-top:1.4rem}
.dual-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:0 var(--pad3);border:1px solid rgba(131,109,48,.55);min-height:min(78vh,46rem)}
.d-half{position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(1.4rem,3vw,3rem);isolation:isolate}
.d-half>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:-2}
.d-half::after{content:'';position:absolute;inset:0;z-index:-1}
.d-dig{border-right:1px solid rgba(131,109,48,.55);background:#02030d;cursor:none}
.d-dig>img{filter:sepia(.7) contrast(1.15) brightness(.9);-webkit-mask-image:radial-gradient(circle var(--r,0px) at var(--mx,50%) var(--my,50%),#000 0%,rgba(0,0,0,.85) 55%,transparent 100%);mask-image:radial-gradient(circle var(--r,0px) at var(--mx,50%) var(--my,50%),#000 0%,rgba(0,0,0,.85) 55%,transparent 100%)}
.d-dig::after{background:linear-gradient(0deg,rgba(2,3,13,.95),rgba(2,3,13,.2) 55%)}
.d-res>img{filter:saturate(1.05) brightness(.82)}
.d-res::after{background:linear-gradient(0deg,rgba(1,4,22,.94),rgba(1,4,22,.1) 62%)}
.d-tag{position:absolute;left:clamp(1.4rem,3vw,3rem);top:clamp(1.2rem,2.4vw,2.2rem);font-size:.64rem;letter-spacing:.4em;text-transform:uppercase;color:var(--gold-body)}
.d-hint{position:absolute;right:clamp(1.4rem,3vw,3rem);top:clamp(1.2rem,2.4vw,2.2rem);font-size:.58rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-deep);transition:opacity .5s}
.d-half h3{font-weight:400;font-size:clamp(1.8rem,3.6vw,3.8rem);letter-spacing:.02em;text-transform:none;color:var(--gold-bright);line-height:1;margin-bottom:1rem}
.d-half ul{list-style:none;display:grid;gap:.5rem;margin-bottom:1.4rem}
.d-half li{font-size:clamp(.82rem,1vw,1rem);letter-spacing:.06em;color:var(--gold-body);padding-left:1.4rem;position:relative}
.d-half li::before{content:'';position:absolute;left:0;top:.7em;width:.7rem;height:1px;background:var(--gold-deep)}
.d-half .btn{align-self:flex-start;border-radius:0}
.d-seal{position:absolute;left:50%;top:50%;z-index:6;transform:translate(-50%,-50%);width:clamp(5rem,9vw,8rem);aspect-ratio:1;border-radius:50%;background:var(--navy);border:1px solid var(--gold-body);display:grid;place-items:center;pointer-events:none}
.d-seal .sigil{width:78%;height:78%}
.dual-foot{display:flex;justify-content:space-between;gap:2rem;margin:0 var(--pad3);padding:1.2rem 0;font-size:.62rem;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-deep)}
@media (max-width:820px){.dual-grid{grid-template-columns:1fr;min-height:0}.d-half{min-height:72vh}.d-dig{border-right:0;border-bottom:1px solid rgba(131,109,48,.55);cursor:auto}.d-seal{top:72vh;width:4.6rem}.d-hint{display:none}.d-dig>img{-webkit-mask-image:none;mask-image:none}}

/* ---- STRATA: the page is a dig, read top to bottom ---- */
.strata{position:relative;z-index:20;padding:8vh var(--pad3) 10vh}
.strata h2{font-weight:400;font-size:clamp(1.4rem,2.4vw,2.2rem);letter-spacing:.34em;text-transform:uppercase;color:var(--gold-bright);margin-bottom:5vh;display:flex;align-items:center;gap:1.4rem}
.strata h2::after{content:'';flex:1;height:1px;background:rgba(131,109,48,.45)}
.layer{display:grid;grid-template-columns:7rem 1fr auto;gap:clamp(1rem,3vw,3rem);align-items:baseline;padding:clamp(1.2rem,2.6vw,2.2rem) 0;border-top:1px solid rgba(131,109,48,.35);transition:background .5s,padding .5s}
.layer:last-child{border-bottom:1px solid rgba(131,109,48,.35)}
.layer:hover{background:linear-gradient(90deg,rgba(241,220,164,.06),transparent 70%);padding-left:1rem}
.layer i{font-style:normal;font-size:.66rem;letter-spacing:.34em;text-transform:uppercase;color:var(--gold-deep)}
.layer b{font-weight:400;font-size:clamp(1.5rem,3.4vw,3.4rem);line-height:1;color:var(--gold-bright);letter-spacing:.01em}
.layer span{font-size:clamp(.78rem,.95vw,.95rem);letter-spacing:.1em;color:var(--gold-body);text-align:right;max-width:20rem}
@media (max-width:700px){.layer{grid-template-columns:1fr;gap:.4rem}.layer span{text-align:left}}

/* ---- SERVICE: the four-star side, said quietly ---- */
.house{position:relative;z-index:20;display:grid;grid-template-columns:repeat(4,1fr);margin:0 var(--pad3) 10vh;border:1px solid rgba(131,109,48,.45)}
.house div{padding:clamp(1.2rem,2vw,2rem);border-right:1px solid rgba(131,109,48,.35);text-align:left}
.house div:last-child{border-right:0}
.house small{display:block;font-size:.6rem;letter-spacing:.38em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:1.6rem}
.house b{display:block;font-weight:400;font-size:clamp(1.1rem,1.6vw,1.6rem);color:var(--gold-bright);margin-bottom:.5rem}
.house p{font-size:.84rem;line-height:1.55;color:var(--gold-body)}
@media (max-width:820px){.house{grid-template-columns:1fr 1fr}.house div:nth-child(2){border-right:0}.house div:nth-child(-n+2){border-bottom:1px solid rgba(131,109,48,.35)}}
"""
DUAL_HTML = """
<section class="dual" id="dual" aria-label="Museum and residence">
  <div class="dual-head"><p>One address</p><h2>Antiquity, inhabited.<em>Research &nbsp;·&nbsp; Hospitality</em></h2></div>
  <div class="dual-grid">
    <div class="d-half d-dig" id="dig"><img data-img="neolithic2" alt="" draggable="false"><span class="d-tag">I &nbsp;·&nbsp; Research</span><span class="d-hint">Draw the lamp across the stone</span>
      <h3>Research</h3><ul><li>Excavation and experimental archaeology</li><li>Sixteen reconstructed houses, from the Neolithic to Magna Graecia</li><li>Fondazione Moyseion &ndash; ISAMA ETS</li></ul>
      <a class="btn" href="proposal/moyseion-explore.html#research">Enter the research</a></div>
    <div class="d-half d-res"><img data-img="xenia2" alt="" draggable="false"><span class="d-tag">II &nbsp;·&nbsp; Hospitality</span>
      <h3>Hospitality</h3><ul><li>A house of your own, entrusted to you on arrival</li><li>The Water Sanctuary, Akratisma and the Symposium</li><li>Discreet service, with arrivals until 22:00</li></ul>
      <a class="btn fill" href="proposal/moyseion-plan.html">Plan your stay</a></div>
    <div class="d-seal" aria-hidden="true">SIGIL</div>
  </div>
  <div class="dual-foot"><span>Matera &middot; Basilicata</span><span>Research &amp; Hospitality</span><span>Revive</span></div>
</section>
<section class="strata" id="strata" aria-label="Strata">
  <h2>Stratigraphy</h2>
  <div class="layer"><i>Layer III</i><b>Magna Graecia</b><span>7th &ndash; 4th century BCE</span></div>
  <div class="layer"><i>Layer II</i><b>Enotrian</b><span>Before the Greek colonists</span></div>
  <div class="layer"><i>Layer I</i><b>Neolithic</b><span>From the 4th millennium BCE</span></div>
</section>
<section class="house" aria-label="The house">
  <div><small>Arrival</small><b>Xenia</b><p>The guest is received at the threshold.</p></div>
  <div><small>Water</small><b>The Sanctuary</b><p>The descent into water: silence, purification, listening.</p></div>
  <div><small>Table</small><b>Akratisma</b><p>The first meal, as archaeological research.</p></div>
  <div><small>Service</small><b>Service</b><p>Arrivals, transfers and luggage, quietly arranged.</p></div>
</section>
"""
DUAL_JS = """<script>
(function(){
  // the sigil in the seal
  var seal = document.querySelector('.d-seal');
  if (seal){ var src = document.querySelector('.v3-brand svg'); if (src) seal.innerHTML = src.outerHTML.replace('sigil mini','sigil'); }
  // a lamp moves across the dark half and reveals the dig
  var dig = document.getElementById('dig'); if (!dig) return;
  var hint = dig.querySelector('.d-hint');
  function set(x, y, r){ dig.style.setProperty('--mx', x + 'px'); dig.style.setProperty('--my', y + 'px'); dig.style.setProperty('--r', r + 'px'); }
  var R = Math.max(150, Math.min(280, dig.clientWidth * .3)), cur = 0, tx = 0, ty = 0, cx = 0, cy = 0, on = false;
  dig.addEventListener('pointerenter', function(){ on = true; if (hint) hint.style.opacity = 0; });
  dig.addEventListener('pointerleave', function(){ on = false; });
  dig.addEventListener('pointermove', function(e){ var r = dig.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; if (!cur){ cx = tx; cy = ty; } });
  (function loop(){ cx += (tx - cx) * .16; cy += (ty - cy) * .16; cur += ((on ? R : 0) - cur) * .12; if (cur > .5 || on) set(cx, cy, cur); requestAnimationFrame(loop); })();
  // touch / no-hover: a slow lamp drifts on its own so the dig is never hidden
  if (!window.matchMedia('(hover:hover)').matches){
    var t = 0; (function drift(){ t += .008; var w = dig.clientWidth, h = dig.clientHeight; tx = w * (.5 + .3 * Math.sin(t)); ty = h * (.45 + .25 * Math.cos(t * 1.3)); cx = tx; cy = ty; cur = Math.min(w, h) * .55; set(cx, cy, cur); requestAnimationFrame(drift); })();
  }
  function fill(){ document.querySelectorAll('.dual [data-img]').forEach(function(i){ var u = window.__IMG && window.__IMG[i.dataset.img]; if (u) i.src = u; }); }
  fill(); window.addEventListener('load', fill);
})();
</script>
"""
sub('<section class="rail" id="rail"', DUAL_HTML + '<section class="rail" id="rail"')
a = s.index('</style>')
s = s[:a] + DUAL_CSS + s[a:]

FOOT_CSS = """
/* footer: ONE line, flush with the absolute bottom of the page */
.visit{padding-bottom:0!important}
.visit > .site-foot.v3foot{margin:auto -5% 0!important;padding:.7rem var(--pad3)!important;border-top:1px solid rgba(241,220,164,.2);background:linear-gradient(0deg,rgba(1,4,22,.85),rgba(1,4,22,.45))}
.v3foot .foot{display:flex!important;flex-wrap:nowrap!important;align-items:center;justify-content:center;gap:clamp(.8rem,2vw,2rem);max-width:none;white-space:nowrap}
.v3foot nav{display:flex;flex-wrap:nowrap;gap:clamp(.7rem,1.6vw,1.6rem);flex:0 0 auto}
.v3foot nav a,.v3foot .news,.v3foot .foot-note{font-size:.62rem;letter-spacing:.14em;text-transform:uppercase}
.v3foot .social{gap:.8rem;flex:0 0 auto}.v3foot .social a{width:15px;height:15px}
.v3foot .news{padding:0;border:0;gap:.45rem}.v3foot .news svg{width:15px;height:15px}
.v3foot .foot-note{flex:0 0 auto!important;margin:0!important;padding:0 0 0 clamp(.8rem,2vw,2rem)!important;border:0!important;border-left:1px solid rgba(131,109,48,.45)!important;text-transform:none;letter-spacing:.06em;width:auto!important}
.v3foot .foot > *:not(:first-child){position:relative}
@media (max-width:1100px){.v3foot .foot-note{display:none}}
@media (max-width:620px){.v3foot .foot{gap:.8rem}.v3foot nav{gap:.6rem}.v3foot nav a,.v3foot .news{font-size:.54rem;letter-spacing:.08em}.v3foot .news{display:none}}
"""
a = s.index('</style>')
s = s[:a] + FOOT_CSS + s[a:]
sub('</main>', '</main>\n' + DUAL_JS)
s = s.replace('<small>Matera</small></span></a>', '<small>Matera · Hospitality · Research · Revive</small></span></a>')


V3_LIGHT = r"""
/* =================== VERSION 3, LIGHT THEME =================== */
html[data-theme="light"] nav.chrome::before{background:linear-gradient(180deg,rgba(244,239,232,.92),rgba(244,239,232,0))}
html[data-theme="light"] nav.chrome.solid{background:rgba(244,239,232,.92);border-color:rgba(139,90,43,.25)}
html[data-theme="light"] .v3-brand,html[data-theme="light"] .v3-brand b{color:#1b1713}
html[data-theme="light"] .v3-brand small{color:#8b5a2b}
html[data-theme="light"] .sigil,html[data-theme="light"] .v3-brand .sigil{color:#8b5a2b}
html[data-theme="light"] .v3-menu a,html[data-theme="light"] .v3-menu .dd-btn{color:#2a231b}
html[data-theme="light"] .v3-menu a:hover,html[data-theme="light"] .v3-menu .dd-btn:hover{color:#8b5a2b}
html[data-theme="light"] .v3-menu .dd,html[data-theme="light"] .tools-pop{background:rgba(247,243,236,.98)}
html[data-theme="light"] .v3-menu .dd a:hover{background:rgba(139,90,43,.07)}
html[data-theme="light"] .plus{color:#2a231b}
html[data-theme="light"] .tools-pop .lang-opt,html[data-theme="light"] .tools-pop #soundToggle,html[data-theme="light"] .tools-pop .thm{color:#3a3128}
html[data-theme="light"] .tools-pop .lang-opt[aria-pressed="true"],html[data-theme="light"] .tools-pop #soundToggle[aria-pressed="true"]{color:#8b5a2b}
.tools-pop .thm{font-family:var(--font);font-size:.76rem;letter-spacing:.16em;text-transform:uppercase;background:none;border:0;cursor:pointer;text-align:left;color:var(--gold-body);padding:.3rem .2rem;border-top:1px solid var(--line-soft);margin-top:.1rem;padding-top:.7rem}
html[data-theme="light"] nav.chrome .v3-cta .btn,html[data-theme="light"] nav.chrome .sheet-row .btn,html[data-theme="light"] .btn{color:#6b3f17;border-color:#8b5a2b;background:none}
html[data-theme="light"] nav.chrome .v3-cta .btn:hover,html[data-theme="light"] .btn:hover{background:rgba(139,90,43,.08);color:#6b3f17}
html[data-theme="light"] nav.chrome .v3-cta .btn.fill,html[data-theme="light"] nav.chrome .sheet-row .btn.fill,html[data-theme="light"] .btn.fill{background:#7a1a1a;border-color:#7a1a1a;color:#fff}
html[data-theme="light"] nav.chrome .menu-panel{background:rgba(247,243,236,.98)}
html[data-theme="light"] .sheet-cols a{color:#2a231b}
html[data-theme="light"] .sheet-cols h4{color:#8b5a2b}
html[data-theme="light"] .v3-frame i{border-color:rgba(139,90,43,.6)}
html[data-theme="light"] .v3-hud{color:#2a231b;mix-blend-mode:normal}
html[data-theme="light"] .v3-ring{border-color:rgba(139,90,43,.8);mix-blend-mode:normal}
html[data-theme="light"] .v3-ring.big{background:rgba(139,90,43,.14)}
html[data-theme="light"] .v3-eyebrow,html[data-theme="light"] .v3-eyebrow i{color:#8b5a2b}
html[data-theme="light"] .manifesto:not(.m-close) .manifesto-inner{border-color:#8b5a2b}
html[data-theme="light"] .section-imgs{outline-color:rgba(139,90,43,.9)!important;box-shadow:0 0 .6rem rgba(139,90,43,.25),0 0 2rem rgba(139,90,43,.1),inset 0 0 0 1px rgba(244,239,232,.6)!important}
html[data-theme="light"] .v3-tick{background:linear-gradient(90deg,#f4efe8,#efe7da,#f4efe8)}
html[data-theme="light"] .v3-tick span{-webkit-text-stroke:1px rgba(139,90,43,.7)}
html[data-theme="light"] .v3-tick span:nth-child(even){color:#8b5a2b;-webkit-text-stroke:0}
html[data-theme="light"] .v3-tick small,html[data-theme="light"] .v3-label,html[data-theme="light"] .v3-label span{color:#8b5a2b}
html[data-theme="light"] .dual-head h2,html[data-theme="light"] .d-half h3,html[data-theme="light"] .strata h2,html[data-theme="light"] .layer b,html[data-theme="light"] .house b{color:#1b1713}
html[data-theme="light"] .dual-head h2 em,html[data-theme="light"] .layer span,html[data-theme="light"] .house p{color:#3a3128}
html[data-theme="light"] .dual-head p,html[data-theme="light"] .d-tag,html[data-theme="light"] .d-hint,html[data-theme="light"] .layer i,html[data-theme="light"] .house small,html[data-theme="light"] .dual-foot{color:#8b5a2b}
html[data-theme="light"] .dual-grid,html[data-theme="light"] .d-dig,.html[data-theme="light"] .house{border-color:rgba(139,90,43,.45)}
html[data-theme="light"] .d-dig{background:#e9dfcf}
html[data-theme="light"] .d-dig::after{background:linear-gradient(0deg,rgba(20,14,8,.85),rgba(20,14,8,.15) 55%)}
html[data-theme="light"] .d-res::after{background:linear-gradient(0deg,rgba(20,14,8,.82),rgba(20,14,8,.05) 62%)}
html[data-theme="light"] .d-half h3,html[data-theme="light"] .d-half li,html[data-theme="light"] .d-tag{color:#fbf6ee}
html[data-theme="light"] .d-half li::before{background:#fbf6ee}
html[data-theme="light"] .d-hint{color:#e9dfcf}
html[data-theme="light"] .d-seal{background:#f4efe8;border-color:#8b5a2b}
html[data-theme="light"] .house{border-color:rgba(139,90,43,.4)}
html[data-theme="light"] .house div{border-color:rgba(139,90,43,.3)}
html[data-theme="light"] .layer{border-color:rgba(139,90,43,.3)}
html[data-theme="light"] .layer:hover{background:linear-gradient(90deg,rgba(139,90,43,.08),transparent 70%)}
html[data-theme="light"] .rail-track .rail-card.tile:nth-child(n){border-color:rgba(139,90,43,.5);background:#f7f3ec}
html[data-theme="light"] .rail-card.tile::before{background:#f4efe8;color:#8b5a2b;border-color:rgba(139,90,43,.45)}
html[data-theme="light"] .rail-card.tile .tl{background:rgba(247,243,236,.96);border-color:rgba(139,90,43,.4)}
html[data-theme="light"] .rail-card.tile .tl b{color:#1b1713}
html[data-theme="light"] .rail-card.tile .tl span{color:#3a3128}
html[data-theme="light"] .rail-card.tile .tl i{color:#8b5a2b}
html[data-theme="light"] .rail-card.tile:hover{border-color:#8b5a2b}
html[data-theme="light"] .v3foot,html[data-theme="light"] .visit > .site-foot.v3foot{background:rgba(244,239,232,.92);border-top-color:rgba(139,90,43,.3)}
html[data-theme="light"] .v3foot nav a,html[data-theme="light"] .v3foot .news,html[data-theme="light"] .v3foot .foot-note,html[data-theme="light"] .v3foot .social a{color:#3a3128}
html[data-theme="light"] .v3foot .foot-note a{color:#8b5a2b}
html[data-theme="light"] .water-band{border-color:rgba(139,90,43,.3)}
html[data-theme="light"] .coda-word,html[data-theme="light"] #coda .coda-word{color:#1b1713!important;opacity:1}
html[data-theme="light"] .v3foot .foot-note a,html[data-theme="light"] .visit .foot-note a{color:#7a1a1a!important}
html[data-theme="light"] .v3foot .foot-note{color:#3a3128!important}
html[data-theme="light"] .visit::before{background:linear-gradient(to bottom,#f4efe8 0%,rgba(244,239,232,.92) 8%,rgba(244,239,232,.7) 35%,rgba(244,239,232,.62) 60%,rgba(244,239,232,.88) 100%)!important}
"""

a = s.index('</style>')
s = s[:a] + DARING_CSS + s[a:]
a = s.index('</style>')
s = s[:a] + V3_LIGHT + s[a:]
sub('</main>', '</main>\n' + DARING_JS)

sub('</main>', '</main>\n' + JS)
open(OUT, 'w', encoding='utf-8').write(s)
open('v3-moyseion-hp.html', 'w', encoding='utf-8').write(s)   # standalone copy of Version 3
print('wrote', OUT, 'and v3-moyseion-hp.html', len(s))
