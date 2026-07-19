import { SERVICE_WORK_VERSION } from '../../variable/SERVICE_WORK_VERSION';

export const GTAG = 'https://www.googletagmanager.com/gtag/js?id=G-0MPS5WH1C0';

export const GOOGLE_ANALYSE = `;window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);};gtag('js', new Date());gtag('config', 'G-0MPS5WH1C0');`;

export const BD_ANALYSE = `
;var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?3bc20bd8070ce614078a36c686209456";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
`;

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
  'ran is an open-source front-end ecosystem by chaxus: ranui, a native Web Components UI library, and ranuts, a tree-shakeable TypeScript utility library, plus low-level web-infrastructure experiments.';

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

export const ARTICLE_PATH = `${HOME}src/article/design_mode`;

export const GITHUB = 'https://github.com/chaxus/ran';

// Sibling open-source project: a privacy-first, in-browser document editor.
export const EDITOR = 'https://edit.chaxus.com/';

export const SERVICE_WORK = `
// 注册 Service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in window.navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw${SERVICE_WORK_VERSION}.js', {
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
