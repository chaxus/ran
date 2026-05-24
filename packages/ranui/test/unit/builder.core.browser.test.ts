/**
 * Tests for ElementBuilder and ShadowBuilder in browser (jsdom) environment.
 * isSSR === false here, so real DOM APIs are exercised.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createRef, ElementBuilder, ShadowBuilder } from '@/utils/builder/core';

// ---------------------------------------------------------------------------
// createRef
// ---------------------------------------------------------------------------

describe('createRef', () => {
  it('returns an object with current === null', () => {
    const ref = createRef();
    expect(ref).toEqual({ current: null });
  });

  it('is generic and accepts a type parameter', () => {
    const ref = createRef<HTMLButtonElement>();
    expect(ref.current).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// ElementBuilder — attribute / class / style helpers
// ---------------------------------------------------------------------------

describe('ElementBuilder — id()', () => {
  it('sets the id attribute', () => {
    const el = new ElementBuilder('div').id('main').build();
    expect(el.getAttribute('id')).toBe('main');
  });
});

describe('ElementBuilder — class()', () => {
  it('sets className directly', () => {
    const el = new ElementBuilder('div').class('box active').build();
    expect(el.className).toBe('box active');
  });
});

describe('ElementBuilder — addClass() / removeClass()', () => {
  it('adds one class', () => {
    const el = new ElementBuilder('div').addClass('foo').build();
    expect(el.classList.contains('foo')).toBe(true);
  });

  it('adds multiple classes', () => {
    const el = new ElementBuilder('div').addClass('a', 'b', 'c').build();
    expect(el.classList.contains('a')).toBe(true);
    expect(el.classList.contains('b')).toBe(true);
    expect(el.classList.contains('c')).toBe(true);
  });

  it('removes a class', () => {
    const el = new ElementBuilder('div').addClass('foo', 'bar').removeClass('foo').build();
    expect(el.classList.contains('foo')).toBe(false);
    expect(el.classList.contains('bar')).toBe(true);
  });
});

describe('ElementBuilder — attr() / part() / data()', () => {
  it('attr() sets an arbitrary attribute', () => {
    const el = new ElementBuilder('input').attr('type', 'email').build();
    expect(el.getAttribute('type')).toBe('email');
  });

  it('part() sets the part attribute', () => {
    const el = new ElementBuilder('div').part('base').build();
    expect(el.getAttribute('part')).toBe('base');
  });

  it('data() sets a data-* attribute', () => {
    const el = new ElementBuilder('div').data('index', '3').build();
    expect(el.getAttribute('data-index')).toBe('3');
  });
});

describe('ElementBuilder — style()', () => {
  it('style(key, value) sets a CSS property', () => {
    const el = new ElementBuilder('div').style('color', 'red').build();
    expect(el.style.getPropertyValue('color')).toBe('red');
  });

  it('style(map) sets multiple CSS properties', () => {
    const el = new ElementBuilder('div')
      .style({ color: 'blue', 'font-size': '16px' })
      .build();
    expect(el.style.getPropertyValue('color')).toBe('blue');
    expect(el.style.getPropertyValue('font-size')).toBe('16px');
  });
});

describe('ElementBuilder — ARIA helpers', () => {
  it('aria() sets aria-* attribute', () => {
    const el = new ElementBuilder('div').aria('expanded', 'true').build();
    expect(el.getAttribute('aria-expanded')).toBe('true');
  });

  it('role() sets role attribute', () => {
    const el = new ElementBuilder('div').role('listbox').build();
    expect(el.getAttribute('role')).toBe('listbox');
  });

  it('tabIndex() sets tabindex', () => {
    const el = new ElementBuilder('div').tabIndex(0).build();
    expect(el.getAttribute('tabindex')).toBe('0');
  });

  it('label() sets aria-label', () => {
    const el = new ElementBuilder('button').label('Close').build();
    expect(el.getAttribute('aria-label')).toBe('Close');
  });

  it('labelledBy() sets aria-labelledby', () => {
    const el = new ElementBuilder('input').labelledBy('title-id').build();
    expect(el.getAttribute('aria-labelledby')).toBe('title-id');
  });

  it('describedBy() sets aria-describedby', () => {
    const el = new ElementBuilder('input').describedBy('hint-id').build();
    expect(el.getAttribute('aria-describedby')).toBe('hint-id');
  });

  it('ariaHidden() defaults to true', () => {
    const el = new ElementBuilder('div').ariaHidden().build();
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('ariaHidden(false) sets false', () => {
    const el = new ElementBuilder('div').ariaHidden(false).build();
    expect(el.getAttribute('aria-hidden')).toBe('false');
  });
});

// ---------------------------------------------------------------------------
// ElementBuilder — content helpers
// ---------------------------------------------------------------------------

describe('ElementBuilder — text()', () => {
  it('sets textContent', () => {
    const el = new ElementBuilder('p').text('hello world').build();
    expect(el.textContent).toBe('hello world');
  });
});

describe('ElementBuilder — children()', () => {
  it('appends an HTMLElement child', () => {
    const child = document.createElement('span');
    const el = new ElementBuilder('div').children(child).build();
    expect(el.firstElementChild).toBe(child);
  });

  it('appends a string child as TextNode', () => {
    const el = new ElementBuilder('p').children('hello').build();
    expect(el.textContent).toBe('hello');
  });

  it('appends a nested ElementBuilder', () => {
    const inner = new ElementBuilder('span').text('inner');
    const el = new ElementBuilder('div').children(inner).build();
    expect(el.querySelector('span')?.textContent).toBe('inner');
  });

  it('ignores null and undefined children', () => {
    const el = new ElementBuilder('div').children(null, undefined).build();
    expect(el.childNodes.length).toBe(0);
  });

  it('flattens nested arrays of children', () => {
    const s1 = new ElementBuilder('span').text('a');
    const s2 = new ElementBuilder('span').text('b');
    const el = new ElementBuilder('div').children([s1, s2]).build();
    expect(el.querySelectorAll('span').length).toBe(2);
  });

  it('accepts mixed types in one call', () => {
    const span = document.createElement('em');
    const el = new ElementBuilder('div')
      .children('text', span, new ElementBuilder('b').text('bold'), null)
      .build();
    expect(el.textContent).toContain('text');
    expect(el.textContent).toContain('bold');
    expect(el.querySelector('em')).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// ElementBuilder — ref()
// ---------------------------------------------------------------------------

describe('ElementBuilder — ref()', () => {
  it('populates ref.current with the built element', () => {
    const ref = createRef<HTMLDivElement>();
    const el = new ElementBuilder<HTMLDivElement>('div').ref(ref).build();
    expect(ref.current).toBe(el);
  });
});

// ---------------------------------------------------------------------------
// ElementBuilder — on()
// ---------------------------------------------------------------------------

describe('ElementBuilder — on()', () => {
  it('attaches an event listener', () => {
    const el = new ElementBuilder('button').build();
    let clicked = false;
    new ElementBuilder('button').on('click', () => {
      clicked = true;
    });
    // re-build to get element with listener
    let called = false;
    const btn = new ElementBuilder('button')
      .on('click', () => {
        called = true;
      })
      .build();
    btn.dispatchEvent(new Event('click'));
    expect(called).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// ElementBuilder — build() and serialize()
// ---------------------------------------------------------------------------

describe('ElementBuilder — build()', () => {
  it('returns an HTMLElement', () => {
    const el = new ElementBuilder('section').build();
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.tagName.toLowerCase()).toBe('section');
  });

  it('chaining is fluent (returns this)', () => {
    const builder = new ElementBuilder('div');
    expect(builder.id('x')).toBe(builder);
    expect(builder.addClass('y')).toBe(builder);
  });
});

describe('ElementBuilder — serialize()', () => {
  it('returns the outer HTML as a string', () => {
    const html = new ElementBuilder('div').id('x').text('hi').serialize();
    expect(html).toContain('<div');
    expect(html).toContain('id="x"');
    expect(html).toContain('hi');
  });
});

// ---------------------------------------------------------------------------
// ElementBuilder — shadow() → ShadowBuilder
// ---------------------------------------------------------------------------

describe('ElementBuilder — shadow()', () => {
  it('returns a ShadowBuilder', () => {
    const sb = new ElementBuilder('div').shadow();
    expect(sb).toBeInstanceOf(ShadowBuilder);
  });
});

// ---------------------------------------------------------------------------
// ShadowBuilder
// ---------------------------------------------------------------------------

describe('ShadowBuilder — done()', () => {
  it('returns { host, shadow }', () => {
    const { host, shadow } = new ElementBuilder('div').shadow({ mode: 'open' }).done();
    expect(host).toBeInstanceOf(HTMLElement);
    expect(shadow).toBeDefined();
  });
});

describe('ShadowBuilder — children()', () => {
  it('appends ElementBuilder child into shadow root', () => {
    const { shadow } = new ElementBuilder('div')
      .shadow({ mode: 'open' })
      .children(new ElementBuilder('span').text('slot'))
      .done();
    expect(shadow.querySelector('span')?.textContent).toBe('slot');
  });

  it('appends an HTMLElement into shadow root', () => {
    const span = document.createElement('span');
    const { shadow } = new ElementBuilder('div')
      .shadow({ mode: 'open' })
      .children(span)
      .done();
    expect(shadow.querySelector('span')).toBe(span);
  });

  it('ignores null and undefined', () => {
    const { shadow } = new ElementBuilder('div')
      .shadow({ mode: 'open' })
      .children(null, undefined)
      .done();
    expect(shadow.childNodes.length).toBe(0);
  });

  it('flattens nested arrays', () => {
    const { shadow } = new ElementBuilder('div')
      .shadow({ mode: 'open' })
      .children([new ElementBuilder('span'), new ElementBuilder('span')])
      .done();
    expect(shadow.querySelectorAll('span').length).toBe(2);
  });
});

describe('ShadowBuilder — css()', () => {
  it('injects CSS (via adoptedStyleSheets or style tag fallback)', () => {
    const { shadow } = new ElementBuilder('div')
      .shadow({ mode: 'open' })
      .css(':host { display: block; }')
      .done();
    // jsdom may not expose adoptedStyleSheets on ShadowRoot — use optional chaining
    const hasAdopted = (shadow.adoptedStyleSheets?.length ?? 0) > 0;
    const hasStyleTag = !!shadow.querySelector('style');
    expect(hasAdopted || hasStyleTag).toBe(true);
  });

  it('falls back to <style> tag when CSSStyleSheet is unavailable', () => {
    const orig = (globalThis as any).CSSStyleSheet;
    (globalThis as any).CSSStyleSheet = undefined;
    try {
      const { shadow } = new ElementBuilder('div')
        .shadow({ mode: 'open' })
        .css(':host { color: red; }')
        .done();
      const styleEl = shadow.querySelector('style');
      expect(styleEl).not.toBeNull();
      expect(styleEl?.textContent).toContain(':host { color: red; }');
    } finally {
      (globalThis as any).CSSStyleSheet = orig;
    }
  });

  it('falls back to <style> tag when replaceSync throws', () => {
    const orig = (globalThis as any).CSSStyleSheet;
    class BrokenSheet {
      replaceSync() {
        throw new Error('not supported');
      }
    }
    (globalThis as any).CSSStyleSheet = BrokenSheet;
    try {
      const { shadow } = new ElementBuilder('div')
        .shadow({ mode: 'open' })
        .css(':host { color: blue; }')
        .done();
      const styleEl = shadow.querySelector('style');
      expect(styleEl).not.toBeNull();
      expect(styleEl?.textContent).toContain(':host { color: blue; }');
    } finally {
      (globalThis as any).CSSStyleSheet = orig;
    }
  });
});

describe('ShadowBuilder — adoptSheet()', () => {
  // jsdom does not implement ShadowRoot.adoptedStyleSheets; skip when unavailable
  const supportsAdoptedSheets = (() => {
    try {
      const root = document.createElement('div').attachShadow({ mode: 'open' });
      return Array.isArray(root.adoptedStyleSheets);
    } catch {
      return false;
    }
  })();

  it.skipIf(!supportsAdoptedSheets)('adds a CSSStyleSheet to adoptedStyleSheets', () => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync('span { color: red; }');
    const { shadow } = new ElementBuilder('div')
      .shadow({ mode: 'open' })
      .adoptSheet(sheet)
      .done();
    expect(shadow.adoptedStyleSheets).toContain(sheet);
  });
});

describe('ShadowBuilder — serialize()', () => {
  it('returns the shadow root innerHTML as a string', () => {
    const sb = new ElementBuilder('div').shadow({ mode: 'open' });
    sb.children(new ElementBuilder('span').text('x'));
    const html = sb.serialize();
    expect(html).toContain('span');
    expect(html).toContain('x');
  });
});
