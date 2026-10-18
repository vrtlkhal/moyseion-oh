# -*- coding: utf-8 -*-
import os
HOME = "../Moyseion Hero Landing Page - MOTION v3.html".replace(" ", "%20")

def svg(d, vb=48, sw=1.4, extra=''):
    return f'<svg viewBox="0 0 {vb} {vb}" fill="none" stroke="currentColor" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" {extra}>{d}</svg>'
IC = {
 'sun':   '<path d="M8 32h32M14 32a10 10 0 0 1 20 0M24 10v6M10 18l4 4M38 18l-4 4M6 38h36"/>',
 'house': '<path d="M8 22 24 8l16 14v18H8z"/><path d="M19 40V26h10v14"/>',
 'water': '<path d="M6 16c4-4 8-4 12 0s8 4 12 0 8-4 12 0M6 26c4-4 8-4 12 0s8 4 12 0 8-4 12 0M6 36c4-4 8-4 12 0s8 4 12 0 8-4 12 0"/>',
 'bowl':  '<path d="M6 24h36c0 10-7 16-18 16S6 34 6 24zM16 24c0-6 4-10 8-10s8 4 8 10M24 10V6M17 12l-2-3M31 12l2-3"/>',
 'pin':   '<path d="M24 42S10 29 10 19a14 14 0 0 1 28 0c0 10-14 23-14 23z"/><circle cx="24" cy="19" r="5"/>',
 'car':   '<path d="M7 29V23l4-9h26l4 9v6M7 29h34M7 29v6h6v-4M41 29v6h-6v-4"/><circle cx="14" cy="26" r="1.4"/><circle cx="34" cy="26" r="1.4"/>',
 'park':  '<circle cx="24" cy="24" r="17"/><path d="M19 33V15h7a6 6 0 0 1 0 12h-7"/>',
 'info':  '<circle cx="24" cy="24" r="17"/><path d="M24 22v11M24 15v1"/>',
 'vase':  '<path d="M19 6h10l-2 8c8 4 9 16 3 26H18C12 30 13 18 21 14z"/><path d="M17 20h14"/>',
 'head':  '<path d="M10 28v-6a14 14 0 0 1 28 0v6"/><rect x="8" y="26" width="7" height="11" rx="2"/><rect x="33" y="26" width="7" height="11" rx="2"/><path d="M36 37c0 4-4 5-9 5"/>',
 'search':'<circle cx="21" cy="21" r="13"/><path d="M31 31l11 11M21 14a7 7 0 0 0-7 7"/>',
 'book':  '<path d="M24 12c-5-4-12-4-18-2v28c6-2 13-2 18 2 5-4 12-4 18-2V10c-6-2-13-2-18 2zM24 12v28"/>',
 'leaf':  '<path d="M38 8C20 8 10 18 10 32c0 2 1 5 3 7 14 0 25-10 25-31zM12 38c6-12 12-18 20-22"/>',
 'arch':  '<path d="M8 42V22a16 16 0 0 1 32 0v20M4 42h40M16 42V24a8 8 0 0 1 16 0v18"/>',
 'sym':   '<circle cx="14" cy="26" r="7"/><circle cx="26" cy="26" r="7"/><circle cx="20" cy="15" r="7"/>',
 'lyre':  '<path d="M14 8c-4 8-4 18 4 24 3 3 9 3 12 0 8-6 8-16 4-24M17 12v22M24 8v28M31 12v22M18 38h12M20 42h8"/>',
 'cap':   '<path d="M4 18 24 8l20 10-20 10zM12 23v10c6 5 18 5 24 0V23M44 18v12"/>',
 'bed':   '<path d="M6 36V12M6 28h36v8M42 28v-6a6 6 0 0 0-6-6H20v12"/><circle cx="13" cy="22" r="3"/>',
 'globe': '<circle cx="24" cy="24" r="17"/><path d="M7 24h34M24 7c8 9 8 25 0 34M24 7c-8 9-8 25 0 34"/>',
 'clock': '<circle cx="24" cy="24" r="17"/><path d="M24 14v10l7 5"/>',
 'bag':   '<path d="M10 16h28l-2 24H12zM18 16a6 6 0 0 1 12 0"/>',
 'users': '<circle cx="18" cy="17" r="6"/><path d="M6 40c0-8 5-13 12-13s12 5 12 13M34 12a5 5 0 0 1 0 10M38 28c4 2 6 6 6 12"/>',
 'nopet': '<circle cx="24" cy="24" r="17"/><path d="M12 36 36 12M18 22c-2-3 0-6 3-4M30 22c2-3 0-6-3-4M24 34c-5 0-7-4-5-7 2-2 8-2 10 0 2 3 0 7-5 7z"/>',
 'hanger':'<path d="M24 16c0-4 5-6 5-10a5 5 0 0 0-10 0M24 16 6 34c-2 2-1 4 2 4h32c3 0 4-2 2-4z"/>',
 'bulb':  '<path d="M17 30c-4-3-6-6-6-11a13 13 0 0 1 26 0c0 5-2 8-6 11v5H17zM18 40h12M20 44h8"/>',
 'fridge':'<rect x="12" y="5" width="24" height="38" rx="3"/><path d="M12 20h24M17 12v4M17 27v7"/>',
 'pillow':'<path d="M8 14c10-4 22-4 32 0v20c-10 4-22 4-32 0z"/><path d="M8 14c3 7 3 13 0 20M40 14c-3 7-3 13 0 20"/>',
 'cal':   '<rect x="7" y="10" width="34" height="31" rx="3"/><path d="M7 20h34M16 6v8M32 6v8"/>',
 'mail':  '<rect x="6" y="11" width="36" height="26" rx="2"/><path d="M6 14l18 14 18-14"/>',
 'wa':    '<path d="M8 40l3-9a16 16 0 1 1 6 6z"/><path d="M18 18c0 8 6 14 12 14l3-3-4-3-2 2c-3-1-5-3-6-6l2-2-3-4z"/>',
 'dl':    '<rect x="8" y="6" width="32" height="36" rx="3"/><path d="M16 16h16M16 23h16M16 30h10"/>',
 'img':   '<rect x="6" y="9" width="36" height="30" rx="3"/><circle cx="17" cy="19" r="3.5"/><path d="M6 34l11-9 8 7 7-6 10 8"/>',
 'col':   '<path d="M8 12h32M10 12v4h28v-4M14 16v20M22 16v20M26 16v20M34 16v20M10 36h28M8 42h32"/>',
 'person':'<circle cx="24" cy="16" r="8"/><path d="M8 42c0-10 7-16 16-16s16 6 16 16"/>',
 'train': '<rect x="11" y="6" width="26" height="30" rx="5"/><path d="M11 24h26M17 42l4-6M31 42l-4-6"/><circle cx="18" cy="30" r="1.4"/><circle cx="30" cy="30" r="1.4"/>',
 'plane': '<path d="M42 8 6 22l12 5 3 12 5-8 9 6z M18 27 42 8"/>',
 'repl':  '<circle cx="24" cy="24" r="17"/><path d="M24 14v10M24 24l7 4"/>',
 'sig':   '<path d="M24 8 8 20c-3 3 0 6 3 6h26c3 0 6-3 3-6z"/><circle cx="24" cy="32" r="4"/>',
 'send':  '<path d="M6 24h34M30 14l10 10-10 10"/>',
}
def ic(n, cls='ico'):
    return svg(IC[n], extra=f'class="{cls}"')
