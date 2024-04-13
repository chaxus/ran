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
      const registration = await navigator.serviceWorker.register('/ran/sw${SERVICE_WORK_VERSION}.js', {
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
