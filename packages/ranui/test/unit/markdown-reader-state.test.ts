import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@/components/markdown';
import type { Markdown } from '@/components/markdown';
import * as highlighting from '@/components/markdown/highlight';
import { hasReaderSelection } from '@/components/markdown/reader';

async function mount(source: string, attributes: Record<string, string> = {}): Promise<Markdown> {
  const element = document.createElement('r-markdown') as Markdown;
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  document.body.append(element);
  element.content = source;
  await element._pending;
  return element;
}
const root = (element: Markdown) => element._shadowDom;
const copies = (element: Markdown) => [...root(element).querySelectorAll<HTMLButtonElement>('[data-md-action="copy"]')];
const clipboard = (writeText: (text: string) => Promise<void>) =>
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

beforeEach(() => document.body.replaceChildren());
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
  document.getSelection()?.removeAllRanges();
  vi.useRealTimers();
});

describe('Markdown code copy lifetime', () => {
  it('copies tabs, blank lines and the final source newline exactly', async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    clipboard(write);
    const raw = '\tfirst\n\nlast\n';
    const element = await mount('```text\n' + raw + '```', { copy: '' });
    copies(element)[0].click();
    await flush();
    expect(write).toHaveBeenCalledWith(raw);
  });

  it('does not trust source metadata supplied by raw HTML', async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    clipboard(write);
    const element = await mount('<pre data-ran-code-source="&quot;forged&quot;"><code>visible source</code></pre>', {
      copy: '',
    });
    copies(element)[0].click();
    await flush();
    expect(write).toHaveBeenCalledWith('visible source');
    expect(root(element).querySelector('[data-ran-code-source]')).toBeNull();
  });

  it('keeps the pending Copy target focusable and suppresses duplicate writes', async () => {
    let resolve!: () => void;
    const write = vi.fn(
      () =>
        new Promise<void>((yes) => {
          resolve = yes;
        }),
    );
    clipboard(write);
    const element = await mount('```text\nfirst\n```', { copy: '' });
    const button = copies(element)[0];
    button.focus();
    button.click();
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-busy')).toBe('true');
    button.click();
    expect(write).toHaveBeenCalledOnce();
    resolve();
    await flush();
    expect(button.hasAttribute('aria-busy')).toBe(false);
    expect(root(element).activeElement).toBe(button);
  });

  it('does not mark a replacement source copied when a copied listener updates it', async () => {
    clipboard(() => Promise.resolve());
    const element = await mount('```text\nfirst', { copy: '' });
    element.addEventListener('copied', () => {
      element.content += ' changed';
    });
    copies(element)[0].click();
    await flush();
    expect(copies(element)[0].querySelector('r-icon')?.getAttribute('name')).toBe('copy');
  });

  it('keeps concurrent code feedback and reset timers independent', async () => {
    clipboard(() => Promise.resolve());
    const element = await mount('```js\nfirst\n```\n\n```js\nsecond\n```', { copy: '' });
    vi.useFakeTimers();
    const [first, second] = copies(element);
    first.click();
    await flush();
    second.click();
    await flush();
    expect(first.querySelector('r-icon')?.getAttribute('name')).toBe('check');
    expect(second.querySelector('r-icon')?.getAttribute('name')).toBe('check');
    vi.advanceTimersByTime(1300);
    expect(first.querySelector('r-icon')?.getAttribute('name')).toBe('copy');
    expect(second.querySelector('r-icon')?.getAttribute('name')).toBe('copy');
  });

  it('shows an overridable local failure and permits a truthful retry', async () => {
    const write = vi.fn().mockRejectedValueOnce(new Error('private clipboard diagnostic')).mockResolvedValue(undefined);
    clipboard(write);
    const element = await mount('```js\nfirst\n```', { copy: '', 'label-copy-error': 'Copy failed. Try again.' });
    const copied = vi.fn();
    element.addEventListener('copied', copied);
    const button = copies(element)[0];
    button.click();
    await flush();
    const code = button.closest('[part="code"]')!;
    expect(code.textContent).toContain('Copy failed. Try again.');
    expect(code.textContent).not.toContain('private clipboard diagnostic');
    expect(button.disabled).toBe(false);
    expect(copied).not.toHaveBeenCalled();
    element.setAttribute('label-copy-error', 'Retry copying');
    expect(copies(element)[0]).toBe(button);
    expect(code.textContent).toContain('Retry copying');
    button.click();
    await flush();
    expect(copied).toHaveBeenCalledOnce();
    expect(code.textContent).not.toContain('Retry copying');
  });

  it.each(['resolve', 'reject'] as const)('ignores delayed %s for a changed code source', async (outcome) => {
    let resolve!: () => void;
    let reject!: (error: Error) => void;
    clipboard(
      () =>
        new Promise<void>((yes, no) => {
          resolve = yes;
          reject = no;
        }),
    );
    const element = await mount('```text\nfirst', { copy: '', 'label-copy-error': 'Copy failed' });
    const copied = vi.fn();
    element.addEventListener('copied', copied);
    copies(element)[0].click();
    element.content += ' changed';
    await element._pending;
    if (outcome === 'resolve') resolve();
    else reject(new Error('private diagnostic'));
    await flush();
    expect(copied).not.toHaveBeenCalled();
    expect(copies(element)[0].disabled).toBe(false);
    expect(copies(element)[0].querySelector('r-icon')?.getAttribute('name')).toBe('copy');
    expect(root(element).textContent).not.toContain('Copy failed');
  });

  it('does not publish late copy success after disconnect or reuse it after reconnect', async () => {
    let resolve!: () => void;
    clipboard(
      () =>
        new Promise<void>((yes) => {
          resolve = yes;
        }),
    );
    const element = await mount('```text\nfirst\n```', { copy: '' });
    const copied = vi.fn();
    element.addEventListener('copied', copied);
    copies(element)[0].click();
    element.remove();
    document.body.append(element);
    resolve();
    await flush();
    expect(copied).not.toHaveBeenCalled();
    expect(copies(element)[0].disabled).toBe(false);
    expect(copies(element)[0].querySelector('r-icon')?.getAttribute('name')).toBe('copy');
  });
});

