/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { Button } from '../components/button/index';
import { renderToString } from '../utils/ssr';

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
