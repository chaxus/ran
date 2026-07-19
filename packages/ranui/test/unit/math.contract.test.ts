import { describe, expect, it, beforeEach, vi } from 'vitest';
import type { Math as RanMath } from '@/components/math';

// Temml is mocked so tests never load the real package and we can assert on the
// options passed (displayMode) and simulate render failures.
const renderToString = vi.fn((tex: string, opts?: { displayMode?: boolean }) => {
  if (tex.includes('THROW')) throw new Error('Temml parse error');
  return `<math class="${opts?.displayMode ? 'tml-display' : ''}"><mtext>${tex}</mtext></math>`;
});
vi.mock('temml', () => ({ default: { renderToString } }));

// Mock the font data-URIs so the unit run never base64-transforms the real ~388 KB woff2
// (that heavy transform is verified by the build, not here — and under full-suite load it
// would slow the shared event loop enough to flake other timing-sensitive tests).
vi.mock('@/assets/fonts/latinmodernmath.woff2?inline', () => ({ default: 'data:font/woff2;base64,TEST_LM' }));
vi.mock('@/assets/fonts/Temml.woff2?inline', () => ({ default: 'data:font/woff2;base64,TEST_TEMML' }));

const sleep = (ms = 20): Promise<void> => new Promise((r) => setTimeout(r, ms));

