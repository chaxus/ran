import { describe, expect, it } from 'vitest';
import { renderHTMLToString } from '@/utils/ssr-stream';
import { registerBuiltinIcons } from '@/components/icon/builtin';
import '@/components/button';
import '@/components/icon';

describe('r-button icon Declarative Shadow DOM', () => {
  it('paints the builtin SVG into closed DSD when builtins are registered', async () => {
    registerBuiltinIcons();
    const html = await renderHTMLToString(`<r-button type="default" icon="user">Default Button</r-button>`);
    expect(html).toContain('data-ran-dsd');
    expect(html).toContain('shadowrootmode="closed"');
    expect(html).toMatch(/<r-icon[^>]*name="user"/);
    expect(html).toContain('data-name="user"');
    expect(html).toMatch(/<svg[^>]*data-name="user"/);
    // Light-DOM label stays outside the shadow.
    expect(html).toContain('>Default Button</r-button>');
  });

  it('leaves icon-less buttons without an r-icon host', async () => {
    const html = await renderHTMLToString(`<r-button type="primary">Go</r-button>`);
    expect(html).not.toContain('r-icon');
  });
});
