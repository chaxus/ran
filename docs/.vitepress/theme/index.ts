import DefaultTheme from 'vitepress/theme'
import '../../../src/index'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.config.compilerOptions.isCustomElement = (tag) => tag.includes('xu-')
  }
}