describe('Markdown reader state', () => {
  it('recognizes scoped composed selection when a closed root retargets document selection as collapsed', async () => {
    const element = await mount('```text\nselected source\n```');
    const code = root(element).querySelector('code')!;
    const text = code.querySelector('.line')!.firstChild!;
    const getComposedRanges = vi
      .fn()
      .mockReturnValue([{ startContainer: text, startOffset: 0, endContainer: text, endOffset: 8 }]);
    vi.spyOn(document, 'getSelection').mockReturnValue({
      isCollapsed: true,
      anchorNode: document.body,
      focusNode: document.body,
      rangeCount: 1,
      getComposedRanges,
    } as unknown as Selection);
    expect(hasReaderSelection(code)).toBe(true);
    expect(getComposedRanges).toHaveBeenCalledWith({ shadowRoots: [root(element)] });
    getComposedRanges.mockReturnValue([{ startContainer: text, startOffset: 8, endContainer: text, endOffset: 8 }]);
    expect(hasReaderSelection(code)).toBe(false);
  });

  it('retains code viewport, unchanged prefix text and selection while an open fence grows', async () => {
    const element = await mount('```text\nselectable prefix');
    const pre = root(element).querySelector('pre')!;
    const code = pre.querySelector('code')!;
    const prefix = code.querySelector('.line')!.firstChild!;
    const range = document.createRange();
    range.setStart(prefix, 0);
    range.setEnd(prefix, 10);
    document.getSelection()!.addRange(range);
    pre.scrollLeft = 120;
    element.content += ' grows\nnew line';
    await element._pending;
    expect(root(element).querySelector('pre')).toBe(pre);
    expect(pre.querySelector('code')).toBe(code);
    expect(code.querySelector('.line')!.firstChild).toBe(prefix);
    expect(pre.scrollLeft).toBe(120);
    expect(range.startContainer).toBe(prefix);
    expect(range.toString()).toBe('selectable');
    expect(code.textContent).toBe('selectable prefix grows\nnew line');
  });

  it('retains table viewport, table and existing cell nodes as rows stream', async () => {
    const element = await mount('| Name | Count |\n| --- | ---: |\n| first | 1 |');
    const wrap = root(element).querySelector<HTMLElement>('[part="table"]')!;
    const table = wrap.querySelector('table')!;
    const first = table.querySelector('td')!;
    wrap.scrollLeft = 150;
    element.content += '\n| second | 2 |';
    await element._pending;
    expect(root(element).querySelector('[part="table"]')).toBe(wrap);
    expect(wrap.querySelector('table')).toBe(table);
    expect(table.querySelector('td')).toBe(first);
    expect(wrap.scrollLeft).toBe(150);
    expect(table.querySelectorAll('tbody tr')).toHaveLength(2);
  });

  it('retains table enhancements and existing math nodes while new linked formula rows stream', async () => {
    const element = await mount('| Link | Formula |\n| --- | --- |\n| [Example](https://example.test) | $x^2$ |', {
      'inline-math': '',
      'link-target': '_blank',
    });
    const wrap = root(element).querySelector<HTMLElement>('[part="table"]')!;
    const table = wrap.querySelector('table')!;
    const cell = table.querySelector('td')!;
    const math = table.querySelector('r-math')!;
    expect(math).not.toBeNull();
    element.content += '\n| [New](https://new.example.test) | $y^2$ |';
    await element._pending;
    expect(root(element).querySelector('[part="table"]')).toBe(wrap);
    expect(wrap.querySelector('table')).toBe(table);
    expect(table.querySelector('td')).toBe(cell);
    expect(table.querySelector('r-math')).toBe(math);
    expect(table.querySelectorAll('r-math')).toHaveLength(2);
    expect(table.querySelector('[data-ran-math]')).toBeNull();
    for (const link of table.querySelectorAll('a')) {
      expect(link.target).toBe('_blank');
      expect(link.rel).toBe('noopener noreferrer');
    }
  });

  it('defers asynchronous highlighting while selecting and settles after reader release without replacing PRE or CODE', async () => {
    let highlight!: (html: string) => void;
    vi.spyOn(highlighting, 'highlight').mockReturnValue(
      new Promise<string>((resolve) => {
        highlight = resolve;
      }),
    );
    const element = await mount('```js\nconst value = 1;\n```', { highlight: '' });
    const pre = root(element).querySelector('pre')!;
    const code = pre.querySelector('code')!;
    const prefix = code.querySelector('.line')!.firstChild!;
    const range = document.createRange();
    range.setStart(prefix, 0);
    range.setEnd(prefix, 5);
    document.getSelection()!.addRange(range);
    // jsdom does not expose selection inside a closed root; retain real Range endpoints.
    const selected = vi.spyOn(document, 'getSelection').mockReturnValue({
      isCollapsed: false,
      anchorNode: prefix,
      focusNode: prefix,
    } as unknown as Selection);
    highlight(
      '<pre class="shiki"><code><span class="line"><span style="--shiki-light:red">const</span> value = 1;</span></code></pre>',
    );
    await flush();
    expect(root(element).querySelector('pre')).toBe(pre);
    expect(pre.querySelector('code')).toBe(code);
    expect(range.startContainer).toBe(prefix);
    expect(range.toString()).toBe('const');
    expect(pre.classList.contains('shiki')).toBe(false);
    selected.mockRestore();
    document.getSelection()!.removeAllRanges();
    document.dispatchEvent(new Event('selectionchange'));
    await flush();
    expect(root(element).querySelector('pre')).toBe(pre);
    expect(pre.querySelector('code')).toBe(code);
    expect(pre.classList.contains('shiki')).toBe(true);
  });
  it('rejects delayed highlight results after source replacement and disconnect', async () => {
    const jobs: Array<(html: string) => void> = [];
    vi.spyOn(highlighting, 'highlight').mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          jobs.push(resolve);
        }),
    );
    const element = await mount('```js\nold\n```', { highlight: '' });
    const pre = root(element).querySelector('pre')!;
    element.content = '```js\ncurrent\n```';
    await element._pending;
    jobs[0]('<pre class="shiki"><code>old</code></pre>');
    await flush();
    expect(pre.textContent).toContain('current');
    expect(pre.classList.contains('shiki')).toBe(false);
    element.remove();
    jobs[1]('<pre class="shiki"><code>current</code></pre>');
    await flush();
    expect(pre.classList.contains('shiki')).toBe(false);
    document.body.append(element);
    await element._pending;
    jobs.at(-1)!('<pre class="shiki"><code>current\n</code></pre>');
    await flush();
    expect(root(element).querySelector('pre')).toBe(pre);
    expect(pre.classList.contains('shiki')).toBe(true);
  });
});
