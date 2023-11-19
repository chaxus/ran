import DefaultTheme from 'vitepress/theme';
import './styles/index.less';
import './styles/vars.less';

declare global {
  interface ImportMeta {
    env: {
      SSR: boolean
    }
  }
}

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {
    if (!import.meta.env.SSR) {
      import('ranui');
    }
  },
};
