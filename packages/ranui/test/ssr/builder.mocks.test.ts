import { describe, it, expect } from 'vitest';
import { HTMLElementMock, DocumentFragmentMock, ShadowRootMock } from '@/utils/builder/mocks';

// ---------------------------------------------------------------------------
// HTMLElementMock
// ---------------------------------------------------------------------------

describe('HTMLElementMock — construction', () => {
  it('lowercases tagName', () => {
    expect(new HTMLElementMock('DIV').tagName).toBe('div');
    expect(new HTMLElementMock('SPAN').tagName).toBe('span');
  });

  it('defaults tagName to div', () => {
    expect(new HTMLElementMock().tagName).toBe('div');
  });

  it('creates content DocumentFragmentMock for template tag', () => {
    const tpl = new HTMLElementMock('template');
    expect(tpl.content).toBeInstanceOf(DocumentFragmentMock);
  });

  it('does not create content for non-template tags', () => {
    expect(new HTMLElementMock('div').content).toBeUndefined();
  });
});

describe('HTMLElementMock — attributes', () => {
  it('setAttribute and getAttribute round-trip', () => {
    const el = new HTMLElementMock('div');
    el.setAttribute('data-foo', 'bar');
    expect(el.getAttribute('data-foo')).toBe('bar');
  });

  it('getAttribute returns null for missing attribute', () => {
    expect(new HTMLElementMock('div').getAttribute('missing')).toBeNull();
  });

  it('hasAttribute returns true when set', () => {
    const el = new HTMLElementMock('div');
    el.setAttribute('aria-hidden', 'true');
    expect(el.hasAttribute('aria-hidden')).toBe(true);
  });

  it('hasAttribute returns false when not set', () => {
    expect(new HTMLElementMock('div').hasAttribute('nope')).toBe(false);
  });

  it('removeAttribute removes the attribute', () => {
    const el = new HTMLElementMock('div');
    el.setAttribute('id', 'x');
    el.removeAttribute('id');
    expect(el.hasAttribute('id')).toBe(false);
    expect(el.getAttribute('id')).toBeNull();
  });

  it('overwriting setAttribute replaces the value', () => {
    const el = new HTMLElementMock('div');
    el.setAttribute('role', 'button');
    el.setAttribute('role', 'listbox');
    expect(el.getAttribute('role')).toBe('listbox');
  });
});

describe('HTMLElementMock — classList', () => {
  it('add sets class attribute', () => {
    const el = new HTMLElementMock('div');
    el.classList.add('foo');
    expect(el.getAttribute('class')).toBe('foo');
  });

  it('add multiple classes deduplicates', () => {
    const el = new HTMLElementMock('div');
    el.classList.add('foo');
    el.classList.add('foo', 'bar');
    const classes = (el.getAttribute('class') || '').split(' ').filter(Boolean);
    expect(classes).toEqual(['foo', 'bar']);
  });

  it('remove removes a class', () => {
    const el = new HTMLElementMock('div');
    el.classList.add('foo', 'bar', 'baz');
    el.classList.remove('bar');
    expect(el.getAttribute('class')).not.toContain('bar');
    expect(el.getAttribute('class')).toContain('foo');
    expect(el.getAttribute('class')).toContain('baz');
  });

  it('contains returns true for existing class', () => {
    const el = new HTMLElementMock('div');
    el.classList.add('active');
    expect(el.classList.contains('active')).toBe(true);
  });

  it('contains returns false for missing class', () => {
    const el = new HTMLElementMock('div');
    expect(el.classList.contains('missing')).toBe(false);
  });

  it('toggle adds a class when absent', () => {
    const el = new HTMLElementMock('div');
    el.classList.toggle('on');
    expect(el.classList.contains('on')).toBe(true);
  });

  it('toggle removes a class when present', () => {
    const el = new HTMLElementMock('div');
    el.classList.add('on');
    el.classList.toggle('on');
    expect(el.classList.contains('on')).toBe(false);
  });
});

