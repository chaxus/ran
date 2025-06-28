import { Client, MessageCodec, create, noop } from 'ranuts/utils';
import less from './index.less?inline';
import message from '@/components/message';
import { DOCX, PDF, PPTX, XLS, XLSX } from '@/components/preview/constant';
import type { BaseReturn, RenderOptions } from '@/components/preview/types';
import '@/components/icon';

const TARGET_ORIGIN = 'https://ranuts.github.io/document';

interface RequestUrlToArraybufferOption {
  responseType: XMLHttpRequestResponseType;
  method: string;
  withCredentials: boolean;
  headers: Record<string, string>;
  body: string;
  onProgress?: Function;
  onError?: Function;
  onLoad?: Function;
}

interface requestUrlToArraybufferReturn extends BaseReturn {
  data: Blob & { name: string };
}

const renderOffice = async (file: File, options: RenderOptions) => {
  try {
    const { iframe, onLoad, dom, baseUrl } = options;
    dom?.style.setProperty('display', 'none');
    if (!iframe) return;
    Client.removeAll();
    const { id } = Client.connect({
      targetOrigin: new URL(baseUrl || TARGET_ORIGIN).origin,
      targetWindow: iframe.contentWindow!,
    });
    const chunks = await MessageCodec.encodeFileChunked(file);
    // 使用 Promise.all 并发发送所有 chunks
    await Promise.all(
      chunks.map((item) =>
        Client.call({
          id,
          type: 'RENDER_OFFICE',
          payload: item,
        }),
      ),
    );
    iframe.style.setProperty('width', '100%');
    iframe.style.setProperty('height', '100%');
    iframe.style.setProperty('border', 'none');
    iframe.style.setProperty('display', 'block');
    onLoad?.();
  } catch (error) {
    console.error('renderOffice error:', error);
    options.onError?.(error);
  }
};

