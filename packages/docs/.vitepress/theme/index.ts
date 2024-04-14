import DefaultTheme from 'vitepress/theme';
import env from '../plugins/env';
import TOTP from '../components/TOTP.vue';
import Layout from '../components/Layout.vue';
import i18n, { loadLanguageAsync } from '../lang';
import { RAN_CHAXUS_LANG, LANGS_DICT } from '../lib/constant';
import { localStorageGetItem, setAttributeByGlobal } from 'ranuts/utils';
import './styles/index.less';
import './styles/vars.less';
import './tailwind.less';

declare global {
  interface ImportMeta {
    env: {
      SSR: boolean;
    };
  }
}

const openVueDevTools = (app) => {
  // 开启 vue devtools
  if (process.env.NODE_ENV === 'development') {
    if ('__VUE_DEVTOOLS_GLOBAL_HOOK__' in window) {
      window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = app;
    }
    app.config.devtools = true;
  }
};

export default {
  extends: DefaultTheme,
  // Layout,
  enhanceApp({ app, router, siteData }) {
    if (!import.meta.env.SSR) {
      import('ranui');
    }
    openVueDevTools(app);
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
