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
    // Closed DSD must carry component CSS — bare structure paints then pops on upgrade.
    expect(out).toMatch(/<template shadowrootmode="closed"><style>/);
    // FOUC plates skip stamped DSD hosts so host padding does not stack on the shadow.
    expect(out).toMatch(/<r-menubar[^>]*data-ran-dsd/);
  });

  it('expands home invite example fields to Declarative Shadow DOM', async () => {
    const html =
      `<div class="example" data-home-example>` +
      `<r-input class="example__field" name="email" type="email" label="Work email" placeholder="ada@company.com"></r-input>` +
      `<r-select class="example__field" name="role" label="Role" value="editor"><r-option value="editor">Editor</r-option></r-select>` +
      `<r-checkbox class="example__simulate" name="simulate">Simulate</r-checkbox>` +
      `<r-button class="example__submit" type="primary">Send invite</r-button>` +
      `</div>`;
    const out = await ssrHeaderChrome(html);
    expect(out).toContain('shadowrootmode="closed"');
    expect(out).toMatch(/r-input[\s\S]*shadowrootmode="closed"[\s\S]*ran-input/);
    expect(out).toMatch(/r-button[\s\S]*shadowrootmode="closed"[\s\S]*ran-btn/);
    expect(out).toMatch(/<template shadowrootmode="closed"><style>/);
    expect(out).toMatch(/<r-button[^>]*data-ran-dsd/);
    expect(out).toMatch(/<r-input[^>]*data-ran-dsd/);
    // Captions + placeholder must be in the DSD first paint (not only after upgrade).
    // Strip <style> so class names in CSS do not false-match.
    const body = out.replace(/<style>[\s\S]*?<\/style>/g, '');
    expect(body).toContain('class="ran-input-label"');
    expect(body).toMatch(/ran-input-label[^>]*>Work email</);
    expect(body).toMatch(/ran-input-content[^>]*placeholder="ada@company.com"/);
    expect(body).toContain('class="ran-select-label"');
    expect(body).toMatch(/ran-select-label[^>]*>Role</);
  });

  it('leaves pages without header-utils unchanged', async () => {
    const html = '<main><p>no chrome</p></main>';
    expect(await ssrHeaderChrome(html)).toBe(html);
  });
});
