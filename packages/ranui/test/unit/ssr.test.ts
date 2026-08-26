/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { Button } from '@/components/button/index';
import { renderToString } from '@/utils/ssr';
import { HTMLElementMock } from '@/utils/builder';

describe('SSR Rendering', () => {
  it('should render r-button with DSD template', () => {
    // In Vitest environment, we need to ensure isSSR logic is triggered
    // or use a component that uses the ElementBuilder/HTMLElementMock
    const btn = new Button();
    btn.setAttribute('type', 'primary');

    const html = renderToString(btn);

    // Check for standard component tag
    expect(html).toContain('<r-button');
    expect(html).toContain('type="primary"');

    // Check for DSD template
    expect(html).toContain('<template shadowrootmode="closed">');

    // Check for internal structure (class name from Builder)
    expect(html).toContain('class="ran-btn"');
    expect(html).toContain('class="ran-btn-content"');
  });
});

/**
 * The SSR mock and a real DOM have to agree, because the same template can be
 * rendered in both -- a static-site generator runs under node for the build and
 * under jsdom in its own tests, and a difference between the two shows up as
 * "the committed page and a fresh render disagree" with no obvious cause.
 */
describe('mock/DOM parity for element content', () => {
  it('lets textContent and innerHTML replace each other, last write winning', () => {
    const textThenHtml = new HTMLElementMock('div');
    textThenHtml.textContent = 'plain';
    textThenHtml.innerHTML = '<b>markup</b>';
    expect(textThenHtml.serialize()).toBe('<div><b>markup</b></div>');

    const htmlThenText = new HTMLElementMock('div');
    htmlThenText.innerHTML = '<b>markup</b>';
    htmlThenText.textContent = 'plain';
    expect(htmlThenText.serialize()).toBe('<div>plain</div>');
  });

  it('reads innerHTML back as whichever was written last', () => {
    // In a browser, `el.innerHTML = '<b/>'; el.textContent = 'a'` leaves
    // `el.innerHTML` as `a` -- the text replaced the markup, and reading it back
    // says so. A mock that kept returning the old markup would let code branch
    // one way here and the other way in a browser.
    const el = new HTMLElementMock('div');
    el.innerHTML = '<b>markup</b>';
    el.textContent = 'a';
    expect(el.innerHTML).toBe('a');

    el.innerHTML = '<i>again</i>';
    expect(el.innerHTML).toBe('<i>again</i>');
  });

  it('escapes text and leaves markup alone, matching the browser', () => {
    const text = new HTMLElementMock('div');
    text.textContent = '<b>hi</b>';
    expect(text.serialize()).toBe('<div>&lt;b&gt;hi&lt;/b&gt;</div>');

    const html = new HTMLElementMock('div');
    html.innerHTML = '<b>hi</b>';
    expect(html.serialize()).toBe('<div><b>hi</b></div>');
  });
});