describe('HTMLElementMock — style', () => {
  it('setProperty stores kebab-case property', () => {
    const el = new HTMLElementMock('div');
    el.style.setProperty('background-color', 'red');
    expect(el.inlineStyles.get('background-color')).toBe('red');
  });

  it('setProperty converts camelCase to kebab-case', () => {
    const el = new HTMLElementMock('div');
    el.style.setProperty('backgroundColor', 'blue');
    expect(el.inlineStyles.get('background-color')).toBe('blue');
  });

  it('setProperty preserves CSS custom properties', () => {
    const el = new HTMLElementMock('div');
    el.style.setProperty('--my-var', '10px');
    expect(el.inlineStyles.get('--my-var')).toBe('10px');
  });

  it('removeProperty deletes a property', () => {
    const el = new HTMLElementMock('div');
    el.style.setProperty('color', 'red');
    el.style.removeProperty('color');
    expect(el.inlineStyles.has('color')).toBe(false);
  });
});

describe('HTMLElementMock — children', () => {
  it('appendChild adds a child element', () => {
    const parent = new HTMLElementMock('div');
    const child = new HTMLElementMock('span');
    parent.appendChild(child);
    expect(parent.childrenList).toHaveLength(1);
    expect(parent.childrenList[0]).toBe(child);
  });

  it('appendChild adds string node', () => {
    const parent = new HTMLElementMock('div');
    parent.appendChild('hello');
    expect(parent.childrenList[0]).toBe('hello');
  });

  it('appendChild returns the node', () => {
    const parent = new HTMLElementMock('div');
    const child = new HTMLElementMock('span');
    expect(parent.appendChild(child)).toBe(child);
  });
});

describe('HTMLElementMock — textContent', () => {
  it('textContent is null by default', () => {
    expect(new HTMLElementMock('div').textContent).toBeNull();
  });

  it('textContent can be assigned', () => {
    const el = new HTMLElementMock('p');
    el.textContent = 'hello world';
    expect(el.textContent).toBe('hello world');
  });
});

describe('HTMLElementMock — innerHTML / template content', () => {
  it('innerHTML setter stores raw string', () => {
    const el = new HTMLElementMock('div');
    el.innerHTML = '<span>test</span>';
    expect(el.innerHTML).toBe('<span>test</span>');
  });

  it('setting innerHTML on a template element populates content.childrenList', () => {
    const tpl = new HTMLElementMock('template');
    tpl.innerHTML = '<span>slot</span>';
    expect(tpl.content!.childrenList).toContain('<span>slot</span>');
  });
});

describe('HTMLElementMock — attachShadow', () => {
  it('attachShadow creates and returns a ShadowRootMock', () => {
    const el = new HTMLElementMock('div');
    const shadow = el.attachShadow({ mode: 'open' });
    expect(shadow).toBeInstanceOf(ShadowRootMock);
    expect(el.shadowRoot).toBe(shadow);
  });

  it('stores shadow options', () => {
    const el = new HTMLElementMock('div');
    const shadow = el.attachShadow({ mode: 'closed' }) as unknown as ShadowRootMock;
    expect(shadow.options.mode).toBe('closed');
  });
});

describe('HTMLElementMock — querySelector / querySelectorAll', () => {
  it('querySelector returns first matching descendant', () => {
    const root = new HTMLElementMock('div');
    const span = new HTMLElementMock('span');
    root.appendChild(span);
    expect(root.querySelector('span')).toBe(span);
  });

  it('querySelector returns null when not found', () => {
    expect(new HTMLElementMock('div').querySelector('span')).toBeNull();
  });

  it('querySelectorAll returns all matching descendants', () => {
    const root = new HTMLElementMock('ul');
    const li1 = new HTMLElementMock('li');
    const li2 = new HTMLElementMock('li');
    root.appendChild(li1);
    root.appendChild(li2);
    expect(root.querySelectorAll('li')).toHaveLength(2);
  });
});

describe('HTMLElementMock — events', () => {
  it('addEventListener and dispatchEvent triggers the listener', () => {
    const el = new HTMLElementMock('button');
    let called = false;
    el.addEventListener('click', () => {
      called = true;
    });
    el.dispatchEvent(new Event('click'));
    expect(called).toBe(true);
  });

  it('removeEventListener stops the listener being called', () => {
    const el = new HTMLElementMock('button');
    let count = 0;
    const handler = () => {
      count++;
    };
    el.addEventListener('click', handler);
    el.removeEventListener('click', handler);
    el.dispatchEvent(new Event('click'));
    expect(count).toBe(0);
  });

  it('dispatchEvent returns true when no listeners', () => {
    const el = new HTMLElementMock('div');
    expect(el.dispatchEvent(new Event('custom'))).toBe(true);
  });

  it('supports EventListenerObject (handleEvent) interface', () => {
    const el = new HTMLElementMock('div');
    let called = false;
    const listener = {
      handleEvent: () => {
        called = true;
      },
    };
    el.addEventListener('focus', listener);
    el.dispatchEvent(new Event('focus'));
    expect(called).toBe(true);
  });

  it('multiple listeners on same event are all called', () => {
    const el = new HTMLElementMock('div');
    let count = 0;
    el.addEventListener('click', () => {
      count++;
    });
    el.addEventListener('click', () => {
      count++;
    });
    el.dispatchEvent(new Event('click'));
    expect(count).toBe(2);
  });
});

