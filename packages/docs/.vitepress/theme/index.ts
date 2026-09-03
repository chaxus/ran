// theme-without-fonts: skip the default theme's bundled Inter — we ship Geist (see styles/fonts.less)
import DefaultTheme from 'vitepress/theme-without-fonts';
import type { EnhanceAppContext, Router } from 'vitepress';
import { nextTick } from 'vue';
import { localStorageGetItem } from 'ranuts/utils';
import env from '../plugins/env';
import TOTP from '../components/TOTP.vue';
import Layout from '../components/Layout.vue';
import Home from '../components/Home.vue';
import HomeCinematic from '../components/HomeCinematic.vue';
import GlassPlayground from '../components/GlassPlayground.vue';
import Mermaid from '../components/Mermaid.vue';
import IconGallery from '../components/IconGallery.vue';
import Demo from '../components/Demo.vue';
import i18n, { loadLanguageAsync } from '../lang';
import { LANGS_DICT, RAN_CHAXUS_LANG } from '../lib/constant';
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
  let lastDark: boolean | undefined;
  let flipTimer: number | undefined;
  const apply = () => {
    const dark = html.classList.contains('dark');
    html.setAttribute('data-ran-theme', dark ? 'dark' : 'light');
    // 换肤瞬间挂一个 theme-flip 脉冲 class(样式见 index.less):冻结全站 transition,
    // 否则导航栏(0.5s)、ranui 组件(0.2s)各按自己的时长淡变,页面切换不同步。
    // MutationObserver 在渲染前回调,class 能赶在本帧绘制前生效,不会闪。
    if (lastDark !== undefined && dark !== lastDark) {
      html.classList.add('theme-flip');
      window.clearTimeout(flipTimer);
      flipTimer = window.setTimeout(() => html.classList.remove('theme-flip'), 120);
    }
    lastDark = dark;
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
  router.go = (href: string, options?: Parameters<Router['go']>[1]): Promise<void> => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const content = document.querySelector<HTMLElement>('.VPContent');
    if (!document.startViewTransition || reduce || options?.initialLoad || !content) return go(href, options);
    content.style.viewTransitionName = PAGE_VT;
    return new Promise<void>((resolve) => {
      const t = document.startViewTransition!(async () => {
        await go(href, options);
        await nextTick();
      });
      t.finished.finally(() => {
        content.style.viewTransitionName = '';
        resolve();
      });
    });
  };
};

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }: EnhanceAppContext): void {
    if (!import.meta.env.SSR) {
      // `@ranui/preview` pins its own old `ranui` dependency and bundles it, so it
      // defines `r-icon` / `r-message` from that stale copy. Both that bundle and this
      // workspace's ranui guard `customElements.define` with `customElements.get(tag) ||
      // ...`, so whichever module finishes loading first silently wins the tag — the
      // loser's registration is a no-op with no error. Firing both imports unawaited
      // raced them, and the preview package's single small prebuilt chunk routinely beat
      // the current (many-module, unbundled-in-dev) `ranui` import, leaving every
      // `<r-icon>` on the site wired to the old component's own isolated icon cache —
      // one that this app's `registerIcons()` calls (which touch the *current* module's
      // cache) can never populate. Result: every icon renders permanently blank. Awaiting
      // `ranui` first guarantees it always claims the tags before `@ranui/preview` loads.
      import('ranui').then(() => {
        import('@ranui/preview'); // r-preview was split out of the ranui main package; import it so the preview demo works
        import('./register-icons'); // register ranui's SVG icons so <r-icon> demos render
      });
      syncRanuiTheme();
      enablePageTransitions(router);
    }
    app.use(env);
    app.component('Home', Home);
    app.component('HomeCinematic', HomeCinematic);
    app.component('GlassPlayground', GlassPlayground);
    app.component('Mermaid', Mermaid);
    app.component('IconGallery', IconGallery);
    app.component('Demo', Demo);
    const locale = localStorageGetItem(RAN_CHAXUS_LANG) || LANGS_DICT.EN;
    loadLanguageAsync(locale)
      .then(() => {
        // vue-i18n reads this as a bare global — must be set in both the browser (client
        // build) and Node (VitePress's SSR render pass), or SSR throws ReferenceError.
        (globalThis as unknown as { __VUE_PROD_DEVTOOLS__: boolean }).__VUE_PROD_DEVTOOLS__ = false;
        app.use(i18n);
        app.component('Layout', Layout);
        app.component('TOTP', TOTP);
      })
      .catch((error) => {
        console.log('error', error);
      });
  },
};
