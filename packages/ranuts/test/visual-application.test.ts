// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { Application } from '@/utils/visual/application';
import { getRenderer } from '@/utils/visual/render';
import { CanvasRenderer } from '@/utils/visual/render/canvasRenderer';
import { Container } from '@/utils/visual/vertex/container';
import { RENDERER_TYPE } from '@/utils/visual/enums';

describe('visual/getRenderer', () => {
  it('defaults to the Canvas2D renderer', () => {
    const view = document.createElement('canvas');
    expect(getRenderer({ view })).toBeInstanceOf(CanvasRenderer);
    expect(getRenderer({ view, prefer: RENDERER_TYPE.CANVAS })).toBeInstanceOf(CanvasRenderer);
  });
});

describe('visual/Application.create', () => {
  it('awaits renderer init and returns a ready app with a stage', async () => {
    const view = document.createElement('canvas');
    view.width = 100;
    view.height = 100;

    const app = await Application.create({ view, prefer: RENDERER_TYPE.CANVAS });

    expect(app).toBeInstanceOf(Application);
    expect(app.stage).toBeInstanceOf(Container);
    expect(app.view).toBe(view);
  });
});
