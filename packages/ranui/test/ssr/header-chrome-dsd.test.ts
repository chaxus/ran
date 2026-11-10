import { describe, expect, it } from 'vitest';
import '@/components/select';
import '@/components/select/option';
import '@/components/theme-switch';
import '@/components/surface-switch';
import { renderHTMLToString } from '@/utils/ssr-stream';

describe('header chrome DSD labels', () => {
  it('serializes theme-switch with a closed-state selection label', async () => {
    const theme = await renderHTMLToString(`<r-theme-switch class="theme-switch" lang="en"></r-theme-switch>`);
    expect(theme).toContain('shadowrootmode="closed"');
    const selection = theme.match(/selection-item[^>]*>([^<]*)</)?.[1] ?? '';
    expect(selection.length).toBeGreaterThan(0);
    expect(theme).toMatch(/<r-option[^>]*>\s*(System|Light|Dark)/);
  });

  it('serializes language select with the selected option label', async () => {
    const lang = await renderHTMLToString(
      `<r-select class="lang-switch" value="/cn/" aria-label="Language" dropdownclass="ran-chrome-menu"><r-option value="/">English</r-option><r-option value="/cn/">简体中文</r-option></r-select>`,
    );
    expect(lang).toContain('shadowrootmode="closed"');
    expect(lang.match(/selection-item[^>]*>([^<]*)</)?.[1]).toBe('简体中文');
  });

  it('serializes surface-switch with a closed-state selection label', async () => {
    const surface = await renderHTMLToString(`<r-surface-switch class="surface-switch" lang="en"></r-surface-switch>`);
    expect(surface).toContain('shadowrootmode="closed"');
    const selection = surface.match(/selection-item[^>]*>([^<]*)</)?.[1] ?? '';
    expect(selection.length).toBeGreaterThan(0);
  });
});
