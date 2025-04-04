import { WebGLRenderer } from './webGLRender';
import { WebGPURenderer } from './webGPURender';
import type { IApplicationOptions } from '@/src/types'
import type { Renderer } from '@/src/render/render';
import { CanvasRenderer } from '@/src/render/canvasRender';
import { RENDERER_TYPE } from '@/src/enums';

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