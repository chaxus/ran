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

declare global {
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
}

enum NAME_AMP {
  DOUBLE_BOUNCE = 'double-bounce',
  ROTATE = 'rotate',
  STRETCH = 'stretch',
  CUBE = 'cube',
  DOT = 'dot',
  TRIPLE_BOUNCE = 'triple-bounce',
  SCALE_OUT = 'scale-out',
  CIRCLE = 'circle',
  CIRCLE_LINE = 'circle-line',
  SQUARE = 'square',
  PULSE = 'pulse',
  SOLAR = 'solar',
  CUBE_FOLD = 'cube-fold',
  CIRCLE_FOLD = 'circle-fold',
  CUBE_GRID = 'cube-grid',
  CIRCLE_TURN = 'circle-turn',
  CIRCLE_ROTATE = 'circle-rotate',
  CIRCLE_SPIN = 'circle-spin',
  DOT_BAR = 'dot-bar',
  DOT_CIRCLE = 'dot-circle',
  LINE = 'line',
  DOT_PULSE = 'dot-pulse',
  LINE_SCALE = 'line-scale',
  TEXT = 'text',
  CUBE_DIM = 'cube-dim',
  DOT_LINE = 'dot-line',
  ARC = 'arc',
  DROP = 'drop',
  PACMAN = 'pacman',
}

namespace JSX {
  interface IntrinsicElements {
    'r-loading': any & {
      name: NAME_AMP;
    };
    'r-math': any & {
      latex: string;
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
    };
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
  }
}
