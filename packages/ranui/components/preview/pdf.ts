import { pdfjsLib } from '@/assets/js/pdf';
import { worker } from '@/assets/js/pdf-worker';
import { loadScript } from '@/utils/index';
import type { BaseReturn, RenderOptions } from '@/components/preview/types';

const pdfjs: string = `data:text/javascript;base64,${pdfjsLib}`;
const pdfjsWorker: string = `data:text/javascript;base64,${worker}`;

interface Viewport {
  width: number;
  height: number;
  viewBox: Array<number>;
}

interface RenderContext {
  canvasContext: CanvasRenderingContext2D | null;
  transform: Array<number>;
  viewport: Viewport;
}

interface PDFPageProxy {
  pageNumber: number;
  getViewport: () => Viewport;
  render: (options: RenderContext) => void;
}

interface PDFDocumentProxy {
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

class PdfPreview {
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
          const viewport = page.getViewport();
          const canvas = document.createElement('canvas');
          this.dom.appendChild(canvas);
          const context = canvas.getContext('2d');
          const clientWidth = document.body.clientWidth - 20;
          const [_, __, width, height] = viewport.viewBox;
          const baseRadio = width > clientWidth ? clientWidth / width : 1;
          canvas.width = width;
          canvas.height = height;
          viewport.width = width;
          viewport.height = height;
          canvas.style.width = Math.floor(viewport.width) * baseRadio + 'px';
          canvas.style.height = Math.floor(viewport.height) * baseRadio + 'px';
          const renderContext = {
            canvasContext: context,
            viewport: viewport,
            transform: [1, 0, 0, -1, 0, viewport.height],
          };
          page.render(renderContext);
          resolve({ success: true, data: page });
        });
      } else {
        reject({ success: false, data: null, message: 'pdfDoc is undefined' });
      }
    });
  };
  pdfPreview = () => {
    loadScript(pdfjs)
      .then(() => {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
        window.pdfjsLib.getDocument(this.pdf).promise.then(async (doc: PDFDocumentProxy) => {
          this.pdfDoc = doc;
          this.total = doc.numPages;
          this.onLoad && this.onLoad({ success: true, data: this.pdfDoc });
          for (let i = 1; i <= this.total; i++) {
            await this.getPdfPage(i);
          }
        });
      })
      .catch((error) => {
        this.onError && this.onError({ success: false, data: error, message: error });
      });
  };
  prevPage = () => {
    if (this.pageNumber > 1) {
      this.pageNumber -= 1;
    } else {
      this.pageNumber = 1;
    }
    this.getPdfPage(this.pageNumber);
  };
  nextPage = () => {
    if (this.pageNumber < this.total) {
      this.pageNumber += 1;
    } else {
      this.pageNumber = this.total;
    }
    this.getPdfPage(this.pageNumber);
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
      const pdf = await createReader(file);
      if (pdf) {
        const PDF = new PdfPreview(pdf, options);
        PDF.pdfPreview();
      }
    }
  } catch (error) {
    console.log('renderPdf', error);
  }
};
