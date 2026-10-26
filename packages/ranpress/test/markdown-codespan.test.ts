import { describe, expect, it } from 'vitest';
import { createMarkdown } from '../src/markdown.ts';

describe('inline code', () => {
  const md = createMarkdown({ origin: 'https://example.com' });
  // No fence in the source, so the highlighter `init()` loads is never needed.
  const html = (source: string): string => md.render(source).html;

  it('marks one identifier so a site can keep it on one line', () => {
    expect(html('Set `disable-error-modal` here.')).toContain('<code class="code-word">disable-error-modal</code>');
  });

  it('leaves code with spaces unmarked, so it can still wrap', () => {
    expect(html('Call `(name: string) => void` once.')).toContain('<code>(name: string) =&gt; void</code>');
  });

  it('escapes the code either way', () => {
    expect(html('Use `<r-select>`.')).toContain('<code class="code-word">&lt;r-select&gt;</code>');
  });
});