describe('HTMLElementMock — serialize', () => {
  it('serializes a simple element', () => {
    const el = new HTMLElementMock('div');
    expect(el.serialize()).toBe('<div></div>');
  });

  it('serializes attributes', () => {
    const el = new HTMLElementMock('div');
    el.setAttribute('id', 'main');
    el.setAttribute('class', 'box');
    const html = el.serialize();
    expect(html).toContain('id="main"');
    expect(html).toContain('class="box"');
  });

  it('serializes inline styles', () => {
    const el = new HTMLElementMock('div');
    el.style.setProperty('color', 'red');
    expect(el.serialize()).toContain('style="color:red"');
  });

  it('escapes attribute values', () => {
    const el = new HTMLElementMock('div');
    el.setAttribute('data-val', '<"evil">');
    const html = el.serialize();
    expect(html).toContain('&lt;&quot;evil&quot;&gt;');
    expect(html).not.toContain('<"evil">');
  });

  it('serializes text content (escaped)', () => {
    const el = new HTMLElementMock('p');
    el.textContent = 'hello & <world>';
    expect(el.serialize()).toBe('<p>hello &amp; &lt;world&gt;</p>');
  });

  it('serializes child elements recursively', () => {
    const parent = new HTMLElementMock('div');
    const child = new HTMLElementMock('span');
    child.textContent = 'hi';
    parent.appendChild(child);
    expect(parent.serialize()).toBe('<div><span>hi</span></div>');
  });

  it('serializes string children (escaped)', () => {
    const el = new HTMLElementMock('div');
    el.appendChild('a & b');
    expect(el.serialize()).toBe('<div>a &amp; b</div>');
  });

  it('renders self-closing tags without closing tag', () => {
    expect(new HTMLElementMock('input').serialize()).toBe('<input />');
    expect(new HTMLElementMock('br').serialize()).toBe('<br />');
    expect(new HTMLElementMock('img').serialize()).toBe('<img />');
    expect(new HTMLElementMock('hr').serialize()).toBe('<hr />');
    expect(new HTMLElementMock('meta').serialize()).toBe('<meta />');
    expect(new HTMLElementMock('link').serialize()).toBe('<link />');
  });

  it('self-closing tag with content renders normally', () => {
    const input = new HTMLElementMock('input');
    input.textContent = 'text';
    // textContent is not null, so it's not self-closing
    expect(input.serialize()).toBe('<input>text</input>');
  });

  it('serializes shadow root as DSD template', () => {
    const el = new HTMLElementMock('div');
    const shadow = el.attachShadow({ mode: 'open' }) as unknown as ShadowRootMock;
    const inner = new HTMLElementMock('span');
    inner.textContent = 'shadow';
    shadow.appendChild(inner);
    const html = el.serialize();
    expect(html).toContain('<template shadowrootmode="open">');
    expect(html).toContain('<span>shadow</span>');
    expect(html).toContain('</template>');
  });

  it('tagNameOverride replaces tagName in output', () => {
    const el = new HTMLElementMock('div');
    expect(el.serialize('section')).toBe('<section></section>');
  });

  it('serializes innerHTML verbatim when set', () => {
    const el = new HTMLElementMock('div');
    el.innerHTML = '<b>raw</b>';
    expect(el.serialize()).toBe('<div><b>raw</b></div>');
  });
});

// ---------------------------------------------------------------------------
// DocumentFragmentMock
// ---------------------------------------------------------------------------

