import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Input } from '@/components/input';
import '@/components/input';

describe('r-input contract', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders input wrapper and inner input correctly via ElementBuilder', () => {
    const input = document.createElement('r-input');
    document.body.appendChild(input);

    const shadow = (input as any)._shadowDom as ShadowRoot;
    expect(shadow).toBeTruthy();

    const wrapper = shadow.querySelector('.ran-input') as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.getAttribute('part')).toBe('input');

    const innerInput = shadow.querySelector('.ran-input-content') as HTMLInputElement;
    expect(innerInput).toBeTruthy();
    expect(innerInput.getAttribute('part')).toBe('content');
  });

  it('reflects value property to inner input', () => {
    const input = document.createElement('r-input');
    document.body.appendChild(input);

    const innerInput = (input as any)._shadowDom.querySelector('.ran-input-content') as HTMLInputElement;
    input.setAttribute('value', 'hello world');

    expect((input as any).value).toBe('hello world');
    expect(innerInput.value).toBe('hello world');
  });

  it('generates label dynamically when label attribute is set', () => {
    const input = document.createElement('r-input');
    document.body.appendChild(input);

    input.setAttribute('label', 'Username');

    const wrapper = (input as any)._shadowDom.querySelector('.ran-input') as HTMLElement;
    const labelEl = wrapper.querySelector('.ran-input-label') as HTMLLabelElement;

    expect(labelEl).toBeTruthy();
    expect(labelEl.innerHTML).toBe('Username');
    expect(labelEl.getAttribute('part')).toBe('label');
  });

  it('updates label text when set multiple times', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);

    input.setAttribute('label', 'First');
    input.setAttribute('label', 'Second');

    const wrapper = (input as any)._input as HTMLElement;
    const labelEl = wrapper.querySelector('.ran-input-label') as HTMLLabelElement;
    expect(labelEl.innerHTML).toBe('Second');
  });

  it('disabled property propagates to inner elements', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);

    input.disabled = 'true';
    expect((input as any)._input.hasAttribute('disabled')).toBe(true);
    expect((input as any)._inputContent.hasAttribute('disabled')).toBe(true);

    input.disabled = 'false';
    expect((input as any)._input.hasAttribute('disabled')).toBe(false);
    expect((input as any)._inputContent.hasAttribute('disabled')).toBe(false);
  });

  it('placeholder is forwarded to inner input element', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);

    input.setAttribute('placeholder', 'Enter text...');
    expect((input as any)._inputContent.getAttribute('placeholder')).toBe('Enter text...');
  });

  it('type attribute is forwarded to inner input element via connectedCallback', () => {
    const input = document.createElement('r-input') as Input;
    input.setAttribute('type', 'password'); // set BEFORE connecting so connectedCallback forwards it
    document.body.appendChild(input);

    expect((input as any)._inputContent.getAttribute('type')).toBe('password');
  });

  it('status attribute propagates to wrapper', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);

    input.setAttribute('status', 'error');
    expect((input as any)._input.getAttribute('status')).toBe('error');
  });

  it('fires input on each keystroke and change only on native change (blur)', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);

    const inputEvents: string[] = [];
    const changeEvents: string[] = [];
    input.addEventListener('input', (e: Event) => inputEvents.push((e as CustomEvent).detail.value));
    input.addEventListener('change', (e: Event) => changeEvents.push((e as CustomEvent).detail.value));

    const innerInput = (input as any)._inputContent as HTMLInputElement;
    Object.defineProperty(innerInput, 'value', { value: 'hello', writable: true, configurable: true });

    const event = new InputEvent('input', { data: 'hello' });
    Object.defineProperty(event, 'target', { value: innerInput });
    innerInput.dispatchEvent(event);

    // input fires per keystroke; change must NOT (native semantics)
    expect(inputEvents.length).toBeGreaterThan(0);
    expect(changeEvents.length).toBe(0);

    // change forwards only when the native input fires its `change` (on blur/commit)
    innerInput.dispatchEvent(new Event('change'));
    expect(changeEvents.length).toBe(1);
  });

  it('min/max/step only apply when type is number', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);

    input.type = 'text';
    input.min = '0';
    input.max = '100';
    input.step = '1';
    expect(input.getAttribute('min')).toBeNull();
    expect(input.getAttribute('max')).toBeNull();
    expect(input.getAttribute('step')).toBeNull();

    input.type = 'number';
    input.min = '0';
    input.max = '100';
    input.step = '1';
    expect(input.getAttribute('min')).toBe('0');
    expect(input.getAttribute('max')).toBe('100');
    expect(input.getAttribute('step')).toBe('1');
  });

  it('required property getter and setter', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);

    input.required = 'true';
    expect(input.hasAttribute('required')).toBe(true);

    input.required = 'false';
    expect(input.hasAttribute('required')).toBe(false);
  });

  it('placeholder getter and setter use property accessor', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);

    input.placeholder = 'Type here';
    expect(input.placeholder).toBe('Type here');

    input.placeholder = '';
    expect(input.hasAttribute('placeholder')).toBe(false);
  });

  it('name getter and setter', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.name = 'email';
    expect(input.name).toBe('email');
  });

  it('icon getter and setter', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.icon = 'search';
    expect(input.icon).toBe('search');
    input.icon = '';
    expect(input.hasAttribute('icon')).toBe(false);
  });

  it('prefix getter and setter', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.prefix = 'star';
    expect(input.prefix).toBe('star');
    input.prefix = '';
    expect(input.hasAttribute('prefix')).toBe(false);
  });

  it('suffix getter and setter', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.suffix = 'eye';
    expect(input.suffix).toBe('eye');
    input.suffix = '';
    expect(input.hasAttribute('suffix')).toBe(false);
  });

  it('type getter and setter', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.type = 'email';
    expect(input.type).toBe('email');
    input.type = '';
    expect(input.hasAttribute('type')).toBe(false);
  });

  it('sheet getter and setter', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.sheet = '.ran-input { color: red; }';
    expect(input.sheet).toBe('.ran-input { color: red; }');
  });

  it('status setter with empty string removes attribute', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.setAttribute('status', 'error');
    input.status = '';
    expect(input.hasAttribute('status')).toBe(false);
    expect((input as any)._input.hasAttribute('status')).toBe(false);
  });

  it('label getter and setter', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.label = 'My Label';
    expect(input.label).toBe('My Label');
  });

  it('required getter reflects the attribute as a boolean', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    expect(input.required).toBe(false);
    input.required = 'true';
    expect(input.required).toBe(true);
  });

  it('disabled getter returns a boolean', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    expect(input.disabled).toBe(false);
    input.disabled = true;
    expect(input.disabled).toBe(true);
  });

  it('min getter returns attribute', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.type = 'number';
    input.min = '5';
    expect(input.min).toBe('5');
  });

  it('max getter returns attribute', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.type = 'number';
    input.max = '100';
    expect(input.max).toBe('100');
  });

  it('step getter returns attribute', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.type = 'number';
    input.step = '2';
    expect(input.step).toBe('2');
  });

  it('value setter with disabled removes attribute', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.disabled = 'true';
    input.value = 'blocked';
    expect(input.hasAttribute('value')).toBe(false);
  });

  it('value setter with empty string removes attribute', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);
    input.setAttribute('value', 'hello');
    input.value = '';
    expect(input.hasAttribute('value')).toBe(false);
  });

  it('connectedCallback initializes value, status, and disabled when set before connect', () => {
    const input = document.createElement('r-input') as Input;
    input.setAttribute('value', 'initial');
    input.setAttribute('status', 'error');
    input.setAttribute('disabled', '');
    document.body.appendChild(input);

    expect((input as any)._inputContent.value).toBe('initial');
    expect((input as any)._input.getAttribute('status')).toBe('error');
    expect((input as any)._input.hasAttribute('disabled')).toBe(true);
    expect((input as any)._inputContent.hasAttribute('disabled')).toBe(true);
  });

  it('listenType with empty value removes type and numeric attrs from inner input', () => {
    const input = document.createElement('r-input') as Input;
    input.setAttribute('type', 'number');
    document.body.appendChild(input);
    input.setAttribute('min', '0');
    input.setAttribute('max', '10');

    (input as any).listenType('type', '');
    expect((input as any)._inputContent.hasAttribute('type')).toBe(false);
  });

  it('label attributeChangedCallback removes label when attribute is removed', () => {
    const input = document.createElement('r-input') as Input;
    document.body.appendChild(input);

    input.setAttribute('label', 'Initial');
    expect((input as any)._label).toBeTruthy();

    input.removeAttribute('label');
    expect((input as any)._label).toBeUndefined();
    const wrapper = (input as any)._input as HTMLElement;
    const labelEl = wrapper.querySelector('.ran-input-label');
    expect(labelEl).toBeNull();
  });

  it('status setter with truthy value sets attributes', () => {
    const input = document.createElement('r-input') as any;
    document.body.appendChild(input);

    input.status = 'error';
    expect(input.getAttribute('status')).toBe('error');
    expect(input._input.getAttribute('status')).toBe('error');
  });

  it('status setter with falsy value removes attributes', () => {
    const input = document.createElement('r-input') as any;
    document.body.appendChild(input);

    input.status = 'error';
    input.status = '';
    expect(input.hasAttribute('status')).toBe(false);
  });

  it('listenType with truthy value sets type attribute on inputContent', () => {
    const input = document.createElement('r-input') as any;
    document.body.appendChild(input);

    input.listenType('type', 'email');
    expect(input._inputContent.getAttribute('type')).toBe('email');
  });

  it('associates a rendered label with the control via for/id', () => {
    const input = document.createElement('r-input') as any;
    input.setAttribute('label', 'Email address');
    document.body.appendChild(input);

    const id = input._inputContent.id;
    expect(id).toBeTruthy();
    expect(input._label).toBeTruthy();
    expect(input._label.htmlFor).toBe(id);
  });

  it('is form-associated and relays its value through ElementInternals', () => {
    expect((Input as any).formAssociated).toBe(true);

    const input = document.createElement('r-input') as any;
    document.body.appendChild(input);
    expect(input._internals).toBeTruthy();

    // jsdom's ElementInternals omits setFormValue, so stub it to observe calls.
    const setFormValue = vi.fn();
    input._internals.setFormValue = setFormValue;

    input.value = 'hello';
    expect(setFormValue).toHaveBeenLastCalledWith('hello');
    input.value = '';
    expect(setFormValue).toHaveBeenLastCalledWith('');
  });
});
