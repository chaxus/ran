import { describe, expect, it, beforeEach } from 'vitest';
import { Button } from '@/components/button';
// Ensure custom elements are defined
import '@/components/button';

describe('r-button contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('reflects disabled property to attributes', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);

    // Initial state
    expect(btn.hasAttribute('disabled')).toBe(false);

    // Set isolated property
    btn.disabled = true;
    expect(btn.hasAttribute('disabled')).toBe(true);
    expect(btn.getAttribute('aria-disabled')).toBe('true');

    // Remove disabled
    btn.disabled = false;
    expect(btn.hasAttribute('disabled')).toBe(false);
    expect(btn.hasAttribute('aria-disabled')).toBe(false);
  });

  it('reflects icon and iconSize properties', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);

    // Add icon
    btn.icon = 'home';
    expect(btn.getAttribute('icon')).toBe('home');

    // Add iconSize
    btn.iconSize = '24';
    expect(btn.getAttribute('iconSize')).toBe('24');

    // Remove icon
    btn.icon = null;
    expect(btn.hasAttribute('icon')).toBe(false);

    // Remove iconSize
    btn.iconSize = null;
    expect(btn.hasAttribute('iconSize')).toBe(false);
  });

  it('handles custom sheet property mapping to shadow DOM', async () => {
    // Under JSDOM, replaceSync is absent, and adoptedStyleSheets is frozen.
    // The Button component logic is designed to catch throws and fall back to appending <style>.
    const originalCSSStyleSheet = window.CSSStyleSheet;
    try {
      // Create a mock CSSStyleSheet that throws on replaceSync
      // to forcefully simulate a failure and trigger the fallback
      class MockCSSStyleSheet {
        replaceSync() {
          throw new Error('Fallback trigger');
        }
      }
      (window as any).CSSStyleSheet = MockCSSStyleSheet;

      const btn = document.createElement('r-button') as Button;
      document.body.appendChild(btn);
      await new Promise((r) => setTimeout(r, 20));

      // @ts-ignore - access private _shadowDom because mode is closed
      const shadow = btn._shadowDom as ShadowRoot;

      // Assigning the sheet property should trigger the fallback
      btn.setAttribute('sheet', '.ran-btn { background: red; }');
      await new Promise((r) => setTimeout(r, 20));

      const finalShadowHtml = shadow?.innerHTML || '';

      // Verify the content is in the shadow DOM as a raw text substring
      expect(finalShadowHtml).toContain('.ran-btn { background: red; }');
    } finally {
      window.CSSStyleSheet = originalCSSStyleSheet;
    }
  });

  it('dispatches click events when not disabled, including keyboard interaction', async () => {
    const sleep = (ms = 10) => new Promise((r) => setTimeout(r, ms));
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    let clicked = false;
    btn.addEventListener('click', () => {
      clicked = true;
    });

    // Keyboard Enter via keydown handler testing
    btn.keydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    await sleep();
    expect(clicked).toBe(true);

    // Keyboard Space
    clicked = false;
    btn.keydown(new KeyboardEvent('keydown', { key: ' ' }));
    await sleep();
    expect(clicked).toBe(true);

    // Disabled state should prevent keyboard interaction
    clicked = false;
    btn.disabled = true;
    btn.keydown(new KeyboardEvent('keydown', { key: 'Enter' }));
    await sleep();
    // Expect no click since disabled
    expect(clicked).toBe(false);
  });
});