import base64
def vid(path):
    # embedded as a data URI, the way the homepage does it, so the clip plays wherever the page is opened from
    return 'data:video/mp4;base64,' + base64.b64encode(open(path,'rb').read()).decode()
V_FILM = vid('assets/film.mp4')
V_HEAD = vid('assets/header.mp4')
HEADVID = f'<video class="film hero-vid" src="{V_HEAD}" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1"></video>'
V_REEL = [vid(f'assets/reel{i}.mp4') for i in (1,2,3)]
AR = '<span class="ar">&rarr;</span>'
SIG_DEFS = open('assets/sigil-defs.svg',encoding='utf-8').read()
def sigil(cls='sigil'):
    g = lambda i: f'<g class="sg sg{i}"><use href="#mk-ring{i}"/></g>'
    return f'<svg class="{cls}" viewBox="0 0 1000 1000" aria-hidden="true">{g(0)}{g(1)}{g(2)}{g(3)}<g><use href="#mk-logo"/></g></svg>'
FILM = f'<video class="film" src="{V_FILM}" autoplay muted loop playsinline preload="auto" aria-hidden="true" tabindex="-1"></video>'
def closing_film():
    return f'''<section class="finale" aria-label="MOΥΣEION">
  {FILM}<div class="veil" aria-hidden="true"></div>
  <div class="in"><div class="mark rv">{sigil('sigil big')}</div><p class="word rv">MOΥΣEION</p>
  <div class="btn-row rv"><a class="btn fill" href="{PAGES['plan']}">Plan a stay {AR}</a><a class="btn" href="{PAGES['inhabit']}#houses">See the houses</a></div></div>
  {footer()}
</section>'''
STATUE = open('assets/statue.svg').read().replace('width="120" height="120"','').replace('<svg ','<svg aria-hidden="true" ',1)
SOCIAL = {
 'ig':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".8" fill="currentColor"/></svg>',
 'fb':'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8.5V6.8c0-.8.2-1.3 1.4-1.3H17V2.3C16.7 2.3 15.8 2 14.7 2 12.4 2 10.8 3.400 10.8 6v2.500H8.200V12h2.600v10H14V12h2.600l.4-3.500z"/></svg>',
 'yt':'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.600 7.200a2.500 2.500 0 0 0-1.800-1.800C18.200 5 12 5 12 5s-6.200 0-7.800.4A2.500 2.500 0 0 0 2.400 7.200C2 8.800 2 12 2 12s0 3.200.4 4.800a2.500 2.500 0 0 0 1.800 1.800C5.800 19 12 19 12 19s6.200 0 7.800-.4a2.500 2.500 0 0 0 1.800-1.800c.4-1.600.4-4.800.4-4.800s0-3.200-.4-4.800zM10 15V9l5.200 3z"/></svg>',
}
PAGES = {
 'inhabit':'moyseion-inhabit.html','explore':'moyseion-explore.html','day':'moyseion-day.html','plan':'moyseion-plan.html','press':'moyseion-press.html'}

