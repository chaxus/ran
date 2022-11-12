import DefaultTheme from 'vitepress/theme'
// import '../../index'
import '../../dist/index'
// import '../../dist/index.umd.cjs'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.config.compilerOptions.isCustomElement = (tag) => tag.includes('r-')
  }
}
