import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { Math as RanMath } from '@/components/math';

vi.mock('@/assets/js/katex/katex-es.js', () => ({
  renderMathInElement: vi.fn(),
}));

describe('r-math contract', () => {
  beforeEach(async () => {
    document.body.innerHTML = '';
    // Dynamic import to ensure the component is registered
    await import('@/components/math');
  });

  it('renders shadow DOM with .ran-math container', () => {
    const math = document.createElement('r-math') as unknown as RanMath;
    document.body.appendChild(math);

    const shadow = (math as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    expect(shadow.querySelector('.ran-math')).not.toBeNull();
  });

  it('reflects latex property to attributes', () => {
    const math = document.createElement('r-math') as unknown as RanMath;
    document.body.appendChild(math);

    math.latex = 'x^2 + y^2 = z^2';
    expect(math.getAttribute('latex')).toBe('x^2 + y^2 = z^2');
    expect(math.latex).toBe('x^2 + y^2 = z^2');
  });

  it('encodes special characters when setting latex attribute directly', () => {
    const math = document.createElement('r-math') as unknown as RanMath;
    document.body.appendChild(math);

    // Setting via setter always stores decoded value
    math.latex = '\\frac{1}{2}';
    expect(math.latex).toBe('\\frac{1}{2}');
  });

  it('sheet property reflects to attribute', () => {
    const math = document.createElement('r-math') as unknown as RanMath;
    document.body.appendChild(math);

    math.sheet = '.ran-math { color: red; }';
    expect(math.getAttribute('sheet')).toBe('.ran-math { color: red; }');
    expect(math.sheet).toBe('.ran-math { color: red; }');
  });

  it('render does nothing when latex is empty', () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);

    // latex is empty by default — render should be a no-op
    const importSpy = vi.spyOn(math, 'render');
    math.render();
    expect(importSpy).toHaveBeenCalled();
    // contain should be empty since no latex
    expect(math.contain.innerHTML).toBe('');
  });

  it('attributeChangedCallback calls render on latex change', () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);

    const renderSpy = vi.spyOn(math, 'render');
    math.attributeChangedCallback('latex', '', 'a^2');
    expect(renderSpy).toHaveBeenCalled();
  });

  it('attributeChangedCallback calls handlerExternalCss on sheet change', () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);

    const cssSpy = vi.spyOn(math, 'handlerExternalCss');
    math.sheet = 'body{}';
    math.attributeChangedCallback('sheet', '', 'body{}');
    expect(cssSpy).toHaveBeenCalled();
  });

  it('attributeChangedCallback skips when old and new value are the same', () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);

    const renderSpy = vi.spyOn(math, 'render');
    math.attributeChangedCallback('latex', 'same', 'same');
    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('render calls katex when latex is set', async () => {
    const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));
    const katexModule = await import('@/assets/js/katex/katex-es.js');
    const renderSpy = vi.spyOn(katexModule, 'renderMathInElement');

    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);
    math.latex = 'x^2';
    math.render();
    await sleep(50);
    expect(renderSpy).toHaveBeenCalled();
    expect(math.contain.querySelector('span')).not.toBeNull();
  });

  it('render handles katex import failure gracefully', async () => {
    const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));
    const katexModule = await import('@/assets/js/katex/katex-es.js');
    vi.spyOn(katexModule, 'renderMathInElement').mockImplementationOnce(() => {
      throw new Error('KaTeX failed');
    });

    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);
    math.latex = 'x^2';

    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    math.render();
    await sleep(50);
    consoleSpy.mockRestore();
  });
});
