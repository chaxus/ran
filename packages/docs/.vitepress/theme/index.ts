import DefaultTheme from 'vitepress/theme'
// import { Monitor } from 'ranuts'
import 'ranui'
import './styles/index.less'
import './styles/vars.less'

const GTAG = 'https://www.googletagmanager.com/gtag/js?id=G-0MPS5WH1C0'

const code = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);};gtag('js', new Date());gtag('config', 'G-0MPS5WH1C0');`

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
      const script = document.createElement('script')
      script.async = true
      script.setAttribute('src', GTAG)
      const codeScript = document.createElement('script')
      codeScript.innerText = code
      document.body.appendChild(script)
      document.body.appendChild(codeScript)
      window.uploadFile = (name) => {
        const preview = document.getElementById(name)
        const uploadFile = document.createElement('input')
        uploadFile.setAttribute('type', 'file')
        uploadFile.click()
        uploadFile.onchange = (e) => {
          const { files = [] } = uploadFile
          if (preview) {
            if (files && files.length > 0) {
              preview.setAttribute('src', '')
              const file = files[0]
              const url = URL.createObjectURL(file)
              preview.setAttribute('src', url)
            }
          }
        }
      }
    }
  },
}
