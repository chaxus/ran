import DefaultTheme from 'vitepress/theme'
import './styles/index.less'
import './styles/vars.less'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.config.compilerOptions.isCustomElement = (tag) => tag.includes('r-')
  }
}