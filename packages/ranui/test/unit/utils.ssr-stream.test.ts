import { describe, expect, it, vi } from 'vitest';

class SSRMockElement {
  attrs: Record<string, string> = {};
  innerHTML = '';
  tagName = 'r-known';

  setAttribute(name: string, value: string): void {
    this.attrs[name] = value;
  }
}

vi.mock('@/utils/ssr-registry', () => ({
  getSSRConstructor: (tagName: string) => (tagName === 'r-known' ? SSRMockElement : undefined),
}));

vi.mock('@/utils/ssr', () => ({
  renderToString: (el: SSRMockElement) => {
    const attrs = Object.entries(el.attrs)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');
    return `<rendered tag="${el.tagName}" attrs="${attrs}">${el.innerHTML}</rendered>`;
  },
}));

const { renderHTMLToString, renderToStream } = await import('@/utils/ssr-stream');

async function collect(gen: AsyncGenerator<string>): Promise<string> {
  const chunks: string[] = [];
  for await (const chunk of gen) chunks.push(chunk);
  return chunks.join('');
}

describe('utils/ssr-stream', () => {
  it('passes static HTML through unchanged', async () => {
    await expect(collect(renderToStream('<section><p>Hello</p></section>'))).resolves.toBe(
      '<section><p>Hello</p></section>',
    );
  });

  it('renders registered custom elements through renderToString', async () => {
    const html = await renderHTMLToString('<r-known type="primary">Submit</r-known>');

    expect(html).toBe('<rendered tag="r-known" attrs="type=primary">Submit</rendered>');
  });

  it('recursively renders registered custom element children', async () => {
    const html = await renderHTMLToString('<r-known><r-known percent="65"></r-known></r-known>');

    expect(html).toBe(
      '<rendered tag="r-known" attrs=""><rendered tag="r-known" attrs="percent=65"></rendered></rendered>',
    );
  });

  it('passes unknown custom elements through with boolean and quoted attributes', async () => {
    const html = await renderHTMLToString(`<unknown-element enabled foo="bar" single='quote'>content</unknown-element>`);

    expect(html).toBe('<unknown-element enabled foo="bar" single="quote">content</unknown-element>');
  });

  it('leaves malformed custom elements as static content', async () => {
    await expect(renderHTMLToString('<unknown-element foo="bar">content')).resolves.toBe(
      '<unknown-element foo="bar">content',
    );
  });
});
