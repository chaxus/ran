/**
 * Tests for ElementBuilder and ShadowBuilder in SSR (Node.js) environment.
 * isSSR === true here, so HTMLElementMock / ShadowRootMock code paths are exercised.
 */
import { describe, it, expect } from 'vitest';
import { createRef, ElementBuilder, For, Index, Show, Switch, Match } from '@/utils/builder/core';
import { HTMLElementMock, ShadowRootMock } from '@/utils/builder/mocks';

// ---------------------------------------------------------------------------
// createRef
// ---------------------------------------------------------------------------

describe('createRef (SSR)', () => {
  it('returns { current: null }', () => {
    expect(createRef()).toEqual({ current: null });
  });
});

// ---------------------------------------------------------------------------
// ElementBuilder in SSR mode
// ---------------------------------------------------------------------------

describe('ElementBuilder (SSR) — construction', () => {
  it('build() returns an HTMLElementMock', () => {
    const el = new ElementBuilder('div').build();
    expect(el).toBeInstanceOf(HTMLElementMock);
  });

  it('tagName is lowercased', () => {
    const el = new ElementBuilder('SPAN').build() as unknown as HTMLElementMock;
    expect(el.tagName).toBe('span');
  });
});

describe('ElementBuilder (SSR) — id()', () => {
  it('sets id attribute on the mock', () => {
    const el = new ElementBuilder('div').id('root').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('id')).toBe('root');
  });
});

describe('ElementBuilder (SSR) — class()', () => {
  it('sets class attribute on the mock', () => {
    const el = new ElementBuilder('div').class('box').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('class')).toBe('box');
  });
});

describe('ElementBuilder (SSR) — addClass() / removeClass()', () => {
  it('adds classes', () => {
    const el = new ElementBuilder('div').addClass('a', 'b').build() as unknown as HTMLElementMock;
    expect(el.classList.contains('a')).toBe(true);
    expect(el.classList.contains('b')).toBe(true);
  });

  it('removes a class', () => {
    const el = new ElementBuilder('div').addClass('a', 'b').removeClass('a').build() as unknown as HTMLElementMock;
    expect(el.classList.contains('a')).toBe(false);
    expect(el.classList.contains('b')).toBe(true);
  });
});

describe('ElementBuilder (SSR) — attr() / part() / data()', () => {
  it('attr() sets arbitrary attribute', () => {
    const el = new ElementBuilder('input').attr('type', 'checkbox').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('type')).toBe('checkbox');
  });

  it('attrs() sets multiple attributes and skips nullish values', () => {
    const el = new ElementBuilder('input')
      .attrs({ type: 'email', disabled: '', placeholder: undefined, name: null })
      .build() as unknown as HTMLElementMock;
    expect(el.getAttribute('type')).toBe('email');
    expect(el.hasAttribute('disabled')).toBe(true);
    expect(el.hasAttribute('placeholder')).toBe(false);
    expect(el.hasAttribute('name')).toBe(false);
  });

  it('boolAttr() toggles an attribute', () => {
    const el = new ElementBuilder('button')
      .boolAttr('disabled', true)
      .boolAttr('hidden', false)
      .build() as unknown as HTMLElementMock;
    expect(el.hasAttribute('disabled')).toBe(true);
    expect(el.hasAttribute('hidden')).toBe(false);
  });

  it('part() sets part attribute', () => {
    const el = new ElementBuilder('div').part('label').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('part')).toBe('label');
  });

  it('data() sets data-* attribute', () => {
    const el = new ElementBuilder('div').data('count', '5').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('data-count')).toBe('5');
  });
});

describe('ElementBuilder (SSR) — style()', () => {
  it('style(key, value) stores in inlineStyles', () => {
    const el = new ElementBuilder('div').style('color', 'red').build() as unknown as HTMLElementMock;
    expect(el.inlineStyles.get('color')).toBe('red');
  });

  it('style(map) stores all entries', () => {
    const el = new ElementBuilder('div')
      .style({ 'background-color': 'blue', color: 'white' })
      .build() as unknown as HTMLElementMock;
    expect(el.inlineStyles.get('background-color')).toBe('blue');
    expect(el.inlineStyles.get('color')).toBe('white');
  });

  it('cssVar() stores a CSS custom property', () => {
    const el = new ElementBuilder('div').cssVar('ran-x', '12px').build() as unknown as HTMLElementMock;
    expect(el.inlineStyles.get('--ran-x')).toBe('12px');
  });
});

describe('ElementBuilder (SSR) — ARIA helpers', () => {
  it('aria() sets aria-* attribute', () => {
    const el = new ElementBuilder('div').aria('live', 'polite').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('aria-live')).toBe('polite');
  });

  it('role() sets role', () => {
    const el = new ElementBuilder('div').role('alert').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('role')).toBe('alert');
  });

  it('tabIndex() sets tabindex', () => {
    const el = new ElementBuilder('div').tabIndex(-1).build() as unknown as HTMLElementMock;
    expect(el.getAttribute('tabindex')).toBe('-1');
  });

  it('label() sets aria-label', () => {
    const el = new ElementBuilder('button').label('Submit').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('aria-label')).toBe('Submit');
  });

  it('ariaHidden() defaults to true', () => {
    const el = new ElementBuilder('div').ariaHidden().build() as unknown as HTMLElementMock;
    expect(el.getAttribute('aria-hidden')).toBe('true');
  });

  it('ariaHidden(false) sets false', () => {
    const el = new ElementBuilder('div').ariaHidden(false).build() as unknown as HTMLElementMock;
    expect(el.getAttribute('aria-hidden')).toBe('false');
  });
});

