import DefaultTheme from 'vitepress/theme'
// import { Monitor } from 'ranuts'
import 'ranui'
import './styles/index.less'
import './styles/vars.less'

// const initialize = (callback = () => {}) => {
//   if (typeof window !== 'undefined' && !window.ran_docs) {
//     window.ran_docs = true
//     callback()
//   }
//   if (typeof process !== 'undefined' && !process.ran_docs) {
//     process.ran_docs = true
//     callback()
//   }
// }

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // initialize(() => new Monitor())
    // app.config.compilerOptions.isCustomElement = (tag) => tag.includes('r-')
    // preview component
    if (typeof window !== 'undefined') {
      window.uploadFile = (name) => {
        const preview = document.getElementById(name)
        const uploadFile = document.createElement('input')
        uploadFile.setAttribute('type', 'file')
        uploadFile.click()
        uploadFile.onchange = (e) => {
          const { files = [] } = uploadFile
          if (preview) {
            preview.innerText = '加载中'
            if (files && files.length > 0) {
              preview.setAttribute('src', '')
              const file = files[0]
              const url = URL.createObjectURL(file)
              preview.setAttribute('src', url)
              preview.innerText = '点击预览'
            } else {
              preview.innerText = '还没有预览的文件'
            }
          }
        }
      }
    }
  },
}
