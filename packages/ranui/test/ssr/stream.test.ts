import { describe, it, expect } from 'vitest';
import { renderToStream, renderHTMLToString } from '@/utils/ssr-stream';

// Importing components registers them in the SSR registry
import '@/components/button/index';
import '@/components/progress/index';
import '@/components/theme-switch/index';

async function collect(gen: AsyncGenerator<string>): Promise<string> {
  const chunks: string[] = [];
  for await (const chunk of gen) chunks.push(chunk);
  return chunks.join('');
}

describe('renderToStream', () => {
  it('yields DSD HTML for r-button', async () => {
    const html = await collect(renderToStream('<r-button>Submit</r-button>'));
    expect(html).toContain('<template shadowrootmode="closed">');
    expect(html).toContain('ran-btn');
  });

  it('yields DSD HTML for r-progress with percent attribute', async () => {
    const html = await collect(renderToStream('<r-progress percent="65"></r-progress>'));
    expect(html).toContain('<template shadowrootmode="closed">');
    expect(html).toContain('--progress-percent:0.65');
  });

  it('passes static HTML through unchanged', async () => {
    const html = await collect(renderToStream('<div class="wrapper"><p>Hello</p></div>'));
    expect(html).toBe('<div class="wrapper"><p>Hello</p></div>');
  });

  it('handles mixed static and custom element content', async () => {
    const html = await collect(renderToStream('<h1>Title</h1><r-button>OK</r-button><p>Footer</p>'));
    expect(html).toContain('<h1>Title</h1>');
    expect(html).toContain('ran-btn');
    expect(html).toContain('<p>Footer</p>');
  });

  it('passes through unknown custom elements unchanged', async () => {
    const html = await collect(renderToStream('<unknown-element foo="bar">content</unknown-element>'));
    expect(html).toContain('<unknown-element');
    expect(html).toContain('content');
  });
});

describe('renderHTMLToString', () => {
  it('returns a complete string for r-button', async () => {
    const html = await renderHTMLToString('<r-button type="primary">Click</r-button>');
    expect(typeof html).toBe('string');
    expect(html).toContain('<template shadowrootmode="closed">');
  });

  // Regression: r-theme-switch built its shadow with raw document.createElement in
  // the constructor, throwing "document is not defined" under SSR. It now uses the
  // isSSR-aware builder, so SSR construction/serialization must not throw.
  it('renders r-theme-switch without touching document (SSR-safe)', async () => {
    const html = await renderHTMLToString('<r-theme-switch></r-theme-switch>');
    expect(typeof html).toBe('string');
    expect(html).toContain('<template shadowrootmode="closed">');
    expect(html).toContain('ran-theme-switch');
  });
});
