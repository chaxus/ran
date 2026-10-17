export {};

declare global {
  namespace Ran {
    type Prompt = import('./components/message/index.js').MessagePrompt;

    type Hint = (options: Prompt | string | undefined | null) => void;

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
  interface Document {
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

  interface Window {
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
  }

  interface BaseIntrinsicElements {
    'r-loading': any & {
      name: import('./components/loading/index.js').ICON_NAME_AMP;
    };
    'r-math': any & {
      latex: string;
      display: 'inline' | 'block';
      font: 'system' | string;
      macros: string;
      wrap: 'none' | 'tex' | '=';
      copy: boolean | 'source' | 'mathml';
      download: boolean | string;
      sheet: string;
    };
    'r-button': any & {
      sheet: string;
      disabled: boolean | string;
      iconSize: string;
      icon: string;
      effect: boolean | string;
    };
    'r-checkbox': any & {
      disabled: boolean | string;
      checked: boolean | string;
    };
    'r-img': any & {
      fallback: string;
      src: string;
    };
    'r-input': any & {
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
    'r-player': any & {
      src: string;
      debug: boolean | string;
      volume: number | string;
      currentTime: number | string;
      playbackRate: number | string;
    };
    'r-popover': any & {
      placement: string;
      trigger: string;
      getPopupContainerId: string;
      arrow: boolean | string;
      closePopover: () => void;
    };
    'r-content': any;
    'r-preview': any & {
      src: string;
      closeable: boolean | string;
    };
    'r-progress': any & {
      percent: number | string;
      total: number | string;
      type: string;
      animation: string;
      dot: boolean | string;
    };
    'r-radar': any & {
      abilitys: string;
      colorPolygon?: string;
      colorLine?: string;
      fillColor?: string;
      strokeColor?: string;
    };
    'r-select': any & {
      value: string;
      defaultValue?: string;
      showSearch?: boolean | string;
      type?: string;
      placement?: string;
      sheet?: string;
      getPopupContainerId?: string;
      dropdownclass?: string;
      trigger?: string;
      disabled?: boolean | string;
    };
    'r-skeleton': any;
    'r-tab': any & {
      label: string;
      icon: string;
      iconSize: string;
      key: string;
      disabled: boolean | string;
      effect: boolean | string;
    };
    'r-tabs': any & {
      align: string;
      type: string;
      active: string;
      effect: string;
    };
    'r-icon': any & {
      name?: string;
      size?: string;
      color?: string;
    };
  }
  namespace JSX {
    interface IntrinsicElements extends BaseIntrinsicElements {}
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements extends BaseIntrinsicElements {}
    }
  }
}
