import { describe, expect, it } from 'vitest';
import { ssrHeaderChrome } from '../build/ssr-chrome.ts';

describe('ssrHeaderChrome', () => {
  it('expands header-utils menubar to Declarative Shadow DOM', async () => {
    const html = `<header><r-menubar class="header-utils" lang="en"><r-select class="lang-switch" value="/" aria-label="Language" dropdownclass="ran-chrome-menu" trigger="hover click"><r-option value="/">English</r-option></r-select><r-theme-switch class="theme-switch" lang="en" trigger="hover click"></r-theme-switch><r-surface-switch class="surface-switch" lang="en" trigger="hover click"></r-surface-switch></r-menubar></header>`;
    const out = await ssrHeaderChrome(html);
    expect(out).toContain('shadowrootmode="closed"');
    expect(out).toContain('ran-menubar');
    expect(out).toContain('selection-item');
    expect(out).toContain('class="header-utils"');
  });

  it('leaves pages without header-utils unchanged', async () => {
    const html = '<main><p>no chrome</p></main>';
    expect(await ssrHeaderChrome(html)).toBe(html);
  });
});
