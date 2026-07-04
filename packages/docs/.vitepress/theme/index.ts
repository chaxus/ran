import DefaultTheme from 'vitepress/theme';
import type { EnhanceAppContext, Router } from 'vitepress';
import { nextTick } from 'vue';
import { localStorageGetItem, setAttributeByGlobal } from 'ranuts/utils';
import env from '../plugins/env';
import TOTP from '../components/TOTP.vue';
import Layout from '../components/Layout.vue';
import Home from '../components/Home.vue';
import i18n, { loadLanguageAsync } from '../lang';
import { LANGS_DICT, MANIFEST_PATH_ROOT, PWA_ELEMENT_NAME, PWA_INSTALL_ID, RAN_CHAXUS_LANG } from '../lib/constant';
import './styles/fonts.less';
import './styles/index.less';
import './styles/vars.less';
import './tailwind.min.css';
import 'ranui/style';

declare global {
  interface ImportMeta {
    env: {
      SSR: boolean;
    };
  }
}
/**
 * @description: 把 VitePress 的暗色标记（<html class="dark">）同步到 ranui 的主题属性。
 * ranui 的暗色 token 只在 prefers-color-scheme:dark 或 :root[data-ran-theme='dark']
 * （及 [theme='dark']）下生效，而 VitePress 用的是 .dark class，两者不通。
 * 不桥接的话，手动切换暗色时 ranui 组件仍走亮色 token（例如按钮露出白色圆角）。
 */
const syncRanuiTheme = () => {
  const html = document.documentElement;
  const apply = () => {
    const dark = html.classList.contains('dark');
    html.setAttribute('data-ran-theme', dark ? 'dark' : 'light');
  };
  apply();
  new MutationObserver(apply).observe(html, { attributes: true, attributeFilter: ['class'] });
};
/**
 * @description: 用 View Transitions API 给站内换页加上平滑过渡。
 * VitePress 是自带 SPA 路由(不用 ranui 的 r-router),所以这里采用 ranui 路由
 * 的 SPA 模式同款思路:把「路由跳转 + DOM 更新」包进 `document.startViewTransition`。
 * 必须 await 路由跳转后再 await 一次 nextTick,确保新页面已经 patch 到 DOM,
 * 快照的才是新内容;不支持该 API 或用户偏好减少动态时,自动退化为普通跳转。
 */
const enableViewTransitions = (router: Router): void => {
  if (typeof document === 'undefined' || !document.startViewTransition) return;
  const originalGo = router.go.bind(router);
  router.go = (href?: string): Promise<void> => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || reduceMotion) return originalGo(href);
    return new Promise<void>((resolve) => {
      const transition = document.startViewTransition!(async () => {
        await originalGo(href);
        await nextTick();
      });
      transition.finished.finally(() => resolve());
    });
  };
};
/**
 * @description: pwa 引导安装
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
  enhanceApp({ app, router }: EnhanceAppContext): void {
    if (!import.meta.env.SSR) {
      import('ranui');
      syncRanuiTheme();
      enableViewTransitions(router);
      pwaInstall();
    }
    app.use(env);
    app.component('Home', Home);
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
