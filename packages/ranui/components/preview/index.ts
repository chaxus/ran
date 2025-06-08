import { create, noop } from 'ranuts/utils';
import '@/components/icon';
import less from './index.less?inline';
import { loadResources } from './resource-loader';
import templatedoc from '@/assets/apps/documenteditor/main/index.html?raw';
import templateppt from '@/assets/apps/presentationeditor/main/index.html?raw';
import templatetab from '@/assets/apps/spreadsheeteditor/main/index.html?raw';
import { 
  convertDocument,
  createEditorInstance,
  initX2T, 
  initX2TScript, 
  loadEditorApi
} from '@/components/preview/onlyoffice';
import message from '@/components/message';
import { DOCX, PDF, PPTX, XLS, XLSX } from '@/components/preview/constant';
import type { BaseReturn, RenderOptions } from '@/components/preview/types';

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

// 处理模板中的资源路径
function processTemplatePaths(template: string, type: 'doc' | 'ppt' | 'xls'): string {
  // 替换资源路径
  return template
    // 替换 CSS 路径
    .replace(
      /href="\.\.\/\.\.\/\.\.\/apps\/([^"]+)"/g,
      'href="/assets/apps/$1"'
    )
    // 替换 SDK 路径
    .replace(
      /src="\.\.\/\.\.\/\.\.\/\.\.\/sdkjs\/([^"]+)"/g,
      'src="/assets/sdkjs/$1"'
    )
    // 替换其他资源路径
    .replace(
      /src="\.\.\/\.\.\/common\/([^"]+)"/g,
      'src="/assets/apps/common/$1"'
    );
}

const renderOffice = async (file: File, options: RenderOptions) => {
  try {
    // 初始化 x2t-wasm
    await initX2TScript()
    // 加载编辑器 API
    await loadEditorApi()
    await initX2T()

    // 转换文档
    const result = await convertDocument(file)
    
    // 创建编辑器实例
    createEditorInstance({
      fileName: file.name,
      fileType: file.type,
      binData: new Uint8Array(result.bin).buffer,
      media: result.media
    })
  } catch (error) {
    console.error('renderOffice error:', error)
    options.onError?.(error)
  }
}

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
      _loadingText: any;
      static get observedAttributes() {
        return ['src', 'closeable'];
      }
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
              this._loadingText.innerText = `Loading...`;
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
              const { type } = file;
              const handler = renderFileMap.get(type);
              if (handler && this.previewContext) {
                if (type === XLSX || type === XLS) {
                  this.previewContext.style.setProperty('width', '100%');
                } else {
                  this.previewContext.style.setProperty('width', '100%');
                }
                const options = {
                  dom: this.previewContext,
                  onError: this.onError,
                  onLoad: this.onLoad,
                };
                handler(file, options);
              }
            } else {
              warning(message);
            }
          }
        } catch (error) {
          console.log('handleFile', error);
        }
      };
      closePreview = () => {
        if (this.preview) {
          document.body.removeChild(this.preview);
          this.preview = undefined;
        }
      };
      createEditorIframe = () => {
        if (this._iframe) {
          return;
        }

        // 创建 iframe
        this._iframe = document.createElement('iframe');
        this._iframe.style.width = '100%';
        this._iframe.style.height = '100%';
        this._iframe.style.border = 'none';
        
        // 根据文件类型选择模板
        const fileType = this.src?.split('.').pop()?.toLowerCase() || '';
        let template = templatedoc; // 默认使用文档编辑器模板
        let editorType: 'doc' | 'ppt' | 'xls' = 'doc';
        
        if (fileType === 'xlsx' || fileType === 'xls') {
          template = templatetab;
          editorType = 'xls';
        } else if (fileType === 'pptx' || fileType === 'ppt') {
          template = templateppt;
          editorType = 'ppt';
        }
        
        // 处理模板中的资源路径
        template = processTemplatePaths(template, editorType);
        
        // 写入模板内容
        this._iframe.srcdoc = template;
        
        // 等待 iframe 加载完成
        this._iframe.onload = () => {
          const contentWindow = this._iframe?.contentWindow;
          if (contentWindow) {
            this._editorWindow = contentWindow;
            // 初始化编辑器
            this.initEditor();
          }
        };

        // 添加到预览容器
        if (this.previewContext) {
          this.previewContext.appendChild(this._iframe);
        }
      }
      initEditor = async () => {
        try {
          // 加载资源
          await loadResources();
          
          // 初始化 x2t-wasm
          await initX2TScript();
          // 加载编辑器 API
          await loadEditorApi();
          await initX2T();

          if (this.src) {
            const response = await fetch(this.src);
            const blob = await response.blob();
            const file = new File([blob], this.src.split('/').pop() || 'document.docx', { type: blob.type });

            // 转换文档
            const result = await convertDocument(file);
            
            // 创建编辑器实例
            if (this._editorWindow) {
              createEditorInstance({
                fileName: file.name,
                fileType: file.type,
                binData: new Uint8Array(result.bin).buffer,
                media: result.media
              });
            }
          }
        } catch (error) {
          console.error('Editor initialization error:', error);
          if (this._loadingElement) {
            this.preview?.removeChild(this._loadingElement);
          }
        }
      }
      showPreview = () => {
        if (this.src) {
          if (this.preview) {
            this.preview.style.display = 'block';
          } else {
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
            previewContain.appendChild(this.previewContext);
            this.preview.appendChild(previewOption);
            this.preview?.appendChild(previewContain);
            this._loadingElement = this.createLoading();
            this.preview.appendChild(this._loadingElement);
            document.body.appendChild(this.preview);
          }
          
          // 创建编辑器 iframe
          this.createEditorIframe();
        }
      };
      connectedCallback() {
        this.preview = document.getElementById('r-preview-mask');
        this.addEventListener('click', this.showPreview);
      }
      disconnectedCallback() {
        this.removeEventListener('click', this.showPreview);
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
