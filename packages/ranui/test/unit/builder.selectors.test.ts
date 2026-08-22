import { describe, it, expect } from 'vitest';
import { matchSelector, collectMatches } from '@/utils/builder/selectors';
import { HTMLElementMock } from '@/utils/builder/mocks';

// helpers
function el(tag: string): HTMLElementMock {
  return new HTMLElementMock(tag);
}

describe('matchSelector — tag name', () => {
  it('matches exact tag name', () => {
    expect(matchSelector(el('div'), 'div')).toBe(true);
  });

  it('does not match wrong tag', () => {
    expect(matchSelector(el('div'), 'span')).toBe(false);
  });

  it('selector is also lowercased, so DIV matches div tagName', () => {
    const node = el('DIV'); // constructor lowercases to 'div'
    expect(matchSelector(node, 'div')).toBe(true);
    // matchSelector does trimmed.toLowerCase(), so 'DIV' → 'div' also matches
    expect(matchSelector(node, 'DIV')).toBe(true);
  });
});

describe('matchSelector — class selector', () => {
  it('matches a single class', () => {
    const node = el('div');
    node.classList.add('foo');
    expect(matchSelector(node, '.foo')).toBe(true);
  });

  it('does not match absent class', () => {
    const node = el('div');
    node.classList.add('foo');
    expect(matchSelector(node, '.bar')).toBe(false);
  });

  it('matches one of multiple classes', () => {
    const node = el('div');
    node.classList.add('foo', 'bar', 'baz');
    expect(matchSelector(node, '.bar')).toBe(true);
  });

  it('does not match partial class name', () => {
    const node = el('div');
    node.classList.add('foobar');
    expect(matchSelector(node, '.foo')).toBe(false);
  });
});

describe('matchSelector — id selector', () => {
  it('matches correct id', () => {
    const node = el('div');
    node.setAttribute('id', 'myId');
    expect(matchSelector(node, '#myId')).toBe(true);
  });

  it('does not match wrong id', () => {
    const node = el('div');
    node.setAttribute('id', 'myId');
    expect(matchSelector(node, '#other')).toBe(false);
  });

  it('does not match when no id is set', () => {
    expect(matchSelector(el('div'), '#foo')).toBe(false);
  });
});

describe('matchSelector — attribute selector', () => {
  it('matches attribute presence [attr]', () => {
    const node = el('button');
    node.setAttribute('disabled', '');
    expect(matchSelector(node, '[disabled]')).toBe(true);
  });

  it('returns false for absent attribute', () => {
    expect(matchSelector(el('button'), '[disabled]')).toBe(false);
  });

  it('matches attribute with value [attr=val]', () => {
    const node = el('input');
    node.setAttribute('type', 'text');
    expect(matchSelector(node, '[type=text]')).toBe(true);
  });

  it('matches attribute with double-quoted value', () => {
    const node = el('input');
    node.setAttribute('type', 'text');
    expect(matchSelector(node, '[type="text"]')).toBe(true);
  });

  it('matches attribute with single-quoted value', () => {
    const node = el('input');
    node.setAttribute('type', 'text');
    expect(matchSelector(node, "[type='text']")).toBe(true);
  });

  it('does not match wrong attribute value', () => {
    const node = el('input');
    node.setAttribute('type', 'text');
    expect(matchSelector(node, '[type=email]')).toBe(false);
  });

  it('handles attribute key with no value (presence check)', () => {
    const node = el('div');
    node.setAttribute('data-active', 'true');
    expect(matchSelector(node, '[data-active]')).toBe(true);
  });
});

describe('matchSelector — edge cases', () => {
  it('returns false for empty selector string', () => {
    expect(matchSelector(el('div'), '')).toBe(false);
  });

  it('returns false for whitespace-only selector', () => {
    expect(matchSelector(el('div'), '   ')).toBe(false);
  });
});