describe('ElementBuilder (SSR) — text()', () => {
  it('sets textContent on mock', () => {
    const el = new ElementBuilder('p').text('hello').build() as unknown as HTMLElementMock;
    expect(el.textContent).toBe('hello');
  });
});

describe('ElementBuilder (SSR) — children()', () => {
  it('appends ElementBuilder child', () => {
    const inner = new ElementBuilder('span').text('hi');
    const el = new ElementBuilder('div').children(inner).build() as unknown as HTMLElementMock;
    expect(el.childrenList).toHaveLength(1);
    expect((el.childrenList[0] as HTMLElementMock).tagName).toBe('span');
  });

  it('appends string child', () => {
    const el = new ElementBuilder('div').children('raw text').build() as unknown as HTMLElementMock;
    expect(el.childrenList[0]).toBe('raw text');
  });

  it('ignores null and undefined', () => {
    const el = new ElementBuilder('div').children(null, undefined).build() as unknown as HTMLElementMock;
    expect(el.childrenList).toHaveLength(0);
  });

  it('flattens nested array', () => {
    const el = new ElementBuilder('ul')
      .children([new ElementBuilder('li').text('a'), new ElementBuilder('li').text('b')])
      .build() as unknown as HTMLElementMock;
    expect(el.childrenList).toHaveLength(2);
  });

  it('replaceChildren() clears previous children and appends new children', () => {
    const el = new ElementBuilder('div')
      .children(new ElementBuilder('span').text('old'))
      .replaceChildren(new ElementBuilder('strong').text('new'))
      .build() as unknown as HTMLElementMock;
    expect(el.childrenList).toHaveLength(1);
    expect((el.childrenList[0] as HTMLElementMock).tagName).toBe('strong');
  });

  it('evaluates a getter child once as a static snapshot (single node)', () => {
    const el = new ElementBuilder('div')
      .children(() => new ElementBuilder('span').text('reactive'))
      .build() as unknown as HTMLElementMock;
    expect(el.childrenList).toHaveLength(1);
    expect((el.childrenList[0] as HTMLElementMock).tagName).toBe('span');
  });

  it('evaluates a getter child that returns an array (snapshot list)', () => {
    const el = new ElementBuilder('ul')
      .children(() => ['a', 'b'].map((t) => new ElementBuilder('li').text(t)))
      .build() as unknown as HTMLElementMock;
    expect(el.childrenList).toHaveLength(2);
    expect((el.childrenList[0] as HTMLElementMock).tagName).toBe('li');
  });

  it('renders For() once as a static snapshot on SSR', () => {
    const el = new ElementBuilder('ul')
      .children(
        For({
          each: () => [{ id: 'x' }, { id: 'y' }],
          key: (r) => r.id,
          render: (r, index) => new ElementBuilder('li').text(() => `${index()}:${r.id}`),
        }),
      )
      .build() as unknown as HTMLElementMock;
    expect(el.childrenList).toHaveLength(2);
    expect((el.childrenList[0] as HTMLElementMock).tagName).toBe('li');
    expect(el.serialize()).toContain('0:x');
    expect(el.serialize()).toContain('1:y');
  });

  it('renders Index() once as a static snapshot on SSR', () => {
    const el = new ElementBuilder('ul')
      .children(Index({ each: () => [10, 20], render: (n, i) => new ElementBuilder('li').text(() => `${i}:${n()}`) }))
      .build() as unknown as HTMLElementMock;
    expect(el.childrenList).toHaveLength(2);
    expect(el.serialize()).toContain('0:10');
    expect(el.serialize()).toContain('1:20');
  });

  it('renders Show() truthy branch as a snapshot on SSR', () => {
    const el = new ElementBuilder('div')
      .children(Show({ when: () => true, children: () => new ElementBuilder('span').text('on') }))
      .build() as unknown as HTMLElementMock;
    expect(el.serialize()).toContain('on');
  });

  it('renders the matching Switch() branch as a snapshot on SSR', () => {
    const el = new ElementBuilder('div')
      .children(
        Switch({
          fallback: () => new ElementBuilder('em').text('idle'),
          children: [Match({ when: () => true, children: () => new ElementBuilder('span').text('hit') })],
        }),
      )
      .build() as unknown as HTMLElementMock;
    expect(el.serialize()).toContain('hit');
    expect(el.serialize()).not.toContain('idle');
  });
});

describe('ElementBuilder (SSR) — ref()', () => {
  it('populates ref.current', () => {
    const ref = createRef();
    const built = new ElementBuilder('div').ref(ref).build();
    expect(ref.current).toBe(built);
  });
});

