/// <reference path="./typings-elements.generated.d.ts" />

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

  namespace JSX {
    interface IntrinsicElements extends BaseIntrinsicElements {}
  }

  namespace React {
    namespace JSX {
      interface IntrinsicElements extends BaseIntrinsicElements {}
    }
  }
}
