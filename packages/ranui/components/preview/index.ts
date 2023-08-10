const PPTX =
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
const PDF = 'application/pdf'
const DOCX =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'


async function Custom() {
  if (typeof window !== 'undefined' && !customElements.get('r-preview')) {
    const { renderPptx } = await import('@/components/preview/pptx')
    const { renderDocx } = await import('@/components/preview/docx')
    const { renderPdf } = await import('@/components/preview/pdf')

    const url2File = (
      url: string,
      onProgress?: (x: ProgressEvent<EventTarget>) => void,
    ): Promise<File> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url)
        xhr.responseType = 'blob'
        xhr.onload = () => {
          const blob = xhr.response
          const file = new File([blob], blob.name, { type: blob.type })
          resolve(file)
        }
        xhr.onprogress = (event) => {
          onProgress && onProgress(event)
        }
        xhr.onerror = (e) => {
          reject(e)
        }
        xhr.send()
      })
    }

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
    ])

    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ['src']
      }
      preview?: HTMLElement | null
      previewContext?: HTMLDivElement
      _slot: HTMLSlotElement
      _div: HTMLElement
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
      onProgress = (event: ProgressEvent<EventTarget>) => {
        const num = (event.loaded / event.total) * 100
        const progress = num.toFixed(2) + '%'
        console.log(progress)
      }
      handleFile = async (file: string | File) => {
        try {
          if (typeof file === 'string') {
            file = await url2File(file, this.onProgress)
          }
          const { type } = file
          const handler = renderFileMap.get(type)
          if (handler && this.previewContext) {
            // document.body.style.overflow = 'hidden'
            handler(file, this.previewContext)
          }
        } catch (error) {
          console.log('handleFile', error)
        }
      }
      closePreview = () => {
        if (this.preview) {
          this.preview.style.display = 'none'
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
            const previewCloseButton = document.createElement('button')
            previewCloseButton.setAttribute('class', 'r-preview-options-close')
            previewCloseButton.addEventListener('click', this.closePreview)
            const previewContain = document.createElement('div')
            previewContain.setAttribute('class', 'r-preview-contain')
            this.previewContext = document.createElement('div')
            this.previewContext.setAttribute('class', 'r-preview-context')
            previewContain.appendChild(this.previewContext)
            previewOption.appendChild(previewCloseButton)
            this.preview.appendChild(previewOption)
            this.preview.appendChild(previewContain)
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
