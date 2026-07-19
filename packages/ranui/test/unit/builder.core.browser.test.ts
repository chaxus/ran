/**
 * Tests for ElementBuilder and ShadowBuilder in browser (jsdom) environment.
 * isSSR === false here, so real DOM APIs are exercised.
 */
import { describe, it, expect, vi } from 'vitest';
import { createRef, ElementBuilder, ShadowBuilder, For, Index, Show, Switch, Match } from '@/utils/builder/core';
import { createRoot, signal } from '@/utils/builder/signal';

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

  it('attrs() sets multiple attributes and skips nullish values', () => {
    const el = new ElementBuilder('input')
      .attrs({ type: 'email', disabled: '', placeholder: undefined, name: null })
      .build();
    expect(el.getAttribute('type')).toBe('email');
    expect(el.getAttribute('disabled')).toBe('');
    expect(el.hasAttribute('placeholder')).toBe(false);
    expect(el.hasAttribute('name')).toBe(false);
  });

  it('boolAttr() toggles an attribute', () => {
    const el = new ElementBuilder('button').boolAttr('disabled', true).boolAttr('hidden', false).build();
    expect(el.getAttribute('disabled')).toBe('');
    expect(el.hasAttribute('hidden')).toBe(false);
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
    const el = new ElementBuilder('div').style({ color: 'blue', 'font-size': '16px' }).build();
    expect(el.style.getPropertyValue('color')).toBe('blue');
    expect(el.style.getPropertyValue('font-size')).toBe('16px');
  });

  it('cssVar() sets a CSS custom property', () => {
    const el = new ElementBuilder('div').cssVar('ran-x', '12px').build();
    expect(el.style.getPropertyValue('--ran-x')).toBe('12px');
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
    const el = new ElementBuilder('div').children('text', span, new ElementBuilder('b').text('bold'), null).build();
    expect(el.textContent).toContain('text');
    expect(el.textContent).toContain('bold');
    expect(el.querySelector('em')).toBeTruthy();
  });

  it('replaceChildren() clears previous children and appends new children', () => {
    const el = new ElementBuilder('div')
      .children(new ElementBuilder('span').text('old'))
      .replaceChildren(new ElementBuilder('strong').text('new'))
      .build();
    expect(el.querySelector('span')).toBeNull();
    expect(el.querySelector('strong')?.textContent).toBe('new');
  });
});

// ---------------------------------------------------------------------------
// ElementBuilder — reactive children (getter items)
// ---------------------------------------------------------------------------

describe('ElementBuilder — reactive children()', () => {
  it('renders a getter child and updates it when its signal changes', () => {
    createRoot(() => {
      const [label, setLabel] = signal('a');
      const el = new ElementBuilder('div').children(() => new ElementBuilder('span').text(label())).build();
      expect(el.querySelector('span')?.textContent).toBe('a');
      setLabel('b');
      expect(el.querySelectorAll('span').length).toBe(1);
      expect(el.querySelector('span')?.textContent).toBe('b');
    });
  });

  it('reconciles a reactive list (array from getter) in place', () => {
    createRoot(() => {
      const [items, setItems] = signal(['x', 'y']);
      const el = new ElementBuilder('ul').children(() => items().map((t) => new ElementBuilder('li').text(t))).build();
      expect(el.querySelectorAll('li').length).toBe(2);
      setItems(['x', 'y', 'z']);
      expect(el.querySelectorAll('li').length).toBe(3);
      expect(el.textContent).toBe('xyz');
      setItems([]);
      expect(el.querySelectorAll('li').length).toBe(0);
    });
  });

  it('toggles a conditional child (null ↔ node) without touching static siblings', () => {
    createRoot(() => {
      const [show, setShow] = signal(false);
      const el = new ElementBuilder('div')
        .children(
          new ElementBuilder('header').text('H'),
          () => (show() ? new ElementBuilder('em').text('on') : null),
          new ElementBuilder('footer').text('F'),
        )
        .build();
      // static siblings always present; conditional starts absent
      expect(el.querySelector('header')?.textContent).toBe('H');
      expect(el.querySelector('footer')?.textContent).toBe('F');
      expect(el.querySelector('em')).toBeNull();
      setShow(true);
      expect(el.querySelector('em')?.textContent).toBe('on');
      // inserted between the static siblings, order preserved
      expect(el.textContent).toBe('HonF');
      setShow(false);
      expect(el.querySelector('em')).toBeNull();
      expect(el.textContent).toBe('HF');
    });
  });

  it('disposes reactive-child effects when the owning scope is disposed', () => {
    let el!: HTMLElement;
    const [label, setLabel] = signal('a');
    const dispose = createRoot((d) => {
      el = new ElementBuilder('div').children(() => new ElementBuilder('span').text(label())).build();
      return d;
    });
    expect(el.querySelector('span')?.textContent).toBe('a');
    dispose();
    setLabel('b'); // no owner → binding must not re-run
    expect(el.querySelector('span')?.textContent).toBe('a');
  });
});

