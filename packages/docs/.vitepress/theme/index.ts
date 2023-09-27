import DefaultTheme from 'vitepress/theme';
import 'ranui';
import './styles/index.less';
import './styles/vars.less';

export default {
  ...DefaultTheme,
  enhanceApp({ app, router, siteData }) {},
};
