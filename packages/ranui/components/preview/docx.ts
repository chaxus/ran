import { renderAsync } from '@/assets/js/docx-preview/index.js';

interface DocxOptions {
  bodyContainer?: HTMLElement | null;
  styleContainer?: HTMLElement;
  buffer: Blob;
  docxOptions?: Partial<Record<string, string | boolean>>;
}

export const renderDocx = async (options: DocxOptions): Promise<void | undefined> => {
  if (typeof document !== 'undefined') {
    const { bodyContainer, styleContainer, buffer, docxOptions = {} } = options;
    const defaultOptions = {
      className: 'docx',
      // ignoreLastRenderedPageBreak: false,
    };
    const configuration = Object.assign({}, defaultOptions, docxOptions);
    if (bodyContainer) {
      return renderAsync(buffer, bodyContainer, styleContainer, configuration);
    } else {
      const contain = document.createElement('div');
      document.body.appendChild(contain);
      return renderAsync(buffer, contain, styleContainer, configuration);
    }
  }
};
