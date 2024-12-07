import { debounce } from 'lodash';
import Spreadsheet from '@/assets/js/x-data-spreadsheet';
import type { Media } from '@/components/preview/excel/media';
import { readExcelData, transferExcelToSpreadSheet } from '@/components/preview/excel/excel';
import { clearCache, renderImage } from '@/components/preview/excel/media';
import type { BaseReturn, RenderOptions } from '@/components/preview/types';

interface JsExcelPreviewOptions {
  minColLength: number;
  showContextmenu: boolean;
}

interface Xs extends Spreadsheet {
  bottombar?: {
    swapFunc: (index: number) => void;
  };
  reRender?: () => void;
  sheet?: {
    editor: {
      clear: () => void;
      setOffset: () => void;
    };
  };
}

function readOnlyInput(root: HTMLElement) {
  if (root) {
    const nodes = root.querySelectorAll('input');
    for (const node of nodes) {
      node && !node.readOnly && (node.readOnly = true);
    }
  }
}
const defaultOptions = {
  minColLength: 20,
};
class JsExcelPreview {
  container: HTMLElement;
  options: Partial<JsExcelPreviewOptions> = {};
  wrapper?: HTMLDivElement;
  wrapperMain?: HTMLDivElement;
  xs?: Xs;
  sheetIndex: number;
  mediasSource?: Partial<Media>;
  workbookDataSource: { _worksheets: never[] };
  ctx?: CanvasRenderingContext2D | null;
  fileData?: ArrayBuffer | string;
  observer?: MutationObserver;
  offset?: { scroll: { x: number; y: number } } | undefined;

  constructor(container: HTMLElement, options = {}) {
    this.container = container;
    this.options = { ...defaultOptions, ...options };
    this.sheetIndex = 1;
    this.mediasSource = {};
    this.workbookDataSource = {
      _worksheets: [],
    };
    this.createWrapper();
    this.initSpreadsheet();
    this.hack();
  }
  createWrapper() {
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'r-preview-excel-main';
    this.container.appendChild(this.wrapper);
  }
  async initSpreadsheet() {
    if (!this.wrapper && typeof window !== 'undefined') return;
    this.xs = new Spreadsheet(this.wrapper!, {
      mode: 'read',
      showToolbar: false,
      showContextmenu: this.options.showContextmenu || false,
      view: {
        height: () => (this.wrapper && this.wrapper.clientHeight) || 300,
        width: () => (this.wrapper && this.wrapper.clientWidth) || 1200,
      },
      row: {
        height: 24,
        len: 100,
      },
      col: {
        len: 26,
        width: 80,
        indexWidth: 60,
        minWidth: 60,
      },
      // autoFocus: false
    }).loadData({});

    if (!this.xs) return;
    if (this.xs.bottombar) {
      const swapFunc = this.xs.bottombar.swapFunc;
      this.xs.bottombar.swapFunc = (index) => {
        swapFunc.call(this.xs?.bottombar, index);
        this.sheetIndex = index + 1;
        setTimeout(() => {
          this.xs?.reRender && this.xs?.reRender();
          if (this.mediasSource && this.ctx && this.offset) {
            renderImage(this.ctx, this.mediasSource, this.workbookDataSource._worksheets[this.sheetIndex], this.offset);
          }
        });
      };
    }
    if (this.xs.sheet?.editor) {
      const clear = this.xs.sheet.editor.clear;
      this.xs.sheet.editor.clear = (...args) => {
        clear.apply(this.xs?.sheet?.editor, args);

        setTimeout(() => {
          if (this.ctx && this.mediasSource && this.offset) {
            renderImage(this.ctx, this.mediasSource, this.workbookDataSource._worksheets[this.sheetIndex], this.offset);
          }
        });
      };
      const setOffset = this.xs.sheet.editor.setOffset;
      this.xs.sheet.editor.setOffset = (...args) => {
        setOffset.apply(this.xs?.sheet?.editor, args);
        if (args.length > 1) {
          this.offset = args.shift();
        }
        if (this.ctx && this.mediasSource && this.offset) {
          renderImage(this.ctx, this.mediasSource, this.workbookDataSource._worksheets[this.sheetIndex], this.offset);
        }
      };
    }

    const canvas = this.wrapper && this.wrapper.querySelector('canvas');
    if (canvas) {
      this.ctx = canvas.getContext('2d');
    }
  }
  renderExcel(
    buffer: ArrayBuffer | string,
    onError: ((msg: BaseReturn) => void) | undefined,
    onLoad: ((msg: BaseReturn) => void) | undefined,
  ) {
    this.fileData = buffer;
    return readExcelData(buffer)
      .then((workbook: any) => {
        if (!workbook._worksheets || workbook._worksheets.length === 0) {
          onError && onError({ success: false, data: null, message: '未获取到数据，可能文件格式不正确或文件已损坏' });
          throw new Error('未获取到数据，可能文件格式不正确或文件已损坏');
        }
        const { workbookData, medias, workbookSource } = transferExcelToSpreadSheet(workbook, this.options);
        this.mediasSource = medias;
        this.workbookDataSource = workbookSource;
        this.offset = undefined;
        this.sheetIndex = 1;
        clearCache();
        this.xs?.loadData(workbookData);
        if (this.ctx && this.mediasSource && this.offset) {
          renderImage(this.ctx, this.mediasSource, this.workbookDataSource._worksheets[this.sheetIndex], this.offset);
        }
        onLoad && onLoad({ success: true, data: workbook });
      })
      .catch((e) => {
        this.mediasSource = [];
        this.workbookDataSource = {
          _worksheets: [],
        };
        clearCache();
        this.xs?.loadData({});
        onError && onError({ success: false, message: '未获取到数据，可能文件格式不正确或文件已损坏' });
        return Promise.reject(e);
      });
  }
  hack() {
    if (!this.wrapper) return;
    const observerCallback = debounce(readOnlyInput, 200).bind(this, this.wrapper);
    this.observer = new MutationObserver(observerCallback);
    const observerConfig = { attributes: true, childList: true, subtree: true };
    this.observer.observe(this.wrapper, observerConfig);
    observerCallback();
  }
}

export const renderExcel = (file: File, options: RenderOptions): Promise<void> => {
  const { dom, onError, onLoad } = options;
  if (!dom) return Promise.reject();
  const Preview = new JsExcelPreview(dom);
  const file2Array = (): Promise<ArrayBuffer | string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        if (reader.result) {
          resolve(reader?.result);
        } else {
          reject();
        }
      };
    });
  return file2Array().then((res) => {
    Preview.renderExcel(res, onError, onLoad);
  });
};
