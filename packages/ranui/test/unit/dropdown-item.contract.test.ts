import { describe, expect, it, beforeEach, vi } from 'vitest';
import '@/components/select/dropdown-item';

describe('r-dropdown-item contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  const mount = () => {
    const el = document.createElement('r-dropdown-item') as any;
    document.body.appendChild(el);
    return el;
  };

  it('renders shadow DOM with correct structure', () => {
    const el = mount();
    const shadow = el._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    expect(shadow.querySelector('.ranui-dropdown-option-item')).not.toBeNull();
    expect(shadow.querySelector('.ranui-dropdown-option-item-content')).not.toBeNull();
    expect(shadow.querySelector('slot')).not.toBeNull();
  });

  it('value getter returns empty string by default', () => {
    const el = mount();
    expect(el.value).toBe('');
  });

  it('value setter updates attribute when not disabled', () => {
    const el = mount();
    el.value = 'item-1';
    expect(el.getAttribute('value')).toBe('item-1');
  });

  it('value setter removes attribute when falsy', () => {
    const el = mount();
    el.setAttribute('value', 'x');
    el.value = '';
    expect(el.hasAttribute('value')).toBe(false);
  });

  it('value setter removes attribute when disabled', () => {
    const el = mount();
    el.setAttribute('disabled', '');
    el.value = 'should-not-set';
    expect(el.hasAttribute('value')).toBe(false);
  });

  it('active getter returns empty string when not set', () => {
    const el = mount();
    expect(el.active).toBe('');
  });

  it('active setter sets attribute', () => {
    const el = mount();
    el.active = 'some-val';
    expect(el.getAttribute('active')).toBe('some-val');
  });

  it('active setter removes attribute when falsy', () => {
    const el = mount();
    el.setAttribute('active', 'x');
    el.active = '';
    expect(el.hasAttribute('active')).toBe(false);
  });

  it('title getter returns empty string when not set', () => {
    const el = mount();
    expect(el.title).toBe('');
  });

  it('title setter sets attribute', () => {
    const el = mount();
    el.title = 'My Title';
    expect(el.getAttribute('title')).toBe('My Title');
  });

  it('title setter removes attribute when falsy', () => {
    const el = mount();
    el.setAttribute('title', 'x');
    el.title = '';
    expect(el.hasAttribute('title')).toBe(false);
  });

  it('sheet getter returns empty string when not set', () => {
    const el = mount();
    expect(el.sheet).toBe('');
  });

  it('sheet setter updates attribute', () => {
    const el = mount();
    el.sheet = '.ranui-dropdown-option-item { color: red; }';
    expect(el.getAttribute('sheet')).toBe('.ranui-dropdown-option-item { color: red; }');
  });

  it('connectedCallback calls handlerExternalCss', () => {
    const el = document.createElement('r-dropdown-item') as any;
    const spy = vi.spyOn(el, 'handlerExternalCss');
    document.body.appendChild(el);
    expect(spy).toHaveBeenCalled();
  });

  it('connectedCallback adds active class when active attribute is set', () => {
    const el = document.createElement('r-dropdown-item') as any;
    el.setAttribute('active', 'k1');
    document.body.appendChild(el);
    expect(el.ionDropdownItem.classList.contains('ranui-dropdown-option-active')).toBe(true);
  });

  it('attributeChangedCallback on active adds active class', () => {
    const el = mount();
    el.attributeChangedCallback('active', null, 'some-key');
    expect(el.ionDropdownItem.classList.contains('ranui-dropdown-option-active')).toBe(true);
  });

  it('attributeChangedCallback on active removal removes active class', () => {
    const el = mount();
    el.ionDropdownItem.classList.add('ranui-dropdown-option-active');
    el.attributeChangedCallback('active', 'k', null);
    expect(el.ionDropdownItem.classList.contains('ranui-dropdown-option-active')).toBe(false);
  });

  it('attributeChangedCallback on sheet calls handlerExternalCss', () => {
    const el = mount();
    const spy = vi.spyOn(el, 'handlerExternalCss');
    el.setAttribute('sheet', 'div {}');
    expect(spy).toHaveBeenCalled();
  });
});