// ---------------------------------------------------------------------------
// For — keyed list reconciliation
// ---------------------------------------------------------------------------

describe('For — keyed list', () => {
  it('renders the initial list', () => {
    createRoot(() => {
      const [rows] = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
      const el = new ElementBuilder('ul')
        .children(
          For({ each: () => rows(), key: (r) => r.id, render: (r) => new ElementBuilder('li').text(`${r.id}`) }),
        )
        .build();
      expect([...el.querySelectorAll('li')].map((n) => n.textContent)).toEqual(['1', '2', '3']);
    });
  });

  it('reuses the SAME DOM node for a surviving key across updates', () => {
    createRoot(() => {
      const [rows, setRows] = signal([{ id: 1 }, { id: 2 }]);
      const el = new ElementBuilder('ul')
        .children(
          For({ each: () => rows(), key: (r) => r.id, render: (r) => new ElementBuilder('li').text(`${r.id}`) }),
        )
        .build();
      const liForId1 = [...el.querySelectorAll('li')].find((n) => n.textContent === '1')!;
      // prepend + append — id 1 must keep its node (this is the whole point of keying)
      setRows([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 9 }]);
      const after = [...el.querySelectorAll('li')];
      expect(after.map((n) => n.textContent)).toEqual(['0', '1', '2', '9']);
      expect(after.find((n) => n.textContent === '1')).toBe(liForId1); // same node, not rebuilt
    });
  });

  it('preserves in-node DOM state (e.g. a live property) across reorders', () => {
    createRoot(() => {
      const [rows, setRows] = signal([{ id: 'a' }, { id: 'b' }]);
      const el = new ElementBuilder('ul')
        .children(For({ each: () => rows(), key: (r) => r.id, render: (r) => new ElementBuilder('li').text(r.id) }))
        .build();
      const liA = [...el.querySelectorAll('li')].find((n) => n.textContent === 'a')! as HTMLElement & {
        _state?: string;
      };
      liA._state = 'kept'; // uncontrolled state a rebuild would lose
      setRows([{ id: 'b' }, { id: 'a' }]); // reorder
      const liAAfter = [...el.querySelectorAll('li')].find((n) => n.textContent === 'a')! as HTMLElement & {
        _state?: string;
      };
      expect(el.textContent).toBe('ba'); // reordered in the DOM
      expect(liAAfter).toBe(liA); // same node
      expect(liAAfter._state).toBe('kept'); // state survived
    });
  });

  it('removes and disposes nodes whose key disappears', () => {
    createRoot(() => {
      const [rows, setRows] = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
      const disposed: number[] = [];
      const el = new ElementBuilder('ul')
        .children(
          For({
            each: () => rows(),
            key: (r) => r.id,
            render: (r) => {
              // per-item effect cleanup fires on removal (scope disposed)
              const [, setX] = signal(0);
              void setX;
              const li = new ElementBuilder('li').text(`${r.id}`).build();
              return li;
            },
          }),
        )
        .build();
      void disposed;
      expect(el.querySelectorAll('li').length).toBe(3);
      setRows([{ id: 1 }, { id: 3 }]);
      expect([...el.querySelectorAll('li')].map((n) => n.textContent)).toEqual(['1', '3']);
      setRows([]);
      expect(el.querySelectorAll('li').length).toBe(0);
    });
  });

  it('exposes a reactive index that tracks the item after reorder', () => {
    createRoot(() => {
      const [rows, setRows] = signal([{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
      const el = new ElementBuilder('ol')
        .children(
          For({
            each: () => rows(),
            key: (r) => r.id,
            render: (r, index) => new ElementBuilder('li').text(() => `${index()}:${r.id}`),
          }),
        )
        .build();
      expect([...el.querySelectorAll('li')].map((n) => n.textContent)).toEqual(['0:a', '1:b', '2:c']);
      setRows([{ id: 'c' }, { id: 'a' }, { id: 'b' }]); // rotate
      // reused nodes, but their index accessor re-ran → labels updated
      expect([...el.querySelectorAll('li')].map((n) => n.textContent)).toEqual(['0:c', '1:a', '2:b']);
    });
  });

  it('disposes all item scopes when the owning scope is disposed', () => {
    let el!: HTMLElement;
    const [rows, setRows] = signal([{ id: 1 }]);
    let itemEffectRuns = 0;
    const dispose = createRoot((d) => {
      el = new ElementBuilder('ul')
        .children(
          For({
            each: () => rows(),
            key: (r) => r.id,
            render: (r) => {
              const [tick, setTick] = signal(0);
              const li = new ElementBuilder('li').text(() => `${r.id}:${tick()}`).build();
              // expose a way to bump this item's own signal after teardown
              (li as HTMLElement & { _bump?: () => void })._bump = () => setTick((n) => n + 1);
              itemEffectRuns++;
              return li;
            },
          }),
        )
        .build();
      return d;
    });
    const li = el.querySelector('li') as HTMLElement & { _bump?: () => void };
    expect(li.textContent).toBe('1:0');
    dispose();
    // after dispose, list no longer reacts
    setRows([{ id: 1 }, { id: 2 }]);
    expect(el.querySelectorAll('li').length).toBe(1); // list effect gone
    expect(itemEffectRuns).toBe(1);
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
    new ElementBuilder('button').on('click', () => {});
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
    const { shadow } = new ElementBuilder('div').shadow({ mode: 'open' }).children(span).done();
    expect(shadow.querySelector('span')).toBe(span);
  });

  it('ignores null and undefined', () => {
    const { shadow } = new ElementBuilder('div').shadow({ mode: 'open' }).children(null, undefined).done();
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
    const { shadow } = new ElementBuilder('div').shadow({ mode: 'open' }).css(':host { display: block; }').done();
    // jsdom may not expose adoptedStyleSheets on ShadowRoot — use optional chaining
    const hasAdopted = (shadow.adoptedStyleSheets?.length ?? 0) > 0;
    const hasStyleTag = !!shadow.querySelector('style');
    expect(hasAdopted || hasStyleTag).toBe(true);
  });

  it('falls back to <style> tag when CSSStyleSheet is unavailable', () => {
    const orig = (globalThis as any).CSSStyleSheet;
    (globalThis as any).CSSStyleSheet = undefined;
    try {
      const { shadow } = new ElementBuilder('div').shadow({ mode: 'open' }).css(':host { color: red; }').done();
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
      const { shadow } = new ElementBuilder('div').shadow({ mode: 'open' }).css(':host { color: blue; }').done();
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
    const { shadow } = new ElementBuilder('div').shadow({ mode: 'open' }).adoptSheet(sheet).done();
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

// ---------------------------------------------------------------------------
// For — duplicate-key safety
// ---------------------------------------------------------------------------

describe('For — duplicate keys', () => {
  it('ignores the duplicate (no leak, deterministic) and warns', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      createRoot(() => {
        const [rows, setRows] = signal([
          { id: 1, v: 'a' },
          { id: 1, v: 'b' },
        ]);
        const el = new ElementBuilder('ul')
          .children(For({ each: () => rows(), key: (r) => r.id, render: (r) => new ElementBuilder('li').text(r.v) }))
          .build();
        // only the first occurrence of key 1 renders — no orphaned node
        expect(el.querySelectorAll('li').length).toBe(1);
        expect(el.querySelector('li')?.textContent).toBe('a');
        expect(spy).toHaveBeenCalled();
        // a later clean update still reconciles correctly (no stale leak)
        setRows([
          { id: 1, v: 'a' },
          { id: 2, v: 'c' },
        ]);
        expect([...el.querySelectorAll('li')].map((n) => n.textContent)).toEqual(['a', 'c']);
      });
    } finally {
      spy.mockRestore();
    }
  });
});

// ---------------------------------------------------------------------------
// Show — fine-grained conditional
// ---------------------------------------------------------------------------

describe('Show — conditional', () => {
  it('renders children when truthy, fallback when falsy', () => {
    createRoot(() => {
      const [on, setOn] = signal(true);
      const el = new ElementBuilder('div')
        .children(
          Show({
            when: () => on(),
            children: () => new ElementBuilder('span').text('yes'),
            fallback: () => new ElementBuilder('em').text('no'),
          }),
        )
        .build();
      expect(el.querySelector('span')?.textContent).toBe('yes');
      expect(el.querySelector('em')).toBeNull();
      setOn(false);
      expect(el.querySelector('span')).toBeNull();
      expect(el.querySelector('em')?.textContent).toBe('no');
    });
  });

  it('renders nothing when falsy and no fallback', () => {
    createRoot(() => {
      const [on, setOn] = signal(false);
      const el = new ElementBuilder('div')
        .children(Show({ when: () => on(), children: () => new ElementBuilder('span').text('x') }))
        .build();
      expect(el.querySelector('span')).toBeNull();
      setOn(true);
      expect(el.querySelector('span')?.textContent).toBe('x');
    });
  });

  it('is FINE-GRAINED: does not rebuild the branch when when() changes but truthiness holds', () => {
    createRoot(() => {
      // when() returns a truthy count; toggling 1 -> 2 keeps it truthy
      const [count, setCount] = signal(1);
      let builds = 0;
      const el = new ElementBuilder('div')
        .children(
          Show({
            when: () => count() > 0,
            children: () => {
              builds++;
              return new ElementBuilder('span').text(() => `count=${count()}`);
            },
          }),
        )
        .build();
      expect(builds).toBe(1);
      const span = el.querySelector('span')!;
      expect(span.textContent).toBe('count=1');

      setCount(2); // still truthy → branch NOT rebuilt, only the text binding updates
      expect(builds).toBe(1); // <- the whole point: no re-render of the branch
      expect(el.querySelector('span')).toBe(span); // same node
      expect(span.textContent).toBe('count=2'); // inner binding updated

      setCount(0); // truthiness flips → branch torn down
      expect(el.querySelector('span')).toBeNull();
      setCount(5); // flips back → rebuilt once
      expect(builds).toBe(2);
    });
  });
});

// ---------------------------------------------------------------------------
// Index — position-keyed list
// ---------------------------------------------------------------------------

describe('Index — position-keyed list', () => {
  it('renders the initial list with static index', () => {
    createRoot(() => {
      const [nums] = signal([10, 20, 30]);
      const el = new ElementBuilder('ul')
        .children(Index({ each: () => nums(), render: (n, i) => new ElementBuilder('li').text(() => `${i}:${n()}`) }))
        .build();
      expect([...el.querySelectorAll('li')].map((n) => n.textContent)).toEqual(['0:10', '1:20', '2:30']);
    });
  });

  it('reuses the node at a position and updates its item signal in place', () => {
    createRoot(() => {
      const [nums, setNums] = signal([10, 20]);
      const el = new ElementBuilder('ul')
        .children(Index({ each: () => nums(), render: (n) => new ElementBuilder('li').text(() => `${n()}`) }))
        .build();
      const li0 = el.querySelectorAll('li')[0];
      setNums([99, 20]); // change value at index 0
      expect(el.querySelectorAll('li')[0]).toBe(li0); // same node (position reused)
      expect(li0.textContent).toBe('99'); // item signal updated in place
    });
  });

  it('grows and shrinks (appends new slots, disposes trailing ones)', () => {
    createRoot(() => {
      const [nums, setNums] = signal([1, 2]);
      const el = new ElementBuilder('ul')
        .children(Index({ each: () => nums(), render: (n) => new ElementBuilder('li').text(() => `${n()}`) }))
        .build();
      expect(el.querySelectorAll('li').length).toBe(2);
      setNums([1, 2, 3, 4]);
      expect([...el.querySelectorAll('li')].map((n) => n.textContent)).toEqual(['1', '2', '3', '4']);
      setNums([1]);
      expect([...el.querySelectorAll('li')].map((n) => n.textContent)).toEqual(['1']);
    });
  });
});

// ---------------------------------------------------------------------------
// Switch / Match — fine-grained multi-branch
// ---------------------------------------------------------------------------

describe('Switch / Match', () => {
  it('renders the first matching branch, else fallback', () => {
    createRoot(() => {
      const [status, setStatus] = signal('idle');
      const el = new ElementBuilder('div')
        .children(
          Switch({
            fallback: () => new ElementBuilder('em').text('idle'),
            children: [
              Match({ when: () => status() === 'loading', children: () => new ElementBuilder('span').text('spin') }),
              Match({ when: () => status() === 'error', children: () => new ElementBuilder('b').text('err') }),
            ],
          }),
        )
        .build();
      expect(el.querySelector('em')?.textContent).toBe('idle'); // fallback
      setStatus('loading');
      expect(el.querySelector('span')?.textContent).toBe('spin');
      expect(el.querySelector('em')).toBeNull();
      setStatus('error');
      expect(el.querySelector('b')?.textContent).toBe('err');
      expect(el.querySelector('span')).toBeNull();
    });
  });

  it('is FINE-GRAINED: rebuilds only when the winning branch changes', () => {
    createRoot(() => {
      const [n, setN] = signal(5);
      let loadingBuilds = 0;
      const el = new ElementBuilder('div')
        .children(
          Switch({
            children: [
              Match({
                when: () => n() > 0, // stays true for 5 -> 7
                children: () => {
                  loadingBuilds++;
                  return new ElementBuilder('span').text(() => `n=${n()}`);
                },
              }),
            ],
          }),
        )
        .build();
      expect(loadingBuilds).toBe(1);
      const span = el.querySelector('span')!;
      setN(7); // winner unchanged (still branch 0) → no rebuild
      expect(loadingBuilds).toBe(1);
      expect(el.querySelector('span')).toBe(span);
      expect(span.textContent).toBe('n=7'); // inner binding updated
      setN(-1); // no branch matches → fallback (none) → span removed
      expect(el.querySelector('span')).toBeNull();
    });
  });
});

// ---------------------------------------------------------------------------
// Composition — control flow nests freely (Show/Switch return For/Index/getter)
// ---------------------------------------------------------------------------

describe('Composition — Show/Switch containing For/Index', () => {
  it('Show can return a For directly (no wrapper element)', () => {
    createRoot(() => {
      const [on, setOn] = signal(false);
      const [rows] = signal([{ id: 1 }, { id: 2 }, { id: 3 }]);
      const el = new ElementBuilder('ul')
        .children(
          Show({
            when: () => on(),
            children: () =>
              For({ each: () => rows(), key: (r) => r.id, render: (r) => new ElementBuilder('li').text(`${r.id}`) }),
            fallback: () => new ElementBuilder('p').text('off'),
          }),
        )
        .build();
      // falsy branch first — no list, no "[object Object]"
      expect(el.querySelector('p')?.textContent).toBe('off');
      expect(el.querySelectorAll('li').length).toBe(0);
      expect(el.textContent).not.toContain('[object');
      // flip on → the For list mounts directly
      setOn(true);
      expect(el.querySelector('p')).toBeNull();
      expect([...el.querySelectorAll('li')].map((n) => n.textContent)).toEqual(['1', '2', '3']);
    });
  });

  it('disposes the nested For scope when the branch flips away', () => {
    createRoot(() => {
      const [on, setOn] = signal(true);
      const [rows, setRows] = signal([{ id: 1 }]);
      const el = new ElementBuilder('ul')
        .children(
          Show({
            when: () => on(),
            children: () =>
              For({ each: () => rows(), key: (r) => r.id, render: (r) => new ElementBuilder('li').text(`${r.id}`) }),
          }),
        )
        .build();
      expect(el.querySelectorAll('li').length).toBe(1);
      setOn(false); // branch torn down → For scope disposed, nodes removed
      expect(el.querySelectorAll('li').length).toBe(0);
      // updating the (now-orphaned) source must not resurrect anything
      setRows([{ id: 1 }, { id: 2 }]);
      expect(el.querySelectorAll('li').length).toBe(0);
      setOn(true); // re-enter → rebuilt fresh from current source
      expect(el.querySelectorAll('li').length).toBe(2);
    });
  });

  it('Switch branch can return an Index list', () => {
    createRoot(() => {
      const [mode, setMode] = signal<'list' | 'empty'>('empty');
      const [nums] = signal([7, 8]);
      const el = new ElementBuilder('div')
        .children(
          Switch({
            fallback: () => new ElementBuilder('span').text('none'),
            children: [
              Match({
                when: () => mode() === 'list',
                children: () =>
                  Index({ each: () => nums(), render: (n) => new ElementBuilder('b').text(() => `${n()}`) }),
              }),
            ],
          }),
        )
        .build();
      expect(el.querySelector('span')?.textContent).toBe('none');
      setMode('list');
      expect([...el.querySelectorAll('b')].map((n) => n.textContent)).toEqual(['7', '8']);
      expect(el.querySelector('span')).toBeNull();
    });
  });

  it('nests Show inside Show', () => {
    createRoot(() => {
      const [a, setA] = signal(false);
      const [b, setB] = signal(false);
      const el = new ElementBuilder('div')
        .children(
          Show({
            when: () => a(),
            children: () => Show({ when: () => b(), children: () => new ElementBuilder('i').text('both') }),
          }),
        )
        .build();
      expect(el.querySelector('i')).toBeNull();
      setB(true);
      expect(el.querySelector('i')).toBeNull(); // outer still false
      setA(true);
      expect(el.querySelector('i')?.textContent).toBe('both'); // both true
      setA(false);
      expect(el.querySelector('i')).toBeNull();
    });
  });
});
