import type { LINE_CAP, LINE_JOIN, RENDERER_TYPE } from '@/utils/visual/enums';

export interface IApplicationOptions {
  prefer?: RENDERER_TYPE.CANVAS | RENDERER_TYPE.WEB_GL | RENDERER_TYPE.WEB_GPU; // 使用哪种 renderer
  view?: HTMLCanvasElement;
  backgroundColor?: string;
  backgroundAlpha?: number;
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