def nav(active):
    def on(k): return ' class="on"' if active==k else ''
    return f'''<header class="nav" id="top">
  <a class="brand" href="{HOME}" aria-label="MOΥΣEION home">{sigil('sigil mini')}<span><b>MOΥΣEION</b><small>Matera · Hospitality · Research · Revive</small></span></a>
  <ul class="menu">
    <li class="has-dd"><button class="dd-btn{' on' if active=='inhabit' else ''}" type="button" aria-haspopup="true">Inhabit Moyseion</button>
      <div class="dd"><a href="{PAGES['day']}">Your Day at Moyseion</a><a href="{PAGES['plan']}">Plan Your Stay</a><a href="{PAGES['inhabit']}#water">Water Sanctuary</a><a href="{PAGES['inhabit']}#akratisma">Akratisma</a><a href="{PAGES['inhabit']}#houses">The Houses</a></div></li>
    <li class="has-dd"><button class="dd-btn{' on' if active=='explore' else ''}" type="button" aria-haspopup="true">Explore Moyseion</button>
      <div class="dd"><a href="{PAGES['explore']}#idea">The Idea</a><a href="{PAGES['explore']}#research">Archaeological Research</a><a href="{PAGES['explore']}#journal">Journal</a><a href="{PAGES['press']}">Press</a></div></li>
    <li><a href="{PAGES['explore']}#journal">Journal</a></li>
    <li><a href="#">About</a></li>
  </ul>
  <div class="nav-cta"><a class="btn" href="{PAGES['plan']}">Plan your stay</a><a class="btn fill" href="#">Book your stay</a></div>
  <div class="tools-wrap"><button class="plus" type="button" aria-label="Language and sound" aria-expanded="false" aria-controls="toolsPop"><i></i><i></i></button>
    <div class="tools-pop" id="toolsPop"><div class="lg"><button type="button" class="lang-opt" data-lang="en" aria-pressed="true">EN</button><span class="rule" aria-hidden="true"></span><button type="button" class="lang-opt" data-lang="it" aria-pressed="false">IT</button></div><button type="button" class="snd" aria-pressed="false">Sound</button><button type="button" class="thm" aria-label="Light or dark">Light</button></div></div>
  <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="sheet"><i></i><i></i><i></i></button>
</header>
<div class="sheet" id="sheet">
  <div class="cols">
    <div><h4>Inhabit</h4><a href="{PAGES['day']}">Your Day</a><a href="{PAGES['plan']}">Plan Your Stay</a><a href="{PAGES['inhabit']}#water">Water Sanctuary</a><a href="{PAGES['inhabit']}#akratisma">Akratisma</a><a href="{PAGES['inhabit']}#houses">The Houses</a></div>
    <div><h4>Explore</h4><a href="{PAGES['explore']}#idea">The Idea</a><a href="{PAGES['explore']}#research">Research</a><a href="{PAGES['explore']}#journal">Journal</a><a href="{PAGES['press']}">Press</a><a href="#">About</a></div>
  </div>
  <div class="row"><a class="btn" href="{PAGES['plan']}">Plan your stay</a><a class="btn fill" href="#">Book your stay</a></div>
</div>'''

def footer():
    return f'''<footer class="site-foot"><div class="foot">
  <nav aria-label="Footer"><a href="#">Contact</a><a href="#">FAQ</a><a href="{PAGES['press']}">Press</a><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Careers</a></nav>
  <div class="social"><a href="#" aria-label="Instagram">{SOCIAL['ig']}</a><a href="#" aria-label="Facebook">{SOCIAL['fb']}</a></div>
  <a class="news" href="#">{ic('mail','')} Newsletter</a>
  <p class="foot-note">For more on the research and archaeology: <a href="https://fondazione-moyseion-isama.com" target="_blank" rel="noopener">fondazione-moyseion-isama.com</a></p>
</div></footer>'''

