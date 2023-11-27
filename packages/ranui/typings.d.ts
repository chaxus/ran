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
}

interface Hls {
  Events: {
    MANIFEST_LOADED: 'hlsManifestLoaded';
  };
  isSupported: () => boolean;
}

type HLS = Hls & (new () => HlsPlayer);

declare interface Window {
  ranui: Partial<Ranui>;
  message: Partial<Ran.Message>;
  pdfjsLib: any;
  Hls: HLS;
}
// ranuts 声明文件
declare module '@/file/*';
declare module '@/designMode/*';
declare module '@/node/*';
declare module '@/sort/*';
declare module '@/astParser/*';
declare module '@/utils/*';

declare namespace Ranuts {
  interface Identification {
    _identification: boolean;
    message?: string;
    data?: any;
  }
}
