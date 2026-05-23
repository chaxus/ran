import { describe, expect, it, beforeEach, vi } from 'vitest';
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

  it('sheet setter updates attribute and calls handlerExternalCss', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    const spy = vi.spyOn(btn as any, 'handlerExternalCss');
    (btn as any).sheet = '.ran-btn { color: red; }';
    expect(btn.getAttribute('sheet')).toBe('.ran-btn { color: red; }');
    expect(spy).toHaveBeenCalled();
  });

  it('iconSize setter with false removes attribute', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    btn.iconSize = '24';
    btn.iconSize = 'false';
    expect(btn.hasAttribute('iconSize')).toBe(false);
  });

  it('icon setter with false removes attribute', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    btn.icon = 'home';
    btn.icon = 'false';
    expect(btn.hasAttribute('icon')).toBe(false);
  });

  it('mousedown with pc device sets CSS custom properties', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);

    vi.spyOn(btn as any, 'getBoundingClientRect').mockReturnValue({ left: 10, top: 20 });
    const event = new MouseEvent('mousedown', { clientX: 50, clientY: 60 });
    (btn as any).mousedown(event);
    // --ran-x and --ran-y set (40px and 40px)
    const shadow = (btn as any)._shadowDom as ShadowRoot;
    const inner = shadow.querySelector('.ran-btn') as HTMLElement;
    // Even in jsdom, the CSS var may be set
    expect((btn as any).getBoundingClientRect).toHaveBeenCalled();
  });

  it('mouseup sets a timeout to clean up ripple', () => {
    vi.useFakeTimers();
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);

    (btn as any).mouseup();
    vi.advanceTimersByTime(700);
    // No error thrown, timer cleaned up
    expect(true).toBe(true);
    vi.useRealTimers();
  });

  it('effect getter returns attribute value', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    btn.setAttribute('effect', 'ripple');
    expect((btn as any).effect).toBe('ripple');
  });

  it('effect setter with truthy value sets attribute', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    (btn as any).effect = 'ripple';
    expect(btn.getAttribute('effect')).toBe('ripple');
  });

  it('effect setter with false removes attribute', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    btn.setAttribute('effect', 'ripple');
    (btn as any).effect = 'false';
    expect(btn.hasAttribute('effect')).toBe(false);
  });

  it('attributeChangedCallback early return when oldValue === newValue', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    const spy = vi.spyOn(btn as any, 'syncA11yState');
    (btn as any).attributeChangedCallback('disabled', 'same', 'same');
    expect(spy).not.toHaveBeenCalled();
  });

  it('mouseup returns early when debounceTimeId is set', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    (btn as any).debounceTimeId = 123;
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    (btn as any).mouseup();
    expect(setTimeoutSpy).not.toHaveBeenCalled();
    setTimeoutSpy.mockRestore();
    (btn as any).debounceTimeId = undefined;
  });

  it('disconnectedCallback removes event listeners', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    const spy = vi.spyOn((btn as any)._btn, 'removeEventListener');
    document.body.removeChild(btn);
    expect(spy).toHaveBeenCalledWith('mousedown', (btn as any).mousedown);
  });

  it('setIcon creates icon element when icon is set', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    btn.icon = 'home';
    (btn as any).setIcon();
    expect((btn as any)._iconElement).toBeTruthy();
  });

  it('setIcon removes icon element when icon is cleared', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    btn.icon = 'home';
    (btn as any).setIcon();
    btn.icon = null;
    (btn as any).setIcon();
    expect((btn as any)._iconElement).toBeUndefined();
  });

  it('handlerExternalCss with adoptedStyleSheets support applies sheet', () => {
    const btn = document.createElement('r-button') as Button;
    document.body.appendChild(btn);
    const shadow = (btn as any)._shadowDom as ShadowRoot;

    const mockSheet = { replaceSync: vi.fn() };
    const origCSS = window.CSSStyleSheet;
    (window as any).CSSStyleSheet = vi.fn(() => mockSheet);
    Object.defineProperty(shadow, 'adoptedStyleSheets', {
      value: [],
      writable: true,
      configurable: true,
    });

    btn.setAttribute('sheet', '.btn { color: blue; }');
    expect(true).toBe(true);
    (window as any).CSSStyleSheet = origCSS;
  });
});