THEME_BOOT = open('theme-boot.txt',encoding='utf-8').read()
def page(fname, title, desc, active, body):
    html=f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#010416">
{THEME_BOOT}
<link rel="stylesheet" href="assets/moy.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.25/dist/lenis.min.js" defer></script>
<script src="assets/moy.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
{SIG_DEFS}
<canvas class="bg-particles" aria-hidden="true"></canvas><div class="bg-vignette" aria-hidden="true"></div><div class="bg-grain" aria-hidden="true"></div>
{nav(active)}
<main id="main">
{body}
{closing_film()}
</main>
</body>
</html>'''
    open(fname,'w',encoding='utf-8').write(html)

DIV = f'<div class="divider rv" aria-hidden="true">{STATUE.replace("<svg ","<svg ",1)}</div>'

def hero(eyebrow, h1, lede, img, alt, extra='', crumbs=''):
    return f'''<section class="hero">
  <div class="hero-copy" data-stagger>
    {crumbs}
    <p class="eyebrow rv">{eyebrow}</p>
    <h1 class="rv">{h1}</h1>
    {extra}
    <p class="lede rv">{lede}</p>
  </div>
  <div class="hero-art"><img src="img/{img}.jpg" alt="{alt}">{HEADVID}</div>
</section>'''

def card(num, icon, title, sub, img, alt, text, link, cid='', href='#'):
    s = f'<small>{sub}</small>' if sub else ''
    idattr = f' id="{cid}"' if cid else ''
    return f'''<article class="card rv"{idattr}>
  <a class="cover" href="{href}" aria-label="{title}"></a>
  <div class="num">{num}</div>{ic(icon)}
  <h3>{title}{s}</h3>
  <div class="ph"><img src="img/{img}.jpg" alt="{alt}" loading="lazy"></div>
  <p>{text}</p>
  <span class="more">{link} {AR}</span>
</article>'''

# ------------------------------------------------------------------ INHABIT
body = f'''<section class="hero hero-home">
  <div class="hero-art"><img src="img/matera.jpg" alt="Matera">{HEADVID}</div>
  <div class="hero-copy hero-center" data-stagger>
    <div class="rv hero-sigil">{sigil('sigil huge')}</div>
    <p class="word rv">MOΥΣEION</p>
    <h1 class="rv">Inhabit the ancient rhythm of a day.</h1>
    <p class="lede rv">At Moyseion, time follows an ancient rhythm. Not a program, but a sequence of gestures and rituals that accompany you from <span class="em">arrival to return</span>.</p>
  </div>
</section>''' + f'''
<section class="sec manifesto"><div class="wrap">
  <p class="eyebrow rv">The place</p>
  <div class="ml">
    <p class="ign">The <strong>MOΥΣEION</strong> is a place where you can stay to relive, in an immersive and multisensory way, life experiences belonging to the world of <strong>Magna Graecia</strong> (from the 7th to the 4th century BC), and of those peoples who inhabited the territory of Matera before the Greek colonists (4th millennium &ndash; 7th century BC).</p>
    <p class="ign">The structure occupies about a thousand square meters inside the Sassi of Matera, where three Neolithic houses, five Enotrian houses and eight Magna Graecia houses have been reconstructed, alongside areas designed for communal living.</p>
    <p class="ign">One finds the recreation of a Water Sanctuary devoted to the goddess <strong>Demeter</strong>. Furniture and artifacts have, as far as possible, all been reproduced philologically with techniques from experimental archaeology.</p>
    <p class="ign">The stay also includes, for those who want it, participation in a series of rituals accompanied by music and dance performances: the ritual of Xenia (welcoming the guest), the Water Sanctuary ritual, the ritual of the Symposium and the ritual of the Morning Meal.</p>
    <p class="ign">But above all, the MOΥΣEION is a place of the spirit, where you can try to rekindle those sparks of the past that have been transmitted to us, but which are now biologically dormant within us.</p>
  </div>
</div></section>
<section class="sec reels"><div class="wrap">
  <h2 class="section-label rv">From inside</h2>
  <div class="reel-row" data-stagger>
    <figure class="reel rv"><div class="rf"><video src="{V_REEL[0]}" autoplay muted loop playsinline preload="metadata"></video></div><figcaption>Music</figcaption></figure>
    <figure class="reel rv"><div class="rf"><video src="{V_REEL[1]}" autoplay muted loop playsinline preload="metadata"></video></div><figcaption>The Houses</figcaption></figure>
    <figure class="reel rv"><div class="rf"><video src="{V_REEL[2]}" autoplay muted loop playsinline preload="metadata"></video></div><figcaption>The Harp</figcaption></figure>
  </div>
