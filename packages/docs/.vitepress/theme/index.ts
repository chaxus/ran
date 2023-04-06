import DefaultTheme from 'vitepress/theme'
import { Monitor } from 'ranuts'
import 'ranui'
import './styles/index.less'
import './styles/vars.less'

const initialize = (callback = () => {}) => {
  if (typeof window !== 'undefined' && !window.ran_docs) {
    window.ran_docs = true
    callback()
  }
  if (typeof process !== 'undefined' && !process.ran_docs) {
    process.ran_docs = true
    callback()
  }
}

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    initialize(() => new Monitor())
    app.config.compilerOptions.isCustomElement = (tag) => tag.includes('r-')
  },
}
