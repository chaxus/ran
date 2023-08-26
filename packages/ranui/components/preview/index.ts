
import { requestFile } from '@/utils/index'
import '@/components/icon'

const PPTX =
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
const PDF = 'application/pdf'
const DOCX =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const XLS = 'application/vnd.ms-excel'

async function Custom() {
  if (typeof window !== 'undefined' && !customElements.get('r-preview')) {

    const { renderPptx } = await import('@/components/preview/pptx')
    const { renderDocx } = await import('@/components/preview/docx')
    const { renderPdf } = await import('@/components/preview/pdf')
    const { renderExcel } = await import('@/components/preview/excel')

    const renderPpt = (file: File, dom?: HTMLElement) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(file)
        reader.onload = () => {
          if (reader.result && dom) {
            const param = {
              pptx: reader.result,
              resultElement: dom,
            }
            renderPptx(param)?.then(() => {
              resolve()
            })
          }
        }
        reader.onerror = (error) => {
          reject(error)
        }
        reader.onabort = (abort) => {
          reject(abort)
        }
      })
    }

    const renderWord = (file: File, dom?: HTMLElement) => {
      return Promise.resolve().then(() =>
        renderDocx({ buffer: file, bodyContainer: dom }),
      )
    }

    const renderFileMap = new Map<
      string,
      (file: File, dom?: HTMLElement) => Promise<void>
    >([
      [PDF, renderPdf],
      [PPTX, renderPpt],
      [DOCX, renderWord],
      [XLSX, renderExcel],
      [XLS, renderExcel],
    ])

    class CustomElement extends HTMLElement {
      _loadingText: any
      static get observedAttributes() {
        return ['src', 'closeable']
      }
      preview?: HTMLElement | null
      previewContext?: HTMLDivElement
      _slot: HTMLSlotElement
      _div: HTMLElement
      _loadingElement?: HTMLDivElement
      constructor() {
        super()
        this._div = document.createElement('div')
        this.preview = document.getElementById('r-preview-mask')
        this._slot = document.createElement('slot')
        this._div.appendChild(this._slot)
        this._slot.setAttribute('class', 'r-preview-slot')
        this._div.setAttribute('class', 'r-preview')
        const shadowRoot = this.attachShadow({ mode: 'closed' })
        shadowRoot.appendChild(this._div)
      }
      get label() {
        return this.getAttribute('label')
      }
      set label(value) {
        if (value) this.setAttribute('label', value)
      }
      get src() {
        return this.getAttribute('src')
      }
      set src(value) {
        if (value) this.setAttribute('src', value)
      }
      get closeable() {
        return this.getAttribute('closeable')
      }
      set closeable(value) {
        if (value) this.setAttribute('closeable', value)
      }
      createLoading = () => {
        this._loadingElement = document.createElement('div')
        this._loadingElement.setAttribute('class', 'r-preview-loading')
        const icon = document.createElement('r-icon')
        icon.setAttribute('name', 'loading')
        icon.setAttribute('size', '100')
        icon.setAttribute('color', '#1E90FF')
        icon.setAttribute('spin', '')
        this._loadingText = document.createElement('div')
        this._loadingElement.appendChild(icon)
        this._loadingText.setAttribute('class', 'r-preview-loading-text')
        this._loadingElement.appendChild(this._loadingText)
        return this._loadingElement
      }
      onProgress = (event: ProgressEvent<EventTarget>) => {
        const num = (event.loaded / event.total) * 100
        const progress = Math.min(99, num).toFixed(2) + '%'
        if (this._loadingText && this._loadingElement) {
          this._loadingText.innerText = `Loading ${progress}`
          if (num >= 100) {
            setTimeout(() => {
              this.preview?.removeChild(this._loadingElement!)
            }, 300);
          }
        }
      }
      handleFile = async (file: string | File) => {
        try {
          if (typeof file === 'string') {
            file = await requestFile(file, { onProgress: this.onProgress })
          }
          const { type } = file
          const handler = renderFileMap.get(type)
          if (handler && this.previewContext) {
            if (type === XLSX || type === XLS) {
              this.previewContext.style.setProperty('width', '100%')
            } else {

              this.previewContext.style.setProperty('width', '100%')
            }
            // document.body.style.overflow = 'hidden'
            handler(file, this.previewContext)
          }
        } catch (error) {
          console.log('handleFile', error)
        }
      }
      closePreview = () => {
        if (this.preview) {
          // document.body.style.overflow = 'auto'
          // this.preview.style.display = 'none'
          document.body.removeChild(this.preview)
          this.preview = undefined
        }
      }
      showPreview = () => {
        if (this.src) {
          if (this.preview) {
            this.preview.style.display = 'block'
          } else {
            this.preview = document.createElement('div')
            this.preview.setAttribute('class', 'r-preview-mask')
            this.preview.setAttribute('id', 'r-preview-mask')
            const previewOption = document.createElement('div')
            previewOption.setAttribute('class', 'r-preview-options')
            if (this.closeable !== 'false') {
              const previewCloseButton = document.createElement('button')
              previewCloseButton.setAttribute('class', 'r-preview-options-close')
              previewCloseButton.addEventListener('click', this.closePreview)
              previewOption.appendChild(previewCloseButton)
            }
            const previewContain = document.createElement('div')
            previewContain.setAttribute('class', 'r-preview-contain')
            this.previewContext = document.createElement('div')
            this.previewContext.setAttribute('class', 'r-preview-context')
            previewContain.appendChild(this.previewContext)
            this.preview.appendChild(previewOption)
            this.preview?.appendChild(previewContain)
            this._loadingElement = this.createLoading()
            this.preview.appendChild(this._loadingElement)
            document.body.appendChild(this.preview)
          }
          this.handleFile(this.src)
        }
      }
      connectedCallback() {
        this.preview = document.getElementById('r-preview-mask')
        this.addEventListener('click', this.showPreview)
      }
      disconnectedCallback() {
        this.removeEventListener('click', this.showPreview)
      }
      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string,
      ) {
        if (newValue !== oldValue) {
          if (name === 'src' && newValue) {
            this.setAttribute('src', newValue)
            this.showPreview()
          }
        }
      }
    }
    customElements.define('r-preview', CustomElement)
  }
}

export default Custom()
