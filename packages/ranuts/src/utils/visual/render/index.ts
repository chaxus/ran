import type { Renderer } from '@/utils/visual/render/render';
import { RendererType } from '@/utils/visual/enums';
import type { IApplicationOptions } from '@/utils/visual/types';
import { CanvasRenderer } from '@/utils/visual/render/canvasRenderer';
import { WebGlRenderer } from '@/utils/visual/render/webGlRenderer';

export const getRenderer = (options: IApplicationOptions): Renderer => {
  const { rendererType: renderType } = options;
  switch (renderType) {
    case RendererType.Canvas:
      return new CanvasRenderer(options);
    case RendererType.WebGl:
      return new WebGlRenderer(options);
    default:
      return new CanvasRenderer(options);
  }
};
