/* ============================================================
   components.js — yogesh writing site
   Global nav, theme toggle, mobile drawer, smooth scroll
   ============================================================ */

// 1. CLEAN URLs
if (window.location.pathname.endsWith('index.html')) {
  window.history.replaceState(null, '', window.location.href.replace(/\/index\.html/i, '/'));
}

// 2. IMMEDIATE THEME INIT (prevents flash)
const htmlEl = document.documentElement;
const savedTheme = (() => {
  try { return localStorage.getItem('theme') || 'light'; }
  catch (e) { return 'light'; }
})();
htmlEl.setAttribute('data-theme', savedTheme);

function getCurrentSection() {
  const p = window.location.pathname.toLowerCase();
  if (p.includes('/articles/')) return 'articles';
  if (p.includes('/about'))     return 'about';
  return 'home';
}

function initGlobalNavigation(options = {}) {
  const navPlaceholder = document.getElementById('global-nav');
  if (!navPlaceholder) return;

  const root           = navPlaceholder.getAttribute('data-root') || '';
  const isSticky       = options.sticky ?? true;
  const currentSection = getCurrentSection();
  const homePath       = root === '' ? './' : root;

  if (!document.querySelector('link[rel="icon"]')) {
    const fav = document.createElement('link');
    fav.rel = 'icon'; fav.type = 'image/svg+xml';
    fav.href = root + 'assets/favicon.svg';
    document.head.appendChild(fav);
  }

  const themeToggleHTML = `
    <button class="theme-toggle" aria-label="Toggle theme" type="button">
      <svg class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>`;

  navPlaceholder.outerHTML = `
    <nav class="${isSticky ? 'nav-sticky' : 'nav-static'}">
      <div class="mobile-top-controls" id="mobileTopControls">
        <div class="top-ham" id="topHamBtn" role="button" tabindex="0" aria-label="Open navigation">
          <span></span><span></span><span></span>
        </div>
        
        ${themeToggleHTML}
      </div>
      <div class="top-drawer" id="topDrawer">
        <ul class="top-drawer-links" style="text-align:center">
          <li><a href="${homePath}" ${currentSection==='home'?'style="color:var(--accent);"':''}>Browse</a></li>
          <li><a href="${root}about.html" ${currentSection==='about'?'style="color:var(--accent);"':''}>About</a></li>
        </ul>
      </div>
      
      <div class="nav-center nav-desktop-only">
        <a href="${homePath}" ${currentSection==='home'?'style="color:var(--accent);"':''}>Browse</a>
        <a href="${root}about.html" ${currentSection==='about'?'style="color:var(--accent);"':''}>About</a>
      </div>
      <div class="nav-right nav-desktop-only">${themeToggleHTML}</div>
    </nav>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const navRoot = document.getElementById('global-nav');
  initGlobalNavigation({ sticky: navRoot?.dataset?.sticky !== 'false' });

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('.theme-toggle'))
      applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
  });

  const topHam = document.getElementById('topHamBtn');
  const topDrawer = document.getElementById('topDrawer');
  if (topHam && topDrawer) {
    const toggle = (f) => {
      const open = typeof f === 'boolean' ? f : !topHam.classList.contains('is-open');
      topHam.classList.toggle('is-open', open);
      topDrawer.classList.toggle('is-open', open);
    };
    topHam.addEventListener('click', () => toggle());
    topHam.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' '){e.preventDefault();toggle();} });
    document.addEventListener('click', e => {
      if (topDrawer.classList.contains('is-open') && !topHam.contains(e.target) && !topDrawer.contains(e.target)) toggle(false);
      if (e.target.closest('#topDrawer a')) toggle(false);
    });
    document.addEventListener('keydown', e => { if (e.key==='Escape') toggle(false); });
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const el = document.getElementById(a.getAttribute('href').substring(1));
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});