</div></section>''' + f'''
<section class="sec" id="cards"><div class="wrap">
  <h2 class="section-label rv">Live Moyseion from within</h2>
  <div class="grid g4" data-stagger>
    {card('01','sun','Your day<br>at Moyseion','', 'xenia17','The Xenia ritual, welcoming the guest','Discover the rhythm of a day at Moyseion, from arrival to return.','Discover the day',href=PAGES['day'])}
    {card('02','house','Houses','', 'eno7','A reconstructed Enotrian house','Not a room, but a home assigned to the temporary inhabitant.','Discover houses',cid='houses')}
    {card('03','water','Water<br>Sanctuary','', 'ws03','The Water Sanctuary','The descent into water. Silence, purification, listening.','Discover sanctuary',cid='water')}
    {card('04','bowl','Akratisma','Breakfast as archaeological research','cheese','A philologically reproduced breakfast','The first meal. Ancient ingredients, living knowledge.','Discover Akratisma',cid='akratisma')}
  </div>
</div></section>
<section class="closing">
  <p class="ign rv">You don&rsquo;t visit Moyseion. You inhabit it &mdash; for a day, or for longer. And you carry it with you.</p>
  <div class="btn-row rv" style="display:flex;gap:.9rem;justify-content:center;margin-top:2rem;flex-wrap:wrap"><a class="btn fill" href="{PAGES['plan']}">Plan your stay {AR}</a><a class="btn" href="{PAGES['day']}">A day at Moyseion</a></div>
</section>'''
page('moyseion-inhabit.html','Inhabit Moyseion · MOΥΣEION','Inhabit the ancient rhythm of a day at Moyseion, in Matera.','inhabit',body)

# ------------------------------------------------------------------ EXPLORE
def foundation():
    six=[('col','Research'),('sym','Symposia'),('lyre','Cultural Programme'),('cap','Education'),('leaf','Residencies'),('globe','International Projects')]
    s=''.join(f'<div>{ic(i,"")}<span>{t}</span></div>' for i,t in six)
    return f'''<div class="found rv">
  <div class="art"><img src="img/eno9.jpg" alt="Enotrian vessel" loading="lazy"></div>
  <div><h2>Fondazione Moyseion &ndash; ISAMA ETS</h2><h4>The cultural and research institution of Moyseion</h4>
    <p>The cultural, scientific and educational activities of Moyseion are developed through Fondazione Moyseion &ndash; ISAMA ETS.</p>
    <div class="six">{s}</div></div>
  <div class="side"><p>Discover the complete programme, projects, open calls and initiatives on the website of the Foundation.</p><a class="btn" href="https://fondazione-moyseion-isama.com" target="_blank" rel="noopener">Visit the Foundation <span class="ar">&nearr;</span></a></div>
</div>'''
body = hero('Explore Moyseion','Explore the idea. The research. The cultural life.',
  'Moyseion is also a cultural and research project. Its cultural, scientific and educational activities are developed through <span class="em">Fondazione Moyseion &ndash; ISAMA ETS</span>.',
  'andron','A Magna Graecia krater, lit from below') + f'''
<section class="sec"><div class="wrap">
  <div class="grid g4" data-stagger>
    {card('','sun','The Idea','', 'musica1','A shadow of a lyre player on a linen curtain','The vision of Archeologia Poetica and the idea of an inhabited museum.','Discover the idea',cid='idea')}
    {card('','search','Archaeological Research','', 'danza12','A painted vase fragment','Excavations, studies and discoveries in Matera and in other ancient territories.','Explore the research',cid='research')}
    {card('','book','Journal','', 'neo13','A Neolithic vessel','Archaeologia Poetica: reflections, essays and notes from inside Moyseion.','Read the journal',cid='journal')}
    {card('','leaf','Press','', 'neo17','A Neolithic stone head','Articles, interviews and publications about Moyseion and its work.','Read the press',href=PAGES['press'])}
  </div>
  <div style="margin-top:clamp(1rem,1.8vw,1.8rem)">{foundation()}</div>
</div></section>'''
page('moyseion-explore.html','Explore Moyseion · MOΥΣEION','The idea, the research and the cultural life of Moyseion.','explore',body)

# ------------------------------------------------------------------ DAY
def step(n, when, title, sub, text, poem, img, alt):
    return f'''<article class="step rv">
  <div class="tx"><div class="n">{n}</div><div><small>{when}</small><h3>{title}</h3><p class="sub">{sub}</p><p>{text}</p></div></div>
  <div class="pic"><img src="img/{img}.jpg" alt="{alt}" loading="lazy"></div>
  <div class="po"><p>{poem}</p></div>
