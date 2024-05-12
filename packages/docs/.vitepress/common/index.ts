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
  'Based on web component library, common function library utils, personal article record and so on';

export const HOME = 'https://chaxus.github.io/ran/';

export const BASE_PATH = '/ran/';

export const HOME_ICON = `${HOME}home.svg`;

export const UTILS_PATH = `${HOME}src/ranuts/utils/`;

export const RANUI_PATH = `${HOME}src/ranui/`;

export const ARTICLE_PATH = `${HOME}src/article/designMode.html`;

export const KEY_WORDS = 'ran,component,components,ui,design,ranui,web-components,javascript,typescript,js';

export const GITHUB = 'https://github.com/chaxus/ran';

export const SERVICE_WORK = `
// 注册 Service worker
const registerServiceWorker = async () => {
  if ('serviceWorker' in window.navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/ran/sw.js', {
        scope: '/ran/',
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
