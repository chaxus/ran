import { describe, expect, it, beforeEach, beforeAll, vi } from 'vitest';
import OptionClass from '@/components/select/option/index';

// jsdom's document.createElement doesn't upgrade custom elements when defined after-the-fact,
// but its HTML parser (innerHTML) does. Register first, then use innerHTML to create elements.
beforeAll(() => {
  if (OptionClass && !customElements.get('r-option')) {
    customElements.define('r-option', OptionClass as CustomElementConstructor);
  }
});

const createOption = (attrs = '') => {
  const container = document.createElement('div');
  container.innerHTML = `<r-option ${attrs}>Label</r-option>`;
  document.body.appendChild(container);
  return container.firstElementChild as any;
};

describe('r-option contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders shadow DOM with option structure', () => {
    const opt = createOption();
    const shadow = opt._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();
    expect(shadow.querySelector('.ran-select-dropdown-option')).not.toBeNull();
    expect(shadow.querySelector('.ran-select-dropdown-option-content')).not.toBeNull();
    expect(shadow.querySelector('slot')).not.toBeNull();
  });

  it('has ran-option class on host', () => {
    const opt = createOption();
    expect(opt.classList.contains('ran-option')).toBe(true);
  });

  it('value getter returns attribute value', () => {
    const opt = createOption('value="test-val"');
    expect(opt.value).toBe('test-val');
  });

  it('value setter updates attribute', () => {
    const opt = createOption();
    opt.value = 'my-value';
    expect(opt.getAttribute('value')).toBe('my-value');
  });

  it('value setter with null sets empty string', () => {
    const opt = createOption();
    opt.value = null;
    expect(opt.getAttribute('value')).toBe('');
  });

  it('sheet getter returns attribute', () => {
    const opt = createOption('sheet=".ran-select-dropdown-option { color: red; }"');
    expect(opt.sheet).toBe('.ran-select-dropdown-option { color: red; }');
  });

  it('sheet setter updates attribute', () => {
    const opt = createOption();
    opt.sheet = '.ran-select-dropdown-option { color: blue; }';
    expect(opt.getAttribute('sheet')).toBe('.ran-select-dropdown-option { color: blue; }');
  });

  it('disabled getter returns false by default', () => {
    const opt = createOption();
    expect(opt.disabled).toBe(false);
  });

  it('disabled setter with truthy value sets attribute', () => {
    const opt = createOption();
    opt.disabled = 'true';
    expect(opt.hasAttribute('disabled')).toBe(true);
  });

  it('disabled setter with false removes attribute', () => {
    const opt = createOption('disabled=""');
    opt.disabled = 'false';
    expect(opt.hasAttribute('disabled')).toBe(false);
  });

  it('attributeChangedCallback on disabled=false adds disabled to inner option', () => {
    const opt = createOption();
    opt.attributeChangedCallback('disabled', null, 'false');
    expect(opt._option.hasAttribute('disabled')).toBe(true);
  });

  it('attributeChangedCallback on disabled=truthy removes disabled from inner option', () => {
    const opt = createOption();
    opt._option.setAttribute('disabled', '');
    opt.attributeChangedCallback('disabled', null, 'true');
    expect(opt._option.hasAttribute('disabled')).toBe(false);
  });

  it('attributeChangedCallback on sheet change calls handlerExternalCss', () => {
    const opt = createOption();
    const spy = vi.spyOn(opt, 'handlerExternalCss');
    opt.setAttribute('sheet', '.ran-select-dropdown-option { color: green; }');
    expect(spy).toHaveBeenCalled();
  });

  it('attributeChangedCallback skips when old === new for sheet', () => {
    const opt = createOption();
    const spy = vi.spyOn(opt, 'handlerExternalCss');
    opt.attributeChangedCallback('sheet', 'same', 'same');
    expect(spy).not.toHaveBeenCalled();
  });
});