</article>'''
crumbs = f'<nav class="crumbs rv" aria-label="Breadcrumb"><a href="{HOME}">Home</a> <span>&rsaquo;</span> <a href="{PAGES["inhabit"]}">Inhabit Moyseion</a> <span>&rsaquo;</span> <span>Rituals</span></nav>'
body = hero('Rituals','A day at Moyseion',
  'Every day follows a rhythm, an ancient and timeless rhythm. From the moment you arrive until your return, each step is a ritual that reconnects you with what is essential. You are not a guest. You are an inhabitant of time.',
  'ws17','Two priestesses with a torch in the Water Sanctuary',
  extra='<p class="rv" style="font-style:italic;color:var(--gold-bright);font-size:clamp(1.1rem,1.7vw,1.6rem)">At Moyseion, hospitality is an initiation.</p>',crumbs=crumbs) + f'''
<section class="sec"><div class="wrap day" data-stagger>
  {step('01','Late afternoon','Arrival &mdash; Xenia','The traveler becomes a guest.','You are welcomed at the threshold. A gesture of hospitality opens the door. You cross the boundary and enter another time.','You are not given a room.<br>You are entrusted with a house.<br><b>Xenia is the first ritual</b><br>of your stay.','xenia15','The Xenia ritual: a bowl offered to the guest')}
  {step('02','Late afternoon','Water &mdash; The Descent','The Sanctuary of Water.','You descend into the depths. Three waters, three actions, one return. Water slows time and restores the body.','Purification.<br>Immersion.<br>Return.<br>The waters remember<br>what we forget.','ws14','The Water Sanctuary, lit blue')}
  {step('03','Evening','Symposium','Wine, food, word, music.','We gather in the andr&oacute;n. We eat, we listen, we speak. The word becomes shared thought, and the night becomes presence.','This is not a show.<br>This is a rite.<br>Here, we are equals<br>in the circle of the word.','danza13','A dancer in red at the symposium')}
  {step('04','Morning','Akratisma','The first meal.','At dawn, light returns. Bread, olives, fruit, and honey. A simple meal to thank the earth and begin the day in balance.','Simplicity.<br>Gratitude.<br>The day begins<br>with what is essential.','cheese','The Akratisma breakfast table')}
  {step('05','Departure','Return','You carry it with you.','You leave the house. But something of it remains. What you have lived cannot be lost. The ritual continues in you.','You do not leave Moyseion.<br>You return to the world,<br>transformed.','ws19','A woman in white at the end of the sanctuary corridor')}
</div></section>
<section class="closing"><div class="btn-row rv" style="display:flex;gap:.9rem;justify-content:center;flex-wrap:wrap"><a class="btn fill" href="{PAGES['plan']}">Plan your stay {AR}</a><a class="btn" href="{PAGES['inhabit']}">Back to Inhabit Moyseion</a></div></section>'''
page('moyseion-day.html','A day at Moyseion · MOΥΣEION','The five rituals of a day at Moyseion: Xenia, Water, Symposium, Akratisma, Return.','inhabit',body)

# ------------------------------------------------------------------ PLAN
def it(icon,label,txt): return f'<li class="it">{ic(icon,"")}<div><b>{label}</b>{txt}</div></li>'
tabs=[('getting','01','Getting here','pin'),('transfer','02','Transfer','car'),('parking','03','Parking','park'),('house','04','Your house','house'),('info','05','Useful info','info'),('exp','06','Experience &amp; reservations','vase'),('else','07','Need something else?','head')]
tabhtml=''.join(f'<li><a href="#{i}">{ic(ic_,"")}<i>{n}</i> {t}</a></li>' for i,n,t,ic_ in tabs)
body = hero('Plan your stay','Everything you need before you inhabit <span class="em">Moyseion</span>.',
  'Arrival, parking, transfers and everything that can make your stay more comfortable.','ws18','The corridor of the Water Sanctuary') + f'''
