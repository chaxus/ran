import DefaultTheme from 'vitepress/theme'
// import '../../../ranui/index' // 开发
import 'ranui' // 打包

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.config.compilerOptions.isCustomElement = (tag) => tag.includes('r-')
  }
}
