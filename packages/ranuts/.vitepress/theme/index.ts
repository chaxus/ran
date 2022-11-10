import DefaultTheme from 'vitepress/theme'
import './index.less'
import './vars.less'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.config.compilerOptions.isCustomElement = (tag) => tag.includes('r-')
  }
}