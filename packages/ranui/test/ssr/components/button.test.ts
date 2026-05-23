import { describe, it, expect } from 'vitest';
import { Button } from '@/components/button/index';
import { getSSRConstructor } from '@/utils/ssr-registry';

describe('r-button SSR', () => {
  it('is registered in the SSR registry after import', () => {
    expect(getSSRConstructor('r-button')).toBe(Button);
  });

  it('serializes to valid DSD HTML', () => {
    const el = new Button();
    const html = (el as any).serialize('r-button');
    expect(html).toContain('<template shadowrootmode="closed">');
    expect(html).toContain('ran-btn');
  });

  it('wraps output in the correct host tag', () => {
    const el = new Button();
    const html = (el as any).serialize('r-button');
    expect(html).toMatch(/^<r-button/);
    expect(html).toMatch(/<\/r-button>$/);
  });

  it('reflects disabled attribute in DSD output', () => {
    const el = new Button();
    el.setAttribute('disabled', '');
    const html = (el as any).serialize('r-button');
    expect(html).toContain('disabled');
  });
});
