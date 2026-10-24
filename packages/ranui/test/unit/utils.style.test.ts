import { afterEach, describe, expect, it, vi } from 'vitest';
import { adoptStyles, replaceSheetText } from '@/utils/style';

class CSSStyleSheetMock {
  cssText = '';
  replaceSync(cssText: string): void {
    this.cssText = cssText;
  }
}

function createShadowRoot(): ShadowRoot {
  const shadowRoot = document.createElement('div').attachShadow({ mode: 'open' });
  Object.defineProperty(shadowRoot, 'adoptedStyleSheets', {
    configurable: true,
    value: [],
    writable: true,
  });
  return shadowRoot;
}

describe('utils/style', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('adopts constructable stylesheets once per shadow root', () => {
    vi.stubGlobal('CSSStyleSheet', CSSStyleSheetMock);
    const shadowRoot = createShadowRoot();

    adoptStyles(shadowRoot, '.a { color: red; }');
    adoptStyles(shadowRoot, '.a { color: red; }');

    expect(shadowRoot.adoptedStyleSheets).toHaveLength(1);
    expect((shadowRoot.adoptedStyleSheets[0] as unknown as CSSStyleSheetMock).cssText).toBe('.a { color: red; }');
  });

  it('falls back to one static style tag when constructable stylesheets fail', () => {
    vi.stubGlobal(
      'CSSStyleSheet',
      class {
        replaceSync(): void {
          throw new Error('unsupported');
        }
      },
    );
    const shadowRoot = createShadowRoot();

    adoptStyles(shadowRoot, '.fallback-a { color: red; }');
    adoptStyles(shadowRoot, '.fallback-b { color: blue; }');

    const styles = shadowRoot.querySelectorAll('style[data-ranui]');
    expect(styles).toHaveLength(1);
    expect(styles[0].textContent).toBe('.fallback-a { color: red; }');
  });

  it('replaces the previous sheet text instead of stacking it', () => {
    vi.stubGlobal('CSSStyleSheet', CSSStyleSheetMock);
    const shadowRoot = createShadowRoot();
    adoptStyles(shadowRoot, '.static { display: block; }');

    replaceSheetText(shadowRoot, '.x { color: red; }');
    replaceSheetText(shadowRoot, '.x { color: blue; }');

    const texts = shadowRoot.adoptedStyleSheets.map((sheet) => (sheet as unknown as CSSStyleSheetMock).cssText);
    expect(texts).toEqual(['.static { display: block; }', '.x { color: blue; }']);

    replaceSheetText(shadowRoot, '');
    expect(shadowRoot.adoptedStyleSheets.map((sheet) => (sheet as unknown as CSSStyleSheetMock).cssText)).toEqual([
      '.static { display: block; }',
    ]);
  });

  it('shares one stylesheet between roots that use the same text', () => {
    vi.stubGlobal('CSSStyleSheet', CSSStyleSheetMock);
    const a = createShadowRoot();
    const b = createShadowRoot();

    replaceSheetText(a, '.shared { gap: 4px; }');
    replaceSheetText(b, '.shared { gap: 4px; }');

    expect(a.adoptedStyleSheets[0]).toBe(b.adoptedStyleSheets[0]);
  });

  it('keeps one fallback style tag and removes it when the text is cleared', () => {
    vi.stubGlobal(
      'CSSStyleSheet',
      class {
        replaceSync(): void {
          throw new Error('unsupported');
        }
      },
    );
    const shadowRoot = createShadowRoot();

    replaceSheetText(shadowRoot, '.fallback-x { display: block; }');
    replaceSheetText(shadowRoot, '.fallback-y { display: flex; }');

    const styles = shadowRoot.querySelectorAll('style[data-ranui-sheet]');
    expect(Array.from(styles).map((style) => style.textContent)).toEqual(['.fallback-y { display: flex; }']);

    replaceSheetText(shadowRoot, '');
    expect(shadowRoot.querySelector('style[data-ranui-sheet]')).toBeNull();
  });

  it('ignores empty css text', () => {
    const shadowRoot = createShadowRoot();

    adoptStyles(shadowRoot, '');
    replaceSheetText(shadowRoot, '');

    expect(shadowRoot.adoptedStyleSheets).toHaveLength(0);
    expect(shadowRoot.querySelector('style')).toBeNull();
  });
});
