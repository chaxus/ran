declare module '*.less';
declare module '*.less?inline';
declare module '*.ts';
declare module '*.svg';
declare module 'docx-preview';
declare module 'exceljs/*';
declare module '@/assets/*';
declare module '@/public/*';
declare module '@/components/*';
declare module '@/plugins/*';

declare namespace Ran {
  interface Prompt {
    content: string;
    duration?: number;
    close?: () => void;
  }
  type Hint = (options: Prompt | string) => void;

  interface Message {
    info: Hint;
    success: Hint;
    error: Hint;
    warning: Hint;
    toast: Hint;
  }
}

interface Ranui {
  message: Partial<Ran.Message>;
}

interface HlsPlayer {
  off: (s: string, f: Function) => void;
  on: (s: string, f: Function) => void;
  loadSource: (s: string) => void;
  attachMedia: (v: HTMLVideoElement) => void;
  destroy: () => void;
  startLoad(): () => void;
}

interface Hls {
  Events: {
    MANIFEST_LOADED: 'hlsManifestLoaded';
    ERROR: 'error';
  };
  isSupported: () => boolean;
}

type HLS = Hls & (new () => HlsPlayer);

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

interface HTMLElement {
  mozRequestFullScreen: (options?: FullscreenOptions) => Promise<void>;
  msRequestFullscreen: (options?: FullscreenOptions) => Promise<void>;
  oRequestFullscreen: (options?: FullscreenOptions) => Promise<void>;
  webkitRequestFullscreen: (options?: FullscreenOptions) => Promise<void>;
  webkitEnterFullscreen: (options?: FullscreenOptions) => Promise<void>;
}
declare interface Document {
  msExitFullscreen: () => Promise<void>;
  mozCancelFullScreen: () => Promise<void>;
  oCancelFullScreen: () => Promise<void>;
  webkitExitFullscreen: () => Promise<void>;
}

interface MathJax {
  texReset: () => void;
  getMetricsFor: (x: HTMLElement) => object;
  tex2chtmlPromise: (x: string, y: object) => Promise<Element>;
}

declare interface Window {
  ranui: Partial<Ranui>;
  message: Partial<Ran.Message>;
  MathJax: MathJax;
  katex: {
    render: (x: string, y: HTMLElement, z: object) => void;
  };
  pdfjsLib: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    getDocument: (x: string | ArrayBuffer) => {
      promise: Promise<PDFDocumentProxy>;
    };
  };
  Hls: HLS;
}
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'r-loading': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        name: NAME_AMP;
      };
      'r-math': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        latex: string;
      };
      'r-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        sheet: string;
        disabled: boolean | string;
        iconSize: string;
        icon: string;
        effect: boolean | string;
      };
      'r-checkbox': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        disabled: boolean | string;
        checked: boolean | string;
      };
      'r-img': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        fallback: string;
        src: string;
      };
      'r-input': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        value: string;
        placeholder: string;
        label: string;
        status: string;
        name: string;
        icon: string;
        prefix: string;
        suffix: string;
        type: string;
        required: boolean | string;
        disabled: boolean | string;
        min: number | string;
        max: number | string;
        step: number | string;
      };
      'r-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        src: string;
        debug: boolean | string;
        volume: number | string;
        currentTime: number | string;
        playbackRate: number | string;
      };
      'r-popover': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        placement: string;
        trigger: string;
        getPopupContainerId: string;
        arrow: boolean | string;
      };
      'r-preview': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        src: string;
        closeable: boolean | string;
      };
      'r-progress': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        percent: number | string;
        total: number | string;
        type: string;
        animation: string;
        dot: boolean | string;
      };
      'r-radar': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        abilitys: string;
        colorPolygon?: string;
        colorLine?: string;
        fillColor?: string;
        strokeColor?: string;
      };
      'r-select': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        value: string;
        defaultValue?: string;
        showSearch?: boolean | string;
        type?: string;
        placement?: string;
        sheet?: string;
        getPopupContainerId?: string;
        dropdownclass?: string;
        trigger?: string;
        trigger?: string;
        disabled?: boolean | string;
      };
      'r-skeleton': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {};
      'r-tab': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        label: string;
        icon: string;
        iconSize: string;
        key: string;
        disabled: boolean | string;
        effect: boolean | string;
      };
      'r-tabs': React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        align: string;
        type: string;
        active: string;
        effect: string;
      };
    }
  }
}
