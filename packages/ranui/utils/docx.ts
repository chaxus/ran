import { renderAsync } from 'docx-preview'

interface DocxOptions {
  bodyContainer?: HTMLElement | null
  styleContainer?: HTMLElement
  buffer: Blob
  docxOptions?: Partial<Record<string, string | boolean>>
}

export const renderDocx = (options: DocxOptions): Promise<void> | undefined => {
  if (typeof window !== 'undefined') {
    const { bodyContainer, styleContainer, buffer, docxOptions = {} } = options
    const defaultOptions = {
      className: 'docx',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: false,
      ignoreFonts: false,
      breakPages: true,
      ignoreLastRenderedPageBreak: true,
      experimental: false,
      trimXmlDeclaration: true,
      debug: false,
    }
    const configuration = Object.assign({}, defaultOptions, docxOptions)
    if (bodyContainer) {
      return renderAsync(buffer, bodyContainer, styleContainer, configuration)
    } else {
      const contain = document.createElement('div')
      document.body.appendChild(contain)
      return renderAsync(buffer, contain, styleContainer, configuration)
    }
  }
}
