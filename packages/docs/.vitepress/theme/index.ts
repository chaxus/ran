import DefaultTheme from 'vitepress/theme';
import env from '../plugins/env';
import TOTP from '../components/TOTP.vue';
import Layout from '../components/Layout.vue';
import i18n, { loadLanguageAsync } from '../lang';
import { RAN_CHAXUS_LANG, LANGS_DICT, PWA_INSTALL_ID, PWA_ELEMENT_NAME, MANIFEST_PATH_ROOT } from '../lib/constant';
import { localStorageGetItem, setAttributeByGlobal } from 'ranuts/utils';
import './styles/index.less';
import './styles/vars.less';
import './tailwind.less';
import 'ranui/style'

declare global {
  interface ImportMeta {
    env: {
      SSR: boolean;
    };
  }
}
/**
 * @description: pwa引导安装
 */
const pwaInstall = () => {
  import('@khmyznikov/pwa-install').then(() => {
    let pwaInstall = document.getElementById(PWA_INSTALL_ID);
    if (!pwaInstall) {
      pwaInstall = document.createElement(PWA_ELEMENT_NAME);
      pwaInstall.setAttribute('manifest-url', MANIFEST_PATH_ROOT);
      pwaInstall.setAttribute('id', PWA_INSTALL_ID);
      document.body.appendChild(pwaInstall);
    }
  });
};

export default {
  extends: DefaultTheme,
  // Layout,
  enhanceApp({ app, router, siteData }) {
    if (!import.meta.env.SSR) {
      import('ranui');
      pwaInstall();
    }
    app.use(env);
    const locale = localStorageGetItem(RAN_CHAXUS_LANG) || LANGS_DICT.EN;
    loadLanguageAsync(locale)
      .then(() => {
        setAttributeByGlobal('__VUE_PROD_DEVTOOLS__', false);
        app.use(i18n);
        app.component('Layout', Layout);
        app.component('TOTP', TOTP);
      })
      .catch((error) => {
        console.log('error', error);
      });
  },
};