describe('collectMatches', () => {
  it('collects matching elements from a flat list', () => {
    const parent = el('div');
    const s1 = el('span');
    const s2 = el('span');
    const d1 = el('div');
    parent.appendChild(s1);
    parent.appendChild(s2);
    parent.appendChild(d1);

    const result: HTMLElementMock[] = [];
    collectMatches(parent.childrenList as any, 'span', result);
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(s1);
    expect(result[1]).toBe(s2);
  });

  it('recursively collects nested matches', () => {
    const root = el('div');
    const section = el('section');
    const nested = el('span');
    section.appendChild(nested);
    root.appendChild(section);

    const result: HTMLElementMock[] = [];
    collectMatches(root.childrenList as any, 'span', result);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(nested);
  });

  it('collects matches at multiple nesting levels', () => {
    const root = el('div');
    const s1 = el('span');
    const child = el('section');
    const s2 = el('span');
    const grandchild = el('article');
    const s3 = el('span');

    grandchild.appendChild(s3);
    child.appendChild(s2);
    child.appendChild(grandchild);
    root.appendChild(s1);
    root.appendChild(child);

    const result: HTMLElementMock[] = [];
    collectMatches(root.childrenList as any, 'span', result);
    expect(result).toHaveLength(3);
  });

  it('skips string nodes without error', () => {
    const nodes: any[] = ['text content', el('span'), 'more text'];
    const result: HTMLElementMock[] = [];
    collectMatches(nodes, 'span', result);
    expect(result).toHaveLength(1);
  });

  it('returns empty result when no matches found', () => {
    const root = el('div');
    root.appendChild(el('section'));
    root.appendChild(el('article'));

    const result: HTMLElementMock[] = [];
    collectMatches(root.childrenList as any, 'span', result);
    expect(result).toHaveLength(0);
  });

  it('works on empty list', () => {
    const result: HTMLElementMock[] = [];
    collectMatches([], 'div', result);
    expect(result).toHaveLength(0);
  });

  it('collects by class selector recursively', () => {
    const root = el('div');
    const target = el('p');
    target.classList.add('highlight');
    root.appendChild(el('section'));
    root.appendChild(target);

    const result: HTMLElementMock[] = [];
    collectMatches(root.childrenList as any, '.highlight', result);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(target);
  });

  it('collects by attribute selector recursively', () => {
    const root = el('ul');
    const li1 = el('li');
    const li2 = el('li');
    li2.setAttribute('aria-selected', 'true');
    root.appendChild(li1);
    root.appendChild(li2);

    const result: HTMLElementMock[] = [];
    collectMatches(root.childrenList as any, '[aria-selected]', result);
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(li2);
  });
});

describe('matchSelector — compound selectors', () => {
  /**
   * A `<slot name="footer">`, the shape that broke server rendering for r-card.
   *
   * @returns The node.
   */
  function footerSlot(): HTMLElementMock {
    const node = el('slot');
    node.setAttribute('name', 'footer');
    return node;
  }

  it('matches a tag qualified by an attribute', () => {
    expect(matchSelector(footerSlot(), 'slot[name="footer"]')).toBe(true);
    expect(matchSelector(footerSlot(), "slot[name='footer']")).toBe(true);
  });

  it('rejects when the tag matches but the attribute does not', () => {
    expect(matchSelector(footerSlot(), 'slot[name="header"]')).toBe(false);
  });

  it('rejects when the attribute matches but the tag does not', () => {
    expect(matchSelector(footerSlot(), 'div[name="footer"]')).toBe(false);
  });

  it('requires every qualifier of a longer compound to match', () => {
    const node = el('div');
    node.classList.add('row');
    node.setAttribute('id', 'first');
    node.setAttribute('data-kind', 'a');

    expect(matchSelector(node, 'div.row#first')).toBe(true);
    expect(matchSelector(node, '.row[data-kind="a"]')).toBe(true);
    expect(matchSelector(node, 'div.row#second')).toBe(false);
    expect(matchSelector(node, 'span.row')).toBe(false);
    expect(matchSelector(node, '.row[data-kind="b"]')).toBe(false);
  });

  it('finds nothing for a selector this engine does not implement', () => {
    // Matching on the part it understood would return an arbitrary node; a combinator or a
    // pseudo-class it cannot evaluate should match nothing at all.
    expect(matchSelector(footerSlot(), 'div > slot')).toBe(false);
    expect(matchSelector(footerSlot(), 'div slot')).toBe(false);
    expect(matchSelector(footerSlot(), 'slot:first-child')).toBe(false);
  });

  it('collects compound matches from a tree', () => {
    const root = el('div');
    const wanted = footerSlot();
    const other = el('slot');
    root.childrenList.push(other as never, wanted as never);

    const result: HTMLElementMock[] = [];
    collectMatches(root.childrenList as never, 'slot[name="footer"]', result);
    expect(result).toEqual([wanted]);
  });
});

describe('matchSelector — pathological input', () => {
  it('stays linear on an unterminated attribute selector', () => {
    // The obvious regex for the attribute form backtracks across every position here, which
    // is polynomial in the selector's length. querySelector is a library entry point, so
    // the caller chooses what reaches it.
    const node = el('div');
    const started = Date.now();
    for (let length = 1000; length <= 20000; length *= 2) {
      expect(matchSelector(node, '['.repeat(length))).toBe(false);
    }
    expect(Date.now() - started).toBeLessThan(1000);
  });

  it('rejects an unterminated attribute rather than matching the tag before it', () => {
    expect(matchSelector(el('div'), 'div[name="x"')).toBe(false);
  });

  it('rejects a qualifier that qualifies nothing', () => {
    const node = el('div');
    node.classList.add('row');
    expect(matchSelector(node, 'div.')).toBe(false);
    expect(matchSelector(node, '.row.')).toBe(false);
    expect(matchSelector(node, '#')).toBe(false);
  });
});
