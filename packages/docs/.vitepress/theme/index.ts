import DefaultTheme from 'vitepress/theme'
import 'ranui' // 打包

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.config.compilerOptions.isCustomElement = (tag) => tag.includes('r-')
  }
}
