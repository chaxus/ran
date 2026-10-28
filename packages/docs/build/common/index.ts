import { SIDEBAR_SCROLL_KEY } from '../../client/sidebar.ts';

export const GTAG = 'https://www.googletagmanager.com/gtag/js?id=G-0MPS5WH1C0';

export const GOOGLE_ANALYSE = `;window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);};gtag('js', new Date());gtag('config', 'G-0MPS5WH1C0');`;

export const BD_ANALYSE = `
;var _hmt = _hmt || [];
(function() {
  function load() {
    var hm = document.createElement("script");
    hm.async = true;
    hm.src = "https://hm.baidu.com/hm.js?3bc20bd8070ce614078a36c686209456";
    document.head.appendChild(hm);
  }
  function schedule() {
    if (window.requestIdleCallback) window.requestIdleCallback(load, { timeout: 2000 });
    else window.setTimeout(load, 0);
  }
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
})();
`;

/**
 * Fetches the next docs page while the reader's pointer rests on its link (about 200ms in
 * Chromium), so the click does not wait on the network. Prefetch, not prerender: a prerendered
 * page runs its inline sidebar restore before this page has saved where the sidebar was.
 * Browsers without speculation rules ignore the script.
 */
export const SPECULATION_RULES = JSON.stringify({
  prefetch: [
    {
      where: {
        and: [
          { href_matches: '/*' },
          { selector_matches: '.sb__link, .nav__link, .pager__link, .prose a:not([href^="#"])' },
          { not: { selector_matches: '[download], [target]' } },
        ],
      },
      eagerness: 'moderate',
    },
  ],
});

/**
 * Puts the sidebar back where the reader left it, before the first paint. It runs inline right
 * after the sidebar markup: from the module bundle it would run after paint and visibly jump.
 *
 * Arriving from a sidebar link, the new page's link is put at the height the clicked one had:
 * groups open and close per page, so a raw `scrollTop` can land on another row. Otherwise the
 * saved `scrollTop` is reused, on the same sidebar only. Either way the link ends up in view.
 */
export const SIDEBAR_SCROLL = `(function(){
  var sidebar = document.getElementById('doc-sidebar');
  if (!sidebar || window.innerWidth < 900) return;
  var first = sidebar.querySelector('.sb__link');
  var current = sidebar.querySelector('.sb__link[aria-current="page"]');
  var saved = null;
  try { saved = JSON.parse(sessionStorage.getItem('${SIDEBAR_SCROLL_KEY}') || 'null'); } catch (e) {}
  if (saved && first && saved.sidebar === first.getAttribute('href')) {
    sidebar.scrollTop = saved.top;
    if (current && saved.href === current.getAttribute('href')) {
      sidebar.scrollTop += current.getBoundingClientRect().top - sidebar.getBoundingClientRect().top - saved.offset;
    }
  }
  if (!current) return;
  var box = current.getBoundingClientRect();
  var frame = sidebar.getBoundingClientRect();
  if (box.top < frame.top || box.bottom > frame.bottom) sidebar.scrollTop += box.top - frame.top - frame.height / 3;
})();`;

export const PREVIEW_CODE = `
  window.uploadFile = (name) => {
        const preview = document.getElementById(name)
        const uploadFile = document.createElement('input')
        uploadFile.setAttribute('type', 'file')
        uploadFile.click()
        uploadFile.onchange = (e) => {
          const { files = [] } = uploadFile
          if (preview) {
            if (files && files.length > 0) {
              preview.setAttribute('src', '')
              const file = files[0]
              const url = URL.createObjectURL(file)
              preview.setAttribute('src', url)
            }
          }
        }
      }
`;

export const DESCRIPTION =
  'ran provides product design methods, native Web Components through ranui, and typed utilities through ranuts, with guidance for developers and agents.';

export const HOME = 'https://ran.chaxus.com/';

export const BASE_PATH = '/';

export const HOME_ICON = `${HOME}home.svg`;

// og:image must be a raster image (PNG/JPG) — social crawlers (X/Twitter, Facebook,
// LinkedIn, Slack, Discord) do not render SVG previews. This 2560×1440 screenshot
// doubles as the summary_large_image card.
export const OG_IMAGE = `${HOME}screenshots_2560x1440.jpg`;

export const OG_IMAGE_WIDTH = '2560';

export const OG_IMAGE_HEIGHT = '1440';

export const OG_IMAGE_ALT = 'ran — Web Components UI library (ranui) and utility library (ranuts)';

export const UTILS_PATH = `${HOME}src/ranuts/utils/`;

export const RANUI_PATH = `${HOME}src/ranui/`;

export const GITHUB = 'https://github.com/chaxus/ran';

// Sibling open-source project: a privacy-first, in-browser document editor.
export const EDITOR = 'https://edit.chaxus.com/';

export const SERVICE_WORK = `
// 注册 Service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in window.navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      if (registration.installing) {
        console.log('installing Service worker');
      } else if (registration.waiting) {
        console.log('Service worker installed');
      } else if (registration.active) {
        console.log('Service worker active');
      }
    } catch (error) {
      console.error('service worker register error:', error);
    }
  }
};

registerServiceWorker();
`;

export const SET_FONT_SIZE = `
function initFontSize() {
  let base = 375;
  const { documentElement } = document;
  const mediaQuery = window.matchMedia('(orientation: portrait)');
  let timer;
  let standardRatio = 667 / 375;
  const ua = navigator.userAgent.toLowerCase();
  const ipad = /ipad|ipod/.test(ua)
  if (ipad) {
    standardRatio = 1024 / 768;
    base = 768;
  }
  function setFontSize() {
    const ua = navigator.userAgent.toLowerCase();
    const ipad = /ipad|ipod/.test(ua)
    const android = /android/.test(ua)
    const iphone = /iphone/.test(ua)
    if(!ipad && !android && !iphone) {
      documentElement.style.fontSize = '';
      return 
    } 
    const isLandscape = !mediaQuery.matches;
    let screenWidth = window.screen.width;
    let screenHeight = window.screen.height;

    if (screenWidth < screenHeight) {
      [ screenWidth, screenHeight ] = [ screenHeight, screenWidth ];
    }

    let width = documentElement.clientWidth;
    let height = screenHeight;

    const realRatio = width / height;

    if (realRatio >= standardRatio) {
      width = height * standardRatio;
      documentElement.classList.remove('adjustHeight');
      documentElement.classList.add('adjustWidth');
    } else {
      height = width / standardRatio;
      documentElement.classList.remove('adjustWidth');
      documentElement.classList.add('adjustHeight');
    }

    window.adjustWidth = width;
    window.adjustHeight = height;
    let target = width / base * 16;
    if (isLandscape) {
      target /= standardRatio;
    }
    documentElement.style.fontSize = target + 'px';
    const currentSize = window.getComputedStyle(documentElement).fontSize.replace('px', '');
    if (target !== currentSize) {
      documentElement.style.fontSize = target / currentSize * target + 'px';
    }
  }
  window.addEventListener('resize', function() {
    clearTimeout(timer);
    timer = setTimeout(setFontSize, 300);
  }, !1);
  window.addEventListener('pageshow', function(e) {
    e.persisted && (clearTimeout(timer), timer = setTimeout(setFontSize, 300));
  }, !1);

  window.addEventListener('orientationchange', function() {
    console.log('改变了手机方向');
    setFontSize();
  }, false);
  setFontSize();
};
initFontSize();
`;