describe('DocumentFragmentMock', () => {
  it('appendChild adds children', () => {
    const frag = new DocumentFragmentMock();
    const el = new HTMLElementMock('span');
    frag.appendChild(el);
    expect(frag.childrenList).toHaveLength(1);
    expect(frag.childrenList[0]).toBe(el);
  });

  it('appendChild returns the node', () => {
    const frag = new DocumentFragmentMock();
    const el = new HTMLElementMock('div');
    expect(frag.appendChild(el)).toBe(el);
  });

  it('serialize produces concatenated children HTML', () => {
    const frag = new DocumentFragmentMock();
    const s = new HTMLElementMock('span');
    s.textContent = 'text';
    frag.appendChild(s);
    expect(frag.serialize()).toBe('<span>text</span>');
  });

  it('serialize escapes string children', () => {
    const frag = new DocumentFragmentMock();
    frag.appendChild('a & b' as any);
    expect(frag.serialize()).toBe('a &amp; b');
  });

  it('querySelector finds a descendant', () => {
    const frag = new DocumentFragmentMock();
    const el = new HTMLElementMock('p');
    frag.appendChild(el);
    expect(frag.querySelector('p')).toBe(el);
  });

  it('querySelector returns null when not found', () => {
    expect(new DocumentFragmentMock().querySelector('div')).toBeNull();
  });

  it('querySelectorAll returns all matches', () => {
    const frag = new DocumentFragmentMock();
    frag.appendChild(new HTMLElementMock('li'));
    frag.appendChild(new HTMLElementMock('li'));
    expect(frag.querySelectorAll('li')).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// ShadowRootMock
// ---------------------------------------------------------------------------

describe('ShadowRootMock', () => {
  function makeShadow(mode: 'open' | 'closed' = 'open', delegatesFocus = false): ShadowRootMock {
    const host = new HTMLElementMock('div');
    return new ShadowRootMock(host, { mode, delegatesFocus });
  }

  it('stores host and options', () => {
    const host = new HTMLElementMock('div');
    const shadow = new ShadowRootMock(host, { mode: 'open' });
    expect(shadow.host).toBe(host);
    expect(shadow.options.mode).toBe('open');
  });

  it('appendChild adds child', () => {
    const shadow = makeShadow();
    const el = new HTMLElementMock('span');
    shadow.appendChild(el);
    expect(shadow.childrenList).toHaveLength(1);
  });

  it('querySelector finds a descendant', () => {
    const shadow = makeShadow();
    const el = new HTMLElementMock('button');
    shadow.appendChild(el);
    expect(shadow.querySelector('button')).toBe(el);
  });

  it('querySelectorAll returns all matches', () => {
    const shadow = makeShadow();
    shadow.appendChild(new HTMLElementMock('li'));
    shadow.appendChild(new HTMLElementMock('li'));
    expect(shadow.querySelectorAll('li')).toHaveLength(2);
  });

  it('serialize wraps content in DSD template (open mode)', () => {
    const shadow = makeShadow('open');
    const html = shadow.serialize();
    expect(html).toContain('<template shadowrootmode="open">');
    expect(html).toContain('</template>');
  });

  it('serialize wraps content in DSD template (closed mode)', () => {
    const shadow = makeShadow('closed');
    expect(shadow.serialize()).toContain('shadowrootmode="closed"');
  });

  it('serialize includes shadowrootdelegatesfocus when set', () => {
    const shadow = makeShadow('open', true);
    expect(shadow.serialize()).toContain('shadowrootdelegatesfocus');
  });

  it('serialize does not include delegatesfocus when false', () => {
    const shadow = makeShadow('open', false);
    expect(shadow.serialize()).not.toContain('shadowrootdelegatesfocus');
  });

  it('serialize includes adoptedStyleSheets as style tags', () => {
    const shadow = makeShadow();
    shadow.adoptedStyleSheets.push(':host { display: block; }');
    const html = shadow.serialize();
    expect(html).toContain('<style>');
    expect(html).toContain(':host { display: block; }');
  });

  it('serialize escapes style content', () => {
    const shadow = makeShadow();
    shadow.adoptedStyleSheets.push('/* a & b */');
    expect(shadow.serialize()).toContain('/* a &amp; b */');
  });

  it('serialize includes child elements', () => {
    const shadow = makeShadow();
    const span = new HTMLElementMock('span');
    span.textContent = 'inner';
    shadow.appendChild(span);
    expect(shadow.serialize()).toContain('<span>inner</span>');
  });

  it('serialize escapes string children', () => {
    const shadow = makeShadow();
    shadow.appendChild('raw & text' as any);
    expect(shadow.serialize()).toContain('raw &amp; text');
  });
});