// ---------------------------------------------------------------------------
// ElementBuilder — serialize() in SSR
// ---------------------------------------------------------------------------

describe('ElementBuilder (SSR) — serialize()', () => {
  it('serializes a simple element', () => {
    expect(new ElementBuilder('div').serialize()).toBe('<div></div>');
  });

  it('serializes id attribute', () => {
    expect(new ElementBuilder('section').id('hero').serialize()).toContain('id="hero"');
  });

  it('serializes class', () => {
    expect(new ElementBuilder('div').class('box').serialize()).toContain('class="box"');
  });

  it('serializes text content (escaped)', () => {
    const html = new ElementBuilder('p').text('a & <b>').serialize();
    expect(html).toBe('<p>a &amp; &lt;b&gt;</p>');
  });

  it('serializes nested children', () => {
    const html = new ElementBuilder('ul').children(new ElementBuilder('li').text('item')).serialize();
    expect(html).toBe('<ul><li>item</li></ul>');
  });

  it('serializes inline styles', () => {
    const html = new ElementBuilder('div').style('color', 'red').serialize();
    expect(html).toContain('style="color:red"');
  });

  it('serializes self-closing input', () => {
    const html = new ElementBuilder('input').attr('type', 'text').serialize();
    expect(html).toMatch(/^<input.*\/>$/);
  });

  it('serializes ARIA attributes', () => {
    const html = new ElementBuilder('div').aria('hidden', 'true').role('dialog').serialize();
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('role="dialog"');
  });
});

// ---------------------------------------------------------------------------
// ShadowBuilder in SSR mode
// ---------------------------------------------------------------------------

describe('ShadowBuilder (SSR) — css()', () => {
  it('stores CSS in adoptedStyleSheets on ShadowRootMock', () => {
    const sb = new ElementBuilder('div').shadow({ mode: 'closed' });
    sb.css(':host { display:block }');
    const { shadow } = sb.done();
    const mock = shadow as unknown as ShadowRootMock;
    expect(mock.adoptedStyleSheets).toContain(':host { display:block }');
  });

  it('chains multiple css() calls', () => {
    const sb = new ElementBuilder('div').shadow({ mode: 'open' }).css('a { color: red; }').css('b { color: blue; }');
    const { shadow } = sb.done();
    const mock = shadow as unknown as ShadowRootMock;
    expect(mock.adoptedStyleSheets).toHaveLength(2);
  });
});

describe('ShadowBuilder (SSR) — children()', () => {
  it('appends ElementBuilder child into shadow root mock', () => {
    const { shadow } = new ElementBuilder('div')
      .shadow({ mode: 'open' })
      .children(new ElementBuilder('span').text('x'))
      .done();
    const mock = shadow as unknown as ShadowRootMock;
    expect(mock.childrenList).toHaveLength(1);
  });

  it('appends string child', () => {
    const { shadow } = new ElementBuilder('div').shadow({ mode: 'open' }).children('raw').done();
    const mock = shadow as unknown as ShadowRootMock;
    expect(mock.childrenList[0]).toBe('raw');
  });
});

describe('ShadowBuilder (SSR) — serialize()', () => {
  it('produces DSD template wrapping shadow content', () => {
    const sb = new ElementBuilder('div')
      .shadow({ mode: 'closed' })
      .css(':host {}')
      .children(new ElementBuilder('slot'));
    const html = sb.serialize();
    expect(html).toContain('<template shadowrootmode="closed">');
    expect(html).toContain('<style>');
    expect(html).toContain('<slot></slot>');
    expect(html).toContain('</template>');
  });
});

describe('ShadowBuilder (SSR) — done()', () => {
  it('returns host and shadow', () => {
    const { host, shadow } = new ElementBuilder('article').shadow({ mode: 'open' }).done();
    expect((host as unknown as HTMLElementMock).tagName).toBe('article');
    expect(shadow).toBeInstanceOf(ShadowRootMock);
  });
});

describe('Composition (SSR) — Show/Switch containing For', () => {
  it('Show returning a For renders the list snapshot on SSR', () => {
    const el = new ElementBuilder('ul')
      .children(
        Show({
          when: () => true,
          children: () =>
            For({
              each: () => [{ id: 'a' }, { id: 'b' }],
              key: (r) => r.id,
              render: (r) => new ElementBuilder('li').text(r.id),
            }),
        }),
      )
      .build() as unknown as HTMLElementMock;
    const html = el.serialize();
    expect(html).toContain('<li');
    expect(html).toContain('a');
    expect(html).toContain('b');
    expect(html).not.toContain('[object');
  });

  it('Switch fallback returning For renders on SSR', () => {
    const el = new ElementBuilder('div')
      .children(
        Switch({
          fallback: () =>
            For({
              each: () => [{ id: 1 }],
              key: (r) => r.id,
              render: (r) => new ElementBuilder('span').text(`${r.id}`),
            }),
          children: [Match({ when: () => false, children: () => new ElementBuilder('em').text('x') })],
        }),
      )
      .build() as unknown as HTMLElementMock;
    expect(el.serialize()).toContain('<span');
    expect(el.serialize()).not.toContain('[object');
  });
});
