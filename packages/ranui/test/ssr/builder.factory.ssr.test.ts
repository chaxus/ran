/**
 * Factory function tests in SSR (Node.js) environment.
 * Verifies each factory creates the correct tag and that DeclarativeShadow
 * produces the expected attributes.
 */
import { describe, it, expect } from 'vitest';
import {
  View,
  Div,
  Span,
  Slot,
  ButtonBuilder,
  InputBuilder,
  Style,
  Label,
  Ul,
  Li,
  Section,
  Article,
  Nav,
  Header,
  Footer,
  Main,
  DeclarativeShadow,
} from '@/utils/builder/factory';
import { ElementBuilder } from '@/utils/builder/core';
import { HTMLElementMock } from '@/utils/builder/mocks';

// ---------------------------------------------------------------------------
// View (generic factory)
// ---------------------------------------------------------------------------

describe('View()', () => {
  it('returns an ElementBuilder', () => {
    expect(View('div')).toBeInstanceOf(ElementBuilder);
  });

  it('creates element with the given tag', () => {
    const el = View('article').build() as unknown as HTMLElementMock;
    expect(el.tagName).toBe('article');
  });
});

// ---------------------------------------------------------------------------
// Semantic factory functions
// ---------------------------------------------------------------------------

const semanticCases: Array<[() => ElementBuilder<any>, string]> = [
  [Div, 'div'],
  [Span, 'span'],
  [Slot, 'slot'],
  [ButtonBuilder, 'button'],
  [InputBuilder, 'input'],
  [Style, 'style'],
  [Label, 'label'],
  [Ul, 'ul'],
  [Li, 'li'],
  [Section, 'section'],
  [Article, 'article'],
  [Nav, 'nav'],
  [Header, 'header'],
  [Footer, 'footer'],
  [Main, 'main'],
];

describe('semantic factory functions', () => {
  semanticCases.forEach(([factory, expectedTag]) => {
    it(`${factory.name || expectedTag}() creates <${expectedTag}>`, () => {
      const el = factory().build() as unknown as HTMLElementMock;
      expect(el.tagName).toBe(expectedTag);
    });

    it(`${factory.name || expectedTag}() returns an ElementBuilder`, () => {
      expect(factory()).toBeInstanceOf(ElementBuilder);
    });

    it(`${factory.name || expectedTag}() returns a new instance each call`, () => {
      expect(factory()).not.toBe(factory());
    });
  });
});

// ---------------------------------------------------------------------------
// DeclarativeShadow
// ---------------------------------------------------------------------------

describe('DeclarativeShadow()', () => {
  it('defaults to open mode', () => {
    const el = DeclarativeShadow().build() as unknown as HTMLElementMock;
    expect(el.getAttribute('shadowrootmode')).toBe('open');
  });

  it('closed mode is respected', () => {
    const el = DeclarativeShadow('closed').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('shadowrootmode')).toBe('closed');
  });

  it('does not set shadowrootdelegatesfocus by default', () => {
    const el = DeclarativeShadow('open').build() as unknown as HTMLElementMock;
    expect(el.hasAttribute('shadowrootdelegatesfocus')).toBe(false);
  });

  it('sets shadowrootdelegatesfocus when delegatesFocus=true', () => {
    const el = DeclarativeShadow('open', true).build() as unknown as HTMLElementMock;
    expect(el.hasAttribute('shadowrootdelegatesfocus')).toBe(true);
  });

  it('returns an ElementBuilder for a template element', () => {
    const tpl = DeclarativeShadow().build() as unknown as HTMLElementMock;
    expect(tpl.tagName).toBe('template');
  });

  it('serialize includes correct DSD attributes', () => {
    const html = DeclarativeShadow('open').serialize();
    expect(html).toContain('shadowrootmode="open"');
  });

  it('closed + delegatesFocus serializes both attributes', () => {
    const html = DeclarativeShadow('closed', true).serialize();
    expect(html).toContain('shadowrootmode="closed"');
    expect(html).toContain('shadowrootdelegatesfocus');
  });
});

// ---------------------------------------------------------------------------
// Chaining still works on all factory outputs
// ---------------------------------------------------------------------------

describe('factory builder chaining', () => {
  it('Div() supports class chaining', () => {
    const el = Div().addClass('container').id('app').build() as unknown as HTMLElementMock;
    expect(el.classList.contains('container')).toBe(true);
    expect(el.getAttribute('id')).toBe('app');
  });

  it('ButtonBuilder() supports aria chaining', () => {
    const el = ButtonBuilder().label('Submit').role('button').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('aria-label')).toBe('Submit');
    expect(el.getAttribute('role')).toBe('button');
  });

  it('InputBuilder() supports attr chaining', () => {
    const el = InputBuilder().attr('type', 'email').attr('name', 'user').build() as unknown as HTMLElementMock;
    expect(el.getAttribute('type')).toBe('email');
    expect(el.getAttribute('name')).toBe('user');
  });

  it('Ul() with Li() children serializes correctly', () => {
    const html = Ul()
      .children(Li().text('item 1'), Li().text('item 2'))
      .serialize();
    expect(html).toBe('<ul><li>item 1</li><li>item 2</li></ul>');
  });

  it('Nav() with Span() child serializes correctly', () => {
    const html = Nav().children(Span().text('menu')).serialize();
    expect(html).toBe('<nav><span>menu</span></nav>');
  });
});
