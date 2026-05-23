import { describe, it, expect } from 'vitest';

// Import the component — in Node.js environment isSSR=true so it extends HTMLElementMock
// and registers via defineSSR instead of customElements.define.
import { Progress } from '@/components/progress/index';

describe('r-progress SSR CSS-variable output', () => {
  it('serializes with --progress-percent set from the percent attribute', () => {
    const el = new Progress();
    el.setAttribute('percent', '65');
    const html = (el as any).serialize('r-progress');
    expect(html).toContain('--progress-percent:0.65');
  });

  it('defaults to 0 when percent attribute is absent', () => {
    const el = new Progress();
    const html = (el as any).serialize('r-progress');
    expect(html).toContain('--progress-percent:0');
  });

  it('clamps to 1 when percent exceeds total', () => {
    const el = new Progress();
    el.setAttribute('percent', '200');
    el.setAttribute('total', '100');
    const html = (el as any).serialize('r-progress');
    expect(html).toContain('--progress-percent:1');
  });

  it('output does NOT contain offsetWidth-dependent translateX', () => {
    const el = new Progress();
    el.setAttribute('percent', '50');
    const html = (el as any).serialize('r-progress');
    // Old implementation wrote translateX(Xpx) via JS; new approach is pure CSS var
    expect(html).not.toMatch(/translateX\(\d+px\)/);
  });

  it('serializes shadow DOM with DSD template', () => {
    const el = new Progress();
    const html = (el as any).serialize('r-progress');
    expect(html).toContain('<template shadowrootmode="closed">');
  });
});
