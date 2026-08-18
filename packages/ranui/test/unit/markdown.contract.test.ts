import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { Markdown } from '@/components/markdown';

// shiki is heavy and pulls WASM-free grammars lazily; stub it so the highlight path
// is exercised without downloading languages.
vi.mock('shiki', () => {
  const codeToHtml = vi.fn(
    (code: string, opts: { lang: string }) =>
      `<pre class="shiki" style="background:#fff" tabindex="0"><code><span class="line"><span style="--shiki-light:#111;--shiki-dark:#eee">${code}</span></span></code></pre>` +
      `<!--${opts.lang}-->`,
  );
  return {
    bundledLanguages: { javascript: () => Promise.resolve({}), python: () => Promise.resolve({}) },
    createJavaScriptRegexEngine: () => ({}),
    createHighlighter: async () => ({
      loadTheme: async () => undefined,
      loadLanguage: async () => undefined,
      codeToHtml,
    }),
  };
});

const mount = async (attrs: Record<string, string> = {}, content?: string): Promise<Markdown> => {
  await import('@/components/markdown');
  const el = document.createElement('r-markdown') as unknown as Markdown;
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  document.body.appendChild(el);
  if (content !== undefined) el.content = content;
  await el._pending;
  await Promise.resolve();
  return el;
};

const shadow = (el: Markdown): ShadowRoot => (el as unknown as { _shadowDom: ShadowRoot })._shadowDom;
const body = (el: Markdown): HTMLElement => shadow(el).querySelector('.ran-markdown-body') as HTMLElement;

