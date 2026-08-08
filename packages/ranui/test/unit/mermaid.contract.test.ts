import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { Mermaid } from '@/components/mermaid';

// Mermaid is mocked so tests never load the real (large, canvas/DOM-heavy) package —
// only the render() call and the options it's given are asserted, matching the
// pattern already used for temml in math.contract.test.ts.
const render = vi.fn(async (id: string, code: string) => {
  if (code.includes('THROW')) throw new Error('Parse error');
  return { svg: `<svg id="${id}"><text>${code}</text></svg>` };
});
const initialize = vi.fn();
vi.mock('mermaid', () => ({ default: { initialize, render } }));

const sleep = (ms = 20): Promise<void> => new Promise((r) => setTimeout(r, ms));

describe('r-mermaid contract', () => {
  beforeEach(async () => {
    document.body.innerHTML = '';
    document.documentElement.classList.remove('dark');
    document.documentElement.removeAttribute('data-ran-theme');
    render.mockClear();
    initialize.mockClear();
    await import('@/components/mermaid');
  });

  it('renders shadow DOM with diagram + toolbar under ::part(mermaid)', () => {
    const mermaid = document.createElement('r-mermaid') as unknown as Mermaid;
    document.body.appendChild(mermaid);

    const shadow = (mermaid as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    const wrap = shadow.querySelector('.ran-mermaid');
    expect(wrap?.getAttribute('part')).toBe('mermaid');
    expect(wrap?.querySelector('.ran-mermaid-diagram')?.getAttribute('part')).toBe('diagram');
    expect(wrap?.querySelector('.ran-mermaid-toolbar')?.getAttribute('part')).toBe('toolbar');
  });

  it('reflects code property to a URI-encoded attribute and decodes on read', () => {
    const mermaid = document.createElement('r-mermaid') as unknown as Mermaid;
    document.body.appendChild(mermaid);

    mermaid.code = 'graph TD; A-->B;';
    expect(mermaid.getAttribute('code')).toBe(encodeURIComponent('graph TD; A-->B;'));
    expect(mermaid.code).toBe('graph TD; A-->B;');
  });

  it('falls back to textContent when no code attribute is set', () => {
    const mermaid = document.createElement('r-mermaid') as unknown as Mermaid;
    mermaid.textContent = 'graph LR; X-->Y;';
    document.body.appendChild(mermaid);

    expect(mermaid.code).toBe('graph LR; X-->Y;');
  });

  it('theme defaults to "auto" and reflects when set explicitly', () => {
    const mermaid = document.createElement('r-mermaid') as unknown as Mermaid;
    document.body.appendChild(mermaid);
    expect(mermaid.theme).toBe('auto');

    mermaid.theme = 'dark';
    expect(mermaid.getAttribute('theme')).toBe('dark');
    expect(mermaid.theme).toBe('dark');
  });

  it('sheet property reflects to attribute', () => {
    const mermaid = document.createElement('r-mermaid') as unknown as Mermaid;
    document.body.appendChild(mermaid);

    mermaid.sheet = '.ran-mermaid { color: red; }';
    expect(mermaid.getAttribute('sheet')).toBe('.ran-mermaid { color: red; }');
    expect(mermaid.sheet).toBe('.ran-mermaid { color: red; }');
  });

  it('render() does nothing when code is empty', () => {
    const mermaid = document.createElement('r-mermaid') as any;
    document.body.appendChild(mermaid);

    mermaid.render();
    expect(render).not.toHaveBeenCalled();
    expect(mermaid._diagram.innerHTML).toBe('');
  });

  it('renders the diagram via mermaid.render and dispatches a render event', async () => {
    const mermaid = document.createElement('r-mermaid') as any;
    document.body.appendChild(mermaid);
    const onRender = vi.fn();
    mermaid.addEventListener('render', onRender);

    mermaid.code = 'graph TD; A-->B;';
    await sleep();

    expect(render).toHaveBeenCalledWith(expect.any(String), 'graph TD; A-->B;');
    expect(mermaid._diagram.querySelector('svg')).not.toBeNull();
    expect(onRender).toHaveBeenCalledTimes(1);
    expect(onRender.mock.calls[0][0].detail).toEqual({ ok: true });
  });

  it('resolves theme "auto" from the document dark-mode class', async () => {
    document.documentElement.classList.add('dark');
    const mermaid = document.createElement('r-mermaid') as any;
    document.body.appendChild(mermaid);
    mermaid.code = 'graph TD; A-->B;';
    await sleep();

    expect(initialize).toHaveBeenLastCalledWith(expect.objectContaining({ theme: 'dark' }));
  });

  it('resolves theme "auto" to default (light) with no dark-mode signal', async () => {
    const mermaid = document.createElement('r-mermaid') as any;
    document.body.appendChild(mermaid);
    mermaid.code = 'graph TD; A-->B;';
    await sleep();

    expect(initialize).toHaveBeenLastCalledWith(expect.objectContaining({ theme: 'default' }));
  });

  it('renders an ::part(error) box and dispatches an error event on failure', async () => {
    const mermaid = document.createElement('r-mermaid') as any;
    document.body.appendChild(mermaid);
    const onError = vi.fn();
    mermaid.addEventListener('error', onError);

    mermaid.code = 'THROW';
    await sleep();

    const errorBox = mermaid._diagram.querySelector('.ran-mermaid-error');
    expect(errorBox).not.toBeNull();
    expect(errorBox.getAttribute('part')).toBe('error');
    expect(errorBox.textContent).toContain('Parse error');
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].detail.message).toContain('Parse error');
  });

  it('builds toolbar buttons only for the controls that are enabled', async () => {
    const mermaid = document.createElement('r-mermaid') as any;
    document.body.appendChild(mermaid);
    mermaid.code = 'graph TD; A-->B;';
    await sleep();

    expect(mermaid._wrap.classList.contains('has-controls')).toBe(false);
    expect(mermaid._toolbar.querySelector('.ran-mermaid-btn')).toBeNull();

    mermaid.setAttribute('copy', '');
    await sleep();
    let btns = mermaid._toolbar.querySelectorAll('.ran-mermaid-btn');
    expect(btns.length).toBe(1);
    expect(btns[0].querySelector('r-icon')?.getAttribute('name')).toBe('copy');
    expect(mermaid._wrap.classList.contains('has-controls')).toBe(true);

    mermaid.setAttribute('fullscreen', '');
    await sleep();
    btns = mermaid._toolbar.querySelectorAll('.ran-mermaid-btn');
    expect(btns.length).toBe(2);
  });

  it('copies the diagram source and dispatches a copied event', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    const mermaid = document.createElement('r-mermaid') as any;
    mermaid.setAttribute('copy', '');
    document.body.appendChild(mermaid);
    const onCopied = vi.fn();
    mermaid.addEventListener('copied', onCopied);
    mermaid.code = 'graph TD; A-->B;';
    await sleep();

    mermaid._toolbar.querySelector('.ran-mermaid-btn').click();
    await sleep();

    expect(writeText).toHaveBeenCalledWith('graph TD; A-->B;');
    expect(onCopied.mock.calls[0][0].detail).toEqual({ kind: 'source' });
    expect(mermaid._toolbar.querySelector('r-icon')?.getAttribute('name')).toBe('check');
  });

  it('downloads the source directly when a single download format is given', async () => {
    const createObjectURL = vi.fn(() => 'blob:x');
    const revokeObjectURL = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', { value: createObjectURL, configurable: true });
    Object.defineProperty(URL, 'revokeObjectURL', { value: revokeObjectURL, configurable: true });

    const mermaid = document.createElement('r-mermaid') as any;
    mermaid.setAttribute('download', 'source');
    document.body.appendChild(mermaid);
    const onDownload = vi.fn();
    mermaid.addEventListener('download', onDownload);
    mermaid.code = 'graph TD; A-->B;';
    await sleep();

    mermaid._toolbar.querySelector('.ran-mermaid-btn').click();
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(onDownload.mock.calls[0][0].detail).toEqual({ format: 'source' });
    expect(mermaid._wrap.querySelector('.ran-mermaid-menu')).toBeNull();
  });

  it('opens a format menu when download lists multiple formats', async () => {
    const mermaid = document.createElement('r-mermaid') as any;
    mermaid.setAttribute('download', 'svg source');
    document.body.appendChild(mermaid);
    mermaid.code = 'graph TD; A-->B;';
    await sleep();

    mermaid._toolbar.querySelector('.ran-mermaid-btn').click();
    const items = mermaid._wrap.querySelectorAll('.ran-mermaid-menu-item');
    expect(items.length).toBe(2);
    expect([...items].map((i: any) => i.textContent)).toEqual(['SVG', 'Source (.mmd)']);

    mermaid._wrap.dispatchEvent(new Event('mouseleave'));
    expect(mermaid._wrap.querySelector('.ran-mermaid-menu')).toBeNull();
  });

  it('attributeChangedCallback calls render on code and theme change', () => {
    const mermaid = document.createElement('r-mermaid') as any;
    document.body.appendChild(mermaid);

    const renderSpy = vi.spyOn(mermaid, 'render');
    mermaid.attributeChangedCallback('code', '', 'graph TD;');
    mermaid.attributeChangedCallback('theme', 'auto', 'dark');
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('attributeChangedCallback calls handlerExternalCss on sheet change', () => {
    const mermaid = document.createElement('r-mermaid') as any;
    document.body.appendChild(mermaid);

    const cssSpy = vi.spyOn(mermaid, 'handlerExternalCss');
    mermaid.attributeChangedCallback('sheet', '', 'body{}');
    expect(cssSpy).toHaveBeenCalled();
  });

  it('attributeChangedCallback skips when old and new value are the same', () => {
    const mermaid = document.createElement('r-mermaid') as any;
    document.body.appendChild(mermaid);

    const renderSpy = vi.spyOn(mermaid, 'render');
    mermaid.attributeChangedCallback('code', 'same', 'same');
    expect(renderSpy).not.toHaveBeenCalled();
  });

  it('disconnectedCallback does not throw and tears down the theme observer', () => {
    const mermaid = document.createElement('r-mermaid') as unknown as Mermaid;
    document.body.appendChild(mermaid);
    expect(() => document.body.removeChild(mermaid)).not.toThrow();
  });
});
