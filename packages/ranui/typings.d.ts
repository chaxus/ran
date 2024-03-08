declare module '*.less';
declare module '*.less?inline';
declare module '*.ts';
declare module '*.svg';
declare module 'docx-preview';
declare module 'exceljs/*';
declare module '@/assets/*';
declare module '@/components/*';
declare module '@/plugins/*';
declare module '@/utils/*';

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

declare interface Window {
  ranui: Partial<Ranui>;
  message: Partial<Ran.Message>;
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
