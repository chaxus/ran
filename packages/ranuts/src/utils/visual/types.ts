import type { LineCap, LineJoin, RendererType } from '@/utils/visual/enums';

export interface IApplicationOptions {
  rendererType?: RendererType; // 这里留个坑，未来可能会实现 webgl render
  view: HTMLCanvasElement;
  backgroundColor?: string;
}

export interface IFillStyleOptions {
  color?: string;
  alpha?: number;
  visible?: boolean;
}

export interface ILineStyleOptions extends IFillStyleOptions {
  width?: number;
  cap?: LineCap;
  join?: LineJoin;
}
