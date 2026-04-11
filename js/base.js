/* ============================================================
   base.js — Connecting the Dots
   Merged script: Global nav, settings, dynamic theme generation, scroll utilities
   ============================================================ */

// ── 1. CLEAN URLs ──
if (window.location.pathname.endsWith('index.html')) {
  window.history.replaceState(null, '', window.location.href.replace(/\/index\.html/i, '/'));
}

// ── 2. IMMEDIATE INIT (Prevents styling flash) ──
const htmlEl = document.documentElement;
const savedTheme = (() => { try { return localStorage.getItem('theme') || 'light'; } catch(e) { return 'light'; }})();
htmlEl.setAttribute('data-theme', savedTheme);


// ── 3. NAVIGATION INJECTION ──
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

  // Sun/Moon Light/Dark Toggle
  const themeToggleHTML = `
    <button class="theme-toggle" aria-label="Toggle light/dark mode" type="button">
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

  // Gear Settings Menu (Font + Dynamic Theme Picker)
  const settingsToggleHTML = `
    <div class="settings-container">
      <button class="settings-btn" aria-label="Open Settings" type="button">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
      <div class="settings-dropdown">
        
        <div class="setting-item">
          <label>Google Font</label>
          <div class="custom-input-wrapper">
            <input type="text" class="custom-text-input custom-font-input" placeholder="e.g. Roboto">
            <button class="apply-btn apply-font-btn" type="button">Apply</button>
          </div>
        </div>

        <div class="setting-item">
          <label>Theme Color</label>
          <div class="color-controls" style="gap: 8px;">
            <input type="color" class="custom-color-input accent-picker" value="#D48C70" title="Pick a base color">
            <input type="text" class="custom-text-input hex-input" value="#D48C70" placeholder="#HEX" maxlength="7" style="width: 85px; text-transform: uppercase; text-align: center; font-family: monospace;">
            <button class="apply-btn reset-color-btn" type="button" style="background: transparent; color: var(--muted); border: 1px solid var(--border); padding: 8px 10px;">Reset</button>
          </div>
        </div>

      </div>
    </div>`;

  navPlaceholder.outerHTML = `
    <nav class="${isSticky ? 'nav-sticky' : 'nav-static'}">
      <div class="mobile-top-controls" id="mobileTopControls">
        <div class="top-ham" id="topHamBtn" role="button" tabindex="0" aria-label="Open navigation">
          <span></span><span></span><span></span>
        </div>
        <div style="display:flex; gap:15px; align-items:center;">
          ${themeToggleHTML}
          ${settingsToggleHTML}
        </div>
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
      <div class="nav-right nav-desktop-only" style="gap:15px;">
        ${themeToggleHTML}
        ${settingsToggleHTML}
      </div>
    </nav>`;
}


// ── 4. EVENT LISTENERS & LOGIC ──
document.addEventListener('DOMContentLoaded', () => {
  
  // 4a. Initialize Navigation
  const navRoot = document.getElementById('global-nav');
  initGlobalNavigation({ sticky: navRoot?.dataset?.sticky !== 'false' });

  // 4b. Light/Dark Mode Toggle
  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  };
  document.addEventListener('click', (e) => {
    if (e.target.closest('.theme-toggle')) {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    }
  });

  // 4c. Settings Dropdown Menu Toggling
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.settings-btn');
    if (btn) {
      btn.nextElementSibling.classList.toggle('show');
      return;
    }
    if (!e.target.closest('.settings-dropdown')) {
      document.querySelectorAll('.settings-dropdown.show').forEach(menu => menu.classList.remove('show'));
    }
  });

  // 4d. Dynamic Custom Google Font Logic
  const applyCustomFont = (fontName) => {
    if (!fontName) return;
    const formattedName = fontName.trim().replace(/\s+/g, '+');
    
    let fontLink = document.getElementById('dynamic-google-font');
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = 'dynamic-google-font';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    fontLink.href = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@400;600;700&display=swap`;

    document.documentElement.style.setProperty('--font-body', `"${fontName}", sans-serif`);
    document.documentElement.style.setProperty('--font-heading', `"${fontName}", serif`);

    try { localStorage.setItem('customFont', fontName); } catch (err) {}
  };

  const savedCustomFont = localStorage.getItem('customFont');
  if (savedCustomFont) {
    applyCustomFont(savedCustomFont);
    document.querySelectorAll('.custom-font-input').forEach(input => input.value = savedCustomFont);
  }

  document.querySelectorAll('.apply-font-btn').forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const inputBox = document.querySelectorAll('.custom-font-input')[index];
      applyCustomFont(inputBox.value);
    });
  });

  document.querySelectorAll('.custom-font-input').forEach(input => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyCustomFont(e.target.value);
      }
    });
  });

  // 4e. Mathematical HEX to HSL Converter
  function hexToHSL(H) {
    let r = 0, g = 0, b = 0;
    if (H.length == 4) {
      r = "0x" + H[1] + H[1];
      g = "0x" + H[2] + H[2];
      b = "0x" + H[3] + H[3];
    } else if (H.length == 7) {
      r = "0x" + H[1] + H[2];
      g = "0x" + H[3] + H[4];
      b = "0x" + H[5] + H[6];
    }
    r /= 255; g /= 255; b /= 255;
    let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l };
  }

  // 4f. Dynamic Theme Generation Logic
  const DEFAULT_ACCENT = '#D48C70';
  
  const applyDynamicTheme = (colorHex) => {
    if (!/^#[0-9A-F]{6}$/i.test(colorHex)) return; 

    // Convert hex to HSL
    const { h, s, l } = hexToHSL(colorHex);

    // Set the mathematical variables in CSS
    const root = document.documentElement;
    root.style.setProperty('--theme-h', h);
    root.style.setProperty('--theme-s', `${s}%`);
    root.style.setProperty('--theme-l', `${l}%`);
    
    try { localStorage.setItem('customThemeHex', colorHex); } catch (err) {}
    
    // Sync UI elements
    document.querySelectorAll('.accent-picker').forEach(picker => picker.value = colorHex);
    document.querySelectorAll('.hex-input').forEach(input => input.value = colorHex.toUpperCase());
  };

  const savedThemeHex = localStorage.getItem('customThemeHex');
  if (savedThemeHex) applyDynamicTheme(savedThemeHex);

  document.querySelectorAll('.accent-picker').forEach(picker => {
    picker.addEventListener('input', (e) => {
      applyDynamicTheme(e.target.value);
    });
  });

  document.querySelectorAll('.hex-input').forEach(input => {
    input.addEventListener('change', (e) => {
      let val = e.target.value;
      if (!val.startsWith('#')) val = '#' + val;
      if (/^#[0-9A-F]{6}$/i.test(val)) {
        applyDynamicTheme(val);
      } else {
        e.target.value = localStorage.getItem('customThemeHex') || DEFAULT_ACCENT;
      }
    });
  });

  document.querySelectorAll('.reset-color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // 1. Reset the Colors
      applyDynamicTheme(DEFAULT_ACCENT);
      try { localStorage.removeItem('customThemeHex'); } catch (err) {}

      // 2. Reset the Font back to Lora (removes inline styles to let CSS defaults take over)
      document.documentElement.style.removeProperty('--font-body');
      document.documentElement.style.removeProperty('--font-heading');
      try { localStorage.removeItem('customFont'); } catch (err) {}

      // 3. Clear the font text boxes so the user sees it has been reset
      document.querySelectorAll('.custom-font-input').forEach(input => {
        input.value = '';
      });
    });
  });

  // 4g. Hamburger Menu Logic
  const topHam = document.getElementById('topHamBtn');
  const topDrawer = document.getElementById('topDrawer');
  if (topHam && topDrawer) {
    const toggle = (f) => {
      const open = typeof f === 'boolean' ? f : !topHam.classList.contains('is-open');
      topHam.classList.toggle('is-open', open);
      topDrawer.classList.toggle('is-open', open);
    };
    topHam.addEventListener('click', () => toggle());
    document.addEventListener('click', e => {
      if (topDrawer.classList.contains('is-open') && !topHam.contains(e.target) && !topDrawer.contains(e.target)) toggle(false);
    });
  }

  // 4h. Smooth Scrolling for Anchor Links (TOC Support)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const el = document.getElementById(a.getAttribute('href').substring(1));
    if (el) { 
      e.preventDefault(); 
      el.scrollIntoView({ behavior: 'smooth' }); 
    }
  });

  // 4i. Reading Progress Bar
  const progressBar = document.querySelector('.reading-progress');
  function updateReadingProgress() {
    if (!progressBar) return;
    const scrollableHeight = document.body.scrollHeight - window.innerHeight;
    const pct = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }
  window.addEventListener('scroll', updateReadingProgress, { passive: true });
  updateReadingProgress();

});

// ── 5. PAGE LOAD HOOKS ──
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});