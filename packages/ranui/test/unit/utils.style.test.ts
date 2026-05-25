import { afterEach, describe, expect, it, vi } from 'vitest';
import { adoptSheetText, adoptStyles } from '@/utils/style';

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

  it('adopts dynamic sheet text once for identical CSS', () => {
    vi.stubGlobal('CSSStyleSheet', CSSStyleSheetMock);
    const shadowRoot = createShadowRoot();

    adoptSheetText(shadowRoot, '.x { display: block; }');
    adoptSheetText(shadowRoot, '.x { display: block; }');

    expect(shadowRoot.adoptedStyleSheets).toHaveLength(1);
    expect((shadowRoot.adoptedStyleSheets[0] as unknown as CSSStyleSheetMock).cssText).toBe('.x { display: block; }');
  });

  it('falls back to dynamic style tags and deduplicates by css text', () => {
    vi.stubGlobal(
      'CSSStyleSheet',
      class {
        replaceSync(): void {
          throw new Error('unsupported');
        }
      },
    );
    const shadowRoot = createShadowRoot();

    adoptSheetText(shadowRoot, '.fallback-x { display: block; }');
    adoptSheetText(shadowRoot, '.fallback-x { display: block; }');
    adoptSheetText(shadowRoot, '.fallback-y { display: flex; }');

    const styles = shadowRoot.querySelectorAll('style[data-ranui-sheet]');
    expect(styles).toHaveLength(2);
    expect(Array.from(styles).map((style) => style.textContent)).toEqual([
      '.fallback-x { display: block; }',
      '.fallback-y { display: flex; }',
    ]);
  });

  it('ignores empty css text', () => {
    const shadowRoot = createShadowRoot();

    adoptStyles(shadowRoot, '');
    adoptSheetText(shadowRoot, '');

    expect(shadowRoot.adoptedStyleSheets).toHaveLength(0);
    expect(shadowRoot.querySelector('style')).toBeNull();
  });
});
