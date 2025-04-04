import type { IApplicationOptions } from '../types';
import { RENDERER_TYPE } from '../enums';
import { WebGLRenderer } from './webGLRender';
import { WebGPURenderer } from './webGPURender';
import type { Renderer } from './render';
import { CanvasRenderer } from './canvasRender';

export const getRenderer = (options: IApplicationOptions): Renderer => {
  const { prefer: renderType } = options;
  switch (renderType) {
    case RENDERER_TYPE.CANVAS:
      return new CanvasRenderer(options);
    case RENDERER_TYPE.WEB_GL:
      return new WebGLRenderer(options);
    case RENDERER_TYPE.WEB_GPU:
      return new WebGPURenderer(options);
    default:
      return new CanvasRenderer(options);
  }
};
