/* COOKIE BANNER: one source for every page. Shown on a first visit; for the demo it comes back after three refreshes.
   While no choice has been made the page cannot be scrolled (wheel, touch, keys and scrollbar are all held). */
(function(){
  if (document.getElementById('mck')) return;
  var here = document.currentScript && document.currentScript.src;
  var policy = window.__COOKIE_POLICY || (here ? new URL('draft.html', here).href : 'draft.html');
  var KEY = 'moyseion-cookie-consent', LOADS = 'moyseion-cookie-loads', VERSION = 1, DEMO_EVERY = 3;
  var css = ".mck{--navy:#010416;--deep:#836d30;--body:#c2a567;--bright:#f1dca4;--pad:clamp(1.1rem,4.6vw,4.2rem);\n  position:fixed;z-index:9999;left:0;right:0;bottom:0;width:100vw;font-family:'GFS Neohellenic','Gill Sans','Optima',serif;color:var(--body);\n  background:rgba(1,4,22,.92);border-top:1px solid rgba(131,109,48,.55);backdrop-filter:blur(1rem);-webkit-backdrop-filter:blur(1rem);\n  box-shadow:0 -1.6rem 4rem rgba(1,4,22,.6);transform:translateY(100%);opacity:0;pointer-events:none;\n  transition:transform .9s cubic-bezier(.2,.7,.2,1),opacity .7s ease}\n.mck *{box-sizing:border-box;margin:0;padding:0}\n.mck.is-open{transform:none;opacity:1;pointer-events:auto}\n.mck::before{content:\"\";position:absolute;left:0;right:0;top:-1px;height:1px;background:linear-gradient(90deg,transparent,rgba(241,220,164,.7) 50%,transparent)}\n.mck button{font-family:inherit;cursor:pointer}\n.mck :focus-visible{outline:.125rem solid var(--bright);outline-offset:.1875rem}\n.mck-prefs{display:grid;grid-template-rows:0fr;transition:grid-template-rows .8s cubic-bezier(.2,.7,.2,1)}\n.mck.prefs-open .mck-prefs{grid-template-rows:1fr}\n.mck-prefs>div{overflow:hidden;min-height:0}\n.mck-cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));padding:0 var(--pad);border-bottom:1px solid rgba(131,109,48,.3);opacity:0;transition:opacity .6s ease}\n.mck.prefs-open .mck-cats{opacity:1}\n.mck-cat{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:1.2rem;padding:1.3rem clamp(.8rem,2vw,2rem) 1.3rem 0;margin-right:clamp(.8rem,2vw,2rem);border-right:1px solid rgba(131,109,48,.22)}\n.mck-cat b{display:block;font-weight:400;font-size:1.08rem;color:var(--bright);letter-spacing:.03em;margin-bottom:.25rem}\n.mck-cat span{font-size:.86rem;line-height:1.45}\n.mck-sw{position:relative;width:2.9rem;height:1.6rem;border-radius:99rem;border:1px solid rgba(194,165,103,.55);background:transparent;transition:background .5s,border-color .5s;flex:0 0 auto}\n.mck-sw i{position:absolute;top:50%;left:.2rem;width:1.1rem;height:1.1rem;border-radius:50%;background:var(--body);transform:translate(0,-50%);transition:transform .5s cubic-bezier(.2,.7,.2,1),background .5s;box-shadow:0 0 .5rem rgba(241,220,164,.35)}\n.mck-sw[aria-checked=\"true\"]{background:rgba(194,165,103,.9);border-color:var(--body)}\n.mck-sw[aria-checked=\"true\"] i{background:var(--navy);transform:translate(1.3rem,-50%)}\n.mck-sw[disabled]{opacity:.6;cursor:default}\n.mck-row{display:flex;flex-wrap:wrap;align-items:center;gap:1.2rem clamp(1.4rem,3.4vw,3.4rem);padding:clamp(1.1rem,2.6vh,1.6rem) var(--pad)}\n.mck-head{display:flex;flex-direction:column;gap:.5rem;flex:0 0 auto}\n.mck-kick{display:flex;align-items:center;gap:1rem;font-size:.6rem;letter-spacing:.42em;text-transform:uppercase;color:var(--deep)}\n.mck-kick::after{content:\"\";width:2.2rem;height:1px;background:rgba(131,109,48,.5)}\n.mck h2{font-weight:400;font-size:clamp(1.3rem,1.9vw,1.75rem);line-height:1.1;letter-spacing:.02em;color:var(--bright);white-space:nowrap}\n.mck-body{flex:1 1 24rem;min-width:0;font-size:clamp(.92rem,1vw,1.04rem);line-height:1.55;padding-left:clamp(1.2rem,2.6vw,2.6rem);border-left:1px solid rgba(131,109,48,.35);text-wrap:pretty}\n.mck-body a{color:var(--bright);font-style:italic;text-decoration:none;border-bottom:1px solid var(--deep)}\n.mck-body a:hover{color:var(--body)}\n.mck-fade{transition:opacity .3s ease}\n.mck.is-switching .mck-fade{opacity:0}\n.mck-acts{display:flex;flex-wrap:wrap;align-items:center;gap:.7rem;flex:0 0 auto;margin-left:auto}\n.mck-lang{display:flex;gap:.2rem;padding:.2rem;border:1px solid rgba(131,109,48,.45);border-radius:99rem;margin-right:.4rem}\n.mck-lang button{font-size:.68rem;letter-spacing:.16em;color:var(--body);background:transparent;border:0;border-radius:99rem;padding:.3rem .7rem;transition:background .4s,color .4s}\n.mck-lang button[aria-pressed=\"true\"]{background:var(--bright);color:var(--navy)}\n.mck-link{font-size:.72rem;letter-spacing:.2em;text-transform:uppercase;color:var(--bright);background:none;border:0;border-bottom:1px solid var(--deep);padding:0 0 .3rem;margin-right:.6rem;white-space:nowrap}\n.mck-link:hover{border-color:var(--bright)}\n.mck-btn{font-size:.72rem;letter-spacing:.18em;text-transform:uppercase;color:var(--bright);background:none;border:1px solid rgba(194,165,103,.6);padding:.8rem 1.3rem;white-space:nowrap;transition:border-color .35s,background .35s}\n.mck-btn:hover{border-color:var(--bright);background:rgba(241,220,164,.06)}\n.mck-btn.is-primary{font-weight:700;color:var(--navy);background:var(--body);border-color:var(--body)}\n.mck-btn.is-primary:hover{background:var(--bright);border-color:var(--bright)}\n.mck [data-save]{display:none}\n.mck.prefs-open [data-save]{display:inline-block}\n@media (prefers-reduced-motion:reduce){.mck,.mck *{transition:none!important}}\n@media (max-width:640px){\n.mck{max-height:80vh;overflow-y:auto;overscroll-behavior:contain}\n.mck-row{flex-direction:column;align-items:stretch;flex-wrap:nowrap;gap:1rem}\n.mck h2{white-space:normal}\n.mck-body{flex:none;border-left:0;padding-left:0}\n.mck-acts{margin-left:0;width:100%;justify-content:flex-start;gap:.6rem}\n.mck-lang{margin-right:auto}\n.mck-link{margin-right:auto;order:3}\n.mck-btn{flex:1 1 auto;text-align:center;padding:.85rem .9rem}\n.mck-cats{grid-template-columns:1fr}\n.mck-cat{border-right:0;margin-right:0;padding-right:0}\n}";
  var markup = "<div class=\"mck-prefs\"><div>\n    <div class=\"mck-cats\">\n      <div class=\"mck-cat\"><div><b data-t=\"c0n\"></b><span data-t=\"c0d\"></span></div><button class=\"mck-sw\" role=\"switch\" aria-checked=\"true\" disabled data-t-label=\"c0n\"><i></i></button></div>\n      <div class=\"mck-cat\"><div><b data-t=\"c1n\"></b><span data-t=\"c1d\"></span></div><button class=\"mck-sw\" role=\"switch\" aria-checked=\"false\" data-cat=\"analytics\" data-t-label=\"c1n\"><i></i></button></div>\n      <div class=\"mck-cat\"><div><b data-t=\"c2n\"></b><span data-t=\"c2d\"></span></div><button class=\"mck-sw\" role=\"switch\" aria-checked=\"false\" data-cat=\"marketing\" data-t-label=\"c2n\"><i></i></button></div>\n    </div>\n  </div></div>\n  <div class=\"mck-row\">\n    <div class=\"mck-head\">\n      <div class=\"mck-kick\" data-t=\"kicker\"></div>\n      <h2 id=\"mck-title\" class=\"mck-fade\" data-t=\"title\"></h2>\n    </div>\n    <p class=\"mck-body mck-fade\"><span data-t=\"body\"></span> <a href=\"__POLICY__\" data-t=\"policy\"></a></p>\n    <div class=\"mck-acts\">\n      <div class=\"mck-lang\" role=\"group\" aria-label=\"Lingua / Language\">\n        <button type=\"button\" data-lang=\"it\">IT</button>\n        <button type=\"button\" data-lang=\"en\">EN</button>\n      </div>\n      <button type=\"button\" class=\"mck-link\" data-prefs aria-expanded=\"false\" data-t=\"prefs\"></button>\n      <button type=\"button\" class=\"mck-btn\" data-reject data-t=\"reject\"></button>\n      <button type=\"button\" class=\"mck-btn\" data-save data-t=\"save\"></button>\n      <button type=\"button\" class=\"mck-btn is-primary\" data-accept data-t=\"accept\"></button>\n    </div>\n  </div>".replace('__POLICY__', policy);
  var link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://fonts.googleapis.com/css2?family=GFS+Neohellenic:ital,wght@0,400;0,700;1,400&display=swap'; document.head.appendChild(link);
  var st = document.createElement('style'); st.id = 'mck-css'; st.textContent = css; document.head.appendChild(st);
  var el = document.createElement('div'); el.className = 'mck'; el.id = 'mck'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'false'); el.setAttribute('aria-labelledby', 'mck-title'); el.innerHTML = markup;
  document.body.appendChild(el);

  var COPY = {
    it: {
      kicker: 'Informativa', title: 'Utilizzo dei cookie',
      body: 'Questo sito utilizza cookie tecnici, necessari al suo corretto funzionamento, e, previo consenso, cookie analitici e di profilazione, anche di terze parti. Selezionando «Accetta tutti» acconsente all’utilizzo di tutte le categorie; selezionando «Rifiuta» saranno impiegati esclusivamente i cookie tecnici. Il consenso può essere modificato o revocato in qualsiasi momento.',
      policy: 'Informativa estesa sui cookie',
      accept: 'Accetta tutti', reject: 'Rifiuta', save: 'Conferma le scelte', prefs: 'Gestisci preferenze', close: 'Chiudi preferenze',
      c0n: 'Cookie tecnici', c0d: 'Necessari alla navigazione, alla prenotazione e alla sicurezza del sito. Non richiedono consenso.',
      c1n: 'Cookie analitici', c1d: 'Raccolgono informazioni in forma aggregata sull’utilizzo del sito, al fine di migliorarne i servizi.',
      c2n: 'Cookie di profilazione', c2d: 'Consentono di proporre contenuti e comunicazioni in linea con le preferenze espresse, anche su piattaforme di terze parti.'
    },
    en: {
      kicker: 'Notice', title: 'Use of cookies',
      body: 'This website uses technical cookies, which are necessary for its operation, and, subject to your consent, analytics and profiling cookies, including those of third parties. By selecting “Accept all” you consent to the use of all categories; by selecting “Reject” only technical cookies will be used. You may modify or withdraw your consent at any time.',
      policy: 'Full cookie policy',
      accept: 'Accept all', reject: 'Reject', save: 'Confirm choices', prefs: 'Manage preferences', close: 'Close preferences',
      c0n: 'Technical cookies', c0d: 'Necessary for browsing, booking and the security of the website. Consent is not required.',
      c1n: 'Analytics cookies', c1d: 'Collect aggregated information on the use of the website, in order to improve its services.',
      c2n: 'Profiling cookies', c2d: 'Allow content and communications to be tailored to your preferences, including on third-party platforms.'
    }
  };

  var saved = null;
  try { saved = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  if (saved && saved.v !== VERSION) saved = null;
  // demo: once a choice is stored, every refresh is counted; on the third the choice is forgotten and the banner returns
  if (saved){
    var n = 0; try { n = (parseInt(localStorage.getItem(LOADS), 10) || 0) + 1; localStorage.setItem(LOADS, String(n)); } catch (e) {}
    if (n >= DEMO_EVERY){ saved = null; try { localStorage.removeItem(KEY); localStorage.setItem(LOADS, '0'); } catch (e) {} }
  }

  var siteLang = null; try { siteLang = localStorage.getItem('moy-lang'); } catch (e) {}
  var lang = siteLang === 'it' || siteLang === 'en' ? siteLang : (saved && saved.lang) || ((document.documentElement.lang || navigator.language || 'it').slice(0, 2) === 'en' ? 'en' : 'it');
  var state = { analytics: !!(saved && saved.analytics), marketing: !!(saved && saved.marketing) };
  var prefsOpen = false;

  // ---- nothing scrolls until a choice is made
  var locking = false, lockY = 0;
  function stop(e){ if (e.target && e.target.closest && e.target.closest('#mck')) return; e.preventDefault(); e.stopPropagation(); }
  function onKey(e){
    var k = e.key, tag = (e.target && e.target.tagName) || '';
    if (k === ' ' && /^(BUTTON|A|INPUT)$/.test(tag)) return;
    if (k === ' ' || k === 'PageDown' || k === 'PageUp' || k === 'End' || k === 'Home' || k === 'ArrowDown' || k === 'ArrowUp') stop(e);
  }
  function onScroll(){ if (locking && Math.abs(window.scrollY - lockY) > 1) window.scrollTo(0, lockY); }
  function lock(){ if (locking) return; locking = true; lockY = window.scrollY;
    window.addEventListener('wheel', stop, { passive: false, capture: true });
    window.addEventListener('touchmove', stop, { passive: false, capture: true });
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('scroll', onScroll, { passive: true });
    document.documentElement.classList.add('mck-locked'); }
  function unlock(){ if (!locking) return; locking = false;
    window.removeEventListener('wheel', stop, { capture: true });
    window.removeEventListener('touchmove', stop, { capture: true });
    window.removeEventListener('keydown', onKey, true);
    window.removeEventListener('scroll', onScroll);
    document.documentElement.classList.remove('mck-locked'); }

  function paint(){
    var t = COPY[lang];
    el.querySelectorAll('[data-t]').forEach(function(n){ n.textContent = t[n.getAttribute('data-t')]; });
    el.querySelectorAll('[data-t-label]').forEach(function(n){ n.setAttribute('aria-label', t[n.getAttribute('data-t-label')]); });
    el.querySelector('[data-prefs]').textContent = prefsOpen ? t.close : t.prefs;
    el.querySelectorAll('[data-lang]').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    el.querySelectorAll('[data-cat]').forEach(function(b){ b.setAttribute('aria-checked', state[b.getAttribute('data-cat')] ? 'true' : 'false'); });
  }
  function open(){ el.classList.add('is-open'); }
  function close(){ el.classList.remove('is-open', 'prefs-open'); prefsOpen = false; paint(); }
  function commit(a, m){
    state.analytics = a; state.marketing = m;
    var consent = { v: VERSION, analytics: a, marketing: m, lang: lang, date: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(consent)); localStorage.setItem(LOADS, '0'); } catch (e) {}
    document.dispatchEvent(new CustomEvent('moyseion:consent', { detail: consent }));
    unlock(); close();
  }

  el.addEventListener('click', function(e){
    var b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-lang')){
      var l = b.getAttribute('data-lang'); if (l === lang) return;
      el.classList.add('is-switching');
      setTimeout(function(){ lang = l; paint(); el.classList.remove('is-switching'); }, 250);
    } else if (b.hasAttribute('data-prefs')){
      prefsOpen = !prefsOpen; el.classList.toggle('prefs-open', prefsOpen);
      b.setAttribute('aria-expanded', prefsOpen ? 'true' : 'false'); paint();
    } else if (b.hasAttribute('data-cat')){
      var k = b.getAttribute('data-cat'); state[k] = !state[k]; paint();
    } else if (b.hasAttribute('data-accept')) commit(true, true);
    else if (b.hasAttribute('data-reject')) commit(false, false);
    else if (b.hasAttribute('data-save')) commit(state.analytics, state.marketing);
  });

  window.MoyseionCookies = { open: open, get: function(){ try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } } };

  paint();
  if (saved){ document.dispatchEvent(new CustomEvent('moyseion:consent', { detail: saved })); }
  else { lock(); setTimeout(open, 700); }
})();
