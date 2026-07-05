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
import './styles/doc.less';
import './styles/vars.less';
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
 * @description: 站内换页平滑过渡。关键:只给「内容区」临时挂一个具名
 * view-transition-name,绝不碰 ::view-transition-*(root)——root 归 VitePress 的
 * 主题切换动画(圆形 clip 揭示)独占,两者共用 root 伪元素会让换肤时按钮白角闪
 * (上一版的教训)。这里只在换页时挂名字、结束即摘,主题切换时内容区不是独立
 * 过渡组,完全交还 VitePress。不支持 API 或用户偏好减少动态时退化为普通跳转。
 */
const PAGE_VT = 'ran-page';
const enablePageTransitions = (router: Router): void => {
  if (typeof document === 'undefined' || !document.startViewTransition) return;
  const go = router.go.bind(router);
  router.go = (href?: string): Promise<void> => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const content = document.querySelector<HTMLElement>('.VPContent');
    if (!document.startViewTransition || reduce || !content) return go(href);
    content.style.viewTransitionName = PAGE_VT;
    return new Promise<void>((resolve) => {
      const t = document.startViewTransition!(async () => {
        await go(href);
        await nextTick();
      });
      t.finished.finally(() => {
        content.style.viewTransitionName = '';
        resolve();
      });
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
      import('./register-icons'); // register ranui's SVG icons so <r-icon> demos render
      syncRanuiTheme();
      enablePageTransitions(router);
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
