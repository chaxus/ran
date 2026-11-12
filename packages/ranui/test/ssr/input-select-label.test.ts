import { describe, it, expect } from 'vitest';
import { renderHTMLToString } from '@/utils/ssr-stream';
import '@/components/input/index';
import '@/components/select/index';

describe('input/select DSD captions', () => {
  it('paints r-input label and placeholder into DSD', async () => {
    const html = await renderHTMLToString(
      `<r-input label="Work email" placeholder="ada@company.com" type="email"></r-input>`,
    );
    const withoutStyle = html.replace(/<style>[\s\S]*?<\/style>/g, '');
    expect(withoutStyle).toContain('class="ran-input-label"');
    expect(withoutStyle).toMatch(/ran-input-content[^>]*placeholder="ada@company.com"/);
  });

  it('paints r-select field label into DSD', async () => {
    const html = await renderHTMLToString(
      `<r-select label="Role" value="editor"><r-option value="editor">Editor</r-option></r-select>`,
    );
    const withoutStyle = html.replace(/<style>[\s\S]*?<\/style>/g, '');
    expect(withoutStyle).toContain('class="ran-select-label"');
    expect(withoutStyle).toContain('>Role<');
  });
});