describe('r-math contract', () => {
  beforeEach(async () => {
    document.body.innerHTML = '';
    renderToString.mockClear();
    // Dynamic import to ensure the component is registered
    await import('@/components/math');
  });

  it('renders shadow DOM with .ran-math container exposed as ::part(math)', () => {
    const math = document.createElement('r-math') as unknown as RanMath;
    document.body.appendChild(math);

    const shadow = (math as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    const container = shadow.querySelector('.ran-math');
    expect(container).not.toBeNull();
    expect(container?.getAttribute('part')).toBe('math');
  });

  it('reflects latex property to a URI-encoded attribute and decodes on read', () => {
    const math = document.createElement('r-math') as unknown as RanMath;
    document.body.appendChild(math);

    math.latex = 'x^2 + y^2 = z^2';
    // Stored URI-encoded so `{`, `\`, `+`, newlines survive HTML parsing…
    expect(math.getAttribute('latex')).toBe(encodeURIComponent('x^2 + y^2 = z^2'));
    // …but the getter round-trips back to the original source.
    expect(math.latex).toBe('x^2 + y^2 = z^2');
  });

  it('round-trips backslash-heavy source', () => {
    const math = document.createElement('r-math') as unknown as RanMath;
    document.body.appendChild(math);

    math.latex = '\\frac{1}{2}';
    expect(math.latex).toBe('\\frac{1}{2}');
  });

  it('falls back to textContent when no latex attribute is set', () => {
    const math = document.createElement('r-math') as unknown as RanMath;
    math.textContent = '\\int_0^1 x\\,dx';
    document.body.appendChild(math);

    expect(math.latex).toBe('\\int_0^1 x\\,dx');
  });

  it('sheet property reflects to attribute', () => {
    const math = document.createElement('r-math') as unknown as RanMath;
    document.body.appendChild(math);

    math.sheet = '.ran-math { color: red; }';
    expect(math.getAttribute('sheet')).toBe('.ran-math { color: red; }');
    expect(math.sheet).toBe('.ran-math { color: red; }');
  });

  it('render clears the container and does nothing when latex is empty', () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);

    math.render();
    expect(math.contain.innerHTML).toBe('');
    expect(renderToString).not.toHaveBeenCalled();
  });

  it('renders MathML via temml when latex is set (block by default)', async () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);
    math.latex = 'x^2';
    math.render();
    await sleep();

    expect(renderToString).toHaveBeenCalledWith('x^2', expect.objectContaining({ displayMode: true, annotate: true }));
    expect(math.contain.querySelector('math')).not.toBeNull();
  });

  it('passes displayMode:false for inline display', async () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);
    math.setAttribute('display', 'inline');
    math.latex = 'x^2';
    await sleep();

    expect(renderToString).toHaveBeenLastCalledWith('x^2', expect.objectContaining({ displayMode: false }));
  });

  it('registers the bundled math @font-face once at the document level (inlined)', async () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);
    math.latex = 'x';
    await sleep();

    const style = document.getElementById('ran-math-fonts');
    expect(style).not.toBeNull();
    expect(style!.textContent).toContain("font-family:'Latin Modern Math'");
    // Inlined as a data-URI (self-contained), not an external file reference.
    expect(style!.textContent).toContain('src:url(data:');

    // A second instance must not duplicate the document-level style.
    const math2 = document.createElement('r-math') as any;
    document.body.appendChild(math2);
    math2.latex = 'y';
    await sleep();
    expect(document.querySelectorAll('#ran-math-fonts').length).toBe(1);
  });

  it('renders an ::part(error) box and dispatches an error event on failure', async () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);

    const onError = vi.fn();
    math.addEventListener('error', onError);
    math.latex = 'THROW';
    await sleep();

    const errorBox = math.contain.querySelector('.ran-math-error');
    expect(errorBox).not.toBeNull();
    expect(errorBox.getAttribute('part')).toBe('error');
    expect(errorBox.textContent).toContain('Temml parse error');
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0].detail.message).toContain('Temml parse error');
  });

  it('dispatches a render event with { ok: true } on success', async () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);

    const onRender = vi.fn();
    math.addEventListener('render', onRender);
    math.latex = 'a+b';
    await sleep();

    expect(onRender).toHaveBeenCalledTimes(1);
    expect(onRender.mock.calls[0][0].detail).toEqual({ ok: true });
  });

  it('still renders MathML with font="system" (bundled font opt-out)', async () => {
    const math = document.createElement('r-math') as any;
    math.setAttribute('font', 'system');
    document.body.appendChild(math);
    math.latex = 'x^2';
    await sleep();

    expect(renderToString).toHaveBeenCalled();
    expect(math.contain.querySelector('math')).not.toBeNull();
  });

  it('passes Temml macros (JSON attr) through to renderToString', async () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);
    math.setAttribute('macros', '{"\\\\RR":"\\\\mathbb{R}"}');
    math.latex = '\\RR';
    await sleep();

    expect(renderToString).toHaveBeenLastCalledWith(
      '\\RR',
      expect.objectContaining({ macros: { '\\RR': '\\mathbb{R}' } }),
    );
  });

  it('ignores invalid macros JSON without throwing', async () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);
    math.setAttribute('macros', 'not json');
    math.latex = 'x';
    await sleep();

    const opts = renderToString.mock.calls.at(-1)?.[1] as Record<string, unknown>;
    expect(opts.macros).toBeUndefined();
  });

  it('passes a valid wrap value through, and drops an invalid one', async () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);
    math.setAttribute('wrap', '=');
    math.latex = 'a+b+c';
    await sleep();
    expect((renderToString.mock.calls.at(-1)?.[1] as any).wrap).toBe('=');

    math.setAttribute('wrap', 'bogus');
    await sleep();
    expect((renderToString.mock.calls.at(-1)?.[1] as any).wrap).toBeUndefined();
  });

  it('builds a copy toolbar only when the copy attribute is set', async () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);
    math.latex = 'x^2';
    await sleep();
    // No control attr → no toolbar controls.
    expect(math._wrap.classList.contains('has-controls')).toBe(false);
    expect(math._toolbar.querySelector('.ran-math-btn')).toBeNull();

    math.setAttribute('copy', '');
    await sleep();
    const btn = math._toolbar.querySelector('.ran-math-btn');
    expect(btn).not.toBeNull();
    expect(btn.getAttribute('part')).toBe('button');
    expect(btn.querySelector('r-icon')?.getAttribute('name')).toBe('copy');
    expect(math._wrap.classList.contains('has-controls')).toBe(true);
  });

  it('copies the LaTeX source and dispatches a copied event', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    const math = document.createElement('r-math') as any;
    math.setAttribute('copy', '');
    document.body.appendChild(math);
    const onCopied = vi.fn();
    math.addEventListener('copied', onCopied);
    math.latex = '\\frac{1}{2}';
    await sleep();

    math._toolbar.querySelector('.ran-math-btn').click();
    await sleep();

    expect(writeText).toHaveBeenCalledWith('\\frac{1}{2}');
    expect(onCopied).toHaveBeenCalledTimes(1);
    expect(onCopied.mock.calls[0][0].detail).toEqual({ kind: 'source' });
    // The icon flips to a check-mark as confirmation.
    expect(math._toolbar.querySelector('r-icon')?.getAttribute('name')).toBe('check');
  });

  it('attributeChangedCallback calls render on latex and display change', () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);

    const renderSpy = vi.spyOn(math, 'render');
    math.attributeChangedCallback('latex', '', 'a^2');
    math.attributeChangedCallback('display', 'block', 'inline');
    expect(renderSpy).toHaveBeenCalledTimes(2);
  });

  it('attributeChangedCallback calls handlerExternalCss on sheet change', () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);

    const cssSpy = vi.spyOn(math, 'handlerExternalCss');
    math.attributeChangedCallback('sheet', '', 'body{}');
    expect(cssSpy).toHaveBeenCalled();
  });

  it('attributeChangedCallback skips when old and new value are the same', () => {
    const math = document.createElement('r-math') as any;
    document.body.appendChild(math);

    const renderSpy = vi.spyOn(math, 'render');
    math.attributeChangedCallback('latex', 'same', 'same');
    expect(renderSpy).not.toHaveBeenCalled();
  });
});
