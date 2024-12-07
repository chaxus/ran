import { RENDERER_TYPE } from '@/utils/visual/enums';
import { CanvasRenderer } from '@/utils/visual/render/canvasRenderer';
import { WebGLRenderer } from '@/utils/visual/render/webGlRenderer';
import type { Renderer } from '@/utils/visual/render/render';
import type { IApplicationOptions } from '@/utils/visual/types';

export const getRenderer = (options: IApplicationOptions): Renderer => {
  const { prefer: renderType } = options;
  switch (renderType) {
    case RENDERER_TYPE.CANVAS:
      return new CanvasRenderer(options);
    case RENDERER_TYPE.WEB_GL:
      return new WebGLRenderer(options);
    default:
      return new CanvasRenderer(options);
  }
};
