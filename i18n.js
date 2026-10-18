/* ITALIAN, EVERYWHERE. One engine for every page: it finds each translatable unit of text on the page (an element whose
   children are only text or inline tags, a loose text node, or an attribute such as aria-label or alt) and swaps it for the
   Italian in window.__MOY_IT (i18n-it.js), keyed by the English text. Anything with data-i18n belongs to the homepage's own
   translator and is left alone. The language lives in localStorage 'moy-lang', the key the homepage already uses. */
(function(){
  if (window.MoyI18n) return;
  var KEY = 'moy-lang', lang = 'en';
  try { lang = localStorage.getItem(KEY); } catch (e) {}
  if (!lang){ lang = /^it/i.test(navigator.language || '') ? 'it' : 'en'; try { localStorage.setItem(KEY, lang); } catch (e) {} }
  var INLINE = /^(B|I|EM|STRONG|A|SPAN|SMALL|BR|U|SUP|SUB|MARK|ABBR)$/, SKIP = /^(SCRIPT|STYLE|SVG|NOSCRIPT|TEMPLATE|CANVAS|VIDEO|IFRAME|TEXTAREA|INPUT|PRE|CODE)$/;
  var ATTRS = ['aria-label', 'alt', 'title', 'placeholder'];
  var busy = false, obs = null;
  function norm(s){ return s.replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); }
  function textOf(el){ var c = el.cloneNode(true); var b = c.querySelectorAll('br'); for (var i = 0; i < b.length; i++) b[i].parentNode.replaceChild(document.createTextNode(' '), b[i]); return norm(c.textContent); }
  // a unit is a sentence: an element with only text and inline tags, and either no child elements at all, or some text of its own.
  // An element that is only a row of child elements (a nav of links, a row of spans) is walked into, and each child is its own unit.
  function isUnit(el){
    var own = false, kids = false;
    for (var n = el.firstChild; n; n = n.nextSibling){
      if (n.nodeType === 1){ if (!INLINE.test(n.tagName)) return false; kids = true; }
      else if (n.nodeType === 3 && norm(n.data)) own = true;
    }
    return own || !kids;
  }
  function dict(){ return window.__MOY_IT || {}; }
  function t(s){ var d = dict(); var k = norm(String(s)); return (lang === 'it' && d[k] !== undefined) ? d[k] : s; }
  // every unit under root: {el|node, key, kind}
  function walk(root, out){
    if (root.nodeType === 3){ var k = norm(root.data); if (k) out.push({ node: root, key: k, kind: 'text' }); return; }
    if (root.nodeType !== 1) return;
    if (SKIP.test(root.tagName.toUpperCase()) || root.hasAttribute('data-i18n') || root.hasAttribute('data-no-i18n') || root.id === 'mck') return;
    for (var i = 0; i < ATTRS.length; i++){ var v = root.getAttribute(ATTRS[i]); if (v && norm(v)) out.push({ el: root, attr: ATTRS[i], key: norm(v), kind: 'attr' }); }
    if (isUnit(root)){ var tk = textOf(root); if (tk) out.push({ el: root, key: tk, kind: 'html' }); return; }
    for (var n = root.firstChild; n; n = n.nextSibling) walk(n, out);
  }
  function collect(root){ var out = []; walk(root || document.body, out); return out; }
  function apply(root){
    var d = dict(); busy = true;
    try {
      collect(root || document.body).forEach(function(u){
        var it = lang === 'it' ? d[u.key] : undefined;
        if (u.kind === 'html'){
          var el = u.el;
          if (it !== undefined){ if (el.__moyEn === undefined) el.__moyEn = el.innerHTML; if (el.__moyIt !== it){ el.innerHTML = it; el.__moyIt = it; } }
          else if (lang !== 'it' && el.__moyEn !== undefined){ el.innerHTML = el.__moyEn; el.__moyEn = undefined; el.__moyIt = undefined; }
        } else if (u.kind === 'text'){
          var n = u.node;
          if (it !== undefined){ if (n.__moyEn === undefined) n.__moyEn = n.data; if (n.data !== it) n.data = it; }
          else if (lang !== 'it' && n.__moyEn !== undefined){ n.data = n.__moyEn; n.__moyEn = undefined; }
        } else {
          var e = u.el; e.__moyA = e.__moyA || {};
          if (it !== undefined){ if (e.__moyA[u.attr] === undefined) e.__moyA[u.attr] = e.getAttribute(u.attr); e.setAttribute(u.attr, it); }
          else if (lang !== 'it' && e.__moyA[u.attr] !== undefined){ e.setAttribute(u.attr, e.__moyA[u.attr]); e.__moyA[u.attr] = undefined; }
        }
      });
      document.documentElement.setAttribute('lang', lang);
    } finally { busy = false; if (obs) obs.takeRecords(); }
  }
  function set(l, soft){ lang = (l === 'it') ? 'it' : 'en'; try { localStorage.setItem(KEY, lang); } catch (e) {} document.dispatchEvent(new CustomEvent('moy-lang', { detail: lang }));
    if (soft){ apply(document.body); } else { location.reload(); } }   // the pages split their paragraphs into words, so a live swap cannot reach them: the language is read again from the top
  var timer = null;
  function later(){ if (timer) return; timer = setTimeout(function(){ timer = null; apply(document.body); }, 60); }
  function start(){
    apply(document.body);
    if (window.MutationObserver){ obs = new MutationObserver(function(){ if (!busy && lang === 'it') later(); }); obs.observe(document.body, { childList: true, subtree: true, characterData: true }); }
    window.addEventListener('load', function(){ setTimeout(function(){ apply(document.body); }, 400); });
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.lang-opt[data-lang], .mn-lang button[data-lang]'); if (!b) return;
    var l = b.getAttribute('data-lang'); if (l && l !== lang) set(l);
  }, true);
  window.MoyI18n = { t: t, apply: apply, set: set, collect: collect, get lang(){ return lang; } };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
