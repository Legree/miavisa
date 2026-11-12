/* MIAVISA — згода на cookie та події Google Analytics.
   Основний код Analytics стоїть у <head> кожної сторінки й до згоди працює без cookie.
   Цей файл показує банер, зберігає вибір відвідувача й рахує кліки на контакти. */
(function () {
  var KEY = 'miavisa_cookie_consent';

  function getChoice() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setChoice(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  window.miaTrack = track;

  var CSS =
    '.mv-cookie{position:fixed;left:16px;bottom:16px;z-index:9999;max-width:400px;' +
    'background:#fff;color:#101d31;border:1px solid rgba(16,29,49,.12);border-radius:16px;' +
    'box-shadow:0 18px 40px -18px rgba(16,29,49,.45);padding:18px 18px 16px;' +
    'font:400 14.5px/1.55 "Inter Tight",system-ui,sans-serif;animation:mvUp .35s ease}' +
    '.mv-cookie[hidden]{display:none}' +
    '.mv-cookie p{margin:0 0 14px}' +
    '.mv-cookie-btns{display:flex;gap:10px}' +
    '.mv-cookie button{flex:1;font:inherit;font-weight:500;padding:10px 16px;border-radius:999px;cursor:pointer;' +
    'border:1px solid #101d31;background:#fff;color:#101d31;transition:background .2s,color .2s}' +
    '.mv-cookie button:hover{background:#101d31;color:#fff}' +
    '.mv-cookie button.mv-yes{background:#b8873a;border-color:#b8873a;color:#fff}' +
    '.mv-cookie button.mv-yes:hover{background:#101d31;border-color:#101d31}' +
    '.mv-cookie button:focus-visible{outline:2px solid #c2913a;outline-offset:2px}' +
    '@keyframes mvUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}' +
    '@media (max-width:520px){.mv-cookie{left:12px;right:12px;bottom:12px;max-width:none}}' +
    '@media (prefers-reduced-motion:reduce){.mv-cookie{animation:none}}';

  var box = null;
  function build() {
    var st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    box = document.createElement('div');
    box.className = 'mv-cookie';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Згода на файли cookie');
    box.innerHTML =
      '<p>Ми використовуємо файли cookie Google Analytics, щоб розуміти, які сторінки корисні відвідувачам. Рекламних cookie немає.</p>' +
      '<div class="mv-cookie-btns">' +
      '<button type="button" data-v="denied">Відхилити</button>' +
      '<button type="button" class="mv-yes" data-v="granted">Прийняти</button>' +
      '</div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-v]');
      if (b) apply(b.getAttribute('data-v'));
    });
    document.body.appendChild(box);
  }
  function show() { if (!box) build(); box.hidden = false; }
  function apply(v) {
    setChoice(v);
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: v === 'granted' ? 'granted' : 'denied' });
    }
    if (box) box.hidden = true;
  }

  // кліки на контакти й посилання «Налаштування cookie»
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var s = e.target.closest('[data-cookie-settings]');
    if (s) { e.preventDefault(); show(); return; }
    var a = e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href') || '';
    var method = /t\.me\//.test(h) ? 'telegram'
               : /^mailto:/.test(h) ? 'email'
               : /instagram\.com/.test(h) ? 'instagram' : null;
    if (method) track('contact_click', { method: method, page: location.pathname });
  });

  if (!getChoice()) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
  }
})();