<nav class="tabs" aria-label="Plan your stay"><ul>{tabhtml}</ul></nav>
<section class="sec"><div class="wrap"><div class="plan" data-stagger>
  <div class="col rv"><div class="box" id="getting"><h3><i>01.</i> Getting here</h3>
    <div class="map" role="img" aria-label="Map of Matera"></div>
    <p class="big">Moyseion<br><span style="font-size:.8rem;color:var(--gold-body)">Via San Biagio, 27 &middot; 75100 Matera (MT), Italy</span></p>
    <ul>{it('car','By car','Follow signs for &ldquo;Sassi&rdquo;. Limited traffic zone.')}{it('train','By train','Matera Centrale Station is 15 minutes away.')}{it('plane','By air','Bari Airport (BRI) &ndash; 65 km &middot; Brindisi Airport (BDS) &ndash; 130 km. Transfer available.')}</ul>
    <a class="btn fill" href="#">Open in Google Maps <span class="ar">&nearr;</span></a><a class="btn" href="#">Get directions {AR}</a></div></div>
  <div class="col rv"><div class="box" id="transfer"><h3><i>02.</i> Complimentary transfer</h3>
    <p class="big">Arriving should be part of the experience.</p>
    <p>Complimentary shuttle service from the recommended garages, the train station and upon request from airports.</p><hr>
    <ul>{it('clock','Available every day','08:00 &ndash; 20:00')}{it('cal','Upon reservation','at least 24h in advance')}{it('mail','Contact us to arrange','your pick-up')}</ul>
    <a class="btn fill" href="#">Request your transfer {AR}</a><a class="btn" href="#">WhatsApp</a></div></div>
  <div class="col rv"><div class="box" id="parking"><h3><i>03.</i> Parking in Matera</h3>
    <ul>{it('pin','Moyseion','')}{it('park','Garage 1','')}{it('park','Garage 2','')}{it('car','Shuttle meeting point','')}</ul><hr>
    <p><b style="color:var(--gold-bright);font-weight:400;letter-spacing:.1em;font-size:.7rem">GARAGE 1</b><br>Garage &middot; Via D&rsquo;Addozio<br>800 m from Moyseion &middot; 10 min by shuttle<br>Reservation recommended</p><hr>
    <p><b style="color:var(--gold-bright);font-weight:400;letter-spacing:.1em;font-size:.7rem">GARAGE 2</b><br>Parcheggio La Martella &middot; Via Lucana, 184<br>1,5 km from Moyseion &middot; 15 min by shuttle<br>Reservation recommended</p><hr>
    <p style="color:var(--gold-bright)">After parking, our shuttle will take you to Moyseion. The shuttle meeting point is indicated on the map.</p></div></div>
  <div class="col rv"><div class="box" id="house"><h3><i>04.</i> Your house, your comfort</h3>
    <p>The houses are intentionally essential. Your comfort doesn&rsquo;t have to be.</p><hr>
    <ul>{it('hanger','Extra hangers','Available on request')}{it('bulb','Additional lighting','Available on request')}{it('fridge','Minibar / refrigerator','Available on request')}{it('pillow','Extra pillows &amp; blankets','Available on request')}{it('bag','Luggage assistance','Available')}</ul>
    <a class="btn" href="#">Personalise your house {AR}</a></div></div>
  <div class="col rv">
    <div class="box" id="info"><h3><i>05.</i> Useful information</h3>
      <ul>{it('clock','Check-in','by 22:00')}{it('clock','Check-out','by 11:00')}{it('bag','Luggage deposit','Available before check-in and after check-out')}{it('users','Only guests 16+','Guests must be 16 years of age or older')}{it('nopet','No pets','We do not allow pets')}</ul></div>
    <div class="box" id="exp"><h3><i>06.</i> Experience &amp; reservations</h3>
      <ul>{it('water','Water Sanctuary','Included in your stay. Reservation required.')}{it('bowl','Akratisma','Dining experience. Reservation required.')}{it('sym','Symposia &amp; cultural activities','Check the calendar and join the next event.')}</ul></div>
    <div class="box" id="else"><h3><i>07.</i> Need something else?</h3>
      <p>Every inhabitant is different. If there is something that would make your time at Moyseion more comfortable, tell us before your arrival.</p>
      <div class="pair"><a class="btn" href="#">Contact us</a><a class="btn" href="#">WhatsApp</a></div></div>
  </div>
</div>
<div class="cta-band rv"><img src="img/ws12.jpg" alt="" loading="lazy"><div><h2>We are here to make your stay unforgettable.</h2><p>Our team is at your disposal for any need.</p></div><a class="btn fill" href="#">Book your stay {AR}</a></div>
</div></section>'''
page('moyseion-plan.html','Plan your stay · MOΥΣEION','Getting here, transfer, parking and everything you need before you inhabit Moyseion.','inhabit',body)

# ------------------------------------------------------------------ PRESS
def pcard(src,title,text,img,alt):
    return f'''<article class="pcard rv"><a class="cover" href="#" aria-label="{src}: {title}"></a>
  <div class="tx"><div class="src">{src}</div><h3>{title}</h3><p>{text}</p><span class="more">Read article {AR}</span></div>
  <div class="ph"><img src="img/{img}.jpg" alt="{alt}" loading="lazy"></div></article>'''
kit=[('img','High resolution images','Gallery of photos of Moyseion and its spaces.','Download'),('dl','Fact sheet','Key information about Moyseion, the project and its activities.','Download'),('col','Moyseion concept','The vision, the method, the experience. A summary.','Download'),('person','Founder / Team','Biographies of the founder and the team behind Moyseion.','Download'),('mail','Contacts','Press office and media contact information.','View details')]
kh=''.join(f'<div>{ic(i,"")}<h4>{t}</h4><span>{d}</span><a class="dl" href="#">{b} {AR}</a></div>' for i,t,d,b in kit)
body = f'''<section class="hero">
  <div class="hero-copy" data-stagger>
    <p class="eyebrow rv">Press</p>
    <blockquote class="quote rv"><q>The world&rsquo;s most extraordinary new museum might be found underground in Matera.</q><cite>The Telegraph</cite><small>The 20 most anticipated cultural openings in the world</small></blockquote>
  </div>
  <div class="hero-art"><img src="img/ws12.jpg" alt="The vaulted Water Sanctuary, lit in violet">{HEADVID}</div>