async function Custom() {
  if (typeof document !== 'undefined' && !customElements.get('r-preview')) {
    const { warning = noop } = message!;

    const { renderPdf } = await import('@/components/preview/pdf');

    const requestUrlToBuffer = (
      src: string,
      options: Partial<RequestUrlToArraybufferOption>,
    ): Promise<Partial<requestUrlToArraybufferReturn>> => {
      if (typeof XMLHttpRequest === 'undefined') {
        throw new Error('XMLHttpRequest is not defined');
      }
      if (typeof document === 'undefined') {
        return Promise.reject('document is not defined');
      }
      return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open(options.method || 'GET', src, true);
        xhr.responseType = options.responseType || 'arraybuffer';
        xhr.onload = function () {
          if (xhr.status === 200) {
            const event = { success: true, data: xhr.response, message: '' };
            options.onLoad && options.onLoad(event);
            resolve(event);
          } else {
            const error = { success: false, data: xhr.status, message: `The request status is${xhr.status}` };
            options.onError && options.onError(error);
            reject(error);
          }
        };
        xhr.onerror = function (e) {
          const error = { success: false, data: e, message: `` };
          options.onError && options.onError(error);
          reject(error);
        };
        xhr.onprogress = (event) => {
          options.onProgress && options.onProgress(event);
        };
        xhr.withCredentials = options.withCredentials || false;
        if (options.headers) {
          Object.keys(options.headers).forEach(function (key) {
            options?.headers && xhr.setRequestHeader(key, options.headers[key]);
          });
        }
        xhr.send(options.body);
      });
    };

    const renderFileMap = new Map<string, (file: File, options: RenderOptions) => Promise<void>>([
      [PDF, renderPdf],
      [PPTX, renderOffice],
      [DOCX, renderOffice],
      [XLSX, renderOffice],
      [XLS, renderOffice],
    ]);

    class CustomElement extends HTMLElement {
      static get observedAttributes() {
        return ['src', 'closeable'];
      }
      previewContextPdf?: HTMLDivElement;
      _loadingText?: HTMLDivElement;
      previewIframe?: HTMLIFrameElement;
      preview?: HTMLElement | null;
      previewContext?: HTMLDivElement;
      _slot: HTMLSlotElement;
      _div: HTMLElement;
      _loadingElement?: HTMLDivElement;
      _iframe?: HTMLIFrameElement;
      _editorWindow?: Window;
      constructor() {
        super();
        this._div = document.createElement('div');
        this.preview = document.getElementById('r-preview-mask');
        this._slot = document.createElement('slot');
        this._div.appendChild(this._slot);
        this._slot.setAttribute('class', 'r-preview-slot');
        this._div.setAttribute('class', 'r-preview');
        const shadowRoot = this.attachShadow({ mode: 'closed' });
        shadowRoot.appendChild(this._div);
      }
      get label() {
        return this.getAttribute('label');
      }
      set label(value) {
        if (value) this.setAttribute('label', value);
      }
      get src() {
        return this.getAttribute('src');
      }
      set src(value) {
        if (value) this.setAttribute('src', value);
      }
      get closeable() {
        return this.getAttribute('closeable');
      }
      set closeable(value) {
        if (value) this.setAttribute('closeable', value);
      }
      get baseUrl() {
        return this.getAttribute('baseUrl') || TARGET_ORIGIN;
      }
      set baseUrl(value) {
        if (value) this.setAttribute('baseUrl', value);
      }
      createLoading = () => {
        this._loadingElement = document.createElement('div');
        this._loadingElement.setAttribute('class', 'r-preview-loading');
        const icon = document.createElement('r-icon');
        icon.setAttribute('name', 'loading');
        icon.setAttribute('size', '100');
        icon.setAttribute('color', '#1E90FF');
        icon.setAttribute('spin', '');
        this._loadingText = document.createElement('div');
        this._loadingElement.appendChild(icon);
        this._loadingText.setAttribute('class', 'r-preview-loading-text');
        this._loadingElement.appendChild(this._loadingText);
        return this._loadingElement;
      };
      onProgress = (event: ProgressEvent<EventTarget>) => {
        const num = (event.loaded / event.total) * 100;
        const progress = Math.min(99, num).toFixed(2) + '%';
        if (this._loadingText && this._loadingElement) {
          this._loadingText.innerText = `Loading ${progress}`;
          if (num >= 100) {
            setTimeout(() => {
              if (this._loadingText) {
                this._loadingText.innerText = `Loading...`;
              }
            }, 300);
          }
        }
      };
      onError = () => {
        this.preview?.removeChild(this._loadingElement!);
      };
      onLoad = () => {
        this.preview?.removeChild(this._loadingElement!);
      };
      handleFile = async (file: string | File) => {
        try {
          if (typeof file === 'string') {
            const { success, data, message } = await requestUrlToBuffer(file, {
              onProgress: this.onProgress,
              onError: this.onError,
              responseType: 'blob',
            });
            if (success && data) {
              file = new File([data], data.name, { type: data.type });
            } else {
              warning(message);
            }
          }
          if (file instanceof File) {
            const { type } = file;
            const handler = renderFileMap.get(type);
            if (handler && this.previewContext) {
              this.previewContext.style.setProperty('width', '100%');
              const options = {
                dom: this.previewContextPdf,
                onError: this.onError,
                onLoad: this.onLoad,
                iframe: this.previewIframe,
                baseUrl: this.baseUrl,
              };
              handler(file, options);
            }
          }
        } catch (error) {
          console.log('handleFile', error);
        }
      };
      closePreview = () => {
        if (this.preview) {
          Client.broadcast({
            type: 'CLOSE_PREVIEW',
            payload: '',
          });
          Client.removeAll();
          this.previewIframe?.style.setProperty('display', 'none');
          this.preview.style.setProperty('display', 'none');
          if (this.previewContextPdf && this.previewContext) {
            this.previewContext.removeChild(this.previewContextPdf);
          }
        }
      };
      showPreview = () => {
        if (this.src) {
          if (this.preview) {
            this.preview.style.display = 'block';
            this.preview.appendChild(this._loadingElement!);
            if (this.previewContextPdf && this.previewContext?.contains(this.previewContextPdf)) {
              this.previewContext.removeChild(this.previewContextPdf);
            }
            this.previewContextPdf = document.createElement('div');
            this.previewContextPdf.setAttribute('class', 'r-preview-context-pdf');
            this.previewContext?.appendChild(this.previewContextPdf);
            this._loadingElement?.style.setProperty('display', 'block');
          } else {
            this.preliminary();
          }
          this.handleFile(this.src);
        }
      };
      preliminary = () => {
        this.preview = document.createElement('div');
        this.preview.setAttribute('class', 'r-preview-mask');
        this.preview.setAttribute('id', 'r-preview-mask');
        const previewOption = document.createElement('div');
        previewOption.setAttribute('class', 'r-preview-options');
        if (this.closeable !== 'false') {
          const previewCloseButton = document.createElement('r-icon');
          previewCloseButton.setAttribute('class', 'r-preview-options-close');
          previewCloseButton.setAttribute('name', 'close-circle-fill');
          previewCloseButton.setAttribute('size', '40');
          previewCloseButton.addEventListener('click', this.closePreview);
          previewOption.appendChild(previewCloseButton);
        }
        const previewContain = document.createElement('div');
        previewContain.setAttribute('class', 'r-preview-contain');
        this.previewContext = document.createElement('div');
        this.previewContext.setAttribute('class', 'r-preview-context');
        this.previewContextPdf = document.createElement('div');
        this.previewContextPdf.setAttribute('class', 'r-preview-context-pdf');
        this.previewContext.appendChild(this.previewContextPdf);
        this.previewIframe = document.createElement('iframe');
        this.previewIframe.setAttribute('src', this.baseUrl);
        this.previewIframe.setAttribute('style', 'display: none;');
        this.previewIframe.style.setProperty('margin-bottom', '30px');
        this.previewContext.appendChild(this.previewIframe);
        previewContain.appendChild(this.previewContext);
        this.preview.appendChild(previewOption);
        this._loadingElement = this.createLoading();
        this.preview.appendChild(this._loadingElement);
        this.preview?.appendChild(previewContain);
        this.preview.style.setProperty('display', 'none');
        document.body.appendChild(this.preview);
      };
      connectedCallback() {
        this.preliminary();
        this.addEventListener('click', this.showPreview);
      }
      disconnectedCallback() {
        this.removeEventListener('click', this.showPreview);
        this.preview && document.body.removeChild(this.preview);
      }
      attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (newValue !== oldValue) {
          if (name === 'src' && newValue) {
            this.setAttribute('src', newValue);
            this.showPreview();
          }
        }
      }
    }
    if (typeof document !== 'undefined' && !customElements.get('r-preview')) {
      customElements.define('r-preview', CustomElement);
      const style = create('style').setTextContent(less);
      document.body.appendChild(style.element);
    }
  }
}

export default Custom();
