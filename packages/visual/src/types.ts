import type { RENDERER_TYPE } from '@/src/enums';

export interface IApplicationOptions {
    prefer?: RENDERER_TYPE.CANVAS | RENDERER_TYPE.WEB_GL | RENDERER_TYPE.WEB_GPU; // 使用哪种 renderer
    view?: HTMLCanvasElement;
    backgroundColor?: string;
    backgroundAlpha?: number;
  }