</section>
<section class="sec"><div class="wrap">
  <h2 class="section-label rv">Selected press</h2>
  <div class="grid g5" data-stagger>
    {pcard('The Guardian','Inside the extraordinary underground museum in Matera','A haunting, beautiful experience that reimagines how we inhabit the past.','xenia18','Guests at a Xenia ritual')}
    {pcard('The Telegraph','The world&rsquo;s most extraordinary new museum might be found underground in Matera','Moyseion is not just a museum. It is a ritual, a journey, a discovery of the self through the ancient.','ws08','Carved figures lit in amber')}
    {pcard('Vanity Fair','In Matera, a museum that blends archaeology, myth and poetry','A place where time dissolves and beauty speaks an ancient language.','musica4','A harp resting among cushions')}
    {pcard('Corriere della Sera','Matera, nel cuore dei Sassi il museo che trasforma il passato in esperienza','Il Moyseion &egrave; un viaggio iniziatico nella memoria profonda dei luoghi.','ws18','The corridor of the sanctuary')}
    {pcard('la Repubblica','Un museo incarnato nei Sassi: il Moyseion riscopre il sacro quotidiano','Non si visita soltanto. Si partecipa. Con il corpo, con i sensi, con l&rsquo;anima.','ws14','The blue pool of the sanctuary')}
  </div>
  <p class="center rv"><a class="btn" href="#">View all press coverage {AR}</a></p>
  <div style="margin-top:clamp(1.4rem,3vw,2.6rem)" class="rv"><div class="kit">
    <div><h4 style="font-size:.8rem;color:var(--gold-bright);letter-spacing:.2em">PRESS KIT</h4><span>Everything you need to tell the story of Moyseion.</span><a class="dl" href="#">Download all {AR}</a></div>
    {kh}
    <div><img src="img/ws08.jpg" alt="" loading="lazy"></div>
  </div></div>
</div></section>'''
page('moyseion-press.html','Press · MOΥΣEION','Selected press coverage and the Moyseion press kit.','explore',body)

# ------------------------------------------------------------------ INDEX
idx=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>MOΥΣEION · page proposals</title>
<link rel="stylesheet" href="assets/moy.css"></head><body>
<canvas class="bg-particles" aria-hidden="true"></canvas><div class="bg-vignette"></div><div class="bg-grain"></div>
<div class="idx"><div><p class="eyebrow" style="justify-content:center">Page proposals</p><h1>Five pages, in our language.</h1>
<p class="lede" style="margin:1rem auto 0">The organisation of each proposal, rebuilt in the MOΥΣEION palette, typeface and motion.</p>
<div class="grid g3">
<a class="card" href="{PAGES['inhabit']}"><h3>Inhabit Moyseion</h3><p>Four ways to live it from within.</p><span class="more">Open {AR}</span></a>
<a class="card" href="{PAGES['explore']}"><h3>Explore Moyseion</h3><p>The idea, the research, the cultural life.</p><span class="more">Open {AR}</span></a>
<a class="card" href="{PAGES['day']}"><h3>A day at Moyseion</h3><p>The five rituals, from arrival to return.</p><span class="more">Open {AR}</span></a>
<a class="card" href="{PAGES['plan']}"><h3>Plan your stay</h3><p>Getting here, parking, comfort, reservations.</p><span class="more">Open {AR}</span></a>
<a class="card" href="{PAGES['press']}"><h3>Press</h3><p>Selected coverage and the press kit.</p><span class="more">Open {AR}</span></a>
<a class="card" href="{HOME}"><h3>Homepage</h3><p>The current MOTION v3 landing page.</p><span class="more">Open {AR}</span></a>
</div></div></div>
<script src="assets/moy.js" defer></script></body></html>'''
open('index.html','w',encoding='utf-8').write(idx)
print('ok')
