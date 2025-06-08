import { isSafari } from 'ranuts/utils';
import { loadScript } from '@/utils/index';
// copy from: https://github.com/mozilla/pdfjs-dist/blob/master/build/pdf.min.js
import PDF_JS from '@/assets/js/pdf.min.js?raw';
// copy from：https://github.com/mozilla/pdfjs-dist/blob/master/build/pdf.worker.min.js
import PDF_WORKER_JS from '@/assets/js/pdf.worker.min.js?raw';
import type { BaseReturn, RenderOptions } from '@/components/preview/types';

export interface Viewport {
  width: number;
  height: number;
  viewBox: Array<number>;
}

export interface RenderContext {
  canvasContext: CanvasRenderingContext2D | null;
  transform: Array<number>;
  viewport: Viewport;
}

export interface PDFPageProxy {
  pageNumber: number;
  getViewport: ({ scale }: { scale: number }) => Viewport;
  render: (options: RenderContext) => void;
}

export interface PDFDocumentProxy {
  numPages: number;
  getPage: (x: number) => Promise<PDFPageProxy>;
}

declare global {
  interface Window {
    pdfjsLib: {
      GlobalWorkerOptions: {
        workerSrc: string;
      };
      getDocument: (x: string | ArrayBuffer) => {
        promise: Promise<PDFDocumentProxy>;
      };
    };
  }
}

export class PdfPreview {
  private pdfDoc: PDFDocumentProxy | undefined;
  pageNumber: number;
  total: number;
  dom: HTMLElement;
  pdf: string | ArrayBuffer;
  onError: ((msg: BaseReturn) => void) | undefined;
  onLoad: ((msg: BaseReturn) => void) | undefined;
  constructor(pdf: string | ArrayBuffer, options: RenderOptions) {
    const { dom, onError, onLoad } = options;
    this.pageNumber = 1;
    this.total = 0;
    this.pdfDoc = undefined;
    this.pdf = pdf;
    this.dom = dom ? dom : document.body;
    this.onError = onError;
    this.onLoad = onLoad;
  }
  private getPdfPage = (number: number) => {
    return new Promise((resolve, reject) => {
      if (this.pdfDoc) {
        this.pdfDoc.getPage(number).then((page: PDFPageProxy) => {
          // safari 上有兼容性问题
          const scale = isSafari() ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio || 1;
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement('canvas');
          canvas.style.setProperty('margin', '0 auto');
          // this.dom.innerHTML = ''
          this.dom.appendChild(canvas);
          const context = canvas.getContext('2d');
          const clientWidth = document.body.clientWidth - 20;
          const { width } = viewport;
          const baseRadio = width > clientWidth ? clientWidth / width : 1;
          canvas.width = viewport.width * scale;
          canvas.height = viewport.height * scale;
          canvas.style.width = Math.floor(viewport.width) * baseRadio + 'px';
          canvas.style.height = Math.floor(viewport.height) * baseRadio + 'px';
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            // 线性变换矩阵：[a, b, c, d, e, f]。a 和 d 控制缩放。b 和 c 控制倾斜（skew）。e 和 f：控制平移（translate）。
            transform: [scale, 0, 0, scale, 0, 0],
          };
          page.render(renderContext);
          resolve({ success: true, data: page });
        });
      } else {
        reject({ success: false, data: null, message: 'pdfDoc is undefined' });
      }
    });
  };
  pdfPreview = (): Promise<BaseReturn> => {
    return new Promise((resolve) => {
      const workerBlob = new Blob([PDF_WORKER_JS], { type: 'application/javascript' });
      // eslint-disable-next-line n/no-unsupported-features/node-builtins
      const workerUrl = URL.createObjectURL(workerBlob);
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
      window.pdfjsLib.getDocument(this.pdf).promise.then(async (doc: PDFDocumentProxy) => {
        this.pdfDoc = doc;
        this.total = doc.numPages;
        this.onLoad && this.onLoad({ success: true, data: this.pdfDoc });
        await this.getPdfPage(this.pageNumber);
        resolve({ success: true, data: this.pdfDoc });
      });
    });
  };
  showTotalPage = async (): Promise<void> => {
    for (let i = 1; i <= this.total; i++) {
      await this.getPdfPage(i);
    }
  };
  changePage = (num: number): number => {
    if (num > 0 && num <= this.total) {
      this.pageNumber = num;
      this.getPdfPage(this.pageNumber);
    }
    return this.pageNumber;
  };
  prevPage = async (): Promise<number> => {
    if (this.pageNumber > 1) {
      this.pageNumber -= 1;
    } else {
      this.pageNumber = 1;
    }
    await this.getPdfPage(this.pageNumber);
    return this.pageNumber;
  };
  nextPage = async (): Promise<number> => {
    if (this.pageNumber < this.total) {
      this.pageNumber += 1;
    } else {
      this.pageNumber = this.total;
    }
    await this.getPdfPage(this.pageNumber);
    return this.pageNumber;
  };
}

const createReader = (file: File): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.onabort = (abort) => {
      reject(abort);
    };
  });
};

export const renderPdf = async (file: File, options: RenderOptions): Promise<void> => {
  try {
    if (typeof window !== 'undefined') {
      loadScript({ type: 'content', content: PDF_JS });
      const pdf = await createReader(file);
      if (pdf) {
        const PDF = new PdfPreview(pdf, options);
        await PDF.pdfPreview();
        await PDF.showTotalPage();
      }
    }
  } catch (error) {
    console.log('renderPdf', error);
  }
};
