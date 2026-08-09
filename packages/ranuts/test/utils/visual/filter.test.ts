import { describe, expect, it } from 'vitest';
import { ColorAdjustFilter, Filter } from '@/utils/visual/render/filter';

// The WebGL program is compiled lazily inside apply(), so these construction/uniform
// assertions run without a GL context (Node/vitest). The rendering path is browser-verified.
describe('visual Filter', () => {
  it('base Filter starts with the given uniforms and no program', () => {
    const f = new Filter(undefined, { u_amount: 0.5 });
    expect(f.uniforms.u_amount).toBe(0.5);
  });

  it('ColorAdjustFilter defaults to an identity grade', () => {
    const f = new ColorAdjustFilter();
    expect(f.uniforms.u_brightness).toBe(0);
    expect(f.uniforms.u_contrast).toBe(1);
    expect(f.uniforms.u_saturation).toBe(1);
  });

  it('ColorAdjustFilter takes options and exposes live setters', () => {
    const f = new ColorAdjustFilter({ brightness: 0.1, contrast: 1.2, saturation: 1.4 });
    expect(f.uniforms.u_brightness).toBe(0.1);
    expect(f.uniforms.u_contrast).toBe(1.2);
    expect(f.uniforms.u_saturation).toBe(1.4);
    f.saturation = 0;
    expect(f.uniforms.u_saturation).toBe(0);
  });
});
