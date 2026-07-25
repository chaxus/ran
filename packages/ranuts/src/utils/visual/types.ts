import type { LINE_CAP, LINE_JOIN, RENDERER_TYPE } from '@/utils/visual/enums';

export interface IApplicationOptions {
  prefer?: RENDERER_TYPE.CANVAS | RENDERER_TYPE.WEB_GL | RENDERER_TYPE.WEB_GPU; // which renderer to use
  view?: HTMLCanvasElement;
  backgroundColor?: string;
  backgroundAlpha?: number;
  debug?: boolean; // when on, logs which backend is in use (off by default, to keep the console and tests clean)
}

export interface IFillStyleOptions {
  color?: string;
  alpha?: number;
  visible?: boolean;
}

export interface ILineStyleOptions extends IFillStyleOptions {
  width?: number;
  cap?: LINE_CAP;
  join?: LINE_JOIN;
}