describe('r-markdown contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM structure under ::part(markdown)', async () => {
    const el = await mount({}, '# Hello');
    expect(shadow(el).querySelector('.ran-markdown')?.getAttribute('part')).toBe('markdown');
    expect(body(el).querySelector('h1')?.textContent).toBe('Hello');
  });

  it('reads source from the content property, attribute, then text content', async () => {
    const a = await mount({ content: '**attr**' });
    expect(body(a).querySelector('strong')?.textContent).toBe('attr');

    const b = await mount({}, '**prop**');
    b.setAttribute('content', '**ignored**');
    await b._pending;
    expect(body(b).querySelector('strong')?.textContent).toBe('prop');

    await import('@/components/markdown');
    const c = document.createElement('r-markdown') as unknown as Markdown;
    c.textContent = '_text_';
    document.body.appendChild(c);
    await c._pending;
    expect(body(c).querySelector('em')?.textContent).toBe('text');
  });

  it('splits into blocks and only re-renders the changed one while streaming', async () => {
    const el = await mount({}, '# Title\n\nFirst paragraph.\n\nSecond');
    const blocks = body(el).querySelectorAll('.ran-markdown-block');
    expect(blocks.length).toBe(3);
    const firstEl = blocks[0];
    const secondEl = blocks[1];
    const spy = vi.fn();
    el.addEventListener('render', spy);
    el.content = '# Title\n\nFirst paragraph.\n\nSecond paragraph grows';
    await el._pending;
    const after = body(el).querySelectorAll('.ran-markdown-block');
    expect(after[0]).toBe(firstEl);
    expect(after[1]).toBe(secondEl);
    expect(after[2].textContent).toContain('grows');
    expect((spy.mock.calls[0][0] as CustomEvent).detail).toEqual({ blocks: 3, changed: 1 });
  });

  it('closes half-streamed markdown in streaming mode but not in static mode', async () => {
    const el = await mount({}, 'This is **bold');
    expect(body(el).querySelector('strong')?.textContent).toBe('bold');
    el.setAttribute('mode', 'static');
    await el._pending;
    expect(body(el).querySelector('strong')).toBeNull();
    expect(body(el).textContent).toContain('**bold');
  });

  it('removes trailing blocks when content shrinks and clears on empty', async () => {
    const el = await mount({}, 'a\n\nb\n\nc');
    expect(body(el).children.length).toBe(3);
    el.content = 'a';
    await el._pending;
    expect(body(el).children.length).toBe(1);
    el.content = '';
    await el._pending;
    expect(body(el).children.length).toBe(0);
  });

  it('sanitizes dangerous HTML and hardens links', async () => {
    const el = await mount(
      {},
      '<img src=x onerror="alert(1)"><script>alert(2)</script>[js](javascript:alert(3)) [ok](https://example.com) [anchor](#top)',
    );
    const html = body(el).innerHTML;
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('<script');
    const links = body(el).querySelectorAll('a');
    const js = Array.from(links).find((a) => a.textContent === 'js') as HTMLAnchorElement;
    expect(js.getAttribute('href')).toBeNull();
    const ok = Array.from(links).find((a) => a.textContent === 'ok') as HTMLAnchorElement;
    expect(ok.getAttribute('target')).toBe('_blank');
    expect(ok.getAttribute('rel')).toBe('noopener noreferrer');
    const anchor = Array.from(links).find((a) => a.textContent === 'anchor') as HTMLAnchorElement;
    expect(anchor.getAttribute('target')).toBeNull();
  });

  it('marks a half-streamed link as incomplete plain text', async () => {
    const el = await mount({}, 'See [the docs](https://exa');
    const a = body(el).querySelector('a') as HTMLAnchorElement;
    expect(a.getAttribute('href')).toBeNull();
    expect(a.hasAttribute('data-incomplete')).toBe(true);
    expect(a.textContent).toBe('the docs');
  });

  it('wraps code blocks with a header and opt-in copy/download buttons', async () => {
    const plain = await mount({}, '```js\nconst a = 1;\n```');
    const container = body(plain).querySelector('.ran-md-code') as HTMLElement;
    expect(container.getAttribute('part')).toBe('code');
    expect(container.dataset.language).toBe('js');
    expect(container.querySelector('.ran-md-code-lang')?.textContent).toBe('js');
    expect(container.querySelector('[data-md-action]')).toBeNull();
    expect(container.querySelectorAll('pre .line').length).toBe(1);

    const withControls = await mount({ copy: '', download: '', 'line-numbers': '' }, '```js\nconst a = 1;\n```');
    const c2 = body(withControls).querySelector('.ran-md-code') as HTMLElement;
    expect(c2.querySelector('[data-md-action="copy"]')?.getAttribute('aria-label')).toBe('Copy code');
    expect(c2.querySelector('[data-md-action="download"]')).not.toBeNull();
    expect(c2.hasAttribute('data-line-numbers')).toBe(true);
  });

  it('copies code text to the clipboard and emits `copied`', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const el = await mount({ copy: '', 'label-copy': '复制' }, '```py\nprint(1)\n```');
    const btn = body(el).querySelector('[data-md-action="copy"]') as HTMLElement;
    expect(btn.getAttribute('aria-label')).toBe('复制');
    const copied = vi.fn();
    el.addEventListener('copied', copied);
    btn.click();
    await Promise.resolve();
    await Promise.resolve();
    expect(writeText).toHaveBeenCalledWith('print(1)');
    expect((copied.mock.calls[0][0] as CustomEvent).detail).toMatchObject({ kind: 'code', language: 'py' });
    expect(btn.querySelector('r-icon')?.getAttribute('name')).toBe('check');
  });

  it('marks the last block incomplete while its fence is open and hides the caret there', async () => {
    const el = await mount({ caret: '' }, 'Intro\n\n```js\nconst a');
    const blocks = body(el).querySelectorAll('.ran-markdown-block');
    expect(blocks[1].hasAttribute('data-no-caret')).toBe(true);
    expect(blocks[1].querySelector('.ran-md-code')?.hasAttribute('data-incomplete')).toBe(true);
    expect(blocks[0].hasAttribute('data-no-caret')).toBe(false);
    el.content = 'Intro\n\n```js\nconst a = 1;\n```';
    await el._pending;
    expect(body(el).querySelector('.ran-md-code')?.hasAttribute('data-incomplete')).toBe(false);
  });

  it('turns closed ```mermaid fences into <r-mermaid> and math into <r-math>', async () => {
    const el = await mount({}, '```mermaid\ngraph TD; A-->B\n```\n\n$$\nE = mc^2\n$$\n\nInline \\(x^2\\) here.');
    const mermaid = body(el).querySelector('r-mermaid') as HTMLElement;
    expect(mermaid).not.toBeNull();
    expect(decodeURIComponent(mermaid.getAttribute('code') || '')).toBe('graph TD; A-->B');
    const maths = body(el).querySelectorAll('r-math');
    expect(maths.length).toBe(2);
    expect(decodeURIComponent(maths[0].getAttribute('latex') || '')).toBe('E = mc^2');
    expect(maths[0].getAttribute('display')).toBe('block');
    expect(decodeURIComponent(maths[1].getAttribute('latex') || '')).toBe('x^2');
    expect(maths[1].getAttribute('display')).toBe('inline');
  });

  it('keeps an open ```mermaid fence as a plain code block until it closes', async () => {
    const el = await mount({}, '```mermaid\ngraph TD; A-->');
    expect(body(el).querySelector('r-mermaid')).toBeNull();
    expect(body(el).querySelector('.ran-md-code')?.getAttribute('data-language')).toBe('mermaid');
  });

  it('treats $…$ as inline math only with `inline-math`', async () => {
    const off = await mount({}, 'Costs $5 and $x$ here');
    expect(body(off).querySelector('r-math')).toBeNull();
    const on = await mount({ 'inline-math': '' }, 'Costs $5 and $x$ here');
    expect(body(on).querySelectorAll('r-math').length).toBe(1);
  });

  it('wraps tables in a scroll container', async () => {
    const el = await mount({}, '| a | b |\n|---|---|\n| 1 | 2 |');
    const wrap = body(el).querySelector('.ran-md-table-wrap') as HTMLElement;
    expect(wrap.getAttribute('part')).toBe('table');
    expect(wrap.querySelector('table')).not.toBeNull();
    expect(body(el).querySelector('.ran-markdown-block')?.hasAttribute('data-no-caret')).toBe(true);
  });

  it('applies shiki highlighting when `highlight` is set (dual-theme spans)', async () => {
    const el = await mount({ highlight: '' }, '```javascript\nlet x\n```');
    // The highlighter loads asynchronously the first time and swaps the <pre> in when it
    // lands, with no promise to await — a fixed sleep is a coin flip on a loaded CI runner,
    // which is exactly how this test failed on one matrix leg and passed on the other three.
    const pre = await vi.waitFor(
      () => {
        // Asserted on the *only* `pre` in the body, so this still proves the plain block was
        // replaced rather than a highlighted one appended alongside it.
        const found = body(el).querySelector('pre') as HTMLElement | null;
        expect(found?.classList.contains('shiki')).toBe(true);
        return found as HTMLElement;
      },
      { timeout: 5000, interval: 10 },
    );
    expect(pre.classList.contains('ran-md-pre')).toBe(true);
    expect(pre.getAttribute('style')).toBeNull();
    expect(pre.innerHTML).toContain('--shiki-dark');
  });

  it('rethemes embedded renderers through the references enhance() handed back', async () => {
    const el = await mount({ theme: 'light' }, '```mermaid\ngraph TD; A-->B\n```');
    const diagram = body(el).querySelector('r-mermaid') as HTMLElement;
    expect(diagram.getAttribute('theme')).toBe('light');
    el.setAttribute('theme', 'dark');
    expect(diagram.getAttribute('theme')).toBe('dark');
    // The element the component retheming touched is the one still in the DOM.
    expect(body(el).querySelector('r-mermaid')).toBe(diagram);
  });

  it('follows the document theme with theme=auto', async () => {
    document.documentElement.classList.remove('dark');
    const el = await mount({}, 'x');
    const wrap = shadow(el).querySelector('.ran-markdown') as HTMLElement;
    expect(wrap.classList.contains('is-system')).toBe(true);
    document.documentElement.classList.add('dark');
    await new Promise((r) => setTimeout(r, 0));
    expect(wrap.classList.contains('is-dark')).toBe(true);
    document.documentElement.classList.remove('dark');
    el.setAttribute('theme', 'dark');
    expect(wrap.classList.contains('is-dark')).toBe(true);
    expect((el as unknown as { _themeObserver?: unknown })._themeObserver).toBeUndefined();
  });

  it('property accessors reflect to attributes', async () => {
    const el = await mount({});
    el.copyable = true;
    el.lineNumbers = true;
    el.mode = 'static';
    el.linkTarget = '_self';
    el.highlight = 'vitesse-light vitesse-dark';
    expect(el.hasAttribute('copy')).toBe(true);
    expect(el.hasAttribute('line-numbers')).toBe(true);
    expect(el.getAttribute('mode')).toBe('static');
    expect(el.linkTarget).toBe('_self');
    expect(el.getAttribute('highlight')).toBe('vitesse-light vitesse-dark');
    el.copyable = false;
    expect(el.hasAttribute('copy')).toBe(false);
  });

  it('skips attributeChangedCallback when old === new', async () => {
    const el = await mount({}, 'x');
    const spy = vi.spyOn(el, 'render');
    el.attributeChangedCallback('content', 'same', 'same');
    expect(spy).not.toHaveBeenCalled();
  });

  it('injects external CSS via sheet attribute (fallback path)', async () => {
    const origCSS = window.CSSStyleSheet;
    try {
      class MockSheet {
        replaceSync(): void {
          throw new Error('force fallback');
        }
      }
      (window as unknown as { CSSStyleSheet: unknown }).CSSStyleSheet = MockSheet;
      const el = await mount({});
      el.setAttribute('sheet', '.ran-markdown { color: red; }');
      expect(shadow(el).innerHTML).toContain('.ran-markdown { color: red; }');
    } finally {
      window.CSSStyleSheet = origCSS;
    }
  });

  // ── Structure comes from the parser, not from matching the text ──────────────
  // Each of these was decided by a pattern before and got the wrong answer.

  it('keeps an HTML block wrapping markdown as one block', async () => {
    const el = await mount({}, '<div class="box">\n\n**bold**\n\n</div>\n\nAfter.');
    const blocks = body(el).querySelectorAll('.ran-markdown-block');
    expect(blocks.length).toBe(2);
    expect(blocks[0].querySelector('div.box strong')?.textContent).toBe('bold');
    expect(blocks[1].textContent).toContain('After.');
  });

  it('does not treat a tag inside an HTML comment as an open tag', async () => {
    const el = await mount({}, '<!-- <div> -->\n\nSecond.\n\nThird.');
    // Counting `<div>` occurrences saw one unclosed tag here and swallowed the rest
    // of the document into a single block.
    expect(body(el).querySelectorAll('.ran-markdown-block').length).toBe(3);
  });

  it('does not let a closing tag inside a code fence end an HTML block early', async () => {
    const el = await mount({}, '<div class="box">\n\n```html\n</div>\n```\n\nstill inside\n\n</div>\n\nAfter.');
    const blocks = body(el).querySelectorAll('.ran-markdown-block');
    expect(blocks.length).toBe(2);
    expect(blocks[0].querySelector('.ran-md-code')).not.toBeNull();
    expect(blocks[0].textContent).toContain('still inside');
    expect(blocks[1].textContent).toContain('After.');
  });

  it('resolves a reference link whose definition is in another block', async () => {
    const el = await mount({}, 'See [the docs][d] here.\n\n[d]: https://example.com\n');
    const a = body(el).querySelector('a') as HTMLAnchorElement;
    expect(a?.getAttribute('href')).toBe('https://example.com');
    // The definition renders to nothing and must not leave an empty block behind.
    expect(body(el).querySelectorAll('.ran-markdown-block').length).toBe(1);
  });

  it('re-renders a block when a link definition it depends on arrives', async () => {
    const el = await mount({}, 'See [the docs][d] here.\n\n[d]: https://exa');
    expect((body(el).querySelector('a') as HTMLAnchorElement)?.getAttribute('href')).toBe('https://exa');
    el.content = 'See [the docs][d] here.\n\n[d]: https://example.com';
    await el._pending;
    expect((body(el).querySelector('a') as HTMLAnchorElement)?.getAttribute('href')).toBe('https://example.com');
  });

  it('keeps block math containing a lone "=" line in one block', async () => {
    const el = await mount({}, '$$\nx\n=\ny\n$$');
    // marked reads the `=` line as a setext underline; the math extension owns the whole
    // span instead, so no `$$`-counting pass is needed to glue it back together.
    expect(body(el).querySelectorAll('.ran-markdown-block').length).toBe(1);
    expect(body(el).querySelectorAll('r-math').length).toBe(1);
    expect(decodeURIComponent(body(el).querySelector('r-math')?.getAttribute('latex') || '')).toBe('x\n=\ny');
  });

  it('requires block math to own its line, and rejects an empty span', async () => {
    const trailing = await mount({}, '$$x$$ trailing');
    expect(body(trailing).querySelector('r-math')).toBeNull();
    expect(body(trailing).textContent).toContain('trailing');
    const empty = await mount({}, '$$$$');
    expect(body(empty).querySelector('r-math')).toBeNull();
  });

  it('has no length ceiling on a math span', async () => {
    const long = 'a'.repeat(12000);
    const el = await mount({}, `$$\n${long}\n$$`);
    expect(decodeURIComponent(body(el).querySelector('r-math')?.getAttribute('latex') || '')).toBe(long);
  });

  it('does not collapse the document when footnote-like text appears', async () => {
    const el = await mount({}, 'A regex like [^abc] here.\n\nSecond.\n\nThird.');
    expect(body(el).querySelectorAll('.ran-markdown-block').length).toBe(3);
  });

  it('cleans up observers and listeners on disconnect', async () => {
    const el = await mount({}, 'x');
    const priv = el as unknown as { _themeObserver?: MutationObserver; _lightDomObserver?: MutationObserver };
    expect(priv._themeObserver).toBeDefined();
    expect(priv._lightDomObserver).toBeDefined();
    el.remove();
    expect(priv._themeObserver).toBeUndefined();
    expect(priv._lightDomObserver).toBeUndefined();
  });
});
